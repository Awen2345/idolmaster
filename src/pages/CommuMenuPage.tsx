import React, { useState, useEffect } from 'react';
import { ChevronLeft, BookOpen, Star, Sparkles, Heart, Film } from 'lucide-react';
import { motion } from 'motion/react';

export function CommuMenuPage({ onNavigate, userId }: { onNavigate: (page: string, params?: any) => void, userId: number }) {
  const [commus, setCommus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/commus/${userId}`)
      .then(res => res.json())
      .then(data => {
        setCommus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load commus", err);
        setLoading(false);
      });
  }, [userId]);

  const getCommuStats = (type: string) => {
    const typeCommus = commus.filter(c => c.type === type);
    const unlocked = typeCommus.filter(c => c.is_unlocked).length;
    const read = typeCommus.filter(c => c.is_read).length;
    return { total: typeCommus.length, unlocked, read };
  };

  const categories = [
    { id: 'story', title: 'Main Story', icon: <BookOpen size={32} />, color: 'from-blue-500 to-indigo-700' },
    { id: 'idol', title: 'Idol Commu', icon: <Heart size={32} />, color: 'from-pink-500 to-rose-700' },
    { id: 'event', title: 'Event Commu', icon: <Star size={32} />, color: 'from-yellow-500 to-orange-700' },
    { id: 'special', title: 'Special Commu', icon: <Sparkles size={32} />, color: 'from-purple-500 to-fuchsia-700' }
  ];

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-slate-900 overflow-hidden flex flex-col font-sans text-slate-100">
      <header className="flex items-center justify-between bg-gradient-to-b from-teal-600 to-teal-800 p-3 border-b-2 border-teal-400 shadow-md z-10">
        <button onClick={() => onNavigate('main')} className="p-1 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-black text-white drop-shadow-md italic tracking-wider flex items-center gap-2">
          <Film size={20} />
          COMMUNICATION
        </h1>
        <div className="w-8"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          categories.map(cat => {
            const stats = getCommuStats(cat.id);
            return (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-r ${cat.color} rounded-xl p-4 shadow-lg cursor-pointer hover:brightness-110 border border-white/20 relative overflow-hidden`}
                onClick={() => onNavigate('commu_list', { type: cat.id, commus: commus.filter(c => c.type === cat.id) })}
              >
                <div className="absolute right-[-20px] top-[-20px] opacity-20 transform rotate-12 scale-150">
                  {cat.icon}
                </div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-black italic tracking-wide drop-shadow-md">{cat.title}</h2>
                    <div className="flex justify-between mt-2 text-sm font-bold bg-black/30 px-2 py-1 rounded">
                      <span className="text-white/80">Unlocked: {stats.unlocked}/{stats.total}</span>
                      <span className="text-teal-300">Read: {stats.read}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
