import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, type Product } from "../data/products";
import { AREA_MAP, CITATIONS } from "../data/lots";
import { parseSequence } from "./peptideMath";

/** Raw one-letter sequences, for motif matching. */
const ONE_LETTER: Record<string, string> = {
  "bpc-157": "GEPPPGKPADDAGLV",
  "tb-500": "SDKPDMAEIEKFDKSKLKKTETQ",
  semax: "MEHFPGP",
  selank: "TKPRPGP",
  epithalon: "AEDG",
  "mots-c": "MRWQEMGYIFYPRKLR",
};

type MatchKind = "sequence" | "cas" | "code" | "name" | "area";

interface Hit {
  p: Product;
  kind: MatchKind;
  detail: string;
}

const KIND_LABEL: Record<MatchKind, string> = {
  sequence: "Sequence motif",
  cas: "CAS number",
  code: "Catalog no.",
  name: "Name",
  area: "Research area",
};

const EXAMPLES = ["KPADDA", "gly-glu-pro-pro", "910463-68-2", "CP-01", "Metabolic"];

export function UniversalSearch({ onOpen }: { onOpen: (p: Product) => void }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /** What kind of query did the user just type? Drives the live hint line. */
  const interpretation = useMemo(() => {
    const raw = q.trim();
    if (!raw) return null;
    if (/^\d{2,7}-\d{2}-\d$/.test(raw)) return { kind: "cas" as const, as: raw };
    if (/^CP-\d{1,3}$/i.test(raw)) return { kind: "code" as const, as: raw.toUpperCase() };

    const { seq } = parseSequence(raw);
    // Treat as a sequence only when it parses cleanly and looks like residues.
    const stripped = raw.replace(/[^A-Za-z]/g, "");
    if (seq.length >= 3 && seq.length >= stripped.length / 3) {
      const wasThreeLetter = seq.length < stripped.length;
      return { kind: "sequence" as const, as: seq, normalized: wasThreeLetter };
    }
    return { kind: "text" as const, as: raw };
  }, [q]);

  const hits = useMemo<Hit[]>(() => {
    const raw = q.trim();
    if (!raw) return [];
    const lower = raw.toLowerCase();
    const out: Hit[] = [];

    for (const p of PRODUCTS) {
      // 1) CAS
      if (p.cas.replace(/\s/g, "") === raw.replace(/\s/g, "")) {
        out.push({ p, kind: "cas", detail: p.cas });
        continue;
      }
      // 2) Catalog number
      if (p.code.toLowerCase() === lower) {
        out.push({ p, kind: "code", detail: p.code });
        continue;
      }
      // 3) Sequence motif — substring over the stored one-letter sequence
      if (interpretation?.kind === "sequence") {
        const target = ONE_LETTER[p.id];
        if (target && target.includes(interpretation.as)) {
          out.push({ p, kind: "sequence", detail: target });
          continue;
        }
      }
      // 4) Name
      if (p.name.toLowerCase().includes(lower)) {
        out.push({ p, kind: "name", detail: p.name });
        continue;
      }
      // 5) Research area / tags
      const area = AREA_MAP[p.category] ?? p.category;
      if (area.toLowerCase().includes(lower) || p.tags.some((t) => t.includes(lower))) {
        out.push({ p, kind: "area", detail: area });
      }
    }
    return out.slice(0, 6);
  }, [q, interpretation]);

  const open = focused && q.trim().length > 0;

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 border bg-card px-4 py-3.5 transition-shadow ${
          focused
            ? "border-crimson shadow-[0_0_0_3px_rgba(228,0,43,0.10)]"
            : "border-ink2/15 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        }`}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0 text-ash">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 140)}
          aria-label="Search by sequence, peptide name, CAS number, or catalog number"
          placeholder="Search by sequence (3 or 1 letter), name, CAS # or catalog no."
          className="w-full bg-transparent font-data text-[13px] text-ink2 placeholder:text-ash/80 focus:outline-none"
        />
        {q && (
          <button
            onClick={() => { setQ(""); inputRef.current?.focus(); }}
            className="shrink-0 font-data text-[10px] uppercase tracking-[0.14em] text-ash hover:text-ink2"
          >
            Clear
          </button>
        )}
      </div>

      {/* live interpretation — tells the user the box understood them */}
      <div className="mt-2 min-h-[18px] font-data text-[10px] uppercase tracking-[0.14em] text-ash">
        {interpretation?.kind === "sequence" && (
          <span className="text-crimson-deep">
            Reading as sequence → {interpretation.as}
            {interpretation.normalized && " (normalized from 3-letter)"}
          </span>
        )}
        {interpretation?.kind === "cas" && <span>Reading as CAS registry number</span>}
        {interpretation?.kind === "code" && <span>Reading as catalog number</span>}
        {!interpretation && (
          <span className="flex flex-wrap items-center gap-1.5">
            Try
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => { setQ(ex); inputRef.current?.focus(); }}
                className="border border-rule px-1.5 py-0.5 normal-case tracking-normal text-graphite transition-colors hover:border-crimson hover:text-crimson-deep"
              >
                {ex}
              </button>
            ))}
          </span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-[58px] z-40 border border-ink2/15 bg-card shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)]"
          >
            {hits.length === 0 ? (
              <p className="px-4 py-6 font-plex text-[13px] text-ash">
                Nothing matches that. Sequence motifs, CAS numbers and catalog
                numbers all work here.
              </p>
            ) : (
              <ul className="divide-y divide-rule">
                {hits.map(({ p, kind, detail }) => (
                  <li key={p.id}>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); onOpen(p); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-paper"
                    >
                      <span className="shrink-0 border border-rule px-1.5 py-1 font-data text-[9px] text-ash">
                        {p.code}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-plex text-[14px] font-semibold text-ink2">{p.name}</span>
                          <span className="border border-crimson/25 bg-crimson-soft px-1.5 py-0.5 font-data text-[9px] uppercase tracking-[0.12em] text-crimson-deep">
                            {KIND_LABEL[kind]}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate font-data text-[11px] text-ash">
                          {kind === "sequence" ? (
                            <Highlight text={detail} motif={interpretation?.as ?? ""} />
                          ) : (
                            detail
                          )}
                          {" · "}{p.mw}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-data text-[12px] font-medium text-ink2">
                          ${p.price}
                        </span>
                        <span className="block font-data text-[9px] text-ash">
                          {CITATIONS[p.id] ?? 0} cited
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Bold the matched motif inside the full sequence, so the match is legible. */
function Highlight({ text, motif }: { text: string; motif: string }) {
  const i = motif ? text.indexOf(motif) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-crimson/15 font-semibold text-crimson-deep">
        {text.slice(i, i + motif.length)}
      </mark>
      {text.slice(i + motif.length)}
    </>
  );
}
