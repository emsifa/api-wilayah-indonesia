import type { RegionDetail } from "./types";

function fmt(n?: number) {
  if (n == null) return "-";
  return new Intl.NumberFormat("id-ID").format(n);
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function getLevelLabel(level: RegionDetail["level"]) {
  return level === 1 ? "Provinsi" : level === 2 ? "Kab / Kota" : level === 3 ? "Kecamatan" : "Kelurahan";
}

export function buildPopupEl(detail: RegionDetail): HTMLElement {
  const levelLabel = getLevelLabel(detail.level);
  const hasPath = detail.has_path;

  const parents: string[] = [];
  if (detail.province) parents.push(escapeHtml(detail.province.name));
  if (detail.regency) parents.push(escapeHtml(detail.regency.name));
  if (detail.district) parents.push(escapeHtml(detail.district.name));
  // current name is last, but show hierarchy without duplicating current if it equals parent last
  const hierarchy = parents.length ? parents.join(" › ") : null;

  const lat = detail.lat?.toFixed(5) ?? "-";
  const lng = detail.lng?.toFixed(5) ?? "-";

  const el = document.createElement("div");
  el.className = "w-[300px] max-w-[320px] overflow-hidden rounded-[20px] border border-slate-800 bg-slate-900 shadow-2xl";
  el.innerHTML = `
    <div class="bg-slate-900 px-4 py-3 text-white">
      <div class="flex items-center justify-between gap-2">
        <span class="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase text-white/90 backdrop-blur">${levelLabel}</span>
        <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${hasPath ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}">
          <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
          ${hasPath ? "Polygon tersedia" : "Tanpa polygon"}
        </span>
      </div>
      <div class="mt-2.5 text-[17px] font-bold leading-tight text-white">${escapeHtml(detail.name)}</div>
      <div class="mt-1 flex items-center gap-1.5">
        <span class="font-mono text-xs text-white/70">${escapeHtml(detail.code)}</span>
        <button data-copy-code class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition" title="Salin kode" aria-label="Salin kode">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3"/></svg>
        </button>
      </div>
    </div>

    <div class="space-y-3 bg-slate-900 px-4 py-3">
      ${hierarchy ? `<div class="flex gap-1.5 text-[11px] leading-relaxed text-slate-400"><span class="shrink-0">↳</span><span>${hierarchy}</span></div>` : ""}

      <div class="rounded-xl border border-slate-800 bg-slate-800 px-3 py-2.5">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Koordinat</span>
          <button data-copy-latlng class="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[11px] font-medium text-white shadow-sm border border-white/10 hover:bg-white/20 transition" title="Salin lat,lng">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3"/></svg>
            Salin
          </button>
        </div>
        <div class="mt-1 font-mono text-sm font-semibold text-white">${lat}, ${lng}</div>
      </div>

      ${(detail.postal_code || detail.capital || detail.elv != null || detail.tz != null)
        ? `<div class="grid grid-cols-2 gap-2 text-xs">
            ${detail.postal_code ? `<div class="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2"><div class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Kode Pos</div><div class="mt-0.5 font-mono font-semibold text-white">${escapeHtml(detail.postal_code)}</div></div>` : ""}
            ${detail.capital ? `<div class="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2"><div class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Ibu Kota</div><div class="mt-0.5 font-semibold text-white">${escapeHtml(detail.capital)}</div></div>` : ""}
            ${detail.elv != null ? `<div class="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2"><div class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Elevasi</div><div class="mt-0.5 font-semibold text-white">${fmt(detail.elv)} m</div></div>` : ""}
            ${detail.tz != null ? `<div class="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2"><div class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Zona Waktu</div><div class="mt-0.5 font-semibold text-white">UTC+${detail.tz}</div></div>` : ""}
          </div>`
        : ""}

      ${(detail.population != null || detail.total_area != null)
        ? `<div class="grid grid-cols-2 gap-2 text-xs">
            ${detail.population != null ? `<div class="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2"><div class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Populasi</div><div class="mt-0.5 font-semibold text-white">${fmt(detail.population)}</div></div>` : ""}
            ${detail.total_area != null ? `<div class="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2"><div class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Luas</div><div class="mt-0.5 font-semibold text-white">${fmt(detail.total_area)} km²</div></div>` : ""}
          </div>`
        : ""}

      <div class="flex items-center gap-2 pt-1">
        <a data-path-link href="https://www.emsifa.com/api-wilayah-indonesia/v2/paths/${escapeHtml(detail.code)}.json" target="_blank" rel="noreferrer" class="inline-flex flex-1 items-center justify-center rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100 transition">Lihat polygon JSON</a>
        <button data-copy-id class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20 transition" title="Salin ID" aria-label="Salin ID">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3"/></svg>
        </button>
      </div>
    </div>
  `;

  // Copy handlers
  const copy = async (text: string, btn: Element) => {
    try {
      await navigator.clipboard.writeText(text);
      const orig = btn.innerHTML;
      btn.innerHTML = `<span class="text-[11px] font-bold text-emerald-400">✓</span>`;
      setTimeout(() => { btn.innerHTML = orig; }, 1200);
    } catch { /* ignore */ }
  };

  const codeBtn = el.querySelector("[data-copy-code]");
  if (codeBtn) codeBtn.addEventListener("click", (e) => { e.stopPropagation(); copy(detail.code, codeBtn); });

  const latlngBtn = el.querySelector("[data-copy-latlng]");
  if (latlngBtn) latlngBtn.addEventListener("click", (e) => { e.stopPropagation(); copy(`${detail.lat}, ${detail.lng}`, latlngBtn); });

  const idBtn = el.querySelector("[data-copy-id]");
  if (idBtn) idBtn.addEventListener("click", (e) => { e.stopPropagation(); copy(detail.code, idBtn); });

  return el;
}
