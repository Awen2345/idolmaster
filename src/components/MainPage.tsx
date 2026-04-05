import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Music, Gift, Users, Lightbulb, 
  Menu, Home, Bird, RefreshCcw, Mic2, Coins, Calendar, PlayCircle
} from 'lucide-react';
import { NavBtn, StatusBox, StatusBar } from './Shared';
import { MenuOverlay } from './MenuOverlay';
import { Card, UserState } from '../types';
import { FloatingPromoButton } from './FloatingPromoButton';
import { PromoCodeModal } from './PromoCodeModal';

export function MainPage({ onNavigate, formation, userState, userId, onRefresh }: { onNavigate: (page: string) => void, formation: (Card | null)[], userState: UserState | null, userId: number, onRefresh: () => void }) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [loginBonus, setLoginBonus] = useState<any>(null);
  const [voiceData, setVoiceData] = useState<any[]>([]);
  const [currentVoice, setCurrentVoice] = useState<{text: string, file: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/data/cards_voice.json')
      .then(res => res.json())
      .then(data => setVoiceData(data))
      .catch(err => console.error("Failed to load voice data", err));
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`/api/login-bonus/${userId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'claimed') {
            setLoginBonus(data);
            onRefresh();
          }
        })
        .catch(err => console.error("Failed to claim login bonus", err));
    }
  }, [userId]);

  const handleCardClick = (index: number, card: Card) => {
    if (selectedCard === index) {
      setSelectedCard(null);
      setCurrentVoice(null);
    } else {
      setSelectedCard(index);
      const cardVoiceData = voiceData.find(v => v.id === card.id);
      if (cardVoiceData && cardVoiceData.voice_lines.length > 0) {
        const randomLine = cardVoiceData.voice_lines[Math.floor(Math.random() * cardVoiceData.voice_lines.length)];
        setCurrentVoice(randomLine);
        
        // Auto play voice
        if (audioRef.current) {
          audioRef.current.src = randomLine.file;
          audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
        }
      } else {
        setCurrentVoice({ text: `Hello, I'm ${card.name}!`, file: '' });
      }
    }
  };

  // Filter out nulls to display only assigned cards
  const cards = formation.filter((c): c is Card => c !== null);

  if (!userState) return null;

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-blue-900 relative overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-gradient-to-b from-blue-800 to-blue-950 p-1 border-b-2 border-blue-400 shadow-md z-20">
          <NavBtn icon={<Home size={20} />} label="My Studio" color="from-blue-400 to-blue-600" />
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

        {/* Currency Bar */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 py-1.5 flex justify-between items-center border-b border-gray-700 shadow-inner z-10">
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-gray-600">
            <Coins size={14} className="text-yellow-400" />
            <span className="text-xs font-mono font-bold text-yellow-100">{(userState?.coins ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-gray-600">
            <Star size={14} className="text-pink-400" fill="currentColor" />
            <span className="text-xs font-mono font-bold text-pink-100">{(userState?.starJewels ?? 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Speech Bubble Area */}
        <div className="p-3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-cyan-100 relative z-10 shadow-inner flex gap-2">
          <div className="bg-white rounded-xl border-4 border-orange-400 p-3 relative shadow-md flex-1 flex items-center justify-between">
            <p className="font-bold text-gray-800 text-sm flex-1">
              {currentVoice ? currentVoice.text : "Tap a card to hear my voice!"}
            </p>
            {currentVoice && currentVoice.file && (
              <button 
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
                  }
                }}
                className="ml-2 text-orange-500 hover:text-orange-600 transition-colors"
              >
                <PlayCircle size={28} />
              </button>
            )}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-orange-400"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white"></div>
            <Star className="absolute right-2 bottom-2 text-yellow-400 opacity-50" size={16} fill="currentColor" />
            <Star className="absolute right-6 bottom-4 text-yellow-300 opacity-50" size={12} fill="currentColor" />
          </div>
          
          <div className="flex flex-col gap-1 w-20">
            <div onClick={() => onNavigate('formation')} className="bg-gradient-to-b from-blue-400 to-blue-600 rounded border border-blue-700 p-1 flex flex-col items-center justify-center cursor-pointer shadow-sm hover:brightness-110">
              <Users size={14} className="text-white mb-0.5" />
              <span className="text-[8px] font-bold text-white text-center leading-tight">Def Formation</span>
            </div>
            <div onClick={() => onNavigate('petit')} className="bg-gradient-to-b from-orange-400 to-orange-600 rounded border border-orange-700 p-1 flex flex-col items-center justify-center cursor-pointer shadow-sm hover:brightness-110">
              <Bird size={14} className="text-white mb-0.5" />
              <span className="text-[8px] font-bold text-white text-center leading-tight">Petit Bird</span>
            </div>
          </div>
        </div>

        {/* Cards Area (Curtain Effect) */}
        <div className="flex-1 flex w-full relative bg-black overflow-hidden min-h-[300px]">
          {cards.length > 0 ? cards.map((card, index) => {
            const isSelected = selectedCard === index;
            const isHidden = selectedCard !== null && selectedCard !== index;
            
            return (
              <motion.div
                key={`${card.id}-${index}`}
                layout
                onClick={() => handleCardClick(index, card)}
                className="relative cursor-pointer overflow-hidden border-r border-yellow-500/30 last:border-r-0 flex-shrink-0"
                initial={false}
                animate={{
                  flex: isSelected ? "1 0 100%" : isHidden ? "0 0 0%" : "1 1 20%",
                  opacity: isHidden ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.8 }}
              >
                <img 
                  src={card.img} 
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={`Card ${index}`}
                  referrerPolicy="no-referrer"
                />
                {/* Card Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
                  animate={{ opacity: isHidden ? 0 : 1 }}
                />
                
                {/* Rarity & Name */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-2 flex flex-col justify-end h-full pointer-events-none"
                  animate={{ opacity: isHidden ? 0 : 1 }}
                >
                  <div className="absolute top-2 left-2">
                    <Star className="text-yellow-400 drop-shadow-[0_0_2px_rgba(0,0,0,1)]" size={24} fill="currentColor" />
                  </div>
                  
                  <div className="flex items-end justify-between w-full">
                    <div className="transform -rotate-90 origin-bottom-left absolute bottom-8 left-6 text-white font-black tracking-widest text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,1)] whitespace-nowrap">
                      {card.name}
                    </div>
                    <div className="flex flex-col items-end w-full pr-2">
                      <div className="text-yellow-400 font-black italic text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                        {card.rarity}
                      </div>
                      {card.passiveSkill && (
                        <div className="mt-1 text-[10px] bg-indigo-900/80 text-indigo-200 px-2 py-1 rounded border border-indigo-500/50 shadow-md max-w-[150px] text-right" title={card.passiveSkill.description}>
                          <span className="font-bold">{
                            card.passiveSkill.type === 'exp_boost' ? 'EXP Boost' :
                            card.passiveSkill.type === 'money_boost' ? 'Money Boost' :
                            card.passiveSkill.type === 'fan_boost' ? 'Fan Boost' :
                            card.passiveSkill.type === 'stamina_reduction' ? 'Stamina Red.' : 'Skill'
                          }:</span> {card.passiveSkill.value}%
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          }) : (
            <div className="flex-1 flex items-center justify-center text-white/50 font-bold">
              No cards in formation
            </div>
          )}
        </div>

        {/* Status Panel */}
        <div className="bg-gradient-to-b from-cyan-200 to-blue-500 p-2 flex gap-1 justify-between items-stretch shadow-[0_-5px_15px_rgba(0,0,0,0.5)] relative z-20">
          <div onClick={() => onNavigate('inbox')}>
            <StatusBox icon={<Gift size={24} />} value="421" color="bg-pink-600" rounded />
          </div>
          <StatusBox text="Lesson & Training" color="bg-purple-600" flex />
          <div onClick={() => onNavigate('work')} className="flex-1 flex">
            <StatusBar label="Work" subLabel="Stamina" value={`${userState?.stamina ?? 0} / ${userState?.maxStamina ?? 0}`} color="bg-pink-500" />
          </div>
          <div onClick={() => onNavigate('live')} className="flex-1 flex cursor-pointer hover:brightness-110">
            <StatusBar label="LIVE Battle" subLabel="Atk Cost" value="2 / 455" color="bg-blue-500" />
          </div>
          <div onClick={() => onNavigate('formation')} className="flex-1">
            <StatusBox text="Formation" icon={<Users size={16} />} color="bg-green-500" flex />
          </div>
          <StatusBox icon={<Lightbulb size={24} className="text-yellow-300" fill="currentColor"/>} value="1" color="bg-amber-600" rounded />
        </div>

        {/* Banner */}
        <div className="p-2 bg-slate-900 flex-1 flex items-center justify-center relative z-10">
          <div onClick={() => onNavigate('events')} className="w-full h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] flex items-center justify-center overflow-hidden relative cursor-pointer hover:brightness-110 transition-all">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-white font-black text-xl drop-shadow-md tracking-wider">Event Hub</h3>
              <p className="text-yellow-300 font-bold text-sm drop-shadow-md">Join active events!</p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />}
        </AnimatePresence>

        {/* Promo Code Feature */}
        <FloatingPromoButton onClick={() => setIsPromoModalOpen(true)} />
        <PromoCodeModal 
          isOpen={isPromoModalOpen} 
          onClose={() => setIsPromoModalOpen(false)} 
          userId={userId}
          onRedeemSuccess={() => {
            onRefresh();
          }}
        />

        {/* Hidden Audio Element */}
        <audio ref={audioRef} />

        {/* Login Bonus Popup */}
        <AnimatePresence>
          {loginBonus && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-b from-blue-600 to-indigo-900 rounded-2xl border-4 border-yellow-400 p-6 w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-white drop-shadow-md italic tracking-wider mb-2">LOGIN BONUS</h2>
                  
                  <div className="bg-black/40 rounded-xl p-4 mb-4 border border-blue-400">
                    <div className="text-yellow-300 font-bold mb-1">Day {loginBonus.record.consecutive_days}</div>
                    <div className="flex justify-center items-center gap-2 text-2xl font-black text-white">
                      {loginBonus.reward.type === 'jewels' ? <Star className="text-pink-400" fill="currentColor" size={32} /> : <Coins className="text-yellow-400" size={32} />}
                      +{loginBonus.reward.amount}
                    </div>
                  </div>
                  
                  <p className="text-blue-200 text-sm mb-6">Log in every day for more rewards!</p>
                  
                  <button 
                    onClick={() => setLoginBonus(null)}
                    className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:brightness-110 w-full"
                  >
                    CLAIM
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
