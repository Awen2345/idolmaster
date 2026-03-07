import React from 'react';
import { motion } from 'motion/react';

export function WorkProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
      <motion.div 
        className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
