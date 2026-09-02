import { useMemo } from "react";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightJson(json: string, theme: "light" | "dark" = "light") {
  const escaped = escapeHtml(json);
  // light theme colors vs dark
  const colors =
    theme === "dark"
      ? {
          key: "text-sky-300",
          string: "text-emerald-300",
          number: "text-amber-300",
          boolean: "text-purple-300",
          null: "text-slate-400",
          punct: "text-slate-300",
          comment: "text-slate-500 italic",
        }
      : {
          key: "text-sky-700",
          string: "text-emerald-700",
          number: "text-amber-700",
          boolean: "text-purple-700",
          null: "text-slate-500",
          punct: "text-slate-600",
          comment: "text-slate-400 italic",
        };

  // Highlight // comments first (truncated markers)
  let withComments = escaped.replace(/\/\/.*$/gm, (m) => `<span class="${colors.comment}">${m}</span>`);

  // Regex: keys (string + colon), strings, booleans, null, numbers
  // Skip already highlighted comment spans by not re-processing inside <span>
  // Simple approach: split by comment spans, highlight only non-comment parts
  const parts = withComments.split(/(<span class="[^"]*">\/\/.*?<\/span>)/g);
  const regex =
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

  return parts
    .map((part) => {
      if (part.startsWith('<span class="')) return part;
      return part.replace(regex, (match) => {
        let cls = colors.punct;
        if (/^"/.test(match)) {
          if (/:$/.test(match)) cls = colors.key;
          else cls = colors.string;
        } else if (/true|false/.test(match)) cls = colors.boolean;
        else if (/null/.test(match)) cls = colors.null;
        else if (/-?\d/.test(match)) cls = colors.number;
        return `<span class="${cls}">${match}</span>`;
      });
    })
    .join("");
}

export function JsonHighlighter({
  code,
  theme = "light",
}: {
  code: string;
  theme?: "light" | "dark";
}) {
  const html = useMemo(() => highlightJson(code, theme), [code, theme]);

  const bg = theme === "dark" ? "bg-slate-950 border-white/5" : "bg-white border-slate-200";

  return (
    <pre
      className={`overflow-x-auto rounded-xl border p-4 text-xs leading-relaxed ${bg}`}
    >
      <code
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}

// Curl highlighter — single-pass untuk hindari korupsi attribute HTML
export function CurlHighlighter({ code }: { code: string }) {
  const escaped = escapeHtml(code);
  const html = escaped.replace(
    /(curl)|(https?:\/\/[^\s]+)|(--?\w[\w-]*)/g,
    (match, curl, url, flag) => {
      if (curl) return `<span class="text-emerald-300">${curl}</span>`;
      if (url) return `<span class="text-sky-300">${url}</span>`;
      if (flag) return `<span class="text-amber-300">${flag}</span>`;
      return match;
    },
  );
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed">
      <code
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        className="text-slate-200"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}
