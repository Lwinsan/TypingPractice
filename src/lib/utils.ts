
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateWPM(chars: number, milliseconds: number) {
  if (milliseconds === 0) return 0;
  const minutes = milliseconds / 60000;
  const words = chars / 5; // Standard: 5 chars = 1 word
  return Math.round(words / minutes);
}

export function calculateAccuracy(total: number, errors: number) {
  if (total === 0) return 100;
  return Math.round(((total - errors) / total) * 100);
}

export function generatePracticeText(unlockedKeys: string[], wordCount: number = 20) {
  if (unlockedKeys.length === 0) return "loading";
  
  const words = [];
  const latestKey = unlockedKeys[unlockedKeys.length - 1];
  
  for (let i = 0; i < wordCount; i++) {
    const wordLength = Math.floor(Math.random() * 5) + 3; // 3-8 chars
    let word = '';
    for (let j = 0; j < wordLength; j++) {
      // 40% chance to use the latest key for better practice
      if (Math.random() < 0.4) {
        word += latestKey;
      } else {
        word += unlockedKeys[Math.floor(Math.random() * unlockedKeys.length)];
      }
    }
    words.push(word);
  }
  return words.join(' ');
}
