import React, { useState } from 'react';
import { NMC_BIOCHEMISTRY_COMPETENCIES } from '../data/nmcCompetencies';
import { NMCCompetency } from '../types/ppt';
import { BookOpen, Search, ArrowRight, CheckCircle2, Clock, Sparkles, Filter } from 'lucide-react';

interface Props {
  selectedCompetencyCode: string;
  onSelectCompetency: (comp: NMCCompetency) => void;
  onGenerateWithCompetency: (comp: NMCCompetency) => void;
}

export const CompetencySelector: React.FC<Props> = ({
  selectedCompetencyCode,
  onSelectCompetency,
  onGenerateWithCompetency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const topics = ['all', ...Array.from(new Set(NMC_BIOCHEMISTRY_COMPETENCIES.map(c => c.topic)))];

  const filtered = NMC_BIOCHEMISTRY_COMPETENCIES.filter(comp => {
    const matchesTopic = selectedTopic === 'all' || comp.topic === selectedTopic;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      comp.code.toLowerCase().includes(q) ||
      comp.topic.toLowerCase().includes(q) ||
      comp.subTopic.toLowerCase().includes(q) ||
      comp.description.toLowerCase().includes(q) ||
      comp.highYieldDiseases.some(d => d.toLowerCase().includes(q));

    return matchesTopic && matchesSearch;
  });

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>NMC-CBME Competency Library</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                MBBS 1st Professional (Phase 1)
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click any National Medical Commission competency code to instantly generate a 25–40 slide verified presentation.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search BI codes, DKA, PKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Module Topic Filter Pills */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto scrollbar-none text-xs border-b border-slate-800/80">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {topics.map(t => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={`px-3 py-1 rounded-lg whitespace-nowrap transition capitalize ${
              selectedTopic === t
                ? 'bg-sky-600 text-white font-bold shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {t === 'all' ? 'All Modules' : t}
          </button>
        ))}
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4 max-h-[460px] overflow-y-auto pr-1">
        {filtered.map(comp => {
          const isSelected = comp.code === selectedCompetencyCode;

          return (
            <div
              key={comp.code}
              className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-950/60 border-sky-500 shadow-lg shadow-sky-950/40 ring-1 ring-sky-500'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {comp.code}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {comp.teachingHours}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1 leading-snug">
                  {comp.subTopic}
                </h4>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {comp.description}
                </p>

                {/* High yield diseases badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {comp.highYieldDiseases.slice(0, 2).map((d, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-amber-300/90 border border-slate-700 font-medium"
                    >
                      {d}
                    </span>
                  ))}
                  {comp.highYieldDiseases.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      +{comp.highYieldDiseases.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectCompetency(comp)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition text-center ${
                    isSelected
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Select'}
                </button>

                <button
                  onClick={() => onGenerateWithCompetency(comp)}
                  className="py-1.5 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white transition flex items-center gap-1 shadow-sm shrink-0"
                  title="Generate 25-40 Slide Deck"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate PPT</span>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm">
            No NMC competencies found matching "{searchTerm}". Try another keyword or browse all modules.
          </div>
        )}
      </div>
    </div>
  );
};
