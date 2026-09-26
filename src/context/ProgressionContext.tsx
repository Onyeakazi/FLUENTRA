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
import { firebaseService } from '../services/firebase';

interface ProgressionContextType {
  progressMap: Record<string, UnitProgress>;
  getUnitStatus: (unitId: string) => UnitStatus;
  isUnitUnlocked: (unitId: string) => boolean;
  isLessonCompleted: (unitId: string) => boolean;
  isEarTrainingUnlocked: (unitId: string) => boolean;
  isEarTrainingCompleted: (unitId: string) => boolean;
  completeLesson: (unitId: string, lessonId: string, score: number, xpReward: number) => void;
  completeEarTraining: (unitId: string, score?: number, xpReward?: number) => void;
  unlockNextUnit: (currentUnitId: string) => void;
  recordActiveUnit: (unitId: string) => void;
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

  // Real-time Cloud Sync Listener: When user logs in or cloud sync occurs, hydrate and update state
  useEffect(() => {
    const handleCloudSync = () => {
      const opt = getLanguageOption(profile.currentLanguage || 'French');
      const refreshedCourse = storageService.getCourseProgress(opt.id, opt.code, opt.flag);
      setActiveCourse(refreshedCourse);
      setProgressMap(refreshedCourse.unitProgress || storageService.getProgress());
      setActiveLevelState(refreshedCourse.activeLevel || 1);
      setActiveStageState(refreshedCourse.activeStage || 1);
      setEnrolledCourses(storageService.getAllEnrolledCourses());
    };

    window.addEventListener('fluentra_cloud_sync_completed', handleCloudSync);
    return () => {
      window.removeEventListener('fluentra_cloud_sync_completed', handleCloudSync);
    };
  }, [profile.currentLanguage]);

  // When user is authenticated, ensure we sync latest course progress from Firestore on mount/auth change
  useEffect(() => {
    if (profile.isAuthenticated && (profile.id || profile.email) && firebaseService.isReady()) {
      const userId = profile.id || profile.email!;
      firebaseService.fetchUserProfileFromCloud(userId).then((cloudProfile) => {
        if (cloudProfile && cloudProfile.courses) {
          storageService.hydrateCoursesFromCloud(cloudProfile.courses);
          const opt = getLanguageOption(profile.currentLanguage || 'French');
          const refreshedCourse = storageService.getCourseProgress(opt.id, opt.code, opt.flag);
          setActiveCourse(refreshedCourse);
          setProgressMap(refreshedCourse.unitProgress || storageService.getProgress());
          setActiveLevelState(refreshedCourse.activeLevel || 1);
          setActiveStageState(refreshedCourse.activeStage || 1);
          setEnrolledCourses(storageService.getAllEnrolledCourses());
        }
      }).catch((err) => {
        console.warn('Initial cloud progression sync error:', err);
      });
    }
  }, [profile.id, profile.isAuthenticated, profile.email, profile.currentLanguage]);

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
      if (profile.isAuthenticated && (profile.id || profile.email)) {
        firebaseService.syncCourseToCloud(profile.id || profile.email!, savedCourse);
      }
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

  // Prerequisite check: A previous unit must have completed BOTH its core lessons AND its 11 Ear Games
  const isUnitPrereqCompleted = useCallback((unitId: string, map = progressMap): boolean => {
    const meta = CURRICULUM_DATA.unitsById[unitId];
    if (!meta || !meta.requiredUnlockUnitId) {
      return true; // Unit 1 has no prerequisite
    }
    const prereqId = meta.requiredUnlockUnitId;
    const prereq = map[prereqId];
    if (!prereq) return false;

    const prereqMeta = CURRICULUM_DATA.unitsById[prereqId];
    const prereqLessonCount = prereqMeta?.lessonCount || 1;
    const prereqLessonsDone = (prereq.completedLessonIds || []).length >= prereqLessonCount;
    const prereqEarDone = !!prereq.earTrainingCompleted;

    // Prerequisite must have finished lessons AND ear games, or be explicitly mastered
    return (prereqLessonsDone && prereqEarDone) || prereq.status === 'mastered';
  }, [progressMap]);

  const getUnitStatus = useCallback((unitId: string): UnitStatus => {
    // STRICT LOCK: If prerequisite is not 100% completed, this unit is locked. No bypass.
    if (!isUnitPrereqCompleted(unitId)) {
      return 'locked';
    }

    if (unitId === 'u1') {
      return progressMap['u1']?.status || 'available';
    }

    const item = progressMap[unitId];
    if (item) return item.status;

    return 'available';
  }, [isUnitPrereqCompleted, progressMap]);

  const isUnitUnlocked = useCallback((unitId: string): boolean => {
    return getUnitStatus(unitId) !== 'locked';
  }, [getUnitStatus]);

  const isLessonCompleted = useCallback((unitId: string): boolean => {
    const item = progressMap[unitId];
    if (!item) return false;
    const meta = CURRICULUM_DATA.unitsById[unitId];
    const lessonCount = meta?.lessonCount || 1;
    return (item.completedLessonIds || []).length >= lessonCount;
  }, [progressMap]);

  const isEarTrainingUnlocked = useCallback((unitId: string): boolean => {
    if (getUnitStatus(unitId) === 'locked') return false;
    return isLessonCompleted(unitId);
  }, [getUnitStatus, isLessonCompleted]);

