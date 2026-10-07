import React, { useState, useEffect } from 'react';
import { Slide, PresentationData, PresentationTheme } from '../types/ppt';
import { THEMES } from '../data/themes';
import { VisualDiagramRenderer } from './VisualDiagramRenderer';
import { MetabolicCycleDiagram } from './MetabolicCycleDiagram';
import { AutoSpeakController } from './AutoSpeakController';
import { speechService, SpeechMode } from '../services/speechService';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  PenTool,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Stethoscope,
  BookOpen,
  Volume2,
  Radio,
  Mic,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface Props {
  presentation: PresentationData;
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  onOpenPresenterMode: () => void;
  onEditSlide?: (slide: Slide) => void;
}

export const SlideViewer: React.FC<Props> = ({
  presentation,
  currentSlideIndex,
  onSlideChange,
  onOpenPresenterMode,
  onEditSlide,
}) => {
  const [showNotes, setShowNotes] = useState(true);
  const [showBlackboard, setShowBlackboard] = useState(false);
  const [showAutoSpeak, setShowAutoSpeak] = useState(true);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true);
  const [speechMode, setSpeechMode] = useState<SpeechMode>('haryanvi');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMcqAnswer, setSelectedMcqAnswer] = useState<number | null>(null);

  const slide = presentation.slides[currentSlideIndex] || presentation.slides[0];
  const theme = THEMES[presentation.theme] || THEMES.navy;
  const totalSlides = presentation.slides.length;

  const speakCurrentSlideNotes = (modeToUse: SpeechMode = speechMode) => {
    speechService.speakSlide(slide, {
      mode: modeToUse,
      volume,
      rate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else {
      speakCurrentSlideNotes();
    }
  };

  const toggleFullscreen = () => {
    const element = document.getElementById('slide-viewport');
    if (!element) return;

    if (!document.fullscreenElement) {
      // Entering fullscreen projection: prepare auto-speak
      setAutoSpeakEnabled(true);
      element.requestFullscreen().catch((err) => {
        console.warn('Could not enter fullscreen:', err);
        // Fallback: still speak if fullscreen API is restricted in iframe
        setIsFullscreen(true);
        speakCurrentSlideNotes();
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      if (isNowFullscreen) {
        // Immediately start auto-speaking attached speaker notes upon full screen projection!
        setAutoSpeakEnabled(true);
        const timer = setTimeout(() => {
          speakCurrentSlideNotes();
        }, 120);
        return () => clearTimeout(timer);
      } else {
        speechService.stop();
        setIsSpeaking(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [slide, speechMode, volume, rate]);

  // Auto-speak on slide navigation if fullscreen projection or auto-speak is enabled
  useEffect(() => {
    if (autoSpeakEnabled || isFullscreen) {
      const timer = setTimeout(() => {
        speakCurrentSlideNotes();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentSlideIndex]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        if (currentSlideIndex < totalSlides - 1) onSlideChange(currentSlideIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSlideIndex > 0) onSlideChange(currentSlideIndex - 1);
      } else if (e.key === 'p' || e.key === 'P') {
        setShowNotes(prev => !prev);
      } else if (e.key === 'b' || e.key === 'B') {
        setShowBlackboard(prev => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, totalSlides, onSlideChange]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  // Reset MCQ selection on slide change
  useEffect(() => {
    setSelectedMcqAnswer(null);
  }, [currentSlideIndex]);

  return (
    <div className="flex flex-col w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Slide Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSlideChange(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition"
              title="Previous Slide (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-300 px-2 py-1 bg-slate-950 rounded-md border border-slate-800">
              {currentSlideIndex + 1} / {totalSlides}
            </span>
            <button
              onClick={() => onSlideChange(Math.min(totalSlides - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === totalSlides - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition"
              title="Next Slide (Right Arrow or Space)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-semibold border border-sky-800/60">
              {slide.nmcCompetencyCode || presentation.nmcCompetencyCode}
            </span>
            <span className="truncate max-w-xs font-medium text-slate-300">
              {slide.categoryLabel}
            </span>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Auto Speak Loud Haryanvi Professor Toggle */}
          <button
            onClick={() => setShowAutoSpeak(!showAutoSpeak)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
              showAutoSpeak
                ? 'bg-rose-600/30 border-rose-500 text-rose-300 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle Loud Haryanvi Hindi Professor Auto Speak"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Auto Speak (Dr. R S Yadav)</span>
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              showNotes
                ? 'bg-sky-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Toggle Speaker Notes for Lecture (Shortcut: P)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Speaker Notes</span>
          </button>

          <button
            onClick={() => setShowBlackboard(!showBlackboard)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              showBlackboard
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Toggle Blackboard Drawing Cue (Shortcut: B)"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Chalkboard Cue</span>
          </button>

          <button
            onClick={onOpenPresenterMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition shadow-sm"
            title="Open Fullscreen Medical Presenter Console"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Presenter Mode</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Fullscreen 16:9 Projector Mode (Shortcut: F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 16:9 Slide Canvas */}
      <div
        id="slide-viewport"
        className="relative w-full aspect-video bg-slate-900 flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto"
        style={{
          backgroundColor: isFullscreen ? '#020617' : undefined,
        }}
      >
        {/* Fullscreen Projection Microphone & Audio HUD */}
        {isFullscreen && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 bg-slate-950/95 border border-slate-700/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition ${
                  isSpeaking
                    ? 'bg-gradient-to-tr from-rose-600 via-amber-500 to-red-600 text-white animate-pulse ring-2 ring-rose-400 shadow-lg shadow-rose-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <span>Microphone: Auto-Speaking</span>
                  {isSpeaking ? (
                    <span className="flex gap-0.5 items-end h-3">
                      <span className="w-1 h-2 bg-emerald-400 animate-bounce"></span>
                      <span className="w-1 h-3.5 bg-emerald-400 animate-bounce delay-75"></span>
                      <span className="w-1 h-2 bg-emerald-400 animate-bounce delay-150"></span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-semibold">(Paused)</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-300 block">
                  {speechMode === 'haryanvi'
                    ? `Dr. R S Yadav (Loud Haryanvi Hindi) • Slide ${slide.slideNumber} of ${totalSlides}`
                    : `Attached Notes • Slide ${slide.slideNumber} of ${totalSlides}`}
                </span>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-750 mx-1" />

            {/* Play / Pause Voice */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md ${
                isSpeaking
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title={isSpeaking ? 'Pause Voice' : 'Resume Speaking Slide Notes'}
            >
              {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isSpeaking ? 'Pause' : 'Speak'}</span>
            </button>

            {/* Replay Current Notes */}
            <button
              onClick={() => speakCurrentSlideNotes(speechMode)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition"
              title="Replay Current Slide Notes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Mode switch */}
            <button
              onClick={() => {
                const nextMode: SpeechMode = speechMode === 'haryanvi' ? 'speaker_notes' : 'haryanvi';
                setSpeechMode(nextMode);
                speakCurrentSlideNotes(nextMode);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-[11px] font-bold text-rose-300 border border-slate-700 transition"
              title="Toggle between Dr. R S Yadav Loud Haryanvi Hindi and Verbatim Attached Speaker Notes"
            >
              {speechMode === 'haryanvi' ? '📢 Haryanvi Hindi' : '🎙️ Attached Notes'}
            </button>

            {/* Slide Navigation in Fullscreen Projection */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5 ml-1">
              <button
                onClick={() => onSlideChange(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
                className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 text-slate-300 transition"
                title="Previous Slide (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-300 px-1.5">
                {currentSlideIndex + 1}/{totalSlides}
              </span>
              <button
                onClick={() => onSlideChange(Math.min(totalSlides - 1, currentSlideIndex + 1))}
                disabled={currentSlideIndex === totalSlides - 1}
                className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 text-slate-300 transition"
                title="Next Slide (Right Arrow or Space)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Exit Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 transition ml-1"
              title="Exit Fullscreen (Esc or F)"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Fullscreen Teleprompter / Caption Overlay for Spoken Speaker Notes */}
        {isFullscreen && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-4xl w-[90%] bg-slate-950/95 border border-slate-700/80 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full shrink-0 ${isSpeaking ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold tracking-wider text-rose-400 flex items-center justify-between">
                <span>{speechMode === 'haryanvi' ? '📢 Dr. R S Yadav (Loud Haryanvi Hindi Teaching):' : '🎙️ Attached Speaker Notes:'}</span>
                <span className="text-slate-400">Classroom Projection Audio</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 font-medium line-clamp-2 mt-0.5">
                {speechMode === 'haryanvi'
                  ? (slide.haryanviSpeech || slide.speakerNotes)
                  : slide.speakerNotes}
              </p>
            </div>
          </div>
        )}

        {/* Slide Header */}
        <div className="w-full">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-sm"
                style={{ backgroundColor: theme.secondary }}
              >
                {slide.categoryLabel || 'NMC-CBME Biochemistry'}
              </span>
              <span className="text-xs font-mono font-semibold text-slate-400">
                NMC: {slide.nmcCompetencyCode || presentation.nmcCompetencyCode}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-400">
              MBBS Phase 1 • {presentation.authorFaculty}
            </div>
          </div>

          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight"
            style={{ color: '#F8FAFC' }}
          >
            {slide.title}
          </h2>

          {slide.subtitle && (
            <p className="text-sm sm:text-base font-medium text-slate-300 mt-1 italic">
              {slide.subtitle}
            </p>
          )}
        </div>

        {/* Dynamic Center Content by Slide Type */}
        <div className="my-auto py-4 w-full">
          {/* TITLE SLIDE SPECIAL VIEW */}
          {slide.category === 'title' && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <div className="inline-block px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold uppercase">
                    National Medical Commission (NMC) CBME Curriculum
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {presentation.nmcCompetencyDescription}
                  </h3>
                  <div className="space-y-1.5 pt-2">
                    {slide.keyPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-700 space-y-3 text-xs">
                  <div className="text-sky-400 font-bold uppercase tracking-wider">
                    Academic Session Details
                  </div>
                  <div>
                    <span className="text-slate-400 block">Faculty:</span>
                    <strong className="text-white text-sm">{presentation.authorFaculty}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Institution:</span>
                    <strong className="text-white">{presentation.institution}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Curriculum Phase:</span>
                    <span className="text-slate-200">{presentation.phase}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Duration & Volume:</span>
                    <span className="text-emerald-400 font-bold">
                      {presentation.lectureDurationMin} Minutes • {totalSlides} Slides
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BIOCHEMICAL PATHWAY DIAGRAM */}
          {slide.pathwayData && (
            <div className="space-y-4">
              <VisualDiagramRenderer pathwayData={slide.pathwayData} themeId={presentation.theme} />
              {slide.keyPoints.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {slide.keyPoints.slice(0, 2).map((pt, i) => (
                    <div key={i} className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80 text-xs text-slate-200 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COLOURED METABOLIC CYCLE DIAGRAM (STANDARD TEXTBOOK IMPORT) */}
          {slide.cycleIllustration && (
            <div className="space-y-4 my-2">
              <MetabolicCycleDiagram cycle={slide.cycleIllustration} />
            </div>
          )}

          {/* COMPARISON / INVESTIGATION TABLE */}
          {slide.tableData && !slide.pathwayData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {slide.keyPoints.length > 0 && (
                <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Key Teaching Points
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {slide.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={`${slide.keyPoints.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'} overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/90`}>
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-800 text-slate-200 uppercase font-bold text-[11px]">
                    <tr>
                      {slide.tableData.headers.map((h, i) => (
                        <th key={i} className="py-2.5 px-3 border-b border-slate-700">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {slide.tableData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2 px-3">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CLINICAL CASE PRESENTATION */}
          {slide.caseStudy && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wide">
                  <Stethoscope className="w-4 h-4" />
                  Bedside Case Scenario
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-semibold block">Patient:</span>
                  <span className="text-slate-100 font-bold">{slide.caseStudy.patientAge}, {slide.caseStudy.gender}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-semibold block">Chief Complaint:</span>
                  <span className="text-slate-200">{slide.caseStudy.chiefComplaint}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-semibold block">Emergency Vitals:</span>
                  <div className="grid grid-cols-2 gap-1 mt-1 font-mono text-[11px] text-sky-300">
                    {Object.entries(slide.caseStudy.vitals).map(([k, v]) => (
                      <div key={k}>{k}: <strong>{v}</strong></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">
                      <tr>
                        <th className="py-2 px-2.5">Investigation</th>
                        <th className="py-2 px-2.5">Patient Value</th>
                        <th className="py-2 px-2.5">Reference</th>
                        <th className="py-2 px-2.5">Inference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-[11px]">
                      {slide.caseStudy.labFindings.slice(0, 5).map((lab, i) => (
                        <tr key={i} className="hover:bg-slate-800/50">
                          <td className="py-1.5 px-2.5 text-slate-200 font-medium">{lab.test}</td>
                          <td className="py-1.5 px-2.5 text-rose-400 font-bold">{lab.patientValue}</td>
                          <td className="py-1.5 px-2.5 text-slate-400">{lab.normalValue}</td>
                          <td className="py-1.5 px-2.5 text-emerald-300 font-medium">{lab.inference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-xs space-y-1">
                  <div className="text-rose-400 font-bold uppercase tracking-wider">
                    Definitive Diagnosis: {slide.caseStudy.diagnosis}
                  </div>
                  <div className="text-slate-300">
                    <strong className="text-white">Emergency Management:</strong> {slide.caseStudy.management[0]}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MCQ CLINICAL VIGNETTE */}
          {slide.mcqs && slide.mcqs.length > 0 && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-400">
                <HelpCircle className="w-4 h-4" />
                <span>NExT / NEET-PG / University Examination Vignette</span>
              </div>

              <p className="text-sm sm:text-base font-semibold text-slate-100">
                {slide.mcqs[0].question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {slide.mcqs[0].options.map((option, optIdx) => {
                  const isSelected = selectedMcqAnswer === optIdx;
                  const isCorrect = optIdx === slide.mcqs![0].correctAnswerIndex;
                  const showResult = selectedMcqAnswer !== null;

                  let btnStyle = 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500';
                  if (showResult) {
                    if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => setSelectedMcqAnswer(optIdx)}
                      className={`p-3 rounded-lg border text-left text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {selectedMcqAnswer !== null && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs space-y-1.5 animate-fadeIn">
                  <div className="text-emerald-400 font-bold">
                    ✓ Correct Answer: {slide.mcqs[0].options[slide.mcqs[0].correctAnswerIndex]}
                  </div>
                  <div className="text-slate-300 leading-relaxed">
                    <strong>Rationale:</strong> {slide.mcqs[0].explanation}
                  </div>
                  <div className="text-sky-300 font-semibold">
                    💡 High-Yield Fact: {slide.mcqs[0].highYieldFact}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STANDARD BULLET POINTS (if not special slide) */}
          {!slide.pathwayData && !slide.tableData && !slide.caseStudy && !slide.mcqs && slide.category !== 'title' && (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <ul className="space-y-3.5">
                {slide.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-base sm:text-lg text-slate-100 font-normal leading-relaxed">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-sm" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CLINICAL PEARL OR EXAM ALERT CALLOUT BANNER */}
          {(slide.clinicalPearl || slide.examAlert) && (
            <div
              className={`mt-4 p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 shadow-lg ${
                slide.examAlert
                  ? 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                  : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
              }`}
            >
              {slide.examAlert ? (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <strong className={`font-bold uppercase tracking-wider block mb-0.5 ${slide.examAlert ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {slide.examAlert ? '⚡ EXAM ALERT & HIGH-YIELD POINT' : '💡 CLINICAL PEARL FOR BEDSIDE'}
                </strong>
                <span>{slide.examAlert || slide.clinicalPearl}</span>
              </div>
            </div>
          )}
        </div>

        {/* Slide Footer */}
        <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Yadav Medical PPT Generator for MBBS</span>
            <span>•</span>
            <span>NMC Competency {slide.nmcCompetencyCode || presentation.nmcCompetencyCode}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-400">
              Slide {slide.slideNumber} of {totalSlides}
            </span>
            {onEditSlide && (
              <button
                onClick={() => onEditSlide(slide)}
                className="text-[11px] text-sky-400 hover:text-sky-300 underline font-semibold"
              >
                Edit Slide
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auto Speak Dr. R S Yadav Loud Haryanvi Hindi Teaching Controller */}
      {showAutoSpeak && (
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <AutoSpeakController
            currentSlide={slide}
            autoSpeakEnabled={autoSpeakEnabled}
            onToggleAutoSpeak={setAutoSpeakEnabled}
            speechMode={speechMode}
            onSpeechModeChange={setSpeechMode}
            isSpeaking={isSpeaking}
            onTogglePlay={handleToggleSpeech}
            onReplay={() => speakCurrentSlideNotes(speechMode)}
            volume={volume}
            onVolumeChange={setVolume}
            rate={rate}
            onRateChange={setRate}
          />
        </div>
      )}

      {/* Slide Drawer Panels (Speaker Notes & Blackboard Cues) */}
      {(showNotes || showBlackboard) && (
        <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {showNotes && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-sky-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Speaker Notes (Lecture Hall Script)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Press 'P' to toggle</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {slide.speakerNotes || 'Speak through the rate-limiting enzyme mechanism and clinical pearls.'}
              </p>
            </div>
          )}

          {showBlackboard && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-emerald-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5" />
                  Chalkboard / Drawing Cue for Teacher
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Press 'B' to toggle</span>
              </div>
              <p className="text-slate-300 whitespace-pre-line leading-relaxed font-mono text-[11px]">
                {slide.blackboardCue || 'Draw the central pathway on the blackboard with arrows and enzyme boxes.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
