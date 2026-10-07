import React, { useState } from 'react';
import { PresentationData, Slide } from '../types/ppt';
import { Search, ChevronRight, Layers, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  presentation: PresentationData;
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
}

export const SlideListSidebar: React.FC<Props> = ({
  presentation,
  currentSlideIndex,
  onSelectSlide,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredSlides = presentation.slides.filter((slide, index) => {
    const matchesSearch =
      slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.keyPoints.some(pt => pt.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterCategory === 'all') return matchesSearch;
    if (filterCategory === 'pathways') return matchesSearch && (slide.pathwayData !== undefined || slide.category.includes('pathway'));
    if (filterCategory === 'case') return matchesSearch && (slide.caseStudy !== undefined || slide.category === 'clinical_case');
    if (filterCategory === 'mcq') return matchesSearch && (slide.mcqs !== undefined || slide.category === 'mcqs');
    if (filterCategory === 'inborn') return matchesSearch && (slide.category === 'inborn_errors' || slide.category === 'biochemical_consequences');
    return matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-200">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Curriculum Slides ({presentation.totalSlides})</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {presentation.lectureDurationMin} min deck
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search slides, enzymes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          {[
            { id: 'all', label: 'All' },
            { id: 'pathways', label: 'Pathways' },
            { id: 'case', label: 'Clinical Case' },
            { id: 'inborn', label: 'Inborn Errors' },
            { id: 'mcq', label: 'MCQs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-2 py-0.5 rounded-md whitespace-nowrap transition ${
                filterCategory === tab.id
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Thumbnails List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 divide-y divide-slate-800/40">
        {filteredSlides.map((slide) => {
          const actualIndex = slide.slideNumber - 1;
          const isSelected = actualIndex === currentSlideIndex;

          return (
            <button
              key={slide.id}
              onClick={() => onSelectSlide(actualIndex)}
              className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group pt-3 ${
                isSelected
                  ? 'bg-sky-950/80 border border-sky-500/80 shadow-md shadow-sky-950/50'
                  : 'hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {/* Number Badge */}
              <div
                className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                  isSelected
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                }`}
              >
                {slide.slideNumber}
              </div>

              {/* Slide Meta & Title */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider truncate">
                    {slide.categoryLabel}
                  </span>
                  {slide.pathwayData && (
                    <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      Diagram
                    </span>
                  )}
                  {slide.caseStudy && (
                    <span className="text-[9px] px-1 rounded bg-rose-500/20 text-rose-300 font-semibold">
                      Case
                    </span>
                  )}
                </div>

                <h4
                  className={`text-xs font-semibold leading-tight line-clamp-2 ${
                    isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {slide.title}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                  {slide.keyPoints[0] || slide.subtitle || ''}
                </p>
              </div>

              <ChevronRight
                className={`w-4 h-4 shrink-0 mt-1 transition ${
                  isSelected ? 'text-sky-400' : 'text-slate-600 group-hover:text-slate-400'
                }`}
              />
            </button>
          );
        })}

        {filteredSlides.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-500">
            No slides matching "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
};
