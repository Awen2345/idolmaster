import React from 'react';
import { ChevronLeft, Star, MessageSquare } from 'lucide-react';

export function PetitBoardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-cyan-500 text-white p-3 text-center font-bold flex items-center justify-between">
          <button onClick={() => onNavigate('petit')} className="p-1"><ChevronLeft /></button>
          <span>Board</span>
          <MessageSquare size={20} />
        </div>
        <div className="flex-1 p-4 bg-cyan-50">
          <div className="bg-white rounded-lg shadow p-4 mb-4 border-l-4 border-cyan-500">
            <h3 className="font-bold text-cyan-700">Producer Chat</h3>
            <p className="text-sm text-slate-600 mt-1">Communicate with other producers and share your Petit rooms!</p>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-3 rounded shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                  <span className="font-bold text-sm text-slate-700">Producer {i}</span>
                  <span className="text-xs text-slate-400 ml-auto">2 hours ago</span>
                </div>
                <p className="text-sm text-slate-600">Check out my new Petit room layout! It's so cute!</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
