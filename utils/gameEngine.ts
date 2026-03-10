import { Card, GameColumn, GameState, Difficulty, Suit, Rank, HistoryEntry } from '@/types/game';

// Fisher-Yates shuffle
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Create 104 cards based on difficulty
// Easy:   8 copies of spades (8×13 = 104)
// Medium: 4 copies of spades + 4 copies of hearts (104)
// Hard:   2 copies each of spades, hearts, diamonds, clubs (104)
export function createDeck(difficulty: Difficulty): Card[] {
  let suits: Suit[];
  let reps: number;

  if (difficulty === 'easy') {
    suits = ['spades'];
    reps = 8;
  } else if (difficulty === 'medium') {
    suits = ['spades', 'hearts'];
    reps = 4;
  } else {
    suits = ['spades', 'hearts', 'diamonds', 'clubs'];
    reps = 2;
  }

  const cards: Card[] = [];
  let id = 0;

  for (let rep = 0; rep < reps; rep++) {
    for (const suit of suits) {
      for (let rank = 1; rank <= 13; rank++) {
        cards.push({ id: `c${id++}`, suit, rank: rank as Rank, faceUp: false });
      }
    }
  }

  return shuffle(cards);
}

export function createInitialGameState(difficulty: Difficulty): GameState {
  const deck = createDeck(difficulty);
  let idx = 0;

  const columns: GameColumn[] = [];
  for (let col = 0; col < 10; col++) {
    const count = col < 4 ? 6 : 5;
    const cards: Card[] = [];
    for (let i = 0; i < count; i++) {
      cards.push({ ...deck[idx++], faceUp: i === count - 1 });
    }
    columns.push({ cards });
  }

  return {
    columns,
    stock: deck.slice(idx), // 50 cards remaining
    completed: 0,
    selection: null,
    moves: 0,
    score: 500,
    difficulty,
    status: 'playing',
    history: [],
  };
}

// Returns the starting index of a moveable sequence from cardIndex, or null
// A moveable sequence is a face-up descending run (any suits OK for movement)
export function getMoveableFrom(column: GameColumn, cardIndex: number): number | null {
  const cards = column.cards;
  if (cardIndex >= cards.length || !cards[cardIndex].faceUp) return null;

  for (let i = cardIndex; i < cards.length - 1; i++) {
    if (!cards[i + 1].faceUp || cards[i].rank !== cards[i + 1].rank + 1) return null;
  }
  return cardIndex;
}

// Can the given cards be placed on toColumn?
// The bottom card of movingCards must be exactly 1 less than the top card of toColumn
export function canMoveCards(movingCards: Card[], toColumn: GameColumn): boolean {
  if (toColumn.cards.length === 0) return true;
  const topCard = toColumn.cards[toColumn.cards.length - 1];
  if (!topCard.faceUp) return false;
  return topCard.rank === movingCards[0].rank + 1;
}

// Check and remove completed K-A same-suit sequences from any column
function checkAndRemoveCompleted(columns: GameColumn[]): { columns: GameColumn[]; removed: number } {
  let removed = 0;
  const newColumns = columns.map(col => {
    if (col.cards.length < 13) return col;
    const last13 = col.cards.slice(-13);
    if (last13[0].rank !== 13 || !last13[0].faceUp) return col;
    const suit = last13[0].suit;
    const complete = last13.every(
      (card, i) => card.faceUp && card.suit === suit && card.rank === 13 - i
    );
    if (complete) {
      removed++;
      return { cards: col.cards.slice(0, -13) };
    }
    return col;
  });
  return { columns: newColumns, removed };
}

// Flip the top face-down card of each column
function flipTopCards(columns: GameColumn[]): GameColumn[] {
  return columns.map(col => {
    if (col.cards.length === 0) return col;
    const last = col.cards[col.cards.length - 1];
    if (last.faceUp) return col;
    return { cards: [...col.cards.slice(0, -1), { ...last, faceUp: true }] };
  });
}

function saveHistory(state: GameState): HistoryEntry {
  return {
    columns: state.columns.map(col => ({ cards: [...col.cards] })),
    stock: [...state.stock],
    completed: state.completed,
    moves: state.moves,
    score: state.score,
  };
}

