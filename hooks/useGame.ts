'use client';
import { useState, useCallback } from 'react';
import { GameState, Difficulty } from '@/types/game';
import {
  createInitialGameState,
  handleCardClick,
  handleColumnClick,
  dealFromStock,
  undoMove,
} from '@/utils/gameEngine';

const IDLE_STATE: GameState = {
  columns: [],
  stock: [],
  completed: 0,
  selection: null,
  moves: 0,
  score: 500,
  difficulty: 'easy',
  status: 'idle',
  history: [],
};

export function useGame() {
  const [state, setState] = useState<GameState>(IDLE_STATE);

  const newGame = useCallback((difficulty: Difficulty) => {
    setState(createInitialGameState(difficulty));
  }, []);

  const resetToIdle = useCallback(() => {
    setState(IDLE_STATE);
  }, []);

  const onCardClick = useCallback((columnIndex: number, cardIndex: number) => {
    setState(prev => handleCardClick(prev, columnIndex, cardIndex));
  }, []);

  const onColumnClick = useCallback((columnIndex: number) => {
    setState(prev => handleColumnClick(prev, columnIndex));
  }, []);

  const onStockClick = useCallback(() => {
    setState(prev => dealFromStock(prev));
  }, []);

  const onUndo = useCallback(() => {
    setState(prev => undoMove(prev));
  }, []);

  const onPause = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: prev.status === 'playing' ? 'paused' : 'playing',
    }));
  }, []);

  const onNewGame = useCallback((difficulty: Difficulty) => {
    setState(createInitialGameState(difficulty));
  }, []);

  return {
    state,
    newGame,
    resetToIdle,
    onCardClick,
    onColumnClick,
    onStockClick,
    onUndo,
    onPause,
    onNewGame,
  };
}
