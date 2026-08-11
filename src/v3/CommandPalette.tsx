import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, type Product } from "../data/products";
import { CITATIONS } from "../data/lots";
import { KIND_LABEL, interpret, search } from "../lib/search";

const EXAMPLES = ["KPADDA", "gly-glu-pro-pro", "910463-68-2", "CP-01", "metabolic"];

export function CommandPalette({
  open,
  onClose,
  onOpen,
}: {
  open: boolean;
  onClose: () => void;
  onOpen: (p: Product) => void;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const mode = useMemo(() => interpret(q), [q]);
  const hits = useMemo(() => (q.trim() ? search(q) : []), [q]);
  const fallback = useMemo(
    () => [...PRODUCTS].sort((a, b) => (CITATIONS[b.id] ?? 0) - (CITATIONS[a.id] ?? 0)).slice(0, 6),
    []
  );

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const list = q.trim() ? hits.map((h) => h.p) : fallback;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, list.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter" && list[active]) { e.preventDefault(); onOpen(list[active]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, q, hits, fallback, active, onOpen, onClose]);

  const rows = q.trim() ? hits : fallback.map((p) => ({ p, kind: "name" as const, detail: "Most cited" }));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-start justify-center px-4 pt-[9vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <div className="absolute inset-0 bg-obsidian/85 backdrop-blur-md" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search compounds"
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-2xl border border-hair bg-slate2 shadow-[0_50px_140px_-30px_rgba(0,0,0,1)]"
          >
            {/* scanning bar */}
            <div className="relative h-px overflow-hidden bg-hair">
              <motion.span
                animate={{ x: ["-40%", "140%"] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 h-px w-1/3 bg-signal"
              />
            </div>

            <div className="flex items-center gap-3 border-b border-hair px-4 py-3.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-signal">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search by sequence, name, CAS number, or catalog number"
                placeholder="Sequence (3 or 1 letter), name, CAS # or catalog no."
                className="w-full bg-transparent font-data text-[14px] text-white placeholder:text-fog/70 focus:outline-none"
              />
              <button onClick={onClose} className="kbd shrink-0 hover:text-chalk">esc</button>
            </div>

            {/* interpretation */}
            <div className="flex min-h-[34px] flex-wrap items-center gap-1.5 border-b border-hair px-4 py-2">
              {mode?.kind === "sequence" ? (
                <span className="font-data text-[10px] uppercase tracking-[0.14em] text-signal">
                  Reading as sequence → {mode.as}
                  {mode.normalized && " (normalized from 3-letter)"}
                </span>
              ) : mode?.kind === "cas" ? (
                <span className="lab">Reading as CAS registry number</span>
              ) : mode?.kind === "code" ? (
                <span className="lab">Reading as catalog number</span>
              ) : (
                <>
                  <span className="lab">Try</span>
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setQ(ex)}
                      className="border border-hair px-1.5 py-0.5 font-data text-[10px] text-chalk transition-colors hover:border-signal hover:text-signal"
                    >
                      {ex}
                    </button>
                  ))}
                </>
              )}
            </div>

            <div className="max-h-[46vh] overflow-y-auto">
              {rows.length === 0 ? (
                <p className="px-4 py-10 text-center font-data text-[12px] text-fog">
                  No match. Sequence motifs, CAS numbers and catalog numbers all work here.
                </p>
              ) : (
                <ul className="divide-y divide-hair">
                  {rows.map(({ p, kind, detail, ...rest }, i) => {
                    const motif = "motif" in rest ? (rest.motif as string | undefined) : undefined;
                    return (
                      <li key={p.id}>
                        <button
                          onMouseEnter={() => setActive(i)}
                          onMouseDown={(e) => { e.preventDefault(); onOpen(p); }}
                          className={`flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors ${
                            active === i ? "bg-raised" : "hover:bg-raised/60"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-9 shrink-0 items-center justify-center border font-data text-[9px] ${
                              active === i ? "border-signal bg-signal text-white" : "border-hair text-fog"
                            }`}
                          >
                            {p.code}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-[14px] font-semibold text-white">{p.name}</span>
                              <span className="border border-signal/30 bg-signal/10 px-1.5 py-0.5 font-data text-[9px] uppercase tracking-[0.12em] text-signal">
                                {KIND_LABEL[kind]}
                              </span>
                            </span>
                            <span className="mt-0.5 block truncate font-data text-[11px] text-fog">
                              {kind === "sequence" && motif ? (
                                <Mark text={detail} motif={motif} />
                              ) : (
                                detail
                              )}
                              {" · "}{p.mw}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block font-data text-[12px] font-medium text-white">
                              ${p.price}
                            </span>
                            <span className="block font-data text-[9px] text-fog">
                              {CITATIONS[p.id] ?? 0} cited
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-hair px-4 py-2.5">
              <span className="lab">
                {rows.length} {q.trim() ? "match" : "most cited"}
              </span>
              <span className="flex items-center gap-3 font-data text-[10px] text-fog">
                <span className="flex items-center gap-1"><span className="kbd">↑</span><span className="kbd">↓</span> move</span>
                <span className="flex items-center gap-1"><span className="kbd">↵</span> open</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Mark({ text, motif }: { text: string; motif: string }) {
  const i = text.indexOf(motif);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-signal/25 font-semibold text-signal">{text.slice(i, i + motif.length)}</mark>
      {text.slice(i + motif.length)}
    </>
  );
}
