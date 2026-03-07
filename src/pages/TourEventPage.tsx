import React, { useState, useEffect } from 'react';
import { ChevronLeft, Map, Swords, Gift, Star, Zap } from 'lucide-react';
import { Card } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export function TourEventPage({ onNavigate, formation, userId, eventId }: { onNavigate: (page: string) => void, formation: (Card | null)[], userId: number, eventId: string }) {
  const [eventData, setEventData] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [battleState, setBattleState] = useState<'idle' | 'battling' | 'boss' | 'result'>('idle');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const activeIdols = formation.filter(c => c !== null) as Card[];
  const totalAtk = activeIdols.reduce((sum, card) => sum + card.atk, 0);

  useEffect(() => {
    // Fetch event details and user progress
    Promise.all([
      fetch('/api/events').then(res => res.json()),
      fetch(`/api/events/${eventId}/user/${userId}`).then(res => res.json())
    ]).then(([events, progress]) => {
      const currentEvent = events.find((e: any) => e.id === eventId);
      setEventData(currentEvent);
      setUserProgress(progress);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load event data", err);
      setLoading(false);
    });
  }, [eventId, userId]);

  const handleTour = () => {
    if (userProgress.progress >= 100) {
      setBattleState('boss');
      return;
    }

    setBattleState('battling');
    const logs = ["Touring the area...", "Encountered a Rival Unit!"];
    setBattleLog(logs);

    setTimeout(() => {
      const isWin = Math.random() > 0.2; // 80% win rate for normal rivals
      logs.push(isWin ? "You defeated the Rival Unit!" : "You struggled against the Rival Unit...");
      setBattleLog([...logs]);

      setTimeout(async () => {
        const progressGained = isWin ? 20 : 5;
        const pointsGained = isWin ? 500 : 100;

        try {
          const res = await fetch(`/api/events/${eventId}/user/${userId}/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progressAdd: progressGained, pointsAdd: pointsGained })
          });
          const updatedProgress = await res.json();
          setUserProgress(updatedProgress);
        } catch (e) {
          console.error("Failed to update progress", e);
        }

        setResult({
          isWin,
          progressGained,
          pointsGained,
          isBoss: false
        });
        setBattleState('result');
      }, 1000);
    }, 1000);
  };

  const handleBossBattle = () => {
    setBattleState('battling');
    const logs = ["A powerful Boss Unit appeared!", `Your ATK: ${totalAtk}`];
    setBattleLog(logs);

    setTimeout(() => {
      const bossAtk = 40000; // Hardcoded boss ATK for now
      logs.push(`Boss ATK: ${bossAtk}`);
      setBattleLog([...logs]);

      setTimeout(async () => {
        const isWin = totalAtk > bossAtk;
        logs.push(isWin ? "You defeated the Boss!" : "You were defeated by the Boss...");
        setBattleLog([...logs]);

        if (isWin) {
          // Reset progress and give big points
          try {
            const res = await fetch(`/api/events/${eventId}/user/${userId}/progress`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ progressAdd: -100, pointsAdd: 5000 })
            });
            const updatedProgress = await res.json();
            setUserProgress(updatedProgress);
          } catch (e) {
            console.error("Failed to update progress", e);
          }
        }

        setResult({
          isWin,
          progressGained: isWin ? -100 : 0,
          pointsGained: isWin ? 5000 : 500,
          isBoss: true
        });
        setBattleState('result');
      }, 1500);
    }, 1000);
  };

  if (loading || !eventData || !userProgress) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-slate-900 overflow-hidden flex flex-col font-sans text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-gradient-to-b from-yellow-600 to-orange-800 p-3 border-b-2 border-yellow-400 shadow-md z-10">
        <button onClick={() => onNavigate('events')} className="p-1 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-black text-white drop-shadow-md italic tracking-wider flex items-center gap-2">
          <Map size={20} />
          LIVE TOUR
        </h1>
        <div className="w-8"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        
        {/* Event Banner */}
        <div className="relative h-40 rounded-xl overflow-hidden border-2 border-yellow-500 shadow-lg">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tour/600/300')] bg-cover bg-center opacity-60 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h2 className="text-2xl font-black text-white drop-shadow-md italic tracking-wide">{eventData.name}</h2>
            <div className="flex justify-between items-end mt-2">
              <div className="text-sm font-bold text-yellow-300">Event Points: {userProgress.points.toLocaleString()}</div>
              <div className="text-xs text-slate-300">Ends: {new Date(eventData.end_date).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-inner">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-orange-400">Area Progress</span>
            <span className="text-white">{userProgress.progress}%</span>
          </div>
          <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${userProgress.progress}%` }}
              transition={{ duration: 0.5 }}
            />
            {userProgress.progress >= 100 && (
              <div className="absolute inset-0 bg-yellow-400/30 animate-pulse"></div>
            )}
          </div>
          {userProgress.progress >= 100 && (
            <div className="text-center mt-2 text-red-400 font-bold text-sm animate-bounce">
              BOSS APPEARED!
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 shadow-inner p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {battleState === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 text-center">
                {userProgress.progress < 100 ? (
                  <button 
                    onClick={handleTour}
                    disabled={activeIdols.length === 0}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-black italic tracking-wider px-8 py-4 rounded-full shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto text-lg"
                  >
                    <Map size={24} /> START TOUR
                  </button>
                ) : (
                  <button 
                    onClick={handleBossBattle}
                    className="bg-gradient-to-r from-red-600 to-rose-800 text-white font-black italic tracking-wider px-8 py-4 rounded-full shadow-lg hover:brightness-110 flex items-center gap-2 mx-auto text-lg animate-pulse"
                  >
                    <Swords size={24} /> BATTLE BOSS
                  </button>
                )}
                {activeIdols.length === 0 && <div className="text-red-400 text-xs mt-4">Assign idols to your formation first!</div>}
              </motion.div>
            )}

            {battleState === 'battling' && (
              <motion.div key="battling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 w-full h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin text-yellow-500">
                    <Swords size={64} />
                  </div>
                </div>
                <div className="bg-black/50 rounded-lg p-3 border border-slate-600 font-mono text-xs space-y-2 h-32 overflow-y-auto">
                  {battleLog.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="text-slate-300"
                    >
                      &gt; {log}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {battleState === 'result' && result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="relative z-10 w-full text-center"
              >
                <h3 className={`text-3xl font-black italic tracking-wider mb-4 ${result.isWin ? 'text-yellow-400' : 'text-slate-400'}`}>
                  {result.isWin ? (result.isBoss ? 'BOSS DEFEATED!' : 'SUCCESS!') : 'FAILED...'}
                </h3>
                
                <div className="bg-black/40 rounded-xl p-4 border border-slate-600 inline-block text-left mb-6">
                  <div className="flex items-center gap-2 text-yellow-300 font-bold mb-2">
                    <Star size={16} /> Points: +{result.pointsGained}
                  </div>
                  {!result.isBoss && (
                    <div className="flex items-center gap-2 text-orange-300 font-bold">
                      <Map size={16} /> Progress: +{result.progressGained}%
                    </div>
                  )}
                  {result.isBoss && result.isWin && (
                    <div className="flex items-center gap-2 text-pink-300 font-bold mt-2">
                      <Gift size={16} /> Boss Defeated Bonus!
                    </div>
                  )}
                </div>

                <div>
                  <button 
                    onClick={() => { setBattleState('idle'); setBattleLog([]); setResult(null); }}
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
