
import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateWPM, calculateAccuracy } from '../lib/utils';
import { TypingStats, Language } from '../types';

export function useTyping(targetText: string, language: Language) {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [cursorIndex, setCursorIndex] = useState(0);

  // Keep track of characters typed correctly for WPM
  const correctCharsRef = useRef(0);

  const reset = useCallback((newText?: string) => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setErrorCount(0);
    setIsFinished(false);
    setCursorIndex(0);
    correctCharsRef.current = 0;
  }, []);

  const handleInput = useCallback((char: string) => {
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const expectedChar = targetText[cursorIndex];

    if (char === expectedChar) {
      setUserInput(prev => prev + char);
      setCursorIndex(prev => prev + 1);
      correctCharsRef.current += 1;
    } else {
      setErrorCount(prev => prev + 1);
      // We don't advance cursor on error in this implementation (strict mode)
      // or we can allow errors but highlight them. 
      // Traditional speed tests often allow errors and move on.
      // Let's go with "strict mode" for now: must type correct char to advance
      // BUT for actual feedback, maybe we should track the typed char even if wrong.
    }

    if (cursorIndex + 1 === targetText.length && char === expectedChar) {
      setEndTime(Date.now());
      setIsFinished(true);
    }
  }, [cursorIndex, targetText, isFinished, startTime]);

  // Handle backspace or other keys if needed
  // For this simple version, let's just listen to window keydown in the component

  const getStats = useCallback((): TypingStats => {
    const duration = endTime && startTime ? endTime - startTime : 0;
    return {
      wpm: calculateWPM(correctCharsRef.current, duration),
      accuracy: calculateAccuracy(cursorIndex + errorCount, errorCount),
      totalChars: cursorIndex,
      errorCount,
      timestamp: Date.now(),
      language,
      mode: 'practice',
    };
  }, [endTime, startTime, cursorIndex, errorCount, language]);

  return {
    userInput,
    cursorIndex,
    errorCount,
    isFinished,
    handleInput,
    reset,
    getStats,
    startTime,
    endTime,
  };
}
