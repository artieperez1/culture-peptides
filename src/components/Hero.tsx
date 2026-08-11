import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MoleculeLattice } from "./Molecules";

const SEQUENCE = "GEPPPGKPADDAGLV";

const STATS = [
  { v: "18+", l: "Compounds" },
  { v: "99%+", l: "Verified purity" },
  { v: "100%", l: "Batch-tested" },
  { v: "24h", l: "Dispatch" },
];

export function Hero({ onSearch }: { onSearch: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const latticeY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const latticeScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  // photograph drifts slower than the lattice, so the two separate as you scroll
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden grid-bg">
      {/*
        Product photography sits furthest back, fading in from the right so the
        headline keeps a clean field to sit on. The molecular lattice still draws
        over the top — it's this direction's signature and stays the top layer.
      */}
      <motion.div
        style={{ y: photoY, scale: photoScale }}
        /* desktop only: at narrow widths the photo cover-crops so hard that it
           swallows the headline, so small screens keep the lattice alone */
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] lg:block"
      >
        <img
          src={`${import.meta.env.BASE_URL}img/hero-vials.webp`}
          srcSet={`${import.meta.env.BASE_URL}img/hero-vials-sm.webp 800w, ${import.meta.env.BASE_URL}img/hero-vials.webp 1500w`}
          sizes="68vw"
          width={1500}
          height={1120}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-[0.55]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 4%, #000 46%), linear-gradient(to bottom, #000 62%, transparent 96%)",
            maskImage:
              "linear-gradient(to right, transparent 4%, #000 46%), linear-gradient(to bottom, #000 62%, transparent 96%)",
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </motion.div>

      {/* Ambient molecular field */}
      <motion.div
        style={{ y: latticeY, scale: latticeScale }}
        className="pointer-events-none absolute inset-0 opacity-70"
      >
        <MoleculeLattice className="absolute right-[-8%] top-[-6%] h-[120%] w-[75%]" />
      </motion.div>

      {/* Red radial glow */}
      <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-[560px] w-[560px] rounded-full bg-culture/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-ink to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="wrap relative flex min-h-[100svh] flex-col justify-center pt-28 pb-16"
      >
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-culture">
            <span className="h-1.5 w-1.5 animate-pulse-dot bg-culture" />
            Research use only
          </span>
          <span className="hidden h-3 w-px bg-line sm:block" />
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-steel">
            Third-party verified · COA per batch
          </span>
        </motion.div>

        {/* headline */}
        <h1 className="max-w-[15ch] font-display text-[clamp(3rem,11vw,8.5rem)] font-bold leading-[0.86] tracking-tightest text-white">
          <Reveal delay={0.25}>Peptides,</Reveal>
          <Reveal delay={0.4}>
            <span className="relative inline-block text-culture text-glow">
              decoded.
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left bg-culture"
              />
            </span>
          </Reveal>
        </h1>

        {/* live sequence readout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-6 flex flex-wrap items-center gap-1 font-mono text-[13px] tracking-[0.1em] text-steel"
        >
          <span className="mr-2 text-culture">&gt;</span>
          {SEQUENCE.split("").map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.045 }}
              className="inline-block border border-line/60 px-1.5 py-0.5 text-mist"
            >
              {c}
            </motion.span>
          ))}
          <span className="ml-2 animate-pulse-dot text-culture">_</span>
        </motion.div>

        {/* subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 max-w-xl text-[15px] leading-relaxed text-mist sm:text-base"
        >
          Culture Peptides supplies lab-grade research compounds backed by
          batch-specific certificates of analysis and{" "}
          <span className="text-white">&gt;99% verified purity</span>. Find your
          compound, read the data, trust the source.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a href="#catalog" className="btn-primary group">
            Explore catalog
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <button onClick={onSearch} className="btn-ghost">
            Search compounds
            <kbd className="rounded-sm border border-line px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>
        </motion.div>

        {/* stat strip */}
        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-16 grid max-w-2xl grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.l} className="bg-ink px-5 py-4">
              <dt className="font-display text-2xl font-bold text-white sm:text-3xl">{s.v}</dt>
              <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
                {s.l}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span
            animate={{ y: ["-100%", "180%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-4 bg-culture"
          />
        </span>
      </motion.div>
    </section>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}
