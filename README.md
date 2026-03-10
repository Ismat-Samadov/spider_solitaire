# Spider Solitaire

A complete, production-ready Spider Solitaire card game built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- Three difficulty levels: Easy (1 suit), Medium (2 suits), Hard (4 suits)
- Full Spider Solitaire rules with correct card movement logic
- Automatic removal of completed K→A same-suit sequences
- Unlimited undo (costs 5 points per undo)
- Stock pile dealing (5 deals of 10 cards each)
- Animated cards with neon glow selection effects
- Web Audio API sound effects (no external files required)
- High score persistence via localStorage
- Responsive design for desktop and mobile
- Keyboard shortcuts
- Pause/resume functionality
- Dark casino / neon glassmorphism theme

## Tech Stack

- **Next.js 15** — App Router, React Server Components
- **TypeScript** — Strict mode, full type safety
- **Tailwind CSS** — Utility-first styling with custom casino theme
- **Framer Motion** — Smooth card animations and UI transitions
- **Web Audio API** — Procedural sound effects, no audio files needed

## Game Rules

- 104 cards (2 standard decks), suits determined by difficulty
- 10 columns: columns 0–3 have 6 cards, columns 4–9 have 5 cards (54 dealt)
- All cards face down except the top card of each column
- Stock pile: 50 cards remaining (5 deals)
- **Moving cards**: Select a face-up descending sequence (any suits) and place it on a column where the top card is exactly 1 rank higher
- **Completing a sequence**: A King-to-Ace run of the **same suit** is automatically removed (+100 points)
- **Winning**: Complete all 8 sequences
- **Scoring**: Start at 500 pts, -1 per move, +100 per completed sequence, -5 per undo

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `U` | Undo last move |
| `P` | Pause / Resume |
| `N` | New game (same difficulty) |
| `Esc` | Pause |

## Controls

- **Click a card** to select it (and its sequence)
- **Click destination column** to move the selected cards
- **Click the stock pile** to deal 10 new cards (one per column)
- **Click a selected card again** to deselect

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
git clone <repo-url>
cd spider-solitaire
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment

This is a standard Next.js application and can be deployed to any platform that supports Node.js:

- **Vercel** (recommended): Connect your GitHub repo and deploy automatically
- **Netlify**: Use `npm run build` and set output directory to `.next`
- **Docker**: Use a standard Node.js Dockerfile with `npm run build && npm start`

### Deploy to Vercel

```bash
npx vercel
```

## Project Structure

```
spider-solitaire/
├── app/
│   ├── globals.css          # Tailwind base + custom styles
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Entry point
├── components/
│   ├── game/
│   │   ├── Card.tsx         # Playing card component
│   │   ├── Column.tsx       # Card column component
│   │   ├── CompletedPiles.tsx # Completed sequence tracker
│   │   ├── DifficultySelector.tsx # Game start screen
│   │   ├── GameBoard.tsx    # Main game container
│   │   ├── GameHeader.tsx   # Score/controls header
│   │   ├── PauseMenu.tsx    # Pause overlay
│   │   ├── StockPile.tsx    # Stock card pile
│   │   └── WinScreen.tsx    # Victory screen
│   └── ui/
│       └── Button.tsx       # Reusable button component
├── hooks/
│   ├── useGame.ts           # Core game state management
│   ├── useHighScore.ts      # localStorage high scores
│   ├── useSound.ts          # Web Audio API sound effects
│   └── useTimer.ts          # Game timer
├── types/
│   └── game.ts              # TypeScript type definitions
└── utils/
    ├── cn.ts                # Class name utility
    └── gameEngine.ts        # Pure game logic functions
```

## License

MIT
