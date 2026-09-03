import { useMemo } from "react";
import type { SnippetLang } from "../api/apiSpec";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import go from "highlight.js/lib/languages/go";
import python from "highlight.js/lib/languages/python";
import php from "highlight.js/lib/languages/php";
import dart from "highlight.js/lib/languages/dart";
import markdown from "highlight.js/lib/languages/markdown";
import "../../styles/hljs-dark.css";

// Registrasi selective — hanya 7 grammar yang dipakai, ringan & tree-shakable
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("go", go);
hljs.registerLanguage("python", python);
hljs.registerLanguage("php", php);
hljs.registerLanguage("dart", dart);
hljs.registerLanguage("markdown", markdown);

const langMap: Record<SnippetLang, string> = {
  curl: "bash",
  fetch: "javascript",
  axios: "javascript",
  laravel: "php",
  go: "go",
  python: "python",
  php: "php",
  dart: "dart",
};

function enhanceBash(html: string): string {
  // highlight.js bash hanya highlight string, perlu tambahan untuk curl / url / flags
  // split by HTML tags, skip saat di dalam hljs-string agar flag di dalam quote tidak dobel
  const parts = html.split(/(<[^>]*>)/g);
  let insideString = false;
  const stack: string[] = [];
  return parts
    .map((part) => {
      if (part.startsWith("<")) {
        if (part.startsWith("</span")) {
          const popped = stack.pop();
          if (popped?.includes("hljs-string")) insideString = stack.some((s) => s.includes("hljs-string"));
        } else if (part.startsWith("<span")) {
          stack.push(part);
          if (part.includes("hljs-string")) insideString = true;
        }
        return part;
      }
      if (insideString || part === "") return part;
      // single-pass: curl | url | flag
      return part.replace(
        /(curl)|(https?:\/\/[^\s"'`&;<>]+)|(--?[a-zA-Z][a-zA-Z0-9-]*)/g,
        (m, curl, url, flag) => {
          if (curl) return `<span class="text-emerald-300">${curl}</span>`;
          if (url) return `<span class="text-sky-300">${url}</span>`;
          if (flag) return `<span class="text-amber-300">${flag}</span>`;
          return m;
        }
      );
    })
    .join("");
}

function getHighlighted(code: string, lang: string): string {
  if (hljs.getLanguage(lang)) {
    const raw = hljs.highlight(code, { language: lang }).value;
    // hanya bash (untuk snippet curl) yang perlu enhancement
    if (lang === "bash") return enhanceBash(raw);
    return raw;
  }
  return hljs.highlightAuto(code).value;
}

export function CodeHighlighter({ code, lang }: { code: string; lang: SnippetLang }) {
  const html = useMemo(() => getHighlighted(code, langMap[lang]), [code, lang]);
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed">
      <code
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        className="hljs whitespace-pre text-slate-200"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}

export function MarkdownHighlighter({ code }: { code: string }) {
  const html = useMemo(() => getHighlighted(code, "markdown"), [code]);
  return (
    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">
      <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
