import { Slide } from '../types/ppt';

export type SpeechMode = 'speaker_notes' | 'haryanvi' | 'both';

class MedicalSpeechService {
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private voices: SpeechSynthesisVoice[] = [];
  private resumeInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
    return this.voices;
  }

  public getTextForSlide(slide: Slide, mode: SpeechMode = 'haryanvi'): string {
    const attachedSpeakerNotes = slide.speakerNotes?.trim() || slide.keyPoints.join('. ');
    const haryanviIntro = slide.haryanviSpeech?.trim() ||
      `अरे लाडलो! ध्यान से सुनो, मैं थारा प्रोफेसर डॉ. आर एस यादव! स्लाइड ${slide.slideNumber} पे देखो: ${slide.title}!`;

    if (mode === 'haryanvi') {
      // Loud energetic Haryanvi Hindi professor lecture by Dr. R S Yadav
      return `${haryanviIntro} ${attachedSpeakerNotes ? `\n\nइस स्लाइड का मुख्य मेडिकल नोट से: ${attachedSpeakerNotes}` : ''}`;
    } else if (mode === 'speaker_notes') {
      // Verbatim attached speaker notes for the professor
      const parts = [
        attachedSpeakerNotes,
        slide.clinicalPearl ? `Clinical pearl: ${slide.clinicalPearl}` : '',
        slide.examAlert ? `Exam alert: ${slide.examAlert}` : ''
      ].filter(Boolean);
      return parts.join(' ');
    } else {
      // Both: Haryanvi professor intro + full attached speaker notes
      return `${haryanviIntro} \n\n Detailed Attached Speaker Notes: ${attachedSpeakerNotes}. ${slide.clinicalPearl || ''}`;
    }
  }

  public speak(
    text: string,
    options?: {
      mode?: SpeechMode;
      volume?: number;
      rate?: number;
      lang?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported on this browser.');
      options?.onError?.('SpeechSynthesis not supported');
      return;
    }

    if (!text || text.trim() === '') {
      options?.onEnd?.();
      return;
    }

    // Cleanly cancel any previous utterance without triggering false error callbacks
    this.stop();

    // Chrome bug workaround: ensure synthesis is unpaused
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {
      // ignore
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance;

    // Loud, authoritative professor volume and energetic pitch
    utterance.volume = options?.volume ?? 1.0;
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = 1.05; // Slightly commanding lecture tone

    const effectiveMode = options?.mode || 'haryanvi';
    const targetLang = options?.lang || (effectiveMode === 'speaker_notes' ? 'en-IN' : 'hi-IN');
    utterance.lang = targetLang;

    // Find suitable voice (prioritize Hindi hi-IN voices for Haryanvi Hindi speech)
    const voices = this.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined;
    if (targetLang === 'hi-IN' || effectiveMode === 'haryanvi' || effectiveMode === 'both') {
      selectedVoice = voices.find(v => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l.startsWith('hi') || v.name.toLowerCase().includes('hindi') || l.includes('hi-in');
      });
      if (!selectedVoice) {
        // Fallback to Indian English or India localized voice
        selectedVoice = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india') || v.lang.includes('IN'));
      }
    } else {
      selectedVoice = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'));
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
      }
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      options?.onStart?.();

      // Chrome timeout fix for long utterances (>15s): periodically ping resume
      if (this.resumeInterval) clearInterval(this.resumeInterval);
      this.resumeInterval = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }
      }, 10000);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.clearResumeInterval();
      options?.onEnd?.();
    };

    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
      // 'interrupted' or 'canceled' is standard Web Speech API behavior when user switches slides
      if (e.error === 'interrupted' || e.error === 'canceled') {
        return;
      }
      console.warn('Speech synthesis non-critical event:', e.error);
      this.isSpeaking = false;
      this.clearResumeInterval();
      options?.onError?.(e);
    };

    // Small delay ensures previous cancel() is flushed across all browser engines
    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis.speak catch:', err);
        options?.onError?.(err);
      }
    }, 50);
  }

  public speakSlide(
    slide: Slide,
    options?: {
      mode?: SpeechMode;
      volume?: number;
      rate?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ) {
    const mode = options?.mode || 'haryanvi';
    const text = this.getTextForSlide(slide, mode);
    this.speak(text, {
      ...options,
      mode,
    });
  }

  public stop() {
    this.clearResumeInterval();
    if (this.activeUtterance) {
      // Remove event handlers so cancel() does not trigger premature onError
      this.activeUtterance.onstart = null;
      this.activeUtterance.onend = null;
      this.activeUtterance.onerror = null;
      this.activeUtterance = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.isSpeaking = false;
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking || (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking);
  }

  private clearResumeInterval() {
    if (this.resumeInterval) {
      clearInterval(this.resumeInterval);
      this.resumeInterval = null;
    }
  }
}

export const speechService = new MedicalSpeechService();
