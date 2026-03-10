'use client';
import { useEffect, useCallback, useRef, useState } from 'react';
import { Difficulty } from '@/types/game';
import { useGame } from '@/hooks/useGame';
import { useTimer } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import { useHighScore } from '@/hooks/useHighScore';
import { useCardSize } from '@/hooks/useCardSize';
import { getValidTargets, findHint, HintMove } from '@/utils/gameEngine';
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
  const cardSize = useCardSize();

  // Hint state: when user presses Hint, flash the source+target for 2s
  const [hint, setHint] = useState<HintMove | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track previous values to detect changes
  const prevCompleted = useRef(state.completed);
  const prevMoves = useRef(state.moves);
  const prevStatus = useRef(state.status);

  // Valid drop targets for the current selection
  const validTargets = state.selection ? getValidTargets(state) : [];

  // Play sounds on moves
  useEffect(() => {
    if (state.moves !== prevMoves.current && state.status === 'playing') {
      sound.playCardPlace();
      prevMoves.current = state.moves;
    }
  }, [state.moves, state.status, sound]);

  // Play sound on sequence completion
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

  // Clear hint when state changes
  useEffect(() => {
    if (hint) {
      setHint(null);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    }
  }, [state.moves, state.completed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (key === 'u') onUndo();
      else if (key === 'h') handleHint();
      else if (key === 'escape' || key === 'p') {
        if (state.status === 'playing' || state.status === 'paused') onPause();
      } else if (key === 'n') handleNewGame(state.difficulty);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.difficulty, state.status, onUndo, onPause]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNewGame = useCallback(
    (difficulty: Difficulty) => {
      onNewGame(difficulty);
      resetTimer();
      setHint(null);
      prevCompleted.current = 0;
      prevMoves.current = 0;
      prevStatus.current = 'playing';
    },
    [onNewGame, resetTimer]
  );

  const handleChangeDifficulty = useCallback(() => {
    resetToIdle();
    resetTimer();
    setHint(null);
  }, [resetToIdle, resetTimer]);

  const handleStockClick = useCallback(() => {
    if (state.stock.length > 0) sound.playDeal();
    onStockClick();
  }, [state.stock.length, sound, onStockClick]);

  const handleHint = useCallback(() => {
    if (state.status !== 'playing') return;
    const h = findHint(state);
    if (!h) return;
    setHint(h);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setHint(null), 2500);
  }, [state]);

  const handleCardClick = useCallback(
    (colIdx: number, cardIdx: number) => {
      setHint(null);
      onCardClick(colIdx, cardIdx);
    },
    [onCardClick]
  );

  const handleColumnClick = useCallback(
    (colIdx: number) => {
      setHint(null);
      onColumnClick(colIdx);
    },
    [onColumnClick]
  );

  if (state.status === 'idle') {
    return <DifficultySelector onSelect={handleNewGame} highScores={highScores} />;
  }

  const hintFrom = hint ? { fromCol: hint.fromCol, fromCard: hint.fromCard } : null;
  const hintTo = hint ? hint.toCol : null;
  const hasHint = findHint(state) !== null;

  return (
    <div className="h-screen bg-felt flex flex-col overflow-hidden select-none">
      <GameHeader
        score={state.score}
        moves={state.moves}
        timer={timer}
        status={state.status}
        difficulty={state.difficulty}
        historyLength={state.history.length}
        soundEnabled={sound.enabled}
        hasHint={hasHint}
        onUndo={onUndo}
        onPause={onPause}
        onNewGame={() => handleNewGame(state.difficulty)}
        onToggleSound={sound.toggle}
        onHint={handleHint}
      />

      {/* Controls hint bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/20 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <StockPile
            stockCount={state.stock.length}
            onClick={handleStockClick}
            disabled={state.status !== 'playing'}
          />
          <div className="text-white/30 text-[10px] leading-tight hidden sm:block">
            <div>Click a card to select it</div>
            <div>Click valid column <span className="text-emerald-400/60">(green)</span> to move</div>
            <div>Click stock pile to deal 10 cards</div>
          </div>
        </div>
        <CompletedPiles completed={state.completed} />
      </div>

      {/* Selection status banner */}
      {state.selection && (
        <div className="flex items-center justify-between px-3 py-1 bg-emerald-900/30 border-b border-emerald-400/20 shrink-0">
          <span className="text-emerald-300 text-xs">
            {validTargets.length > 0
              ? `✓ ${validTargets.length} valid destination${validTargets.length > 1 ? 's' : ''} highlighted in green — click one to move`
              : '✗ No valid destinations for these cards — click elsewhere to deselect'}
          </span>
          <button
            className="text-white/40 hover:text-white text-xs"
            onClick={() => onColumnClick(state.selection!.columnIndex)}
          >
            ✕ Deselect
          </button>
        </div>
      )}

      {/* Hint banner */}
      {hint && !state.selection && (
        <div className="flex items-center px-3 py-1 bg-amber-900/30 border-b border-amber-400/20 shrink-0">
          <span className="text-amber-300 text-xs">
            💡 Hint: move the <strong>amber-highlighted</strong> card(s) to the amber column
          </span>
        </div>
      )}

      {/* Game board */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 pb-4 mt-4">
        <div className="flex gap-1" style={{ minHeight: cardSize.cardHeight * 2 }}>
          {state.columns.map((column, idx) => (
            <Column
              key={idx}
              column={column}
              columnIndex={idx}
              selection={state.selection}
              validTargets={validTargets}
              hintFrom={hintFrom}
              hintTo={hintTo}
              cardSize={cardSize}
              onCardClick={handleCardClick}
              onColumnClick={handleColumnClick}
            />
          ))}
        </div>
      </div>

      {/* Overlays */}
      {state.status === 'paused' && (
        <PauseMenu
          onResume={onPause}
          onNewGame={handleNewGame}
          onChangeDifficulty={handleChangeDifficulty}
          difficulty={state.difficulty}
        />
      )}
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
