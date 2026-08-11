import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LOTS, LAB, type Lot } from "../data/lots";
import { Head } from "./Discover2";

/**
 * A filterable, per-lot COA library as a first-class section.
 *
 * Swiss Chems' /independent-test-results/ is the best execution found: paginated
 * rows of product + research category + test date + downloadable report,
 * filterable, with multiple lots per product. Core Peptides and Biotech Peptides
 * both claim results are "posted on our website" but have no index at all
 * (both /coa/ paths 404) — so the claim is only true per-product.
 *
 * The lot-number lookup is Biosynth's pattern (batch-keyed document retrieval as
 * a first-class feature, in the footer of every page).
 *
 * Naming the laboratory with contact details, and inviting buyers to call and
 * confirm, is Sports Technology Labs' pattern — the highest-credibility,
 * lowest-cost trust move available.
 */

const AREAS = [...new Set(LOTS.map((l) => l.area))].sort();

export function Verify2() {
  const [area, setArea] = useState("all");
  const [query, setQuery] = useState("");
  const [lookup, setLookup] = useState("");
  const [found, setFound] = useState<Lot | null | "miss">(null);

  const rows = useMemo(() => {
    return LOTS.filter((l) => {
      if (area !== "all" && l.area !== area) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!`${l.product} ${l.lot}`.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => (a.tested < b.tested ? 1 : -1));
  }, [area, query]);

  function runLookup(e: React.FormEvent) {
    e.preventDefault();
    const key = lookup.trim().toUpperCase();
    if (!key) return;
    setFound(LOTS.find((l) => l.lot.toUpperCase() === key) ?? "miss");
  }

  return (
    <section id="record" className="border-b border-rule bg-card py-16 sm:py-20">
      <div className="wrap">
        <Head
          eyebrow="The record"
          title="Look up the lot in your hand"
          desc="Every released lot is published here with its measured result, the date it was tested, and the laboratory that tested it."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          {/* ---------------- lot library ---------------- */}
          <div>
            {/* lot lookup */}
            <form onSubmit={runLookup} className="mb-6 border border-ink2/15 bg-paper p-4">
              <label className="mb-2 block font-data text-[10px] uppercase tracking-[0.16em] text-ash">
                Retrieve documents by lot number
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  value={lookup}
                  onChange={(e) => { setLookup(e.target.value); setFound(null); }}
                  placeholder="e.g. CP-0247-A — printed on the vial"
                  className="min-w-0 flex-1 border border-rule bg-card px-3 py-2.5 font-data text-[13px] text-ink2 placeholder:text-ash/80 focus:border-crimson focus:outline-none"
                />
                <button type="submit" className="btn-record">Retrieve</button>
              </div>

              {found === "miss" && (
                <p className="mt-3 font-plex text-[12px] text-crimson-deep">
                  No lot matches that number. Check the vial label, or contact us
                  and we'll trace it.
                </p>
              )}
              {found && found !== "miss" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 border border-crimson/25 bg-crimson-soft p-3.5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-data text-[13px] font-medium text-ink2">
                      {found.lot} · {found.product}
                    </p>
                    <p className="font-data text-[13px] font-semibold text-crimson-deep">
                      {found.purity.toFixed(2)}%{" "}
                      <span className="font-normal text-ash">/ spec ≥ {found.spec.toFixed(1)}%</span>
                    </p>
                  </div>
                  <p className="mt-1.5 font-data text-[11px] text-graphite">
                    {found.identity} · endotoxin {found.endotoxin} · water {found.water} ·
                    tested {found.tested} by {found.lab}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {["Certificate of analysis", "HPLC chromatogram", "Mass spectrum"].map((d) => (
                      <span
                        key={d}
                        className="border border-ink2/20 bg-card px-2 py-1 font-data text-[9px] uppercase tracking-[0.12em] text-graphite"
                      >
                        {d} ↓
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </form>

            {/* filters */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="border border-rule bg-paper px-2.5 py-2 font-data text-[11px] text-ink2 focus:border-crimson focus:outline-none"
              >
                <option value="all">All research areas</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by product or lot"
                className="min-w-0 flex-1 border border-rule bg-paper px-3 py-2 font-data text-[11px] text-ink2 placeholder:text-ash/80 focus:border-crimson focus:outline-none"
              />
            </div>

            {/* table */}
            <div className="overflow-x-auto border border-rule">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-rule bg-paper">
                    {["Lot", "Compound", "Research area", "Tested", "Result", "Report"].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 font-data text-[9px] uppercase tracking-[0.16em] text-ash"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((l) => (
                    <tr key={l.lot} className="border-b border-rule last:border-0 hover:bg-paper">
                      <td className="px-3 py-2.5 font-data text-[11px] text-ink2">{l.lot}</td>
                      <td className="px-3 py-2.5 font-plex text-[12px] font-medium text-ink2">
                        {l.product}
                      </td>
                      <td className="px-3 py-2.5 font-data text-[10px] text-ash">{l.area}</td>
                      <td className="px-3 py-2.5 font-data text-[11px] text-graphite">{l.tested}</td>
                      <td className="px-3 py-2.5 font-data text-[11px]">
                        {l.released ? (
                          <span className="font-medium text-crimson-deep">
                            {l.purity.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-ash">{l.purity.toFixed(2)}% · rejected</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {l.released ? (
                          <span className="border border-ink2/20 px-2 py-1 font-data text-[9px] uppercase tracking-[0.12em] text-graphite">
                            PDF ↓
                          </span>
                        ) : (
                          <span className="font-data text-[9px] uppercase tracking-[0.12em] text-ash">
                            Not released
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 font-plex text-[11px] leading-relaxed text-ash">
              Showing {rows.length} of {LOTS.length} lots. Rejected lots stay on
              the record — a lot that misses spec is destroyed, not sold, and we
              publish it anyway.
            </p>
          </div>

          {/* ---------------- named lab ---------------- */}
          <aside className="space-y-4">
            <div className="border border-ink2/15 bg-paper p-5">
              <p className="font-data text-[10px] uppercase tracking-[0.18em] text-ash">
                Testing laboratory
              </p>
              <h3 className="mt-2 font-serif text-xl font-semibold text-ink2">{LAB.name}</h3>
              <p className="mt-1 font-data text-[11px] text-crimson-deep">{LAB.accreditation}</p>
              <p className="mt-0.5 font-data text-[11px] text-ash">{LAB.location}</p>

              <dl className="mt-4 space-y-2 border-t border-rule pt-4 font-data text-[11px]">
                <div>
                  <dt className="text-ash">Methods</dt>
                  <dd className="mt-0.5 leading-relaxed text-graphite">{LAB.methods}</dd>
                </div>
                <div>
                  <dt className="text-ash">Phone</dt>
                  <dd className="mt-0.5 text-ink2">{LAB.phone}</dd>
                </div>
                <div>
                  <dt className="text-ash">Email</dt>
                  <dd className="mt-0.5 break-all text-ink2">{LAB.email}</dd>
                </div>
              </dl>

              <p className="mt-4 border-l-2 border-crimson pl-3 font-plex text-[12px] leading-relaxed text-graphite">
                {LAB.note}
              </p>
            </div>

            {/* purity >100% explainer */}
            <div className="border border-rule bg-paper p-5">
              <p className="font-data text-[10px] uppercase tracking-[0.18em] text-ash">
                Reading the numbers
              </p>
              <h4 className="mt-2 font-plex text-[14px] font-semibold text-ink2">
                Why a result can exceed 100%
              </h4>
              <p className="mt-2 font-plex text-[12px] leading-relaxed text-graphite">
                Purity is measured against a reference standard. When a lot is
                purer than the standard it's compared to, the calculated figure
                can pass 100% — lot CP-0270-B reads{" "}
                <span className="font-data text-crimson-deep">101.4%</span>. That
                tells you about the reference, not a fault in the lot.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
