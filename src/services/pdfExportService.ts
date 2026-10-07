import jsPDF from 'jspdf';
import { PresentationData } from '../types/ppt';
import { THEMES } from '../data/themes';

export async function exportToPDF(presentation: PresentationData): Promise<void> {
  // 16:9 aspect ratio in landscape: 297mm x 167mm or standard A4 landscape 297 x 210
  // Standard 16:9 presentation dimensions in mm: 297 x 167.06
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [297, 167.06]
  });

  const theme = THEMES[presentation.theme] || THEMES.navy;

  const total = presentation.slides.length;

  presentation.slides.forEach((slide, idx) => {
    if (idx > 0) {
      pdf.addPage([297, 167.06], 'landscape');
    }

    // Background
    pdf.setFillColor(248, 250, 252); // slate 50
    pdf.rect(0, 0, 297, 167.06, 'F');

    // Header bar
    pdf.setFillColor(15, 32, 66); // primary
    pdf.rect(12, 10, 4, 18, 'F');

    // Badge
    pdf.setFillColor(2, 132, 199);
    pdf.roundedRect(20, 10, 60, 6, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text((slide.categoryLabel || 'NMC-CBME BIOCHEMISTRY').toUpperCase(), 22, 14.5);

    // NMC tag on right
    pdf.setTextColor(15, 32, 66);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`NMC: ${slide.nmcCompetencyCode || presentation.nmcCompetencyCode}`, 285, 14.5, { align: 'right' });

    // Title
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    // Truncate or wrap title if too long
    const titleLines = pdf.splitTextToSize(slide.title, 260);
    pdf.text(titleLines.slice(0, 2), 20, 21);

    // Subtitle
    if (slide.subtitle) {
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.text(slide.subtitle, 20, 31);
    }

    // Main Card
    const cardTop = slide.subtitle ? 36 : 32;
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(14, cardTop, 269, 100, 3, 3, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(14, cardTop, 269, 100, 3, 3, 'S');

    // Key points
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 41, 59);

    let yPos = cardTop + 10;
    slide.keyPoints.slice(0, 5).forEach((point) => {
      pdf.setFillColor(2, 132, 199);
      pdf.circle(20, yPos - 1.2, 1.2, 'F');
      const wrapped = pdf.splitTextToSize(point, 245);
      pdf.text(wrapped, 25, yPos);
      yPos += wrapped.length * 6 + 4;
    });

    // Clinical Pearl / Exam alert banner at bottom of card
    if (slide.clinicalPearl || slide.examAlert) {
      const isAlert = Boolean(slide.examAlert);
      pdf.setFillColor(isAlert ? 254 : 240, isAlert ? 242 : 253, isAlert ? 242 : 244);
      pdf.roundedRect(18, cardTop + 78, 261, 16, 2, 2, 'F');
      pdf.setDrawColor(isAlert ? 239 : 16, isAlert ? 68 : 185, isAlert ? 68 : 129);
      pdf.roundedRect(18, cardTop + 78, 261, 16, 2, 2, 'S');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(isAlert ? 185 : 5, isAlert ? 28 : 150, isAlert ? 28 : 105);
      pdf.text(isAlert ? 'EXAM ALERT: ' : 'CLINICAL PEARL: ', 22, cardTop + 85);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(isAlert ? 153 : 6, isAlert ? 27 : 95, isAlert ? 27 : 70);
      const pearlText = pdf.splitTextToSize(slide.examAlert || slide.clinicalPearl || '', 210);
      pdf.text(pearlText.slice(0, 2), 48, cardTop + 85);
    }

    // Footer
    pdf.setDrawColor(203, 213, 225);
    pdf.line(14, 154, 283, 154);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Yadav Medical PPT Generator for MBBS | NMC-CBME Curriculum | Slide ${slide.slideNumber} of ${total}`, 14, 160);

    pdf.setFont('helvetica', 'bold');
    pdf.text(presentation.authorFaculty || 'Dr. R. S. Yadav', 283, 160, { align: 'right' });
  });

  const filename = `${presentation.nmcCompetencyCode}_${presentation.topic.replace(/[^a-zA-Z0-9]/g, '_')}_Presentation.pdf`;
  pdf.save(filename);
}
