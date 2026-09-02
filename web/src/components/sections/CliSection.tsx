import { useState } from "react";
import { Copy, Check, Terminal, Download, Layers, Bot } from "lucide-react";
import { CodeBlock } from "../ui/CodeBlock";

const tabs = [
  {
    id: "download",
    label: "download",
    icon: Download,
    title: "npx wilayah download",
    desc: "Mau self-host? Tarik full datanya dan host sendiri — CSV buat Excel, SQL buat import DB, JSON buat di-serve statis kayak API ini.",
    code: `# CSV — buat diolah di spreadsheet
npx wilayah download --format csv --output ./wilayah.csv

# SQL — tinggal import ke DB self-host lo
npx wilayah download --format sql --output ./wilayah.sql

# JSON — serve statis di Nginx / Cloudflare / Vercel lo sendiri
npx wilayah download --format json --output ./wilayah.json`,
  },
  {
    id: "scaffold",
    label: "scaffold",
    icon: Layers,
    title: "npx wilayah scaffold",
    desc: "Biar self-host makin sat-set — generate schema & migration buat Laravel, Prisma, atau Drizzle, tinggal migrate.",
    code: `# Laravel (migration + seeder)
npx wilayah scaffold --orm laravel

# Prisma (schema.prisma + seed)
npx wilayah scaffold --orm prisma

# Drizzle (schema.ts + seed)
npx wilayah scaffold --orm drizzle`,
  },
  {
    id: "skill",
    label: "skill",
    icon: Bot,
    title: "npx wilayah skill",
    desc: "Self-host AI juga? Kasih SKILL.md biar AI lo paham wilayah tanpa ngarang — buat Claude, Codex, OpenCode.",
    code: `# Claude Code
npx wilayah skill --agent claude

# Codex
npx wilayah skill --agent codex

# OpenCode
npx wilayah skill --agent opencode`,
  },
] as const;

export function CliSection() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("download");
  const [copied, setCopied] = useState(false);
  const current = tabs.find((t) => t.id === active)!;

  const handleCopy = async () => {
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
            Nggak mau tergantung API orang? Download aja full datanya dan host
            sendiri — mau di VPS, Vercel, atau Cloudflare, bebas atur, nggak
            takut API mati.
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{t.label}</span>
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="px-4 py-4 md:px-6">
            <p className="text-sm font-medium text-white">{current.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {current.desc}
            </p>

            <div className="mt-4">
              <CodeBlock code={current.code} lang="bash" />
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
            npx wilayah download
          </code>{" "}
          di GitHub Actions / cron — tiap push auto tarik data terbaru buat self-host.
        </p>
      </div>
    </section>
  );
}
