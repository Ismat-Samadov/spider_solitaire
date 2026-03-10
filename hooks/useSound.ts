'use client';
import { useState, useCallback, useRef } from 'react';

export function useSound() {
  const [enabled, setEnabled] = useState(true);
  const ctx = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctx.current) {
      ctx.current = new AudioContext();
    }
    return ctx.current;
  }, []);

  const playTone = useCallback(
    (freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
      if (!enabled) return;
      try {
        const ac = getCtx();
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.frequency.value = freq;
        osc.type = type;
        gain.gain.setValueAtTime(volume, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
        osc.start(ac.currentTime);
        osc.stop(ac.currentTime + duration);
      } catch {
        // AudioContext may not be available in all environments
      }
    },
    [enabled, getCtx]
  );

  const playCardMove = useCallback(() => playTone(440, 0.1, 'sine', 0.2), [playTone]);
  const playCardPlace = useCallback(() => playTone(523, 0.08, 'sine', 0.25), [playTone]);
  const playComplete = useCallback(() => {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine', 0.3), i * 100);
    });
  }, [playTone]);
  const playDeal = useCallback(() => playTone(300, 0.2, 'triangle', 0.2), [playTone]);
  const playWin = useCallback(() => {
    [523, 659, 784, 1047, 1319].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.5, 'sine', 0.4), i * 150);
    });
  }, [playTone]);
  const playError = useCallback(() => playTone(200, 0.15, 'square', 0.1), [playTone]);

  const toggle = useCallback(() => setEnabled(e => !e), []);

  return {
    enabled,
    toggle,
    playCardMove,
    playCardPlace,
    playComplete,
    playDeal,
    playWin,
    playError,
  };
}
