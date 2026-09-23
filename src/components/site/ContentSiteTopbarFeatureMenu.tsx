'use client';

import { useEffect, useId, useRef, useState, type JSX } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { ContentSiteTopbarFeature } from '@/lib/content-site-navigation';

const FEATURE_MENU_CLOSE_DELAY_MS = 120;

type CloseTimerIdRef = {
  current: number | null;
};

function clearFeatureMenuCloseTimer(closeTimerIdRef: CloseTimerIdRef) {
  if (closeTimerIdRef.current === null) {
    return;
  }

  window.clearTimeout(closeTimerIdRef.current);
  closeTimerIdRef.current = null;
}

function scheduleFeatureMenuClose(closeTimerIdRef: CloseTimerIdRef, closeMenu: () => void) {
  clearFeatureMenuCloseTimer(closeTimerIdRef);
  closeTimerIdRef.current = window.setTimeout(() => {
    closeMenu();
  }, FEATURE_MENU_CLOSE_DELAY_MS);
}

function pointerDownIsOutsideFeatureMenu(menuRoot: HTMLElement, eventTarget: EventTarget | null): boolean {
  if (!(eventTarget instanceof Node)) {
    return true;
  }

  return !menuRoot.contains(eventTarget);
}

function listenForFeatureMenuDismiss(
  menuRootRef: { current: HTMLDivElement | null },
  closeTimerIdRef: CloseTimerIdRef,
  closeMenu: () => void,
) {
  function closeIfPointerDownOutside(event: PointerEvent) {
    const menuRoot = menuRootRef.current;

    if (menuRoot === null) {
      return;
    }

    if (!pointerDownIsOutsideFeatureMenu(menuRoot, event.target)) {
      return;
    }

    closeMenu();
  }

  function closeIfEscapePressed(event: KeyboardEvent) {
    if (event.key !== 'Escape') {
      return;
    }

    closeMenu();
  }

  document.addEventListener('pointerdown', closeIfPointerDownOutside);
  document.addEventListener('keydown', closeIfEscapePressed);

  return function stopListeningForFeatureMenuDismiss() {
    document.removeEventListener('pointerdown', closeIfPointerDownOutside);
    document.removeEventListener('keydown', closeIfEscapePressed);
    clearFeatureMenuCloseTimer(closeTimerIdRef);
  };
}

function featureMenuChevronClassName(menuIsOpen: boolean): string {
  if (menuIsOpen) {
    return 'size-4 transition-transform rotate-180';
  }

  return 'size-4 transition-transform';
}

function featureMenuTriggerClassName(menuIsOpen: boolean, featureMenuIsActive: boolean): string {
  const triggerClassNames = [
    'inline-flex h-10 shrink-0 items-center gap-1 rounded-md px-4 text-sm font-medium transition-colors hover:bg-[color-mix(in_oklab,var(--site-panel)_78%,white_10%)]',
  ];

  if (featureMenuIsActive) {
    triggerClassNames.push('text-[var(--site-accent-strong)]');
  } else {
    triggerClassNames.push('text-[var(--site-ink-strong)]');
  }

  if (menuIsOpen) {
    triggerClassNames.push('bg-[color-mix(in_oklab,var(--site-panel)_78%,white_10%)]');
  } else if (featureMenuIsActive) {
    triggerClassNames.push('bg-[var(--site-accent-bg)]');
  }

  return triggerClassNames.join(' ');
}

export function ContentSiteTopbarFeatureMenu(props: {
  featureMenuLabel: string;
  featureMenuHref: string;
  featureMenuIsActive: boolean;
  featureMenuAccessibleName: string;
  features: readonly ContentSiteTopbarFeature[];
}): JSX.Element {
  const {
    featureMenuLabel,
    featureMenuHref,
    featureMenuIsActive,
    featureMenuAccessibleName,
    features,
  } = props;
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const menuRootRef = useRef<HTMLDivElement>(null);
  const closeTimerIdRef = useRef<number | null>(null);
  const panelId = useId();

  function openMenu() {
    clearFeatureMenuCloseTimer(closeTimerIdRef);
    setMenuIsOpen(true);
  }

  function closeMenu() {
    clearFeatureMenuCloseTimer(closeTimerIdRef);
    setMenuIsOpen(false);
  }

  function toggleMenu() {
    clearFeatureMenuCloseTimer(closeTimerIdRef);
    setMenuIsOpen((currentlyOpen) => !currentlyOpen);
  }

  function scheduleClose() {
    scheduleFeatureMenuClose(closeTimerIdRef, closeMenu);
  }

  useEffect(() => {
    return listenForFeatureMenuDismiss(menuRootRef, closeTimerIdRef, () => {
      clearFeatureMenuCloseTimer(closeTimerIdRef);
      setMenuIsOpen(false);
    });
  }, []);

  return (
    <div
      ref={menuRootRef}
      className="site-nav-item"
      data-open={menuIsOpen ? 'true' : 'false'}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <div className={featureMenuTriggerClassName(menuIsOpen, featureMenuIsActive)} data-active={featureMenuIsActive}>
        <Link
          href={featureMenuHref}
          prefetch={false}
          aria-expanded={menuIsOpen}
          aria-haspopup="menu"
          onFocus={openMenu}
        >
          {featureMenuLabel}
        </Link>
        <button
          type="button"
          aria-controls={panelId}
          aria-expanded={menuIsOpen}
          aria-label={featureMenuAccessibleName}
          onClick={toggleMenu}
        >
          <ChevronDown aria-hidden="true" className={featureMenuChevronClassName(menuIsOpen)} />
        </button>
      </div>
      <div
        id={panelId}
        className="site-nav-dropdown"
        role="menu"
        aria-label={featureMenuAccessibleName}
      >
        <div className="site-nav-dropdown__panel site-nav-dropdown__panel--features">
          {features.map((feature) => (
            <Link
              key={`${feature.href}-${feature.title}`}
              href={feature.href}
              prefetch={false}
              role="menuitem"
              className="site-nav-dropdown__link site-nav-dropdown__link--feature"
              aria-label={feature.title}
            >
              <span>{feature.title}</span>
              <span className="site-nav-dropdown__description">{feature.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
