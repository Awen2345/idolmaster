import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Heart, Music, Sparkles } from 'lucide-react';

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
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm text-center">{error}</div>}
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
              disabled={isLoading || !username || !password}
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
