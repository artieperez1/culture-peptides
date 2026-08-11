import { useMemo, useState } from "react";
import { Head3 } from "./Finder";
import {
  chargeCurve, gravy, isoelectricPoint, molecularWeight, netCharge,
  parseSequence, solubilityHint, synthesisDifficulty,
} from "../v2/peptideMath";

/**
 * Two free tools, ungated, showing their work.
 *
 * Properties: Bachem's calculator prints its formulas and cites Lehninger;
 * Biosynth's returns a net-charge-vs-pH titration curve and GRAVY. The
 * synthesis-difficulty read is territory nobody has claimed publicly — GenScript
 * gates its "Peptide Analyzing Tool" behind login and LifeTein left theirs
 * password-protected.
 *
 * Library design: JPT's PepSequencer generates overlapping scans from a pasted
 * sequence, exports CSV, and is linked from step 1 of all 14 of their quote forms
 * — design in the tool, export, feed the order. The best closed loop found.
 */
export function Workbench() {
  const [tab, setTab] = useState<"props" | "library">("props");

  return (
    <section id="workbench" className="border-b border-hair bg-obsidian py-18 sm:py-24">
      <div className="wrap">
        <Head3
          eyebrow="Free tools"
          title="Work it out first"
          desc="No account, no email capture, no gate. Paste a sequence and get real numbers."
        />

        <div className="mb-6 inline-flex border border-hair">
          {([["props", "Properties"], ["library", "Library design"]] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-2.5 font-data text-[11px] uppercase tracking-[0.14em] transition-colors ${
                tab === k ? "bg-signal text-white" : "text-fog hover:text-chalk"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {tab === "props" ? <Properties /> : <LibraryDesign />}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Properties() {
  const [raw, setRaw] = useState("GEPPPGKPADDAGLV");
  const { seq, invalid } = useMemo(() => parseSequence(raw), [raw]);

  const s = useMemo(() => {
    if (seq.length < 2) return null;
    return {
      len: seq.length,
      mw: molecularWeight(seq),
      pI: isoelectricPoint(seq),
      q7: netCharge(seq, 7),
      g: gravy(seq),
      curve: chargeCurve(seq, 0.1),
      diff: synthesisDifficulty(seq),
      sol: solubilityHint(seq),
    };
  }, [seq]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      <div className="border border-hair bg-slate2">
        <div className="border-b border-hair px-4 py-2.5"><span className="lab">Sequence input</span></div>
        <div className="p-4">
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={4}
            spellCheck={false}
            aria-label="Peptide sequence"
            className="w-full resize-y border border-hair bg-obsidian px-3 py-2.5 font-data text-[13px] leading-relaxed tracking-[0.06em] text-white focus:border-signal focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="lab">Examples</span>
            {[
              ["BPC-157", "GEPPPGKPADDAGLV"],
              ["3-letter", "Asp-Arg-Val-Tyr-Ile-His-Pro-Phe"],
              ["MOTS-c", "MRWQEMGYIFYPRKLR"],
              ["hydrophobic", "LLVFIWLFVAG"],
            ].map(([l, v]) => (
              <button
                key={l}
                onClick={() => setRaw(v)}
                className="border border-hair px-2 py-1 font-data text-[10px] text-chalk transition-colors hover:border-signal hover:text-signal"
              >
                {l}
              </button>
            ))}
          </div>

          {invalid.length > 0 && (
            <p className="mt-3 text-[12px] text-signal">Ignored: {invalid.join(", ")}</p>
          )}

          {seq && (
            <div className="mt-4 border-t border-hair pt-3">
              <p className="lab">Parsed · {seq.length} residues</p>
              <p className="mt-1.5 break-all font-data text-[12px] leading-relaxed tracking-[0.14em] text-white">
                {seq}
              </p>
            </div>
          )}

          <details className="mt-4 border-t border-hair pt-3">
            <summary className="cursor-pointer lab hover:text-chalk">Show the math</summary>
            <div className="mt-2.5 space-y-1.5 font-data text-[11px] leading-relaxed text-chalk">
              <p>M = Σ (M<sub>i</sub> × N<sub>i</sub>) + H₂O</p>
              <p>q(pH) = Σ 1/(1+10^(pH−pKa)) − Σ 1/(1+10^(pKa−pH))</p>
              <p>pI by bisection where q(pH) = 0</p>
              <p className="text-fog">
                Average residue masses; pKa per Lehninger; GRAVY is mean
                Kyte–Doolittle hydropathy.
              </p>
            </div>
          </details>
        </div>
      </div>

      <div className="border border-hair bg-slate2">
        <div className="border-b border-hair px-4 py-2.5"><span className="lab">Computed</span></div>
        {!s ? (
          <p className="px-4 py-10 text-[13px] text-fog">Enter at least two residues.</p>
        ) : (
          <div className="p-4">
            <dl className="grid grid-cols-2 gap-px border border-hair bg-hair sm:grid-cols-4">
              {[
                ["Length", `${s.len}`],
                ["MW", s.mw.toFixed(2)],
                ["pI", s.pI.toFixed(2)],
                ["q @ pH 7", s.q7 >= 0 ? `+${s.q7.toFixed(2)}` : s.q7.toFixed(2)],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate2 px-3 py-2.5">
                  <dt className="font-data text-[9px] uppercase tracking-[0.14em] text-fog">{k}</dt>
                  <dd className="mt-0.5 font-data text-[13px] font-medium text-white">{v}</dd>
                </div>
              ))}
            </dl>

            <figure className="mt-4">
              <figcaption className="mb-2 flex items-center justify-between">
                <span className="lab">Net charge vs pH</span>
                <span className="font-data text-[10px] text-signal">pI = {s.pI.toFixed(2)}</span>
              </figcaption>
              <Curve curve={s.curve} pI={s.pI} />
            </figure>

            <div className="mt-4 grid gap-px border border-hair bg-hair sm:grid-cols-3">
              {[
                ["GRAVY", s.g.toFixed(3), s.g < 0 ? "Hydrophilic" : "Hydrophobic"],
                ["Solubility", s.sol.label, s.sol.note],
                ["Synthesis", s.diff.label, s.diff.reasons[0] ?? "No flags raised"],
              ].map(([k, v, n]) => (
                <div key={k} className="bg-slate2 px-3 py-3">
                  <p className="font-data text-[9px] uppercase tracking-[0.14em] text-fog">{k}</p>
                  <p className="mt-1 font-data text-[13px] font-medium text-white">{v}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-fog">{n}</p>
                </div>
              ))}
            </div>

            {s.diff.reasons.length > 1 && (
              <ul className="mt-3 space-y-1">
                {s.diff.reasons.slice(1).map((r) => (
                  <li key={r} className="flex gap-2 text-[11px] text-fog">
                    <span className="text-signal">·</span>{r}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 border-t border-hair pt-3 text-[11px] leading-relaxed text-fog">
              Theoretical, from sequence alone. These describe the molecule, not
              any lot — for measured values use the lot certificate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Curve({ curve, pI }: { curve: { pH: number; q: number }[]; pI: number }) {
  const W = 520, H = 190, PAD = { l: 34, r: 10, t: 10, b: 26 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const qs = curve.map((p) => p.q);
  const max = Math.max(2, Math.ceil(Math.max(...qs)));
  const min = Math.min(-2, Math.floor(Math.min(...qs)));
  const toX = (pH: number) => PAD.l + (pH / 14) * pw;
  const toY = (q: number) => PAD.t + ph - ((q - min) / (max - min)) * ph;
  const path = curve.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.pH).toFixed(2)} ${toY(p.q).toFixed(2)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full border border-hair bg-obsidian"
      role="img"
      aria-label={`Net charge versus pH, crossing zero at pH ${pI.toFixed(2)}`}
    >
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((q) => (
        <g key={q}>
          <line
            x1={PAD.l} y1={toY(q)} x2={W - PAD.r} y2={toY(q)}
            stroke={q === 0 ? "#4A4A55" : "#22222A"} strokeWidth="1"
            strokeDasharray={q === 0 ? "3 3" : undefined}
          />
          <text x={PAD.l - 6} y={toY(q) + 3} textAnchor="end" fontSize="8" fontFamily="'IBM Plex Mono', monospace" fill="#8E8E99">
            {q > 0 ? `+${q}` : q}
          </text>
        </g>
      ))}
      {[0, 2, 4, 6, 8, 10, 12, 14].map((pH) => (
        <text key={pH} x={toX(pH)} y={H - 8} textAnchor="middle" fontSize="8" fontFamily="'IBM Plex Mono', monospace" fill="#8E8E99">
          {pH}
        </text>
      ))}
      <line x1={toX(pI)} y1={PAD.t} x2={toX(pI)} y2={PAD.t + ph} stroke="#FF1F3D" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx={toX(pI)} cy={toY(0)} r="3" fill="#FF1F3D" />
      <path d={path} fill="none" stroke="#E8E8EC" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */

function LibraryDesign() {
  const [raw, setRaw] = useState("MRWQEMGYIFYPRKLRTPSVHLL");
  const [len, setLen] = useState(9);
  const [offset, setOffset] = useState(3);
  const [copied, setCopied] = useState(false);

  const { seq } = useMemo(() => parseSequence(raw), [raw]);

  const frags = useMemo(() => {
    if (seq.length < len) return [];
    const out: { i: number; start: number; end: number; frag: string; mw: number }[] = [];
    for (let start = 0; start + len <= seq.length; start += offset) {
      const frag = seq.slice(start, start + len);
      out.push({ i: out.length + 1, start: start + 1, end: start + len, frag, mw: molecularWeight(frag) });
    }
    return out;
  }, [seq, len, offset]);

  const csv = useMemo(
    () =>
      ["#,start,end,sequence,mw", ...frags.map((f) => `${f.i},${f.start},${f.end},${f.frag},${f.mw.toFixed(2)}`)].join("\n"),
    [frags]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      <div className="border border-hair bg-slate2">
        <div className="border-b border-hair px-4 py-2.5"><span className="lab">Parent sequence</span></div>
        <div className="p-4">
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={4}
            spellCheck={false}
            aria-label="Parent sequence for library design"
            className="w-full resize-y border border-hair bg-obsidian px-3 py-2.5 font-data text-[13px] leading-relaxed tracking-[0.06em] text-white focus:border-signal focus:outline-none"
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block font-data text-[9px] uppercase tracking-[0.14em] text-fog">
                Peptide length
              </span>
              <input
                type="number" min={4} max={30} value={len}
                onChange={(e) => setLen(Math.max(4, Math.min(30, +e.target.value || 4)))}
                className="w-full border border-hair bg-obsidian px-2.5 py-2 font-data text-[13px] text-white focus:border-signal focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-data text-[9px] uppercase tracking-[0.14em] text-fog">
                Offset (step)
              </span>
              <input
                type="number" min={1} max={12} value={offset}
                onChange={(e) => setOffset(Math.max(1, Math.min(12, +e.target.value || 1)))}
                className="w-full border border-hair bg-obsidian px-2.5 py-2 font-data text-[13px] text-white focus:border-signal focus:outline-none"
              />
            </label>
          </div>

          <p className="mt-3 text-[11.5px] leading-relaxed text-fog">
            For epitope scanning, 8–20 residues with an offset of 2–4 is the usual
            starting point. Overlap here is{" "}
            <span className="font-data text-chalk">{Math.max(0, len - offset)}</span> residues.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-hair pt-4">
            <button
              onClick={() => { navigator.clipboard?.writeText(csv); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
              className="btn-outline !px-4 !py-2"
              disabled={frags.length === 0}
            >
              {copied ? "Copied ✓" : "Copy CSV"}
            </button>
            <a href="#quote" className="btn-signal !px-4 !py-2">Send to quote →</a>
          </div>
        </div>
      </div>

      <div className="border border-hair bg-slate2">
        <div className="flex items-center justify-between border-b border-hair px-4 py-2.5">
          <span className="lab">Generated library</span>
          <span className="font-data text-[10px] text-signal">{frags.length} peptides</span>
        </div>
        {frags.length === 0 ? (
          <p className="px-4 py-10 text-[13px] text-fog">
            Parent sequence must be at least as long as the peptide length.
          </p>
        ) : (
          <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 bg-slate2">
                <tr className="border-b border-hair">
                  {["#", "Range", "Sequence", "MW"].map((h) => (
                    <th key={h} className="px-3 py-2 lab">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {frags.map((f) => (
                  <tr key={f.i} className="border-b border-hair last:border-0 hover:bg-obsidian/60">
                    <td className="px-3 py-2 font-data text-[10.5px] text-fog">{f.i}</td>
                    <td className="px-3 py-2 font-data text-[10.5px] text-fog">{f.start}–{f.end}</td>
                    <td className="px-3 py-2 font-data text-[11.5px] tracking-[0.1em] text-white">{f.frag}</td>
                    <td className="px-3 py-2 font-data text-[10.5px] text-chalk">{f.mw.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
