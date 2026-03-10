'use client';

interface StockPileProps {
  stockCount: number;
  onClick: () => void;
  disabled?: boolean;
}

export function StockPile({ stockCount, onClick, disabled }: StockPileProps) {
  const dealsLeft = Math.ceil(stockCount / 10);

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        disabled={disabled || stockCount === 0}
        className="relative w-14 h-20 md:w-16 md:h-24 rounded-lg border-2 border-neon/30 bg-gradient-to-br from-blue-900 to-indigo-950 shadow-lg hover:shadow-neon/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-neon/60 active:scale-95 focus:outline-none focus:ring-2 focus:ring-neon/50"
        title={stockCount > 0 ? `Deal cards (${dealsLeft} deal${dealsLeft !== 1 ? 's' : ''} left)` : 'No cards remaining'}
      >
        {stockCount > 0 ? (
          <>
            {/* Stack depth effect */}
            <div className="absolute inset-0 rounded-lg border border-blue-400/20 translate-x-0.5 translate-y-0.5 bg-blue-900/50" />
            <div className="absolute inset-0 rounded-lg border border-blue-400/20 -translate-x-0.5 -translate-y-0.5 bg-blue-900/30" />
            <div className="absolute inset-0 rounded-lg border border-blue-400/20 bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center">
              <span className="text-blue-300/40 text-3xl select-none">♠</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 rounded-lg border-2 border-dashed border-neon/20 flex items-center justify-center">
            <span className="text-neon/20 text-2xl select-none">✗</span>
          </div>
        )}
      </button>
      <span className="text-neon/70 text-xs font-mono whitespace-nowrap">
        {stockCount > 0 ? `${dealsLeft} deal${dealsLeft !== 1 ? 's' : ''} left` : 'Empty'}
      </span>
    </div>
  );
}
