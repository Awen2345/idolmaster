import React, { useState, useEffect } from 'react';
import { ChevronLeft, Briefcase, Star, User } from 'lucide-react';
import { WorkProgressBar } from '../components/WorkProgressBar';
import { RewardPopup } from '../components/RewardPopup';

import { Card } from '../types';

// WORK SYSTEM
interface PlayerData {
  stamina: number;
  maxStamina: number;
  exp: number;
  nextLevelExp: number;
  money: number;
  fans: number;
  level: number;
}

export function WorkPage({ onNavigate, formation, userId }: { onNavigate: (page: string) => void, formation: (Card | null)[], userId: number }) {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewards, setRewards] = useState({ exp: 0, money: 0, fans: 0 });

  // Use up to 3 idols from the formation for work
  const selectedIdols = formation.slice(0, 3);

  // Calculate passive skill bonuses
  let expBoost = 0;
  let moneyBoost = 0;
  let fanBoost = 0;
  let staminaReduction = 0;

  selectedIdols.forEach(idol => {
    if (idol?.passiveSkill) {
      switch (idol.passiveSkill.type) {
        case 'exp_boost': expBoost += idol.passiveSkill.value; break;
        case 'money_boost': moneyBoost += idol.passiveSkill.value; break;
        case 'fan_boost': fanBoost += idol.passiveSkill.value; break;
        case 'stamina_reduction': staminaReduction += idol.passiveSkill.value; break;
      }
    }
  });

  const baseStaminaCost = 20;
  const staminaCost = Math.max(1, Math.floor(baseStaminaCost * (1 - staminaReduction / 100)));

  useEffect(() => {
    // Load player data from server
    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setPlayer({
          stamina: data.stamina,
          maxStamina: data.maxStamina,
          exp: data.exp,
          nextLevelExp: data.level * 1000, // Simplified for now
          money: data.coins,
          fans: data.fans,
          level: data.level
        });
      })
      .catch(err => console.error("Failed to load user data", err));
  }, [userId]);

  // IDOL JOB
  const handleStartWork = async () => {
    if (!player || player.stamina < staminaCost || isWorking) return;

    setIsWorking(true);
    setProgress(0);

    // Simulate work progress (5 seconds)
    const duration = 5000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        finishWork();
      }
    }, interval);
  };

  // REWARD SYSTEM
  const finishWork = async () => {
    setIsWorking(false);
    
    // Generate rewards with passive skill boosts
    const baseExp = 50;
    const baseMoney = 100;
    const baseFans = 25;

    const generatedRewards = {
      exp: Math.floor(baseExp * (1 + expBoost / 100)),
      money: Math.floor(baseMoney * (1 + moneyBoost / 100)),
      fans: Math.floor(baseFans * (1 + fanBoost / 100))
    };
    
    setRewards(generatedRewards);
    setShowReward(true);

    try {
      const res = await fetch(`/api/work/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staminaCost,
          expReward: generatedRewards.exp,
          moneyReward: generatedRewards.money,
          fansReward: generatedRewards.fans
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPlayer({
          stamina: data.stamina,
          maxStamina: data.maxStamina,
          exp: data.exp,
          nextLevelExp: data.level * 1000,
          money: data.coins,
          fans: data.fans,
          level: data.level
        });
      }
    } catch (err) {
      console.error("Failed to save work results", err);
    }
  };

  const stamina = player?.stamina ?? 0;
  const maxStamina = player?.maxStamina ?? 100;
  const exp = player?.exp ?? 0;
  const nextLevelExp = player?.nextLevelExp ?? 100;
  const level = player?.level ?? 1;

  const hasIdols = selectedIdols.some(i => i !== null);

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-slate-900 overflow-hidden flex flex-col font-sans text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-gradient-to-b from-pink-600 to-rose-800 p-3 border-b-2 border-pink-400 shadow-md z-10">
        <button onClick={() => onNavigate('main')} className="p-1 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-black text-white drop-shadow-md italic tracking-wider flex items-center gap-2">
          <Briefcase size={20} />
          IDOL WORK
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Top Area: Background & Progress */}
      <div className="relative h-48 bg-slate-800 border-b-4 border-slate-700">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/cityscape/600/400')] bg-cover bg-center opacity-60 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex justify-between text-sm font-bold mb-1 drop-shadow-md">
            <span className="text-pink-300">Work Progress</span>
            <span className="text-white">{Math.floor(progress)}%</span>
          </div>
          <WorkProgressBar progress={progress} />
        </div>
      </div>

      {/* Middle Area: Stats & Slots */}
      <div className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto">
        
        {/* Player Stats */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-inner">
          <div className="flex justify-between items-end mb-4 border-b border-slate-700 pb-2">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Producer Stats</div>
            <div className="text-lg font-black text-pink-400 italic">Lv. {level}</div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-green-400">Stamina</span>
                <span className="text-white">{stamina} / {maxStamina}</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (stamina / maxStamina) * 100)}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-blue-400">EXP</span>
                <span className="text-white">{exp} / {nextLevelExp}</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (exp / nextLevelExp) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Idol Slots */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-inner">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Assigned Idols</div>
          
          {!hasIdols ? (
            <div className="text-center text-slate-500 py-4 font-bold">No idols assigned</div>
          ) : (
            <div className="flex justify-center gap-4">
              {selectedIdols.map((idol, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg border-2 border-slate-600 bg-slate-900 flex items-center justify-center overflow-hidden shadow-md">
                  {idol ? (
                    <>
                      <img src={idol.img} alt={idol.name} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-center font-bold py-0.5 truncate px-1">
                        {idol.name}
                      </div>
                      <div className="absolute top-1 right-1 bg-pink-500 rounded-full p-0.5 shadow-sm">
                        <Star size={10} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <User size={24} className="text-slate-700" />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Passive Skills Summary */}
          {(expBoost > 0 || moneyBoost > 0 || fanBoost > 0 || staminaReduction > 0) && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Active Passive Skills</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {expBoost > 0 && <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-1 rounded border border-blue-700/50">EXP +{expBoost}%</span>}
                {moneyBoost > 0 && <span className="text-[10px] bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded border border-yellow-700/50">Money +{moneyBoost}%</span>}
                {fanBoost > 0 && <span className="text-[10px] bg-pink-900/50 text-pink-300 px-2 py-1 rounded border border-pink-700/50">Fans +{fanBoost}%</span>}
                {staminaReduction > 0 && <span className="text-[10px] bg-green-900/50 text-green-300 px-2 py-1 rounded border border-green-700/50">Stamina Cost -{staminaReduction}%</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Area: Action Button */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <button
          onClick={handleStartWork}
          disabled={isWorking || stamina < staminaCost || !hasIdols}
          className={`w-full py-4 rounded-full font-black text-xl italic tracking-wider shadow-lg transition-all ${
            isWorking || stamina < staminaCost || !hasIdols
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:brightness-110 active:scale-95'
          }`}
        >
          {isWorking ? 'WORKING...' : stamina < staminaCost ? 'NO STAMINA' : `START WORK (${staminaCost} STAMINA)`}
        </button>
      </div>

      {/* Reward Popup */}
      {showReward && (
        <RewardPopup rewards={rewards} onClose={() => setShowReward(false)} />
      )}
    </div>
  );
}
