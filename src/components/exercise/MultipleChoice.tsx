// FLUENTRA Multiple Choice Exercise Component
import React from 'react';
import { Check, X } from 'lucide-react';
import { Exercise, ExerciseOption } from '../../types/curriculum';
import { AudioControls } from '../speech/AudioControls';

interface MultipleChoiceProps {
  exercise: Exercise;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  isChecked: boolean;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  exercise,
  selectedOptionId,
  onSelectOption,
  isChecked
}) => {
  const options = exercise.options || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Exercise Prompt & Model Audio */}
      <div>
        <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '8px' }}>
          {exercise.prompt}
        </h3>
        {exercise.audioText && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
            <AudioControls text={exercise.audioText} />
            {exercise.targetText && (
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--fl-teal-light)' }}>
                {exercise.targetText}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Option Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((option: ExerciseOption) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === exercise.correctOptionId;

          let cardBorder = 'var(--fl-border)';
          let cardBg = 'var(--fl-bg-card)';
          let badgeColor = 'var(--fl-text-secondary)';

          if (isChecked) {
            if (isCorrect) {
              cardBorder = 'var(--fl-teal-light)';
              cardBg = 'var(--fl-teal-subtle)';
              badgeColor = 'var(--fl-teal-light)';
            } else if (isSelected && !isCorrect) {
              cardBorder = 'var(--fl-coral-flame)';
              cardBg = 'var(--fl-coral-subtle)';
              badgeColor = 'var(--fl-coral-flame)';
            }
          } else if (isSelected) {
            cardBorder = 'var(--fl-teal-primary)';
            cardBg = 'var(--fl-teal-subtle)';
            badgeColor = 'var(--fl-teal-light)';
          }

          return (
            <button
              key={option.id}
              type="button"
              id={`opt-${option.id}`}
              className="fl-card fl-card-interactive"
              onClick={() => !isChecked && onSelectOption(option.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                borderColor: cardBorder,
                backgroundColor: cardBg,
                textAlign: 'left',
                width: '100%'
              }}
              disabled={isChecked}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--fl-text-primary)' }}>
                  {option.text}
                </span>
                {option.translation && (
                  <span style={{ fontSize: '13px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                    {option.translation}
                  </span>
                )}
              </div>

              {isChecked && isCorrect && (
                <Check size={20} color="var(--fl-teal-light)" />
              )}
              {isChecked && isSelected && !isCorrect && (
                <X size={20} color="var(--fl-coral-flame)" />
              )}
              {!isChecked && isSelected && (
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: badgeColor
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