export function moveCards(
  state: GameState,
  fromColIdx: number,
  fromCardIdx: number,
  toColIdx: number
): GameState {
  const movingCards = state.columns[fromColIdx].cards.slice(fromCardIdx);
  if (movingCards.length === 0 || !canMoveCards(movingCards, state.columns[toColIdx])) {
    return { ...state, selection: null };
  }

  const history = [...state.history, saveHistory(state)];

  let newColumns = state.columns.map((col, idx) => {
    if (idx === fromColIdx) return { cards: col.cards.slice(0, fromCardIdx) };
    if (idx === toColIdx) return { cards: [...col.cards, ...movingCards] };
    return col;
  });

  newColumns = flipTopCards(newColumns);
  const { columns: checkedColumns, removed } = checkAndRemoveCompleted(newColumns);

  const newCompleted = state.completed + removed;
  const newScore = state.score - 1 + removed * 100;
  const newMoves = state.moves + 1;
  const status = newCompleted >= 8 ? 'won' : state.status;

  return {
    ...state,
    columns: checkedColumns,
    completed: newCompleted,
    score: newScore,
    moves: newMoves,
    selection: null,
    history,
    status,
  };
}

export function dealFromStock(state: GameState): GameState {
  if (state.stock.length === 0) return state;
  // Need at least 10 cards to deal one to each column (or deal as many as available)
  // Standard spider: deal exactly 10 cards (one per column), only if all columns non-empty
  // We'll allow partial deal if stock has fewer than 10

  const history = [...state.history, saveHistory(state)];
  const newStock = [...state.stock];

  const newColumns = state.columns.map(col => {
    const card = newStock.shift();
    if (!card) return col;
    return { cards: [...col.cards, { ...card, faceUp: true }] };
  });

  const { columns: checkedColumns, removed } = checkAndRemoveCompleted(newColumns);
  const newCompleted = state.completed + removed;
  const newScore = state.score - 1 + removed * 100;
  const status = newCompleted >= 8 ? 'won' : state.status;

  return {
    ...state,
    columns: checkedColumns,
    stock: newStock,
    completed: newCompleted,
    score: newScore,
    moves: state.moves + 1,
    selection: null,
    history,
    status,
  };
}

export function undoMove(state: GameState): GameState {
  if (state.history.length === 0) return state;
  const last = state.history[state.history.length - 1];
  return {
    ...state,
    columns: last.columns,
    stock: last.stock,
    completed: last.completed,
    moves: last.moves,
    score: Math.max(0, last.score - 5),
    selection: null,
    history: state.history.slice(0, -1),
    status: 'playing',
  };
}

export function handleCardClick(
  state: GameState,
  columnIndex: number,
  cardIndex: number
): GameState {
  if (state.status !== 'playing') return state;

  // If there's a selection from a different column, try to move there
  if (state.selection && state.selection.columnIndex !== columnIndex) {
    return moveCards(state, state.selection.columnIndex, state.selection.cardIndex, columnIndex);
  }

  // If clicking the already selected card, deselect
  if (
    state.selection?.columnIndex === columnIndex &&
    state.selection?.cardIndex === cardIndex
  ) {
    return { ...state, selection: null };
  }

  // Try to select
  const moveableFrom = getMoveableFrom(state.columns[columnIndex], cardIndex);
  if (moveableFrom === null) return { ...state, selection: null };

  return { ...state, selection: { columnIndex, cardIndex: moveableFrom } };
}

export function handleColumnClick(state: GameState, columnIndex: number): GameState {
  if (state.status !== 'playing') return { ...state, selection: null };

  // If clicking same column as selection, deselect
  if (state.selection?.columnIndex === columnIndex) {
    return { ...state, selection: null };
  }

  // If no selection, nothing to do
  if (!state.selection) return state;

  // Move cards to this column
  return moveCards(state, state.selection.columnIndex, state.selection.cardIndex, columnIndex);
}

// Check if game is stuck (no valid moves and no stock left)
export function isGameStuck(state: GameState): boolean {
  if (state.stock.length > 0) return false;

  for (let fromCol = 0; fromCol < state.columns.length; fromCol++) {
    const column = state.columns[fromCol];
    for (let cardIdx = 0; cardIdx < column.cards.length; cardIdx++) {
      if (getMoveableFrom(column, cardIdx) === null) continue;
      const movingCards = column.cards.slice(cardIdx);
      for (let toCol = 0; toCol < state.columns.length; toCol++) {
        if (toCol === fromCol) continue;
        if (canMoveCards(movingCards, state.columns[toCol])) return false;
      }
    }
  }
  return true;
}
