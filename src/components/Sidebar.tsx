
import React from 'react';
import { Home, BarChart2, Award, Settings, Zap, History, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'practice', icon: Zap, label: 'Practice' },
    { id: 'daily', icon: BarChart2, label: 'Daily Challenge' },
    { id: 'leaderboard', icon: Award, label: 'Leaderboard' },
    { id: 'stats', icon: History, label: 'Statistics' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-16 md:w-64 h-full border-r border-gray-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-950">
      <div className="p-6 hidden md:block">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TypingMaster
        </h1>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center group px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === item.id
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-zinc-200"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 md:mr-3",
              activeTab === item.id ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500"
            )} />
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-zinc-800 text-center md:text-left">
        <div className="flex items-center space-x-2 md:space-x-3 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
            K
          </div>
          <div className="hidden md:block overflow-hidden">
            <p className="text-sm font-medium truncate">Kyaw Wai Lwin</p>
            <p className="text-xs text-gray-400 truncate">Pro Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}
