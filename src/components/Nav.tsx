import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINKS = [
  { label: "Catalog", href: "#catalog" },
  { label: "Verified", href: "#quality" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

export function Nav({ onSearch, cart }: { onSearch: () => void; cart: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-ink/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 border border-culture" />
            <span className="absolute h-2 w-2 animate-pulse-dot bg-culture" />
          </span>
          <span className="font-display text-[17px] font-bold uppercase tracking-tightest text-white">
            Culture<span className="text-culture">.</span>Peps
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[12px] uppercase tracking-[0.14em] text-steel transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSearch}
            className="group flex items-center gap-2.5 border border-line px-3 py-2 text-steel transition-colors hover:border-culture hover:text-white"
            aria-label="Search compounds"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] sm:inline">
              Search
            </span>
            <kbd className="hidden rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] text-steel sm:inline">
              ⌘K
            </kbd>
          </button>

          <a
            href="#catalog"
            className="relative flex items-center gap-2 border border-line px-3 py-2 text-mist transition-colors hover:border-culture hover:text-white"
            aria-label="Cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16l-1.5 10.5a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 6Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path d="M8 6V5a4 4 0 0 1 8 0v1" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {cart > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-culture px-1 font-mono text-[10px] font-bold text-ink">
                {cart}
              </span>
            )}
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center border border-line text-mist md:hidden"
            aria-label="Menu"
          >
            <div className="space-y-1">
              <span className="block h-px w-4 bg-current" />
              <span className="block h-px w-4 bg-current" />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-ink/95 backdrop-blur-xl md:hidden">
          <div className="wrap flex flex-col py-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 font-mono text-[13px] uppercase tracking-[0.14em] text-steel hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.header>
  );
}
