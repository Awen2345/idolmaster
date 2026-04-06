import React from 'react';
import { ChevronLeft, Shirt } from 'lucide-react';

export function PetitOutfitSettingsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-pink-400 text-white p-3 text-center font-bold flex items-center justify-between">
          <button onClick={() => onNavigate('petit')} className="p-1"><ChevronLeft /></button>
          <span>Outfit Settings</span>
          <Shirt size={20} />
        </div>
        <div className="flex-1 p-4 bg-pink-50 flex flex-col">
          <div className="h-48 bg-white rounded-xl shadow-inner border border-slate-200 mb-4 flex items-center justify-center">
             <img src="https://picsum.photos/seed/chibi/200/300" className="h-40 object-contain" alt="Petit Character" />
          </div>
          
          <div className="flex-1 bg-white rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {['Tops', 'Bottoms', 'Dresses', 'Accessories', 'Shoes'].map(cat => (
                <button key={cat} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 whitespace-nowrap hover:bg-pink-100 hover:text-pink-600">
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square bg-slate-50 rounded border border-slate-200 flex items-center justify-center cursor-pointer hover:border-pink-400">
                  <span className="text-slate-400 text-[10px]">Item {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
