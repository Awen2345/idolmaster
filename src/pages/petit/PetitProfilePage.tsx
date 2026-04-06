import React from 'react';
import { ChevronLeft, User, Heart } from 'lucide-react';

export function PetitProfilePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-purple-500 text-white p-3 text-center font-bold flex items-center justify-between">
          <button onClick={() => onNavigate('petit')} className="p-1"><ChevronLeft /></button>
          <span>Petit Profile</span>
          <User size={20} />
        </div>
        <div className="flex-1 p-4 bg-purple-50 flex flex-col items-center">
          <div className="w-32 h-32 bg-white rounded-full border-4 border-purple-300 shadow-lg mb-4 overflow-hidden">
             <img src="https://picsum.photos/seed/chibi/200/300" className="w-full h-full object-cover" alt="Petit Character" />
          </div>
          <h2 className="text-2xl font-black text-purple-700 mb-1">Temptation Evil</h2>
          <p className="text-purple-500 font-bold mb-6">Level 15</p>
          
          <div className="w-full bg-white rounded-xl shadow-md p-4 space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-bold">Vocal</span>
              <span className="text-pink-500 font-black">4500</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-bold">Dance</span>
              <span className="text-blue-500 font-black">3200</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500 font-bold">Visual</span>
              <span className="text-yellow-500 font-black">5100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold flex items-center gap-1"><Heart size={16} className="text-red-500"/> Affection</span>
              <span className="text-red-500 font-black">MAX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
