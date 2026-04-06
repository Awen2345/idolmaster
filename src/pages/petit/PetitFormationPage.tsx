import React from 'react';
import { ChevronLeft, Users } from 'lucide-react';

export function PetitFormationPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-blue-400 text-white p-3 text-center font-bold flex items-center justify-between">
          <button onClick={() => onNavigate('petit')} className="p-1"><ChevronLeft /></button>
          <span>Petit Formation</span>
          <Users size={20} />
        </div>
        <div className="flex-1 p-4 bg-blue-50">
          <p className="text-center text-slate-600 mb-4 font-bold">Select your Petit Idols for the Unit</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-20 h-20 bg-white rounded-lg shadow border-2 border-blue-200 flex items-center justify-center">
                <span className="text-slate-400 text-xs font-bold">Slot {i}</span>
              </div>
            ))}
          </div>
          
          <h4 className="font-bold text-slate-700 mb-2 border-b pb-1">Available Petit Idols</h4>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-white rounded shadow-sm border border-slate-200 flex items-center justify-center cursor-pointer hover:border-blue-400">
                <span className="text-slate-400 text-xs">Idol {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
