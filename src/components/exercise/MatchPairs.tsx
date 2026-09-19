import React, { useState, useMemo } from 'react';
import { MatchPair } from '../../types/curriculum';
import { soundService } from '../../services/soundService';
import { ttsService } from '../../services/ttsService';
import { useUser } from '../../context/UserContext';
import { getLanguageOption } from '../../data/languages';

interface MatchPairsProps {
  pairs: MatchPair[];
  targetLang?: string;
  onComplete: () => void;
}

export const MatchPairs: React.FC<MatchPairsProps> = ({ pairs, targetLang, onComplete }) => {
  const { profile } = useUser();
  const effectiveLang =
    targetLang ||
    getLanguageOption(profile?.currentLanguage || 'French').code ||
    profile?.targetLanguage ||
    'fr-FR';

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [mismatch, setMismatch] = useState<boolean>(false);

  const leftItems = useMemo(() => pairs.map(p => ({ id: p.id, text: p.left })), [pairs]);

  // Randomly shuffle right items using Fisher-Yates
  const rightItems = useMemo(() => {
    const items = pairs.map(p => ({ id: p.id, text: p.right }));
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }, [pairs]);

  const handleSelectLeft = (id: string, text: string) => {
    // Play pronunciation of target language word
    if (text) {
      ttsService.speak(text, effectiveLang, profile?.slowAudioDefault || false);
    }

    if (matchedIds.includes(id)) return;

    setSelectedLeft(id);
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleSelectRight = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedRight(id);
    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Correct match!
      soundService.playCorrect();
      const updated = [...matchedIds, leftId];
      setMatchedIds(updated);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (updated.length === pairs.length) {
        setTimeout(onComplete, 400);
      }
    } else {
      // Mismatch
      soundService.playIncorrect();
      setMismatch(true);
      setTimeout(() => {
        setMismatch(false);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
          Match the Pairs
        </h3>
        <p style={{ fontSize: '15px', color: 'var(--fl-text-secondary)' }}>
          Tap matching French and English words
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Left Column (French) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {leftItems.map(item => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedLeft === item.id;

            return (
              <button
                key={`left-${item.id}`}
                type="button"
                className="fl-card fl-card-interactive"
                onClick={() => handleSelectLeft(item.id, item.text)}
                style={{
                  padding: '14px 12px',
                  minHeight: '48px',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: isMatched ? 0.45 : 1,
                  backgroundColor: isSelected ? 'var(--fl-teal-subtle)' : 'var(--fl-bg-card)',
                  borderColor: isSelected
                    ? mismatch ? 'var(--fl-coral-flame)' : 'var(--fl-teal-light)'
                    : isMatched ? 'var(--fl-teal-subtle)' : 'var(--fl-border)'
                }}
              >
                {item.text}
              </button>
            );
          })}
        </div>

        {/* Right Column (English) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rightItems.map(item => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedRight === item.id;

            return (
              <button
                key={`right-${item.id}`}
                type="button"
                className="fl-card fl-card-interactive"
                onClick={() => handleSelectRight(item.id)}
                disabled={isMatched}
                style={{
                  padding: '14px 12px',
                  minHeight: '48px',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                  opacity: isMatched ? 0.35 : 1,
                  backgroundColor: isSelected ? 'var(--fl-teal-subtle)' : 'var(--fl-bg-card)',
                  borderColor: isSelected
                    ? mismatch ? 'var(--fl-coral-flame)' : 'var(--fl-teal-light)'
                    : isMatched ? 'transparent' : 'var(--fl-border)'
                }}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
