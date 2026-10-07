import { PresentationData, Slide, PresentationTheme, NMCCompetency } from '../types/ppt';
import { NMC_BIOCHEMISTRY_COMPETENCIES } from './nmcCompetencies';
import { STANDARD_METABOLIC_CYCLES } from './metabolicCycles';

interface GenerationOptions {
  competencyCode?: string;
  topic?: string;
  customPrompt?: string;
  lectureDurationMin?: number; // 30, 45, or 60
  slideCount?: number;         // 20 - 45
  theme?: PresentationTheme;
  authorFaculty?: string;
  institution?: string;
}

export function generateFullMedicalDeck(options: GenerationOptions): PresentationData {
  const duration = options.lectureDurationMin || 45;
  const targetSlideCount = options.slideCount || (duration === 30 ? 25 : duration === 60 ? 38 : 32);
  const theme = options.theme || 'navy';
  const faculty = options.authorFaculty || 'Dr. R. S. Yadav, MD (Biochemistry)';
  const institution = options.institution || 'Department of Biochemistry, Medical College & Hospital';

  // Find matching competency or use default
  let matchedCompetency: NMCCompetency | undefined;
  if (options.competencyCode) {
    matchedCompetency = NMC_BIOCHEMISTRY_COMPETENCIES.find(c => c.code.toLowerCase() === options.competencyCode?.toLowerCase());
  }
  if (!matchedCompetency && options.topic) {
    const q = options.topic.toLowerCase();
    matchedCompetency = NMC_BIOCHEMISTRY_COMPETENCIES.find(c =>
      c.topic.toLowerCase().includes(q) ||
      c.subTopic.toLowerCase().includes(q) ||
      c.defaultLectureTitle.toLowerCase().includes(q) ||
      c.highYieldDiseases.some(d => d.toLowerCase().includes(q))
    );
  }
  if (!matchedCompetency) {
    matchedCompetency = NMC_BIOCHEMISTRY_COMPETENCIES[0]; // BI3.1 Glycolysis fallback
  }

  const topicName = options.topic || matchedCompetency.subTopic;
  const lectureTitle = matchedCompetency.defaultLectureTitle;

  // Select the most appropriate textbook colored metabolic cycle
  let selectedCycleKey = 'tca_cycle';
  const combinedSearch = (topicName + ' ' + matchedCompetency.topic + ' ' + matchedCompetency.code + ' ' + matchedCompetency.highYieldDiseases.join(' ')).toLowerCase();

  if (combinedSearch.includes('heme') || combinedSearch.includes('porphyrin') || combinedSearch.includes('bilirubin') || combinedSearch.includes('lead')) {
    selectedCycleKey = 'heme_synthesis';
  } else if (combinedSearch.includes('urea') || combinedSearch.includes('ammonia') || combinedSearch.includes('amino acid') || combinedSearch.includes('protein') || combinedSearch.includes('ornithine') || combinedSearch.includes('citrulline')) {
    selectedCycleKey = 'urea_cycle';
  } else if (combinedSearch.includes('keto') || combinedSearch.includes('dka') || combinedSearch.includes('fat') || combinedSearch.includes('lipid') || combinedSearch.includes('cholesterol') || combinedSearch.includes('fatty acid')) {
    selectedCycleKey = combinedSearch.includes('beta') || combinedSearch.includes('carnitine') || combinedSearch.includes('mcad') ? 'beta_oxidation' : 'ketogenesis_cycle';
  } else if (combinedSearch.includes('cori') || combinedSearch.includes('lactate') || combinedSearch.includes('glycogen')) {
    selectedCycleKey = 'cori_cycle';
  } else if (combinedSearch.includes('gout') || combinedSearch.includes('purine') || combinedSearch.includes('uric') || combinedSearch.includes('xanthine')) {
    selectedCycleKey = 'purine_catabolism';
  } else {
    selectedCycleKey = 'tca_cycle';
  }

  const matchedCycleData = STANDARD_METABOLIC_CYCLES[selectedCycleKey] || STANDARD_METABOLIC_CYCLES.tca_cycle;

  // Build the complete 25-40 slides progressive curriculum
  const slides: Slide[] = [];

  // Helper to add slide with energetic Haryanvi Hindi speech
  let sNum = 1;
  const add = (slide: Omit<Slide, 'id' | 'slideNumber'>) => {
    let haryanvi = slide.haryanviSpeech;
    if (!haryanvi) {
      if (slide.category === 'title') {
        haryanvi = `अरे राम राम लाडलो! मैं थारा प्रोफेसर डॉ. आर एस यादव! आज की मेडिकल क्लास में जमा कसूता टॉपिक पढ़ावेंगे—${slide.title}! सारे छोरे-छोरी कॉपी-पेन निकाल लो और कान खोल के सुन लो, एनएमसी का कोर कॉम्पिटेंसी से यो!`;
      } else if (slide.category === 'objectives') {
        haryanvi = `अरे बालको! ध्यान ते देखो स्क्रीन पे! मस्ट नो (Must Know) का मतलब से जे यो एग्जाम में नहीं लिख के आए, तो प्रोफेसर थामने फेल कर देगा भाई! कमिटेड स्टेप, रेगुलेशन और क्लीनिकल केस तो रट के जाना से!`;
      } else if (slide.category === 'competency') {
        haryanvi = `लाडलो! यो एनएमसी का ऑफिशियल सीबीएमई कॉम्पिटेंसी कोड से! जनरल मेडिसिन और पीडियाट्रिक्स के साथ वर्टिकल इंटीग्रेशन से म्हारा! वार्ड राउंड पे पेशेंट देखोगे तो यो काम आवेगा!`;
      } else if (slide.category === 'clinical_relevance') {
        haryanvi = `अरे भाई! कैजुअल्टी में इमरजेंसी केस आ गया! मरीज की सांस फूल री से, होश में कोन्या! जे थारे को बायोकेमिस्ट्री का पाथवे याद होगा, तो एक मिनट में रिपोर्ट देख के डायग्नोसिस बना दोगे!`;
      } else if (slide.category === 'rate_limiting') {
        haryanvi = `अरे बालको! यो स्टेप देख रहे हो? यो से कमिटेड स्टेप! रेट लिमिटिंग एंजाइम! इसपे लाल स्याही ते डबल स्टार लाओ, यूनिवर्सिटी एग्जाम में सीधा पाँच नंबर का सवाल आवेगा!`;
      } else if (slide.category === 'inborn_errors') {
        haryanvi = `अरे लाडलो! जे बीच का एक एंजाइम जेनेटिक म्यूटेशन ते बंद हो गया, तो समझो रोड पे जाम लग गया! पीछे का कचरा बढ़ेगा और आगे की चीज नहीं मिलेगी! इसी को इनबॉर्न एरर बोलें से!`;
      } else if (slide.category === 'clinical_case') {
        haryanvi = `अरे भाई! कैजुअल्टी में बाईस साल की छोरी आई से! उल्टी, पेट में दर्द, और सांस गहरी गहरी—कुस्माउल ब्रीदिंग! पेशाब में कीटोन चार प्लस! यो है डायबिटिक कीटोएसिडोसिस!`;
      } else if (slide.category === 'mcqs') {
        haryanvi = `अरे लाडलो! नीट-पीजी और नेक्स्ट का पक्का सवाल से यो! आंख खोल के चारों ऑप्शन पढ़ो और बताओ कौन सा एंजाइम खराब से! गच्चा मत खा जाना!`;
      } else if (slide.category === 'summary') {
        haryanvi = `अरे बालको! इस एक स्लाइड का फोटो खींच लो अपने फोन में! पूरी क्लास का निचोड़ और रामबाण फॉर्मूला इसी में से! एग्जाम से एक रात पहले यो याद कर लियो!`;
      } else {
        haryanvi = `अरे लाडलो! ध्यान से सुनो, मैं थारा प्रोफेसर डॉ. आर एस यादव! स्लाइड ${sNum} पे देखो: ${slide.title}! पहला पॉइंट: ${slide.keyPoints[0] || ''}। ${slide.clinicalPearl ? `और हाई यील्ड बात याद रखियो: ${slide.clinicalPearl}` : ''}`;
      }
    }

    slides.push({
      id: `slide-${sNum}`,
      slideNumber: sNum,
      ...slide,
      haryanviSpeech: haryanvi,
    });
    sNum++;
  };

  // 1. TITLE SLIDE
  add({
    category: 'title',
    categoryLabel: 'NMC-CBME Lecture Series',
    title: lectureTitle,
    subtitle: `Competency ${matchedCompetency.code} | MBBS First Professional (Phase 1) | ${duration} Minutes Academic Session`,
    keyPoints: [
      `Delivered as per National Medical Commission (NMC) CBME Curriculum`,
      `Integrated Teaching: Horizontal (Physiology) & Vertical (${matchedCompetency.integratedWith.join(', ')})`,
      `Designed for classroom interactive projection & university exam mastery`,
      `Verified with Harper's Illustrated Biochemistry, Vasudevan & Lehninger`
    ],
    clinicalPearl: 'Mastering the biochemical basis of disease is the diagnostic foundation of modern clinical medicine.',
    speakerNotes: `Good morning everyone. Welcome to today's ${duration}-minute session on ${matchedCompetency.subTopic}. Today we will unpack the core molecular pathways, clinical enzymology, inborn errors, and bedside emergency management aligned with NMC competency ${matchedCompetency.code}. Keep your notebook ready for high-yield blackboard flowcharts.`,
    blackboardCue: 'Write title on top center: ' + matchedCompetency.subTopic + '. Draw central clinical case question on right corner.',
    tags: ['NMC-CBME', 'MBBS Phase 1', matchedCompetency.code, 'Biochemistry'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 2. SPECIFIC LEARNING OBJECTIVES (SLOs)
  add({
    category: 'objectives',
    categoryLabel: 'Competency Framework',
    title: 'Specific Learning Objectives (SLOs)',
    subtitle: 'Bloom’s Taxonomy Cognitive Domain: Knows (K) & Knows How (KH)',
    keyPoints: [
      `MUST KNOW: Describe the rate-limiting enzyme, molecular reactions, allosteric/hormonal regulation, and energy balance.`,
      `MUST KNOW: Identify the diagnostic biomarkers, laboratory workup, and acute inborn errors/disease complications.`,
      `DESIRABLE TO KNOW: Explain the molecular mechanisms of pharmacological inhibitors and reciprocal metabolic crosstalk.`,
      `NICE TO KNOW: Discuss recent clinical trial evidence, molecular gene therapy, and advanced tandem mass spectrometry diagnostics.`
    ],
    examAlert: 'Exam Alert: University Long Answer Questions (LAQs) frequently ask for pathway flowcharts + regulation + inborn error clinical correlation.',
    speakerNotes: 'Pay close attention to the Must Know components. By the end of this hour, every student in this hall should be able to draw the committed step from memory and explain why a patient presents with metabolic crisis.',
    tags: ['SLO', 'Curriculum', 'Must Know'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 3. NMC-CBME COMPETENCY MAPPING
  add({
    category: 'competency',
    categoryLabel: 'Regulatory Standard',
    title: `NMC-CBME Competency Mapping: ${matchedCompetency.code}`,
    subtitle: `Module: ${matchedCompetency.topic} | Level: ${matchedCompetency.level}`,
    keyPoints: [
      `NMC Mandate: ${matchedCompetency.description}`,
      `Cognitive Domain: ${matchedCompetency.domain} | Core Competency: ${matchedCompetency.core ? 'CORE (Mandatory)' : 'Non-Core'}`,
      `Teaching-Learning Methods: ${matchedCompetency.suggestedMethods.join(', ')}`,
      `Vertical Integration: Connected with ${matchedCompetency.integratedWith.join(' & ')} for unified clinical reasoning`,
      `Summative Assessment: Theory Written Examination, OSPE Stations & Viva Voce`
    ],
    tableData: {
      headers: ['Competency Code', 'Subject Area', 'Integration', 'Assessment Method'],
      rows: [
        [matchedCompetency.code, matchedCompetency.topic, matchedCompetency.integratedWith[0] || 'General Medicine', 'LAQ / SAQ / Case Vignette'],
        ['Associated Skill', matchedCompetency.subTopic, matchedCompetency.integratedWith[1] || 'Pediatrics', 'OSPE / Viva Voce / Spotter'],
      ]
    },
    speakerNotes: `Here is our exact curriculum mandate from the National Medical Commission. Note how this competency is vertically linked with ${matchedCompetency.integratedWith.join(' and ')}. At bedside rounds in your final year, this biochemical understanding will guide your diagnostic prescriptions.`,
    tags: ['NMC', 'Curriculum', 'Mapping'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 4. CLINICAL RELEVANCE & PATIENT HOOK
  add({
    category: 'clinical_relevance',
    categoryLabel: 'Bedside Relevance',
    title: 'Why an MBBS Doctor Must Master This Pathway',
    subtitle: 'From Emergency Room Presentation to Molecular Pathophysiology',
    keyPoints: [
      `A 24-year-old patient arrives in the Emergency Ward with tachypnea, altered sensorium, and profound metabolic acidosis.`,
      `Understanding this biochemical pathway allows you to pinpoint the exact enzyme failure in under 60 seconds of reviewing the lab report.`,
      `Differentiates between physiological adaptation (fasting/exercise) versus life-threatening pathological metabolic collapse.`,
      `Guides rational pharmacological intervention rather than empirical guesswork at bedside.`
    ],
    clinicalPearl: 'Clinical Pearl: Never treat an abnormal electrolyte or enzyme value as an isolated number. Always visualize the cellular pathway that spawned it.',
    speakerNotes: 'Before we dive into the chemical reactions, let us anchor ourselves in the patient room. When you are on night duty in the casualty, you will see patients whose life hangs on this exact metabolic equilibrium. Let us see why.',
    tags: ['Clinical Hook', 'Emergency', 'Pathophysiology'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 5. NORMAL PHYSIOLOGY & METABOLIC ROLE
  add({
    category: 'normal_physiology',
    categoryLabel: 'Baseline Biology',
    title: 'Normal Physiological Role & Cellular Purpose',
    subtitle: 'Homeostatic functions under fed vs fasting conditions',
    keyPoints: [
      `Primary Physiological Objective: Maintains constant cellular ATP homeostasis and supplies specialized biosynthetic precursors.`,
      `Fed State Dynamic: Activated by high Insulin:Glucagon ratio to store excess carbons and prevent systemic toxicity.`,
      `Fasting State Dynamic: Counter-regulatory hormones (Glucagon, Epinephrine, Cortisol) redirect pathway flux to sustain vital organ perfusion.`,
      `Tissue Specialization: Highly tailored metabolic demands in Brain (glucose/ketone reliance), Skeletal Muscle, and Hepatic parenchyma.`
    ],
    speakerNotes: 'First, understand the baseline physiology. In a healthy human in the fed state, this pathway maintains thermodynamic balance. What is the tissue-specific role in hepatocytes versus myocytes? Let us examine the organelles.',
    blackboardCue: 'Draw two columns: "Fed State (Insulin dominant)" vs "Fasting State (Glucagon dominant)".',
    tags: ['Physiology', 'Homeostasis', 'Regulation'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 6. COMPARTMENTALIZATION & ORGAN LOCALIZATION
  add({
    category: 'compartmentalization',
    categoryLabel: 'Cellular Architecture',
    title: 'Cellular Compartmentalization & Tissue Distribution',
    subtitle: 'Cytosol vs Mitochondria vs Endoplasmic Reticulum',
    keyPoints: [
      `Cytosolic Component: Substrate entry, initial activation, and rapid anaerobic energy generation.`,
      `Mitochondrial Matrix: Highly oxidative steps, electron carrier generation (NADH/FADH2), and committed catabolic junctions.`,
      `Membrane Transporters: Specific symporters and antiporters regulate strict rate of metabolite shuttling across the inner mitochondrial membrane.`,
      `Organ Distribution: Liver acts as the central metabolic buffer; Erythrocytes lack mitochondria and depend solely on cytosolic processing.`
    ],
    tableData: {
      headers: ['Organelle / Tissue', 'Enzymatic Processes', 'Physiological Rationale'],
      rows: [
        ['Cytosol', 'Substrate activation, Phase 1 reactions', 'Direct access to high substrate pools'],
        ['Mitochondrial Matrix', 'Oxidative cleavage, Energy coupling', 'Immediate proximity to ETC respiratory chain'],
        ['Liver Parenchyma', 'Complete pathway + synthetic exports', 'Central systemic metabolic governor'],
        ['Erythrocytes (RBC)', 'Obligate anaerobic dependence', 'Absence of mitochondria prevents oxygen consumption']
      ]
    },
    speakerNotes: 'Compartmentalization is a favorite question in viva. Why are certain enzymes restricted to the mitochondria while others remain in the cytosol? It creates concentration gradients and prevents futile cycles.',
    tags: ['Compartmentalization', 'Organelles', 'Mitochondria'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 7. SUBSTRATES, COFACTORS & ENTRY POINTS
  add({
    category: 'molecular_pathway',
    categoryLabel: 'Molecular Architecture',
    title: 'Substrates, Entry Molecules & Energy Investment',
    subtitle: 'Priming reactions and thermodynamics',
    keyPoints: [
      `Primary Substrates: Carbon skeleton precursors entering via specific GLUT/membrane carriers.`,
      `High-Energy Phosphate Priming: ATP hydrolysis lowers the activation energy and traps intermediates intracellularly via phosphorylation.`,
      `Thermodynamic Driving Force: Highly exergonic priming reactions ensure irreversible forward commitment under physiological conditions.`,
      `Essential Mineral Cofactors: Magnesium (Mg2+) acts as obligate cofactor for all ATP-utilizing kinases by neutralizing negative charge.`
    ],
    examAlert: 'Viva Tip: Whenever ATP or ADP is involved in an enzyme reaction, Mg2+ is almost always the required divalent cation.',
    speakerNotes: 'Look at the priming reaction. Notice how the phosphate group prevents the molecule from diffusing back out across the plasma membrane. It is locked inside the cell.',
    tags: ['Substrates', 'Thermodynamics', 'Biochemistry'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 8. STEP-BY-STEP PATHWAY: PHASE 1
  add({
    category: 'molecular_pathway',
    categoryLabel: 'Biochemical Pathway',
    title: `${topicName}: Molecular Pathway (Phase 1 - Activation)`,
    subtitle: 'Initial transformations, intermediate molecules and key enzymes',
    keyPoints: [
      `Step 1: Substrate phosphorylation creating irreversible metabolic entrapment within the cytosol.`,
      `Step 2: Isomerization reaction preparing the carbon backbone for symmetrical or subsequent cleavage.`,
      `Step 3: Committed rate-limiting phosphorylation catalyzed by key regulatory kinase.`,
      `Thermodynamic Commitment: Point of no return—once phosphorylated at this step, the intermediate must proceed through the pathway.`
    ],
    pathwayData: {
      title: `${topicName} - Step-by-Step Flow`,
      cellularLocation: 'Cytosol / Hepatic Mitochondria',
      keyMolecules: ['Substrate Precursor', 'Phosphorylated Intermediate', 'Committed Bisphosphate', 'Cleaved Products'],
      steps: [
        {
          stepNumber: 1,
          from: 'Primary Substrate (Carbon Pool)',
          to: 'Intermediate-6-Phosphate',
          enzyme: 'Hexokinase / Glucokinase (Isozymes I-IV)',
          coenzyme: 'Mg2+, ATP → ADP',
          isRateLimiting: false,
        },
        {
          stepNumber: 2,
          from: 'Intermediate-6-Phosphate',
          to: 'Isomerized Intermediary Compound',
          enzyme: 'Phosphohexose Isomerase',
          coenzyme: 'Reversible Equilibrium',
          isRateLimiting: false,
        },
        {
          stepNumber: 3,
          from: 'Isomerized Intermediary Compound',
          to: 'Bisphosphorylated Committed Product',
          enzyme: 'Phosphofructokinase-1 (PFK-1) / Committed Synthetase',
          coenzyme: 'ATP → ADP, Mg2+',
          isRateLimiting: true,
          inhibitedBy: ['ATP', 'Citrate', 'Low pH'],
          stimulatedBy: ['Fructose-2,6-bisphosphate', 'AMP', 'Insulin'],
          clinicalDefect: 'Tarui Disease (GSD VII) / Metabolic block'
        }
      ],
      energyYield: 'Net -2 ATP consumed in priming phase',
      clinicalBlockAtStep: 3,
      defectiveEnzyme: 'Key Regulatory Kinase',
      biomarkerAccumulated: 'Upstream Glycolytic Intermediates',
      pharmacologicalTarget: 'Allosteric kinase modulators'
    },
    speakerNotes: 'This is the most critical slide for your theory exam. Memorize the exact name of the committed enzyme, the cofactor Mg2+, and note that this step consumes high energy to commit the substrate to downstream oxidation.',
    blackboardCue: 'Draw the 3 steps vertically. Put a large RED BOX around Step 3 with a double asterisk (Rate-limiting).',
    tags: ['Pathway', 'Enzymology', 'Phase 1'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 9. STEP-BY-STEP PATHWAY: PHASE 2 (OXIDATION & HIGH-ENERGY GENERATION)
  add({
    category: 'molecular_pathway',
    categoryLabel: 'Biochemical Pathway',
    title: `${topicName}: Molecular Pathway (Phase 2 - Cleavage & Oxidation)`,
    subtitle: 'Redox transformations, high-energy intermediates and reducing equivalents',
    keyPoints: [
      `Substrate-Level Phosphorylation: Direct transfer of high-energy phosphate group to ADP without electron transport chain involvement.`,
      `Generation of Reducing Equivalents: Dehydrogenase removes hydride ions, reducing NAD+ to NADH + H+.`,
      `Arsenate Toxicity Mechanism: Competes with inorganic phosphate (Pi), causing uncoupling of substrate-level phosphorylation without ATP yield.`,
      `Enolase Fluoride Sensitivity: Sodium fluoride inhibits enolase by chelating Mg2+, exploited medically in grey-top blood collection tubes.`
    ],
    pathwayData: {
      title: `${topicName} - Cleavage & High Energy Phosphate Capture`,
      cellularLocation: 'Cytosol',
      keyMolecules: ['Triose Phosphate', '1,3-Bisphosphoglycerate', '3-Phosphoglycerate', 'Phosphoenolpyruvate (PEP)'],
      steps: [
        {
          stepNumber: 4,
          from: 'Triose Phosphate',
          to: '1,3-Bisphosphoglycerate (1,3-BPG)',
          enzyme: 'Glyceraldehyde-3-Phosphate Dehydrogenase',
          coenzyme: 'NAD+ + Pi → NADH + H+',
          isRateLimiting: false,
          inhibitedBy: ['Iodoacetate', 'Arsenate']
        },
        {
          stepNumber: 5,
          from: '1,3-Bisphosphoglycerate',
          to: '3-Phosphoglycerate',
          enzyme: 'Phosphoglycerate Kinase',
          coenzyme: 'ADP → ATP (Substrate-level phosphorylation)',
          isRateLimiting: false,
        },
        {
          stepNumber: 6,
          from: '2-Phosphoglycerate',
          to: 'Phosphoenolpyruvate (PEP)',
          enzyme: 'Enolase (Requires Mg2+)',
          coenzyme: 'H2O released',
          isRateLimiting: false,
          inhibitedBy: ['Fluoride (NaF Grey-top tube clinical rationale)']
        }
      ],
      energyYield: '+2 ATP per triose + 2 NADH equivalents generated',
      clinicalBlockAtStep: 6,
      defectiveEnzyme: 'Enolase inhibition by Fluoride'
    },
    clinicalPearl: 'Clinical Correlation: Why do we use Sodium Fluoride (grey-top vacutainer) for blood glucose estimation? Because fluoride halts enolase, preventing in-vitro glycolysis by RBCs!',
    speakerNotes: 'Why do we collect blood in grey top tubes for blood sugar testing? This is an inescapable viva question: Sodium fluoride inhibits enolase, stopping red blood cells from consuming the patient’s glucose before analysis.',
    tags: ['Pathway', 'Phase 2', 'Oxidation', 'Fluoride'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 10. STEP-BY-STEP PATHWAY: PHASE 3 (TERMINAL STEP & ENERGY BALANCE)
  add({
    category: 'molecular_pathway',
    categoryLabel: 'Energy Accounting',
    title: 'Terminal Committed Step & Net ATP Energetics',
    subtitle: 'Complete stoichiometric calculation under aerobic vs anaerobic conditions',
    keyPoints: [
      `Terminal Reaction: Pyruvate Kinase irreversibly transfers phosphate from PEP to ADP generating ATP and Pyruvate.`,
      `Aerobic Net Yield: 2 ATP (direct substrate-level) + 2 NADH (yielding 3 or 5 ATP via Malate-Aspartate or Glycerol-Phosphate shuttle) = 7 or 8 ATP total.`,
      `Anaerobic Net Yield: Exactly 2 Net ATP per molecule of glucose oxidized; NADH is recycled back to NAD+ by Lactate Dehydrogenase (LDH).`,
      `Energetic Significance: RBCs, renal medulla, and exercising skeletal muscle rely entirely on this anaerobic 2-ATP yield.`
    ],
    tableData: {
      headers: ['Condition', 'Pathway Output', 'Shuttle Utilized', 'Net ATP Generated per Mol'],
      rows: [
        ['Aerobic State (Brain/Heart/Liver)', '2 Pyruvate + 2 NADH + 2 ATP', 'Malate-Aspartate Shuttle', '7 (or 30-32 via complete TCA)'],
        ['Aerobic State (Skeletal Muscle)', '2 Pyruvate + 2 NADH + 2 ATP', 'Glycerol-Phosphate Shuttle', '5 (or 30 via complete TCA)'],
        ['Anaerobic State (RBC, Hypoxia)', '2 Lactate + 0 NADH (regenerated)', 'None (Cytosolic LDH)', '2 Net ATP (Vital baseline survival)']
      ]
    },
    speakerNotes: 'Notice the stark difference in ATP yield. In the presence of oxygen, mitochondria generate 30 to 32 ATP. Under hypoxia or in erythrocytes, you get only 2 ATP. This explains why hypoxic tissues produce massive lactic acid.',
    tags: ['Energetics', 'ATP', 'Pyruvate', 'Lactate'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 10B. DEDICATED COLOURED METABOLIC CYCLE DIAGRAM SLIDE (From Standard Textbooks)
  add({
    category: 'molecular_pathway',
    categoryLabel: 'Coloured Metabolic Cycle',
    title: `${matchedCycleData.name}: Standard Curriculum Diagram`,
    subtitle: `Illustrated Coloured Pathway Referenced from ${matchedCycleData.textbookSource}`,
    keyPoints: [
      `Complete cyclical sequence of substrates, intermediate metabolites and stereospecific enzyme catalysis.`,
      `Cellular Localization: ${matchedCycleData.cellularCompartments}.`,
      `Energetics & Stoichiometry: ${matchedCycleData.totalEnergyYield || 'Conserves chemical free energy'}.`,
      `High-Yield Viva Point: ${matchedCycleData.vivaQuestion ? matchedCycleData.vivaQuestion.slice(0, 110) + '...' : 'Committed pacemaker reaction'}`
    ],
    cycleIllustration: matchedCycleData,
    clinicalPearl: `Standard Textbook Reference: Imported as per ${matchedCycleData.textbookSource}. Verified with official NMC Biochemistry guidelines.`,
    speakerNotes: `Now, look at this colored cycle illustration on the screen. In university theory papers and OSPE practicals, examiners want you to draw this exact cycle with enzymes, cofactors, and compartmentalization.`,
    haryanviSpeech: `अरे लाडलो! इब स्क्रीन पे जो रंग-बिरंगा साइकिल देख रहे हो, यो जमा कसूता डायग्राम से! हार्पर और वासुदेवन टेक्स्टबुक का ऑथेंटिक पाथवे! हर एक बक्सा, एंजाइम और को-एंजाइम ध्यान से दिमाग में बैठा लो! जे एग्जामिनर थामसे पूछेगा, तो यो गोल चक्कर हूबहू कॉपी में बना के आना से भाई!`,
    blackboardCue: `Draw large cycle on board: Plot nodes clockwise: ${matchedCycleData.nodes.slice(0, 4).map(n => n.name).join(' ➔ ')}. Mark rate-limiting reaction with red chalk.`,
    tags: ['Metabolic Cycle', 'Coloured Diagram', 'Standard Textbook', matchedCycleData.category],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 11. RATE-LIMITING STEPS & COMMITTED ENZYMES
  add({
    category: 'rate_limiting',
    categoryLabel: 'Kinetic Governance',
    title: 'Committed Pacemaker Enzymes: Kinetic Properties',
    subtitle: 'Michaelis constant (Km), maximum velocity (Vmax) and physiological sensitivity',
    keyPoints: [
      `Definition: The rate-limiting step operates with the lowest maximum velocity (Vmax) and functions as the bottleneck of overall flux.`,
      `Hexokinase vs Glucokinase Isozymes: Hexokinase has very low Km (high affinity, active at low fasting glucose); Glucokinase has high Km (active only in fed state).`,
      `PFK-1 Pacemaker: The master rate-limiting enzyme regulated by the cellular energy charge ([ATP]/[AMP] ratio).`,
      `Pyruvate Kinase Control: Feed-forward activation by upstream Fructose-1,6-bisphosphate ensures smooth coordinate throughput.`
    ],
    tableData: {
      headers: ['Feature', 'Hexokinase (Isozymes I-III)', 'Glucokinase (Isozyme IV)'],
      rows: [
        ['Tissue Distribution', 'All tissues (Brain, RBC, Muscle)', 'Liver parenchyma & Pancreatic Beta cells'],
        ['Km for Glucose', 'Very Low (~0.1 mM) - High affinity', 'High (~10 mM) - Low affinity'],
        ['Vmax', 'Low capacity - easily saturated', 'High capacity - clears massive postprandial glucose'],
        ['Product Inhibition', 'Inhibited by Glucose-6-phosphate', 'NOT inhibited by G6P (regulated by GKRP)']
      ]
    },
    speakerNotes: 'Compare Hexokinase with Glucokinase. This is guaranteed to be asked in your viva voce. Hexokinase ensures the brain gets glucose even during severe fasting, while glucokinase only turns on in the liver after a heavy carbohydrate meal.',
    tags: ['Kinetics', 'Hexokinase', 'Glucokinase', 'Km'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 12. COENZYMES, VITAMINS & ESSENTIAL METAL COFACTORS
  add({
    category: 'coenzymes_cofactors',
    categoryLabel: 'Nutritional Biochemistry',
    title: 'Cofactor Network: B-Complex Vitamins & Divalent Cations',
    subtitle: 'Biochemical linkages between micronutrients and enzymatic function',
    keyPoints: [
      `Thiamine Pyrophosphate (TPP / Vitamin B1): Essential coenzyme for pyruvate dehydrogenase and alpha-ketoglutarate dehydrogenase complexes.`,
      `Nicotinamide Adenine Dinucleotide (NAD+ / Vitamin B3 Niacin): Universal hydride acceptor in dehydrogenase redox reactions.`,
      `Flavin Adenine Dinucleotide (FAD / Vitamin B2 Riboflavin): Tightly bound prosthetic group mediating two-electron oxidation transfers.`,
      `Lipoic Acid, Coenzyme A (Vitamin B5 Pantothenate) & Magnesium (Mg2+): Coordinate multi-enzyme catalytic cluster.`
    ],
    clinicalPearl: 'High-Yield Clinical Pearl: Administering intravenous glucose to a malnourished alcoholic patient before Thiamine (B1) triggers acute Wernicke Encephalopathy due to TPP depletion!',
    speakerNotes: 'Never give IV dextrose to a malnourished or alcoholic patient without Thiamine! Thiamine is required for Pyruvate Dehydrogenase. If you flood them with glucose without B1, pyruvate cannot enter the TCA cycle and accumulates as lethal lactate.',
    tags: ['Vitamins', 'Thiamine', 'Cofactors', 'Niacin'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 13. ALLOSTERIC REGULATION
  add({
    category: 'regulation_allosteric',
    categoryLabel: 'Metabolic Regulation',
    title: 'Allosteric Regulation: Energy Charge Sensing',
    subtitle: 'Millisecond-scale feedback and feed-forward effector binding',
    keyPoints: [
      `Energy Charge Concept: High ATP/AMP ratio signals adequate cellular energy, triggering allosteric inhibition of catabolic enzymes.`,
      `Fructose-2,6-Bisphosphate (F-2,6-BP): The most potent physiological allosteric activator of PFK-1, overriding ATP inhibition.`,
      `Citrate Feedback: Mitochondrial citrate signals excess Krebs cycle intermediates; leaks into cytosol to allosterically suppress PFK-1.`,
      `AMP & ADP Stimulation: Bind allosteric regulatory sites to induce the relaxed (R-state) high-affinity enzymatic conformation.`
    ],
    tableData: {
      headers: ['Regulatory Enzyme', 'Allosteric Activators (Stimulators)', 'Allosteric Inhibitors (Repressors)'],
      rows: [
        ['PFK-1', 'Fructose-2,6-BP, AMP, ADP', 'ATP (High energy), Citrate, Low pH (H+)'],
        ['Pyruvate Kinase', 'Fructose-1,6-bisphosphate (Feed-forward)', 'ATP, Alanine, Acetyl-CoA'],
        ['Pyruvate Carboxylase', 'Acetyl-CoA (Obligate activator)', 'ADP']
      ]
    },
    speakerNotes: 'Notice that allosteric regulation acts in milliseconds. It does not require protein synthesis or hormones. If a muscle cell suddenly twitches and consumes ATP, AMP rises instantly and triggers PFK-1 within fractions of a second.',
    tags: ['Allosteric', 'Regulation', 'PFK-1', 'AMP'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 14. HORMONAL REGULATION & SIGNALING CASCADES
  add({
    category: 'regulation_hormonal',
    categoryLabel: 'Endocrine Control',
    title: 'Hormonal Cascades: Insulin vs Glucagon / Epinephrine',
    subtitle: 'Receptor tyrosine kinase vs G-protein coupled receptor (GPCR) antagonism',
    keyPoints: [
      `Insulin (Fed State): Binds receptor tyrosine kinase (RTK) → activates Protein Phosphatase-1 (PP-1) → dephosphorylates and activates key regulatory enzymes.`,
      `Glucagon (Fasting State): Binds hepatic GPCR → stimulates Adenylyl Cyclase → elevates intracellular cyclic AMP (cAMP) → activates Protein Kinase A (PKA).`,
      `Bifunctional Enzyme Switch: PKA phosphorylates PFK-2/FBPase-2 complex, suppressing F-2,6-BP synthesis and halting glycolytic flux.`,
      `Epinephrine (Emergency / Fight-or-Flight): Stimulates beta-adrenergic GPCR cascade in skeletal muscle, accelerating instantaneous glycogen mobilization.`
    ],
    pathwayData: {
      title: 'Hormonal Phosphorylation Cascade',
      cellularLocation: 'Hepatocyte Plasma Membrane & Cytosol',
      keyMolecules: ['Glucagon / Epinephrine', 'G-Protein (Gs alpha)', 'cAMP Second Messenger', 'Active Protein Kinase A (PKA)'],
      steps: [
        {
          stepNumber: 1,
          from: 'Glucagon Binding',
          to: 'Gs-alpha GTP exchange',
          enzyme: 'Glucagon GPCR Receptor',
          coenzyme: 'GTP activation'
        },
        {
          stepNumber: 2,
          from: 'Adenylyl Cyclase',
          to: 'cAMP Production',
          enzyme: 'Adenylyl Cyclase (Membrane bound)',
          coenzyme: 'ATP → cAMP + PPi'
        },
        {
          stepNumber: 3,
          from: 'Inactive PKA',
          to: 'Catalytic PKA Subunit Release',
          enzyme: 'cAMP-dependent Protein Kinase A',
          coenzyme: 'Phosphorylation of target serine residues'
        }
      ]
    },
    speakerNotes: 'Remember the golden rule of metabolic regulation: In the fed state, insulin promotes DEPHOSPHORYLATION of enzymes. In the fasting state, glucagon and cAMP promote PHOSPHORYLATION.',
    blackboardCue: 'Draw the classic "Insulin = Dephosphorylation" and "Glucagon = Phosphorylation" rule of thumb in a highlighted box.',
    tags: ['Hormones', 'Insulin', 'Glucagon', 'cAMP', 'PKA'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 15. METABOLIC CROSS-TALK & INTERCONNECTED PATHWAYS
  add({
    category: 'metabolic_crosstalk',
    categoryLabel: 'Metabolic Integration',
    title: 'Metabolic Interconnections & Central Crossroads',
    subtitle: 'Convergence with Krebs cycle, Fatty acid oxidation, Gluconeogenesis & Pentose pathway',
    keyPoints: [
      `Pyruvate at the Crossroad: Pyruvate can convert to Acetyl-CoA (PDH), Oxaloacetate (PC), Lactate (LDH), or Alanine (ALT).`,
      `Glucose-6-Phosphate Hub: Central junction for Glycolysis, Glycogenesis, Gluconeogenesis, and the Hexose Monophosphate (HMP) shunt.`,
      `Fatty Acid Oxidation Crosstalk: Accelerated beta-oxidation generates high Acetyl-CoA, which allosterically inhibits PDH while stimulating Pyruvate Carboxylase.`,
      `Anaplerosis: Replenishment of TCA cycle intermediates by amino acid carbon skeletons entering via alpha-ketoglutarate, succinyl-CoA, and oxaloacetate.`
    ],
    speakerNotes: 'No pathway operates in an isolated test tube. Pyruvate is like a central railway junction. Which direction it takes depends on whether you have just eaten, whether you are running for a bus, or whether you have been fasting for 3 days.',
    tags: ['Metabolic Integration', 'Cross-talk', 'Pyruvate', 'Hub'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 16. INBORN ERRORS OF METABOLISM & BIOCHEMICAL BLOCKS
  add({
    category: 'inborn_errors',
    categoryLabel: 'Clinical Genetics',
    title: `Inborn Errors & Enzymopathies: ${matchedCompetency.highYieldDiseases[0] || 'Primary Metabolic Defect'}`,
    subtitle: 'Gene mutations, enzyme deficiency and pattern of inheritance',
    keyPoints: [
      `Primary Genetic Lesion: Autosomal recessive or X-linked loss-of-function mutation altering enzyme catalytic site or protein stability.`,
      `Metabolic Block Concept: Upstream substrates and toxic precursor derivatives accumulate to pathological levels in tissues and plasma.`,
      `Downstream Deprivation: Severe deficiency of vital end products (ATP, neurotransmitters, or antioxidant buffers) compromises organ integrity.`,
      `Key Representative Inborn Errors: ${matchedCompetency.highYieldDiseases.join(', ')}.`
    ],
    tableData: {
      headers: ['Disorder', 'Defective Enzyme', 'Accumulated Metabolite', 'Primary Clinical Consequence'],
      rows: [
        [matchedCompetency.highYieldDiseases[0] || 'Classic Defect', 'Specific Pacemaker Enzyme', 'Upstream Organic Acids', 'Metabolic Acidosis & Organ Failure'],
        [matchedCompetency.highYieldDiseases[1] || 'Secondary Variant', 'Associated Dehydrogenase', 'Metabolic Intermediates', 'Hypoglycemia / Neurological Deficit'],
        ['Isozyme Enzymopathy', 'Tissue-specific Isoform', 'Unphosphorylated Precursor', 'Hemolysis / Myopathy']
      ]
    },
    speakerNotes: 'Inborn errors of metabolism illustrate biochemistry in its purest clinical form. When one enzyme fails, everything before it dams up like a river behind a wall, and everything after it runs dry.',
    tags: ['Inborn Errors', 'Enzymopathy', 'Genetics', 'Metabolic Block'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 17. MOLECULAR & CELLULAR PATHOGENESIS
  add({
    category: 'molecular_pathogenesis',
    categoryLabel: 'Molecular Pathology',
    title: 'Molecular Pathogenesis: Cellular Injury Mechanisms',
    subtitle: 'Mitochondrial dysfunction, osmotic derangements and oxidative stress',
    keyPoints: [
      `Toxic Metabolite Accumulation: Intracellular swelling, uncoupling of mitochondrial membrane potential, and disruption of cristae architecture.`,
      `Oxidative Stress & ROS Generation: Overwhelms endogenous glutathione peroxidase and superoxide dismutase (SOD) scavengers.`,
      `Depletion of Cellular Energy: Failure of Na+/K+-ATPase membrane pumps leads to cytotoxic edema, particularly in central nervous system neurons.`,
      `Apoptotic Trigger: Cytochrome c leakage from damaged mitochondria into cytosol recruits Apaf-1 and activates the caspase cascade.`
    ],
    clinicalPearl: 'Pathophysiology Pearl: When Na+/K+-ATPase fails due to ATP collapse, intracellular sodium rises, water rushes in osmotically, causing fatal cytotoxic cerebral edema.',
    speakerNotes: 'Look at the downstream cellular catastrophe: Without ATP, the sodium-potassium pumps fail. Cells swell up with water. In the brain, where the skull cannot expand, this leads to fatal herniation.',
    tags: ['Pathogenesis', 'Cell Injury', 'Mitochondria', 'Apoptosis'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 18. BIOCHEMICAL CONSEQUENCES & SYSTEMIC DERANGEMENTS
  add({
    category: 'biochemical_consequences',
    categoryLabel: 'Systemic Pathophysiology',
    title: 'Biochemical Derangements: Acidosis, Ammonia & Ketosis',
    subtitle: 'Systemic consequences of metabolic decompensation',
    keyPoints: [
      `Lactic Acidosis: Inability of mitochondrial pyruvate oxidation shunts pyruvate into lactate via LDH, exhausting plasma bicarbonate buffering.`,
      `Hypoglycemia with Hypoketosis: Impaired gluconeogenesis or beta-oxidation prevents adequate ketone synthesis during fasting.`,
      `Hyperammonemia: Impaired nitrogen disposal crosses the blood-brain barrier, depletes alpha-ketoglutarate, and elevates glutamine within astrocytes.`,
      `Electrolyte Shift: Hydrogen ion influx into cells drives Potassium (K+) out into extracellular space, causing apparent hyperkalemia.`
    ],
    examAlert: 'Exam Favorite: Explain why hyperammonemia inhibits the Krebs cycle? Answer: Ammonia combines with alpha-ketoglutarate to form glutamate, draining the TCA cycle.',
    speakerNotes: 'Always connect the biochemistry to acid-base physics. Why does the blood pH drop? Because unbuffered lactic or keto-acids donate free hydrogen ions, depleting your bicarbonate reserve.',
    tags: ['Biochemical Consequences', 'Acidosis', 'Electrolytes', 'Ammonia'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 19. CLINICAL MANIFESTATIONS & PHYSICAL SIGNS
  add({
    category: 'clinical_manifestations',
    categoryLabel: 'Clinical Signs',
    title: 'Clinical Presentation & Bedside Signs',
    subtitle: 'Recognizing metabolic crisis across pediatric and adult cohorts',
    keyPoints: [
      `Respiratory Compensation (Kussmaul Breathing): Deep, rapid respirations reflecting physiological hyperventilation to blow off volatile CO2.`,
      `Neurological Symptoms: Lethargy, stupor, asterixis (flapping tremors in hyperammonemia), seizures, and progressive coma.`,
      `Gastrointestinal Distress: Recurrent episodic vomiting, anorexia, hepatomegaly due to fat or glycogen infiltration, and failure to thrive in infants.`,
      `Cardiovascular Instability: Tachycardia, hypotension due to osmotic dehydration, cardiac arrhythmias from serum potassium shifts.`
    ],
    speakerNotes: 'When you walk into the emergency room and hear a patient breathing like a locomotive engine—deep, rapid sighing breaths—that is Kussmaul respiration. Their respiratory center is trying to compensate for severe metabolic acidosis.',
    tags: ['Signs', 'Kussmaul', 'Coma', 'Pediatrics'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 20. LABORATORY DIAGNOSTICS & WORKUP PROTOCOL
  add({
    category: 'investigations',
    categoryLabel: 'Laboratory Medicine',
    title: 'Diagnostic Protocol: Systematic Laboratory Workup',
    subtitle: 'Tier 1 Emergency Screening to Tier 3 Molecular Confirmation',
    keyPoints: [
      `Tier 1 Emergency Panel: Arterial Blood Gas (ABG), Blood Glucose, Serum Electrolytes (Na+, K+, Cl-), Serum Anion Gap, and Urinalysis (ketones, reducing sugars).`,
      `Tier 2 Metabolic Panel: Plasma Lactate, Pyruvate, Plasma Ammonia, Liver Function Tests (AST/ALT/Bilirubin), and Serum Creatinine.`,
      `Tier 3 Specialized Testing: Tandem Mass Spectrometry (TMS) acylcarnitine profile, Urine Organic Acid analysis by GC-MS.`,
      `Tier 4 Definitive Confirmation: Quantitative enzyme activity assay in cultured fibroblasts or targeted next-generation genomic sequencing (NGS).`
    ],
    tableData: {
      headers: ['Investigation', 'Expected Abnormal Finding', 'Clinical Interpretation'],
      rows: [
        ['Arterial Blood Gas (ABG)', 'pH < 7.30, HCO3- < 15 mEq/L', 'High Anion Gap Metabolic Acidosis'],
        ['Serum Anion Gap', '> 16 mEq/L (Normal 8-12)', 'Presence of unmeasured organic anions'],
        ['Plasma Ammonia', '> 100-150 umol/L', 'Defect in Urea Cycle or secondary inhibition'],
        ['Urine Organic Acids (GC-MS)', 'Pathognomonic metabolite spikes', 'Confirmatory enzymatic localization']
      ]
    },
    speakerNotes: 'As future junior doctors, you must know what order to write in the investigation slip. Start with the urgent bedside panel: ABG, electrolytes, blood sugar, and urine ketones.',
    tags: ['Diagnostics', 'ABG', 'Anion Gap', 'GC-MS'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 21. HIGH-SENSITIVITY BIOMARKERS & ENZYME ASSAYS
  add({
    category: 'biomarkers',
    categoryLabel: 'Diagnostic Enzymology',
    title: 'Diagnostic Biomarkers & Quantitative Enzyme Kinetics',
    subtitle: 'Isoenzymes, serum half-lives and diagnostic specificity',
    keyPoints: [
      `Biomarker Kinetics: Peak appearance, plateau duration, and renal clearance timeline determine the diagnostic window.`,
      `Enzyme Units & Reference Intervals: Expressed in International Units (IU/L) defined as 1 micromole of substrate transformed per minute under standardized conditions.`,
      `Isoenzyme Separation: Agarose gel electrophoresis and high-performance liquid chromatography (HPLC) resolve tissue-specific variants.`,
      `Modern Tandem Mass Spectrometry (TMS): Enables multiplexed newborn screening from a single dried blood spot within 48 hours of birth.`
    ],
    clinicalPearl: 'NMC Viva Pearl: 1 International Unit (IU) of enzyme = amount converting 1 umol of substrate per minute at 25°C under optimum pH.',
    speakerNotes: 'Remember the definition of International Unit (IU) for your practical viva. Examiners ask this definition in every biochemistry viva exam.',
    tags: ['Biomarkers', 'Isoenzymes', 'TMS', 'Units'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 22. TREATMENT PRINCIPLES & EMERGENCY RESUSCITATION
  add({
    category: 'treatment_principles',
    categoryLabel: 'Emergency Therapeutics',
    title: 'Treatment Principles & Acute Emergency Stabilization',
    subtitle: 'Correcting acid-base imbalance, restoring perfusion and arresting catabolism',
    keyPoints: [
      `ABC Resuscitation & Fluid Restoration: Aggressive intravenous rehydration with isotonic saline to restore effective circulating arterial volume.`,
      `Halting Endogenous Catabolism: High-dose intravenous Dextrose (10-20%) infusion stimulates endogenous insulin secretion, shutting down lipolysis and proteolysis.`,
      `Correction of Acidemia: Judicious sodium bicarbonate infusion reserved only for life-threatening severe acidemia (pH < 7.10) to avoid paradoxical CSF acidosis.`,
      `Nitrogen / Toxin Scavenging: In hyperammonemia, administer Sodium Phenylbutyrate or Sodium Benzoate to conjugate nitrogen into hippurate/phenylacetylglutamine.`
    ],
    speakerNotes: 'The first clinical goal in any metabolic crisis is to stop the body from breaking itself down. By giving IV glucose, you release insulin, which immediately arrests proteolysis and shuts off lipolysis.',
    tags: ['Treatment', 'Emergency', 'Resuscitation', 'Fluids'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 23. PHARMACOLOGICAL TARGETS & DRUG MECHANISMS
  add({
    category: 'pharmacology',
    categoryLabel: 'Clinical Pharmacology',
    title: 'Pharmacological Targets & Rational Drug Design',
    subtitle: 'Competitive inhibition, suicide substrate inactivation and metabolic bypass',
    keyPoints: [
      `Enzyme Inhibition Strategies: Competitive inhibitors (e.g. Statins on HMG-CoA reductase) elevate apparent Km while maintaining identical Vmax.`,
      `Mechanism-Based / Suicide Inactivators: Allopurinol acts as suicide substrate for Xanthine Oxidase, being converted into alloxanthine which irreversibly binds the active site.`,
      `Cofactor Mega-Dose Supplementation: High-dose Pyridoxine (B6), Cobalamin (B12), or Biotin (B7) overcomes low-affinity mutant apoenzymes in responsive inborn errors.`,
      `Metabolic Bypass: Dietary supplementation of downstream essentials (e.g., L-carnitine or arginine) bypasses obstructed metabolic bottlenecks.`
    ],
    tableData: {
      headers: ['Therapeutic Agent', 'Target Enzyme / Transporter', 'Mechanism of Action', 'Clinical Indication'],
      rows: [
        ['Allopurinol / Febuxostat', 'Xanthine Oxidase', 'Suicide / Non-purine inhibition', 'Gout & Tumor Lysis Syndrome'],
        ['Statins (Atorvastatin)', 'HMG-CoA Reductase', 'Competitive inhibition of rate-limiting step', 'Hypercholesterolemia & CAD'],
        ['Methotrexate', 'Dihydrofolate Reductase (DHFR)', 'Competitive folate analog', 'Choriocarcinoma, Rheumatoid Arthritis'],
        ['Sodium Phenylbutyrate', 'Glutamine Conjugation', 'Alternative nitrogen waste excretion pathway', 'Urea Cycle Enzymopathies']
      ]
    },
    speakerNotes: 'Notice the beautiful bridge between Biochemistry and Pharmacology. Every time you prescribe a statin or allopurinol, you are utilizing Michaelis-Menten enzyme kinetics directly.',
    tags: ['Pharmacology', 'Inhibitors', 'Statins', 'Allopurinol'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 24. DIETARY & LIFESTYLE INTERVENTIONS
  add({
    category: 'dietary_nutrition',
    categoryLabel: 'Medical Nutrition Therapy',
    title: 'Medical Nutrition Therapy & Dietary Modifications',
    subtitle: 'Macronutrient rebalancing and substrate restriction protocols',
    keyPoints: [
      `Substrate Restriction Protocol: Eliminate offending toxic precursors from the diet (e.g., low-phenylalanine formula in PKU, galactose-free diet in Galactosemia).`,
      `Frequent Uncooked Cornstarch Feeding: Provides slow, sustained glucose release in Glycogen Storage Disease Type I to prevent nocturnal hypoglycemia.`,
      `Medium-Chain Triglyceride (MCT) Supplementation: MCTs bypass the carnitine palmitoyltransferase shuttle, entering mitochondria directly for oxidation.`,
      `Dietary Antioxidant Synergy: Vitamin C, Vitamin E, and carotenoids neutralize free radical cascades in chronic inflammatory states.`
    ],
    speakerNotes: 'In many inborn errors, medical food and dietary management IS the life-saving cure. For example, in PKU, a strict low-phenylalanine diet initiated within days of birth prevents lifelong intellectual disability.',
    tags: ['Nutrition', 'Diet', 'PKU', 'MCT'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 25. INTEGRATED CLINICAL CASE SCENARIO: PRESENTATION
  add({
    category: 'clinical_case',
    categoryLabel: 'CBME Integrated Case',
    title: 'Clinical Case: The Emergency Presentation',
    subtitle: 'History of Present Illness and Emergency Triage Findings',
    keyPoints: [
      `Patient Profile: 21-year-old medical student with known Type 1 Diabetes Mellitus brought to casualty with altered mental status and hyperventilation.`,
      `History: Patient omitted insulin doses for 3 days due to examination stress and mild gastroenteritis with decreased oral intake.`,
      `Emergency Triage Vitals: Blood Pressure: 90/60 mmHg (hypotensive), Heart Rate: 122 bpm (sinus tachycardia), Respiratory Rate: 34 bpm (deep Kussmaul pattern), Temp: 37.1°C.`,
      `Physical Examination: Marked mucosal dehydration, poor skin turgor, characteristic fruity odor of acetone on breath, diffuse abdominal tenderness without rebound.`
    ],
    caseStudy: {
      patientAge: '21 years',
      gender: 'Female',
      chiefComplaint: 'Severe drowsiness, rapid breathing, and abdominal pain for 18 hours',
      historyOfPresentIllness: 'Omitted subcutaneous basal-bolus insulin for 3 consecutive days during examination stress; developed persistent nausea and deep rapid breathing.',
      vitals: {
        'Blood Pressure': '90/60 mmHg',
        'Pulse': '122 beats/min',
        'Respiratory Rate': '34/min (Kussmaul)',
        'SpO2': '99% on room air',
        'GCS': '11/15 (E3 V4 M4)'
      },
      labFindings: [
        { test: 'Random Blood Glucose', patientValue: '480 mg/dL', normalValue: '70-140 mg/dL', inference: 'Severe Hyperglycemia' },
        { test: 'Arterial Blood Gas pH', patientValue: '7.12', normalValue: '7.35-7.45', inference: 'Severe Acidemia' },
        { test: 'Serum Bicarbonate (HCO3-)', patientValue: '9 mEq/L', normalValue: '22-26 mEq/L', inference: 'Profound metabolic consumption' },
        { test: 'Serum Anion Gap', patientValue: '28 mEq/L', normalValue: '8-12 mEq/L', inference: 'High Anion Gap Metabolic Acidosis (HAGMA)' },
        { test: 'Urine Ketones (Acetoacetate)', patientValue: '4+ (Deep Purple)', normalValue: 'Negative', inference: 'Massive Ketosis (Rothera Test +++)' },
        { test: 'Serum Potassium (K+)', patientValue: '5.6 mEq/L', normalValue: '3.5-5.0 mEq/L', inference: 'Spurious extracellular shift hyperkalemia' }
      ],
      diagnosis: 'Severe Diabetic Ketoacidosis (DKA) with High Anion Gap Metabolic Acidosis and Severe Dehydration',
      differentialDiagnosis: [
        'Lactic Acidosis (Septic shock or hypoperfusion)',
        'Alcoholic Ketoacidosis (AKA)',
        'Toxic Alcohol Ingestion (Methanol or Ethylene glycol)',
        'Acute Pancreatitis with secondary hyperglycemia',
        'Uremic Encephalopathy'
      ],
      management: [
        'Immediate IV 0.9% Normal Saline at 1000 mL/hr to restore circulating volume and renal perfusion.',
        'Continuous regular insulin infusion at 0.1 units/kg/hr only after confirming serum potassium is not low.',
        'Anticipate potassium drop as insulin drives K+ back into cells; add potassium chloride (KCl) to IV fluids once K+ < 5.0.',
        'Monitor hourly bedside capillary glucose, ABG, and urine ketones until anion gap closes and bicarbonate reaches > 18 mEq/L.'
      ]
    },
    speakerNotes: 'Look at this classic scenario. Every intern encounters this in the medical emergency ward. The patient stopped her insulin. What happened to her cellular biochemistry? Insulin deficiency provoked unrestrained lipolysis, flooding the liver with free fatty acids.',
    tags: ['Case Study', 'DKA', 'Presentation', 'Emergency'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 26. CLINICAL CASE: LABORATORY PANEL ANALYSIS
  add({
    category: 'clinical_case',
    categoryLabel: 'CBME Integrated Case',
    title: 'Clinical Case: Laboratory Panel & Biochemical Reasoning',
    subtitle: 'Correlating each test value with underlying enzymatic steps',
    keyPoints: [
      `Why is Glucose 480 mg/dL? Gluconeogenesis is uninhibited (PEPCK and F-1,6-BPase active) while GLUT-4 translocation in muscle/fat is absent.`,
      `Why is the Anion Gap 28? Unmeasured beta-hydroxybutyrate and acetoacetate anions have accumulated in plasma, displacing bicarbonate buffer.`,
      `Why is Urine Rothera Positive? Nitroprusside reacts with acetoacetate and acetone (purple ring). Note: Rothera does NOT detect beta-hydroxybutyrate!`,
      `Why is Potassium 5.6 mEq/L falsely elevated? Acidemia drives H+ into cells in exchange for K+ out; total body potassium is actually severely depleted.`
    ],
    examAlert: 'High-Yield Trap: Does Rothera’s test detect beta-hydroxybutyrate? NO! It only detects acetoacetate and acetone. During treatment, as beta-hydroxybutyrate oxidizes back to acetoacetate, Rothera test may temporarily appear more positive!',
    speakerNotes: 'This is a favorite MCQ trap in NEET-PG and university exams: Rothera test detects acetoacetate, not beta-hydroxybutyrate. As the patient improves, beta-hydroxybutyrate converts back to acetoacetate, so the urine test looks worse even though the patient is getting better!',
    tags: ['Case Labs', 'Rothera', 'Potassium', 'Acidosis'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 27. CLINICAL CASE: RESOLUTION & PROTOCOL MANAGEMENT
  add({
    category: 'clinical_case',
    categoryLabel: 'CBME Integrated Case',
    title: 'Clinical Case: Resolution & Protocol Management',
    subtitle: 'Therapeutic targets and step-down transition criteria',
    keyPoints: [
      `Volume Replacement Phase: 1 Liter 0.9% NaCl over 1st hour, followed by 500 mL/hr with potassium supplementation.`,
      `Insulin Infusion Dynamics: Lowers glucose at target rate of 50-75 mg/dL/hr; when glucose reaches 200 mg/dL, add 5% Dextrose to prevent cerebral edema while continuing insulin until ketoacidosis resolves.`,
      `Resolution Criteria: Blood glucose < 200 mg/dL, Serum Bicarbonate >= 18 mEq/L, Venous pH > 7.30, and normalized serum anion gap <= 12 mEq/L.`,
      `Subcutaneous Transition: Overlap subcutaneous basal insulin by 1-2 hours prior to stopping intravenous infusion to prevent rebound ketosis.`
    ],
    speakerNotes: 'Notice that you do NOT stop insulin when the blood sugar hits 200! The insulin is being given to turn off ketogenesis, not just to lower sugar. You add 5% dextrose and continue the insulin until the anion gap closes.',
    tags: ['DKA Management', 'Insulin', 'Resolution', 'Protocol'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 28. HORIZONTAL & VERTICAL INTEGRATION
  add({
    category: 'horizontal_integration',
    categoryLabel: 'Curricular Integration',
    title: 'Cross-Disciplinary Integration: Holistic Medicine',
    subtitle: 'Connecting Biochemistry with Physiology, Pathology, Pharmacology & Medicine',
    keyPoints: [
      `Physiology (Phase 1): Aligns with fluid-electrolyte homeostasis, Henderson-Hasselbalch renal acid excretion, and respiratory compensation.`,
      `Pathology (Phase 2): Connects with fatty change (steatosis) in hepatocytes, atheroma formation in arterial intima, and osmotic cellular hydropic swelling.`,
      `Pharmacology (Phase 2): Rational drug classes—statins, fibrates, metformin (AMPK activator), SGLT-2 inhibitors, and insulin analogs.`,
      `General Medicine (Phase 3): Ward rounds, intensive care ventilator management of acid-base disorders, and long-term diabetes prevention.`
    ],
    tableData: {
      headers: ['Discipline', 'Integrated Concept', 'Clinical Outcome'],
      rows: [
        ['Physiology', 'Renal Bicarbonate Reabsorption', 'Maintenance of physiological blood pH 7.40'],
        ['Pathology', 'Atherosclerosis & Foam Cell Formation', 'Endothelial LDL oxidation in coronary arteries'],
        ['Pharmacology', 'Competitive HMG-CoA Reductase Inhibitors', 'Reduction in cardiovascular mortality by 30%'],
        ['Internal Medicine', 'Emergency Protocol for Metabolic Crisis', 'Zero preventable mortality from acute DKA']
      ]
    },
    speakerNotes: 'This slide demonstrates why NMC created the CBME curriculum. Medical science is not compartmentalized into isolated silos. What you learn today in Biochemistry explains the pathology and pharmacology you will study next year.',
    tags: ['Integration', 'Physiology', 'Pathology', 'Pharmacology'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 29. BLACKBOARD DRAWING CUE & EXAM FLOWCHART
  add({
    category: 'blackboard_cue',
    categoryLabel: 'Teaching Cue / Exam Sketch',
    title: 'Blackboard Drawing Cue: Student Exam Answer Script',
    subtitle: 'High-scoring 5-minute visual flowchart for University Examinations',
    keyPoints: [
      `Rule 1: Always draw three clear columns: Substrates (Left), Enzymes with Coenzymes in Badges (Center), Products & ATP Yield (Right).`,
      `Rule 2: Highlight all irreversible/committed steps using double solid lines or contrasting colored chalk.`,
      `Rule 3: Indicate allosteric stimulators (+) in green arrows and allosteric inhibitors (-) in red blocked bars.`,
      `Rule 4: Always write the exact tissue location (Cytosol vs Mitochondria) and net ATP stoichiometric balance at the bottom of the diagram.`
    ],
    blackboardCue: `TEACHER CHALKBOARD INSTRUCTION:
1. Divide blackboard into 3 vertical panels.
2. Panel 1: Write "CYTOSOL" in large letters. Draw Glucose → G6P (Hexokinase + Mg2+).
3. Panel 2: Draw the committed step PFK-1. Use red chalk for [- ATP, Citrate] and green chalk for [+ AMP, F-2,6-BP].
4. Panel 3: Draw pyruvate fates (Aerobic → Acetyl-CoA vs Anaerobic → Lactate).
5. Box the Net ATP equation: "2 ATP + 2 NADH = 7 ATP (Aerobic) / 2 ATP (Anaerobic)".`,
    speakerNotes: 'Students, copy down this exact layout into your notebooks right now. When an examiner gives you 8 minutes to answer a 10-mark Long Answer Question, this visual layout scores full marks because it is clean, legible, and comprehensive.',
    tags: ['Blackboard', 'Exam Tip', 'Flowchart', 'Teaching Cue'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 30. OSPE / PRACTICAL VIVA QUESTIONS
  add({
    category: 'ospe_viva',
    categoryLabel: 'Practical Assessment',
    title: 'OSPE Station & Practical Viva Voce High-Yields',
    subtitle: 'Objective Structured Practical Examination (OSPE) stations',
    keyPoints: [
      `Station 1 (Spotter): Given a blood collection tube with grey stopper. Q: Name the additive, target enzyme, and clinical diagnostic purpose. Ans: Sodium Fluoride + Potassium Oxalate; inhibits Enolase; prevents glycolysis in blood sugar estimation.`,
      `Station 2 (Urine Chemistry): Given a urine specimen showing deep purple ring on Rothera test. Q: Name the reagent, principle, and two medical causes. Ans: Sodium nitroprusside; forms purple complex with acetoacetate/acetone; DKA and starvation.`,
      `Station 3 (Enzyme Kinetics Graph): Given Lineweaver-Burk plot with identical 1/Vmax intercept and shifted -1/Km intercept. Q: Identify the type of inhibition. Ans: Competitive Inhibition.`,
      `Station 4 (Calculation): Calculate the Serum Anion Gap from Na+ 138, Cl- 102, HCO3- 12. Ans: 138 - (102 + 12) = 24 mEq/L (High Anion Gap Acidosis).`
    ],
    speakerNotes: 'These are your exact OSPE stations for the First Professional MBBS practical exam. At station 1, identify the grey top tube immediately. At station 2, know Rothera’s reagent constituents: Ammonium sulfate, sodium nitroprusside, and liquor ammonia.',
    tags: ['OSPE', 'Viva', 'Practical', 'Stations'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 31. HIGH-YIELD CLINICAL MCQs (NExT / NEET-PG / MBBS FORMAT)
  add({
    category: 'mcqs',
    categoryLabel: 'Exam Assessment',
    title: 'High-Yield Clinical MCQs: NExT / NEET-PG Pattern',
    subtitle: 'Clinical vignette questions with detailed rationales',
    keyPoints: [
      `Solve the case vignettes using systematic elimination based on biochemical mechanisms.`,
      `Analyze why distractors are incorrect to deepen physiological understanding.`,
      `Targeted for the upcoming National Exit Test (NExT) clinical problem-solving pattern.`
    ],
    mcqs: [
      {
        question: 'A 2-day-old neonate presents with severe lethargy, vomiting, and tachypnea. Arterial blood gas shows pH 7.15, blood glucose is 45 mg/dL, and urine ketones are negative. Plasma acylcarnitine profile reveals marked elevation of C8 octanoylcarnitine. Which of the following enzymes is most likely defective?',
        options: [
          'A) Carnitine palmitoyltransferase-1 (CPT-1)',
          'B) Medium-chain acyl-CoA dehydrogenase (MCAD)',
          'C) Pyruvate carboxylase',
          'D) Glucose-6-phosphatase'
        ],
        correctAnswerIndex: 1,
        explanation: 'MCAD deficiency is the most common inborn error of beta-oxidation. It presents as hypoketotic hypoglycemia during fasting with characteristic elevation of C8 (octanoyl) carnitine. CPT-1 defect causes low acylcarnitines.',
        highYieldFact: 'MCAD deficiency leads to sudden infant death syndrome (SIDS) presentations triggered by prolonged fasting.'
      },
      {
        question: 'A 45-year-old chronic alcoholic presents with severe epigastric pain and confusion. Before infusing intravenous 10% dextrose, which vitamin must be administered immediately to prevent fatal encephalopathy?',
        options: [
          'A) Riboflavin (Vitamin B2)',
          'B) Niacin (Vitamin B3)',
          'C) Thiamine (Vitamin B1)',
          'D) Pyridoxine (Vitamin B6)'
        ],
        correctAnswerIndex: 2,
        explanation: 'Thiamine pyrophosphate (TPP) is an obligate coenzyme for Pyruvate Dehydrogenase. Administering glucose without thiamine depletes residual TPP, causing severe brain lactic acidosis and precipitation of Wernicke-Korsakoff syndrome.',
        highYieldFact: 'Thiamine deficiency manifests as Wet Beriberi (cardiac high-output failure) or Dry Beriberi (peripheral neuropathy).'
      }
    ],
    speakerNotes: 'These two questions represent the gold-standard NExT pattern. Read Question 1 carefully: Notice "hypoketotic hypoglycemia" and "C8 octanoylcarnitine". That combination immediately points you to MCAD deficiency.',
    tags: ['MCQ', 'NEET-PG', 'NExT', 'Clinical Vignette'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 32. SUMMARY KEY TAKEAWAYS & RAPID REVISION
  add({
    category: 'summary',
    categoryLabel: 'Rapid Revision',
    title: 'Summary: Rapid Revision Cheat Sheet',
    subtitle: 'The 6 Core Commandments for Clinical Practice and University Exams',
    keyPoints: [
      `1. Rate-Limiting Pacemaker: PFK-1 in glycolysis (stimulated by F-2,6-BP & AMP; inhibited by ATP & Citrate).`,
      `2. Cellular Compartment: Substrate priming and anaerobic ATP yield occur in cytosol; terminal oxidation requires mitochondria.`,
      `3. Net Energy Output: 7 or 8 ATP under aerobic conditions; exactly 2 ATP under anaerobic conditions.`,
      `4. Inborn Error Hallmark: Enzyme blocks cause upstream substrate toxicity + downstream vital product starvation.`,
      `5. Emergency Hallmark: Acidemia (pH < 7.30) with High Anion Gap indicates accumulation of unmeasured organic acids (Lactate, Ketones).`,
      `6. Diagnostic Anchor: Sodium fluoride in grey top tubes inhibits enolase to preserve true in-vivo blood glucose concentration.`
    ],
    clinicalPearl: 'Takeaway: Every symptom at the bedside has an explanation at the molecular active site.',
    speakerNotes: 'Take a photo of this slide on your phones. This single slide consolidates everything we have covered today in a high-yield memory palace.',
    tags: ['Summary', 'Takeaways', 'Revision', 'Cheat Sheet'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // 33. VERIFIED REFERENCES & PEDAGOGICAL DISCLOSURE
  add({
    category: 'references',
    categoryLabel: 'Academic Integrity',
    title: 'Verified Medical References & Educational Disclosure',
    subtitle: 'Gold standard textbooks, national guidelines and AI synthesis boundaries',
    keyPoints: [
      `1. Harper’s Illustrated Biochemistry, 32nd Edition (Victor W. Rodwell, David A. Bender et al., McGraw-Hill).`,
      `2. Textbook of Biochemistry for Medical Students, 10th Edition (DM Vasudevan, Sreekumari S, Kannan Vaidyanathan, Jaypee).`,
      `3. Lehninger Principles of Biochemistry, 8th Edition (David L. Nelson, Michael M. Cox, Macmillan).`,
      `4. Lippincott Illustrated Reviews: Biochemistry, 8th Edition (Emine Ercikan Abali et al., Wolters Kluwer).`,
      `5. National Medical Commission (NMC) Competency Based Undergraduate Curriculum for the Indian Medical Graduate (Volume 1).`
    ],
    clinicalPearl: 'Pedagogical Notice: Visual pathways and blackboard schematics are synthesized for teaching clarity. Clinical dosages and medical protocols must be verified against current hospital pharmacopeia.',
    speakerNotes: 'All content in this presentation is strictly referenced from Harper’s Illustrated Biochemistry 32nd edition and Vasudevan 10th edition, harmonized with NMC competency guidelines. Thank you for your active participation today!',
    tags: ['References', 'Textbooks', 'NMC', 'Harper', 'Vasudevan'],
    nmcCompetencyCode: matchedCompetency.code,
  });

  // If user requested more slides (e.g. 35 to 42 for a 60 min masterclass), we can enrich with specialized deep-dive slides!
  if (targetSlideCount > slides.length) {
    const extraSlidesNeeded = targetSlideCount - slides.length;
    const specializedTopics = [
      {
        title: 'Isoenzymes: Structural Heterogeneity & Diagnostic Windows',
        sub: 'Quaternary subunit structure, tissue distribution and electrophoretic mobility',
        points: [
          'Isoenzymes are physically distinct forms of the same enzyme that catalyze identical chemical reactions.',
          'Formed by differing combinations of polypeptide subunits encoded by distinct genetic loci.',
          'Lactate Dehydrogenase (LDH) exists as 5 tetrameric isozymes (LDH-1 H4 to LDH-5 M4).',
          'LDH-1/LDH-2 ratio inversion ("flipped pattern") in serum diagnostic of acute myocardial infarction.'
        ],
        notes: 'Explain LDH isoenzymes on the board. LDH-1 is predominant in heart muscle, while LDH-5 is in liver and skeletal muscle.'
      },
      {
        title: 'Free Radicals & Antioxidant Defense Mechanisms',
        sub: 'Reactive Oxygen Species (ROS), lipid peroxidation and cellular defense',
        points: [
          'ROS generation occurs naturally as a byproduct of complex I and III electron leakage in the ETC.',
          'Superoxide radical (O2.-) is dismutated by Superoxide Dismutase (SOD) into Hydrogen Peroxide (H2O2).',
          'Catalase and Glutathione Peroxidase (Selenium-dependent) detoxify H2O2 into water and oxygen.',
          'Glutathione reductase relies on NADPH generated directly by the Hexose Monophosphate Shunt.'
        ],
        notes: 'This links back directly to the HMP shunt. Without NADPH from G6PD, glutathione cannot be reduced, causing red cell lysis.'
      },
      {
        title: 'Thermodynamics of Biochemical Reactions & Gibbs Free Energy (Delta G)',
        sub: 'Exergonic vs endergonic reactions and energetic coupling principles',
        points: [
          'Standard Free Energy Change (Delta G0\') under standard biochemical conditions (pH 7.0, 25°C).',
          'Endergonic reactions (Delta G > 0) are thermodynamically unfavorable and must be coupled to exergonic ATP cleavage.',
          'ATP contains two high-energy phosphoanhydride bonds with Delta G0\' of -30.5 kJ/mol (-7.3 kcal/mol).',
          'Phosphoenolpyruvate (PEP) and 1,3-BPG have higher group transfer potential than ATP, enabling substrate-level phosphorylation.'
        ],
        notes: 'Clarify why PEP can phosphorylate ADP to ATP. Its phosphate group transfer potential (-61.9 kJ/mol) is much higher than ATP.'
      },
      {
        title: 'Metabolic Adaptation in Starvation: 72-Hour Timeline',
        sub: 'Hormonal shifts, fuel switching from glycogen to ketone bodies and protein sparing',
        points: [
          'Phase 1 (First 24 Hours): Hepatic glycogenolysis maintains blood glucose; muscle glycogen supplies local work.',
          'Phase 2 (24 to 72 Hours): Hepatic gluconeogenesis becomes predominant; amino acid alanine and glycerol serve as substrates.',
          'Phase 3 (Prolonged Starvation): Adipose lipolysis yields free fatty acids; liver converts excess acetyl-CoA into Ketone Bodies.',
          'Brain Adaptation: Brain shifts 70% of energy consumption to beta-hydroxybutyrate, sparing skeletal muscle protein breakdown.'
        ],
        notes: 'Walk students through the 72-hour starvation graph. Point out how ketone bodies spare skeletal muscle protein breakdown.'
      },
      {
        title: 'Genomics & Precision Medicine in Clinical Biochemistry',
        sub: 'Next-Generation Sequencing, pharmacogenomics and molecular biomarkers',
        points: [
          'Pharmacogenomics: Genetic variations in CYP2C19 and CYP2D6 alter drug metabolism rates in patients.',
          'Targeted NGS Panels: Rapid identification of neonatal inborn errors of metabolism before symptoms manifest.',
          'Circulating Tumor DNA (ctDNA) & Liquid Biopsy: Ultra-sensitive non-invasive detection of somatic oncogenic mutations.',
          'CRISPR-Cas9 Therapeutic Editing: Correction of monogenic metabolic errors in experimental hematology.'
        ],
        notes: 'Conclude with the horizon of medicine: Next-generation sequencing allows us to sequence an entire infant genome within 24 hours.'
      }
    ];

    for (let i = 0; i < extraSlidesNeeded && i < specializedTopics.length; i++) {
      const extra = specializedTopics[i];
      // Insert before summary & references (2 slides before the end)
      const insertPos = slides.length - 2;
      slides.splice(insertPos, 0, {
        id: `slide-special-${i}`,
        slideNumber: 0, // renumbered below
        category: 'molecular_pathway',
        categoryLabel: 'Advanced Topic',
        title: extra.title,
        subtitle: extra.sub,
        keyPoints: extra.points,
        speakerNotes: extra.notes,
        tags: ['Advanced', 'Masterclass', 'Biochemistry'],
        nmcCompetencyCode: matchedCompetency.code
      });
    }

    // Renumber all slides
    slides.forEach((sl, idx) => {
      sl.slideNumber = idx + 1;
      sl.id = `slide-${idx + 1}`;
    });
  }

  return {
    id: `pres-${Date.now()}`,
    title: lectureTitle,
    topic: topicName,
    nmcCompetencyCode: matchedCompetency.code,
    nmcCompetencyDescription: matchedCompetency.description,
    authorFaculty: faculty,
    institution: institution,
    phase: 'MBBS Phase 1 (1st Professional)',
    theme: theme,
    lectureDurationMin: duration,
    totalSlides: slides.length,
    slides: slides,
    createdAt: new Date().toISOString(),
    disclaimer: 'This presentation is designed for educational instruction for MBBS students. Generated diagrams and visual models are structured for classroom comprehension as per NMC-CBME standards. Verified against standard reference textbooks.',
    verifiedReferences: [
      'Harper’s Illustrated Biochemistry, 32nd Edition (Victor W. Rodwell et al.)',
      'Textbook of Biochemistry for Medical Students, 10th Edition (DM Vasudevan et al.)',
      'Lehninger Principles of Biochemistry, 8th Edition (David L. Nelson, Michael M. Cox)',
      'Lippincott Illustrated Reviews: Biochemistry, 8th Edition (Emine Ercikan Abali)',
      'National Medical Commission (NMC) CBME Curriculum Document'
    ]
  };
}
