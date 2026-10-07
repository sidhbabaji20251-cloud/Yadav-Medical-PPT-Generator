import React from 'react';
import { X, BookCheck, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  onClose: () => void;
  references: string[];
}

export const ReferenceModal: React.FC<Props> = ({ onClose, references }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <BookCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Academic Integrity & Verified References</h3>
            <p className="text-xs text-slate-400">Separation of Peer-Reviewed Medical Evidence from AI Pedagogical Syntheses</p>
          </div>
        </div>

        {/* Section 1: Verified Standard Textbooks */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Standard Recommended Textbooks (NMC Curricular Sources)</span>
          </h4>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 divide-y divide-slate-850">
            {references.map((ref, idx) => (
              <div key={idx} className="py-2.5 first:pt-0 last:pb-0 text-xs text-slate-200 flex items-start gap-2.5">
                <span className="font-mono text-slate-500 text-[11px] shrink-0">{idx + 1}.</span>
                <span>{ref}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: AI Pedagogical Disclosure */}
        <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Clear Separation & Educational Boundary Notice</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            The diagrams, infographics, 3D visual pathway layouts, blackboard cues, and speaker scripts generated in the Yadav Medical PPT Generator are
            synthesized pedagogical frameworks crafted to maximize teaching impact and student retention in MBBS First Professional classrooms.
          </p>
          <p className="leading-relaxed text-slate-300">
            All biochemical pathways, enzyme classifications, inborn error genetics, and reference lab ranges are cross-referenced with
            <strong> Harper’s Illustrated Biochemistry</strong> (32nd Edition) and <strong> Vasudevan’s Biochemistry</strong> (10th Edition).
            Clinical dosages and hospital protocols should always be verified against standard institutional pharmacopeias before patient administration.
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
