import { UserProfile, UnitProgress, CourseProgress } from '../types/progress';
import { getLanguageOption } from '../data/languages';

const STORAGE_KEYS = {
  PROFILE: 'fluentra_user_profile',
  PROGRESSION: 'fluentra_unit_progress',
  AUTH_TOKEN: 'fluentra_auth_token'
};

export const INITIAL_UNAUTHENTICATED_PROFILE: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatarUrl: '',
  isAuthenticated: false,
  currentLanguage: 'French',
  targetLanguage: 'fr-FR',
  learningGoal: 'travel',
  experienceLevel: 'beginner',
  dailyCommitmentMinutes: 20,
  currentLevelNumber: 1,
  currentUnitId: 'u1',
  stats: {
    totalXp: 0,
    lessonsCompleted: 0,
    unitsMastered: 0,
    wordsLearned: 0,
    speakingMinutes: 0,
    accuracyAverage: 0,
    pronunciationAverage: 0
  },
  streak: {
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    freezeAvailable: true
  },
  dailyGoal: {
    targetXp: 35,
    currentXp: 0,
    completed: false
  },
  soundEnabled: true,
  hapticsEnabled: true,
  slowAudioDefault: false
};

export const createInitialUnitProgress = (): Record<string, UnitProgress> => ({
  u1: {
    unitId: 'u1',
    status: 'available',
    completedLessonIds: [],
    bestScore: 0,
    lastPracticed: new Date().toISOString()
  }
});

