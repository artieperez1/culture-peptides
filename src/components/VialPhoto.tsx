import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Vial } from "./Vial";

/**
 * Photoreal vial: studio photograph + a live label.
 *
 * The photography was generated once (two lighting variants, dark and light) on
 * a deliberately BLANK label, straight-on and centred. Each compound's label is
 * then drawn over the photo as SVG at a measured rectangle.
 *
 * Why not bake the text into 18 generated images: the label carries compound
 * names like Tirzepatide and Retatrutide plus catalog and lot numbers, and an
 * image model will occasionally misspell them. Overlaying real data means the
 * label is always correct, all eighteen vials are pixel-identical apart from the
 * label, and the whole catalog costs one image download instead of eighteen.
 *
 * Label rect was measured off the source photo, not eyeballed:
 *   left 9.44%  top 39.79%  width 81.24%  height 35.99%
 */

const LABEL = { left: 9.44, top: 39.79, width: 81.24, height: 35.99 };

/** Label rect in source pixels — the SVG works in these units. */
const LW = 617;
const LH = 672;

interface Props {
  name: string;
  size: string;
  code: string;
  lot?: string;
  theme?: "dark" | "light";
  className?: string;
  animate?: boolean;
  /** Skip the photograph and use the drawn vial instead. */
  drawn?: boolean;
}

function wrapName(name: string, max = 13): string[] {
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

export const VialPhoto = memo(function VialPhoto({
  name,
  size,
  code,
  lot,
  theme = "dark",
  className = "",
  animate = false,
  drawn = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const lines = useMemo(() => wrapName(name), [name]);

  const bars = useMemo(() => {
    let seed = 0;
    for (const c of code + size) seed = (seed * 31 + c.charCodeAt(0)) % 100000;
    return Array.from({ length: 30 }, (_, i) => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return 3 + ((seed >> 8) % 3) * 2.6 + (i % 4 === 0 ? 2.4 : 0);
    });
  }, [code, size]);

  // Fall back to the drawn vial if the photograph can't load.
  if (drawn || failed) {
    return (
      <Vial
        name={name}
        size={size}
        code={code}
        lot={lot}
        theme={theme}
        accent={theme === "dark" ? "#FF1F3D" : "#E4002B"}
        className={className}
        animate={animate}
      />
    );
  }

  const src = `${import.meta.env.BASE_URL}img/vial-${theme}.webp`;
  const nameSize = lines.length > 2 ? 52 : 62;

  return (
    <motion.div
      className={`relative ${className}`}
      animate={animate ? { y: [0, -8, 0] } : undefined}
      transition={animate ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <img
        src={src}
        alt={`Vial of ${name}, ${size}, catalog number ${code}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="block h-auto w-full"
        style={{
          // feather the studio background into whatever surface this sits on
          WebkitMaskImage:
            "radial-gradient(115% 92% at 50% 48%, #000 62%, transparent 100%)",
          maskImage:
            "radial-gradient(115% 92% at 50% 48%, #000 62%, transparent 100%)",
        }}
      />

      {/* live label, positioned on the photographed blank */}
      <svg
        viewBox={`0 0 ${LW} ${LH}`}
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: `${LABEL.left}%`,
          top: `${LABEL.top}%`,
          width: `${LABEL.width}%`,
          height: `${LABEL.height}%`,
        }}
      >
        <defs>
          {/* cylindrical shading, so the print sits on a curved surface */}
          <linearGradient id={`cyl-${code}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" stopOpacity="0.20" />
            <stop offset="12%" stopColor="#000" stopOpacity="0.05" />
            <stop offset="34%" stopColor="#fff" stopOpacity="0.10" />
            <stop offset="62%" stopColor="#000" stopOpacity="0.015" />
            <stop offset="88%" stopColor="#000" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.24" />
          </linearGradient>
        </defs>

        {/* text is inset from the edges, where the label curves away */}
        <g transform="translate(74, 34)">
          <text
            x="0" y="0"
            fontSize="30" letterSpacing="6"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fill="#6B6B74"
          >
            CULTURE PEPTIDES
          </text>
          <line x1="0" y1="22" x2={LW - 148} y2="22" stroke="#D8D8DC" strokeWidth="3" />

          {lines.map((l, i) => (
            <text
              key={i}
              x="0"
              y={82 + i * (nameSize + 6)}
              fontSize={nameSize}
              fontWeight="700"
              fontFamily="'IBM Plex Sans', system-ui, sans-serif"
              fill="#111114"
            >
              {l}
            </text>
          ))}

          <text
            x="0"
            y={92 + lines.length * (nameSize + 6) + 22}
            fontSize="46"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fill="#111114"
          >
            {size}
          </text>
          <text
            x="0"
            y={92 + lines.length * (nameSize + 6) + 60}
            fontSize="25" letterSpacing="2.6"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fill="#7A7A83"
          >
            LYOPHILIZED POWDER
          </text>

          {/* research-use band, printed on the label itself */}
          <rect x="0" y="420" width={LW - 148} height="46" fill="#111114" />
          <text
            x="14" y="452"
            fontSize="25" letterSpacing="3.4"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fill="#FFFFFF"
          >
            RESEARCH USE ONLY
          </text>

          {/* barcode */}
          <g transform="translate(0, 486)">
            {bars.map((w, i) => (
              <rect key={i} x={i * 15.4} y="0" width={w} height="52" fill="#111114" />
            ))}
          </g>
          <text
            x="0" y="574"
            fontSize="24"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fill="#5A5A63"
          >
            {code}{lot ? `  ·  LOT ${lot}` : ""}
          </text>
        </g>

        {/* curvature shading over the print */}
        <rect x="0" y="0" width={LW} height={LH} fill={`url(#cyl-${code})`} />
      </svg>
    </motion.div>
  );
});
