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
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  compact?: boolean;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

const RANK_LABELS: Record<number, string> = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
};

const isRed = (suit: Suit) => suit === 'hearts' || suit === 'diamonds';

export function CardComponent({
  card,
  isSelected,
  isInSelectedGroup,
  isMoveable,
  onClick,
  style,
  className,
  compact,
}: CardProps) {
  if (!card.faceUp) {
    return (
      <div
        className={cn('absolute rounded-md border border-blue-500/20 overflow-hidden select-none cursor-default', className)}
        style={style}
        onClick={onClick}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          <div className="absolute inset-[4px] rounded border border-blue-400/10 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-1 opacity-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-300" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const symbol = SUIT_SYMBOLS[card.suit];
  const label = RANK_LABELS[card.rank];
  const red = isRed(card.suit);
  const textCls = red ? 'text-red-600' : 'text-gray-900';

  return (
    <motion.div
      className={cn(
        'absolute rounded-md border select-none cursor-pointer bg-white overflow-hidden',
        'transition-shadow duration-150',
        isSelected || isInSelectedGroup
          ? 'border-emerald-400 shadow-[0_0_12px_rgba(0,255,136,0.6)] ring-1 ring-emerald-400/50 z-50'
          : 'border-gray-300 shadow-md hover:shadow-lg',
        isMoveable && !isSelected && !isInSelectedGroup && 'hover:border-emerald-300',
        className
      )}
      style={style}
      onClick={onClick}
      whileHover={isMoveable ? { y: -2 } : {}}
      transition={{ duration: 0.1 }}
    >
      {/* Top-left corner */}
      <div className={cn('absolute top-0.5 left-1 flex flex-col items-center leading-none', textCls)}>
        <span className={cn('font-bold', compact ? 'text-[8px]' : 'text-xs')}>{label}</span>
        <span className={compact ? 'text-[8px]' : 'text-[10px]'}>{symbol}</span>
      </div>

      {/* Center symbol */}
      <div className={cn('absolute inset-0 flex items-center justify-center', textCls)}>
        <span className={compact ? 'text-base' : 'text-2xl'}>{symbol}</span>
      </div>

      {/* Bottom-right corner (rotated) */}
      <div
        className={cn(
          'absolute bottom-0.5 right-1 flex flex-col items-center leading-none rotate-180',
          textCls
        )}
      >
        <span className={cn('font-bold', compact ? 'text-[8px]' : 'text-xs')}>{label}</span>
        <span className={compact ? 'text-[8px]' : 'text-[10px]'}>{symbol}</span>
      </div>

      {/* Selected overlay */}
      {(isSelected || isInSelectedGroup) && (
        <div className="absolute inset-0 bg-emerald-400/10 pointer-events-none" />
      )}
    </motion.div>
  );
}
