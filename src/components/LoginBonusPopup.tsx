import React from 'react';
import { motion } from 'motion/react';
import { Gift, Calendar, Star } from 'lucide-react';

interface LoginBonusPopupProps {
  record: {
    consecutive_days: number;
    total_days: number;
  };
  reward: {
    type: string;
    amount: number;
  };
  onClose: () => void;
}

export function LoginBonusPopup({ record, reward, onClose }: LoginBonusPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-blue-500 to-indigo-800 rounded-2xl border-4 border-yellow-400 p-6 max-w-sm w-full shadow-[0_0_30px_rgba(250,204,21,0.5)] text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] italic tracking-wider mb-2">
            LOGIN BONUS!
          </h2>
          
          <div className="bg-black/40 rounded-xl p-4 mb-6 border border-white/20">
            <div className="flex justify-center gap-8 mb-4">
              <div className="text-center">
                <div className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">Consecutive</div>
                <div className="text-3xl font-black text-white flex items-center justify-center gap-1">
                  {record.consecutive_days} <span className="text-sm">Days</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">Total</div>
                <div className="text-3xl font-black text-white flex items-center justify-center gap-1">
                  {record.total_days} <span className="text-sm">Days</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4">
              <div className="text-yellow-300 text-sm font-bold mb-2">Today's Reward</div>
              <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-lg border border-yellow-500/50">
                {reward.type === 'jewels' ? (
                  <Star className="text-yellow-400 drop-shadow-md" size={32} fill="currentColor" />
                ) : (
                  <Gift className="text-pink-400 drop-shadow-md" size={32} fill="currentColor" />
                )}
                <div className="text-2xl font-black text-white">
                  {reward.type === 'jewels' ? 'Star Jewels' : 'Coins'} x{reward.amount}
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black italic tracking-wider px-8 py-3 rounded-full shadow-lg hover:brightness-110 w-full text-lg border-2 border-yellow-200"
          >
            CLAIM REWARD
          </button>
        </div>
      </motion.div>
    </div>
  );
}
