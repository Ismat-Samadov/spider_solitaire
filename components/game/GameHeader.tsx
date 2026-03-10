'use client';
import { Difficulty, GameStatus } from '@/types/game';
import { Button } from '@/components/ui/Button';

interface GameHeaderProps {
  score: number;
  moves: number;
  timer: string;
  status: GameStatus;
  difficulty: Difficulty;
  historyLength: number;
  soundEnabled: boolean;
  hasHint: boolean;
  onUndo: () => void;
  onPause: () => void;
  onNewGame: () => void;
  onToggleSound: () => void;
  onHint: () => void;
}

export function GameHeader({
  score,
  moves,
  timer,
  status,
  difficulty,
  historyLength,
  soundEnabled,
  hasHint,
  onUndo,
  onPause,
  onNewGame,
  onToggleSound,
  onHint,
}: GameHeaderProps) {
  const difficultyStyle =
    difficulty === 'easy'
      ? 'bg-emerald-500/20 text-emerald-400'
      : difficulty === 'medium'
      ? 'bg-amber-500/20 text-amber-400'
      : 'bg-red-500/20 text-red-400';

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-felt-light/80 backdrop-blur border-b border-neon/10 shrink-0">
      {/* Left: game info */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex flex-col items-center min-w-[40px]">
          <span className="text-gold font-bold text-lg leading-none">{score}</span>
          <span className="text-white/40 text-[10px] uppercase tracking-wider">Score</span>
        </div>
        <div className="w-px h-8 bg-white/10 hidden sm:block" />
        <div className="flex flex-col items-center min-w-[32px]">
          <span className="text-white font-mono text-sm">{moves}</span>
          <span className="text-white/40 text-[10px] uppercase tracking-wider">Moves</span>
        </div>
        <div className="w-px h-8 bg-white/10 hidden sm:block" />
        <div className="flex flex-col items-center min-w-[44px]">
          <span className="text-white font-mono text-sm">{timer}</span>
          <span className="text-white/40 text-[10px] uppercase tracking-wider">Time</span>
        </div>
        <div className="w-px h-8 bg-white/10 hidden sm:block" />
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${difficultyStyle}`}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onHint}
          disabled={!hasHint}
          title="Show a hint (H key)"
        >
          💡 Hint
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onUndo}
          disabled={historyLength === 0}
          title="Undo (U key) — costs 5 pts"
        >
          ↩ Undo
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onPause}
          title={status === 'paused' ? 'Resume (P)' : 'Pause (P)'}
        >
          {status === 'paused' ? '▶ Resume' : '⏸'}
        </Button>
        <Button variant="secondary" size="sm" onClick={onNewGame} title="New game (N)">
          ↺ New
        </Button>
      </div>
    </header>
  );
}
