// FLUENTRA Interactive Exercise Runner — 10-Step Pedagogical Methodology
import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ArrowRight, Award, Zap, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, Exercise } from '../../types/curriculum';
import { MultipleChoice } from './MultipleChoice';
import { SentenceOrder } from './SentenceOrder';
import { MatchPairs } from './MatchPairs';
import { SpeakingChallenge } from './SpeakingChallenge';
import { TargetDiscovery } from './TargetDiscovery';
import { soundService } from '../../services/soundService';
import { useProgression } from '../../context/ProgressionContext';
import { useUser } from '../../context/UserContext';
import { mistakeService } from '../../services/mistakeService';
import { CURRICULUM_DATA } from '../../data/curriculumRegistry';
import { UNIT_JOURNEYS } from '../../data/unitJourneys';
import { storageService } from '../../services/storageService';

interface ExerciseRunnerProps {
  unitId: string;
  lesson: Lesson;
  onExit: () => void;
  onStartNextUnit?: (nextUnitId: string) => void;
}

const STEP_METADATA: Record<string, { num: number; label: string; badgeClass: string }> = {
  discover: { num: 1, label: 'DISCOVER', badgeClass: 'fl-badge-teal' },
  listen: { num: 2, label: 'LISTEN', badgeClass: 'fl-badge-indigo' },
  understand: { num: 3, label: 'UNDERSTAND', badgeClass: 'fl-badge-teal' },
  practice: { num: 4, label: 'PRACTICE', badgeClass: 'fl-badge-gold' },
  speak: { num: 5, label: 'SPEAK', badgeClass: 'fl-badge-coral' },
  feedback: { num: 6, label: 'FEEDBACK', badgeClass: 'fl-badge-teal' },
  repeat: { num: 7, label: 'REPEAT', badgeClass: 'fl-badge-coral' },
  use: { num: 8, label: 'USE', badgeClass: 'fl-badge-indigo' },
  challenge: { num: 9, label: 'CHALLENGE', badgeClass: 'fl-badge-gold' },
  master: { num: 10, label: 'MASTER', badgeClass: 'fl-badge-teal' }
};

