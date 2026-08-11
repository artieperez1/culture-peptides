import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Head3 } from "./Finder";
import { molecularWeight, parseSequence, synthesisDifficulty } from "../v2/peptideMath";

/**
 * Instant sequence → price quoting.
 *
 * The research called live custom-synthesis pricing "the largest open
 * competitive gap in this market": GenScript hard-gates its entire configurator
 * behind /customer/login; AnaSpec, JPT and LifeTein are all email quotes with a
 * one-business-day turnaround; LifeTein's reputed "instant pricing" turned out to
 * be two mutually contradictory static tables. Biosynth is the exception —
 * "From Sequence to Quote in Seconds", with a guest mode.
 *
 * Two details copied verbatim because they're quietly excellent:
 *  · "No preference (lowest price)" as the DEFAULT on salt form — Biosynth puts
 *    that price-nudge default on five separate dropdowns.
 *  · "Don't know" on every required technical dropdown — JPT does this on all 14
 *    of its quote forms, and it removes the main reason people abandon.
 */

const PURITY = [
  { v: "crude", label: "Crude", mult: 1 },
  { v: "80", label: "≥ 80%", mult: 1.25 },
  { v: "90", label: "≥ 90%", mult: 1.6 },
  { v: "95", label: "≥ 95%", mult: 2.1 },
  { v: "98", label: "≥ 98%", mult: 2.9 },
  { v: "unknown", label: "Don't know — advise me", mult: 2.1 },
];

const SCALE = [
  { v: "1", label: "1 mg", mult: 1 },
  { v: "5", label: "5 mg", mult: 2.2 },
  { v: "10", label: "10 mg", mult: 3.4 },
  { v: "50", label: "50 mg", mult: 9 },
  { v: "100", label: "100 mg", mult: 15 },
  { v: "unknown", label: "Don't know — advise me", mult: 2.2 },
];

const SALT = [
  { v: "none", label: "No preference (lowest price)", add: 0 },
  { v: "tfa", label: "TFA", add: 0 },
  { v: "acetate", label: "Acetate", add: 40 },
  { v: "hcl", label: "HCl", add: 55 },
  { v: "unknown", label: "Don't know — advise me", add: 0 },
];

const MODS = [
  { v: "none", label: "None", add: 0 },
  { v: "amide", label: "C-terminal amide", add: 35 },
  { v: "acetyl", label: "N-terminal acetyl", add: 35 },
  { v: "biotin", label: "Biotinylation", add: 120 },
  { v: "fam", label: "5-FAM label", add: 180 },
  { v: "disulfide", label: "Disulfide bridge", add: 210 },
  { v: "unknown", label: "Don't know — advise me", add: 0 },
];

interface Line {
  id: number;
  seq: string;
  residues: number;
  mw: number;
  difficulty: string;
  price: number;
}

let nextId = 1;

