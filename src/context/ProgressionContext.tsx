// FLUENTRA Curriculum Progression & Multi-Language Course Context
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { UnitStatus } from '../types/curriculum';
import { UnitProgress, CourseProgress } from '../types/progress';
import { CURRICULUM_DATA } from '../data/curriculumRegistry';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';
import { AVAILABLE_LANGUAGES, getLanguageOption } from '../data/languages';
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
  // Multi-Course Support
  activeCourse: CourseProgress;
  enrolledCourses: CourseProgress[];
  switchCourse: (languageId: string, languageCode?: string, flag?: string) => void;
  enrollInNewCourse: (languageId: string) => void;
}

const ProgressionContext = createContext<ProgressionContextType | null>(null);

export const ProgressionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, updateSettings, addXp, incrementStreak } = useUser();

  const currentLang = profile.currentLanguage || 'French';
  const langOpt = getLanguageOption(currentLang);

  const [activeCourse, setActiveCourse] = useState<CourseProgress>(() =>
    storageService.getCourseProgress(langOpt.id, langOpt.code, langOpt.flag)
  );

  const [progressMap, setProgressMap] = useState<Record<string, UnitProgress>>(() =>
    activeCourse.unitProgress || storageService.getProgress()
  );

  const [activeLevel, setActiveLevelState] = useState<number>(() => activeCourse.activeLevel || 1);
  const [activeStage, setActiveStageState] = useState<number>(() => activeCourse.activeStage || 1);

  const [enrolledCourses, setEnrolledCourses] = useState<CourseProgress[]>(() =>
    storageService.getAllEnrolledCourses()
  );

  // Sync state if user's language changes from another view (e.g. AccountSetup)
  useEffect(() => {
    if (profile.currentLanguage && profile.currentLanguage !== activeCourse.languageId) {
      const opt = getLanguageOption(profile.currentLanguage);
      const course = storageService.getCourseProgress(opt.id, opt.code, opt.flag);
      setActiveCourse(course);
      setProgressMap(course.unitProgress || {});
      setActiveLevelState(course.activeLevel || 1);
      setActiveStageState(course.activeStage || 1);
      setEnrolledCourses(storageService.getAllEnrolledCourses());
    }
  }, [profile.currentLanguage]);

  const setActiveLevel = (level: number) => {
    setActiveLevelState(level);
    setActiveCourse((prev) => {
      const updated = { ...prev, activeLevel: level, lastPracticed: new Date().toISOString() };
      storageService.saveCourseProgress(updated);
      return updated;
    });
  };

  const setActiveStage = (stage: number) => {
    setActiveStageState(stage);
    setActiveCourse((prev) => {
      const updated = { ...prev, activeStage: stage, lastPracticed: new Date().toISOString() };
      storageService.saveCourseProgress(updated);
      return updated;
    });
  };

  const switchCourse = useCallback((languageId: string, languageCode?: string, flag?: string) => {
    const opt = getLanguageOption(languageId);
    const targetCode = languageCode || opt.code;
    const targetFlag = flag || opt.flag;

    // 1. Save current course state before switching
    setActiveCourse((currentCourse) => {
      const savedCourse: CourseProgress = {
        ...currentCourse,
        activeLevel,
        activeStage,
        unitProgress: progressMap,
        lastPracticed: new Date().toISOString()
      };
      storageService.saveCourseProgress(savedCourse);
      return savedCourse;
    });

    // 2. Ensure target language is registered in enrolled courses
    storageService.enrollInCourse(opt.id, targetCode, targetFlag);

    // 3. Load target course progress
    const nextCourse = storageService.getCourseProgress(opt.id, targetCode, targetFlag);
    setActiveCourse(nextCourse);
    setProgressMap(nextCourse.unitProgress || {});
    setActiveLevelState(nextCourse.activeLevel || 1);
    setActiveStageState(nextCourse.activeStage || 1);

    // 4. Update user profile to active course
    updateSettings({
      currentLanguage: opt.id,
      targetLanguage: targetCode,
      currentLevelNumber: nextCourse.activeLevel || 1,
      currentUnitId: nextCourse.currentUnitId || 'u1'
    });

    // 5. Refresh enrolled list
    setEnrolledCourses(storageService.getAllEnrolledCourses());
    soundService.playLevelUnlock();
  }, [activeLevel, activeStage, progressMap, updateSettings]);

  const enrollInNewCourse = useCallback((languageId: string) => {
    const opt = getLanguageOption(languageId);
    storageService.enrollInCourse(opt.id, opt.code, opt.flag);
    switchCourse(opt.id, opt.code, opt.flag);
  }, [switchCourse]);

  const getUnitStatus = (unitId: string): UnitStatus => {
    // Unit 1 is always available by default in every course
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
      const updated: Record<string, UnitProgress> = {
        ...prev,
        [currentUnitId]: {
          ...(prev[currentUnitId] || { unitId: currentUnitId, completedLessonIds: [], bestScore: 0 }),
          status: 'completed' as UnitStatus
        },
        [nextUnitId]: {
          unitId: nextUnitId,
          status: 'available' as UnitStatus,
          completedLessonIds: prev[nextUnitId]?.completedLessonIds || [],
          bestScore: prev[nextUnitId]?.bestScore || 0
        }
      };

      // Persist to current course
      setActiveCourse((curr) => {
        const updatedCourse: CourseProgress = {
          ...curr,
          currentUnitId: nextUnitId,
          unitProgress: updated,
          lastPracticed: new Date().toISOString()
        };
        storageService.saveCourseProgress(updatedCourse);
        return updatedCourse;
      });

      storageService.saveProgress(updated);
      setEnrolledCourses(storageService.getAllEnrolledCourses());
      return updated;
    });

    // Trigger celebration fanfare & confetti
    soundService.playLevelUnlock();
    confetti({
      particleCount: 65,
      spread: 75,
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

    const currentMeta = CURRICULUM_DATA.unitsById[unitId];
    const nextUnitNum = currentMeta ? currentMeta.number + 1 : 2;
    const nextUnitId = `u${nextUnitNum}`;

    setProgressMap((prev) => {
      const current = prev[unitId] || {
        unitId,
        status: 'in_progress' as UnitStatus,
        completedLessonIds: [],
        bestScore: 0
      };

      const completedLessons = Array.from(new Set([...current.completedLessonIds, lessonId]));
      // A unit is completed if all lessons are done, or if the unit journey was completed
      const isAllLessonsDone = currentMeta ? completedLessons.length >= currentMeta.lessonCount : true;

      const newStatus: UnitStatus = isAllLessonsDone
        ? score >= 90 ? 'mastered' : 'completed'
        : 'in_progress';

      const updated: Record<string, UnitProgress> = {
        ...prev,
        [unitId]: {
          ...current,
          status: newStatus,
          completedLessonIds: completedLessons,
          bestScore: Math.max(current.bestScore, score),
          lastPracticed: new Date().toISOString()
        }
      };

      // Atomically unlock the next unit if this unit is completed
      if (isAllLessonsDone && nextUnitNum <= 800) {
        const existingNext = prev[nextUnitId];
        if (!existingNext || existingNext.status === 'locked') {
          updated[nextUnitId] = {
            unitId: nextUnitId,
            status: 'available' as UnitStatus,
            completedLessonIds: existingNext?.completedLessonIds || [],
            bestScore: existingNext?.bestScore || 0
          };
        }
      }

      // Persist to active course
      setActiveCourse((curr) => {
        const masteredCount = Object.values(updated).filter(u => u.status === 'mastered').length;

        const updatedCourse: CourseProgress = {
          ...curr,
          currentUnitId: isAllLessonsDone ? nextUnitId : curr.currentUnitId,
          courseXp: (curr.courseXp || 0) + xpReward,
          lessonsCompleted: (curr.lessonsCompleted || 0) + 1,
          unitsMastered: masteredCount,
          unitProgress: updated,
          lastPracticed: new Date().toISOString()
        };
        storageService.saveCourseProgress(updatedCourse);
        return updatedCourse;
      });

      storageService.saveProgress(updated);
      setEnrolledCourses(storageService.getAllEnrolledCourses());

      return updated;
    });

    soundService.playLevelUnlock();
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
        setActiveStage,
        activeCourse,
        enrolledCourses,
        switchCourse,
        enrollInNewCourse
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
