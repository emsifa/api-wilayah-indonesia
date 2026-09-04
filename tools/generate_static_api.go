// generate_static_api.go: pre-generate the static wilayah API from CSV/JSON data
// into a directory tree of JSON files (intended for static hosting).
//
// Usage:
//   go run ./tools generate-static-api [-data data] [-out api] [-v]
//
// It works in two phases so that the large geometry column is never held for
// every region at once:
//
//	Phase A: stream wilayah.csv + read wilayah_kodepos.csv -> generate all base files.
//	Phase B: stream wilayah_level_1_2.csv -> enrich provinces & regencies with
//	         rich fields, regenerate those files, and emit the /paths/ endpoints.
//
// Data inputs:
//   data/wilayah.csv              -> every administrative level (province..village)
//   data/wilayah_level_1_2.csv    -> rich fields + geometry for province & regency
//   data/wilayah_kodepos.csv      -> { kode: kodepos } mapping for villages
//     extracted via: go run ./tools extract-csv https://raw.githubusercontent.com/cahyadsn/wilayah_kodepos/refs/heads/main/db/wilayah_kodepos.sql
//
package main

import (
	"encoding/csv"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"math"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

var genVerbose bool

func runGenerateStaticAPI(args []string) error {
	fs := flag.NewFlagSet("generate-static-api", flag.ContinueOnError)
	dataDir := fs.String("data", "data", "directory holding the CSV/JSON sources")
	outDir := fs.String("out", "api", "output directory for the generated JSON tree")
	fs.BoolVar(&genVerbose, "v", false, "log every file written")
	fs.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: go run ./tools generate-static-api [-data data] [-out api] [-v]\n")
		fs.PrintDefaults()
	}
	if err := fs.Parse(args); err != nil {
		if err == flag.ErrHelp {
			return nil
		}
		return err
	}

	root := repoRoot()
	inDir := *dataDir
	if !filepath.IsAbs(inDir) {
		inDir = filepath.Join(root, inDir)
	}
	out := *outDir
	if !filepath.IsAbs(out) {
		out = filepath.Join(root, out)
	}

	if err := os.MkdirAll(out, 0o755); err != nil {
		return fmt.Errorf("create output dir: %w", err)
	}
	for _, d := range []string{"provinces", "regencies", "districts", "villages", "postal-codes", "paths"} {
		if err := os.MkdirAll(filepath.Join(out, d), 0o755); err != nil {
			return fmt.Errorf("create subdir: %w", err)
		}
	}

	g := newGen(out)

	nA := g.phaseA(filepath.Join(inDir, "wilayah.csv"), filepath.Join(inDir, "wilayah_kodepos.csv"))
	nB, nP := g.phaseB(filepath.Join(inDir, "wilayah_level_1_2.csv"))

	g.writeStats()

	log.Printf("phase A: %d files", nA)
	log.Printf("phase B: %d paths written, %d level-1/2 files regenerated", nP, nB)
	log.Printf("total:  %d files", nA+nB+g.pathCount+1)
	return nil
}

// ---- data model ----

type genEntry struct {
	Kode, Nama, Capital string
	Lat, Lng, Elv, TZ   float64
	Luas                float64
	Penduduk            int64
	HasRich             bool
	PostalCode          string
}

type genShortItem struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	PostalCode string `json:"postal_code,omitempty"`
	HasPath    bool   `json:"has_path"`
}

type genPlace struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	Capital    string  `json:"capital,omitempty"`
	Lat        float64 `json:"lat,omitempty"`
	Lng        float64 `json:"lng,omitempty"`
	Elv        float64 `json:"elv,omitempty"`
	TZ         int     `json:"tz,omitempty"`
	Population int64   `json:"population,omitempty"`
	TotalArea  float64 `json:"total_area,omitempty"`
	PostalCode string  `json:"postal_code,omitempty"`
	HasPath    bool    `json:"has_path"`

	Province *genPlace `json:"province,omitempty"`
	Regency  *genPlace `json:"regency,omitempty"`
	District *genPlace `json:"district,omitempty"`
}

