export type SnippetLang =
  | "curl"
  | "fetch"
  | "axios"
  | "laravel"
  | "go"
  | "python"
  | "php"
  | "dart";

export type ApiEndpoint = {
  method: "GET";
  path: string;
  description: string;
  curl: string;
  snippets: Record<SnippetLang, string>;
  response: string;
};

const BASE = "https://www.emsifa.com/api-wilayah-indonesia/v2";

// Response diambil dari output tools/generate_static_api.go (genResponse + genPlace / genShortItem)
// Lihat api/*.json setelah go run ./tools generate-static-api
export const apiEndpoints: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/stats.json",
    description:
      "Intip ringkasannya dulu — total provinsi, kab/kota, kecamatan, kelurahan, kode pos, luas & populasi",
    curl: `curl ${BASE}/stats.json`,
    snippets: {
      curl: `curl ${BASE}/stats.json`,
      fetch: `const res = await fetch("${BASE}/stats.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/stats.json"
);`,
      laravel: `$response = Http::get("${BASE}/stats.json");
$data = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/stats.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/stats.json")
data = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/stats.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$data = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/stats.json"));
final data = jsonDecode(res.body)["data"];`,
    },
    response: `{
  "data": {
    "total_area": 1889518.254,
    "total_disk_usage": 915771392,
    "total_disk_usage_human": "873.35 MB",
    "total_districts": 7285,
    "total_endpoints": 201309,
    "total_filesize": 300423246,
    "total_filesize_human": "286.51 MB",
    "total_paths": 91238,
    "total_population": 284973643,
    "total_postal_codes": 10632,
    "total_provinces": 38,
    "total_regencies": 514,
    "total_villages": 83762
  },
  "meta": {
    "level": 0,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/provinces.json",
    description:
      "Ambil semua provinsi — lengkap sama kapital, koordinat, populasi & luasnya (level 1)",
    curl: `curl ${BASE}/provinces.json`,
    snippets: {
      curl: `curl ${BASE}/provinces.json`,
      fetch: `const res = await fetch("${BASE}/provinces.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/provinces.json"
);`,
      laravel: `$response = Http::get("${BASE}/provinces.json");
