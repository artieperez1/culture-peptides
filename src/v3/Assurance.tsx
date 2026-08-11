import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LOTS, LAB, type Lot } from "../data/lots";
import { SERIALS } from "../data/logistics";
import { Head3 } from "./Finder";

/**
 * Everything that makes a claim checkable, in one place:
 *  · per-lot COA library, filterable            — Swiss Chems
 *  · lot-number document lookup                 — Biosynth
 *  · scratch-off serial authenticity check      — Swiss Chems /verify-products/
 *  · named lab with verifiable contact details  — Sports Technology Labs
 *  · named equipment with tag numbers           — AmbioPharm's 5,000 L reactor R2420
 *  · point at the regulator's own database      — AmbioPharm's FDA-dashboard move
 */

const AREAS = [...new Set(LOTS.map((l) => l.area))].sort();

const EQUIPMENT = [
  { name: "Lyophilizer", model: "VirTis Genesis 25XL · unit LY-02", note: "Shelf-temperature logged per cycle" },
  { name: "Analytical HPLC", model: "Agilent 1260 Infinity II · unit HP-01", note: "C18, 0.1% TFA gradient" },
  { name: "Cold storage", model: "Thermo TSX -20 °C · units CS-01…04", note: "Continuous monitoring, alarmed" },
  { name: "Fill enclosure", model: "ISO 7 cleanroom · argon overlay", note: "Particle-counted weekly" },
];

