import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../data/products";
import { MONOGRAPHS } from "../data/monographs";
import { LOTS, LAB, CITATIONS } from "../data/lots";
import { Vial } from "./Vial";

/**
 * Detail view for direction 01. Same monograph content as the other two
 * directions, dressed in this direction's palette.
 */
export function ProductDetail({
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
        <motion.div className="fixed inset-0 z-[78] flex justify-end">
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} details`}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-panel"
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
  const mono = MONOGRAPHS[product.id];
  const lots = LOTS.filter((l) => l.productId === product.id && l.released)
    .sort((a, b) => (a.tested < b.tested ? 1 : -1));

  return (
    <>
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-panel/95 px-5 py-4 backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip">{product.code}</span>
            <span className="chip">{product.category}</span>
          </div>
          <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tightest text-white">
            {product.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-steel hover:border-culture hover:text-white"
        >
          Esc
        </button>
      </header>

      <div className="space-y-8 px-5 py-6">
        <p className="border-l-2 border-culture bg-culture/8 px-3 py-2.5 text-[12px] leading-relaxed text-culture">
          <strong className="font-semibold">Research use only.</strong> Not for
          human or veterinary use. Not a drug, supplement, food or cosmetic.
        </p>

        <section className="grid gap-5 sm:grid-cols-[140px_1fr] sm:items-start">
          <div className="mx-auto w-[130px] sm:mx-0 sm:w-full">
            <Vial
              name={product.name}
              size={product.size}
              code={product.code}
              lot={lots[0]?.lot}
              theme="dark"
              accent="#FF2233"
              animate
              className="h-auto w-full"
            />
          </div>
          <div>
            {mono && <p className="chip mb-2 !text-culture">{mono.class}</p>}
            <p className="text-[14px] leading-relaxed text-mist">{product.blurb}</p>
            {mono && <p className="mt-3 text-[13.5px] leading-relaxed text-steel">{mono.what}</p>}
          </div>
        </section>

        {mono && (
          <section className="space-y-5">
            <div>
              <h3 className="eyebrow mb-2">What it acts on</h3>
              <p className="text-[13.5px] leading-relaxed text-mist">{mono.mechanism}</p>
            </div>
            <div>
              <h3 className="eyebrow mb-2">Studied in</h3>
              <ul className="space-y-1.5">
                {mono.studied.map((s) => (
                  <li key={s} className="flex gap-2.5 text-[13px] leading-relaxed text-steel">
                    <span className="mt-[3px] h-1 w-1 shrink-0 bg-culture" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-l-2 border-line pl-3">
                <h3 className="eyebrow mb-1.5">Handling</h3>
                <p className="text-[12.5px] leading-relaxed text-steel">{mono.handling}</p>
              </div>
              <div className="border-l-2 border-line pl-3">
                <h3 className="eyebrow mb-1.5">Origin</h3>
                <p className="text-[12.5px] leading-relaxed text-steel">{mono.origin}</p>
              </div>
            </div>
            <p className="border-t border-line pt-3.5 text-[11.5px] leading-relaxed text-steel">
              Mechanism and study areas summarize published literature on the
              molecule. Nothing here describes an effect in humans, and no dosing
              or administration guidance is provided or available on request.
            </p>
          </section>
        )}

        <section>
          <h3 className="eyebrow mb-3">Specification</h3>
          <dl className="divide-y divide-line border-y border-line font-mono text-[12px]">
            {[
              ["Sequence", product.sequence],
              ["Formula", product.formula],
              ["Molecular weight", product.mw],
              ["CAS", product.cas],
              ["Purity (spec)", `≥ ${product.purity}`],
              ["Quantity", product.size],
              ["Form", "Lyophilized powder, sealed vial"],
              ["Storage", "-20 °C, protected from light"],
              ["Cited in", `${CITATIONS[product.id] ?? 0} publications`],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 py-2">
                <dt className="w-36 shrink-0 text-steel">{k}</dt>
                <dd className="text-mist">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {lots.length > 0 && (
          <section>
            <h3 className="eyebrow mb-3">Lot documents</h3>
            <ul className="divide-y divide-line border-y border-line">
              {lots.map((l) => (
                <li key={l.lot} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="font-mono text-[12px] text-mist">{l.lot}</span>
                  <span className="font-mono text-[11px] text-steel">{l.tested}</span>
                  <span className="font-mono text-[12px] font-semibold text-culture">
                    {l.purity.toFixed(2)}%
                  </span>
                  <span className="flex gap-1.5">
                    {["COA", "HPLC", "MS"].map((d) => (
                      <span key={d} className="chip">{d} ↓</span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2.5 text-[11px] leading-relaxed text-steel">
              Tested by <span className="text-mist">{LAB.name}</span> ({LAB.accreditation}).
            </p>
          </section>
        )}

        <div className="flex items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <span className="eyebrow">Price</span>
            <p className="font-display text-3xl font-bold text-white">
              ${product.price}
              <span className="ml-1.5 font-mono text-[12px] font-normal text-steel">
                / {product.size}
              </span>
            </p>
          </div>
          <button onClick={() => onAdd(product)} className="btn-primary">Add to cart</button>
        </div>
      </div>
    </>
  );
}
