
import { useState, useEffect } from 'react';
import { UserProgress, TypingStats, Language } from '../types';
import { INITIAL_UNLOCKED, LEARNING_SEQUENCES } from '../constants';

const STORAGE_KEY = 'typing_master_progress';

const INITIAL_PROGRESS: UserProgress = {
  statsHistory: [],
  totalPoints: 0,
  badges: [],
  level: 1,
  dailyStreak: 0,
  unlockedKeys: INITIAL_UNLOCKED,
};

export function useStorage() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const data: UserProgress = saved 
      ? { ...INITIAL_PROGRESS, ...JSON.parse(saved) } 
      : INITIAL_PROGRESS;

    // Deep merge for unlockedKeys if it exists in saved data but might be incomplete
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.unlockedKeys) {
        data.unlockedKeys = {
          ...INITIAL_PROGRESS.unlockedKeys,
          ...parsed.unlockedKeys
        };
      }
    }
    
    // Check streak
    const lastChallenge = data.lastDailyChallenge ? new Date(data.lastDailyChallenge) : null;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (lastChallenge) {
      const diffTime = Math.abs(today.getTime() - lastChallenge.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        data.dailyStreak = 0;
      }
    }

    return data;
  });

  const saveStats = (stats: TypingStats) => {
    setProgress(prev => {
      const newHistory = [...prev.statsHistory, stats];
      let newPoints = prev.totalPoints + Math.round((stats.wpm * stats.accuracy) / 10);
      let newStreak = prev.dailyStreak;
      let lastDaily = prev.lastDailyChallenge;

      if (stats.mode === 'daily') {
        const today = new Date().toDateString();
        if (lastDaily !== today) {
          newStreak += 1;
          newPoints += 500; // Bonus for daily
          lastDaily = today;
        }
      }

      const newLevel = Math.floor(Math.sqrt(newPoints / 100)) + 1;
      const newBadges = [...prev.badges];
      if (stats.wpm >= 60 && !newBadges.includes('speed_demon')) newBadges.push('speed_demon');
      if (stats.accuracy === 100 && !newBadges.includes('perfect_accuracy')) newBadges.push('perfect_accuracy');
      if (newHistory.length === 1 && !newBadges.includes('first_run')) newBadges.push('first_run');
      if (newStreak >= 7 && !newBadges.includes('daily_warrior')) newBadges.push('daily_warrior');

      const newState = {
        ...prev,
        statsHistory: newHistory,
        totalPoints: newPoints,
        level: newLevel,
        badges: newBadges,
        dailyStreak: newStreak,
        lastDailyChallenge: lastDaily,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  const unlockNextKey = (language: Language) => {
    setProgress(prev => {
      const current = prev.unlockedKeys[language];
      const fullSequence = LEARNING_SEQUENCES[language];
      if (current.length >= fullSequence.length) return prev;

      const nextKey = fullSequence[current.length];
      const newState = {
        ...prev,
        unlockedKeys: {
          ...prev.unlockedKeys,
          [language]: [...current, nextKey]
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  return { progress, saveStats, unlockNextKey };
}
