import { useState } from "react";
import { motion } from "framer-motion";
import { DIR } from "../lib/directions";

const COLS = [
  {
    h: "Catalog",
    links: ["Recovery", "Metabolic", "Growth Hormone", "Cosmetic", "Cognitive", "Longevity"],
  },
  { h: "Company", links: ["About", "Verification", "Lab partners", "Contact", "Wholesale"] },
  { h: "Support", links: ["Shipping & storage", "Certificates of analysis", "Returns", "Track order"] },
];

export function Footer({ onSearch }: { onSearch: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="border-t border-line bg-ink">
      {/* closing CTA */}
      <div className="relative overflow-hidden border-b border-line grid-bg">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-culture/15 blur-[130px]" />
        <div className="wrap relative py-20 text-center sm:py-28">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-[0.92] tracking-tightest text-white"
          >
            Set the standard for
            <br />
            <span className="text-culture text-glow">your research.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-steel"
          >
            Verified compounds, published data, and 24-hour dispatch. Find what
            you need in seconds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <a href="#catalog" className="btn-primary">Explore catalog</a>
            <button onClick={onSearch} className="btn-ghost">
              Search compounds <kbd className="rounded-sm border border-line px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
          </motion.div>
        </div>
      </div>

      {/* main footer */}
      <div className="wrap py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="absolute inset-0 border border-culture" />
                <span className="absolute h-2 w-2 bg-culture" />
              </span>
              <span className="font-display text-[17px] font-bold uppercase tracking-tightest text-white">
                Culture<span className="text-culture">.</span>Peps
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-steel">
              Research-grade peptides, verified to the molecule. For laboratory
              and research use only.
            </p>

            {/* newsletter */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSent(true);
              }}
              className="mt-6 flex max-w-sm border border-line focus-within:border-culture"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Research inquiries →"
                className="w-full bg-transparent px-3 py-2.5 font-mono text-[12px] text-white placeholder:text-steel focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-culture px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-culture-bright"
              >
                {sent ? "✓" : "Join"}
              </button>
            </form>
          </div>

          {COLS.map((col) => (
            <div key={col.h}>
              <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
                {col.h}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#catalog"
                      className="text-[13px] text-mist transition-colors hover:text-culture"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* compliance disclaimer */}
        <div className="mt-14 border border-culture/30 bg-culture/[0.04] p-5">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-culture">
            <span className="h-1.5 w-1.5 bg-culture" /> Compliance notice — read carefully
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-steel">
            All products sold by Culture Peptides are intended{" "}
            <span className="text-mist">
              strictly for in-vitro laboratory research and development use only
            </span>
            . Products are not for human or veterinary use, and are not drugs,
            foods, cosmetics, or dietary supplements. Nothing on this site is
            intended to diagnose, treat, cure, or prevent any disease. Products
            are not for resale as consumer goods. By purchasing, the buyer
            certifies they are a qualified researcher at least 21 years of age and
            agrees to handle materials in accordance with all applicable laws and
            institutional guidelines. Culture Peptides accepts no liability for
            misuse.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-steel">
            © 2026 Culture Peptides — Research use only.
          </p>
          <div className="flex items-center gap-5 font-mono text-[11px] text-steel">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Compliance</a>
            <span className="text-line">|</span>
            <span>
              Direction 01 ·{" "}
              <a href={DIR.record} className="text-culture hover:underline">02</a>{" · "}
              <a href={DIR.vault} className="text-culture hover:underline">03</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
