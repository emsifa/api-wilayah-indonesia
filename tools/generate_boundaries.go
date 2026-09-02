// generate_boundaries.go: download, extract, convert SQL boundaries to CSV,
// and update static API endpoints with path coordinates and lat/lng.
//
// Usage:
//   go run ./tools generate-boundaries [-data-boundaries data/boundaries] [-out api] [-cache .cache] [-prov 31] [-limit 0] [-skip-download] [-v]
//
package main

import (
	"archive/zip"
	"bufio"
	"encoding/csv"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

const (
	defaultZipURL = "https://github.com/cahyadsn/wilayah_boundaries/archive/refs/heads/main.zip"
)

var (
	boundaryInsertRe = regexp.MustCompile(`(?i)^\s*INSERT\s+INTO\s+[` + "`" + `"]?([\w.]+)[` + "`" + `"]?\s*(\(([^)]*)\))?\s*(VALUES\b)?\s*$`)
	boundaryValuesRe = regexp.MustCompile(`(?i)^\s*VALUES\b`)
	boundaryColumnRe = regexp.MustCompile("`?([^`,\\s(]+)`?")
)

type boundaryItem struct {
	Kode string
	Nama string
	Lat  float64
	Lng  float64
	Path string
}

func runGenerateBoundaries(args []string) error {
	fs := flag.NewFlagSet("generate-boundaries", flag.ContinueOnError)
	boundariesDir := fs.String("data-boundaries", "data/boundaries", "output directory for converted boundaries CSV files")
	outDir := fs.String("out", "api", "output directory for static JSON API")
	cacheDir := fs.String("cache", ".cache", "cache directory for downloaded zip and extracted SQL files")
	provFilter := fs.String("prov", "", "filter processing by province code (e.g. 31 or 11)")
	limit := fs.Int("limit", 0, "limit total SQL files processed (0 = unlimited, useful for testing)")
	skipDownload := fs.Bool("skip-download", false, "skip downloading zip if zip file already exists in cache")
	verbose := fs.Bool("v", false, "verbose output: log every converted file and JSON written")

	fs.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: go run ./tools generate-boundaries [options]\n")
		fs.PrintDefaults()
	}

	if err := fs.Parse(args); err != nil {
		if err == flag.ErrHelp {
			return nil
		}
		return err
	}

	root := repoRoot()
	csvOut := *boundariesDir
	if !filepath.IsAbs(csvOut) {
		csvOut = filepath.Join(root, csvOut)
	}
	apiOut := *outDir
	if !filepath.IsAbs(apiOut) {
		apiOut = filepath.Join(root, apiOut)
	}
	cache := *cacheDir
	if !filepath.IsAbs(cache) {
		cache = filepath.Join(root, cache)
	}

	if err := os.MkdirAll(csvOut, 0o755); err != nil {
		return fmt.Errorf("create boundaries csv dir: %w", err)
	}
	if err := os.MkdirAll(apiOut, 0o755); err != nil {
		return fmt.Errorf("create api out dir: %w", err)
	}
	if err := os.MkdirAll(filepath.Join(apiOut, "paths"), 0o755); err != nil {
		return fmt.Errorf("create paths out dir: %w", err)
	}
	if err := os.MkdirAll(cache, 0o755); err != nil {
		return fmt.Errorf("create cache dir: %w", err)
	}

	zipPath := filepath.Join(cache, "wilayah_boundaries.zip")
	extractDir := filepath.Join(cache, "extracted")

	// 1. Download zip
	needDownload := true
	if *skipDownload {
		if fi, err := os.Stat(zipPath); err == nil && fi.Size() > 0 {
			log.Printf("[download] skipping download, using existing %s (%d bytes)", zipPath, fi.Size())
			needDownload = false
		}
	}
	if needDownload {
		log.Printf("[download] downloading %s to %s ...", defaultZipURL, zipPath)
		if err := downloadWithProgress(defaultZipURL, zipPath); err != nil {
			return fmt.Errorf("download boundaries zip: %w", err)
		}
	}

	// 2. Extract zip
	log.Printf("[extract] extracting %s to %s ...", zipPath, extractDir)
	if err := unzipDir(zipPath, extractDir); err != nil {
		return fmt.Errorf("extract zip: %w", err)
	}

	// Find the db directory inside extracted files
	dbDir := findDbDir(extractDir)
	if dbDir == "" {
		return fmt.Errorf("could not find 'db' directory inside %s", extractDir)
	}
	log.Printf("[scan] found db directory at %s", dbDir)

	// 3. Scan and collect files to convert
	type sqlFileTarget struct {
		isKec    bool
		key      string
		filePath string
		csvPath  string
	}

	var targets []sqlFileTarget

	// Scan kec: db/kec/wilayah_boundaries_kec_{x}.sql
	kecDir := filepath.Join(dbDir, "kec")
	if entries, err := os.ReadDir(kecDir); err == nil {
		for _, e := range entries {
			if e.IsDir() || !strings.HasSuffix(e.Name(), ".sql") {
				continue
			}
			// Extract x from name
			name := e.Name()
			x := strings.TrimPrefix(name, "wilayah_boundaries_kec_")
			x = strings.TrimSuffix(x, ".sql")
			if *provFilter != "" && x != *provFilter {
				continue
			}
			targets = append(targets, sqlFileTarget{
				isKec:    true,
				key:      x,
				filePath: filepath.Join(kecDir, e.Name()),
				csvPath:  filepath.Join(csvOut, fmt.Sprintf("kec_%s.csv", x)),
			})
		}
	}

	// Scan kel: db/kel/{x}/wilayah_boundaries_kel_{y}.sql
	kelDir := filepath.Join(dbDir, "kel")
	if provEntries, err := os.ReadDir(kelDir); err == nil {
		for _, pe := range provEntries {
			if !pe.IsDir() {
				continue
			}
			provCode := pe.Name()
			if *provFilter != "" && provCode != *provFilter {
				continue
			}
			subDir := filepath.Join(kelDir, provCode)
			if regEntries, err := os.ReadDir(subDir); err == nil {
				for _, re := range regEntries {
					if re.IsDir() || !strings.HasSuffix(re.Name(), ".sql") {
						continue
					}
					name := re.Name()
					y := strings.TrimPrefix(name, "wilayah_boundaries_kel_")
					y = strings.TrimSuffix(y, ".sql")
					targets = append(targets, sqlFileTarget{
						isKec:    false,
						key:      y,
						filePath: filepath.Join(subDir, re.Name()),
						csvPath:  filepath.Join(csvOut, fmt.Sprintf("kel_%s.csv", y)),
					})
				}
			}
		}
	}

	sort.Slice(targets, func(i, j int) bool {
		return targets[i].filePath < targets[j].filePath
	})

	totalTargets := len(targets)
	log.Printf("[scan] collected %d SQL boundary files matching filters", totalTargets)

	if *limit > 0 && len(targets) > *limit {
		log.Printf("[limit] limiting processing to first %d files", *limit)
		targets = targets[:*limit]
	}

	// In-memory caches for updating API list JSONs
	regencyDistrictsMap := make(map[string]map[string][2]float64) // regency_id -> district_id -> [lat, lng]
	districtVillagesMap := make(map[string]map[string][2]float64) // district_id -> village_id -> [lat, lng]

	totalPathsWritten := 0

	// 4. Convert SQL to CSV and process stream
	for idx, target := range targets {
		n := idx + 1
		prefix := fmt.Sprintf("[%d/%d]", n, len(targets))
		if *verbose {
			log.Printf("%s Converting %s -> %s", prefix, target.filePath, target.csvPath)
		} else if n%20 == 0 || n == len(targets) {
			log.Printf("%s Converting files (%s)...", prefix, filepath.Base(target.filePath))
		}

		items, err := parseBoundarySQLFile(target.filePath)
		if err != nil {
			return fmt.Errorf("parse %s: %w", target.filePath, err)
		}

		// Write CSV
		if err := writeBoundaryCSV(target.csvPath, items); err != nil {
			return fmt.Errorf("write csv %s: %w", target.csvPath, err)
		}

		// 5. Stream items to write paths and update single detail files
		for _, it := range items {
			if it.Path != "" {
				level := 3
				if !target.isKec {
					level = 4
				}
				pathJSON := strings.TrimSpace(it.Path)
				if strings.Count(pathJSON, "[") == 3 && strings.Count(pathJSON, "]") == 2 {
					pathJSON += "]"
				}
				pathJSON = roundPathCoords(pathJSON)
				if json.Valid([]byte(pathJSON)) {
					pathOutFile := filepath.Join(apiOut, "paths", it.Kode+".json")
					pathResp := map[string]any{
						"id":   it.Kode,
						"path": json.RawMessage(pathJSON),
					}
					if *verbose {
						log.Printf("write path: %s", pathOutFile)
					}
					writeGenJSONCompact(pathOutFile, genResponse(pathResp, level))
					totalPathsWritten++
				}
			}

			// Update single JSON detail files and record for list JSONs
			if target.isKec {
				// district single: api/districts/{district_id}.json
				districtFile := filepath.Join(apiOut, "districts", it.Kode+".json")
				if err := updateObjectLatLng(districtFile, it.Lat, it.Lng, *verbose); err != nil {
					// Log error if file missing or malformed, but continue
					if *verbose {
						log.Printf("warning: update district %s: %v", districtFile, err)
					}
				}
				regID := genRegencyOf(it.Kode)
				if _, ok := regencyDistrictsMap[regID]; !ok {
					regencyDistrictsMap[regID] = make(map[string][2]float64)
				}
				regencyDistrictsMap[regID][it.Kode] = [2]float64{it.Lat, it.Lng}
			} else {
				// village single: api/villages/{village_id}.json
				villageFile := filepath.Join(apiOut, "villages", it.Kode+".json")
				if err := updateObjectLatLng(villageFile, it.Lat, it.Lng, *verbose); err != nil {
					if *verbose {
						log.Printf("warning: update village %s: %v", villageFile, err)
					}
				}
				distID := genDistrictOf(it.Kode)
				if _, ok := districtVillagesMap[distID]; !ok {
					districtVillagesMap[distID] = make(map[string][2]float64)
				}
				districtVillagesMap[distID][it.Kode] = [2]float64{it.Lat, it.Lng}
			}
		}
	}

	// 6. Batch update list files
	log.Printf("[update] updating districts in regency list files (api/districts/{regency_id}.json) ...")
	for regID, coordsMap := range regencyDistrictsMap {
		listFile := filepath.Join(apiOut, "districts", regID+".json")
		if err := updateListLatLng(listFile, coordsMap, *verbose); err != nil {
			if *verbose {
				log.Printf("warning: update district list %s: %v", listFile, err)
			}
		}
	}

	log.Printf("[update] updating villages in district list files (api/villages/{district_id}.json) ...")
	for distID, coordsMap := range districtVillagesMap {
		listFile := filepath.Join(apiOut, "villages", distID+".json")
		if err := updateListLatLng(listFile, coordsMap, *verbose); err != nil {
			if *verbose {
				log.Printf("warning: update village list %s: %v", listFile, err)
			}
		}
	}

	// 7. Update api/stats.json
	log.Printf("[stats] updating api/stats.json with total paths ...")
	updateStatsPaths(filepath.Join(apiOut, "stats.json"), filepath.Join(apiOut, "paths"), *verbose)

	log.Printf("[done] successfully processed boundaries! Paths written this run: %d", totalPathsWritten)
	return nil
}

