'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useMemo } from 'react';

import { DICE_THEME, type DiceTrayDie } from '@/lib/dice/tray-css';
import { cn } from '@/lib/utils';

interface DiceAnimatedDieProps {
  die: DiceTrayDie;
}

/** Total spin time in ms */
const SPIN_MS = 1400;

export function DiceAnimatedDie({ die }: DiceAnimatedDieProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);

  const theme = DICE_THEME[die.sides];

  // 挂载时生成真随机散布，因为每次投掷 die.id 都会变化导致重挂载
  const { randomX, randomY, finalRotate, dropXOffset } = useMemo(() => {
    // 强制散布范围：X向两端延展，避免中心堆积
    // 用一个简单的碰撞偏移规避：
    const rX = (Math.random() * 320) - 160; 
    const rY = (Math.random() * 160) - 80;
    const fRot = (Math.random() * 120) - 60;
    const dropX = Math.random() > 0.5 ? 400 : -400; // Left or right screen bounds
    return { randomX: rX, randomY: rY, finalRotate: fRot, dropXOffset: dropX };
  }, []);

  useEffect(() => {
    setSettled(false);

    const card = cardRef.current;
    const icon = iconRef.current;
    if (!card || !icon) return;

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

    const onFinish = () => setSettled(true);
    spinAnim.addEventListener('finish', onFinish);
    return () => {
      spinAnim.removeEventListener('finish', onFinish);
      spinAnim.cancel();
    };
  }, [die.id, die.delayMs, randomX, randomY, finalRotate, dropXOffset]);

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
          transform: settled ? `scale(1) rotate(${-finalRotate}deg)` : `scale(0.5) rotate(${-finalRotate}deg)`,
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
