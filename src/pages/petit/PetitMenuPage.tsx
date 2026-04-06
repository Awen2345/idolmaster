import React from 'react';
import { ChevronLeft, Menu, Settings, HelpCircle, Info } from 'lucide-react';

export function PetitMenuPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-cyan-600 text-white p-3 text-center font-bold flex items-center justify-between">
          <button onClick={() => onNavigate('petit')} className="p-1"><ChevronLeft /></button>
          <span>Petit Menu</span>
          <Menu size={20} />
        </div>
        <div className="flex-1 p-4 bg-slate-50">
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50">
              <Settings className="text-slate-600" size={32} />
              <span className="font-bold text-slate-700">Settings</span>
            </button>
            <button className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50">
              <HelpCircle className="text-slate-600" size={32} />
              <span className="font-bold text-slate-700">Help</span>
            </button>
            <button className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50">
              <Info className="text-slate-600" size={32} />
              <span className="font-bold text-slate-700">Information</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
