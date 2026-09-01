package main

import (
	"fmt"
	"os"
)

func printUsage() {
	fmt.Fprintf(os.Stderr, "Usage:\n")
	fmt.Fprintf(os.Stderr, "  go run ./tools extract-csv [-d dir_output] {path_file_sql | url}\n")
	fmt.Fprintf(os.Stderr, "  go run ./tools generate-static-api [-data data] [-out api] [-v]\n")
	fmt.Fprintf(os.Stderr, "\nCommands:\n")
	fmt.Fprintf(os.Stderr, "  extract-csv            extract INSERT statements from SQL dump into per-table CSV files (alias: extract-sql)\n")
	fmt.Fprintf(os.Stderr, "  generate-static-api    pre-generate the static wilayah API from CSV/JSON data (alias: generate-api)\n")
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
	case "-h", "--help", "help":
		printUsage()
	default:
		fmt.Fprintf(os.Stderr, "unknown command %q\n\n", cmd)
		printUsage()
		os.Exit(1)
	}
}
