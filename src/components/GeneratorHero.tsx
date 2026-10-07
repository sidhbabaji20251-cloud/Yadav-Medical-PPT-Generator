import React, { useState } from 'react';
import { PresentationTheme, NMCCompetency } from '../types/ppt';
import { THEMES } from '../data/themes';
import {
  Sparkles,
  Download,
  FileDown,
  Eye,
  Sliders,
  Clock,
  Palette,
  User,
  GraduationCap,
  Layers,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface Props {
  selectedTopic: string;
  selectedCompetencyCode: string;
  lectureDuration: number;
  slideCount: number;
  selectedTheme: PresentationTheme;
  authorFaculty: string;
  institution: string;
  customPrompt: string;
  isGenerating: boolean;
  onTopicChange: (topic: string) => void;
  onCompetencyCodeChange: (code: string) => void;
  onDurationChange: (duration: number) => void;
  onSlideCountChange: (count: number) => void;
  onThemeChange: (theme: PresentationTheme) => void;
  onFacultyChange: (faculty: string) => void;
  onInstitutionChange: (inst: string) => void;
  onCustomPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  onPreview: () => void;
  onDownloadPPTX: () => void;
  onExportPDF: () => void;
  onBrowseCompetencies: () => void;
}

export const GeneratorHero: React.FC<Props> = ({
  selectedTopic,
  selectedCompetencyCode,
  lectureDuration,
  slideCount,
  selectedTheme,
  authorFaculty,
  institution,
  customPrompt,
  isGenerating,
  onTopicChange,
  onCompetencyCodeChange,
  onDurationChange,
  onSlideCountChange,
  onThemeChange,
  onFacultyChange,
  onInstitutionChange,
  onCustomPromptChange,
  onGenerate,
  onPreview,
  onDownloadPPTX,
  onExportPDF,
  onBrowseCompetencies,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold uppercase tracking-wider">
              NMC-CBME Biochemistry MBBS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
              ✓ Free & No-Login
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-medium">
              16:9 Widescreen (.pptx)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Yadav Medical PPT Generator
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Generate 25–40+ classroom-ready medical lecture slides with 3D biochemical pathways,
            speaker notes, clinical cases, and NMC competency mapping in seconds.
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onPreview}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition border border-slate-700 shadow-sm"
          >
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Preview Slides</span>
          </button>

          <button
            onClick={onDownloadPPTX}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-emerald-950/40"
          >
            <Download className="w-4 h-4" />
            <span>Download PPTX</span>
          </button>

          <button
            onClick={onExportPDF}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition border border-slate-700"
            title="Direct 16:9 PDF Export"
          >
            <FileDown className="w-4 h-4 text-rose-400" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Generator Form */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Topic, Competency Code & Prompt */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-sky-400" />
                <span>Lecture Topic / Clinical Subject</span>
              </label>
              <button
                onClick={onBrowseCompetencies}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold underline"
              >
                Browse NMC Competency Codes →
              </button>
            </div>
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => onTopicChange(e.target.value)}
              placeholder="e.g. Ketogenesis, DKA Cascade and Fatty Acid Beta-Oxidation"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                NMC Competency Code
              </label>
              <input
                type="text"
                value={selectedCompetencyCode}
                onChange={(e) => onCompetencyCodeChange(e.target.value)}
                placeholder="e.g. BI4.3"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-sky-300 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Lecture Duration & Target Slide Volume
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { dur: 30, slides: 25, label: '30m (25 slides)' },
                  { dur: 45, slides: 32, label: '45m (32 slides)' },
                  { dur: 60, slides: 38, label: '60m (38 slides)' }
                ].map(item => (
                  <button
                    key={item.dur}
                    type="button"
                    onClick={() => {
                      onDurationChange(item.dur);
                      onSlideCountChange(item.slides);
                    }}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition border text-center ${
                      lectureDuration === item.dur
                        ? 'bg-sky-600 border-sky-400 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional AI Teacher Prompt */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1">
              <span>Optional Teacher Custom Instructions / Clinical Focus</span>
              <span className="text-[11px] text-slate-500 italic">Optional</span>
            </label>
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              placeholder="e.g. Highlight pediatric case presentation, focus on allosteric regulation, and include a Lineweaver-Burk enzyme plot."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Right Column: Theme, Faculty, Slide Count Slider & Main Action Button */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          {/* Medical Theme Picker */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Palette className="w-3.5 h-3.5 text-sky-400" />
              <span>Medical Color Theme</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(THEMES) as PresentationTheme[]).map(key => {
                const t = THEMES[key];
                const isSelected = selectedTheme === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onThemeChange(key)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                      isSelected
                        ? 'border-sky-400 bg-sky-950/40 ring-2 ring-sky-500/50'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                    title={t.name}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.primary }}
                    />
                    <span className="text-[10px] font-medium text-slate-300 truncate w-full text-center">
                      {t.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slide Count Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Custom Slide Count:</span>
              </span>
              <strong className="text-sky-300 font-mono text-sm">{slideCount} Slides</strong>
            </div>
            <input
              type="range"
              min="20"
              max="42"
              value={slideCount}
              onChange={(e) => onSlideCountChange(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>20 (Core Capsule)</span>
              <span>32 (Standard)</span>
              <span>42 (Full Masterclass)</span>
            </div>
          </div>

          {/* Faculty / Institution Details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-0.5">Faculty Name</label>
              <input
                type="text"
                value={authorFaculty}
                onChange={(e) => onFacultyChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-0.5">Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => onInstitutionChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              />
            </div>
          </div>

          {/* BIG PRIMARY GENERATE BUTTON */}
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 text-white font-extrabold text-base tracking-wide transition shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span>Assembling {slideCount} NMC Curriculum Slides...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-sky-200 animate-pulse" />
                <span>Generate Rich PPT + Visuals ({slideCount} Slides)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
