import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Gift, Loader2 } from 'lucide-react';

interface PromoCodeModalProps {
  onClose: () => void;
  userId: number;
  onSuccess: () => void;
}

export function PromoCodeModal({ onClose, userId, onSuccess }: PromoCodeModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleRedeem = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/promocode/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: code.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        onSuccess();
        setCode('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to redeem code' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 border-2 border-blue-400 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center border-b border-blue-500">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Gift className="text-yellow-300" />
            <span>Promo Code</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-slate-300 text-sm">
            Enter your promo code below to receive special rewards!
          </p>

          <div className="space-y-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code (e.g. WELCOME2026)"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 uppercase font-mono tracking-wider"
              disabled={loading}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${
              message.type === 'success' ? 'bg-green-900/50 text-green-200 border border-green-700' : 'bg-red-900/50 text-red-200 border border-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <button
            onClick={handleRedeem}
            disabled={loading || !code.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-lg border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Redeem Reward'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
