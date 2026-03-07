import React from 'react';
import { motion } from 'motion/react';
import { Gift } from 'lucide-react';

interface FloatingPromoButtonProps {
  onClick: () => void;
}

export function FloatingPromoButton({ onClick }: FloatingPromoButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="absolute bottom-24 right-4 z-50 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-3 rounded-full shadow-lg border-2 border-white/50 flex items-center justify-center group"
    >
      <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse-slow"></div>
      <Gift size={28} className="drop-shadow-md text-white group-hover:text-yellow-100 transition-colors" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
    </motion.button>
  );
}
