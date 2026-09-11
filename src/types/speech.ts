// FLUENTRA Speech & Pronunciation Types

export type SpeechRecognitionState = 
  | 'idle' 
  | 'listening' 
  | 'processing' 
  | 'evaluating' 
  | 'success' 
  | 'error' 
  | 'unsupported';

export interface WordPronunciation {
  word: string;
  expected: string;
  score: number; // 0 to 100
  accuracy: 'exact' | 'approximate' | 'missed';
  phoneticHint?: string;
  feedback?: string;
}

export interface PronunciationResult {
  overallScore: number; // 0 to 100
  rawTranscription: string;
  targetText: string;
  words: WordPronunciation[];
  feedbackMessage: string;
  isPassed: boolean; // >= 70%
  phoneticAdvice?: string;
}

export interface AudioSettings {
  playbackRate: number; // 1.0 or 0.8
  pitch: number;
  voiceURI?: string;
  soundEffects: boolean;
}
