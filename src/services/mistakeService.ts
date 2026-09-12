// FLUENTRA Mistakes Tracking & Spaced Repetition Service
import { Exercise } from '../types/curriculum';

export interface UserMistake {
  id: string;
  unitId: string;
  language: string;
  exercise: Exercise;
  userAnswer?: string;
  timestamp: number;
}

const STORAGE_KEY_MISTAKES = 'fluentra_user_mistakes';

class MistakeService {
  private getAll(): UserMistake[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_MISTAKES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load mistakes from storage:', e);
    }
    return [];
  }

  private saveAll(mistakes: UserMistake[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_MISTAKES, JSON.stringify(mistakes));
    } catch (e) {
      console.warn('Failed to save mistakes to storage:', e);
    }
  }

  public getMistakes(language?: string): UserMistake[] {
    const all = this.getAll();
    if (!language) return all;
    return all.filter((m) => m.language.toLowerCase() === language.toLowerCase());
  }

  public addMistake(entry: {
    unitId: string;
    language: string;
    exercise: Exercise;
    userAnswer?: string;
  }): void {
    const all = this.getAll();
    // Avoid duplicate entries for the exact same exercise
    const exists = all.some(
      (m) =>
        m.exercise.id === entry.exercise.id &&
        m.language.toLowerCase() === entry.language.toLowerCase()
    );

    if (exists) return;

    const newMistake: UserMistake = {
      id: `mistake-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      unitId: entry.unitId,
      language: entry.language,
      exercise: entry.exercise,
      userAnswer: entry.userAnswer,
      timestamp: Date.now()
    };

    all.unshift(newMistake);
    // Keep up to 50 mistakes
    this.saveAll(all.slice(0, 50));
  }

  public resolveMistake(id: string): void {
    const all = this.getAll();
    const updated = all.filter((m) => m.id !== id);
    this.saveAll(updated);
  }

  public clearAll(language?: string): void {
    if (!language) {
      this.saveAll([]);
      return;
    }
    const remaining = this.getAll().filter(
      (m) => m.language.toLowerCase() !== language.toLowerCase()
    );
    this.saveAll(remaining);
  }
}

export const mistakeService = new MistakeService();
