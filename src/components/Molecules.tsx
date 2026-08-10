import { memo } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Ambient molecular lattice — nodes + bonds, gently drifting.          */
/* ------------------------------------------------------------------ */

const NODES = [
  { x: 120, y: 140, r: 5 },
  { x: 300, y: 90, r: 3 },
  { x: 470, y: 200, r: 6 },
  { x: 640, y: 120, r: 3 },
  { x: 820, y: 240, r: 5 },
  { x: 980, y: 140, r: 3 },
  { x: 220, y: 340, r: 4 },
  { x: 420, y: 420, r: 3 },
  { x: 600, y: 360, r: 5 },
  { x: 780, y: 460, r: 3 },
  { x: 940, y: 380, r: 4 },
  { x: 150, y: 540, r: 3 },
  { x: 360, y: 600, r: 5 },
  { x: 560, y: 560, r: 3 },
  { x: 720, y: 640, r: 4 },
  { x: 900, y: 580, r: 3 },
];

const BONDS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [0, 6], [2, 8], [4, 10], [6, 7], [7, 8],
  [8, 9], [9, 10], [6, 11], [7, 12], [8, 13],
  [9, 14], [10, 15], [11, 12], [12, 13], [13, 14], [14, 15],
];

export const MoleculeLattice = memo(function MoleculeLattice({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1080 720"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="#FF2233" strokeOpacity="0.16" strokeWidth="1">
        {BONDS.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.4 + i * 0.05, ease: "easeOut" }}
          />
        ))}
      </g>
      {NODES.map((n, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: 0.6 + i * 0.04 },
            y: {
              duration: 6 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            },
          }}
        >
          <circle cx={n.x} cy={n.y} r={n.r} fill={i % 4 === 0 ? "#FF2233" : "#3A3A44"} />
        </motion.g>
      ))}
    </svg>
  );
});

/* ------------------------------------------------------------------ */
/* Peptide backbone — a helical strand of amino-acid residues.          */
/* ------------------------------------------------------------------ */

const RESIDUES = ["G", "E", "P", "P", "P", "G", "K", "P", "A", "D", "D", "A", "G", "L", "V"];

export const PeptideStrand = memo(function PeptideStrand({
  className = "",
}: {
  className?: string;
}) {
  const total = RESIDUES.length;
  const width = 1000;
  const step = width / (total - 1);
  return (
    <svg
      viewBox="0 0 1000 180"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* backbone bond line */}
      <motion.path
        d={RESIDUES.map((_, i) => {
          const x = i * step;
          const y = 90 + Math.sin(i * 0.9) * 42;
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        }).join(" ")}
        fill="none"
        stroke="#FF2233"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
      {RESIDUES.map((res, i) => {
        const x = i * step;
        const y = 90 + Math.sin(i * 0.9) * 42;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <circle cx={x} cy={y} r="13" fill="#0A0A0B" stroke="#24242B" strokeWidth="1" />
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize="12"
              fontFamily="'JetBrains Mono', monospace"
              fill={i % 3 === 0 ? "#FF2233" : "#8A8A92"}
            >
              {res}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
});
