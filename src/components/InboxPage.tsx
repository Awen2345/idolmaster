import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Bird, Mic2, Music, RefreshCcw, Menu, ChevronLeft, Gift, Star, CheckCircle
} from 'lucide-react';
import { NavBtn } from './Shared';
import { MenuOverlay } from './MenuOverlay';

type Reward = {
  id: number;
  title: string;
  description: string;
  date: string;
  claimed: boolean;
};

export function InboxPage({ onNavigate, userId }: { onNavigate: (page: string) => void, userId: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    fetch(`/api/inbox/${userId}`)
      .then(res => res.json())
      .then(data => setRewards(data))
      .catch(err => console.error("Failed to fetch inbox", err));
  }, [userId]);

  const handleClaim = async (id: number) => {
    setIsClaiming(true);
    try {
      const res = await fetch(`/api/inbox/claim/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardIds: [id] })
      });
      const data = await res.json();
      if (data.success) {
        setRewards(rewards.map(r => r.id === id ? { ...r, claimed: true } : r));
      }
    } catch (err) {
      console.error("Failed to claim", err);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClaimAll = async () => {
    const unclaimed = rewards.filter(r => !r.claimed).map(r => r.id);
    if (unclaimed.length === 0) return;
    
    setIsClaiming(true);
    try {
      const res = await fetch(`/api/inbox/claim/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardIds: unclaimed })
      });
      const data = await res.json();
      if (data.success) {
        setRewards(rewards.map(r => ({ ...r, claimed: true })));
      }
    } catch (err) {
      console.error("Failed to claim all", err);
    } finally {
      setIsClaiming(false);
    }
  };

  const unclaimedCount = rewards.filter(r => !r.claimed).length;

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
          <div onClick={() => onNavigate('gacha')}>
            <NavBtn icon={<Mic2 size={20} />} label="Gacha" color="from-green-400 to-green-600" />
          </div>
          <NavBtn icon={<Music size={20} />} label="Lesson" color="from-purple-400 to-purple-600" />
          <NavBtn icon={<RefreshCcw size={20} />} label="Free Trade" color="from-orange-400 to-red-500" />
          <div onClick={() => setIsMenuOpen(true)}>
            <NavBtn icon={<Menu size={20} />} label="Menu" color="from-pink-500 to-rose-600" rounded />
          </div>
        </header>

        {/* Sub Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-center py-2 font-bold text-sm shadow-inner relative border-b-2 border-pink-700">
          <Gift size={16} className="absolute left-4 top-2 opacity-80" />
          Presents
          <Gift size={16} className="absolute right-4 top-2 opacity-80" />
        </div>

        {/* Claim All Bar */}
        <div className="bg-gray-100 p-3 flex justify-between items-center border-b border-gray-300 shadow-sm">
          <div className="font-bold text-sm text-gray-700">
            Unclaimed: <span className="text-pink-600">{unclaimedCount}</span>
          </div>
          <button 
            onClick={handleClaimAll}
            disabled={unclaimedCount === 0 || isClaiming}
            className="bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-1.5 rounded font-bold text-xs shadow-md border border-blue-700 disabled:border-gray-600 transition-colors"
          >
            Claim All
          </button>
        </div>

        {/* Rewards List */}
        <div className="flex-1 overflow-y-auto bg-gray-200 p-2 space-y-2">
          {rewards.map(reward => (
            <div key={reward.id} className={`bg-white rounded-lg shadow-sm border ${reward.claimed ? 'border-gray-200 opacity-60' : 'border-pink-300'} p-3 flex items-center gap-3`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${reward.claimed ? 'bg-gray-100' : 'bg-pink-100'}`}>
                {reward.claimed ? <CheckCircle size={24} className="text-gray-400" /> : <Gift size={24} className="text-pink-500" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`font-bold text-sm ${reward.claimed ? 'text-gray-500' : 'text-gray-800'}`}>{reward.title}</h4>
                  <span className="text-[10px] text-gray-400">{reward.date}</span>
                </div>
                <p className={`text-xs mt-1 ${reward.claimed ? 'text-gray-400' : 'text-pink-600 font-bold'}`}>{reward.description}</p>
              </div>
              {!reward.claimed && (
                <button 
                  onClick={() => handleClaim(reward.id)}
                  disabled={isClaiming}
                  className="bg-gradient-to-b from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white px-3 py-1.5 rounded font-bold text-xs shadow-sm border border-pink-700 transition-colors"
                >
                  Claim
                </button>
              )}
            </div>
          ))}
          {rewards.length === 0 && (
            <div className="text-center text-gray-500 font-bold py-8">
              No presents available.
            </div>
          )}
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
        </AnimatePresence>
      </div>
    </div>
  );
}
