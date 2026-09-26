// FLUENTRA Duolingo-Style Serpentine Stepping-Stone Learning Path
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Lock, Check, Play, Star, Sparkles, Gift, Trophy, Crown, Headphones } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UnitMetadata } from '../../types/curriculum';
import { useProgression } from '../../context/ProgressionContext';
import { useUser } from '../../context/UserContext';
import { soundService } from '../../services/soundService';
import { storageService } from '../../services/storageService';
import { getLessonsForUnit } from '../../data/curriculumContent';

interface LearningPathProps {
  units: UnitMetadata[];
  onStartLesson: (unitId: string, lessonId?: string) => void;
  onOpenUnit?: (unit: UnitMetadata) => void;
  onShowLockedModal: (unit: UnitMetadata, lockReason?: string, customTitle?: string) => void;
  onOpenEarChallenge?: (unit: UnitMetadata) => void;
}

// Alternating serpentine horizontal offsets in pixels (tuned for fluid mobile path curves)
const X_OFFSETS = [0, 42, 64, 40, 0, -40, -64, -42];

export const LearningPath: React.FC<LearningPathProps> = ({
  units,
  onStartLesson,
  onOpenUnit,
  onShowLockedModal,
  onOpenEarChallenge
}) => {
  const {
    getUnitStatus,
    isLessonCompleted,
    isEarTrainingUnlocked,
    isEarTrainingCompleted,
    activeStage,
    activeLevel,
    progressMap
  } = useProgression();
  const { addXp, profile } = useUser();
  const [openedChests, setOpenedChests] = useState<Record<string, boolean>>({});
  const activeNodeRef = useRef<HTMLDivElement | null>(null);

  // Target focus step ID: either `${unit.id}-lesson` or `${unit.id}-ear`
  const targetFocusStepId = useMemo(() => {
    const cp = storageService.getResumeCheckpoint(profile?.currentLanguage || 'French');
    if (cp?.unitId && units.some((u) => u.id === cp.unitId)) {
      if (!isLessonCompleted(cp.unitId)) {
        return `${cp.unitId}-lesson`;
      }
      if (!isEarTrainingCompleted(cp.unitId)) {
        return `${cp.unitId}-ear`;
      }
    }

    // Find the first unlocked unit that is not 100% completed
    for (const u of units) {
      const uStatus = getUnitStatus(u.id);
      if (uStatus !== 'locked') {
        if (!isLessonCompleted(u.id)) {
          return `${u.id}-lesson`;
        }
        if (!isEarTrainingCompleted(u.id)) {
          return `${u.id}-ear`;
        }
      }
    }

    return `${units[0]?.id}-lesson`;
  }, [units, profile?.currentLanguage, getUnitStatus, isLessonCompleted, isEarTrainingCompleted]);

  // Auto-scroll seamlessly to where learner left off
  useEffect(() => {
    if (activeNodeRef.current) {
      const timer = setTimeout(() => {
        activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [activeStage, activeLevel, targetFocusStepId]);

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

  const handlePlayUnit = (unit: UnitMetadata) => {
    if (getUnitStatus(unit.id) === 'locked') {
      onShowLockedModal(unit);
      return;
    }

    // Check if there is an active checkpoint for this unit
    const cp = storageService.getResumeCheckpoint(profile?.currentLanguage || 'French');
    let targetLessonId: string | undefined = undefined;

    if (cp && cp.unitId === unit.id && cp.lessonId) {
      targetLessonId = cp.lessonId;
    } else {
      const unitProg = progressMap[unit.id];
      const completedLessonIds = unitProg?.completedLessonIds || [];
      const lessons = getLessonsForUnit(unit.id, profile?.currentLanguage || 'French');
      const nextLesson = lessons.find((l) => !completedLessonIds.includes(l.id)) || lessons[0];
      targetLessonId = nextLesson?.id || `${unit.id}-l1`;
    }

    onStartLesson(unit.id, targetLessonId);
  };

  const handlePlayEarChallenge = (unit: UnitMetadata) => {
    const isUnitLocked = getUnitStatus(unit.id) === 'locked';
    if (isUnitLocked) {
      onShowLockedModal(unit);
      return;
    }

    const earUnlocked = isEarTrainingUnlocked(unit.id);
    if (!earUnlocked) {
      onShowLockedModal(
        unit,
        `You must complete the Unit ${unit.number} Core Lesson before unlocking the 11 Ear Games!`,
        `Unit ${unit.number} Ear Games Locked 🔒`
      );
      return;
    }

    if (onOpenEarChallenge) {
      onOpenEarChallenge(unit);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '52px 8px 60px',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        userSelect: 'none',
        overflow: 'visible'
      }}
    >
      {units.map((unit, index) => {
        const unitStatus = getUnitStatus(unit.id);
        const isUnitLocked = unitStatus === 'locked';

        const lessonDone = isLessonCompleted(unit.id);
        const earUnlocked = isEarTrainingUnlocked(unit.id);
        const earDone = isEarTrainingCompleted(unit.id);

        const isLessonFocus = targetFocusStepId === `${unit.id}-lesson`;
        const isEarFocus = targetFocusStepId === `${unit.id}-ear`;

        const lessonOffset = X_OFFSETS[(index * 2) % X_OFFSETS.length];
        const earOffset = X_OFFSETS[(index * 2 + 1) % X_OFFSETS.length];

        const showMidChest = index === 4; // After unit 5
        const showEndChest = index === units.length - 1; // After unit 10

        // Visual styles for Core Lesson Stepping Stone
        let lessonBg = 'var(--fl-bg-card-elevated)';
        let lessonShadow = 'var(--fl-border-strong)';
        let lessonIconColor = 'var(--fl-text-muted)';
        let lessonBorderGlow = 'none';

        if (lessonDone) {
          lessonBg = 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)';
          lessonShadow = '#388401';
          lessonIconColor = '#FFFFFF';
        } else if (!isUnitLocked) {
          lessonBg = 'linear-gradient(135deg, #58CC02 0%, #4BB900 100%)';
          lessonShadow = '#388401';
          lessonIconColor = '#FFFFFF';
          lessonBorderGlow = '0 0 24px rgba(88, 204, 2, 0.45)';
        }

        // Visual styles for 11 Ear Games Stepping Stone
        let earBg = 'var(--fl-bg-card-elevated)';
        let earShadow = 'var(--fl-border-strong)';
        let earIconColor = 'var(--fl-text-muted)';
        let earBorderGlow = 'none';

        if (earDone) {
          earBg = 'linear-gradient(135deg, #FFC800 0%, #FF9600 100%)';
          earShadow = '#E5A500';
          earIconColor = '#FFFFFF';
        } else if (earUnlocked) {
          earBg = 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #4338CA 100%)';
          earShadow = '#3730A3';
          earIconColor = '#FFFFFF';
          earBorderGlow = '0 0 24px rgba(99, 102, 241, 0.55)';
        }

        return (
          <React.Fragment key={unit.id}>
            {/* STEP 1: Core Lesson Stepping Stone */}
            <div
              ref={isLessonFocus ? activeNodeRef : undefined}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '16px 0',
                transform: `translateX(${lessonOffset}px)`,
                transition: 'transform 0.3s ease',
                zIndex: isLessonFocus ? 10 : 2
              }}
            >
              {/* Bouncing START / CONTINUE Speech Bubble Tooltip */}
              {isLessonFocus && (
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
                  onClick={() => handlePlayUnit(unit)}
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
                    <span>{unitStatus === 'in_progress' ? 'Continue' : 'Start'}</span>
                  </div>
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
                onClick={() => handlePlayUnit(unit)}
                className={isLessonFocus ? 'animate-duo-pulse' : ''}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: lessonBg,
                  border: isUnitLocked
                    ? '2px solid var(--fl-border)'
                    : '2px solid #A7F3D0',
                  boxShadow: `0 7px 0 ${lessonShadow}, ${lessonBorderGlow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isUnitLocked ? 'not-allowed' : 'pointer',
                  position: 'relative',
                  outline: 'none',
                  transition: 'all 0.12s ease',
                  transform: 'translateY(0)'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(4px)';
                  e.currentTarget.style.boxShadow = `0 3px 0 ${lessonShadow}`;
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 7px 0 ${lessonShadow}, ${lessonBorderGlow}`;
                }}
                title={`Unit ${unit.number}: ${unit.title} (Lesson: ${lessonDone ? 'Completed' : isUnitLocked ? 'Locked' : 'Available'})`}
                aria-label={`Unit ${unit.number} Core Lesson`}
              >
                {lessonDone ? (
                  <Check size={28} color={lessonIconColor} strokeWidth={3} />
                ) : isLessonFocus || !isUnitLocked ? (
                  <Play size={26} color={lessonIconColor} fill={lessonIconColor} style={{ marginLeft: '3px' }} />
                ) : (
                  <Lock size={22} color={lessonIconColor} />
                )}
              </button>

              {/* Lesson Node Labels */}
              <div style={{ marginTop: '8px', textAlign: 'center', maxWidth: '140px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: isLessonFocus
                      ? 'var(--fl-teal-light)'
                      : isUnitLocked
                      ? 'var(--fl-text-muted)'
                      : 'var(--fl-text-primary)',
                    letterSpacing: '0.02em'
                  }}
                >
                  Unit {unit.number} · Lesson
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

            {/* STEP 2: Dedicated 11 Ear Games Stepping Stone (Required Section) */}
            <div
              ref={isEarFocus ? activeNodeRef : undefined}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '16px 0',
                transform: `translateX(${earOffset}px)`,
                transition: 'transform 0.3s ease',
                zIndex: isEarFocus ? 10 : 2
              }}
            >
              {/* Bouncing 11 EAR GAMES Speech Bubble Tooltip */}
              {isEarFocus && (
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
                  onClick={() => handlePlayEarChallenge(unit)}
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
                      border: '2px solid #6366F1',
                      textTransform: 'uppercase'
                    }}
                  >
                    <Headphones size={13} color="#6366F1" />
                    <span>11 Ear Games</span>
                  </div>
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

              {/* 3D Circular Ear Training Stepping Stone Button */}
              <button
                type="button"
                id={`path-unit-ear-stone-${unit.id}`}
                onClick={() => handlePlayEarChallenge(unit)}
                className={isEarFocus ? 'animate-duo-pulse' : ''}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: earBg,
                  border: !earUnlocked
                    ? '2px solid var(--fl-border)'
                    : earDone
                    ? '2px solid #FEF08A'
                    : '2px solid #C7D2FE',
                  boxShadow: `0 7px 0 ${earShadow}, ${earBorderGlow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: !earUnlocked ? 'not-allowed' : 'pointer',
                  position: 'relative',
                  outline: 'none',
                  transition: 'all 0.12s ease',
                  transform: 'translateY(0)'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(4px)';
                  e.currentTarget.style.boxShadow = `0 3px 0 ${earShadow}`;
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 7px 0 ${earShadow}, ${earBorderGlow}`;
                }}
                title={`Unit ${unit.number}: 11 Ear Games (${earDone ? 'Mastered' : earUnlocked ? 'Available' : 'Locked'})`}
                aria-label={`Unit ${unit.number} 11 Ear Training Games`}
              >
                {earDone ? (
                  <Crown size={28} color={earIconColor} strokeWidth={2.5} />
                ) : earUnlocked ? (
                  <Headphones size={28} color={earIconColor} strokeWidth={2.5} />
                ) : (
                  <Lock size={22} color={earIconColor} />
                )}

                {/* Mastered Golden Star Badge */}
                {earDone && (
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

              {/* Ear Challenge Node Labels */}
              <div style={{ marginTop: '8px', textAlign: 'center', maxWidth: '140px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: isEarFocus
                      ? 'var(--fl-indigo-light)'
                      : !earUnlocked
                      ? 'var(--fl-text-muted)'
                      : 'var(--fl-text-primary)',
                    letterSpacing: '0.02em'
                  }}
                >
                  Unit {unit.number} · 11 Ear Games
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: earDone ? 'var(--fl-gold-star)' : earUnlocked ? 'var(--fl-indigo-light)' : 'var(--fl-text-secondary)',
                    fontWeight: earDone || earUnlocked ? 700 : 500
                  }}
                >
                  {earDone ? 'Mastered ⭐' : earUnlocked ? 'Play Arcade 🎧' : 'Locked 🔒'}
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
