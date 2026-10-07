import React, { useState } from 'react';
import { MetabolicCycleIllustration } from '../types/ppt';
import {
  RefreshCw,
  Zap,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';

interface Props {
  cycle: MetabolicCycleIllustration;
}

export const MetabolicCycleDiagram: React.FC<Props> = ({ cycle }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'vector' | 'textbook_reference'>('vector');

  return (
    <div className="w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-100 overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '18s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-wide">
                {cycle.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 uppercase">
                Coloured Cycle Diagram
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Location:</span>
              <strong className="text-cyan-300 font-semibold">{cycle.cellularCompartments}</strong>
            </p>
          </div>
        </div>

        {/* View Mode & Textbook Source */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'vector' ? 'textbook_reference' : 'vector')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            title="Toggle between Vector Interactive Cycle and Standard Textbook Flowchart"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>{viewMode === 'vector' ? 'Standard Textbook View' : 'Interactive Vector View'}</span>
          </button>
        </div>
      </div>

      {/* Textbook Citation Banner */}
      <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-400">Imported as per Standard Curriculum:</span>
          <strong className="text-amber-200 font-medium truncate">{cycle.textbookSource}</strong>
        </div>
        {cycle.totalEnergyYield && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] shrink-0">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>{cycle.totalEnergyYield}</span>
          </div>
        )}
      </div>

      {/* MAIN VIEW: Interactive Coloured Cycle Vector */}
      {viewMode === 'vector' ? (
        <div className="mt-4">
          {/* Reaction Steps Orbit / Sequence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {cycle.reactions.map((rxn) => {
              const fromNode = cycle.nodes.find(n => n.id === rxn.fromId);
              const toNode = cycle.nodes.find(n => n.id === rxn.toId);
              const isSelected = activeStep === rxn.step;
              const isRateLimiting = rxn.isRateLimiting;

              return (
                <div
                  key={rxn.step}
                  onMouseEnter={() => setActiveStep(rxn.step)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={`rounded-xl p-3 border transition-all cursor-pointer flex flex-col justify-between ${
                    isRateLimiting
                      ? 'bg-rose-950/40 border-rose-500/70 shadow-md shadow-rose-950/50'
                      : isSelected
                      ? 'bg-sky-950/70 border-sky-400 shadow-md ring-1 ring-sky-400'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    {/* Step Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isRateLimiting ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        STEP {rxn.step}
                      </span>
                      {isRateLimiting && (
                        <span className="text-[9px] font-bold text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          Rate-Limiting
                        </span>
                      )}
                    </div>

                    {/* From Molecule */}
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 mb-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>SUBSTRATE</span>
                        {fromNode?.carbonCount && (
                          <span className="font-mono text-cyan-400 font-bold">{fromNode.carbonCount}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-100 block truncate">
                        {fromNode?.name || rxn.fromId}
                      </span>
                    </div>

                    {/* Enzyme & Arrow */}
                    <div className="my-1 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[10px]">
                        <div className="h-px flex-1 bg-slate-700" />
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                        <div className="h-px flex-1 bg-slate-700" />
                      </div>
                      <div className="mt-0.5 px-2 py-1 rounded bg-slate-900/90 border border-slate-700/80">
                        <span className="text-[11px] font-bold text-emerald-300 block leading-tight">
                          {rxn.enzyme}
                        </span>
                        {rxn.coenzyme && (
                          <span className="text-[9px] text-amber-300/90 font-mono block mt-0.5">
                            [{rxn.coenzyme}]
                          </span>
                        )}
                      </div>
                    </div>

                    {/* To Molecule */}
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 mt-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>PRODUCT</span>
                        {toNode?.carbonCount && (
                          <span className="font-mono text-emerald-400 font-bold">{toNode.carbonCount}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-emerald-200 block truncate">
                        {toNode?.name || rxn.toId}
                      </span>
                    </div>
                  </div>

                  {/* Energy Change / Clinical Defect */}
                  {(rxn.energyChange || rxn.clinicalDefect) && (
                    <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] space-y-0.5">
                      {rxn.energyChange && (
                        <div className="text-emerald-400 font-medium flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{rxn.energyChange}</span>
                        </div>
                      )}
                      {rxn.clinicalDefect && (
                        <div className="text-rose-300/90 flex items-start gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                          <span className="leading-tight line-clamp-2">{rxn.clinicalDefect}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* STANDARD TEXTBOOK REFERENCE VIEW */
        <div className="mt-4 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Standard Curriculum Flowchart Summary: {cycle.name}</span>
            </h4>
            <span className="text-xs text-amber-300 font-mono">
              Aligned with NMC Guidelines
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {cycle.reactions.map((rxn) => {
              const from = cycle.nodes.find(n => n.id === rxn.fromId)?.name || rxn.fromId;
              const to = cycle.nodes.find(n => n.id === rxn.toId)?.name || rxn.toId;

              return (
                <div
                  key={rxn.step}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-300 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                      {rxn.step}
                    </span>
                    <div>
                      <div className="text-slate-200 font-semibold">
                        <span className="text-white font-bold">{from}</span>
                        <span className="text-slate-500 mx-1.5">➔</span>
                        <span className="text-emerald-300 font-bold">{to}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Enzyme: <strong className="text-sky-300">{rxn.enzyme}</strong>
                        {rxn.coenzyme && <span className="text-amber-300/90 ml-1.5 font-mono">({rxn.coenzyme})</span>}
                      </div>
                    </div>
                  </div>

                  {rxn.isRateLimiting && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-[10px] shrink-0 self-start sm:self-auto">
                      ⚡ Rate-Limiting Step
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Viva Voce High-Yield Box */}
      {cycle.vivaQuestion && (
        <div className="mt-3.5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-indigo-300 uppercase tracking-wider block font-bold mb-0.5">
              High-Yield University Viva Voce Question:
            </strong>
            <span className="text-slate-200 leading-relaxed">{cycle.vivaQuestion}</span>
          </div>
        </div>
      )}
    </div>
  );
};