func newGenPlace(e *genEntry) genPlace {
	if !e.HasRich {
		return genPlace{ID: e.Kode, Name: e.Nama, PostalCode: e.PostalCode}
	}
	return genPlace{
		ID:         e.Kode,
		Name:       e.Nama,
		Capital:    e.Capital,
		Lat:        e.Lat,
		Lng:        e.Lng,
		Elv:        e.Elv,
		TZ:         int(e.TZ),
		Population: e.Penduduk,
		TotalArea:  e.Luas,
		PostalCode: e.PostalCode,
	}
}

func genParentPlace(e *genEntry) *genPlace {
	if e == nil {
		return nil
	}
	return &genPlace{ID: e.Kode, Name: e.Nama}
}

type genMeta struct {
	UpdatedAt string `json:"updated_at"`
	Level     int    `json:"level"`
}

func genResponse(data any, level int) map[string]any {
	return map[string]any{
		"data": data,
		"meta": genMeta{UpdatedAt: time.Now().UTC().Format("2006-01-02"), Level: level},
	}
}

// ---- level helpers ----

func genLevelCount(kode string) int { return strings.Count(kode, ".") }

func genProvinceOf(kode string) string {
	if i := strings.IndexByte(kode, '.'); i >= 0 {
		return kode[:i]
	}
	return kode
}

func genRegencyOf(kode string) string {
	p := strings.Split(kode, ".")
	if len(p) < 2 {
		return kode
	}
	return p[0] + "." + p[1]
}

func genDistrictOf(kode string) string {
	p := strings.Split(kode, ".")
	if len(p) < 3 {
		return kode
	}
	return p[0] + "." + p[1] + "." + p[2]
}

type generator struct {
	outDir string

	all       map[string]*genEntry
	provOrder []string

	regenciesByProv map[string][]string
	districtsByReg  map[string][]string
	villagesByDist  map[string][]string
	postalToNew     map[string][]string

	pathCount int
}

func newGen(outDir string) *generator {
	return &generator{
		outDir:          outDir,
		all:             map[string]*genEntry{},
		regenciesByProv: map[string][]string{},
		districtsByReg:  map[string][]string{},
		villagesByDist:  map[string][]string{},
		postalToNew:     map[string][]string{},
	}
}

func (g *generator) phaseA(wilayahPath, postalPath string) int {
	if err := g.readWilayah(wilayahPath); err != nil {
		log.Fatalf("phase A: %v", err)
	}
	if err := g.readPostalCodes(postalPath); err != nil {
		log.Fatalf("phase A: %v", err)
	}

	n := 0
	write := func(rel, name string, data any, level int) {
		path := filepath.Join(g.outDir, rel, name)
		writeGenJSONIndent(path, genResponse(data, level))
		n++
	}
	writeList := func(rel, parent string, kodes []string, level int) {
		items := make([]genShortItem, 0, len(kodes))
		for _, k := range kodes {
			e := g.all[k]
			items = append(items, genShortItem{ID: e.Kode, Name: e.Nama, PostalCode: e.PostalCode})
		}
		write(rel, parent+".json", items, level)
	}

	provinces := make([]genPlace, 0, len(g.provOrder))
	for _, k := range g.provOrder {
		provinces = append(provinces, newGenPlace(g.all[k]))
	}
	writeGenJSONIndent(filepath.Join(g.outDir, "provinces.json"), genResponse(provinces, 1))
	n++
	for _, k := range g.provOrder {
		write("provinces", k+".json", newGenPlace(g.all[k]), 1)
		writeList("regencies", k, g.regenciesByProv[genProvinceOf(k)], 2)
	}

	for _, k := range genAllRegencies(g.regenciesByProv) {
		e := g.all[k]
		d := newGenPlace(e)
		d.Province = genParentPlace(g.all[genProvinceOf(k)])
		write("regencies", k+".json", d, 2)
		writeList("districts", k, g.districtsByReg[k], 3)
	}

	for _, k := range genAllDistricts(g.districtsByReg) {
		e := g.all[k]
		d := newGenPlace(e)
		d.Province = genParentPlace(g.all[genProvinceOf(k)])
		d.Regency = genParentPlace(g.all[genRegencyOf(k)])
		write("districts", k+".json", d, 3)
		writeList("villages", k, g.villagesByDist[k], 4)
	}

	for _, k := range genSortedKodeKeys(g.villagesByDist) {
		for _, vk := range g.villagesByDist[k] {
			v := g.all[vk]
			d := newGenPlace(v)
			d.PostalCode = v.PostalCode
			d.Province = genParentPlace(g.all[genProvinceOf(vk)])
			d.Regency = genParentPlace(g.all[genRegencyOf(vk)])
			d.District = genParentPlace(g.all[genDistrictOf(vk)])
			write("villages", vk+".json", d, 4)
		}
	}

	for _, post := range genSortedKodeKeys(g.postalToNew) {
		items := make([]genPlace, 0, len(g.postalToNew[post]))
		for _, vk := range g.postalToNew[post] {
			v := g.all[vk]
			d := newGenPlace(v)
			d.PostalCode = v.PostalCode
			d.Province = genParentPlace(g.all[genProvinceOf(vk)])
			d.Regency = genParentPlace(g.all[genRegencyOf(vk)])
			d.District = genParentPlace(g.all[genDistrictOf(vk)])
			items = append(items, d)
		}
		write("postal-codes", post+".json", items, 4)
	}

	return n
}

