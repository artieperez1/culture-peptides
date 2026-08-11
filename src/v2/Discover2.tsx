import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PRODUCTS, CATEGORIES, type Product } from "../data/products";
import { AREA_MAP, CITATIONS, LOTS } from "../data/lots";
import { Vial } from "../components/Vial";

/**
 * Dual-axis navigation, borrowed from CordenPharma, whose two main nav items are
 * "What You Need" and "How We Deliver" — the site is split along the customer's
 * axis versus the supplier's axis, and both routes reach the same molecules from
 * different mental models. Here: browse by research area (pathway-first) or by
 * compound class (molecule-first).
 *
 * Category names all end in "Research", following Limitless — which reinforces
 * the research-use posture in the navigation itself rather than only in a
 * disclaimer.
 */

type Axis = "area" | "class";

const CLASSES: { key: string; label: string; test: (p: Product) => boolean }[] = [
  { key: "single", label: "Single peptides", test: (p) => p.formula !== "Blend" && !p.tags.includes("coenzyme") },
  { key: "blend", label: "Pre-measured blends", test: (p) => p.tags.includes("blend") },
  { key: "glp", label: "GLP-1 / incretin", test: (p) => p.tags.includes("glp-1") || p.tags.includes("gip") },
  { key: "ghrh", label: "GH secretagogues", test: (p) => p.tags.includes("ghrh") || p.tags.includes("secretagogue") },
  { key: "melano", label: "Melanocortin", test: (p) => p.tags.includes("melanocortin") },
  { key: "cofactor", label: "Cofactors", test: (p) => p.tags.includes("coenzyme") },
];

