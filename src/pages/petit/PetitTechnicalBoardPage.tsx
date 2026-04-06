import React from 'react';
import { ChevronLeft, Star, TrendingUp } from 'lucide-react';

export function PetitTechnicalBoardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-blue-500 text-white p-3 text-center font-bold flex items-center justify-between">
          <button onClick={() => onNavigate('petit')} className="p-1"><ChevronLeft /></button>
          <span>Technical Board</span>
          <TrendingUp size={20} />
        </div>
        <div className="flex-1 p-4 bg-blue-50">
          <div className="bg-white rounded-lg shadow p-4 mb-4 text-center border-t-4 border-blue-500">
            <h3 className="font-bold text-blue-700 mb-2">Technical Points</h3>
            <div className="text-3xl font-black text-slate-800">40,506 <span className="text-sm text-slate-500">pt</span></div>
          </div>
          
          <h4 className="font-bold text-slate-700 mb-2">Skill Tree</h4>
          <div className="bg-white p-4 rounded-lg shadow-inner border border-slate-200 min-h-[300px] flex items-center justify-center">
            <p className="text-slate-400 text-center">Unlock new skills and stat bonuses using Technical Points here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
