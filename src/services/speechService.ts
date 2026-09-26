// FLUENTRA High-Performance Speech Recognition Service (Web Speech API)

export type SpeechCallback = (transcript: string, isFinal: boolean) => void;
export type SpeechErrorCallback = (errorMessage: string) => void;

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    this.initRecognition();
  }

  private initRecognition(): void {
    if (typeof window !== 'undefined') {
      const win = window as IWindowWithSpeech;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        // Continuous mode prevents premature cutoff on tiny breath pauses
        this.recognition.continuous = true;
        // Real-time interim results deliver instant responsiveness
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(
    lang: string = 'fr-FR',
    onResult: SpeechCallback,
    onError: SpeechErrorCallback,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        onError('Speech recognition is not supported in this browser. Please use Chrome, Safari or Edge.');
        return false;
      }
    }

    try {
      // If already listening, cleanly abort previous session first
      if (this.isListening) {
        try {
          this.recognition.abort();
        } catch (_) {
          // ignore
        }
        this.isListening = false;
      }

      this.recognition.lang = lang;
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res && res[0]) {
            if (res.isFinal) {
              finalTranscript += res[0].transcript;
            } else {
              interimTranscript += res[0].transcript;
            }
          }
        }

        const text = (finalTranscript || interimTranscript).trim();
        if (text) {
          onResult(text, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        // Intentionally aborted sessions shouldn't show an error alert
        if (event.error === 'aborted') return;

        this.isListening = false;
        let message = 'Could not hear your audio clearly. Please try again.';
        if (event.error === 'not-allowed') {
          message = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
        } else if (event.error === 'no-speech') {
          message = 'No speech detected. Please tap the mic and speak clearly.';
        }
        onError(message);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      this.isListening = false;
      onError('Could not start microphone. Please try again.');
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Safe ignore
      }
      this.isListening = false;
    }
  }

  public abort(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // Safe ignore
      }
      this.isListening = false;
    }
  }

  public getListeningState(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
