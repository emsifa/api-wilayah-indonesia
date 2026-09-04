// add_has_path.go: patch has_path into all wilayah API JSON files
//
// Usage:
//   go run ./tools add-has-path [-out api] [-paths api/paths] [-v]
//
// It scans api/paths/*.json to build the set of codes that have a polygon,
// then patches every relevant endpoint so that each Place/ShortItem object
// contains "has_path": true/false (always present, never omitted).
//
// Patched files:
//   api/provinces.json, api/provinces/{code}.json
//   api/regencies/{province}.json (list) and api/regencies/{code}.json (detail)
//   api/districts/{regency}.json (list) and api/districts/{code}.json (detail)
//   api/villages/{district}.json (list) and api/villages/{code}.json (detail)
//
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func runAddHasPath(args []string) error {
	fs := flag.NewFlagSet("add-has-path", flag.ContinueOnError)
	outDir := fs.String("out", "api", "output directory for the generated JSON tree")
	pathsDir := fs.String("paths", "", "directory containing path JSON files (default: <out>/paths)")
	verbose := fs.Bool("v", false, "verbose: log every file patched")
	fs.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: go run ./tools add-has-path [-out api] [-paths api/paths] [-v]\n")
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
	log.Printf("[has_path] found %d paths in %s", len(hasPathSet), pDir)

	// collect all JSON files to patch
	var targets []string
	dirs := []string{
		filepath.Join(out, "provinces"),
		filepath.Join(out, "regencies"),
		filepath.Join(out, "districts"),
		filepath.Join(out, "villages"),
	}
	// provinces.json is at root
	rootFiles := []string{filepath.Join(out, "provinces.json")}
	for _, f := range rootFiles {
		if _, err := os.Stat(f); err == nil {
			targets = append(targets, f)
		}
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

	patched := 0
	for _, f := range targets {
		n, err := patchFileHasPath(f, hasPathSet, *verbose)
		if err != nil {
			log.Printf("warning: patch %s: %v", f, err)
			continue
		}
		if n > 0 {
			patched++
		}
	}

	log.Printf("[has_path] patched %d/%d files", patched, len(targets))
	return nil
}

func buildHasPathSet(pathsDir string) (map[string]bool, error) {
	entries, err := os.ReadDir(pathsDir)
	if err != nil {
		if os.IsNotExist(err) {
			return map[string]bool{}, nil
		}
		return nil, fmt.Errorf("read paths dir %s: %w", pathsDir, err)
	}
	set := make(map[string]bool, len(entries))
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		code := strings.TrimSuffix(e.Name(), ".json")
		set[code] = true
	}
	return set, nil
}

func patchFileHasPath(filePath string, hasPathSet map[string]bool, verbose bool) (int, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return 0, err
	}
	var root map[string]any
	if err := json.Unmarshal(data, &root); err != nil {
		return 0, fmt.Errorf("unmarshal: %w", err)
	}
	rawData, ok := root["data"]
	if !ok {
		return 0, fmt.Errorf("missing data key")
	}

	count := 0
	switch v := rawData.(type) {
	case []any:
		for _, item := range v {
			m, ok := item.(map[string]any)
			if !ok {
				continue
			}
			id, _ := m["id"].(string)
			if id == "" {
				continue
			}
			m["has_path"] = hasPathSet[id]
			count++
		}
	case map[string]any:
		id, _ := v["id"].(string)
		if id == "" {
			// fallback: try to derive from filename
			base := filepath.Base(filePath)
			id = strings.TrimSuffix(base, ".json")
			// only set if we can identify; otherwise still patch with false
		}
		v["has_path"] = hasPathSet[id]
		count = 1
	default:
		return 0, fmt.Errorf("unexpected data type %T", rawData)
	}

	// update meta
	if metaObj, ok := root["meta"].(map[string]any); ok {
		delete(metaObj, "generated_at")
		metaObj["updated_at"] = time.Now().UTC().Format("2006-01-02")
	}

	if verbose {
		log.Printf("patched %s (%d object(s))", filePath, count)
	}
	// write back compact (same as generate_boundaries)
	if err := writeGenJSONCompactPatched(filePath, root); err != nil {
		return 0, err
	}
	return count, nil
}

func writeGenJSONCompactPatched(path string, v any) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	enc := json.NewEncoder(f)
	// compact: no indent (matches writeGenJSONCompact)
	return enc.Encode(v)
}
