import pptxgenjs from 'pptxgenjs';
import { PresentationData, Slide } from '../types/ppt';
import { THEMES } from '../data/themes';

export async function exportToPPTX(presentation: PresentationData): Promise<void> {
  const pptx = new pptxgenjs();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = presentation.authorFaculty || 'Dr. R. S. Yadav';
  pptx.company = 'Yadav Medical PPT Generator for MBBS';
  pptx.title = presentation.title;
  pptx.subject = `NMC Biochemistry Competency ${presentation.nmcCompetencyCode}`;

  const theme = THEMES[presentation.theme] || THEMES.navy;
  const primaryColor = theme.primary.replace('#', '');
  const secondaryColor = theme.secondary.replace('#', '');
  const accentColor = theme.accent.replace('#', '');
  const bgLightColor = theme.bgLight.replace('#', '');
  const darkTextColor = theme.textDark.replace('#', '');
  const mutedTextColor = theme.textMuted.replace('#', '');

  // Helper for adding slide footer
  const addSlideFooter = (slideObj: pptxgenjs.Slide, slideData: Slide) => {
    // Bottom subtle border line
    slideObj.addShape(pptx.ShapeType.line, {
      x: 0.8,
      y: 7.0,
      w: 11.7,
      h: 0,
      line: { color: 'CBD5E1', width: 1 }
    });

    // Left footer text
    slideObj.addText(
      `Yadav Medical PPT Generator | MBBS Phase 1 | NMC ${slideData.nmcCompetencyCode || presentation.nmcCompetencyCode}`,
      {
        x: 0.8,
        y: 7.05,
        w: 8.0,
        h: 0.35,
        fontSize: 9,
        color: '64748B',
        fontFace: 'Arial'
      }
    );

    // Right slide number
    slideObj.addText(
      `Slide ${slideData.slideNumber} of ${presentation.totalSlides}`,
      {
        x: 10.0,
        y: 7.05,
        w: 2.5,
        h: 0.35,
        align: 'right',
        fontSize: 9,
        bold: true,
        color: '475569',
        fontFace: 'Arial'
      }
    );

    // Add speaker notes
    const fullNotes = [
      `[SPEAKER NOTES FOR PROFESSOR / LECTURER]:`,
      slideData.speakerNotes || '',
      slideData.haryanviSpeech ? `\n[DR. R S YADAV - LOUD HARYANVI HINDI LECTURE SCRIPT]:\n${slideData.haryanviSpeech}` : '',
      slideData.blackboardCue ? `\n[BLACKBOARD DRAWING CUE]:\n${slideData.blackboardCue}` : '',
      slideData.clinicalPearl ? `\n[CLINICAL PEARL]:\n${slideData.clinicalPearl}` : '',
      slideData.examAlert ? `\n[EXAM ALERT]:\n${slideData.examAlert}` : ''
    ].filter(Boolean).join('\n');

    slideObj.addNotes(fullNotes);
  };

  // Helper to add standard slide header
  const addSlideHeader = (slideObj: pptxgenjs.Slide, slideData: Slide) => {
    // Category pill / badge
    slideObj.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 0.45,
      w: 3.2,
      h: 0.35,
      rectRadius: 0.15,
      fill: { color: secondaryColor },
    });

    slideObj.addText(
      (slideData.categoryLabel || 'NMC-CBME Biochemistry').toUpperCase(),
      {
        x: 0.8,
        y: 0.45,
        w: 3.2,
        h: 0.35,
        fontSize: 9,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        fontFace: 'Arial'
      }
    );

    // NMC Competency tag on the right
    slideObj.addText(
      `NMC: ${slideData.nmcCompetencyCode || presentation.nmcCompetencyCode}`,
      {
        x: 9.5,
        y: 0.45,
        w: 3.0,
        h: 0.35,
        fontSize: 10,
        bold: true,
        align: 'right',
        color: primaryColor,
        fontFace: 'Arial'
      }
    );

    // Slide Title
    slideObj.addText(slideData.title, {
      x: 0.8,
      y: 0.85,
      w: 11.7,
      h: 0.7,
      fontSize: 22,
      bold: true,
      color: primaryColor,
      fontFace: 'Arial'
    });

    // Subtitle if available
    if (slideData.subtitle) {
      slideObj.addText(slideData.subtitle, {
        x: 0.8,
        y: 1.5,
        w: 11.7,
        h: 0.4,
        fontSize: 12,
        italic: true,
        color: mutedTextColor,
        fontFace: 'Arial'
      });
    }
  };

  // GENERATE EACH SLIDE
  for (const slideData of presentation.slides) {
    const slide = pptx.addSlide();
    slide.background = { color: bgLightColor };

    // 1. TITLE SLIDE SPECIAL DESIGN
    if (slideData.category === 'title') {
      // Top header banner
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.33,
        h: 0.4,
        fill: { color: secondaryColor }
      });

      // Decorative central card
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 0.8,
        w: 11.73,
        h: 5.8,
        rectRadius: 0.2,
        fill: { color: 'FFFFFF' },
        line: { color: 'CBD5E1', width: 1.5 }
      });

      // App Badge
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.2,
        y: 1.1,
        w: 4.6,
        h: 0.45,
        rectRadius: 0.15,
        fill: { color: primaryColor }
      });

      slide.addText('YADAV MEDICAL PPT GENERATOR | MBBS', {
        x: 1.2,
        y: 1.1,
        w: 4.6,
        h: 0.45,
        align: 'center',
        fontSize: 11,
        bold: true,
        color: 'FFFFFF',
        fontFace: 'Arial'
      });

      // Competency code pill
      slide.addText(
        `NMC CBME Competency: ${slideData.nmcCompetencyCode || presentation.nmcCompetencyCode}`,
        {
          x: 6.0,
          y: 1.1,
          w: 6.0,
          h: 0.45,
          fontSize: 12,
          bold: true,
          color: secondaryColor,
          fontFace: 'Arial'
        }
      );

      // Main Lecture Title
      slide.addText(slideData.title, {
        x: 1.2,
        y: 1.8,
        w: 10.9,
        h: 1.4,
        fontSize: 28,
        bold: true,
        color: primaryColor,
        fontFace: 'Arial'
      });

      // Subtitle
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 1.2,
          y: 3.2,
          w: 10.9,
          h: 0.5,
          fontSize: 14,
          color: mutedTextColor,
          fontFace: 'Arial'
        });
      }

      // Feature bullet cards on title slide
      const bulletItems = slideData.keyPoints.map((pt, idx) => ({
        text: `  ${pt}`,
        options: {
          fontSize: 12,
          color: darkTextColor,
          bullet: true,
          fontFace: 'Arial'
        }
      }));

      slide.addText(bulletItems, {
        x: 1.2,
        y: 3.8,
        w: 7.2,
        h: 2.2,
        margin: 5
      });

      // Faculty Info Card on the right
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 8.7,
        y: 3.8,
        w: 3.4,
        h: 2.2,
        rectRadius: 0.15,
        fill: { color: bgLightColor },
        line: { color: '94A3B8', width: 1 }
      });

      slide.addText(
        [
          { text: 'FACULTY & SESSION DETAILS\n\n', options: { bold: true, fontSize: 10, color: secondaryColor } },
          { text: `Faculty: `, options: { bold: true, fontSize: 11, color: darkTextColor } },
          { text: `${presentation.authorFaculty}\n`, options: { fontSize: 11, color: mutedTextColor } },
          { text: `Institution: `, options: { bold: true, fontSize: 11, color: darkTextColor } },
          { text: `${presentation.institution}\n`, options: { fontSize: 11, color: mutedTextColor } },
          { text: `Curriculum: `, options: { bold: true, fontSize: 11, color: darkTextColor } },
          { text: `NMC-CBME First MBBS\n`, options: { fontSize: 11, color: mutedTextColor } },
          { text: `Duration: `, options: { bold: true, fontSize: 11, color: darkTextColor } },
          { text: `${presentation.lectureDurationMin} Minutes (${presentation.totalSlides} Slides)`, options: { fontSize: 11, color: mutedTextColor } }
        ],
        {
          x: 8.9,
          y: 3.9,
          w: 3.0,
          h: 2.0,
          fontFace: 'Arial'
        }
      );

      addSlideFooter(slide, slideData);
      continue;
    }

    // STANDARD SLIDE LAYOUT
    addSlideHeader(slide, slideData);

    const contentStartY = slideData.subtitle ? 2.0 : 1.7;

    // Check if slide has Coloured Metabolic Cycle Illustration
    if (slideData.cycleIllustration) {
      const cData = slideData.cycleIllustration;

      // Coloured Cycle Banner Box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: contentStartY,
        w: 11.73,
        h: 0.55,
        rectRadius: 0.1,
        fill: { color: '059669' }
      });

      slide.addText(
        `COLOURED METABOLIC CYCLE: ${cData.name.toUpperCase()}  |  COMPARTMENT: ${cData.cellularCompartments.toUpperCase()}`,
        {
          x: 0.8,
          y: contentStartY,
          w: 11.73,
          h: 0.32,
          fontSize: 9.5,
          bold: true,
          color: 'FFFFFF',
          align: 'center',
          fontFace: 'Arial'
        }
      );

      slide.addText(
        `Standard Medical Textbook Reference: ${cData.textbookSource}`,
        {
          x: 0.8,
          y: contentStartY + 0.3,
          w: 11.73,
          h: 0.22,
          fontSize: 8,
          italic: true,
          color: 'D1FAE5',
          align: 'center',
          fontFace: 'Arial'
        }
      );

      // Render cycle reactions as a process grid
      const rxnCount = Math.min(8, cData.reactions.length);
      const cols = Math.min(4, rxnCount);
      const cardW = (11.73 - (cols - 1) * 0.25) / cols;
      const cardH = rxnCount > 4 ? 1.55 : 2.4;
      const startGridY = contentStartY + 0.7;

      cData.reactions.slice(0, 8).forEach((rxn, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const cX = 0.8 + col * (cardW + 0.25);
        const cY = startGridY + row * (cardH + 0.2);

        const fromNode = cData.nodes.find(n => n.id === rxn.fromId);
        const toNode = cData.nodes.find(n => n.id === rxn.toId);
        const isRateLimiting = rxn.isRateLimiting;

        slide.addShape(pptx.ShapeType.roundRect, {
          x: cX,
          y: cY,
          w: cardW,
          h: cardH,
          rectRadius: 0.12,
          fill: { color: isRateLimiting ? 'FEF2F2' : 'FFFFFF' },
          line: { color: isRateLimiting ? 'EF4444' : 'CBD5E1', pt: isRateLimiting ? 2 : 1 }
        });

        // Step number pill
        slide.addShape(pptx.ShapeType.roundRect, {
          x: cX + 0.1,
          y: cY + 0.1,
          w: 0.75,
          h: 0.25,
          rectRadius: 0.08,
          fill: { color: isRateLimiting ? 'DC2626' : secondaryColor }
        });

        slide.addText(`STEP ${rxn.step}`, {
          x: cX + 0.1,
          y: cY + 0.1,
          w: 0.75,
          h: 0.25,
          fontSize: 7.5,
          bold: true,
          color: 'FFFFFF',
          align: 'center',
          fontFace: 'Arial'
        });

        if (isRateLimiting) {
          slide.addText('PACEMAKER', {
            x: cX + 0.9,
            y: cY + 0.1,
            w: cardW - 1.0,
            h: 0.25,
            fontSize: 7.5,
            bold: true,
            color: 'DC2626',
            fontFace: 'Arial'
          });
        }

        // Substrate -> Product & Enzyme text
        slide.addText(
          [
            { text: `${fromNode?.name || rxn.fromId}\n`, options: { bold: true, fontSize: 8.5, color: darkTextColor } },
            { text: `➔ Enzyme: `, options: { bold: true, fontSize: 7.5, color: '059669' } },
            { text: `${rxn.enzyme}\n`, options: { bold: true, fontSize: 8, color: primaryColor } },
            { text: rxn.coenzyme ? `[${rxn.coenzyme}]\n` : '', options: { fontSize: 7, color: 'D97706' } },
            { text: `➔ Yields: `, options: { bold: true, fontSize: 7.5, color: secondaryColor } },
            { text: `${toNode?.name || rxn.toId}`, options: { bold: true, fontSize: 8.5, color: '065F46' } }
          ],
          {
            x: cX + 0.1,
            y: cY + 0.38,
            w: cardW - 0.2,
            h: cardH - 0.45,
            fontFace: 'Arial'
          }
        );
      });

      // Bottom Viva & Energetics Box
      const vivaY = rxnCount > 4 ? startGridY + 2 * (cardH + 0.2) : startGridY + cardH + 0.2;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: Math.min(6.1, vivaY),
        w: 11.73,
        h: 0.75,
        rectRadius: 0.1,
        fill: { color: 'F0FDF4' },
        line: { color: '10B981', pt: 1 }
      });

      slide.addText(
        [
          { text: `💡 UNIVERSITY VIVA QUESTION: `, options: { bold: true, fontSize: 9, color: '059669' } },
          { text: `${cData.vivaQuestion || 'State the committed rate-limiting enzyme and energetics.'}\n`, options: { fontSize: 8.5, color: '064E3B' } },
          { text: `⚡ ENERGY YIELD: `, options: { bold: true, fontSize: 9, color: 'D97706' } },
          { text: `${cData.totalEnergyYield || 'Equilibrium physiological flux'}`, options: { bold: true, fontSize: 8.5, color: darkTextColor } }
        ],
        {
          x: 1.0,
          y: Math.min(6.1, vivaY) + 0.05,
          w: 11.3,
          h: 0.65,
          fontFace: 'Arial'
        }
      );
    }

    // Check if slide has Biochemical Pathway Data
    else if (slideData.pathwayData && slideData.pathwayData.steps.length > 0) {
      const pData = slideData.pathwayData;

      // Pathway Banner Box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: contentStartY,
        w: 11.73,
        h: 0.5,
        rectRadius: 0.1,
        fill: { color: primaryColor }
      });

      slide.addText(
        `BIOCHEMICAL PATHWAY: ${pData.title.toUpperCase()}  |  CELLULAR LOCATION: ${pData.cellularLocation.toUpperCase()}`,
        {
          x: 0.8,
          y: contentStartY,
          w: 11.73,
          h: 0.5,
          fontSize: 10,
          bold: true,
          color: 'FFFFFF',
          align: 'center',
          fontFace: 'Arial'
        }
      );

      // Render pathway steps as visual process cards
      const stepCount = pData.steps.length;
      const stepWidth = Math.min(3.4, (11.73 - (stepCount - 1) * 0.4) / stepCount);
      const stepY = contentStartY + 0.65;
      const stepHeight = 2.4;

      pData.steps.forEach((step, idx) => {
        const stepX = 0.8 + idx * (stepWidth + 0.4);

        // Step card container
        const isRateLimiting = step.isRateLimiting;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: stepX,
          y: stepY,
          w: stepWidth,
          h: stepHeight,
          rectRadius: 0.15,
          fill: { color: isRateLimiting ? 'FEF2F2' : 'FFFFFF' },
          line: { color: isRateLimiting ? 'EF4444' : 'CBD5E1', width: isRateLimiting ? 2 : 1 }
        });

        // Step number badge
        slide.addShape(pptx.ShapeType.roundRect, {
          x: stepX + 0.15,
          y: stepY + 0.15,
          w: 0.9,
          h: 0.3,
          rectRadius: 0.1,
          fill: { color: isRateLimiting ? 'EF4444' : secondaryColor }
        });
        slide.addText(`STEP ${step.stepNumber}`, {
          x: stepX + 0.15,
          y: stepY + 0.15,
          w: 0.9,
          h: 0.3,
          fontSize: 8,
          bold: true,
          color: 'FFFFFF',
          align: 'center',
          fontFace: 'Arial'
        });

        if (isRateLimiting) {
          slide.addText('RATE-LIMITING', {
            x: stepX + 1.1,
            y: stepY + 0.15,
            w: stepWidth - 1.25,
            h: 0.3,
            fontSize: 8,
            bold: true,
            color: 'DC2626',
            fontFace: 'Arial'
          });
        }

        // Substrate 'From' -> 'To'
        slide.addText(
          [
            { text: 'FROM: ', options: { bold: true, fontSize: 8, color: '64748B' } },
            { text: `${step.from}\n`, options: { bold: true, fontSize: 10, color: darkTextColor } },
            { text: 'ENZYME: ', options: { bold: true, fontSize: 8, color: secondaryColor } },
            { text: `${step.enzyme}\n`, options: { bold: true, fontSize: 10, color: primaryColor } },
            { text: 'COENZYME: ', options: { bold: true, fontSize: 8, color: 'D97706' } },
            { text: `${step.coenzyme || 'None'}\n`, options: { fontSize: 9, color: mutedTextColor } },
            { text: 'TO PRODUCT: ', options: { bold: true, fontSize: 8, color: '059669' } },
            { text: `${step.to}`, options: { bold: true, fontSize: 10, color: '065F46' } }
          ],
          {
            x: stepX + 0.15,
            y: stepY + 0.5,
            w: stepWidth - 0.3,
            h: 1.8,
            fontFace: 'Arial'
          }
        );

        // Arrow between steps
        if (idx < stepCount - 1) {
          slide.addText('➔', {
            x: stepX + stepWidth,
            y: stepY + 0.9,
            w: 0.4,
            h: 0.5,
            fontSize: 18,
            bold: true,
            color: secondaryColor,
            align: 'center',
            fontFace: 'Arial'
          });
        }
      });

      // Pathway notes & Key takeaway below diagram
      const bottomY = stepY + stepHeight + 0.15;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: bottomY,
        w: 11.73,
        h: 1.4,
        rectRadius: 0.15,
        fill: { color: 'FFFFFF' },
        line: { color: 'CBD5E1', width: 1 }
      });

      const keyPointsText = slideData.keyPoints.slice(0, 3).map(pt => ({
        text: `  ${pt}`,
        options: { fontSize: 11, color: darkTextColor, bullet: true, fontFace: 'Arial' }
      }));

      slide.addText(keyPointsText, {
        x: 1.0,
        y: bottomY + 0.1,
        w: 11.3,
        h: 1.2
      });
    }

    // Check if slide has Table Data
    else if (slideData.tableData) {
      const t = slideData.tableData;

      // Left side bullets (if any) or Full width table
      const hasBullets = slideData.keyPoints.length > 0;
      const tableWidth = hasBullets ? 6.5 : 11.73;
      const tableX = hasBullets ? 6.0 : 0.8;

      if (hasBullets) {
        // Bullet card on the left
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: contentStartY,
          w: 5.0,
          h: 4.6,
          rectRadius: 0.15,
          fill: { color: 'FFFFFF' },
          line: { color: 'CBD5E1', width: 1 }
        });

        slide.addText(
          [
            { text: 'KEY TEACHING POINTS\n\n', options: { bold: true, fontSize: 11, color: secondaryColor } },
            ...slideData.keyPoints.map(pt => ({
              text: `  ${pt}\n\n`,
              options: { fontSize: 11, color: darkTextColor, bullet: true, fontFace: 'Arial' }
            }))
          ],
          {
            x: 1.0,
            y: contentStartY + 0.2,
            w: 4.6,
            h: 4.2
          }
        );
      }

      // Build pptx table
      const formattedRows: pptxgenjs.TableRow[] = [];

      // Header row
      formattedRows.push(
        t.headers.map(h => ({
          text: h,
          options: {
            bold: true,
            fontSize: 10,
            color: 'FFFFFF',
            fill: { color: primaryColor },
            align: 'center',
            fontFace: 'Arial'
          }
        }))
      );

      // Data rows
      t.rows.forEach((row, rIdx) => {
        formattedRows.push(
          row.map(cell => ({
            text: cell,
            options: {
              fontSize: 10,
              color: darkTextColor,
              fill: { color: rIdx % 2 === 0 ? 'FFFFFF' : bgLightColor },
              fontFace: 'Arial'
            }
          }))
        );
      });

      slide.addTable(formattedRows, {
        x: tableX,
        y: contentStartY,
        w: tableWidth,
        h: 3.8,
        colW: undefined,
        border: { color: 'CBD5E1', pt: 1 }
      });

      // Callout box below table if space permits
      if (slideData.clinicalPearl || slideData.examAlert) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: tableX,
          y: contentStartY + 3.9,
          w: tableWidth,
          h: 0.7,
          rectRadius: 0.1,
          fill: { color: slideData.examAlert ? 'FEF2F2' : 'F0FDF4' },
          line: { color: slideData.examAlert ? 'EF4444' : '10B981', width: 1 }
        });

        slide.addText(
          slideData.examAlert || slideData.clinicalPearl || '',
          {
            x: tableX + 0.15,
            y: contentStartY + 3.95,
            w: tableWidth - 0.3,
            h: 0.6,
            fontSize: 10,
            bold: true,
            color: slideData.examAlert ? '991B1B' : '065F46',
            fontFace: 'Arial'
          }
        );
      }
    }

    // Check if slide has Clinical Case Data
    else if (slideData.caseStudy) {
      const c = slideData.caseStudy;

      // Case presentation card (Left)
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: contentStartY,
        w: 5.6,
        h: 4.6,
        rectRadius: 0.15,
        fill: { color: 'FFFFFF' },
        line: { color: 'CBD5E1', width: 1 }
      });

      slide.addText(
        [
          { text: 'PATIENT CASE PRESENTATION\n', options: { bold: true, fontSize: 11, color: secondaryColor } },
          { text: `Patient: `, options: { bold: true, fontSize: 10, color: darkTextColor } },
          { text: `${c.patientAge}, ${c.gender}\n`, options: { fontSize: 10, color: mutedTextColor } },
          { text: `Chief Complaint: `, options: { bold: true, fontSize: 10, color: darkTextColor } },
          { text: `${c.chiefComplaint}\n\n`, options: { fontSize: 10, color: mutedTextColor } },
          { text: `History: `, options: { bold: true, fontSize: 10, color: darkTextColor } },
          { text: `${c.historyOfPresentIllness}\n\n`, options: { fontSize: 10, color: mutedTextColor } },
          { text: `Vital Signs: \n`, options: { bold: true, fontSize: 10, color: secondaryColor } },
          ...Object.entries(c.vitals).map(([k, v]) => ({
            text: `  • ${k}: ${v}\n`,
            options: { fontSize: 9, color: darkTextColor }
          }))
        ],
        {
          x: 1.0,
          y: contentStartY + 0.15,
          w: 5.2,
          h: 4.3,
          fontFace: 'Arial'
        }
      );

      // Lab Panel Table (Right)
      const labRows: pptxgenjs.TableRow[] = [
        [
          { text: 'Test', options: { bold: true, fontSize: 9, fill: { color: primaryColor }, color: 'FFFFFF' } },
          { text: 'Result', options: { bold: true, fontSize: 9, fill: { color: primaryColor }, color: 'FFFFFF' } },
          { text: 'Normal', options: { bold: true, fontSize: 9, fill: { color: primaryColor }, color: 'FFFFFF' } },
          { text: 'Biochemical Inference', options: { bold: true, fontSize: 9, fill: { color: primaryColor }, color: 'FFFFFF' } }
        ]
      ];

      c.labFindings.slice(0, 5).forEach((item, idx) => {
        labRows.push([
          { text: item.test, options: { fontSize: 8.5, color: darkTextColor, fill: { color: idx % 2 === 0 ? 'FFFFFF' : bgLightColor } } },
          { text: item.patientValue, options: { bold: true, fontSize: 8.5, color: 'B91C1C', fill: { color: idx % 2 === 0 ? 'FFFFFF' : bgLightColor } } },
          { text: item.normalValue, options: { fontSize: 8.5, color: mutedTextColor, fill: { color: idx % 2 === 0 ? 'FFFFFF' : bgLightColor } } },
          { text: item.inference, options: { fontSize: 8.5, color: '15803D', fill: { color: idx % 2 === 0 ? 'FFFFFF' : bgLightColor } } }
        ]);
      });

      slide.addTable(labRows, {
        x: 6.7,
        y: contentStartY,
        w: 5.8,
        h: 2.7,
        border: { color: 'CBD5E1', pt: 1 }
      });

      // Diagnosis and Management Box (Right Bottom)
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 6.7,
        y: contentStartY + 2.85,
        w: 5.8,
        h: 1.75,
        rectRadius: 0.15,
        fill: { color: 'FFFFFF' },
        line: { color: secondaryColor, width: 1.5 }
      });

      slide.addText(
        [
          { text: `DIAGNOSIS: `, options: { bold: true, fontSize: 10, color: 'B91C1C' } },
          { text: `${c.diagnosis}\n\n`, options: { bold: true, fontSize: 10, color: primaryColor } },
          { text: `EMERGENCY MANAGEMENT:\n`, options: { bold: true, fontSize: 9, color: secondaryColor } },
          ...c.management.slice(0, 2).map(m => ({
            text: `• ${m}\n`,
            options: { fontSize: 8.5, color: darkTextColor }
          }))
        ],
        {
          x: 6.9,
          y: contentStartY + 2.95,
          w: 5.4,
          h: 1.55,
          fontFace: 'Arial'
        }
      );
    }

    // Check if slide has MCQs
    else if (slideData.mcqs && slideData.mcqs.length > 0) {
      const q = slideData.mcqs[0];

      // Question Card
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: contentStartY,
        w: 11.73,
        h: 1.4,
        rectRadius: 0.15,
        fill: { color: 'FFFFFF' },
        line: { color: secondaryColor, width: 1.5 }
      });

      slide.addText(
        [
          { text: 'NExT / NEET-PG CLINICAL VIGNETTE QUESTION:\n', options: { bold: true, fontSize: 11, color: secondaryColor } },
          { text: q.question, options: { bold: true, fontSize: 12, color: darkTextColor } }
        ],
        {
          x: 1.1,
          y: contentStartY + 0.15,
          w: 11.1,
          h: 1.1,
          fontFace: 'Arial'
        }
      );

      // Options Grid (4 options in 2x2 grid)
      q.options.forEach((opt, optIdx) => {
        const isCorrect = optIdx === q.correctAnswerIndex;
        const col = optIdx % 2;
        const row = Math.floor(optIdx / 2);
        const optX = 0.8 + col * 5.95;
        const optY = contentStartY + 1.6 + row * 0.75;

        slide.addShape(pptx.ShapeType.roundRect, {
          x: optX,
          y: optY,
          w: 5.75,
          h: 0.65,
          rectRadius: 0.1,
          fill: { color: isCorrect ? 'DCFCE7' : 'FFFFFF' },
          line: { color: isCorrect ? '16A34A' : 'CBD5E1', width: isCorrect ? 1.5 : 1 }
        });

        slide.addText(opt, {
          x: optX + 0.2,
          y: optY + 0.1,
          w: 5.35,
          h: 0.45,
          fontSize: 11,
          bold: isCorrect,
          color: isCorrect ? '166534' : darkTextColor,
          fontFace: 'Arial'
        });
      });

      // Explanation Box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: contentStartY + 3.25,
        w: 11.73,
        h: 1.35,
        rectRadius: 0.15,
        fill: { color: bgLightColor },
        line: { color: 'CBD5E1', width: 1 }
      });

      slide.addText(
        [
          { text: `CORRECT ANSWER: ${q.options[q.correctAnswerIndex]}  ✓\n`, options: { bold: true, fontSize: 11, color: '166534' } },
          { text: `RATIONALE: ${q.explanation}\n`, options: { fontSize: 10, color: darkTextColor } },
          { text: `HIGH-YIELD FACT: ${q.highYieldFact}`, options: { bold: true, fontSize: 10, color: secondaryColor } }
        ],
        {
          x: 1.1,
          y: contentStartY + 3.35,
          w: 11.1,
          h: 1.15,
          fontFace: 'Arial'
        }
      );
    }

    // DEFAULT STANDARD CONTENT SLIDE: 2-COLUMN OR 3-CARD LAYOUT
    else {
      // Main Content Card
      const cardHeight = (slideData.clinicalPearl || slideData.examAlert) ? 3.4 : 4.6;

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: contentStartY,
        w: 11.73,
        h: cardHeight,
        rectRadius: 0.15,
        fill: { color: 'FFFFFF' },
        line: { color: 'CBD5E1', width: 1 }
      });

      // Format bullet points nicely
      const bulletElements = slideData.keyPoints.map(pt => ({
        text: `  ${pt}\n\n`,
        options: {
          fontSize: 13,
          color: darkTextColor,
          bullet: true,
          fontFace: 'Arial'
        }
      }));

      slide.addText(bulletElements, {
        x: 1.2,
        y: contentStartY + 0.3,
        w: 10.9,
        h: cardHeight - 0.6
      });

      // Clinical Pearl or Exam Alert Box below
      if (slideData.clinicalPearl || slideData.examAlert) {
        const isExamAlert = Boolean(slideData.examAlert);
        const calloutY = contentStartY + cardHeight + 0.2;
        const calloutH = 1.0;

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: calloutY,
          w: 11.73,
          h: calloutH,
          rectRadius: 0.15,
          fill: { color: isExamAlert ? 'FEF2F2' : 'F0FDF4' },
          line: { color: isExamAlert ? 'EF4444' : '10B981', width: 1.5 }
        });

        slide.addText(
          [
            {
              text: isExamAlert ? '⚡ EXAM ALERT & HIGH-YIELD POINT: ' : '💡 HIGH-YIELD CLINICAL PEARL: ',
              options: { bold: true, fontSize: 11, color: isExamAlert ? 'DC2626' : '059669' }
            },
            {
              text: slideData.examAlert || slideData.clinicalPearl || '',
              options: { fontSize: 11, color: isExamAlert ? '991B1B' : '065F46' }
            }
          ],
          {
            x: 1.2,
            y: calloutY + 0.15,
            w: 10.9,
            h: calloutH - 0.3,
            fontFace: 'Arial'
          }
        );
      }
    }

    addSlideFooter(slide, slideData);
  }

  // Write file to user browser
  const filename = `${presentation.nmcCompetencyCode}_${presentation.topic.replace(/[^a-zA-Z0-9]/g, '_')}_Yadav_Medical_PPT.pptx`;
  await pptx.writeFile({ fileName: filename });
}
