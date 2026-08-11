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
  // photo and certificate drift at different rates, which is what reads as depth
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const paperY = useTransform(scrollYProgress, [0, 1], [0, -95]);
  const paperRot = useTransform(scrollYProgress, [0, 1], [-1.6, 0.8]);
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

        {/* ---------- the product, with its proof laid over it ---------- */}
        <div className="relative pb-20 sm:pb-24 lg:pb-28">
          {/* studio photograph */}
          <motion.figure
            style={{ y: photoY }}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden border border-hair"
          >
            <img
              src={`${import.meta.env.BASE_URL}img/hero-vials.webp`}
              srcSet={`${import.meta.env.BASE_URL}img/hero-vials-sm.webp 800w, ${import.meta.env.BASE_URL}img/hero-vials.webp 1500w`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              width={1500}
              height={1120}
              alt="Four Culture Peptides research vials on a black surface under red rim lighting, the front vial labelled BPC-157, 5 mg"
              className="block h-auto w-full"
              style={{ aspectRatio: "1500 / 1120" }}
            />
            {/* grade the photo into the page */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
            <figcaption className="absolute left-4 top-4 flex items-center gap-1.5 border border-white/15 bg-obsidian/60 px-2 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 bg-signal" />
              <span className="font-data text-[9.5px] uppercase tracking-[0.16em] text-white/85">
                Lot CP-0247-A
              </span>
            </figcaption>
          </motion.figure>

          {/* the certificate for the vial in the photograph */}
          <motion.figure
            style={{ y: paperY, rotate: paperRot }}
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="paper relative z-10 mx-auto -mt-14 w-[92%] shadow-[0_40px_100px_-24px_rgba(0,0,0,0.95)]
              sm:absolute sm:-bottom-4 sm:-left-8 sm:mt-0 sm:w-[64%] lg:-bottom-6 lg:-left-14 lg:w-[60%]"
          >
            <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-3.5 py-2">
              <span className="font-data text-[9.5px] uppercase tracking-[0.16em] text-ink2">
                Certificate of analysis
              </span>
              <span className="inline-flex items-center gap-1.5 font-data text-[9.5px] uppercase tracking-[0.16em] text-crimson-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
                Released
              </span>
            </figcaption>

            <div className="px-1.5 py-2">
              <Chromatogram className="h-auto w-full" />
            </div>

            <dl className="grid grid-cols-3 gap-px border-t border-rule bg-rule">
              {[
                ["Purity", "99.42%"],
                ["Spec", "≥ 99.0%"],
                ["Identity", "ESI-MS ✓"],
              ].map(([k, v]) => (
                <div key={k} className="bg-white px-2.5 py-2">
                  <dt className="font-data text-[8.5px] uppercase tracking-[0.14em] text-ash">{k}</dt>
                  <dd className="mt-0.5 font-data text-[11px] font-medium text-ink2">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="border-t border-rule px-3.5 py-2 font-data text-[9px] leading-relaxed text-ash">
              Tested by {LAB.name} · {LAB.accreditation} — call them to confirm.
            </p>
          </motion.figure>
        </div>
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
