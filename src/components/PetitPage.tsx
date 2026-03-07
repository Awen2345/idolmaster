import React from 'react';
import { 
  Star, Music, Users, Home, Bird, 
  HelpCircle, ThumbsUp, User, ShoppingCart, ChevronLeft, Menu
} from 'lucide-react';
import { NavBtn, ActionBtn } from './Shared';

export function PetitPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-gradient-to-b from-blue-100 to-blue-300 p-1 border-b-2 border-blue-400 shadow-md z-20">
          <div onClick={() => onNavigate('main')}>
            <NavBtn icon={<Home size={20} />} label="My Studio" color="from-blue-400 to-blue-600" />
          </div>
          <NavBtn icon={<Bird size={20} />} label="Petit TOP" color="from-orange-400 to-orange-600" />
          <NavBtn icon={<Music size={20} />} label="Petit Lesson" color="from-pink-400 to-pink-600" />
          <NavBtn icon={<Star size={20} />} label="Board" color="from-cyan-400 to-cyan-600" />
          <NavBtn icon={<User size={20} />} label="Petit Profile" color="from-purple-400 to-purple-600" />
          <NavBtn icon={<Menu size={20} />} label="Petit Menu" color="from-cyan-300 to-cyan-500" rounded />
        </header>

        {/* Sub Header */}
        <div className="bg-blue-400 text-white text-center py-1 font-bold text-sm shadow-inner relative">
          <Star size={12} className="absolute left-4 top-1.5 opacity-50" />
          Temptation Evil
          <Star size={12} className="absolute right-4 top-1.5 opacity-50" />
        </div>

        {/* Stats Area */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-300 p-2 flex justify-between items-start relative border-b border-gray-400">
          <div className="flex items-center gap-1 bg-white border border-blue-400 rounded-full px-2 py-0.5 shadow-sm">
            <span className="text-blue-500 font-bold text-xs">Petit TOP</span>
            <HelpCircle size={14} className="text-green-500" fill="currentColor" />
          </div>
          
          <div className="flex flex-col gap-1 flex-1 ml-2 mr-12">
            <div className="flex justify-between items-center bg-white/50 border border-gray-300 rounded px-2 py-0.5">
              <span className="text-[10px] font-bold text-green-700 bg-green-200 px-1 rounded">Petit Money</span>
              <span className="text-xs font-black text-gray-700">15808212</span>
            </div>
            <div className="flex justify-between items-center bg-white/50 border border-gray-300 rounded px-2 py-0.5">
              <span className="text-[10px] font-bold text-green-700 bg-green-200 px-1 rounded">Technical pt</span>
              <span className="text-xs font-black text-gray-700">40506</span>
            </div>
          </div>

          <div className="absolute right-2 top-2">
            <div className="relative">
              <Star size={40} className="text-red-500 drop-shadow-md" fill="currentColor" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ThumbsUp size={12} className="text-white mt-1" fill="currentColor" />
                <span className="text-xs font-black text-yellow-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Room Area */}
        <div className="relative h-[350px] bg-[url('https://picsum.photos/seed/room/400/350')] bg-cover bg-center border-b-4 border-orange-300">
          {/* Toggle Button */}
          <div className="absolute top-2 left-2 flex bg-white rounded-full border-2 border-gray-400 overflow-hidden shadow-md">
            <div className="bg-pink-500 text-white px-4 py-1 flex flex-col items-center justify-center cursor-pointer">
              <User size={16} fill="currentColor" />
              <span className="text-[10px] font-bold">Solo</span>
            </div>
            <div className="bg-white text-pink-500 px-4 py-1 flex flex-col items-center justify-center border-l border-gray-300 cursor-pointer hover:bg-pink-50">
              <Users size={16} fill="currentColor" />
              <span className="text-[10px] font-bold">Unit</span>
            </div>
          </div>

          {/* Character */}
          <div className="absolute bottom-4 right-4 w-48 h-64">
             <img src="https://picsum.photos/seed/chibi/200/300" className="w-full h-full object-contain drop-shadow-xl" alt="Petit Character" />
          </div>

          {/* Speech Bubble */}
          <div className="absolute top-1/3 left-2 w-48 bg-white border-4 border-pink-500 rounded-xl p-2 shadow-lg z-10">
            <p className="text-xs font-bold text-gray-800 leading-tight">
              I skipped grades overseas, but once I learned most things, it got boring~♪
            </p>
            <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-pink-500"></div>
            <div className="absolute top-1/2 -right-1.5 transform -translate-y-1/2 w-0 h-0 border-t-6 border-b-6 border-l-6 border-transparent border-l-white"></div>
          </div>

          {/* Circular Actions */}
          <div className="absolute bottom-4 left-2 flex gap-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 border-2 border-white shadow-lg flex flex-col items-center justify-center cursor-pointer hover:brightness-110">
              <User size={20} className="text-white drop-shadow-md" />
              <span className="text-[10px] font-bold text-white drop-shadow-md">Visit</span>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 border-2 border-white shadow-lg flex flex-col items-center justify-center cursor-pointer hover:brightness-110">
              <Star size={20} className="text-white drop-shadow-md" />
              <span className="text-[10px] font-bold text-white drop-shadow-md">Motion</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Area */}
        <div className="bg-gradient-to-b from-orange-100 to-orange-200 p-2 space-y-2">
          <div className="flex gap-2">
            <ActionBtn icon={<Music size={24} className="text-pink-500" />} label="Petit Lesson" color="from-pink-100 to-pink-300" borderColor="border-pink-400" textColor="text-pink-600" />
            <ActionBtn icon={<Star size={24} className="text-blue-500" />} label="Technical Board" color="from-blue-100 to-blue-300" borderColor="border-blue-400" textColor="text-blue-600" />
            <ActionBtn icon={<ShoppingCart size={24} className="text-yellow-600" />} label="Petit Shop" color="from-yellow-100 to-yellow-300" borderColor="border-yellow-400" textColor="text-yellow-700" />
          </div>
          <div className="flex gap-2">
            <ActionBtn icon={<Users size={20} className="text-blue-400" />} label="Petit Formation" color="from-blue-50 to-blue-100" borderColor="border-blue-300" textColor="text-blue-500" small />
            <ActionBtn icon={<Star size={20} className="text-blue-400" />} label="Outfit Settings" color="from-blue-50 to-blue-100" borderColor="border-blue-300" textColor="text-blue-500" small />
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-900 text-gray-300 p-4 text-[10px] leading-relaxed border-t-4 border-gray-700 relative">
          <div className="absolute top-0 left-0 right-0 flex justify-between -mt-2 px-2">
             <div className="flex text-yellow-500"><Star size={12}/><Star size={12}/><Star size={12}/></div>
             <div className="flex text-yellow-500"><Star size={12}/><Star size={12}/><Star size={12}/></div>
          </div>
          <ul className="list-none space-y-1">
            <li>* Recommended environment is as follows.</li>
            <li className="pl-2">iPhone 5 or later and iOS 8.0+</li>
            <li className="pl-2">Android 4.2+ devices</li>
            <li>* Some devices including tablets are not supported.</li>
            <li>* May not work on some devices even in recommended environment.</li>
            <li>* 'Likes' are reset every Monday at 0:00.</li>
          </ul>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between -mb-2 px-2">
             <div className="flex text-yellow-500"><Star size={12}/><Star size={12}/><Star size={12}/></div>
             <div className="flex text-yellow-500"><Star size={12}/><Star size={12}/><Star size={12}/></div>
          </div>
        </div>

        {/* Back to My Studio */}
        <div 
          onClick={() => onNavigate('main')}
          className="bg-gray-800 text-white p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-700 border-t border-gray-600"
        >
          <ChevronLeft size={20} className="text-yellow-500" />
          <span className="font-bold text-sm">To My Studio</span>
        </div>

        {/* Copyright Banner */}
        <div className="bg-black text-center py-2 border-t border-gray-800">
          <h1 className="text-white font-black italic tracking-widest drop-shadow-md text-sm">THE IDOLM@STER CINDERELLA GIRLS</h1>
        </div>
        
        <div className="bg-gradient-to-b from-gray-300 to-gray-400 text-center py-2 cursor-pointer hover:brightness-110">
          <span className="text-blue-600 font-bold text-sm drop-shadow-sm flex items-center justify-center gap-1">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-transparent border-b-blue-500"></div>
            Back to TOP
          </span>
        </div>

        <div className="bg-black text-center py-2 text-[10px] text-white">
          ©T.K. THE IDOLM@STER™ & ©BNEI
        </div>
      </div>
    </div>
  );
}
