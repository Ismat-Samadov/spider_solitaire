'use client';
import { motion } from 'framer-motion';

interface CompletedPilesProps {
  completed: number; // 0-8
}

export function CompletedPiles({ completed }: CompletedPilesProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-1 flex-wrap justify-end">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-6 h-8 md:w-7 md:h-10 rounded border ${
              i < completed
                ? 'bg-gradient-to-br from-gold/80 to-amber-600 border-gold/50 shadow-lg shadow-gold/20'
                : 'border-dashed border-neon/20 bg-transparent'
            }`}
            initial={false}
            animate={i < completed ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {i < completed && (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-felt font-bold text-[10px] select-none">K</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <span className="text-neon/70 text-xs font-mono">{completed}/8 sets</span>
    </div>
  );
}
