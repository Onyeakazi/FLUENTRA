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
        if (k.startsWith('fluentra_course_progress_')) {
          localStorage.removeItem(k);
        }
      });
    } catch {
      // Safe
    }
  }
}

export const storageService = new StorageService();
