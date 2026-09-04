import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function AccordionItem({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left cursor-pointer"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {badge}
          <div className="min-w-0">
            <div className="truncate font-mono text-sm font-semibold text-slate-900">
              {title}
            </div>
            {subtitle && (
              <div className="truncate text-xs text-slate-500">{subtitle}</div>
            )}
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-5">
          {children}
        </div>
      )}
    </div>
  );
}
