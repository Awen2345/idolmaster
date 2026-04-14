import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FastForward, Star, Crown } from 'lucide-react';

interface LoginBonusPopupProps {
  record: {
    consecutive_days: number;
    total_days: number;
  };
  reward?: {
    type: string;
    amount: number;
  };
  onClose: () => void;
  isViewing?: boolean;
}

export function LoginBonusPopup({ record, reward, onClose, isViewing = false }: LoginBonusPopupProps) {
  const [showStamp, setShowStamp] = useState(isViewing);
  
  const cycleDay = record.consecutive_days === 0 ? 0 : (record.consecutive_days % 7 === 0 ? 7 : record.consecutive_days % 7);

  useEffect(() => {
    if (!isViewing && cycleDay > 0) {
      // Animate the stamp appearing after a short delay
      const timer = setTimeout(() => {
        setShowStamp(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isViewing, cycleDay]);

  const renderItem = (day: number) => {
    // If viewing, we only show stamps for days strictly less than or equal to the current cycle day
    // If consecutive_days is 0, cycleDay is 0, so day <= 0 is false (no stamps).
    const isClaimed = isViewing ? day <= cycleDay : (day < cycleDay || (day === cycleDay && showStamp));
    const isToday = !isViewing && day === cycleDay;
    
    let content = null;
    if (day <= 5) {
      content = (
        <div className="flex flex-col items-center justify-center h-full">
          <Star className="text-blue-400 drop-shadow-sm mb-1" size={32} fill="currentColor" />
          <span className="text-blue-600 font-bold text-sm">50</span>
        </div>
      );
    } else if (day === 6) {
      content = (
        <div className="flex flex-col items-center justify-center h-full">
          <Crown className="text-pink-400 drop-shadow-sm" size={40} fill="currentColor" />
        </div>
      );
    } else if (day === 7) {
      content = (
        <div className="flex flex-col items-center justify-center h-full">
          <Star className="text-yellow-400 drop-shadow-sm mb-1" size={40} fill="url(#rainbow)" />
          <span className="text-green-600 font-bold text-sm">100</span>
          <svg width="0" height="0">
            <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#ff0000" offset="0%" />
              <stop stopColor="#ffff00" offset="25%" />
              <stop stopColor="#00ff00" offset="50%" />
              <stop stopColor="#00ffff" offset="75%" />
              <stop stopColor="#0000ff" offset="100%" />
            </linearGradient>
          </svg>
        </div>
      );
    }

    return (
      <div key={day} className="relative w-20 h-20 bg-white border-2 border-blue-200 rounded-lg shadow-sm flex items-center justify-center">
        {/* Pin */}
        <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-sm z-10 ${
          day % 3 === 0 ? 'bg-yellow-400' : day % 2 === 0 ? 'bg-green-400' : 'bg-blue-400'
        }`}></div>
        
        {content}

        {/* Highlight today */}
        {isToday && !showStamp && (
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 border-4 border-yellow-400 rounded-lg"
          ></motion.div>
        )}

        {/* Stamp */}
        {isClaimed && (
          <motion.div 
            initial={isToday ? { scale: 3, opacity: 0 } : { scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <div className="w-16 h-16 border-4 border-red-500 rounded-full flex items-center justify-center transform -rotate-12 bg-white/20 backdrop-blur-[1px]">
              <span className="text-red-500 font-black text-3xl">済</span>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 font-sans">
      {/* Skip Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 bg-white rounded-md p-2 shadow-md z-50 hover:bg-gray-100 transition-colors"
      >
        <FastForward size={24} className="text-black" />
      </button>

      <div className="relative w-full max-w-5xl aspect-[16/9] flex items-end justify-center p-4">
        
        {/* Character Image (Placeholder) */}
        <div className="absolute left-0 bottom-0 w-[40%] h-[90%] z-20 flex items-end justify-center">
          <img 
            src="https://assets.st-note.com/production/uploads/images/5078440/picture_pc_1aef0fc7c152d38a214dcbb63873a093.jpg?width=400" 
            alt="Character" 
            className="w-full h-full object-cover object-left-bottom opacity-0" // Hidden but takes space, using a generic anime girl placeholder instead
          />
          <div className="absolute bottom-0 left-10 w-64 h-96 bg-[url('https://i.imgur.com/3Y1Z2Z9.png')] bg-contain bg-no-repeat bg-bottom"></div>
          
          {/* Speech Bubble */}
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-1/4 left-1/2 bg-black/80 text-white p-3 rounded-lg border border-gray-600 text-sm whitespace-nowrap shadow-lg"
          >
            {isViewing ? (
              <>ログインボーナスの<br/>スケジュールです！</>
            ) : (
              <>今日のログインボーナス<br/>はこちらです！</>
            )}
            {/* Triangle pointer */}
            <div className="absolute -left-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-black/80 border-b-8 border-b-transparent"></div>
          </motion.div>
        </div>

        {/* Whiteboard */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="absolute right-8 bottom-12 w-[60%] h-[80%] bg-white rounded-sm border-[6px] border-gray-300 shadow-2xl z-10 p-6 flex flex-col"
        >
          {/* Whiteboard bottom tray */}
          <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gray-300 rounded-b-sm"></div>
          {/* Markers */}
          <div className="absolute -bottom-1 left-1/4 w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 right-1/4 w-8 h-1.5 bg-red-500 rounded-full"></div>

          {/* Header */}
          <div className="text-center mb-8 relative">
            <h2 className="text-4xl font-black text-green-500 tracking-widest" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
              LOGIN * BONUS
            </h2>
            {/* Decorative vines (simplified with CSS) */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-300 -z-10 transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-300 -z-10 transform -translate-y-1/2 rotate-1"></div>
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-300 -z-10 transform -translate-y-1/2 -rotate-1"></div>
          </div>

          {/* Items Grid */}
          <div className="flex-1 flex flex-col gap-6 px-4">
            {/* Row 1 */}
            <div className="flex justify-between">
              {[1, 2, 3, 4].map(day => renderItem(day))}
            </div>
            {/* Row 2 */}
            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                {[5, 6, 7].map(day => renderItem(day))}
              </div>
              
              {/* Dog Drawing */}
              <div className="w-32 h-24 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-blue-400 opacity-80">
                  {/* Cloud/Fluffy outline */}
                  <path d="M 20 50 Q 20 30 40 30 Q 50 10 70 30 Q 90 30 90 50 Q 100 70 80 80 Q 50 90 20 80 Q 0 70 20 50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Face */}
                  <circle cx="40" cy="45" r="3" fill="currentColor" />
                  <circle cx="60" cy="45" r="3" fill="currentColor" />
                  <ellipse cx="50" cy="55" rx="6" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 45 65 Q 50 70 55 65" fill="none" stroke="currentColor" strokeWidth="2" />
                  {/* Eyebrows */}
                  <path d="M 35 40 Q 40 35 45 40" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 55 40 Q 60 35 65 40" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                {/* Red hearts */}
                <div className="absolute top-2 right-2 text-red-400 text-xl">♥</div>
                <div className="absolute bottom-2 left-2 text-red-400 text-sm">♥</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