// downloadWithProgress downloads a file from url to dest reporting percentage and byte progress.
func downloadWithProgress(url, dest string) error {
	tmpDest := dest + ".tmp"
	out, err := os.Create(tmpDest)
	if err != nil {
		return err
	}
	defer out.Close()

	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status: %s", resp.Status)
	}

	totalBytes := resp.ContentLength
	var downloaded int64
	buf := make([]byte, 64*1024)
	lastReport := time.Now()

	for {
		nr, rerr := resp.Body.Read(buf)
		if nr > 0 {
			nw, werr := out.Write(buf[0:nr])
			if werr != nil {
				return werr
			}
			downloaded += int64(nw)
			if time.Since(lastReport) > 500*time.Millisecond {
				if totalBytes > 0 {
					pct := float64(downloaded) / float64(totalBytes) * 100
					fmt.Printf("\r[download] %.2f MB / %.2f MB (%.1f%%)", float64(downloaded)/(1024*1024), float64(totalBytes)/(1024*1024), pct)
				} else {
					fmt.Printf("\r[download] %.2f MB downloaded", float64(downloaded)/(1024*1024))
				}
				lastReport = time.Now()
			}
		}
		if rerr != nil {
			if rerr == io.EOF {
				break
			}
			return rerr
		}
	}

	if totalBytes > 0 {
		fmt.Printf("\r[download] %.2f MB / %.2f MB (100.0%%)\n", float64(downloaded)/(1024*1024), float64(totalBytes)/(1024*1024))
	} else {
		fmt.Printf("\r[download] %.2f MB downloaded\n", float64(downloaded)/(1024*1024))
	}

	out.Close()
	return os.Rename(tmpDest, dest)
}

