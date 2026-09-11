// FLUENTRA User Context & Authentication State
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/progress';
import { storageService, INITIAL_UNAUTHENTICATED_PROFILE } from '../services/storageService';
import { soundService } from '../services/soundService';
import { firebaseService } from '../services/firebase';

interface UserContextType {
  profile: UserProfile;
  isAuthenticated: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  login: (email: string, password?: string) => boolean;
  register: (customData: Partial<UserProfile>) => void;
  logout: () => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  updateSettings: (settings: Partial<UserProfile>) => void;
  resetProgress: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('fluentra_theme') as 'dark' | 'light';
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('fluentra_theme', theme);
    } catch {
      // Safe
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  useEffect(() => {
    soundService.setMuted(!profile.soundEnabled);
  }, [profile.soundEnabled]);

  const login = (email: string, _password?: string): boolean => {
    const existing = storageService.getProfile();
    // If existing profile matches or create session
    const updated: UserProfile = {
      ...existing,
      email: email,
      name: existing.name || email.split('@')[0],
      isAuthenticated: true
    };
    storageService.saveProfile(updated);
    setProfile(updated);
    soundService.playCorrect();
    firebaseService.syncUserProfileToCloud(updated);
    return true;
  };

  const register = (customData: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      ...INITIAL_UNAUTHENTICATED_PROFILE,
      id: `learner_${Date.now()}`,
      name: customData.name || 'Learner',
      email: customData.email || '',
      avatarUrl: customData.avatarUrl || '',
      isAuthenticated: true,
      currentLanguage: customData.currentLanguage || 'French',
      targetLanguage: customData.targetLanguage || 'fr-FR',
      learningGoal: customData.learningGoal || 'travel',
      experienceLevel: customData.experienceLevel || 'beginner',
      dailyCommitmentMinutes: customData.dailyCommitmentMinutes || 20,
      currentLevelNumber: customData.currentLevelNumber || 1,
      currentUnitId: customData.currentUnitId || 'u1',
      dailyGoal: {
        targetXp: customData.dailyGoal?.targetXp || (customData.dailyCommitmentMinutes === 15 ? 20 : customData.dailyCommitmentMinutes === 30 ? 50 : 35),
        currentXp: 0,
        completed: false
      },
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
      soundEnabled: true,
      hapticsEnabled: true,
      slowAudioDefault: false
    };

    storageService.saveProfile(newProfile);
    setProfile(newProfile);
    soundService.playLevelUnlock();
    firebaseService.syncUserProfileToCloud(newProfile);
  };

  const logout = () => {
    storageService.logout();
    firebaseService.signOut();
    setProfile((prev) => ({ ...prev, isAuthenticated: false }));
  };

  const addXp = (amount: number) => {
    setProfile((prev) => {
      const newXp = prev.stats.totalXp + amount;
      const newDailyXp = prev.dailyGoal.currentXp + amount;
      const goalCompleted = newDailyXp >= prev.dailyGoal.targetXp;

      const updated: UserProfile = {
        ...prev,
        stats: {
          ...prev.stats,
          totalXp: newXp
        },
        dailyGoal: {
          ...prev.dailyGoal,
          currentXp: newDailyXp,
          completed: goalCompleted
        }
      };
      storageService.saveProfile(updated);
      return updated;
    });
  };

  const incrementStreak = () => {
    setProfile((prev) => {
      const today = new Date().toISOString().split('T')[0];
      if (prev.streak.lastActiveDate === today) return prev;

      const newStreak = prev.streak.currentStreak + 1;
      const updated: UserProfile = {
        ...prev,
        streak: {
          ...prev.streak,
          currentStreak: newStreak,
          longestStreak: Math.max(prev.streak.longestStreak, newStreak),
          lastActiveDate: today
        }
      };
      storageService.saveProfile(updated);
      return updated;
    });
  };

  const updateSettings = (settings: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...settings };
      storageService.saveProfile(updated);
      return updated;
    });
  };

  const resetProgress = () => {
    storageService.resetAll();
    setProfile(INITIAL_UNAUTHENTICATED_PROFILE);
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        isAuthenticated: profile.isAuthenticated,
        theme,
        toggleTheme,
        setTheme,
        login,
        register,
        logout,
        addXp,
        incrementStreak,
        updateSettings,
        resetProgress
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
