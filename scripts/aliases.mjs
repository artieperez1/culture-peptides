/**
 * Give each design direction a clean, shareable URL.
 *
 * Vite emits flat files (record.html, flagship.html). GitHub Pages serves
 * /foo/ from /foo/index.html, so copying each build output into its own
 * directory turns
 *     /culture-peptides/flagship.html   →   /culture-peptides/vault/
 * The original .html paths keep working, so links already shared stay valid.
 */
import { copyFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

const ALIASES = [
  { from: "index.html", to: "decoded/index.html", label: "01 · Decoded" },
  { from: "record.html", to: "record/index.html", label: "02 · The Record" },
  { from: "flagship.html", to: "vault/index.html", label: "03 · The Vault" },
];

for (const { from, to, label } of ALIASES) {
  const dest = resolve(dist, to);
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(resolve(dist, from), dest);
  console.log(`  ${label.padEnd(18)} /${to.replace(/index\.html$/, "")}`);
}