export const ExerciseRunner: React.FC<ExerciseRunnerProps> = ({
  unitId,
  lesson,
  onExit,
  onStartNextUnit
}) => {
  const { completeLesson } = useProgression();
  const { profile } = useUser();
  const lang = profile?.currentLanguage || 'French';

  // Start from where you left off: check if a mid-lesson checkpoint exists
  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const saved = storageService.getResumeCheckpoint(lang);
      if (
        saved &&
        saved.unitId === unitId &&
        saved.lessonId === lesson.id &&
        saved.exerciseIndex > 0 &&
        saved.exerciseIndex < lesson.exercises.length
      ) {
        return saved.exerciseIndex;
      }
    } catch {
      // Safe fallback
    }
    return 0;
  });

  const [resumedNotice, setResumedNotice] = useState<string | null>(() => {
    try {
      const saved = storageService.getResumeCheckpoint(lang);
      if (
        saved &&
        saved.unitId === unitId &&
        saved.lessonId === lesson.id &&
        saved.exerciseIndex > 0 &&
        saved.exerciseIndex < lesson.exercises.length
      ) {
        return `Resumed from Step ${saved.exerciseIndex + 1}`;
      }
    } catch {
      // Safe
    }
    return null;
  });

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Track previous unitId and lessonId to only reset when switching units/lessons, NOT on initial mount!
  const isFirstMountRef = useRef(true);
  const prevKeyRef = useRef(`${unitId}-${lesson.id}`);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    if (prevKeyRef.current !== `${unitId}-${lesson.id}`) {
      prevKeyRef.current = `${unitId}-${lesson.id}`;
      setIsCompleted(false);
      setIsChecked(false);
      setIsCorrect(false);
      setSelectedOptionId(null);
      setSelectedWords([]);
      setCorrectCount(0);
      setCurrentIndex(0);
      setResumedNotice(null);
    }
  }, [unitId, lesson.id]);

  const exercises = lesson.exercises;
  const currentExercise: Exercise = exercises[currentIndex];
  const progressPercent = Math.round(((currentIndex) / exercises.length) * 100);

  const currentUnitMeta = CURRICULUM_DATA.unitsById[unitId];
  const unitJourney = UNIT_JOURNEYS[unitId];

  // Check current answer
  const handleCheck = () => {
    let passed = false;

    if (
      currentExercise.type === 'multiple_choice' ||
      currentExercise.type === 'listening' ||
      currentExercise.type === 'conversation_turn' ||
      currentExercise.type === 'fill_blank'
    ) {
      passed = selectedOptionId === currentExercise.correctOptionId;
    } else if (currentExercise.type === 'sentence_order') {
      const targetStr = currentExercise.correctOrder?.join(' ') || currentExercise.targetText || '';
      passed = selectedWords.join(' ') === targetStr;
    }

    setIsCorrect(passed);
    setIsChecked(true);

    if (passed) {
      soundService.playCorrect();
      setCorrectCount(prev => prev + 1);
    } else {
      soundService.playIncorrect();
      mistakeService.addMistake({
        unitId,
        language: profile.currentLanguage || 'French',
        exercise: currentExercise,
        userAnswer: selectedOptionId || selectedWords.join(' ')
      });
    }
  };

  // Real-time Checkpoint Auto-Save: Persist exact step whenever currentIndex changes
  React.useEffect(() => {
    if (!isCompleted && exercises.length > 0) {
      storageService.saveResumeCheckpoint({
        unitId,
        lessonId: lesson.id,
        exerciseIndex: currentIndex,
        totalExercises: exercises.length,
        unitTitle: currentUnitMeta?.title || lesson.title,
        languageId: lang,
        timestamp: new Date().toISOString()
      });
    }
  }, [currentIndex, unitId, lesson.id, isCompleted, exercises.length, currentUnitMeta?.title, lesson.title, lang]);

  // Safe exit handler that guarantees checkpoint persistence before closing
  const handleExit = () => {
    if (!isCompleted && exercises.length > 0) {
      storageService.saveResumeCheckpoint({
        unitId,
        lessonId: lesson.id,
        exerciseIndex: currentIndex,
        totalExercises: exercises.length,
        unitTitle: currentUnitMeta?.title || lesson.title,
        languageId: lang,
        timestamp: new Date().toISOString()
      });
    }
    onExit();
  };

  // Enforce retry on failure: Reset attempt so the learner must repeat until they get it right
  const handleRetry = () => {
    setIsChecked(false);
    setIsCorrect(false);
    setSelectedOptionId(null);
    setSelectedWords([]);
  };

  // Advance to next exercise only upon passing
  const handleNext = () => {
    setIsChecked(false);
    setIsCorrect(false);
    setSelectedOptionId(null);
    setSelectedWords([]);

    if (currentIndex + 1 < exercises.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      // Persist checkpoint so learner can always resume right here
      storageService.saveResumeCheckpoint({
        unitId,
        lessonId: lesson.id,
        exerciseIndex: nextIdx,
        totalExercises: exercises.length,
        unitTitle: currentUnitMeta?.title || lesson.title,
        languageId: lang,
        timestamp: new Date().toISOString()
      });
    } else {
      handleFinishLesson();
    }
  };

  const handleFinishLesson = () => {
    const accuracy = Math.round(((correctCount + 1) / (exercises.length || 1)) * 100);
    setIsCompleted(true);
    completeLesson(unitId, lesson.id, accuracy, lesson.xpReward);

    // Clear mid-lesson checkpoint upon full completion
    storageService.clearResumeCheckpoint(lang);

    soundService.playLevelUnlock();
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  // If completed, show celebration screen with next unit progression
  if (isCompleted) {
    const accuracy = Math.round(((correctCount + 1) / (exercises.length || 1)) * 100);
    const nextUnitNum = currentUnitMeta ? currentUnitMeta.number + 1 : 2;
    const nextUnitId = `u${nextUnitNum}`;
    const nextUnitMeta = CURRICULUM_DATA.unitsById[nextUnitId];

    return (
      <div className="content-fullscreen" style={{ padding: '24px', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="fl-card animate-pop-in"
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '32px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--fl-teal-light) 0%, var(--fl-teal-primary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(0, 196, 140, 0.4)'
            }}
          >
            <Sparkles size={40} color="#FFFFFF" />
          </div>

          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Unit Mastered! 🎉</h2>
            <p style={{ color: 'var(--fl-text-secondary)', marginTop: '4px', fontSize: '15px' }}>
              {currentUnitMeta?.title || lesson.title}
            </p>
          </div>

          {/* Reward Badges */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
            <div className="fl-card" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Zap size={20} color="var(--fl-gold-star)" fill="var(--fl-gold-star)" />
                <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--fl-gold-star)' }}>
                  +{lesson.xpReward}
                </span>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)' }}>XP Earned</span>
            </div>

            <div className="fl-card" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Award size={20} color="var(--fl-teal-light)" />
                <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--fl-teal-light)' }}>
                  {Math.min(100, accuracy)}%
                </span>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--fl-text-muted)' }}>Mastery</span>
            </div>
          </div>

          {/* Next Unit Unlocked Banner */}
          {nextUnitMeta && (
            <div
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--fl-radius-md)',
                backgroundColor: 'rgba(88, 204, 2, 0.12)',
                border: '1.5px solid #58CC02',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'left'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#58CC02',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Check size={18} color="#FFFFFF" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#58CC02', textTransform: 'uppercase' }}>
                  Next Unit Unlocked
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                  Unit {nextUnitNum}: {nextUnitMeta.title}
                </span>
              </div>
            </div>
          )}

          {/* Continuous Navigation Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {onStartNextUnit && nextUnitMeta && (
              <button
                type="button"
                id="btn-lesson-start-next-unit"
                className="fl-btn fl-btn-primary"
                onClick={() => {
                  setIsCompleted(false);
                  onStartNextUnit(nextUnitId);
                }}
                style={{ width: '100%', minHeight: '52px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span>Continue to Next Unit</span>
                <ArrowRight size={18} />
              </button>
            )}

            <button
              type="button"
              id="btn-lesson-continue-finish"
              className={`fl-btn ${onStartNextUnit && nextUnitMeta ? 'fl-btn-secondary' : 'fl-btn-primary'}`}
              onClick={onExit}
              style={{ width: '100%', minHeight: '48px', fontSize: '15px' }}
            >
              <span>Return to Learning Path</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSpeakingType = currentExercise.type === 'speaking';
  const isMatchPairsType = currentExercise.type === 'match_pairs';
  const isDiscoveryType = currentExercise.type === 'target_discovery';

  const stepInfo = currentExercise.stepType ? STEP_METADATA[currentExercise.stepType] : null;

  return (
    <div className="content-fullscreen" style={{ background: 'var(--fl-bg-app)' }}>
      {/* Top Header & Progress */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid var(--fl-border)'
        }}
      >
        <button
          type="button"
          id="btn-exit-exercise"
          className="fl-btn-icon"
          onClick={handleExit}
          style={{ width: '38px', height: '38px', flexShrink: 0 }}
          aria-label="Exit Lesson"
        >
          <X size={20} />
        </button>

        <div style={{ flex: 1 }}>
          <div className="fl-progress-track">
            <div className="fl-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)' }}>
          {currentIndex + 1} / {exercises.length}
        </span>
      </div>

      {/* Main Interactive Exercise Body */}
      <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>
        {/* Step Indicator Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {stepInfo && (
              <span
                className={`fl-badge ${stepInfo.badgeClass}`}
                style={{ fontSize: '11px', padding: '3px 8px', fontWeight: 800 }}
              >
                Step {stepInfo.num}/10 · {stepInfo.label}
              </span>
            )}
            <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', fontWeight: 700 }}>
              {currentUnitMeta?.title || lesson.title}
            </span>
          </div>

          <span style={{ fontSize: '12px', color: 'var(--fl-gold-star)', fontWeight: 700 }}>
            +{currentExercise.xpReward || 5} XP
          </span>
        </div>

        {/* Resumed from where you left off notice */}
        {resumedNotice && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              marginBottom: '16px',
              borderRadius: '10px',
              backgroundColor: 'rgba(88, 204, 2, 0.12)',
              border: '1px solid rgba(88, 204, 2, 0.3)',
              fontSize: '12px',
              color: '#58CC02',
              fontWeight: 700
            }}
          >
            <span>🎯 {resumedNotice}</span>
            <button
              type="button"
              id="btn-restart-from-beginning"
              onClick={() => {
                setCurrentIndex(0);
                setResumedNotice(null);
                storageService.clearResumeCheckpoint(lang);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--fl-text-secondary)',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '12px',
                fontWeight: 600,
                padding: '2px 6px'
              }}
            >
              Start from beginning
            </button>
          </div>
        )}

        {/* STEP 1: DISCOVER CARD */}
        {isDiscoveryType && (
          <TargetDiscovery
            targets={currentUnitMeta?.learningTargets || unitJourney?.learningTargets || []}
            practicalOutcome={currentUnitMeta?.practicalOutcome || unitJourney?.practicalOutcome}
            onComplete={handleNext}
          />
        )}

        {(currentExercise.type === 'multiple_choice' ||
          currentExercise.type === 'listening' ||
          currentExercise.type === 'conversation_turn' ||
          currentExercise.type === 'fill_blank') && (
          <MultipleChoice
            exercise={currentExercise}
            selectedOptionId={selectedOptionId}
            onSelectOption={setSelectedOptionId}
            isChecked={isChecked}
          />
        )}

        {currentExercise.type === 'sentence_order' && (
          <SentenceOrder
            exercise={currentExercise}
            selectedWords={selectedWords}
            onAddWord={(word) => setSelectedWords(prev => [...prev, word])}
            onRemoveWord={(idx) => setSelectedWords(prev => prev.filter((_, i) => i !== idx))}
            isChecked={isChecked}
            isCorrect={isCorrect}
          />
        )}

        {currentExercise.type === 'match_pairs' && currentExercise.matchPairs && (
          <MatchPairs
            pairs={currentExercise.matchPairs}
            onComplete={() => {
              setCorrectCount(prev => prev + 1);
              handleNext();
            }}
          />
        )}

        {currentExercise.type === 'speaking' && (
          <SpeakingChallenge
            exercise={currentExercise}
            onPass={(_score) => {
              setCorrectCount(prev => prev + 1);
              handleNext();
            }}
          />
        )}
      </div>

      {/* Persistent Bottom Action Drawer (for standard checks) */}
      {!isSpeakingType && !isMatchPairsType && !isDiscoveryType && (
        <div
          style={{
            padding: '18px 20px',
            paddingBottom: 'calc(18px + var(--fl-safe-bottom))',
            background: isChecked
              ? isCorrect
                ? 'linear-gradient(180deg, rgba(88, 204, 2, 0.15) 0%, #101728 100%)'
                : 'linear-gradient(180deg, rgba(239, 68, 68, 0.15) 0%, #101728 100%)'
              : 'var(--fl-bg-card)',
            borderTop: `1.5px solid ${
              isChecked
                ? isCorrect ? '#58CC02' : 'var(--fl-coral-flame)'
                : 'var(--fl-border)'
            }`
          }}
        >
          {isChecked && (
            <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              {isCorrect ? (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#58CC02', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={18} color="#FFFFFF" />
                </div>
              ) : (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--fl-coral-flame)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <RotateCcw size={16} color="#FFFFFF" />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: '17px', color: isCorrect ? '#58CC02' : 'var(--fl-coral-flame)', margin: 0 }}>
                  {isCorrect ? 'Nicely done! ✓' : 'Not quite right — Try again:'}
                </p>
                {currentExercise.explanation && (
                  <p style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '4px', margin: '4px 0 0' }}>
                    {currentExercise.explanation}
                  </p>
                )}
                {currentExercise.translation && (
                  <p style={{ fontSize: '13px', color: 'var(--fl-text-primary)', marginTop: '4px', fontWeight: 600 }}>
                    Meaning: “{currentExercise.translation}”
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action button: When failed, enforce TRY AGAIN instead of continuing! */}
          <button
            type="button"
            id="btn-exercise-action"
            className={`fl-btn ${isChecked ? (isCorrect ? 'fl-btn-primary' : 'fl-btn-coral') : 'fl-btn-primary'}`}
            onClick={isChecked ? (isCorrect ? handleNext : handleRetry) : handleCheck}
            disabled={!isChecked && !selectedOptionId && selectedWords.length === 0}
            style={{ width: '100%', minHeight: '50px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isChecked ? (
              isCorrect ? (
                <>
                  <span>Continue</span>
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <RotateCcw size={18} />
                  <span>Try Again</span>
                </>
              )
            ) : (
              <>
                <span>Check Answer</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
