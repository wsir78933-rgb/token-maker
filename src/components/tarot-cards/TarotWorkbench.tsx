'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

import { TarotDetailsPanel } from '@/components/tarot-cards/TarotDetailsPanel';
import { TarotHelpPanel } from '@/components/tarot-cards/TarotHelpPanel';
import { TarotSpreadPicker } from '@/components/tarot-cards/TarotSpreadPicker';
import { TarotTable } from '@/components/tarot-cards/TarotTable';
import { TAROT_CARDS, getTarotCard } from '@/lib/tarot-cards/cards';
import {
  createTarotState,
  dealSingleCard,
  dealTarotSpread,
  revealAllTarotCards,
  revealTarotCard,
  shuffleTarotDeck,
} from '@/lib/tarot-cards/engine';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import {
  TAROT_CARD_FLIP_DURATION_MS,
  TAROT_DEAL_EFFECT_DURATION_MS,
} from '@/lib/tarot-cards/constants';
import { getTarotSpread, TAROT_SPREADS } from '@/lib/tarot-cards/spreads';
import type {
  TarotDealResult,
  TarotDealtCard,
  TarotReading,
  TarotReadingMode,
  TarotSpread,
  TarotSpreadId,
  TarotSpreadPosition,
  TarotState,
} from '@/lib/tarot-cards/types';
import type { SiteLocale } from '@/lib/site-locale';

type TarotWorkbenchMode = Extract<TarotReadingMode, 'single' | 'spread'>;
type TarotDealFailure = Extract<TarotDealResult, { ok: false }>;

function getInitialSpreadId(): TarotSpreadId {
  const firstSpread = TAROT_SPREADS[0];
  if (firstSpread === undefined) {
    throw new Error('Tarot spread catalog must contain an initial spread.');
  }

  return firstSpread.id;
}

function getReadingSpread(reading: TarotReading | null, selectedSpreadId: TarotSpreadId): TarotSpread | null {
  if (reading?.mode === 'spread') {
    if (reading.spreadId === null) {
      throw new Error('Tarot spread reading must include a spread id; received null.');
    }

    return getTarotSpread(reading.spreadId);
  }

  if (reading === null && selectedSpreadId) {
    return getTarotSpread(selectedSpreadId);
  }

  return null;
}

function getSelectedReadingDetails(
  reading: TarotReading | null,
): {
  selectedDealtCard: TarotDealtCard | null;
  position: TarotSpreadPosition | null;
} {
  if (reading === null || reading.selectedPosition === null) {
    return { selectedDealtCard: null, position: null };
  }

  const selectedDealtCard = reading.cards.find((card) => card.position === reading.selectedPosition);
  if (selectedDealtCard === undefined) {
    throw new Error(
      `Tarot reading selected position ${reading.selectedPosition} has no dealt card.`,
    );
  }

  getTarotCard(selectedDealtCard.cardId);
  let position: TarotSpreadPosition | null = null;

  if (reading.mode === 'spread') {
    if (reading.spreadId === null) {
      throw new Error('Tarot spread reading must include a spread id; received null.');
    }

    position = getTarotSpread(reading.spreadId).positions.find(
      (candidate) => candidate.number === selectedDealtCard.position,
    ) ?? null;
    if (position === null) {
      throw new Error(
        `Tarot spread ${JSON.stringify(reading.spreadId)} has no position ${selectedDealtCard.position}.`,
      );
    }
  }

  return { selectedDealtCard, position };
}

function getRevealedCount(reading: TarotReading | null): number {
  return reading?.cards.filter((card) => card.revealed).length ?? 0;
}

function getDealLabel(
  copy: ReturnType<typeof getTarotCopy>,
  mode: TarotWorkbenchMode,
  reading: TarotReading | null,
  selectedSpreadId: TarotSpreadId,
): string {
  const currentReadingMatchesPreview =
    reading?.mode === mode && (mode === 'single' || reading.spreadId === selectedSpreadId);

  if (currentReadingMatchesPreview) {
    return copy.actions.redeal;
  }

  return mode === 'single' ? copy.actions.dealSingle : copy.actions.dealSpread;
}

