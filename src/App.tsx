/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PresentationData, PresentationTheme, NMCCompetency, Slide } from './types/ppt';
import { generateFullMedicalDeck } from './data/presentationGenerator';
import { NMC_BIOCHEMISTRY_COMPETENCIES } from './data/nmcCompetencies';
import { exportToPPTX } from './services/pptxExportService';
import { exportToPDF } from './services/pdfExportService';
import { Navbar } from './components/Navbar';
import { GeneratorHero } from './components/GeneratorHero';
import { SlideViewer } from './components/SlideViewer';
import { SlideListSidebar } from './components/SlideListSidebar';
import { CompetencySelector } from './components/CompetencySelector';
import { PresenterModeModal } from './components/PresenterModeModal';
import { ReferenceModal } from './components/ReferenceModal';
import { SlideEditorModal } from './components/SlideEditorModal';
import { ShareModal } from './components/ShareModal';
import {
  Sparkles,
  BookOpen,
  Download,
  FileDown,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Share2
} from 'lucide-react';

export default function App() {
  // Presentation State: Start with high-yield BI4.3 Ketogenesis & DKA pre-loaded
  const [presentation, setPresentation] = useState<PresentationData>(() =>
    generateFullMedicalDeck({
      competencyCode: 'BI4.3',
      topic: 'Ketogenesis, Ketolysis and the Biochemical Cascade of Diabetic Ketoacidosis (DKA)',
      lectureDurationMin: 45,
      slideCount: 33,
      theme: 'navy',
      authorFaculty: 'Dr. R. S. Yadav, MD (Biochemistry)',
      institution: 'Department of Biochemistry, Medical College & Hospital',
    })
  );

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('Ketogenesis, Ketolysis and the Biochemical Cascade of Diabetic Ketoacidosis (DKA)');
  const [selectedCompetencyCode, setSelectedCompetencyCode] = useState('BI4.3');
  const [lectureDuration, setLectureDuration] = useState(45);
  const [slideCount, setSlideCount] = useState(33);
  const [selectedTheme, setSelectedTheme] = useState<PresentationTheme>('navy');
  const [authorFaculty, setAuthorFaculty] = useState('Dr. R. S. Yadav, MD (Biochemistry)');
  const [institution, setInstitution] = useState('Department of Biochemistry, Medical College & Hospital');
  const [customPrompt, setCustomPrompt] = useState('');

  // UI Modals & Panels
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCompetencyBrowser, setShowCompetencyBrowser] = useState(false);
  const [showPresenterMode, setShowPresenterMode] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Generate Deck Handler
  const handleGenerate = async () => {
    setIsGenerating(true);
    setToastMessage({ type: 'info', text: `Assembling ${slideCount} NMC Curriculum slides for ${selectedCompetencyCode}...` });

    try {
      // First try AI server enrichment if available
      let enrichedPrompt = customPrompt;
      try {
        const response = await fetch('/api/generate-ppt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: selectedTopic,
            competencyCode: selectedCompetencyCode,
            lectureDuration: lectureDuration,
            customPrompt: customPrompt,
          }),
        });
        const resData = await response.json();
        if (resData.success && resData.data?.enhancedTitle) {
          // AI enrichment received
          enrichedPrompt = customPrompt + ' ' + (resData.data.clinicalHook || '');
        }
      } catch (e) {
        // Fallback to built-in clinical curriculum generator
      }

      // Generate the full structured presentation
      const newDeck = generateFullMedicalDeck({
        competencyCode: selectedCompetencyCode,
        topic: selectedTopic,
        customPrompt: enrichedPrompt,
        lectureDurationMin: lectureDuration,
        slideCount: slideCount,
        theme: selectedTheme,
        authorFaculty: authorFaculty,
        institution: institution,
      });

      setPresentation(newDeck);
      setCurrentSlideIndex(0);
      showToast(`Successfully generated ${newDeck.totalSlides} slides for ${newDeck.title}!`, 'success');

      // Smooth scroll to slide preview
      const previewEl = document.getElementById('slide-preview-section');
      if (previewEl) {
        previewEl.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error during generation. Loaded standard curriculum deck.', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  // Competency Selection
  const handleSelectCompetency = (comp: NMCCompetency) => {
    setSelectedCompetencyCode(comp.code);
    setSelectedTopic(comp.defaultLectureTitle);
    setShowCompetencyBrowser(false);
    showToast(`Selected NMC ${comp.code}: ${comp.subTopic}`);
  };

  const handleGenerateWithCompetency = (comp: NMCCompetency) => {
    setSelectedCompetencyCode(comp.code);
    setSelectedTopic(comp.defaultLectureTitle);
    setShowCompetencyBrowser(false);

    const newDeck = generateFullMedicalDeck({
      competencyCode: comp.code,
      topic: comp.defaultLectureTitle,
      lectureDurationMin: lectureDuration,
      slideCount: slideCount,
      theme: selectedTheme,
      authorFaculty: authorFaculty,
      institution: institution,
    });

    setPresentation(newDeck);
    setCurrentSlideIndex(0);
    showToast(`Generated ${newDeck.totalSlides} slides for NMC ${comp.code}!`, 'success');

    const previewEl = document.getElementById('slide-preview-section');
    if (previewEl) {
      previewEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // PPTX Export
  const handleDownloadPPTX = async () => {
    showToast('Preparing 16:9 PowerPoint file (.pptx) with native shapes & notes...', 'info');
    try {
      await exportToPPTX(presentation);
      showToast('PowerPoint (.pptx) file downloaded successfully!', 'success');
    } catch (error: any) {
      console.error('PPTX export error:', error);
      showToast('Failed to export PPTX. Please retry.', 'info');
    }
  };

  // PDF Export
  const handleExportPDF = async () => {
    showToast('Exporting high-resolution 16:9 presentation PDF...', 'info');
    try {
      await exportToPDF(presentation);
      showToast('PDF file downloaded successfully!', 'success');
    } catch (error: any) {
      console.error('PDF export error:', error);
      showToast('Failed to export PDF. Please retry.', 'info');
    }
  };

  // Theme Change Handler
  const handleThemeChange = (newTheme: PresentationTheme) => {
    setSelectedTheme(newTheme);
    setPresentation(prev => ({
      ...prev,
      theme: newTheme,
    }));
    showToast(`Applied ${newTheme.toUpperCase()} medical theme.`);
  };

  // Slide Save Handler
  const handleSaveSlide = (updatedSlide: Slide) => {
    setPresentation(prev => {
      const slides = [...prev.slides];
      const idx = slides.findIndex(s => s.id === updatedSlide.id);
      if (idx !== -1) {
        slides[idx] = updatedSlide;
      }
      return { ...prev, slides };
    });
    showToast(`Slide ${updatedSlide.slideNumber} updated!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs sm:text-sm font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-emerald-950/50'
                : 'bg-sky-950/90 border-sky-500/60 text-sky-200 shadow-sky-950/50'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentTheme={selectedTheme}
        onThemeChange={handleThemeChange}
        onOpenGenerator={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDownloadPPTX={handleDownloadPPTX}
        onExportPDF={handleExportPDF}
        onOpenPresenterMode={() => setShowPresenterMode(true)}
        onOpenReferences={() => setShowReferenceModal(true)}
        onOpenShareModal={() => setShowShareModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Generator Hero & Controls */}
        <GeneratorHero
          selectedTopic={selectedTopic}
          selectedCompetencyCode={selectedCompetencyCode}
          lectureDuration={lectureDuration}
          slideCount={slideCount}
          selectedTheme={selectedTheme}
          authorFaculty={authorFaculty}
          institution={institution}
          customPrompt={customPrompt}
          isGenerating={isGenerating}
          onTopicChange={setSelectedTopic}
          onCompetencyCodeChange={setSelectedCompetencyCode}
          onDurationChange={setLectureDuration}
          onSlideCountChange={setSlideCount}
          onThemeChange={handleThemeChange}
          onFacultyChange={setAuthorFaculty}
          onInstitutionChange={setInstitution}
          onCustomPromptChange={setCustomPrompt}
          onGenerate={handleGenerate}
          onPreview={() => {
            const previewEl = document.getElementById('slide-preview-section');
            if (previewEl) previewEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onDownloadPPTX={handleDownloadPPTX}
          onExportPDF={handleExportPDF}
          onBrowseCompetencies={() => setShowCompetencyBrowser(prev => !prev)}
          onOpenShareModal={() => setShowShareModal(true)}
        />

        {/* Collapsible NMC CBME Competency Drawer */}
        <div className="w-full">
          <button
            onClick={() => setShowCompetencyBrowser(prev => !prev)}
            className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 transition flex items-center justify-between text-left text-xs sm:text-sm shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-sky-400" />
              <div>
                <strong className="text-white block font-bold">
                  Browse Official NMC-CBME Biochemistry Competencies (BI1 to BI11)
                </strong>
                <span className="text-slate-400 text-xs">
                  Instant 1-click lecture generation for Glycolysis, Ketogenesis, PKU, Urea Cycle, Gout, DNA Repair, etc.
                </span>
              </div>
            </div>
            {showCompetencyBrowser ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {showCompetencyBrowser && (
            <div className="mt-3 animate-fadeIn">
              <CompetencySelector
                selectedCompetencyCode={selectedCompetencyCode}
                onSelectCompetency={handleSelectCompetency}
                onGenerateWithCompetency={handleGenerateWithCompetency}
              />
            </div>
          )}
        </div>

        {/* Live Presentation Preview & Slide Workspace */}
        <section id="slide-preview-section" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {presentation.nmcCompetencyCode}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white truncate max-w-xl">
                  {presentation.title}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Total Slides: {presentation.totalSlides} • Classroom Projector 16:9 Ratio • Faculty: {presentation.authorFaculty}
              </p>
            </div>

            {/* Quick Export Strip */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPPTX}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download .PPTX</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
              >
                <FileDown className="w-4 h-4 text-rose-400" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Dual Panel: Main Slide Canvas & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Main: 16:9 Interactive Slide Viewer */}
            <div className="lg:col-span-8 xl:col-span-9 w-full">
              <SlideViewer
                presentation={presentation}
                currentSlideIndex={currentSlideIndex}
                onSlideChange={setCurrentSlideIndex}
                onOpenPresenterMode={() => setShowPresenterMode(true)}
                onEditSlide={(slide) => setEditingSlide(slide)}
              />
            </div>

            {/* Right: Slide List Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3 w-full h-[640px]">
              <SlideListSidebar
                presentation={presentation}
                currentSlideIndex={currentSlideIndex}
                onSelectSlide={setCurrentSlideIndex}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-950 border-t border-slate-800 py-6 text-slate-400 text-xs text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="font-semibold text-slate-300">Yadav Medical PPT Generator for MBBS</span>
          <span>•</span>
          <button
            onClick={() => setShowShareModal(true)}
            className="text-emerald-400 hover:text-emerald-300 underline font-semibold flex items-center gap-1"
          >
            <span>Public Freeware Access Link (100% Free)</span>
          </button>
          <span>•</span>
          <span>National Medical Commission (NMC) Competency-Based Medical Education (CBME)</span>
          <span>•</span>
          <button
            onClick={() => setShowReferenceModal(true)}
            className="text-sky-400 hover:text-sky-300 underline font-semibold"
          >
            Verified Textbooks & Disclosure
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Completely free freeware, API key pre-merged, no login required. Downloaded PowerPoint (.pptx) presentations can be edited freely in Microsoft PowerPoint, Apple Keynote, and Google Slides.
        </p>
      </footer>

      {/* Freeware Public Sharing Modal */}
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}

      {/* Presenter Mode Modal */}
      {showPresenterMode && (
        <PresenterModeModal
          presentation={presentation}
          initialSlideIndex={currentSlideIndex}
          onClose={() => setShowPresenterMode(false)}
          onSelectSlide={setCurrentSlideIndex}
        />
      )}

      {/* Reference & Integrity Modal */}
      {showReferenceModal && (
        <ReferenceModal
          references={presentation.verifiedReferences}
          onClose={() => setShowReferenceModal(false)}
        />
      )}

      {/* Slide Editor Modal */}
      {editingSlide && (
        <SlideEditorModal
          slide={editingSlide}
          onSave={handleSaveSlide}
          onClose={() => setEditingSlide(null)}
        />
      )}
    </div>
  );
}
