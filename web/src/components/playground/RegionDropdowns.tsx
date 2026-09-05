import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Region } from "./types";

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Region[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex min-w-[150px] flex-1 flex-col gap-1.5">
      <span className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.code} value={o.code}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}

// ---- Mobile stack carousel ----

type Level = {
  key: string;
  label: string;
  placeholder: string;
  step: number;
};

function getName(code: string, list: Region[]): string | null {
  if (!code) return null;
  return list.find((r) => r.code === code)?.name ?? null;
}

export function MobileStackCarousel({
  provinces,
  regencies,
  districts,
  villages,
  provCode,
  regCode,
  distCode,
  villCode,
  onProv,
  onReg,
  onDist,
  onVill,
}: {
  provinces: Region[];
  regencies: Region[];
  districts: Region[];
  villages: Region[];
  provCode: string;
  regCode: string;
  distCode: string;
  villCode: string;
  onProv: (v: string) => void;
  onReg: (v: string) => void;
  onDist: (v: string) => void;
  onVill: (v: string) => void;
}) {
  const levels: Level[] = [
    { key: "prov", label: "Provinsi", placeholder: "Pilih Provinsi", step: 0 },
    { key: "reg", label: "Kab / Kota", placeholder: "Pilih Kab/Kota", step: 1 },
    { key: "dist", label: "Kecamatan", placeholder: "Pilih Kecamatan", step: 2 },
    { key: "vill", label: "Kelurahan", placeholder: "Pilih Kelurahan", step: 3 },
  ];

  const [active, setActive] = useState(0);

  // Keep refs to detect forward selection
  const prevProvRef = useRef(provCode);
  const prevRegRef = useRef(regCode);
  const prevDistRef = useRef(distCode);
  const prevVillRef = useRef(villCode);

  // Auto-advance when a value is selected (langsung geser)
  useEffect(() => {
    if (provCode && prevProvRef.current !== provCode) {
      setActive(1);
    } else if (!provCode) {
      setActive(0);
    }
    prevProvRef.current = provCode;
  }, [provCode]);

  useEffect(() => {
    if (regCode && prevRegRef.current !== regCode) {
      setActive(2);
    }
    // if reg cleared while we were deeper, clamp back to 1
    if (!regCode && provCode && active > 1) {
      // keep at 1 unless user manually navigated? clamp only if was beyond 1
      setActive((a) => (a > 1 ? 1 : a));
    }
    prevRegRef.current = regCode;
  }, [regCode, provCode, active]);

  useEffect(() => {
    if (distCode && prevDistRef.current !== distCode) {
      setActive(3);
    }
    if (!distCode && regCode && active > 2) {
      setActive((a) => (a > 2 ? 2 : a));
    }
    prevDistRef.current = distCode;
  }, [distCode, regCode, active]);

  useEffect(() => {
    // if vill selected we stay at 3
    prevVillRef.current = villCode;
  }, [villCode]);

  // Clamp if reset or earlier cleared: ensure active not beyond unlockable
  useEffect(() => {
    let selectableMax: number;
    if (!provCode) selectableMax = 0;
    else if (!regCode) selectableMax = 1;
    else if (!distCode) selectableMax = 2;
    else selectableMax = 3;
    if (active > selectableMax) setActive(selectableMax);
    if (!provCode && active !== 0) setActive(0);
  }, [provCode, regCode, distCode, active]);

  const canGoNext = (() => {
    if (active === 0) return Boolean(provCode);
    if (active === 1) return Boolean(regCode);
    if (active === 2) return Boolean(distCode);
    return false;
  })();

  const canGoPrev = active > 0;

  const handleSelect = (step: number, value: string) => {
    if (step === 0) onProv(value);
    if (step === 1) onReg(value);
    if (step === 2) onDist(value);
    if (step === 3) onVill(value);
    // auto-advance is handled via useEffect, but for instant feel also set here
    if (step === 0 && value) setActive(1);
    if (step === 1 && value) setActive(2);
    if (step === 2 && value) setActive(3);
    if (step === 0 && !value) setActive(0);
  };

  const getAnimate = (index: number) => {
    if (index < active) {
      const dist = active - index;
      return {
        x: -14 - (dist - 1) * 10, // peek to left behind
        scale: 0.92 - (dist - 1) * 0.035,
        opacity: 0.55 - (dist - 1) * 0.12,
        rotate: -2,
        zIndex: 1 + index,
      };
    }
    if (index === active) {
      return { x: 0, scale: 1, opacity: 1, rotate: 0, zIndex: 10 };
    }
    // future cards off to the right
    const ahead = index - active;
    if (ahead === 1) {
      return { x: "102%", scale: 0.98, opacity: 0, rotate: 0, zIndex: 5 };
    }
    return { x: "110%", scale: 0.96, opacity: 0, rotate: 0, zIndex: 0 };
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 48;
    if (info.offset.x < -threshold && canGoNext) {
      setActive((a) => Math.min(3, a + 1));
    } else if (info.offset.x > threshold && canGoPrev) {
      setActive((a) => Math.max(0, a - 1));
    }
  };

  const selectedNames: (string | null)[] = [
    getName(provCode, provinces),
    getName(regCode, regencies),
    getName(distCode, districts),
    getName(villCode, villages),
  ];

  const optionLists: Region[][] = [provinces, regencies, districts, villages];
  const values: string[] = [provCode, regCode, distCode, villCode];
  const disabledByUnlock: boolean[] = [
    false,
    !provCode,
    !regCode,
    !distCode,
  ];

  return (
    <div>
      {/* Stack track */}
      <div className="relative h-[92px] w-full">
        {levels.map((lvl, i) => {
          const isActive = i === active;
          const isBehind = i < active;
          const disabled = disabledByUnlock[i];
          return (
            <motion.div
              key={lvl.key}
              className="absolute inset-0"
              initial={false}
              animate={getAnimate(i)}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              drag={isActive ? "x" : false}
              dragElastic={0.18}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              style={{ touchAction: isActive ? "pan-y" : "auto" }}
            >
              <div
                onClick={() => {
                  if (isBehind) setActive(i);
                }}
                className={`flex flex-col gap-2 rounded-2xl border bg-white px-4 py-3 shadow-xl transition ${
                  isActive
                    ? "border-slate-900/10 shadow-2xl"
                    : isBehind
                      ? "cursor-pointer border-slate-200 hover:border-slate-300"
                      : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                    {String(i + 1).padStart(2, "0")} — {lvl.label}
                  </span>
                  {isActive ? (
                    <span className="text-[11px] font-semibold text-slate-500">
                      {i + 1} / 4
                    </span>
                  ) : isBehind && selectedNames[i] ? (
                    <span className="max-w-[58%] truncate text-right text-xs font-semibold text-emerald-700">
                      {selectedNames[i]}
                    </span>
                  ) : !isBehind ? (
                    <span className="text-[11px] font-medium text-slate-400">
                      {disabled ? "Terkunci" : "Berikutnya"}
                    </span>
                  ) : null}
                </div>

                <div>
                  {isActive ? (
                    <label className="flex flex-col">
                      <span className="sr-only">{lvl.label}</span>
                      <select
                        value={values[i]}
                        onChange={(e) => handleSelect(i, e.target.value)}
                        disabled={disabled}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="">{lvl.placeholder}</option>
                        {optionLists[i].map((o) => (
                          <option key={o.code} value={o.code}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : isBehind ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
                      {selectedNames[i] ? (
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-medium text-slate-800">{selectedNames[i]}</span>
                          <span className="shrink-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                            Tap untuk ubah
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">{lvl.placeholder}</span>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-400">
                      {disabled ? "Pilih tingkat sebelumnya dulu" : lvl.placeholder}
                    </div>
                  )}
                </div>


              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Controls: dots + prev/next */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => setActive((a) => Math.max(0, a - 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1.5">
          {levels.map((lvl, i) => {
            const isActive = i === active;
            const isDone = i < active || (i === 0 && !!provCode) || (i === 1 && !!regCode) || (i === 2 && !!distCode) || (i === 3 && !!villCode);
            const isReachable = !disabledByUnlock[i] || isDone;
            return (
              <button
                key={lvl.key}
                type="button"
                onClick={() => {
                  if (isReachable) setActive(i);
                }}
                disabled={!isReachable}
                aria-label={`Ke ${lvl.label}`}
                className={`h-2 rounded-full transition-all ${
                  isActive
                    ? "w-6 bg-slate-900"
                    : isDone
                      ? "w-2 bg-emerald-500"
                      : "w-2 bg-slate-200"
                } ${!isReachable ? "opacity-40" : "cursor-pointer hover:bg-slate-300"}`}
              />
            );
          })}
        </div>

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => setActive((a) => Math.min(3, a + 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Selanjutnya"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export function DesktopDropdowns({
  provinces,
  regencies,
  districts,
  villages,
  provCode,
  regCode,
  distCode,
  villCode,
  onProv,
  onReg,
  onDist,
  onVill,
}: {
  provinces: Region[];
  regencies: Region[];
  districts: Region[];
  villages: Region[];
  provCode: string;
  regCode: string;
  distCode: string;
  villCode: string;
  onProv: (v: string) => void;
  onReg: (v: string) => void;
  onDist: (v: string) => void;
  onVill: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        label="Provinsi"
        value={provCode}
        onChange={onProv}
        options={provinces}
        placeholder="Pilih Provinsi"
      />
      <Select
        label="Kab / Kota"
        value={regCode}
        onChange={onReg}
        options={regencies}
        placeholder="Pilih Kab/Kota"
        disabled={!provCode}
      />
      <Select
        label="Kecamatan"
        value={distCode}
        onChange={onDist}
        options={districts}
        placeholder="Pilih Kecamatan"
        disabled={!regCode}
      />
      <Select
        label="Kelurahan"
        value={villCode}
        onChange={onVill}
        options={villages}
        placeholder="Pilih Kelurahan"
        disabled={!distCode}
      />
    </div>
  );
}

export function RegionDropdowns({
  provinces,
  regencies,
  districts,
  villages,
  provCode,
  regCode,
  distCode,
  villCode,
  onProv,
  onReg,
  onDist,
  onVill,
}: {
  provinces: Region[];
  regencies: Region[];
  districts: Region[];
  villages: Region[];
  provCode: string;
  regCode: string;
  distCode: string;
  villCode: string;
  onProv: (v: string) => void;
  onReg: (v: string) => void;
  onDist: (v: string) => void;
  onVill: (v: string) => void;
}) {
  return (
    <>
      <div className="hidden md:flex">
        <DesktopDropdowns
          provinces={provinces}
          regencies={regencies}
          districts={districts}
          villages={villages}
          provCode={provCode}
          regCode={regCode}
          distCode={distCode}
          villCode={villCode}
          onProv={onProv}
          onReg={onReg}
          onDist={onDist}
          onVill={onVill}
        />
      </div>
      <div className="md:hidden">
        <MobileStackCarousel
          provinces={provinces}
          regencies={regencies}
          districts={districts}
          villages={villages}
          provCode={provCode}
          regCode={regCode}
          distCode={distCode}
          villCode={villCode}
          onProv={onProv}
          onReg={onReg}
          onDist={onDist}
          onVill={onVill}
        />
      </div>
    </>
  );
}
