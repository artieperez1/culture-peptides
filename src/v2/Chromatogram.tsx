import { memo, useMemo } from "react";
import { motion } from "framer-motion";

/**
 * An actual HPLC purity trace, drawn from Gaussian peaks.
 *
 * The reasoning: the most characteristic artifact in this industry's world is
 * the chromatogram that proves purity. Every DTC peptide site claims ">99%";
 * the reputable suppliers publish the trace. So the trace *is* the hero.
 */

interface Peak {
  rt: number;      // retention time (min)
  height: number;  // 0–1
  width: number;   // sigma
  label?: string;
}

const PEAKS: Peak[] = [
  { rt: 1.6, height: 0.035, width: 0.09 },
  { rt: 3.4, height: 0.022, width: 0.1 },
  { rt: 6.15, height: 0.03, width: 0.08 },
  { rt: 8.2, height: 1, width: 0.17, label: "main" },
  { rt: 9.45, height: 0.028, width: 0.1 },
  { rt: 11.8, height: 0.018, width: 0.12 },
];

const X_MAX = 14;
const W = 1000;
const H = 300;
const PAD = { l: 44, r: 16, t: 18, b: 34 };

function signal(x: number) {
  return PEAKS.reduce(
    (sum, p) => sum + p.height * Math.exp(-((x - p.rt) ** 2) / (2 * p.width ** 2)),
    0
  );
}

export const Chromatogram = memo(function Chromatogram({
  className = "",
}: {
  className?: string;
}) {
  const { path, area, mainX } = useMemo(() => {
    const plotW = W - PAD.l - PAD.r;
    const plotH = H - PAD.t - PAD.b;
    const toX = (x: number) => PAD.l + (x / X_MAX) * plotW;
    const toY = (v: number) => PAD.t + plotH - v * plotH * 0.9;

    const steps = 900;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * X_MAX;
      pts.push(`${i === 0 ? "M" : "L"} ${toX(x).toFixed(2)} ${toY(signal(x)).toFixed(2)}`);
    }
    const line = pts.join(" ");

    // Shaded integration area under the main peak only.
    const lo = 8.2 - 0.62;
    const hi = 8.2 + 0.62;
    const aPts: string[] = [`M ${toX(lo).toFixed(2)} ${toY(0).toFixed(2)}`];
    for (let i = 0; i <= 200; i++) {
      const x = lo + (i / 200) * (hi - lo);
      aPts.push(`L ${toX(x).toFixed(2)} ${toY(signal(x)).toFixed(2)}`);
    }
    aPts.push(`L ${toX(hi).toFixed(2)} ${toY(0).toFixed(2)} Z`);

    return { path: line, area: aPts.join(" "), mainX: toX(8.2) };
  }, []);

  const plotH = H - PAD.t - PAD.b;
  const baseY = PAD.t + plotH;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="HPLC chromatogram showing a single dominant peak at 8.2 minutes representing 99.42 percent purity"
    >
      {/* y gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = PAD.t + plotH - f * plotH * 0.9;
        return (
          <g key={f}>
            <line
              x1={PAD.l} y1={y} x2={W - PAD.r} y2={y}
              stroke="#E4E4E7" strokeWidth="1"
              strokeDasharray={f === 0 ? undefined : "2 4"}
            />
            <text
              x={PAD.l - 8} y={y + 3.5} textAnchor="end"
              fontSize="9" fontFamily="'IBM Plex Mono', monospace" fill="#A1A1AA"
            >
              {Math.round(f * 100)}
            </text>
          </g>
        );
      })}

      {/* x ticks (retention time, minutes) */}
      {[0, 2, 4, 6, 8, 10, 12, 14].map((t) => {
        const x = PAD.l + (t / X_MAX) * (W - PAD.l - PAD.r);
        return (
          <g key={t}>
            <line x1={x} y1={baseY} x2={x} y2={baseY + 4} stroke="#D4D4D8" strokeWidth="1" />
            <text
              x={x} y={baseY + 16} textAnchor="middle"
              fontSize="9" fontFamily="'IBM Plex Mono', monospace" fill="#A1A1AA"
            >
              {t}
            </text>
          </g>
        );
      })}
      <text
        x={W - PAD.r} y={H - 4} textAnchor="end"
        fontSize="9" fontFamily="'IBM Plex Mono', monospace" fill="#A1A1AA"
      >
        RETENTION TIME (MIN)
      </text>

      {/* integrated area */}
      <motion.path
        d={area}
        fill="#E4002B"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.09 }}
        transition={{ duration: 0.8, delay: 2.1 }}
      />

      {/* the trace */}
      <motion.path
        d={path}
        fill="none"
        stroke="#E4002B"
        strokeWidth="1.75"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      />

      {/* main-peak annotation */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.3 }}
      >
        <line
          x1={mainX} y1={PAD.t + 4} x2={mainX} y2={PAD.t + plotH * 0.1}
          stroke="#0B0B0C" strokeWidth="1" strokeDasharray="2 3"
        />
        <text
          x={mainX + 8} y={PAD.t + 14}
          fontSize="11" fontFamily="'IBM Plex Mono', monospace" fontWeight="600" fill="#0B0B0C"
        >
          99.42%
        </text>
        <text
          x={mainX + 8} y={PAD.t + 27}
          fontSize="9" fontFamily="'IBM Plex Mono', monospace" fill="#71717A"
        >
          RT 8.20 · LOT CP-0247-A
        </text>
      </motion.g>
    </svg>
  );
});
