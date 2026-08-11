import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CartLine } from "./App2";

/**
 * Layer 4 of the compliance framework: a required, unchecked attestation at
 * checkout. The research surveyed six DTC peptide retailers and NONE of them do
 * this — it's the biggest open gap in the industry and the cheapest thing to add.
 *
 * It matters because the FDA's December 2024 warning letter to Swiss Chems turned
 * on *evidence of intended use*: despite "research chemicals only" labeling,
 * evidence from the website established the products were intended for human
 * use. A timestamped buyer attestation is the only counter-evidence that exists.
 */
export function CartDrawer({
  open,
  lines,
  onClose,
  onRemove,
}: {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const [attested, setAttested] = useState(false);
  const [placed, setPlaced] = useState(false);

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const freeShipping = subtotal >= 200;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex justify-end">
          <motion.div
            className="absolute inset-0 bg-ink2/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-md flex-col bg-paper"
          >
            <header className="flex items-center justify-between border-b border-rule px-5 py-4">
              <h2 className="font-serif text-xl font-semibold text-ink2">Your order</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="border border-rule px-2 py-1 font-data text-[10px] uppercase tracking-[0.14em] text-ash hover:border-ink2 hover:text-ink2"
              >
                Esc
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <p className="font-plex text-[14px] text-graphite">Nothing here yet.</p>
                <p className="mt-1.5 font-plex text-[12px] text-ash">
                  Search by sequence, CAS or catalog number to find a compound.
                </p>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-rule overflow-y-auto px-5">
                  {lines.map((l) => (
                    <li key={l.product.id} className="flex items-start gap-3 py-4">
                      <span className="mt-0.5 shrink-0 border border-rule px-1.5 py-0.5 font-data text-[9px] text-ash">
                        {l.product.code}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-plex text-[14px] font-semibold text-ink2">
                          {l.product.name}
                        </p>
                        <p className="mt-0.5 font-data text-[11px] text-ash">
                          {l.product.size} · qty {l.qty} · lyophilized
                        </p>
                        <button
                          onClick={() => onRemove(l.product.id)}
                          className="mt-1.5 font-data text-[10px] uppercase tracking-[0.12em] text-ash hover:text-crimson-deep"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="shrink-0 font-data text-[13px] font-medium text-ink2">
                        ${l.product.price * l.qty}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-rule px-5 py-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-plex text-[13px] text-graphite">Subtotal</span>
                    <span className="font-serif text-2xl font-semibold text-ink2">${subtotal}</span>
                  </div>
                  <p className="mt-1 font-data text-[10px] uppercase tracking-[0.14em] text-ash">
                    {freeShipping
                      ? "Free cold-chain shipping included"
                      : `$${200 - subtotal} more for free shipping`}
                  </p>

                  {/* the attestation */}
                  <label className="mt-4 flex cursor-pointer gap-2.5 border border-crimson/25 bg-crimson-soft p-3">
                    <input
                      type="checkbox"
                      checked={attested}
                      onChange={(e) => setAttested(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-crimson"
                    />
                    <span className="font-plex text-[11.5px] leading-relaxed text-graphite">
                      I confirm I am <strong className="text-ink2">21 or older</strong>, am
                      acquiring these materials for{" "}
                      <strong className="text-ink2">laboratory research use only</strong>, and
                      will not administer them to humans or animals.
                    </span>
                  </label>

                  <button
                    disabled={!attested}
                    onClick={() => setPlaced(true)}
                    className={`mt-3 w-full py-3 font-data text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                      attested
                        ? "bg-crimson text-white hover:bg-crimson-deep"
                        : "cursor-not-allowed bg-rule text-ash"
                    }`}
                  >
                    {placed ? "Attestation recorded ✓" : "Continue to checkout"}
                  </button>

                  {placed && (
                    <p className="mt-2 font-plex text-[11px] leading-relaxed text-ash">
                      Demo only — no payment is processed. In production the
                      attestation is stored with the order, timestamped.
                    </p>
                  )}
                  {!attested && (
                    <p className="mt-2 font-plex text-[11px] text-ash">
                      Confirm the statement above to continue.
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
