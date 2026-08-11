import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PRODUCTS, CATEGORIES, type Product } from "../data/products";
import { AREA_MAP, CITATIONS, LOTS } from "../data/lots";
import { MODIFICATIONS } from "../data/logistics";
import { Vial } from "../components/Vial";

/**
 * Two ideas stacked.
 *
 * 1) The routing table — CS Bio's "Find the right CSBio peptide synthesizer"
 *    (columns: Need | Recommended | Typical use | Learn more). Not a filter, not
 *    a quiz: a static table that converts vague intent into a specific SKU in one
 *    glance. Cheap to build, disproportionately effective.
 *
 * 2) Dual-axis browse — CordenPharma's "What You Need" / "How We Deliver" split,
 *    plus CPC Scientific's cross-cutting modification tags as a third axis over
 *    the compound tree.
 */

const ROUTES: { need: string; ids: string[]; use: string }[] = [
  { need: "Connective tissue & gut models", ids: ["bpc-157", "tb-500", "bpc-tb-blend"], use: "Repair and migration assays" },
  { need: "Incretin / GLP-1 pathway work", ids: ["semaglutide", "tirzepatide", "retatrutide"], use: "Receptor and metabolic studies" },
  { need: "GH-axis stimulation", ids: ["cjc-1295", "ipamorelin", "tesamorelin"], use: "Secretagogue comparisons" },
  { need: "Dermal & pigment models", ids: ["ghk-cu", "melanotan-2"], use: "Collagen and melanocortin assays" },
  { need: "Neuro & behavioural models", ids: ["semax", "selank"], use: "BDNF and anxiolytic research" },
  { need: "Mitochondrial & ageing models", ids: ["mots-c", "epithalon", "nad-plus"], use: "Cellular energy and telomere work" },
];

type Axis = "area" | "mod";

const ALL_MODS = [...new Set(Object.values(MODIFICATIONS).flat())].sort();

