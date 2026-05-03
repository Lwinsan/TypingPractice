
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
}

export function TypingEngine({ targetText, language, onComplete, onNext }: TypingEngineProps) {
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
    <div className="flex flex-col gap-10 w-full max-w-4xl mx-auto p-4">
      {/* Real-time floating stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-widest">WPM</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{currentWpm || 0}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-widest">Accuracy</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{getAccuracy()}%</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-widest">Time</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{elapsed.toFixed(0)}s</p>
        </div>
      </div>

      {/* Typing Area */}
      <div className="relative p-12 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group">
        <input
          ref={inputRef}
          type="text"
          className="absolute inset-0 opacity-0 cursor-default"
          onKeyDown={handleKeyDown}
          autoFocus
        />
        
        <div className={cn(
          "text-3xl md:text-5xl leading-relaxed text-center break-words tracking-tight",
          language === 'myanmar' ? "myanmar-typing-font" : "typing-font"
        )}>
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
                  "relative transition-all duration-150 rounded-sm px-[2px]",
                  status === 'correct' ? "text-slate-900 dark:text-slate-100 font-medium" : "text-slate-200 dark:text-slate-800 font-light",
                  status === 'cursor' && "text-indigo-600 dark:text-indigo-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-indigo-600 shadow-[0_4px_12px_rgba(79,70,229,0.1)]"
                )}
              >
                {char}
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
