export type ApiEndpoint = {
  method: "GET";
  path: string;
  description: string;
  curl: string;
  response: string;
};

const BASE = "https://www.emsifa.com/api-data-wilayah-v2/v2";

// Response diambil dari output tools/generate_static_api.go (genResponse + genPlace / genShortItem)
// Lihat api/*.json setelah go run ./tools generate-static-api
export const apiEndpoints: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/stats.json",
    description: "Intip ringkasannya dulu — total provinsi, kab/kota, kecamatan, kelurahan, kode pos, luas & populasi",
    curl: `curl ${BASE}/stats.json`,
    response: `{
  "data": {
    "total_area": 1889518.2539999997,
    "total_districts": 7285,
    "total_paths": 551,
    "total_population": 284973643,
    "total_postal_codes": 10632,
    "total_provinces": 38,
    "total_regencies": 514,
    "total_villages": 83762
  },
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 0
  }
}`,
  },
  {
    method: "GET",
    path: "/provinces.json",
    description: "Ambil semua provinsi — lengkap sama kapital, koordinat, populasi & luasnya (level 1)",
    curl: `curl ${BASE}/provinces.json`,
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
      "total_area": 56835.019
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
      "total_area": 72437.755
    }
    // ... 36 more
  ],
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 1
  }
}`,
  },
  {
    method: "GET",
    path: "/provinces/{code}.json",
    description: "Kepoin satu provinsi aja by kode — misal 32 = Jawa Barat (level 1)",
    curl: `curl ${BASE}/provinces/32.json`,
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
    "total_area": 37053.331
  },
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 1
  }
}`,
  },
  {
    method: "GET",
    path: "/regencies/{province_code}.json",
    description: "Daftar kab/kota di provinsi tertentu — misal semua kota di Jawa Barat (level 2)",
    curl: `curl ${BASE}/regencies/32.json`,
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
      "total_area": 2991.778
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
      "total_area": 4163.824
    }
    // ... 25 more (total 27 regencies in Jawa Barat)
  ],
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 2
  }
}`,
  },
  {
    method: "GET",
    path: "/regencies/{regency_code}.json",
    description: "Detail satu kab/kota by kode — bonus info provinsinya juga (level 2)",
    curl: `curl ${BASE}/regencies/32.73.json`,
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
    "province": {
      "id": "32",
      "name": "Jawa Barat"
    }
  },
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 2
  }
}`,
  },
  {
    method: "GET",
    path: "/districts/{regency_code}.json",
    description: "Daftar kecamatan di kab/kota tertentu — ringkas id + nama aja (level 3)",
    curl: `curl ${BASE}/districts/32.73.json`,
    response: `{
  "data": [
    { "id": "32.73.01", "name": "Sukasari" },
    { "id": "32.73.02", "name": "Coblong" },
    { "id": "32.73.03", "name": "Babakan Ciparay" },
    { "id": "32.73.04", "name": "Bojongloa Kaler" },
    { "id": "32.73.05", "name": "Andir" }
    // ... 25 more
  ],
  "meta": {
    "generated_at": "2026-09-02T03:35:45Z",
    "level": 3
  }
}`,
  },
  {
    method: "GET",
    path: "/districts/{district_code}.json",
    description: "Detail satu kecamatan — plus tau dia dari provinsi & kab/kota mana (level 3)",
    curl: `curl ${BASE}/districts/32.73.01.json`,
    response: `{
  "data": {
    "id": "32.73.01",
    "name": "Sukasari",
    "province": {
      "id": "32",
      "name": "Jawa Barat"
    },
    "regency": {
      "id": "32.73",
      "name": "Kota Bandung"
    }
  },
  "meta": {
    "generated_at": "2026-09-02T03:35:45Z",
    "level": 3
  }
}`,
  },
  {
    method: "GET",
    path: "/villages/{district_code}.json",
    description: "Daftar kelurahan/desa di kecamatan itu — udah include kode pos (level 4)",
    curl: `curl ${BASE}/villages/32.73.01.json`,
    response: `{
  "data": [
    { "id": "32.73.01.1001", "name": "Sukarasa", "postal_code": "40152" },
    { "id": "32.73.01.1002", "name": "Gegerkalong", "postal_code": "40153" },
    { "id": "32.73.01.1003", "name": "Isola", "postal_code": "40154" },
    { "id": "32.73.01.1004", "name": "Sarijadi", "postal_code": "40151" }
  ],
  "meta": {
    "generated_at": "2026-09-02T03:35:45Z",
    "level": 4
  }
}`,
  },
  {
    method: "GET",
    path: "/villages/{village_code}.json",
    description: "Detail satu kelurahan/desa — lengkap kode pos + provinsi, kab/kota, kecamatan (level 4)",
    curl: `curl ${BASE}/villages/32.73.01.1001.json`,
    response: `{
  "data": {
    "id": "32.73.01.1001",
    "name": "Sukarasa",
    "postal_code": "40152",
    "province": {
      "id": "32",
      "name": "Jawa Barat"
    },
    "regency": {
      "id": "32.73",
      "name": "Kota Bandung"
    },
    "district": {
      "id": "32.73.01",
      "name": "Sukasari"
    }
  },
  "meta": {
    "generated_at": "2026-09-02T03:35:46Z",
    "level": 4
  }
}`,
  },
  {
    method: "GET",
    path: "/postal-codes/{postal_code}.json",
    description: "Cari kelurahan by kode pos — misal 40152 tuh daerah mana aja (level 4)",
    curl: `curl ${BASE}/postal-codes/40152.json`,
    response: `{
  "data": [
    {
      "id": "32.73.01.1001",
      "name": "Sukarasa",
      "postal_code": "40152",
      "province": {
        "id": "32",
        "name": "Jawa Barat"
      },
      "regency": {
        "id": "32.73",
        "name": "Kota Bandung"
      },
      "district": {
        "id": "32.73.01",
        "name": "Sukasari"
      }
    }
  ],
  "meta": {
    "generated_at": "2026-09-02T03:35:48Z",
    "level": 4
  }
}`,
  },
  {
    method: "GET",
    path: "/paths/{province_or_regency_code}.json",
    description: "Butuh polygon buat peta? Ambil garis batas provinsi/kab-kota di sini (compact JSON)",
    curl: `curl ${BASE}/paths/32.json`,
    response: `{
  "data": {
    "id": "32",
    "name": "Jawa Barat",
    "path": [
      [-6.980237, 106.395627],
      [-6.934294, 106.390694],
      [-6.921623, 106.399689]
      // ... ~240 more points (compact, no indent)
    ]
  },
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 1
  }
}`,
  },
];
