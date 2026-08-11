import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hero2 } from "./Hero2";
import { Discover2 } from "./Discover2";
import { Verify2 } from "./Verify2";
import { Tools2 } from "./Tools2";
import { FAQ2 } from "./FAQ2";
import { ProductDrawer } from "./ProductDrawer";
import { CartDrawer } from "./CartDrawer";
import type { Product } from "../data/products";
import { DIR } from "../lib/directions";

export interface CartLine {
  product: Product;
  qty: number;
}

export default function App2() {
  const [gate, setGate] = useState<"pending" | "in" | "out">("pending");
  const [open, setOpen] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("record");
    return () => document.body.classList.remove("record");
  }, []);

  useEffect(() => {
    if (gate === "pending") document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [gate]);

  function add(p: Product) {
    setCart((c) => {
      const found = c.find((l) => l.product.id === p.id);
      if (found) return c.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l));
      return [...c, { product: p, qty: 1 }];
    });
    setOpen(null);
    setCartOpen(true);
  }

  const count = cart.reduce((n, l) => n + l.qty, 0);

  return (
    <div className="min-h-screen bg-paper">
      <TopStrip />
      <Nav2 count={count} onCart={() => setCartOpen(true)} />

      <main>
        <Hero2 onOpen={setOpen} />
        <Verify2 />
        <Discover2 onOpen={setOpen} />
        <Tools2 />
        <FAQ2 />
      </main>

      <Footer2 />

      <ProductDrawer product={open} onClose={() => setOpen(null)} onAdd={add} />
      <CartDrawer
        open={cartOpen}
        lines={cart}
        onClose={() => setCartOpen(false)}
        onRemove={(id) => setCart((c) => c.filter((l) => l.product.id !== id))}
      />

      <QualificationGate state={gate} onAgree={() => setGate("in")} onDecline={() => setGate("out")} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layer 1 of the compliance framework: gate at entry, and make it real.
   Biotech Peptides shows a modal on arrival with "I agree" / "I decline".
   The research flagged their fatal inconsistency — the modal says 21+ while
   their terms say 18+ twice — so this uses ONE age, the higher one, and states
   it in the same words everywhere.                                      */
/* ------------------------------------------------------------------ */
function QualificationGate({
  state,
  onAgree,
  onDecline,
}: {
  state: "pending" | "in" | "out";
  onAgree: () => void;
  onDecline: () => void;
}) {
  if (state === "in") return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink2/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
        className="relative w-full max-w-md border border-ink2/15 bg-card p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
      >
        {state === "out" ? (
          <>
            <h2 id="gate-title" className="font-serif text-xl font-semibold text-ink2">
              Access declined
            </h2>
            <p className="mt-3 font-plex text-[13px] leading-relaxed text-graphite">
              This catalog is available only to qualified research professionals.
              You can close this tab, or revisit if your circumstances change.
            </p>
            <button onClick={onAgree} className="btn-quiet mt-5 w-full">
              Go back
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
              <span className="font-data text-[10px] uppercase tracking-[0.18em] text-crimson-deep">
                Restricted access
              </span>
            </div>
            <h2 id="gate-title" className="font-serif text-2xl font-semibold leading-tight text-ink2">
              Research professionals only
            </h2>
            <p className="mt-3 font-plex text-[13px] leading-relaxed text-graphite">
              The materials in this catalog are supplied strictly for in-vitro
              laboratory research. They are not drugs, dietary supplements, foods
              or cosmetics, and any human or animal consumption is prohibited.
            </p>
            <p className="mt-3 font-plex text-[13px] leading-relaxed text-graphite">
              Continue only if you are <strong className="font-semibold text-ink2">21 or older</strong>{" "}
              and are acquiring these materials for laboratory research purposes.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button onClick={onAgree} className="btn-record flex-1">I agree</button>
              <button onClick={onDecline} className="btn-quiet flex-1">I decline</button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function TopStrip() {
  return (
    <div className="border-b border-ink2/10 bg-ink2">
      <p className="wrap py-1.5 text-center font-data text-[9px] uppercase tracking-[0.2em] text-white/75">
        For in-vitro laboratory research use only — not for human or veterinary use
      </p>
    </div>
  );
}

function Nav2({ count, onCart }: { count: number; onCart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? "border-rule bg-paper/95 backdrop-blur" : "border-transparent bg-paper"
      }`}
    >
      <nav className="wrap flex h-14 items-center justify-between gap-4">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-serif text-[17px] font-semibold tracking-[-0.01em] text-ink2">
            Culture Peptides
          </span>
          <span className="hidden font-data text-[9px] uppercase tracking-[0.16em] text-ash sm:inline">
            est. 2019
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {[
            ["The record", "#record"],
            ["Catalog", "#catalog2"],
            ["Calculator", "#tools"],
            ["FAQ", "#faq2"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-plex text-[13px] text-graphite transition-colors hover:text-crimson-deep"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={DIR.vault}
            className="hidden font-data text-[10px] uppercase tracking-[0.14em] text-ash hover:text-ink2 sm:inline"
          >
            → 03
          </a>
          <button
            onClick={onCart}
            className="relative border border-ink2/20 px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.14em] text-ink2 transition-colors hover:border-crimson hover:text-crimson-deep"
          >
            Order
            {count > 0 && (
              <span className="ml-1.5 bg-crimson px-1.5 py-0.5 text-white">{count}</span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

function Footer2() {
  return (
    <footer className="border-t border-rule bg-card">
      <div className="wrap py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-[16px] font-semibold text-ink2">Culture Peptides</p>
            <p className="mt-2 max-w-xs font-plex text-[12px] leading-relaxed text-ash">
              Research-grade peptides, published lot by lot. Supplied for
              in-vitro laboratory research use only.
            </p>
          </div>
          {[
            { h: "Catalog", links: ["Tissue Repair Research", "Metabolic Research", "Growth Axis Research", "Cellular Longevity Research"] },
            { h: "The record", links: ["Lot lookup", "Test result library", "Testing laboratory", "Purity methodology"] },
            { h: "Company", links: ["Shipping & storage", "Terms of sale", "Compliance policy", "Contact"] },
          ].map((c) => (
            <div key={c.h}>
              <p className="mb-3 font-data text-[10px] uppercase tracking-[0.18em] text-ash">{c.h}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#record" className="font-plex text-[12px] text-graphite hover:text-crimson-deep">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Layer 5: terms drafted to the actual business. No borrowed clauses
            whose factual premises don't match (the research flagged a retailer
            disclaiming "in-vitro diagnostic use" — incoherent for a DTC store). */}
        <div className="mt-10 border border-rule bg-paper p-5">
          <p className="font-data text-[10px] uppercase tracking-[0.18em] text-crimson-deep">
            Compliance notice
          </p>
          <p className="mt-2.5 font-plex text-[11.5px] leading-relaxed text-graphite">
            All products supplied by Culture Peptides are intended{" "}
            <strong className="font-semibold text-ink2">
              strictly for in-vitro laboratory research use only
            </strong>
            . They are not drugs, dietary supplements, foods, cosmetics, or
            medical devices, and have not been evaluated by the U.S. Food and
            Drug Administration. They are not for human or veterinary
            consumption, and are not supplied for diagnostic or therapeutic use.
            Culture Peptides is a chemical supplier — not a pharmacy, compounder,
            or outsourcing facility. By purchasing, the buyer represents that
            they are at least 21 years of age, are acquiring these materials for
            lawful laboratory research, and will handle them in accordance with
            all applicable laws and institutional guidelines.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center">
          <p className="font-data text-[10px] text-ash">
            © 2026 Culture Peptides — research use only.
          </p>
          <p className="font-data text-[10px] text-ash">
            Direction 02 · “The Record” —{" "}
            <a href={DIR.decoded} className="text-crimson-deep hover:underline">01</a>{" · "}
            <a href={DIR.vault} className="text-crimson-deep hover:underline">03</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
