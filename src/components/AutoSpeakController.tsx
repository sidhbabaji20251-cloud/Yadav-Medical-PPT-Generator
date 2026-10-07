import React, { useState, useEffect } from 'react';
import { Slide } from '../types/ppt';
import { speechService, SpeechMode } from '../services/speechService';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Mic,
  FileText
} from 'lucide-react';

interface Props {
  currentSlide: Slide;
  autoSpeakEnabled: boolean;
  onToggleAutoSpeak: (enabled: boolean) => void;
  speechMode?: SpeechMode;
  onSpeechModeChange?: (mode: SpeechMode) => void;
  isSpeaking?: boolean;
  onTogglePlay?: () => void;
  onReplay?: () => void;
  volume?: number;
  onVolumeChange?: (vol: number) => void;
  rate?: number;
  onRateChange?: (rate: number) => void;
}

export const AutoSpeakController: React.FC<Props> = ({
  currentSlide,
  autoSpeakEnabled,
  onToggleAutoSpeak,
  speechMode = 'haryanvi',
  onSpeechModeChange,
  isSpeaking = false,
  onTogglePlay,
  onReplay,
  volume = 1.0,
  onVolumeChange,
  rate = 1.0,
  onRateChange,
}) => {
  const mode = speechMode;

  const spokenScript = speechService.getTextForSlide(currentSlide, mode);

  return (
    <div className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-xl text-slate-100">
      {/* Top Bar with Professor Badge & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Animated Microphone Icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition shadow-lg ${
              isSpeaking
                ? 'bg-gradient-to-tr from-rose-600 via-amber-500 to-red-600 text-white shadow-rose-500/30 ring-2 ring-rose-400'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isSpeaking ? (
              <Mic className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <span>Microphone: Auto Speak (Haryanvi Hindi)</span>
                {isSpeaking && (
                  <span className="flex gap-0.5 items-end h-3 ml-1">
                    <span className="w-1 h-2 bg-emerald-400 animate-bounce"></span>
                    <span className="w-1 h-3 bg-emerald-400 animate-bounce delay-75"></span>
                    <span className="w-1 h-1.5 bg-emerald-400 animate-bounce delay-150"></span>
                  </span>
                )}
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                isSpeaking
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isSpeaking ? '📢 DR. R S YADAV (HARYANVI HINDI)' : 'STANDBY (AUTO ON PROJECTION)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Professor Dr. R S Yadav teaches in energetic Haryanvi Hindi immediately upon projection and slide change
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => onSpeechModeChange?.('haryanvi')}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                mode === 'haryanvi'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Loud energetic Haryanvi Hindi professor lecture by Dr. R S Yadav"
            >
              <Radio className="w-3 h-3" />
              <span>Haryanvi Hindi (Loud)</span>
            </button>
            <button
              onClick={() => onSpeechModeChange?.('speaker_notes')}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                mode === 'speaker_notes'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Speak verbatim speaker notes attached to this slide"
            >
              <FileText className="w-3 h-3" />
              <span>Attached Notes</span>
            </button>
            <button
              onClick={() => onSpeechModeChange?.('both')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                mode === 'both'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Both Haryanvi intro and detailed speaker notes"
            >
              <span>Both</span>
            </button>
          </div>

          {/* Auto Speak Toggle Switch */}
          <button
            onClick={() => onToggleAutoSpeak(!autoSpeakEnabled)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              autoSpeakEnabled
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Automatically speak attached speaker notes whenever slide advances or projects"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                autoSpeakEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span>Auto Speak: {autoSpeakEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Replay Button */}
          {onReplay && (
            <button
              onClick={onReplay}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
              title="Replay Current Slide Notes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Big Play / Stop Button */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition shadow-lg ${
              isSpeaking
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-950/40'
            }`}
          >
            {isSpeaking ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Voice</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Speak Notes Aloud</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Voice Parameters & Audio Script Transcript */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
        {/* Speed & Volume Controls */}
        <div className="md:col-span-4 flex items-center gap-4 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Volume</span>
              <span className="font-bold text-sky-400">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <div className="w-24">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Speed</span>
              <span className="font-mono text-sky-400">{rate}x</span>
            </div>
            <select
              value={rate}
              onChange={(e) => onRateChange?.(parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[11px] text-slate-200"
            >
              <option value="0.85">0.85x (Deliberate)</option>
              <option value="1.0">1.0x (Normal)</option>
              <option value="1.15">1.15x (Energetic)</option>
            </select>
          </div>
        </div>

        {/* Live Spoken Speech Display Box */}
        <div className="md:col-span-8 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-0.5">
              Spoken Content ({mode === 'speaker_notes' ? 'Attached Speaker Notes' : mode === 'haryanvi' ? 'Dr. R S Yadav Loud Haryanvi Hindi' : 'Bilingual'}):
            </span>
            <p className="text-xs text-slate-200 leading-relaxed line-clamp-2">
              "{spokenScript}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
