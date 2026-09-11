// FLUENTRA Conversation & Roleplay Types

export interface ConversationTurn {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  translation?: string;
  audioText?: string;
  timestamp: string;
  pronunciationScore?: number;
}

export interface ConversationScenario {
  id: string;
  title: string;
  category: 'daily' | 'dining' | 'travel' | 'work' | 'social' | 'debate';
  minLevelNumber: number; // minimum level required to unlock (1 to 8)
  description: string;
  aiRole: string;
  userRole: string;
  initialAiMessage: string;
  suggestedUserStarters: string[];
  learningObjectives: string[];
}

export interface ConversationReview {
  scenarioId: string;
  totalTurns: number;
  communicationScore: number; // 0 - 100
  pronunciationScore: number; // 0 - 100
  vocabularyScore: number;    // 0 - 100
  grammarScore: number;       // 0 - 100
  fluencyScore: number;       // 0 - 100
  overallScore: number;       // 0 - 100
  strengths: string[];
  growthAreas: string[];
  newVocabulary: { word: string; translation: string; example: string }[];
  xpEarned: number;
}
