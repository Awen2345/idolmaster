import React, { useState, useEffect } from 'react';
import { ChevronLeft, Swords, Star, User, Shield, Zap } from 'lucide-react';
import { Card } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export function LiveBattlePage({ onNavigate, formation, userId }: { onNavigate: (page: string) => void, formation: (Card | null)[], userId: number }) {
  const [battleState, setBattleState] = useState<'idle' | 'searching' | 'battling' | 'result'>('idle');
  const [opponent, setOpponent] = useState<any>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const activeIdols = formation.filter(c => c !== null) as Card[];

  // Calculate base stats
  const baseAtk = activeIdols.reduce((sum, card) => sum + card.atk, 0);
  const baseDef = activeIdols.reduce((sum, card) => sum + card.def, 0);

  // Apply Live Skills
  let totalAtk = baseAtk;
  let totalDef = baseDef;
  const activeSkills: string[] = [];

  activeIdols.forEach(card => {
    if (card.liveSkill) {
      const { type, value, description } = card.liveSkill;
      activeSkills.push(`[${card.name}] ${description}`);
      
      switch (type) {
        case 'atk_boost':
          totalAtk += Math.floor(baseAtk * (value / 100));
          break;
        case 'def_boost':
          totalDef += Math.floor(baseDef * (value / 100));
          break;
        case 'atk_def_boost':
          totalAtk += Math.floor(baseAtk * (value / 100));
          totalDef += Math.floor(baseDef * (value / 100));
          break;
      }
    }
  });

  const handleFindOpponent = () => {
    setBattleState('searching');
    setTimeout(() => {
      // Mock opponent generation
      const oppAtk = Math.floor(totalAtk * (0.8 + Math.random() * 0.4));
      const oppDef = Math.floor(totalDef * (0.8 + Math.random() * 0.4));
      setOpponent({
        name: "Rival Producer",
        level: Math.floor(Math.random() * 20) + 10,
        atk: oppAtk,
        def: oppDef,
        avatar: `https://picsum.photos/seed/rival${Math.random()}/100/100`
      });
      setBattleState('battling');
      simulateBattle(oppAtk, oppDef);
    }, 1500);
  };

  const simulateBattle = (oppAtk: number, oppDef: number) => {
    const logs: string[] = [];
    logs.push("Battle Started!");
    
    if (activeSkills.length > 0) {
      logs.push("Live Skills Activated!");
      activeSkills.forEach(s => logs.push(s));
    }

    setTimeout(() => {
      logs.push(`Your ATK (${totalAtk}) vs Opponent DEF (${oppDef})`);
      const myDamage = Math.max(10, totalAtk - oppDef * 0.8);
      
      logs.push(`Opponent ATK (${oppAtk}) vs Your DEF (${totalDef})`);
      const oppDamage = Math.max(10, oppAtk - totalDef * 0.8);

      setBattleLog(logs);

      setTimeout(async () => {
        const isWin = myDamage > oppDamage;
        logs.push(isWin ? "You won the Live Battle!" : "You lost the Live Battle...");
        setBattleLog([...logs]);
        
        const fansGained = isWin ? 150 : 20;
        const moneyGained = isWin ? 500 : 100;

        try {
          await fetch(`/api/live/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isWin, fansGained, moneyGained })
          });
        } catch (e) {
          console.error("Failed to save battle result", e);
        }

        setResult({
          isWin,
          fansGained,
          moneyGained
        });
        setBattleState('result');
      }, 1500);
    }, 1500);
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-slate-900 overflow-hidden flex flex-col font-sans text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-gradient-to-b from-blue-600 to-indigo-800 p-3 border-b-2 border-blue-400 shadow-md z-10">
        <button onClick={() => onNavigate('main')} className="p-1 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-black text-white drop-shadow-md italic tracking-wider flex items-center gap-2">
          <Swords size={20} />
          LIVE BATTLE
        </h1>
        <div className="w-8"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        
        {/* Player Team Stats */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-inner">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center border-b border-slate-700 pb-2">Your Unit</h2>
          
          <div className="flex justify-center gap-2 mb-4">
            {formation.map((card, idx) => (
              <div key={idx} className="w-12 h-12 rounded bg-slate-900 border border-slate-600 overflow-hidden">
                {card ? <img src={card.img} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <User size={20} className="m-auto mt-3 text-slate-700" />}
              </div>
            ))}
          </div>

          <div className="flex justify-around bg-slate-900 p-2 rounded-lg">
            <div className="text-center">
              <div className="text-[10px] text-red-400 font-bold flex items-center justify-center gap-1"><Swords size={12}/> TOTAL ATK</div>
              <div className="text-lg font-black text-red-500">{totalAtk.toLocaleString()}</div>
              {totalAtk > baseAtk && <div className="text-[10px] text-green-400">(+{totalAtk - baseAtk})</div>}
            </div>
            <div className="text-center">
              <div className="text-[10px] text-blue-400 font-bold flex items-center justify-center gap-1"><Shield size={12}/> TOTAL DEF</div>
              <div className="text-lg font-black text-blue-500">{totalDef.toLocaleString()}</div>
              {totalDef > baseDef && <div className="text-[10px] text-green-400">(+{totalDef - baseDef})</div>}
            </div>
          </div>

          {activeSkills.length > 0 && (
            <div className="mt-3">
              <div className="text-[10px] text-yellow-400 font-bold mb-1 flex items-center gap-1"><Zap size={12}/> Active Live Skills</div>
              <div className="space-y-1">
                {activeSkills.map((skill, i) => (
                  <div key={i} className="text-[9px] bg-yellow-900/30 text-yellow-200 px-2 py-1 rounded border border-yellow-700/50 truncate">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Battle Arena */}
        <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 shadow-inner p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/stage/400/400')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
          
          <AnimatePresence mode="wait">
            {battleState === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 text-center">
                <div className="text-slate-400 mb-4 font-bold">Ready for a Live Battle?</div>
                <button 
                  onClick={handleFindOpponent}
                  disabled={activeIdols.length === 0}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black italic tracking-wider px-8 py-3 rounded-full shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  FIND OPPONENT
                </button>
                {activeIdols.length === 0 && <div className="text-red-400 text-xs mt-2">Assign idols to your formation first!</div>}
              </motion.div>
            )}

            {battleState === 'searching' && (
              <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 text-center">
                <div className="animate-spin mb-4 inline-block">
                  <Swords size={48} className="text-blue-500" />
                </div>
                <div className="text-blue-300 font-bold animate-pulse">Searching for Rival...</div>
              </motion.div>
            )}

            {(battleState === 'battling' || battleState === 'result') && opponent && (
              <motion.div key="battling" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full flex flex-col h-full">
                
                {/* Opponent Info */}
                <div className="flex items-center gap-3 bg-red-900/40 p-2 rounded-lg border border-red-500/50 mb-4">
                  <img src={opponent.avatar} className="w-12 h-12 rounded-full border-2 border-red-500" alt="Rival" />
                  <div className="flex-1">
                    <div className="text-red-300 text-xs font-bold">Lv. {opponent.level}</div>
                    <div className="text-white font-bold">{opponent.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-red-400 font-bold">ATK {opponent.atk}</div>
                    <div className="text-[10px] text-blue-400 font-bold">DEF {opponent.def}</div>
                  </div>
                </div>

                {/* Battle Log */}
                <div className="flex-1 bg-black/50 rounded-lg p-3 overflow-y-auto border border-slate-600 font-mono text-xs space-y-2">
                  {battleLog.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className={`${log.includes('won') ? 'text-green-400 font-bold' : log.includes('lost') ? 'text-red-400 font-bold' : log.includes('Skill') ? 'text-yellow-300' : 'text-slate-300'}`}
                    >
                      &gt; {log}
                    </motion.div>
                  ))}
                </div>

                {/* Result Overlay */}
                {battleState === 'result' && result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className={`mt-4 p-4 rounded-xl border-2 text-center ${result.isWin ? 'bg-green-900/80 border-green-500' : 'bg-slate-800/80 border-slate-500'}`}
                  >
                    <h3 className={`text-2xl font-black italic tracking-wider mb-2 ${result.isWin ? 'text-green-400' : 'text-slate-400'}`}>
                      {result.isWin ? 'VICTORY!' : 'DEFEAT'}
                    </h3>
                    <div className="flex justify-center gap-4 text-sm font-bold">
                      <div className="text-pink-300">Fans +{result.fansGained}</div>
                      <div className="text-yellow-300">Money +{result.moneyGained}</div>
                    </div>
                    <button 
                      onClick={() => { setBattleState('idle'); setBattleLog([]); setOpponent(null); setResult(null); }}
                      className="mt-4 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors"
                    >
                      Next Battle
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