function getFailureTitle(copy: ReturnType<typeof getTarotCopy>, result: TarotDealFailure): string {
  return result.reason === 'deck-exhausted' ? copy.messages.exhaustedTitle : copy.messages.insufficientTitle;
}

function getFailureDescription(copy: ReturnType<typeof getTarotCopy>, result: TarotDealFailure): string {
  return result.reason === 'deck-exhausted'
    ? copy.messages.exhaustedDescription
    : copy.messages.insufficientDescription;
}

function getNextMode(currentMode: TarotWorkbenchMode, key: string): TarotWorkbenchMode | null {
  const modes: readonly TarotWorkbenchMode[] = ['single', 'spread'];
  const currentIndex = modes.indexOf(currentMode);
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    return modes[(currentIndex + 1) % modes.length] ?? null;
  }

  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return modes[(currentIndex - 1 + modes.length) % modes.length] ?? null;
  }

  if (key === 'Home') {
    return modes[0];
  }

  if (key === 'End') {
    return modes[modes.length - 1];
  }

  return null;
}

function getAnimationWaitDuration(durationMs: number): number {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return durationMs;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : durationMs;
}

export type TarotWorkbenchProps = {
  locale: SiteLocale;
};

export function TarotWorkbench({ locale }: TarotWorkbenchProps) {
  const copy = useMemo(() => getTarotCopy(locale), [locale]);
  const [tarotState, setTarotState] = useState<TarotState>(() => createTarotState());
  const [mode, setMode] = useState<TarotWorkbenchMode>('spread');
  const [selectedSpreadId, setSelectedSpreadId] = useState<TarotSpreadId>(getInitialSpreadId);
  const [spreadPickerOpen, setSpreadPickerOpen] = useState(false);
  const [dealFailure, setDealFailure] = useState<Extract<TarotDealResult, { ok: false }> | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dealSequence, setDealSequence] = useState(0);
  const [dealEffectsActive, setDealEffectsActive] = useState(false);
  const workbenchRef = useRef<HTMLDivElement>(null);
  const lastCardTriggerRef = useRef<HTMLButtonElement | null>(null);
  const detailsTimerRef = useRef<number | null>(null);
  const dealEffectTimerRef = useRef<number | null>(null);
  const modeButtonRefs = useRef<Record<TarotWorkbenchMode, HTMLButtonElement | null>>({
    single: null,
    spread: null,
  });

  useEffect(() => {
    return () => {
      if (detailsTimerRef.current !== null) {
        window.clearTimeout(detailsTimerRef.current);
      }
      if (dealEffectTimerRef.current !== null) {
        window.clearTimeout(dealEffectTimerRef.current);
      }
    };
  }, []);

  const activeReading = tarotState.reading;
  const selectedSpread = getTarotSpread(selectedSpreadId);
  const readingSpread = getReadingSpread(activeReading, selectedSpreadId);
  const tableSpread = activeReading?.mode === 'spread'
    ? readingSpread
    : activeReading === null && mode === 'spread'
      ? selectedSpread
      : null;
  const previewDiffersFromReading =
    activeReading !== null &&
    (activeReading.mode !== mode || (mode === 'spread' && activeReading.spreadId !== selectedSpreadId));
  const selectedDetails = getSelectedReadingDetails(activeReading);
  const detailsDealtCard = detailsOpen && !previewDiffersFromReading ? selectedDetails.selectedDealtCard : null;
  const detailsPosition = detailsOpen && !previewDiffersFromReading ? selectedDetails.position : null;
  const dealLabel = getDealLabel(copy, mode, activeReading, selectedSpreadId);
  const revealedCount = getRevealedCount(activeReading);
  const readingCardCount = activeReading?.cards.length ?? 0;

  function clearDetailsTimer(): void {
    if (detailsTimerRef.current === null) {
      return;
    }

    window.clearTimeout(detailsTimerRef.current);
    detailsTimerRef.current = null;
  }

  function clearDealEffectTimer(): void {
    if (dealEffectTimerRef.current === null) {
      return;
    }

    window.clearTimeout(dealEffectTimerRef.current);
    dealEffectTimerRef.current = null;
  }

  function cancelTransientEffects(): void {
    clearDetailsTimer();
    clearDealEffectTimer();
    setDealEffectsActive(false);
  }

  function startDealEffects(): void {
    clearDealEffectTimer();
    setDealSequence((sequence) => sequence + 1);
    setDealEffectsActive(true);

    const durationMs = getAnimationWaitDuration(TAROT_DEAL_EFFECT_DURATION_MS);
    if (durationMs === 0) {
      setDealEffectsActive(false);
      return;
    }

    dealEffectTimerRef.current = window.setTimeout(() => {
      dealEffectTimerRef.current = null;
      setDealEffectsActive(false);
    }, durationMs);
  }

  function selectMode(nextMode: TarotWorkbenchMode): void {
    cancelTransientEffects();
    setMode(nextMode);
    setSpreadPickerOpen(nextMode === 'spread');
    setDealFailure(null);
    setStatusMessage(null);
    setDetailsOpen(false);
  }

  function handleModeKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    const nextMode = getNextMode(mode, event.key);
    if (nextMode === null) {
      return;
    }

    event.preventDefault();
    selectMode(nextMode);
    modeButtonRefs.current[nextMode]?.focus();
  }

  function handleSpreadSelect(nextSpreadId: TarotSpreadId): void {
    getTarotSpread(nextSpreadId);
    cancelTransientEffects();
    setSelectedSpreadId(nextSpreadId);
    setMode('spread');
    setSpreadPickerOpen(true);
    setDealFailure(null);
    setStatusMessage(null);
    setDetailsOpen(false);
  }

  function handleChangeSpread(): void {
    cancelTransientEffects();
    setMode('spread');
    setSpreadPickerOpen(true);
    setDealFailure(null);
    setStatusMessage(null);
    setDetailsOpen(false);
  }

  function handleDeal(): void {
    const result = mode === 'single'
      ? dealSingleCard(tarotState)
      : dealTarotSpread(tarotState, selectedSpreadId);

    if (!result.ok) {
      setDealFailure(result);
      setStatusMessage(null);
      return;
    }

    setTarotState(result.state);
    setDealFailure(null);
    setStatusMessage(null);
    setSpreadPickerOpen(false);
    clearDetailsTimer();
    setDetailsOpen(false);
    lastCardTriggerRef.current = null;
    startDealEffects();
  }

  function handleShuffle(): void {
    setTarotState(shuffleTarotDeck(tarotState));
    setDealFailure(null);
    setStatusMessage(copy.messages.shuffled);
  }

  function handleRevealAll(): void {
    if (tarotState.reading === null) {
      return;
    }

    setTarotState(revealAllTarotCards(tarotState));
    setDealFailure(null);
    setStatusMessage(null);
  }

  function rememberCardTrigger(position: number): void {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLButtonElement && workbenchRef.current?.contains(activeElement)) {
      const isCardTrigger =
        activeElement.closest('[data-card-position]') !== null || activeElement.matches('[data-testid^="tarot-card-"]');
      if (isCardTrigger) {
        lastCardTriggerRef.current = activeElement;
        return;
      }
    }

    const cardTrigger = workbenchRef.current?.querySelector<HTMLButtonElement>(
      `[data-card-position="${position}"] button, [data-testid="tarot-card-${position}"]`,
    );
    if (cardTrigger !== null && cardTrigger !== undefined) {
      lastCardTriggerRef.current = cardTrigger;
    }
  }

  function handleCardSelect(position: number): void {
    if (tarotState.reading === null) {
      throw new Error(`Cannot select Tarot card position ${position}: there is no active reading.`);
    }

    const selectedCard = tarotState.reading.cards.find((card) => card.position === position);
    if (selectedCard === undefined) {
      throw new Error(`Tarot reading has no card at position ${position}.`);
    }

    rememberCardTrigger(position);
    setTarotState(revealTarotCard(tarotState, position));
    setDealFailure(null);
    setStatusMessage(null);
    clearDetailsTimer();

    if (selectedCard.revealed) {
      setDetailsOpen(true);
      return;
    }

    setDetailsOpen(false);
    const durationMs = getAnimationWaitDuration(TAROT_CARD_FLIP_DURATION_MS);
    if (durationMs === 0) {
      setDetailsOpen(true);
      return;
    }

    detailsTimerRef.current = window.setTimeout(() => {
      detailsTimerRef.current = null;
      setDetailsOpen(true);
    }, durationMs);
  }

  function handleCloseDetails(): void {
    clearDetailsTimer();
    setDetailsOpen(false);
    const trigger = lastCardTriggerRef.current;
    if (trigger === null) {
      return;
    }

    queueMicrotask(() => {
      if (trigger.isConnected) {
        trigger.focus();
      }
    });
  }

  return (
    <div
      ref={workbenchRef}
      data-testid="tarot-workbench"
      className="min-w-0 rounded-3xl border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 text-[var(--site-ink)] shadow-[var(--site-card-shadow)] sm:p-5 lg:p-6"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--site-border-soft)] pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-[var(--site-accent-strong)]">
            {copy.navigationTitle}
          </p>
          <p className="mt-1 text-sm text-stone-300">
            {mode === 'single' ? copy.actions.single : selectedSpread.name[locale]}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2" aria-label={copy.pageTitle}>
          <button
            type="button"
            onClick={handleDeal}
            data-testid="tarot-deal-button"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--site-accent-strong)] px-4 text-sm font-semibold text-stone-950 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
          >
            {dealLabel}
          </button>
          {activeReading !== null && (
            <>
              <button
                type="button"
                onClick={handleRevealAll}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--site-border-strong)] bg-[var(--site-panel)] px-4 text-sm font-medium text-stone-100 transition hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
              >
                {copy.actions.revealAll}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--site-border-strong)] bg-[var(--site-panel)] px-4 text-sm font-medium text-stone-100 transition hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
          >
            {copy.actions.shuffle}
          </button>
          <div className="flex min-h-10 items-center gap-3 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-3 text-xs text-stone-300">
            <span>
              {copy.labels.remaining}{' '}
              <strong data-testid="tarot-remaining-count" className="font-semibold text-stone-50">
                {tarotState.remainingCardIds.length} / {TAROT_CARDS.length}
              </strong>
            </span>
            {activeReading !== null && (
              <span>
                {copy.labels.revealed}{' '}
                <strong data-testid="tarot-revealed-count" className="font-semibold text-stone-50">
                  {revealedCount} / {readingCardCount}
                </strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {dealFailure !== null && (
        <div
          role="alert"
          className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-300/50 bg-amber-300/10 p-4 text-sm text-stone-100 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-amber-200">{getFailureTitle(copy, dealFailure)}</p>
            <p className="mt-1 leading-6 text-stone-300">{getFailureDescription(copy, dealFailure)}</p>
            <p className="mt-1 text-xs tabular-nums text-stone-400">
              <span data-required-cards={dealFailure.required}>
                {locale === 'zh' ? '需要' : 'Required'}: {dealFailure.required}
              </span>{' '}
              ·{' '}
              <span data-available-cards={dealFailure.available}>
                {locale === 'zh' ? '可用' : 'Available'}: {dealFailure.available}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-amber-200/60 px-4 font-semibold text-amber-100 transition hover:bg-amber-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            {copy.actions.shuffle}
          </button>
        </div>
      )}

      {statusMessage !== null && (
        <p role="status" aria-live="polite" className="mt-4 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-accent-bg)] px-3 py-2 text-sm text-stone-100">
          {statusMessage}
        </p>
      )}

      <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[14rem_minmax(0,1fr)_20rem] lg:items-start">
        <aside className="flex min-w-0 flex-col gap-4" aria-label={copy.labels.chooseSpread}>
          <section className="rounded-2xl border border-[var(--site-border-soft)] bg-[var(--site-panel)] p-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
              {copy.labels.chooseSpread}
            </h2>
            <div className="mt-3 grid grid-cols-2 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-1" role="tablist" aria-label={copy.pageTitle}>
              {(['single', 'spread'] as const).map((tabMode) => {
                const selected = mode === tabMode;
                return (
                  <button
                    key={tabMode}
                    ref={(element) => {
                      modeButtonRefs.current[tabMode] = element;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectMode(tabMode)}
                    onKeyDown={handleModeKeyDown}
                    className={`min-h-10 rounded-md px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)] ${selected ? 'bg-[var(--site-accent-bg)] text-[var(--site-accent-strong)]' : 'text-stone-300 hover:bg-white/[0.05] hover:text-stone-50'}`}
                  >
                    {tabMode === 'single' ? copy.actions.single : copy.actions.spread}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--site-border-soft)] bg-[var(--site-panel)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
              {mode === 'spread' ? copy.labels.chooseSpread : copy.actions.single}
            </p>
            <p data-testid="tarot-selected-spread" className="mt-2 font-display text-lg font-semibold text-stone-50">
              {mode === 'spread' ? selectedSpread.name[locale] : copy.actions.single}
            </p>
            {mode === 'spread' && (
              <p className="mt-1 text-sm text-stone-400">
                {selectedSpread.positions.length} · {copy.labels.position}
              </p>
            )}
            {mode === 'spread' && (
              <button
                type="button"
                onClick={handleChangeSpread}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[var(--site-border-strong)] px-3 text-sm font-medium text-stone-100 transition hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
              >
                {copy.actions.changeSpread}
              </button>
            )}
          </section>

          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="mt-auto inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--site-border-soft)] px-3 text-sm font-medium text-stone-300 transition hover:border-[var(--site-border-strong)] hover:bg-[var(--site-panel)] hover:text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]"
          >
            {copy.actions.help}
          </button>
        </aside>

        <section className="min-w-0" aria-label={copy.labels.preview}>
          {mode === 'spread' && spreadPickerOpen ? (
            <TarotSpreadPicker
              locale={locale}
              selectedSpreadId={selectedSpreadId}
              onSelectSpread={handleSpreadSelect}
            />
          ) : (
            <TarotTable
              locale={locale}
              reading={activeReading}
              spread={tableSpread}
              onCardSelect={handleCardSelect}
              dealSequence={dealSequence}
              dealEffectsActive={dealEffectsActive}
            />
          )}
          {previewDiffersFromReading && activeReading !== null && (
            <p className="mt-3 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-3 py-2 text-sm text-stone-400">
              {copy.messages.previewHint}
            </p>
          )}
        </section>

        <aside
          className={`min-w-0 ${detailsOpen ? 'max-md:block' : 'max-md:hidden'} lg:block`}
          aria-label={copy.labels.details}
        >
          <TarotDetailsPanel
            locale={locale}
            selectedCard={detailsDealtCard}
            position={detailsPosition}
            onClose={handleCloseDetails}
          />
          {detailsDealtCard !== null && (
            <span className="sr-only" data-testid="tarot-selected-card-id">
              {detailsDealtCard.cardId}
            </span>
          )}
        </aside>
      </div>

      <TarotHelpPanel locale={locale} open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
