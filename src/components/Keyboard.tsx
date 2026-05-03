
import React from 'react';
import { cn } from '../lib/utils';
import { KEYBOARD_LAYOUTS } from '../constants';

interface KeyboardProps {
  language: 'myanmar' | 'english';
  activeKey?: string;
  nextKey?: string;
}

export function Keyboard({ language, activeKey, nextKey }: KeyboardProps) {
  const layout = language === 'english' ? KEYBOARD_LAYOUTS.english : KEYBOARD_LAYOUTS.myanmar;

  return (
    <div className="flex flex-col gap-1 select-none pointer-events-none p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm max-w-2xl mx-auto">
      {layout.rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map((key) => {
            const isNext = key.toLowerCase() === nextKey?.toLowerCase();
            const isActive = key.toLowerCase() === activeKey?.toLowerCase();
            
            return (
              <div
                key={key}
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg border transition-all duration-100",
                  "text-sm md:text-base font-medium uppercase",
                  isNext 
                    ? "bg-indigo-50 border-indigo-400 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400 scale-110 z-10 shadow-lg shadow-indigo-200/50" 
                    : isActive
                    ? "bg-indigo-600 border-indigo-700 text-white shadow-inner"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-sm"
                )}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex justify-center mt-1">
        <div className={cn(
          "w-48 h-10 md:h-12 rounded-lg border flex items-center justify-center text-[10px] font-bold tracking-widest text-slate-400 transition-colors uppercase",
          nextKey === ' ' ? "bg-indigo-50 border-indigo-400 text-indigo-700" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        )}>
          Space
        </div>
      </div>
    </div>
  );
}
