'use client';
import { Difficulty, HighScore } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface WinScreenProps {
  score: number;
  moves: number;
  timer: string;
  difficulty: Difficulty;
  highScore: HighScore | null;
  onNewGame: (difficulty: Difficulty) => void;
  onChangeDifficulty: () => void;
}

export function WinScreen({
  score,
  moves,
  timer,
  difficulty,
  highScore,
  onNewGame,
  onChangeDifficulty,
}: WinScreenProps) {
  const isHighScore = !highScore || score > highScore.score;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Confetti-like particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ['#00ff88', '#ffd700', '#ff6b6b', '#4ecdc4'][i % 4],
            left: `${Math.random() * 100}%`,
            top: '-10px',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 720],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeIn',
          }}
        />
      ))}

      <motion.div
        className="bg-felt-light border-2 border-neon/30 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl shadow-neon/10 relative z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
      >
        {/* Trophy */}
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          🏆
        </motion.div>

        <h2 className="text-3xl font-bold text-neon mb-1">You Win!</h2>
        <p className="text-white/50 text-sm mb-4">
          Congratulations! All 8 sequences complete!
        </p>

        {isHighScore && (
          <motion.div
            className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold mb-4 bg-gold/10 px-3 py-1 rounded-full border border-gold/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            ✨ New High Score!
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 my-6 bg-felt/50 rounded-xl p-4">
          <div>
            <div className="text-gold font-bold text-xl">{score}</div>
            <div className="text-white/40 text-xs mt-0.5">Score</div>
          </div>
          <div>
            <div className="text-white font-bold text-xl">{moves}</div>
            <div className="text-white/40 text-xs mt-0.5">Moves</div>
          </div>
          <div>
            <div className="text-white font-bold text-lg">{timer}</div>
            <div className="text-white/40 text-xs mt-0.5">Time</div>
          </div>
        </div>

        {/* Difficulty badge */}
        <div className="mb-5">
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              difficulty === 'easy'
                ? 'bg-emerald-500/20 text-emerald-400'
                : difficulty === 'medium'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => onNewGame(difficulty)}
          >
            Play Again
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={onChangeDifficulty}
          >
            Change Difficulty
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
