import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, Bird, Mic2, Music, RefreshCcw, X, 
  Star, Swords, ShoppingCart, List, Gift, RefreshCw, 
  Building, Trophy, User, Heart, BookOpen, Gamepad2, 
  Headphones, Settings, HelpCircle, ChevronLeft, ChevronRight, RotateCw, Users, Menu, Shield
} from 'lucide-react';
import { NavBtn, MenuCircleBtn, MenuSquareBtn, MenuSection, BottomNavBtn } from './Shared';

export function MenuOverlay({ onClose, onNavigate, userId }: { onClose: () => void, onNavigate: (page: string) => void, userId: number | null }) {
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const handleRedeem = async () => {
    if (!promoCode || !userId) return;
    setPromoLoading(true);
    
    try {
      const res = await fetch('/api/promocode/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: promoCode })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(data.message);
        setPromoCode('');
        setShowPromo(false);
      } else {
        alert(data.error || "Redemption failed");
      }
    } catch (err) {
      console.error("Promo error", err);
      alert("Network error");
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute inset-0 z-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-slate-900 flex flex-col overflow-y-auto"
    >
      {/* Promo Code Modal */}
      {showPromo && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl border-2 border-pink-400"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-pink-600 flex items-center gap-2">
                <Ticket className="w-6 h-6" />
                Enter Promo Code
              </h3>
              <button onClick={() => setShowPromo(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Enter a valid serial code to receive special rewards!
            </p>
            <input 
              type="text" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="w-full border-2 border-gray-300 rounded-lg p-3 text-center font-mono text-lg uppercase mb-4 focus:border-pink-500 outline-none"
              placeholder="ENTER CODE"
            />
            <button 
              onClick={handleRedeem}
              disabled={promoLoading || !promoCode}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-3 rounded-lg shadow-md hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {promoLoading ? 'Verifying...' : 'Redeem'}
            </button>
          </motion.div>
        </div>
      )}

      {/* Top Nav (Replicated but with Close button) */}
      <header className="flex justify-between items-center bg-gradient-to-b from-blue-800 to-blue-950 p-1 border-b-2 border-blue-400 shadow-md sticky top-0 z-20">
        <div onClick={() => { onClose(); onNavigate('main'); }}>
          <NavBtn icon={<Home size={20} />} label="My Studio" color="from-blue-400 to-blue-600" />
        </div>
        <div onClick={() => { onClose(); onNavigate('petit'); }}>
          <NavBtn icon={<Bird size={20} />} label="Petit CG" color="from-orange-300 to-orange-500" />
        </div>
        <div onClick={() => { onClose(); onNavigate('gacha'); }}>
          <NavBtn icon={<Mic2 size={20} />} label="Gacha" color="from-green-400 to-green-600" />
        </div>
        <NavBtn icon={<Music size={20} />} label="Lesson" color="from-purple-400 to-purple-600" />
        <NavBtn icon={<RefreshCcw size={20} />} label="Free Trade" color="from-orange-400 to-red-500" />
        <div onClick={onClose} className="flex flex-col items-center justify-center w-16 h-16 -mt-2 bg-gradient-to-b from-pink-600 to-rose-800 border-2 border-white rounded-full shadow-inner cursor-pointer hover:brightness-110 transition-all">
          <X size={28} className="text-white drop-shadow-md mb-1" />
          <span className="text-[10px] text-white font-bold drop-shadow-md leading-none">Close</span>
        </div>
      </header>

      {/* Menu Content */}
      <div className="p-2 space-y-4 pb-20">
        {/* Banner */}
        <div className="w-full h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg border-2 border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.5)] flex items-center justify-between px-4 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
           <div className="relative z-10">
             <h3 className="text-white font-black text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] italic">Production Match</h3>
             <h2 className="text-yellow-300 font-black text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] italic">Festival</h2>
           </div>
           {/* Placeholder for characters */}
           <div className="relative z-10 flex gap-2">
             <img src="https://picsum.photos/seed/idol1/100/100" className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="Idol 1" />
             <img src="https://picsum.photos/seed/idol2/100/100" className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="Idol 2" />
           </div>
        </div>

        {/* Main Actions (Circles) */}
        <div className="flex justify-around px-2">
          <MenuCircleBtn icon={<Music size={28} className="text-purple-600" />} label="Lesson & Training" borderColor="border-purple-600" />
          <MenuCircleBtn icon={<Star size={28} className="text-pink-500" />} label="Work" borderColor="border-pink-500" />
          <MenuCircleBtn icon={<Swords size={28} className="text-blue-500" />} label="LIVE Battle" borderColor="border-blue-500" />
          <div onClick={() => { onClose(); onNavigate('formation'); }}>
            <MenuCircleBtn icon={<Users size={28} className="text-green-500" />} label="Formation" borderColor="border-green-500" />
          </div>
        </div>

        {/* Items Section */}
        <MenuSection title="Items">
          <div className="grid grid-cols-4 gap-2">
            <MenuSquareBtn icon={<ShoppingCart size={24} className="text-pink-500" />} label="Shop" borderColor="border-pink-500" />
            <MenuSquareBtn icon={<List size={24} className="text-pink-500" />} label="Item List" borderColor="border-pink-500" />
            <div onClick={() => { onClose(); onNavigate('inbox'); }}>
              <MenuSquareBtn icon={<Gift size={24} className="text-pink-500" />} label="Gifts" borderColor="border-pink-500" />
            </div>
            <MenuSquareBtn icon={<RefreshCw size={24} className="text-pink-500" />} label="Exchange" borderColor="border-pink-500" />
            <div onClick={() => setShowPromo(true)}>
              <MenuSquareBtn icon={<Ticket size={24} className="text-pink-500" />} label="Promo Code" borderColor="border-pink-500" />
            </div>
          </div>
        </MenuSection>

        {/* Idols Section */}
        <MenuSection title="Idols">
          <div className="grid grid-cols-5 gap-1">
            <div onClick={() => { onClose(); onNavigate('cardList'); }}>
              <MenuSquareBtn icon={<List size={20} className="text-blue-500" />} label="Card Album" borderColor="border-blue-500" small />
            </div>
            <MenuSquareBtn icon={<Home size={20} className="text-blue-500" />} label="Dorm/Trainer Room" borderColor="border-blue-500" small />
            <MenuSquareBtn icon={<Building size={20} className="text-green-500" />} label="Production" borderColor="border-green-500" small />
            <MenuSquareBtn icon={<Trophy size={20} className="text-green-500" />} label="PRA" borderColor="border-green-500" small />
            <MenuSquareBtn icon={<User size={20} className="text-green-500" />} label="Profile" borderColor="border-green-500" small />
          </div>
        </MenuSection>

        {/* Others Section */}
        <MenuSection title="Others">
          <div className="grid grid-cols-5 gap-2">
            <MenuSquareBtn icon={<Heart size={24} className="text-orange-500" />} label="Favorites" borderColor="border-orange-500" />
            <MenuSquareBtn icon={<BookOpen size={24} className="text-orange-500" />} label="Archive" borderColor="border-orange-500" />
            <MenuSquareBtn icon={<Gamepad2 size={24} className="text-orange-500" />} label="Game Center" borderColor="border-orange-500" />
            <MenuSquareBtn icon={<Headphones size={24} className="text-orange-500" />} label="Sound Booth" borderColor="border-orange-500" />
            <div onClick={() => { onClose(); onNavigate('admin'); }}>
              <MenuSquareBtn icon={<Shield size={24} className="text-red-500" />} label="Admin" borderColor="border-red-500" />
            </div>
          </div>
        </MenuSection>

        {/* Bottom Actions (Circles) */}
        <div className="flex justify-center gap-6 pt-4">
          <MenuCircleBtn icon={<Settings size={28} className="text-green-500" />} label="Settings" borderColor="border-green-600" dark />
          <MenuCircleBtn icon={<HelpCircle size={28} className="text-green-500" />} label="Help" borderColor="border-green-600" dark />
          <div onClick={() => { onClose(); onNavigate('announcement'); }}>
            <MenuCircleBtn icon={<Star size={28} className="text-yellow-400" fill="currentColor" />} label="News" borderColor="border-yellow-500" dark />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Nav */}
      <div className="fixed bottom-0 w-full max-w-md bg-gradient-to-b from-blue-50 to-blue-200 border-t border-blue-300 flex justify-between items-center p-1 z-30">
        <BottomNavBtn icon={<ChevronLeft size={24} className="text-blue-500" />} label="Back" />
        <BottomNavBtn icon={<ChevronRight size={24} className="text-blue-500" />} label="Forward" />
        <div onClick={() => { onClose(); onNavigate('main'); }}>
          <BottomNavBtn icon={<Home size={24} className="text-blue-500" />} label="My Studio" />
        </div>
        <BottomNavBtn icon={<RotateCw size={24} className="text-blue-500" />} label="Reload" />
        <div onClick={onClose}>
          <BottomNavBtn icon={<Menu size={24} className="text-blue-500" />} label="Menu" />
        </div>
      </div>
    </motion.div>
  );
}
