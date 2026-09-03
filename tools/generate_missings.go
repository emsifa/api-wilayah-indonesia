// generate_missings.go: generate api/missings.json — list wilayah missing path OR lat/lng
//
// Usage:
//   go run ./tools generate-missings [-out api] [-paths api/paths] [-v]
//
// Scans all wilayah JSON endpoints after has_path patching:
//   api/provinces.json, api/provinces/*.json, api/regencies/*.json,
//   api/districts/*.json, api/villages/*.json
//
// Each entry is evaluated:
//   has_path   = api/paths/{id}.json exists
//   has_latlng = lat & lng present, not null, and not both 0
// Missing = !has_path OR !has_latlng
//
// Output: api/missings.json {data: [{id,name,has_path,has_latlng}], meta, summary}
//
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type missingItem struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	HasPath    bool   `json:"has_path"`
	HasLatLng  bool   `json:"has_latlng"`
}

func runGenerateMissings(args []string) error {
	fs := flag.NewFlagSet("generate-missings", flag.ContinueOnError)
	outDir := fs.String("out", "api", "output directory for the generated JSON tree")
	pathsDir := fs.String("paths", "", "directory containing path JSON files (default: <out>/paths)")
	verbose := fs.Bool("v", false, "verbose: log summary")
	fs.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: go run ./tools generate-missings [-out api] [-paths api/paths] [-v]\n")
		fs.PrintDefaults()
	}
	if err := fs.Parse(args); err != nil {
		if err == flag.ErrHelp {
			return nil
		}
		return err
	}

	root := repoRoot()
	out := *outDir
	if !filepath.IsAbs(out) {
		out = filepath.Join(root, out)
	}
	pDir := *pathsDir
	if pDir == "" {
		pDir = filepath.Join(out, "paths")
	} else if !filepath.IsAbs(pDir) {
		pDir = filepath.Join(root, pDir)
	}

	hasPathSet, err := buildHasPathSet(pDir)
	if err != nil {
		return err
	}
	log.Printf("[missings] found %d paths in %s", len(hasPathSet), pDir)

	// collect all JSON files to scan
	var targets []string
	rootFiles := []string{filepath.Join(out, "provinces.json")}
	for _, f := range rootFiles {
		if _, err := os.Stat(f); err == nil {
			targets = append(targets, f)
		}
	}
	dirs := []string{
		filepath.Join(out, "provinces"),
		filepath.Join(out, "regencies"),
		filepath.Join(out, "districts"),
		filepath.Join(out, "villages"),
	}
	for _, d := range dirs {
		entries, err := os.ReadDir(d)
		if err != nil {
			if os.IsNotExist(err) {
				continue
			}
			return fmt.Errorf("read dir %s: %w", d, err)
		}
		for _, e := range entries {
			if e.IsDir() || !strings.HasSuffix(e.Name(), ".json") {
				continue
			}
			targets = append(targets, filepath.Join(d, e.Name()))
		}
	}

	seen := make(map[string]missingItem)
	for _, f := range targets {
		items, err := extractItemsForMissings(f, hasPathSet)
		if err != nil {
			log.Printf("warning: scan %s: %v", f, err)
			continue
		}
		for _, it := range items {
			if !it.HasPath || !it.HasLatLng {
				if _, ok := seen[it.ID]; !ok {
					seen[it.ID] = it
				}
			}
		}
	}

	// convert to sorted slice
	missings := make([]missingItem, 0, len(seen))
	for _, v := range seen {
		missings = append(missings, v)
	}
	sort.Slice(missings, func(i, j int) bool { return missings[i].ID < missings[j].ID })

	// summary
	var totalMissingPath, totalMissingLatLng, totalMissingBoth int
	byLevel := map[string]int{"province": 0, "regency": 0, "district": 0, "village": 0}
	for _, m := range missings {
		if !m.HasPath {
			totalMissingPath++
		}
		if !m.HasLatLng {
			totalMissingLatLng++
		}
		if !m.HasPath && !m.HasLatLng {
			totalMissingBoth++
		}
		lvl := genLevelCount(m.ID)
		switch lvl {
		case 0:
			byLevel["province"]++
		case 1:
			byLevel["regency"]++
		case 2:
			byLevel["district"]++
		case 3:
			byLevel["village"]++
		}
	}

	summary := map[string]any{
		"total_missing":          len(missings),
		"total_missing_path":     totalMissingPath,
		"total_missing_latlng":   totalMissingLatLng,
		"total_missing_both":     totalMissingBoth,
		"by_level":               byLevel,
	}

	output := map[string]any{
		"data":    missings,
		"meta":    map[string]any{"updated_at": time.Now().UTC().Format("2006-01-02"), "level": 0},
		"summary": summary,
	}

	outFile := filepath.Join(out, "missings.json")
	if err := writeGenJSON(outFile, output, false); err != nil {
		return fmt.Errorf("write %s: %w", outFile, err)
	}

	if *verbose {
		log.Printf("[missings] wrote %d entries to %s (missing_path=%d, missing_latlng=%d, both=%d)", len(missings), outFile, totalMissingPath, totalMissingLatLng, totalMissingBoth)
		log.Printf("[missings] by_level: province=%d regency=%d district=%d village=%d", byLevel["province"], byLevel["regency"], byLevel["district"], byLevel["village"])
	} else {
		log.Printf("[missings] wrote %d entries to %s", len(missings), outFile)
	}
	return nil
}

