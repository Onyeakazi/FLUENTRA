import { UserProfile, UnitProgress, CourseProgress } from '../types/progress';

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

  public getProgress(): Record<string, UnitProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESSION);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Progress read error', e);
    }

    // Default progression state: Unit 1 available
    const initial: Record<string, UnitProgress> = {
      'u1': {
        unitId: 'u1',
        status: 'available',
        completedLessonIds: [],
        bestScore: 0,
        lastPracticed: new Date().toISOString()
      }
    };
    return initial;
  }

  public saveProgress(progress: Record<string, UnitProgress>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESSION, JSON.stringify(progress));
    } catch (e) {
      console.warn('Progress save error', e);
    }
  }

  public getCourseProgress(languageId: string, languageCode = 'zh-CN', flag = '🇨🇳'): CourseProgress {
    const key = `fluentra_course_progress_${languageId}`;
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Course progress read error', e);
    }

    // Backward compatibility: If legacy progress exists, migrate it
    const legacy = this.getProgress();
    const initialCourse: CourseProgress = {
      languageId,
      languageCode,
      flag,
      activeLevel: 1,
      activeStage: 1,
      currentUnitId: 'u1',
      courseXp: 0,
      unitsMastered: 0,
      lessonsCompleted: 0,
      unitProgress: legacy,
      lastPracticed: new Date().toISOString()
    };
    this.saveCourseProgress(initialCourse);
    return initialCourse;
  }

  public saveCourseProgress(course: CourseProgress): void {
    const key = `fluentra_course_progress_${course.languageId}`;
    try {
      localStorage.setItem(key, JSON.stringify(course));
    } catch (e) {
      console.warn('Course progress save error', e);
    }
  }

  public getEnrolledCourseIds(): string[] {
    try {
      const data = localStorage.getItem('fluentra_enrolled_courses');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Enrolled courses read error', e);
    }
    const current = this.getProfile().currentLanguage || 'French';
    const fallback = [current];
    this.saveEnrolledCourseIds(fallback);
    return fallback;
  }

  public saveEnrolledCourseIds(ids: string[]): void {
    try {
      localStorage.setItem('fluentra_enrolled_courses', JSON.stringify(ids));
    } catch (e) {
      console.warn('Enrolled courses save error', e);
    }
  }

  public enrollInCourse(languageId: string, languageCode?: string, flag?: string): CourseProgress {
    const existingIds = this.getEnrolledCourseIds();
    if (!existingIds.includes(languageId)) {
      this.saveEnrolledCourseIds([...existingIds, languageId]);
    }
    return this.getCourseProgress(languageId, languageCode, flag);
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
