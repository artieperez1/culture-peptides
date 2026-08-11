import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../data/products";
import { AREA_MAP, CITATIONS, LOTS, LAB } from "../data/lots";

/**
 * Bio-Techne / Tocris embeds Molarity, Dilution and Reconstitution calculators
 * directly on the product page, pre-seeded with that product's MW and footnoted
 * to use the batch-specific MW from the vial label. Nobody else does it — Sigma
 * has better calculators but strands them in a separate hub. Meeting the "how
 * much buffer do I add to this vial" question at the moment it arises is a small
 * build with outsized perceived quality.
 */
function parseMw(mw: string): number | null {
  const m = mw.match(/([\d,]+\.?\d*)/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function parseMg(size: string): number {
  const m = size.match(/([\d.]+)\s*mg/i);
  return m ? parseFloat(m[1]) : 5;
}

export function ProductDrawer({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: (p: Product) => void;
}) {
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div className="fixed inset-0 z-[75] flex justify-end">
          <motion.div
            className="absolute inset-0 bg-ink2/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} details`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-paper"
          >
            <Body product={product} onClose={onClose} onAdd={onAdd} />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Body({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (p: Product) => void;
}) {
  const mw = parseMw(product.mw);
  const vialMg = parseMg(product.size);
  const lots = LOTS.filter((l) => l.productId === product.id && l.released);
  const area = AREA_MAP[product.category] ?? product.category;

  return (
    <>
      {/* header */}
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-rule bg-paper/95 px-5 py-4 backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <span className="border border-rule px-1.5 py-0.5 font-data text-[9px] text-ash">
              {product.code}
            </span>
            <span className="font-data text-[10px] uppercase tracking-[0.14em] text-ash">{area}</span>
          </div>
          <h2 className="mt-1.5 font-serif text-2xl font-semibold text-ink2">{product.name}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 border border-rule px-2 py-1 font-data text-[10px] uppercase tracking-[0.14em] text-ash hover:border-ink2 hover:text-ink2"
        >
          Esc
        </button>
      </header>

      <div className="space-y-8 px-5 py-6">
        {/*
          Per-product RUO notice ABOVE the buy button, not only in the footer.
          Layer 3 of the compliance framework the research recommended.
        */}
        <p className="border-l-2 border-crimson bg-crimson-soft px-3 py-2.5 font-plex text-[12px] leading-relaxed text-crimson-deep">
          <strong className="font-semibold">Research use only.</strong> Not for
          human or veterinary use. Not a drug, dietary supplement, food or
          cosmetic. Not evaluated by the FDA.
        </p>

        <p className="font-plex text-[14px] leading-relaxed text-graphite">{product.blurb}</p>

        {/* spec table — the fields the reagent suppliers actually publish */}
        <section>
          <h3 className="mb-3 font-data text-[10px] uppercase tracking-[0.18em] text-ash">
            Specification
          </h3>
          <dl className="divide-y divide-rule border-y border-rule">
            {[
              ["Sequence", product.sequence],
              ["Molecular formula", product.formula],
              ["Molecular weight", product.mw],
              ["CAS number", product.cas],
              ["Purity (spec)", `≥ ${product.purity}`],
              ["Quantity", product.size],
              ["Form", "Lyophilized powder, sealed vial"],
              ["Storage", "-20 °C, protected from light"],
              ["Cited in", `${CITATIONS[product.id] ?? 0} publications`],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 py-2">
                <dt className="w-40 shrink-0 font-plex text-[12px] text-ash">{k}</dt>
                <dd className="font-data text-[12px] text-ink2">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {mw && <Calculators mw={mw} vialMg={vialMg} />}

        {/* lot-specific documents */}
        <section>
          <h3 className="mb-3 font-data text-[10px] uppercase tracking-[0.18em] text-ash">
            Lot documents
          </h3>
          {lots.length === 0 ? (
            <p className="font-plex text-[13px] text-ash">
              No released lots on file for this compound yet.
            </p>
          ) : (
            <ul className="divide-y divide-rule border-y border-rule">
              {lots.map((l) => (
                <li key={l.lot} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="font-data text-[12px] text-ink2">{l.lot}</span>
                  <span className="font-data text-[11px] text-ash">tested {l.tested}</span>
                  <span className="font-data text-[12px] font-medium text-crimson-deep">
                    {l.purity.toFixed(2)}%
                  </span>
                  <span className="flex gap-1.5">
                    {["COA", "HPLC", "MS"].map((d) => (
                      <span
                        key={d}
                        className="border border-rule px-1.5 py-0.5 font-data text-[9px] uppercase tracking-[0.12em] text-graphite"
                      >
                        {d} ↓
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2.5 font-plex text-[11px] leading-relaxed text-ash">
            Tested by <span className="text-graphite">{LAB.name}</span> ({LAB.accreditation},{" "}
            {LAB.location}). The specification above is for guidance — for
            lot-specific values refer to that lot's certificate of analysis.
          </p>
        </section>

        {/* buy */}
        <div className="flex items-end justify-between gap-4 border-t border-rule pt-5">
          <div>
            <span className="font-data text-[10px] uppercase tracking-[0.14em] text-ash">Price</span>
            <p className="font-serif text-3xl font-semibold text-ink2">
              ${product.price}
              <span className="ml-1.5 font-data text-[12px] font-normal text-ash">
                / {product.size} vial
              </span>
            </p>
          </div>
          <button onClick={() => onAdd(product)} className="btn-record">
            Add to order
          </button>
        </div>
      </div>
    </>
  );
}

function Calculators({ mw, vialMg }: { mw: number; vialMg: number }) {
  const [tab, setTab] = useState<"recon" | "molarity">("recon");

  // Reconstitution: volume to reach a target concentration.
  const [mass, setMass] = useState(String(vialMg));
  const [conc, setConc] = useState("2");
  const volume = useMemo(() => {
    const m = parseFloat(mass);
    const c = parseFloat(conc);
    if (!m || !c) return null;
    return m / c; // mg ÷ (mg/mL) = mL
  }, [mass, conc]);

  // Molarity: mass needed for a target molar concentration and volume.
  const [molar, setMolar] = useState("1");
  const [vol, setVol] = useState("1");
  const needed = useMemo(() => {
    const mM = parseFloat(molar);
    const v = parseFloat(vol);
    if (!mM || !v) return null;
    return (mM / 1000) * v * mw; // mM→M × L… expressed in mg for mL input
  }, [molar, vol, mw]);

  return (
    <section className="border border-rule bg-card">
      <div className="flex border-b border-rule">
        {([["recon", "Reconstitution"], ["molarity", "Molarity"]] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex-1 px-4 py-2.5 font-data text-[10px] uppercase tracking-[0.16em] transition-colors ${
              tab === k
                ? "bg-ink2 text-white"
                : "text-ash hover:text-ink2"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        {tab === "recon" ? (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Peptide in vial" unit="mg" value={mass} onChange={setMass} />
            <Field label="Target concentration" unit="mg/mL" value={conc} onChange={setConc} />
            <Result
              label="Add solvent"
              value={volume === null ? "—" : `${volume.toFixed(2)} mL`}
            />
            <Result
              label="Per 100 µL"
              value={volume === null ? "—" : `${(parseFloat(conc) * 0.1).toFixed(3)} mg`}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target molarity" unit="mM" value={molar} onChange={setMolar} />
            <Field label="Final volume" unit="mL" value={vol} onChange={setVol} />
            <Result
              label="Mass required"
              value={needed === null ? "—" : `${needed.toFixed(3)} mg`}
            />
            <Result label="Using MW" value={`${mw.toFixed(1)} g/mol`} />
          </div>
        )}

        <p className="mt-3 font-plex text-[11px] leading-relaxed text-ash">
          Pre-filled with this compound's nominal molecular weight. Override it
          with the batch-specific MW printed on your vial label for exact work.
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-data text-[9px] uppercase tracking-[0.14em] text-ash">
        {label}
      </span>
      <span className="flex items-center border border-rule bg-paper focus-within:border-crimson">
        <input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-2.5 py-2 font-data text-[13px] text-ink2 focus:outline-none"
        />
        <span className="shrink-0 px-2 font-data text-[10px] text-ash">{unit}</span>
      </span>
    </label>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-1 block font-data text-[9px] uppercase tracking-[0.14em] text-ash">
        {label}
      </span>
      <p className="border border-ink2/15 bg-crimson-soft px-2.5 py-2 font-data text-[13px] font-medium text-crimson-deep">
        {value}
      </p>
    </div>
  );
}