export function Finder({ onOpen }: { onOpen: (p: Product) => void }) {
  const [axis, setAxis] = useState<Axis>("area");
  const [active, setActive] = useState("all");
  const [sort, setSort] = useState<"cited" | "price" | "name">("cited");

  const shown = useMemo(() => {
    let list = [...PRODUCTS];
    if (active !== "all") {
      list =
        axis === "area"
          ? list.filter((p) => p.category === active)
          : list.filter((p) => (MODIFICATIONS[p.id] ?? []).includes(active));
    }
    list.sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return (CITATIONS[b.id] ?? 0) - (CITATIONS[a.id] ?? 0);
    });
    return list;
  }, [axis, active, sort]);

  const byId = (id: string) => PRODUCTS.find((p) => p.id === id)!;

  const chips =
    axis === "area"
      ? CATEGORIES.map((c) => ({ key: c.key as string, label: AREA_MAP[c.key] ?? c.label }))
      : ALL_MODS.map((m) => ({ key: m, label: m }));

  return (
    <section id="finder" className="border-b border-hair bg-obsidian py-18 sm:py-24">
      <div className="wrap">
        <Head3
          eyebrow="Start here"
          title="Find the right compound"
          desc="Tell us the model you're working in and we'll point at the shelf — or browse the catalog directly."
        />

        {/* ---- routing table ---- */}
        <div className="mb-16 overflow-x-auto border border-hair">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-hair bg-slate2">
                {["If you're working on", "Start with", "Typical use", ""].map((h) => (
                  <th key={h} className="px-4 py-3 lab">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROUTES.map((r, i) => (
                <motion.tr
                  key={r.need}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="border-b border-hair last:border-0 hover:bg-slate2/70"
                >
                  <td className="px-4 py-3.5 text-[13.5px] font-medium text-white">{r.need}</td>
                  <td className="px-4 py-3.5">
                    <span className="flex flex-wrap gap-1.5">
                      {r.ids.map((id) => (
                        <button
                          key={id}
                          onClick={() => onOpen(byId(id))}
                          className="border border-hair px-2 py-1 font-data text-[10.5px] text-chalk transition-colors hover:border-signal hover:text-signal"
                        >
                          {byId(id).name}
                        </button>
                      ))}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-data text-[11px] text-fog">{r.use}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => onOpen(byId(r.ids[0]))}
                      className="font-data text-[10px] uppercase tracking-[0.14em] text-signal hover:underline"
                    >
                      Open →
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---- catalog ---- */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-sora text-2xl font-semibold tracking-[-0.02em] text-white">
              Full catalog
            </h3>
            <p className="mt-1 text-[13px] text-fog">
              Browse by research area, or by the chemistry on the molecule.
            </p>
          </div>
          <div className="inline-flex border border-hair">
            {([["area", "Research area"], ["mod", "Modification"]] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => { setAxis(k); setActive("all"); }}
                className={`px-3.5 py-2 font-data text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                  axis === k ? "bg-signal text-white" : "text-fog hover:text-chalk"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Chip3 label="All" n={PRODUCTS.length} active={active === "all"} onClick={() => setActive("all")} />
            {chips.map((c) => {
              const n =
                axis === "area"
                  ? PRODUCTS.filter((p) => p.category === c.key).length
                  : PRODUCTS.filter((p) => (MODIFICATIONS[p.id] ?? []).includes(c.key)).length;
              return (
                <Chip3
                  key={c.key}
                  label={c.label}
                  n={n}
                  active={active === c.key}
                  onClick={() => setActive(c.key)}
                />
              );
            })}
          </div>
          <label className="flex items-center gap-2">
            <span className="lab">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-hair bg-slate2 px-2.5 py-1.5 font-data text-[11px] text-chalk focus:border-signal focus:outline-none"
            >
              <option value="cited">Most cited</option>
              <option value="price">Price, low to high</option>
              <option value="name">Name, A–Z</option>
            </select>
          </label>
        </div>

        <div className="grid gap-px border border-hair bg-hair sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Card3 key={p.id} p={p} i={i} onOpen={onOpen} />
          ))}
        </div>

        <p className="mt-4 font-data text-[11px] text-fog">
          {shown.length} of {PRODUCTS.length} compounds · all supplied as
          lyophilized powder for laboratory research use
        </p>
      </div>
    </section>
  );
}

function Card3({ p, i, onOpen }: { p: Product; i: number; onOpen: (p: Product) => void }) {
  const lots = LOTS.filter((l) => l.productId === p.id && l.released)
    .sort((a, b) => (a.tested < b.tested ? 1 : -1));
  const latest = lots[0];
  const mods = MODIFICATIONS[p.id] ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
      className="group relative flex flex-col bg-obsidian p-5 transition-colors hover:bg-slate2"
    >
      <span className="absolute left-0 top-0 h-0.5 w-0 bg-signal transition-all duration-300 group-hover:w-full" />

      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="border border-hair px-1.5 py-0.5 font-data text-[9px] text-fog">{p.code}</span>
        <span className="font-data text-[10px] text-fog">
          <span className="font-medium text-chalk">{CITATIONS[p.id] ?? 0}</span> cited
        </span>
      </div>

      <button
        onClick={() => onOpen(p)}
        className="flex w-full items-start gap-3.5 text-left"
        aria-label={`Open record for ${p.name}`}
      >
        <span className="w-12 shrink-0">
          <Vial
            name={p.name}
            size={p.size}
            code={p.code}
            theme="dark"
            accent="#FF1F3D"
            className="h-auto w-full transition-transform duration-300 group-hover:-translate-y-1"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-sora text-[19px] font-semibold leading-tight tracking-[-0.02em] text-white">
            {p.name}
          </span>
          <span className="mt-1 block lab">{AREA_MAP[p.category] ?? p.category}</span>
        </span>
      </button>

      <div className="mt-3 flex flex-wrap gap-1">
        {mods.map((m) => (
          <span key={m} className="border border-hair px-1.5 py-0.5 font-data text-[9px] text-fog">
            {m}
          </span>
        ))}
      </div>

      <dl className="my-4 space-y-1.5 border-y border-hair py-3 font-data text-[11px]">
        <R k="MW" v={p.mw} />
        <R k="CAS" v={p.cas} />
        {latest ? (
          <R k="Latest lot" v={`${latest.purity.toFixed(2)}% · ${latest.tested}`} accent />
        ) : (
          <R k="Latest lot" v="in testing" />
        )}
      </dl>

      <div className="mt-auto flex items-end justify-between gap-3">
        <div>
          <p className="font-sora text-[19px] font-semibold text-white">${p.price}</p>
          <p className="font-data text-[10px] text-fog">{p.size}</p>
        </div>
        <button
          onClick={() => onOpen(p)}
          className="border border-hair px-3 py-2 font-data text-[10px] uppercase tracking-[0.14em] text-chalk transition-colors hover:border-signal hover:bg-signal hover:text-white"
        >
          Open record
        </button>
      </div>
    </motion.article>
  );
}

function R({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-fog">{k}</dt>
      <dd className={`text-right ${accent ? "text-signal" : "text-chalk"}`}>{v}</dd>
    </div>
  );
}

function Chip3({
  label,
  n,
  active,
  onClick,
}: {
  label: string;
  n: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 border px-3 py-2 font-data text-[10.5px] transition-colors ${
        active
          ? "border-signal bg-signal text-white"
          : "border-hair bg-slate2 text-chalk hover:border-fog/50"
      }`}
    >
      {label}
      <span className={active ? "text-white/70" : "text-fog"}>{n}</span>
    </button>
  );
}

export function Head3({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-11 max-w-2xl">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="h-px w-6 bg-signal" />
        <span className="font-data text-[10px] uppercase tracking-[0.22em] text-signal">{eyebrow}</span>
      </div>
      <h2 className="font-sora text-[clamp(1.9rem,4.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-white">
        {title}
      </h2>
      {desc && <p className="mt-4 text-[15px] leading-relaxed text-fog">{desc}</p>}
    </div>
  );
}
