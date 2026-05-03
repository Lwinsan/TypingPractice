
export type Language = 'myanmar' | 'english';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  totalChars: number;
  errorCount: number;
  timestamp: number;
  language: Language;
  mode: 'practice' | 'test' | 'daily' | 'custom';
}

export interface UserProgress {
  statsHistory: TypingStats[];
  totalPoints: number;
  badges: string[];
  level: number;
  dailyStreak: number;
  lastDailyChallenge?: string; // date string
  unlockedKeys: {
    english: string[];
    myanmar: string[];
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface LeaderboardEntry {
  username: string;
  wpm: number;
  accuracy: number;
  language: Language;
  timestamp: number;
}
