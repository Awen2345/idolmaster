import React, { useState, useEffect } from 'react';
import { ChevronRight, SkipForward, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function CommuReaderPage({ onNavigate, commu, userId }: { onNavigate: (page: string) => void, commu: any, userId: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);

  const script = commu.script;
  const currentLine = script[currentIndex];

  const handleNext = async () => {
    if (currentIndex < script.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finish Commu
      try {
        const res = await fetch(`/api/commus/${userId}/read/${commu.id}`, { method: 'POST' });
        const data = await res.json();
        if (data.first_read) {
          setRewardData(data.reward);
          setShowReward(true);
        } else {
          onNavigate('commu');
        }
      } catch (e) {
        console.error("Failed to finish commu", e);
        onNavigate('commu');
      }
    }
  };

  const handleSkip = () => {
    setCurrentIndex(script.length - 1);
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-black overflow-hidden flex flex-col font-sans text-slate-100 cursor-pointer" onClick={handleNext}>
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/office/600/800')] bg-cover bg-center opacity-50"></div>
      
      {/* Sprite Area */}
      <div className="absolute inset-0 flex items-end justify-center pb-32">
        <AnimatePresence mode="wait">
          {currentLine.sprite && (
            <motion.img 
              key={currentLine.sprite}
              src={currentLine.sprite}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="h-2/3 object-contain drop-shadow-2xl"
              alt={currentLine.speaker}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); handleSkip(); }} className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-black/70">
          <SkipForward size={14} /> SKIP
        </button>
      </div>

      {/* Dialogue Box */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="bg-slate-900/90 border-2 border-teal-500/50 rounded-xl p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] backdrop-blur-sm relative">
          <div className="absolute -top-3 left-4 bg-teal-600 text-white px-3 py-0.5 rounded text-sm font-black italic tracking-wider shadow-md">
            {currentLine.speaker}
          </div>
          <div className="mt-2 text-lg min-h-[80px]">
            {currentLine.text}
          </div>
          <div className="absolute bottom-2 right-2 animate-pulse text-teal-400">
            <ChevronRight size={24} />
          </div>
        </div>
      </div>

      {/* Reward Popup */}
      <AnimatePresence>
        {showReward && rewardData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={(e) => { e.stopPropagation(); onNavigate('commu'); }}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-b from-teal-600 to-teal-900 rounded-2xl border-4 border-yellow-400 p-6 w-full max-w-sm text-center shadow-2xl relative"
            >
              <Gift size={48} className="text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">Commu Cleared!</h2>
              <div className="text-yellow-300 font-bold text-xl mb-6">
                +{rewardData.amount} {rewardData.type}
              </div>
              <p className="text-sm text-teal-200">Tap anywhere to continue</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
