import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../data/products";
import { AREA_MAP, CITATIONS, LOTS, LAB } from "../data/lots";
import { FULFILMENT, MODIFICATIONS } from "../data/logistics";
import { ONE_LETTER } from "../lib/search";
import { MONOGRAPHS } from "../data/monographs";
import { VialPhoto } from "../components/VialPhoto";
import { gravy, isoelectricPoint, netCharge, solubilityHint } from "../v2/peptideMath";

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

export function ProductPanel({
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
        <motion.div className="fixed inset-0 z-[80] flex justify-end">
          <motion.div
            className="absolute inset-0 bg-obsidian/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} record`}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-slate2"
          >
            <Inner product={product} onClose={onClose} onAdd={onAdd} />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Inner({
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
  const lots = LOTS.filter((l) => l.productId === product.id).sort((a, b) => (a.tested < b.tested ? 1 : -1));
  const seq = ONE_LETTER[product.id];
  const mods = MODIFICATIONS[product.id] ?? [];
  const mono = MONOGRAPHS[product.id];

  const theory = useMemo(() => {
    if (!seq) return null;
    return {
      pI: isoelectricPoint(seq),
      q7: netCharge(seq, 7),
      gravy: gravy(seq),
      sol: solubilityHint(seq),
    };
  }, [seq]);

  return (
    <>
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-hair bg-slate2/95 px-5 py-4 backdrop-blur">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-hair px-1.5 py-0.5 font-data text-[9px] text-fog">{product.code}</span>
            <span className="lab">{AREA_MAP[product.category] ?? product.category}</span>
          </div>
          <h2 className="mt-1.5 font-sora text-2xl font-semibold tracking-[-0.02em] text-white">
            {product.name}
          </h2>
        </div>
        <button onClick={onClose} className="kbd shrink-0 hover:text-chalk">esc</button>
      </header>

      <div className="space-y-8 px-5 py-6">
        {/* RUO above the buy button, per-product — not only in the footer */}
        <p className="border-l-2 border-signal bg-signal/8 px-3 py-2.5 text-[12px] leading-relaxed text-signal">
          <strong className="font-semibold">Research use only.</strong> Not for
          human or veterinary use. Not a drug, dietary supplement, food or
          cosmetic. Not evaluated by the FDA.
        </p>

        {/* ---- vial + what this is ---- */}
        <section className="grid gap-5 sm:grid-cols-[150px_1fr] sm:items-start">
          <div className="mx-auto w-[140px] sm:mx-0 sm:w-full">
            <VialPhoto
              name={product.name}
              size={product.size}
              code={product.code}
              lot={lots.find((l) => l.released)?.lot}
              theme="dark"
              animate
              className="h-auto w-full"
            />
          </div>

          <div>
            {mono && (
              <p className="mb-2 inline-block border border-signal/30 bg-signal/10 px-2 py-1 font-data text-[9.5px] uppercase tracking-[0.14em] text-signal">
                {mono.class}
              </p>
            )}
            <p className="text-[14px] leading-relaxed text-chalk">{product.blurb}</p>
            {mono && (
              <p className="mt-3 text-[13.5px] leading-relaxed text-fog">{mono.what}</p>
            )}
          </div>
        </section>

        {/* ---- what it does, mechanistically ---- */}
        {mono && (
          <section className="space-y-5">
            <div>
              <h3 className="mb-2 lab">What it acts on</h3>
              <p className="text-[13.5px] leading-relaxed text-chalk">{mono.mechanism}</p>
            </div>

            <div>
              <h3 className="mb-2 lab">Studied in</h3>
              <ul className="space-y-1.5">
                {mono.studied.map((s) => (
                  <li key={s} className="flex gap-2.5 text-[13px] leading-relaxed text-fog">
                    <span className="mt-[3px] h-1 w-1 shrink-0 bg-signal" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-l-2 border-hair pl-3">
                <h3 className="mb-1.5 lab">Handling</h3>
                <p className="text-[12.5px] leading-relaxed text-fog">{mono.handling}</p>
              </div>
              <div className="border-l-2 border-hair pl-3">
                <h3 className="mb-1.5 lab">Origin</h3>
                <p className="text-[12.5px] leading-relaxed text-fog">{mono.origin}</p>
              </div>
            </div>

            <p className="border-t border-hair pt-3.5 text-[11.5px] leading-relaxed text-fog">
              Mechanism and study areas summarize published literature on the
              molecule. Nothing here describes an effect in humans, and no dosing
              or administration guidance is provided or available on request.
            </p>
          </section>
        )}

        {mods.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {mods.map((m) => (
              <span key={m} className="border border-hair px-2 py-1 font-data text-[10px] text-fog">
                {m}
              </span>
            ))}
          </div>
        )}

        {/* specification */}
        <section>
          <h3 className="mb-3 lab">Specification</h3>
          <dl className="divide-y divide-hair border-y border-hair">
            {[
              ["Sequence", product.sequence],
              ["Molecular formula", product.formula],
              ["Molecular weight", product.mw],
              ["CAS number", product.cas],
              ["Purity (spec)", `≥ ${product.purity}`],
              ["Quantity", product.size],
              ["Form", "Lyophilized powder, argon-sealed vial"],
              ["Storage", "-20 °C, protected from light"],
              ["Cited in", `${CITATIONS[product.id] ?? 0} publications`],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 py-2">
                <dt className="w-40 shrink-0 text-[12px] text-fog">{k}</dt>
                <dd className="font-data text-[12px] text-chalk">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* theoretical read, when we hold the raw sequence */}
        {theory && (
          <section className="border border-hair bg-obsidian p-4">
            <h3 className="mb-3 lab">Computed from sequence</h3>
            <dl className="grid grid-cols-2 gap-px border border-hair bg-hair sm:grid-cols-4">
              {[
                ["pI", theory.pI.toFixed(2)],
                ["q @ pH 7", theory.q7 >= 0 ? `+${theory.q7.toFixed(2)}` : theory.q7.toFixed(2)],
                ["GRAVY", theory.gravy.toFixed(2)],
                ["Solubility", theory.sol.label],
              ].map(([k, v]) => (
                <div key={k} className="bg-obsidian px-3 py-2.5">
                  <dt className="font-data text-[9px] uppercase tracking-[0.14em] text-fog">{k}</dt>
                  <dd className="mt-0.5 font-data text-[12px] font-medium text-chalk">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2.5 text-[11px] leading-relaxed text-fog">
              {theory.sol.note} Theoretical values from sequence alone — they
              describe the molecule, not any lot.
            </p>
          </section>
        )}

        {mw && <Calcs mw={mw} vialMg={vialMg} />}

        {/* lot documents */}
        <section>
          <h3 className="mb-3 lab">Lot documents</h3>
          {lots.length === 0 ? (
            <p className="text-[13px] text-fog">No lots on file for this compound yet.</p>
          ) : (
            <ul className="divide-y divide-hair border-y border-hair">
              {lots.map((l) => (
                <li key={l.lot} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="font-data text-[12px] text-chalk">{l.lot}</span>
                  <span className="font-data text-[11px] text-fog">{l.tested}</span>
                  <span className={`font-data text-[12px] font-medium ${l.released ? "text-signal" : "text-fog"}`}>
                    {l.purity.toFixed(2)}%
                  </span>
                  {l.released ? (
                    <span className="flex gap-1.5">
                      {["COA", "HPLC", "MS"].map((d) => (
                        <span key={d} className="border border-hair px-1.5 py-0.5 font-data text-[9px] uppercase tracking-[0.1em] text-chalk">
                          {d} ↓
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="font-data text-[9px] uppercase tracking-[0.12em] text-fog">
                      rejected · destroyed
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2.5 text-[11px] leading-relaxed text-fog">
            Tested by <span className="text-chalk">{LAB.name}</span> ({LAB.accreditation}).
            The specification above is nominal — for lot-specific values use that
            lot's certificate.
          </p>
        </section>

        {/* availability as a promise, not a word */}
        <section className="border border-hair bg-obsidian p-4">
          <h3 className="mb-2.5 lab">Availability</h3>
          <dl className="space-y-1.5 font-data text-[11.5px]">
            {[
              ["In stock", FULFILMENT.promise],
              ["Ships from", FULFILMENT.location],
              ["Cutoff", `order by ${FULFILMENT.cutoff}`],
              ["Shipping", FULFILMENT.shipping],
              ["Packing", FULFILMENT.packing],
              ["Returns", FULFILMENT.returns],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-fog">{k}</dt>
                <dd className="text-right text-chalk">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="flex items-end justify-between gap-4 border-t border-hair pt-5">
          <div>
            <span className="lab">Price</span>
            <p className="font-sora text-3xl font-semibold text-white">
              ${product.price}
              <span className="ml-1.5 font-data text-[12px] font-normal text-fog">
                / {product.size} vial
              </span>
            </p>
          </div>
          <button onClick={() => onAdd(product)} className="btn-signal">Add to order</button>
        </div>
      </div>
    </>
  );
}

/**
 * Three calculators on the product record, pre-seeded with this compound's MW —
 * Bio-Techne/Tocris is the only researched supplier that does this, footnoted to
 * override with the batch MW from the vial label.
 */
function Calcs({ mw, vialMg }: { mw: number; vialMg: number }) {
  const [tab, setTab] = useState<"recon" | "molar" | "dilute">("recon");

  const [mass, setMass] = useState(String(vialMg));
  const [conc, setConc] = useState("2");
  const volume = useMemo(() => {
    const m = parseFloat(mass), c = parseFloat(conc);
    return m && c ? m / c : null;
  }, [mass, conc]);

  const [molar, setMolar] = useState("1");
  const [vol, setVol] = useState("1");
  const needed = useMemo(() => {
    const mM = parseFloat(molar), v = parseFloat(vol);
    return mM && v ? (mM / 1000) * v * mw : null;
  }, [molar, vol, mw]);

  const [stock, setStock] = useState("2");
  const [target, setTarget] = useState("0.5");
  const [finalV, setFinalV] = useState("1");
  const aliquot = useMemo(() => {
    const s = parseFloat(stock), t = parseFloat(target), f = parseFloat(finalV);
    return s && t && f && t <= s ? (t * f) / s : null;
  }, [stock, target, finalV]);

  return (
    <section className="border border-hair bg-obsidian">
      <div className="flex border-b border-hair">
        {([["recon", "Reconstitution"], ["molar", "Molarity"], ["dilute", "Dilution"]] as const).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex-1 px-3 py-2.5 font-data text-[10px] uppercase tracking-[0.14em] transition-colors ${
              tab === k ? "bg-signal text-white" : "text-fog hover:text-chalk"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "recon" && (
          <div className="grid grid-cols-2 gap-3">
            <F label="Peptide in vial" unit="mg" value={mass} onChange={setMass} />
            <F label="Target concentration" unit="mg/mL" value={conc} onChange={setConc} />
            <O label="Add solvent" value={volume === null ? "—" : `${volume.toFixed(2)} mL`} />
            <O label="Per 100 µL" value={conc ? `${(parseFloat(conc) * 0.1).toFixed(3)} mg` : "—"} />
          </div>
        )}
        {tab === "molar" && (
          <div className="grid grid-cols-2 gap-3">
            <F label="Target molarity" unit="mM" value={molar} onChange={setMolar} />
            <F label="Final volume" unit="mL" value={vol} onChange={setVol} />
            <O label="Mass required" value={needed === null ? "—" : `${needed.toFixed(3)} mg`} />
            <O label="Using MW" value={`${mw.toFixed(1)} g/mol`} />
          </div>
        )}
        {tab === "dilute" && (
          <div className="grid grid-cols-3 gap-3">
            <F label="Stock" unit="mg/mL" value={stock} onChange={setStock} />
            <F label="Target" unit="mg/mL" value={target} onChange={setTarget} />
            <F label="Final volume" unit="mL" value={finalV} onChange={setFinalV} />
            <div className="col-span-2">
              <O label="Take stock" value={aliquot === null ? "—" : `${aliquot.toFixed(3)} mL`} />
            </div>
            <O
              label="Add diluent"
              value={aliquot === null ? "—" : `${(parseFloat(finalV) - aliquot).toFixed(3)} mL`}
            />
          </div>
        )}

        <p className="mt-3 text-[11px] leading-relaxed text-fog">
          Seeded with this compound's nominal molecular weight. Override with the
          batch-specific MW printed on your vial label for exact work.
        </p>
      </div>
    </section>
  );
}

function F({
  label, unit, value, onChange,
}: { label: string; unit: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block font-data text-[9px] uppercase tracking-[0.14em] text-fog">{label}</span>
      <span className="flex items-center border border-hair bg-slate2 focus-within:border-signal">
        <input
          type="number" min="0" step="any" value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-2.5 py-2 font-data text-[13px] text-white focus:outline-none"
        />
        <span className="shrink-0 px-2 font-data text-[10px] text-fog">{unit}</span>
      </span>
    </label>
  );
}

function O({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-1 block font-data text-[9px] uppercase tracking-[0.14em] text-fog">{label}</span>
      <p className="border border-signal/30 bg-signal/10 px-2.5 py-2 font-data text-[13px] font-medium text-signal">
        {value}
      </p>
    </div>
  );
}
