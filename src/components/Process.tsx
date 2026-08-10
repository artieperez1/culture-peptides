import { motion } from "framer-motion";
import { SectionHead } from "./Catalog";

const STEPS = [
  {
    n: "01",
    t: "Browse the library",
    d: "Search 18+ research compounds by pathway, sequence, or code. Read the spec before you commit.",
  },
  {
    n: "02",
    t: "Verify the batch",
    d: "Open the certificate of analysis for the exact lot you're ordering. Identity and purity, in the open.",
  },
  {
    n: "03",
    t: "Order & dispatch",
    d: "Checkout ships within 24 hours, cold-chain packed and tracked from our US facility.",
  },
  {
    n: "04",
    t: "Research with confidence",
    d: "Lyophilized, sealed, and stable. Reconstitute and document — every vial is traceable to its data.",
  },
];

export function Process() {
  return (
    <section id="process" className="border-t border-line bg-ink py-20 sm:py-28">
      <div className="wrap">
        <SectionHead
          eyebrow="How it works"
          title="From library to lab bench"
          desc="A supply chain built for researchers who document everything."
        />
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative flex flex-col bg-ink p-6 transition-colors hover:bg-panel"
            >
              <span className="font-mono text-[42px] font-bold leading-none text-line transition-colors group-hover:text-culture">
                {s.n}
              </span>
              <h3 className="mt-6 font-display text-lg font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-steel">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
