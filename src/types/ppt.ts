export type PresentationTheme = 'navy' | 'emerald' | 'crimson' | 'violet' | 'amber';

export interface ThemeColors {
  id: PresentationTheme;
  name: string;
  primary: string;       // Hex for PPTX & Tailwind
  secondary: string;     // Accent
  accent: string;        // Highlight
  bgLight: string;       // Slide background
  bgCard: string;        // Card background
  textDark: string;      // Heading text
  textMuted: string;     // Body text
  border: string;        // Borders
  badgeBg: string;       // Badges
  badgeText: string;
}

export type SlideCategory =
  | 'title'
  | 'objectives'
  | 'competency'
  | 'clinical_relevance'
  | 'normal_physiology'
  | 'compartmentalization'
  | 'molecular_pathway'
  | 'rate_limiting'
  | 'coenzymes_cofactors'
  | 'regulation_allosteric'
  | 'regulation_hormonal'
  | 'metabolic_crosstalk'
  | 'inborn_errors'
  | 'molecular_pathogenesis'
  | 'biochemical_consequences'
  | 'clinical_manifestations'
  | 'investigations'
  | 'biomarkers'
  | 'treatment_principles'
  | 'pharmacology'
  | 'dietary_nutrition'
  | 'clinical_case'
  | 'horizontal_integration'
  | 'blackboard_cue'
  | 'ospe_viva'
  | 'mcqs'
  | 'summary'
  | 'references';

export interface PathwayStep {
  stepNumber: number;
  from: string;
  to: string;
  enzyme: string;
  coenzyme?: string;
  cellularLocation?: string;
  isRateLimiting?: boolean;
  inhibitedBy?: string[];
  stimulatedBy?: string[];
  clinicalDefect?: string;
}

export interface BiochemicalPathwayData {
  title: string;
  cellularLocation: string; // e.g. "Mitochondrial Matrix" or "Cytosol"
  keyMolecules: string[];
  steps: PathwayStep[];
  energyYield?: string;
  clinicalBlockAtStep?: number;
  defectiveEnzyme?: string;
  biomarkerAccumulated?: string;
  pharmacologicalTarget?: string;
}

export interface CaseStudyData {
  patientAge: string;
  gender: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  vitals: { [key: string]: string };
  labFindings: { test: string; patientValue: string; normalValue: string; inference: string }[];
  diagnosis: string;
  differentialDiagnosis: string[];
  management: string[];
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  highYieldFact: string;
}

export interface MetabolicCycleNode {
  id: string;
  name: string;
  carbonCount?: string;
  isKeyIntermediary?: boolean;
  color?: string;
}

export interface MetabolicCycleReaction {
  step: number;
  fromId: string;
  toId: string;
  enzyme: string;
  coenzyme?: string;
  isRateLimiting?: boolean;
  energyChange?: string; // e.g. "GTP formed", "NADH generated"
  clinicalDefect?: string;
  inhibitedBy?: string[];
  stimulatedBy?: string[];
}

export interface MetabolicCycleIllustration {
  id: string;
  name: string;
  category: 'carbohydrate' | 'lipid' | 'protein_amino_acid' | 'heme_porphyrin' | 'purine_nucleotide';
  textbookSource: string;
  cellularCompartments: string;
  layout: 'circle' | 'dual_compartment' | 'cascade';
  nodes: MetabolicCycleNode[];
  reactions: MetabolicCycleReaction[];
  totalEnergyYield?: string;
  vivaQuestion?: string;
}

export interface Slide {
  id: string;
  slideNumber: number;
  category: SlideCategory;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  keyPoints: string[];
  clinicalPearl?: string;
  examAlert?: string;
  pathwayData?: BiochemicalPathwayData;
  cycleIllustration?: MetabolicCycleIllustration;
  caseStudy?: CaseStudyData;
  mcqs?: MCQQuestion[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  speakerNotes: string;
  haryanviSpeech?: string; // Loud authentic Haryanvi Hindi professor lecture
  blackboardCue?: string;
  tags?: string[];
  nmcCompetencyCode?: string;
}

export interface NMCCompetency {
  code: string;           // e.g. "BI3.1"
  topic: string;          // e.g. "Carbohydrate Metabolism"
  subTopic: string;       // e.g. "Glycolysis and Regulation"
  description: string;    // NMC CBME competency text
  domain: 'Knowledge' | 'Skills';
  level: 'K' | 'KH' | 'SH' | 'P'; // Knows, Knows How, Shows How, Performs
  core: boolean;
  teachingHours: string;
  suggestedMethods: string[];
  integratedWith: string[]; // e.g. ["General Medicine", "Pediatrics"]
  defaultLectureTitle: string;
  highYieldDiseases: string[];
}

export interface PresentationData {
  id: string;
  title: string;
  topic: string;
  nmcCompetencyCode: string;
  nmcCompetencyDescription: string;
  authorFaculty: string;
  institution: string;
  phase: string;           // e.g. "MBBS Phase 1 (1st Professional)"
  theme: PresentationTheme;
  lectureDurationMin: number;
  totalSlides: number;
  slides: Slide[];
  createdAt: string;
  disclaimer: string;
  verifiedReferences: string[];
}
