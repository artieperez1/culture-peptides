import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Catalog } from "./components/Catalog";
import { Quality } from "./components/Quality";
import { Process } from "./components/Process";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { SearchOverlay } from "./components/SearchOverlay";
import { ProductDetail } from "./components/ProductDetail";
import type { Product } from "./data/products";

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);
  const [cart, setCart] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const addToCart = useCallback((p: Product) => {
    setCart((c) => c + 1);
    setToast(`${p.name} · ${p.size} added to cart`);
    setDetail(null);
  }, []);

  const openDetail = useCallback((p: Product) => {
    setSearchOpen(false);
    setDetail(p);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen bg-ink">
      <div className="noise" />

      {/* research-use-only top strip */}
      <div className="relative z-[55] bg-culture-deep">
        <p className="wrap py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/90">
          For laboratory & research use only — not for human consumption
        </p>
      </div>

      <Nav onSearch={() => setSearchOpen(true)} cart={cart} />

      <main>
        <Hero onSearch={() => setSearchOpen(true)} />
        <Marquee />
        <Catalog onAdd={addToCart} onOpen={openDetail} />
        <Quality />
        <Process />
        <FAQ />
      </main>

      <Footer onSearch={() => setSearchOpen(true)} />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onAdd={openDetail} />
      <ProductDetail product={detail} onClose={() => setDetail(null)} onAdd={addToCart} />

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 border border-line bg-panel px-4 py-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
          >
            <span className="flex h-6 w-6 items-center justify-center bg-culture font-mono text-[12px] font-bold text-ink">
              ✓
            </span>
            <span className="font-mono text-[12px] text-mist">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
