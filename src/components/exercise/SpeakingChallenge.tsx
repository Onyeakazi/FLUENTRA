// FLUENTRA Speaking & Pronunciation Challenge Exercise
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Exercise } from '../../types/curriculum';
import { AudioControls } from '../speech/AudioControls';
import { RecordMicButton } from '../speech/RecordMicButton';
import { PronunciationScoreCard } from '../speech/PronunciationScoreCard';
import { speechService } from '../../services/speechService';
import { pronunciationEngine } from '../../services/pronunciationService';
import { soundService } from '../../services/soundService';
import { useUser } from '../../context/UserContext';
import { getLanguageOption } from '../../data/languages';
import { SpeechRecognitionState, PronunciationResult } from '../../types/speech';

interface SpeakingChallengeProps {
  exercise: Exercise;
  onPass: (score: number) => void;
}

export const SpeakingChallenge: React.FC<SpeakingChallengeProps> = ({ exercise, onPass }) => {
  const { profile } = useUser();
  const currentLang = profile?.currentLanguage || 'French';
  const langOpt = getLanguageOption(currentLang);
  const langCode = langOpt?.code || 'fr-FR';

  const [speechState, setSpeechState] = useState<SpeechRecognitionState>('idle');
  const [evalResult, setEvalResult] = useState<PronunciationResult | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  const target = exercise.targetText || exercise.audioText || 'Bonjour';

  const latestTranscriptRef = useRef<string>('');
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEvaluatedRef = useRef<boolean>(false);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      speechService.stop();
    };
  }, []);

  const triggerEvaluation = useCallback((transcriptToEval: string) => {
    if (isEvaluatedRef.current) return;
    isEvaluatedRef.current = true;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    speechService.stop();
    setSpeechState('processing');

    // Immediate evaluation without artificial latency
    const result = pronunciationEngine.evaluate(target, transcriptToEval);
    setEvalResult(result);
    setSpeechState('success');

    if (result.isPassed) {
      soundService.playCorrect();
    } else {
      soundService.playIncorrect();
    }
  }, [target]);

  const handleStartMic = () => {
    soundService.playMicClick();
    setSpeechState('listening');
    setEvalResult(null);
    setLiveTranscript('');
    latestTranscriptRef.current = '';
    isEvaluatedRef.current = false;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    const started = speechService.start(
      langCode,
      (transcript, isFinal) => {
        if (isEvaluatedRef.current) return;

        const cleanTranscript = transcript.trim();
        latestTranscriptRef.current = cleanTranscript;
        setLiveTranscript(cleanTranscript);

        // 1. FAST-PATH: If spoken text already meets the passing threshold (>= 80%), evaluate immediately!
        const quickEval = pronunciationEngine.evaluate(target, cleanTranscript);
        if (quickEval.isPassed) {
          triggerEvaluation(cleanTranscript);
          return;
        }

        // 2. FINAL RESULT: If the engine finalized the utterance, evaluate immediately
        if (isFinal) {
          triggerEvaluation(cleanTranscript);
          return;
        }

        // 3. FAST SILENCE DEBOUNCE: If learner spoke and paused for 600ms, evaluate immediately
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          if (!isEvaluatedRef.current && latestTranscriptRef.current) {
            triggerEvaluation(latestTranscriptRef.current);
          }
        }, 600);
      },
      (errorMsg) => {
        console.warn('Speech recognition warning:', errorMsg);
        if (!isEvaluatedRef.current) {
          setSpeechState('idle');
        }
      },
      () => {
        // When speech recognition ends: if speech was captured but not evaluated, evaluate it now
        if (!isEvaluatedRef.current) {
          if (latestTranscriptRef.current) {
            triggerEvaluation(latestTranscriptRef.current);
          } else {
            setSpeechState('idle');
          }
        }
      }
    );

    if (!started) {
      setSpeechState('idle');
    }
  };

  const handleStopMic = () => {
    soundService.playMicClick();
    speechService.stop();

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (latestTranscriptRef.current && !isEvaluatedRef.current) {
      triggerEvaluation(latestTranscriptRef.current);
    } else if (!isEvaluatedRef.current) {
      setSpeechState('idle');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
          {exercise.prompt}
        </h3>
        <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)' }}>
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
          gap: '14px',
          padding: '26px 18px'
        }}
      >
        <AudioControls text={target} size="lg" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            {target}
          </span>
          {exercise.phoneticHint && (
            <span style={{ fontSize: '15px', color: 'var(--fl-teal-light)', fontFamily: 'monospace' }}>
              {exercise.phoneticHint}
            </span>
          )}
          {exercise.translation && (
            <span style={{ fontSize: '16px', color: 'var(--fl-text-secondary)', marginTop: '4px' }}>
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
          liveTranscript={liveTranscript}
        />
      )}

      {/* Result Card */}
      {evalResult && (
        <PronunciationScoreCard
          result={evalResult}
          onRetry={() => {
            setEvalResult(null);
            setLiveTranscript('');
            latestTranscriptRef.current = '';
            isEvaluatedRef.current = false;
            setSpeechState('idle');
          }}
          onContinue={() => {
            if (evalResult.overallScore >= 80) {
              onPass(evalResult.overallScore);
            }
          }}
        />
      )}
    </div>
  );
};
