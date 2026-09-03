import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import "../../styles/hljs-light.css";

// reuse core instance — modul singleton. Jika belum terdaftar, daftarkan json
if (!hljs.getLanguage("json")) {
  hljs.registerLanguage("json", json);
}

function highlightJsonHljs(code: string): string {
  // keep // comments truncation markers — hljs json tanpa comment, jadi highlight komentar dulu via placeholder logic
  // highlight.js handle string/number/attr/literal native, cukup pakai hljs.highlight
  try {
    return hljs.highlight(code, { language: "json" }).value;
  } catch {
    return hljs.highlightAuto(code, ["json"]).value;
  }
}

export function JsonHighlighter({
  code,
  theme = "light",
}: {
  code: string;
  theme?: "light" | "dark";
}) {
  const html = useMemo(() => highlightJsonHljs(code), [code]);

  const bg = theme === "dark" ? "bg-slate-950 border-white/5" : "bg-white border-slate-200";
  const themeClass = theme === "dark" ? "hljs-dark" : "hljs-light";

  return (
    <pre className={`overflow-x-auto rounded-xl border p-4 text-xs leading-relaxed ${bg}`}>
      <code
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        className={themeClass}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}

// CurlHighlighter — sekarang jadi alias tipis ke bash highlight biar konsisten (tetap export untuk backward compat)
import bash from "highlight.js/lib/languages/bash";
import "../../styles/hljs-dark.css";
if (!hljs.getLanguage("bash")) {
  hljs.registerLanguage("bash", bash);
}

export function CurlHighlighter({ code }: { code: string }) {
  const html = useMemo(() => {
    if (hljs.getLanguage("bash")) return hljs.highlight(code, { language: "bash" }).value;
    return hljs.highlightAuto(code).value;
  }, [code]);
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed">
      <code
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        className="hljs text-slate-200"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}