func (g *generator) phaseB(level12Path string) (regenerated, paths int) {
	f, err := os.Open(level12Path)
	if err != nil {
		log.Fatalf("phase B: %v", err)
	}
	defer f.Close()

	r := csv.NewReader(f)
	r.FieldsPerRecord = -1
	const cols = 11

	header := true
	for {
		rec, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatalf("phase B: read %s: %v", level12Path, err)
		}
		if header {
			header = false
			continue
		}
		if len(rec) < cols {
			log.Fatalf("phase B: %s: expected %d fields, got %d", level12Path, cols, len(rec))
		}

		kode := strings.TrimSpace(rec[0])
		e, ok := g.all[kode]
		if !ok {
			e = &genEntry{Kode: kode}
			g.all[kode] = e
			g.provOrder = append(g.provOrder, kode)
		}
		e.HasRich = true
		e.Nama = strings.TrimSpace(rec[1])
		e.Capital = strings.TrimSpace(rec[2])
		e.Lat = genParseFloat(rec[3])
		e.Lng = genParseFloat(rec[4])
		e.Elv = genParseFloat(rec[5])
		e.TZ = genParseFloat(rec[6])
		e.Luas = genParseFloat(rec[7])
		e.Penduduk = genParseInt64(rec[8])

		if pathJSON := strings.TrimSpace(rec[9]); pathJSON != "" {
			if strings.Count(pathJSON, "[") == 3 && strings.Count(pathJSON, "]") == 2 {
				pathJSON += "]"
			}
			pathJSON = roundPathCoords(pathJSON)
			if json.Valid([]byte(pathJSON)) {
				data := map[string]any{"id": kode, "path": json.RawMessage(pathJSON)}
				writeGenJSONCompact(filepath.Join(g.outDir, "paths", kode+".json"), genResponse(data, genLevelCount(kode)+1))
				g.pathCount++
				paths++
			} else {
				log.Printf("phase B: skipping invalid path for %s", kode)
			}
		}
	}

	if len(g.provOrder) > 0 {
		provinces := make([]genPlace, 0, len(g.provOrder))
		for _, k := range g.provOrder {
			provinces = append(provinces, newGenPlace(g.all[k]))
		}
		writeGenJSONIndent(filepath.Join(g.outDir, "provinces.json"), genResponse(provinces, 1))
		regenerated++
		for _, k := range g.provOrder {
			e := g.all[k]
			writeGenJSONIndent(filepath.Join(g.outDir, "provinces", k+".json"), genResponse(newGenPlace(e), 1))
			regenerated++
			items := make([]genPlace, 0, len(g.regenciesByProv[genProvinceOf(k)]))
			for _, rk := range g.regenciesByProv[genProvinceOf(k)] {
				items = append(items, newGenPlace(g.all[rk]))
			}
			writeGenJSONIndent(filepath.Join(g.outDir, "regencies", k+".json"), genResponse(items, 2))
			regenerated++
		}
		for _, k := range genAllRegencies(g.regenciesByProv) {
			d := newGenPlace(g.all[k])
			d.Province = genParentPlace(g.all[genProvinceOf(k)])
			writeGenJSONIndent(filepath.Join(g.outDir, "regencies", k+".json"), genResponse(d, 2))
			regenerated++
		}
	}

	return regenerated, paths
}

