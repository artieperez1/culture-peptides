import { motion } from "framer-motion";
import { Chromatogram } from "./Chromatogram";
import { UniversalSearch } from "./UniversalSearch";
import type { Product } from "../data/products";

/**
 * Date-stamped verification counts.
 *
 * CordenPharma publishes audit throughput — "10 Health Authorities Audits
 * (in 2025)" / "80 Customer Audits (in 2025)". It's the most credible stat
 * pattern found in the research, because the `(in 2025)` suffix makes it read
 * as a fact rather than a slogan, and it's a number a liar wouldn't volunteer.
 */
const COUNTS = [
  { v: "312", l: "Lots released", note: "in 2026 YTD" },
  { v: "9", l: "Lots rejected", note: "in 2026 YTD" },
  { v: "100%", l: "Lots third-party tested", note: "since 2019" },
  { v: "1", l: "Accredited lab, named", note: "ISO/IEC 17025" },
];

export function Hero2({ onOpen }: { onOpen: (p: Product) => void }) {
  return (
    <section id="top" className="border-b border-rule bg-paper">
      <div className="wrap grid gap-12 pt-14 pb-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:pt-20">
        {/* ---------- left: the claim + the search ---------- */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 border border-crimson/30 bg-crimson-soft px-2.5 py-1 font-data text-[10px] font-medium uppercase tracking-[0.16em] text-crimson-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
              Research use only
            </span>
            <span className="font-data text-[10px] uppercase tracking-[0.16em] text-ash">
              Est. 2019 · Lyophilized · US cold-chain
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-serif text-[clamp(2.4rem,5.2vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink2"
          >
            Every lot has a
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">paper trail.</span>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-1 left-0 z-0 h-[0.42em] w-full origin-left bg-crimson/15"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-lg font-plex text-[15px] leading-relaxed text-graphite"
          >
            Search by sequence, name, CAS or catalog number. Read the
            chromatogram before you order — then look up the certificate for the
            exact lot in your hand.
          </motion.p>

          {/*
            One box that accepts sequence / name / CAS / SKU — and says so in the
            placeholder. Taken from CPC Scientific, whose search input is the best
            in the industry, with Biosynth's three-letter→one-letter normalization
            layered on. Five of eight researched suppliers have no sequence search
            at all.
          */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <UniversalSearch onOpen={onOpen} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 flex flex-wrap gap-3"
          >
            <a href="#record" className="btn-record">
              View test results
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#catalog2" className="btn-quiet">Browse catalog</a>
          </motion.div>
        </div>

        {/* ---------- right: the chromatogram ---------- */}
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="border border-rule bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-24px_rgba(0,0,0,0.25)]"
        >
          <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-4 py-2.5">
            <span className="font-data text-[10px] uppercase tracking-[0.16em] text-ink2">
              RP-HPLC · BPC-157 · Lot CP-0247-A
            </span>
            <span className="inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.16em] text-crimson-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
              Released
            </span>
          </figcaption>

          <div className="px-2 py-3">
            <Chromatogram className="h-auto w-full" />
          </div>

          <dl className="grid grid-cols-2 gap-px border-t border-rule bg-rule sm:grid-cols-4">
            {[
              ["Purity", "99.42%"],
              ["Spec", "≥ 99.0%"],
              ["Identity", "ESI-MS ✓"],
              ["Endotoxin", "< 0.5 EU/mg"],
            ].map(([k, v]) => (
              <div key={k} className="bg-card px-3 py-2.5">
                <dt className="font-data text-[9px] uppercase tracking-[0.14em] text-ash">{k}</dt>
                <dd className="mt-0.5 font-data text-[12px] font-medium text-ink2">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.figure>
      </div>

      {/* ---------- date-stamped counts ---------- */}
      <div className="border-t border-rule bg-card">
        <dl className="wrap grid grid-cols-2 gap-px py-0 sm:grid-cols-4">
          {COUNTS.map((c, i) => (
            <motion.div
              key={c.l}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="border-l border-rule px-5 py-6 first:border-l-0 sm:px-6"
            >
              <dt className="font-serif text-3xl font-semibold text-ink2">{c.v}</dt>
              <dd className="mt-1">
                <span className="block font-plex text-[12px] font-medium text-graphite">{c.l}</span>
                <span className="mt-0.5 block font-data text-[10px] uppercase tracking-[0.14em] text-ash">
                  {c.note}
                </span>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
