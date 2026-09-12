// FLUENTRA Duolingo-Style Serpentine Stepping-Stone Learning Path
import React, { useState } from 'react';
import { Lock, Check, Play, Star, Sparkles, Gift, Trophy, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UnitMetadata } from '../../types/curriculum';
import { useProgression } from '../../context/ProgressionContext';
import { useUser } from '../../context/UserContext';
import { soundService } from '../../services/soundService';

interface LearningPathProps {
  units: UnitMetadata[];
  onOpenUnit: (unit: UnitMetadata) => void;
  onShowLockedModal: (unit: UnitMetadata) => void;
}

// Alternating serpentine horizontal offsets in pixels
const X_OFFSETS = [0, 52, 78, 48, 0, -48, -78, -52, 0, 48];

export const LearningPath: React.FC<LearningPathProps> = ({
  units,
  onOpenUnit,
  onShowLockedModal
}) => {
  const { getUnitStatus, activeStage, activeLevel } = useProgression();
  const { addXp } = useUser();
  const [openedChests, setOpenedChests] = useState<Record<string, boolean>>({});

  // Find the first available or in-progress unit to highlight with the bouncing START speech bubble
  let activeUnitFound = false;

  const handleChestClick = (chestId: string, requiredUnitsCompleted: boolean) => {
    if (!requiredUnitsCompleted) {
      soundService.playIncorrect();
      return;
    }
    if (openedChests[chestId]) return;

    soundService.playLevelUnlock();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFB800', '#FFD700', '#FFA500', '#00F5B4']
    });

    addXp(30);
    setOpenedChests((prev) => ({ ...prev, [chestId]: true }));
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 10px 60px',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
        userSelect: 'none'
      }}
    >
      {units.map((unit, index) => {
        const status = getUnitStatus(unit.id);
        const isLocked = status === 'locked';
        const isMastered = status === 'mastered';
        const isCompleted = status === 'completed';
        const isInProgress = status === 'in_progress';
        const isAvailable = status === 'available';

        // Is this the primary active unit to show the bouncing START speech bubble?
        const isFocusUnit = !activeUnitFound && (isInProgress || isAvailable);
        if (isFocusUnit) {
          activeUnitFound = true;
        }

        const xOffset = X_OFFSETS[index % X_OFFSETS.length];

        // Should a bonus chest appear after this unit?
        const showMidChest = index === 4; // After unit 5
        const showEndChest = index === units.length - 1; // After unit 10
        // Determine button visual styles
        let bgStyle = 'var(--fl-bg-card-subtle)';
        let shadowColor = 'var(--fl-border-strong)';
        let iconColor = 'var(--fl-text-muted)';
        let borderGlow = 'none';

        if (isMastered) {
          bgStyle = 'linear-gradient(135deg, #FFC800 0%, #FFB800 100%)';
          shadowColor = '#E5A500';
          iconColor = '#FFFFFF';
        } else if (isCompleted) {
          bgStyle = 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)';
          shadowColor = '#388401';
          iconColor = '#FFFFFF';
        } else if (isInProgress || isAvailable) {
          bgStyle = 'linear-gradient(135deg, #58CC02 0%, #4BB900 100%)';
          shadowColor = '#388401';
          iconColor = '#FFFFFF';
          borderGlow = '0 0 24px rgba(88, 204, 2, 0.45)';
        } else {
          bgStyle = 'var(--fl-bg-card-elevated)';
          shadowColor = 'var(--fl-border-strong)';
          iconColor = 'var(--fl-text-muted)';
        }

        return (
          <React.Fragment key={unit.id}>
            {/* Serpentine Stepping Stone Node */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '18px 0',
                transform: `translateX(${xOffset}px)`,
                transition: 'transform 0.3s ease',
                zIndex: isFocusUnit ? 10 : 2
              }}
            >
              {/* Bouncing START / CONTINUE Speech Bubble Tooltip */}
              {isFocusUnit && (
                <div
                  className="animate-duo-bounce"
                  style={{
                    position: 'absolute',
                    top: '-46px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    zIndex: 20
                  }}
                  onClick={() => onOpenUnit(unit)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 14px',
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF',
                      color: '#0D1117',
                      fontWeight: 800,
                      fontSize: '12px',
                      letterSpacing: '0.04em',
                      boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)',
                      border: '2px solid #58CC02',
                      textTransform: 'uppercase'
                    }}
                  >
                    <Sparkles size={13} color="#58CC02" />
                    <span>{isInProgress ? 'Continue' : 'Start'}</span>
                  </div>
                  {/* Pointed Speech-Bubble Tail */}
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '7px solid #FFFFFF',
                      marginTop: '-1px'
                    }}
                  />
                </div>
              )}

              {/* 3D Circular Duolingo Stepping Stone Button */}
              <button
                type="button"
                id={`path-unit-btn-${unit.id}`}
                onClick={() => {
                  if (isLocked) {
                    onShowLockedModal(unit);
                  } else {
                    onOpenUnit(unit);
                  }
                }}
                className={isFocusUnit ? 'animate-duo-pulse' : ''}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: bgStyle,
                  border: isLocked
                    ? '2px solid var(--fl-border)'
                    : isMastered
                    ? '2px solid #FDE68A'
                    : '2px solid #A7F3D0',
                  boxShadow: `0 7px 0 ${shadowColor}, ${borderGlow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  outline: 'none',
                  transition: 'all 0.12s ease',
                  transform: 'translateY(0)'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(4px)';
                  e.currentTarget.style.boxShadow = `0 3px 0 ${shadowColor}`;
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 7px 0 ${shadowColor}, ${borderGlow}`;
                }}
                title={`Unit ${unit.number}: ${unit.title} (${status})`}
                aria-label={`Unit ${unit.number}: ${unit.title} (${status})`}
              >
                {/* Visual Icon Inside Node */}
                {isMastered ? (
                  <Crown size={28} color={iconColor} strokeWidth={2.5} />
                ) : isCompleted ? (
                  <Check size={28} color={iconColor} strokeWidth={3} />
                ) : isFocusUnit ? (
                  <Play size={26} color={iconColor} fill={iconColor} style={{ marginLeft: '3px' }} />
                ) : isAvailable ? (
                  <Play size={24} color={iconColor} fill={iconColor} style={{ marginLeft: '3px' }} />
                ) : (
                  <Lock size={22} color={iconColor} />
                )}

                {/* Mastered Crown Badge / Stars on top */}
                {isMastered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: '#FFB800',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Star size={11} color="#FFFFFF" fill="#FFFFFF" />
                  </div>
                )}
              </button>

              {/* Unit Label Under Node */}
              <div
                style={{
                  marginTop: '10px',
                  textAlign: 'center',
                  maxWidth: '140px'
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: isFocusUnit
                      ? 'var(--fl-teal-light)'
                      : isLocked
                      ? 'var(--fl-text-muted)'
                      : 'var(--fl-text-primary)',
                    letterSpacing: '0.02em'
                  }}
                >
                  Unit {unit.number}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--fl-text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {unit.title}
                </div>
              </div>
            </div>

            {/* Mid-Stage Milestone Chest */}
            {showMidChest && (
              <div
                style={{
                  margin: '16px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 2
                }}
              >
                <button
                  type="button"
                  id={`chest-stage-${activeStage}-mid`}
                  onClick={() =>
                    handleChestClick(
                      `chest-${activeStage}-mid`,
                      getUnitStatus(units[4].id) === 'completed' ||
                        getUnitStatus(units[4].id) === 'mastered'
                    )
                  }
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '18px',
                    backgroundColor: openedChests[`chest-${activeStage}-mid`]
                      ? 'rgba(255, 184, 0, 0.15)'
                      : 'var(--fl-bg-card)',
                    border: openedChests[`chest-${activeStage}-mid`]
                      ? '2px solid #FFB800'
                      : '2px solid var(--fl-border-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 6px 0 var(--fl-border-strong)',
                    transition: 'all 0.15s ease'
                  }}
                  title={
                    openedChests[`chest-${activeStage}-mid`]
                      ? 'Reward Claimed! +30 XP'
                      : 'Mid-Stage Treasure Chest (Complete Unit 5 to Unlock)'
                  }
                >
                  <Gift
                    size={26}
                    color={
                      openedChests[`chest-${activeStage}-mid`]
                        ? '#FFB800'
                        : getUnitStatus(units[4].id) === 'completed' ||
                          getUnitStatus(units[4].id) === 'mastered'
                        ? 'var(--fl-teal-light)'
                        : 'var(--fl-text-muted)'
                    }
                  />
                </button>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    marginTop: '6px',
                    color: openedChests[`chest-${activeStage}-mid`]
                      ? '#FFB800'
                      : 'var(--fl-text-muted)'
                  }}
                >
                  {openedChests[`chest-${activeStage}-mid`] ? 'Claimed +30 XP' : 'Bonus Chest'}
                </span>
              </div>
            )}

            {/* End-Stage Milestone Trophy / Final Chest */}
            {showEndChest && (
              <div
                style={{
                  margin: '22px 0 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 2
                }}
              >
                <div
                  className="fl-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px 20px',
                    borderRadius: '20px',
                    background:
                      'linear-gradient(135deg, rgba(0, 245, 180, 0.1) 0%, var(--fl-bg-card) 100%)',
                    border: '2px solid var(--fl-teal-subtle)',
                    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 184, 0, 0.15)',
                      border: '1.5px solid #FFB800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFB800',
                      flexShrink: 0
                    }}
                  >
                    <Trophy size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800 }}>
                      Stage {activeStage} Checkpoint
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--fl-text-secondary)', marginTop: '2px' }}>
                      Master all 10 units to unlock Stage {Math.min(10, activeStage + 1)}!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
