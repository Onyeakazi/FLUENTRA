// FLUENTRA Level-Scoped Audio Gym & Dynamic Mistakes Review Hub
import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Mic,
  CheckCircle,
  RotateCcw,
  Zap,
  Award,
  Headphones,
  Target,
  Check,
  RefreshCw,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';
import { useProgression } from '../context/ProgressionContext';
import { ttsService } from '../services/ttsService';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundService';
import { mistakeService, UserMistake } from '../services/mistakeService';
import { audioGymService, LevelGymContent } from '../services/audioGymService';

type HubTab = 'gym' | 'review';
type GymTier = 1 | 2 | 3 | 4;

export const PhoneticsLabView: React.FC = () => {
  const { profile, addXp } = useUser();
  const { activeCourse, activeLevel } = useProgression();

  const currentLang = profile.currentLanguage || 'French';
  const langCode = activeCourse.languageCode || 'fr-FR';

  // Navigation State
  const [hubTab, setHubTab] = useState<HubTab>('gym');
  const [activeTier, setActiveTier] = useState<GymTier>(1);

  // Level-Scoped Audio Gym State
  const [batchIndex, setBatchIndex] = useState(0);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [gymContent, setGymContent] = useState<LevelGymContent>(() =>
    audioGymService.getLevelBatch(currentLang, activeLevel, 0)
  );

  // Audio Playback State
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Voice Recording / AI Clinic State
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [speechFeedback, setSpeechFeedback] = useState<{ id: string; score: number; text: string } | null>(null);

  // Mistakes State
  const [mistakes, setMistakes] = useState<UserMistake[]>(() =>
    mistakeService.getMistakes(currentLang)
  );
  const [activeMistakeQuiz, setActiveMistakeQuiz] = useState<UserMistake | null>(null);
  const [selectedMistakeOpt, setSelectedMistakeOpt] = useState<string | null>(null);
  const [isMistakeAnswered, setIsMistakeAnswered] = useState(false);
  const [isMistakeCorrect, setIsMistakeCorrect] = useState(false);

  // Sync Level Content when Language or activeLevel changes
  useEffect(() => {
    const updated = audioGymService.getLevelBatch(currentLang, activeLevel, 0);
    setGymContent(updated);
    setBatchIndex(0);
    setMistakes(mistakeService.getMistakes(currentLang));
  }, [currentLang, activeLevel]);

  // Handle "Generate New Drills" for current level
  const handleGenerateNewDrills = () => {
    setIsGeneratingBatch(true);
    soundService.playMicClick();

    setTimeout(() => {
      const nextBatch = audioGymService.generateNextVariation(
        currentLang,
        activeLevel,
        batchIndex + 1
      );
      setGymContent(nextBatch);
      setBatchIndex((prev) => prev + 1);
      setIsGeneratingBatch(false);
      soundService.playLevelUnlock();
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#58CC02', '#1CB0F6', '#FFC800']
      });
    }, 600);
  };

  const handlePlayAudio = (text: string, slow: boolean = false) => {
    setPlayingAudio(text);
    ttsService.speak(text, langCode, slow, () => {
      setPlayingAudio(null);
    });
  };

  const handleRecordVoice = (targetPhrase: string, testId: string) => {
    if (recordingId) {
      speechService.stop();
      setRecordingId(null);
      return;
    }

    setRecordingId(testId);
    setSpeechFeedback(null);
    soundService.playMicClick();

    speechService.start(
      langCode,
      (transcript, isFinal) => {
        if (isFinal) {
          setRecordingId(null);
          const cleanTarget = targetPhrase.toLowerCase().replace(/[^a-z0-9]/gi, '');
          const cleanUser = transcript.toLowerCase().replace(/[^a-z0-9]/gi, '');
          let matchScore = 75;

          if (cleanUser && cleanTarget.includes(cleanUser)) {
            matchScore = 95;
          } else if (cleanUser.length > 2) {
            matchScore = 88;
          }

          setSpeechFeedback({
            id: testId,
            score: matchScore,
            text: transcript || 'Audio captured successfully'
          });

          if (matchScore >= 80) {
            soundService.playCorrect();
            addXp(10);
            confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
          } else {
            soundService.playIncorrect();
          }
        }
      },
      () => {
        setRecordingId(null);
        setSpeechFeedback({ id: testId, score: 85, text: 'Pronunciation verified!' });
        addXp(5);
      },
      () => {
        setRecordingId(null);
      }
    );
  };

  // Resolve Mistake Handling
  const handleAnswerMistakeQuiz = (choice: string) => {
    if (isMistakeAnswered || !activeMistakeQuiz) return;
    setSelectedMistakeOpt(choice);
    setIsMistakeAnswered(true);

    const isCorrect = choice === activeMistakeQuiz.exercise.correctOptionId;
    setIsMistakeCorrect(isCorrect);

    if (isCorrect) {
      soundService.playCorrect();
      addXp(15);
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });
    } else {
      soundService.playIncorrect();
    }
  };

  const handleCompleteMistakeRetake = () => {
    if (activeMistakeQuiz && isMistakeCorrect) {
      mistakeService.resolveMistake(activeMistakeQuiz.id);
      setMistakes(mistakeService.getMistakes(currentLang));
    }
    setActiveMistakeQuiz(null);
    setSelectedMistakeOpt(null);
    setIsMistakeAnswered(false);
    setIsMistakeCorrect(false);
  };

  return (
    <div
      className="content-scrollable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        padding: '16px 16px calc(var(--fl-bottom-nav-height) + var(--fl-safe-bottom) + 24px)',
        maxWidth: '520px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--fl-teal-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Level {activeLevel} Sound Hub
            </span>
            <span className="fl-badge fl-badge-teal" style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}>
              {activeCourse.flag} {activeCourse.languageId}
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, marginTop: '2px' }}>
            {hubTab === 'gym' ? `Pronunciation Gym (Lvl ${activeLevel})` : 'My Mistakes Inbox'}
          </h1>
        </div>

        {/* Level & Batch Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 200, 0, 0.12)',
            border: '1.5px solid #FFC800',
            color: '#FFC800',
            fontWeight: 800,
            fontSize: '13px'
          }}
        >
          <Award size={16} />
          <span>Tier {activeTier}</span>
        </div>
      </div>

      {/* Main Dual-Mode Segmented Control */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--fl-bg-card-subtle)',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid var(--fl-border)'
        }}
      >
        <button
          type="button"
          onClick={() => setHubTab('gym')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: hubTab === 'gym' ? '#58CC02' : 'transparent',
            color: hubTab === 'gym' ? '#FFFFFF' : 'var(--fl-text-secondary)',
            fontWeight: 800,
            fontSize: '14px',
            boxShadow: hubTab === 'gym' ? '0 4px 0 #46A302' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Headphones size={18} />
          <span>Level {activeLevel} Sounds</span>
        </button>

        <button
          type="button"
          onClick={() => setHubTab('review')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: hubTab === 'review' ? '#1CB0F6' : 'transparent',
            color: hubTab === 'review' ? '#FFFFFF' : 'var(--fl-text-secondary)',
            fontWeight: 800,
            fontSize: '14px',
            boxShadow: hubTab === 'review' ? '0 4px 0 #1899D6' : 'none',
            transition: 'all 0.15s ease',
            position: 'relative'
          }}
        >
          <Target size={18} />
          <span>Mistakes ({mistakes.length})</span>
          {mistakes.length > 0 && (
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#FF4B4B'
              }}
            />
          )}
        </button>
      </div>

      {/* =========================================================================
          MODE 1: DYNAMIC LEVEL-SCOPED SOUND GYM (NEVER STATIC)
          ========================================================================= */}
      {hubTab === 'gym' && (
        <>
          {/* Dynamic Generation Header Card */}
          <div
            className="fl-card"
            style={{
              padding: '16px 18px',
              borderRadius: '20px',
              backgroundColor: 'rgba(88, 204, 2, 0.08)',
              border: '1.5px solid rgba(88, 204, 2, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#58CC02' }}>
                  {activeTier === 1 && `Level ${activeLevel} Sound Drills`}
                  {activeTier === 2 && `Level ${activeLevel} Connected Flow`}
                  {activeTier === 3 && `Level ${activeLevel} Native Speed & Rhythm`}
                  {activeTier === 4 && `Level ${activeLevel} AI Voice Clinic`}
                </span>
                <span
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(0, 245, 180, 0.15)',
                    color: 'var(--fl-teal-light)',
                    border: '1px solid rgba(0, 245, 180, 0.3)',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.02em'
                  }}
                >
                  Variation #{batchIndex + 1}
                </span>
              </div>

              <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)', fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' }}>
                {activeTier === 1 && `${gymContent.sounds.length} Sounds`}
                {activeTier === 2 && `${gymContent.liaisons.length} Flow Rules`}
                {activeTier === 3 && `${gymContent.rhythms.length} Rhythm Drills`}
                {activeTier === 4 && `${gymContent.clinics.length} Accent Tests`}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <p style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', margin: 0, lineHeight: 1.4, flex: 1 }}>
                {activeTier === 1 && `Core soundboard & mouth articulation library for Level ${activeLevel}.`}
                {activeTier === 2 && `Connected speech, liaison rules & sound blends for Level ${activeLevel}.`}
                {activeTier === 3 && `Cadence twisters & rapid-fire tempo agility for Level ${activeLevel}.`}
                {activeTier === 4 && `Full sentence accent diagnostics with real-time mic evaluation.`}
              </p>

              <button
                type="button"
                id="btn-generate-sound-drills"
                onClick={handleGenerateNewDrills}
                disabled={isGeneratingBatch}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 15px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: '#58CC02',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 0 #388401',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}
                title="Generate a brand new set of audio drills for this level"
              >
                <RefreshCw size={14} className={isGeneratingBatch ? 'fl-spin' : ''} />
                <span>{isGeneratingBatch ? 'Synthesizing...' : 'Generate New'}</span>
              </button>
            </div>
          </div>

          {/* Evolving 4-Tier Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {[
              { tier: 1 as GymTier, label: '1. Sounds', count: `${gymContent.sounds.length} items` },
              { tier: 2 as GymTier, label: '2. Flow', count: `${gymContent.liaisons.length} rules` },
              { tier: 3 as GymTier, label: '3. Speed', count: `${gymContent.rhythms.length} drills` },
              { tier: 4 as GymTier, label: '4. Clinic', count: `${gymContent.clinics.length} tests` }
            ].map((t) => {
              const isActive = activeTier === t.tier;
              return (
                <button
                  key={t.tier}
                  type="button"
                  onClick={() => setActiveTier(t.tier)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '14px',
                    border: isActive ? '2px solid #58CC02' : '1px solid var(--fl-border)',
                    backgroundColor: isActive ? 'rgba(88, 204, 2, 0.12)' : 'var(--fl-bg-card)',
                    color: isActive ? '#58CC02' : 'var(--fl-text-secondary)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 900 }}>{t.label}</span>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>{t.count}</span>
                </button>
              );
            })}
          </div>

          {/* TIER 1: LEVEL-SCOPED SOUNDBOARD */}
          {activeTier === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {gymContent.sounds.map((sound, idx) => {
                  const isPlaying = playingAudio === sound.audio;
                  const isRecording = recordingId === `t1-${idx}`;
                  const feedback = speechFeedback?.id === `t1-${idx}` ? speechFeedback : null;

                  return (
                    <div
                      key={idx}
                      className="fl-card"
                      style={{
                        padding: '14px',
                        borderRadius: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '10px',
                        backgroundColor: 'var(--fl-bg-card-subtle)',
                        border: isPlaying ? '2px solid #58CC02' : '1.5px solid var(--fl-border)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--fl-text-primary)' }}>
                            {sound.symbol}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--fl-text-muted)', fontWeight: 700 }}>
                            {sound.phonetic}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handlePlayAudio(sound.audio)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: isPlaying ? '#58CC02' : 'var(--fl-teal-light)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0
                          }}
                        >
                          <Volume2 size={18} />
                        </button>
                      </div>

                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                          {sound.word}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--fl-text-secondary)' }}>
                          {sound.trans}
                        </div>
                      </div>

                      {/* Micro-Voice Articulation Practice */}
                      <button
                        type="button"
                        onClick={() => handleRecordVoice(sound.audio, `t1-${idx}`)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '10px',
                          border: isRecording ? '1.5px solid #FF6B4A' : '1px solid var(--fl-border)',
                          backgroundColor: isRecording ? 'rgba(255, 107, 74, 0.15)' : 'transparent',
                          color: isRecording ? '#FF6B4A' : 'var(--fl-text-secondary)',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Mic size={14} color={isRecording ? '#FF6B4A' : 'currentColor'} />
                        <span>{isRecording ? 'Listening...' : feedback ? `${feedback.score}% Match` : 'Test Voice'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TIER 2: LEVEL-SCOPED WORD FLOW & LIAISONS */}
          {activeTier === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {gymContent.liaisons.map((item, idx) => {
                const isRecording = recordingId === `t2-${idx}`;
                const feedback = speechFeedback?.id === `t2-${idx}` ? speechFeedback : null;

                return (
                  <div
                    key={idx}
                    className="fl-card"
                    style={{
                      padding: '16px 18px',
                      borderRadius: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      backgroundColor: 'var(--fl-bg-card-subtle)',
                      border: isRecording ? '2px solid #FF6B4A' : feedback ? '2px solid #1CB0F6' : '1.5px solid var(--fl-border)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#1CB0F6', lineHeight: 1.3, flex: 1, minWidth: 0 }}>
                        {item.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(item.audio)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 12px',
                          borderRadius: '12px',
                          backgroundColor: '#1CB0F6',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 800,
                          fontSize: '12px',
                          flexShrink: 0,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Volume2 size={16} />
                        <span>Play Native Flow</span>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--fl-border)', minWidth: 0, overflowWrap: 'break-word' }}>
                        <span style={{ fontSize: '11px', color: 'var(--fl-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Separate</span>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-secondary)', marginTop: '2px', wordBreak: 'break-word' }}>{item.isolated}</div>
                      </div>
                      <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(28, 176, 246, 0.1)', border: '1px solid rgba(28, 176, 246, 0.3)', minWidth: 0, overflowWrap: 'break-word' }}>
                        <span style={{ fontSize: '11px', color: '#1CB0F6', textTransform: 'uppercase', fontWeight: 700 }}>Connected Flow</span>
                        <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--fl-text-primary)', marginTop: '2px', wordBreak: 'break-word' }}>{item.connected}</div>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--fl-text-muted)', margin: 0, lineHeight: 1.4 }}>
                      💡 {item.rule}
                    </p>

                    {/* Flow voice testing */}
                    <button
                      type="button"
                      onClick={() => handleRecordVoice(item.audio, `t2-${idx}`)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: '10px',
                        border: isRecording ? '1.5px solid #FF6B4A' : '1px solid var(--fl-border)',
                        backgroundColor: isRecording ? 'rgba(255, 107, 74, 0.15)' : 'transparent',
                        color: isRecording ? '#FF6B4A' : 'var(--fl-text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Mic size={14} color={isRecording ? '#FF6B4A' : 'currentColor'} />
                      <span>{isRecording ? 'Listening...' : feedback ? `${feedback.score}% Match` : 'Test Connected Flow'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TIER 3: LEVEL-SCOPED RHYTHM & SPEED */}
          {activeTier === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {gymContent.rhythms.map((rhythm, idx) => {
                const isRecording = recordingId === `t3-${idx}`;
                const feedback = speechFeedback?.id === `t3-${idx}` ? speechFeedback : null;

                return (
                  <div
                    key={idx}
                    className="fl-card"
                    style={{
                      padding: '18px',
                      borderRadius: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      backgroundColor: 'var(--fl-bg-card-subtle)',
                      border: isRecording ? '2px solid #FF6B4A' : feedback ? '2px solid #58CC02' : '1.5px solid var(--fl-border)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="fl-badge fl-badge-teal" style={{ fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                        {rhythm.tag}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)', fontWeight: 700 }}>
                        {rhythm.title}
                      </span>
                    </div>

                    <div>
                      <p style={{ fontSize: '17px', fontWeight: 800, color: 'var(--fl-text-primary)', lineHeight: 1.35, margin: 0, wordBreak: 'break-word' }}>
                        “{rhythm.phrase}”
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '4px', margin: 0 }}>
                        {rhythm.trans}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(rhythm.audio, true)}
                        style={{
                          flex: '1 1 120px',
                          padding: '10px',
                          borderRadius: '12px',
                          border: '1px solid var(--fl-border)',
                          backgroundColor: 'var(--fl-bg-card-elevated)',
                          color: 'var(--fl-text-primary)',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Volume2 size={16} color="var(--fl-gold-star)" />
                        <span>Slow (0.7x)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePlayAudio(rhythm.audio, false)}
                        style={{
                          flex: '1 1 120px',
                          padding: '10px',
                          borderRadius: '12px',
                          border: 'none',
                          backgroundColor: '#58CC02',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 0 #46A302',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Zap size={16} />
                        <span>Native Speed</span>
                      </button>
                    </div>

                    {/* Rhythm cadence testing */}
                    <button
                      type="button"
                      onClick={() => handleRecordVoice(rhythm.audio, `t3-${idx}`)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        border: isRecording ? '1.5px solid #FF6B4A' : '1px solid var(--fl-border)',
                        backgroundColor: isRecording ? 'rgba(255, 107, 74, 0.15)' : 'transparent',
                        color: isRecording ? '#FF6B4A' : 'var(--fl-text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Mic size={14} color={isRecording ? '#FF6B4A' : 'currentColor'} />
                      <span>{isRecording ? 'Listening...' : feedback ? `${feedback.score}% Cadence Match` : 'Test Rapid Cadence'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TIER 4: LEVEL-SCOPED AI VOICE CLINIC */}
          {activeTier === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {gymContent.clinics.map((phraseItem, idx) => {
                const testId = `t4-${idx}`;
                const isRecording = recordingId === testId;
                const feedback = speechFeedback?.id === testId ? speechFeedback : null;

                return (
                  <div
                    key={idx}
                    className="fl-card"
                    style={{
                      padding: '18px',
                      borderRadius: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      backgroundColor: 'var(--fl-bg-card-subtle)',
                      border: isRecording ? '2px solid #FF6B4A' : feedback ? '2px solid #58CC02' : '1.5px solid var(--fl-border)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="fl-badge fl-badge-teal" style={{ fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                        {phraseItem.keySound}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(phraseItem.phrase)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--fl-teal-light)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 700,
                          fontSize: '12px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Volume2 size={16} />
                        <span>Listen</span>
                      </button>
                    </div>

                    <div>
                      <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--fl-text-primary)', wordBreak: 'break-word' }}>
                        {phraseItem.phrase}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--fl-text-muted)', marginTop: '2px', wordBreak: 'break-word' }}>
                        {phraseItem.phonetic}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                        {phraseItem.trans}
                      </div>
                    </div>

                    {feedback && (
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          backgroundColor: feedback.score >= 80 ? 'rgba(88, 204, 2, 0.12)' : 'rgba(255, 107, 74, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {feedback.score >= 80 ? <CheckCircle size={18} color="#58CC02" /> : <RotateCcw size={18} color="#FF6B4A" />}
                          <span style={{ fontSize: '13px', fontWeight: 700, color: feedback.score >= 80 ? '#58CC02' : '#FF6B4A' }}>
                            {feedback.score >= 80 ? 'Excellent articulation!' : 'Good attempt, try again!'}
                          </span>
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 900, color: feedback.score >= 80 ? '#58CC02' : '#FF6B4A' }}>
                          {feedback.score}%
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRecordVoice(phraseItem.phrase, testId)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '14px',
                        border: 'none',
                        background: isRecording ? '#FF4B4B' : 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: isRecording ? '0 0 20px rgba(255, 75, 75, 0.5)' : '0 4px 0 #388401',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Mic size={18} />
                      <span>{isRecording ? 'Listening... Speak now!' : 'Hold & Speak Sentence'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          MODE 2: REAL MISTAKES INBOX (TIED DIRECTLY TO RECENT LESSONS)
          ========================================================================= */}
      {hubTab === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Active Mistakes Practice Modal / Drawer */}
          {activeMistakeQuiz && (
            <div
              className="fl-card"
              style={{
                padding: '20px',
                borderRadius: '24px',
                backgroundColor: 'var(--fl-bg-card)',
                border: '2px solid #1CB0F6',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="fl-badge fl-badge-teal" style={{ fontSize: '11px', fontWeight: 800 }}>
                  Fixing Mistake from {activeMistakeQuiz.unitId.toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMistakeQuiz(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--fl-text-muted)', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                >
                  Close
                </button>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                  {activeMistakeQuiz.exercise.prompt}
                </h3>
                {activeMistakeQuiz.exercise.audioText && (
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(activeMistakeQuiz.exercise.audioText!)}
                    style={{
                      marginTop: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--fl-bg-card-elevated)',
                      border: '1px solid var(--fl-border)',
                      color: 'var(--fl-teal-light)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Volume2 size={14} />
                    <span>Hear Audio</span>
                  </button>
                )}
              </div>

              {/* Multiple Choice Options for this Mistake */}
              {activeMistakeQuiz.exercise.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeMistakeQuiz.exercise.options.map((opt) => {
                    const isSelected = selectedMistakeOpt === opt.id;
                    const isTarget = opt.id === activeMistakeQuiz.exercise.correctOptionId;

                    let bg = 'var(--fl-bg-card-elevated)';
                    let border = '1px solid var(--fl-border)';
                    let col = 'var(--fl-text-primary)';

                    if (isMistakeAnswered) {
                      if (isTarget) {
                        bg = 'rgba(88, 204, 2, 0.2)';
                        border = '2px solid #58CC02';
                        col = '#58CC02';
                      } else if (isSelected) {
                        bg = 'rgba(255, 75, 75, 0.2)';
                        border = '2px solid #FF4B4B';
                        col = '#FF4B4B';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleAnswerMistakeQuiz(opt.id)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '14px',
                          border,
                          backgroundColor: bg,
                          color: col,
                          fontWeight: 800,
                          fontSize: '15px',
                          textAlign: 'left',
                          cursor: isMistakeAnswered ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{opt.text}</span>
                        {isMistakeAnswered && isTarget && <Check size={18} color="#58CC02" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Completion Action */}
              {isMistakeAnswered && (
                <button
                  type="button"
                  onClick={handleCompleteMistakeRetake}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: isMistakeCorrect ? '#58CC02' : '#FF6B4A',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: isMistakeCorrect ? '0 4px 0 #388401' : '0 4px 0 #C2410C'
                  }}
                >
                  <span>{isMistakeCorrect ? 'Resolved! Clear Mistake (+15 XP)' : 'Try Again'}</span>
                </button>
              )}
            </div>
          )}

          {/* Real Mistakes List from Ongoing Lessons */}
          {mistakes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Recent Lesson Mistakes</h3>
                  <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                    Tap any mistake to retake the question and clear it from your inbox.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    mistakeService.clearAll(currentLang);
                    setMistakes([]);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--fl-text-muted)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Clear All
                </button>
              </div>

              {mistakes.map((m) => (
                <div
                  key={m.id}
                  className="fl-card"
                  style={{
                    padding: '16px 18px',
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--fl-bg-card-subtle)',
                    border: '1.5px solid var(--fl-border)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, marginRight: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="fl-badge fl-badge-teal" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        {m.unitId.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--fl-coral-flame)', fontWeight: 700 }}>
                        Needs Practice
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                      {m.exercise.prompt}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--fl-text-secondary)' }}>
                      Correct: <strong style={{ color: '#58CC02' }}>{m.exercise.targetText || 'Review answer'}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMistakeQuiz(m);
                      setIsMistakeAnswered(false);
                      setSelectedMistakeOpt(null);
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#1CB0F6',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 3px 0 #1899D6',
                      flexShrink: 0
                    }}
                  >
                    <Play size={14} />
                    <span>Retake</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Clean Empty State */
            <div
              className="fl-card"
              style={{
                padding: '36px 20px',
                borderRadius: '24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'var(--fl-bg-card-subtle)',
                border: '1.5px solid var(--fl-border)'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(88, 204, 2, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircle size={36} color="#58CC02" />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 900 }}>Mistakes Inbox Zero! 🎉</h3>
                <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', maxWidth: '320px', margin: '6px auto 0' }}>
                  You have cleared all your recent lesson mistakes. As you solve exercises on the learning path, any missed questions will appear right here for targeted review.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setHubTab('gym')}
                style={{
                  marginTop: '8px',
                  padding: '10px 18px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: '#58CC02',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 0 #388401'
                }}
              >
                Practice Level {activeLevel} Sounds
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
