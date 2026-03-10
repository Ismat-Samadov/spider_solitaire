'use client';
import { useState, useCallback } from 'react';
import { HighScore, Difficulty } from '@/types/game';

const STORAGE_KEY = 'spider-solitaire-highscores';

type HighScoreMap = Record<Difficulty, HighScore | null>;

function loadFromStorage(): HighScoreMap {
  if (typeof window === 'undefined') return { easy: null, medium: null, hard: null };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as HighScoreMap) : { easy: null, medium: null, hard: null };
  } catch {
    return { easy: null, medium: null, hard: null };
  }
}

export function useHighScore() {
  const [highScores, setHighScores] = useState<HighScoreMap>(loadFromStorage);

  const saveScore = useCallback((score: number, moves: number, difficulty: Difficulty) => {
    setHighScores(prev => {
      const current = prev[difficulty];
      if (current && current.score >= score) return prev;
      const next: HighScoreMap = {
        ...prev,
        [difficulty]: {
          score,
          moves,
          difficulty,
          date: new Date().toLocaleDateString(),
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage may not be available
      }
      return next;
    });
  }, []);

  return { highScores, saveScore };
}
