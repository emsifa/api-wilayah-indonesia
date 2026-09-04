---
name: wilayah-indonesia
description: Schemas for Indonesian administrative data — API responses and downloadable files for app integration
---

# SKILL — Wilayah Indonesia

Use this skill when a developer wants to integrate Indonesian administrative data (provinces, regencies/cities, districts, villages, postal codes, boundaries) into their app. Data is available in two interchangeable ways: **Static API** (`https://www.emsifa.com/api-wilayah-indonesia/v2`) and **Downloaded files** (`npx wilayah download --format csv|sql|json`). This file only describes what you will receive — columns, keys, and response shapes — so you can build for any stack.

## 1. Which Source Should You Use?

- **Static API:** Best for MVPs, frontend-only apps, or edge functions. No database needed — just `fetch` JSON. Includes polygons for maps. Data is cached on CDN.
- **Download:** Best when you need offline validation, foreign keys, or complex queries (`WHERE postal_code = ?`). You get the full dataset to self-host in your own database or static hosting.

Ask the user: “Do you want to fetch from the API or self-host the data?”

## 2. API — What You Get

Base URL: `https://www.emsifa.com/api-wilayah-indonesia/v2`

Every response has the same wrapper:

```json
{
  "data": <object or array>,
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 1
  }
}
```

- `data`: the actual payload (see below)
- `meta.generated_at`: when the file was generated (RFC3339)
- `meta.level`: depth `0=stats, 1=province, 2=regency, 3=district, 4=village/postal`

### 2.1 What you get for provinces & regencies (detailed)

For `provinces.json`, `provinces/{code}.json`, `regencies/{province}.json`, `regencies/{regency}.json` you receive rich objects:

```json
{
  "id": "32",
  "name": "Jawa Barat",
  "capital": "Bandung",
  "lat": -6.90,
  "lng": 107.61,
  "elv": 739,
  "tz": 7,
  "population": 51316378,
  "total_area": 37053.33,
  "has_path": true,
  "province": { "id": "32", "name": "Jawa Barat" },
  "regency": { "id": "32.73", "name": "Kota Bandung" }
}
```

- You'll always get `id`, `name`, and `has_path` (boolean, true if `/paths/{id}.json` exists). For provinces and regencies you also get `capital, lat, lng (for map marker), elv, tz, population, total_area`.
- `has_path` is always present (true/false) — check it before fetching `/paths/{id}.json` to avoid 404.
- Detail endpoints also include their parent: a regency includes `province`, a district includes `province` + `regency`, a village includes all three.

### 2.2 What you get for districts & villages (lists)

For lists, you get a compact form to keep files small:

```json
// districts/{regency}.json
{ "id": "32.73.01", "name": "Sukasari", "lat": -6.87, "lng": 107.59, "has_path": true }

// villages/{district}.json
{ "id": "32.73.01.1001", "name": "Sukarasa", "postal_code": "40152", "lat": -6.87, "lng": 107.59, "has_path": true }
```

- District lists have `id`, `name`, `lat`, `lng`, and `has_path` (compact but with coordinates).
- Village lists add `postal_code` + `has_path` so you can filter by postal code and know if polygon is available without a separate lookup.
- Detail endpoints (`districts/{code}.json`, `villages/{code}.json`) also include `has_path` alongside `lat/lng` and parent objects.

### 2.3 All endpoints

| Path | What it returns |
|---|---|
| `/stats.json` | Totals for all levels |
| `/provinces.json` | All provinces (detailed) |
| `/provinces/{code}.json` | One province, e.g. `32` |
| `/regencies/{province_code}.json` | Regencies in that province |
| `/regencies/{regency_code}.json` | One regency + its province |
| `/districts/{regency_code}.json` | Districts in that regency (compact) + `has_path` |
| `/districts/{district_code}.json` | One district + its province/regency + `has_path` |
| `/villages/{district_code}.json` | Villages in that district + `postal_code` + `has_path` |
| `/villages/{village_code}.json` | One village + `postal_code` + all parents + `has_path` |
| `/postal-codes/{postal_code}.json` | All villages that use that postal code |
| `/paths/{code}.json` | Boundary polygon for any level (fetch only if `has_path=true`) |
| `/missings.json` | Wilayah dimana `has_path==false` OR `has_latlng==false` (flat `{id,name,has_path,has_latlng}` + `summary` by_level) |

### 2.4 Totals (stats)

```json
{
  "total_provinces": 38,
  "total_regencies": 514,
  "total_districts": 7285,
  "total_villages": 83762,
  "total_postal_codes": 10632,
  "total_paths": 551,
  "total_population": 284973643,
  "total_area": 1889518.25,
  "total_endpoints": 201309,
  "total_filesize": 300423246,
  "total_filesize_human": "286.51 MB",
  "total_disk_usage": 915771392,
  "total_disk_usage_human": "873.35 MB"
}
```

### 2.5 Boundaries (polygons)

