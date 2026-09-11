// FLUENTRA Text-To-Speech (TTS) Service

class TTSService {
  private isSpeaking: boolean = false;

  public speak(
    text: string, 
    lang: string = 'fr-FR', 
    slow: boolean = false, 
    onEnd?: () => void
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = slow ? 0.72 : 0.95; // Clearer, slightly deliberate pace
    utterance.pitch = 1.0;

    // Pick a high quality native voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && (v.name.includes('Natural') || v.name.includes('Premium') || v.localService));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public getStatus(): boolean {
    return this.isSpeaking;
  }
}

export const ttsService = new TTSService();
