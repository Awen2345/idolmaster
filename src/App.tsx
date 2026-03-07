import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Heart, Music, Sparkles, Gift, Swords, Users, Lightbulb, 
  Menu, Home, Bird, RefreshCcw, Mic2, X, ShoppingCart, List, 
  RefreshCw, Building, Trophy, User, BookOpen, Gamepad2, 
  Headphones, Settings, HelpCircle, ChevronLeft, ChevronRight, RotateCw, ThumbsUp
} from 'lucide-react';

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-10 left-10 text-pink-400 opacity-50"
      >
        <Star size={64} fill="currentColor" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-10 text-blue-400 opacity-50"
      >
        <Music size={80} />
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 text-purple-400"
      >
        <Sparkles size={48} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative z-10"
      >
        <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg relative z-10"
          >
            <Heart className="text-pink-500" size={40} fill="currentColor" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white drop-shadow-md relative z-10 tracking-tight">
            IDOLMASTER
          </h1>
          <h2 className="text-xl font-medium text-pink-100 drop-shadow-sm relative z-10">
            Cinderella Girls
          </h2>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Producer ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none bg-white/50"
                placeholder="Enter your ID"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none bg-white/50"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Star size={24} />
                </motion.div>
              ) : (
                <>
                  <Sparkles size={20} />
                  START LIVE!
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors">
              Forgot Password?
            </a>
            <div className="mt-4 text-xs text-gray-400">
              © BANDAI NAMCO Entertainment Inc.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MenuOverlay({ onClose, onNavigate }: { onClose: () => void, onNavigate: (page: string) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute inset-0 z-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-slate-900 flex flex-col overflow-y-auto"
    >
      {/* Top Nav (Replicated but with Close button) */}
      <header className="flex justify-between items-center bg-gradient-to-b from-blue-800 to-blue-950 p-1 border-b-2 border-blue-400 shadow-md sticky top-0 z-20">
        <NavBtn icon={<Home size={20} />} label="My Studio" color="from-blue-400 to-blue-600" />
        <div onClick={() => { onClose(); onNavigate('petit'); }}>
          <NavBtn icon={<Bird size={20} />} label="Petit CG" color="from-orange-300 to-orange-500" />
        </div>
        <NavBtn icon={<Mic2 size={20} />} label="Gacha" color="from-green-400 to-green-600" />
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
            <MenuSquareBtn icon={<Gift size={24} className="text-pink-500" />} label="Gifts" borderColor="border-pink-500" />
            <MenuSquareBtn icon={<RefreshCw size={24} className="text-pink-500" />} label="Exchange" borderColor="border-pink-500" />
          </div>
        </MenuSection>

        {/* Idols Section */}
        <MenuSection title="Idols">
          <div className="grid grid-cols-5 gap-1">
            <MenuSquareBtn icon={<List size={20} className="text-blue-500" />} label="Idol List/Transfer" borderColor="border-blue-500" small />
            <MenuSquareBtn icon={<Home size={20} className="text-blue-500" />} label="Dorm/Trainer Room" borderColor="border-blue-500" small />
            <MenuSquareBtn icon={<Building size={20} className="text-green-500" />} label="Production" borderColor="border-green-500" small />
            <MenuSquareBtn icon={<Trophy size={20} className="text-green-500" />} label="PRA" borderColor="border-green-500" small />
            <MenuSquareBtn icon={<User size={20} className="text-green-500" />} label="Profile" borderColor="border-green-500" small />
          </div>
        </MenuSection>

        {/* Others Section */}
        <MenuSection title="Others">
          <div className="grid grid-cols-4 gap-2">
            <MenuSquareBtn icon={<Heart size={24} className="text-orange-500" />} label="Favorites" borderColor="border-orange-500" />
            <MenuSquareBtn icon={<BookOpen size={24} className="text-orange-500" />} label="Archive" borderColor="border-orange-500" />
            <MenuSquareBtn icon={<Gamepad2 size={24} className="text-orange-500" />} label="Game Center" borderColor="border-orange-500" />
            <MenuSquareBtn icon={<Headphones size={24} className="text-orange-500" />} label="Sound Booth" borderColor="border-orange-500" />
          </div>
        </MenuSection>

        {/* Bottom Actions (Circles) */}
        <div className="flex justify-center gap-6 pt-4">
          <MenuCircleBtn icon={<Settings size={28} className="text-green-500" />} label="Settings" borderColor="border-green-600" dark />
          <MenuCircleBtn icon={<HelpCircle size={28} className="text-green-500" />} label="Help" borderColor="border-green-600" dark />
          <MenuCircleBtn icon={<Star size={28} className="text-yellow-400" fill="currentColor" />} label="Top" borderColor="border-yellow-500" dark />
        </div>
      </div>

      {/* Fixed Bottom Nav */}
      <div className="fixed bottom-0 w-full max-w-md bg-gradient-to-b from-blue-50 to-blue-200 border-t border-blue-300 flex justify-between items-center p-1 z-30">
        <BottomNavBtn icon={<ChevronLeft size={24} className="text-blue-500" />} label="Back" />
        <BottomNavBtn icon={<ChevronRight size={24} className="text-blue-500" />} label="Forward" />
        <BottomNavBtn icon={<Home size={24} className="text-blue-500" />} label="My Studio" />
        <BottomNavBtn icon={<RotateCw size={24} className="text-blue-500" />} label="Reload" />
        <div onClick={onClose}>
          <BottomNavBtn icon={<Menu size={24} className="text-blue-500" />} label="Menu" />
        </div>
      </div>
    </motion.div>
  );
}

function MenuSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="h-px bg-blue-400/50 flex-1 border-dotted border-b-2 border-blue-400/50"></div>
        <Sparkles size={12} className="text-blue-300" />
        <h4 className="text-white font-bold text-sm tracking-widest drop-shadow-md">{title}</h4>
        <Sparkles size={12} className="text-blue-300" />
        <div className="h-px bg-blue-400/50 flex-1 border-dotted border-b-2 border-blue-400/50"></div>
      </div>
      {children}
    </div>
  );
}

