import { memo, useMemo } from "react";
import { motion } from "framer-motion";

/**
 * A parametric research vial, drawn rather than photographed.
 *
 * Reasoning: eighteen compounds need eighteen consistent product images. A
 * generated SVG stays sharp at any size, weighs nothing, needs no external
 * asset (so it survives a strict CSP), and — importantly — never implies a
 * photograph of a specific physical lot we haven't shown. The label carries the
 * real catalog data, which is the part a researcher actually reads.
 */

interface VialProps {
  name: string;
  size: string;
  code: string;
  lot?: string;
  /** Surrounding surface, so the glass reads correctly either way. */
  theme?: "dark" | "light";
  accent?: string;
  className?: string;
  /** Slow idle float. Off inside dense lists. */
  animate?: boolean;
}

/** Wrap the compound name onto at most three label lines. */
function wrapName(name: string, max = 15): string[] {
  const words = name.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur.length) cur = w;
    else if ((cur + " " + w).length <= max) cur += " " + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export const Vial = memo(function Vial({
  name,
  size,
  code,
  lot,
  theme = "dark",
  accent = "#FF1F3D",
  className = "",
  animate = false,
}: VialProps) {
  const lines = useMemo(() => wrapName(name), [name]);
  const dark = theme === "dark";

  // Deterministic barcode from the catalog code, so it's stable across renders.
  const bars = useMemo(() => {
    let seed = 0;
    for (const c of code + size) seed = (seed * 31 + c.charCodeAt(0)) % 100000;
    return Array.from({ length: 26 }, (_, i) => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return 0.6 + ((seed >> 8) % 3) * 0.5 + (i % 4 === 0 ? 0.5 : 0);
    });
  }, [code, size]);

  const glassStroke = dark ? "#3A3A44" : "#C9C9D0";
  const capTop = dark ? "#2A2A32" : "#D8D8DE";

  const uid = `v-${code.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <motion.svg
      viewBox="0 0 200 430"
      className={className}
      role="img"
      aria-label={`Vial of ${name}, ${size}, catalog number ${code}`}
      animate={animate ? { y: [0, -7, 0] } : undefined}
      transition={animate ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <defs>
        {/* glass body */}
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={dark ? "#15151A" : "#EEEEF2"} stopOpacity="0.95" />
          <stop offset="18%" stopColor={dark ? "#26262E" : "#FBFBFD"} stopOpacity="0.95" />
          <stop offset="50%" stopColor={dark ? "#1B1B21" : "#F4F4F7"} stopOpacity="0.9" />
          <stop offset="82%" stopColor={dark ? "#101014" : "#E4E4EA"} stopOpacity="0.95" />
          <stop offset="100%" stopColor={dark ? "#0B0B0F" : "#D6D6DE"} stopOpacity="0.95" />
        </linearGradient>
        {/* aluminium crimp */}
        <linearGradient id={`${uid}-crimp`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6E6E78" />
          <stop offset="22%" stopColor="#C6C6CE" />
          <stop offset="45%" stopColor="#8E8E99" />
          <stop offset="70%" stopColor="#B8B8C2" />
          <stop offset="100%" stopColor="#5C5C66" />
        </linearGradient>
        {/* flip-off top */}
        <linearGradient id={`${uid}-flip`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.75" />
          <stop offset="40%" stopColor={accent} />
          <stop offset="100%" stopColor={accent} stopOpacity="0.6" />
        </linearGradient>
        {/* lyophilized cake */}
        <linearGradient id={`${uid}-cake`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F2F2F0" />
          <stop offset="100%" stopColor="#DCDCD8" />
        </linearGradient>
        {/* clip so contents stay inside the glass */}
        <clipPath id={`${uid}-clip`}>
          <path d="M52 96 h96 v250 a14 14 0 0 1 -14 14 h-68 a14 14 0 0 1 -14 -14 z" />
        </clipPath>
      </defs>

      {/* ground shadow */}
      <ellipse cx="100" cy="373" rx="52" ry="7" fill="#000" opacity={dark ? 0.5 : 0.14} />

      {/* ---- cap assembly ---- */}
      {/* rubber stopper, seen through the neck */}
      <rect x="66" y="74" width="68" height="26" rx="3" fill={dark ? "#4A2027" : "#8C5560"} />
      {/* aluminium crimp */}
      <rect x="60" y="46" width="80" height="34" rx="4" fill={`url(#${uid}-crimp)`} />
      {/* crimp ribs */}
      {[64, 72, 80, 88, 96, 104, 112, 120, 128].map((x) => (
        <line key={x} x1={x} y1="48" x2={x} y2="78" stroke="#000" strokeOpacity="0.16" strokeWidth="1" />
      ))}
      {/* flip-off top */}
      <rect x="66" y="30" width="68" height="20" rx="3" fill={`url(#${uid}-flip)`} />
      <ellipse cx="100" cy="30" rx="34" ry="7" fill={capTop} />
      <ellipse cx="100" cy="29" rx="26" ry="4.5" fill={accent} opacity="0.9" />
      {/* crimp bottom lip */}
      <rect x="58" y="78" width="84" height="6" rx="2" fill="#7A7A85" />

      {/* ---- glass body ---- */}
      <path
        d="M52 90 h96 v256 a16 16 0 0 1 -16 16 h-64 a16 16 0 0 1 -16 -16 z"
        fill={`url(#${uid}-glass)`}
        stroke={glassStroke}
        strokeWidth="1.5"
      />
      {/* neck shoulder */}
      <path d="M60 90 q40 -12 80 0" fill="none" stroke={glassStroke} strokeWidth="1.2" opacity="0.7" />

      <g clipPath={`url(#${uid}-clip)`}>
        {/* lyophilized cake sitting at the bottom */}
        <path
          d="M58 318 q42 -14 84 0 v28 a12 12 0 0 1 -12 12 h-60 a12 12 0 0 1 -12 -12 z"
          fill={`url(#${uid}-cake)`}
        />
        {/* cake surface texture */}
        <path d="M62 322 q38 -10 76 0" fill="none" stroke="#C9C9C4" strokeWidth="0.8" opacity="0.8" />
        {[70, 88, 106, 124].map((x, i) => (
          <circle key={x} cx={x} cy={330 + (i % 2) * 5} r="1.1" fill="#C4C4BE" opacity="0.7" />
        ))}

        {/* ---- label ---- */}
        <g>
          <rect x="46" y="150" width="108" height="132" fill={dark ? "#FBFBFC" : "#FFFFFF"} />
          {/* accent bar */}
          <rect x="46" y="150" width="108" height="6" fill={accent} />

          {/* brand line */}
          <text x="54" y="170" fontSize="6.4" fontFamily="'IBM Plex Mono', monospace" letterSpacing="1.5" fill="#71717A">
            CULTURE PEPTIDES
          </text>
          <line x1="54" y1="175" x2="146" y2="175" stroke="#E4E4E7" strokeWidth="0.8" />

          {/* compound name */}
          {lines.map((l, i) => (
            <text
              key={i}
              x="54"
              y={190 + i * 12}
              fontSize={lines.length > 2 ? 10 : 11.5}
              fontWeight="700"
              fontFamily="'IBM Plex Sans', system-ui, sans-serif"
              fill="#0B0B0C"
            >
              {l}
            </text>
          ))}

          {/* quantity */}
          <text
            x="54"
            y={192 + lines.length * 12 + 4}
            fontSize="9.5"
            fontFamily="'IBM Plex Mono', monospace"
            fill="#0B0B0C"
          >
            {size}
          </text>
          <text
            x="54"
            y={192 + lines.length * 12 + 15}
            fontSize="6"
            fontFamily="'IBM Plex Mono', monospace"
            letterSpacing="0.6"
            fill="#71717A"
          >
            LYOPHILIZED POWDER
          </text>

          {/* research-use flag, on the label itself */}
          <rect x="54" y="240" width="92" height="11" fill="#0B0B0C" />
          <text
            x="58"
            y="248"
            fontSize="5.8"
            fontFamily="'IBM Plex Mono', monospace"
            letterSpacing="0.9"
            fill="#FFFFFF"
          >
            RESEARCH USE ONLY
          </text>

          {/* barcode + codes */}
          <g transform="translate(54, 256)">
            {bars.map((w, i) => (
              <rect key={i} x={i * 3.5} y="0" width={w} height="12" fill="#0B0B0C" />
            ))}
          </g>
          <text x="54" y="278" fontSize="5.8" fontFamily="'IBM Plex Mono', monospace" fill="#3F3F46">
            {code}{lot ? `  ·  LOT ${lot}` : ""}
          </text>
        </g>
      </g>

      {/* ---- glass specular highlights, over everything ---- */}
      <rect x="60" y="96" width="7" height="250" rx="3.5" fill="#FFF" opacity={dark ? 0.13 : 0.7} />
      <rect x="71" y="96" width="2.5" height="250" rx="1.25" fill="#FFF" opacity={dark ? 0.07 : 0.45} />
      <rect x="134" y="110" width="4" height="220" rx="2" fill="#FFF" opacity={dark ? 0.06 : 0.3} />
      {/* rim */}
      <path
        d="M52 90 h96"
        stroke="#FFF"
        strokeOpacity={dark ? 0.22 : 0.9}
        strokeWidth="1.5"
      />
    </motion.svg>
  );
});
