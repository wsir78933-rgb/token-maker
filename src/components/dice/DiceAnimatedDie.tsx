'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { DICE_THEME, type DiceTrayDie } from '@/lib/dice/tray-css';
import { cn } from '@/lib/utils';

interface DiceAnimatedDieProps {
  die: DiceTrayDie;
}

/** Total spin time in ms */
const SPIN_MS = 1400;

interface ScatterLayout {
  randomX: number;
  randomY: number;
  finalRotate: number;
  dropXOffset: number;
}

function createScatterLayout(): ScatterLayout {
  return {
    randomX: Math.random() * 320 - 160,
    randomY: Math.random() * 160 - 80,
    finalRotate: Math.random() * 120 - 60,
    dropXOffset: Math.random() > 0.5 ? 400 : -400,
  };
}

export function DiceAnimatedDie({ die }: DiceAnimatedDieProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);
  const [resultRotate, setResultRotate] = useState(0);

  const theme = DICE_THEME[die.sides];

  useEffect(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    if (!card || !icon) return;
    const { randomX, randomY, finalRotate, dropXOffset } = createScatterLayout();

    // ── 1. Card container drop & bounce ───────────────────────────────────
    // Thrown from high up (outside the tray)
    const dropHeight = -500; // pixels above
    
    card.animate(
      [
        { transform: `translate(${dropXOffset}px, ${dropHeight}px) scale(0.6)`, opacity: '0' },
        { transform: `translate(${randomX * 1.5}px, -120px) scale(1.1)`, opacity: '1', offset: 0.5 },
        { transform: `translate(${randomX}px, ${randomY}px) scale(1)`, opacity: '1' },
      ],
      {
        duration: 700,
        delay: die.delayMs,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // heavy bounce
        fill: 'forwards',
      },
    );

    // ── 2. Icon chaotic tumbling ──────────────────────────────────────────
    // Multiple axes rotation, heavy ease-out to simulate friction
    const spinAnim = icon.animate(
      [
        { transform: `rotate3d(1, 1, 1, 720deg) scale(0.8)` },
        { transform: `rotate3d(0.5, 1, 0.2, 360deg) scale(1.2)`, offset: 0.4 },
        { transform: `rotate3d(0, 0, 1, ${finalRotate}deg) scale(1)` },
      ],
      {
        duration: SPIN_MS,
        delay: die.delayMs,
        easing: 'cubic-bezier(0.12, 0.98, 0.32, 1)', // quick start, long friction
        fill: 'forwards',
      },
    );

    const onFinish = () => {
      setResultRotate(finalRotate);
      setSettled(true);
    };
    spinAnim.addEventListener('finish', onFinish);
    return () => {
      spinAnim.removeEventListener('finish', onFinish);
      spinAnim.cancel();
    };
  }, [die.id, die.delayMs]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute top-1/2 left-1/2 -ml-10 -mt-10",
        "flex flex-col items-center gap-1.5"
      )}
      style={{ opacity: 0 }}
    >
      {/* ── SVG icon (tumbles) ───────────────────────────────────────────── */}
      <div
        ref={iconRef}
        className="relative w-20 h-20 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
      >
        <Image
          src={`/dice/d${die.sides}.svg`}
          alt={`${die.sides}-sided die (d${die.sides}) showing result`}
          fill
          className="object-contain"
          unoptimized
        />

        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: settled ? 0.6 : 0,
            boxShadow: `0 0 24px 8px ${theme.glow}`,
          }}
        />
      </div>

      {/* ── Result number ────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none z-10"
        style={{
          opacity: settled ? 1 : 0,
          transform: settled ? `scale(1) rotate(${-resultRotate}deg)` : `scale(0.5) rotate(${-resultRotate}deg)`,
        }}
      >
        <span
          className="font-display text-[2.2rem] leading-none font-extrabold tracking-tight"
          style={{ 
            color: theme.text,
            textShadow: `0 2px 10px ${theme.glow}, 0 0 4px #000, 0 0 2px #000`,
          }}
        >
          {die.value}
        </span>
      </div>
    </div>
  );
}
