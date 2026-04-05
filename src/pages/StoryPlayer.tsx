import React, { useState, useEffect } from 'react';
import { ChevronRight, SkipForward, X, FastForward, Star, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type StoryLine = {
  speaker: string;
  text: string;
  spriteLeft?: string;
  spriteRight?: string;
  spriteCenter?: string;
  bg: string;
  expression?: string;
};

const mockScripts: Record<string, StoryLine[]> = {
  'story_1': [
    { speaker: '', text: 'A new day begins at the production agency...', bg: 'office' },
    { speaker: 'Uzuki', text: 'Good morning, Producer! I\'m ready to do my best today!', spriteCenter: 'uzuki', expression: 'smile', bg: 'office' },
    { speaker: 'Rin', text: 'Morning. Are we starting the lessons soon?', spriteRight: 'rin', expression: 'neutral', bg: 'office' },
    { speaker: 'Uzuki', text: 'Oh, Rin-chan! Let\'s practice together!', spriteLeft: 'uzuki', expression: 'happy', spriteRight: 'rin', bg: 'office' },
    { speaker: 'Rin', text: '...Sure. Let\'s go.', spriteLeft: 'uzuki', spriteRight: 'rin', expression: 'smile', bg: 'office' },
  ],
  'story_2': [
    { speaker: 'Producer', text: 'Today is your first live performance. Are you nervous?', bg: 'stage' },
    { speaker: 'Uzuki', text: 'A little bit... but I\'m more excited!', spriteCenter: 'uzuki', expression: 'happy', bg: 'stage' },
  ]
};

export function StoryPlayer({ onNavigate, episodeId }: { onNavigate: (page: string) => void, episodeId: string }) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isAuto, setIsAuto] = useState(false);

  const script = mockScripts[episodeId] || mockScripts['story_1'];
  const currentLine = script[currentLineIndex];
  const isFinished = currentLineIndex >= script.length;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAuto && !isFinished) {
      timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
      }, 3000); // Auto advance every 3 seconds
    }
    return () => clearTimeout(timer);
  }, [isAuto, currentLineIndex, isFinished]);

  const handleNext = () => {
    if (isFinished) {
      onNavigate('commu');
    } else {
      setCurrentLineIndex(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setCurrentLineIndex(script.length);
  };

  const getSpriteUrl = (character: string, expression: string = 'neutral') => {
    // Using picsum with a specific seed to simulate a character sprite
    // In a real app, these would be actual transparent PNGs
    return `https://picsum.photos/seed/${character}_${expression}/400/800`;
  };

  const getBgUrl = (bg: string) => {
    return `https://picsum.photos/seed/${bg}/600/800`;
  };

  if (isFinished) {
    return (
      <div className="relative w-full max-w-md mx-auto h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <h2 className="text-3xl font-black italic mb-4 text-pink-400">EPISODE CLEARED!</h2>
          <div className="bg-slate-800 p-6 rounded-xl border-2 border-slate-600 mb-8">
            <div className="text-yellow-400 font-bold mb-2">Rewards</div>
            <div className="flex items-center justify-center gap-2 text-xl">
              <Star className="text-yellow-400" fill="currentColor" /> x50
            </div>
          </div>
          <button 
            onClick={() => onNavigate('commu')}
            className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-slate-200 w-full"
          >
            Return to Commu Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-black overflow-hidden flex flex-col font-sans select-none">
      {/* Background */}
      <div className="absolute inset-0 z-0 transition-all duration-1000">
        <img src={getBgUrl(currentLine.bg)} alt="background" className="w-full h-full object-cover opacity-60" />
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => onNavigate('commu')} className="bg-black/50 p-2 rounded-full text-white hover:bg-black/80 border border-white/20">
          <X size={20} />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAuto(!isAuto)} 
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${isAuto ? 'bg-pink-600 border-pink-400 text-white' : 'bg-black/50 border-white/20 text-slate-300'}`}
          >
            <PlayCircle size={14} /> AUTO
          </button>
          <button 
            onClick={handleSkip}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-black/50 border border-white/20 text-slate-300 hover:bg-black/80"
          >
            <FastForward size={14} /> SKIP
          </button>
        </div>
      </div>

      {/* Sprites Area */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none pb-32">
        <AnimatePresence>
          {currentLine.spriteLeft && (
            <motion.div 
              key={`left-${currentLine.spriteLeft}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: -20 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute left-0 bottom-0 w-2/3 max-w-[250px]"
            >
              <img src={getSpriteUrl(currentLine.spriteLeft, currentLine.expression)} alt="Sprite Left" className="w-full h-auto drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.8))' }} />
            </motion.div>
          )}
          {currentLine.spriteCenter && (
            <motion.div 
              key={`center-${currentLine.spriteCenter}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 w-2/3 max-w-[250px]"
            >
              <img src={getSpriteUrl(currentLine.spriteCenter, currentLine.expression)} alt="Sprite Center" className="w-full h-auto drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.8))' }} />
            </motion.div>
          )}
          {currentLine.spriteRight && (
            <motion.div 
              key={`right-${currentLine.spriteRight}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 20 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute right-0 bottom-0 w-2/3 max-w-[250px]"
            >
              <img src={getSpriteUrl(currentLine.spriteRight, currentLine.expression)} alt="Sprite Right" className="w-full h-auto drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.8))' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click Area to Advance */}
      <div className="absolute inset-0 z-20 cursor-pointer" onClick={handleNext}></div>

      {/* Dialogue Box */}
      <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-none">
        <motion.div 
          key={currentLineIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/80 backdrop-blur-md border-2 border-slate-500 rounded-xl p-4 shadow-2xl relative"
        >
          {currentLine.speaker && (
            <div className="absolute -top-4 left-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black px-4 py-1 rounded-full text-sm border-2 border-pink-300 shadow-md">
              {currentLine.speaker}
            </div>
          )}
          <div className="text-white text-lg leading-relaxed mt-2 min-h-[60px]">
            {currentLine.text}
          </div>
          <div className="absolute bottom-2 right-3 text-pink-400 animate-bounce">
            <ChevronRight size={20} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
