import { MetabolicCycleIllustration } from '../types/ppt';

export const STANDARD_METABOLIC_CYCLES: Record<string, MetabolicCycleIllustration> = {
  // 1. KREBS / TCA CITRIC ACID CYCLE
  tca_cycle: {
    id: 'tca_cycle',
    name: 'Krebs Citric Acid Cycle (TCA Cycle)',
    category: 'carbohydrate',
    textbookSource: "Harper's Illustrated Biochemistry 32nd Ed (Chapter 16) / Vasudevan 10th Ed (Chapter 19)",
    cellularCompartments: 'Mitochondrial Matrix (Strictly Aerobic)',
    layout: 'circle',
    totalEnergyYield: '10 ATP equivalents per Acetyl-CoA (3 NADH, 1 FADH2, 1 GTP)',
    vivaQuestion: 'Why is TCA cycle called an amphibolic pathway? Answer: It functions in both catabolism (oxidation) and anabolism (supplies precursors like alpha-ketoglutarate, succinyl-CoA, oxaloacetate).',
    nodes: [
      { id: 'oaa', name: 'Oxaloacetate', carbonCount: '4C', color: '#0284C7', isKeyIntermediary: true },
      { id: 'citrate', name: 'Citrate', carbonCount: '6C', color: '#10B981' },
      { id: 'isocitrate', name: 'Isocitrate', carbonCount: '6C', color: '#059669' },
      { id: 'akg', name: 'α-Ketoglutarate', carbonCount: '5C', color: '#8B5CF6', isKeyIntermediary: true },
      { id: 'succinyl_coa', name: 'Succinyl-CoA', carbonCount: '4C', color: '#EC4899', isKeyIntermediary: true },
      { id: 'succinate', name: 'Succinate', carbonCount: '4C', color: '#F59E0B' },
      { id: 'fumarate', name: 'Fumarate', carbonCount: '4C', color: '#D97706' },
      { id: 'malate', name: 'L-Malate', carbonCount: '4C', color: '#06B6D4' }
    ],
    reactions: [
      {
        step: 1,
        fromId: 'oaa',
        toId: 'citrate',
        enzyme: 'Citrate Synthase',
        coenzyme: 'Acetyl-CoA (2C) + H2O → CoA-SH',
        isRateLimiting: false,
        energyChange: 'Exergonic condensation',
        inhibitedBy: ['ATP', 'NADH', 'Citrate', 'Succinyl-CoA']
      },
      {
        step: 2,
        fromId: 'citrate',
        toId: 'isocitrate',
        enzyme: 'Aconitase (Fe2+ dependent)',
        coenzyme: 'Reversible dehydration & hydration',
        isRateLimiting: false,
        clinicalDefect: 'Inhibited by Fluoroacetate (Rat Poison)'
      },
      {
        step: 3,
        fromId: 'isocitrate',
        toId: 'akg',
        enzyme: 'Isocitrate Dehydrogenase',
        coenzyme: 'NAD+ → NADH + H+ + CO2',
        isRateLimiting: true,
        energyChange: '+2.5 ATP (NADH)',
        stimulatedBy: ['ADP', 'Ca2+'],
        inhibitedBy: ['ATP', 'NADH']
      },
      {
        step: 4,
        fromId: 'akg',
        toId: 'succinyl_coa',
        enzyme: 'α-Ketoglutarate Dehydrogenase Complex',
        coenzyme: 'NAD+ + CoA-SH → NADH + CO2 (Requires TPP, Lipoate, FAD)',
        isRateLimiting: true,
        energyChange: '+2.5 ATP (NADH)',
        clinicalDefect: 'Inhibited by Arsenic (binds lipoic acid)'
      },
      {
        step: 5,
        fromId: 'succinyl_coa',
        toId: 'succinate',
        enzyme: 'Succinate Thiokinase (Succinyl-CoA Synthetase)',
        coenzyme: 'GDP + Pi → GTP + CoA-SH',
        isRateLimiting: false,
        energyChange: '+1.0 ATP (Substrate-Level Phosphorylation)'
      },
      {
        step: 6,
        fromId: 'succinate',
        toId: 'fumarate',
        enzyme: 'Succinate Dehydrogenase (Complex II of ETC)',
        coenzyme: 'FAD → FADH2 (Inner Mitochondrial Membrane)',
        isRateLimiting: false,
        energyChange: '+1.5 ATP (FADH2)',
        clinicalDefect: 'Competitively inhibited by Malonate'
      },
      {
        step: 7,
        fromId: 'fumarate',
        toId: 'malate',
        enzyme: 'Fumarase',
        coenzyme: 'H2O added across double bond',
        isRateLimiting: false
      },
      {
        step: 8,
        fromId: 'malate',
        toId: 'oaa',
        enzyme: 'Malate Dehydrogenase',
        coenzyme: 'NAD+ → NADH + H+',
        isRateLimiting: false,
        energyChange: '+2.5 ATP (NADH)'
      }
    ]
  },

  // 2. UREA CYCLE (KREBS-HENSELEIT ORNITHINE CYCLE)
  urea_cycle: {
    id: 'urea_cycle',
    name: 'Urea Cycle (Krebs-Henseleit Ornithine Cycle)',
    category: 'protein_amino_acid',
    textbookSource: "Vasudevan 10th Ed (Chapter 23) / Harper's Illustrated Biochemistry 32nd Ed (Chapter 28)",
    cellularCompartments: 'Compartmentalized: Steps 1-2 in Mitochondrial Matrix, Steps 3-5 in Cytosol',
    layout: 'dual_compartment',
    totalEnergyYield: 'Consumes 3 ATP (4 high-energy phosphate bonds: 2 in CPS-1 + 1 to AMP in ASS)',
    vivaQuestion: 'Which reactions of the Urea Cycle take place in the mitochondria? Answer: Synthesis of Carbamoyl Phosphate by CPS-1, and synthesis of Citrulline by Ornithine Transcarbamylase (OTC).',
    nodes: [
      { id: 'nh4', name: 'Free Ammonia (NH4+) + HCO3-', color: '#EF4444' },
      { id: 'cp', name: 'Carbamoyl Phosphate', carbonCount: '1C', color: '#DC2626', isKeyIntermediary: true },
      { id: 'ornithine', name: 'L-Ornithine', carbonCount: '5C', color: '#0284C7', isKeyIntermediary: true },
      { id: 'citrulline', name: 'L-Citrulline', carbonCount: '6C', color: '#10B981', isKeyIntermediary: true },
      { id: 'aspartate', name: 'Aspartate (2nd Nitrogen Donor)', color: '#6366F1' },
      { id: 'arg_succinate', name: 'Argininosuccinate', carbonCount: '10C', color: '#8B5CF6' },
      { id: 'arginine', name: 'L-Arginine', carbonCount: '6C', color: '#EC4899', isKeyIntermediary: true },
      { id: 'urea', name: 'UREA (Excreted in Urine)', carbonCount: '1C', color: '#059669', isKeyIntermediary: true }
    ],
    reactions: [
      {
        step: 1,
        fromId: 'nh4',
        toId: 'cp',
        enzyme: 'Carbamoyl Phosphate Synthetase-I (CPS-1)',
        coenzyme: '2 ATP → 2 ADP + Pi (Mitochondria)',
        isRateLimiting: true,
        stimulatedBy: ['N-Acetylglutamate (NAG) - Obligate allosteric activator'],
        clinicalDefect: 'Hyperammonemia Type I (Severe neonatal lethargy, coma)'
      },
      {
        step: 2,
        fromId: 'cp',
        toId: 'citrulline',
        enzyme: 'Ornithine Transcarbamylase (OTC)',
        coenzyme: 'Ornithine enters mitochondria via ORNT1 transporter',
        isRateLimiting: false,
        clinicalDefect: 'OTC Deficiency: X-linked recessive, Orotic aciduria, Hyperammonemia Type II'
      },
      {
        step: 3,
        fromId: 'citrulline',
        toId: 'arg_succinate',
        enzyme: 'Argininosuccinate Synthetase (ASS)',
        coenzyme: 'Aspartate + ATP → AMP + PPi (Cytosol)',
        isRateLimiting: false,
        clinicalDefect: 'Classic Citrullinemia (Type I)'
      },
      {
        step: 4,
        fromId: 'arg_succinate',
        toId: 'arginine',
        enzyme: 'Argininosuccinate Lyase (ASL)',
        coenzyme: 'Releases Fumarate (enters TCA cycle via Malate)',
        isRateLimiting: false,
        clinicalDefect: 'Argininosuccinic Aciduria'
      },
      {
        step: 5,
        fromId: 'arginine',
        toId: 'ornithine',
        enzyme: 'Arginase-1 (Requires Mn2+)',
        coenzyme: 'H2O added → Cleaves UREA (H2N-CO-NH2) + Regenerates Ornithine',
        isRateLimiting: false,
        clinicalDefect: 'Hyperargininemia (Spastic diplegia)'
      }
    ]
  },

  // 3. HEME BIOSYNTHESIS & PORPHYRIN CYCLE
  heme_synthesis: {
    id: 'heme_synthesis',
    name: 'Heme Biosynthesis & Porphyrin Cycle',
    category: 'heme_porphyrin',
    textbookSource: "Harper's Illustrated Biochemistry 32nd Ed (Chapter 31) / Vasudevan 10th Ed (Chapter 27)",
    cellularCompartments: 'Initial & Terminal steps in Mitochondria; Intermediate steps in Cytosol',
    layout: 'dual_compartment',
    totalEnergyYield: 'Irreversible Biosynthetic Pathway',
    vivaQuestion: 'Which enzymes of Heme synthesis are sensitive to Lead (Pb) poisoning? Answer: ALA Dehydratase (PBG Synthase) and Ferrochelatase (Heme Synthase).',
    nodes: [
      { id: 'gly_succ', name: 'Glycine + Succinyl-CoA', color: '#38BDF8' },
      { id: 'ala', name: 'δ-Aminolevulinic Acid (ALA)', carbonCount: '5C', color: '#EF4444', isKeyIntermediary: true },
      { id: 'pbg', name: 'Porphobilinogen (PBG - Monopyrrole)', color: '#F59E0B' },
      { id: 'hmb', name: 'Hydroxymethylbilane (Linear Tetrapyrrole)', color: '#10B981' },
      { id: 'uro3', name: 'Uroporphyrinogen III (Asymmetric Cyclic Ring)', color: '#8B5CF6', isKeyIntermediary: true },
      { id: 'copro3', name: 'Coproporphyrinogen III', color: '#EC4899' },
      { id: 'proto9', name: 'Protoporphyrin IX', color: '#D97706', isKeyIntermediary: true },
      { id: 'heme', name: 'HEME (Fe2+ Protoporphyrin IX)', color: '#DC2626', isKeyIntermediary: true }
    ],
    reactions: [
      {
        step: 1,
        fromId: 'gly_succ',
        toId: 'ala',
        enzyme: 'ALA Synthase (ALAS-1 in liver, ALAS-2 in erythroid marrow)',
        coenzyme: 'Pyridoxal Phosphate (Vitamin B6 / PLP) [Mitochondria]',
        isRateLimiting: true,
        inhibitedBy: ['Heme feedback repression', 'Glucose/Hematin infusion'],
        clinicalDefect: 'X-linked Sideroblastic Anemia (ALAS-2 defect)'
      },
      {
        step: 2,
        fromId: 'ala',
        toId: 'pbg',
        enzyme: 'ALA Dehydratase (PBG Synthase - Zinc dependent)',
        coenzyme: '2 molecules of ALA condense into 1 PBG [Cytosol]',
        isRateLimiting: false,
        clinicalDefect: 'Lead Poisoning target; ADP Porphyria'
      },
      {
        step: 3,
        fromId: 'pbg',
        toId: 'hmb',
        enzyme: 'PBG Deaminase (HMB Synthase)',
        coenzyme: 'Condensation of 4 PBG units [Cytosol]',
        isRateLimiting: false,
        clinicalDefect: 'Acute Intermittent Porphyria (AIP) - Severe colicky abdominal pain, neuropsychiatric psychosis, port-wine colored urine'
      },
      {
        step: 4,
        fromId: 'hmb',
        toId: 'uro3',
        enzyme: 'Uroporphyrinogen III Synthase',
        coenzyme: 'Inversion of Ring D into asymmetric isomer [Cytosol]',
        isRateLimiting: false,
        clinicalDefect: 'Congenital Erythropoietic Porphyria (Gunther Disease) - Extreme cutaneous mutilating photosensitivity, erythrodontia'
      },
      {
        step: 5,
        fromId: 'uro3',
        toId: 'copro3',
        enzyme: 'Uroporphyrinogen Decarboxylase (UROD)',
        coenzyme: 'Decarboxylation of 4 acetyl groups to methyl [Cytosol]',
        isRateLimiting: false,
        clinicalDefect: 'Porphyria Cutanea Tarda (PCT - Most common porphyria) - Blistering cutaneous lesions triggered by alcohol, iron overload, hepatitis C'
      },
      {
        step: 6,
        fromId: 'copro3',
        toId: 'proto9',
        enzyme: 'Coproporphyrinogen Oxidase & Protoporphyrinogen Oxidase',
        coenzyme: 'Enters Inner Mitochondrial Membrane',
        isRateLimiting: false,
        clinicalDefect: 'Hereditary Coproporphyria & Variegate Porphyria'
      },
      {
        step: 7,
        fromId: 'proto9',
        toId: 'heme',
        enzyme: 'Ferrochelatase (Heme Synthase)',
        coenzyme: 'Fe2+ (Ferrous iron) inserted into ring [Mitochondria]',
        isRateLimiting: false,
        clinicalDefect: 'Erythropoietic Protoporphyria (EPP); Inhibited by Lead (Pb) causing microcytic sideroblastic anemia'
      }
    ]
  },

  // 4. CORI CYCLE (GLUCOSE-LACTATE CYCLE)
  cori_cycle: {
    id: 'cori_cycle',
    name: 'Cori Cycle (Glucose-Lactate Inter-Organ Cycle)',
    category: 'carbohydrate',
    textbookSource: "Lehninger 8th Ed (Chapter 14) / Vasudevan 10th Ed (Chapter 18)",
    cellularCompartments: 'Inter-Organ: Contracting Skeletal Muscle ➔ Blood ➔ Liver Parenchyma ➔ Blood',
    layout: 'circle',
    totalEnergyYield: 'Net Cost: Consumes 4 ATP equivalents per glucose regenerated (2 produced in muscle, 6 consumed in liver)',
    vivaQuestion: 'What is the purpose of the Cori cycle? Answer: Prevents lethal lactic acidosis in strenuously contracting muscle and regenerates glucose to sustain anaerobic muscle activity.',
    nodes: [
      { id: 'blood_glucose', name: 'Blood Glucose (Delivered to Muscle)', color: '#0284C7', isKeyIntermediary: true },
      { id: 'muscle_glucose', name: 'Muscle Glucose & Glycogen', color: '#0369A1' },
      { id: 'muscle_pyruvate', name: 'Muscle Pyruvate (Glycolytic Product)', color: '#F59E0B' },
      { id: 'muscle_lactate', name: 'Muscle Lactate (Anaerobic Reduction)', color: '#EF4444', isKeyIntermediary: true },
      { id: 'blood_lactate', name: 'Blood Lactate (Transported via Circulation)', color: '#DC2626' },
      { id: 'liver_lactate', name: 'Hepatic Lactate (Oxidized to Pyruvate)', color: '#F97316' },
      { id: 'liver_pyruvate', name: 'Hepatic Pyruvate (Substrate for Gluconeogenesis)', color: '#EAB308' },
      { id: 'liver_glucose', name: 'Hepatic Glucose (Exported into Blood)', color: '#10B981', isKeyIntermediary: true }
    ],
    reactions: [
      {
        step: 1,
        fromId: 'blood_glucose',
        toId: 'muscle_pyruvate',
        enzyme: 'Muscle Glycolysis (Hexokinase, PFK-1, Pyruvate Kinase)',
        coenzyme: '+2 ATP generated per glucose',
        isRateLimiting: false
      },
      {
        step: 2,
        fromId: 'muscle_pyruvate',
        toId: 'muscle_lactate',
        enzyme: 'Muscle Lactate Dehydrogenase (LDH-5 / M4 isozyme)',
        coenzyme: 'NADH + H+ → NAD+ (Regenerates cytosolic NAD+ for continued glycolysis)',
        isRateLimiting: false
      },
      {
        step: 3,
        fromId: 'muscle_lactate',
        toId: 'liver_lactate',
        enzyme: 'Monocarboxylate Transporter (MCT-1) into circulation',
        coenzyme: 'Serum transport to liver',
        isRateLimiting: false
      },
      {
        step: 4,
        fromId: 'liver_lactate',
        toId: 'liver_pyruvate',
        enzyme: 'Hepatic Lactate Dehydrogenase (LDH-1 / H4 isozyme)',
        coenzyme: 'NAD+ → NADH + H+',
        isRateLimiting: false
      },
      {
        step: 5,
        fromId: 'liver_pyruvate',
        toId: 'liver_glucose',
        enzyme: 'Hepatic Gluconeogenesis (PC, PEPCK, FBPase-1, G6Pase)',
        coenzyme: 'Consumes 6 ATP/GTP equivalents',
        isRateLimiting: true,
        clinicalDefect: 'Impaired by acute ethanol ingestion (excess NADH drives pyruvate into lactate causing hypoglycemia)'
      }
    ]
  },

  // 5. KETOGENESIS CYCLE & ACETOACETATE SYNTHESIS
  ketogenesis_cycle: {
    id: 'ketogenesis_cycle',
    name: 'Hepatic Ketogenesis & Ketolysis Cycle',
    category: 'lipid',
    textbookSource: "Harper's Illustrated Biochemistry 32nd Ed (Chapter 22) / Vasudevan 10th Ed (Chapter 21)",
    cellularCompartments: 'Ketogenesis in Hepatic Mitochondrial Matrix; Ketolysis in Extrahepatic Tissues (Brain, Heart, Skeletal Muscle)',
    layout: 'dual_compartment',
    totalEnergyYield: 'Produces ~21.5 ATP per molecule of Acetoacetate oxidized extrahepatically',
    vivaQuestion: 'Why can the liver not utilize ketone bodies for its own energy? Answer: The liver lacks the enzyme Thiophorase (Succinyl-CoA:Acetoacetate CoA transferase).',
    nodes: [
      { id: 'acetyl_coa', name: '2 × Acetyl-CoA (From β-Oxidation)', color: '#0284C7' },
      { id: 'acetoacetyl_coa', name: 'Acetoacetyl-CoA', carbonCount: '4C', color: '#6366F1' },
      { id: 'hmg_coa', name: 'β-Hydroxy-β-Methylglutaryl-CoA (HMG-CoA)', carbonCount: '6C', color: '#EC4899', isKeyIntermediary: true },
      { id: 'acetoacetate', name: 'Acetoacetate (Primary Ketone Body)', carbonCount: '4C', color: '#EF4444', isKeyIntermediary: true },
      { id: 'bhb', name: 'β-Hydroxybutyrate (Major Circulating Ketone)', carbonCount: '4C', color: '#10B981', isKeyIntermediary: true },
      { id: 'acetone', name: 'Acetone (Spontaneous Decarboxylation - Exhaled Fruity Odor)', carbonCount: '3C', color: '#F59E0B' },
      { id: 'peripheral_energy', name: 'Extrahepatic Ketolysis (Brain & Heart ATP)', color: '#059669', isKeyIntermediary: true }
    ],
    reactions: [
      {
        step: 1,
        fromId: 'acetyl_coa',
        toId: 'acetoacetyl_coa',
        enzyme: 'Thiolase (Acetoacetyl-CoA Thiolase)',
        coenzyme: '2 Acetyl-CoA ⇌ Acetoacetyl-CoA + CoA-SH',
        isRateLimiting: false
      },
      {
        step: 2,
        fromId: 'acetoacetyl_coa',
        toId: 'hmg_coa',
        enzyme: 'Mitochondrial HMG-CoA Synthase',
        coenzyme: 'Adds 3rd Acetyl-CoA + H2O → CoA-SH released',
        isRateLimiting: true,
        clinicalDefect: 'Stimulated by high Glucagon:Insulin ratio, excess Free Fatty Acids (DKA)'
      },
      {
        step: 3,
        fromId: 'hmg_coa',
        toId: 'acetoacetate',
        enzyme: 'HMG-CoA Lyase',
        coenzyme: 'Cleaves Acetyl-CoA ➔ Free Acetoacetate released',
        isRateLimiting: false
      },
      {
        step: 4,
        fromId: 'acetoacetate',
        toId: 'bhb',
        enzyme: 'β-Hydroxybutyrate Dehydrogenase',
        coenzyme: 'NADH + H+ ⇌ NAD+ (Equilibrium governed by mitochondrial [NADH]/[NAD+] ratio)',
        isRateLimiting: false
      },
      {
        step: 5,
        fromId: 'acetoacetate',
        toId: 'peripheral_energy',
        enzyme: 'Thiophorase (Succinyl-CoA:Acetoacetate CoA Transferase)',
        coenzyme: 'Succinyl-CoA + Acetoacetate → Succinate + Acetoacetyl-CoA [Absent in liver]',
        isRateLimiting: false
      }
    ]
  },

  // 6. BETA-OXIDATION SPIRAL & CARNITINE SHUTTLE
  beta_oxidation: {
    id: 'beta_oxidation',
    name: 'Fatty Acid β-Oxidation Spiral & Carnitine Shuttle',
    category: 'lipid',
    textbookSource: "Vasudevan 10th Ed (Chapter 20) / Lehninger 8th Ed (Chapter 17)",
    cellularCompartments: 'Outer Mitochondrial Membrane (Activation) ➔ CPT-1 Shuttle ➔ Matrix Spiral',
    layout: 'circle',
    totalEnergyYield: 'Palmitate (16C) yields 106 Net ATP (7 FADH2, 7 NADH, 8 Acetyl-CoA minus 2 ATP activation)',
    vivaQuestion: 'What is the rate-limiting step of fatty acid beta-oxidation? Answer: Carnitine Palmitoyltransferase-1 (CPT-1), allosterically inhibited by Malonyl-CoA.',
    nodes: [
      { id: 'fatty_acyl_coa', name: 'Cytosolic Fatty Acyl-CoA', color: '#0284C7' },
      { id: 'acylcarnitine', name: 'Acylcarnitine (Crosses Inner Membrane via CACT)', color: '#8B5CF6', isKeyIntermediary: true },
      { id: 'matrix_acyl_coa', name: 'Mitochondrial Acyl-CoA', color: '#059669' },
      { id: 'trans_enoyl', name: 'trans-Δ2-Enoyl-CoA', color: '#10B981' },
      { id: 'hydroxyacyl', name: 'L-β-Hydroxyacyl-CoA', color: '#F59E0B' },
      { id: 'ketoacyl', name: 'β-Ketoacyl-CoA', color: '#EC4899' },
      { id: 'acetyl_short', name: 'Acetyl-CoA (2C) + Shortened Acyl-CoA (n-2)', color: '#DC2626', isKeyIntermediary: true }
    ],
    reactions: [
      {
        step: 1,
        fromId: 'fatty_acyl_coa',
        toId: 'acylcarnitine',
        enzyme: 'Carnitine Palmitoyltransferase-1 (CPT-1)',
        coenzyme: 'Attaches carnitine; inhibited by Malonyl-CoA',
        isRateLimiting: true,
        clinicalDefect: 'CPT-1 Deficiency: Severe hypoketotic hypoglycemia on fasting'
      },
      {
        step: 2,
        fromId: 'matrix_acyl_coa',
        toId: 'trans_enoyl',
        enzyme: 'Acyl-CoA Dehydrogenase (VLCAD, MCAD, SCAD)',
        coenzyme: 'FAD → FADH2 (+1.5 ATP via Electron Transferring Flavoprotein ETF)',
        isRateLimiting: false,
        clinicalDefect: 'MCAD Deficiency: Most common inborn error of beta-oxidation; presents with C8-C10 dicarboxylic aciduria and SIDS presentation'
      },
      {
        step: 3,
        fromId: 'trans_enoyl',
        toId: 'hydroxyacyl',
        enzyme: 'Enoyl-CoA Hydratase',
        coenzyme: 'H2O added across trans double bond',
        isRateLimiting: false
      },
      {
        step: 4,
        fromId: 'hydroxyacyl',
        toId: 'ketoacyl',
        enzyme: 'L-3-Hydroxyacyl-CoA Dehydrogenase',
        coenzyme: 'NAD+ → NADH + H+ (+2.5 ATP)',
        isRateLimiting: false
      },
      {
        step: 5,
        fromId: 'ketoacyl',
        toId: 'acetyl_short',
        enzyme: 'β-Ketothiolase',
        coenzyme: 'CoA-SH cleaves terminal 2-carbon Acetyl-CoA',
        isRateLimiting: false
      }
    ]
  },

  // 7. PURINE CATABOLISM & XANTHINE OXIDASE CYCLE
  purine_catabolism: {
    id: 'purine_catabolism',
    name: 'Purine Catabolism, Xanthine Oxidase & Gout Pathway',
    category: 'purine_nucleotide',
    textbookSource: "Vasudevan 10th Ed (Chapter 25) / Harper's Illustrated Biochemistry 32nd Ed (Chapter 33)",
    cellularCompartments: 'Cytosol (Hepatic Parenchyma)',
    layout: 'cascade',
    totalEnergyYield: 'Excretory Catabolic Pathway',
    vivaQuestion: 'What is the mechanism of Allopurinol in treating Gout? Answer: Allopurinol is a suicide inhibitor of Xanthine Oxidase; converted to alloxanthine which irreversibly binds the molybdenum active site.',
    nodes: [
      { id: 'amp_gmp', name: 'AMP & GMP (Purine Mononucleotides)', color: '#38BDF8' },
      { id: 'adenosine', name: 'Adenosine & Guanosine', color: '#818CF8' },
      { id: 'inosine', name: 'Inosine (Formed by ADA)', color: '#C084FC', isKeyIntermediary: true },
      { id: 'hypoxanthine', name: 'Hypoxanthine (Purine Base)', color: '#F472B6' },
      { id: 'xanthine', name: 'Xanthine', color: '#FB923C', isKeyIntermediary: true },
      { id: 'uric_acid', name: 'URIC ACID (Poorly Soluble End Product)', color: '#EF4444', isKeyIntermediary: true }
    ],
    reactions: [
      {
        step: 1,
        fromId: 'adenosine',
        toId: 'inosine',
        enzyme: 'Adenosine Deaminase (ADA)',
        coenzyme: 'H2O → NH3 released',
        isRateLimiting: false,
        clinicalDefect: 'ADA Deficiency: Causes Severe Combined Immunodeficiency (SCID) due to dATP toxic accumulation in T & B lymphocytes'
      },
      {
        step: 2,
        fromId: 'inosine',
        toId: 'hypoxanthine',
        enzyme: 'Purine Nucleoside Phosphorylase (PNP)',
        coenzyme: 'Pi → Ribose-1-Phosphate released',
        isRateLimiting: false
      },
      {
        step: 3,
        fromId: 'hypoxanthine',
        toId: 'xanthine',
        enzyme: 'Xanthine Oxidase (Molybdenum & Fe-S cluster enzyme)',
        coenzyme: 'O2 + H2O → H2O2',
        isRateLimiting: true,
        inhibitedBy: ['Allopurinol', 'Febuxostat']
      },
      {
        step: 4,
        fromId: 'xanthine',
        toId: 'uric_acid',
        enzyme: 'Xanthine Oxidase',
        coenzyme: 'O2 + H2O → H2O2 + Uric Acid',
        isRateLimiting: true,
        clinicalDefect: 'Hyperuricemia & Gout: Monosodium urate crystals precipitate in joints (Podagra) showing needle-shaped negatively birefringent crystals under polarized light'
      }
    ]
  }
};
