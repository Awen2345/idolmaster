import React, { useState, useEffect } from 'react';
import { ChevronLeft, Play, Volume2 } from 'lucide-react';
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
  const [progress, setProgress] = useState(() => parseInt(localStorage.getItem('workProgress') || '0'));
  const [showReward, setShowReward] = useState(false);
  const [rewards, setRewards] = useState({ exp: 0, money: 0, fans: 0 });
  const [currentQuote, setCurrentQuote] = useState("今日は調子いいみたいです");
  
  // New states for drops
  const [scoutedCards, setScoutedCards] = useState<Card[]>([]);
  const [obtainedItems, setObtainedItems] = useState<any[]>([]);

  // Use up to 3 idols from the formation for work
  const selectedIdols = formation.slice(0, 3);
  const mainIdol = selectedIdols[0] || { name: "島村卯月", img: "https://picsum.photos/seed/uzuki/400/600" };

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

  const baseStaminaCost = 4;
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
    
    // Change quote randomly
    const quotes = [
      "今日は調子いいみたいです",
      "プロデューサーさん、頑張ります！",
      "えへへ、楽しいですね！",
      "次のお仕事は何ですか？"
    ];
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Call API to process work
    await finishWork();
  };

  // REWARD SYSTEM
  const finishWork = async () => {
    // Generate rewards with passive skill boosts
    const baseExp = 5;
    const baseMoney = 24;
    const baseFans = 1;

    const generatedRewards = {
      exp: Math.floor(baseExp * (1 + expBoost / 100)),
      money: Math.floor(baseMoney * (1 + moneyBoost / 100)),
      fans: Math.floor(baseFans * (1 + fanBoost / 100))
    };
    
    setRewards(generatedRewards);

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

        // Update progress
        const newProgress = progress + 10;
        if (newProgress >= 100) {
          setProgress(0);
          localStorage.setItem('workProgress', '0');
          // Could trigger area clear event here
        } else {
          setProgress(newProgress);
          localStorage.setItem('workProgress', newProgress.toString());
        }

        // Handle drops
        if (data.droppedCard) {
          setScoutedCards(prev => [data.droppedCard, ...prev].slice(0, 3));
        }
        if (data.droppedItem) {
          setObtainedItems(prev => [data.droppedItem, ...prev].slice(0, 1));
        }
      }
    } catch (err) {
      console.error("Failed to save work results", err);
    } finally {
      setIsWorking(false);
    }
  };

  const stamina = player?.stamina ?? 0;
  const maxStamina = player?.maxStamina ?? 100;
  const exp = player?.exp ?? 0;
  const nextLevelExp = player?.nextLevelExp ?? 100;
  
  const hasIdols = selectedIdols.some(i => i !== null);

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-black overflow-hidden flex flex-col font-sans text-white">
      
      {/* Top Bar */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-300 text-black px-2 py-1 flex items-center justify-between border-b border-gray-400 shadow-sm z-20">
        <div className="flex items-center gap-2">
          <div className="bg-pink-600 text-white text-[10px] px-1 rounded-sm font-bold">原宿★2-1本屋でサイン会</div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold">達成度</span>
          <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden border border-gray-400">
            <div className="h-full bg-gradient-to-r from-yellow-300 to-orange-400" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-8 h-8 bg-pink-600 rounded-bl-lg absolute top-0 right-0 flex items-center justify-center shadow-md">
          <img src="https://api.dicebear.com/7.x/icons/svg?seed=crown&backgroundColor=transparent" className="w-6 h-6 invert" alt="icon" />
        </div>
      </div>

      {/* Main Image Area */}
      <div className="relative flex-1 bg-slate-800 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/harajuku/400/600')] bg-cover bg-center opacity-80"></div>
        
        {/* Character Sprite */}
        <div className="absolute inset-0 flex items-end justify-center pb-20">
          <img src={mainIdol?.img} alt="Idol" className="h-[80%] object-contain drop-shadow-xl" referrerPolicy="no-referrer" />
        </div>

        {/* Speech Bubble */}
        <div className="absolute bottom-4 left-2 right-24 bg-white/90 backdrop-blur-sm rounded-lg p-2 border-2 border-pink-200 shadow-lg text-black">
          <div className="flex justify-between items-start mb-1">
            <div className="text-[10px] font-bold text-gray-600">『{mainIdol?.name}』</div>
            <button className="bg-pink-500 rounded-full p-1 shadow-sm">
              <Volume2 size={12} className="text-white" />
            </button>
          </div>
          <div className="text-sm font-bold">{currentQuote}</div>
        </div>
      </div>

      {/* Bottom Dashboard */}
      <div className="bg-gradient-to-b from-gray-800 to-black p-3 relative z-20 border-t-2 border-gray-600">
        
        {/* Big Play Button */}
        <button 
          onClick={handleStartWork}
          disabled={isWorking || stamina < staminaCost || !hasIdols}
          className={`absolute -top-12 right-4 w-24 h-24 rounded-full border-4 border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.8)] flex flex-col items-center justify-center transition-transform active:scale-95 ${
            isWorking || stamina < staminaCost || !hasIdols ? 'bg-gray-600 border-gray-400 opacity-80' : 'bg-gradient-to-b from-blue-400 to-blue-800'
          }`}
        >
          <Play size={28} className="text-white ml-1 mb-1 drop-shadow-md" fill="currentColor" />
          <span className="text-white text-[10px] font-bold drop-shadow-md leading-tight text-center">お仕事を<br/>続ける</span>
        </button>

        {/* Bars */}
        <div className="w-[65%] space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold w-12 text-right">スタミナ</span>
            <div className="flex-1 h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-600 relative">
              <div className="h-full bg-gradient-to-r from-pink-400 to-pink-600" style={{ width: `${Math.min(100, (stamina / maxStamina) * 100)}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow-md">
                {stamina} / {maxStamina}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold w-12 text-right text-orange-400">Ex</span>
            <div className="flex-1 h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-600 relative">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${Math.min(100, (exp / nextLevelExp) * 100)}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow-md">
                {exp} / {nextLevelExp}
              </div>
            </div>
          </div>
        </div>

        {/* Icons Row */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-400 mb-0.5">スカウト</span>
            <div className="flex gap-1 h-8">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-8 h-8 bg-gray-700 border border-gray-500 rounded overflow-hidden flex items-center justify-center">
                  {scoutedCards[i] ? (
                    <img src={scoutedCards[i].img} alt="scout" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-gray-500 text-[10px]">?</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-400 mb-0.5">衣装</span>
            <div className="w-8 h-8 bg-gray-700 border border-gray-500 rounded overflow-hidden flex items-center justify-center">
              {obtainedItems[0] ? (
                <img src={obtainedItems[0].img} alt="outfit" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-gray-500 text-[10px]">?</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between text-[10px] font-bold border-t border-gray-700 pt-2 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">アイドル</span>
            <span>35/55</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">獲得マニー</span>
            <span className="text-yellow-400">+{rewards.money || 24}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">獲得ファン</span>
            <span className="text-pink-400">+{rewards.fans || 1}</span>
          </div>
        </div>

        {/* Disclaimer Button */}
        <button className="w-full py-1.5 bg-gradient-to-b from-gray-600 to-gray-800 rounded border border-gray-500 text-[10px] text-gray-300 font-bold mb-2">
          音声再生に関する免責事項(必読)
        </button>

        {/* Navigation Links */}
        <div className="space-y-1">
          <button onClick={() => onNavigate('main')} className="w-full text-left py-2 px-3 bg-gray-800/50 border-t border-gray-700 text-yellow-500 text-xs font-bold flex items-center gap-2">
            <ChevronLeft size={14} /> 原宿お仕事一覧
          </button>
          <button onClick={() => onNavigate('main')} className="w-full text-left py-2 px-3 bg-gray-800/50 border-t border-gray-700 text-yellow-500 text-xs font-bold flex items-center gap-2">
            <ChevronLeft size={14} /> エリア一覧
          </button>
        </div>

      </div>
    </div>
  );
}
