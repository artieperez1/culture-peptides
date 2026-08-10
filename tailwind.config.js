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
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
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