export function Assurance() {
  const [area, setArea] = useState("all");
  const [q, setQ] = useState("");
  const [lookup, setLookup] = useState("");
  const [found, setFound] = useState<Lot | "miss" | null>(null);
  const [serial, setSerial] = useState("");
  const [verdict, setVerdict] = useState<null | { ok: boolean; lot?: string; product?: string; released?: string }>(null);

  const rows = useMemo(
    () =>
      LOTS.filter((l) => {
        if (area !== "all" && l.area !== area) return false;
        if (q.trim() && !`${l.product} ${l.lot}`.toLowerCase().includes(q.trim().toLowerCase())) return false;
        return true;
      }).sort((a, b) => (a.tested < b.tested ? 1 : -1)),
    [area, q]
  );

  function runLookup(e: React.FormEvent) {
    e.preventDefault();
    const key = lookup.trim().toUpperCase();
    if (!key) return;
    setFound(LOTS.find((l) => l.lot.toUpperCase() === key) ?? "miss");
  }

  function runSerial(e: React.FormEvent) {
    e.preventDefault();
    const key = serial.trim().toUpperCase().replace(/\s/g, "");
    if (!key) return;
    const hit = SERIALS[key];
    setVerdict(hit ? { ok: true, ...hit } : { ok: false });
  }

  return (
    <section id="assurance" className="border-b border-hair bg-slate2 py-18 sm:py-24">
      <div className="wrap">
        <Head3
          eyebrow="The record"
          title="Check us, don't trust us"
          desc="Every released lot, its measured result, the lab that measured it — and a way to prove the vial in your hand came from us."
        />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
          {/* ---------------- left: lookups + library ---------------- */}
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* lot lookup */}
              <form onSubmit={runLookup} className="border border-hair bg-obsidian p-4">
                <label className="mb-2 block lab">Documents by lot number</label>
                <div className="flex gap-2">
                  <input
                    value={lookup}
                    onChange={(e) => { setLookup(e.target.value); setFound(null); }}
                    placeholder="CP-0247-A"
                    className="min-w-0 flex-1 border border-hair bg-slate2 px-2.5 py-2 font-data text-[12px] text-white placeholder:text-fog/60 focus:border-signal focus:outline-none"
                  />
                  <button type="submit" className="btn-signal !px-3 !py-2">Get</button>
                </div>
                {found === "miss" && (
                  <p className="mt-2.5 text-[11.5px] text-signal">
                    No lot with that number. Check the vial label.
                  </p>
                )}
                {found && found !== "miss" && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2.5 border border-signal/30 bg-signal/8 p-3">
                    <p className="font-data text-[12px] text-white">
                      {found.lot} · {found.product}
                    </p>
                    <p className="mt-1 font-data text-[11px] text-signal">
                      {found.purity.toFixed(2)}% <span className="text-fog">/ spec ≥ {found.spec.toFixed(1)}%</span>
                    </p>
                    <p className="mt-1 font-data text-[10.5px] leading-relaxed text-fog">
                      {found.identity} · endotoxin {found.endotoxin} · tested {found.tested}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {["COA", "HPLC", "MS"].map((d) => (
                        <span key={d} className="border border-hair bg-slate2 px-1.5 py-0.5 font-data text-[9px] text-chalk">
                          {d} ↓
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </form>

              {/* serial verification */}
              <form onSubmit={runSerial} className="border border-hair bg-obsidian p-4">
                <label className="mb-2 block lab">Verify a vial</label>
                <p className="mb-2 text-[11px] leading-relaxed text-fog">
                  Scratch the silver panel on the cap and enter the 10-character code.
                </p>
                <div className="flex gap-2">
                  <input
                    value={serial}
                    onChange={(e) => { setSerial(e.target.value); setVerdict(null); }}
                    placeholder="7QK2M4XR9P"
                    maxLength={12}
                    className="min-w-0 flex-1 border border-hair bg-slate2 px-2.5 py-2 font-data text-[12px] uppercase tracking-[0.1em] text-white placeholder:text-fog/60 focus:border-signal focus:outline-none"
                  />
                  <button type="submit" className="btn-signal !px-3 !py-2">Check</button>
                </div>
                {verdict && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2.5">
                    {verdict.ok ? (
                      <div className="border border-signal/30 bg-signal/8 p-3">
                        <p className="font-data text-[11px] uppercase tracking-[0.14em] text-signal">
                          ✓ Genuine
                        </p>
                        <p className="mt-1 font-data text-[11.5px] text-white">
                          {verdict.product} · lot {verdict.lot}
                        </p>
                        <p className="mt-0.5 font-data text-[10.5px] text-fog">
                          Released {verdict.released} · code not previously used
                        </p>
                      </div>
                    ) : (
                      <div className="border border-hair bg-slate2 p-3">
                        <p className="font-data text-[11px] uppercase tracking-[0.14em] text-fog">
                          ✕ Not recognized
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-fog">
                          We did not release a vial with this code. Do not use the
                          material — contact us and we'll investigate.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </form>
            </div>

            {/* library */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="border border-hair bg-obsidian px-2.5 py-2 font-data text-[11px] text-chalk focus:border-signal focus:outline-none"
                >
                  <option value="all">All research areas</option>
                  {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Filter by product or lot"
                  className="min-w-0 flex-1 border border-hair bg-obsidian px-3 py-2 font-data text-[11px] text-white placeholder:text-fog/60 focus:border-signal focus:outline-none"
                />
              </div>

              <div className="overflow-x-auto border border-hair">
                <table className="w-full min-w-[600px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-hair bg-obsidian">
                      {["Lot", "Compound", "Tested", "Result", "Report"].map((h) => (
                        <th key={h} className="px-3 py-2.5 lab">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((l) => (
                      <tr key={l.lot} className="border-b border-hair last:border-0 hover:bg-obsidian/60">
                        <td className="px-3 py-2.5 font-data text-[11px] text-chalk">{l.lot}</td>
                        <td className="px-3 py-2.5 text-[12px] font-medium text-white">{l.product}</td>
                        <td className="px-3 py-2.5 font-data text-[11px] text-fog">{l.tested}</td>
                        <td className="px-3 py-2.5 font-data text-[11px]">
                          {l.released ? (
                            <span className="font-medium text-signal">{l.purity.toFixed(2)}%</span>
                          ) : (
                            <span className="text-fog">{l.purity.toFixed(2)}% · rejected</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          {l.released ? (
                            <span className="border border-hair px-2 py-1 font-data text-[9px] uppercase tracking-[0.1em] text-chalk">
                              PDF ↓
                            </span>
                          ) : (
                            <span className="font-data text-[9px] uppercase tracking-[0.1em] text-fog">
                              destroyed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-fog">
                {rows.length} of {LOTS.length} lots. Rejected lots stay on the
                record — a lot that misses spec is destroyed, not sold, and we
                publish it anyway. An archive that only shows passes is an
                advertisement, not a record.
              </p>
            </div>
          </div>

          {/* ---------------- right: lab, purity note, equipment ---------------- */}
          <aside className="space-y-4">
            <div className="border border-hair bg-obsidian p-5">
              <p className="lab">Testing laboratory</p>
              <h3 className="mt-2 font-sora text-xl font-semibold text-white">{LAB.name}</h3>
              <p className="mt-1 font-data text-[11px] text-signal">{LAB.accreditation}</p>
              <p className="mt-0.5 font-data text-[11px] text-fog">{LAB.location}</p>
              <dl className="mt-4 space-y-2 border-t border-hair pt-4 font-data text-[11px]">
                <div><dt className="text-fog">Methods</dt><dd className="mt-0.5 leading-relaxed text-chalk">{LAB.methods}</dd></div>
                <div><dt className="text-fog">Phone</dt><dd className="mt-0.5 text-white">{LAB.phone}</dd></div>
                <div><dt className="text-fog">Email</dt><dd className="mt-0.5 break-all text-white">{LAB.email}</dd></div>
              </dl>
              <p className="mt-4 border-l-2 border-signal pl-3 text-[12px] leading-relaxed text-chalk">
                {LAB.note}
              </p>
            </div>

            <div className="border border-hair bg-obsidian p-5">
              <p className="lab">Reading the numbers</p>
              <h4 className="mt-2 text-[14px] font-semibold text-white">Why a result can exceed 100%</h4>
              <p className="mt-2 text-[12px] leading-relaxed text-fog">
                Purity is measured against a reference standard. When a lot is
                purer than the standard it's compared to, the figure can pass
                100% — lot CP-0270-B reads{" "}
                <span className="font-data text-signal">101.4%</span>. That
                describes the reference, not a fault in the lot.
              </p>
            </div>

            <div className="border border-hair bg-obsidian p-5">
              <p className="lab">Named equipment</p>
              <ul className="mt-3 space-y-3">
                {EQUIPMENT.map((e) => (
                  <li key={e.name} className="border-l-2 border-hair pl-3">
                    <p className="text-[12.5px] font-medium text-white">{e.name}</p>
                    <p className="mt-0.5 font-data text-[10.5px] text-chalk">{e.model}</p>
                    <p className="mt-0.5 text-[11px] text-fog">{e.note}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3.5 text-[11px] leading-relaxed text-fog">
                Specific beats stock. Model numbers and unit tags, because a
                photograph of gloved hands and blue liquid proves nothing.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
