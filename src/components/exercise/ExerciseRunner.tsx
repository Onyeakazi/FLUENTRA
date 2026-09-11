// FLUENTRA Interactive Exercise Runner
import React, { useState } from 'react';
import { X, Check, ArrowRight, Award, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, Exercise } from '../../types/curriculum';
import { MultipleChoice } from './MultipleChoice';
import { SentenceOrder } from './SentenceOrder';
import { MatchPairs } from './MatchPairs';
import { SpeakingChallenge } from './SpeakingChallenge';
import { soundService } from '../../services/soundService';
import { useProgression } from '../../context/ProgressionContext';

interface ExerciseRunnerProps {
  unitId: string;
  lesson: Lesson;
  onExit: () => void;
}

export const ExerciseRunner: React.FC<ExerciseRunnerProps> = ({
  unitId,
  lesson,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const { completeLesson } = useProgression();

  const exercises = lesson.exercises;
  const currentExercise: Exercise = exercises[currentIndex];
  const progressPercent = Math.round(((currentIndex) / exercises.length) * 100);

  const handleCheck = () => {
    let passed = false;

    if (currentExercise.type === 'multiple_choice' || currentExercise.type === 'listening' || currentExercise.type === 'conversation_turn' || currentExercise.type === 'fill_blank') {
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
    }
  };

  const handleNext = () => {
    setIsChecked(false);
    setSelectedOptionId(null);
    setSelectedWords([]);

    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Lesson finished!
      handleFinishLesson();
    }
  };

  const handleFinishLesson = () => {
    const accuracy = Math.round(((correctCount + 1) / (exercises.length || 1)) * 100);
    setIsCompleted(true);
    completeLesson(unitId, lesson.id, accuracy, lesson.xpReward);

    soundService.playLevelUnlock();
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  // If completed, show celebration screen
  if (isCompleted) {
    const accuracy = Math.round(((correctCount + 1) / (exercises.length || 1)) * 100);

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
            <Sparkles size={40} color="var(--fl-text-inverse)" />
          </div>

          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Lesson Complete! 🎉</h2>
            <p style={{ color: 'var(--fl-text-secondary)', marginTop: '4px', fontSize: '15px' }}>
              {lesson.title}
            </p>
          </div>

          {/* Reward Badges */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
            <div className="fl-card" style={{ flex: 1, padding: '14px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Zap size={18} color="var(--fl-gold-star)" fill="var(--fl-gold-star)" />
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--fl-gold-star)' }}>
                  +{lesson.xpReward}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)' }}>XP Earned</span>
            </div>

            <div className="fl-card" style={{ flex: 1, padding: '14px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Award size={18} color="var(--fl-teal-light)" />
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--fl-teal-light)' }}>
                  {Math.min(100, accuracy)}%
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--fl-text-muted)' }}>Accuracy</span>
            </div>
          </div>

          <button
            type="button"
            id="btn-lesson-continue-finish"
            className="fl-btn fl-btn-primary"
            onClick={onExit}
            style={{ width: '100%', marginTop: '8px' }}
          >
            <span>Continue Journey</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const isSpeakingType = currentExercise.type === 'speaking';
  const isMatchPairsType = currentExercise.type === 'match_pairs';

  return (
    <div className="content-fullscreen" style={{ background: 'var(--fl-bg-app)' }}>
      {/* Top Header & Progress */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--fl-border)'
        }}
      >
        <button
          type="button"
          id="btn-lesson-exit"
          className="fl-btn-icon"
          onClick={onExit}
          style={{ width: '38px', height: '38px' }}
          aria-label="Exit lesson"
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
        {/* Dynamic AI Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="fl-badge fl-badge-teal" style={{ fontSize: '11px', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} color="var(--fl-teal-light)" />
              AI Dynamic Session
            </span>
            <span style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', fontWeight: 600 }}>
              {lesson.title}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--fl-gold-star)', fontWeight: 700 }}>
            +{currentExercise.xpReward || 5} XP
          </span>
        </div>

        {(currentExercise.type === 'multiple_choice' || currentExercise.type === 'listening' || currentExercise.type === 'conversation_turn' || currentExercise.type === 'fill_blank') && (
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
      {!isSpeakingType && !isMatchPairsType && (
        <div
          style={{
            padding: '18px 20px',
            paddingBottom: 'calc(18px + var(--fl-safe-bottom))',
            background: isChecked
              ? isCorrect
                ? 'linear-gradient(180deg, rgba(0, 196, 140, 0.15) 0%, #101728 100%)'
                : 'linear-gradient(180deg, rgba(239, 68, 68, 0.15) 0%, #101728 100%)'
              : 'var(--fl-bg-card)',
            borderTop: `1px solid ${
              isChecked
                ? isCorrect ? 'var(--fl-teal-light)' : 'var(--fl-coral-flame)'
                : 'var(--fl-border)'
            }`
          }}
        >
          {isChecked && (
            <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              {isCorrect ? (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--fl-teal-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={18} color="#FFFFFF" />
                </div>
              ) : (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--fl-coral-flame)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <X size={18} color="#FFFFFF" />
                </div>
              )}
              <div>
                <p style={{ fontWeight: 800, fontSize: '16px', color: isCorrect ? 'var(--fl-teal-light)' : 'var(--fl-coral-flame)' }}>
                  {isCorrect ? 'Nicely done!' : 'Correct solution:'}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                  {currentExercise.explanation || currentExercise.targetText}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            id="btn-exercise-action"
            className={`fl-btn ${isChecked ? (isCorrect ? 'fl-btn-primary' : 'fl-btn-coral') : 'fl-btn-primary'}`}
            onClick={isChecked ? handleNext : handleCheck}
            disabled={!isChecked && !selectedOptionId && selectedWords.length === 0}
            style={{ width: '100%', fontSize: '16px' }}
          >
            <span>{isChecked ? 'Continue' : 'Check Answer'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
