/**
 * Real peptide property math — no placeholders.
 *
 * Borrowed structurally from Bachem's Peptide Calculator (which prints its own
 * formulas and cites Lehninger for pKa values) and Biosynth's calculator (which
 * returns a net-charge-vs-pH titration curve and GRAVY).
 */

/** Average residue masses (free amino acid − H2O), g/mol. */
const RESIDUE_MASS: Record<string, number> = {
  G: 57.0519, A: 71.0788, S: 87.0782, P: 97.1167, V: 99.1326,
  T: 101.1051, C: 103.1388, L: 113.1594, I: 113.1594, N: 114.1038,
  D: 115.0886, Q: 128.1307, K: 128.1741, E: 129.1155, M: 131.1926,
  H: 137.1411, F: 147.1766, R: 156.1875, Y: 163.1760, W: 186.2132,
};

const WATER = 18.0153;

/** Kyte–Doolittle hydropathy index — used for GRAVY. */
const HYDROPATHY: Record<string, number> = {
  A: 1.8, R: -4.5, N: -3.5, D: -3.5, C: 2.5, Q: -3.5, E: -3.5, G: -0.4,
  H: -3.2, I: 4.5, L: 3.8, K: -3.9, M: 1.9, F: 2.8, P: -1.6, S: -0.8,
  T: -0.7, W: -0.9, Y: -1.3, V: 4.2,
};

/** pKa values (Lehninger). Terminal values first. */
const PKA = {
  cTerm: 3.65,
  nTerm: 8.2,
  D: 3.9, E: 4.07, C: 8.18, Y: 10.46, // acidic side chains
  H: 6.04, K: 10.54, R: 12.48,        // basic side chains
};

const THREE_TO_ONE: Record<string, string> = {
  ALA: "A", ARG: "R", ASN: "N", ASP: "D", CYS: "C", GLN: "Q", GLU: "E",
  GLY: "G", HIS: "H", ILE: "I", LEU: "L", LYS: "K", MET: "M", PHE: "F",
  PRO: "P", SER: "S", THR: "T", TRP: "W", TYR: "Y", VAL: "V",
};

export const AA_LIST = Object.keys(RESIDUE_MASS).sort();

/**
 * Accepts one-letter ("DRVYIHPF"), three-letter ("Arg-Phe-Pro-Leu" or
 * "ArgPheProLeu"), and mixed separators. Mirrors Biosynth, whose search
 * normalizes `arg-phe-pro-leu` → `RFPL`.
 */
export function parseSequence(raw: string): { seq: string; invalid: string[] } {
  const cleaned = raw.toUpperCase().replace(/[^A-Z]/g, " ").trim();
  if (!cleaned) return { seq: "", invalid: [] };

  // Try three-letter interpretation when tokens look like triplets.
  const tokens = cleaned.split(/\s+/);
  const allTriplets =
    tokens.length > 1 && tokens.every((t) => t.length === 3 && THREE_TO_ONE[t]);
  if (allTriplets) {
    return { seq: tokens.map((t) => THREE_TO_ONE[t]).join(""), invalid: [] };
  }

  const joined = tokens.join("");
  // A single run of concatenated triplets, e.g. "ARGPHEPROLEU".
  if (joined.length >= 6 && joined.length % 3 === 0) {
    const triplets = joined.match(/.{3}/g) ?? [];
    if (triplets.every((t) => THREE_TO_ONE[t])) {
      return { seq: triplets.map((t) => THREE_TO_ONE[t]).join(""), invalid: [] };
    }
  }

  const seq = joined.split("").filter((c) => RESIDUE_MASS[c]).join("");
  const invalid = [...new Set(joined.split("").filter((c) => !RESIDUE_MASS[c]))];
  return { seq, invalid };
}

/** M = Σ (Mi × Ni) + H2O */
export function molecularWeight(seq: string): number {
  return seq.split("").reduce((sum, c) => sum + (RESIDUE_MASS[c] ?? 0), 0) + WATER;
}

