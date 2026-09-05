import { useState, useEffect } from "react";
import { Menu, X, Github, ExternalLink, Star, GitFork } from "lucide-react";

const links = [
  { label: "Playground", href: "#" },
  { label: "API", href: "#api" },
  { label: "CLI", href: "#cli" },
  { label: "SKILL", href: "#skill" },
  { label: "FAQ", href: "#faq" },
];

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  const [forks, setForks] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/emsifa/api-wilayah-indonesia")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setStars(d.stargazers_count);
          setForks(d.forks_count);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-slate-200/70 bg-white/90 px-3 py-2 shadow-xl shadow-slate-900/10 backdrop-blur-xl md:px-4">
        <a href="#" className="flex items-center gap-2.5 pl-1">
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-slate-900">
              API Statis Wilayah Indonesia
            </span>
            <span className="text-[11px] font-medium tracking-wide text-slate-500">
              by emsifa
            </span>
          </span>
          <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-700 uppercase md:inline-flex">
            v2
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-900 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="https://github.com/emsifa/api-wilayah-indonesia"
            target="_blank"
            rel="noreferrer"
            title="Repository lama — 722 stars, 1412 forks (legacy)"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Github size={16} />
            {(stars !== null || forks !== null) && (
              <span className="ml-1 hidden items-center gap-1.5 border-l border-slate-200 pl-2 md:inline-flex">
                {stars !== null && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    {formatCount(stars)}
                  </span>
                )}
                {forks !== null && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <GitFork size={12} />
                    {formatCount(forks)}
                  </span>
                )}
              </span>
            )}
          </a>
          <a
            href="#api"
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Docs
            <ExternalLink size={14} className="opacity-60" />
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 md:hidden cursor-pointer"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {open && (
        <div className="pointer-events-auto absolute top-[64px] w-[calc(100%-2rem)] max-w-5xl rounded-[24px] border border-slate-200 bg-white p-4 shadow-2xl md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://github.com/emsifa/api-wilayah-indonesia"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Github size={16} />
              {stars !== null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-amber-300">
                  <Star size={12} className="fill-amber-300" />{" "}
                  {formatCount(stars)}
                </span>
              )}
              {forks !== null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-slate-200">
                  <GitFork size={12} /> {formatCount(forks)}
                </span>
              )}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
