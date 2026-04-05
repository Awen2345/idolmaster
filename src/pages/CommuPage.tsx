import React, { useState } from 'react';
import { ChevronLeft, BookOpen, User, Calendar, Star, PlayCircle, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export function CommuPage({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [activeTab, setActiveTab] = useState<'story' | 'idol' | 'event' | 'special'>('story');

  const tabs = [
    { id: 'story', label: 'Main Story', icon: <BookOpen size={20} />, color: 'from-blue-500 to-indigo-600' },
    { id: 'idol', label: 'Idol Commu', icon: <User size={20} />, color: 'from-pink-500 to-rose-600' },
    { id: 'event', label: 'Event Commu', icon: <Calendar size={20} />, color: 'from-yellow-500 to-orange-600' },
    { id: 'special', label: 'Special', icon: <Star size={20} />, color: 'from-purple-500 to-fuchsia-600' },
  ] as const;

  const mockEpisodes = {
    story: [
      { id: 'story_1', title: 'Episode 1: A New Beginning', unlocked: true, isNew: false },
      { id: 'story_2', title: 'Episode 2: First Step', unlocked: true, isNew: true },
      { id: 'story_3', title: 'Episode 3: The Rival Appears', unlocked: false, isNew: false },
    ],
    idol: [
      { id: 'idol_rin_1', title: 'Shibuya Rin: Episode 1', unlocked: true, isNew: false },
      { id: 'idol_uzuki_1', title: 'Shimamura Uzuki: Episode 1', unlocked: true, isNew: true },
    ],
    event: [
      { id: 'event_tour_1', title: 'Production Match: Prologue', unlocked: true, isNew: false },
    ],
    special: [
      { id: 'special_anniv_1', title: '1st Anniversary Special', unlocked: true, isNew: false },
    ]
  };

  const currentEpisodes = mockEpisodes[activeTab];

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-slate-900 overflow-hidden flex flex-col font-sans text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-gradient-to-b from-indigo-600 to-purple-800 p-3 border-b-2 border-indigo-400 shadow-md z-10">
        <button onClick={() => onNavigate('main')} className="p-1 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-black text-white drop-shadow-md italic tracking-wider flex items-center gap-2">
          <BookOpen size={20} />
          COMMUNICATIONS
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-800 p-2 gap-2 overflow-x-auto no-scrollbar border-b border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[80px] ${
              activeTab === tab.id 
                ? `bg-gradient-to-b ${tab.color} shadow-inner border border-white/30` 
                : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <div className="mb-1">{tab.icon}</div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Episode List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {currentEpisodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <BookOpen size={48} className="mb-4 opacity-50" />
            <p>No episodes available.</p>
          </div>
        ) : (
          currentEpisodes.map((ep, idx) => (
            <motion.div 
              key={ep.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative rounded-xl border-2 overflow-hidden ${
                ep.unlocked 
                  ? 'bg-slate-800 border-slate-600 cursor-pointer hover:border-indigo-400' 
                  : 'bg-slate-900 border-slate-800 opacity-70'
              }`}
              onClick={() => ep.unlocked && onNavigate('story_player', { episodeId: ep.id })}
            >
              <div className="flex items-center p-3 gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  ep.unlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-600'
                }`}>
                  {ep.unlocked ? <PlayCircle size={28} /> : <Lock size={24} />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${ep.unlocked ? 'text-white' : 'text-slate-500'}`}>
                    {ep.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">
                    {ep.unlocked ? 'Read Story' : 'Locked'}
                  </div>
                </div>
                {ep.isNew && (
                  <div className="absolute top-2 right-2 bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                    NEW
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
