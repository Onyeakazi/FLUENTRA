// FLUENTRA Curriculum Progression & Locking Context
import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import { UnitStatus } from '../types/curriculum';
import { UnitProgress } from '../types/progress';
import { CURRICULUM_DATA } from '../data/curriculumRegistry';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';
import { useUser } from './UserContext';

interface ProgressionContextType {
  progressMap: Record<string, UnitProgress>;
  getUnitStatus: (unitId: string) => UnitStatus;
  isUnitUnlocked: (unitId: string) => boolean;
  completeLesson: (unitId: string, lessonId: string, score: number, xpReward: number) => void;
  unlockNextUnit: (currentUnitId: string) => void;
  activeLevel: number;
  setActiveLevel: (level: number) => void;
  activeStage: number;
  setActiveStage: (stage: number) => void;
}

const ProgressionContext = createContext<ProgressionContextType | null>(null);

export const ProgressionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressMap, setProgressMap] = useState<Record<string, UnitProgress>>(() =>
    storageService.getProgress()
  );
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [activeStage, setActiveStage] = useState<number>(1);
  const { addXp, incrementStreak } = useUser();

  const getUnitStatus = (unitId: string): UnitStatus => {
    // Unit 1 is always available/in-progress by default
    if (unitId === 'u1') {
      return progressMap['u1']?.status || 'available';
    }

    const item = progressMap[unitId];
    if (item) return item.status;

    // Check if prerequisite is completed
    const meta = CURRICULUM_DATA.unitsById[unitId];
    if (!meta || !meta.requiredUnlockUnitId) return 'locked';

    const prereq = progressMap[meta.requiredUnlockUnitId];
    if (prereq && (prereq.status === 'completed' || prereq.status === 'mastered')) {
      return 'available';
    }

    return 'locked';
  };

  const isUnitUnlocked = (unitId: string): boolean => {
    const status = getUnitStatus(unitId);
    return status !== 'locked';
  };

  const unlockNextUnit = (currentUnitId: string) => {
    const currentMeta = CURRICULUM_DATA.unitsById[currentUnitId];
    if (!currentMeta) return;

    const nextUnitNum = currentMeta.number + 1;
    if (nextUnitNum > 800) return;

    const nextUnitId = `u${nextUnitNum}`;

    setProgressMap((prev) => {
      const updated = {
        ...prev,
        [currentUnitId]: {
          ...prev[currentUnitId],
          status: 'completed' as UnitStatus
        },
        [nextUnitId]: {
          unitId: nextUnitId,
          status: 'available' as UnitStatus,
          completedLessonIds: [],
          bestScore: 0
        }
      };
      storageService.saveProgress(updated);
      return updated;
    });

    // Trigger celebration fanfare & confetti
    soundService.playLevelUnlock();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00F5B4', '#00C48C', '#818CF8', '#FFB800', '#FF6B4A']
    });
  };

  const completeLesson = (
    unitId: string,
    lessonId: string,
    score: number,
    xpReward: number
  ) => {
    addXp(xpReward);
    incrementStreak();

    setProgressMap((prev) => {
      const current = prev[unitId] || {
        unitId,
        status: 'in_progress' as UnitStatus,
        completedLessonIds: [],
        bestScore: 0
      };

      const completedLessons = Array.from(new Set([...current.completedLessonIds, lessonId]));
      const unitMeta = CURRICULUM_DATA.unitsById[unitId];
      const isAllLessonsDone = unitMeta && completedLessons.length >= unitMeta.lessonCount;

      const newStatus: UnitStatus = isAllLessonsDone
        ? score >= 90 ? 'mastered' : 'completed'
        : 'in_progress';

      const updated = {
        ...prev,
        [unitId]: {
          ...current,
          status: newStatus,
          completedLessonIds: completedLessons,
          bestScore: Math.max(current.bestScore, score),
          lastPracticed: new Date().toISOString()
        }
      };

      storageService.saveProgress(updated);

      if (isAllLessonsDone) {
        unlockNextUnit(unitId);
      }

      return updated;
    });
  };

  return (
    <ProgressionContext.Provider
      value={{
        progressMap,
        getUnitStatus,
        isUnitUnlocked,
        completeLesson,
        unlockNextUnit,
        activeLevel,
        setActiveLevel,
        activeStage,
        setActiveStage
      }}
    >
      {children}
    </ProgressionContext.Provider>
  );
};

export const useProgression = (): ProgressionContextType => {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error('useProgression must be used within a ProgressionProvider');
  }
  return context;
};
