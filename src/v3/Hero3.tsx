import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Chromatogram } from "../v2/Chromatogram";
import { LAB } from "../data/lots";
import { FULFILMENT } from "../data/logistics";

/**
 * The synthesis of both earlier directions: the dark cinematic shell of 01, and
 * the document-as-hero thesis of 02 — the chromatogram rendered on a literal
 * sheet of white paper inside the dark room.
 *
 * Counts are date-stamped and include the number of lots REJECTED, following
 * CordenPharma's audit-throughput pattern — a figure that only helps you if it
 * is true.
 */
const COUNTS = [
  { v: "312", l: "Lots released", note: "2026 YTD" },
  { v: "9", l: "Lots rejected", note: "2026 YTD" },
  { v: "18", l: "Compounds", note: "in catalog" },
  { v: "100%", l: "Third-party tested", note: "since 2019" },
];

export function Hero3({ onSearch }: { onSearch: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const paperY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const paperRot = useTransform(scrollYProgress, [0, 1], [-1.2, 0.6]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={ref} id="top" className="relative overflow-hidden border-b border-hair">
      {/* ambient red wash */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-signal/12 blur-[150px]"
      />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />

      <div className="wrap relative grid gap-14 pt-16 pb-20 lg:grid-cols-[1fr_1.02fr] lg:items-center lg:gap-12 lg:pt-24">
        {/* ---------- claim ---------- */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            <span className="inline-flex items-center gap-1.5 border border-signal/40 bg-signal/10 px-2.5 py-1 font-data text-[10px] font-medium uppercase tracking-[0.16em] text-signal">
              <span className="h-1.5 w-1.5 animate-pulse-dot bg-signal" />
              Research use only
            </span>
            <span className="lab">{LAB.accreditation} lab · named on every certificate</span>
          </motion.div>

          <h1 className="font-sora text-[clamp(2.6rem,6.4vw,4.9rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white">
            <Line delay={0.1}>Nothing here is</Line>
            <Line delay={0.22}>
              <span className="text-signal">unverifiable.</span>
            </Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-fog"
          >
            Search by sequence, CAS or catalog number. Read the chromatogram,
            check the lot certificate, scratch the cap and verify the vial. Then
            decide.
          </motion.p>

          {/* search entry */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={onSearch}
            className="group mt-8 flex w-full max-w-lg items-center gap-3 border border-hair bg-slate2 px-4 py-3.5 text-left transition-colors hover:border-signal/60"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0 text-fog">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="flex-1 font-data text-[12.5px] text-fog group-hover:text-chalk">
              Sequence (3 or 1 letter), name, CAS # or catalog no.
            </span>
            <span className="kbd shrink-0">⌘K</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.62 }}
            className="mt-5 flex flex-wrap gap-3"
          >
            <a href="#assurance" className="btn-signal">
              View the record
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#finder" className="btn-outline">Find a compound</a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-6 font-data text-[11px] leading-relaxed text-fog/70"
          >
            {FULFILMENT.promise} · order by {FULFILMENT.cutoff} · {FULFILMENT.shipping}
          </motion.p>
        </div>

        {/* ---------- the document ---------- */}
        <motion.div
          style={{ y: paperY, rotate: paperRot }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* stacked-paper depth */}
          <div className="absolute inset-x-4 -bottom-2 h-full border border-hair bg-slate2/60" />
          <div className="absolute inset-x-2 -bottom-1 h-full border border-hair bg-raised/80" />

          <figure className="paper relative shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
            <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-4 py-2.5">
              <span className="font-data text-[10px] uppercase tracking-[0.16em] text-ink2">
                Certificate of analysis · BPC-157
              </span>
              <span className="inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.16em] text-crimson-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
                Lot CP-0247-A released
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
                <div key={k} className="bg-white px-3 py-2.5">
                  <dt className="font-data text-[9px] uppercase tracking-[0.14em] text-ash">{k}</dt>
                  <dd className="mt-0.5 font-data text-[12px] font-medium text-ink2">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="border-t border-rule px-4 py-2.5 font-data text-[9.5px] leading-relaxed text-ash">
              Tested by {LAB.name} · {LAB.accreditation} · {LAB.location} — call
              them to confirm this result.
            </p>
          </figure>
        </motion.div>
      </div>

      {/* counts */}
      <div className="border-t border-hair bg-slate2">
        <dl className="wrap grid grid-cols-2 sm:grid-cols-4">
          {COUNTS.map((c, i) => (
            <motion.div
              key={c.l}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="border-l border-hair px-5 py-6 first:border-l-0"
            >
              <dt className="font-sora text-3xl font-semibold tracking-[-0.02em] text-white">
                {c.v}
              </dt>
              <dd className="mt-1">
                <span className="block text-[12px] font-medium text-chalk">{c.l}</span>
                <span className="mt-0.5 block font-data text-[10px] uppercase tracking-[0.14em] text-fog">
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

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}
