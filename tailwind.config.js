/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",
        panel: "#111114",
        surface: "#16161A",
        line: "#24242B",
        steel: "#8A8A92",
        mist: "#C7C7CE",
        culture: {
          DEFAULT: "#FF2233",
          bright: "#FF3B44",
          deep: "#C10014",
          glow: "#FF4D5A",
        },
        /* v2 — "the record": light analytical-instrument palette */
        paper: "#FAFAF9",
        card: "#FFFFFF",
        ink2: "#0B0B0C",
        graphite: "#3F3F46",
        ash: "#71717A",
        rule: "#E4E4E7",
        crimson: {
          DEFAULT: "#E4002B",
          deep: "#B00020",
          soft: "#FEF2F4",
        },
        /* v3 — "the vault": dark chrome, white data surfaces */
        obsidian: "#08080A",
        slate2: "#101014",
        raised: "#16161B",
        hair: "#22222A",
        fog: "#8E8E99",
        chalk: "#E8E8EC",
        signal: {
          DEFAULT: "#FF1F3D",
          deep: "#C8102E",
          dim: "#7A0A1C",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        serif: ['"IBM Plex Serif"', "Georgia", "serif"],
        plex: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        data: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
        sora: ['"Sora"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scan": {
          "0%,100%": { opacity: "0.15" },
          "50%": { opacity: "0.55" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "pulse-dot": {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.7)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        scan: "scan 3s ease-in-out infinite",
        "spin-slow": "spin-slow 40s linear infinite",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
