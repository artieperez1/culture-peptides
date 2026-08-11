/**
 * Compound monographs.
 *
 * COMPLIANCE NOTE — read before editing.
 * These describe what each molecule IS and what it ACTS ON, at a molecular
 * level, plus the research models it appears in. They deliberately do not
 * describe human effects, benefits, outcomes, dosing, protocols or
 * administration. That separation is the whole point: the research into this
 * industry found that Peptide Sciences ran "research use only" language
 * alongside dosage guides and human-use references, received an FDA warning
 * letter, and shut down in March 2026 — and the FDA's letter to a competitor
 * turned explicitly on website evidence of *intended use* rather than on the
 * disclaimer itself.
 *
 * So: mechanism and literature framing, always. Never "helps with", never
 * "improves", never a dose. If a future edit wants to add an outcome claim,
 * the answer is no.
 */

export interface Monograph {
  /** One-line classification. */
  class: string;
  /** What the molecule is, structurally and where it comes from. */
  what: string;
  /** What it binds or acts on, mechanistically. */
  mechanism: string;
  /** Research contexts it appears in, framed as study areas. */
  studied: string[];
  /** Handling notes that are laboratory-relevant only. */
  handling: string;
  /** Year/origin detail — useful, concrete, non-promotional. */
  origin: string;
}