// unzipDir unzips an archive into dest.
func unzipDir(src, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer r.Close()

	total := len(r.File)
	lastLog := time.Now()

	for i, f := range r.File {
		path := filepath.Join(dest, f.Name)
		if !strings.HasPrefix(filepath.Clean(path), filepath.Clean(dest)+string(os.PathSeparator)) && filepath.Clean(path) != filepath.Clean(dest) {
			continue
		}

		if f.FileInfo().IsDir() {
			if err := os.MkdirAll(path, 0o755); err != nil {
				return err
			}
			continue
		}

		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			return err
		}

		outFile, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return err
		}

		rc, err := f.Open()
		if err != nil {
			outFile.Close()
			return err
		}

		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()
		if err != nil {
			return err
		}

		if time.Since(lastLog) > 1*time.Second || i == total-1 {
			fmt.Printf("\r[extract] %d/%d files extracted (%.1f%%)", i+1, total, float64(i+1)/float64(total)*100)
			lastLog = time.Now()
		}
	}
	fmt.Println()
	return nil
}

// findDbDir searches for a subdirectory named "db" inside the extracted folder.
func findDbDir(base string) string {
	if fi, err := os.Stat(filepath.Join(base, "db")); err == nil && fi.IsDir() {
		return filepath.Join(base, "db")
	}
	entries, err := os.ReadDir(base)
	if err != nil {
		return ""
	}
	for _, e := range entries {
		if e.IsDir() {
			candidate := filepath.Join(base, e.Name(), "db")
			if fi, err := os.Stat(candidate); err == nil && fi.IsDir() {
				return candidate
			}
		}
	}
	return ""
}

