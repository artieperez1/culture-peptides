import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base so assets resolve under the GitHub Pages project path
  // (https://<user>.github.io/culture-peptides/).
  base: "./",
  plugins: [react()],
  server: { host: true, port: 5185 },
});
