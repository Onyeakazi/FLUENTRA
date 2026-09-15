// FLUENTRA Multiple Choice Exercise Component with Interactive Audio Cards
import React, { useState } from 'react';
import { Check, X, Volume2 } from 'lucide-react';
import { Exercise, ExerciseOption } from '../../types/curriculum';
import { AudioControls } from '../speech/AudioControls';
import { ttsService } from '../../services/ttsService';
import { useUser } from '../../context/UserContext';
import { getLanguageOption } from '../../data/languages';

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
  const { profile } = useUser();
  const [playingOptionId, setPlayingOptionId] = useState<string | null>(null);

  const effectiveLang =
    getLanguageOption(profile?.currentLanguage || 'French').code ||
    profile?.targetLanguage ||
    'fr-FR';

  const options = exercise.options || [];

  const handlePlaySound = (option: ExerciseOption, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const textToSpeak = option.audioText || option.text;
    if (!textToSpeak) return;

    setPlayingOptionId(option.id);
    ttsService.speak(textToSpeak, effectiveLang, profile.slowAudioDefault || false, () => {
      setPlayingOptionId(null);
    });
  };

  const handleSelectOption = (option: ExerciseOption) => {
    if (isChecked) return;
    onSelectOption(option.id);
    // Play the option's audio so the learner hears it immediately
    handlePlaySound(option);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Exercise Prompt & Model Audio */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
          {exercise.prompt}
        </h3>
        {exercise.audioText && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
            <AudioControls text={exercise.audioText} lang={effectiveLang} />
            {exercise.targetText && (
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--fl-teal-light)' }}>
                {exercise.targetText}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Option Sound Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {options.map((option: ExerciseOption) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === exercise.correctOptionId;
          const isPlaying = playingOptionId === option.id;

          let cardBorder = 'var(--fl-border)';
          let cardBg = 'var(--fl-bg-card)';
          let badgeColor = 'var(--fl-text-secondary)';

          if (isChecked) {
            if (isCorrect) {
              cardBorder = '#58CC02';
              cardBg = 'rgba(88, 204, 2, 0.12)';
              badgeColor = '#58CC02';
            } else if (isSelected && !isCorrect) {
              cardBorder = 'var(--fl-coral-flame)';
              cardBg = 'var(--fl-coral-subtle)';
              badgeColor = 'var(--fl-coral-flame)';
            }
          } else if (isSelected) {
            cardBorder = '#58CC02';
            cardBg = 'rgba(88, 204, 2, 0.1)';
            badgeColor = '#58CC02';
          }

          return (
            <button
              key={option.id}
              type="button"
              id={`opt-${option.id}`}
              className="fl-card fl-card-interactive"
              onClick={() => handleSelectOption(option)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                minHeight: '60px',
                borderColor: cardBorder,
                backgroundColor: cardBg,
                textAlign: 'left',
                width: '100%',
                position: 'relative',
                transition: 'all 0.15s ease',
                boxShadow: isSelected && !isChecked ? '0 0 0 1px #58CC02' : 'none'
              }}
              disabled={isChecked}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: isSelected ? 'var(--fl-text-primary)' : 'var(--fl-text-primary)'
                    }}
                  >
                    {option.text}
                  </span>
                </div>

                {isChecked && option.translation && (
                  <span
                    className="animate-fade-in"
                    style={{
                      fontSize: '13px',
                      color: 'var(--fl-text-secondary)',
                      marginTop: '3px',
                      fontStyle: 'italic'
                    }}
                  >
                    “{option.translation}”
                  </span>
                )}
              </div>

              {/* Right Side Controls: Speaker Listen Icon & State Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: '12px' }}>
                <div
                  onClick={(e) => handlePlaySound(option, e)}
                  title="Listen to this sound"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isPlaying ? 'rgba(88, 204, 2, 0.2)' : 'var(--fl-bg-card-hover)',
                    border: `1.5px solid ${isPlaying ? '#58CC02' : 'var(--fl-border)'}`,
                    transition: 'all 0.15s ease',
                    cursor: 'pointer'
                  }}
                >
                  <Volume2
                    size={18}
                    color={isPlaying ? '#58CC02' : isSelected ? '#58CC02' : 'var(--fl-text-secondary)'}
                    className={isPlaying ? 'fl-pulse' : ''}
                  />
                </div>

                {isChecked && isCorrect && (
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#58CC02',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Check size={16} color="#FFFFFF" />
                  </div>
                )}

                {isChecked && isSelected && !isCorrect && (
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--fl-coral-flame)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={16} color="#FFFFFF" />
                  </div>
                )}

                {!isChecked && (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#58CC02' : 'var(--fl-border)'}`,
                      backgroundColor: isSelected ? '#58CC02' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

