// FLUENTRA Multiple Choice Exercise Component with Interactive Audio Cards
import React, { useState, useMemo } from 'react';
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

  // Randomly mix up options so the correct answer is never predictably in the first position
  const options = useMemo(() => {
    const raw = exercise.options || [];
    if (raw.length <= 1) return raw;
    const shuffled = [...raw];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [exercise.id, exercise.prompt]);

  // When the answer is in the selection, it should NOT be revealed on the top side
  const isAnswerInSelection = useMemo(() => {
    if (!exercise.targetText) return false;
    const cleanTarget = exercise.targetText.trim().toLowerCase().replace(/[.,!?;:"'«»]/g, '');
    return options.some(opt => {
      const cleanOpt = opt.text.trim().toLowerCase().replace(/[.,!?;:"'«»]/g, '');
      const cleanAudio = opt.audioText?.trim().toLowerCase().replace(/[.,!?;:"'«»]/g, '');
      return (
        cleanOpt === cleanTarget ||
        cleanOpt.includes(cleanTarget) ||
        cleanTarget.includes(cleanOpt) ||
        cleanAudio === cleanTarget
      );
    });
  }, [exercise.targetText, options]);

  // Helper to extract the actual target audio required: ONLY TARGET LANGUAGE ANSWERS GET AUDIO READ BACK!
  // Never English translations, English explanations, or English choices.
  const getOptionAudioText = (option: ExerciseOption): string | null => {
    const rawText = (option.text || '').trim();
    if (!rawText) return null;

    const currentLang = profile?.currentLanguage || 'French';

    // 1. If the prompt is explicitly asking for English meaning or English translation,
    // all options are English answers -> DO NOT play audio!
    const isEnglishPrompt =
      /\b(mean\b|meaning|translate .*to english|in english|what does .* mean|which english word|english equivalent)\b/i.test(
        exercise.prompt || ''
      );
    if (isEnglishPrompt) {
      return null;
    }

    // 2. Detect English grammar rules, explanations, or instructional statements
    const isEnglishExplanation =
      /\b(the letter|is silent|pronounced|sound|silent|rule|english|incorrect|correct|structure|grammar|standard|speech|consonant|vowel|liaison|because|statement|tone \d|pitch|curve|all letters|none of the above|true|false)\b/i.test(
        rawText
      ) ||
      /^[A-Z][a-z]+ (says|is|are|has|have|was|were|does|do|at|to|with|in|for)\b/i.test(rawText);

    if (isEnglishExplanation) {
      return null;
    }

    // 3. Language-specific checks to ensure the text is actually the target language:
    if (currentLang === 'Chinese Mandarin') {
      const hasChineseChar = /[\u4e00-\u9fa5]/.test(rawText);
      const hasToneMark = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(rawText);
      if (!hasChineseChar && !hasToneMark) {
        return null;
      }
    } else if (currentLang === 'Japanese') {
      const hasJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(rawText);
      if (!hasJapanese) {
        return null;
      }
    } else {
      // European languages (French, Spanish, German, Italian):
      // If the answer is an English word or translation phrase, do NOT play audio!
      const isEnglishAnswer =
        /^(hello|goodbye|hi|good morning|good evening|good night|please|thank you|thanks|welcome|how are you|fine|delighted|water|coffee|bread|tea|bill|check|menu|table|restaurant|family|friend|friends|house|hotel|train|station|airport|day|night|morning|yes|no|sorry|excuse me|pardon|nice to meet you|pleased to meet you|one coffee please|how much is this|i would like|i live in|we had dinner|dinner)(\s+.*)?$/i.test(
          rawText.toLowerCase()
        );
      if (isEnglishAnswer && !option.translation) {
        return null;
      }
    }

    // 4. If option has explicit audioText that is target language, use it
    if (option.audioText && option.audioText.trim()) {
      const audio = option.audioText.trim();
      if (!/\b(the letter|is silent|is pronounced)\b/i.test(audio)) {
        return audio;
      }
    }

    // 5. Clean option text: remove parenthetical notes e.g. '(High & Flat)'
    const clean = rawText.replace(/\s*\([^)]*\)/g, '').trim();
    return clean || null;
  };

  const handlePlaySound = (option: ExerciseOption, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const textToSpeak = getOptionAudioText(option);
    if (!textToSpeak) return;

    setPlayingOptionId(option.id);
    ttsService.speak(textToSpeak, effectiveLang, profile.slowAudioDefault || false, () => {
      setPlayingOptionId(null);
    });
  };

  const handleSelectOption = (option: ExerciseOption) => {
    if (isChecked) return;
    onSelectOption(option.id);
    // Only play audio if this option has actual target language audio
    const audioText = getOptionAudioText(option);
    if (audioText) {
      handlePlaySound(option);
    }
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
            {exercise.targetText &&
              exercise.type !== 'listening' &&
              !isAnswerInSelection &&
              !exercise.targetText.includes('(') &&
              exercise.targetText.length <= 25 && (
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
          const optionAudio = getOptionAudioText(option);

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

              {/* Right Side Controls: Speaker Listen Icon (only if option has spoken target audio) & State Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: '12px' }}>
                {optionAudio && (
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
                )}

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

