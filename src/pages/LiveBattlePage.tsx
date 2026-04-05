import React, { useState, useEffect } from 'react';
import { ChevronLeft, Swords, Star, User, Shield, Zap, Menu, Home, RefreshCcw, Mic2, Bird, PlayCircle, Users, Bot } from 'lucide-react';
import { Card } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';

export function LiveBattlePage({ onNavigate, formation, userId }: { onNavigate: (page: string) => void, formation: (Card | null)[], userId: number }) {
  const [battleState, setBattleState] = useState<'idle' | 'searching' | 'battling' | 'result'>('idle');
  const [opponent, setOpponent] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [showPlayerBubble, setShowPlayerBubble] = useState(true);
  const [showOpponentBubble, setShowOpponentBubble] = useState(true);
  const [mode, setMode] = useState<'bot' | 'multiplayer'>('bot');
  const [socket, setSocket] = useState<Socket | null>(null);

  const activeIdols = formation.filter(c => c !== null) as Card[];
  const playerLeader = activeIdols[0] || null;

  useEffect(() => {
    console.log("Initializing socket connection...");
    const newSocket = io({ transports: ['websocket'] });
    
    newSocket.on('connect', () => console.log('Socket connected to server'));
    newSocket.on('disconnect', () => console.log('Socket disconnected from server'));
    newSocket.on('connect_error', (err) => console.error('Socket connect error:', err));

    setSocket(newSocket);

    return () => {
      console.log("Cleaning up socket connection...");
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onMatchFound = (data: any) => {
      console.log("Match found!", data);
      setOpponent(data.opponent);
      setBattleState('battling');
      
      // Calculate stats and result after a short delay for animation
      setTimeout(async () => {
        const playerAtk = activeIdols.reduce((sum, c) => sum + c.atk, 0);
        const isWin = playerAtk > (data.opponent.def || 0);

        const fansGained = isWin ? 250 : 50;
        const moneyGained = isWin ? 1200 : 300;

        try {
          await fetch(`/api/live/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isWin, fansGained, moneyGained })
          });
        } catch (e) {
          console.error("Failed to save battle result", e);
        }

        setResult({ isWin, fansGained, moneyGained });
        setBattleState('result');
      }, 2500);
    };

    socket.on("match_found", onMatchFound);

    return () => {
      socket.off("match_found", onMatchFound);
    };
  }, [socket, activeIdols, userId]);

  const handleBattle = () => {
    console.log("PUSH clicked. Socket:", socket?.connected, "Mode:", mode);
    if (!socket || activeIdols.length === 0) return;
    setBattleState('searching');
    setOpponent(null);
    setResult(null);
    
    const totalAtk = activeIdols.reduce((sum, c) => sum + c.atk, 0);
    const totalDef = activeIdols.reduce((sum, c) => sum + c.def, 0);

    console.log("Emitting find_match:", { userId, totalAtk, totalDef, mode });
    socket.emit("find_match", {
      userId,
      formation: activeIdols,
      totalAtk,
      totalDef,
      mode
    });
  };

  const CardGrid = ({ cards, isOpponent = false }: { cards: any[], isOpponent?: boolean }) => (
    <div className="grid grid-cols-5 gap-1 p-1 bg-black/40">
      {cards.map((card, i) => (
        <div key={i} className={`aspect-[3/4] bg-slate-800 border ${isOpponent ? 'border-red-900/50' : 'border-blue-900/50'} overflow-hidden relative group`}>
          {card ? (
            <>
              <img src={card.img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center py-0.5 font-bold truncate">
                {card.rarity || 'R'}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-700">
              <User size={16} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const SpeechBubble = ({ name, text, avatar, isBottom = false }: { name: string, text: string, avatar: string, isBottom?: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, x: isBottom ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`absolute ${isBottom ? 'bottom-4 left-4' : 'top-4 right-4'} z-30 flex ${isBottom ? 'flex-row' : 'flex-row-reverse'} items-center gap-2 max-w-[85%]`}
    >
      {/* Avatar with Star Frame */}
      <div className="relative shrink-0">
        <div className="w-16 h-16 bg-white rounded-full border-2 border-pink-400 overflow-hidden shadow-lg relative z-10">
          <img src={avatar} alt="" className="w-full h-full object-cover" />
        </div>
        <Star className="absolute -top-2 -left-2 text-yellow-400 fill-current z-20 drop-shadow-md" size={24} />
        <Star className="absolute -bottom-1 -right-1 text-pink-400 fill-current z-20 drop-shadow-md" size={20} />
      </div>

      {/* Bubble */}
      <div className="flex flex-col">
        <div className={`bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md relative border border-slate-200`}>
          <p className="text-slate-800 text-xs font-bold leading-tight">{text}</p>
          <div className={`absolute top-1/2 -translate-y-1/2 ${isBottom ? '-left-2 border-r-8 border-r-white/90' : '-right-2 border-l-8 border-l-white/90'} border-t-8 border-t-transparent border-b-8 border-b-transparent`}></div>
        </div>
        <div className={`mt-1 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded self-${isBottom ? 'start' : 'end'} border border-white/20`}>
          {name}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-slate-950 overflow-hidden flex flex-col font-sans text-slate-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

      {/* Opponent Section */}
      <div className="relative flex-1 flex flex-col">
        <CardGrid cards={opponent ? opponent.formation : Array(5).fill(null)} isOpponent />
        <div className="flex-1 relative">
          <AnimatePresence>
            {showOpponentBubble && opponent && (
              <SpeechBubble 
                name={opponent.name} 
                text={opponent.quote} 
                avatar={opponent.avatar} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center PUSH Button & Mode Selector */}
      <div className="relative h-28 z-40 flex flex-col items-center justify-center">
        
        {/* Mode Selector */}
        <div className="absolute top-0 flex gap-2 bg-black/50 p-1 rounded-full border border-slate-600 backdrop-blur-sm z-20">
          <button 
            onClick={() => setMode('bot')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${mode === 'bot' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Bot size={12} /> BOT
          </button>
          <button 
            onClick={() => setMode('multiplayer')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${mode === 'multiplayer' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Users size={12} /> MULTIPLAYER
          </button>
        </div>

        <div className="absolute inset-0 top-6 bg-gradient-to-r from-pink-500 via-white to-pink-500 h-12 my-auto shadow-[0_0_20px_rgba(236,72,153,0.5)] border-y-2 border-pink-300 flex items-center justify-center">
          <div className="absolute left-4 border-l-8 border-l-pink-700 border-y-8 border-y-transparent"></div>
          <div className="absolute right-4 flex gap-1">
            <Star size={16} className="text-pink-700 fill-current" />
            <Star size={12} className="text-pink-700 fill-current" />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBattle}
            disabled={battleState !== 'idle' || activeIdols.length === 0}
            className="relative z-10 text-pink-600 font-black italic text-3xl tracking-[0.2em] drop-shadow-sm disabled:opacity-50"
          >
            {battleState === 'searching' ? 'SEARCHING...' : 'PUSH'}
          </motion.button>
        </div>
      </div>

      {/* Player Section */}
      <div className="relative flex-1 flex flex-col-reverse">
        <CardGrid cards={formation} />
        <div className="flex-1 relative">
          <AnimatePresence>
            {showPlayerBubble && playerLeader && (
              <SpeechBubble 
                isBottom
                name={playerLeader.name} 
                text="My everything, into this song...!" 
                avatar={playerLeader.img} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Battle Animation Overlay */}
      <AnimatePresence>
        {battleState === 'battling' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-pink-600 font-black text-6xl italic drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
            >
              LIVE!!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {battleState === 'result' && result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-xs bg-gradient-to-b ${result.isWin ? 'from-blue-600 to-indigo-900' : 'from-slate-700 to-slate-900'} rounded-2xl border-4 border-yellow-400 p-6 text-center shadow-2xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-white italic tracking-widest mb-4 drop-shadow-md">
                  {result.isWin ? 'VICTORY' : 'DEFEAT'}
                </h2>
                
                <div className="bg-black/40 rounded-xl p-4 mb-6 border border-white/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm">Fans</span>
                    <span className="text-pink-400 font-bold">+{result.fansGained}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Money</span>
                    <span className="text-yellow-400 font-bold">+{result.moneyGained}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setBattleState('idle');
                    setOpponent(null);
                    setResult(null);
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-3 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <nav className="h-14 bg-gradient-to-b from-blue-800 to-blue-950 border-t-2 border-blue-400 flex items-stretch z-40">
        <button onClick={() => onNavigate('main')} className="flex-1 flex flex-col items-center justify-center hover:bg-white/10 transition-colors border-r border-blue-400/30">
          <ChevronLeft size={20} className="text-blue-200" />
          <span className="text-[8px] font-bold text-blue-200 uppercase mt-0.5">Back</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center hover:bg-white/10 transition-colors border-r border-blue-400/30">
          <PlayCircle size={20} className="text-blue-200" />
          <span className="text-[8px] font-bold text-blue-200 uppercase mt-0.5">Auto</span>
        </button>
        <button onClick={() => onNavigate('main')} className="flex-1 flex flex-col items-center justify-center hover:bg-white/10 transition-colors border-r border-blue-400/30">
          <Home size={20} className="text-blue-200" />
          <span className="text-[8px] font-bold text-blue-200 uppercase mt-0.5">My Studio</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center hover:bg-white/10 transition-colors border-r border-blue-400/30">
          <RefreshCcw size={20} className="text-blue-200" />
          <span className="text-[8px] font-bold text-blue-200 uppercase mt-0.5">Reload</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
          <Menu size={20} className="text-blue-200" />
          <span className="text-[8px] font-bold text-blue-200 uppercase mt-0.5">Menu</span>
        </button>
      </nav>
    </div>
  );
}
