'use client';
import { Difficulty } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface PauseMenuProps {
  onResume: () => void;
  onNewGame: (difficulty: Difficulty) => void;
  onChangeDifficulty: () => void;
  difficulty: Difficulty;
}

export function PauseMenu({ onResume, onNewGame, onChangeDifficulty, difficulty }: PauseMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-felt-light border border-neon/20 rounded-2xl p-8 max-w-xs w-full mx-4 text-center shadow-2xl shadow-black/50"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="text-5xl mb-4 select-none">⏸</div>
        <h2 className="text-2xl font-bold text-white mb-2">Paused</h2>
        <p className="text-white/40 text-sm mb-6">Game is paused</p>
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" className="w-full" onClick={onResume}>
            ▶ Resume
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => onNewGame(difficulty)}
          >
            ↺ New Game
          </Button>
          <Button variant="ghost" size="md" className="w-full" onClick={onChangeDifficulty}>
            Change Difficulty
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
