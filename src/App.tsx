
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TypingEngine } from './components/TypingEngine';
import { Keyboard } from './components/Keyboard';
import { useStorage } from './hooks/useStorage';
import { MYANMAR_PHRASES, ENGLISH_PHRASES, BADGES, LEARNING_SEQUENCES } from './constants';
import { Language, TypingStats } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, TrendingUp, Zap, Target, Flame, ChevronRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn, generatePracticeText } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('practice');
  const [language, setLanguage] = useState<Language>('english');
  const [difficulty, setDifficulty] = useState('medium');
  const { progress, saveStats, checkMasteryAndUnlock } = useStorage();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const [fontSize, setFontSize] = useState(32);
  const [maxWidth, setMaxWidth] = useState(1000);

  const [customText, setCustomText] = useState('');
  const [mode, setMode] = useState<'learn' | 'phrase' | 'custom'>('learn');

  const phrases = useMemo(() => {
    if (mode === 'custom' && customText.length > 5) return [customText];
    if (mode === 'phrase') return language === 'english' ? ENGLISH_PHRASES : MYANMAR_PHRASES;
    
    // Learning mode - generate text from unlocked keys
    const unlocked = progress?.unlockedKeys?.[language] || [];
    return [generatePracticeText(unlocked)];
  }, [mode, customText, language, progress?.unlockedKeys]);

  const currentText = phrases[currentTextIndex % phrases.length];

  const handleComplete = (stats: TypingStats) => {
    saveStats(stats);
    
    // Unlock logic based on mastery performance
    if (mode === 'learn') {
      checkMasteryAndUnlock(language, stats);
    }

    if (stats.wpm > 80 || stats.accuracy === 100) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    setCurrentTextIndex(prev => prev + 1);
  };

  const currentLevelInfo = useMemo(() => {
    const nextLevelPoints = Math.pow(progress.level, 2) * 100;
    const progressPercent = (progress.totalPoints / nextLevelPoints) * 100;
    return { nextLevelPoints, progressPercent };
  }, [progress.level, progress.totalPoints]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Floating Headers (Keybr Style) */}
        <div className="sticky top-0 z-10 px-8 py-4 flex justify-between items-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Size</span>
                <input 
                  type="range" min="16" max="64" value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-24 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Width</span>
                <input 
                  type="range" min="600" max="1400" value={maxWidth} 
                  onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                  className="w-24 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Daily Goal</span>
                <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1">
                  <div className="h-full bg-indigo-600 rounded-full w-1/3" />
                </div>
              </div>
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm group-hover:bg-slate-300 transition-colors">
                   <Target className="h-5 w-5 text-slate-500" />
                </div>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Sign-In</span>
              </button>
           </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 md:p-10">
          
          {activeTab === 'practice' && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">All Keys Status</h3>
                     <span className="text-[10px] font-bold text-indigo-600">{progress?.unlockedKeys?.[language]?.length} Mastered</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {LEARNING_SEQUENCES[language].map((key, i) => {
                      const isUnlocked = progress?.unlockedKeys?.[language]?.includes(key);
                      const isNext = !isUnlocked && (i === 0 || progress?.unlockedKeys?.[language]?.includes(LEARNING_SEQUENCES[language][i-1]));
                      
                      return (
                        <div 
                          key={i}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center rounded text-[10px] font-black transition-all border",
                            isUnlocked 
                                ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border-emerald-100" 
                                : isNext
                                ? "bg-white border-2 border-indigo-600 text-indigo-600 scale-125 z-10 shadow-lg shadow-indigo-100 animate-pulse"
                                : "bg-slate-50 dark:bg-slate-900/50 text-slate-300 border-transparent"
                          )}
                        >
                          {key}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-center gap-4">
                  <button onClick={() => setLanguage('english')} className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", language === 'english' ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500")}>English</button>
                  <button onClick={() => setLanguage('myanmar')} className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", language === 'myanmar' ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500")}>Myanmar</button>
                </div>

                <div className="flex justify-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-fit mx-auto">
                  {(['learn', 'phrase', 'custom'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={cn(
                        "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                        mode === m ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <TypingEngine 
                  targetText={currentText} 
                  language={language}
                  onComplete={handleComplete}
                  onNext={handleNext}
                  fontSize={fontSize}
                  maxWidth={maxWidth}
                />

                {mode === 'custom' && (
                  <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
                    <textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Paste your custom text here to practice (min 10 characters)..."
                      className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <Keyboard language={language} nextKey={currentText[0]} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={Zap} label="Average WPM" value={Math.round(progress.statsHistory.reduce((acc, s) => acc + s.wpm, 0) / (progress.statsHistory.length || 1))} color="text-yellow-500" />
                <StatCard icon={Target} label="High Accuracy" value={Math.max(...progress.statsHistory.map(s => s.accuracy), 0) + '%'} color="text-blue-500" />
                <StatCard icon={TrendingUp} label="Total Words" value={Math.round(progress.statsHistory.reduce((acc, s) => acc + s.totalChars, 0) / 5)} color="text-green-500" />
                <StatCard icon={Flame} label="Daily Streak" value={progress.dailyStreak + " Days"} color="text-orange-500" />
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-lg font-bold mb-6">WPM Progress History</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progress.statsHistory.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                      <XAxis dataKey="timestamp" tick={false} />
                      <YAxis stroke="#71717a" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                        itemStyle={{ color: '#3b82f6' }}
                      />
                      <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                    K
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-950 font-bold px-3 py-1 rounded-full text-xs shadow-lg border-2 border-white dark:border-zinc-950">
                    LVL {progress.level}
                  </div>
                </div>
                <h2 className="text-2xl font-bold">Kyaw Wai Lwin</h2>
                <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500" 
                    style={{ width: `${currentLevelInfo.progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{progress.totalPoints} / {currentLevelInfo.nextLevelPoints} Points to Level {progress.level + 1}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Unlocked Badges
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {BADGES.map((badge) => {
                    const isUnlocked = progress.badges.includes(badge.id);
                    return (
                      <div 
                        key={badge.id}
                        className={cn(
                          "p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all",
                          isUnlocked 
                            ? "bg-white dark:bg-zinc-900 border-yellow-200 dark:border-yellow-900/30 shadow-sm" 
                            : "bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-900 grayscale opacity-50"
                        )}
                      >
                        <span className="text-3xl">{badge.icon}</span>
                        <h4 className="font-bold text-sm">{badge.name}</h4>
                        <p className="text-[10px] text-gray-500">{badge.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Local Records</h2>
                <p className="text-gray-500">Your personal bests across different categories.</p>
              </div>

              <div className="overflow-hidden bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-950/50">
                      <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Language</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider text-right">WPM</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider text-right">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {progress.statsHistory.sort((a, b) => b.wpm - a.wpm).slice(0, 10).map((stat, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-950/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(stat.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold uppercase",
                            stat.language === 'english' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            {stat.language}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right">{stat.wpm}</td>
                        <td className="px-6 py-4 text-sm font-medium text-right text-green-500">{stat.accuracy}%</td>
                      </tr>
                    ))}
                    {progress.statsHistory.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                          No records yet. Start practicing!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-bold">
                  <Flame className="h-4 w-4" />
                  {progress.dailyStreak} Day Streak
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight">Daily Challenge</h2>
                <p className="text-gray-500">Complete today's exclusive phrase to earn bonus points and maintain your streak.</p>
              </div>

              {progress.lastDailyChallenge === new Date().toDateString() ? (
                <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm space-y-6">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold">Challenge Completed!</h3>
                  <p className="text-gray-500">You've earned your points for today. Come back tomorrow for a new challenge!</p>
                  <button 
                    onClick={() => setActiveTab('stats')}
                    className="px-8 py-3 bg-gray-100 dark:bg-zinc-800 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    View Stats
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  <TypingEngine 
                    targetText={ENGLISH_PHRASES[new Date().getDate() % ENGLISH_PHRASES.length]} 
                    language="english"
                    onComplete={(stats) => handleComplete({ ...stats, mode: 'daily' })}
                    onNext={() => setActiveTab('stats')}
                  />
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Rewards</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      <li>• +500 Bonus Points</li>
                      <li>• +1 Day Streak</li>
                      <li>• Milestone progress towards "Daily Warrior" badge</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-zinc-900 rounded-full">
                <Award className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Coming Soon</h3>
                <p className="text-gray-500">We're working hard to bring the {activeTab} feature to you!</p>
              </div>
              <button 
                onClick={() => setActiveTab('practice')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                Back to Practice
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 items-center text-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", color)} />
        <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
      </div>
    </div>
  );
}