func (g *generator) writeStats() {
	regencies := 0
	for _, ks := range g.regenciesByProv {
		regencies += len(ks)
	}
	districts := 0
	for _, ks := range g.districtsByReg {
		districts += len(ks)
	}
	villages := 0
	for _, ks := range g.villagesByDist {
		villages += len(ks)
	}

	var population int64
	var area float64
	for _, e := range g.all {
		if e.HasRich && genLevelCount(e.Kode) < 1 {
			population += e.Penduduk
			area += e.Luas
		}
	}

	stats := map[string]any{
		"total_provinces":    len(g.provOrder),
		"total_regencies":    regencies,
		"total_districts":    districts,
		"total_villages":     villages,
		"total_postal_codes": len(g.postalToNew),
		"total_paths":        g.pathCount,
		"total_population":   population,
		"total_area":         area,
	}
	writeGenJSONIndent(filepath.Join(g.outDir, "stats.json"), genResponse(stats, 0))
}

func (g *generator) readWilayah(path string) error {
	f, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("open %s: %w", path, err)
	}
	defer f.Close()

	r := csv.NewReader(f)
	r.FieldsPerRecord = -1
	header := true
	for {
		rec, err := r.Read()
		if err == io.EOF {
			return nil
		}
		if err != nil {
			return fmt.Errorf("read %s: %w", path, err)
		}
		if header {
			header = false
			continue
		}
		if len(rec) == 0 || strings.TrimSpace(rec[0]) == "" {
			continue
		}
		kode := strings.TrimSpace(rec[0])
		nama := ""
		if len(rec) > 1 {
			nama = strings.TrimSpace(rec[1])
		}
		g.all[kode] = &genEntry{Kode: kode, Nama: nama}
		switch genLevelCount(kode) {
		case 0:
			if !genContains(g.provOrder, kode) {
				g.provOrder = append(g.provOrder, kode)
			}
		case 1:
			g.regenciesByProv[genProvinceOf(kode)] = append(g.regenciesByProv[genProvinceOf(kode)], kode)
		case 2:
			g.districtsByReg[genRegencyOf(kode)] = append(g.districtsByReg[genRegencyOf(kode)], kode)
		case 3:
			g.villagesByDist[genDistrictOf(kode)] = append(g.villagesByDist[genDistrictOf(kode)], kode)
		}
	}
}

func (g *generator) readPostalCodes(path string) error {
	return g.readPostalCodesCSV(path)
}

