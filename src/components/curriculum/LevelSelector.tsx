// FLUENTRA 8-Level Selector
import React from 'react';
import { Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { CURRICULUM_DATA } from '../../data/curriculumRegistry';
import { useProgression } from '../../context/ProgressionContext';

interface LevelSelectorProps {
  onSelectLevel: (levelNum: number) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel }) => {
  const { activeLevel } = useProgression();
  const levels = CURRICULUM_DATA.levels;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Curriculum Levels</h2>
        <span style={{ fontSize: '13px', color: 'var(--fl-teal-light)', fontWeight: 700 }}>
          8 Levels · 800 Units
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {levels.map((lvl) => {
          const isActive = activeLevel === lvl.number;
          // Level 1 is always unlocked; subsequent levels unlock when previous level is completed
          const isLocked = lvl.number > 1 && lvl.number > activeLevel + 1;

          return (
            <button
              key={lvl.id}
              type="button"
              id={`lvl-btn-${lvl.number}`}
              className={`fl-card fl-card-interactive ${isActive ? 'fl-card-active' : ''} ${isLocked ? 'fl-card-locked' : ''}`}
              onClick={() => onSelectLevel(lvl.number)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                textAlign: 'left',
                width: '100%',
                borderLeft: isActive ? '4px solid var(--fl-teal-light)' : undefined
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--fl-radius-md)',
                    backgroundColor: isActive ? 'var(--fl-teal-light)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? 'var(--fl-text-inverse)' : 'var(--fl-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '16px',
                    flexShrink: 0
                  }}
                >
                  {isLocked ? <Lock size={18} /> : lvl.number}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fl-text-primary)' }}>
                      Level {lvl.number} — {lvl.name}
                    </span>
                    {isActive && (
                      <span className="fl-badge fl-badge-teal" style={{ padding: '3px 9px', fontSize: '12px' }}>
                        Current
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                    {lvl.tagline}
                  </span>
                </div>
              </div>

              <div>
                {lvl.number < activeLevel ? (
                  <CheckCircle2 size={20} color="var(--fl-teal-light)" />
                ) : isLocked ? (
                  <Lock size={18} color="var(--fl-text-muted)" />
                ) : (
                  <ChevronRight size={20} color="var(--fl-text-muted)" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
