import {
  Github,
  ArrowUp,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[11px] font-extrabold tracking-tighter text-slate-900">
                W
              </div>
              <span className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-tight text-white">
                  API Statis Wilayah Indonesia
                </span>
                <span className="text-[11px] font-medium tracking-wide text-slate-400">
                  by emsifa
                </span>
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white/70 uppercase">
                v2
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Kumpulan file JSON data wilayah Indonesia untuk diintegrasikan ke
              aplikasimu tanpa ribet — 38 Provinsi, 514 Kab/Kota, 7.285
              Kecamatan, 83.762 Kelurahan. Gratis, open source, nggak perlu
              backend. Colok aja ke Laravel, Prisma, Drizzle, atau AI Agent
              kamu.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                38 Provinsi
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                514 Kab/Kota
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                83.762 Desa
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://facebook.com/em.sifa"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white hover:text-slate-900"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://instagram.com/em.sifa"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white hover:text-slate-900"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://twitter.com/emsifa"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white hover:text-slate-900"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://github.com/emsifa"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white hover:text-slate-900"
              >
                <Github size={16} />
              </a>
              <a
                href="https://youtube.com/@emsifa"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white hover:text-slate-900"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/emsifa/api-wilayah-indonesia"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition"
                >
                  <Github size={14} /> GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://www.emsifa.com/api-wilayah-indonesia/v2/stats.json"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  API Base URL →
                </a>
              </li>
              <li>
                <a href="#cli" className="hover:text-white transition">
                  CLI Docs
                </a>
              </li>
              <li>
                <a href="#skill" className="hover:text-white transition">
                  SKILL.md
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Credits</h4>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed">
              <li>
                Sumber data wilayah:{" "}
                <a
                  href="https://github.com/cahyadsn/wilayah"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-200 underline decoration-white/20 underline-offset-4 hover:text-white"
                >
                  cahyadsn/wilayah
                </a>
              </li>
              <li>
                Kode pos:{" "}
                <a
                  href="https://github.com/cahyadsn/wilayah_kodepos"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-200 underline decoration-white/20 underline-offset-4 hover:text-white"
                >
                  cahyadsn/wilayah_kodepos
                </a>
              </li>
              <li className="text-slate-500">
                Polygon &amp; koordinat dari BPS &amp; OSM — udah dirapiin
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs md:flex-row md:items-center">
          <p>
            © 2026 Muhammad Syifa — MIT License. Built with Astro + React +
            Tailwind.
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-slate-300 transition hover:bg-white hover:text-slate-900 cursor-pointer"
          >
            <ArrowUp size={12} /> Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
