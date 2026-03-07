import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Bird, Mic2, Music, RefreshCcw, Menu, ChevronLeft, Star, Info, X, Coins
} from 'lucide-react';
import { NavBtn } from './Shared';
import { MenuOverlay } from './MenuOverlay';
import { Card, UserState } from '../types';

export function GachaPage({ onNavigate, userState, setUserState, userId }: { onNavigate: (page: string) => void, userState: UserState, setUserState: React.Dispatch<React.SetStateAction<UserState | null>>, userId: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsPage, setDetailsPage] = useState<1 | 2>(1);
  const [activeBanner, setActiveBanner] = useState<'limited' | 'permanent'>('limited');
  const [pullResults, setPullResults] = useState<Card[] | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [gachaConfig, setGachaConfig] = useState<any>(null);
  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    fetch('/api/gacha/config')
      .then(res => res.json())
      .then(data => setGachaConfig(data))
      .catch(err => console.error("Failed to fetch gacha config", err));

    fetch('/api/cards/available')
      .then(res => res.json())
      .then(data => setAvailableCards(data))
      .catch(err => console.error("Failed to fetch available cards", err));
  }, []);

  useEffect(() => {
    if (gachaConfig && gachaConfig.limited && gachaConfig.limited.endDate) {
      const interval = setInterval(() => {
        const end = new Date(gachaConfig.limited.endDate).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        if (diff <= 0) {
          setTimeLeft("Ended");
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gachaConfig]);

  const performPull = async (count: number) => {
    const cost = count * 250;
    if (userState.starJewels < cost) {
      alert("Not enough Star Jewels!");
      return;
    }

    setIsPulling(true);
    
    try {
      const res = await fetch(`/api/gacha/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, bannerType: activeBanner })
      });
      const data = await res.json();

      if (data.success) {
        setTimeout(() => {
          setUserState(prev => prev ? ({
            ...prev,
            starJewels: prev.starJewels - cost,
            inventory: [...prev.inventory, ...data.newCards]
          }) : null);
          
          setPullResults(data.newCards);
          setIsPulling(false);
        }, 1500);
      } else {
        alert(data.error || "Gacha failed");
        setIsPulling(false);
      }
    } catch (err) {
      console.error("Gacha error", err);
      alert("Network error. Please try again.");
      setIsPulling(false);
    }
  };

  const currentBanner = gachaConfig ? gachaConfig[activeBanner] : null;

  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-gradient-to-b from-blue-800 to-blue-950 p-1 border-b-2 border-blue-400 shadow-md z-20">
          <div onClick={() => onNavigate('main')}>
            <NavBtn icon={<Home size={20} />} label="My Studio" color="from-blue-400 to-blue-600" />
          </div>
          <div onClick={() => onNavigate('petit')}>
            <NavBtn icon={<Bird size={20} />} label="Petit CG" color="from-orange-300 to-orange-500" />
          </div>
          <NavBtn icon={<Mic2 size={20} />} label="Gacha" color="from-green-400 to-green-600" />
          <NavBtn icon={<Music size={20} />} label="Lesson" color="from-purple-400 to-purple-600" />
          <NavBtn icon={<RefreshCcw size={20} />} label="Free Trade" color="from-orange-400 to-red-500" />
          <div onClick={() => setIsMenuOpen(true)}>
            <NavBtn icon={<Menu size={20} />} label="Menu" color="from-pink-500 to-rose-600" rounded />
          </div>
        </header>

        {/* Currency Bar */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 py-1.5 flex justify-between items-center border-b border-gray-700 shadow-inner z-10">
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-gray-600">
            <Coins size={14} className="text-yellow-400" />
            <span className="text-xs font-mono font-bold text-yellow-100">{userState.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-gray-600">
            <Star size={14} className="text-pink-400" fill="currentColor" />
            <span className="text-xs font-mono font-bold text-pink-100">{userState.starJewels.toLocaleString()}</span>
          </div>
        </div>

        {/* Sub Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 font-bold text-sm shadow-inner relative border-b-2 border-green-700">
          <Mic2 size={16} className="absolute left-4 top-2 opacity-80" />
          Gacha
          <Mic2 size={16} className="absolute right-4 top-2 opacity-80" />
        </div>

        {/* Banner Tabs */}
        <div className="flex bg-gray-200 border-b border-gray-300">
          <div 
            onClick={() => setActiveBanner('limited')}
            className={`flex-1 py-2 text-center font-bold text-sm cursor-pointer transition-colors ${activeBanner === 'limited' ? 'bg-white text-pink-600 border-t-4 border-pink-500' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Limited Time
          </div>
          <div 
            onClick={() => setActiveBanner('permanent')}
            className={`flex-1 py-2 text-center font-bold text-sm cursor-pointer transition-colors ${activeBanner === 'permanent' ? 'bg-white text-blue-600 border-t-4 border-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Permanent
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-100 relative">
          {/* Banner Image */}
          <div className="relative h-48 w-full bg-black overflow-hidden">
            {currentBanner ? (
              <>
                <img src={currentBanner.bannerImg} alt={currentBanner.title} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <h2 className={`text-white font-black text-xl italic drop-shadow-[0_2px_2px_rgba(0,0,0,1)] ${activeBanner === 'limited' ? 'text-pink-300' : 'text-blue-300'}`}>
                    {currentBanner.title}
                  </h2>
                  <p className="text-white text-xs font-bold drop-shadow-md">{currentBanner.description}</p>
                  {activeBanner === 'limited' && timeLeft && (
                     <div className="text-yellow-300 text-xs font-mono font-bold mt-1">
                       Ends in: {timeLeft}
                     </div>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>
            )}
            <button 
              onClick={() => setShowDetails(true)}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
            >
              <Info size={20} />
            </button>
          </div>

          {/* Gacha Buttons */}
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center">
              <h3 className="font-bold text-gray-800 mb-2">Single Pull</h3>
              <p className="text-xs text-gray-500 mb-3">Requires 250 Star Jewels</p>
              <button 
                onClick={() => performPull(1)}
                disabled={isPulling || userState.starJewels < 250}
                className="w-full py-3 bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-bold shadow-md border border-blue-700 disabled:border-gray-600 flex items-center justify-center gap-2 transition-all"
              >
                {isPulling ? <RefreshCcw className="animate-spin" size={18} /> : <Star size={18} className="text-yellow-300" fill="currentColor" />}
                Pull 1x
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">SR Guaranteed!</div>
              <h3 className="font-bold text-gray-800 mb-2">10-Part Pull</h3>
              <p className="text-xs text-gray-500 mb-3">Requires 2500 Star Jewels</p>
              <button 
                onClick={() => performPull(10)}
                disabled={isPulling || userState.starJewels < 2500}
                className="w-full py-3 bg-gradient-to-b from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-bold shadow-md border border-pink-800 disabled:border-gray-600 flex items-center justify-center gap-2 transition-all"
              >
                {isPulling ? <RefreshCcw className="animate-spin" size={18} /> : <Star size={18} className="text-yellow-300" fill="currentColor" />}
                Pull 10x
              </button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex bg-gray-800 text-white border-t border-gray-600">
          <div 
            onClick={() => onNavigate('main')}
            className="flex-1 p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-700"
          >
            <ChevronLeft size={20} className="text-yellow-500" />
            <span className="font-bold text-sm">To My Studio</span>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />}
          
          {/* Pull Results Modal */}
          {pullResults && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/90 flex flex-col p-4 items-center justify-center"
            >
              <h2 className="text-white font-black text-2xl mb-6 italic drop-shadow-[0_2px_2px_rgba(236,72,153,0.8)] text-pink-400">
                Gacha Results!
              </h2>
              
              <div className={`grid gap-3 w-full max-w-sm ${pullResults.length === 1 ? 'grid-cols-1 place-items-center' : 'grid-cols-5'}`}>
                {pullResults.map((card, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    className={`relative rounded overflow-hidden border-2 ${
                      card.rarity === 'SSR' ? 'border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.8)]' : 
                      card.rarity === 'SR' ? 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]' : 
                      'border-gray-400'
                    } ${pullResults.length === 1 ? 'w-64' : 'w-full'}`}
                  >
                    <img src={card.img} alt={card.name} className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[8px] text-center py-0.5 font-bold truncate px-1">
                      {card.name}
                    </div>
                    <div className={`absolute top-0 left-0 text-[10px] font-black px-1 rounded-br ${
                      card.rarity === 'SSR' ? 'bg-pink-500 text-white' : 
                      card.rarity === 'SR' ? 'bg-yellow-500 text-white' : 
                      'bg-gray-500 text-white'
                    }`}>
                      {card.rarity}
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => setPullResults(null)}
                className="mt-8 bg-gradient-to-b from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg border-2 border-blue-400 hover:brightness-110 transition-all"
              >
                OK
              </button>
            </motion.div>
          )}

          {/* Gacha Details Modal */}
          {showDetails && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/80 flex flex-col p-4"
            >
              <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 flex justify-between items-center">
                  <h3 className="text-white font-bold">Gacha Details</h3>
                  <button onClick={() => setShowDetails(false)} className="text-white hover:text-blue-200">
                    <X size={24} />
                  </button>
                </div>
                
                {/* Details Tabs */}
                <div className="flex bg-gray-200 border-b border-gray-300">
                  <div 
                    onClick={() => setDetailsPage(1)}
                    className={`flex-1 py-2 text-center font-bold text-xs cursor-pointer transition-colors ${detailsPage === 1 ? 'bg-white text-blue-600 border-t-2 border-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    Appearance Rates
                  </div>
                  <div 
                    onClick={() => setDetailsPage(2)}
                    className={`flex-1 py-2 text-center font-bold text-xs cursor-pointer transition-colors ${detailsPage === 2 ? 'bg-white text-blue-600 border-t-2 border-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    Available Cards
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 p-3">
                  {detailsPage === 1 ? (
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800 border-b border-gray-300 pb-1">Rarity Rates</h4>
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 text-left">Rarity</th>
                            <th className="border border-gray-300 p-2 text-right">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-2 font-bold text-pink-600">SSR</td>
                            <td className="border border-gray-300 p-2 text-right font-mono">
                              {currentBanner?.rates?.SSR?.toFixed(3)}%
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2 font-bold text-yellow-600">SR</td>
                            <td className="border border-gray-300 p-2 text-right font-mono">
                              {currentBanner?.rates?.SR?.toFixed(3)}%
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2 font-bold text-blue-600">R</td>
                            <td className="border border-gray-300 p-2 text-right font-mono">
                              {currentBanner?.rates?.R?.toFixed(3)}%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="text-[10px] text-gray-500 mt-2">
                        * Rates are rounded to 3 decimal places. The actual total may not be exactly 100%.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800 border-b border-gray-300 pb-1">Card List & Stats</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {availableCards.map(card => (
                          <div key={card.id} className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                            {/* Card Image matching original aspect ratio */}
                            <div className="w-full relative bg-black">
                              <img src={card.img} alt={card.name} className="w-full h-auto object-cover" referrerPolicy="no-referrer" loading="lazy" />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-1">
                                <div className="font-bold truncate">{card.name}</div>
                              </div>
                            </div>
                            <div className="p-1.5 bg-gray-50 flex flex-col gap-0.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-bold text-purple-600">Cost {card.cost}</span>
                                <span className={`text-[8px] font-bold ${
                                  card.rarity === 'SSR' ? 'text-pink-600' : 
                                  card.rarity === 'SR' ? 'text-yellow-600' : 
                                  'text-blue-600'
                                }`}>{card.rarity}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] text-red-500 font-bold">Atk</span>
                                <span className="text-[9px] font-mono">{card.atk}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] text-blue-500 font-bold">Def</span>
                                <span className="text-[9px] font-mono">{card.def}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
