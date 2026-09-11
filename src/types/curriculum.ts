// FLUENTRA Curriculum Type Definitions

export type UnitStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';

export type ExerciseType = 
  | 'multiple_choice'
  | 'sentence_order'
  | 'match_pairs'
  | 'fill_blank'
  | 'listening'
  | 'speaking'
  | 'conversation_turn';

export interface ExerciseOption {
  id: string;
  text: string;
  translation?: string;
  audioText?: string;
  imageUrl?: string;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  targetText?: string;
  audioText?: string;
  phoneticHint?: string;
  translation?: string;
  options?: ExerciseOption[];
  correctOptionId?: string;
  correctOrder?: string[];
  correctText?: string;
  matchPairs?: MatchPair[];
  explanation?: string;
  xpReward: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  exercises: Exercise[];
}

export interface UnitMetadata {
  id: string;
  number: number; // 1 to 800
  levelNumber: number; // 1 to 8
  stageNumber: number; // 1 to 10
  title: string;
  subtitle: string;
  cefrLevel: string; // A1, A2, B1, B2, C1, C2
  category: string;
  lessonCount: number;
  requiredXp: number;
  requiredUnlockUnitId?: string;
}

export interface Stage {
  number: number; // 1 to 10
  title: string;
  description: string;
  unitRange: [number, number]; // e.g. [1, 10]
  unitIds: string[];
}

export interface Level {
  id: string;
  number: number; // 1 to 8
  name: string;
  tagline: string;
  description: string;
  color: string;
  totalUnits: number; // 100
  stages: Stage[];
}
