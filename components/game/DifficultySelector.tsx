'use client';
import { Difficulty } from '@/types/game';
import { motion } from 'framer-motion';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  highScores: Record<Difficulty, { score: number; date: string } | null>;
}

const difficulties: {
  value: Difficulty;
  label: string;
  desc: string;
  suits: string;
  colorClass: string;
}[] = [
  {
    value: 'easy',
    label: 'Easy',
    desc: '1 Suit — All Spades',
    suits: '♠♠♠♠',
    colorClass:
      'text-emerald-400 border-emerald-400/30 hover:border-emerald-400/60 hover:bg-emerald-400/5',
  },
  {
    value: 'medium',
    label: 'Medium',
    desc: '2 Suits — Spades & Hearts',
    suits: '♠♥♠♥',
    colorClass:
      'text-amber-400 border-amber-400/30 hover:border-amber-400/60 hover:bg-amber-400/5',
  },
  {
    value: 'hard',
    label: 'Hard',
    desc: '4 Suits — All Suits',
    suits: '♠♥♦♣',
    colorClass: 'text-red-400 border-red-400/30 hover:border-red-400/60 hover:bg-red-400/5',
  },
];

export function DifficultySelector({ onSelect, highScores }: DifficultySelectorProps) {
  return (
    <div className="min-h-screen bg-felt flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            className="text-7xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1, duration: 0.6 }}
          >
            🕷️
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            <span className="text-neon">Spider</span> Solitaire
          </h1>
          <p className="text-white/50 text-sm">Build all 8 sequences from King to Ace</p>
        </div>

        {/* Difficulty cards */}
        <div className="grid gap-3 mb-8">
          {difficulties.map(({ value, label, desc, suits, colorClass }, idx) => (
            <motion.button
              key={value}
              className={`w-full p-5 rounded-xl border-2 bg-felt-light/50 backdrop-blur transition-all duration-200 ${colorClass} focus:outline-none focus:ring-2 focus:ring-neon/50`}
              onClick={() => onSelect(value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-xl font-bold">{label}</div>
                  <div className="text-white/50 text-sm mt-0.5">{desc}</div>
                  <div className="text-2xl mt-2 tracking-wider font-semibold">{suits}</div>
                </div>
                {highScores[value] ? (
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-gold font-bold text-xl">{highScores[value]!.score}</div>
                    <div className="text-white/40 text-xs mt-0.5">Best Score</div>
                    <div className="text-white/30 text-xs">{highScores[value]!.date}</div>
                  </div>
                ) : (
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-white/20 text-sm">No record</div>
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Controls hint */}
        <motion.div
          className="text-center text-white/25 text-xs space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>Click a card to select • Click destination to move • Click stock to deal</p>
          <p>Keyboard: U = Undo • P = Pause • N = New Game • Esc = Pause</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
