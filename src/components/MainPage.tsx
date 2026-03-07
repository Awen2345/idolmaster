import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Music, Gift, Users, Lightbulb, 
  Menu, Home, Bird, RefreshCcw, Mic2, Coins
} from 'lucide-react';
import { NavBtn, StatusBox, StatusBar } from './Shared';
import { MenuOverlay } from './MenuOverlay';
import { PromoCodeModal } from './PromoCodeModal';
import { FloatingPromoButton } from './FloatingPromoButton';
import { Card, UserState } from '../types';

export function MainPage({ onNavigate, formation, userState, userId, onRefresh }: { onNavigate: (page: string) => void, formation: (Card | null)[], userState: UserState | null, userId: number, onRefresh: () => void }) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

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
            <span className="text-xs font-mono font-bold text-yellow-100">{userState.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-gray-600">
            <Star size={14} className="text-pink-400" fill="currentColor" />
            <span className="text-xs font-mono font-bold text-pink-100">{userState.starJewels.toLocaleString()}</span>
          </div>
        </div>

        {/* Speech Bubble Area */}
        <div className="p-3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-cyan-100 relative z-10 shadow-inner flex gap-2">
          <div className="bg-white rounded-xl border-4 border-orange-400 p-3 relative shadow-md flex-1">
            <p className="font-bold text-gray-800 text-sm">Any pose is totally OK!</p>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-orange-400"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white"></div>
            <Star className="absolute right-2 bottom-2 text-yellow-400" size={16} fill="currentColor" />
            <Star className="absolute right-6 bottom-4 text-yellow-300" size={12} fill="currentColor" />
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
                onClick={() => setSelectedCard(isSelected ? null : index)}
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
                    <div className="text-yellow-400 font-black italic text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)] self-end w-full text-right pr-2">
                      {card.rarity}
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
          <StatusBar label="Work" subLabel="Stamina" value={`${userState.stamina} / ${userState.maxStamina}`} color="bg-pink-500" />
          <StatusBar label="LIVE Battle" subLabel="Atk Cost" value="2 / 455" color="bg-blue-500" />
          <div onClick={() => onNavigate('formation')} className="flex-1">
            <StatusBox text="Formation" icon={<Users size={16} />} color="bg-green-500" flex />
          </div>
          <StatusBox icon={<Lightbulb size={24} className="text-yellow-300" fill="currentColor"/>} value="1" color="bg-amber-600" rounded />
        </div>

        {/* Banner */}
        <div className="p-2 bg-slate-900 flex-1 flex items-center justify-center relative z-10">
          <div onClick={() => onNavigate('gacha')} className="w-full h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] flex items-center justify-center overflow-hidden relative cursor-pointer">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-white font-black text-xl drop-shadow-md tracking-wider">Idol Produce</h3>
              <p className="text-yellow-300 font-bold text-sm drop-shadow-md">the 5th Anniversary</p>
              <div className="bg-black/60 text-white text-xs px-2 py-1 rounded mt-1 inline-block border border-white/30">
                Until Round Ends <span className="text-yellow-400 font-bold">Remaining 20:48:15</span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />}
        </AnimatePresence>

        <FloatingPromoButton onClick={() => setIsPromoOpen(true)} />
        <AnimatePresence>
          {isPromoOpen && (
            <PromoCodeModal 
              onClose={() => setIsPromoOpen(false)} 
              userId={userId} 
              onSuccess={() => {
                onRefresh();
                // Optional: Close modal on success or keep it open for more codes?
                // Usually keep it open so they can enter more.
              }} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
