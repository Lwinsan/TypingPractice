
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTyping } from '../hooks/useTyping';
import { Language, TypingStats } from '../types';
import { RefreshCw, Zap, Target, Clock } from 'lucide-react';

interface TypingEngineProps {
  targetText: string;
  language: Language;
  onComplete: (stats: TypingStats) => void;
  onNext: () => void;
  fontSize?: number;
  maxWidth?: number;
}

export function TypingEngine({ 
  targetText, 
  language, 
  onComplete, 
  onNext,
  fontSize = 32,
  maxWidth = 1000
}: TypingEngineProps) {
  const { userInput, cursorIndex, errorCount, isFinished, handleInput, reset, getStats, startTime } = useTyping(targetText, language);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    reset();
  }, [targetText, reset]);

  useEffect(() => {
    if (isFinished) {
      onComplete(getStats());
    }
  }, [isFinished, onComplete, getStats]);

  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    window.addEventListener('click', handleClick);
    inputRef.current?.focus();
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.length === 1) {
      handleInput(e.key);
    }
  };

  const getAccuracy = () => {
    if (cursorIndex === 0) return 100;
    return Math.round(((cursorIndex - errorCount) / cursorIndex) * 100);
  };

  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const currentWpm = startTime ? Math.round((cursorIndex / 5) / (elapsed / 60)) : 0;

  return (
    <div className="flex flex-col gap-10 w-full mx-auto p-4 transition-all duration-300" style={{ maxWidth: `${maxWidth}px` }}>
      {/* Real-time Metrics in keybr style */}
      <div className="flex justify-center gap-8 text-xs font-medium text-slate-400">
        <div className="flex items-center gap-2">
          <span>Speed: <span className="text-slate-900 dark:text-white font-bold">{currentWpm || 0} wpm</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span>Accuracy: <span className="text-slate-900 dark:text-white font-bold">{getAccuracy()}%</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span>Time: <span className="text-slate-900 dark:text-white font-bold">{elapsed.toFixed(0)}s</span></span>
        </div>
      </div>

      {/* Typing Area - Minimal Floating */}
      <div className="relative py-12 px-6 overflow-hidden group">
        <input
          ref={inputRef}
          type="text"
          className="absolute inset-0 opacity-0 cursor-default"
          onKeyDown={handleKeyDown}
          autoFocus
        />
        
        <div 
          className={cn(
            "leading-relaxed text-left break-words tracking-tight",
            language === 'myanmar' ? "myanmar-typing-font" : "typing-font"
          )}
          style={{ fontSize: `${fontSize}px` }}
        >
          {targetText.split('').map((char, i) => {
            let status = 'pending';
            if (i < cursorIndex) {
              status = 'correct';
            } else if (i === cursorIndex) {
              status = 'cursor';
            }

            return (
              <span
                key={i}
                className={cn(
                  "relative transition-all duration-75 rounded-sm",
                  status === 'correct' ? "text-slate-800 dark:text-slate-200" : "text-slate-300 dark:text-slate-700",
                  status === 'cursor' && "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 animate-pulse"
                )}
              >
                {char === ' ' ? '·' : char}
              </span>
            );
          })}
        </div>

        {/* Focus indicator */}
        <div className="absolute top-4 right-6 text-[10px] font-bold uppercase tracking-widest text-slate-300 pointer-events-none">
          Click to Refocus
        </div>

        {/* Completion Overlay */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-indigo-600/95 backdrop-blur-md text-white"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <h2 className="text-5xl font-black tracking-tighter">Excellent!</h2>
                <p className="text-indigo-100 font-medium italic">You've mastered this sequence.</p>
                <button
                  onClick={() => { reset(); onNext(); }}
                  className="flex items-center gap-3 px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform"
                >
                  <RefreshCw className="h-6 w-6" />
                  NEXT LEVEL
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
