// extract_csv.go: extract INSERT statements from a SQL dump into per-table CSV files.
//
// Usage:
//   go run ./tools extract-csv [-d dir_output] {path_file_sql | url}
//
// For every table that gets INSERT-ed in the SQL file, a CSV named
// {table}.csv is written to dir_output (default "data/"). Progress, table
// names and row counts are printed to stdout. The SQL source may be a local
// file path or an http(s) URL.
//
// Examples:
//   go run ./tools extract-csv db/wilayah.sql
//   go run ./tools extract-csv https://example.com/wilayah.sql
//   go run ./tools extract-csv -d out db/wilayah_level_1_2.sql
package main

import (
	"bufio"
	"encoding/csv"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var (
	extractInsertRe = regexp.MustCompile(`(?i)^\s*INSERT\s+INTO\s+[` + "`" + `"]?([\w.]+)[` + "`" + `"]?\s*(\(([^)]*)\))?\s*(VALUES\b)?\s*$`)
	extractValuesRe = regexp.MustCompile(`(?i)^\s*VALUES\b`)
	extractColumnRe = regexp.MustCompile("`?([^`,\\s(]+)`?")
)

// maxScanBuffer is large enough to hold a single token; some dumps (e.g.
// GeoJSON "path" columns) have very long lines.
const maxScanBuffer = 64 * 1024 * 1024

func runExtractCSV(args []string) error {
	fs := flag.NewFlagSet("extract-csv", flag.ContinueOnError)
	outDir := fs.String("d", "data", "output directory for the generated CSV files")
	fs.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: go run ./tools extract-csv [-d dir_output] {path_file_sql | url}\n")
		fs.PrintDefaults()
	}
	if err := fs.Parse(args); err != nil {
		if err == flag.ErrHelp {
			return nil
		}
		return err
	}

	if fs.NArg() < 1 {
		fs.Usage()
		return fmt.Errorf("missing SQL source argument")
	}
	sqlSource := fs.Arg(0)

	if err := os.MkdirAll(*outDir, 0o755); err != nil {
		return fmt.Errorf("cannot create output dir %q: %w", *outDir, err)
	}

	if err := runExtract(sqlSource, *outDir); err != nil {
		return err
	}
	fmt.Println("Done.")
	return nil
}

// openSource returns a reader over the SQL source, which may be a local file
// path or an http(s) URL. The returned close function releases the underlying
// resource (file handle or response body).
func openSource(src string) (io.Reader, func() error, error) {
	if strings.HasPrefix(src, "http://") || strings.HasPrefix(src, "https://") {
		resp, err := http.Get(src)
		if err != nil {
			return nil, nil, fmt.Errorf("GET %s: %w", src, err)
		}
		if resp.StatusCode != http.StatusOK {
			resp.Body.Close()
			return nil, nil, fmt.Errorf("GET %s: HTTP %d", src, resp.StatusCode)
		}
		fmt.Printf("  Downloading %s (%s)...\n", src, humanSize(resp.ContentLength))
		return &progressReader{r: resp.Body, total: resp.ContentLength}, resp.Body.Close, nil
	}
	f, err := os.Open(src)
	if err != nil {
		return nil, nil, err
	}
	return f, f.Close, nil
}

// progressReader wraps an io.Reader and prints download progress (percentage
// when the total size is known, otherwise cumulative bytes) to stdout.
type progressReader struct {
	r         io.Reader
	total     int64
	done      int64
	lastPrint int64
}

func (p *progressReader) Read(b []byte) (int, error) {
	n, err := p.r.Read(b)
	p.done += int64(n)
	if p.total > 0 {
		if p.done == p.total || p.done-p.lastPrint >= p.total/50 {
			p.lastPrint = p.done
			fmt.Printf("\r  Downloaded %d%% (%s)", p.done*100/p.total, humanSize(p.done))
			if p.done == p.total {
				fmt.Println()
			}
		}
	} else if p.done-p.lastPrint >= 1<<20 {
		p.lastPrint = p.done
		fmt.Printf("\r  Downloaded %s", humanSize(p.done))
	}
	return n, err
}

