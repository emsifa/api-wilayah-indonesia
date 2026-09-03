# API Data Wilayah Indonesia

Repository untuk generate **(REST) API statis** berisi data wilayah Indonesia — provinsi, kabupaten/kota, kecamatan, desa/kelurahan, kode pos, dan boundary polygon — serta cara mendeploynya ke *static hosting* (GitHub Pages / Cloudflare Pages / Vercel / Nginx).

> API statis = endpoint-nya cuma file JSON statis. Tanpa server, tanpa API key, tanpa rate limit dari kami. Tinggal `fetch`.

**Demo / Playground:** [https://www.emsifa.com/api-wilayah-indonesia](https://www.emsifa.com/api-wilayah-indonesia) — coba pilih provinsi → kab/kota → kecamatan → desa, peta auto-zoom + lihat request URL real-time.

**Base URL:** `https://www.emsifa.com/api-wilayah-indonesia/v2`

**Stats terbaru** (`GET /stats.json`):

```json
{
  "total_provinces": 38,
  "total_regencies": 514,
  "total_districts": 7285,
  "total_villages": 83762,
  "total_postal_codes": 10632,
  "total_paths": 91238,
  "total_endpoints": 201309
}
```

---

#### Apa yang dimaksud API statis?

API statis adalah API yang *endpoint*-nya terdiri dari file statis (JSON). Tidak ada server-side scripting saat request — file sudah di-generate sebelumnya.

#### Keuntungan API statis?

* Dapat dihosting di *static file hosting* seperti GitHub Pages, Netlify, Cloudflare Pages, Vercel, bahkan Nginx.
* Proses lebih cepat karena tidak butuh server — langsung di-cache CDN.
* Gratis & simpel. Cocok untuk MVP, frontend-only, atau edge functions.

#### Bagaimana cara kerjanya?

* Daftar wilayah disimpan di `data/` berupa `csv` (agar mudah diedit): `wilayah.csv` (hirarki), `wilayah_level_1_2.csv` (data rich provinsi/kab-kota), `wilayah_kodepos.csv` (mapping kode pos).
* Script Go di `tools/` dijalankan — membaca `csv` di `data/` lalu men-generate ribuan file JSON ke `api/` (`api/provinces.json`, `api/regencies/*.json`, `api/districts/*.json`, `api/villages/*.json`, `api/postal-codes/*.json`, `api/paths/*.json`, `api/missings.json`, `api/stats.json`).
* Hasil `api/` tinggal di-copy ke `deploy/v2/` bareng hasil build `web/dist` lalu di-push ke branch `gh-pages` (lihat `.github/workflows/deploy.yml:92-115`).
* API siap dihidangkan. Update otomatis tiap Minggu via cron `0 0 * * 0` (lihat `deploy.yml:3`).

#### Dua cara pakai — mau yang mana?

* **Static API (fetch):** Paling cepat untuk MVP / frontend. Tinggal `fetch("https://www.emsifa.com/api-wilayah-indonesia/v2/provinces.json")`. Tanpa DB, include polygon kalau `has_path=true`. Data di-cache CDN.
* **Download & Self-host (soon):** Butuh validasi offline, FK, atau query kompleks (`WHERE postal_code = ?`). Download full dataset — `npx @emsifa/wilayah download --format csv|sql|json --output ./wilayah.<ext>` (soon, lihat `web/src/components/sections/CliSection.tsx:12-19`) atau clone repo ini dan serve folder `api/` di hosting kamu sendiri.

Tanya AI kamu juga bisa — install `SKILL.md` biar nggak ngarang kode wilayah (lihat seksi [Skill untuk AI](#skill-untuk-ai)).

---

## Format Response

Semua endpoint mengembalikan wrapper yang sama:

```json
{
  "data": <object | array>,
  "meta": {
    "updated_at": "2026-09-03",
    "level": 1
  }
}
```

* `data`: payload sebenarnya (lihat per endpoint di bawah).
* `meta.updated_at` / `meta.generated_at`: kapan file di-generate.
* `meta.level`: kedalaman `0=stats, 1=province, 2=regency, 3=district, 4=village/postal` (lihat `SKILL.md:30-35`).

**Catatan ID:** Format v2 pakai titik sebagai separator hirarki (beda dengan v1 `1103010`):
`11` (provinsi) → `11.01` (kab) → `11.01.01` (kec) → `11.01.01.2001` (desa). Hitung titik untuk tahu level (lihat `SKILL.md:165`).

**`has_path` & `has_latlng`:** Setiap item punya `has_path` (boolean, `true` jika `GET /paths/{id}.json` ada). Cek dulu sebelum fetch polygon biar nggak 404. `has_latlng` cek di `/missings.json`.

---

## ENDPOINTS

Base: `https://www.emsifa.com/api-wilayah-indonesia/v2` — semua `GET`, tanpa auth.

| Path | Mengembalikan |
|---|---|
| `/stats.json` | Ringkasan total semua level |
| `/provinces.json` | Semua provinsi (detailed, level 1) |
| `/provinces/{code}.json` | Satu provinsi, mis. `32` |
| `/regencies/{province_code}.json` | Daftar kab/kota di provinsi itu (level 2) |
| `/regencies/{regency_code}.json` | Satu kab/kota + parent provinsi |
| `/districts/{regency_code}.json` | Daftar kecamatan di kab/kota itu (level 3, compact + lat/lng + has_path) |
| `/districts/{district_code}.json` | Satu kecamatan + parent provinsi/regency |
| `/villages/{district_code}.json` | Daftar desa/kelurahan di kecamatan itu (level 4, + postal_code + lat/lng + has_path) |
| `/villages/{village_code}.json` | Satu desa/kelurahan + postal_code + parent lengkap |
| `/postal-codes/{postal_code}.json` | Semua desa yang pakai kode pos itu |
| `/paths/{code}.json` | Polygon boundary untuk level mana saja (fetch hanya jika `has_path=true`) |
| `/missings.json` | Daftar wilayah dimana `has_path==false` OR `has_latlng==false` (flat + `summary.by_level`) |

Spec lengkap: `openapi.yml` & `wilayah-postman.json` di base URL — lihat di [website #api](https://www.emsifa.com/api-wilayah-indonesia#api).

---

#### 1. Mengambil Ringkasan (Stats)

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/stats.json
```

Contoh Response:

```json
{
  "data": {
    "total_area": 1889518.254,
    "total_districts": 7285,
    "total_paths": 91238,
    "total_population": 284973643,
    "total_postal_codes": 10632,
    "total_provinces": 38,
    "total_regencies": 514,
    "total_villages": 83762,
    "total_endpoints": 201309,
    "total_filesize": 300423246,
    "total_filesize_human": "286.51 MB",
    "total_disk_usage": 915771392,
    "total_disk_usage_human": "873.35 MB"
  },
  "meta": {
    "level": 0,
    "updated_at": "2026-09-03"
  }
}
```

---

#### 2. Mengambil Daftar Provinsi

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/provinces.json
```

Contoh Response:

```json
{
  "data": [
    {
      "id": "11",
      "name": "Aceh",
      "capital": "Banda Aceh",
      "lat": 5.570546962920454,
      "lng": 95.34080851187178,
      "elv": 11,
      "tz": 7,
      "population": 5623479,
      "total_area": 56835.019,
      "has_path": true
    },
    {
      "id": "12",
      "name": "Sumatera Utara",
      "capital": "Medan",
      "lat": 3.5806304901245087,
      "lng": 98.67199998443536,
      "elv": 32,
      "tz": 7,
      "population": 15640905,
      "total_area": 72437.755,
      "has_path": true
    }
  ],
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 1
  }
}
```

Field rich `capital, lat, lng, elv, tz, population, total_area` hanya ada di level 1–2 (provinsi & kab/kota). Level 3–4 pakai bentuk compact (lihat `SKILL.md:36-76`).

---

#### 3. Mengambil Data Provinsi berdasarkan ID

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/provinces/32.json
```

Contoh untuk Jawa Barat (ID = `32`):

```json
{
  "data": {
    "id": "32",
    "name": "Jawa Barat",
    "capital": "Bandung",
    "lat": -6.902224715926122,
    "lng": 107.61875975420881,
    "elv": 739,
    "tz": 7,
    "population": 51316378,
    "total_area": 37053.331,
    "has_path": true
  },
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 1
  }
}
```

---

#### 4. Mengambil Daftar Kab/Kota pada Provinsi Tertentu

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/regencies/{provinceId}.json
```

Contoh untuk Jawa Barat (ID = `32`):

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/regencies/32.json
```

Contoh Response:

```json
{
  "data": [
    {
      "id": "32.01",
      "name": "Kabupaten Bogor",
      "capital": "Cibinong",
      "lat": -6.479478948089524,
      "lng": 106.82471731002641,
      "elv": 134,
      "tz": 7,
      "population": 5809790,
      "total_area": 2991.778,
      "has_path": true
    },
    {
      "id": "32.02",
      "name": "Kabupaten Sukabumi",
      "capital": "Palabuhanratu",
      "lat": -6.989164614549726,
      "lng": 106.55022261003006,
      "elv": 16,
      "tz": 7,
      "population": 2868943,
      "total_area": 4163.824,
      "has_path": true
    }
  ],
  "meta": {
    "level": 2,
    "updated_at": "2026-09-03"
  }
}
```

---

#### 5. Mengambil Data Kab/Kota berdasarkan ID

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/regencies/{regencyId}.json
```

Contoh untuk Kota Bandung (ID = `32.73`):

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/regencies/32.73.json
```

```json
{
  "data": {
    "id": "32.73",
    "name": "Kota Bandung",
    "capital": "Bandung",
    "lat": -6.910655826355507,
    "lng": 107.60986952537303,
    "elv": 726,
    "tz": 7,
    "population": 2591763,
    "total_area": 166.593,
    "has_path": true,
    "province": { "id": "32", "name": "Jawa Barat" }
  },
  "meta": { "level": 2, "generated_at": "2026-09-02T03:35:49Z" }
}
```

`province` selalu ikut di detail regency. Untuk level lebih dalam, parent bertambah (lihat bawah).

---

#### 6. Mengambil Daftar Kecamatan pada Kab/Kota Tertentu

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/districts/{regencyId}.json
```

Contoh untuk Kota Bandung (ID = `32.73`):

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/districts/32.73.json
```

```json
{
  "data": [
    { "id": "32.73.01", "name": "Sukasari", "lat": -6.86671, "lng": 107.58716, "has_path": true },
    { "id": "32.73.02", "name": "Coblong", "lat": -6.88488, "lng": 107.61538, "has_path": true },
    { "id": "32.73.03", "name": "Babakan Ciparay", "lat": -6.94369, "lng": 107.57854, "has_path": true }
  ],
  "meta": { "level": 3, "updated_at": "2026-09-03" }
}
```

Bentuk compact tapi sudah ada `lat/lng + has_path` untuk peta & filter polygon.

---

#### 7. Mengambil Data Kecamatan berdasarkan ID

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/districts/{districtId}.json
```

Contoh untuk Sukasari (ID = `32.73.01`):

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/districts/32.73.01.json
```

```json
{
  "data": {
    "id": "32.73.01",
    "name": "Sukasari",
    "lat": -6.866710075709871,
    "lng": 107.58716604539175,
    "has_path": true,
    "province": { "id": "32", "name": "Jawa Barat" },
    "regency": { "id": "32.73", "name": "Kota Bandung" }
  },
  "meta": { "level": 3, "updated_at": "2026-09-03" }
}
```

---

#### 8. Mengambil Daftar Kelurahan/Desa pada Kecamatan Tertentu

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/villages/{districtId}.json
```

Contoh untuk Sukasari (ID = `32.73.01`):

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/villages/32.73.01.json
```

```json
{
  "data": [
    { "id": "32.73.01.1001", "name": "Sukarasa", "postal_code": "40152", "lat": -6.87422, "lng": 107.58539, "has_path": true },
    { "id": "32.73.01.1002", "name": "Gegerkalong", "postal_code": "40153", "lat": -6.86935, "lng": 107.58886, "has_path": true },
    { "id": "32.73.01.1003", "name": "Isola", "postal_code": "40154", "lat": -6.85353, "lng": 107.59309, "has_path": true }
  ],
  "meta": { "level": 4, "updated_at": "2026-09-03" }
}
```

Level 4 sudah include `postal_code` — bisa filter by kode pos tanpa lookup tambahan.

---

#### 9. Mengambil Data Kelurahan/Desa berdasarkan ID

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/villages/{villageId}.json
```

Contoh untuk Sukarasa (ID = `32.73.01.1001`):

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/villages/32.73.01.1001.json
```

```json
{
  "data": {
    "id": "32.73.01.1001",
    "name": "Sukarasa",
    "postal_code": "40152",
    "lat": -6.874227470295148,
    "lng": 107.58539617161965,
    "has_path": true,
    "province": { "id": "32", "name": "Jawa Barat" },
    "regency": { "id": "32.73", "name": "Kota Bandung" },
    "district": { "id": "32.73.01", "name": "Sukasari" }
  },
  "meta": { "level": 4, "updated_at": "2026-09-03" }
}
```

Parent lengkap `province → regency → district` selalu ada di detail village.

---

#### 10. Mengambil Daftar Kelurahan/Desa berdasarkan Kode Pos

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/postal-codes/{postalCode}.json
```

Contoh untuk `40152`:

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/postal-codes/40152.json
```

```json
{
  "data": [
    {
      "id": "32.73.01.1001",
      "name": "Sukarasa",
      "postal_code": "40152",
      "province": { "id": "32", "name": "Jawa Barat" },
      "regency": { "id": "32.73", "name": "Kota Bandung" },
      "district": { "id": "32.73.01", "name": "Sukasari" }
    }
  ],
  "meta": { "level": 4, "updated_at": "2026-09-03" }
}
```

Satu kode pos bisa dipakai banyak desa — response selalu array.

---

#### 11. Mengambil Polygon / Boundary

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/paths/{code}.json
```

Contoh untuk Jawa Barat (ID = `32`). **Cek `has_path` dulu** — kalau `false`, endpoint ini 404.

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/paths/32.json
```

```json
{
  "data": {
    "id": "32",
    "path": [
      [ [-6.980237, 106.395627], [-6.934294, 106.390694], [-6.921623, 106.399689] ]
    ]
  },
  "meta": { "level": 1, "updated_at": "2026-09-03" }
}
```

* Polygon tersedia untuk semua level selama `has_path=true` (83k+ paths sudah tersedia).
* Ada yang 1 ring (single island), ada yang banyak (Jakarta 2 rings, Aceh 28, Papua Barat 1455). Kode peta harus handle multi-ring: kumpulkan semua ring yang punya >2 titik.
* Koordinat `[lat, lng]`, 6 desimal (~11 cm presisi), sudah di-simplify biar file kecil. Butuh resolusi tinggi? Ambil langsung dari `cahyadsn/wilayah_boundaries`.

Contoh pakai Leaflet (coba interaktif di [website #playground](https://www.emsifa.com/api-wilayah-indonesia#playground)):

```js
const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/v2/paths/32.73.json");
if (!res.ok) return; // has_path == false
const { data } = await res.json();
const rings = [];
const collect = (node) => {
  if (Array.isArray(node[0]) && typeof node[0][0] === "number") { rings.push(node); return; }
  for (const c of node) collect(c);
};
collect(data.path);
const valid = rings.filter(r => r.length > 2);
L.polygon(valid).addTo(map);
```

---

#### 12. Mengambil Daftar Wilayah yang Belum Lengkap (Missings)

```
GET https://www.emsifa.com/api-wilayah-indonesia/v2/missings.json
```

Berisi wilayah dimana `has_path==false` OR `has_latlng==false` — flat list + summary.

```json
{
  "data": [
    { "id": "11.16.06.2021", "name": "Alur Mentawak", "has_path": false, "has_latlng": false },
    { "id": "32.73.01.1001", "name": "Sukarasa", "has_path": true, "has_latlng": true }
  ],
  "meta": { "level": 0, "updated_at": "2026-09-03" },
  "summary": {
    "total_missing": 360,
    "total_missing_path": 320,
    "total_missing_latlng": 40,
    "total_missing_both": 12,
    "by_level": { "province": 0, "regency": 0, "district": 0, "village": 360 }
  }
}
```

* Muncul hanya jika `!has_path || !has_latlng`.
* `summary.by_level` pakai hitungan titik: `0=province, 1=regency (1 titik), 2=district (2 titik), 3=village (3 titik)`.

---

## CLI — `npx @emsifa/wilayah`

Repo ini ships CLI `@emsifa/wilayah` (`cli/`). Lihat `cli/README.md` untuk docs lengkap. Versi publish: `0.1.1` (MIT).

```bash
# Install skill untuk AI agent (Claude Code, Codex, OpenCode, Antigravity, Kiro, dll)
npx @emsifa/wilayah skill
bunx @emsifa/wilayah skill
```

Interactive flow multi-select (mirip `create-next-app`): checklist agent → pilih scope Project/Global → jika `Others` masukkan custom path (mis. `.cursor/skills/wilayah-indonesia/SKILL.md`) → konfirmasi overwrite/append.

Non-interactive (CI):

```bash
npx @emsifa/wilayah skill --agent claude --yes
npx @emsifa/wilayah skill --agent claude,antigravity --yes
npx @emsifa/wilayah skill --agent all --global --yes
npx @emsifa/wilayah skill --agent others --target ./.cursor/skills/wilayah-indonesia/SKILL.md --yes
npx @emsifa/wilayah skill --agent codex --dry-run
```

Opsi: `--agent <claude|codex|opencode|antigravity|kiro|others|all>` (comma-separated), `--target/--out <path>`, `--global`, `--yes/-y`, `--dry-run`, `--cwd <path>` (lihat `cli/README.md:58-66`).

Tab lain di landing ([website #cli](https://www.emsifa.com/api-wilayah-indonesia#cli)) — `download` & `scaffold` — masih `Soon`:

```bash
# Soon — download full dataset untuk self-host
npx @emsifa/wilayah download --format csv --output ./wilayah.csv
npx @emsifa/wilayah download --format sql --output ./wilayah.sql
npx @emsifa/wilayah download --format json --output ./wilayah.json

# Soon — scaffold schema/migration
npx @emsifa/wilayah scaffold --orm laravel
npx @emsifa/wilayah scaffold --orm prisma
npx @emsifa/wilayah scaffold --orm drizzle
```

---

## Skill untuk AI

Biar AI nggak ngarang kode wilayah — install contekan `SKILL.md`:

```bash
npx @emsifa/wilayah skill --agent claude
# → .claude/skills/wilayah-indonesia/SKILL.md
```

Atau copy manual `SKILL.md` dari root repo ke `.opencode/skills/wilayah-indonesia/SKILL.md` / `.codex/skills/wilayah-indonesia/SKILL.md` — panduan di [website #skill](https://www.emsifa.com/api-wilayah-indonesia#skill).

Isinya (lihat `SKILL.md:17-35`): kapan pakai Static API vs Download, base URL, wrapper `{data, meta}`, field per level, daftar 13 endpoint, cara handle `has_path`, dan mapping `kode` pakai titik. Coba tanya AI: *“Carikan semua kecamatan di Kota Bandung”* → dia akan `fetch /districts/32.73.json` beneran.

Live API: `https://www.emsifa.com/api-wilayah-indonesia/v2` — Spec: `openapi.yml` & `wilayah-postman.json` di base URL yang sama.

---

## Saya mau hosting di Github saya sendiri, bagaimana caranya?

Sama seperti repo lama (`README.md` lama: fork → Pages → `gh-pages`).

1. Klik **Fork** di pojok kanan atas → pada halaman forking, **HAPUS CENTANG** "Copy the `main` branch only" → Create Fork.
2. Settings (bukan setting account, tapi setting repository) → menu **Pages**:
   * Source: **Deploy from a Branch**
   * Branch: `gh-pages`
   * Direktori: `/root`
   * Save
3. Tunggu 5–10 menit, kembali ke home repo `https://github.com/usernamekamu/api-wilayah-indonesia`. Kalau sudah terdeploy, di kanan halaman muncul **Environments** → klik `🚀 github-pages` → View Deployment.

> Repo ini deploy via `peaceiris/actions-gh-pages@v4` (`deploy.yml:106-115`) dengan `keep_files: true` — folder `web/dist` + `api/` (sebagai `v2/`) di-push ke `gh-pages`. Hasilnya API kamu ada di `https://usernamekamu.github.io/api-wilayah-indonesia/v2/...` (ganti `BASE` di `web/src/components/api/apiSpec.ts:20` jika self-host).

Untuk hosting di Cloudflare Pages / Vercel / Netlify / Nginx — cukup serve folder `api/` sebagai static files (atau `npx wilayah download --format json` lalu serve). Nggak perlu server.

---

## Cara Generate Sendiri (Go Tools)

Butuh build lokal tanpa nunggu cron mingguan? Tools ada di `tools/` (lihat `tools/main.go:8-23`):

```bash
# 1. Extract CSV dari SQL dump cahyadsn (ephemeral, lihat deploy.yml:38-41)
go run ./tools extract-csv https://raw.githubusercontent.com/cahyadsn/wilayah/refs/heads/master/db/wilayah.sql
go run ./tools extract-csv https://raw.githubusercontent.com/cahyadsn/wilayah/refs/heads/master/db/wilayah_level_1_2.sql
go run ./tools extract-csv https://raw.githubusercontent.com/cahyadsn/wilayah_kodepos/refs/heads/main/db/wilayah_kodepos.sql

# 2. Generate API statis (data/ → api/)
go run ./tools generate-static-api -data data -out api -v

# 3. Generate boundaries (download & convert polygon)
go run ./tools generate-boundaries -data-boundaries data/boundaries -out api -v

# 4. Patch has_path (cek api/paths/* → inject ke provinces/regencies/districts/villages)
go run ./tools add-has-path -out api -v

# 5. Generate missings.json
go run ./tools generate-missings -out api -v

# 6. Update stats (endpoints & filesize)
go run ./tools update-stats -out api -v

# Cek hasil
cat api/stats.json | jq .
du -sh api && find api -type f | wc -l
```

Urutan sesuai `deploy.yml:38-88`. `generate-boundaries` punya cache `.cache/wilayah_boundaries.zip` biar nggak download ulang.

---

## LIMITASI

Karena dihosting di **GitHub Pages** (CDN Fastly, CORS enabled), batasan mengikuti Pages bukan dari kami (lihat [website #faq](https://www.emsifa.com/api-wilayah-indonesia#faq)):

* **Repo 1 GB & bandwidth 100 GB/bulan** — API ini sekitar 201k file (`total_endpoints: 201309`), `~286 MB` filesize / `~873 MB` disk usage — masih di bawah limit tapi file banyak jadi mendekati *soft limit* GitHub.
* **10 builds/jam** — deploy via Actions, bukan per-request.
* **Tanpa rate limit dari kami** — kalau traffic membludak, yang kena adalah limit bandwidth GitHub (bukan `429` dari API ini).
* Polygon di-simplify & beberapa wilayah masih di `/missings.json`.

> **Butuh lebih leluasa? Self-host aja** di GitHub Pages kamu sendiri (seksi di atas) atau di Cloudflare/Vercel. Dengan self-host, kamu kontrol domain, cache, dan nggak nebeng quota orang lain. Rata-rata 1 endpoint ~1–2 KB, jadi 100 GB ≈ 50–100 jt request/bulan.

Detail limit GitHub Pages: [help.github.com/en/articles/about-github-pages#usage-limits](https://help.github.com/en/articles/about-github-pages#usage-limits).

---

## Sumber Data

Repo ini hanya agregator & pre-renderer jadi JSON statis. Sumber asli dari 3 repo [cahyadsn](https://github.com/cahyadsn) (lihat [website #faq](https://www.emsifa.com/api-wilayah-indonesia#faq)):

* **cahyadsn/wilayah** `db/wilayah.sql`, `db/wilayah_level_1_2.sql` — hirarki wilayah & data rich provinsi/kab-kota (`kode, nama, ibukota, lat/lng, elv, tz, luas, penduduk, path`). Rujukan: Kepmendagri No. 300.2.2-2430 Tahun 2025 (pemutakhiran 300.2.2-2138/2025, 100.1.1-6117/2022), luas dari BIG (Surat Deputi BIG B-16.10/DIGD-BIG/IGD.04.04/12/2024), penduduk dari Ditjen Dukcapil Kemendagri Semester II 2024, pulau dari Gazeter Republik Indonesia (GRI) 2024 BIG.
* **cahyadsn/wilayah_kodepos** `db/wilayah_kodepos.sql` — `postal_code` untuk 83.762 desa/kelurahan, tabel `wilayah_kodepos(kode, kodepos)`, endpoint `/postal-codes/{kode}.json`.
* **cahyadsn/wilayah_boundaries** `db/kec/*.sql`, `db/kel/*/*.sql` — polygon & centroid kecamatan/kelurahan dari BIG (tanahair.indonesia.go.id), multipolygon simplified, untuk `/paths/{kode}.json` dan `lat/lng` di districts/villages.

Jika ada selisih, rujukan resminya tetap Kepmendagri & BIG.

---

## FAQ Singkat

**Apakah gratis?** Ya, 100% MIT — baik repo ini maupun 3 repo sumber cahyadsn. Bebas komersial, tanpa API key.

**Seberapa sering update?** Otomatis tiap Minggu `0 0 * * 0` UTC via `deploy.yml:3`, plus bisa trigger manual `workflow_dispatch` atau `push` ke `main`/`v2`. Cek `meta.updated_at` di `/stats.json`.

**Seberapa akurat lat/lng & polygon?** Provinsi/kab-kota dari Google Maps, kecamatan/kelurahan centroid dari polygon BIG. Polygon 6 desimal (~11 cm), multi-ring untuk kepulauan. Cek `has_path`/`has_latlng` atau `/missings.json`. Butuh high-res? Ambil langsung dari BIG / `wilayah_boundaries` tanpa simplify.

**Data salah?** Lapor ke hulu: [cahyadsn/wilayah](https://github.com/cahyadsn/wilayah/issues) / [wilayah_kodepos](https://github.com/cahyadsn/wilayah_kodepos/issues) / [wilayah_boundaries](https://github.com/cahyadsn/wilayah_boundaries/issues) (sertakan `kode` mis. `32.73.01.1001` + sumber Kepmendagri/BIG). Kalau bug render API/`has_path`/`missings` → [emsifa/api-wilayah-indonesia/issues](https://github.com/emsifa/api-wilayah-indonesia/issues).

---

## Lisensi

MIT — lihat `LICENSE`. Bebas pakai personal/komersial, cukup cantumkan atribusi ke sumber data jika publish ulang.

---

## Kontribusi

PR & issue welcome. Untuk data wilayah/kodepos/polygon, fix paling cepat adalah buka issue di repo `cahyadsn/*` — nanti kebawa otomatis di deploy mingguan berikutnya.

