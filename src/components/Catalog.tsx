import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, CATEGORIES, type Category, type Product } from "../data/products";
import { VialPhoto } from "./VialPhoto";

export function Catalog({
  onAdd,
  onOpen,
}: {
  onAdd: (p: Product) => void;
  onOpen: (p: Product) => void;
}) {
  const [filter, setFilter] = useState<Category | "All">("All");

  const shown = useMemo(
    () => (filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section id="catalog" className="relative border-t border-line bg-ink py-20 sm:py-28">
      <div className="wrap">
        <SectionHead
          eyebrow="Compound library"
          title="Find your compound"
          desc="Every lot ships with a batch-specific certificate of analysis. Filter by research pathway."
        />

        {/* filter tabs */}
        <div className="mb-10 flex flex-wrap gap-2">
          <FilterTab label="All" active={filter === "All"} onClick={() => setFilter("All")} count={PRODUCTS.length} />
          {CATEGORIES.map((c) => (
            <FilterTab
              key={c.key}
              label={c.label}
              active={filter === c.key}
              onClick={() => setFilter(c.key)}
              count={PRODUCTS.filter((p) => p.category === c.key).length}
            />
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {shown.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} onAdd={onAdd} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function FilterTab({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2 border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
        active
          ? "border-culture bg-culture text-ink"
          : "border-line text-steel hover:border-steel hover:text-white"
      }`}
    >
      {label}
      <span className={`text-[10px] ${active ? "text-ink/70" : "text-steel/70"}`}>{count}</span>
    </button>
  );
}

function ProductCard({
  p,
  i,
  onAdd,
  onOpen,
}: {
  p: Product;
  i: number;
  onAdd: (p: Product) => void;
  onOpen: (p: Product) => void;
}) {
  const [added, setAdded] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
      className="group relative flex flex-col bg-ink p-6 transition-colors hover:bg-panel"
    >
      {/* hover accent bar */}
      <span className="absolute left-0 top-0 h-0.5 w-0 bg-culture transition-all duration-300 group-hover:w-full" />

      <header className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center border border-line font-mono text-[10px] text-steel transition-colors group-hover:border-culture group-hover:text-culture">
            {p.code}
          </span>
          <span className="chip">{p.category}</span>
        </div>
        {p.featured && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-culture">★ Popular</span>
        )}
      </header>

      {/* vial + name, both open the full record */}
      <button
        onClick={() => onOpen(p)}
        className="flex w-full items-start gap-4 text-left"
        aria-label={`View full record for ${p.name}`}
      >
        <span className="w-14 shrink-0">
          <VialPhoto
            name={p.name}
            size={p.size}
            code={p.code}
            theme="dark"
            className="h-auto w-full transition-transform duration-300 group-hover:-translate-y-1"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-2xl font-bold leading-none text-white transition-colors group-hover:text-culture">
            {p.name}
          </span>
          <span className="mt-3 block text-[13px] leading-relaxed text-steel">{p.blurb}</span>
        </span>
      </button>

      {/* spec readout */}
      <dl className="my-5 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-line py-4 font-mono text-[11px]">
        <Spec k="Sequence" v={p.sequence} truncate />
        <Spec k="MW" v={p.mw} />
        <Spec k="Purity" v={p.purity} accent />
        <Spec k="Size" v={p.size} />
      </dl>

      <div className="mt-auto flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">From</span>
          <p className="font-display text-2xl font-bold text-white">
            ${p.price}
            <span className="ml-1 font-mono text-[11px] font-normal text-steel">/ vial</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpen(p)}
            className="btn border border-line px-3 py-2.5 text-steel hover:border-culture hover:text-white"
          >
            Details
          </button>
          <button
            onClick={() => {
              onAdd(p);
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
            }}
            className={`btn px-4 py-2.5 font-semibold ${
              added
                ? "bg-white text-ink"
                : "border border-line text-mist hover:border-culture hover:bg-culture hover:text-ink"
            }`}
          >
            {added ? "Added ✓" : "Add +"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function Spec({
  k,
  v,
  accent,
  truncate,
}: {
  k: string;
  v: string;
  accent?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className={truncate ? "col-span-2 min-w-0" : ""}>
      <dt className="text-[9px] uppercase tracking-[0.16em] text-steel/70">{k}</dt>
      <dd className={`mt-0.5 ${truncate ? "truncate" : ""} ${accent ? "text-culture" : "text-mist"}`}>
        {v}
      </dd>
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  desc,
  center,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`mb-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}
      >
        <span className="h-px w-8 bg-culture" />
        <span className="eyebrow">{eyebrow}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-tightest text-white"
      >
        {title}
      </motion.h2>
      {desc && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-[15px] leading-relaxed text-steel"
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
}
