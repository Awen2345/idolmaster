import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Music, Users, Home, Bird, 
  RefreshCcw, Mic2, Menu, ChevronLeft, X
} from 'lucide-react';
import { NavBtn } from './Shared';
import { MenuOverlay } from './MenuOverlay';
import { Card } from '../types';

export function FormationPage({ onNavigate, initialFormation, onSave, inventory }: { onNavigate: (page: string) => void, initialFormation: (Card | null)[], onSave: (formation: (Card | null)[]) => void, inventory: Card[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formation, setFormation] = useState<(Card | null)[]>(initialFormation);
  const [selectingSlot, setSelectingSlot] = useState<number | null>(null);

  const totalAtk = formation.reduce((sum, card) => sum + (card?.atk || 0), 0);
  const totalDef = formation.reduce((sum, card) => sum + (card?.def || 0), 0);
  const totalCost = formation.reduce((sum, card) => sum + (card?.cost || 0), 0);

  const handleRemove = (index: number) => {
    const newFormation = [...formation];
    newFormation[index] = null;
    setFormation(newFormation);
  };

  const handleSelectCard = (card: Card) => {
    if (selectingSlot !== null) {
      const newFormation = [...formation];
      newFormation[selectingSlot] = card;
      setFormation(newFormation);
      setSelectingSlot(null);
    }
  };

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
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 font-bold text-sm shadow-inner relative border-b-2 border-green-700">
          <Users size={16} className="absolute left-4 top-2 opacity-80" />
          Unit Formation
          <Users size={16} className="absolute right-4 top-2 opacity-80" />
        </div>

        {/* Total Stats */}
        <div className="bg-gray-100 p-3 flex justify-between border-b border-gray-300 shadow-sm">
          <div className="flex flex-col items-center flex-1 border-r border-gray-300">
            <span className="text-[10px] font-bold text-gray-500">Total Atk</span>
            <span className="text-lg font-black text-red-500">{totalAtk.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center flex-1 border-r border-gray-300">
            <span className="text-[10px] font-bold text-gray-500">Total Def</span>
            <span className="text-lg font-black text-blue-500">{totalDef.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] font-bold text-gray-500">Total Cost</span>
            <span className="text-lg font-black text-purple-600">{totalCost}</span>
          </div>
        </div>

        {/* Formation Slots */}
        <div className="flex-1 overflow-y-auto bg-gray-200 p-2 space-y-2 relative">
          {formation.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-300 flex overflow-hidden h-24">
              {/* Slot Number */}
              <div className="bg-gradient-to-b from-gray-700 to-gray-900 text-white w-6 flex items-center justify-center font-black text-sm border-r border-gray-400">
                {index + 1}
              </div>
              
              {card ? (
                <>
                  {/* Card Image */}
                  <div className="w-20 h-24 relative border-r border-gray-200">
                    <img src={card.img} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className={`absolute bottom-0 left-0 right-0 text-[8px] text-center py-0.5 font-bold ${
                      card.rarity === 'SSR' ? 'bg-pink-500 text-white' : 
                      card.rarity === 'SR' ? 'bg-yellow-500 text-white' : 
                      'bg-gray-500 text-white'
                    }`}>
                      {card.rarity}
                    </div>
                  </div>
                  
                  {/* Card Info */}
                  <div className="flex-1 p-2 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-gray-800">{card.name}</span>
                      <div className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-purple-300">
                        Cost {card.cost}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-1">
                      <div className="flex-1 bg-red-50 rounded px-1 py-0.5 border border-red-100 flex justify-between items-center">
                        <span className="text-[10px] text-red-500 font-bold">Atk</span>
                        <span className="text-xs text-red-600 font-black">{card.atk.toLocaleString()}</span>
                      </div>
                      <div className="flex-1 bg-blue-50 rounded px-1 py-0.5 border border-blue-100 flex justify-between items-center">
                        <span className="text-[10px] text-blue-500 font-bold">Def</span>
                        <span className="text-xs text-blue-600 font-black">{card.def.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-1 flex justify-end gap-1">
                      <button onClick={() => handleRemove(index)} className="bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 rounded px-3 py-1 text-[10px] font-bold text-gray-700 shadow-sm hover:brightness-95">
                        Remove
                      </button>
                      <button onClick={() => setSelectingSlot(index)} className="bg-gradient-to-b from-pink-400 to-pink-600 border border-pink-700 rounded px-3 py-1 text-[10px] font-bold text-white shadow-sm hover:brightness-110">
                        Change
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 border-dashed border-2 border-gray-300 m-2 rounded-lg">
                  <button onClick={() => setSelectingSlot(index)} className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl font-bold">+</span>
                    </div>
                    <span className="font-bold text-sm">Empty Slot</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back to My Studio */}
        <div className="flex bg-gray-800 text-white border-t border-gray-600">
          <div 
            onClick={() => onNavigate('main')}
            className="flex-1 p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-700 border-r border-gray-600"
          >
            <ChevronLeft size={20} className="text-yellow-500" />
            <span className="font-bold text-sm">Cancel</span>
          </div>
          <div 
            onClick={() => onSave(formation)}
            className="flex-1 p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-700 bg-blue-900"
          >
            <span className="font-bold text-sm text-yellow-400">Save Formation</span>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />}
          {selectingSlot !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/80 flex flex-col p-4"
            >
              <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 flex justify-between items-center">
                  <h3 className="text-white font-bold">Select Card</h3>
                  <button onClick={() => setSelectingSlot(null)} className="text-white hover:text-pink-200">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-100">
                  {inventory.map((card, idx) => {
                    const isEquipped = formation.some((c, i) => c?.id === card.id && i !== selectingSlot);
                    return (
                      <div 
                        key={`${card.id}-${idx}`} 
                        className={`bg-white rounded-lg shadow-sm border flex overflow-hidden h-20 relative ${isEquipped ? 'opacity-50 cursor-not-allowed border-gray-300' : 'cursor-pointer hover:border-pink-400 border-gray-200'}`} 
                        onClick={() => !isEquipped && handleSelectCard(card)}
                      >
                        {isEquipped && (
                          <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                            <span className="bg-red-600 text-white font-bold text-xs px-2 py-1 rounded shadow-md transform -rotate-12">EQUIPPED</span>
                          </div>
                        )}
                        <div className="w-16 h-20 relative border-r border-gray-200">
                          <img src={card.img} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className={`absolute top-0 left-0 text-[8px] font-black px-1 rounded-br ${
                            card.rarity === 'SSR' ? 'bg-pink-500 text-white' : 
                            card.rarity === 'SR' ? 'bg-yellow-500 text-white' : 
                            'bg-gray-500 text-white'
                          }`}>
                            {card.rarity}
                          </div>
                        </div>
                        <div className="flex-1 p-2 flex flex-col justify-center">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-gray-800">{card.name}</span>
                            <span className="text-[10px] text-purple-600 font-bold">Cost {card.cost}</span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] text-red-500 font-bold">Atk: {card.atk}</span>
                            <span className="text-[10px] text-blue-500 font-bold">Def: {card.def}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