// parseBoundarySQLFile extracts boundary records (kode, nama, lat, lng, path) from a SQL file.
func parseBoundarySQLFile(path string) ([]boundaryItem, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	sc := bufio.NewScanner(f)
	buf := make([]byte, 1024*1024)
	sc.Buffer(buf, maxScanBuffer)

	var (
		items         []boundaryItem
		openBlock     bool
		pendingInsert bool
		blockBuf      strings.Builder
		blockDepth    int
	)

	for sc.Scan() {
		line := sc.Text()

		if openBlock {
			blockBuf.WriteString(line)
			blockBuf.WriteByte('\n')
			blockDepth += parenDepth(line)

			if blockDepth <= 0 && endsWithTerminator(line) {
				body := strings.TrimSuffix(strings.TrimRight(blockBuf.String(), " \t\n\r"), ";")
				rows := parseValueBlock(body)
				for _, r := range rows {
					if len(r.values) >= 5 {
						lat, _ := strconv.ParseFloat(r.values[2], 64)
						lng, _ := strconv.ParseFloat(r.values[3], 64)
						items = append(items, boundaryItem{
							Kode: r.values[0],
							Nama: r.values[1],
							Lat:  lat,
							Lng:  lng,
							Path: r.values[4],
						})
					}
				}
				openBlock = false
				blockBuf.Reset()
			}
			continue
		}

		if pendingInsert {
			if boundaryValuesRe.MatchString(line) {
				pendingInsert = false
				openBlock = true
				blockBuf.Reset()
				blockDepth = 0

				rest := line[strings.Index(line, "VALUES")+len("VALUES"):]
				blockBuf.WriteString(rest)
				blockBuf.WriteByte('\n')
				blockDepth += parenDepth(rest)

				if blockDepth <= 0 && endsWithTerminator(rest) {
					body := strings.TrimSuffix(strings.TrimRight(blockBuf.String(), " \t\n\r"), ";")
					rows := parseValueBlock(body)
					for _, r := range rows {
						if len(r.values) >= 5 {
							lat, _ := strconv.ParseFloat(r.values[2], 64)
							lng, _ := strconv.ParseFloat(r.values[3], 64)
							items = append(items, boundaryItem{
								Kode: r.values[0],
								Nama: r.values[1],
								Lat:  lat,
								Lng:  lng,
								Path: r.values[4],
							})
						}
					}
					openBlock = false
					blockBuf.Reset()
				}
			} else if !isIgnorable(line) {
				pendingInsert = false
			}
			continue
		}

		if m := boundaryInsertRe.FindStringSubmatch(line); m != nil {
			if m[4] != "" {
				openBlock = true
				blockBuf.Reset()
				blockDepth = 0
			} else {
				pendingInsert = true
			}
			continue
		}
	}

	if err := sc.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

// writeBoundaryCSV writes boundary items to a CSV file.
func writeBoundaryCSV(targetPath string, items []boundaryItem) error {
	f, err := os.Create(targetPath)
	if err != nil {
		return err
	}
	defer f.Close()

	w := csv.NewWriter(f)
	defer w.Flush()

	// Header
	if err := w.Write([]string{"kode", "nama", "lat", "lng", "path"}); err != nil {
		return err
	}

	for _, it := range items {
		record := []string{
			it.Kode,
			it.Nama,
			strconv.FormatFloat(it.Lat, 'f', -1, 64),
			strconv.FormatFloat(it.Lng, 'f', -1, 64),
			it.Path,
		}
		if err := w.Write(record); err != nil {
			return err
		}
	}
	return nil
}

// updateObjectLatLng updates lat & lng fields in a single place JSON file (e.g. api/districts/11.01.01.json).
func updateObjectLatLng(filePath string, lat, lng float64, verbose bool) error {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}

	var root map[string]any
	if err := json.Unmarshal(data, &root); err != nil {
		return err
	}

	placeObj, ok := root["data"].(map[string]any)
	if !ok {
		return fmt.Errorf("unexpected json structure in %s", filePath)
	}

	placeObj["lat"] = lat
	placeObj["lng"] = lng

	if metaObj, ok := root["meta"].(map[string]any); ok {
		delete(metaObj, "generated_at")
		metaObj["updated_at"] = time.Now().UTC().Format("2006-01-02")
	}

	if verbose {
		log.Printf("update coordinates in %s: lat=%f, lng=%f", filePath, lat, lng)
	}
	writeGenJSONCompact(filePath, root)
	return nil
}

