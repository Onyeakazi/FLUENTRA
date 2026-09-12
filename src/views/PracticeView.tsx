// FLUENTRA Dynamic Level-Scoped Practice Lab & Real Mistakes Review Hub
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Target,
  RefreshCw,
  CheckCircle,
  RotateCcw,
  Volume2,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';
import { useProgression } from '../context/ProgressionContext';
import { soundService } from '../services/soundService';
import { ttsService } from '../services/ttsService';
import { mistakeService, UserMistake } from '../services/mistakeService';
import { practiceService, LevelPracticeContent } from '../services/practiceService';

type PracticeTier = 1 | 2 | 3 | 4;

export const PracticeView: React.FC = () => {
  const { profile, addXp } = useUser();
  const { activeCourse, activeLevel } = useProgression();

  const currentLang = profile.currentLanguage || 'French';
  const langCode = activeCourse?.languageCode || 'fr-FR';

  // State Management
  const [hubTab, setHubTab] = useState<'practice' | 'review'>('practice');
  const [activeTier, setActiveTier] = useState<PracticeTier>(1);
  const [batchIndex, setBatchIndex] = useState(0);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Dynamic Content
  const [practiceContent, setPracticeContent] = useState<LevelPracticeContent>(() =>
    practiceService.getLevelPracticeBatch(currentLang, activeLevel, 0)
  );

  // Tier 1: Match Pairs State
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [isMismatch, setIsMismatch] = useState(false);
  const [pairsFinished, setPairsFinished] = useState(false);

  // Tier 2: Sentence Builder State
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isSentenceChecked, setIsSentenceChecked] = useState(false);
  const [isSentenceCorrect, setIsSentenceCorrect] = useState(false);
  const [sentencesFinished, setSentencesFinished] = useState(false);

  // Tier 3: Listening Comprehension State
  const [currentListeningIdx, setCurrentListeningIdx] = useState(0);
  const [selectedListeningOpt, setSelectedListeningOpt] = useState<string | null>(null);
  const [isListeningChecked, setIsListeningChecked] = useState(false);
  const [listeningsFinished, setListeningsFinished] = useState(false);

  // Tier 4: Lightning Reflexes State
  const [currentLightningIdx, setCurrentLightningIdx] = useState(0);
  const [selectedLightningOpt, setSelectedLightningOpt] = useState<string | null>(null);
  const [isLightningAnswered, setIsLightningAnswered] = useState(false);
  const [lightningStreak, setLightningStreak] = useState(0);
  const [lightningScore, setLightningScore] = useState(0);
  const [lightningFinished, setLightningFinished] = useState(false);

  // Mistakes Review State
  const [mistakes, setMistakes] = useState<UserMistake[]>([]);
  const [activeMistakeQuiz, setActiveMistakeQuiz] = useState<UserMistake | null>(null);
  const [selectedMistakeOpt, setSelectedMistakeOpt] = useState<string | null>(null);
  const [isMistakeAnswered, setIsMistakeAnswered] = useState(false);
  const [isMistakeCorrect, setIsMistakeCorrect] = useState(false);

  // Synchronize on language or activeLevel change
  useEffect(() => {
    const updated = practiceService.getLevelPracticeBatch(currentLang, activeLevel, 0);
    setPracticeContent(updated);
    setBatchIndex(0);
    resetAllTierStates();
  }, [currentLang, activeLevel]);

  // Load mistakes
  useEffect(() => {
    setMistakes(mistakeService.getMistakes());
  }, []);

  const resetAllTierStates = () => {
    setMatchedPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsMismatch(false);
    setPairsFinished(false);

    setCurrentSentenceIdx(0);
    setSelectedWords([]);
    setIsSentenceChecked(false);
    setIsSentenceCorrect(false);
    setSentencesFinished(false);

    setCurrentListeningIdx(0);
    setSelectedListeningOpt(null);
    setIsListeningChecked(false);
    setListeningsFinished(false);

    setCurrentLightningIdx(0);
    setSelectedLightningOpt(null);
    setIsLightningAnswered(false);
    setLightningStreak(0);
    setLightningScore(0);
    setLightningFinished(false);
  };

  // Generate Brand New Practice Batch
  const handleGenerateNewBatch = () => {
    if (isGeneratingBatch) return;
    setIsGeneratingBatch(true);
    soundService.playMicClick();

    setTimeout(() => {
      const nextBatch = practiceService.generateNextVariation(
        currentLang,
        activeLevel,
        batchIndex + 1
      );
      setPracticeContent(nextBatch);
      setBatchIndex((prev) => prev + 1);
      setIsGeneratingBatch(false);
      resetAllTierStates();
      soundService.playLevelUnlock();
      confetti({
        particleCount: 50,
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

  // ==========================================
  // TIER 1: MATCH PAIRS LOGIC
  // ==========================================
  const handleSelectPairLeft = (id: string) => {
    if (matchedPairs.includes(id) || isMismatch) return;
    setSelectedLeft(id);
    if (selectedRight) {
      evaluatePairMatch(id, selectedRight);
    }
  };

  const handleSelectPairRight = (id: string) => {
    if (matchedPairs.includes(id) || isMismatch) return;
    setSelectedRight(id);
    if (selectedLeft) {
      evaluatePairMatch(selectedLeft, id);
    }
  };

  const evaluatePairMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      soundService.playCorrect();
      const updated = [...matchedPairs, leftId];
      setMatchedPairs(updated);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Play pronunciation of matched word
      const matchedItem = practiceContent.pairs.find((p) => p.id === leftId);
      if (matchedItem) {
        handlePlayAudio(matchedItem.audio || matchedItem.left);
      }

      if (updated.length === practiceContent.pairs.length) {
        setPairsFinished(true);
        addXp(20);
        soundService.playLevelUnlock();
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      soundService.playIncorrect();
      setIsMismatch(true);
      setTimeout(() => {
        setIsMismatch(false);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  // ==========================================
  // TIER 2: SENTENCE BUILDER LOGIC
  // ==========================================
  const currentSentence = practiceContent.sentences[currentSentenceIdx];

  const handleAddSentenceWord = (word: string) => {
    if (isSentenceChecked) return;
    soundService.playMicClick();
    setSelectedWords((prev) => [...prev, word]);
  };

  const handleRemoveSentenceWord = (index: number) => {
    if (isSentenceChecked) return;
    soundService.playMicClick();
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckSentence = () => {
    if (!currentSentence) return;
    const userBuilt = selectedWords.join(' ').trim();
    const isCorrect = userBuilt.toLowerCase() === currentSentence.target.toLowerCase();

    setIsSentenceChecked(true);
    setIsSentenceCorrect(isCorrect);

    if (isCorrect) {
      soundService.playCorrect();
      handlePlayAudio(currentSentence.target);
      addXp(10);
    } else {
      soundService.playIncorrect();
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIdx + 1 < practiceContent.sentences.length) {
      setCurrentSentenceIdx((prev) => prev + 1);
      setSelectedWords([]);
      setIsSentenceChecked(false);
      setIsSentenceCorrect(false);
    } else {
      setSentencesFinished(true);
      addXp(25);
      soundService.playLevelUnlock();
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.6 } });
    }
  };

  // ==========================================
  // TIER 3: LISTENING RECALL LOGIC
  // ==========================================
  const currentListening = practiceContent.listenings[currentListeningIdx];

  const handleSelectListening = (optionId: string) => {
    if (isListeningChecked) return;
    setSelectedListeningOpt(optionId);
    setIsListeningChecked(true);

    const isCorrect = currentListening?.options.find((o) => o.id === optionId)?.correct || false;
    if (isCorrect) {
      soundService.playCorrect();
      addXp(10);
    } else {
      soundService.playIncorrect();
    }
  };

  const handleNextListening = () => {
    if (currentListeningIdx + 1 < practiceContent.listenings.length) {
      setCurrentListeningIdx((prev) => prev + 1);
      setSelectedListeningOpt(null);
      setIsListeningChecked(false);
    } else {
      setListeningsFinished(true);
      addXp(25);
      soundService.playLevelUnlock();
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.6 } });
    }
  };

  // ==========================================
  // TIER 4: LIGHTNING REFLEXES LOGIC
  // ==========================================
  const currentLightning = practiceContent.lightnings[currentLightningIdx];

  const handleSelectLightning = (opt: string) => {
    if (isLightningAnswered || !currentLightning) return;
    setSelectedLightningOpt(opt);
    setIsLightningAnswered(true);

    const isCorrect = opt === currentLightning.correctAnswer;
    if (isCorrect) {
      soundService.playCorrect();
      setLightningStreak((prev) => prev + 1);
      setLightningScore((prev) => prev + 10);
      addXp(12);
    } else {
      soundService.playIncorrect();
      setLightningStreak(0);
    }
  };

  const handleNextLightning = () => {
    if (currentLightningIdx + 1 < practiceContent.lightnings.length) {
      setCurrentLightningIdx((prev) => prev + 1);
      setSelectedLightningOpt(null);
      setIsLightningAnswered(false);
    } else {
      setLightningFinished(true);
      addXp(30);
      soundService.playLevelUnlock();
      confetti({ particleCount: 55, spread: 70, origin: { y: 0.6 } });
    }
  };

  // ==========================================
  // MISTAKES REVIEW LOGIC
  // ==========================================
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
      setMistakes(mistakeService.getMistakes());
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
        gap: '16px',
        padding: '16px 16px calc(var(--fl-bottom-nav-height) + var(--fl-safe-bottom) + 24px)',
        maxWidth: '560px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Top Dual Hub Mode Switcher */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--fl-bg-card)',
          borderRadius: '16px',
          padding: '4px',
          border: '1.5px solid var(--fl-border)',
          gap: '4px'
        }}
      >
        <button
          type="button"
          onClick={() => setHubTab('practice')}
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
            backgroundColor: hubTab === 'practice' ? '#58CC02' : 'transparent',
            color: hubTab === 'practice' ? '#FFFFFF' : 'var(--fl-text-secondary)',
            fontWeight: 800,
            fontSize: '14px',
            boxShadow: hubTab === 'practice' ? '0 4px 0 #46A302' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={18} />
          <span>Level {activeLevel} Practice</span>
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
          MODE 1: DYNAMIC LEVEL-SCOPED PRACTICE LAB (NEVER STATIC)
          ========================================================================= */}
      {hubTab === 'practice' && (
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
                  {activeTier === 1 && `Level ${activeLevel} Speed Match`}
                  {activeTier === 2 && `Level ${activeLevel} Sentence Builder`}
                  {activeTier === 3 && `Level ${activeLevel} Ear Gym & Audio`}
                  {activeTier === 4 && `Level ${activeLevel} Lightning Reflexes`}
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
                {activeTier === 1 && `${practiceContent.pairs.length} Word Pairs`}
                {activeTier === 2 && `${practiceContent.sentences.length} Sentences`}
                {activeTier === 3 && `${practiceContent.listenings.length} Audio Drills`}
                {activeTier === 4 && `${practiceContent.lightnings.length} Lightning Qs`}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <p style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', margin: 0, lineHeight: 1.4, flex: 1 }}>
                {activeTier === 1 && `Rapid vocabulary pairing & mental connection drills for Level ${activeLevel}.`}
                {activeTier === 2 && `Syntax word-assembly & phrase construction for Level ${activeLevel}.`}
                {activeTier === 3 && `Acoustic speech comprehension & ear training for Level ${activeLevel}.`}
                {activeTier === 4 && `Rapid-fire translation reflexes with streak multipliers for Level ${activeLevel}.`}
              </p>

              <button
                type="button"
                id="btn-generate-practice-drills"
                onClick={handleGenerateNewBatch}
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
                title="Generate a brand new set of practice drills for this level"
              >
                <RefreshCw size={14} className={isGeneratingBatch ? 'fl-spin' : ''} />
                <span>{isGeneratingBatch ? 'Synthesizing...' : 'Generate New'}</span>
              </button>
            </div>
          </div>

          {/* Evolving 4-Tier Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {[
              { tier: 1 as PracticeTier, label: '1. Pairs', count: `${practiceContent.pairs.length} pairs` },
              { tier: 2 as PracticeTier, label: '2. Syntax', count: `${practiceContent.sentences.length} drills` },
              { tier: 3 as PracticeTier, label: '3. Ear Gym', count: `${practiceContent.listenings.length} audio` },
              { tier: 4 as PracticeTier, label: '4. Quick', count: `${practiceContent.lightnings.length} flash` }
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

          {/* =========================================================================
              TIER 1: SPEED MATCH PAIRS (14 PAIRS)
              ========================================================================= */}
          {activeTier === 1 && (
            <div className="fl-card" style={{ padding: '20px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pairsFinished ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#58CC02',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(88, 204, 2, 0.4)'
                    }}
                  >
                    <CheckCircle size={36} color="#FFFFFF" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--fl-text-primary)', margin: 0 }}>
                      All {practiceContent.pairs.length} Pairs Matched!
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '6px' }}>
                      Sensational recall! You earned <strong style={{ color: '#FFC800' }}>+20 XP</strong>.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '320px' }}>
                    <button
                      type="button"
                      className="fl-btn fl-btn-secondary"
                      onClick={() => {
                        setMatchedPairs([]);
                        setPairsFinished(false);
                      }}
                      style={{ flex: 1 }}
                    >
                      <RotateCcw size={16} />
                      <span>Replay</span>
                    </button>
                    <button
                      type="button"
                      className="fl-btn fl-btn-primary"
                      onClick={() => setActiveTier(2)}
                      style={{ flex: 1 }}
                    >
                      <span>Next Tab</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#58CC02' }}>
                      Tap matching word pairs
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fl-text-muted)' }}>
                      Matched: {matchedPairs.length} / {practiceContent.pairs.length}
                    </span>
                  </div>

                  {/* Progress track */}
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--fl-border)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(matchedPairs.length / practiceContent.pairs.length) * 100}%`,
                        height: '100%',
                        backgroundColor: '#58CC02',
                        borderRadius: '999px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {/* Left Column (Target Language) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {practiceContent.pairs.map((p) => {
                        const isMatched = matchedPairs.includes(p.id);
                        const isSelected = selectedLeft === p.id;
                        return (
                          <button
                            key={`left-${p.id}`}
                            type="button"
                            disabled={isMatched}
                            onClick={() => handleSelectPairLeft(p.id)}
                            style={{
                              padding: '12px 10px',
                              borderRadius: '14px',
                              border: isMatched
                                ? '1.5px solid rgba(88, 204, 2, 0.3)'
                                : isSelected
                                ? '2px solid #58CC02'
                                : '1.5px solid var(--fl-border)',
                              backgroundColor: isMatched
                                ? 'rgba(88, 204, 2, 0.1)'
                                : isSelected
                                ? 'rgba(88, 204, 2, 0.15)'
                                : 'var(--fl-bg-card-subtle)',
                              color: isMatched
                                ? 'var(--fl-text-muted)'
                                : isSelected
                                ? '#58CC02'
                                : 'var(--fl-text-primary)',
                              fontWeight: 800,
                              fontSize: '13px',
                              cursor: isMatched ? 'default' : 'pointer',
                              textAlign: 'center',
                              opacity: isMatched ? 0.45 : 1,
                              transition: 'all 0.15s ease',
                              wordBreak: 'break-word'
                            }}
                          >
                            {p.left}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column (English) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[...practiceContent.pairs].reverse().map((p) => {
                        const isMatched = matchedPairs.includes(p.id);
                        const isSelected = selectedRight === p.id;
                        return (
                          <button
                            key={`right-${p.id}`}
                            type="button"
                            disabled={isMatched}
                            onClick={() => handleSelectPairRight(p.id)}
                            style={{
                              padding: '12px 10px',
                              borderRadius: '14px',
                              border: isMatched
                                ? '1.5px solid rgba(88, 204, 2, 0.3)'
                                : isSelected
                                ? '2px solid #1CB0F6'
                                : '1.5px solid var(--fl-border)',
                              backgroundColor: isMatched
                                ? 'rgba(88, 204, 2, 0.1)'
                                : isSelected
                                ? 'rgba(28, 176, 246, 0.15)'
                                : 'var(--fl-bg-card-subtle)',
                              color: isMatched
                                ? 'var(--fl-text-muted)'
                                : isSelected
                                ? '#1CB0F6'
                                : 'var(--fl-text-secondary)',
                              fontWeight: 700,
                              fontSize: '12px',
                              cursor: isMatched ? 'default' : 'pointer',
                              textAlign: 'center',
                              opacity: isMatched ? 0.45 : 1,
                              transition: 'all 0.15s ease',
                              wordBreak: 'break-word'
                            }}
                          >
                            {p.right}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* =========================================================================
              TIER 2: SENTENCE BUILDER (12 DRILLS)
              ========================================================================= */}
          {activeTier === 2 && (
            <div className="fl-card" style={{ padding: '20px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sentencesFinished ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#58CC02',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(88, 204, 2, 0.4)'
                    }}
                  >
                    <CheckCircle size={36} color="#FFFFFF" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--fl-text-primary)', margin: 0 }}>
                      All {practiceContent.sentences.length} Sentences Mastered!
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '6px' }}>
                      Flawless syntax construction! You earned <strong style={{ color: '#FFC800' }}>+25 XP</strong>.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '320px' }}>
                    <button
                      type="button"
                      className="fl-btn fl-btn-secondary"
                      onClick={() => {
                        setCurrentSentenceIdx(0);
                        setSelectedWords([]);
                        setIsSentenceChecked(false);
                        setSentencesFinished(false);
                      }}
                      style={{ flex: 1 }}
                    >
                      <RotateCcw size={16} />
                      <span>Replay</span>
                    </button>
                    <button
                      type="button"
                      className="fl-btn fl-btn-primary"
                      onClick={() => setActiveTier(3)}
                      style={{ flex: 1 }}
                    >
                      <span>Ear Gym</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : currentSentence ? (
                <>
                  {/* Stepper Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="fl-badge fl-badge-teal" style={{ fontSize: '11px', fontWeight: 800 }}>
                      Sentence {currentSentenceIdx + 1} of {practiceContent.sentences.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(currentSentence.target)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--fl-teal-light)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '12px'
                      }}
                    >
                      <Volume2 size={16} />
                      <span>Listen</span>
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--fl-border)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${((currentSentenceIdx + 1) / practiceContent.sentences.length) * 100}%`,
                        height: '100%',
                        backgroundColor: '#58CC02',
                        borderRadius: '999px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--fl-text-primary)', margin: 0 }}>
                      {currentSentence.prompt}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px', margin: 0 }}>
                      “{currentSentence.translation}”
                    </p>
                  </div>

                  {/* Assembled Word Slot Area */}
                  <div
                    style={{
                      minHeight: '76px',
                      padding: '12px 14px',
                      borderRadius: '16px',
                      backgroundColor: isSentenceChecked
                        ? isSentenceCorrect
                          ? 'rgba(88, 204, 2, 0.12)'
                          : 'rgba(255, 75, 75, 0.12)'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: `2px dashed ${
                        isSentenceChecked
                          ? isSentenceCorrect
                            ? '#58CC02'
                            : '#FF4B4B'
                          : 'var(--fl-border-strong)'
                      }`,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {selectedWords.length === 0 ? (
                      <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)', fontStyle: 'italic' }}>
                        Tap the word tiles below in the correct order...
                      </span>
                    ) : (
                      selectedWords.map((word, wIdx) => (
                        <button
                          key={`assembled-${wIdx}`}
                          type="button"
                          onClick={() => handleRemoveSentenceWord(wIdx)}
                          disabled={isSentenceChecked}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '12px',
                            backgroundColor: '#58CC02',
                            color: '#FFFFFF',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '14px',
                            cursor: isSentenceChecked ? 'default' : 'pointer',
                            boxShadow: '0 3px 0 #388401'
                          }}
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Word Bank Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {[...currentSentence.words, ...currentSentence.distractors].map((word, idx) => {
                      const isSelected = selectedWords.includes(word);
                      return (
                        <button
                          key={`bank-${idx}`}
                          type="button"
                          disabled={isSelected || isSentenceChecked}
                          onClick={() => handleAddSentenceWord(word)}
                          style={{
                            padding: '9px 14px',
                            borderRadius: '12px',
                            backgroundColor: isSelected ? 'var(--fl-bg-card-subtle)' : 'var(--fl-bg-card-elevated)',
                            color: isSelected ? 'var(--fl-text-muted)' : 'var(--fl-text-primary)',
                            border: '1.5px solid var(--fl-border)',
                            fontWeight: 800,
                            fontSize: '14px',
                            cursor: isSelected || isSentenceChecked ? 'default' : 'pointer',
                            opacity: isSelected ? 0.35 : 1,
                            boxShadow: isSelected ? 'none' : '0 3px 0 var(--fl-border)'
                          }}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Action */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    {!isSentenceChecked ? (
                      <button
                        type="button"
                        onClick={handleCheckSentence}
                        disabled={selectedWords.length === 0}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '14px',
                          border: 'none',
                          backgroundColor: selectedWords.length === 0 ? 'var(--fl-border)' : '#58CC02',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: selectedWords.length === 0 ? 'not-allowed' : 'pointer',
                          boxShadow: selectedWords.length === 0 ? 'none' : '0 4px 0 #388401'
                        }}
                      >
                        Check Order
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextSentence}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '14px',
                          border: 'none',
                          backgroundColor: isSentenceCorrect ? '#58CC02' : '#FF4B4B',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: isSentenceCorrect ? '0 4px 0 #388401' : '0 4px 0 #D33636'
                        }}
                      >
                        <span>{isSentenceCorrect ? 'Great Job! Next Sentence' : 'Got it, Continue'}</span>
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* =========================================================================
              TIER 3: LISTENING & EAR GYM (12 DRILLS)
              ========================================================================= */}
          {activeTier === 3 && (
            <div className="fl-card" style={{ padding: '20px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {listeningsFinished ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#1CB0F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(28, 176, 246, 0.4)'
                    }}
                  >
                    <CheckCircle size={36} color="#FFFFFF" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--fl-text-primary)', margin: 0 }}>
                      All {practiceContent.listenings.length} Ear Challenges Completed!
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '6px' }}>
                      Native ear calibration successful! You earned <strong style={{ color: '#FFC800' }}>+25 XP</strong>.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '320px' }}>
                    <button
                      type="button"
                      className="fl-btn fl-btn-secondary"
                      onClick={() => {
                        setCurrentListeningIdx(0);
                        setSelectedListeningOpt(null);
                        setIsListeningChecked(false);
                        setListeningsFinished(false);
                      }}
                      style={{ flex: 1 }}
                    >
                      <RotateCcw size={16} />
                      <span>Replay</span>
                    </button>
                    <button
                      type="button"
                      className="fl-btn fl-btn-primary"
                      onClick={() => setActiveTier(4)}
                      style={{ flex: 1 }}
                    >
                      <span>Lightning</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : currentListening ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="fl-badge fl-badge-teal" style={{ fontSize: '11px', fontWeight: 800 }}>
                      Audio Challenge {currentListeningIdx + 1} of {practiceContent.listenings.length}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fl-text-muted)' }}>
                      Listen & choose correct phrase
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--fl-border)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${((currentListeningIdx + 1) / practiceContent.listenings.length) * 100}%`,
                        height: '100%',
                        backgroundColor: '#1CB0F6',
                        borderRadius: '999px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>

                  {/* Big Audio Playback Controller */}
                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '20px',
                      backgroundColor: 'rgba(28, 176, 246, 0.08)',
                      border: '1.5px solid rgba(28, 176, 246, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(currentListening.targetAudio, false)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          borderRadius: '16px',
                          border: 'none',
                          backgroundColor: '#1CB0F6',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 0 #1899D6'
                        }}
                      >
                        <Volume2 size={20} />
                        <span>Play Audio</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePlayAudio(currentListening.targetAudio, true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '12px 16px',
                          borderRadius: '16px',
                          border: '1px solid var(--fl-border)',
                          backgroundColor: 'var(--fl-bg-card-elevated)',
                          color: 'var(--fl-text-primary)',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        <Zap size={16} color="#FFC800" />
                        <span>Slow (0.7x)</span>
                      </button>
                    </div>

                    {currentListening.phonetic && (
                      <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)', fontWeight: 600 }}>
                        IPA: {currentListening.phonetic}
                      </span>
                    )}
                  </div>

                  {/* 4 Multi-Choice Option Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentListening.options.map((opt) => {
                      const isSelected = selectedListeningOpt === opt.id;
                      const isCorrect = opt.correct;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={isListeningChecked}
                          onClick={() => handleSelectListening(opt.id)}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '16px',
                            border: isListeningChecked
                              ? isCorrect
                                ? '2px solid #58CC02'
                                : isSelected
                                ? '2px solid #FF4B4B'
                                : '1.5px solid var(--fl-border)'
                              : isSelected
                              ? '2px solid #1CB0F6'
                              : '1.5px solid var(--fl-border)',
                            backgroundColor: isListeningChecked
                              ? isCorrect
                                ? 'rgba(88, 204, 2, 0.12)'
                                : isSelected
                                ? 'rgba(255, 75, 75, 0.12)'
                                : 'var(--fl-bg-card-subtle)'
                              : 'var(--fl-bg-card-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '2px',
                            cursor: isListeningChecked ? 'default' : 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--fl-text-primary)' }}>
                            {opt.text}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)' }}>
                            {opt.translation}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Next Trigger */}
                  {isListeningChecked && (
                    <button
                      type="button"
                      onClick={handleNextListening}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '14px',
                        border: 'none',
                        backgroundColor: '#58CC02',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 0 #388401'
                      }}
                    >
                      <span>Next Audio Drill</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </>
              ) : null}
            </div>
          )}

          {/* =========================================================================
              TIER 4: LIGHTNING REFLEXES (12 QUICK-FIRE)
              ========================================================================= */}
          {activeTier === 4 && (
            <div className="fl-card" style={{ padding: '20px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {lightningFinished ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#FF9600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(255, 150, 0, 0.4)'
                    }}
                  >
                    <Zap size={36} color="#FFFFFF" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--fl-text-primary)', margin: 0 }}>
                      Lightning Round Complete!
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '6px' }}>
                      Score: <strong style={{ color: '#FFC800' }}>{lightningScore} pts</strong> · You earned <strong style={{ color: '#58CC02' }}>+30 XP</strong>!
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '320px' }}>
                    <button
                      type="button"
                      className="fl-btn fl-btn-secondary"
                      onClick={() => {
                        setCurrentLightningIdx(0);
                        setSelectedLightningOpt(null);
                        setIsLightningAnswered(false);
                        setLightningStreak(0);
                        setLightningScore(0);
                        setLightningFinished(false);
                      }}
                      style={{ flex: 1 }}
                    >
                      <RotateCcw size={16} />
                      <span>Play Again</span>
                    </button>
                    <button
                      type="button"
                      className="fl-btn fl-btn-primary"
                      onClick={handleGenerateNewBatch}
                      style={{ flex: 1 }}
                    >
                      <span>New Batch</span>
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
              ) : currentLightning ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="fl-badge fl-badge-teal" style={{ fontSize: '11px', fontWeight: 800 }}>
                      Speed Question {currentLightningIdx + 1} of {practiceContent.lightnings.length}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#FF9600' }}>
                      🔥 Streak: {lightningStreak}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--fl-border)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${((currentLightningIdx + 1) / practiceContent.lightnings.length) * 100}%`,
                        height: '100%',
                        backgroundColor: '#FF9600',
                        borderRadius: '999px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--fl-text-primary)', margin: 0 }}>
                      {currentLightning.question}
                    </h3>
                  </div>

                  {/* 4 Fast Option Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {currentLightning.options.map((opt, idx) => {
                      const isSelected = selectedLightningOpt === opt;
                      const isCorrect = opt === currentLightning.correctAnswer;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isLightningAnswered}
                          onClick={() => handleSelectLightning(opt)}
                          style={{
                            padding: '14px 12px',
                            borderRadius: '16px',
                            border: isLightningAnswered
                              ? isCorrect
                                ? '2px solid #58CC02'
                                : isSelected
                                ? '2px solid #FF4B4B'
                                : '1.5px solid var(--fl-border)'
                              : isSelected
                              ? '2px solid #FF9600'
                              : '1.5px solid var(--fl-border)',
                            backgroundColor: isLightningAnswered
                              ? isCorrect
                                ? 'rgba(88, 204, 2, 0.15)'
                                : isSelected
                                ? 'rgba(255, 75, 75, 0.15)'
                                : 'var(--fl-bg-card-subtle)'
                              : 'var(--fl-bg-card-subtle)',
                            color: isLightningAnswered
                              ? isCorrect
                                ? '#58CC02'
                                : isSelected
                                ? '#FF4B4B'
                                : 'var(--fl-text-muted)'
                              : 'var(--fl-text-primary)',
                            fontWeight: 800,
                            fontSize: '14px',
                            cursor: isLightningAnswered ? 'default' : 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isLightningAnswered && (
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: '14px',
                        backgroundColor:
                          selectedLightningOpt === currentLightning.correctAnswer
                            ? 'rgba(88, 204, 2, 0.1)'
                            : 'rgba(255, 75, 75, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 800,
                          color:
                            selectedLightningOpt === currentLightning.correctAnswer
                              ? '#58CC02'
                              : '#FF4B4B'
                        }}
                      >
                        {selectedLightningOpt === currentLightning.correctAnswer
                          ? '✓ Correct Reflex!'
                          : `✗ Answer: ${currentLightning.correctAnswer}`}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', lineHeight: 1.4 }}>
                        {currentLightning.explanation}
                      </span>
                    </div>
                  )}

                  {isLightningAnswered && (
                    <button
                      type="button"
                      onClick={handleNextLightning}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '14px',
                        border: 'none',
                        backgroundColor: '#58CC02',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 0 #388401'
                      }}
                    >
                      <span>Continue</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </>
              ) : null}
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          MODE 2: REAL MISTAKES REVIEW INBOX (TIED DIRECTLY TO LESSONS)
          ========================================================================= */}
      {hubTab === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeMistakeQuiz && (
            <div
              className="fl-card"
              style={{
                padding: '20px',
                borderRadius: '24px',
                backgroundColor: 'var(--fl-bg-card)',
                border: '2px solid #1CB0F6',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="fl-badge fl-badge-teal" style={{ fontSize: '11px', fontWeight: 800 }}>
                  Resolving Mistake · {activeMistakeQuiz.unitId}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMistakeQuiz(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--fl-text-muted)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700
                  }}
                >
                  Close
                </button>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--fl-text-primary)', margin: 0 }}>
                  {activeMistakeQuiz.exercise.prompt}
                </h3>
                {activeMistakeQuiz.exercise.translation && (
                  <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px', margin: 0 }}>
                    “{activeMistakeQuiz.exercise.translation}”
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeMistakeQuiz.exercise.options?.map((opt) => {
                  const isSelected = selectedMistakeOpt === opt.id;
                  const isCorrect = opt.id === activeMistakeQuiz.exercise.correctOptionId;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isMistakeAnswered}
                      onClick={() => handleAnswerMistakeQuiz(opt.id)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '16px',
                        border: isMistakeAnswered
                          ? isCorrect
                            ? '2px solid #58CC02'
                            : isSelected
                            ? '2px solid #FF4B4B'
                            : '1.5px solid var(--fl-border)'
                          : isSelected
                          ? '2px solid #1CB0F6'
                          : '1.5px solid var(--fl-border)',
                        backgroundColor: isMistakeAnswered
                          ? isCorrect
                            ? 'rgba(88, 204, 2, 0.15)'
                            : isSelected
                            ? 'rgba(255, 75, 75, 0.15)'
                            : 'var(--fl-bg-card-subtle)'
                          : 'var(--fl-bg-card-subtle)',
                        color: isMistakeAnswered
                          ? isCorrect
                            ? '#58CC02'
                            : isSelected
                            ? '#FF4B4B'
                            : 'var(--fl-text-muted)'
                          : 'var(--fl-text-primary)',
                        fontWeight: 800,
                        fontSize: '15px',
                        cursor: isMistakeAnswered ? 'default' : 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {isMistakeAnswered && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      backgroundColor: isMistakeCorrect ? 'rgba(88, 204, 2, 0.12)' : 'rgba(255, 75, 75, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {isMistakeCorrect ? <CheckCircle size={18} color="#58CC02" /> : <RotateCcw size={18} color="#FF4B4B" />}
                    <span style={{ fontSize: '13px', fontWeight: 800, color: isMistakeCorrect ? '#58CC02' : '#FF4B4B' }}>
                      {isMistakeCorrect ? 'Mistake Resolved! +15 XP Awarded' : 'Not quite yet, try reviewing the lesson.'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCompleteMistakeRetake}
                    style={{
                      width: '100%',
                      padding: '12px',
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
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* List of Tracked Mistakes */}
          {mistakes.length === 0 ? (
            <div
              className="fl-card"
              style={{
                padding: '40px 20px',
                borderRadius: '24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px'
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
                <CheckCircle size={32} color="#58CC02" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--fl-text-primary)', margin: 0 }}>
                All Caught Up!
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', maxWidth: '340px', margin: 0, lineHeight: 1.5 }}>
                Zero unresolved mistakes recorded. Any questions you miss during active lessons will automatically appear here for mastery!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--fl-text-muted)' }}>
                Items Needing Attention ({mistakes.length})
              </span>
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
                    gap: '12px',
                    backgroundColor: 'var(--fl-bg-card-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="fl-badge fl-badge-coral" style={{ fontSize: '10px', fontWeight: 800 }}>
                        {m.unitId}
                      </span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--fl-text-primary)', marginTop: '4px', wordBreak: 'break-word' }}>
                      {m.exercise.prompt}
                    </span>
                    {m.exercise.translation && (
                      <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)' }}>
                        “{m.exercise.translation}”
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMistakeQuiz(m);
                      setSelectedMistakeOpt(null);
                      setIsMistakeAnswered(false);
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
                      flexShrink: 0,
                      boxShadow: '0 3px 0 #1899D6',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Retake
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
