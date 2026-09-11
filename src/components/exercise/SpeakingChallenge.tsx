// FLUENTRA Speaking & Pronunciation Challenge Exercise
import React, { useState } from 'react';
import { Exercise } from '../../types/curriculum';
import { AudioControls } from '../speech/AudioControls';
import { RecordMicButton } from '../speech/RecordMicButton';
import { PronunciationScoreCard } from '../speech/PronunciationScoreCard';
import { speechService } from '../../services/speechService';
import { pronunciationEngine } from '../../services/pronunciationService';
import { soundService } from '../../services/soundService';
import { SpeechRecognitionState, PronunciationResult } from '../../types/speech';

interface SpeakingChallengeProps {
  exercise: Exercise;
  onPass: (score: number) => void;
}

export const SpeakingChallenge: React.FC<SpeakingChallengeProps> = ({ exercise, onPass }) => {
  const [speechState, setSpeechState] = useState<SpeechRecognitionState>('idle');
  const [evalResult, setEvalResult] = useState<PronunciationResult | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string>('');

  const target = exercise.targetText || exercise.audioText || 'Bonjour';

  const handleStartMic = () => {
    soundService.playMicClick();
    setSpeechState('listening');
    setEvalResult(null);

    const started = speechService.start(
      'fr-FR',
      (transcript, isFinal) => {
        setLastTranscript(transcript);
        if (isFinal) {
          handleEvaluate(transcript);
        }
      },
      (errorMsg) => {
        console.warn('Speech recognition warning:', errorMsg);
        setSpeechState('idle');
      },
      () => {
        if (speechState === 'listening') {
          setSpeechState('idle');
        }
      }
    );

    if (!started) {
      // If browser doesn't have mic support, fall back to simulated test
      setSpeechState('idle');
    }
  };

  const handleStopMic = () => {
    soundService.playMicClick();
    speechService.stop();
    if (lastTranscript) {
      handleEvaluate(lastTranscript);
    } else {
      setSpeechState('idle');
    }
  };

  const handleEvaluate = (transcript: string) => {
    setSpeechState('processing');
    setTimeout(() => {
      const result = pronunciationEngine.evaluate(target, transcript);
      setEvalResult(result);
      setSpeechState('success');

      if (result.isPassed) {
        soundService.playCorrect();
      } else {
        soundService.playIncorrect();
      }
    }, 450);
  };

  const handleSimulate = (sampleText: string) => {
    setSpeechState('listening');
    setTimeout(() => {
      setLastTranscript(sampleText);
      handleEvaluate(sampleText);
    }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '6px' }}>
          {exercise.prompt}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)' }}>
          Listen to the model pronunciation, then tap the mic to speak.
        </p>
      </div>

      {/* Target Phrase Box */}
      <div
        className="fl-card fl-card-active"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '12px',
          padding: '24px 16px'
        }}
      >
        <AudioControls text={target} size="lg" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            {target}
          </span>
          {exercise.phoneticHint && (
            <span style={{ fontSize: '14px', color: 'var(--fl-teal-light)', fontFamily: 'monospace' }}>
              {exercise.phoneticHint}
            </span>
          )}
          {exercise.translation && (
            <span style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
              “{exercise.translation}”
            </span>
          )}
        </div>
      </div>

      {/* Microphone Control Area */}
      {!evalResult && (
        <RecordMicButton
          state={speechState}
          onStart={handleStartMic}
          onStop={handleStopMic}
          onSimulateSpeech={handleSimulate}
          targetSample={target}
        />
      )}

      {/* Result Card */}
      {evalResult && (
        <PronunciationScoreCard
          result={evalResult}
          onRetry={() => {
            setEvalResult(null);
            setSpeechState('idle');
          }}
          onContinue={() => onPass(evalResult.overallScore)}
        />
      )}
    </div>
  );
};
