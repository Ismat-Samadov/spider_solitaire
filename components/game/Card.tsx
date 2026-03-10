'use client';
import React from 'react';
import { Card as CardType, Suit } from '@/types/game';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isInSelectedGroup?: boolean;
  isMoveable?: boolean;
  isHinted?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  compact?: boolean;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

const RANK_LABELS: Record<number, string> = {
  1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
  7: '7', 8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K',
};

const isRed = (suit: Suit) => suit === 'hearts' || suit === 'diamonds';

export function CardComponent({
  card,
  isSelected,
  isInSelectedGroup,
  isMoveable,
  isHinted,
  onClick,
  style,
  compact,
}: CardProps) {
  // Face-down card
  if (!card.faceUp) {
    return (
      <div
        className="absolute rounded-md border border-blue-500/30 overflow-hidden select-none cursor-default"
        style={style}
        onClick={onClick}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
          <div className="absolute inset-[3px] rounded border border-blue-300/10">
            {/* Diagonal pattern */}
            <div className="w-full h-full opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #93c5fd 0, #93c5fd 1px, transparent 0, transparent 50%)',
                backgroundSize: '8px 8px',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const symbol = SUIT_SYMBOLS[card.suit];
  const label = RANK_LABELS[card.rank];
  const red = isRed(card.suit);
  const textColor = red ? '#dc2626' : '#111827';
  const highlighted = isSelected || isInSelectedGroup;

  return (
    <motion.div
      className={cn(
        'absolute rounded-md select-none cursor-pointer bg-white overflow-hidden',
        'border transition-all duration-100',
        highlighted
          ? 'border-emerald-400'
          : isHinted
          ? 'border-amber-400'
          : isMoveable
          ? 'border-gray-300 hover:border-emerald-300'
          : 'border-gray-300',
      )}
      style={{
        ...style,
        boxShadow: highlighted
          ? '0 0 14px rgba(0,255,136,0.7), 0 2px 8px rgba(0,0,0,0.3)'
          : isHinted
          ? '0 0 14px rgba(251,191,36,0.7), 0 2px 8px rgba(0,0,0,0.3)'
          : '0 2px 6px rgba(0,0,0,0.25)',
      }}
      onClick={onClick}
      whileHover={isMoveable ? { y: -3 } : {}}
      transition={{ duration: 0.08 }}
    >
      {/* Highlighted overlay */}
      {highlighted && (
        <div className="absolute inset-0 bg-emerald-400/10 pointer-events-none z-10" />
      )}
      {isHinted && !highlighted && (
        <div className="absolute inset-0 bg-amber-400/10 pointer-events-none z-10" />
      )}

      {/* Top-left corner */}
      <div
        className="absolute top-0.5 left-1 flex flex-col items-center leading-tight pointer-events-none"
        style={{ color: textColor }}
      >
        <span className={cn('font-bold leading-none', compact ? 'text-[9px]' : 'text-xs')}>
          {label}
        </span>
        <span className={cn('leading-none', compact ? 'text-[9px]' : 'text-[11px]')}>
          {symbol}
        </span>
      </div>

      {/* Center symbol */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ color: textColor }}
      >
        <span className={compact ? 'text-lg' : 'text-2xl'}>{symbol}</span>
      </div>

      {/* Bottom-right corner (rotated 180°) */}
      <div
        className="absolute bottom-0.5 right-1 flex flex-col items-center leading-tight rotate-180 pointer-events-none"
        style={{ color: textColor }}
      >
        <span className={cn('font-bold leading-none', compact ? 'text-[9px]' : 'text-xs')}>
          {label}
        </span>
        <span className={cn('leading-none', compact ? 'text-[9px]' : 'text-[11px]')}>
          {symbol}
        </span>
      </div>
    </motion.div>
  );
}
