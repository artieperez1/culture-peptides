import { useMemo, useState } from "react";
import { Head } from "./Discover2";
import {
  chargeCurve,
  gravy,
  isoelectricPoint,
  molecularWeight,
  netCharge,
  parseSequence,
  solubilityHint,
  synthesisDifficulty,
} from "./peptideMath";

/**
 * One genuinely useful free technical tool, showing its work.
 *
 * Bachem's Peptide Calculator prints the formula ("M = ∑ (Mi × Ni) + Mn + Mc")
 * and cites Lehninger for pKa values; Biosynth's returns a net-charge-vs-pH
 * titration curve across pH 0–14 and GRAVY. Both are ungated and double as SEO
 * and credibility assets.
 *
 * The synthesis-difficulty read is territory nobody has claimed publicly:
 * GenScript's "Peptide Analyzing Tool" gates its output behind login, and
 * LifeTein built one but left it password-protected.
 */
export function Tools2() {
  const [raw, setRaw] = useState("GEPPPGKPADDAGLV");

  const { seq, invalid } = useMemo(() => parseSequence(raw), [raw]);

  const stats = useMemo(() => {
    if (seq.length < 2) return null;
    return {
      length: seq.length,
      mw: molecularWeight(seq),
      pI: isoelectricPoint(seq),
      q7: netCharge(seq, 7),
      gravy: gravy(seq),
      curve: chargeCurve(seq, 0.1),
      difficulty: synthesisDifficulty(seq),
      solubility: solubilityHint(seq),
    };
  }, [seq]);

  return (
    <section id="tools" className="border-b border-rule bg-paper py-16 sm:py-20">
      <div className="wrap">
        <Head
          eyebrow="Free tool"
          title="Peptide property calculator"
          desc="Paste a sequence in one- or three-letter code. No account, no email, no gate."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
          {/* ---------- input ---------- */}
          <div className="border border-ink2/15 bg-card">
            <div className="border-b border-rule px-4 py-2.5">
              <span className="font-data text-[10px] uppercase tracking-[0.16em] text-ink2">
                Sequence input
              </span>
            </div>
            <div className="p-4">
              <textarea
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                rows={4}
                spellCheck={false}
                aria-label="Peptide sequence"
                className="w-full resize-y border border-rule bg-paper px-3 py-2.5 font-data text-[13px] leading-relaxed tracking-[0.06em] text-ink2 focus:border-crimson focus:outline-none"
              />

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="font-data text-[10px] uppercase tracking-[0.14em] text-ash">
                  Examples
                </span>
                {[
                  ["BPC-157", "GEPPPGKPADDAGLV"],
                  ["3-letter", "Asp-Arg-Val-Tyr-Ile-His-Pro-Phe"],
                  ["MOTS-c", "MRWQEMGYIFYPRKLR"],
                ].map(([label, s]) => (
                  <button
                    key={label}
                    onClick={() => setRaw(s)}
                    className="border border-rule px-2 py-1 font-data text-[10px] text-graphite transition-colors hover:border-crimson hover:text-crimson-deep"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {invalid.length > 0 && (
                <p className="mt-3 font-plex text-[12px] text-crimson-deep">
                  Ignored unrecognized characters: {invalid.join(", ")}
                </p>
              )}

              {seq && (
                <div className="mt-4 border-t border-rule pt-3">
                  <p className="font-data text-[10px] uppercase tracking-[0.14em] text-ash">
                    Parsed · {seq.length} residues
                  </p>
                  <p className="mt-1.5 break-all font-data text-[12px] leading-relaxed tracking-[0.14em] text-ink2">
                    {seq}
                  </p>
                </div>
              )}

              {/* the math, printed */}
              <details className="mt-4 border-t border-rule pt-3">
                <summary className="cursor-pointer font-data text-[10px] uppercase tracking-[0.14em] text-ash hover:text-ink2">
                  Show the math
                </summary>
                <div className="mt-2.5 space-y-2 font-data text-[11px] leading-relaxed text-graphite">
                  <p>M = Σ (M<sub>i</sub> × N<sub>i</sub>) + H₂O</p>
                  <p>q(pH) = Σ 1/(1+10^(pH−pKa)) − Σ 1/(1+10^(pKa−pH))</p>
                  <p>pI solved by bisection where q(pH) = 0</p>
                  <p className="text-ash">
                    Residue masses are average values; pKa values per Lehninger.
                    GRAVY is the mean Kyte–Doolittle hydropathy.
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* ---------- output ---------- */}
          <div className="border border-ink2/15 bg-card">
            <div className="border-b border-rule px-4 py-2.5">
              <span className="font-data text-[10px] uppercase tracking-[0.16em] text-ink2">
                Computed properties
              </span>
            </div>

            {!stats ? (
              <p className="px-4 py-10 font-plex text-[13px] text-ash">
                Enter at least two residues to compute.
              </p>
            ) : (
              <div className="p-4">
                <dl className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
                  {[
                    ["Length", `${stats.length}`],
                    ["MW", stats.mw.toFixed(2)],
                    ["pI", stats.pI.toFixed(2)],
                    ["q @ pH 7", stats.q7 >= 0 ? `+${stats.q7.toFixed(2)}` : stats.q7.toFixed(2)],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-card px-3 py-2.5">
                      <dt className="font-data text-[9px] uppercase tracking-[0.14em] text-ash">{k}</dt>
                      <dd className="mt-0.5 font-data text-[13px] font-medium text-ink2">{v}</dd>
                    </div>
                  ))}
                </dl>

                {/* titration curve */}
                <figure className="mt-4">
                  <figcaption className="mb-2 flex items-center justify-between">
                    <span className="font-data text-[10px] uppercase tracking-[0.14em] text-ash">
                      Net charge vs pH
                    </span>
                    <span className="font-data text-[10px] text-crimson-deep">
                      pI = {stats.pI.toFixed(2)}
                    </span>
                  </figcaption>
                  <TitrationCurve curve={stats.curve} pI={stats.pI} />
                </figure>

                {/* derived reads */}
                <div className="mt-4 grid gap-px border border-rule bg-rule sm:grid-cols-3">
                  <div className="bg-card px-3 py-3">
                    <p className="font-data text-[9px] uppercase tracking-[0.14em] text-ash">GRAVY</p>
                    <p className="mt-1 font-data text-[13px] font-medium text-ink2">
                      {stats.gravy.toFixed(3)}
                    </p>
                    <p className="mt-0.5 font-plex text-[11px] text-ash">
                      {stats.gravy < 0 ? "Hydrophilic" : "Hydrophobic"}
                    </p>
                  </div>
                  <div className="bg-card px-3 py-3">
                    <p className="font-data text-[9px] uppercase tracking-[0.14em] text-ash">
                      Solubility
                    </p>
                    <p className="mt-1 font-data text-[13px] font-medium text-ink2">
                      {stats.solubility.label}
                    </p>
                    <p className="mt-0.5 font-plex text-[11px] leading-snug text-ash">
                      {stats.solubility.note}
                    </p>
                  </div>
                  <div className="bg-card px-3 py-3">
                    <p className="font-data text-[9px] uppercase tracking-[0.14em] text-ash">
                      Synthesis
                    </p>
                    <p className="mt-1 font-data text-[13px] font-medium text-ink2">
                      {stats.difficulty.label}
                    </p>
                    <p className="mt-0.5 font-plex text-[11px] leading-snug text-ash">
                      {stats.difficulty.reasons[0] ?? "No flags raised"}
                    </p>
                  </div>
                </div>

                {stats.difficulty.reasons.length > 1 && (
                  <ul className="mt-3 space-y-1">
                    {stats.difficulty.reasons.slice(1).map((r) => (
                      <li key={r} className="flex gap-2 font-plex text-[11px] text-ash">
                        <span className="text-crimson">·</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mt-4 border-t border-rule pt-3 font-plex text-[11px] leading-relaxed text-ash">
                  Computed values are theoretical, from sequence alone. They
                  describe the molecule, not any lot — for measured values see
                  that lot's certificate of analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TitrationCurve({
  curve,
  pI,
}: {
  curve: { pH: number; q: number }[];
  pI: number;
}) {
  const W = 520;
  const H = 190;
  const PAD = { l: 34, r: 10, t: 10, b: 26 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  const qs = curve.map((p) => p.q);
  const max = Math.max(2, Math.ceil(Math.max(...qs)));
  const min = Math.min(-2, Math.floor(Math.min(...qs)));

  const toX = (pH: number) => PAD.l + (pH / 14) * plotW;
  const toY = (q: number) => PAD.t + plotH - ((q - min) / (max - min)) * plotH;

  const path = curve
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.pH).toFixed(2)} ${toY(p.q).toFixed(2)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full border border-rule bg-paper"
      role="img"
      aria-label={`Net charge versus pH curve crossing zero at pH ${pI.toFixed(2)}`}
    >
      {/* horizontal gridlines */}
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((q) => (
        <g key={q}>
          <line
            x1={PAD.l} y1={toY(q)} x2={W - PAD.r} y2={toY(q)}
            stroke={q === 0 ? "#A1A1AA" : "#E4E4E7"}
            strokeWidth="1"
            strokeDasharray={q === 0 ? "3 3" : undefined}
          />
          <text
            x={PAD.l - 6} y={toY(q) + 3}
            textAnchor="end" fontSize="8"
            fontFamily="'IBM Plex Mono', monospace" fill="#A1A1AA"
          >
            {q > 0 ? `+${q}` : q}
          </text>
        </g>
      ))}

      {/* pH ticks */}
      {[0, 2, 4, 6, 8, 10, 12, 14].map((pH) => (
        <g key={pH}>
          <line x1={toX(pH)} y1={PAD.t + plotH} x2={toX(pH)} y2={PAD.t + plotH + 3} stroke="#D4D4D8" />
          <text
            x={toX(pH)} y={H - 8} textAnchor="middle" fontSize="8"
            fontFamily="'IBM Plex Mono', monospace" fill="#A1A1AA"
          >
            {pH}
          </text>
        </g>
      ))}

      {/* pI marker */}
      <line
        x1={toX(pI)} y1={PAD.t} x2={toX(pI)} y2={PAD.t + plotH}
        stroke="#E4002B" strokeWidth="1" strokeDasharray="2 3"
      />
      <circle cx={toX(pI)} cy={toY(0)} r="3" fill="#E4002B" />

      {/* the curve */}
      <path d={path} fill="none" stroke="#0B0B0C" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
