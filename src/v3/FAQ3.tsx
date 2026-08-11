import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Head3 } from "./Finder";
import { LAB } from "../data/lots";
import { CONTACTS, INSTITUTIONS } from "../data/logistics";

/**
 * Content stays inside a firewall: synthesis, solubility, storage, stability,
 * analytical method, compliance. No dosing, no reconstitution-for-administration,
 * no protocols, no testimonials. That combination is what drew FDA attention to
 * the sites that had the strongest disclaimers and still shut down — Peptide
 * Sciences ran RUO language alongside dosage guides and closed in March 2026.
 *
 * Named humans instead of a faceless form — CordenPharma ends every capability
 * page with a person, title and email.
 */
const ITEMS = [
  {
    q: "Are these products intended for human use?",
    a: "No. Everything here is supplied strictly for in-vitro laboratory research. These materials are not drugs, dietary supplements, foods, cosmetics or medical devices, they have not been evaluated by the FDA, and any human or veterinary consumption is prohibited. We do not publish dosing information, administration protocols or preparation-for-injection guidance, and we will not supply them on request.",
  },
  {
    q: "How do I prove the vial I received is really yours?",
    a: "Each cap carries a scratch-off panel over a unique ten-character code. Enter it in the verifier and you'll see the lot it belongs to, the date we released it, and whether the code has been used before. A code we never issued means the vial did not come from us — don't use the material, and tell us so we can trace it.",
  },
  {
    q: "Why can a purity result read higher than 100%?",
    a: "Purity by RP-HPLC is relative to a reference standard. When a lot is purer than the standard it's compared against, the calculated figure can exceed 100% — lot CP-0270-B reads 101.4%. That is information about the reference standard, not a defect in the lot. A supplier reporting only tidy round numbers is rounding this away.",
  },
  {
    q: "Which laboratory does the testing, and can I verify a result myself?",
    a: `Testing is performed by ${LAB.name} (${LAB.accreditation}, ${LAB.location}), independent of us. Their name, phone and email are printed on every certificate specifically so you can contact them and confirm any figure on this site. We would rather you check than take our word for it.`,
  },
  {
    q: "What happens to a lot that misses specification?",
    a: "It is destroyed rather than sold, and it stays visible in the public record. Lot CP-0244-C returned 98.71% against a ≥99.0% specification and is listed as rejected. An archive showing only the lots that passed is an advertisement, not a record.",
  },
  {
    q: "How should material be stored and handled in the lab?",
    a: "Lyophilized vials are stable at -20 °C protected from light; avoid repeated freeze-thaw cycles. Solubility depends on net charge and hydrophobicity, and the calculator here gives a theoretical read from sequence alone. This is laboratory storage and solubility guidance, not instruction for preparing material for administration.",
  },
  {
    q: "Who is eligible to order, and how do you record that?",
    a: "Orders are accepted from qualified research professionals, institutions and laboratories. Buyers must be at least 21 and confirm at checkout that materials are being acquired for laboratory research use only. That confirmation is stored with the order, timestamped, alongside the serial numbers of the vials shipped.",
  },
  {
    q: "Do you publish your own inspection or audit history?",
    a: "We publish the counts — lots released, lots rejected, and the year they apply to — and we don't ask you to take our quality claims on adjectives. Where a public regulator database covers a facility, we would rather point you at the regulator's own record than summarize it ourselves.",
  },
];

export function FAQ3() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq3" className="border-b border-hair bg-obsidian py-18 sm:py-24">
      <div className="wrap">
        {/* ---- who you'd actually be emailing ---- */}
        <div className="mb-16">
          <Head3
            eyebrow="People"
            title="Ask a person, not a form"
            desc="Three names, three inboxes. Nobody routes you through a ticket queue."
          />
          <div className="grid gap-px border border-hair bg-hair sm:grid-cols-3">
            {CONTACTS.map((c, i) => (
              <motion.div
                key={c.email}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-obsidian p-5"
              >
                <p className="font-sora text-[16px] font-semibold text-white">{c.name}</p>
                <p className="mt-0.5 font-data text-[10.5px] uppercase tracking-[0.14em] text-signal">
                  {c.title}
                </p>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-fog">{c.scope}</p>
                <p className="mt-3 break-all font-data text-[11px] text-chalk">{c.email}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 border border-hair bg-slate2 px-5 py-4">
            <p className="lab">Who orders from us</p>
            <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
              {INSTITUTIONS.map((i) => (
                <li key={i} className="font-data text-[11.5px] text-chalk">· {i}</li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-relaxed text-fog">
              Described by category rather than named. We don't publish customer
              identities, and we don't borrow institutional logos we have no
              permission to use.
            </p>
          </div>
        </div>

        {/* ---- FAQ ---- */}
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div>
            <Head3 eyebrow="Questions" title="Asked and answered" />
            <p className="text-[13px] leading-relaxed text-fog">
              Compliance, testing, handling. Anything else, write to{" "}
              <span className="font-data text-signal">research@culturepeptides.example</span>{" "}
              — from an institutional address where you can.
            </p>
          </div>

          <div className="divide-y divide-hair border-y border-hair">
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
                      <span className="text-[15px] font-semibold leading-snug text-white">{it.q}</span>
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border font-data text-[11px] transition-transform duration-300 ${
                          isOpen ? "rotate-45 border-signal text-signal" : "border-hair text-fog"
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
                        <p className="max-w-2xl pb-5 text-[13.5px] leading-relaxed text-fog">{it.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
