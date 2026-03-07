import React from 'react';
import { Gift } from 'lucide-react';
import { motion } from 'motion/react';

interface FloatingPromoButtonProps {
  onClick: () => void;
}

export function FloatingPromoButton({ onClick }: FloatingPromoButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="absolute bottom-20 right-4 z-40 bg-gradient-to-br from-pink-500 to-rose-600 text-white p-3 rounded-full shadow-lg border-2 border-white/50 hover:shadow-xl transition-shadow group"
    >
      <div className="relative">
        <Gift size={24} className="drop-shadow-md group-hover:animate-bounce" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
      </div>
    </motion.button>
  );
}