func extractItemsForMissings(filePath string, hasPathSet map[string]bool) ([]missingItem, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}
	var root map[string]any
	if err := json.Unmarshal(data, &root); err != nil {
		return nil, fmt.Errorf("unmarshal: %w", err)
	}
	rawData, ok := root["data"]
	if !ok {
		return nil, fmt.Errorf("missing data key")
	}
	var out []missingItem
	switch v := rawData.(type) {
	case []any:
		for _, item := range v {
			m, ok := item.(map[string]any)
			if !ok {
				continue
			}
			id, _ := m["id"].(string)
			name, _ := m["name"].(string)
			if id == "" {
				continue
			}
			hasPath := hasPathSet[id]
			hasLatLng := hasLatLngFromMap(m)
			out = append(out, missingItem{ID: id, Name: name, HasPath: hasPath, HasLatLng: hasLatLng})
		}
	case map[string]any:
		id, _ := v["id"].(string)
		name, _ := v["name"].(string)
		if id == "" {
			base := filepath.Base(filePath)
			id = strings.TrimSuffix(base, ".json")
		}
		if id == "" {
			return nil, fmt.Errorf("missing id")
		}
		hasPath := hasPathSet[id]
		hasLatLng := hasLatLngFromMap(v)
		out = append(out, missingItem{ID: id, Name: name, HasPath: hasPath, HasLatLng: hasLatLng})
	default:
		return nil, fmt.Errorf("unexpected data type %T", rawData)
	}
	return out, nil
}

func hasLatLngFromMap(m map[string]any) bool {
	latRaw, hasLat := m["lat"]
	lngRaw, hasLng := m["lng"]
	if !hasLat || !hasLng {
		return false
	}
	if latRaw == nil || lngRaw == nil {
		return false
	}
	lat, ok1 := toFloat64(latRaw)
	lng, ok2 := toFloat64(lngRaw)
	if !ok1 || !ok2 {
		return false
	}
	// missing if both 0 (null, 0, undefined case)
	if lat == 0 && lng == 0 {
		return false
	}
	return true
}

func toFloat64(v any) (float64, bool) {
	switch x := v.(type) {
	case float64:
		return x, true
	case float32:
		return float64(x), true
	case int:
		return float64(x), true
	case int64:
		return float64(x), true
	case json.Number:
		f, err := x.Float64()
		if err != nil {
			return 0, false
		}
		return f, true
	default:
		return 0, false
	}
}
