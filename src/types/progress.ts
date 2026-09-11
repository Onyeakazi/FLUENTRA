// FLUENTRA User Progression, Authentication & Personalization Types

import { UnitStatus } from './curriculum';

export interface UnitProgress {
  unitId: string;
  status: UnitStatus;
  completedLessonIds: string[];
  bestScore: number;
  lastPracticed?: string;
  masteryDate?: string;
}

export interface DailyGoal {
  targetXp: number; // e.g. 30 XP
  currentXp: number;
  completed: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  freezeAvailable: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speaking' | 'streak' | 'xp' | 'curriculum' | 'conversation';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserStats {
  totalXp: number;
  lessonsCompleted: number;
  unitsMastered: number;
  wordsLearned: number;
  speakingMinutes: number;
  accuracyAverage: number;
  pronunciationAverage: number;
}

export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  avatarUrl: string;
  isAuthenticated: boolean;
  authProvider?: 'google' | 'email' | 'guest';
  currentLanguage: string; // e.g. "French", "Spanish", "Japanese", "German", "Italian"
  targetLanguage: string;  // e.g. "fr-FR", "es-ES", "ja-JP", "de-DE", "it-IT"
  learningGoal?: 'travel' | 'career' | 'daily' | 'brain';
  experienceLevel?: 'beginner' | 'elementary' | 'intermediate';
  dailyCommitmentMinutes?: number;
  currentLevelNumber: number;
  currentUnitId: string;
  stats: UserStats;
  streak: StreakData;
  dailyGoal: DailyGoal;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  slowAudioDefault: boolean;
  theme?: 'dark' | 'light';
}
