// FLUENTRA Microphone Recording Button & Visualizer
import React from 'react';
import { Mic, Square, Sparkles } from 'lucide-react';
import { SpeechRecognitionState } from '../../types/speech';

interface RecordMicButtonProps {
  state: SpeechRecognitionState;
  onStart: () => void;
  onStop: () => void;
  onSimulateSpeech?: (transcript: string) => void;
  targetSample?: string;
}

export const RecordMicButton: React.FC<RecordMicButtonProps> = ({
  state,
  onStart,
  onStop,
  onSimulateSpeech,
  targetSample
}) => {
  const isListening = state === 'listening';
  const isProcessing = state === 'processing' || state === 'evaluating';

  return (
    <div className="fl-mic-container">
      {/* Waveform Animation during active speech */}
      <div className="fl-waveform" aria-hidden="true">
        {[8, 16, 24, 18, 28, 14, 22, 10].map((baseHeight, i) => (
          <div
            key={i}
            className={`fl-waveform-bar ${isListening ? 'active' : ''}`}
            style={{
              height: isListening ? `${baseHeight}px` : '4px',
              animationDelay: `${i * 0.1}s`,
              backgroundColor: isListening ? 'var(--fl-coral-flame)' : 'rgba(255, 255, 255, 0.2)'
            }}
          />
        ))}
      </div>

      {/* Main Touch-Friendly Record Button */}
      <button
        type="button"
        id="btn-mic-toggle"
        className={`fl-mic-btn ${isListening ? 'recording' : ''}`}
        onClick={isListening ? onStop : onStart}
        disabled={isProcessing}
        aria-label={isListening ? 'Stop recording' : 'Tap to speak'}
      >
        {isListening ? (
          <Square size={32} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <Mic size={36} color="var(--fl-text-inverse)" />
        )}
      </button>

      {/* Human Guidance Label */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 700, fontSize: '15px', color: isListening ? 'var(--fl-coral-flame)' : 'var(--fl-text-primary)' }}>
          {isListening
            ? 'Listening... Speak clearly'
            : isProcessing
            ? 'Analyzing pronunciation...'
            : 'Tap microphone and speak'}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--fl-text-muted)', marginTop: '2px' }}>
          {isListening ? 'Tap square when finished' : 'Speak at natural speed'}
        </p>
      </div>

      {/* Test / Fallback Quick Simulator */}
      {onSimulateSpeech && targetSample && (
        <button
          type="button"
          className="fl-btn-secondary"
          onClick={() => onSimulateSpeech(targetSample)}
          style={{
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: 'var(--fl-radius-full)',
            marginTop: '4px'
          }}
          title="Simulate speaking for testing"
        >
          <Sparkles size={13} color="var(--fl-teal-light)" />
          <span>Quick Voice Demo</span>
        </button>
      )}
    </div>
  );
};
