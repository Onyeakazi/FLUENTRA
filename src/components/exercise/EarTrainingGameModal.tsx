// FLUENTRA 11-Mode Ear Training & Audio Arcade Modal Component
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Timer
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
  onClose: () => void;
  onCompleted?: () => void;
}

export const EarTrainingGameModal: React.FC<EarTrainingGameModalProps> = ({
  unit,
  onClose,
  onCompleted
}) => {
  const { profile, addXp } = useUser();
  const { isUnitUnlocked } = useProgression();
  const currentLang = profile.currentLanguage || 'French';

  const [rounds, setRounds] = useState<EarGameRound[]>(() =>
    earTrainingService.getRoundsForUnit(unit.id, currentLang)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

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
    setActiveStorySentenceId(null);

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

  // Mic Shadowing Handlers
  const handleStartMic = () => {
    soundService.playMicClick();
    setSpeechState('listening');
    setEvalResult(null);

    const started = speechService.start(
      currentRound.langCode,
      (transcript, isFinal) => {
        setLastTranscript(transcript);
        if (isFinal) {
          handleEvaluateSpeech(transcript);
        }
      },
      () => setSpeechState('idle'),
      () => setSpeechState('idle')
    );

    if (!started) setSpeechState('idle');
  };

  const handleStopMic = () => {
    soundService.playMicClick();
    speechService.stop();
    if (lastTranscript) {
      handleEvaluateSpeech(lastTranscript);
    } else {
      setSpeechState('idle');
    }
  };

  const handleEvaluateSpeech = (transcript: string) => {
    setSpeechState('processing');
    const target = currentRound.targetText || currentRound.audioText;
    setTimeout(() => {
      const result = pronunciationEngine.evaluate(target, transcript);
      setEvalResult(result);
      setSpeechState('success');
      const passed = result.overallScore >= 75;
      setIsCorrect(passed);
      setIsChecked(true);
      if (passed) {
        soundService.playCorrect();
        setTotalXpEarned(p => p + 15);
      } else {
        soundService.playIncorrect();
      }
    }, 400);
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
      <div className="content-fullscreen" style={{ padding: '24px', alignItems: 'center', justifyContent: 'center' }}>
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
            onClick={onClose}
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
    <div className="content-fullscreen" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px 20px',
          paddingTop: 'calc(14px + var(--fl-safe-top))',
          gap: '16px',
          borderBottom: '1px solid var(--fl-border)',
          backgroundColor: 'var(--fl-bg-card)'
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={18} color="#FF9600" />
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
            {currentIndex + 1}/11
          </span>
        </div>
      </div>

      {/* Main Interactive Game Stage */}
      <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>
        {/* Round Badge Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <span
            className="fl-badge"
            style={{
              backgroundColor: '#58CC02',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '999px',
              letterSpacing: '0.04em'
            }}
          >
            {currentRound.badgeLabel}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-gold-star)' }}>
            +15 XP
          </span>
        </div>

        {/* Prompt Header */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px' }}>
            {currentRound.title}
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', margin: 0, lineHeight: 1.45 }}>
            {currentRound.instruction}
          </p>
        </div>

        {/* Central Pulsating Audio Wave Box (Modes 1 to 9) */}
        {currentRound.mode !== 'audio_story' && currentRound.mode !== 'sound_blitz' && (
          <div
            className="fl-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 18px',
              marginBottom: '22px',
              background: 'linear-gradient(135deg, rgba(88, 204, 2, 0.1) 0%, rgba(0, 196, 140, 0.05) 100%)',
              border: isPlaying ? '1.5px solid #58CC02' : '1px solid var(--fl-border)',
              position: 'relative'
            }}
          >
            {/* Audio Wave Visualizer Animation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '42px', marginBottom: '16px' }}>
              {[12, 28, 42, 20, 36, 16, 32].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: '6px',
                    height: isPlaying ? `${h}px` : '8px',
                    borderRadius: '4px',
                    backgroundColor: '#58CC02',
                    transition: 'all 0.18s ease'
                  }}
                />
              ))}
            </div>

            {/* Audio Controls (Play Normal + Slow 0.7x + Speed Warp) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                className="fl-btn-icon"
                onClick={() => playAudio(currentRound.audioText, 0.95)}
                style={{
                  width: '52px',
                  height: '52px',
                  backgroundColor: isPlaying && playingSpeed === 0.95 ? 'rgba(88, 204, 2, 0.3)' : 'var(--fl-bg-card-hover)',
                  border: '2px solid #58CC02'
                }}
                title="Listen at normal speed"
              >
                <Volume2 size={24} color="#58CC02" />
              </button>

              <button
                type="button"
                className="fl-btn-icon"
                onClick={() => playAudio(currentRound.audioText, 0.7)}
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: isPlaying && playingSpeed < 0.8 ? 'rgba(88, 204, 2, 0.3)' : 'var(--fl-bg-card-hover)',
                  border: '1.5px solid var(--fl-border)'
                }}
                title="Listen slowly (0.7x)"
              >
                <Snail size={20} color="var(--fl-indigo-light)" />
              </button>

              {currentRound.mode === 'speed_warp' && (
                <button
                  type="button"
                  className="fl-btn-icon"
                  onClick={() => playAudio(currentRound.audioText, 1.25)}
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: isPlaying && playingSpeed > 1.1 ? 'rgba(255, 107, 74, 0.3)' : 'var(--fl-bg-card-hover)',
                    border: '1.5px solid var(--fl-coral-flame)'
                  }}
                  title="Listen at 1.25x Street Speed"
                >
                  <Zap size={20} color="var(--fl-coral-flame)" />
                </button>
              )}
            </div>

            {/* Audio Cloze Sentence */}
            {currentRound.sentenceWithBlank && (
              <div style={{ marginTop: '16px', fontSize: '20px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                {currentRound.sentenceWithBlank}
              </div>
            )}

            {/* In Blind Ear mode, text reveals ONLY when checked */}
            {isChecked && currentRound.targetText && (
              <div className="animate-fade-in" style={{ marginTop: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#58CC02' }}>
                  {currentRound.targetText}
                </span>
                {currentRound.translation && (
                  <span style={{ display: 'block', fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
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

                let border = isSelected ? '#58CC02' : 'var(--fl-border)';
                let bg = isSelected ? 'rgba(88, 204, 2, 0.1)' : 'var(--fl-bg-card)';
                if (isChecked) {
                  if (isCorrectOpt) {
                    border = '#58CC02';
                    bg = 'rgba(88, 204, 2, 0.15)';
                  } else if (isSelected && !isCorrectOpt) {
                    border = 'var(--fl-coral-flame)';
                    bg = 'var(--fl-coral-subtle)';
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
                      padding: '16px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderColor: border,
                      backgroundColor: bg,
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                      {opt.text}
                    </span>
                    {opt.audioText && (
                      <Volume2
                        size={18}
                        color={isSelected ? '#58CC02' : 'var(--fl-text-secondary)'}
                        style={{ flexShrink: 0 }}
                      />
                    )}
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
            <button
              type="button"
              onClick={speechState === 'listening' ? handleStopMic : handleStartMic}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                backgroundColor: speechState === 'listening' ? 'var(--fl-coral-flame)' : '#58CC02',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                boxShadow: speechState === 'listening' ? '0 0 30px rgba(239, 68, 68, 0.5)' : '0 0 30px rgba(88, 204, 2, 0.4)',
                transition: 'all 0.15s ease'
              }}
            >
              <Mic size={38} color="#FFFFFF" />
            </button>

            <span style={{ fontSize: '14px', fontWeight: 700, color: speechState === 'listening' ? 'var(--fl-coral-flame)' : 'var(--fl-text-secondary)' }}>
              {speechState === 'listening' ? 'Listening... Speak now!' : speechState === 'processing' ? 'Evaluating acoustic resonance...' : 'Tap mic and shadow the phrase'}
            </span>

            {evalResult && (
              <div
                className="fl-card animate-pop-in"
                style={{
                  width: '100%',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  borderColor: isCorrect ? '#58CC02' : 'var(--fl-coral-flame)'
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
                padding: '20px 18px',
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--fl-text-primary)'
              }}
            >
              {currentRound.conceptStatement}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                className="fl-btn"
                onClick={() => !isChecked && setSelectedTrueFalse(true)}
                style={{
                  minHeight: '56px',
                  fontSize: '17px',
                  fontWeight: 800,
                  backgroundColor: selectedTrueFalse === true ? 'rgba(88, 204, 2, 0.2)' : 'var(--fl-bg-card)',
                  borderColor: selectedTrueFalse === true ? '#58CC02' : 'var(--fl-border)',
                  color: selectedTrueFalse === true ? '#58CC02' : 'var(--fl-text-primary)'
                }}
              >
                TRUE ✓
              </button>

              <button
                type="button"
                className="fl-btn"
                onClick={() => !isChecked && setSelectedTrueFalse(false)}
                style={{
                  minHeight: '56px',
                  fontSize: '17px',
                  fontWeight: 800,
                  backgroundColor: selectedTrueFalse === false ? 'rgba(239, 68, 68, 0.2)' : 'var(--fl-bg-card)',
                  borderColor: selectedTrueFalse === false ? 'var(--fl-coral-flame)' : 'var(--fl-border)',
                  color: selectedTrueFalse === false ? 'var(--fl-coral-flame)' : 'var(--fl-text-primary)'
                }}
              >
                FALSE ✗
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

              let border = isSelected ? '#58CC02' : 'var(--fl-border)';
              let bg = isSelected ? 'rgba(88, 204, 2, 0.1)' : 'var(--fl-bg-card)';
              if (isChecked) {
                if (isCorrectOpt) {
                  border = '#58CC02';
                  bg = 'rgba(88, 204, 2, 0.15)';
                } else if (isSelected && !isCorrectOpt) {
                  border = 'var(--fl-coral-flame)';
                  bg = 'var(--fl-coral-subtle)';
                }
              }

              return (
                <div
                  key={opt.id}
                  className="fl-card fl-card-interactive"
                  onClick={() => !isChecked && setSelectedOptionId(opt.id)}
                  style={{
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderColor: border,
                    backgroundColor: bg,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                    {opt.text}
                  </span>

                  <button
                    type="button"
                    className="fl-btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (opt.audioText) playAudio(opt.audioText, 0.95);
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: 'rgba(88, 204, 2, 0.15)',
                      borderColor: '#58CC02'
                    }}
                    title="Listen to option"
                  >
                    <Volume2 size={18} color="#58CC02" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 10: Boss Shadowing (3-Phrase Streak)            */}
        {/* ---------------------------------------------------- */}
        {currentRound.mode === 'boss_shadowing' && currentRound.bossPhrases && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentRound.bossPhrases.map((p, idx) => (
              <div
                key={p.id}
                className="fl-card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--fl-bg-card-hover)',
                  border: '1px solid var(--fl-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--fl-gold-star)' }}>
                    #{idx + 1}
                  </span>
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                    {p.targetText}
                  </span>
                </div>

                <button
                  type="button"
                  className="fl-btn-icon"
                  onClick={() => playAudio(p.audioText, 0.95)}
                  style={{ width: '38px', height: '38px', borderColor: '#58CC02' }}
                  title="Listen"
                >
                  <Volume2 size={18} color="#58CC02" />
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={speechState === 'listening' ? handleStopMic : handleStartMic}
                style={{
                  width: '78px',
                  height: '78px',
                  borderRadius: '50%',
                  backgroundColor: speechState === 'listening' ? 'var(--fl-coral-flame)' : '#FFB800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 24px rgba(255, 184, 0, 0.4)'
                }}
              >
                <Mic size={34} color="#FFFFFF" />
              </button>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-secondary)' }}>
                {speechState === 'listening' ? 'Recording Boss Streak...' : 'Tap mic and shadow all 3 phrases'}
              </span>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 11: The Native Audio Story & English Review     */}
        {/* ---------------------------------------------------- */}
        {currentRound.mode === 'audio_story' && currentRound.storyData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Story Header Banner */}
            <div
              className="fl-card"
              style={{
                padding: '16px 18px',
                background: 'linear-gradient(135deg, rgba(0, 196, 140, 0.15) 0%, rgba(129, 140, 248, 0.1) 100%)',
                border: '1.5px solid var(--fl-teal-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--fl-teal-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Micro-Tale
                </span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0' }}>
                  {showEnglishReview ? currentRound.storyData.titleEnglish : currentRound.storyData.title}
                </h4>
              </div>

              {/* Toggle Review in English Button */}
              <button
                type="button"
                onClick={() => setShowEnglishReview(prev => !prev)}
                className="fl-btn fl-btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  backgroundColor: showEnglishReview ? 'rgba(88, 204, 2, 0.2)' : 'var(--fl-bg-card-hover)',
                  borderColor: showEnglishReview ? '#58CC02' : 'var(--fl-border)'
                }}
              >
                {showEnglishReview ? <EyeOff size={15} /> : <Eye size={15} />}
                <span>{showEnglishReview ? 'Hide English' : 'Review in English'}</span>
              </button>
            </div>

            {/* Sentence-by-Sentence Audio Reader */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentRound.storyData.sentences.map((sentence, idx) => {
                const isPlayingSentence = activeStorySentenceId === sentence.id;

                return (
                  <div
                    key={sentence.id}
                    className="fl-card"
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      borderColor: isPlayingSentence ? '#58CC02' : 'var(--fl-border)',
                      backgroundColor: isPlayingSentence ? 'rgba(88, 204, 2, 0.08)' : 'var(--fl-bg-card)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--fl-text-muted)', flexShrink: 0 }}>
                        {idx + 1}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                          {sentence.targetText}
                        </span>
                        {showEnglishReview && (
                          <span className="animate-fade-in" style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
                            “{sentence.translation}”
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="fl-btn-icon"
                      onClick={() => {
                        setActiveStorySentenceId(sentence.id);
                        playAudio(sentence.audioText, 0.95, () => setActiveStorySentenceId(null));
                      }}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderColor: isPlayingSentence ? '#58CC02' : 'var(--fl-border)',
                        backgroundColor: isPlayingSentence ? 'rgba(88, 204, 2, 0.2)' : 'var(--fl-bg-card-hover)'
                      }}
                      title="Listen to native sentence"
                    >
                      <Volume2 size={18} color={isPlayingSentence ? '#58CC02' : 'var(--fl-text-secondary)'} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Story Comprehension Check */}
            <div style={{ marginTop: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
                Quick Check: {currentRound.storyData.comprehensionQuestion.prompt}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentRound.storyData.comprehensionQuestion.options.map(opt => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrectOpt = opt.id === currentRound.storyData?.comprehensionQuestion.correctOptionId;

                  let border = isSelected ? '#58CC02' : 'var(--fl-border)';
                  let bg = isSelected ? 'rgba(88, 204, 2, 0.1)' : 'var(--fl-bg-card)';
                  if (isChecked) {
                    if (isCorrectOpt) {
                      border = '#58CC02';
                      bg = 'rgba(88, 204, 2, 0.15)';
                    } else if (isSelected && !isCorrectOpt) {
                      border = 'var(--fl-coral-flame)';
                      bg = 'var(--fl-coral-subtle)';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className="fl-card fl-card-interactive"
                      onClick={() => !isChecked && setSelectedOptionId(opt.id)}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        borderColor: border,
                        backgroundColor: bg,
                        fontSize: '15px',
                        fontWeight: 700
                      }}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Action Drawer */}
      <div
        style={{
          padding: '18px 20px',
          paddingBottom: 'calc(18px + var(--fl-safe-bottom))',
          backgroundColor: 'var(--fl-bg-card)',
          borderTop: `1.5px solid ${isChecked ? (isCorrect ? '#58CC02' : 'var(--fl-coral-flame)') : 'var(--fl-border)'}`
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
            <div>
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
          className={`fl-btn ${isChecked ? (isCorrect ? 'fl-btn-primary' : 'fl-btn-coral') : 'fl-btn-primary'}`}
          onClick={isChecked ? (isCorrect ? handleNext : handleRetry) : handleCheck}
          disabled={
            !isChecked &&
            !selectedOptionId &&
            selectedWords.length === 0 &&
            selectedTrueFalse === null &&
            !evalResult &&
            currentRound.mode !== 'sound_blitz'
          }
          style={{ width: '100%', minHeight: '52px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isChecked ? (
            isCorrect ? (
              <>
                <span>{currentIndex + 1 === rounds.length ? 'Claim Golden Ear Trophy' : 'Continue to Next Round'}</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <RotateCcw size={18} />
                <span>Repeat Attempt</span>
              </>
            )
          ) : (
            <>
              <span>Check Ear Answer</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