// updateListLatLng updates lat & lng of items in a list JSON file (e.g. api/districts/11.01.json or api/villages/11.01.01.json).
func updateListLatLng(filePath string, coordsMap map[string][2]float64, verbose bool) error {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}

	var root map[string]any
	if err := json.Unmarshal(data, &root); err != nil {
		return err
	}

	items, ok := root["data"].([]any)
	if !ok {
		return fmt.Errorf("unexpected json structure in list %s", filePath)
	}

	modified := false
	for _, item := range items {
		m, ok := item.(map[string]any)
		if !ok {
			continue
		}
		id, ok := m["id"].(string)
		if !ok {
			continue
		}
		if coords, found := coordsMap[id]; found {
			m["lat"] = coords[0]
			m["lng"] = coords[1]
			modified = true
		}
	}

	if modified {
		if metaObj, ok := root["meta"].(map[string]any); ok {
			delete(metaObj, "generated_at")
			metaObj["updated_at"] = time.Now().UTC().Format("2006-01-02")
		}
		if verbose {
			log.Printf("update coordinates list in %s", filePath)
		}
		writeGenJSONCompact(filePath, root)
	}
	return nil
}

// updateStatsPaths recounts total files in paths/ and updates total_paths in stats.json.
func updateStatsPaths(statsFile, pathsDir string, verbose bool) {
	entries, err := os.ReadDir(pathsDir)
	if err != nil {
		log.Printf("warning: read paths dir %s: %v", pathsDir, err)
		return
	}
	count := 0
	for _, e := range entries {
		if !e.IsDir() && strings.HasSuffix(e.Name(), ".json") {
			count++
		}
	}

	data, err := os.ReadFile(statsFile)
	if err != nil {
		log.Printf("warning: read stats file %s: %v", statsFile, err)
		return
	}

	var root map[string]any
	if err := json.Unmarshal(data, &root); err != nil {
		log.Printf("warning: unmarshal stats file %s: %v", statsFile, err)
		return
	}

	statsData, ok := root["data"].(map[string]any)
	if !ok {
		return
	}
	statsData["total_paths"] = count

	if metaObj, ok := root["meta"].(map[string]any); ok {
		delete(metaObj, "generated_at")
		metaObj["updated_at"] = time.Now().UTC().Format("2006-01-02")
	}

	if verbose {
		log.Printf("updated %s: total_paths=%d", statsFile, count)
	}
	writeGenJSONCompact(statsFile, root)
}
