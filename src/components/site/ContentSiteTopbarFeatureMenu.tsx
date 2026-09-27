'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
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
  restoreFocusOnEscape: () => void,
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

    restoreFocusOnEscape();
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

function getNextFeatureMenuItemIndex(
  currentIndex: number,
  itemCount: number,
  key: ReactKeyboardEvent<HTMLElement>['key'],
): number | null {
  if (itemCount === 0) {
    return null;
  }

  if (key === 'Home') {
    return 0;
  }

  if (key === 'End') {
    return itemCount - 1;
  }

  if (key === 'ArrowDown') {
    return (currentIndex + 1) % itemCount;
  }

  if (key === 'ArrowUp') {
    return (currentIndex - 1 + itemCount) % itemCount;
  }

  return null;
}

function readFeatureMenuItem(menuItem: unknown, itemIndex: number): HTMLAnchorElement {
  if (menuItem instanceof HTMLAnchorElement) {
    return menuItem;
  }

  const received = menuItem instanceof Node ? menuItem.nodeName : String(menuItem);
  throw new Error(`Feature menu item ${itemIndex} is missing. Received ${received}.`);
}

function readFeatureMenuToggle(menuToggle: HTMLButtonElement | null): HTMLButtonElement {
  if (!(menuToggle instanceof HTMLButtonElement)) {
    throw new Error(`Feature menu toggle is missing. Received ${menuToggle === null ? 'null' : typeof menuToggle}.`);
  }

  return menuToggle;
}

function triggerTabLeavesFeatureMenu(
  currentTarget: EventTarget,
  menuToggle: HTMLButtonElement | null,
  shiftKey: boolean,
): boolean {
  const onMenuToggle = currentTarget === menuToggle;
  if (shiftKey) {
    return !onMenuToggle;
  }

  return onMenuToggle;
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
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const closeTimerIdRef = useRef<number | null>(null);
  const pendingMenuItemFocusRef = useRef<number | null>(null);
  const restoreFocusOnCloseRef = useRef(false);
  const panelId = useId();

  function openMenu() {
    clearFeatureMenuCloseTimer(closeTimerIdRef);
    setMenuIsOpen(true);
  }

  function closeMenu() {
    clearFeatureMenuCloseTimer(closeTimerIdRef);
    setMenuIsOpen(false);
  }

  function closeMenuAndRestoreFocus() {
    restoreFocusOnCloseRef.current = true;
    closeMenu();
  }

  function toggleMenu() {
    clearFeatureMenuCloseTimer(closeTimerIdRef);
    setMenuIsOpen((currentlyOpen) => !currentlyOpen);
  }

  function scheduleClose() {
    scheduleFeatureMenuClose(closeTimerIdRef, closeMenu);
  }

  function focusMenuItem(index: number) {
    if (features.length === 0) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(index, features.length - 1));
    clearFeatureMenuCloseTimer(closeTimerIdRef);

    if (menuIsOpen) {
      readFeatureMenuItem(menuItemRefs.current[nextIndex], nextIndex).focus();
      return;
    }

    pendingMenuItemFocusRef.current = nextIndex;
    setMenuIsOpen(true);
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === 'Tab') {
      if (!triggerTabLeavesFeatureMenu(event.currentTarget, menuToggleRef.current, event.shiftKey)) {
        return;
      }

      closeMenu();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenuAndRestoreFocus();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      focusMenuItem(0);
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      focusMenuItem(features.length - 1);
    }
  }

  function handleMenuItemKeyDown(event: ReactKeyboardEvent<HTMLAnchorElement>, itemIndex: number) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenuAndRestoreFocus();
      return;
    }

    if (event.key === 'Tab') {
      closeMenu();
      return;
    }

    const nextItemIndex = getNextFeatureMenuItemIndex(itemIndex, features.length, event.key);
    if (nextItemIndex === null) {
      return;
    }

    event.preventDefault();
    readFeatureMenuItem(menuItemRefs.current[nextItemIndex], nextItemIndex).focus();
  }

  useEffect(() => {
    return listenForFeatureMenuDismiss(menuRootRef, closeTimerIdRef, () => {
      clearFeatureMenuCloseTimer(closeTimerIdRef);
      setMenuIsOpen(false);
    }, () => {
      restoreFocusOnCloseRef.current = true;
    });
  }, []);

  useEffect(() => {
    if (menuIsOpen) {
      restoreFocusOnCloseRef.current = false;
      const pendingMenuItemFocus = pendingMenuItemFocusRef.current;
      if (pendingMenuItemFocus !== null) {
        pendingMenuItemFocusRef.current = null;
        readFeatureMenuItem(menuItemRefs.current[pendingMenuItemFocus], pendingMenuItemFocus).focus();
      }
      return;
    }

    if (!restoreFocusOnCloseRef.current) {
      return;
    }

    restoreFocusOnCloseRef.current = false;
    readFeatureMenuToggle(menuToggleRef.current).focus();
  }, [menuIsOpen]);

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
          aria-controls={panelId}
          aria-expanded={menuIsOpen}
          aria-haspopup="menu"
          onFocus={openMenu}
          onKeyDown={handleTriggerKeyDown}
        >
          {featureMenuLabel}
        </Link>
        <button
          type="button"
          ref={menuToggleRef}
          aria-controls={panelId}
          aria-expanded={menuIsOpen}
          aria-label={featureMenuAccessibleName}
          onClick={toggleMenu}
          onKeyDown={handleTriggerKeyDown}
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
              tabIndex={-1}
              className="site-nav-dropdown__link site-nav-dropdown__link--feature"
              aria-label={feature.title}
              ref={(element) => {
                menuItemRefs.current[features.indexOf(feature)] = element;
              }}
              onKeyDown={(event) => handleMenuItemKeyDown(event, features.indexOf(feature))}
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
