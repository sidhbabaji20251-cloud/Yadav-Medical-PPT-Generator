import React from 'react';
import { BiochemicalPathwayData, PathwayStep } from '../types/ppt';
import { THEMES } from '../data/themes';
import { PresentationTheme } from '../types/ppt';
import { AlertCircle, ArrowRight, CheckCircle2, Zap, ShieldAlert, Sparkles, Layers } from 'lucide-react';

interface Props {
  pathwayData: BiochemicalPathwayData;
  themeId?: PresentationTheme;
}

export const VisualDiagramRenderer: React.FC<Props> = ({ pathwayData, themeId = 'navy' }) => {
  const theme = THEMES[themeId] || THEMES.navy;

  return (
    <div className="w-full bg-slate-900/90 text-white rounded-xl border border-slate-700/60 p-4 shadow-xl overflow-hidden">
      {/* Top Header of Diagram */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-700/80 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold text-xs">
            3D
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <span>{pathwayData.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Vector Visual Pathway
              </span>
            </h4>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Cellular Localization:</span>
              <strong className="text-cyan-300 font-semibold">{pathwayData.cellularLocation}</strong>
            </p>
          </div>
        </div>

        {pathwayData.energyYield && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Energetics: {pathwayData.energyYield}</span>
          </div>
        )}
      </div>

      {/* Pathway Steps Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative my-2">
        {pathwayData.steps.map((step: PathwayStep, index: number) => {
          const isRateLimiting = step.isRateLimiting;
          const isDefect = pathwayData.clinicalBlockAtStep === step.stepNumber;

          return (
            <div
              key={step.stepNumber}
              className={`relative rounded-xl p-3.5 transition-all border ${
                isRateLimiting
                  ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/50'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
              }`}
            >
              {/* Step Header */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isRateLimiting
                      ? 'bg-rose-600 text-white'
                      : 'bg-sky-600/40 text-sky-200 border border-sky-500/40'
                  }`}
                >
                  STEP {step.stepNumber}
                </span>

                {isRateLimiting && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                    RATE-LIMITING PACEMAKER
                  </span>
                )}
              </div>

              {/* Substrate 'From' Box */}
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-center mb-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Substrate</span>
                <span className="text-xs font-bold text-slate-100">{step.from}</span>
              </div>

              {/* Reaction & Enzyme Node */}
              <div className="flex flex-col items-center justify-center my-1.5 relative">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-sky-500/50" />
                  <div className="w-5 h-5 rounded-full bg-sky-500/30 border border-sky-400/50 flex items-center justify-center text-sky-300">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-sky-500/50" />
                </div>

                <div className="mt-1 px-2.5 py-1 rounded-md bg-slate-950 border border-cyan-500/40 text-center max-w-[95%]">
                  <span className="text-[10px] text-cyan-400 font-bold block">ENZYME</span>
                  <span className="text-xs font-bold text-cyan-200 leading-tight block">{step.enzyme}</span>
                  {step.coenzyme && (
                    <span className="text-[9px] text-amber-300/90 font-mono mt-0.5 block">
                      [{step.coenzyme}]
                    </span>
                  )}
                </div>
              </div>

              {/* Product 'To' Box */}
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center mt-2">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold">Product Intermediary</span>
                <span className="text-xs font-bold text-emerald-100">{step.to}</span>
              </div>

              {/* Allosteric Modulators (if any) */}
              {(step.stimulatedBy || step.inhibitedBy) && (
                <div className="mt-2.5 pt-2 border-t border-slate-700/60 grid grid-cols-2 gap-1 text-[10px]">
                  {step.stimulatedBy && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-1">
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> (+) Stimulated:
                      </span>
                      <span className="text-slate-300 text-[9px] leading-tight block mt-0.5">
                        {step.stimulatedBy.join(', ')}
                      </span>
                    </div>
                  )}
                  {step.inhibitedBy && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded p-1">
                      <span className="text-rose-400 font-bold flex items-center gap-0.5">
                        <AlertCircle className="w-2.5 h-2.5" /> (-) Inhibited:
                      </span>
                      <span className="text-slate-300 text-[9px] leading-tight block mt-0.5">
                        {step.inhibitedBy.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Clinical Defect Badge */}
              {step.clinicalDefect && (
                <div className="mt-2 p-1.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] text-amber-200 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Defect: <strong>{step.clinicalDefect}</strong></span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pathway Summary Strip */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Forward Thermodynamic Flow</span>
          <span className="text-slate-600">•</span>
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Committed Pacemaker Junction</span>
        </div>
        <div className="text-[11px] text-slate-400 italic">
          Designed for Classroom Projector Display & PowerPoint (.pptx) Vector Export
        </div>
      </div>
    </div>
  );
};
