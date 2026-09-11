// FLUENTRA Match Pairs Vocabulary Exercise
import React, { useState } from 'react';
import { MatchPair } from '../../types/curriculum';
import { soundService } from '../../services/soundService';

interface MatchPairsProps {
  pairs: MatchPair[];
  onComplete: () => void;
}

export const MatchPairs: React.FC<MatchPairsProps> = ({ pairs, onComplete }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [mismatch, setMismatch] = useState<boolean>(false);

  const leftItems = pairs.map(p => ({ id: p.id, text: p.left }));
  // Shuffle right items stably
  const rightItems = [...pairs].reverse().map(p => ({ id: p.id, text: p.right }));

  const handleSelectLeft = (id: string) => {
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
                onClick={() => handleSelectLeft(item.id)}
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
