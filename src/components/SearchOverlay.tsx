import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, type Product } from "../data/products";

const SUGGESTIONS = ["BPC-157", "GLP-1", "Recovery", "Semaglutide", "Longevity"];

export function SearchOverlay({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (p: Product) => void;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter((p) => {
      const hay = `${p.name} ${p.category} ${p.tags.join(" ")} ${p.sequence} ${p.blurb} ${p.code}`.toLowerCase();
      return hay.includes(term);
    });
  }, [q]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && results[active]) {
        onAdd(results[active]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, onAdd, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search compounds"
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-2xl border border-line bg-panel shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* scanning top line */}
            <div className="relative h-px w-full overflow-hidden bg-line">
              <motion.span
                animate={{ x: ["-40%", "140%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 h-px w-1/3 bg-culture"
              />
            </div>

            {/* input */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-culture">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Query the compound library…"
                className="w-full bg-transparent font-mono text-[15px] text-white placeholder:text-steel focus:outline-none"
              />
              <button
                onClick={onClose}
                className="shrink-0 border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-steel hover:border-culture hover:text-white"
              >
                Esc
              </button>
            </div>

            {/* quick filters */}
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">Try</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQ(s)}
                  className="border border-line px-2 py-1 font-mono text-[11px] text-mist transition-colors hover:border-culture hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* results */}
            <div className="max-h-[46vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="font-mono text-[13px] text-steel">
                    No compound matches “<span className="text-white">{q}</span>”.
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-steel">
                    Try a category, sequence, or product code.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {results.map((p, i) => (
                    <li key={p.id}>
                      <button
                        onMouseEnter={() => setActive(i)}
                        onClick={() => onAdd(p)}
                        className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${
                          active === i ? "bg-surface" : "hover:bg-surface/60"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center border font-mono text-[10px] ${
                            active === i
                              ? "border-culture bg-culture text-ink"
                              : "border-line text-steel"
                          }`}
                        >
                          {p.code}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="font-display text-[15px] font-semibold text-white">
                              {p.name}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
                              {p.category}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-[11px] text-steel">
                            {p.sequence} · {p.mw} · {p.purity}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-mono text-[13px] font-semibold text-culture">
                            ${p.price}
                          </span>
                          <span className="block font-mono text-[10px] text-steel">{p.size}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
                {results.length} result{results.length === 1 ? "" : "s"}
              </span>
              <span className="flex items-center gap-3 font-mono text-[10px] text-steel">
                <span className="flex items-center gap-1">
                  <kbd className="border border-line px-1">↑</kbd>
                  <kbd className="border border-line px-1">↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border border-line px-1">↵</kbd> add
                </span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