function MenuCircleBtn({ icon, label, borderColor, dark = false }: { icon: React.ReactNode, label: string, borderColor: string, dark?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
      <div className={`w-16 h-16 rounded-full border-2 ${borderColor} ${dark ? 'bg-slate-800' : 'bg-white'} flex items-center justify-center shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_4px_4px_rgba(0,0,0,0.5)] relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 drop-shadow-md">{icon}</div>
      </div>
      <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)] text-center leading-tight whitespace-pre-line">
        {label.replace('&', '&\n')}
      </span>
    </div>
  );
}

function MenuSquareBtn({ icon, label, borderColor, small = false }: { icon: React.ReactNode, label: string, borderColor: string, small?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
      <div className={`rounded-xl border-2 ${borderColor} bg-white flex items-center justify-center shadow-[inset_0_-4px_8px_rgba(0,0,0,0.1),0_4px_4px_rgba(0,0,0,0.5)] relative overflow-hidden ${small ? 'w-12 h-12' : 'w-14 h-14'}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 drop-shadow-md">{icon}</div>
      </div>
      <span className={`font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)] text-center leading-tight whitespace-pre-line ${small ? 'text-[8px]' : 'text-[10px]'}`}>
        {label.replace('List', 'List\n').replace('Dorm', 'Dorm\n')}
      </span>
    </div>
  );
}

function BottomNavBtn({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-16 h-12 cursor-pointer hover:bg-blue-200/50 rounded transition-colors">
      {icon}
      <span className="text-[9px] font-bold text-blue-600 mt-0.5">{label}</span>
    </div>
  );
}

function MainPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cards = [
    { id: 0, name: "YUZU KITAMI", img: "https://picsum.photos/seed/yuzu1/400/600" },
    { id: 1, name: "YUZU KITAMI", img: "https://picsum.photos/seed/yuzu2/400/600" },
    { id: 2, name: "YUZU KITAMI", img: "https://picsum.photos/seed/yuzu3/400/600" },
    { id: 3, name: "YUZU KITAMI", img: "https://picsum.photos/seed/yuzu4/400/600" },
    { id: 4, name: "YUZU KITAMI", img: "https://picsum.photos/seed/yuzu5/400/600" },
  ];

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-blue-900 relative overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-gradient-to-b from-blue-800 to-blue-950 p-1 border-b-2 border-blue-400 shadow-md z-20">
          <NavBtn icon={<Home size={20} />} label="My Studio" color="from-blue-400 to-blue-600" />
          <div onClick={() => onNavigate('petit')}>
            <NavBtn icon={<Bird size={20} />} label="Petit CG" color="from-orange-300 to-orange-500" />
          </div>
          <NavBtn icon={<Mic2 size={20} />} label="Gacha" color="from-green-400 to-green-600" />
          <NavBtn icon={<Music size={20} />} label="Lesson" color="from-purple-400 to-purple-600" />
          <NavBtn icon={<RefreshCcw size={20} />} label="Free Trade" color="from-orange-400 to-red-500" />
          <div onClick={() => setIsMenuOpen(true)}>
            <NavBtn icon={<Menu size={20} />} label="Menu" color="from-pink-500 to-rose-600" rounded />
          </div>
        </header>

        {/* Speech Bubble Area */}
        <div className="p-3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-cyan-100 relative z-10 shadow-inner flex gap-2">
          <div className="bg-white rounded-xl border-4 border-orange-400 p-3 relative shadow-md flex-1">
            <p className="font-bold text-gray-800 text-sm">Any pose is totally OK!</p>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-orange-400"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white"></div>
            <Star className="absolute right-2 bottom-2 text-yellow-400" size={16} fill="currentColor" />
            <Star className="absolute right-6 bottom-4 text-yellow-300" size={12} fill="currentColor" />
          </div>
          
          <div className="flex flex-col gap-1 w-20">
            <div onClick={() => onNavigate('formation')} className="bg-gradient-to-b from-blue-400 to-blue-600 rounded border border-blue-700 p-1 flex flex-col items-center justify-center cursor-pointer shadow-sm hover:brightness-110">
              <Users size={14} className="text-white mb-0.5" />
              <span className="text-[8px] font-bold text-white text-center leading-tight">Def Formation</span>
            </div>
            <div onClick={() => onNavigate('petit')} className="bg-gradient-to-b from-orange-400 to-orange-600 rounded border border-orange-700 p-1 flex flex-col items-center justify-center cursor-pointer shadow-sm hover:brightness-110">
              <Bird size={14} className="text-white mb-0.5" />
              <span className="text-[8px] font-bold text-white text-center leading-tight">Petit Bird</span>
            </div>
          </div>
        </div>

        {/* Cards Area (Curtain Effect) */}
        <div className="flex-1 flex w-full relative bg-black overflow-hidden min-h-[300px]">
          {cards.map((card, index) => {
            const isSelected = selectedCard === index;
            const isHidden = selectedCard !== null && selectedCard !== index;
            
            return (
              <motion.div
                key={card.id}
                layout
                onClick={() => setSelectedCard(isSelected ? null : index)}
                className="relative cursor-pointer overflow-hidden border-r border-yellow-500/30 last:border-r-0 flex-shrink-0"
                initial={false}
                animate={{
                  flex: isSelected ? "1 0 100%" : isHidden ? "0 0 0%" : "1 1 20%",
                  opacity: isHidden ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.8 }}
              >
                <img 
                  src={card.img} 
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={`Card ${index}`}
                  referrerPolicy="no-referrer"
                />
                {/* Card Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
                  animate={{ opacity: isHidden ? 0 : 1 }}
                />
                
                {/* Rarity & Name */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-2 flex flex-col justify-end h-full pointer-events-none"
                  animate={{ opacity: isHidden ? 0 : 1 }}
                >
                  <div className="absolute top-2 left-2">
                    <Star className="text-yellow-400 drop-shadow-[0_0_2px_rgba(0,0,0,1)]" size={24} fill="currentColor" />
                  </div>
                  
                  <div className="flex items-end justify-between w-full">
                    <div className="transform -rotate-90 origin-bottom-left absolute bottom-8 left-6 text-white font-black tracking-widest text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,1)] whitespace-nowrap">
                      {card.name}
                    </div>
                    <div className="text-yellow-400 font-black italic text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)] self-end w-full text-right pr-2">
                      SRARE+
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Status Panel */}
        <div className="bg-gradient-to-b from-cyan-200 to-blue-500 p-2 flex gap-1 justify-between items-stretch shadow-[0_-5px_15px_rgba(0,0,0,0.5)] relative z-20">
          <StatusBox icon={<Gift size={24} />} value="421" color="bg-pink-600" rounded />
          <StatusBox text="Lesson & Training" color="bg-purple-600" flex />
          <StatusBar label="Work" subLabel="Stamina" value="20 / 213" color="bg-pink-500" />
          <StatusBar label="LIVE Battle" subLabel="Atk Cost" value="2 / 455" color="bg-blue-500" />
          <div onClick={() => onNavigate('formation')} className="flex-1">
            <StatusBox text="Formation" icon={<Users size={16} />} color="bg-green-500" flex />
          </div>
          <StatusBox icon={<Lightbulb size={24} className="text-yellow-300" fill="currentColor"/>} value="1" color="bg-amber-600" rounded />
        </div>

        {/* Banner */}
        <div className="p-2 bg-slate-900 flex-1 flex items-center justify-center relative z-10">
          <div className="w-full h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] flex items-center justify-center overflow-hidden relative cursor-pointer">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-white font-black text-xl drop-shadow-md tracking-wider">Idol Produce</h3>
              <p className="text-yellow-300 font-bold text-sm drop-shadow-md">the 5th Anniversary</p>
              <div className="bg-black/60 text-white text-xs px-2 py-1 rounded mt-1 inline-block border border-white/30">
                Until Round Ends <span className="text-yellow-400 font-bold">Remaining 20:48:15</span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NavBtn({ icon, label, color, rounded = false }: { icon: React.ReactNode, label: string, color: string, rounded?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center w-14 h-14 bg-gradient-to-b ${color} border border-white/30 shadow-inner cursor-pointer hover:brightness-110 transition-all ${rounded ? 'rounded-full w-16 h-16 -mt-2 border-2 border-white' : 'rounded-md'}`}>
      <div className="text-white drop-shadow-md mb-1">{icon}</div>
      <span className="text-[8px] text-white font-bold drop-shadow-md leading-none text-center w-full px-1">{label}</span>
    </div>
  );
}

function StatusBox({ icon, text, value, color, rounded = false, flex = false }: { icon?: React.ReactNode, text?: string, value?: string, color: string, rounded?: boolean, flex?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center ${color} border-2 border-white shadow-md cursor-pointer hover:brightness-110 transition-all ${rounded ? 'rounded-full w-14 h-14' : 'rounded-lg px-2 py-1'} ${flex ? 'flex-1' : ''}`}>
      {text && <span className="text-[10px] text-white font-bold drop-shadow-md text-center leading-tight">{text}</span>}
      {icon && <div className="text-white drop-shadow-md my-0.5">{icon}</div>}
      {value && <span className="text-xs text-white font-black drop-shadow-md">{value}</span>}
    </div>
  );
}

function StatusBar({ label, subLabel, value, color }: { label: string, subLabel: string, value: string, color: string }) {
  return (
    <div className="flex flex-col items-center justify-between bg-white border-2 border-gray-300 rounded-lg overflow-hidden flex-1 cursor-pointer hover:brightness-95 transition-all">
      <div className="w-full text-center py-0.5 border-b border-gray-200">
        <span className="text-[10px] font-black text-gray-800">{label}</span>
      </div>
      <div className="w-full px-1 py-0.5">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-0.5">
          <div className={`h-full ${color} w-3/4`}></div>
        </div>
        <div className="flex justify-between items-center w-full bg-black text-white px-1 rounded text-[9px] font-bold">
          <span className="text-yellow-400">{subLabel}</span>
          <span>{value}</span>
        </div>
      </div>
    </div>
  );
}

function PetitPage({ onNavigate }: { onNavigate: (page: string) => void }) {
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
          <Sparkles size={12} className="absolute left-4 top-1.5 opacity-50" />
          Temptation Evil
          <Sparkles size={12} className="absolute right-4 top-1.5 opacity-50" />
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

function ActionBtn({ icon, label, color, borderColor, textColor, small = false }: { icon: React.ReactNode, label: string, color: string, borderColor: string, textColor: string, small?: boolean }) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center bg-gradient-to-b ${color} border-2 ${borderColor} rounded-lg shadow-md cursor-pointer hover:brightness-105 transition-all ${small ? 'py-1' : 'py-2'}`}>
      <div className="drop-shadow-sm mb-1">{icon}</div>
      <span className={`font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] ${textColor} ${small ? 'text-[10px]' : 'text-xs'}`}>{label}</span>
    </div>
  );
}

type Card = {
  id: number;
  name: string;
  img: string;
  atk: number;
  def: number;
  cost: number;
};

const INVENTORY: Card[] = [
  { id: 10, name: "RIN SHIBUYA", img: "https://picsum.photos/seed/rin1/400/600", atk: 13000, def: 10500, cost: 18 },
  { id: 11, name: "UZUKI SHIMAMURA", img: "https://picsum.photos/seed/uzuki1/400/600", atk: 12000, def: 11500, cost: 17 },
  { id: 12, name: "MIO HONDA", img: "https://picsum.photos/seed/mio1/400/600", atk: 14000, def: 9500, cost: 19 },
  { id: 13, name: "KAEDE TAKAGAKI", img: "https://picsum.photos/seed/kaede1/400/600", atk: 15000, def: 12000, cost: 21 },
  { id: 14, name: "MIKA JOUGASAKI", img: "https://picsum.photos/seed/mika1/400/600", atk: 13500, def: 10000, cost: 18 },
  { id: 15, name: "RIKA JOUGASAKI", img: "https://picsum.photos/seed/rika1/400/600", atk: 11000, def: 9000, cost: 15 },
];

function FormationPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formation, setFormation] = useState<(Card | null)[]>([
    { id: 0, name: "YUZU KITAMI", img: "https://picsum.photos/seed/yuzu1/400/600", atk: 12500, def: 10200, cost: 18 },
    { id: 1, name: "YUZU KITAMI", img: "https://picsum.photos/seed/yuzu2/400/600", atk: 11800, def: 9800, cost: 16 },
    { id: 2, name: "YUZU KITAMI", img: "https://picsum.photos/seed/yuzu3/400/600", atk: 13200, def: 11000, cost: 19 },
    { id: 3, name: "YUZU KITAMI", img: "https://picsum.photos/seed/yuzu4/400/600", atk: 10500, def: 8900, cost: 15 },
    { id: 4, name: "YUZU KITAMI", img: "https://picsum.photos/seed/yuzu5/400/600", atk: 14000, def: 12500, cost: 20 },
  ]);
  const [selectingSlot, setSelectingSlot] = useState<number | null>(null);

  const totalAtk = formation.reduce((sum, card) => sum + (card?.atk || 0), 0);
  const totalDef = formation.reduce((sum, card) => sum + (card?.def || 0), 0);
  const totalCost = formation.reduce((sum, card) => sum + (card?.cost || 0), 0);

  const handleRemove = (index: number) => {
    const newFormation = [...formation];
    newFormation[index] = null;
    setFormation(newFormation);
  };

  const handleSelectCard = (card: Card) => {
    if (selectingSlot !== null) {
      const newFormation = [...formation];
      newFormation[selectingSlot] = card;
      setFormation(newFormation);
      setSelectingSlot(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-gradient-to-b from-blue-800 to-blue-950 p-1 border-b-2 border-blue-400 shadow-md z-20">
          <div onClick={() => onNavigate('main')}>
            <NavBtn icon={<Home size={20} />} label="My Studio" color="from-blue-400 to-blue-600" />
          </div>
          <div onClick={() => onNavigate('petit')}>
            <NavBtn icon={<Bird size={20} />} label="Petit CG" color="from-orange-300 to-orange-500" />
          </div>
          <NavBtn icon={<Mic2 size={20} />} label="Gacha" color="from-green-400 to-green-600" />
          <NavBtn icon={<Music size={20} />} label="Lesson" color="from-purple-400 to-purple-600" />
          <NavBtn icon={<RefreshCcw size={20} />} label="Free Trade" color="from-orange-400 to-red-500" />
          <div onClick={() => setIsMenuOpen(true)}>
            <NavBtn icon={<Menu size={20} />} label="Menu" color="from-pink-500 to-rose-600" rounded />
          </div>
        </header>

        {/* Sub Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 font-bold text-sm shadow-inner relative border-b-2 border-green-700">
          <Users size={16} className="absolute left-4 top-2 opacity-80" />
          Unit Formation
          <Users size={16} className="absolute right-4 top-2 opacity-80" />
        </div>

        {/* Total Stats */}
        <div className="bg-gray-100 p-3 flex justify-between border-b border-gray-300 shadow-sm">
          <div className="flex flex-col items-center flex-1 border-r border-gray-300">
            <span className="text-[10px] font-bold text-gray-500">Total Atk</span>
            <span className="text-lg font-black text-red-500">{totalAtk.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center flex-1 border-r border-gray-300">
            <span className="text-[10px] font-bold text-gray-500">Total Def</span>
            <span className="text-lg font-black text-blue-500">{totalDef.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] font-bold text-gray-500">Total Cost</span>
            <span className="text-lg font-black text-purple-600">{totalCost}</span>
          </div>
        </div>

        {/* Formation Slots */}
        <div className="flex-1 overflow-y-auto bg-gray-200 p-2 space-y-2 relative">
          {formation.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-300 flex overflow-hidden h-24">
              {/* Slot Number */}
              <div className="bg-gradient-to-b from-gray-700 to-gray-900 text-white w-6 flex items-center justify-center font-black text-sm border-r border-gray-400">
                {index + 1}
              </div>
              
              {card ? (
                <>
                  {/* Card Image */}
                  <div className="w-20 h-24 relative border-r border-gray-200">
                    <img src={card.img} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5 font-bold">
                      SRARE+
                    </div>
                  </div>
                  
                  {/* Card Info */}
                  <div className="flex-1 p-2 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-gray-800">{card.name}</span>
                      <div className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-purple-300">
                        Cost {card.cost}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-1">
                      <div className="flex-1 bg-red-50 rounded px-1 py-0.5 border border-red-100 flex justify-between items-center">
                        <span className="text-[10px] text-red-500 font-bold">Atk</span>
                        <span className="text-xs text-red-600 font-black">{card.atk.toLocaleString()}</span>
                      </div>
                      <div className="flex-1 bg-blue-50 rounded px-1 py-0.5 border border-blue-100 flex justify-between items-center">
                        <span className="text-[10px] text-blue-500 font-bold">Def</span>
                        <span className="text-xs text-blue-600 font-black">{card.def.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-1 flex justify-end gap-1">
                      <button onClick={() => handleRemove(index)} className="bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 rounded px-3 py-1 text-[10px] font-bold text-gray-700 shadow-sm hover:brightness-95">
                        Remove
                      </button>
                      <button onClick={() => setSelectingSlot(index)} className="bg-gradient-to-b from-pink-400 to-pink-600 border border-pink-700 rounded px-3 py-1 text-[10px] font-bold text-white shadow-sm hover:brightness-110">
                        Change
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 border-dashed border-2 border-gray-300 m-2 rounded-lg">
                  <button onClick={() => setSelectingSlot(index)} className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl font-bold">+</span>
                    </div>
                    <span className="font-bold text-sm">Empty Slot</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back to My Studio */}
        <div 
          onClick={() => onNavigate('main')}
          className="bg-gray-800 text-white p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-700 border-t border-gray-600"
        >
          <ChevronLeft size={20} className="text-yellow-500" />
          <span className="font-bold text-sm">To My Studio</span>
        </div>

        <AnimatePresence>
          {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />}
          {selectingSlot !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/80 flex flex-col p-4"
            >
              <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 flex justify-between items-center">
                  <h3 className="text-white font-bold">Select Card</h3>
                  <button onClick={() => setSelectingSlot(null)} className="text-white hover:text-pink-200">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-100">
                  {INVENTORY.map(card => (
                    <div key={card.id} className="bg-white rounded-lg shadow-sm border border-gray-200 flex overflow-hidden h-20 cursor-pointer hover:border-pink-400" onClick={() => handleSelectCard(card)}>
                      <div className="w-16 h-20 relative border-r border-gray-200">
                        <img src={card.img} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 p-2 flex flex-col justify-center">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm text-gray-800">{card.name}</span>
                          <span className="text-[10px] text-purple-600 font-bold">Cost {card.cost}</span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] text-red-500 font-bold">Atk: {card.atk}</span>
                          <span className="text-[10px] text-blue-500 font-bold">Def: {card.def}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'petit' | 'formation'>('main');

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  if (currentPage === 'petit') {
    return <PetitPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'formation') {
    return <FormationPage onNavigate={setCurrentPage} />;
  }

  return <MainPage onNavigate={setCurrentPage} />;
}
