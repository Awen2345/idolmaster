import React from 'react';
import { ChevronLeft, Music, Star } from 'lucide-react';

export function PetitLessonPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-pink-500 text-white p-3 text-center font-bold flex items-center justify-between">
          <button onClick={() => onNavigate('petit')} className="p-1"><ChevronLeft /></button>
          <span>Petit Lesson</span>
          <Music size={20} />
        </div>
        <div className="flex-1 p-4 flex flex-col items-center justify-center bg-pink-50">
          <Music size={64} className="text-pink-300 mb-4" />
          <h2 className="text-xl font-bold text-pink-600 mb-2">Lesson Room</h2>
          <p className="text-center text-slate-600">Train your Petit Idols here to increase their stats and Technical pt!</p>
          
          <div className="mt-8 w-full space-y-4">
            <button className="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold py-3 rounded-full shadow-md hover:brightness-110">
              Vocal Lesson
            </button>
            <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-3 rounded-full shadow-md hover:brightness-110">
              Dance Lesson
            </button>
            <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-3 rounded-full shadow-md hover:brightness-110">
              Visual Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
