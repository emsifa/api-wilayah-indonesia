// update_stats.go: patch stats.json with total_endpoints & total_filesize
//
// Usage:
//   go run ./tools update-stats [-out api] [-v]
//   go run ./tools generate-stats (alias)
//
// Counts all endpoint files under api/ and sums their sizes.
// Patches api/stats.json data with:
//   total_endpoints       int   — number of JSON files under api/
//   total_filesize        int64 — sum of all file sizes in bytes (logical/apparent)
//   total_filesize_human  string — human-readable logical size (e.g. "286.51 MB")
//   total_disk_usage      int64 — disk allocated size (Blocks*512 or 4K estimate)
//   total_disk_usage_human string — human-readable disk size (e.g. "881 MB")
//
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

func runUpdateStats(args []string) error {
	fsFlag := flag.NewFlagSet("update-stats", flag.ContinueOnError)
	outDir := fsFlag.String("out", "api", "output directory for the generated JSON tree (contains stats.json)")
	verbose := fsFlag.Bool("v", false, "verbose: log every step")
	fsFlag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: go run ./tools update-stats [-out api] [-v]\n")
		fsFlag.PrintDefaults()
	}
	if err := fsFlag.Parse(args); err != nil {
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

	statsFile := filepath.Join(out, "stats.json")
	statInfo, err := os.Stat(statsFile)
	if err != nil {
		return fmt.Errorf("stats file not found %s: %w", statsFile, err)
	}
	oldStatsSize := statInfo.Size()

	var totalEndpoints int
	var totalFilesize int64
	var totalDiskUsage int64

	err = filepath.WalkDir(out, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			// skip .git etc if any, but api should only have json
			if strings.HasPrefix(d.Name(), ".") {
				return filepath.SkipDir
			}
			return nil
		}
		// Count all files as endpoints — only JSON files are endpoints
		if !strings.HasSuffix(strings.ToLower(d.Name()), ".json") {
			return nil
		}
		info, err := d.Info()
		if err != nil {
			return err
		}
		totalEndpoints++
		totalFilesize += info.Size()
		totalDiskUsage += diskUsage(path, info)
		if *verbose {
			// only log if very verbose? keep quiet for now
		}
		return nil
	})
	if err != nil {
		return fmt.Errorf("walk api dir: %w", err)
	}

	human := humanBytes(totalFilesize)
	diskHuman := humanBytes(totalDiskUsage)

	if *verbose {
		log.Printf("[stats] counted %d endpoints, logical %d bytes (%s), disk %d bytes (%s) in %s", totalEndpoints, totalFilesize, human, totalDiskUsage, diskHuman, out)
	}

	// Read and patch stats.json
	data, err := os.ReadFile(statsFile)
	if err != nil {
		return fmt.Errorf("read stats file: %w", err)
	}
	var rootMap map[string]any
	if err := json.Unmarshal(data, &rootMap); err != nil {
		return fmt.Errorf("unmarshal stats: %w", err)
	}
	dataMap, ok := rootMap["data"].(map[string]any)
	if !ok {
		// If data is not map, create new
		dataMap = make(map[string]any)
		// try to preserve existing fields if any
		if existing, ok := rootMap["data"]; ok {
			// keep as is but overwrite
			_ = existing
		}
		rootMap["data"] = dataMap
	}

	dataMap["total_endpoints"] = totalEndpoints
	dataMap["total_filesize"] = totalFilesize
	dataMap["total_filesize_human"] = human
	dataMap["total_disk_usage"] = totalDiskUsage
	dataMap["total_disk_usage_human"] = diskHuman

	if metaObj, ok := rootMap["meta"].(map[string]any); ok {
		delete(metaObj, "generated_at")
		metaObj["updated_at"] = time.Now().UTC().Format("2006-01-02")
	}

	if err := writeGenJSON(statsFile, rootMap, false); err != nil {
		return fmt.Errorf("write stats: %w", err)
	}

	// Re-stat new file and adjust sizes to reflect final stats.json
	if newInfo, err := os.Stat(statsFile); err == nil {
		newSize := newInfo.Size()
		newDisk := diskUsage(statsFile, newInfo)
		if newSize != oldStatsSize {
			finalSize := totalFilesize - oldStatsSize + newSize
			finalDisk := totalDiskUsage - diskUsageForSize(oldStatsSize) + newDisk
			// Use syscall disk if available for old, but we approximate via 4K for old
			// More accurate: recompute delta via actual diskUsage function with old size fallback
			dataMap["total_filesize"] = finalSize
			dataMap["total_filesize_human"] = humanBytes(finalSize)
			dataMap["total_disk_usage"] = finalDisk
			dataMap["total_disk_usage_human"] = humanBytes(finalDisk)
			if err := writeGenJSON(statsFile, rootMap, false); err == nil {
				log.Printf("[stats] updated %s: total_endpoints=%d, total_filesize=%d (%s), total_disk_usage=%d (%s)", statsFile, totalEndpoints, finalSize, humanBytes(finalSize), finalDisk, humanBytes(finalDisk))
				return nil
			}
		}
	}

	log.Printf("[stats] updated %s: total_endpoints=%d, total_filesize=%d (%s), total_disk_usage=%d (%s)", statsFile, totalEndpoints, totalFilesize, human, totalDiskUsage, diskHuman)
	return nil
}

// aliases to satisfy both command names
func runGenerateStats(args []string) error {
	return runUpdateStats(args)
}

func diskUsage(path string, info fs.FileInfo) int64 {
	// Try syscall Blocks*512 for accurate disk usage (Linux)
	if stat, ok := info.Sys().(*syscall.Stat_t); ok {
		if stat.Blocks > 0 {
			return stat.Blocks * 512
		}
	}
	// Fallback: try syscall.Stat directly (in case FileInfo.Sys() is nil on some FS)
	var st syscall.Stat_t
	if err := syscall.Stat(path, &st); err == nil && st.Blocks > 0 {
		return st.Blocks * 512
	}
	// Fallback: estimate 4K block allocation
	return diskUsageForSize(info.Size())
}

func diskUsageForSize(size int64) int64 {
	const block = 4096
	if size == 0 {
		return 0
	}
	blocks := (size + block - 1) / block
	return blocks * block
}

func humanBytes(b int64) string {
	const unit = 1024
	if b < unit {
		return fmt.Sprintf("%d B", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	units := []string{"KB", "MB", "GB", "TB"}
	if exp >= len(units) {
		exp = len(units) - 1
	}
	return fmt.Sprintf("%.2f %s", float64(b)/float64(div), units[exp])
}
