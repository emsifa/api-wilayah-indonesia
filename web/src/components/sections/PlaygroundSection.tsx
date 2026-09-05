import { useState, useMemo, useEffect } from "react";
import { MapPin, Search, RotateCcw, ChevronRight, Map, Satellite } from "lucide-react";
import { IndonesiaMap, type TileType } from "../playground/IndonesiaMap";
import { DesktopDropdowns, MobileStackCarousel } from "../playground/RegionDropdowns";
import type { Region } from "../playground/types";

const BASE = "https://www.emsifa.com/api-wilayah-indonesia/v2";

type ApiPlace = {
  id: string;
  name: string;
  capital?: string;
  lat?: number;
  lng?: number;
  elv?: number;
  tz?: number;
  population?: number;
  total_area?: number;
  postal_code?: string;
  province?: { id: string; name: string };
  regency?: { id: string; name: string };
  district?: { id: string; name: string };
};

type ShortItem = { id: string; name: string; postal_code?: string };

function toRegion(p: ApiPlace | ShortItem): Region {
  return {
    code: p.id,
    name: p.name,
    // fallback 0,0 jika tidak ada lat/lng (untuk district/village list)
    lat: (p as ApiPlace).lat ?? 0,
    lng: (p as ApiPlace).lng ?? 0,
  };
}

function findRegion(code: string, list: Region[]): Region | null {
  return list.find((r) => r.code === code) ?? null;
}

