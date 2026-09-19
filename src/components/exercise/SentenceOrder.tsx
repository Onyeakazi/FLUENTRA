// FLUENTRA Sentence Ordering Exercise Component
import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { Exercise } from '../../types/curriculum';

interface SentenceOrderProps {
  exercise: Exercise;
  selectedWords: string[];
  onAddWord: (word: string) => void;
  onRemoveWord: (index: number) => void;
  isChecked: boolean;
  isCorrect?: boolean;
}

export const SentenceOrder: React.FC<SentenceOrderProps> = ({
  exercise,
  selectedWords,
  onAddWord,
  onRemoveWord,
  isChecked,
  isCorrect
}) => {
  // Randomly shuffle available chips so they are not pre-sorted
  const availableChips = useMemo(() => {
    const raw = exercise.options?.map(o => o.text) || [];
    if (raw.length <= 1) return raw;
    const shuffled = [...raw];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [exercise.id, exercise.prompt]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
          {exercise.prompt}
        </h3>
        {isChecked && exercise.translation && (
          <p className="animate-fade-in" style={{ fontSize: '15px', color: 'var(--fl-text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>
            English Meaning: “{exercise.translation}”
          </p>
        )}
      </div>

      {/* Answer Slot Box */}
      <div
        style={{
          minHeight: '86px',
          padding: '16px',
          borderRadius: 'var(--fl-radius-md)',
          backgroundColor: isChecked
            ? isCorrect
              ? 'var(--fl-teal-subtle)'
              : 'var(--fl-coral-subtle)'
            : 'var(--fl-bg-card)',
          border: `2px dashed ${
            isChecked
              ? isCorrect
                ? 'var(--fl-teal-light)'
                : 'var(--fl-coral-flame)'
              : 'var(--fl-border-strong)'
          }`,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {selectedWords.length === 0 ? (
          <span style={{ fontSize: '15px', color: 'var(--fl-text-muted)' }}>
            Tap the word tiles below in order
          </span>
        ) : (
          selectedWords.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              type="button"
              className="fl-btn fl-btn-secondary"
              onClick={() => !isChecked && onRemoveWord(idx)}
              style={{
                padding: '10px 16px',
                fontSize: '16px',
                fontWeight: 600,
                backgroundColor: 'var(--fl-bg-card-elevated)',
                borderColor: 'var(--fl-teal-light)'
              }}
              disabled={isChecked}
            >
              <span>{word}</span>
            </button>
          ))
        )}

        {isChecked && (
          <div style={{ marginLeft: 'auto' }}>
            {isCorrect ? (
              <Check size={26} color="var(--fl-teal-light)" />
            ) : (
              <X size={26} color="var(--fl-coral-flame)" />
            )}
          </div>
        )}
      </div>

      {/* Available Word Chips Bank */}
      <div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fl-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Word Bank
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {availableChips.map((chip, idx) => {
            const countInSelected = selectedWords.filter(w => w === chip).length;
            const countInOptions = availableChips.filter(w => w === chip).length;
            const isExhausted = countInSelected >= countInOptions;

            return (
              <button
                key={`${chip}-${idx}`}
                type="button"
                className="fl-btn fl-btn-secondary"
                onClick={() => !isExhausted && !isChecked && onAddWord(chip)}
                disabled={isExhausted || isChecked}
                style={{
                  padding: '10px 18px',
                  minHeight: '46px',
                  fontSize: '16px',
                  fontWeight: 600,
                  opacity: isExhausted ? 0.35 : 1
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
