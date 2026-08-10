import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHead } from "./Catalog";

const ITEMS = [
  {
    q: "Are Culture Peptides products intended for human use?",
    a: "No. All products are sold strictly as research chemicals for in-vitro laboratory research and development use only. They are not drugs, supplements, food, or cosmetics, and are not intended to diagnose, treat, cure, or prevent any disease or condition in humans or animals.",
  },
  {
    q: "What does “third-party verified” actually mean?",
    a: "Each production lot is independently assayed by an ISO-accredited analytical laboratory. We publish the resulting certificate of analysis — including identity confirmation by mass spectrometry and purity by RP-HPLC — tied to the specific lot number you receive.",
  },
  {
    q: "How are peptides shipped and stored?",
    a: "Peptides ship lyophilized (freeze-dried) and sealed. For long-term stability, store lyophilized vials at -20°C protected from light. Reconstituted material should be refrigerated and used within the timeframe appropriate to the compound.",
  },
  {
    q: "Who can order?",
    a: "Orders are accepted from qualified researchers, institutions, and laboratories only. By purchasing, you certify that you are at least 21 years old and that materials will be handled by qualified personnel for lawful research purposes.",
  },
  {
    q: "What is your purity standard?",
    a: "Our standard is ≥99% purity by RP-HPLC for single peptides. Exact figures are reported per lot on the certificate of analysis; the value shown on each product reflects a representative recent batch.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-line bg-panel py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHead eyebrow="Questions" title="Before you order" />
          <p className="text-[14px] leading-relaxed text-steel">
            Straight answers on compliance, testing, and handling. Still unsure?
            Reach the team at{" "}
            <span className="text-culture">research@culturepeptides.com</span>.
          </p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="flex items-start gap-4">
                    <span className="mt-0.5 font-mono text-[11px] text-culture">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[17px] font-semibold text-white">
                      {it.q}
                    </span>
                  </span>
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center border border-line transition-transform duration-300 ${
                      isOpen ? "rotate-45 border-culture text-culture" : "text-steel"
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 pl-[2.1rem] text-[14px] leading-relaxed text-steel">
                        {it.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
