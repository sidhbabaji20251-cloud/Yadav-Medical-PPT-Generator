import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  Sparkles,
  MessageCircle,
  Mail,
  QrCode,
  ShieldCheck,
  KeyRound,
  GraduationCap,
  ExternalLink
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ShareModal: React.FC<Props> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  // The permanent public shared URL for all students and faculty
  const publicUrl =
    typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
      ? window.location.origin
      : 'https://ais-pre-5rvtht5ab354zbqanszhxz-236247641087.asia-southeast1.run.app';

  const shareText = `🎓 *Yadav Medical PPT Generator for MBBS*\nFree NMC-CBME Biochemistry presentation generator with Dr. R S Yadav Loud Haryanvi teaching audio, colored metabolic cycle diagrams, and PPTX download!\n\nOpen Free Here: ${publicUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleTelegramShare = () => {
    const encodedUrl = encodeURIComponent(publicUrl);
    const encodedText = encodeURIComponent(
      '🎓 Yadav Medical PPT Generator for MBBS - 100% Free NMC Biochemistry presentation generator with Dr. R S Yadav Haryanvi audio teaching!'
    );
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Free MBBS Biochemistry PPT Generator - Dr. R S Yadav');
    const body = encodeURIComponent(
      `Hello,\n\nHere is the free Yadav Medical PPT Generator for MBBS students and faculty.\nIt includes NMC-CBME biochemistry presentations, full speaker notes, Dr. R S Yadav loud Haryanvi teaching audio, colored metabolic cycle diagrams, and 1-click PowerPoint (.pptx) download.\n\nAccess it here: ${publicUrl}\n\n100% free with no login or API key required!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-inner">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Public Freeware Access URL</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Share this link with any student, professor, or medical batch group.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Public URL Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Direct Web Link (Free For Anyone To Open)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-sky-300 truncate select-all">
                {publicUrl}
              </div>

              <button
                onClick={handleCopy}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/40'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Anyone with this link can open and generate full presentations instantly on any browser, phone, tablet, or laptop.
            </p>
          </div>

          {/* 3 Core Freeware Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-white block">Freeware & Open</strong>
                <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                  Zero cost, no subscriptions, and no login required for students or faculty.
                </span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-white block">API Key Merged</strong>
                <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                  AI key is built-in server-side. Users never need to supply or buy an API key.
                </span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-white block">All Features Unlocked</strong>
                <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                  Dr. R S Yadav Haryanvi speech, colored metabolic cycles & .pptx export ready.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
              1-Click Share to Medical Batches & Colleagues
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={handleWhatsAppShare}
                className="py-3 px-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 text-emerald-200 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Share on WhatsApp</span>
              </button>

              <button
                onClick={handleTelegramShare}
                className="py-3 px-4 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-600/40 text-sky-200 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-sky-400" />
                <span>Share on Telegram</span>
              </button>

              <button
                onClick={handleEmailShare}
                className="py-3 px-4 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-600/40 text-indigo-200 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Email to Department</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Professor Dr. R. S. Yadav Medical Teaching Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
