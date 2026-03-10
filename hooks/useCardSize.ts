'use client';
import { useState, useEffect } from 'react';

export interface CardSize {
  cardHeight: number;
  faceUpOffset: number;
  faceDownOffset: number;
  fontSize: 'xs' | 'sm' | 'base';
  compact: boolean;
}

export function useCardSize(): CardSize {
  const [size, setSize] = useState<CardSize>({
    cardHeight: 100,
    faceUpOffset: 30,
    faceDownOffset: 15,
    fontSize: 'sm',
    compact: false,
  });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      // 10 columns, p-2 padding (16px total), gap-1 (4px × 9 = 36px)
      const colWidth = Math.floor((vw - 16 - 36) / 10);

      if (colWidth < 45) {
        // very small mobile
        setSize({ cardHeight: 62, faceUpOffset: 19, faceDownOffset: 10, fontSize: 'xs', compact: true });
      } else if (colWidth < 65) {
        // small mobile
        setSize({ cardHeight: 78, faceUpOffset: 24, faceDownOffset: 12, fontSize: 'xs', compact: true });
      } else if (colWidth < 90) {
        // tablet / large phone
        setSize({ cardHeight: 95, faceUpOffset: 29, faceDownOffset: 14, fontSize: 'xs', compact: false });
      } else {
        // desktop
        setSize({ cardHeight: 110, faceUpOffset: 34, faceDownOffset: 16, fontSize: 'sm', compact: false });
      }
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return size;
}
