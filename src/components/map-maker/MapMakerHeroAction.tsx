'use client';

import type { FocusEvent, MouseEvent } from 'react';

import styles from './MapMakerHero.module.css';

function playMapMakerHeroActionBounce(anchor: HTMLAnchorElement): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  anchor.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(0.95)' },
      { transform: 'scale(1)' },
    ],
    { duration: 300, easing: 'cubic-bezier(0.36, 0, 0.66, -0.56)' },
  );
}

export function MapMakerHeroAction({ label, href }: { label: string; href: string }) {
  function handleActionFocus(event: FocusEvent<HTMLAnchorElement>): void {
    event.currentTarget.style.animation = 'none';
  }

  function handleActionClick(event: MouseEvent<HTMLAnchorElement>): void {
    playMapMakerHeroActionBounce(event.currentTarget);
  }

  return (
    <a
      href={href}
      className={`${styles.action} ${styles.fadeIn} ${styles.fadeInDelayTwo}`}
      onFocus={handleActionFocus}
      onClick={handleActionClick}
    >
      {label}
    </a>
  );
}
