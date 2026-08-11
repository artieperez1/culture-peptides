import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Head } from "./Discover2";
import { LAB } from "../data/lots";

/**
 * Content stays inside the firewall the research recommended: synthesis,
 * solubility, storage, stability, analytical method, and compliance. No dosing,
 * no reconstitution-for-administration, no protocols, no testimonials — that
 * combination is what drew FDA attention to the sites that had the strongest
 * disclaimers and still shut down.
 *
 * Mirrored in FAQPage JSON-LD in record.html (borrowed from CS Bio, the only
 * researched supplier shipping Question/Answer structured data).
 */
const ITEMS = [
  {
    q: "Are these products intended for human use?",
    a: "No. Everything in this catalog is supplied strictly for in-vitro laboratory research. These materials are not drugs, dietary supplements, foods, cosmetics or medical devices, they have not been evaluated by the FDA, and any human or veterinary consumption is prohibited. We do not publish dosing information, administration protocols or preparation-for-injection guidance, and we will not provide them on request.",
  },
  {
    q: "Why can a purity result read higher than 100%?",
    a: "Purity by RP-HPLC is measured relative to a reference standard. When a lot is purer than the standard it is compared against, the calculated figure can exceed 100% — lot CP-0270-B reads 101.4%. That is information about the reference standard, not a defect in the lot or an error in the assay. Any supplier reporting only round numbers is rounding away this detail.",
  },
  {
    q: "Which laboratory does your testing, and can I verify a result myself?",
    a: `Identity and purity testing is performed by ${LAB.name} (${LAB.accreditation}, ${LAB.location}), independent of us. Their name and contact details appear on every certificate specifically so you can call or email them and confirm any result you see on this site. We would rather you check than take our word for it.`,
  },
  {
    q: "How do I find the certificate for the lot I actually received?",
    a: "Enter the lot number printed on the vial into the lot lookup in The Record. That returns the certificate of analysis, the HPLC chromatogram and the mass spectrum for that specific lot — not a representative document from a different batch. The specification shown on a product page is nominal; the lot certificate is the measured truth.",
  },
  {
    q: "What happens to a lot that misses specification?",
    a: "It is destroyed rather than sold, and it stays visible in the public record. Lot CP-0244-C returned 98.71% against a ≥99.0% specification and is listed as rejected. Publishing only the lots that passed would make the archive meaningless.",
  },
  {
    q: "How should material be stored and handled?",
    a: "Lyophilized vials are stable at -20 °C protected from light; avoid repeated freeze-thaw cycles. Solubility depends on net charge and hydrophobicity — the calculator on this page gives a theoretical read from sequence alone. This is laboratory storage and solubility guidance only, and is not instruction for preparing material for administration.",
  },
  {
    q: "Who is eligible to order?",
    a: "Orders are accepted from qualified research professionals, institutions and laboratories. Buyers must be at least 21 years of age and confirm at checkout that materials are being acquired for laboratory research use only. That confirmation is recorded with the order.",
  },
];

export function FAQ2() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq2" className="border-b border-rule bg-card py-16 sm:py-20">
      <div className="wrap grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
        <div>
          <Head eyebrow="Questions" title="Asked and answered" />
          <p className="font-plex text-[13px] leading-relaxed text-graphite">
            Compliance, testing and handling. Anything else, write to{" "}
            <span className="font-data text-crimson-deep">research@culturepeptides.com</span>{" "}
            — from an institutional address where possible.
          </p>
        </div>

        <div className="divide-y divide-rule border-y border-rule">
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 py-4 text-left"
                  >
                    <span className="font-plex text-[15px] font-semibold leading-snug text-ink2">
                      {it.q}
                    </span>
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border font-data text-[11px] transition-transform duration-300 ${
                        isOpen
                          ? "rotate-45 border-crimson text-crimson"
                          : "border-rule text-ash"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-5 font-plex text-[13.5px] leading-relaxed text-graphite">
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
