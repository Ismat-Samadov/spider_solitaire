'use client';
import { useEffect, useCallback, useRef } from 'react';
import { Difficulty } from '@/types/game';
import { useGame } from '@/hooks/useGame';
import { useTimer } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import { useHighScore } from '@/hooks/useHighScore';
import { GameHeader } from './GameHeader';
import { Column } from './Column';
import { StockPile } from './StockPile';
import { CompletedPiles } from './CompletedPiles';
import { WinScreen } from './WinScreen';
import { PauseMenu } from './PauseMenu';
import { DifficultySelector } from './DifficultySelector';

export function GameBoard() {
  const { state, resetToIdle, onCardClick, onColumnClick, onStockClick, onUndo, onPause, onNewGame } =
    useGame();
  const { formatted: timer, reset: resetTimer } = useTimer(state.status === 'playing');
  const sound = useSound();
  const { highScores, saveScore } = useHighScore();

  // Track previous completed count to detect new completions
  const prevCompleted = useRef(state.completed);
  const prevMoves = useRef(state.moves);
  const prevStatus = useRef(state.status);

  // Play sound on card move
  useEffect(() => {
    if (state.moves !== prevMoves.current && state.status === 'playing') {
      sound.playCardPlace();
      prevMoves.current = state.moves;
    }
  }, [state.moves, state.status, sound]);

  // Play sound on sequence complete
  useEffect(() => {
    if (state.completed > prevCompleted.current) {
      sound.playComplete();
      prevCompleted.current = state.completed;
    }
  }, [state.completed, sound]);

  // Handle win
  useEffect(() => {
    if (state.status === 'won' && prevStatus.current !== 'won') {
      sound.playWin();
      saveScore(state.score, state.moves, state.difficulty);
    }
    prevStatus.current = state.status;
  }, [state.status, state.score, state.moves, state.difficulty, sound, saveScore]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      if (key === 'u') onUndo();
      else if (key === 'p' || key === 'escape') {
        if (state.status === 'playing' || state.status === 'paused') onPause();
      } else if (key === 'n') handleNewGame(state.difficulty);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.difficulty, state.status, onUndo, onPause]);

  const handleNewGame = useCallback(
    (difficulty: Difficulty) => {
      onNewGame(difficulty);
      resetTimer();
      prevCompleted.current = 0;
      prevMoves.current = 0;
      prevStatus.current = 'playing';
    },
    [onNewGame, resetTimer]
  );

  const handleChangeDifficulty = useCallback(() => {
    resetToIdle();
    resetTimer();
    prevCompleted.current = 0;
    prevMoves.current = 0;
    prevStatus.current = 'idle';
  }, [resetToIdle, resetTimer]);

  const handleStockClick = useCallback(() => {
    if (state.stock.length > 0) {
      sound.playDeal();
    }
    onStockClick();
  }, [state.stock.length, sound, onStockClick]);

  // Show difficulty selector on idle
  if (state.status === 'idle') {
    return <DifficultySelector onSelect={handleNewGame} highScores={highScores} />;
  }

  return (
    <div className="min-h-screen bg-felt flex flex-col overflow-hidden select-none">
      <GameHeader
        score={state.score}
        moves={state.moves}
        timer={timer}
        status={state.status}
        difficulty={state.difficulty}
        historyLength={state.history.length}
        soundEnabled={sound.enabled}
        onUndo={onUndo}
        onPause={onPause}
        onNewGame={() => handleNewGame(state.difficulty)}
        onToggleSound={sound.toggle}
      />

      {/* Top bar: stock + completed piles */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neon/5 shrink-0">
        <StockPile
          stockCount={state.stock.length}
          onClick={handleStockClick}
          disabled={state.status !== 'playing'}
        />
        <CompletedPiles completed={state.completed} />
      </div>

      {/* Game board: 10 columns */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 pb-4">
        <div
          className="flex gap-1"
          style={{ minHeight: '400px' }}
        >
          {state.columns.map((column, idx) => (
            <Column
              key={idx}
              column={column}
              columnIndex={idx}
              selection={state.selection}
              onCardClick={onCardClick}
              onColumnClick={onColumnClick}
            />
          ))}
        </div>
      </div>

      {/* Paused overlay */}
      {state.status === 'paused' && (
        <PauseMenu
          onResume={onPause}
          onNewGame={handleNewGame}
          onChangeDifficulty={handleChangeDifficulty}
          difficulty={state.difficulty}
        />
      )}

      {/* Win overlay */}
      {state.status === 'won' && (
        <WinScreen
          score={state.score}
          moves={state.moves}
          timer={timer}
          difficulty={state.difficulty}
          highScore={highScores[state.difficulty]}
          onNewGame={handleNewGame}
          onChangeDifficulty={handleChangeDifficulty}
        />
      )}
    </div>
  );
}
