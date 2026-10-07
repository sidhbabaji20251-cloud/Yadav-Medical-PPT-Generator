import React, { useState } from 'react';
import { Slide } from '../types/ppt';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface Props {
  slide: Slide;
  onSave: (updatedSlide: Slide) => void;
  onClose: () => void;
}

export const SlideEditorModal: React.FC<Props> = ({ slide, onSave, onClose }) => {
  const [title, setTitle] = useState(slide.title);
  const [subtitle, setSubtitle] = useState(slide.subtitle || '');
  const [keyPoints, setKeyPoints] = useState<string[]>([...slide.keyPoints]);
  const [clinicalPearl, setClinicalPearl] = useState(slide.clinicalPearl || '');
  const [speakerNotes, setSpeakerNotes] = useState(slide.speakerNotes || '');
  const [blackboardCue, setBlackboardCue] = useState(slide.blackboardCue || '');

  const handleAddPoint = () => {
    setKeyPoints([...keyPoints, 'New teaching point...']);
  };

  const handleUpdatePoint = (idx: number, val: string) => {
    const updated = [...keyPoints];
    updated[idx] = val;
    setKeyPoints(updated);
  };

  const handleRemovePoint = (idx: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onSave({
      ...slide,
      title,
      subtitle: subtitle || undefined,
      keyPoints,
      clinicalPearl: clinicalPearl || undefined,
      speakerNotes,
      blackboardCue: blackboardCue || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">
              Edit Slide {slide.slideNumber}: {slide.categoryLabel}
            </h3>
            <p className="text-xs text-slate-400">Customize content for your lecture hall session</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Slide Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold">Key Teaching Points</label>
              <button
                type="button"
                onClick={handleAddPoint}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Point</span>
              </button>
            </div>
            <div className="space-y-2">
              {keyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pt}
                    onChange={(e) => handleUpdatePoint(idx, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePoint(idx)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Clinical Pearl / Alert</label>
            <input
              type="text"
              value={clinicalPearl}
              onChange={(e) => setClinicalPearl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Speaker Notes (Lecture Hall Script)</label>
            <textarea
              rows={3}
              value={speakerNotes}
              onChange={(e) => setSpeakerNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Blackboard Drawing Cue</label>
            <textarea
              rows={2}
              value={blackboardCue}
              onChange={(e) => setBlackboardCue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
