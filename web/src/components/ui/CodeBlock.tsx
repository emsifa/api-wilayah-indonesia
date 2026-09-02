import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CodeBlock({
  code,
  lang = "bash",
  title,
}: {
  code: string;
  lang?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
      {title && (
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            {title}
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
          <code
            className="font-mono text-slate-200"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {code}
          </code>
        </pre>
        {!title && (
          <button
            onClick={handleCopy}
            aria-label="Copy code"
            className="absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-slate-300 backdrop-blur transition hover:bg-white/20 hover:text-white cursor-pointer"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function InlineCodeBlock({
  code,
  onCopy,
}: {
  code: string;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <code className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700">
      <span className="truncate">{code}</span>
      <button
        onClick={handleCopy}
        className="shrink-0 rounded p-1 hover:bg-slate-200 cursor-pointer"
        aria-label="Copy"
      >
        {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
      </button>
    </code>
  );
}