export function PlaygroundSection() {
  const [provCode, setProvCode] = useState("");
  const [regCode, setRegCode] = useState("");
  const [distCode, setDistCode] = useState("");
  const [villCode, setVillCode] = useState("");

  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  // Detail untuk kecamatan & kelurahan yang dipilih (punya lat/lng)
  const [selectedDist, setSelectedDist] = useState<Region | null>(null);
  const [selectedVill, setSelectedVill] = useState<Region | null>(null);

  // polygon multi-ring: [ [ [lat,lng], ... ], [ [lat,lng], ... ] ] untuk Jakarta dkk
  const [polygon, setPolygon] = useState<[number, number][][] | null>(null);

  const [fetchMs, setFetchMs] = useState<number | null>(null);

  const [tile, setTile] = useState<TileType>("osm");

  const [loadingProv, setLoadingProv] = useState(true);
  const [loadingReg, setLoadingReg] = useState(false);
  const [loadingDist, setLoadingDist] = useState(false);
  const [loadingVill, setLoadingVill] = useState(false);

  // Fetch provinces sekali
  useEffect(() => {
    let cancelled = false;
    setLoadingProv(true);
    const t0 = performance.now();
    fetch(`${BASE}/provinces.json`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const list: ApiPlace[] = json.data;
        setProvinces(list.map(toRegion));
        setFetchMs(Math.round(performance.now() - t0));
      })
      .catch(() => {
        if (!cancelled) {
          setProvinces([]);
          setFetchMs(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProv(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch regencies by province
  useEffect(() => {
    if (!provCode) {
      setRegencies([]);
      return;
    }
    let cancelled = false;
    setLoadingReg(true);
    const t0 = performance.now();
    fetch(`${BASE}/regencies/${provCode}.json`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const list: ApiPlace[] = json.data;
        setRegencies(list.map(toRegion));
        setFetchMs(Math.round(performance.now() - t0));
      })
      .catch(() => {
        if (!cancelled) {
          setRegencies([]);
          setFetchMs(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingReg(false);
      });
    return () => {
      cancelled = true;
    };
  }, [provCode]);

  // Fetch districts by regency
  useEffect(() => {
    if (!regCode) {
      setDistricts([]);
      return;
    }
    let cancelled = false;
    setLoadingDist(true);
    const t0 = performance.now();
    fetch(`${BASE}/districts/${regCode}.json`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const list: ShortItem[] = json.data;
        setDistricts(list.map(toRegion));
        setFetchMs(Math.round(performance.now() - t0));
      })
      .catch(() => {
        if (!cancelled) {
          setDistricts([]);
          setFetchMs(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDist(false);
      });
    return () => {
      cancelled = true;
    };
  }, [regCode]);

  // Fetch villages by district
  useEffect(() => {
    if (!distCode) {
      setVillages([]);
      return;
    }
    let cancelled = false;
    setLoadingVill(true);
    const t0 = performance.now();
    fetch(`${BASE}/villages/${distCode}.json`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const list: ShortItem[] = json.data;
        setVillages(list.map(toRegion));
        setFetchMs(Math.round(performance.now() - t0));
      })
      .catch(() => {
        if (!cancelled) {
          setVillages([]);
          setFetchMs(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingVill(false);
      });
    return () => {
      cancelled = true;
    };
  }, [distCode]);

  // Fetch detail kecamatan terpilih (lat/lng)
  useEffect(() => {
    if (!distCode) {
      setSelectedDist(null);
      return;
    }
    let cancelled = false;
    fetch(`${BASE}/districts/${distCode}.json`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const d: ApiPlace = json.data;
        setSelectedDist({ code: d.id, name: d.name, lat: d.lat ?? 0, lng: d.lng ?? 0 });
      })
      .catch(() => { if (!cancelled) setSelectedDist(null); });
    return () => { cancelled = true; };
  }, [distCode]);

  // Fetch detail kelurahan terpilih (lat/lng)
  useEffect(() => {
    if (!villCode) {
      setSelectedVill(null);
      return;
    }
    let cancelled = false;
    fetch(`${BASE}/villages/${villCode}.json`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const v: ApiPlace = json.data;
        setSelectedVill({ code: v.id, name: v.name, lat: v.lat ?? 0, lng: v.lng ?? 0 });
      })
      .catch(() => { if (!cancelled) setSelectedVill(null); });
    return () => { cancelled = true; };
  }, [villCode]);

  // Fetch polygon untuk semua level yang punya paths endpoint
  useEffect(() => {
    const code = villCode || distCode || regCode || provCode;
    if (!code) {
      setPolygon(null);
      return;
    }
    let cancelled = false;
    fetch(`${BASE}/paths/${code}.json`)
      .then((r) => {
        if (!r.ok) throw new Error("no path");
        return r.json();
      })
      .then((json) => {
        if (cancelled) return;
          const raw: unknown = json.data?.path;
          // Normalisasi multi-depth: Papua Barat 92 = 1455 x [[[lat,lng]]] depth 4,
          // Jakarta 31 = [[[lat,lng]], [[lat,lng]]] depth 3, single = [[lat,lng]] depth 2
          const rings: [number, number][][] = [];
          const collect = (node: unknown) => {
            if (!Array.isArray(node) || (node as unknown[]).length === 0) return;
            const arr = node as unknown[];
            // Jika arr[0] adalah [number, number] → ini ring
            if (
              Array.isArray(arr[0]) &&
              typeof (arr[0] as unknown[])[0] === "number" &&
              typeof (arr[0] as unknown[])[1] === "number"
            ) {
              rings.push(arr as [number, number][]);
              return;
            }
            for (const child of arr) collect(child);
          };
          collect(raw);
          const valid = rings.filter((ring) => ring.length > 2);
          setPolygon(valid.length > 0 ? valid : null);
      })
      .catch(() => {
        if (!cancelled) setPolygon(null);
      });
    return () => {
      cancelled = true;
    };
  }, [provCode, regCode, distCode, villCode]);

  // Untuk map: zoom ke level terdalam yang tersedia
  const selectedForMap: Region | null = useMemo(() => {
    if (villCode && selectedVill) return selectedVill;
    if (distCode && selectedDist) return selectedDist;
    const reg = findRegion(regCode, regencies);
    if (reg) return reg;
    const prov = findRegion(provCode, provinces);
    if (prov) return prov;
    return null;
  }, [provCode, regCode, distCode, villCode, provinces, regencies, selectedDist, selectedVill]);

  // Badge tetap tampilkan kecamatan/kelurahan terpilih (dari breadcrumb)
  const selectedForBadge: Region | null = useMemo(() => {
    const vill = findRegion(villCode, villages);
    if (vill) return vill;
    const dist = findRegion(distCode, districts);
    if (dist) return dist;
    const reg = findRegion(regCode, regencies);
    if (reg) return reg;
    const prov = findRegion(provCode, provinces);
    return prov ?? null;
  }, [provCode, regCode, distCode, villCode, provinces, regencies, districts, villages]);

  const zoom = villCode ? 13 : distCode ? 12 : regCode ? 10 : provCode ? 8 : 5;

  const breadcrumbParts = [
    provCode ? findRegion(provCode, provinces)?.name : null,
    regCode ? findRegion(regCode, regencies)?.name : null,
    distCode ? findRegion(distCode, districts)?.name : null,
    villCode ? findRegion(villCode, villages)?.name : null,
  ].filter(Boolean) as string[];

  const handleProv = (v: string) => {
    setProvCode(v);
    setRegCode("");
    setDistCode("");
    setVillCode("");
  };
  const handleReg = (v: string) => {
    setRegCode(v);
    setDistCode("");
    setVillCode("");
  };
  const handleDist = (v: string) => {
    setDistCode(v);
    setVillCode("");
  };

  const handleReset = () => {
    setProvCode("");
    setRegCode("");
    setDistCode("");
    setVillCode("");
    setPolygon(null);
  };

  const hasSelection = Boolean(provCode || regCode || distCode || villCode);

  return (
    <section
      id="playground"
      className="sticky top-0 z-0 flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-slate-950"
    >
      {/* Full-size map — tanpa overlay gelap/terang, playground full bleed */}
      <div className="absolute inset-0 z-0">
        <IndonesiaMap selected={selectedForMap} zoom={zoom} polygon={polygon} tile={tile} />
      </div>

      {/* Overlay — breadcrumb + dropdown, sisanya pointer-events-none agar zoom/pan map tetap klikable */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-6 pt-24 pb-6 md:px-8 md:pt-24 md:pb-8">
        {/* Top — breadcrumb + tile toggle */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="pointer-events-auto hidden max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-medium text-slate-700 shadow-lg backdrop-blur md:inline-flex md:text-sm">
            <MapPin size={14} className="shrink-0 text-emerald-600" />
            {breadcrumbParts.length > 0 ? (
              <span className="inline-flex max-w-full items-center truncate">
                {breadcrumbParts.map((part, i) => (
                  <span key={`${part}-${i}`} className="inline-flex items-center">
                    <span className="truncate">{part}</span>
                    {i < breadcrumbParts.length - 1 && (
                      <ChevronRight size={14} className="mx-1.5 shrink-0 text-emerald-500" />
                    )}
                  </span>
                ))}
              </span>
            ) : (
              <span className="truncate">Coba pilih wilayah di bawah — peta bakal nge-zoom sendiri ✨</span>
            )}
          </div>
          <div className="pointer-events-auto inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur">
            <button
              onClick={() => setTile("osm")}
              aria-label="Street map"
              title="Street"
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition cursor-pointer ${
                tile === "osm" ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <Map size={14} />
            </button>
            <button
              onClick={() => setTile("esri")}
              aria-label="Satellite"
              title="Satellite"
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition cursor-pointer ${
                tile === "esri" ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <Satellite size={14} />
            </button>
          </div>
        </div>

        {/* Spacer — tidak menghalangi map */}
        <div className="flex-1" />

        {/* Bottom — 2 tampilan terpisah desktop vs mobile */}
        {(() => {
          const dataUrl = !provCode
            ? `${BASE}/provinces.json`
            : !regCode
              ? `${BASE}/regencies/${provCode}.json`
              : !distCode
                ? `${BASE}/districts/${regCode}.json`
                : `${BASE}/villages/${distCode}.json`;
          return (
            <div className="pointer-events-auto mx-auto w-full max-w-5xl">
              {/* Desktop — tetap seperti sebelumnya */}
              <div className="hidden md:block">
                <div className="relative rounded-[20px] border border-white/20 bg-white p-4 shadow-2xl md:p-5">
                  <button
                    onClick={handleReset}
                    aria-label="Reset pilihan"
                    title="Reset"
                    disabled={!hasSelection}
                    className="absolute -top-3 -right-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  >
                    <RotateCcw size={12} />
                  </button>
                  <div className="mb-3 flex items-center gap-2 pr-6">
                    <Search size={14} className="text-slate-400" />
                    <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                      Cobain dulu — pilih wilayah
                    </span>
                  </div>
                  <DesktopDropdowns
                    provinces={provinces}
                    regencies={regencies}
                    districts={districts}
                    villages={villages}
                    provCode={provCode}
                    regCode={regCode}
                    distCode={distCode}
                    villCode={villCode}
                    onProv={handleProv}
                    onReg={handleReg}
                    onDist={handleDist}
                    onVill={setVillCode}
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium text-slate-500">Request:</span>
                    <a
                      href={dataUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700 underline decoration-slate-300 underline-offset-2 transition hover:bg-slate-200 hover:text-slate-900"
                    >
                      GET {dataUrl}
                    </a>
                    {fetchMs !== null && (
                      <span className="text-[11px] tabular-nums text-emerald-600">· {fetchMs} ms</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile — langsung stacked card carousel, tanpa wrapper/header, tanpa tombol reset, pill truncate, ms di pojok kanan (flow) */}
              <div className="block md:hidden">
                <MobileStackCarousel
                  provinces={provinces}
                  regencies={regencies}
                  districts={districts}
                  villages={villages}
                  provCode={provCode}
                  regCode={regCode}
                  distCode={distCode}
                  villCode={villCode}
                  onProv={handleProv}
                  onReg={handleReg}
                  onDist={handleDist}
                  onVill={setVillCode}
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <a
                    href={dataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-full bg-white/95 px-3 py-1 font-mono text-[11px] text-slate-700 shadow backdrop-blur transition hover:bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    title={dataUrl}
                  >
                    {dataUrl}
                  </a>
                  {fetchMs !== null && (
                    <span className="shrink-0 rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-medium tabular-nums text-white shadow">
                      {fetchMs} ms
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
