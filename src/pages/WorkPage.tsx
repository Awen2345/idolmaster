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
  lastStaminaUpdate?: string;
  staminaDrinks?: number;
  inventory?: Card[];
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
  const [showItemModal, setShowItemModal] = useState(false);
  const [timeToNextStamina, setTimeToNextStamina] = useState<number | null>(null);

  // New states for Idol Selection
  const [showIdolSelection, setShowIdolSelection] = useState(false);
  const [previewCard, setPreviewCard] = useState<Card | null>(null);
  const [workIdol, setWorkIdol] = useState<{ id: number, name: string, icon_url: string, sprite_url: string } | null>(null);

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
          level: data.level,
          lastStaminaUpdate: data.lastStaminaUpdate,
          staminaDrinks: data.staminaDrinks,
          inventory: data.inventory
        });
        if (data.workIdol) {
          setWorkIdol(data.workIdol);
        } else {
          setShowIdolSelection(true); // Must select an idol if none is set
        }
      })
      .catch(err => console.error("Failed to load user data", err));
  }, [userId]);

  const confirmSelectIdol = async () => {
    if (!previewCard) return;
    try {
      // The API endpoint expects idol_id which corresponds to card_id
      const res = await fetch(`/api/user/${userId}/work-idol`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idol_id: previewCard.id })
      });
      if (res.ok) {
        setWorkIdol({
          id: previewCard.id,
          name: previewCard.name,
          icon_url: previewCard.icon_url || previewCard.img,
          sprite_url: previewCard.spread_url || previewCard.img
        });
        setPreviewCard(null);
        setShowIdolSelection(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!player || player.stamina >= player.maxStamina || !player.lastStaminaUpdate) {
      setTimeToNextStamina(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const lastUpdate = new Date(player.lastStaminaUpdate!).getTime();
      const diff = now - lastUpdate;
      const regenInterval = 5 * 60 * 1000; // 5 minutes

      if (diff >= regenInterval) {
        setPlayer(prev => {
          if (!prev) return prev;
          const points = Math.floor(diff / regenInterval);
          const newStamina = Math.min(prev.maxStamina, prev.stamina + points);
          const remainder = diff % regenInterval;
          const newLastUpdate = new Date(now - remainder).toISOString();
          return { ...prev, stamina: newStamina, lastStaminaUpdate: newLastUpdate };
        });
      } else {
        setTimeToNextStamina(regenInterval - diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player?.stamina, player?.maxStamina, player?.lastStaminaUpdate]);

  // Use the selected workIdol if available, otherwise fallback.
  // We still use formation for passive skills, or wait... maybe the user wants the selected idol to give bonuses?
  // Let's just keep formation for bonuses as before, but the visual idol is the selected workIdol!
  const selectedIdols = formation.slice(0, 3);
  const mainIdol = workIdol ? { name: workIdol.name, img: workIdol.sprite_url } : (selectedIdols[0] || { name: "島村卯月", img: "https://picsum.photos/seed/uzuki/400/600" });

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

    // Optimistic Update for instant feedback
    const baseExp = 5;
    const baseMoney = 24;
    const baseFans = 1;

    const generatedRewards = {
      exp: Math.floor(baseExp * (1 + expBoost / 100)),
      money: Math.floor(baseMoney * (1 + moneyBoost / 100)),
      fans: Math.floor(baseFans * (1 + fanBoost / 100))
    };
    
    setRewards(generatedRewards);

    setPlayer(prev => {
      if (!prev) return prev;
      let newStamina = prev.stamina - staminaCost;
      let newExp = prev.exp + generatedRewards.exp;
      let newMoney = prev.money + generatedRewards.money;
      let newFans = prev.fans + generatedRewards.fans;
      let newLevel = prev.level;
      let newMaxStamina = prev.maxStamina;
      let nextLevelExp = prev.nextLevelExp;

      if (newExp >= nextLevelExp) {
        newLevel++;
        newExp -= nextLevelExp;
        nextLevelExp = newLevel * 1000;
        newMaxStamina += 5;
        newStamina = newMaxStamina;
      }

      return {
        ...prev,
        stamina: newStamina,
        exp: newExp,
        money: newMoney,
        fans: newFans,
        level: newLevel,
        maxStamina: newMaxStamina,
        nextLevelExp,
        lastStaminaUpdate: (prev.stamina >= prev.maxStamina && newStamina < newMaxStamina) ? new Date().toISOString() : prev.lastStaminaUpdate
      };
    });

    const newProgress = progress + 10;
    if (newProgress >= 100) {
      setProgress(0);
      localStorage.setItem('workProgress', '0');
    } else {
      setProgress(newProgress);
      localStorage.setItem('workProgress', newProgress.toString());
    }

    // Call API to process work in background
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
        // Sync with server state
        setPlayer(prev => prev ? {
          ...prev,
          stamina: data.stamina,
          maxStamina: data.maxStamina,
          exp: data.exp,
          nextLevelExp: data.level * 1000,
          money: data.coins,
          fans: data.fans,
          level: data.level,
          lastStaminaUpdate: data.lastStaminaUpdate || prev.lastStaminaUpdate
        } : null);

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
      // Small delay to prevent spamming too fast and hitting rate limits
      setTimeout(() => setIsWorking(false), 200);
    }
  };

  const stamina = player?.stamina ?? 0;
  const maxStamina = player?.maxStamina ?? 100;
  const exp = player?.exp ?? 0;
  const nextLevelExp = player?.nextLevelExp ?? 100;
  
  const handleUseItem = async () => {
    try {
      const res = await fetch(`/api/items/use/stamina/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1 })
      });
      if (res.ok) {
        const data = await res.json();
        setPlayer(prev => prev ? { ...prev, stamina: data.stamina, staminaDrinks: data.staminaDrinks } : null);
        setShowItemModal(false);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to use item");
      }
    } catch (e) {
      console.error(e);
    }
  };

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

        {/* Change Partner Button */}
        <button 
          onClick={() => setShowIdolSelection(true)}
          className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 text-white border border-pink-400 rounded-full px-3 py-1 text-[10px] font-bold shadow-md transition-colors backdrop-blur-sm"
        >
          Change Partner
        </button>

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
          disabled={isWorking || stamina < staminaCost}
          className={`absolute -top-12 right-4 w-24 h-24 rounded-full border-4 border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.8)] flex flex-col items-center justify-center transition-transform active:scale-95 ${
            isWorking || stamina < staminaCost ? 'bg-gray-600 border-gray-400 opacity-80' : 'bg-gradient-to-b from-blue-400 to-blue-800'
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
            <button onClick={() => setShowItemModal(true)} className="w-4 h-4 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center text-[12px] font-bold shadow-md leading-none pb-0.5 shrink-0">
              +
            </button>
          </div>
          {timeToNextStamina !== null && stamina < maxStamina && (
            <div className="text-[8px] text-right text-gray-300 -mt-1.5 pr-6">
              Regen in: {Math.floor(timeToNextStamina / 60000)}:{(Math.floor((timeToNextStamina % 60000) / 1000)).toString().padStart(2, '0')}
            </div>
          )}
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

      {/* Item Modal */}
      {showItemModal && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-800 border-2 border-slate-600 rounded-xl p-4 w-full max-w-xs text-center shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Recover Stamina</h3>
            <p className="text-sm text-gray-300 mb-4">Use a Stamina Drink to recover 50 Stamina?</p>
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-2xl border border-slate-500">🍹</div>
              <div className="text-left">
                <div className="text-xs text-gray-400">Owned</div>
                <div className="text-xl font-bold text-white">{player?.staminaDrinks || 0}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowItemModal(false)} className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded font-bold text-white transition-colors">Cancel</button>
              <button 
                onClick={handleUseItem} 
                disabled={!player?.staminaDrinks || player.staminaDrinks <= 0}
                className="flex-1 py-2 bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 rounded font-bold text-white transition-colors"
              >
                Use Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Idol Selection Modal */}
      {(showIdolSelection || workIdol === null) && !previewCard && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-800 to-black border-2 border-pink-400 rounded-xl p-4 w-full max-w-sm text-center shadow-[0_0_20px_rgba(244,114,182,0.3)]">
            <h3 className="text-xl font-bold text-pink-400 mb-2 italic">Select Partner Idol</h3>
            <p className="text-xs text-gray-300 mb-4">Choose an idol from your inventory to accompany you!</p>
            
            <div className="grid grid-cols-4 gap-2 mb-4 max-h-[60vh] overflow-y-auto p-1">
              {player?.inventory?.map(card => (
                <div key={card.id} onClick={() => setPreviewCard(card)} className="cursor-pointer bg-slate-800 border border-slate-600 rounded-lg p-1 flex flex-col items-center hover:border-pink-400 hover:bg-slate-700 transition-colors">
                  <div className="w-14 h-14 bg-white rounded-lg mb-1 overflow-hidden border border-gray-300 shadow-inner flex-shrink-0">
                    <img src={card.icon_url || card.img} alt={card.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[8px] text-white font-bold text-center leading-tight truncate w-full">{card.name}</span>
                </div>
              ))}
            </div>
            
            {workIdol !== null && (
              <button onClick={() => setShowIdolSelection(false)} className="w-full py-2 bg-gray-600 hover:bg-gray-500 rounded font-bold text-white transition-colors">Close</button>
            )}
          </div>
        </div>
      )}

      {/* Floating Popup (Card Preview) */}
      {previewCard && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-2 border-pink-500 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-2 right-2 z-10">
              <button onClick={() => setPreviewCard(null)} className="w-8 h-8 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center font-bold">X</button>
            </div>
            
            <div className="w-full aspect-[2/1] relative bg-black">
              <img src={previewCard.spread_url || previewCard.img} alt={previewCard.name} className="w-full h-full object-cover object-top opacity-90" />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4 pb-2">
                <h2 className="text-2xl font-black text-white italic drop-shadow-md">{previewCard.name}</h2>
                <div className="flex gap-2 text-sm mt-1">
                  <span className={`px-2 py-0.5 rounded text-white font-bold ${previewCard.attribute === 'Cute' ? 'bg-pink-500' : previewCard.attribute === 'Cool' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                    {previewCard.attribute}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-700 text-yellow-300 font-bold">{previewCard.rarity}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">Stats</div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-pink-300">Vocal</span>
                  <span className="text-sm font-bold text-white">{previewCard.atk}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-300">Dance</span>
                  <span className="text-sm font-bold text-white">{previewCard.def}</span>
                </div>
              </div>
              
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">Skill</div>
                <div className="text-sm text-white font-medium leading-tight">
                  {previewCard.passiveSkill ? previewCard.passiveSkill.description : (previewCard.liveSkill ? previewCard.liveSkill.description : "No skill available.")}
                </div>
              </div>
            </div>
            
            <div className="p-4 pt-0">
              <button 
                onClick={confirmSelectIdol}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black py-3 rounded-lg shadow-lg transform transition active:scale-95"
              >
                SELECT PARTNER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