export function Quote() {
  const [raw, setRaw] = useState("DRVYIHPF\nGEPPPGKPADDAGLV");
  const [purity, setPurity] = useState("95");
  const [scale, setScale] = useState("5");
  const [salt, setSalt] = useState("none");
  const [mod, setMod] = useState("none");
  const [cart, setCart] = useState<Line[]>([]);

  const parsed = useMemo(() => {
    return raw
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => parseSequence(s).seq)
      .filter((s) => s.length >= 2);
  }, [raw]);

  const pricing = useMemo(() => {
    const pMult = PURITY.find((p) => p.v === purity)?.mult ?? 2.1;
    const sMult = SCALE.find((s) => s.v === scale)?.mult ?? 2.2;
    const saltAdd = SALT.find((s) => s.v === salt)?.add ?? 0;
    const modAdd = MODS.find((m) => m.v === mod)?.add ?? 0;

    return parsed.map((seq) => {
      const diff = synthesisDifficulty(seq);
      const base = seq.length * 11; // per-residue base
      const diffMult = diff.label === "Difficult" ? 1.7 : diff.label === "Moderate" ? 1.25 : 1;
      const price = Math.round((base * pMult * sMult * diffMult + saltAdd + modAdd) / 5) * 5;
      return { seq, residues: seq.length, mw: molecularWeight(seq), difficulty: diff.label, price };
    });
  }, [parsed, purity, scale, salt, mod]);

  const estTotal = pricing.reduce((s, p) => s + p.price, 0);
  const cartTotal = cart.reduce((s, l) => s + l.price, 0);

  function addAll() {
    setCart((c) => [...c, ...pricing.map((p) => ({ id: nextId++, ...p }))]);
  }

  return (
    <section id="quote" className="border-b border-hair bg-slate2 py-18 sm:py-24">
      <div className="wrap">
        <Head3
          eyebrow="Custom synthesis"
          title="Sequence to price, right now"
          desc="Paste one sequence per line. No login, no waiting on an email — the estimate updates as you type."
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          {/* ---- configurator ---- */}
          <div className="border border-hair bg-obsidian">
            <div className="border-b border-hair px-4 py-2.5"><span className="lab">Sequences</span></div>
            <div className="p-4">
              <textarea
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                rows={5}
                spellCheck={false}
                aria-label="Sequences, one per line"
                className="w-full resize-y border border-hair bg-slate2 px-3 py-2.5 font-data text-[13px] leading-relaxed tracking-[0.06em] text-white focus:border-signal focus:outline-none"
              />
              <p className="mt-2 text-[11px] text-fog">
                One per line, 1- or 3-letter code. {parsed.length} valid{" "}
                {parsed.length === 1 ? "sequence" : "sequences"} detected.
                Need a scan library?{" "}
                <a href="#workbench" className="text-signal hover:underline">Design it first</a>.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Sel label="Purity" value={purity} onChange={setPurity} opts={PURITY} />
                <Sel label="Scale" value={scale} onChange={setScale} opts={SCALE} />
                <Sel label="Salt form" value={salt} onChange={setSalt} opts={SALT} />
                <Sel label="Modification" value={mod} onChange={setMod} opts={MODS} />
              </div>

              <p className="mt-4 border-t border-hair pt-3.5 text-[11.5px] leading-relaxed text-fog">
                Every dropdown has a “don't know” option. Pick it and we'll
                recommend a spec with the quote rather than making you guess —
                and salt form defaults to whatever is cheapest.
              </p>
            </div>
          </div>

          {/* ---- estimate ---- */}
          <div className="space-y-4">
            <div className="border border-hair bg-obsidian">
              <div className="flex items-center justify-between border-b border-hair px-4 py-2.5">
                <span className="lab">Estimate</span>
                <span className="font-data text-[10px] text-fog">indicative, ex-shipping</span>
              </div>

              {pricing.length === 0 ? (
                <p className="px-4 py-8 text-[13px] text-fog">
                  Paste a sequence to see pricing.
                </p>
              ) : (
                <>
                  <ul className="divide-y divide-hair">
                    {pricing.map((p, i) => (
                      <li key={i} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-all font-data text-[11.5px] tracking-[0.1em] text-white">
                              {p.seq}
                            </p>
                            <p className="mt-1 font-data text-[10.5px] text-fog">
                              {p.residues} residues · {p.mw.toFixed(1)} g/mol ·{" "}
                              <span className={p.difficulty === "Routine" ? "text-fog" : "text-signal"}>
                                {p.difficulty.toLowerCase()}
                              </span>
                            </p>
                          </div>
                          <p className="shrink-0 font-data text-[13px] font-medium text-white">
                            ${p.price}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t border-hair px-4 py-3">
                    <span className="text-[13px] text-chalk">Estimated total</span>
                    <span className="font-sora text-2xl font-semibold text-white">${estTotal}</span>
                  </div>
                  <div className="border-t border-hair px-4 py-3">
                    <button onClick={addAll} className="btn-signal w-full">
                      Add to quote cart
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* quote cart */}
            <div className="border border-hair bg-obsidian">
              <div className="flex items-center justify-between border-b border-hair px-4 py-2.5">
                <span className="lab">Quote cart</span>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="font-data text-[10px] uppercase tracking-[0.12em] text-fog hover:text-signal"
                  >
                    Clear
                  </button>
                )}
              </div>
              {cart.length === 0 ? (
                <p className="px-4 py-6 text-[12.5px] text-fog">
                  Empty. Configure above and add — you can stack several specs
                  into one quote.
                </p>
              ) : (
                <>
                  <ul className="max-h-56 divide-y divide-hair overflow-y-auto">
                    {cart.map((l) => (
                      <li key={l.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                        <span className="min-w-0 truncate font-data text-[11px] tracking-[0.08em] text-chalk">
                          {l.seq}
                        </span>
                        <span className="flex shrink-0 items-center gap-2.5">
                          <span className="font-data text-[12px] text-white">${l.price}</span>
                          <button
                            onClick={() => setCart((c) => c.filter((x) => x.id !== l.id))}
                            aria-label="Remove"
                            className="font-data text-[11px] text-fog hover:text-signal"
                          >
                            ✕
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t border-hair px-4 py-3">
                    <span className="text-[13px] text-chalk">{cart.length} in quote</span>
                    <span className="font-sora text-xl font-semibold text-white">${cartTotal}</span>
                  </div>
                  <div className="border-t border-hair px-4 py-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="btn-outline w-full"
                      onClick={() => alert("Demo — a real quote PDF would generate here.")}
                    >
                      Generate quotation
                    </motion.button>
                    <p className="mt-2 text-[10.5px] leading-relaxed text-fog">
                      Custom synthesis is quoted for laboratory research use only,
                      to qualified researchers and institutions.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sel({
  label, value, onChange, opts,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  opts: { v: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-data text-[9px] uppercase tracking-[0.14em] text-fog">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-hair bg-slate2 px-2.5 py-2 font-data text-[12px] text-white focus:border-signal focus:outline-none"
      >
        {opts.map((o) => (
          <option key={o.v} value={o.v}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
