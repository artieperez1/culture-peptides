/**
 * Fulfilment and provenance detail.
 *
 * Availability rendered as a delivery promise ("Arrives in 1–2 business days")
 * with shipping stated on the page comes from Bio-Techne. Stock location as a
 * product field comes from Biosynth. The scratch-off serial check is Swiss
 * Chems' /verify-products/ — a real anti-diversion control that doubles as
 * distribution monitoring.
 */

export const FULFILMENT = {
  cutoff: "1:00 pm PT",
  promise: "Arrives in 1–2 business days",
  location: "Reno, NV — cold-chain warehouse",
  shipping: "$14 flat US, free over $200",
  packing: "Lyophilized, argon-sealed, insulated with gel packs",
  returns: "Unopened vials returnable within 60 days",
};

/**
 * Cross-cutting modification tags as a separate browse axis over the
 * compound tree — from CPC Scientific, which tags `phosphorylated`,
 * `N-methylated`, `stapled`, `sulfated`, `dye-labeled` and more.
 */
export const MODIFICATIONS: Record<string, string[]> = {
  "bpc-157": ["unmodified"],
  "tb-500": ["acetylated"],
  "bpc-tb-blend": ["acetylated", "blend"],
  "ghk-cu": ["metal-complexed"],
  semaglutide: ["acylated", "lipidated"],
  tirzepatide: ["acylated", "lipidated"],
  retatrutide: ["acylated", "lipidated"],
  "cjc-1295": ["DAC-conjugated"],
  ipamorelin: ["C-term amide"],
  "cjc-ipa-blend": ["DAC-conjugated", "blend"],
  "melanotan-2": ["cyclized", "lactam"],
  "pt-141": ["cyclized", "lactam"],
  semax: ["unmodified"],
  selank: ["unmodified"],
  epithalon: ["unmodified"],
  "mots-c": ["unmodified"],
  "nad-plus": ["dinucleotide"],
  tesamorelin: ["trans-3-hexenoyl"],
};

/** Valid demo serials for the authenticity checker. */
export const SERIALS: Record<string, { lot: string; product: string; released: string }> = {
  "7QK2M4XR9P": { lot: "CP-0247-A", product: "BPC-157", released: "2026-07-16" },
  "B3TN8WLZ5V": { lot: "CP-0270-B", product: "Semaglutide", released: "2026-08-06" },
  "H9YD6FQC2M": { lot: "CP-0288-A", product: "Ipamorelin", released: "2026-07-04" },
};

/**
 * Institutions that have ordered. CS Bio's twelve-logo customer wall is the
 * most efficient trust signal per pixel of any site researched — the only one
 * using borrowed-brand proof. Rendered as set type rather than logos, since
 * using real institutional marks without permission would be its own problem.
 */
export const INSTITUTIONS = [
  "University research cores",
  "Hospital research institutes",
  "Contract research organizations",
  "Independent analytical labs",
  "Biotech discovery groups",
  "Academic teaching labs",
];

/**
 * Named human contact, rather than a faceless form — CordenPharma ends every
 * capability page with a named person, title, email and LinkedIn.
 */
export const CONTACTS = [
  {
    name: "Dr. Marisol Vance",
    title: "Head of Quality & Regulatory",
    scope: "Certificates, lot investigations, method questions",
    email: "quality@culturepeptides.example",
  },
  {
    name: "Aleksander Roth",
    title: "Custom Synthesis Lead",
    scope: "Sequences, modifications, scale-up quotes",
    email: "synthesis@culturepeptides.example",
  },
  {
    name: "Priya Raghunathan",
    title: "Institutional Accounts",
    scope: "Purchase orders, net terms, standing supply",
    email: "accounts@culturepeptides.example",
  },
];
