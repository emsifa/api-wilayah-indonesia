import type { Region } from "./types";
import { MapPin, Hexagon } from "lucide-react";
import { Tooltip } from "../ui/Tooltip";

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  withMeta,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Region[];
  placeholder: string;
  disabled?: boolean;
  withMeta?: boolean;
}) {
  return (
    <label className="flex min-w-[150px] flex-1 flex-col gap-1.5">
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
        {label}
        {withMeta && (
          <span className="inline-flex items-center gap-0.5">
            <Tooltip content="Punya polygon — bisa tampil garis batas dari /paths/{code}.json">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-emerald-50 text-emerald-600 cursor-help">
                <Hexagon size={10} />
              </span>
            </Tooltip>
            <Tooltip content="Punya lat/lng — peta bakal nge-zoom ke titik & tampil marker">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-sky-50 text-sky-600 cursor-help">
                <MapPin size={10} />
              </span>
            </Tooltip>
          </span>
        )}
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
    <div className="flex flex-wrap gap-3">
      <Select
        label="Provinsi"
        value={provCode}
        onChange={onProv}
        options={provinces}
        placeholder="Pilih Provinsi"
        withMeta
      />
      <Select
        label="Kab / Kota"
        value={regCode}
        onChange={onReg}
        options={regencies}
        placeholder="Pilih Kab/Kota"
        disabled={!provCode}
        withMeta
      />
      <Select
        label="Kecamatan"
        value={distCode}
        onChange={onDist}
        options={districts}
        placeholder="Pilih Kecamatan"
        disabled={!regCode}
        withMeta
      />
      <Select
        label="Kelurahan"
        value={villCode}
        onChange={onVill}
        options={villages}
        placeholder="Pilih Kelurahan"
        disabled={!distCode}
        withMeta
      />
    </div>
  );
}
