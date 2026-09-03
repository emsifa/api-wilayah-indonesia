package main

import (
	"fmt"
	"os"
)

func printUsage() {
	fmt.Fprintf(os.Stderr, "Usage:\n")
	fmt.Fprintf(os.Stderr, "  go run ./tools extract-csv [-d dir_output] {path_file_sql | url}\n")
	fmt.Fprintf(os.Stderr, "  go run ./tools generate-static-api [-data data] [-out api] [-v]\n")
	fmt.Fprintf(os.Stderr, "  go run ./tools generate-boundaries [-data-boundaries data/boundaries] [-out api] [-prov 31] [-limit 0] [-skip-download] [-v]\n")
	fmt.Fprintf(os.Stderr, "  go run ./tools add-has-path [-out api] [-paths api/paths] [-v]\n")
	fmt.Fprintf(os.Stderr, "  go run ./tools generate-missings [-out api] [-paths api/paths] [-v]\n")
	fmt.Fprintf(os.Stderr, "  go run ./tools update-stats [-out api] [-v]\n")
	fmt.Fprintf(os.Stderr, "\nCommands:\n")
	fmt.Fprintf(os.Stderr, "  extract-csv            extract INSERT statements from SQL dump into per-table CSV files (alias: extract-sql)\n")
	fmt.Fprintf(os.Stderr, "  generate-static-api    pre-generate the static wilayah API from CSV/JSON data (alias: generate-api)\n")
	fmt.Fprintf(os.Stderr, "  generate-boundaries    download, extract, convert boundaries SQL and update API endpoints\n")
	fmt.Fprintf(os.Stderr, "  add-has-path           patch has_path into provinces/regencies/districts/villages JSON files (alias: add_has_path)\n")
	fmt.Fprintf(os.Stderr, "  generate-missings      generate api/missings.json — list wilayah missing path OR latlng (alias: missings)\n")
	fmt.Fprintf(os.Stderr, "  update-stats           patch stats.json with total_endpoints & total_filesize (alias: generate-stats)\n")
}

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	cmd := os.Args[1]
	args := os.Args[2:]

	switch cmd {
	case "extract-csv", "extract-sql":
		if err := runExtractCSV(args); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			os.Exit(1)
		}
	case "generate-static-api", "generate-api":
		if err := runGenerateStaticAPI(args); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			os.Exit(1)
		}
	case "generate-boundaries":
		if err := runGenerateBoundaries(args); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			os.Exit(1)
		}
	case "add-has-path", "add_has_path":
		if err := runAddHasPath(args); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			os.Exit(1)
		}
	case "generate-missings", "generate-missing", "generate_missings", "missings":
		if err := runGenerateMissings(args); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			os.Exit(1)
		}
	case "update-stats", "update_stats", "generate-stats", "generate_stats":
		if err := runUpdateStats(args); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			os.Exit(1)
		}
	case "-h", "--help", "help":
		printUsage()
	default:
		fmt.Fprintf(os.Stderr, "unknown command %q\n\n", cmd)
		printUsage()
		os.Exit(1)
	}
}
