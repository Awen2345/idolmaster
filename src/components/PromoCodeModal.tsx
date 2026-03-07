import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onRedeemSuccess: () => void;
}

export function PromoCodeModal({ isOpen, onClose, userId, onRedeemSuccess }: PromoCodeModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [reward, setReward] = useState<{ coins?: number; jewels?: number } | null>(null);

  const handleRedeem = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setMessage(null);
    setReward(null);

    try {
      const res = await fetch('/api/promocode/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: code.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Promo code redeemed successfully!' });
        setReward(data.reward);
        onRedeemSuccess();
        setCode('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to redeem code' });
      }
    } catch (error) {
      console.error('Redemption error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border-4 border-blue-400"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Gift size={20} className="text-yellow-300" />
                <h3 className="font-bold text-lg drop-shadow-md">Redeem Promo Code</h3>
              </div>
              <button 
                onClick={onClose}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 bg-blue-50">
              <div className="mb-4">
                <label className="block text-sm font-bold text-blue-800 mb-2">
                  Enter your code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME2026"
                  className="w-full p-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-center text-lg uppercase tracking-widest text-blue-900 placeholder-blue-200"
                  disabled={isLoading}
                />
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-bold ${
                  message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </div>
              )}

              {reward && (
                <div className="mb-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-2">Rewards Received</p>
                  <div className="flex justify-center gap-4">
                    {reward.coins && (
                      <div className="flex flex-col items-center">
                        <div className="bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md mb-1">
                          <span className="font-bold text-xs">Coin</span>
                        </div>
                        <span className="font-bold text-yellow-900">+{reward.coins}</span>
                      </div>
                    )}
                    {reward.jewels && (
                      <div className="flex flex-col items-center">
                        <div className="bg-pink-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md mb-1">
                          <span className="font-bold text-xs">Jewel</span>
                        </div>
                        <span className="font-bold text-pink-900">+{reward.jewels}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleRedeem}
                disabled={isLoading || !code.trim()}
                className="w-full bg-gradient-to-b from-pink-500 to-pink-600 text-white font-bold py-3 rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Redeem'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
