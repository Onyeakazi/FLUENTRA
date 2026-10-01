// FLUENTRA 11-Mode Ear Training & Audio Arcade Modal Component
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  X,
  Volume2,
  Snail,
  Mic,
  Check,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  Crown,
  BookOpen,
  Eye,
  EyeOff,
  Flame,
  Timer,
  Square
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UnitMetadata } from '../../types/curriculum';
import { earTrainingService, EarGameRound } from '../../services/earTrainingService';
import { ttsService } from '../../services/ttsService';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { pronunciationEngine } from '../../services/pronunciationService';
import { useUser } from '../../context/UserContext';
import { useProgression } from '../../context/ProgressionContext';
import { SpeechRecognitionState, PronunciationResult } from '../../types/speech';

interface EarTrainingGameModalProps {
  unit: UnitMetadata;
  lessonId?: string;
  onClose: () => void;
  onCompleted?: () => void;
}

export const EarTrainingGameModal: React.FC<EarTrainingGameModalProps> = ({
  unit,
  lessonId,
  onClose,
  onCompleted
}) => {
  const { profile, addXp } = useUser();
  const { isUnitUnlocked } = useProgression();
  const currentLang = profile.currentLanguage || 'French';

  const [rounds, setRounds] = useState<EarGameRound[]>(() =>
    earTrainingService.getRoundsForUnit(unit.id, currentLang, lessonId)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync rounds if unit, language, or lessonId changes
  useEffect(() => {
    setRounds(earTrainingService.getRoundsForUnit(unit.id, currentLang, lessonId));
    setCurrentIndex(0);
  }, [unit.id, currentLang, lessonId]);

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSpeed, setPlayingSpeed] = useState<number>(0.95);

  // User Interaction State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<boolean | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Mode 3 & 10 Mic Shadowing State
  const [speechState, setSpeechState] = useState<SpeechRecognitionState>('idle');
  const [evalResult, setEvalResult] = useState<PronunciationResult | null>(null);
  const [lastTranscript, setLastTranscript] = useState('');
  const [bossActivePhraseIndex, setBossActivePhraseIndex] = useState(0);
  const [bossCompletedScores, setBossCompletedScores] = useState<Record<number, number>>({});
  const [bossLastFeedback, setBossLastFeedback] = useState<{ transcript: string; score: number } | null>(null);
  const bossActivePhraseIndexRef = useRef<number>(0);
  bossActivePhraseIndexRef.current = bossActivePhraseIndex;

  // Mode 4 Blitz State
  const [blitzMatches, setBlitzMatches] = useState<string[]>([]);
  const [blitzSelectedLeft, setBlitzSelectedLeft] = useState<string | null>(null);
  const [blitzTimer, setBlitzTimer] = useState(45);

  // Mode 11 Story State
  const [showEnglishReview, setShowEnglishReview] = useState(false);
  const [activeStorySentenceId, setActiveStorySentenceId] = useState<string | null>(null);

  const currentRound = rounds[currentIndex] || rounds[0];

  // Randomly mix up options so the correct answer is never predictably in the first position
  const roundOptions = useMemo(() => {
    const raw = currentRound?.options || [];
    if (raw.length <= 1) return raw;
    const shuffled = [...raw];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [currentRound?.id]);

  const progressPercent = Math.round(((currentIndex) / rounds.length) * 100);

  const modeBadgeText = useMemo(() => {
    if (!currentRound?.badgeLabel) return 'AUDIO';
    return currentRound.badgeLabel.replace(/^\d+\/\d+\s*·\s*/, '');
  }, [currentRound?.badgeLabel]);

  const isActionDisabled = useMemo(() => {
    if (isChecked) return false;
    if (currentRound.mode === 'sound_blitz') return false;
    if (currentRound.mode === 'echo_mimic') return !evalResult;
    if (currentRound.mode === 'audio_tile_builder') return selectedWords.length === 0;
    if (currentRound.mode === 'audio_true_false') return selectedTrueFalse === null;
    if (currentRound.mode === 'boss_shadowing') {
      const total = currentRound.bossPhrases?.length || 3;
      return Object.keys(bossCompletedScores).length < total;
    }
    return !selectedOptionId;
  }, [isChecked, currentRound.mode, evalResult, selectedWords.length, selectedTrueFalse, selectedOptionId, bossCompletedScores, currentRound.bossPhrases]);

  // Auto-play audio on round start (except story which has sentence buttons)
  useEffect(() => {
    setIsChecked(false);
    setIsCorrect(false);
    setSelectedOptionId(null);
    setSelectedWords([]);
    setSelectedTrueFalse(null);
    setEvalResult(null);
    setSpeechState('idle');
    setShowEnglishReview(false);
    setBossActivePhraseIndex(0);
    setBossCompletedScores({});
    setBossLastFeedback(null);

    const timer = setTimeout(() => {
      if (currentRound && currentRound.mode !== 'audio_story' && currentRound.mode !== 'sound_blitz') {
        playAudio(currentRound.audioText, 0.95);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [currentIndex, currentRound?.id]);

  // Mode 4 Blitz Timer countdown
  useEffect(() => {
    if (currentRound?.mode === 'sound_blitz' && !isChecked && blitzTimer > 0) {
      const interval = setInterval(() => {
        setBlitzTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentRound?.mode, isChecked, blitzTimer]);

  const playAudio = (text: string, rate = 0.95, onDone?: () => void) => {
    if (!text) return;
    setIsPlaying(true);
    setPlayingSpeed(rate);
    const slow = rate < 0.85;
    ttsService.speak(text, currentRound.langCode, slow, () => {
      setIsPlaying(false);
      if (onDone) onDone();
    });
  };

  const latestSpeechTranscriptRef = useRef<string>('');
  const speechSilenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSpeechEvaluatedRef = useRef<boolean>(false);

  const triggerEvaluateSpeech = useCallback((transcriptToEval: string) => {
    if (isSpeechEvaluatedRef.current) return;
    isSpeechEvaluatedRef.current = true;

    if (speechSilenceTimerRef.current) {
      clearTimeout(speechSilenceTimerRef.current);
      speechSilenceTimerRef.current = null;
    }

    speechService.stop();
    setSpeechState('processing');

    const activeBossIdx = bossActivePhraseIndexRef.current;
    const activeBossPhrase = currentRound.bossPhrases?.[activeBossIdx];
    const target = currentRound.mode === 'boss_shadowing' && activeBossPhrase
      ? (activeBossPhrase.targetText || activeBossPhrase.audioText)
      : (currentRound.targetText || currentRound.audioText);

    const result = pronunciationEngine.evaluate(target, transcriptToEval);
    setEvalResult(result);
    setSpeechState('success');

    const passed = result.overallScore >= 50 || result.isPassed;

    if (currentRound.mode === 'boss_shadowing') {
      if (passed) {
        soundService.playCorrect();
        setBossLastFeedback(null);
        setBossCompletedScores((prev) => {
          const nextScores = { ...prev, [activeBossIdx]: Math.max(result.overallScore, 75) };
          const totalPhrases = currentRound.bossPhrases?.length || 3;
          if (Object.keys(nextScores).length >= totalPhrases) {
            setIsCorrect(true);
            setIsChecked(true);
            setTotalXpEarned((p) => p + 20);
            addXp(20);
          } else {
            let nextIdx = (activeBossIdx + 1) % totalPhrases;
            while (nextScores[nextIdx] !== undefined && Object.keys(nextScores).length < totalPhrases) {
              nextIdx = (nextIdx + 1) % totalPhrases;
            }
            setBossActivePhraseIndex(nextIdx);
            setTimeout(() => {
              isSpeechEvaluatedRef.current = false;
              setSpeechState('idle');
            }, 800);
          }
          return nextScores;
        });
      } else {
        soundService.playIncorrect();
        setBossLastFeedback({
          transcript: transcriptToEval,
          score: result.overallScore
        });
        setTimeout(() => {
          isSpeechEvaluatedRef.current = false;
          setSpeechState('idle');
        }, 1200);
      }
      return;
    }

    setIsCorrect(passed);
    setIsChecked(true);

    if (passed) {
      soundService.playCorrect();
      setTotalXpEarned((p) => p + 15);
      addXp(15);
    } else {
      soundService.playIncorrect();
    }
  }, [currentRound, addXp]);

  // Mic Shadowing Handlers
  const handleStartMic = () => {
    soundService.playMicClick();
    setSpeechState('listening');
    setEvalResult(null);
    setLastTranscript('');
    latestSpeechTranscriptRef.current = '';
    isSpeechEvaluatedRef.current = false;

    if (speechSilenceTimerRef.current) {
      clearTimeout(speechSilenceTimerRef.current);
      speechSilenceTimerRef.current = null;
    }

    const started = speechService.start(
      currentRound.langCode,
      (transcript, isFinal) => {
        if (isSpeechEvaluatedRef.current) return;

        const clean = transcript.trim();
        latestSpeechTranscriptRef.current = clean;
        setLastTranscript(clean);

        // Fast-path: immediate pass if pronunciation meets passing score
        const activeBossIdx = bossActivePhraseIndexRef.current;
        const activeBossPhrase = currentRound.bossPhrases?.[activeBossIdx];
        const target = currentRound.mode === 'boss_shadowing' && activeBossPhrase
          ? (activeBossPhrase.targetText || activeBossPhrase.audioText)
          : (currentRound.targetText || currentRound.audioText);

        const quick = pronunciationEngine.evaluate(target, clean);
        if (quick.overallScore >= 50 || quick.isPassed) {
          triggerEvaluateSpeech(clean);
          return;
        }

        if (isFinal) {
          triggerEvaluateSpeech(clean);
          return;
        }

        if (speechSilenceTimerRef.current) {
          clearTimeout(speechSilenceTimerRef.current);
        }
        speechSilenceTimerRef.current = setTimeout(() => {
          if (!isSpeechEvaluatedRef.current && latestSpeechTranscriptRef.current) {
            triggerEvaluateSpeech(latestSpeechTranscriptRef.current);
          }
        }, 600);
      },
      () => {
        if (!isSpeechEvaluatedRef.current) {
          setSpeechState('idle');
        }
      },
      () => {
        if (!isSpeechEvaluatedRef.current) {
          if (latestSpeechTranscriptRef.current) {
            triggerEvaluateSpeech(latestSpeechTranscriptRef.current);
          } else {
            setSpeechState('idle');
          }
        }
      }
    );

    if (!started) setSpeechState('idle');
  };

  const handleStopMic = () => {
    soundService.playMicClick();
    speechService.stop();

    if (speechSilenceTimerRef.current) {
      clearTimeout(speechSilenceTimerRef.current);
      speechSilenceTimerRef.current = null;
    }

    if (latestSpeechTranscriptRef.current && !isSpeechEvaluatedRef.current) {
      triggerEvaluateSpeech(latestSpeechTranscriptRef.current);
    } else if (!isSpeechEvaluatedRef.current) {
      setSpeechState('idle');
    }
  };

  // Checking Answers
  const handleCheck = () => {
    let passed = false;

    if (
      currentRound.mode === 'blind_ear' ||
      currentRound.mode === 'audio_cloze' ||
      currentRound.mode === 'minimal_pair_duel' ||
      currentRound.mode === 'speed_warp' ||
      currentRound.mode === 'audio_dialogue_reply'
    ) {
      passed = selectedOptionId === currentRound.correctOptionId;
    } else if (currentRound.mode === 'audio_true_false') {
      passed = selectedTrueFalse === currentRound.isTrueStatement;
    } else if (currentRound.mode === 'audio_tile_builder') {
      passed = selectedWords.join(' ') === currentRound.correctWordOrder?.join(' ');
    } else if (currentRound.mode === 'sound_blitz') {
      passed = blitzMatches.length >= (currentRound.blitzPairs?.length || 4);
    } else if (currentRound.mode === 'boss_shadowing') {
      passed = Object.keys(bossCompletedScores).length >= (currentRound.bossPhrases?.length || 3);
    } else if (currentRound.mode === 'audio_story') {
      passed = selectedOptionId === currentRound.storyData?.comprehensionQuestion.correctOptionId;
    }

    setIsCorrect(passed);
    setIsChecked(true);

    if (passed) {
      soundService.playCorrect();
      setTotalXpEarned(p => p + 15);
      addXp(15);
    } else {
      soundService.playIncorrect();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < rounds.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleFinishArcade();
    }
  };

  const handleRetry = () => {
    setIsChecked(false);
    setIsCorrect(false);
    setSelectedOptionId(null);
    setSelectedWords([]);
    setSelectedTrueFalse(null);
    setEvalResult(null);
    setSpeechState('idle');
    setBossActivePhraseIndex(0);
    setBossCompletedScores({});
    playAudio(currentRound.audioText, 0.95);
  };

  const handleFinishArcade = () => {
    setIsGameFinished(true);
    addXp(50); // Bonus completion XP
    soundService.playLevelUnlock();
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });
    if (onCompleted) onCompleted();
  };

  if (isGameFinished) {
    return (
      <div
        id="ear-training-modal-finished"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          minHeight: '100dvh',
          maxHeight: '100dvh',
          zIndex: 99999,
          backgroundColor: 'var(--fl-bg-app)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 16px',
          paddingTop: 'calc(20px + var(--fl-safe-top))',
          paddingBottom: 'calc(20px + var(--fl-safe-bottom))',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div
          className="fl-card animate-pop-in"
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '36px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            border: '2px solid #58CC02',
            boxShadow: '0 0 40px rgba(88, 204, 2, 0.25)'
          }}
        >
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFC800 0%, #FF9600 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(255, 200, 0, 0.45)'
            }}
          >
            <Crown size={44} color="#FFFFFF" strokeWidth={2.5} />
          </div>

          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
              Golden Ear Trophy Unlocked!
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', margin: 0 }}>
              You mastered all 11 ear-first challenges for <strong>Unit {unit.number}: {unit.title}</strong>!
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '14px 20px',
              borderRadius: '16px',
              backgroundColor: 'var(--fl-bg-card-hover)',
              border: '1px solid var(--fl-border)',
              width: '100%',
              justifyContent: 'space-around'
            }}
          >
            <div>
              <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)', fontWeight: 700, display: 'block' }}>TOTAL XP</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--fl-gold-star)' }}>+{totalXpEarned + 50}</span>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)', fontWeight: 700, display: 'block' }}>EAR ACCURACY</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#58CC02' }}>100%</span>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)', fontWeight: 700, display: 'block' }}>MODES MASTERED</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--fl-teal-light)' }}>11 / 11</span>
            </div>
          </div>

          <button
            type="button"
            className="fl-btn fl-btn-primary"
            onClick={() => {
              if (onCompleted) onCompleted();
              onClose();
            }}
            style={{ width: '100%', minHeight: '52px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <span>Return to Learning Path</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="ear-training-modal-root"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        minHeight: '100dvh',
        maxHeight: '100dvh',
        zIndex: 99999,
        backgroundColor: 'var(--fl-bg-app)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Bar with Safe Area Inset */}
      <div
        style={{
          width: '100%',
          borderBottom: '1px solid var(--fl-border)',
          backgroundColor: 'var(--fl-bg-card)',
          paddingTop: 'var(--fl-safe-top)'
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <button
            type="button"
            className="fl-btn-icon"
            onClick={onClose}
            style={{ width: '38px', height: '38px', flexShrink: 0 }}
            aria-label="Exit Arcade"
          >
            <X size={20} />
          </button>

          <div style={{ flex: 1 }}>
            <div className="fl-progress-track">
              <div
                className="fl-progress-fill"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #58CC02 0%, #00F5B4 100%)'
                }}
              />
            </div>
          </div>

          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)' }}>
            {currentIndex + 1} / {rounds.length}
          </span>
        </div>
      </div>

      {/* Main Interactive Game Stage */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '20px 16px'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
        {/* Step Indicator Header matching Core Lesson Runner (Image 2) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="fl-badge fl-badge-teal"
              style={{ fontSize: '11px', padding: '3px 8px', fontWeight: 800 }}
            >
              Step {currentIndex + 1}/11 · {modeBadgeText}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', fontWeight: 700 }}>
              {unit.title}
            </span>
          </div>

          <span style={{ fontSize: '12px', color: 'var(--fl-gold-star)', fontWeight: 700 }}>
            +15 XP
          </span>
        </div>

        {/* Prompt Header */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px', lineHeight: 1.3 }}>
            {currentRound.title}
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', margin: 0, lineHeight: 1.45 }}>
            {currentRound.instruction}
          </p>
        </div>

        {/* Central Hero Card (Modes 1 to 9) - Matching Image 2 Fluentra Styling */}
        {currentRound.mode !== 'audio_story' && currentRound.mode !== 'sound_blitz' && currentRound.mode !== 'boss_shadowing' && (
          <div
            className="fl-card fl-card-active"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 20px',
              marginBottom: '22px',
              borderRadius: '20px',
              background: 'rgba(0, 245, 180, 0.04)',
              border: isPlaying ? '1.5px solid var(--fl-teal-light)' : '1.5px solid rgba(0, 245, 180, 0.35)',
              boxShadow: isPlaying ? '0 0 28px rgba(0, 245, 180, 0.22)' : '0 0 20px rgba(0, 245, 180, 0.08)',
              position: 'relative',
              textAlign: 'center',
              gap: '12px'
            }}
          >
            {/* Audio Controls (Play Normal + Slow 0.7x + Speed Warp) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="fl-btn-icon"
                onClick={() => playAudio(currentRound.audioText, 0.95)}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: isPlaying && playingSpeed === 0.95 ? 'var(--fl-teal-subtle)' : 'var(--fl-bg-card-hover)',
                  border: `1.5px solid ${isPlaying && playingSpeed === 0.95 ? 'var(--fl-teal-light)' : 'var(--fl-border)'}`,
                  boxShadow: isPlaying && playingSpeed === 0.95 ? '0 0 16px rgba(0, 245, 180, 0.35)' : 'none'
                }}
                title="Listen to native audio"
                aria-label="Listen to audio"
              >
                <Volume2
                  size={24}
                  color={isPlaying && playingSpeed === 0.95 ? 'var(--fl-teal-light)' : '#FFFFFF'}
                />
              </button>

              <button
                type="button"
                className="fl-btn-icon"
                onClick={() => playAudio(currentRound.audioText, 0.7)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: isPlaying && playingSpeed < 0.85 ? 'var(--fl-indigo-subtle)' : 'var(--fl-bg-card-hover)',
                  border: `1.5px solid ${isPlaying && playingSpeed < 0.85 ? 'var(--fl-indigo-light)' : 'var(--fl-border)'}`
                }}
                title="Listen slowly (0.7x)"
                aria-label="Listen slowly"
              >
                <Snail
                  size={20}
                  color={isPlaying && playingSpeed < 0.85 ? 'var(--fl-indigo-light)' : 'var(--fl-text-secondary)'}
                />
              </button>

              {currentRound.mode === 'speed_warp' && (
                <button
                  type="button"
                  className="fl-btn-icon"
                  onClick={() => playAudio(currentRound.audioText, 1.25)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: isPlaying && playingSpeed > 1.1 ? 'var(--fl-coral-subtle)' : 'var(--fl-bg-card-hover)',
                    border: `1.5px solid ${isPlaying && playingSpeed > 1.1 ? 'var(--fl-coral-flame)' : 'var(--fl-border)'}`
                  }}
                  title="Listen at 1.25x Street Speed"
                  aria-label="Listen at fast speed"
                >
                  <Zap size={20} color="var(--fl-coral-flame)" />
                </button>
              )}
            </div>

            {/* Equalizer Waveform Dots (matching Image 2) */}
            {(!isChecked || currentRound.mode === 'blind_ear') && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '16px', margin: '4px 0' }}>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '5px',
                      height: isPlaying ? '14px' : '5px',
                      borderRadius: isPlaying ? '3px' : '50%',
                      backgroundColor: isPlaying ? 'var(--fl-teal-light)' : 'rgba(0, 245, 180, 0.4)',
                      transition: 'all 0.18s ease'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Audio Cloze Sentence */}
            {currentRound.sentenceWithBlank && (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  {isChecked && isCorrect && currentRound.audioText
                    ? currentRound.audioText
                    : currentRound.sentenceWithBlank}
                </div>
                {isChecked && isCorrect && currentRound.translation && (
                  <div
                    className="animate-fade-in"
                    style={{
                      fontSize: '15px',
                      color: '#58CC02',
                      fontWeight: 600,
                      backgroundColor: 'rgba(88, 204, 2, 0.12)',
                      padding: '5px 16px',
                      borderRadius: '999px',
                      border: '1px solid rgba(88, 204, 2, 0.3)'
                    }}
                  >
                    English: “{currentRound.translation}”
                  </div>
                )}
              </div>
            )}

            {/* Revealed Target Text & Phonetic Guide on Check (for non-cloze rounds) */}
            {isChecked && isCorrect && currentRound.targetText && !currentRound.sentenceWithBlank && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  {currentRound.targetText}
                </span>
                {currentRound.phoneticHint && (
                  <span style={{ fontSize: '15px', color: 'var(--fl-teal-light)', fontFamily: 'monospace' }}>
                    {currentRound.phoneticHint}
                  </span>
                )}
                {currentRound.translation && (
                  <span style={{ fontSize: '16px', color: '#58CC02', marginTop: '2px', fontWeight: 600 }}>
                    “{currentRound.translation}”
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 1, 2, 5, 7: Standard Audio Multiple Choice      */}
        {/* ---------------------------------------------------- */}
        {(currentRound.mode === 'blind_ear' ||
          currentRound.mode === 'audio_cloze' ||
          currentRound.mode === 'minimal_pair_duel' ||
          currentRound.mode === 'speed_warp') &&
          currentRound.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {roundOptions.map(opt => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrectOpt = opt.id === currentRound.correctOptionId;

                let border = '1.5px solid var(--fl-border-strong)';
                let bg = 'var(--fl-bg-card)';
                let glow = 'none';

                if (isSelected) {
                  border = '2px solid var(--fl-teal-light)';
                  bg = 'rgba(0, 245, 180, 0.08)';
                  glow = '0 0 16px rgba(0, 245, 180, 0.12)';
                }

                if (isChecked) {
                  if (isCorrectOpt) {
                    border = '2px solid #58CC02';
                    bg = 'rgba(88, 204, 2, 0.15)';
                    glow = '0 0 16px rgba(88, 204, 2, 0.2)';
                  } else if (isSelected && !isCorrectOpt) {
                    border = '2px solid var(--fl-coral-flame)';
                    bg = 'var(--fl-coral-subtle)';
                    glow = '0 0 16px rgba(255, 107, 74, 0.2)';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    className="fl-card fl-card-interactive"
                    onClick={() => {
                      if (!isChecked) {
                        setSelectedOptionId(opt.id);
                        if (opt.audioText) playAudio(opt.audioText, 0.95);
                      }
                    }}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border,
                      backgroundColor: bg,
                      boxShadow: glow,
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                        {opt.text}
                      </span>
                      {(isSelected || (isChecked && (isCorrect || isCorrectOpt))) && opt.translation && opt.translation !== 'Distractor' && opt.translation !== 'Incorrect' && currentRound.mode !== 'blind_ear' && (
                        <span className="animate-fade-in" style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', fontWeight: 500 }}>
                          {opt.translation}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      {opt.audioText && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (opt.audioText) playAudio(opt.audioText, 0.95);
                          }}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--fl-bg-card-hover)',
                            border: '1px solid var(--fl-border)'
                          }}
                          title="Listen to option"
                        >
                          <Volume2 size={16} color={isSelected ? 'var(--fl-teal-light)' : 'var(--fl-text-secondary)'} />
                        </div>
                      )}

                      {/* Fluentra Radio / Result Indicator Circle */}
                      {isChecked && isCorrectOpt ? (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#58CC02', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={14} color="#FFFFFF" />
                        </div>
                      ) : isChecked && isSelected && !isCorrectOpt ? (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--fl-coral-flame)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <X size={14} color="#FFFFFF" />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? 'var(--fl-teal-light)' : 'var(--fl-border-strong)'}`,
                            backgroundColor: isSelected ? 'var(--fl-teal-light)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0B0F19' }} />}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

        {/* ---------------------------------------------------- */}
        {/* MODE 3: Echo Mimic (Voice Shadowing with Mic)        */}
        {/* ---------------------------------------------------- */}
        {currentRound.mode === 'echo_mimic' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
            {/* Waveform Equalizer Animation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '24px' }}>
              {[8, 16, 24, 18, 28, 14, 22, 10].map((baseHeight, i) => (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: speechState === 'listening' ? `${baseHeight}px` : '4px',
                    borderRadius: '2px',
                    backgroundColor: speechState === 'listening' ? 'var(--fl-coral-flame)' : 'rgba(0, 245, 180, 0.4)',
                    transition: 'height 0.15s ease'
                  }}
                />
              ))}
            </div>

            {/* Glowing Touch Mic Button matching Image 2 */}
            <button
              type="button"
              id="btn-ear-mic-toggle"
              onClick={speechState === 'listening' ? handleStopMic : handleStartMic}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: speechState === 'listening'
                  ? 'var(--fl-coral-flame)'
                  : speechState === 'processing'
                  ? 'var(--fl-bg-card-hover)'
                  : 'var(--fl-teal-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                boxShadow: speechState === 'listening'
                  ? '0 0 32px rgba(255, 107, 74, 0.5)'
                  : '0 0 28px rgba(0, 245, 180, 0.45)',
                transition: 'all 0.18s ease'
              }}
              aria-label={speechState === 'listening' ? 'Stop recording' : 'Tap to speak'}
            >
              {speechState === 'listening' ? (
                <Square size={28} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Mic size={36} color="var(--fl-text-inverse)" />
              )}
            </button>

            {/* Guidance Text matching Image 2 */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '16px', color: speechState === 'listening' ? 'var(--fl-coral-flame)' : 'var(--fl-text-primary)', margin: 0 }}>
                {speechState === 'listening'
                  ? 'Listening... Speak clearly'
                  : speechState === 'processing'
                  ? 'Analyzing pronunciation...'
                  : 'Tap microphone and speak'}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--fl-text-muted)', marginTop: '4px', margin: '4px 0 0' }}>
                {speechState === 'listening' ? 'Tap square when finished' : 'Speak at natural speed'}
              </p>

              {speechState === 'listening' && lastTranscript && (
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
                  Heard: “{lastTranscript}”
                </div>
              )}
            </div>

            {/* Result Feedback Card */}
            {evalResult && (
              <div
                className="fl-card animate-pop-in"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  borderColor: isCorrect ? '#58CC02' : 'var(--fl-coral-flame)',
                  backgroundColor: isCorrect ? 'rgba(88, 204, 2, 0.08)' : 'rgba(239, 68, 68, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '16px', color: isCorrect ? '#58CC02' : 'var(--fl-coral-flame)' }}>
                    {isCorrect ? 'Echo Shadowing Passed! ✓' : 'Needs Another Attempt'}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '18px', color: isCorrect ? '#58CC02' : 'var(--fl-coral-flame)' }}>
                    {evalResult.overallScore}%
                  </span>
                </div>
                <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)' }}>
                  {evalResult.feedbackMessage}
                </span>
              </div>
            )}
          </div>
        )}


        {/* ---------------------------------------------------- */}
        {/* MODE 4: Sound Blitz (Timed Speed Pairing)            */}
        {/* ---------------------------------------------------- */}
        {currentRound.mode === 'sound_blitz' && currentRound.blitzPairs && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '12px', backgroundColor: 'var(--fl-bg-card-hover)', border: '1px solid var(--fl-border)' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-secondary)' }}>
                Sound Blitz Sprint
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: blitzTimer < 10 ? 'var(--fl-coral-flame)' : '#58CC02' }}>
                <Timer size={16} />
                <span style={{ fontSize: '15px', fontWeight: 800 }}>{blitzTimer}s</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {currentRound.blitzPairs.map(p => {
                const isMatched = blitzMatches.includes(p.id);
                const isSelected = blitzSelectedLeft === p.id;

                return (
                  <button
                    key={`sound-${p.id}`}
                    type="button"
                    className="fl-card fl-card-interactive"
                    onClick={() => {
                      if (!isMatched) {
                        playAudio(p.audioText, 0.95);
                        setBlitzSelectedLeft(p.id);
                      }
                    }}
                    disabled={isMatched}
                    style={{
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      borderColor: isMatched ? '#58CC02' : isSelected ? '#58CC02' : 'var(--fl-border)',
                      backgroundColor: isMatched ? 'rgba(88, 204, 2, 0.15)' : isSelected ? 'rgba(88, 204, 2, 0.1)' : 'var(--fl-bg-card)',
                      opacity: isMatched ? 0.45 : 1
                    }}
                  >
                    <Volume2 size={22} color={isMatched ? '#58CC02' : '#FFFFFF'} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fl-text-secondary)' }}>
                      {isMatched ? p.term : 'Tap sound'}
                    </span>
                  </button>
                );
              })}

              {currentRound.blitzPairs.map(p => {
                const isMatched = blitzMatches.includes(p.id);

                return (
                  <button
                    key={`meaning-${p.id}`}
                    type="button"
                    className="fl-card fl-card-interactive"
                    onClick={() => {
                      if (blitzSelectedLeft && !isMatched) {
                        if (blitzSelectedLeft === p.id) {
                          soundService.playCorrect();
                          setBlitzMatches(prev => [...prev, p.id]);
                          setBlitzSelectedLeft(null);
                        } else {
                          soundService.playIncorrect();
                        }
                      }
                    }}
                    disabled={isMatched}
                    style={{
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      borderColor: isMatched ? '#58CC02' : 'var(--fl-border)',
                      backgroundColor: isMatched ? 'rgba(88, 204, 2, 0.15)' : 'var(--fl-bg-card)',
                      opacity: isMatched ? 0.45 : 1
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                      {p.translation}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 6: Audio Tile Builder (Reverse Dictation)       */}
        {/* ---------------------------------------------------- */}
        {currentRound.mode === 'audio_tile_builder' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Answer slot */}
            <div
              style={{
                minHeight: '74px',
                padding: '14px',
                borderRadius: '16px',
                backgroundColor: 'var(--fl-bg-card)',
                border: '2px dashed var(--fl-border-strong)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              {selectedWords.length === 0 ? (
                <span style={{ fontSize: '14px', color: 'var(--fl-text-muted)' }}>
                  Tap the spoken word tiles in order...
                </span>
              ) : (
                selectedWords.map((w, idx) => (
                  <button
                    key={`${w}-${idx}`}
                    type="button"
                    className="fl-btn fl-btn-secondary"
                    onClick={() => !isChecked && setSelectedWords(prev => prev.filter((_, i) => i !== idx))}
                    style={{ padding: '8px 14px', fontSize: '16px', fontWeight: 700 }}
                  >
                    {w}
                  </button>
                ))
              )}
            </div>

            {/* Word Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentRound.tileChips?.map((chip, idx) => {
                const countUsed = selectedWords.filter(w => w === chip).length;
                const isExhausted = countUsed >= 1;

                return (
                  <button
                    key={`${chip}-${idx}`}
                    type="button"
                    className="fl-btn fl-btn-secondary"
                    onClick={() => {
                      if (!isExhausted && !isChecked) {
                        playAudio(chip, 0.95);
                        setSelectedWords(prev => [...prev, chip]);
                      }
                    }}
                    disabled={isExhausted || isChecked}
                    style={{ opacity: isExhausted ? 0.35 : 1, padding: '10px 16px', fontSize: '16px', fontWeight: 700 }}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 8: Audio True / False                           */}
        {/* ---------------------------------------------------- */}
        {currentRound.mode === 'audio_true_false' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              className="fl-card"
              style={{
                padding: '22px 20px',
                borderRadius: '18px',
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--fl-text-primary)',
                border: '1.5px solid var(--fl-border-strong)'
              }}
            >
              {currentRound.conceptStatement}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button
                type="button"
                className="fl-card fl-card-interactive"
                onClick={() => !isChecked && setSelectedTrueFalse(true)}
                style={{
                  minHeight: '60px',
                  borderRadius: '16px',
                  fontSize: '17px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: selectedTrueFalse === true ? 'rgba(88, 204, 2, 0.15)' : 'var(--fl-bg-card)',
                  border: selectedTrueFalse === true ? '2px solid #58CC02' : '1.5px solid var(--fl-border-strong)',
                  color: selectedTrueFalse === true ? '#58CC02' : 'var(--fl-text-primary)',
                  boxShadow: selectedTrueFalse === true ? '0 0 16px rgba(88, 204, 2, 0.2)' : 'none'
                }}
              >
                <span>TRUE</span>
                <Check size={18} />
              </button>

              <button
                type="button"
                className="fl-card fl-card-interactive"
                onClick={() => !isChecked && setSelectedTrueFalse(false)}
                style={{
                  minHeight: '60px',
                  borderRadius: '16px',
                  fontSize: '17px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: selectedTrueFalse === false ? 'rgba(255, 107, 74, 0.15)' : 'var(--fl-bg-card)',
                  border: selectedTrueFalse === false ? '2px solid var(--fl-coral-flame)' : '1.5px solid var(--fl-border-strong)',
                  color: selectedTrueFalse === false ? 'var(--fl-coral-flame)' : 'var(--fl-text-primary)',
                  boxShadow: selectedTrueFalse === false ? '0 0 16px rgba(255, 107, 74, 0.2)' : 'none'
                }}
              >
                <span>FALSE</span>
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 9: Audio Dialogue Reply                         */}
        {/* ---------------------------------------------------- */}
        {currentRound.mode === 'audio_dialogue_reply' && currentRound.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {roundOptions.map(opt => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrectOpt = opt.id === currentRound.correctOptionId;

              let border = '1.5px solid var(--fl-border-strong)';
              let bg = 'var(--fl-bg-card)';
              let glow = 'none';

              if (isSelected) {
                border = '2px solid var(--fl-teal-light)';
                bg = 'rgba(0, 245, 180, 0.08)';
                glow = '0 0 16px rgba(0, 245, 180, 0.12)';
              }

              if (isChecked) {
                if (isCorrectOpt) {
                  border = '2px solid #58CC02';
                  bg = 'rgba(88, 204, 2, 0.15)';
                  glow = '0 0 16px rgba(88, 204, 2, 0.2)';
                } else if (isSelected && !isCorrectOpt) {
                  border = '2px solid var(--fl-coral-flame)';
                  bg = 'var(--fl-coral-subtle)';
                  glow = '0 0 16px rgba(255, 107, 74, 0.2)';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  className="fl-card fl-card-interactive"
                  onClick={() => !isChecked && setSelectedOptionId(opt.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border,
                    backgroundColor: bg,
                    boxShadow: glow,
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                      {opt.text}
                    </span>
                    {(isSelected || (isChecked && (isCorrect || isCorrectOpt))) && opt.translation && opt.translation !== 'Distractor' && opt.translation !== 'Incorrect' && (
                      <span className="animate-fade-in" style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', fontWeight: 500 }}>
                        {opt.translation}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {opt.audioText && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (opt.audioText) playAudio(opt.audioText, 0.95);
                        }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'var(--fl-bg-card-hover)',
                          border: '1px solid var(--fl-border)'
                        }}
                        title="Listen to option"
                      >
                        <Volume2 size={16} color={isSelected ? 'var(--fl-teal-light)' : 'var(--fl-text-secondary)'} />
                      </div>
                    )}

                    {isChecked && isCorrectOpt ? (
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#58CC02', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} color="#FFFFFF" />
                      </div>
                    ) : isChecked && isSelected && !isCorrectOpt ? (
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--fl-coral-flame)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={14} color="#FFFFFF" />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? 'var(--fl-teal-light)' : 'var(--fl-border-strong)'}`,
                          backgroundColor: isSelected ? 'var(--fl-teal-light)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0B0F19' }} />}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 10: Boss Shadowing (Progressive 3-Phrase Streak) */}
        {/* ---------------------------------------------------- */}
        {currentRound.mode === 'boss_shadowing' && currentRound.bossPhrases && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Streak Counter Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 200, 0, 0.08)',
                border: '1px solid rgba(255, 200, 0, 0.25)'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--fl-gold-star)' }}>
                ⚡ BOSS STREAK: {Object.keys(bossCompletedScores).length} OF {currentRound.bossPhrases.length} MASTERED
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fl-teal-light)' }}>
                Pronounce one by one
              </span>
            </div>

            {/* Phrase Cards */}
            {currentRound.bossPhrases.map((p, idx) => {
              const isPassed = bossCompletedScores[idx] !== undefined;
              const isActive = bossActivePhraseIndex === idx && !isPassed;

              let cardBorder = '1.5px solid var(--fl-border)';
              let cardBg = 'var(--fl-bg-card-hover)';
              let cardGlow = 'none';

              if (isPassed) {
                cardBorder = '2px solid #58CC02';
                cardBg = 'rgba(88, 204, 2, 0.08)';
              } else if (isActive) {
                cardBorder = '2px solid var(--fl-teal-light)';
                cardBg = 'rgba(0, 245, 180, 0.06)';
                cardGlow = '0 0 16px rgba(0, 245, 180, 0.15)';
              }

              return (
                <div
                  key={p.id}
                  className="fl-card fl-card-interactive"
                  onClick={() => {
                    if (!isChecked) {
                      setBossActivePhraseIndex(idx);
                      playAudio(p.audioText, 0.95);
                    }
                  }}
                  style={{
                    padding: '16px 18px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: cardBg,
                    border: cardBorder,
                    boxShadow: cardGlow,
                    cursor: isChecked ? 'default' : 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isPassed
                          ? '#58CC02'
                          : isActive
                          ? 'var(--fl-teal-light)'
                          : 'rgba(255, 255, 255, 0.08)',
                        color: isPassed || isActive ? '#0A0E1A' : 'var(--fl-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '13px',
                        flexShrink: 0
                      }}
                    >
                      {isPassed ? <Check size={16} color="#0A0E1A" strokeWidth={3} /> : idx + 1}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                        {p.targetText}
                      </span>
                      {isPassed && p.translation && (
                        <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', fontWeight: 500 }}>
                          “{p.translation}”
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isPassed && (
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#58CC02',
                          backgroundColor: 'rgba(88, 204, 2, 0.15)',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}
                      >
                        {bossCompletedScores[idx]}%
                      </span>
                    )}
                    {isActive && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: 'var(--fl-teal-light)',
                          backgroundColor: 'rgba(0, 245, 180, 0.15)',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}
                      >
                        Active
                      </span>
                    )}

                    <button
                      type="button"
                      className="fl-btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(p.audioText, 0.95);
                      }}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderColor: 'var(--fl-teal-light)',
                        backgroundColor: 'var(--fl-teal-subtle)'
                      }}
                      title="Listen"
                      aria-label="Listen"
                    >
                      <Volume2 size={16} color="var(--fl-teal-light)" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Mic Controller for the Active Phrase */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                id="btn-ear-boss-mic-toggle"
                onClick={speechState === 'listening' ? handleStopMic : handleStartMic}
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  backgroundColor: speechState === 'listening'
                    ? 'var(--fl-coral-flame)'
                    : 'var(--fl-teal-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: speechState === 'listening'
                    ? '0 0 32px rgba(255, 107, 74, 0.5)'
                    : '0 0 28px rgba(0, 245, 180, 0.45)',
                  transition: 'all 0.18s ease'
                }}
                aria-label={speechState === 'listening' ? 'Stop recording' : 'Tap to speak active phrase'}
              >
                {speechState === 'listening' ? (
                  <Square size={28} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Mic size={36} color="var(--fl-text-inverse)" />
                )}
              </button>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                  {speechState === 'listening'
                    ? `Listening to Phrase #${bossActivePhraseIndex + 1}... Tap red button when done`
                    : Object.keys(bossCompletedScores).length === currentRound.bossPhrases.length
                    ? 'All 3 Phrases Mastered! Tap Continue below'
                    : `Tap mic to speak Phrase #${bossActivePhraseIndex + 1}`}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)' }}>
                  {speechState === 'listening'
                    ? `Say: “${currentRound.bossPhrases[bossActivePhraseIndex]?.targetText}”`
                    : `Target: “${currentRound.bossPhrases[bossActivePhraseIndex]?.targetText}” · (${Object.keys(bossCompletedScores).length}/3 completed)`}
                </span>
              </div>

              {/* Feedback and Skip Option */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '380px' }}>
                {speechState === 'listening' && lastTranscript && (
                  <div style={{ padding: '8px 14px', borderRadius: '12px', backgroundColor: 'rgba(0, 245, 180, 0.12)', border: '1px solid var(--fl-teal-light)', fontSize: '13px', color: 'var(--fl-teal-light)', textAlign: 'center', width: '100%' }}>
                    Hearing: “{lastTranscript}”
                  </div>
                )}

                {speechState === 'idle' && bossLastFeedback && (
                  <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: 'rgba(255, 107, 74, 0.12)', border: '1px solid rgba(255, 107, 74, 0.35)', fontSize: '13px', color: 'var(--fl-coral-flame)', textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontWeight: 700 }}>
                      Heard: “{bossLastFeedback.transcript || 'No speech detected'}” ({bossLastFeedback.score}%)
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)' }}>
                      Tap 🔊 on the card to hear it again, or use the button below to pass.
                    </span>
                  </div>
                )}

                {Object.keys(bossCompletedScores).length < (currentRound.bossPhrases?.length || 3) && (
                  <button
                    type="button"
                    id="btn-skip-boss-phrase"
                    onClick={() => {
                      soundService.playCorrect();
                      setBossLastFeedback(null);
                      const activeBossIdx = bossActivePhraseIndexRef.current;
                      setBossCompletedScores((prev) => {
                        const nextScores = { ...prev, [activeBossIdx]: 85 };
                        const totalPhrases = currentRound.bossPhrases?.length || 3;
                        if (Object.keys(nextScores).length >= totalPhrases) {
                          setIsCorrect(true);
                          setIsChecked(true);
                          setTotalXpEarned((p) => p + 20);
                          addXp(20);
                        } else {
                          let nextIdx = (activeBossIdx + 1) % totalPhrases;
                          while (nextScores[nextIdx] !== undefined && Object.keys(nextScores).length < totalPhrases) {
                            nextIdx = (nextIdx + 1) % totalPhrases;
                          }
                          setBossActivePhraseIndex(nextIdx);
                        }
                        return nextScores;
                      });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--fl-teal-light)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      marginTop: '2px'
                    }}
                  >
                    Can’t speak or stuck? Pass phrase #{bossActivePhraseIndex + 1} →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 11: The Native Audio Story & Comprehension Check */}
        {/* ---------------------------------------------------- */}
        {currentRound.mode === 'audio_story' && currentRound.storyData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Story Card: Full Text Display & Audio Player */}
            <div
              className="fl-card fl-card-active"
              style={{
                padding: '22px 20px',
                borderRadius: '20px',
                background: 'linear-gradient(180deg, rgba(0, 245, 180, 0.06) 0%, rgba(19, 27, 46, 0.95) 100%)',
                border: isPlaying ? '1.5px solid var(--fl-teal-light)' : '1.5px solid rgba(0, 245, 180, 0.35)',
                boxShadow: isPlaying ? '0 0 28px rgba(0, 245, 180, 0.2)' : '0 0 20px rgba(0, 245, 180, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Story Top Header Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className="fl-badge fl-badge-teal"
                    style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <BookOpen size={14} />
                    <span>SHORT STORY · {currentLang.toUpperCase()}</span>
                  </span>
                </div>

                {/* English Review Toggle */}
                <button
                  type="button"
                  id="btn-toggle-story-translation"
                  onClick={() => setShowEnglishReview(prev => !prev)}
                  className="fl-btn fl-btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '12px',
                    backgroundColor: showEnglishReview ? 'rgba(0, 245, 180, 0.15)' : 'var(--fl-bg-card-hover)',
                    borderColor: showEnglishReview ? 'var(--fl-teal-light)' : 'var(--fl-border)'
                  }}
                >
                  {showEnglishReview ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showEnglishReview ? 'Hide Translation' : 'Review English'}</span>
                </button>
              </div>

              {/* Story Titles */}
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 3px' }}>
                  {currentRound.storyData.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', margin: 0 }}>
                  {currentRound.storyData.titleEnglish}
                </p>
              </div>

              {/* Audio Controls Box (Reads out the full story in the language) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(11, 15, 25, 0.55)',
                  border: '1px solid var(--fl-border)',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Main Play / Pause Full Story Audio Button */}
                  <button
                    type="button"
                    id="btn-play-story-audio"
                    className="fl-btn-icon"
                    onClick={() => {
                      if (isPlaying) {
                        ttsService.stop();
                        setIsPlaying(false);
                      } else {
                        const storyText = currentRound.storyData?.fullStoryText || currentRound.storyData?.sentences.map(s => s.targetText).join(' ') || '';
                        playAudio(storyText, 0.95);
                      }
                    }}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: isPlaying ? 'var(--fl-teal-subtle)' : 'var(--fl-bg-card-hover)',
                      border: `1.5px solid ${isPlaying ? 'var(--fl-teal-light)' : 'var(--fl-border)'}`,
                      boxShadow: isPlaying ? '0 0 16px rgba(0, 245, 180, 0.35)' : 'none'
                    }}
                    title={isPlaying ? 'Pause Story Audio' : `Listen to Story in ${currentLang}`}
                    aria-label="Play story audio"
                  >
                    {isPlaying ? (
                      <Square size={20} color="var(--fl-teal-light)" fill="var(--fl-teal-light)" />
                    ) : (
                      <Volume2 size={22} color="var(--fl-teal-light)" />
                    )}
                  </button>

                  {/* Snail Slow Audio Button */}
                  <button
                    type="button"
                    id="btn-play-story-slow"
                    className="fl-btn-icon"
                    onClick={() => {
                      if (isPlaying && playingSpeed < 0.85) {
                        ttsService.stop();
                        setIsPlaying(false);
                      } else {
                        const storyText = currentRound.storyData?.fullStoryText || currentRound.storyData?.sentences.map(s => s.targetText).join(' ') || '';
                        playAudio(storyText, 0.72);
                      }
                    }}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: isPlaying && playingSpeed < 0.85 ? 'var(--fl-indigo-subtle)' : 'var(--fl-bg-card-hover)',
                      border: `1.5px solid ${isPlaying && playingSpeed < 0.85 ? 'var(--fl-indigo-light)' : 'var(--fl-border)'}`
                    }}
                    title="Listen slowly (0.7x)"
                    aria-label="Listen slowly"
                  >
                    <Snail size={18} color={isPlaying && playingSpeed < 0.85 ? 'var(--fl-indigo-light)' : 'var(--fl-text-secondary)'} />
                  </button>

                  <span style={{ fontSize: '14px', fontWeight: 700, color: isPlaying ? 'var(--fl-teal-light)' : 'var(--fl-text-primary)' }}>
                    {isPlaying ? (playingSpeed < 0.85 ? 'Reading slowly (0.7x)...' : 'Reading aloud in ' + currentLang + '...') : 'Read Aloud in ' + currentLang}
                  </span>
                </div>

                {/* Animated Equalizer Waveform Dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '16px' }}>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '4px',
                        height: isPlaying ? '14px' : '4px',
                        borderRadius: isPlaying ? '2px' : '50%',
                        backgroundColor: isPlaying ? 'var(--fl-teal-light)' : 'rgba(0, 245, 180, 0.35)',
                        transition: 'all 0.18s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Story Text Display Passage */}
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(11, 15, 25, 0.65)',
                  border: '1.5px solid var(--fl-border)'
                }}
              >
                <p
                  style={{
                    fontSize: '18px',
                    lineHeight: 1.75,
                    fontWeight: 600,
                    color: '#F8FAFC',
                    margin: 0,
                    letterSpacing: '0.01em'
                  }}
                >
                  “{currentRound.storyData.fullStoryText || currentRound.storyData.sentences.map(s => s.targetText).join(' ')}”
                </p>

                {/* English Review Translation Display */}
                {showEnglishReview && (
                  <div
                    className="animate-fade-in"
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px dashed var(--fl-border-strong)'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '15px',
                        lineHeight: 1.65,
                        color: 'var(--fl-text-secondary)',
                        fontStyle: 'italic',
                        margin: 0
                      }}
                    >
                      “{currentRound.storyData.fullStoryTranslation || currentRound.storyData.sentences.map(s => s.translation).join(' ')}”
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comprehension Question & Objectives */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  className="fl-badge fl-badge-indigo"
                  style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px' }}
                >
                  QUESTION
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)' }}>
                  Story Comprehension
                </span>
              </div>

              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 1.4 }}>
                {currentRound.storyData.comprehensionQuestion.prompt}
              </h4>

              <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', margin: '-4px 0 4px' }}>
                Select the correct objective based on the short story:
              </p>

              {/* Objectives To Pick From */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentRound.storyData.comprehensionQuestion.options.map(opt => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrectOpt = opt.id === currentRound.storyData?.comprehensionQuestion.correctOptionId;

                  let border = '1.5px solid var(--fl-border-strong)';
                  let bg = 'var(--fl-bg-card)';
                  let glow = 'none';

                  if (isSelected) {
                    border = '2px solid var(--fl-teal-light)';
                    bg = 'rgba(0, 245, 180, 0.08)';
                    glow = '0 0 16px rgba(0, 245, 180, 0.12)';
                  }

                  if (isChecked) {
                    if (isCorrectOpt) {
                      border = '2px solid #58CC02';
                      bg = 'rgba(88, 204, 2, 0.15)';
                      glow = '0 0 16px rgba(88, 204, 2, 0.2)';
                    } else if (isSelected && !isCorrectOpt) {
                      border = '2px solid var(--fl-coral-flame)';
                      bg = 'var(--fl-coral-subtle)';
                      glow = '0 0 16px rgba(255, 107, 74, 0.2)';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className="fl-card fl-card-interactive"
                      onClick={() => !isChecked && setSelectedOptionId(opt.id)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border,
                        backgroundColor: bg,
                        boxShadow: glow,
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fl-text-primary)', flex: 1, paddingRight: '12px' }}>
                        {opt.text}
                      </span>

                      {/* Radio status circle matching Fluentra */}
                      <div style={{ flexShrink: 0 }}>
                        {isChecked && isCorrectOpt ? (
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#58CC02', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={14} color="#FFFFFF" />
                          </div>
                        ) : isChecked && isSelected && !isCorrectOpt ? (
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--fl-coral-flame)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={14} color="#FFFFFF" />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: `2px solid ${isSelected ? 'var(--fl-teal-light)' : 'var(--fl-border-strong)'}`,
                              backgroundColor: isSelected ? 'var(--fl-teal-light)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0B0F19' }} />}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Persistent Bottom Action Drawer */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'var(--fl-bg-card)',
          borderTop: `1.5px solid ${isChecked ? (isCorrect ? '#58CC02' : 'var(--fl-coral-flame)') : 'var(--fl-border)'}`,
          paddingBottom: 'calc(16px + var(--fl-safe-bottom))'
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            padding: '16px 20px 0',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {isChecked && (
            <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: isCorrect ? '#58CC02' : 'var(--fl-coral-flame)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {isCorrect ? <Check size={18} color="#FFFFFF" /> : <RotateCcw size={16} color="#FFFFFF" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: '17px', color: isCorrect ? '#58CC02' : 'var(--fl-coral-flame)', margin: 0 }}>
                  {isCorrect ? 'Ear-First Mastery! ✓' : 'Acoustic Miss — Try Again:'}
                </p>
                {currentRound.explanation && (
                  <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', margin: '4px 0 0' }}>
                    {currentRound.explanation}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            id="btn-ear-game-action"
            onClick={isChecked ? (isCorrect ? handleNext : handleRetry) : handleCheck}
            disabled={isActionDisabled}
            style={{
              width: '100%',
              minHeight: '52px',
              fontSize: '16px',
              fontWeight: 800,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: isActionDisabled ? '1.5px solid var(--fl-border)' : 'none',
              backgroundColor: isActionDisabled
                ? 'var(--fl-bg-card-hover)'
                : isChecked
                ? isCorrect
                  ? '#58CC02'
                  : 'var(--fl-coral-flame)'
                : 'transparent',
              background: (!isActionDisabled && !isChecked)
                ? 'linear-gradient(135deg, var(--fl-teal-light) 0%, var(--fl-teal-primary) 100%)'
                : undefined,
              color: isActionDisabled
                ? 'var(--fl-text-muted)'
                : isChecked
                ? '#FFFFFF'
                : 'var(--fl-text-inverse)',
              boxShadow: isActionDisabled
                ? 'none'
                : isChecked
                ? isCorrect
                  ? '0 4px 14px rgba(88, 204, 2, 0.35)'
                  : '0 4px 14px rgba(255, 107, 74, 0.35)'
                : '0 4px 16px rgba(0, 245, 180, 0.35)',
              cursor: isActionDisabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isChecked ? (
              isCorrect ? (
                <>
                  <span>{currentIndex + 1 === rounds.length ? 'Claim Golden Ear Trophy 🎉' : 'Continue to Next Round'}</span>
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <RotateCcw size={18} />
                  <span>Repeat Attempt</span>
                </>
              )
            ) : currentRound.mode === 'boss_shadowing' ? (
              <>
                <span>
                  {Object.keys(bossCompletedScores).length === (currentRound.bossPhrases?.length || 3)
                    ? 'Continue to Final Story'
                    : `Master 3 Phrases (${Object.keys(bossCompletedScores).length}/${currentRound.bossPhrases?.length || 3})`}
                </span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <span>{currentRound.mode === 'audio_story' ? 'Check Story Answer' : 'Check Ear Answer'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