// humanSize formats a byte count for display.
func humanSize(b int64) string {
	const unit = 1024
	if b < 0 {
		return "?"
	}
	if b < unit {
		return fmt.Sprintf("%d B", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %ciB", float64(b)/float64(div), "KMGTPE"[exp])
}

func runExtract(sqlSource, outDir string) error {
	reader, closeFn, err := openSource(sqlSource)
	if err != nil {
		return err
	}
	defer closeFn()

	fmt.Printf("Processing: %s\n", sqlSource)

	sc := bufio.NewScanner(reader)
	sc.Buffer(make([]byte, 64*1024), maxScanBuffer)

	var (
		rows          []rowData
		tables        []string
		tableCols     map[string][]string
		tableRows     map[string][]rowData
		curTable      string
		curCols       []string
		openBlock     bool
		pendingInsert bool
		blockBuf      strings.Builder
		blockDepth    int
		totalRows     int
		totalTables   int
	)
	tableCols = make(map[string][]string)
	tableRows = make(map[string][]rowData)

	commit := func() {
		if curTable == "" || len(rows) == 0 {
			return
		}
		if _, ok := tableRows[curTable]; !ok {
			tables = append(tables, curTable)
			tableCols[curTable] = curCols
		}
		tableRows[curTable] = append(tableRows[curTable], rows...)
		rows = nil
		totalTables = len(tables)
	}

	for sc.Scan() {
		line := sc.Text()

		if openBlock {
			blockBuf.WriteString(line)
			blockBuf.WriteByte('\n')
			blockDepth += parenDepth(line)

			if blockDepth <= 0 && endsWithTerminator(line) {
				body := strings.TrimSuffix(strings.TrimRight(blockBuf.String(), " \t\n\r"), ";")
				parsed := parseValueBlock(body)
				rows = append(rows, parsed...)
				totalRows += len(parsed)
				commit()
				openBlock = false
				blockBuf.Reset()
			}
			continue
		}

		if pendingInsert {
			if extractValuesRe.MatchString(line) {
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
					parsed := parseValueBlock(body)
					rows = append(rows, parsed...)
					totalRows += len(parsed)
					commit()
					openBlock = false
					blockBuf.Reset()
				}
			} else if !isIgnorable(line) {
				pendingInsert = false
			}
			continue
		}

		if m := extractInsertRe.FindStringSubmatch(line); m != nil {
			table := m[1]
			var cols []string
			if m[3] != "" {
				for _, cm := range extractColumnRe.FindAllStringSubmatch(m[3], -1) {
					cols = append(cols, cm[1])
				}
			}

			curTable = table
			curCols = cols

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
		return err
	}

	for _, t := range tables {
		if err := writeCSV(filepath.Join(outDir, sanitize(t)+".csv"), t, tableCols[t], tableRows[t]); err != nil {
			return err
		}
	}

	fmt.Printf("\nSummary: %d table(s), %d row(s)\n", totalTables, totalRows)
	return nil
}

// isIgnorable reports whether a line can be skipped while waiting for a
// VALUES clause (blank lines and SQL comments).
func isIgnorable(line string) bool {
	t := strings.TrimSpace(line)
	return t == "" || strings.HasPrefix(t, "--") || strings.HasPrefix(t, "#") || strings.HasPrefix(t, "/*") || strings.HasPrefix(t, "*")
}

// rowData holds a parsed value tuple.
type rowData struct {
	values []string
}

// parseValueBlock parses the text between "VALUES" and the terminating ';'
// into individual value tuples.
func parseValueBlock(s string) []rowData {
	if strings.TrimSpace(s) == "" {
		return nil
	}
	var (
		rows  []rowData
		cur   []string
		field strings.Builder
		i     int
		n     = len(s)
		depth int
	)

	readQuoted := func() {
		for i < n {
			c := s[i]
			if c == '\'' {
				if i+1 < n && s[i+1] == '\'' {
					field.WriteByte('\'')
					i += 2
					continue
				}
				i++
				return
			}
			field.WriteByte(c)
			i++
		}
	}

	for i < n {
		c := s[i]
		switch {
		case c == '\'':
			i++
			readQuoted()
		case c == '(' && depth == 0:
			field.Reset()
			depth = 1
			i++
		case c == '(':
			depth++
			field.WriteByte(c)
			i++
		case c == ')' && depth == 1:
			depth = 0
			cur = finishTuple(cur, field)
			field.Reset()
			rows = append(rows, rowData{values: cur})
			cur = nil
			i++
		case c == ')':
			depth--
			field.WriteByte(c)
			i++
		case c == ',' && depth == 1:
			cur = append(cur, strings.TrimSpace(field.String()))
			field.Reset()
			i++
		case c == ',' && depth > 1:
			field.WriteByte(c)
			i++
		default:
			field.WriteByte(c)
			i++
		}
	}
	return rows
}

func finishTuple(cur []string, field strings.Builder) []string {
	cur = append(cur, strings.TrimSpace(field.String()))
	for j, v := range cur {
		if strings.EqualFold(v, "NULL") {
			cur[j] = ""
		}
	}
	return cur
}

func parenDepth(s string) int {
	depth := 0
	inQuote := false
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c == '\'' {
			if inQuote && i+1 < len(s) && s[i+1] == '\'' {
				i++
				continue
			}
			inQuote = !inQuote
			continue
		}
		if inQuote {
			continue
		}
		switch c {
		case '(':
			depth++
		case ')':
			depth--
		}
	}
	return depth
}

func endsWithTerminator(line string) bool {
	inQuote := false
	for i := 0; i < len(line); i++ {
		c := line[i]
		if c == '\'' {
			if inQuote && i+1 < len(line) && line[i+1] == '\'' {
				i++
				continue
			}
			inQuote = !inQuote
			continue
		}
		if c == ';' && !inQuote {
			return true
		}
	}
	return false
}

func writeCSV(path, table string, cols []string, rows []rowData) error {
	f, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("create %s: %w", path, err)
	}
	defer f.Close()

	w := csv.NewWriter(f)
	if len(cols) > 0 {
		if err := w.Write(cols); err != nil {
			return fmt.Errorf("write header for %s: %w", path, err)
		}
	} else if len(rows) > 0 {
		header := make([]string, len(rows[0].values))
		for i := range header {
			header[i] = fmt.Sprintf("col%d", i+1)
		}
		if err := w.Write(header); err != nil {
			return fmt.Errorf("write header for %s: %w", path, err)
		}
	}
	for _, r := range rows {
		if err := w.Write(r.values); err != nil {
			return fmt.Errorf("write row for %s: %w", path, err)
		}
	}
	w.Flush()
	if err := w.Error(); err != nil {
		return fmt.Errorf("flush %s: %w", path, err)
	}
	fmt.Printf("  Table: %-30s Rows: %-9d Output: %s\n", table, len(rows), path)
	return nil
}

func sanitize(name string) string {
	return strings.ReplaceAll(name, ".", "_")
}
