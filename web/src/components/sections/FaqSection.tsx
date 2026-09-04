import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

type Faq = {
  q: string;
  a: React.ReactNode;
};

const faqs: Faq[] = [
  {
    q: "Darimana sumber datanya?",
    a: (
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">
        <p>
          Data diambil dari 3 repository{" "}
          <a href="https://github.com/cahyadsn" target="_blank" rel="noreferrer" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-slate-700">
            cahyadsn
          </a>{" "}
          yang datanya merujuk ke sumber resmi pemerintah:
        </p>
        <ul className="space-y-2.5">
          <li className="rounded-xl border border-slate-200 bg-white p-3">
            <span className="font-semibold text-slate-900">cahyadsn/wilayah</span>{" "}
            <span className="font-mono text-xs text-slate-500">db/wilayah.sql, db/wilayah_level_1_2.sql</span>
            <br />
            <span className="text-xs">
              Dipakai untuk hirarki wilayah & data rich provinsi/kab-kota (kode, nama, ibukota, lat/lng, elv, tz, luas, penduduk, path). Sumber asli: Kepmendagri No. 300.2.2-2430 Tahun 2025 (pemutakhiran 300.2.2-2138/2025, 100.1.1-6117/2022), luas dari Badan Informasi Geospasial (Surat Deputi BIG B-16.10/DIGD-BIG/IGD.04.04/12/2024), penduduk dari Ditjen Dukcapil Kemendagri Semester II 2024, pulau dari Gazeter Republik Indonesia (GRI) 2024 BIG.
            </span>
          </li>
          <li className="rounded-xl border border-slate-200 bg-white p-3">
            <span className="font-semibold text-slate-900">cahyadsn/wilayah_kodepos</span>{" "}
            <span className="font-mono text-xs text-slate-500">db/wilayah_kodepos.sql</span>
            <br />
            <span className="text-xs">
              Dipakai untuk <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">postal_code</code> di desa/kelurahan dan endpoint <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">/postal-codes/{`{kode}`}.json</code>. Tabel <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">wilayah_kodepos(kode, kodepos)</code> untuk 83.762 desa/kelurahan sesuai Kepmendagri yang sama.
            </span>
          </li>
          <li className="rounded-xl border border-slate-200 bg-white p-3">
            <span className="font-semibold text-slate-900">cahyadsn/wilayah_boundaries</span>{" "}
            <span className="font-mono text-xs text-slate-500">db/kec/*.sql, db/kel/*/*.sql</span>
            <br />
            <span className="text-xs">
              Dipakai untuk polygon dan koordinat kecamatan/kelurahan: <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">/paths/{`{kode}`}.json</code> dan <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">lat/lng</code> di <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">/districts</code> & <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">/villages</code>. Polygon dari BIG (tanahair.indonesia.go.id) multipolygon simplified, lat/lng adalah centroid polygon — bukan titik kantor.
            </span>
          </li>
        </ul>
        <p className="text-xs text-slate-500">
          Repo ini hanya agregator & pre-renderer jadi JSON statis. Jika ada selisih, rujukan resminya tetap Kepmendagri & BIG. Cek lengkapnya di{" "}
          <a href="https://github.com/cahyadsn/wilayah" target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">cahyadsn/wilayah</a>,{" "}
          <a href="https://github.com/cahyadsn/wilayah_kodepos" target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">wilayah_kodepos</a>,{" "}
          <a href="https://github.com/cahyadsn/wilayah_boundaries" target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">wilayah_boundaries</a>.
        </p>
      </div>
    ),
  },
  {
    q: "Apakah ini gratis?",
    a: (
      <div className="space-y-2 text-sm leading-relaxed text-slate-600">
        <p>
          Ya, gratis 100%. Lisensinya <span className="font-semibold text-slate-900">MIT</span> — baik repo ini (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">emsifa/api-wilayah-indonesia</code>) maupun 3 repo sumber data cahyadsn. Kamu bebas pakai untuk personal maupun komersial, tanpa API key, tanpa biaya.
        </p>
        <p className="text-xs text-slate-500">Cukup cantumkan atribusi ke sumber data jika kamu publish ulang — sudah cukup membantu.</p>
      </div>
    ),
  },
  {
    q: "Apakah ada batasan?",
    a: (
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">
        <p>
          API ini di-host di <span className="font-semibold text-slate-900">GitHub Pages</span> (CDN Fastly, CORS enabled). Batasannya mengikuti Pages, bukan dari kami:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-xs">
          <li><span className="font-semibold text-slate-700">Repo 1 GB & bandwidth 100 GB/bulan</span> — API ini sekitar 99k file JSON (api/paths 91k + sisanya), totalnya masih di bawah batas tapi file banyak jadi mendekati limit soft GitHub.</li>
          <li><span className="font-semibold text-slate-700">10 builds/jam</span> — deploy via GitHub Actions, bukan per-request.</li>
          <li><span className="font-semibold text-slate-700">Tanpa rate limit dari kami</span>, tapi jika traffic membludak bisa kena limit bandwidth GitHub (bukan 429 dari kami).</li>
          <li>Polygon di-simplify & beberapa wilayah masih masuk <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">/missings.json</code>.</li>
        </ul>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-900">Butuh lebih leluasa? Self-host aja di GitHub Pages kamu sendiri:</p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-3 font-mono text-xs text-slate-200">{`# 1. Download full dataset (JSON statis siap serve)
npx wilayah download --format json --output ./wilayah.json

# 2. Atau clone & serve folder api/ hasil generate
# (ikutin langkah di README repo ini)

# 3. Push ke gh-pages kamu sendiri — domain & cache kamu yang atur`}</pre>
          <p className="mt-2 text-xs text-amber-800">Dengan self-host, kamu kontrol domain, cache, dan nggak nebeng quota orang lain.</p>
        </div>
      </div>
    ),
  },
  {
    q: "Seberapa sering data diupdate?",
    a: (
      <div className="space-y-2 text-sm leading-relaxed text-slate-600">
        <p>
          Otomatis <span className="font-semibold text-slate-900">setiap minggu</span> — GitHub Actions cron <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">0 0 * * 0</code> (Minggu jam 00:00 UTC) di <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">.github/workflows/deploy.yml</code>. Tiap jalan: extract CSV dari source → generate API → generate boundaries → patch <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">has_path</code> → generate <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">missings.json</code> → publish ke branch <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">gh-pages</code>.
        </p>
        <p className="text-xs text-slate-500">
          Jadwal ngikutin update Kepmendagri di repo cahyadsn (biasanya tahunan, kadang ada revisi tengah tahun). Jika ada perubahan di hulu, paling lambat 1 minggu sudah kebawa. Kamu juga bisa trigger manual via <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">workflow_dispatch</code> atau <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">push ke main/v2</code>. Cek <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">/stats.json</code> field <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">meta.updated_at</code> buat tau kapan terakhir di-generate.
        </p>
      </div>
    ),
  },
  {
    q: "Seberapa akurat lat/lng dan polygon?",
    a: (
      <div className="space-y-2 text-sm leading-relaxed text-slate-600">
        <p>
          <span className="font-semibold text-slate-900">Cukup akurat untuk peta & search, belum untuk sertifikat tanah.</span> Provinsi & kab/kota lat/lng dari Google Maps awal, kecamatan/kelurahan lat/lng adalah centroid dari polygon BIG. Polygon-nya adalah multipolygon simplified dari BIG (tanahair.indonesia.go.id) yang di-round ke 6 desimal (~11 cm presisi) biar file kecil.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-xs">
          <li>Single island = 1 ring, multi-island = banyak ring (mis. Aceh 28, Papua Barat 1.455). Kode peta kamu harus handle multi-ring.</li>
          <li>Beberapa wilayah masih belum ada polygon/latlng — cek <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">has_path</code> & <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">has_latlng</code> atau lihat <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">/missings.json</code>.</li>
          <li>Jika kamu butuh resolusi tinggi, ambil langsung dari BIG atau repo <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">wilayah_boundaries</code> tanpa simplify.</li>
        </ul>
      </div>
    ),
  },
  {
    q: "Bagaimana kalau ada data yang salah?",
    a: (
      <div className="space-y-2 text-sm leading-relaxed text-slate-600">
        <p>Laporkan aja, kami bantu teruskan ke hulu:</p>
        <ul className="list-disc space-y-1 pl-5 text-xs">
          <li>
            Jika salah <span className="font-semibold text-slate-700">kode/nama wilayah, kodepos, atau polygon/latlng</span> — buka issue di repo sumber:{" "}
            <a href="https://github.com/cahyadsn/wilayah/issues" target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">cahyadsn/wilayah</a> /{" "}
            <a href="https://github.com/cahyadsn/wilayah_kodepos/issues" target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">wilayah_kodepos</a> /{" "}
            <a href="https://github.com/cahyadsn/wilayah_boundaries/issues" target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">wilayah_boundaries</a>. Sertakan <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">kode (mis. 32.73.01.1001)</code>, nama yang benar, dan sumber Kepmendagri/BIG jika ada.
          </li>
          <li>
            Jika salah <span className="font-semibold text-slate-700">render API, has_path/has_latlng, atau missings</span> — buka issue di{" "}
            <a href="https://github.com/emsifa/api-wilayah-indonesia/issues" target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">emsifa/api-wilayah-indonesia</a>.
          </li>
        </ul>
        <p className="text-xs text-slate-500">Biasanya fix di hulu akan kebawa otomatis di deploy mingguan berikutnya.</p>
      </div>
    ),
  },
];

function FaqItem({ faq, defaultOpen = false }: { faq: Faq; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left cursor-pointer"
      >
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900">{faq.q}</div>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-5">{faq.a}</div>}
    </div>
  );
}

