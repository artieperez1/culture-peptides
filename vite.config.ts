import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  // Relative base so assets resolve under the GitHub Pages project path
  // (https://<user>.github.io/culture-peptides/).
  base: "./",
  plugins: [react()],
  server: { host: true, port: 5185 },
  build: {
    rollupOptions: {
      input: {
        // v1 — "decoded": dark lab-terminal / hype-brand direction
        main: resolve(__dirname, "index.html"),
        // v2 — "the record": light analytical-instrument direction
        record: resolve(__dirname, "record.html"),
        // v3 — "the vault": everything, dark chrome + white data surfaces
        flagship: resolve(__dirname, "flagship.html"),
      },
    },
  },
});
