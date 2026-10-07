import React, { useState, useEffect } from 'react';
import { PresentationData, Slide } from '../types/ppt';
import { THEMES } from '../data/themes';
import { MetabolicCycleDiagram } from './MetabolicCycleDiagram';
import { speechService, SpeechMode } from '../services/speechService';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  PenTool,
  FileText,
  Clock,
  Maximize,
  Sparkles,
  Zap,
  Volume2,
  Radio,
  Mic
} from 'lucide-react';

interface Props {
  presentation: PresentationData;
  initialSlideIndex: number;
  onClose: () => void;
  onSelectSlide: (index: number) => void;
}

export const PresenterModeModal: React.FC<Props> = ({
  presentation,
  initialSlideIndex,
  onClose,
  onSelectSlide,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [laserPosition, setLaserPosition] = useState<{ x: number; y: number } | null>(null);
  const [laserActive, setLaserActive] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true);
  const [speechMode, setSpeechMode] = useState<SpeechMode>('haryanvi');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHaryanviSpeaking, setIsHaryanviSpeaking] = useState(false);

  const totalSlides = presentation.slides.length;
  const currentSlide = presentation.slides[currentSlideIndex] || presentation.slides[0];
  const nextSlide = presentation.slides[currentSlideIndex + 1];
  const theme = THEMES[presentation.theme] || THEMES.navy;

  const speakCurrentNotes = (modeToUse: SpeechMode = speechMode) => {
    speechService.speakSlide(currentSlide, {
      mode: modeToUse,
      onStart: () => {
        setIsSpeaking(true);
        if (modeToUse === 'haryanvi') setIsHaryanviSpeaking(true);
        else setIsHaryanviSpeaking(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsHaryanviSpeaking(false);
      },
      onError: () => {
        setIsSpeaking(false);
        setIsHaryanviSpeaking(false);
      },
    });
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
      setIsHaryanviSpeaking(false);
    } else {
      speakCurrentNotes();
    }
  };

  const playHaryanviSpeech = (text?: string) => {
    if (isSpeaking && isHaryanviSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
      setIsHaryanviSpeaking(false);
      return;
    }
    setSpeechMode('haryanvi');
    speechService.speak(text || currentSlide.haryanviSpeech || speechService.getTextForSlide(currentSlide, 'haryanvi'), {
      mode: 'haryanvi',
      onStart: () => {
        setIsSpeaking(true);
        setIsHaryanviSpeaking(true);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsHaryanviSpeaking(false);
      },
      onError: () => {
        setIsSpeaking(false);
        setIsHaryanviSpeaking(false);
      },
    });
  };

  // Auto-speak immediately upon launch and whenever slide changes!
  useEffect(() => {
    if (autoSpeakEnabled) {
      const timer = setTimeout(() => {
        speakCurrentNotes();
      }, 400);
      return () => clearTimeout(timer);
    } else {
      speechService.stop();
      setIsSpeaking(false);
    }
  }, [currentSlideIndex, autoSpeakEnabled, speechMode]);

  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  // Lecture Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        speechService.stop();
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToSlide(Math.min(totalSlides - 1, currentSlideIndex + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToSlide(Math.max(0, currentSlideIndex - 1));
      } else if (e.key === 'l' || e.key === 'L') {
        setLaserActive(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, totalSlides, onClose]);

  const goToSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
    onSelectSlide(idx);
  };

  // Laser Pointer mouse handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!laserActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLaserPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col text-slate-100 select-none">
      {/* Top Presenter Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-4">
          <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
            YADAV MEDICAL PRESENTER CONSOLE
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono">
            NMC {presentation.nmcCompetencyCode}
          </span>

          {/* Active Microphone / Speaker Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl">
            <Mic className={`w-4 h-4 ${isSpeaking ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-white">
              Auto-Speak: {isSpeaking ? 'Speaking' : 'Active'}
            </span>
            {isSpeaking && (
              <span className="flex gap-0.5 items-end h-2.5 ml-1">
                <span className="w-1 h-2 bg-emerald-400 animate-bounce"></span>
                <span className="w-1 h-3 bg-emerald-400 animate-bounce delay-75"></span>
                <span className="w-1 h-1.5 bg-emerald-400 animate-bounce delay-150"></span>
              </span>
            )}
          </div>
        </div>

        {/* Stopwatch Timer & Audio Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg font-mono text-base font-bold text-emerald-400">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setTimerSeconds(0)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Auto Speak Play/Pause */}
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition border ${
              isSpeaking
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-950/60'
                : 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-200'
            }`}
            title="Play / Pause Auto-Speaking Speaker Notes"
          >
            {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isSpeaking ? 'Pause Voice' : 'Speak Notes'}</span>
          </button>

          {/* Voice Mode Selector */}
          <button
            onClick={() => {
              const nextMode: SpeechMode = speechMode === 'haryanvi' ? 'speaker_notes' : 'haryanvi';
              setSpeechMode(nextMode);
              speakCurrentNotes(nextMode);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-rose-300 transition"
            title="Toggle between Dr. R S Yadav Loud Haryanvi Hindi and Verbatim Attached Speaker Notes"
          >
            {speechMode === 'haryanvi' ? '📢 Haryanvi Hindi' : '🎙️ Attached Notes'}
          </button>

          {/* Auto Speak ON/OFF Toggle */}
          <button
            onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition border ${
              autoSpeakEnabled
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Auto-Speak on Slide Change"
          >
            Auto: {autoSpeakEnabled ? 'ON' : 'OFF'}
          </button>

          {/* Laser Pointer Toggle */}
          <button
            onClick={() => setLaserActive(!laserActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              laserActive
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Toggle Red Laser Pointer (Shortcut: L)"
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            <span>Laser</span>
          </button>

          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition ml-2"
            title="Exit Presenter Console (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Dual Console Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Left: Big Main Slide View */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setLaserPosition(null)}
            className="relative w-full aspect-video bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl cursor-crosshair"
          >
            {/* Laser pointer dot */}
            {laserActive && laserPosition && (
              <div
                className="absolute w-4 h-4 bg-rose-500 rounded-full blur-[1px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-lg shadow-rose-500/80 animate-pulse"
                style={{
                  left: laserPosition.x,
                  top: laserPosition.y,
                }}
              />
            )}

            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span
                  className="font-bold uppercase tracking-wider px-2.5 py-0.5 rounded text-white text-[11px]"
                  style={{ backgroundColor: theme.secondary }}
                >
                  {currentSlide.categoryLabel}
                </span>
                <span className="text-slate-400 font-mono">
                  Slide {currentSlide.slideNumber} of {totalSlides}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {currentSlide.title}
              </h2>
              {currentSlide.subtitle && (
                <p className="text-xs sm:text-sm text-slate-300 italic mt-0.5">
                  {currentSlide.subtitle}
                </p>
              )}
            </div>

            {/* Slide Content Preview */}
            <div className="my-auto py-2">
              {currentSlide.cycleIllustration && (
                <div className="my-2">
                  <MetabolicCycleDiagram cycle={currentSlide.cycleIllustration} />
                </div>
              )}

              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                {currentSlide.keyPoints.slice(0, 4).map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              {(currentSlide.clinicalPearl || currentSlide.examAlert) && (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200">
                  <strong>{currentSlide.examAlert ? '⚡ ALERT: ' : '💡 PEARL: '}</strong>
                  <span>{currentSlide.examAlert || currentSlide.clinicalPearl}</span>
                </div>
              )}
            </div>

            {/* Slide Footer */}
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Classroom Projector Output</span>
              <span>Yadav Medical PPT Generator for MBBS</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => goToSlide(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-sm transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Slide</span>
            </button>

            <span className="font-mono text-sm font-bold text-slate-300">
              {currentSlideIndex + 1} / {totalSlides}
            </span>

            <button
              onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === totalSlides - 1}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-sm transition shadow-lg shadow-sky-950/40"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Next Slide Preview + Speaker Script + Blackboard Cue */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-1">
          {/* Next Slide Preview Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Next Slide Up</span>
              <span className="font-mono">{currentSlideIndex + 2 <= totalSlides ? `${currentSlideIndex + 2} / ${totalSlides}` : 'End'}</span>
            </div>
            {nextSlide ? (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-sky-400 uppercase block">
                  {nextSlide.categoryLabel}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                  {nextSlide.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {nextSlide.keyPoints[0] || ''}
                </p>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-2">
                This is the concluding slide of the lecture.
              </div>
            )}
          </div>

          {/* Dr. R S Yadav Loud Haryanvi Lecture Script */}
          <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-3.5 flex flex-col">
            <div className="flex items-center justify-between pb-1.5 border-b border-rose-500/30 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-300">
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Dr. R S Yadav (Loud Haryanvi Hindi Script)</span>
              </span>
              <button
                onClick={() => playHaryanviSpeech(currentSlide.haryanviSpeech || currentSlide.speakerNotes)}
                className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
              >
                {isHaryanviSpeaking ? 'Pause' : '🔊 Speak'}
              </button>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-100 italic font-medium">
              "{currentSlide.haryanviSpeech || `अरे लाडलो! ध्यान से सुनो, मैं थारा प्रोफेसर डॉ. आर एस यादव! स्लाइड ${currentSlide.slideNumber} पे देखो: ${currentSlide.title}!`}"
            </p>
          </div>

          {/* Full Speaker Notes Script (What to say) */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 pb-2 border-b border-slate-800 mb-2">
              <FileText className="w-4 h-4" />
              <span>Verbatim Lecture Script for Professor</span>
            </div>
            <div className="flex-1 overflow-y-auto text-sm sm:text-base leading-relaxed text-slate-200 font-normal">
              {currentSlide.speakerNotes || 'Speak to the rate-limiting enzyme step and clinical pearls.'}
            </div>
          </div>

          {/* Blackboard Cue Box */}
          {currentSlide.blackboardCue && (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3.5 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider mb-1">
                <PenTool className="w-3.5 h-3.5" />
                <span>Chalkboard / Blackboard Drawing Instructions</span>
              </div>
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-line">
                {currentSlide.blackboardCue}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
