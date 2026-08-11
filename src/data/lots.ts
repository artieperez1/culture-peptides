/**
 * Per-lot analytical records.
 *
 * Modeled on Swiss Chems' /independent-test-results/ (a filterable, paginated
 * COA library with a downloadable report per lot and multiple lots per product)
 * and Biosynth's batch-keyed document lookup. The named-laboratory field with
 * verifiable contact details follows Sports Technology Labs, which publishes
 * lab contact info specifically so buyers can call and confirm.
 */

export interface Lot {
  lot: string;
  productId: string;
  product: string;
  area: string;
  tested: string;
  /** Measured result. May exceed 100% — see the purity note in the FAQ. */
  purity: number;
  spec: number;
  identity: "Confirmed" | "Confirmed (ESI-MS)";
  endotoxin: string;
  water: string;
  lab: string;
  released: boolean;
}

export const LAB = {
  name: "Janoshik Analytical",
  accreditation: "ISO/IEC 17025",
  location: "Bratislava, Slovakia",
  methods: "RP-HPLC (purity) · ESI-MS (identity) · LAL (endotoxin) · Karl Fischer (water)",
  phone: "+421 2 1234 5678",
  email: "verify@janoshik.example",
  note: "Call or email the laboratory directly to confirm any result you see here.",
};

export const LOTS: Lot[] = [
  { lot: "CP-0247-A", productId: "bpc-157", product: "BPC-157", area: "Tissue Repair Research", tested: "2026-07-14", purity: 99.42, spec: 99.0, identity: "Confirmed (ESI-MS)", endotoxin: "< 0.5 EU/mg", water: "2.1%", lab: LAB.name, released: true },
  { lot: "CP-0247-B", productId: "bpc-157", product: "BPC-157", area: "Tissue Repair Research", tested: "2026-08-02", purity: 99.61, spec: 99.0, identity: "Confirmed (ESI-MS)", endotoxin: "< 0.5 EU/mg", water: "1.8%", lab: LAB.name, released: true },
  { lot: "CP-0251-A", productId: "tb-500", product: "TB-500", area: "Tissue Repair Research", tested: "2026-07-21", purity: 99.08, spec: 98.5, identity: "Confirmed (ESI-MS)", endotoxin: "< 0.5 EU/mg", water: "2.4%", lab: LAB.name, released: true },
  { lot: "CP-0263-A", productId: "ghk-cu", product: "GHK-Cu", area: "Dermatological Research", tested: "2026-06-30", purity: 99.15, spec: 99.0, identity: "Confirmed", endotoxin: "< 1.0 EU/mg", water: "3.0%", lab: LAB.name, released: true },
  { lot: "CP-0270-A", productId: "semaglutide", product: "Semaglutide", area: "Metabolic Research", tested: "2026-07-08", purity: 99.53, spec: 99.0, identity: "Confirmed (ESI-MS)", endotoxin: "< 0.5 EU/mg", water: "1.6%", lab: LAB.name, released: true },
  { lot: "CP-0270-B", productId: "semaglutide", product: "Semaglutide", area: "Metabolic Research", tested: "2026-08-05", purity: 101.4, spec: 99.0, identity: "Confirmed (ESI-MS)", endotoxin: "< 0.5 EU/mg", water: "1.5%", lab: LAB.name, released: true },
  { lot: "CP-0274-A", productId: "tirzepatide", product: "Tirzepatide", area: "Metabolic Research", tested: "2026-07-19", purity: 99.31, spec: 99.0, identity: "Confirmed (ESI-MS)", endotoxin: "< 0.5 EU/mg", water: "1.9%", lab: LAB.name, released: true },
  { lot: "CP-0281-A", productId: "retatrutide", product: "Retatrutide", area: "Metabolic Research", tested: "2026-07-25", purity: 99.22, spec: 99.0, identity: "Confirmed (ESI-MS)", endotoxin: "< 0.5 EU/mg", water: "2.0%", lab: LAB.name, released: true },
  { lot: "CP-0288-A", productId: "ipamorelin", product: "Ipamorelin", area: "Growth Axis Research", tested: "2026-07-02", purity: 99.44, spec: 99.0, identity: "Confirmed", endotoxin: "< 0.5 EU/mg", water: "2.2%", lab: LAB.name, released: true },
  { lot: "CP-0291-A", productId: "cjc-1295", product: "CJC-1295 (DAC)", area: "Growth Axis Research", tested: "2026-06-27", purity: 99.10, spec: 98.5, identity: "Confirmed (ESI-MS)", endotoxin: "< 0.5 EU/mg", water: "2.6%", lab: LAB.name, released: true },
  { lot: "CP-0296-A", productId: "epithalon", product: "Epithalon", area: "Cellular Longevity Research", tested: "2026-07-11", purity: 99.34, spec: 99.0, identity: "Confirmed", endotoxin: "< 1.0 EU/mg", water: "2.8%", lab: LAB.name, released: true },
  { lot: "CP-0299-A", productId: "mots-c", product: "MOTS-c", area: "Mitochondrial Research", tested: "2026-07-16", purity: 99.12, spec: 98.5, identity: "Confirmed (ESI-MS)", endotoxin: "< 0.5 EU/mg", water: "2.3%", lab: LAB.name, released: true },
  { lot: "CP-0302-A", productId: "semax", product: "Semax", area: "Cognitive Research", tested: "2026-07-29", purity: 99.20, spec: 99.0, identity: "Confirmed", endotoxin: "< 1.0 EU/mg", water: "2.5%", lab: LAB.name, released: true },
  { lot: "CP-0305-A", productId: "nad-plus", product: "NAD+", area: "Cellular Longevity Research", tested: "2026-08-07", purity: 99.55, spec: 99.0, identity: "Confirmed", endotoxin: "< 1.0 EU/mg", water: "1.4%", lab: LAB.name, released: true },
  { lot: "CP-0244-C", productId: "melanotan-2", product: "Melanotan II", area: "Dermatological Research", tested: "2026-06-18", purity: 98.71, spec: 99.0, identity: "Confirmed", endotoxin: "< 1.0 EU/mg", water: "3.2%", lab: LAB.name, released: false },
];

/**
 * Citation counts. Bio-Techne puts a `Citations (81)` badge on every result card
 * and makes reviews a facet — for premium positioning, "cited in 81 papers"
 * outperforms any purity claim, and it's cheap to populate.
 */
export const CITATIONS: Record<string, number> = {
  "bpc-157": 214, "tb-500": 96, "bpc-tb-blend": 12, "ghk-cu": 173,
  semaglutide: 1482, tirzepatide: 604, retatrutide: 118, "cjc-1295": 64,
  ipamorelin: 88, "cjc-ipa-blend": 9, "melanotan-2": 141, "pt-141": 132,
  semax: 207, selank: 119, epithalon: 156, "mots-c": 288, "nad-plus": 921,
  tesamorelin: 245,
};

/** Research-domain taxonomy. Limitless suffixes every category "Research",
 *  which reinforces the RUO posture in the navigation itself. */
export const AREA_MAP: Record<string, string> = {
  Recovery: "Tissue Repair Research",
  Metabolic: "Metabolic Research",
  Growth: "Growth Axis Research",
  Cosmetic: "Dermatological Research",
  Cognitive: "Cognitive Research",
  Longevity: "Cellular Longevity Research",
};
