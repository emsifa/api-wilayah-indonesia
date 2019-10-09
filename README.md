API Data Wilayah Indonesia
==========================

Repository ini berisi source code untuk generate (REST) API statis berisi data wilayah Indonesia
serta perintah untuk mendeploynya ke _static hosting_ [Github Page](https://pages.github.com/).

Demo: [https://emsifa.github.io/api-wilayah-indonesia](https://emsifa.github.io/api-wilayah-indonesia)

#### Apa yang dimaksud API statis? 

API statis adalah API yang _endpoint_-nya terdiri dari file statis.

#### Keuntungan API statis?

* Dapat dihosting pada _static file hosting_ seperti Github Page, Netlify, dsb.
* Proses lebih cepat karena tidak membutuhkan server-side scripting.

#### Bagaimana cara kerjanya?

* Daftar provinsi, kab/kota, kecamatan, kelurahan/desa disimpan pada folder `data` berupa file `csv` (agar mudah diedit).
* Kemudian script `generate.php` dijalankan. Script ini akan membaca file `csv` didalam folder `data`, kemudian men-generate ribuan endpoint (file) kedalam folder `static/api`.
* API siap 'dihidangkan'.

#### Saya mau hosting di Github saya sendiri, bagaimana caranya?

* Fork repository ini. 
* Buka cmd/terminal.
* `git clone https://github.com/usernamekamu/api-wilayah-indonesia.git`.
* `echo "" > hello.txt`.
* `git add hello.txt`.
* `git push origin master`.
* Tunggu beberapa saat sampai _Github_ build _Github Page_ kamu.
* Buka URL `https://usernamekamu.github.io/api-wilayah-indonesia`.

## ENDPOINTS

#### 1. Mengambil Daftar Provinsi

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json
```

Contoh Response:

```
[
  {
    "id": "11",
    "name": "ACEH"
  },
  {
    "id": "12",
    "name": "SUMATERA UTARA"
  },
  ...
]
```

#### 2. Mengambil Daftar Kab/Kota pada Provinsi Tertentu

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/regencies/{provinceId}.json
```

Contoh untuk mengambil daftar kab/kota di provinsi Aceh (ID = 11):

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/regencies/11.json
```

Contoh Response:

```
[
  {
    "id": "1101",
    "province_id": "11",
    "name": "KABUPATEN SIMEULUE"
  },
  {
    "id": "1102",
    "province_id": "11",
    "name": "KABUPATEN ACEH SINGKIL"
  },
  ...
]
```

#### 3. Mengambil Daftar Kecamatan pada Kab/Kota Tertentu

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/districts/{regencyId}.json
```

Contoh untuk mengambil daftar kecamatan di Aceh Selatan (ID = 1103):

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/districts/1103.json
```

Contoh Response:

```
[
  {
    "id": "1103010",
    "regency_id": "1103",
    "name": "TRUMON"
  },
  {
    "id": "1103011",
    "regency_id": "1103",
    "name": "TRUMON TIMUR"
  },
  ...
]
```

#### 4. Mengambil Daftar Kelurahan pada Kecamatan Tertentu

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/villages/{districtId}.json
```

Contoh untuk mengambil daftar kelurahan di Trumon (ID = 1103010):

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/villages/1103010.json
```

Contoh Response:

```
[
  {
    "id": "1103010001",
    "district_id": "1103010",
    "name": "KUTA PADANG"
  },
  {
    "id": "1103010002",
    "district_id": "1103010",
    "name": "RAKET"
  },
  ...
]
```

#### 5. Mengambil Data Provinsi berdasarkan ID Provinsi

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/province/{provinceId}.json
```

Contoh untuk mengambil data provinsi Aceh (ID = 11):

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/province/11.json
```

Contoh Response:

```
{
  "id": "11",
  "name": "ACEH"
}
```

#### 6. Mengambil Data Kab/Kota berdasarkan ID Kab/Kota

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/regency/{regencyId}.json
```

Contoh untuk mengambil data kabupaten Aceh Selatan (ID = 1103):

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/regency/1103.json
```

Contoh Response:

```
{
  "id": "1103",
  "province_id": "11",
  "name": "KABUPATEN ACEH SELATAN"
}
```

#### 7. Mengambil Data Kecamatan berdasarkan ID Kecamatan

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/district/{districtId}.json
```

Contoh untuk mengambil data kecamatan Trumon Timur (ID = 1103011):

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/district/1103011.json
```

Contoh Response:

```
{
  "id": "1103011",
  "regency_id": "1103",
  "name": "TRUMON TIMUR"
}
```

#### 8. Mengambil Data Kelurahan berdasarkan ID Kelurahan

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/village/{villageId}.json
```

Contoh untuk mengambil data kelurahan Jambo Dalem (ID = 1103011010):

```
GET https://emsifa.github.io/api-wilayah-indonesia/api/village/1103011010.json
```

Contoh Response:

```
{
  "id": "1103011010",
  "district_id": "1103011",
  "name": "JAMBO DALEM"
}
```

## LIMITASI

Karena API ini dihosting di Github Page, Github Page sendiri memberikan batasan bandwith 100GB/bulan. Rata-rata endpoint disini memiliki ukuran 1KB/endpoint, jadi kurang lebih request yang dapat digunakan adalah 100.000.000 request per bulan, atau sekitar 3.000.000 request/hari.

Karena limitasi ini, disarankan untuk hosting API ini di github kamu sendiri.

Untuk lebih detail tentang limitasi Github Page, bisa dilihat [disini](https://help.github.com/en/articles/about-github-pages#usage-limits).
