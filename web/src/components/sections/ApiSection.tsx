import { useState } from "react";
import { Copy, Check, ExternalLink, Download } from "lucide-react";
import { AccordionItem } from "../ui/Accordion";
import { JsonHighlighter } from "../ui/JsonHighlighter";
import { CodeHighlighter } from "../ui/CodeHighlighter";
import { apiEndpoints, type SnippetLang } from "../api/apiSpec";

const LANGS: { key: SnippetLang; label: string }[] = [
  { key: "curl", label: "curl" },
  { key: "fetch", label: "Fetch" },
  { key: "axios", label: "Axios" },
  { key: "laravel", label: "Laravel" },
  { key: "go", label: "Go" },
  { key: "python", label: "Python" },
  { key: "php", label: "PHP" },
  { key: "dart", label: "Dart" },
];

export function ApiSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<SnippetLang>("curl");

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const baseUrl = "https://www.emsifa.com/api-wilayah-indonesia/v2";

  return (
    <section
      id="api"
      className="relative z-10 overflow-hidden rounded-t-[32px] border-t border-slate-200 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-widest text-slate-600 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              API Statis
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Tinggal fetch, beres
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              Nggak perlu bikin backend. Datanya cuma file JSON di GitHub Pages —
              tinggal <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">fetch</code> aja.
              Tanpa API key, tanpa rate limit. Gas langsung pakai.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <code className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 md:text-sm">
                {baseUrl}
              </code>
              <button
                onClick={() => copy(baseUrl, "base")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
                aria-label="Copy base URL"
              >
                {copied === "base" ? (
                  <Check size={16} className="text-emerald-600" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`${import.meta.env.BASE_URL}wilayah-postman.json`}
                download
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Download size={14} /> Postman
              </a>
              <a
                href={`${import.meta.env.BASE_URL}openapi.yml`}
                download
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <Download size={14} /> openapi.yml
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          {apiEndpoints.map((ep) => (
            <AccordionItem
              key={ep.path}
              title={ep.path}
              subtitle={ep.description}
              badge={
                <span className="shrink-0 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold tracking-widest text-white uppercase">
                  GET
                </span>
              }
            >
              <div className="space-y-4">
                <div>
                  {/* Header row: label + lang selector + copy button */}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                      Request
                    </span>

                    {/* Tab pills — desktop */}
                    <div className="hidden md:flex items-center gap-0.5 rounded-xl bg-slate-100 p-1">
                      {LANGS.map((l) => (
                        <button
                          key={l.key}
                          onClick={() => setActiveLang(l.key)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                            activeLang === l.key
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>

                    {/* Dropdown — mobile */}
                    <select
                      value={activeLang}
                      onChange={(e) => setActiveLang(e.target.value as SnippetLang)}
                      className="md:hidden rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 cursor-pointer"
                    >
                      {LANGS.map((l) => (
                        <option key={l.key} value={l.key}>
                          {l.label}
                        </option>
                      ))}
                    </select>

                    {/* Copy button */}
                    <button
                      onClick={() => copy(ep.snippets[activeLang], ep.path + "-code")}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      {copied === ep.path + "-code" ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Copy size={12} />
                      )}
                      Copy {LANGS.find((l) => l.key === activeLang)?.label}
                    </button>
                  </div>

                  {/* Code block */}
                  <CodeHighlighter code={ep.snippets[activeLang]} lang={activeLang} />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                      Response
                    </span>
                    <a
                      href={ep.curl.replace("curl ", "")}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      Try <ExternalLink size={12} />
                    </a>
                  </div>
                  <JsonHighlighter code={ep.response} theme="light" />
                </div>
              </div>
            </AccordionItem>
          ))}

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Ada {apiEndpoints.length} endpoint total • Semuanya balik{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">
            {"{ data, meta }"}
          </code>{" "}
          • Udah ke-cache CDN GitHub Pages, ngebut
        </p>
      </div>
    </section>
  );
}
