/**
 * Shared matcher for the universal search box.
 *
 * One input that accepts sequence (1- or 3-letter), peptide name, CAS number and
 * catalog number — the pattern from CPC Scientific, whose placeholder advertises
 * exactly that, with Biosynth's three-letter normalization layered on. Five of
 * the eight researched reagent suppliers have no sequence search at all.
 */
import { PRODUCTS, type Product } from "../data/products";
import { AREA_MAP } from "../data/lots";
import { parseSequence } from "../v2/peptideMath";

/** Raw one-letter sequences, for motif matching. */
export const ONE_LETTER: Record<string, string> = {
  "bpc-157": "GEPPPGKPADDAGLV",
  "tb-500": "SDKPDMAEIEKFDKSKLKKTETQ",
  semax: "MEHFPGP",
  selank: "TKPRPGP",
  epithalon: "AEDG",
  "mots-c": "MRWQEMGYIFYPRKLR",
};

export type MatchKind = "sequence" | "cas" | "code" | "name" | "area" | "tag";

export const KIND_LABEL: Record<MatchKind, string> = {
  sequence: "Sequence motif",
  cas: "CAS number",
  code: "Catalog no.",
  name: "Name",
  area: "Research area",
  tag: "Modification",
};

export interface Hit {
  p: Product;
  kind: MatchKind;
  detail: string;
  motif?: string;
}

export type Interpretation =
  | { kind: "cas"; as: string }
  | { kind: "code"; as: string }
  | { kind: "sequence"; as: string; normalized: boolean }
  | { kind: "text"; as: string }
  | null;

export function interpret(raw: string): Interpretation {
  const q = raw.trim();
  if (!q) return null;
  if (/^\d{2,7}-\d{2}-\d$/.test(q)) return { kind: "cas", as: q };
  if (/^CP-\d{1,3}$/i.test(q)) return { kind: "code", as: q.toUpperCase() };

  const { seq } = parseSequence(q);
  const letters = q.replace(/[^A-Za-z]/g, "");
  if (seq.length >= 3 && seq.length >= letters.length / 3) {
    return { kind: "sequence", as: seq, normalized: seq.length < letters.length };
  }
  return { kind: "text", as: q };
}

export function search(raw: string, limit = 8): Hit[] {
  const q = raw.trim();
  if (!q) return [];
  const lower = q.toLowerCase();
  const mode = interpret(q);
  const out: Hit[] = [];

  for (const p of PRODUCTS) {
    if (p.cas.replace(/\s/g, "") === q.replace(/\s/g, "")) {
      out.push({ p, kind: "cas", detail: p.cas });
      continue;
    }
    if (p.code.toLowerCase() === lower) {
      out.push({ p, kind: "code", detail: p.code });
      continue;
    }
    if (mode?.kind === "sequence") {
      const target = ONE_LETTER[p.id];
      if (target?.includes(mode.as)) {
        out.push({ p, kind: "sequence", detail: target, motif: mode.as });
        continue;
      }
    }
    if (p.name.toLowerCase().includes(lower)) {
      out.push({ p, kind: "name", detail: p.name });
      continue;
    }
    const area = AREA_MAP[p.category] ?? p.category;
    if (area.toLowerCase().includes(lower)) {
      out.push({ p, kind: "area", detail: area });
      continue;
    }
    if (p.tags.some((t) => t.includes(lower))) {
      out.push({ p, kind: "tag", detail: p.tags.join(" · ") });
    }
  }
  return out.slice(0, limit);
}