```json
{
  "data": {
    "id": "32",
    "name": "Jawa Barat",
    "path": [[[ -6.98, 106.39 ], [-6.93, 106.39 ]], [[ ... ]]]
  }
}
```

- Polygons are available for all levels when `has_path=true` — check `has_path` on any `provinces/regencies/districts/villages` response before fetching `/paths/{id}.json`. Some have one ring (single island), others have many (e.g., Jakarta 2 rings, Aceh 28, Papua Barat 1455). Your map code should handle both: if the first element is a point `[lat,lng]` it's a single polygon, if it's an array of points it's already a list of rings — collect all rings that have more than 2 points.

### 2.6 Missings (incomplete data)

```json
// GET /missings.json
{
  "data": [
    { "id": "53.09.14.2011", "name": "Watu Pangan", "has_path": false, "has_latlng": false },
    { "id": "32.73.01.1005", "name": "Sukajadi", "has_path": false, "has_latlng": true }
  ],
  "meta": { "updated_at": "2026-09-03", "level": 0 },
  "summary": {
    "total_missing": 360,
    "total_missing_path": 320,
    "total_missing_latlng": 40,
    "total_missing_both": 12,
    "by_level": { "province": 0, "regency": 0, "district": 0, "village": 360 }
  }
}
```

- `has_path`: true if `/paths/{id}.json` exists, else false.
- `has_latlng`: true if `lat` and `lng` present and not `0`/`null`/`undefined`, else false.
- List is flat across all levels; entry appears if `has_path==false OR has_latlng==false`.
- `summary.by_level` counts per level (province=0 dots, regency=1, district=2, village=3).

## 3. Downloaded Files — What You Get

Run `npx wilayah download --format <csv|sql|json> --output ./wilayah.<ext>` to get the full dataset to host yourself. You can also get the same shapes via the API, but as static files you control.

### 3.1 `wilayah.csv` / `wilayah.json` (full hierarchy)

Every row is one administrative area:

```
kode,nama
11,Aceh
11.01,Kabupaten Aceh Selatan
11.01.01,Bakongan
11.01.01.2001,Keude Bakongan
```

- `kode`: the ID. Count the dots to know the level: no dot = province (2 chars, e.g. `11`), one dot = regency (5 chars, `11.01`), two dots = district (8 chars, `11.01.01`), three dots = village (13 chars, `11.01.01.2001`)
- `nama`: the display name

The `json` version has the same rows as an array of `{kode, nama}`.

### 3.2 Rich data for provinces & regencies

When you need coordinates, capital, population, area, or polygon, use the level 1/2 data. In the download this is available as extra columns (for `sql`/`json`) or as the API rich objects:

```
kode,nama,ibukota,lat,lng,elv,tz,luas,penduduk,path
11,Aceh,Banda Aceh,5.57,95.34,11,7,56835.019,5623479,"[[[2.07,97.07],...]]"
```

- `ibukota` = capital, `luas` = total_area, `penduduk` = population, `path` = same polygon as `/paths` endpoint

### 3.3 Postal code mapping

```
kode,kodepos
32.73.01.1001,40152
```

- `kode`: village id
- `kodepos`: postal code used to build `postal-codes/{code}.json`. One postal code can map to many villages.

### 3.4 What each download format gives you

- `wilayah.json` / `api/*.json`: same structures as Section 2 — ready to serve as static files.
- `wilayah.sql`: `INSERT` statements with columns `kode, nama, capital, lat, lng, elv, tz, total_area, population, postal_code` — import into MySQL/Postgres.
- `wilayah.csv`: merged table with `kode,nama,postal_code` plus rich columns for provinces/regencies.

## 4. How IDs and Relationships Work

- The `kode` / `id` is the primary key. Split by `.` to get the parent: `32.73.01.1001` → province `32`, regency `32.73`, district `32.73.01`.
- Hierarchy is always `province → regency → district → village`.
- `postal_code` lives on the village. Use `postal-codes/{code}.json` to find all villages sharing a code.

## 5. How to Use (for the AI)

- If the user wants to fetch: call the endpoints in Section 2 in order `provinces → regencies/{prov} → districts/{reg} → villages/{dist}`. Always use the real `kode` from the previous response, never guess. Check `has_path` before fetching `/paths/{id}.json`.
- If the user wants to self-host: suggest `npx wilayah download --format <...>` and point to the columns above. Let the user choose the format that fits their database.
- For maps, all levels have `lat/lng` and may have polygons when `has_path=true` — check the flag first.
- To monitor coverage: fetch `/missings.json` — each entry `{id,name,has_path,has_latlng}` appears if `!has_path || !has_latlng`; use `summary` to see totals by level.

## References

- Live API: `https://www.emsifa.com/api-wilayah-indonesia/v2`
- Spec: `openapi.yml` and `wilayah-postman.json` at the same base URL
- Stats: `api/stats.json`, `api/provinces.json`
