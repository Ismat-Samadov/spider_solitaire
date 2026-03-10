'use client';
import React from 'react';
import { GameColumn as ColumnType, Selection } from '@/types/game';
import { CardComponent } from './Card';
import { getMoveableFrom } from '@/utils/gameEngine';

interface ColumnProps {
  column: ColumnType;
  columnIndex: number;
  selection: Selection | null;
  onCardClick: (columnIndex: number, cardIndex: number) => void;
  onColumnClick: (columnIndex: number) => void;
}

const FACE_DOWN_OFFSET = 14;
const FACE_UP_OFFSET = 28;
const CARD_HEIGHT = 90;

export function Column({
  column,
  columnIndex,
  selection,
  onCardClick,
  onColumnClick,
}: ColumnProps) {
  const isSourceColumn = selection?.columnIndex === columnIndex;

  // Calculate total height needed for the column
  let totalHeight = CARD_HEIGHT;
  if (column.cards.length > 1) {
    totalHeight =
      column.cards.slice(0, -1).reduce((acc, card) => {
        return acc + (card.faceUp ? FACE_UP_OFFSET : FACE_DOWN_OFFSET);
      }, 0) + CARD_HEIGHT;
  }

  const handleColumnAreaClick = (e: React.MouseEvent) => {
    // Only handle clicks on the column area itself (not on cards)
    if (e.target === e.currentTarget) {
      if (selection) {
        onColumnClick(columnIndex);
      }
    }
  };

  return (
    <div
      className="relative flex-1 min-w-0"
      style={{ height: Math.max(totalHeight + 10, CARD_HEIGHT + 10) }}
      onClick={handleColumnAreaClick}
    >
      {/* Empty column placeholder */}
      {column.cards.length === 0 && (
        <div
          className="absolute rounded-md border-2 border-dashed border-emerald-400/20 flex items-center justify-center cursor-pointer hover:border-emerald-400/40 transition-colors"
          style={{ height: CARD_HEIGHT, left: 0, right: 0 }}
          onClick={() => {
            if (selection) {
              onColumnClick(columnIndex);
            }
          }}
        >
          <span className="text-emerald-400/20 text-3xl">♠</span>
        </div>
      )}

      {column.cards.map((card, cardIdx) => {
        const topOffset = column.cards.slice(0, cardIdx).reduce((acc, c) => {
          return acc + (c.faceUp ? FACE_UP_OFFSET : FACE_DOWN_OFFSET);
        }, 0);

        const isSelected = isSourceColumn && selection !== null && cardIdx === selection.cardIndex;
        const isInSelectedGroup =
          isSourceColumn && selection !== null && cardIdx > selection.cardIndex;
        const moveableFrom = getMoveableFrom(column, cardIdx);
        const isMoveable = moveableFrom !== null;

        return (
          <CardComponent
            key={card.id}
            card={card}
            isSelected={isSelected}
            isInSelectedGroup={isInSelectedGroup}
            isMoveable={isMoveable}
            style={{
              top: topOffset,
              height: CARD_HEIGHT,
              left: 0,
              right: 0,
              zIndex: cardIdx + 1,
            }}
            onClick={() => {
              onCardClick(columnIndex, cardIdx);
            }}
          />
        );
      })}
    </div>
  );
}
