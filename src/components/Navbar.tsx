import React from 'react';
import { PresentationTheme } from '../types/ppt';
import { THEMES } from '../data/themes';
import {
  Sparkles,
  Download,
  FileDown,
  Volume2,
  BookCheck,
  Palette,
  GraduationCap,
  Radio
} from 'lucide-react';

interface Props {
  currentTheme: PresentationTheme;
  onThemeChange: (theme: PresentationTheme) => void;
  onOpenGenerator: () => void;
  onDownloadPPTX: () => void;
  onExportPDF: () => void;
  onOpenPresenterMode: () => void;
  onOpenReferences: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentTheme,
  onThemeChange,
  onOpenGenerator,
  onDownloadPPTX,
  onExportPDF,
  onOpenPresenterMode,
  onOpenReferences,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 font-extrabold text-lg">
            YM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Yadav Medical PPT Generator
              </span>
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
                MBBS First Professional
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              NMC-CBME Biochemistry Competency Presentation Engine
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Theme Quick Selector */}
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {(Object.keys(THEMES) as PresentationTheme[]).map((themeKey) => {
              const t = THEMES[themeKey];
              const isSelected = currentTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  onClick={() => onThemeChange(themeKey)}
                  className={`w-6 h-6 rounded-lg transition-transform flex items-center justify-center ${
                    isSelected ? 'scale-110 ring-2 ring-sky-400' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: t.primary }}
                  title={`Switch to ${t.name}`}
                />
              );
            })}
          </div>

          {/* Auto Speak Dr. R S Yadav Indicator */}
          <button
            onClick={() => {
              const el = document.getElementById('slide-preview-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 hover:bg-rose-900/50 text-xs font-bold transition"
            title="Loud Haryanvi Hindi Auto Speak by Professor Dr. R S Yadav"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Auto Speak (Dr. R S Yadav)</span>
          </button>

          {/* References & Integrity Button */}
          <button
            onClick={onOpenReferences}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition border border-slate-800"
            title="Academic Integrity & Textbooks"
          >
            <BookCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>References</span>
          </button>

          {/* Presenter Mode */}
          <button
            onClick={onOpenPresenterMode}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition border border-slate-800"
            title="Open Presenter Console (Lecture Hall Projector View)"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Presenter Mode</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={onExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
            title="Export 16:9 PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {/* Download PPTX */}
          <button
            onClick={onDownloadPPTX}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-md shadow-emerald-950/40"
            title="Download genuine 16:9 PowerPoint file"
          >
            <Download className="w-4 h-4" />
            <span>Download PPTX</span>
          </button>
        </div>
      </div>
    </header>
  );
};
