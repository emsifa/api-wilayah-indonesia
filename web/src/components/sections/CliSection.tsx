import { useState } from "react";
import { Copy, Check, Terminal, Download, Layers, Bot } from "lucide-react";
import { CodeBlock } from "../ui/CodeBlock";

const tabs = [
  {
    id: "download",
    label: "download",
    icon: Download,
    title: "npx @emsifa/wilayah download",
    desc: "Mau self-host? Tarik full datanya dan host sendiri — CSV buat Excel, SQL buat import DB, JSON buat di-serve statis kayak API ini.",
    code: `# CSV — buat diolah di spreadsheet
npx @emsifa/wilayah download --format csv --output ./wilayah.csv

# SQL — tinggal import ke DB self-host lo
npx @emsifa/wilayah download --format sql --output ./wilayah.sql

# JSON — serve statis di Nginx / Cloudflare / Vercel lo sendiri
npx @emsifa/wilayah download --format json --output ./wilayah.json`,
    comingSoon: true,
  },
  {
    id: "scaffold",
    label: "scaffold",
    icon: Layers,
    title: "npx @emsifa/wilayah scaffold",
    desc: "Biar self-host makin sat-set — generate schema & migration buat Laravel, Prisma, atau Drizzle, tinggal migrate.",
    code: `# Laravel (migration + seeder)
npx @emsifa/wilayah scaffold --orm laravel

# Prisma (schema.prisma + seed)
npx @emsifa/wilayah scaffold --orm prisma

# Drizzle (schema.ts + seed)
npx @emsifa/wilayah scaffold --orm drizzle`,
    comingSoon: true,
  },
  {
    id: "skill",
    label: "skill",
    icon: Bot,
    title: "npx @emsifa/wilayah skill",
    desc: "Kamu vibe coder? install SKILL.md supaya AI agent kamu bisa bantu integrasikan data wilayah ke proyekmu — mendukung Claude, Codex, OpenCode, Antigravity, Kiro, dan lainnya.",
    code: `# Interactive — select agents via checklist (multi-select)
npx @emsifa/wilayah skill

# Non-interactive / CI
npx @emsifa/wilayah skill --agent claude,antigravity --yes

# Custom path (Others)
npx @emsifa/wilayah skill --agent others --target ./.cursor/skills/wilayah-indonesia/SKILL.md --yes`,
    comingSoon: false,
  },
] as const;

export function CliSection() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("skill");
  const [copied, setCopied] = useState(false);
  const current = tabs.find((t) => t.id === active)!;
  const isSoon = Boolean((current as { comingSoon?: boolean }).comingSoon);

  const handleCopy = async () => {
    if (isSoon) return;
    await navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="cli"
      className="sticky top-0 overflow-hidden rounded-t-[32px] border-t border-white/10 bg-slate-900 shadow-[0_-12px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-widest text-slate-300 uppercase backdrop-blur">
            <Terminal size={12} className="text-emerald-400" />
            CLI
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Self-host datanya sendiri
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Mau simpan datanya di aplikasi kamu? Download aja full datanya dan
            host sendiri.
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            const isTabSoon = Boolean((t as { comingSoon?: boolean }).comingSoon);
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{t.label}</span>
                {isTabSoon && (
                  <span className="absolute -top-1.5 -right-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow">
                    soon
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-[20px] border border-white/10 bg-slate-950 shadow-2xl">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-xs text-slate-500">
              {current.title}
            </span>
            <button
              onClick={handleCopy}
              disabled={isSoon}
              aria-disabled={isSoon}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium transition cursor-pointer ${
                isSoon
                  ? "cursor-not-allowed opacity-50 text-slate-500"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {copied ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="px-4 py-4 md:px-6">
            <p className="text-sm font-medium text-white">{current.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {current.desc}
            </p>

            <div className="relative mt-4">
              <div className={isSoon ? "blur-[6px] select-none pointer-events-none opacity-60" : ""}>
                <CodeBlock code={current.code} lang="bash" />
              </div>
              {isSoon && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/40 backdrop-blur-[1px]">
                  <span className="rounded-full border border-white/15 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-900 shadow-lg">
                    Soon
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/5 bg-white/[0.02] px-4 py-3 md:px-6">
            <p className="font-mono text-[11px] leading-relaxed text-slate-500">
              <span className="text-emerald-400">$</span> tips: tambahin{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 text-slate-300">
                --help
              </code>{" "}
              buat liat opsi lengkap. Hasilnya tinggal taro di repo/server lo
              dan serve sendiri — beres.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Mau datanya auto-update di server lo? Tempel{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-slate-300">
            npx @emsifa/wilayah download
          </code>{" "}
          di GitHub Actions / cron — tiap push auto tarik data terbaru buat
          self-host.
        </p>
      </div>
    </section>
  );
}
