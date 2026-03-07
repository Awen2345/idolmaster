import React from 'react';
import { motion } from 'motion/react';

interface RewardPopupProps {
  rewards: { exp: number; money: number; fans: number };
  onClose: () => void;
}

export function RewardPopup({ rewards, onClose }: RewardPopupProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border-2 border-pink-500 rounded-xl p-6 w-full max-w-sm text-center shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-pink-400 mb-4 italic">Work Complete!</h2>
        
        <div className="space-y-3 mb-6">
          <div className="bg-slate-700 rounded-lg p-3 flex justify-between items-center border border-slate-600">
            <span className="text-slate-300 font-bold">EXP</span>
            <span className="text-green-400 font-black">+{rewards.exp}</span>
          </div>
          <div className="bg-slate-700 rounded-lg p-3 flex justify-between items-center border border-slate-600">
            <span className="text-slate-300 font-bold">Money</span>
            <span className="text-yellow-400 font-black">+{rewards.money}</span>
          </div>
          <div className="bg-slate-700 rounded-lg p-3 flex justify-between items-center border border-slate-600">
            <span className="text-slate-300 font-bold">Fans</span>
            <span className="text-blue-400 font-black">+{rewards.fans}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          OK
        </button>
      </motion.div>
    </div>
  );
}
