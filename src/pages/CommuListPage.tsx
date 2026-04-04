import React from 'react';
import { ChevronLeft, Lock, CheckCircle, Play } from 'lucide-react';
import { motion } from 'motion/react';

export function CommuListPage({ onNavigate, type, commus }: { onNavigate: (page: string, params?: any) => void, type: string, commus: any[] }) {
  const getTitle = () => {
    switch(type) {
      case 'story': return 'MAIN STORY';
      case 'idol': return 'IDOL COMMU';
      case 'event': return 'EVENT COMMU';
      case 'special': return 'SPECIAL COMMU';
      default: return 'COMMUNICATION';
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-slate-900 overflow-hidden flex flex-col font-sans text-slate-100">
      <header className="flex items-center justify-between bg-gradient-to-b from-teal-600 to-teal-800 p-3 border-b-2 border-teal-400 shadow-md z-10">
        <button onClick={() => onNavigate('commu')} className="p-1 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-black text-white drop-shadow-md italic tracking-wider">
          {getTitle()}
        </h1>
        <div className="w-8"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {commus.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">No commus available in this category.</div>
        ) : (
          commus.map((commu, idx) => (
            <motion.div 
              key={commu.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-lg border p-3 flex items-center gap-3 ${commu.is_unlocked ? 'bg-slate-800 border-slate-600 cursor-pointer hover:bg-slate-700' : 'bg-slate-900 border-slate-800 opacity-70'}`}
              onClick={() => {
                if (commu.is_unlocked) {
                  onNavigate('commu_reader', { commu });
                }
              }}
            >
              <div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center shrink-0">
                {commu.is_unlocked ? (
                  commu.is_read ? <CheckCircle className="text-green-400" /> : <Play className="text-teal-400 ml-1" />
                ) : (
                  <Lock className="text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold truncate ${commu.is_unlocked ? 'text-white' : 'text-slate-500'}`}>{commu.title}</h3>
                <div className="text-xs text-slate-400 mt-1">
                  {commu.is_unlocked ? (
                    <span className="text-yellow-400">Reward: {commu.reward_amount} {commu.reward_type}</span>
                  ) : (
                    <span>Unlock: {commu.unlock_condition}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