  const isEarTrainingCompleted = useCallback((unitId: string): boolean => {
    const item = progressMap[unitId];
    return !!item?.earTrainingCompleted;
  }, [progressMap]);

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

        // Sync to Cloud Firestore in real time
        if (profile.isAuthenticated && (profile.id || profile.email)) {
          firebaseService.syncCourseToCloud(profile.id || profile.email!, updatedCourse);
        }

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

  const recordActiveUnit = useCallback((unitId: string) => {
    const meta = CURRICULUM_DATA.unitsById[unitId];
    if (meta) {
      if (meta.levelNumber !== activeLevel) {
        setActiveLevelState(meta.levelNumber);
      }
      if (meta.stageNumber !== activeStage) {
        setActiveStageState(meta.stageNumber);
      }
    }

    setProgressMap((prev) => {
      const current = prev[unitId];
      if (!current || current.status === 'available') {
        const updated = {
          ...prev,
          [unitId]: {
            unitId,
            status: 'in_progress' as UnitStatus,
            completedLessonIds: current?.completedLessonIds || [],
            bestScore: current?.bestScore || 0,
            lastPracticed: new Date().toISOString()
          }
        };
        storageService.saveProgress(updated);
        return updated;
      }
      return prev;
    });

    setActiveCourse((prev) => {
      const updated = {
        ...prev,
        currentUnitId: unitId,
        activeLevel: meta?.levelNumber || prev.activeLevel || 1,
        activeStage: meta?.stageNumber || prev.activeStage || 1,
        lastPracticed: new Date().toISOString()
      };
      storageService.saveCourseProgress(updated);
      if (profile.isAuthenticated && (profile.id || profile.email)) {
        firebaseService.syncCourseToCloud(profile.id || profile.email!, updated);
      }
      return updated;
    });
  }, [activeLevel, activeStage, profile]);

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
      const isEarDone = !!current.earTrainingCompleted;
      const currentMeta = CURRICULUM_DATA.unitsById[unitId];
      const isAllLessonsDone = currentMeta ? completedLessons.length >= currentMeta.lessonCount : true;

      // Status only becomes mastered/completed if BOTH lesson and ear training are done!
      const newStatus: UnitStatus = (isAllLessonsDone && isEarDone)
        ? (score >= 90 ? 'mastered' : 'completed')
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

      // STRICT LOCKING: Next unit is NOT unlocked here! Next unit ONLY unlocks when 11 Ear Games are completed!

      // Persist to active course
      setActiveCourse((curr) => {
        const masteredCount = Object.values(updated).filter((u) => u.status === 'mastered').length;

        const updatedCourse: CourseProgress = {
          ...curr,
          courseXp: (curr.courseXp || 0) + xpReward,
          lessonsCompleted: (curr.lessonsCompleted || 0) + 1,
          unitsMastered: masteredCount,
          unitProgress: updated,
          lastPracticed: new Date().toISOString()
        };
        storageService.saveCourseProgress(updatedCourse);

        // Sync to Cloud Firestore in real time
        if (profile.isAuthenticated && (profile.id || profile.email)) {
          firebaseService.syncCourseToCloud(profile.id || profile.email!, updatedCourse);
        }

        return updatedCourse;
      });

      storageService.saveProgress(updated);
      setEnrolledCourses(storageService.getAllEnrolledCourses());

      return updated;
    });

    soundService.playLevelUnlock();
  };

  const completeEarTraining = (
    unitId: string,
    score: number = 100,
    xpReward: number = 50
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

      const finalScore = Math.max(current.bestScore, score);
      const newStatus: UnitStatus = finalScore >= 90 ? 'mastered' : 'completed';

      const updated: Record<string, UnitProgress> = {
        ...prev,
        [unitId]: {
          ...current,
          status: newStatus,
          earTrainingCompleted: true,
          earTrainingScore: score,
          bestScore: finalScore,
          masteryDate: new Date().toISOString(),
          lastPracticed: new Date().toISOString()
        }
      };

      // STRICT UNLOCK: ONLY NOW is the next unit unlocked!
      if (nextUnitNum <= 800) {
        const existingNext = prev[nextUnitId];
        updated[nextUnitId] = {
          unitId: nextUnitId,
          status: 'available' as UnitStatus,
          completedLessonIds: existingNext?.completedLessonIds || [],
          bestScore: existingNext?.bestScore || 0
        };
      }

      // Persist to active course
      setActiveCourse((curr) => {
        const masteredCount = Object.values(updated).filter((u) => u.status === 'mastered').length;

        const updatedCourse: CourseProgress = {
          ...curr,
          currentUnitId: nextUnitId,
          courseXp: (curr.courseXp || 0) + xpReward,
          unitsMastered: masteredCount,
          unitProgress: updated,
          lastPracticed: new Date().toISOString()
        };
        storageService.saveCourseProgress(updatedCourse);

        // Sync to Cloud Firestore in real time
        if (profile.isAuthenticated && (profile.id || profile.email)) {
          firebaseService.syncCourseToCloud(profile.id || profile.email!, updatedCourse);
        }

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
        isLessonCompleted,
        isEarTrainingUnlocked,
        isEarTrainingCompleted,
        completeLesson,
        completeEarTraining,
        unlockNextUnit,
        recordActiveUnit,
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
