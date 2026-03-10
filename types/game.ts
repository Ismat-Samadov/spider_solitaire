export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'playing' | 'paused' | 'won';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export interface GameColumn {
  cards: Card[];
}

export interface Selection {
  columnIndex: number;
  cardIndex: number;
}

export interface HistoryEntry {
  columns: GameColumn[];
  stock: Card[];
  completed: number;
  moves: number;
  score: number;
}

export interface GameState {
  columns: GameColumn[];
  stock: Card[];
  completed: number;
  selection: Selection | null;
  moves: number;
  score: number;
  difficulty: Difficulty;
  status: GameStatus;
  history: HistoryEntry[];
}

export interface HighScore {
  score: number;
  moves: number;
  difficulty: Difficulty;
  date: string;
}