$provinces = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/provinces.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/provinces.json")
provinces = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/provinces.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$provinces = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/provinces.json"));
final provinces = jsonDecode(res.body)["data"] as List;`,
    },
    response: `{
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
      "id": "31",
      "name": "Daerah Khusus Ibukota Jakarta",
      "capital": "Jakarta",
      "lat": -6.177801577599116,
      "lng": 106.82844443327093,
      "elv": -4,
      "tz": 7,
      "population": 11038216,
      "has_path": true
    }
    // ... 36 more (total 38)
  ],
  "meta": {
    "level": 1,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/provinces/{province_id}.json",
    description:
      "Kepoin satu provinsi aja by kode — misal 32 = Jawa Barat (level 1)",
    curl: `curl ${BASE}/provinces/32.json`,
    snippets: {
      curl: `curl ${BASE}/provinces/32.json`,
      fetch: `const res = await fetch("${BASE}/provinces/32.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/provinces/32.json"
);`,
      laravel: `$response = Http::get("${BASE}/provinces/32.json");
$province = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/provinces/32.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/provinces/32.json")
province = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/provinces/32.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$province = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/provinces/32.json"));
final province = jsonDecode(res.body)["data"] as Map;`,
    },
    response: `{
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
    "level": 1,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/regencies/{province_id}.json",
    description:
      "Daftar kab/kota di provinsi tertentu — misal semua kota di Jawa Barat (level 2)",
    curl: `curl ${BASE}/regencies/32.json`,
    snippets: {
      curl: `curl ${BASE}/regencies/32.json`,
      fetch: `const res = await fetch("${BASE}/regencies/32.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/regencies/32.json"
);`,
      laravel: `$response = Http::get("${BASE}/regencies/32.json");
$regencies = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/regencies/32.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/regencies/32.json")
regencies = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/regencies/32.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$regencies = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/regencies/32.json"));
final regencies = jsonDecode(res.body)["data"] as List;`,
    },
    response: `{
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
    // ... 25 more (total 27 regencies in Jawa Barat)
  ],
  "meta": {
    "level": 2,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/regencies/{regency_id}.json",
    description:
      "Detail satu kab/kota by kode — bonus info provinsinya juga (level 2)",
    curl: `curl ${BASE}/regencies/32.73.json`,
    snippets: {
      curl: `curl ${BASE}/regencies/32.73.json`,
      fetch: `const res = await fetch("${BASE}/regencies/32.73.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/regencies/32.73.json"
);`,
      laravel: `$response = Http::get("${BASE}/regencies/32.73.json");
$regency = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/regencies/32.73.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/regencies/32.73.json")
regency = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/regencies/32.73.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$regency = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/regencies/32.73.json"));
final regency = jsonDecode(res.body)["data"] as Map;`,
    },
    response: `{
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
    "province": {
      "id": "32",
      "name": "Jawa Barat",
      "has_path": true
    }
  },
  "meta": {
    "level": 2,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/districts/{regency_id}.json",
    description:
      "Daftar kecamatan di kab/kota tertentu — lengkap dengan koordinat lat/lng (level 3)",
    curl: `curl ${BASE}/districts/32.73.json`,
    snippets: {
      curl: `curl ${BASE}/districts/32.73.json`,
      fetch: `const res = await fetch("${BASE}/districts/32.73.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/districts/32.73.json"
);`,
      laravel: `$response = Http::get("${BASE}/districts/32.73.json");
$districts = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/districts/32.73.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/districts/32.73.json")
districts = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/districts/32.73.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$districts = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/districts/32.73.json"));
final districts = jsonDecode(res.body)["data"] as List;`,
    },
    response: `{
  "data": [
    { "id": "32.73.01", "name": "Sukasari", "lat": -6.866710075709871, "lng": 107.58716604539175, "has_path": true },
    { "id": "32.73.02", "name": "Coblong", "lat": -6.884883447472015, "lng": 107.61538017670745, "has_path": true }
    // ... 28 more
  ],
  "meta": {
    "level": 3,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/districts/{district_id}.json",
    description:
      "Detail satu kecamatan — plus tau dia dari provinsi & kab/kota mana, lengkap dengan koordinat (level 3)",
    curl: `curl ${BASE}/districts/32.73.01.json`,
    snippets: {
      curl: `curl ${BASE}/districts/32.73.01.json`,
      fetch: `const res = await fetch("${BASE}/districts/32.73.01.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/districts/32.73.01.json"
);`,
      laravel: `$response = Http::get("${BASE}/districts/32.73.01.json");
$district = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/districts/32.73.01.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/districts/32.73.01.json")
district = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/districts/32.73.01.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$district = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/districts/32.73.01.json"));
final district = jsonDecode(res.body)["data"] as Map;`,
    },
    response: `{
  "data": {
    "id": "32.73.01",
    "name": "Sukasari",
    "lat": -6.866710075709871,
    "lng": 107.58716604539175,
    "has_path": true,
    "province": {
      "id": "32",
      "name": "Jawa Barat",
      "has_path": true
    },
    "regency": {
      "id": "32.73",
      "name": "Kota Bandung",
      "has_path": true
    }
  },
  "meta": {
    "level": 3,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/villages/{district_id}.json",
    description:
      "Daftar kelurahan/desa di kecamatan itu — udah include kode pos dan koordinat (level 4)",
    curl: `curl ${BASE}/villages/32.73.01.json`,
    snippets: {
      curl: `curl ${BASE}/villages/32.73.01.json`,
      fetch: `const res = await fetch("${BASE}/villages/32.73.01.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/villages/32.73.01.json"
);`,
      laravel: `$response = Http::get("${BASE}/villages/32.73.01.json");
$villages = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/villages/32.73.01.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/villages/32.73.01.json")
villages = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/villages/32.73.01.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$villages = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/villages/32.73.01.json"));
final villages = jsonDecode(res.body)["data"] as List;`,
    },
    response: `{
  "data": [
    {
      "id": "32.73.01.1001",
      "name": "Sukarasa",
      "postal_code": "40152",
      "lat": -6.874227470295148,
      "lng": 107.58539617161965,
      "has_path": true
    },
    {
      "id": "32.73.01.1002",
      "name": "Gegerkalong",
      "postal_code": "40153",
      "lat": -6.869350446627759,
      "lng": 107.58886500774767,
      "has_path": true
    }
    // ... 2 more
  ],
  "meta": {
    "level": 4,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/villages/{village_id}.json",
    description:
      "Detail satu kelurahan/desa — lengkap kode pos, koordinat + provinsi, kab/kota, kecamatan (level 4)",
    curl: `curl ${BASE}/villages/32.73.01.1001.json`,
    snippets: {
      curl: `curl ${BASE}/villages/32.73.01.1001.json`,
      fetch: `const res = await fetch("${BASE}/villages/32.73.01.1001.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/villages/32.73.01.1001.json"
);`,
      laravel: `$response = Http::get("${BASE}/villages/32.73.01.1001.json");
$village = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/villages/32.73.01.1001.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/villages/32.73.01.1001.json")
village = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/villages/32.73.01.1001.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$village = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/villages/32.73.01.1001.json"));
final village = jsonDecode(res.body)["data"] as Map;`,
    },
    response: `{
  "data": {
    "id": "32.73.01.1001",
    "name": "Sukarasa",
    "postal_code": "40152",
    "lat": -6.874227470295148,
    "lng": 107.58539617161965,
    "has_path": true,
    "province": {
      "id": "32",
      "name": "Jawa Barat",
      "has_path": true
    },
    "regency": {
      "id": "32.73",
      "name": "Kota Bandung",
      "has_path": true
    },
    "district": {
      "id": "32.73.01",
      "name": "Sukasari",
      "has_path": true
    }
  },
  "meta": {
    "level": 4,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/postal-codes/{postal_code}.json",
    description:
      "Cari kelurahan by kode pos — misal 40152 tuh daerah mana aja (level 4)",
    curl: `curl ${BASE}/postal-codes/40152.json`,
    snippets: {
      curl: `curl ${BASE}/postal-codes/40152.json`,
      fetch: `const res = await fetch("${BASE}/postal-codes/40152.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/postal-codes/40152.json"
);`,
      laravel: `$response = Http::get("${BASE}/postal-codes/40152.json");
$villages = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/postal-codes/40152.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/postal-codes/40152.json")
villages = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/postal-codes/40152.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$villages = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/postal-codes/40152.json"));
final villages = jsonDecode(res.body)["data"] as List;`,
    },
    response: `{
  "data": [
    {
      "id": "32.73.01.1001",
      "name": "Sukarasa",
      "postal_code": "40152",
      "has_path": true,
      "province": {
        "id": "32",
        "name": "Jawa Barat",
        "has_path": true
      },
      "regency": {
        "id": "32.73",
        "name": "Kota Bandung",
        "has_path": true
      },
      "district": {
        "id": "32.73.01",
        "name": "Sukasari",
        "has_path": true
      }
    }
  ],
  "meta": {
    "level": 4,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/paths/{region_id}.json",
    description:
      "Butuh polygon buat peta? Ambil garis batas wilayah di sini — support semua level: provinsi, kab/kota, kecamatan, kelurahan (compact JSON)",
    curl: `curl ${BASE}/paths/32.json`,
    snippets: {
      curl: `curl ${BASE}/paths/32.json`,
      fetch: `const res = await fetch("${BASE}/paths/32.json");
const { data, meta } = await res.json();`,
      axios: `const { data: { data, meta } } = await axios.get(
  "${BASE}/paths/32.json"
);`,
      laravel: `$response = Http::get("${BASE}/paths/32.json");
$path = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/paths/32.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/paths/32.json")
path = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/paths/32.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$path = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/paths/32.json"));
final path = jsonDecode(res.body)["data"] as Map;`,
    },
    response: `{
  "data": {
    "id": "32",
    "path": [
      [-6.980237, 106.395627],
      [-6.934294, 106.390694]
      // ... ~240 more points (compact, no indent)
    ]
  },
  "meta": {
    "level": 1,
    "updated_at": "2026-09-04"
  }
}`,
  },
  {
    method: "GET",
    path: "/missings.json",
    description:
      "Cek yang belum lengkap — list wilayah dimana has_path==false OR has_latlng==false (flat + summary by_level)",
    curl: `curl ${BASE}/missings.json`,
    snippets: {
      curl: `curl ${BASE}/missings.json`,
      fetch: `const res = await fetch("${BASE}/missings.json");
const { data, meta, summary } = await res.json();`,
      axios: `const { data: { data, meta, summary } } = await axios.get(
  "${BASE}/missings.json"
);`,
      laravel: `$response = Http::get("${BASE}/missings.json");
$missings = $response->json("data");`,
      go: `resp, err := http.Get("${BASE}/missings.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,
      python: `import requests

r = requests.get("${BASE}/missings.json")
missings = r.json()["data"]`,
      php: `$ch = curl_init("${BASE}/missings.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$missings = $body["data"];`,
      dart: `final res = await http.get(Uri.parse("${BASE}/missings.json"));
final missings = jsonDecode(res.body)["data"] as List;`,
    },
    response: `{
  "data": [
    { "id": "11.16.06.2021", "name": "Alur Mentawak", "has_path": false, "has_latlng": false },
    { "id": "11.16.08.2017", "name": "Mekar Jaya", "has_path": false, "has_latlng": false }
    // ... hanya yang has_path==false OR has_latlng==false yang muncul
  ],
  "meta": {
    "level": 0,
    "updated_at": "2026-09-04"
  },
  "summary": {
    "total_missing": 361,
    "total_missing_path": 361,
    "total_missing_latlng": 359,
    "total_missing_both": 359,
    "by_level": {
      "province": 0,
      "regency": 1,
      "district": 0,
      "village": 360
    }
  }
}`,
  },
];