export const MONOGRAPHS: Record<string, Monograph> = {
  "bpc-157": {
    class: "Synthetic pentadecapeptide",
    what: "A 15-amino-acid sequence corresponding to a partial fragment of Body Protection Compound, a protein identified in human gastric juice. Produced synthetically; the native protein is not the product.",
    mechanism: "In published models it is associated with upregulation of VEGFR2 signalling and with the FAK–paxillin pathway, alongside interaction with the nitric oxide system. It is not a receptor agonist in the classical single-target sense, which is part of why it remains actively studied.",
    studied: [
      "Tendon, ligament and connective-tissue repair models",
      "Gastrointestinal mucosal integrity assays",
      "Angiogenesis and endothelial migration studies",
    ],
    handling: "Stable lyophilized at -20 °C. Readily soluble in sterile water; net charge is strongly negative at neutral pH, so avoid buffering near its isoelectric point.",
    origin: "First described in the early 1990s from work on gastric juice protein fragments.",
  },

  "tb-500": {
    class: "Synthetic peptide fragment",
    what: "A synthetic fragment corresponding to the active region of Thymosin β4, a naturally occurring actin-sequestering protein found in most mammalian cell types. TB-500 is the fragment, not full-length Thymosin β4.",
    mechanism: "Binds actin and influences actin polymerization, which is the basis for its association with cell migration in the literature. Downstream reports describe effects on endothelial cell migration and angiogenesis.",
    studied: [
      "Cell migration and cytoskeletal dynamics",
      "Wound and dermal repair models",
      "Cardiac and corneal tissue research",
    ],
    handling: "Highly water-soluble. Long and hydrophilic, so aggregation is rarely limiting; standard -20 °C lyophilized storage applies.",
    origin: "Thymosin β4 was isolated from thymus tissue in the 1980s; the truncated research fragment followed.",
  },

  "bpc-tb-blend": {
    class: "Two-peptide research blend",
    what: "A pre-measured combination of BPC-157 and TB-500 in a single vial, supplied so that both peptides can be introduced to the same assay without weighing two separate lots.",
    mechanism: "Each component behaves as described in its own monograph; the blend does not create a new molecular entity. Any interaction between the two is itself a research question, not an established mechanism.",
    studied: [
      "Comparative repair-model designs using both peptides",
      "Protocols where independent weighing introduces error",
    ],
    handling: "Reconstitute as a single unit — the two peptides cannot be separated after blending. Component ratio is stated on the lot certificate.",
    origin: "A supplier-side convenience format rather than a described natural or literature entity.",
  },

  "ghk-cu": {
    class: "Copper-binding tripeptide complex",
    what: "The tripeptide glycyl-L-histidyl-L-lysine complexed with copper(II). GHK occurs naturally in human plasma, where concentration declines with age; the copper complex is the form studied in dermal work.",
    mechanism: "Functions as a copper carrier, delivering Cu²⁺ in a bioavailable form. Reported to modulate expression of extracellular-matrix genes including collagen and metalloproteinases, and to show antioxidant behaviour in vitro.",
    studied: [
      "Dermal remodeling and collagen expression assays",
      "Extracellular-matrix and wound-repair models",
      "Copper homeostasis and antioxidant research",
    ],
    handling: "Distinctive blue colour comes from the copper complex — that is expected, not contamination. Keep away from strong chelators, which will strip the copper.",
    origin: "Identified in human plasma in 1973 during work on liver-cell growth factors.",
  },

  semaglutide: {
    class: "GLP-1 receptor agonist (31-aa analog)",
    what: "A long-acting analog of human glucagon-like peptide-1. Structurally modified at three points: an α-aminoisobutyric acid substitution at position 8 that resists DPP-4 cleavage, an arginine substitution at 34, and a C18 fatty diacid attached to lysine 26 through a linker.",
    mechanism: "Agonist at the GLP-1 receptor, a class B G-protein-coupled receptor. The fatty-acid chain drives reversible albumin binding, which is what extends its circulating half-life from minutes to roughly a week in published pharmacokinetic work.",
    studied: [
      "Incretin receptor signalling and cAMP response",
      "Glucose-dependent insulin secretion in islet models",
      "Gastric motility and central appetite-pathway research in animal models",
    ],
    handling: "Amphipathic due to the lipid chain — reconstitute gently and avoid vigorous agitation, which promotes interfacial aggregation. Do not vortex.",
    origin: "Developed from GLP-1 analog research in the 2000s; the peptide sequence is well characterized in the literature.",
  },

  tirzepatide: {
    class: "Dual GIP / GLP-1 receptor agonist",
    what: "A 39-amino-acid synthetic peptide built on a GIP backbone, engineered to activate two incretin receptors at once. Carries α-aminoisobutyric acid substitutions and a C20 fatty diacid for albumin binding.",
    mechanism: "Agonist at both the glucose-dependent insulinotropic polypeptide receptor and the GLP-1 receptor, with reported imbalance in favour of GIP. Dual activation is the reason it is studied separately from single-receptor agonists rather than as an equivalent.",
    studied: [
      "Comparative single- versus dual-incretin receptor signalling",
      "Beta-cell response and insulin secretion models",
      "Adipose and hepatic metabolic pathway research",
    ],
    handling: "As with other lipidated peptides, avoid shear and foaming on reconstitution. Amphipathic behaviour makes surface adsorption a real consideration in low-concentration work.",
    origin: "Emerged from dual-agonist incretin research published in the late 2010s.",
  },

  retatrutide: {
    class: "Triple GIP / GLP-1 / glucagon receptor agonist",
    what: "A synthetic peptide engineered to engage three receptors simultaneously — GIP, GLP-1 and glucagon — making it the most mechanistically complex of the incretin-family compounds in this catalog.",
    mechanism: "Balanced agonism across all three receptors. Adding glucagon-receptor activity introduces hepatic energy-expenditure pathways that dual agonists do not touch, which is precisely the variable under investigation.",
    studied: [
      "Triple-receptor signalling and pathway crosstalk",
      "Hepatic energy expenditure models",
      "Comparative agonist-selectivity studies",
    ],
    handling: "Handle as for other lipidated incretin analogs — gentle reconstitution, no vortexing, minimise air-liquid interface exposure.",
    origin: "One of the newest compounds here; triple-agonist data began appearing in the 2020s.",
  },

  "cjc-1295": {
    class: "GHRH analog with albumin-binding complex",
    what: "A modified fragment of growth-hormone-releasing hormone — GHRH(1-29) — carrying four amino-acid substitutions (D-Ala², Gln⁸, Ala¹⁵, Leu²⁷) plus a Drug Affinity Complex: a maleimide group that forms a covalent bond with serum albumin.",
    mechanism: "Agonist at the GHRH receptor on anterior pituitary somatotrophs, stimulating pulsatile growth hormone release. The substitutions block enzymatic degradation; the DAC extends half-life from minutes to days by tethering the peptide to albumin.",
    studied: [
      "GHRH receptor signalling and pituitary response",
      "Growth-hormone pulsatility and IGF-1 axis models",
      "Half-life extension strategy research",
    ],
    handling: "The DAC variant is distinct from unmodified CJC-1295 — confirm which you are ordering. Reconstitute in sterile water; avoid oxidising conditions that could affect the maleimide.",
    origin: "Developed in the early 2000s as a long-acting GHRH analog.",
  },

  ipamorelin: {
    class: "Selective growth hormone secretagogue (pentapeptide)",
    what: "A five-residue synthetic peptide — Aib-His-D-2-Nal-D-Phe-Lys-NH₂ — containing non-natural amino acids and a C-terminal amide. It is a ghrelin-receptor ligand, not a GHRH analog, so it works through a different pathway to CJC-1295.",
    mechanism: "Agonist at the growth hormone secretagogue receptor GHS-R1a. Its notable property in the literature is selectivity: it stimulates GH release with minimal reported effect on cortisol, prolactin or ACTH, unlike earlier secretagogues.",
    studied: [
      "GHS-R1a receptor selectivity and binding studies",
      "Comparative secretagogue specificity research",
      "Gastric motility models",
    ],
    handling: "Small, stable and readily soluble. The non-natural residues mean standard proteolysis assumptions do not apply.",
    origin: "Developed in the late 1990s during work on selective secretagogues.",
  },

  "cjc-ipa-blend": {
    class: "Two-peptide research blend",
    what: "A pre-measured vial containing CJC-1295 and Ipamorelin together — one GHRH-receptor ligand and one ghrelin-receptor ligand.",
    mechanism: "The two components act at different receptors on the same axis, which is why the combination is studied at all: GHRH-receptor and GHS-R1a stimulation are mechanistically independent inputs.",
    studied: [
      "Dual-pathway stimulation of the GH axis",
      "Comparative single- versus combined-ligand designs",
    ],
    handling: "Single-unit reconstitution; the components cannot be separated post-blend. Ratio stated on the lot certificate.",
    origin: "A combination format assembled for convenience, not a described natural entity.",
  },

  "melanotan-2": {
    class: "Cyclic α-MSH analog",
    what: "A cyclic lactam analog of alpha-melanocyte-stimulating hormone, shortened and conformationally constrained by a ring closure between Asp and Lys. The cyclization is what gives it stability the linear hormone lacks.",
    mechanism: "Non-selective melanocortin receptor agonist, active at MC1R, MC3R, MC4R and MC5R. Its lack of selectivity is exactly what makes it useful as a comparison compound and unsuitable as a probe for any single receptor.",
    studied: [
      "Melanogenesis and MC1R signalling in melanocyte culture",
      "Melanocortin receptor subtype selectivity comparisons",
      "Structure–activity work on cyclic peptide constraint",
    ],
    handling: "Cyclic structure gives good stability. Protect from light in solution.",
    origin: "Developed at the University of Arizona in the late 1980s from α-MSH structure–activity work.",
  },

  "pt-141": {
    class: "Melanocortin receptor agonist (bremelanotide)",
    what: "A metabolite of Melanotan II in which the C-terminal amide is replaced by a hydroxyl group. That single change shifts its receptor profile — it is a distinct molecule, not a variant dose of the same thing.",
    mechanism: "Agonist with reported preference for MC3R and MC4R over MC1R, meaning substantially less melanogenic activity than its parent compound. Central melanocortin pathways are the focus of published work.",
    studied: [
      "MC3R / MC4R receptor selectivity studies",
      "Central melanocortin signalling in animal models",
      "Comparative work against non-selective analogs",
    ],
    handling: "Store lyophilized at -20 °C; protect solutions from light.",
    origin: "Identified as an active metabolite during Melanotan II research.",
  },

  semax: {
    class: "ACTH(4-10) analog with Pro-Gly-Pro extension",
    what: "A seven-residue peptide: the ACTH(4-10) fragment (Met-Glu-His-Phe) extended with a C-terminal Pro-Gly-Pro tripeptide. The extension confers enzymatic stability without the hormonal activity of full ACTH — it has no corticotropic effect.",
    mechanism: "Reported in the literature to influence expression of brain-derived neurotrophic factor and nerve growth factor, and to modulate the enkephalin system. It is not a classical single-receptor agonist.",
    studied: [
      "BDNF and NGF expression in neural tissue models",
      "Neuroprotection and ischemia research",
      "Enkephalin-system and cognition models",
    ],
    handling: "Small and highly soluble in water. Methionine at position 1 is oxidation-sensitive — minimise exposure to air in solution.",
    origin: "Developed at the Institute of Molecular Genetics in Moscow in the 1980s.",
  },

  selank: {
    class: "Tuftsin analog with Pro-Gly-Pro extension",
    what: "A synthetic heptapeptide based on tuftsin — the immunomodulatory tetrapeptide Thr-Lys-Pro-Arg found in immunoglobulin G — extended with Pro-Gly-Pro for stability. Structurally the immune-system counterpart to Semax's neurotrophic design.",
    mechanism: "Reported to inhibit enkephalin degradation and to modulate GABAergic signalling and interleukin expression, giving it both neuro- and immuno-relevant profiles in published work.",
    studied: [
      "Anxiolytic and GABAergic pathway models",
      "Immunomodulation and cytokine expression assays",
      "Enkephalin degradation research",
    ],
    handling: "Highly water-soluble, strongly positively charged at neutral pH. Standard lyophilized storage.",
    origin: "Developed alongside Semax in Moscow, from tuftsin structure–activity work.",
  },

  epithalon: {
    class: "Synthetic tetrapeptide (Ala-Glu-Asp-Gly)",
    what: "A four-residue peptide — the shortest in this catalog — designed as a synthetic analog of epithalamin, a pineal-gland extract. Its brevity makes it unusually easy to synthesize and characterize.",
    mechanism: "Published work associates it with telomerase activity in cell culture and with regulation of melatonin and circadian signalling. Mechanistic detail remains less resolved than for receptor-targeted compounds, which is why it stays a research subject.",
    studied: [
      "Telomerase activity and cellular senescence assays",
      "Circadian rhythm and melatonin regulation",
      "Pineal peptide research",
    ],
    handling: "Very short and hydrophilic — dissolves immediately in water. Net charge is strongly negative at neutral pH.",
    origin: "Developed in St Petersburg from work on pineal extracts beginning in the 1980s.",
  },

  "mots-c": {
    class: "Mitochondrial-derived peptide",
    what: "A 16-residue peptide encoded not in nuclear DNA but within the mitochondrial 12S rRNA gene — one of a small class of peptides that overturned the assumption that mitochondrial DNA encodes only respiratory-chain components and RNA.",
    mechanism: "Reported to activate AMP-activated protein kinase and to influence folate–methionine cycle metabolism, positioning it as a signalling molecule that communicates mitochondrial state to the rest of the cell.",
    studied: [
      "AMPK activation and cellular energy sensing",
      "Insulin sensitivity in animal metabolic models",
      "Mitochondrial-nuclear signalling ('mitokine') research",
    ],
    handling: "Contains methionine and tryptophan — both oxidation-sensitive. Minimise air exposure and light in solution.",
    origin: "First reported in 2015, making it one of the most recently characterized peptides here.",
  },

  "nad-plus": {
    class: "Dinucleotide coenzyme — not a peptide",
    what: "Nicotinamide adenine dinucleotide. Included here because laboratories working on the same pathways order it alongside the peptides, but it is a coenzyme built from two nucleotides, not an amino-acid chain.",
    mechanism: "Central redox cofactor, cycling between oxidised NAD⁺ and reduced NADH across hundreds of enzymatic reactions. Separately, it is a consumed substrate for sirtuins, PARPs and CD38 — meaning those enzymes deplete it rather than merely using it catalytically.",
    studied: [
      "Sirtuin and PARP enzyme activity assays",
      "Cellular redox state and metabolic flux",
      "NAD⁺ salvage pathway research",
    ],
    handling: "Hygroscopic and less stable in solution than the peptides here — prepare fresh where the assay allows. Degrades under alkaline conditions.",
    origin: "Identified in 1906; the sirtuin-substrate role emerged much later, in the 2000s.",
  },

  tesamorelin: {
    class: "Stabilized GHRH(1-44) analog",
    what: "A full-length 44-residue growth-hormone-releasing hormone analog carrying a trans-3-hexenoyl group at the N-terminus. Unlike CJC-1295, which is a shortened 29-residue fragment, this retains the complete native GHRH sequence.",
    mechanism: "Agonist at the GHRH receptor. The N-terminal acyl modification blocks dipeptidyl peptidase-4 cleavage, the primary degradation route for native GHRH, without altering the receptor-binding sequence.",
    studied: [
      "GHRH receptor signalling with full-length ligand",
      "Visceral adipose tissue models",
      "IGF-1 axis and GH pulsatility research",
    ],
    handling: "The largest peptide in this catalog at 44 residues — reconstitute gently and allow full dissolution before use. Avoid freeze-thaw cycling.",
    origin: "Developed in the 1990s–2000s from GHRH stabilization research.",
  },
};
