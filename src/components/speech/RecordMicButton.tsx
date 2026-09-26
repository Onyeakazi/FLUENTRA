// FLUENTRA Microphone Recording Button & Visualizer
import React from 'react';
import { Mic, Square } from 'lucide-react';
import { SpeechRecognitionState } from '../../types/speech';

interface RecordMicButtonProps {
  state: SpeechRecognitionState;
  onStart: () => void;
  onStop: () => void;
  liveTranscript?: string;
}

export const RecordMicButton: React.FC<RecordMicButtonProps> = ({
  state,
  onStart,
  onStop,
  liveTranscript
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

      {/* Human Guidance Label & Live Transcript */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontWeight: 700, fontSize: '16px', color: isListening ? 'var(--fl-coral-flame)' : 'var(--fl-text-primary)' }}>
          {isListening
            ? 'Listening... Speak clearly'
            : isProcessing
            ? 'Analyzing pronunciation...'
            : 'Tap microphone and speak'}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--fl-text-muted)', marginTop: '3px' }}>
          {isListening ? 'Tap square when finished' : 'Speak at natural speed'}
        </p>

        {/* Real-time Spoken Transcript Visualizer */}
        {isListening && liveTranscript && (
          <div
            style={{
              marginTop: '10px',
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: 'rgba(0, 245, 180, 0.12)',
              border: '1px solid rgba(0, 245, 180, 0.35)',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--fl-teal-light)',
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Heard: “{liveTranscript}”
          </div>
        )}
      </div>
    </div>
  );
};