export function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        // strip ReactNode to plain text fallback for SEO
        text: typeof f.q === "string" ? f.q : "",
      },
    })),
  };

  // richer text for SEO — plain strings
  const seoAnswers: Record<string, string> = {
    "Darimana sumber datanya?":
      "Data dari 3 repo cahyadsn: cahyadsn/wilayah (db/wilayah.sql & wilayah_level_1_2.sql untuk hirarki, ibukota, lat/lng, luas, penduduk, path) sumber Kepmendagri 300.2.2-2430/2025, luas BIG, penduduk Dukcapil; cahyadsn/wilayah_kodepos (db/wilayah_kodepos.sql untuk postal_code 83762 villages); cahyadsn/wilayah_boundaries (db/kec & kel untuk polygon/paths dan lat/lng kecamatan/kelurahan dari BIG tanahair.indonesia.go.id).",
    "Apakah ini gratis?": "Ya gratis 100% MIT, bebas komersial tanpa API key.",
    "Apakah ada batasan?":
      "Host di GitHub Pages: 1 GB repo, 100 GB bandwidth/bulan, 10 builds/jam, tanpa rate limit dari kami. Untuk lebih leluasa self-host via npx wilayah download di gh-pages sendiri.",
    "Seberapa sering data diupdate?": "Mingguan via GitHub Actions cron 0 0 * * 0 Minggu 00:00 UTC, plus workflow_dispatch dan push main/v2. Cek stats.json meta.updated_at.",
    "Seberapa akurat lat/lng dan polygon?":
      "Lat/lng provinsi/kab-kota dari Google Maps, kecamatan/kelurahan centroid BIG, polygon multipolygon simplified 6 desimal. Cek has_path/has_latlng atau missings.json.",
    "Bagaimana kalau ada data yang salah?":
      "Lapor ke cahyadsn/wilayah, wilayah_kodepos, wilayah_boundaries untuk kode/nama/kodepos/polygon, atau ke emsifa/api-wilayah-indonesia untuk render API.",
  };
  const jsonLdFull = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: seoAnswers[f.q] ?? f.q },
    })),
  };

  return (
    <section id="faq" className="relative z-10 overflow-hidden rounded-t-[32px] border-t border-slate-200 bg-slate-50 shadow-[0_-12px_40px_rgba(0,0,0,0.08)]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tracking-widest text-slate-600 uppercase">
            <HelpCircle size={12} className="text-slate-500" />
            FAQ
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Pertanyaan yang sering ditanya</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Jawaban cepat sebelum kamu mulai. Kalau belum ketemu, buka issue di GitHub — kami bantu.</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-3">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} faq={faq} defaultOpen={i === 0} />
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Masih ada yang bingung?{" "}
          <a href="https://github.com/emsifa/api-wilayah-indonesia/issues" target="_blank" rel="noreferrer" className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900">
            Buka issue di GitHub
          </a>
          .
        </p>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFull) }} />
    </section>
  );
}