export function Discover2({ onOpen }: { onOpen: (p: Product) => void }) {
  const [axis, setAxis] = useState<Axis>("area");
  const [active, setActive] = useState<string>("all");
  const [sort, setSort] = useState<"cited" | "price" | "name">("cited");

  const shown = useMemo(() => {
    let list = [...PRODUCTS];
    if (active !== "all") {
      list =
        axis === "area"
          ? list.filter((p) => p.category === active)
          : list.filter((p) => CLASSES.find((c) => c.key === active)?.test(p));
    }
    list.sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return (CITATIONS[b.id] ?? 0) - (CITATIONS[a.id] ?? 0);
    });
    return list;
  }, [axis, active, sort]);

  const chips =
    axis === "area"
      ? CATEGORIES.map((c) => ({ key: c.key as string, label: AREA_MAP[c.key] ?? c.label }))
      : CLASSES.map((c) => ({ key: c.key, label: c.label }));

  return (
    <section id="catalog2" className="border-b border-rule bg-paper py-16 sm:py-20">
      <div className="wrap">
        <Head
          eyebrow="Catalog"
          title="Two ways in"
          desc="Arrive by biological pathway or by compound class — both routes reach the same catalog."
        />

        {/* axis toggle */}
        <div className="mb-5 inline-flex border border-ink2/15 bg-card">
          {([["area", "By research area"], ["class", "By compound class"]] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => { setAxis(k); setActive("all"); }}
              className={`px-4 py-2.5 font-data text-[11px] uppercase tracking-[0.14em] transition-colors ${
                axis === k ? "bg-ink2 text-white" : "text-graphite hover:text-ink2"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* facet chips + sort */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Chip label="All" active={active === "all"} onClick={() => setActive("all")} n={PRODUCTS.length} />
            {chips.map((c) => {
              const n =
                axis === "area"
                  ? PRODUCTS.filter((p) => p.category === c.key).length
                  : PRODUCTS.filter((p) => CLASSES.find((x) => x.key === c.key)?.test(p)).length;
              return (
                <Chip
                  key={c.key}
                  label={c.label}
                  active={active === c.key}
                  onClick={() => setActive(c.key)}
                  n={n}
                />
              );
            })}
          </div>

          <label className="flex items-center gap-2">
            <span className="font-data text-[10px] uppercase tracking-[0.14em] text-ash">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-rule bg-card px-2.5 py-1.5 font-data text-[11px] text-ink2 focus:border-crimson focus:outline-none"
            >
              <option value="cited">Most cited</option>
              <option value="price">Price, low to high</option>
              <option value="name">Name, A–Z</option>
            </select>
          </label>
        </div>

        {/* grid */}
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Card key={p.id} p={p} i={i} onOpen={onOpen} />
          ))}
        </div>

        <p className="mt-4 font-plex text-[12px] text-ash">
          Showing {shown.length} of {PRODUCTS.length} compounds. All quantities
          supplied as lyophilized powder for laboratory research use.
        </p>
      </div>
    </section>
  );
}

function Card({ p, i, onOpen }: { p: Product; i: number; onOpen: (p: Product) => void }) {
  const lots = LOTS.filter((l) => l.productId === p.id && l.released);
  const latest = lots.sort((a, b) => (a.tested < b.tested ? 1 : -1))[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
      className="group flex flex-col bg-card p-5 transition-colors hover:bg-crimson-soft/40"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="border border-rule px-1.5 py-0.5 font-data text-[9px] text-ash">{p.code}</span>
        {/* Citations as a trust signal — "cited in 214 papers" outperforms any
            purity claim, and it's the cheapest differentiator (Bio-Techne). */}
        <span className="font-data text-[10px] text-ash">
          <span className="font-medium text-graphite">{CITATIONS[p.id] ?? 0}</span> cited
        </span>
      </div>

      <button
        onClick={() => onOpen(p)}
        className="flex w-full items-start gap-3.5 text-left"
        aria-label={`Open data for ${p.name}`}
      >
        <span className="w-12 shrink-0">
          <Vial
            name={p.name}
            size={p.size}
            code={p.code}
            theme="light"
            accent="#E4002B"
            className="h-auto w-full transition-transform duration-300 group-hover:-translate-y-1"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-xl font-semibold leading-tight text-ink2">
            {p.name}
          </span>
          <span className="mt-1 block font-data text-[10px] uppercase tracking-[0.14em] text-ash">
            {AREA_MAP[p.category] ?? p.category}
          </span>
        </span>
      </button>

      <dl className="my-4 space-y-1.5 border-y border-rule py-3 font-data text-[11px]">
        <Row k="MW" v={p.mw} />
        <Row k="CAS" v={p.cas} />
        {latest && (
          <Row
            k="Latest lot"
            v={`${latest.purity.toFixed(2)}% · ${latest.tested}`}
            accent
          />
        )}
      </dl>

      <div className="mt-auto flex items-end justify-between gap-3">
        <div>
          <p className="font-serif text-xl font-semibold text-ink2">${p.price}</p>
          <p className="font-data text-[10px] text-ash">{p.size}</p>
        </div>
        <button
          onClick={() => onOpen(p)}
          className="border border-ink2/20 px-3 py-2 font-data text-[10px] uppercase tracking-[0.14em] text-ink2 transition-colors hover:border-crimson hover:bg-crimson hover:text-white"
        >
          Data & order
        </button>
      </div>
    </motion.article>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ash">{k}</dt>
      <dd className={`text-right ${accent ? "text-crimson-deep" : "text-graphite"}`}>{v}</dd>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
  n,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  n: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 border px-3 py-2 font-data text-[11px] tracking-[0.04em] transition-colors ${
        active
          ? "border-crimson bg-crimson text-white"
          : "border-rule bg-card text-graphite hover:border-ink2/30 hover:text-ink2"
      }`}
    >
      {label}
      <span className={active ? "text-white/70" : "text-ash"}>{n}</span>
    </button>
  );
}

export function Head({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="h-px w-6 bg-crimson" />
        <span className="font-data text-[10px] uppercase tracking-[0.22em] text-crimson-deep">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-serif text-[clamp(1.9rem,4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink2">
        {title}
      </h2>
      {desc && (
        <p className="mt-3 font-plex text-[15px] leading-relaxed text-graphite">{desc}</p>
      )}
    </div>
  );
}
