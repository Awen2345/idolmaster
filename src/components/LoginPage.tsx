import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Sparkles } from 'lucide-react';

export function LoginPage({ onLogin }: { onLogin: (userId: number) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (data.success) {
          onLogin(data.userId);
        } else {
          setError(data.error || 'Login failed');
          setIsLoading(false);
        }
      } catch (err) {
        setError('Network error. Please try again.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col font-sans">
      {/* Background Image with original ratio */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img 
          src="https://assets.st-note.com/production/uploads/images/5078440/picture_pc_1aef0fc7c152d38a214dcbb63873a093.jpg?width=1200" 
          alt="Title Screen" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      
      {/* Gradient overlay at the bottom for readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0 pointer-events-none"></div>

      {/* Main Content Area - Pushed to bottom */}
      <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto justify-end pb-12 px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="bg-red-500/80 backdrop-blur-sm border border-red-400 text-white px-4 py-2 rounded-lg text-sm text-center shadow-lg">{error}</div>}
            
            <div className="space-y-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-white/30 bg-black/40 backdrop-blur-md text-white placeholder-gray-300 text-center focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 transition-all outline-none"
                placeholder="Producer ID"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-white/30 bg-black/40 backdrop-blur-md text-white placeholder-gray-300 text-center focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 transition-all outline-none"
                placeholder="Password"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-black text-lg tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-none border border-pink-400/50"
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
                  GAME START
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <div className="text-[10px] text-gray-400 tracking-widest">
              © BANDAI NAMCO Entertainment Inc.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
