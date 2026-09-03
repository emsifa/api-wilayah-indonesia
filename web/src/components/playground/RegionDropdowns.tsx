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
