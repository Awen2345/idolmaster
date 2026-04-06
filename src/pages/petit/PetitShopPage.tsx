import React from 'react';
import { ChevronLeft, ShoppingCart, Coins } from 'lucide-react';

export function PetitShopPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-yellow-500 text-white p-3 text-center font-bold flex items-center justify-between">
          <button onClick={() => onNavigate('petit')} className="p-1"><ChevronLeft /></button>
          <span>Petit Shop</span>
          <ShoppingCart size={20} />
        </div>
        <div className="flex-1 p-4 bg-yellow-50">
          <div className="flex justify-between items-center bg-white rounded-lg shadow p-3 mb-4 border border-yellow-200">
            <span className="font-bold text-slate-600">Petit Money</span>
            <span className="font-black text-yellow-600 flex items-center gap-1"><Coins size={16}/> 15,808,212</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-24 bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-400">Item Image</span>
                </div>
                <div className="p-2 text-center">
                  <h4 className="font-bold text-sm text-slate-700">Cute Dress {i}</h4>
                  <button className="mt-2 w-full bg-yellow-400 text-yellow-900 font-bold py-1 rounded text-sm hover:bg-yellow-500">
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
