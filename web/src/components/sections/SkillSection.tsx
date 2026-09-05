import { useState } from "react";
import {
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Bot,
} from "lucide-react";

export function SkillSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section
      id="skill"
      className="sticky top-0 overflow-hidden rounded-t-[32px] border-t border-white/20 bg-white/60 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
    >
      {/* Blurred blobs — di belakang content, di atas bg section */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-amber-50/70 to-sky-50/50" />
      <div className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-amber-300/40 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[520px] w-[520px] rounded-full bg-orange-200/35 blur-[90px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[60px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold tracking-widest text-amber-700 uppercase">
              <Sparkles size={12} />
              SKILL.md
              <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                AI
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Bikin AI kamu
              <span className="block text-amber-600">nggak ngarang.</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-white">
                SKILL.md
              </code>{" "}
              itu contekan buat AI biar nggak halu. Daripada nebak kode wilayah,
              dia bakal fetch JSON beneran dari API statis. Aman.
            </p>

            <div className="mt-6">
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Gimana pasangnya?
              </div>

              <div className="mt-3 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">
                      1. Paling gampang — lewat CLI
                    </span>
                    <button
                      onClick={() => copy("npx @emsifa/wilayah skill", "cli")}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium hover:bg-white cursor-pointer"
                    >
                      {copied === "cli" ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Copy size={12} />
                      )}
                      {copied === "cli" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 font-mono text-xs text-slate-200">
                    npx @emsifa/wilayah skill
                  </pre>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    Pilih agent yang kamu gunakan — file SKILL.md bakal kecopy
                    ke folder skills yang sesuai.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-900">
                    2. Atau manual aja
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Tinggal copy file{" "}
                    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">
                      SKILL.md
                    </code>{" "}
                    dari repo ke{" "}
                    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">
                      .opencode/skills/
                    </code>{" "}
                    atau{" "}
                    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">
                      .codex/skills/
                    </code>
                    — jadi.
                  </p>
                  <a
                    href="https://github.com/emsifa/api-wilayah-indonesia"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
                  >
                    Lihat di GitHub <ArrowRight size={12} />
                  </a>
                </div>
              </div>

              {/* Tip — moved below manual card with icon */}
              <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 md:px-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                  <MessageCircle size={16} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Bot size={12} className="text-amber-700" />
                    Coba tanya AI kamu gini:
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-amber-900">
                    “Carikan semua kecamatan di Kota Bandung” → dia bakal{" "}
                    <code className="rounded bg-white px-1 py-0.5 font-mono text-amber-900">
                      fetch /districts/32.73.json
                    </code>{" "}
                    terus kasih list beneran, bukan ngarang.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — illustration */}
          <div className="relative flex items-center justify-center">
            <img
              src={`${import.meta.env.BASE_URL}skill_illustration.png`}
              alt="SKILL.md illustration — robot with SKILL.md API usage and floating Indonesia polygon regions"
              className="h-auto w-full max-w-[560px] object-contain drop-shadow-xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
