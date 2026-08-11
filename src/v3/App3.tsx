import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hero3 } from "./Hero3";
import { Assurance } from "./Assurance";
import { Finder } from "./Finder";
import { Workbench } from "./Workbench";
import { Quote } from "./Quote";
import { FAQ3 } from "./FAQ3";
import { CommandPalette } from "./CommandPalette";
import { ProductPanel } from "./ProductPanel";
import type { Product } from "../data/products";
import { FULFILMENT } from "../data/logistics";
import { DIR } from "../lib/directions";

interface Line { product: Product; qty: number }

export default function App3() {
  const [gate, setGate] = useState<"pending" | "in" | "out">("pending");
  const [palette, setPalette] = useState(false);
  const [open, setOpen] = useState<Product | null>(null);
  const [cart, setCart] = useState<Line[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("vault");
    return () => document.body.classList.remove("vault");
  }, []);

  useEffect(() => {
    document.body.style.overflow = gate === "pending" ? "hidden" : "";
  }, [gate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (gate === "in") setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gate]);

  const add = useCallback((p: Product) => {
    setCart((c) => {
      const hit = c.find((l) => l.product.id === p.id);
      if (hit) return c.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l));
      return [...c, { product: p, qty: 1 }];
    });
    setOpen(null);
    setCartOpen(true);
  }, []);

  const openProduct = useCallback((p: Product) => {
    setPalette(false);
    setOpen(p);
  }, []);

  const count = cart.reduce((n, l) => n + l.qty, 0);

  return (
    <div className="min-h-screen bg-obsidian">
      <div className="noise" />

      <div className="relative z-[55] bg-signal-dim">
        <p className="wrap py-1.5 text-center font-data text-[9.5px] uppercase tracking-[0.2em] text-white/85">
          For in-vitro laboratory research use only — not for human or veterinary use
        </p>
      </div>

      <Nav3 count={count} onSearch={() => setPalette(true)} onCart={() => setCartOpen(true)} />

      <main>
        <Hero3 onSearch={() => setPalette(true)} />
        <Assurance />
        <Finder onOpen={openProduct} />
        <Workbench />
        <Quote />
        <FAQ3 />
      </main>

      <Footer3 />

      <CommandPalette open={palette} onClose={() => setPalette(false)} onOpen={openProduct} />
      <ProductPanel product={open} onClose={() => setOpen(null)} onAdd={add} />
      <Cart3
        open={cartOpen}
        lines={cart}
        onClose={() => setCartOpen(false)}
        onRemove={(id) => setCart((c) => c.filter((l) => l.product.id !== id))}
      />

      <Gate3 state={gate} onAgree={() => setGate("in")} onDecline={() => setGate("out")} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Gate3({
  state, onAgree, onDecline,
}: { state: "pending" | "in" | "out"; onAgree: () => void; onDecline: () => void }) {
  if (state === "in") return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-obsidian/88 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        role="dialog" aria-modal="true" aria-labelledby="g3"
        className="relative w-full max-w-md border border-hair bg-slate2 p-6 shadow-[0_40px_120px_-25px_rgba(0,0,0,1)]"
      >
        {state === "out" ? (
          <>
            <h2 id="g3" className="font-sora text-xl font-semibold text-white">Access declined</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-fog">
              This catalog is available only to qualified research professionals.
              You can close this tab, or come back if that changes.
            </p>
            <button onClick={onAgree} className="btn-outline mt-5 w-full">Go back</button>
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-signal" />
              <span className="lab !text-signal">Restricted access</span>
            </div>
            <h2 id="g3" className="font-sora text-2xl font-semibold leading-tight tracking-[-0.02em] text-white">
              Research professionals only
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-fog">
              Materials in this catalog are supplied strictly for in-vitro
              laboratory research. They are not drugs, dietary supplements, foods
              or cosmetics, and any human or animal consumption is prohibited.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-fog">
              Continue only if you are{" "}
              <strong className="font-semibold text-white">21 or older</strong> and
              are acquiring these materials for laboratory research.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button onClick={onAgree} className="btn-signal flex-1">I agree</button>
              <button onClick={onDecline} className="btn-outline flex-1">I decline</button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function Nav3({
  count, onSearch, onCart,
}: { count: number; onSearch: () => void; onCart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const links = [
    ["The record", "#assurance"],
    ["Catalog", "#finder"],
    ["Tools", "#workbench"],
    ["Custom", "#quote"],
    ["FAQ", "#faq3"],
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? "border-hair bg-obsidian/90 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <nav className="wrap flex h-15 items-center justify-between gap-4 py-3">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 border border-signal" />
            <span className="absolute h-1.5 w-1.5 animate-pulse-dot bg-signal" />
          </span>
          <span className="font-sora text-[16px] font-semibold tracking-[-0.02em] text-white">
            Culture Peptides
          </span>
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="text-[13px] text-fog transition-colors hover:text-white">
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearch}
            aria-label="Search compounds"
            className="flex items-center gap-2 border border-hair px-2.5 py-1.5 text-fog transition-colors hover:border-signal hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="kbd hidden sm:inline">⌘K</span>
          </button>
          <button
            onClick={onCart}
            className="relative border border-hair px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.14em] text-chalk transition-colors hover:border-signal hover:text-white"
          >
            Order
            {count > 0 && <span className="ml-1.5 bg-signal px-1.5 py-0.5 text-white">{count}</span>}
          </button>
        </div>
      </nav>
    </header>
  );
}

/** Required, unchecked attestation at checkout — no researched competitor does this. */
function Cart3({
  open, lines, onClose, onRemove,
}: {
  open: boolean;
  lines: Line[];
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const [ok, setOk] = useState(false);
  const [placed, setPlaced] = useState(false);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const free = subtotal >= 200;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[82] flex justify-end">
          <motion.div
            className="absolute inset-0 bg-obsidian/60"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="Your order"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-md flex-col bg-slate2"
          >
            <header className="flex items-center justify-between border-b border-hair px-5 py-4">
              <h2 className="font-sora text-xl font-semibold text-white">Your order</h2>
              <button onClick={onClose} className="kbd hover:text-chalk">esc</button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <p className="text-[14px] text-chalk">Nothing here yet.</p>
                <p className="mt-1.5 text-[12px] text-fog">
                  Press ⌘K and search by sequence, CAS or catalog number.
                </p>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-hair overflow-y-auto px-5">
                  {lines.map((l) => (
                    <li key={l.product.id} className="flex items-start gap-3 py-4">
                      <span className="mt-0.5 shrink-0 border border-hair px-1.5 py-0.5 font-data text-[9px] text-fog">
                        {l.product.code}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-white">{l.product.name}</p>
                        <p className="mt-0.5 font-data text-[11px] text-fog">
                          {l.product.size} · qty {l.qty} · lyophilized
                        </p>
                        <button
                          onClick={() => onRemove(l.product.id)}
                          className="mt-1.5 font-data text-[10px] uppercase tracking-[0.12em] text-fog hover:text-signal"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="shrink-0 font-data text-[13px] font-medium text-white">
                        ${l.product.price * l.qty}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-hair px-5 py-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] text-chalk">Subtotal</span>
                    <span className="font-sora text-2xl font-semibold text-white">${subtotal}</span>
                  </div>
                  <p className="mt-1 font-data text-[10px] uppercase tracking-[0.14em] text-fog">
                    {free ? "Free cold-chain shipping" : `$${200 - subtotal} more for free shipping`}
                  </p>
                  <p className="mt-1 font-data text-[10px] text-fog">{FULFILMENT.promise}</p>

                  <label className="mt-4 flex cursor-pointer gap-2.5 border border-signal/30 bg-signal/8 p-3">
                    <input
                      type="checkbox"
                      checked={ok}
                      onChange={(e) => setOk(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#FF1F3D]"
                    />
                    <span className="text-[11.5px] leading-relaxed text-chalk">
                      I confirm I am <strong className="text-white">21 or older</strong>, am
                      acquiring these materials for{" "}
                      <strong className="text-white">laboratory research use only</strong>, and
                      will not administer them to humans or animals.
                    </span>
                  </label>

                  <button
                    disabled={!ok}
                    onClick={() => setPlaced(true)}
                    className={`mt-3 w-full py-3 font-data text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                      ok ? "bg-signal text-white hover:bg-signal-deep" : "cursor-not-allowed bg-hair text-fog"
                    }`}
                  >
                    {placed ? "Attestation recorded ✓" : "Continue to checkout"}
                  </button>
                  <p className="mt-2 text-[10.5px] leading-relaxed text-fog">
                    {placed
                      ? "Demo only — no payment processed. In production the attestation is stored with the order, timestamped, alongside the vial serials shipped."
                      : "Confirm the statement above to continue."}
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Footer3() {
  return (
    <footer className="bg-slate2">
      <div className="wrap py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-sora text-[16px] font-semibold text-white">Culture Peptides</p>
            <p className="mt-2 max-w-xs text-[12px] leading-relaxed text-fog">
              Research-grade peptides, published lot by lot. Supplied for in-vitro
              laboratory research use only.
            </p>
          </div>
          {[
            { h: "The record", links: ["Lot lookup", "Test result library", "Verify a vial", "Testing laboratory"] },
            { h: "Tools", links: ["Property calculator", "Library design", "Custom quote", "Reconstitution"] },
            { h: "Company", links: ["Shipping & storage", "Terms of sale", "Compliance policy", "Contact"] },
          ].map((c) => (
            <div key={c.h}>
              <p className="mb-3 lab">{c.h}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#assurance" className="text-[12px] text-chalk hover:text-signal">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border border-hair bg-obsidian p-5">
          <p className="lab !text-signal">Compliance notice</p>
          <p className="mt-2.5 text-[11.5px] leading-relaxed text-fog">
            All products supplied by Culture Peptides are intended{" "}
            <strong className="font-semibold text-chalk">
              strictly for in-vitro laboratory research use only
            </strong>
            . They are not drugs, dietary supplements, foods, cosmetics or medical
            devices, and have not been evaluated by the U.S. Food and Drug
            Administration. They are not for human or veterinary consumption and
            are not supplied for diagnostic or therapeutic use. Culture Peptides is
            a chemical supplier — not a pharmacy, compounder or outsourcing
            facility. By purchasing, the buyer represents that they are at least 21
            years of age, are acquiring these materials for lawful laboratory
            research, and will handle them in accordance with all applicable laws
            and institutional guidelines.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-hair pt-5 sm:flex-row sm:items-center">
          <p className="font-data text-[10px] text-fog">© 2026 Culture Peptides — research use only.</p>
          <p className="font-data text-[10px] text-fog">
            Direction 03 · “The Vault” ·{" "}
            <a href={DIR.decoded} className="text-signal hover:underline">01</a>{" · "}
            <a href={DIR.record} className="text-signal hover:underline">02</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