func (g *generator) readPostalCodesCSV(path string) error {
	f, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("open %s: %w", path, err)
	}
	defer f.Close()

	r := csv.NewReader(f)
	r.FieldsPerRecord = -1
	// Read header
	header, err := r.Read()
	if err != nil {
		return fmt.Errorf("read header %s: %w", path, err)
	}
	// Find column indices (case-insensitive)
	kodeIdx, posIdx := -1, -1
	for i, h := range header {
		hn := strings.TrimSpace(strings.ToLower(h))
		switch hn {
		case "kode":
			kodeIdx = i
		case "kodepos", "kode_pos", "postal_code", "postalcode":
			posIdx = i
		}
	}
	// Default to 0,1 if header not recognized (e.g. no header or different names)
	if kodeIdx == -1 || posIdx == -1 {
		// Assume first two columns are kode,kodepos if header doesn't match
		// Check if header looks like data (contains dot in first col)
		if kodeIdx == -1 && len(header) > 0 && strings.Contains(header[0], ".") {
			// No header, treat header row as data
			kodeIdx, posIdx = 0, 1
			// Process this row as data
			village := strings.TrimSpace(header[kodeIdx])
			post := ""
			if posIdx < len(header) {
				post = strings.TrimSpace(header[posIdx])
			}
			if village != "" && post != "" {
				if e, ok := g.all[village]; ok {
					e.PostalCode = post
				}
				g.postalToNew[post] = append(g.postalToNew[post], village)
			}
		} else {
			if kodeIdx == -1 {
				kodeIdx = 0
			}
			if posIdx == -1 {
				posIdx = 1
			}
		}
	}

	for {
		rec, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return fmt.Errorf("read %s: %w", path, err)
		}
		if len(rec) <= kodeIdx || len(rec) <= posIdx {
			continue
		}
		village := strings.TrimSpace(rec[kodeIdx])
		post := strings.TrimSpace(rec[posIdx])
		if village == "" || post == "" {
			continue
		}
		if e, ok := g.all[village]; ok {
			e.PostalCode = post
		}
		g.postalToNew[post] = append(g.postalToNew[post], village)
	}
	for p := range g.postalToNew {
		sort.Strings(g.postalToNew[p])
	}
	return nil
}

// ---- misc helpers ----

func genParseFloat(s string) float64 {
	v, err := strconv.ParseFloat(strings.TrimSpace(s), 64)
	if err != nil {
		return 0
	}
	return v
}

func genParseInt64(s string) int64 {
	v, err := strconv.ParseInt(strings.TrimSpace(s), 10, 64)
	if err != nil {
		return 0
	}
	return v
}

func writeGenJSONIndent(path string, v any) {
	if err := writeGenJSON(path, v, false); err != nil {
		log.Fatalf("write %s: %v", path, err)
	}
}

func writeGenJSONCompact(path string, v any) {
	if err := writeGenJSON(path, v, false); err != nil {
		log.Fatalf("write %s: %v", path, err)
	}
}

func writeGenJSON(path string, v any, indent bool) error {
	if genVerbose {
		log.Printf("write %s", path)
	}
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	enc := json.NewEncoder(f)
	if indent {
		enc.SetIndent("", "  ")
	}
	return enc.Encode(v)
}

func genContains(xs []string, s string) bool {
	for _, x := range xs {
		if x == s {
			return true
		}
	}
	return false
}

func genSortedKodeKeys(m map[string][]string) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}

func genAllRegencies(m map[string][]string) []string {
	var out []string
	for _, ks := range m {
		out = append(out, ks...)
	}
	sort.Strings(out)
	return out
}

func genAllDistricts(m map[string][]string) []string {
	var out []string
	for _, ks := range m {
		out = append(out, ks...)
	}
	sort.Strings(out)
	return out
}

func repoRoot() string {
	dir, err := os.Getwd()
	if err != nil {
		log.Fatalf("getwd: %v", err)
	}
	for {
		if _, err := os.Stat(filepath.Join(dir, ".git")); err == nil {
			return dir
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return dir
		}
		dir = parent
	}
}

// coordFloatRe matches any JSON floating-point number inside a coordinate array.
var coordFloatRe = regexp.MustCompile(`-?\d+\.\d+`)

// roundPathCoords rounds every float in a raw coordinate JSON string to 6
// decimal places (~11 cm precision), significantly shrinking file sizes while
// retaining more than enough accuracy for administrative boundary rendering.
func roundPathCoords(pathJSON string) string {
	return coordFloatRe.ReplaceAllStringFunc(pathJSON, func(s string) string {
		f, err := strconv.ParseFloat(s, 64)
		if err != nil {
			return s
		}
		rounded := math.Round(f*1e6) / 1e6
		return strconv.FormatFloat(rounded, 'f', 6, 64)
	})
}