class StorageService {
  public getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Storage read error', e);
    }
    return INITIAL_UNAUTHENTICATED_PROFILE;
  }

  public saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }

  public getProgress(languageId?: string): Record<string, UnitProgress> {
    const lang = getLanguageOption(languageId || this.getProfile().currentLanguage || 'French').id;
    try {
      const courseKey = `fluentra_course_progress_${lang}`;
      const data = localStorage.getItem(courseKey);
      if (data) {
        const parsed: CourseProgress = JSON.parse(data);
        if (parsed.unitProgress && Object.keys(parsed.unitProgress).length > 0) {
          return parsed.unitProgress;
        }
      }
    } catch (e) {
      console.warn('Progress read error', e);
    }

    // Only if French, check legacy PROGRESSION key for backward compatibility
    if (lang === 'French') {
      try {
        const legacy = localStorage.getItem(STORAGE_KEYS.PROGRESSION);
        if (legacy) {
          return JSON.parse(legacy);
        }
      } catch (e) {
        console.warn('Legacy progress read error', e);
      }
    }

    return createInitialUnitProgress();
  }

  public saveProgress(progress: Record<string, UnitProgress>, languageId?: string): void {
    const lang = getLanguageOption(languageId || this.getProfile().currentLanguage || 'French').id;
    try {
      // Only keep legacy key synced for French to prevent contaminating other languages
      if (lang === 'French') {
        localStorage.setItem(STORAGE_KEYS.PROGRESSION, JSON.stringify(progress));
      }
    } catch (e) {
      console.warn('Progress save error', e);
    }
  }

  public getCourseProgress(languageId: string, languageCode?: string, flag?: string): CourseProgress {
    const opt = getLanguageOption(languageId);
    const canonicalId = opt.id;
    const targetCode = languageCode || opt.code;
    const targetFlag = flag || opt.flag;
    const key = `fluentra_course_progress_${canonicalId}`;

    try {
      let data = localStorage.getItem(key);
      if (!data && languageId && languageId !== canonicalId) {
        data = localStorage.getItem(`fluentra_course_progress_${languageId}`);
        if (data) {
          localStorage.removeItem(`fluentra_course_progress_${languageId}`);
        }
      }

      if (data) {
        const parsed: CourseProgress = JSON.parse(data);
        parsed.languageId = canonicalId;
        parsed.languageCode = targetCode;
        parsed.flag = targetFlag;

        // Auto-sanitize contaminated course progress:
        // If this course is not French (or has 0 XP and 0 lessons recorded),
        // but unitProgress shows completed lessons or unlocked units beyond u1:
        const hasCompletedLessons = Object.values(parsed.unitProgress || {}).some(
          (u) => (u.completedLessonIds && u.completedLessonIds.length > 0) || !!u.earTrainingCompleted
        );
        const hasCompletedUnits = Object.values(parsed.unitProgress || {}).some(
          (u) => u.status === 'completed' || u.status === 'mastered'
        );
        const hasUnlockedBeyondU1 = Object.keys(parsed.unitProgress || {}).some(
          (uid) => uid !== 'u1' && parsed.unitProgress[uid]?.status !== 'locked'
        );

        const isContaminated =
          parsed.languageId !== 'French' &&
          (!parsed.courseXp || parsed.courseXp === 0) &&
          (!parsed.lessonsCompleted || parsed.lessonsCompleted === 0) &&
          (hasCompletedLessons || hasCompletedUnits || hasUnlockedBeyondU1);

        if (isContaminated) {
          console.warn(`[FLUENTRA] Resetting contaminated course progress for ${canonicalId} to ground zero.`);
          parsed.unitProgress = createInitialUnitProgress();
          parsed.currentUnitId = 'u1';
          parsed.activeLevel = 1;
          parsed.activeStage = 1;
          parsed.courseXp = 0;
          parsed.lessonsCompleted = 0;
          parsed.unitsMastered = 0;
          parsed.lastPracticed = new Date().toISOString();
          this.saveCourseProgress(parsed);
          this.clearResumeCheckpoint(canonicalId);
          if (languageId && languageId !== canonicalId) {
            this.clearResumeCheckpoint(languageId);
          }
        }

        if (!parsed.unitProgress || !parsed.unitProgress['u1']) {
          parsed.unitProgress = {
            ...createInitialUnitProgress(),
            ...(parsed.unitProgress || {})
          };
        }

        return parsed;
      }
    } catch (e) {
      console.warn('Course progress read error', e);
    }

    // New course initialization: ONLY French may inherit legacy progress from previous single-language version
    let initialUnitProgress: Record<string, UnitProgress>;
    if (canonicalId === 'French') {
      try {
        const legacy = localStorage.getItem(STORAGE_KEYS.PROGRESSION);
        initialUnitProgress = legacy ? JSON.parse(legacy) : createInitialUnitProgress();
      } catch {
        initialUnitProgress = createInitialUnitProgress();
      }
    } else {
      // For Chinese Mandarin or ANY other course, start completely fresh at ground zero!
      initialUnitProgress = createInitialUnitProgress();
    }

    const initialCourse: CourseProgress = {
      languageId: canonicalId,
      languageCode: targetCode,
      flag: targetFlag,
      activeLevel: 1,
      activeStage: 1,
      currentUnitId: 'u1',
      courseXp: 0,
      unitsMastered: 0,
      lessonsCompleted: 0,
      unitProgress: initialUnitProgress,
      lastPracticed: new Date().toISOString()
    };
    this.saveCourseProgress(initialCourse);
    return initialCourse;
  }

  public saveCourseProgress(course: CourseProgress): void {
    const canonicalId = getLanguageOption(course.languageId).id;
    const key = `fluentra_course_progress_${canonicalId}`;
    try {
      localStorage.setItem(key, JSON.stringify({ ...course, languageId: canonicalId }));
    } catch (e) {
      console.warn('Course progress save error', e);
    }
  }

  public getEnrolledCourseIds(): string[] {
    try {
      const data = localStorage.getItem('fluentra_enrolled_courses');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = Array.from(new Set(parsed.map(id => getLanguageOption(id).id)));
          return normalized;
        }
      }
    } catch (e) {
      console.warn('Enrolled courses read error', e);
    }
    const current = getLanguageOption(this.getProfile().currentLanguage || 'French').id;
    const fallback = [current];
    this.saveEnrolledCourseIds(fallback);
    return fallback;
  }

  public saveEnrolledCourseIds(ids: string[]): void {
    try {
      const normalized = Array.from(new Set(ids.map(id => getLanguageOption(id).id)));
      localStorage.setItem('fluentra_enrolled_courses', JSON.stringify(normalized));
    } catch (e) {
      console.warn('Enrolled courses save error', e);
    }
  }

  public enrollInCourse(languageId: string, languageCode?: string, flag?: string): CourseProgress {
    const opt = getLanguageOption(languageId);
    const canonicalId = opt.id;
    const existingIds = this.getEnrolledCourseIds();
    if (!existingIds.includes(canonicalId)) {
      this.saveEnrolledCourseIds([...existingIds, canonicalId]);
    }
    return this.getCourseProgress(canonicalId, languageCode || opt.code, flag || opt.flag);
  }

  public getAllEnrolledCourses(): CourseProgress[] {
    const ids = this.getEnrolledCourseIds();
    return ids.map(id => this.getCourseProgress(id));
  }

  public getAllCoursesMap(): Record<string, CourseProgress> {
    const ids = this.getEnrolledCourseIds();
    const map: Record<string, CourseProgress> = {};
    ids.forEach(id => {
      const course = this.getCourseProgress(id);
      if (course) {
        map[id] = course;
      }
    });
    return map;
  }

  public hydrateCoursesFromCloud(cloudCourses: Record<string, CourseProgress>): void {
    if (!cloudCourses || typeof cloudCourses !== 'object') return;
    try {
      const currentEnrolled = this.getEnrolledCourseIds();
      const updatedEnrolled = new Set(currentEnrolled);
      const profile = this.getProfile();

      Object.entries(cloudCourses).forEach(([langId, cloudCourse]) => {
        if (!cloudCourse) return;
        updatedEnrolled.add(langId);

        const localCourse = this.getCourseProgress(langId, cloudCourse.languageCode, cloudCourse.flag);
        
        // Merge unitProgress so completed units from cloud are preserved
        const mergedUnitProgress: Record<string, UnitProgress> = {
          ...(localCourse.unitProgress || {}),
          ...(cloudCourse.unitProgress || {})
        };

        const mergedCourse: CourseProgress = {
          ...cloudCourse,
          languageId: langId,
          activeLevel: Math.max(localCourse.activeLevel || 1, cloudCourse.activeLevel || 1),
          activeStage: Math.max(localCourse.activeStage || 1, cloudCourse.activeStage || 1),
          courseXp: Math.max(localCourse.courseXp || 0, cloudCourse.courseXp || 0),
          lessonsCompleted: Math.max(localCourse.lessonsCompleted || 0, cloudCourse.lessonsCompleted || 0),
          unitsMastered: Math.max(localCourse.unitsMastered || 0, cloudCourse.unitsMastered || 0),
          unitProgress: mergedUnitProgress,
          lastPracticed: cloudCourse.lastPracticed || new Date().toISOString()
        };

        this.saveCourseProgress(mergedCourse);

        if (profile.currentLanguage === langId) {
          this.saveProgress(mergedUnitProgress);
        }
      });

      this.saveEnrolledCourseIds(Array.from(updatedEnrolled));
    } catch (e) {
      console.warn('Failed to hydrate courses from cloud:', e);
    }
  }

  public logout(): void {
    const current = this.getProfile();
    const loggedOut = { ...current, isAuthenticated: false };
    this.saveProfile(loggedOut);
  }

  public resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PROGRESSION);
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('fluentra_course_progress_') || k.startsWith('fluentra_resume_')) {
          localStorage.removeItem(k);
        }
      });
    } catch {
      // Safe
    }
  }

  public getResumeCheckpoint(languageId = 'French'): ResumeCheckpoint | null {
    try {
      const key = `fluentra_resume_${languageId}`;
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch {
      // Safe
    }
    return null;
  }

  public saveResumeCheckpoint(checkpoint: ResumeCheckpoint): void {
    try {
      const key = `fluentra_resume_${checkpoint.languageId || 'French'}`;
      localStorage.setItem(key, JSON.stringify(checkpoint));
    } catch {
      // Safe
    }
  }

  public clearResumeCheckpoint(languageId = 'French'): void {
    try {
      const key = `fluentra_resume_${languageId}`;
      localStorage.removeItem(key);
    } catch {
      // Safe
    }
  }
}

export interface ResumeCheckpoint {
  unitId: string;
  lessonId: string;
  exerciseIndex: number;
  totalExercises: number;
  stepName?: string;
  unitTitle: string;
  languageId: string;
  timestamp: string;
}

export const storageService = new StorageService();