/** Net charge at a given pH via Henderson–Hasselbalch. */
export function netCharge(seq: string, pH: number): number {
  const count = (r: string) => seq.split("").filter((c) => c === r).length;

  const positive =
    1 / (1 + 10 ** (pH - PKA.nTerm)) +
    count("K") / (1 + 10 ** (pH - PKA.K)) +
    count("R") / (1 + 10 ** (pH - PKA.R)) +
    count("H") / (1 + 10 ** (pH - PKA.H));

  const negative =
    1 / (1 + 10 ** (PKA.cTerm - pH)) +
    count("D") / (1 + 10 ** (PKA.D - pH)) +
    count("E") / (1 + 10 ** (PKA.E - pH)) +
    count("C") / (1 + 10 ** (PKA.C - pH)) +
    count("Y") / (1 + 10 ** (PKA.Y - pH));

  return positive - negative;
}

/** Isoelectric point by bisection on netCharge = 0. */
export function isoelectricPoint(seq: string): number {
  let lo = 0;
  let hi = 14;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (netCharge(seq, mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** GRAVY — mean Kyte–Doolittle hydropathy. Negative = hydrophilic. */
export function gravy(seq: string): number {
  if (!seq) return 0;
  return seq.split("").reduce((s, c) => s + (HYDROPATHY[c] ?? 0), 0) / seq.length;
}

/** Titration curve across pH 0→14. */
export function chargeCurve(seq: string, step = 0.1) {
  const pts: { pH: number; q: number }[] = [];
  for (let pH = 0; pH <= 14 + 1e-9; pH += step) {
    pts.push({ pH: +pH.toFixed(2), q: netCharge(seq, pH) });
  }
  return pts;
}

/**
 * Synthesis-difficulty heuristic. GenScript ships a "Peptide Analyzing Tool"
 * for this and LifeTein built one but kept it password-gated — so a public
 * version is unclaimed territory.
 */
export function synthesisDifficulty(seq: string) {
  const reasons: string[] = [];
  let score = 0;

  if (seq.length > 40) { score += 3; reasons.push(`${seq.length} residues — long chain`); }
  else if (seq.length > 25) { score += 1; reasons.push(`${seq.length} residues`); }

  const cys = (seq.match(/C/g) ?? []).length;
  if (cys >= 2) { score += 2; reasons.push(`${cys} Cys — disulfide management`); }

  const met = (seq.match(/M/g) ?? []).length;
  if (met) { score += 1; reasons.push(`${met} Met — oxidation-sensitive`); }

  // β-sheet-prone hydrophobic runs cause on-resin aggregation.
  const run = seq.match(/[VILFWY]{4,}/g);
  if (run) { score += 2; reasons.push(`hydrophobic run "${run[0]}" — aggregation risk`); }

  const npruns = seq.match(/(NG|DG|DP)/g);
  if (npruns) { score += 1; reasons.push(`${npruns[0]} motif — rearrangement risk`); }

  const gravyVal = gravy(seq);
  if (gravyVal > 1.0) { score += 1; reasons.push(`GRAVY ${gravyVal.toFixed(2)} — poor aqueous solubility`); }

  const label = score >= 6 ? "Difficult" : score >= 3 ? "Moderate" : "Routine";
  return { label, score, reasons };
}

/** Predicted aqueous solubility bucket, from net charge at pH 7 + GRAVY. */
export function solubilityHint(seq: string) {
  const q = netCharge(seq, 7);
  const g = gravy(seq);
  if (g > 1.0) return { label: "Difficult", note: "Try DMSO first, then dilute into buffer." };
  if (Math.abs(q) >= 1 && g < 0) return { label: "Good", note: "Sterile water or dilute acetic acid." };
  if (Math.abs(q) < 1) return { label: "Moderate", note: "Near pI — shift pH away from the isoelectric point." };
  return { label: "Moderate", note: "Sterile water; sonicate if hazy." };
}
