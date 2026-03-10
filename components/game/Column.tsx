'use client';
import React from 'react';
import { GameColumn as ColumnType, Selection } from '@/types/game';
import { CardComponent } from './Card';
import { getMoveableFrom } from '@/utils/gameEngine';
import { CardSize } from '@/hooks/useCardSize';

interface ColumnProps {
  column: ColumnType;
  columnIndex: number;
  selection: Selection | null;
  validTargets: number[];
  hintFrom: { fromCol: number; fromCard: number } | null;
  hintTo: number | null;
  cardSize: CardSize;
  onCardClick: (columnIndex: number, cardIndex: number) => void;
  onColumnClick: (columnIndex: number) => void;
}

export function Column({
  column,
  columnIndex,
  selection,
  validTargets,
  hintFrom,
  hintTo,
  cardSize,
  onCardClick,
  onColumnClick,
}: ColumnProps) {
  const { cardHeight, faceUpOffset, faceDownOffset, compact } = cardSize;
  const isSourceColumn = selection?.columnIndex === columnIndex;
  const isValidTarget = validTargets.includes(columnIndex);
  const isHintTarget = hintTo === columnIndex && !selection;
  const isHintSource = hintFrom?.fromCol === columnIndex && !selection;

  // Calculate total height of the stacked column
  let totalHeight = cardHeight;
  if (column.cards.length > 1) {
    totalHeight = column.cards.slice(0, -1).reduce((acc, card) => {
      return acc + (card.faceUp ? faceUpOffset : faceDownOffset);
    }, 0) + cardHeight;
  }

  const handleColumnClick = () => {
    if (selection) onColumnClick(columnIndex);
  };

  return (
    <div
      className={`relative flex-1 min-w-0 rounded-md transition-all duration-150 ${
        isValidTarget
          ? 'ring-2 ring-emerald-400/60 bg-emerald-400/5'
          : isHintTarget
          ? 'ring-2 ring-amber-400/60 bg-amber-400/5'
          : ''
      }`}
      style={{ height: Math.max(totalHeight + 8, cardHeight + 8) }}
      onClick={handleColumnClick}
    >
      {/* Valid target label */}
      {isValidTarget && (
        <div className="absolute -top-5 left-0 right-0 text-center text-[9px] text-emerald-400 font-semibold pointer-events-none z-50">
          ↓ drop here
        </div>
      )}

      {/* Empty column placeholder */}
      {column.cards.length === 0 && (
        <div
          className={`absolute rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${
            isValidTarget
              ? 'border-emerald-400/60 bg-emerald-400/10'
              : isHintTarget
              ? 'border-amber-400/60 bg-amber-400/10'
              : 'border-white/10 hover:border-white/20'
          }`}
          style={{ height: cardHeight, left: 0, right: 0 }}
          onClick={handleColumnClick}
        >
          <span className="text-white/20 text-2xl">♠</span>
        </div>
      )}

      {/* Cards */}
      {column.cards.map((card, cardIdx) => {
        const topOffset = column.cards.slice(0, cardIdx).reduce((acc, c) => {
          return acc + (c.faceUp ? faceUpOffset : faceDownOffset);
        }, 0);

        const isSelected = isSourceColumn && selection !== null && cardIdx === selection.cardIndex;
        const isInSelectedGroup = isSourceColumn && selection !== null && cardIdx > selection.cardIndex;

        // Hint: flash source card(s)
        const isHinted =
          !selection &&
          isHintSource &&
          hintFrom !== null &&
          cardIdx >= hintFrom.fromCard;

        const moveableFrom = getMoveableFrom(column, cardIdx);
        const isMoveable = moveableFrom !== null;

        // Compute z-index: selected cards get boosted z so they sit on top
        const zIdx = isSelected || isInSelectedGroup ? 200 + cardIdx : cardIdx + 1;

        return (
          <CardComponent
            key={card.id}
            card={card}
            isSelected={isSelected}
            isInSelectedGroup={isInSelectedGroup}
            isMoveable={isMoveable}
            isHinted={isHinted}
            compact={compact}
            style={{
              top: topOffset,
              height: cardHeight,
              left: 0,
              right: 0,
              zIndex: zIdx,
            }}
            onClick={() => onCardClick(columnIndex, cardIdx)}
          />
        );
      })}
    </div>
  );
}
