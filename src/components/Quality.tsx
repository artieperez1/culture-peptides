import { motion } from "framer-motion";
import { PeptideStrand } from "./Molecules";
import { SectionHead } from "./Catalog";

const CHECKS = [
  { k: "Identity", method: "HPLC-MS", result: "Confirmed", pct: 100 },
  { k: "Purity", method: "RP-HPLC", result: "99.4%", pct: 99 },
  { k: "Endotoxin", method: "LAL Assay", result: "< 0.5 EU/mg", pct: 96 },
  { k: "Moisture", method: "Karl Fischer", result: "2.1%", pct: 92 },
];

const PILLARS = [
  {
    t: "Third-party verified",
    d: "Every lot is independently assayed by an ISO-accredited lab. We publish the COA, not just the claim.",
  },
  {
    t: "Batch-traceable",
    d: "Scan a lot number and pull its exact certificate — identity, purity, and endotoxin data on file.",
  },
  {
    t: "Cold-chain integrity",
    d: "Lyophilized, sealed under argon, and shipped with insulation to preserve peptide stability.",
  },
];

export function Quality() {
  return (
    <section id="quality" className="relative overflow-hidden border-t border-line bg-panel py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-culture/40 to-transparent" />
      <div className="wrap">
        <SectionHead
          eyebrow="Proof, not promises"
          title="Verified to the molecule"
          desc="Trust in research materials is earned in the data. Here is exactly what we test, and what we report on every batch."
        />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* COA readout panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative border border-line bg-ink"
          >
            {/* scanning line */}
            <div className="relative h-px overflow-hidden bg-line">
              <motion.span
                animate={{ x: ["-30%", "130%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 h-px w-1/4 bg-culture"
              />
            </div>
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white">
                Certificate of Analysis
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-culture">
                <span className="h-1.5 w-1.5 animate-pulse-dot bg-culture" /> Verified
              </span>
            </div>
            <div className="px-5 py-4 font-mono text-[11px] text-steel">
              <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1">
                <span>LOT · <span className="text-mist">CP-0247-A</span></span>
                <span>COMPOUND · <span className="text-mist">BPC-157</span></span>
                <span>DATE · <span className="text-mist">2026.07</span></span>
              </div>
              <div className="space-y-3">
                {CHECKS.map((c, i) => (
                  <motion.div
                    key={c.k}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-mist">{c.k}</span>
                      <span className="text-steel">{c.method}</span>
                      <span className="text-culture">{c.result}</span>
                    </div>
                    <div className="h-1 w-full bg-surface">
                      <motion.div
                        className="h-full bg-culture"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* pillars */}
          <div className="space-y-px">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group border-l-2 border-line pl-5 transition-colors hover:border-culture"
              >
                <div className="py-4">
                  <h3 className="flex items-center gap-3 font-display text-lg font-semibold text-white">
                    <span className="font-mono text-[12px] text-culture">0{i + 1}</span>
                    {p.t}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-steel">{p.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* peptide strand signature */}
        <div className="mt-16">
          <div className="mb-3 flex items-center justify-between">
            <span className="eyebrow">Sample · BPC-157 backbone</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
              15 residues · C62H98N16O22
            </span>
          </div>
          <div className="border border-line bg-ink p-6">
            <PeptideStrand className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
