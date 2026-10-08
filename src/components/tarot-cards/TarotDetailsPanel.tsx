'use client';

import Image from 'next/image';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { useId, useSyncExternalStore } from 'react';

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPortal,
  DialogTitle,
  DialogViewport,
} from '@/components/ui/dialog';
import { getTarotCard } from '@/lib/tarot-cards/cards';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import { getTarotCardMeaning } from '@/lib/tarot-cards/meanings';
import type { TarotDealtCard, TarotLocale, TarotSpreadPosition } from '@/lib/tarot-cards/types';
import { cn } from '@/lib/utils';

export interface TarotDetailsPanelProps {
  locale: TarotLocale;
  selectedCard: TarotDealtCard | null;
  position: TarotSpreadPosition | null;
  onClose: () => void;
}

interface TarotDetailsSelection {
  card: ReturnType<typeof getTarotCard>;
  meaning: ReturnType<typeof getTarotCardMeaning>;
  selectedCard: TarotDealtCard;
  position: TarotSpreadPosition | null;
}

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  const serializedValue = JSON.stringify(value);
  return typeof serializedValue === 'string'
    ? serializedValue
    : Object.prototype.toString.call(value);
}

function requireDetailsSelection(
  selectedCard: TarotDealtCard | null,
  position: TarotSpreadPosition | null,
): TarotDetailsSelection | null {
  if (selectedCard === null) {
    if (position !== null) {
      throw new Error(
        `Tarot details position must be null when no card is selected. Received ${describeReceivedValue(position)}.`,
      );
    }

    return null;
  }

  if (typeof selectedCard !== 'object' || Array.isArray(selectedCard)) {
    throw new TypeError(
      `Tarot details selectedCard must be null or a dealt card object. Received ${describeReceivedValue(selectedCard)}.`,
    );
  }

  if (typeof selectedCard.cardId !== 'string') {
    throw new TypeError(
      `Tarot details selectedCard.cardId must be a string. Received ${describeReceivedValue(selectedCard.cardId)}.`,
    );
  }

  if (!Number.isInteger(selectedCard.position) || selectedCard.position < 1) {
    throw new RangeError(
      `Tarot details selectedCard.position must be a positive integer. Received ${describeReceivedValue(selectedCard.position)}.`,
    );
  }

  if (typeof selectedCard.reversed !== 'boolean') {
    throw new TypeError(
      `Tarot details selectedCard.reversed must be a boolean. Received ${describeReceivedValue(selectedCard.reversed)}.`,
    );
  }

  if (typeof selectedCard.revealed !== 'boolean') {
    throw new TypeError(
      `Tarot details selectedCard.revealed must be a boolean. Received ${describeReceivedValue(selectedCard.revealed)}.`,
    );
  }

  const card = getTarotCard(selectedCard.cardId);
  if (!selectedCard.revealed) {
    throw new Error(
      `Tarot details cannot display an unrevealed selected card. Received revealed=${describeReceivedValue(selectedCard.revealed)} for cardId ${JSON.stringify(selectedCard.cardId)}.`,
    );
  }

  if (position !== null) {
    if (typeof position !== 'object' || Array.isArray(position)) {
      throw new TypeError(
        `Tarot details position must be null or a spread position object. Received ${describeReceivedValue(position)}.`,
      );
    }

    if (!Number.isInteger(position.number) || position.number < 1) {
      throw new RangeError(
        `Tarot details position.number must be a positive integer. Received ${describeReceivedValue(position.number)}.`,
      );
    }

    if (position.number !== selectedCard.position) {
      throw new Error(
        `Tarot details position number ${position.number} does not match selected card position ${selectedCard.position}.`,
      );
    }
  }

  return {
    card,
    meaning: getTarotCardMeaning(selectedCard.cardId),
    selectedCard,
    position,
  };
}

function subscribeToMobileViewport(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => undefined;

  const mediaQuery = window.matchMedia('(max-width: 767px)');
  if (typeof mediaQuery.addEventListener !== 'function') return () => undefined;
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function getMobileViewportSnapshot(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return window.matchMedia('(max-width: 767px)').matches;
}

function getDesktopViewportSnapshot(): boolean {
  return false;
}

function useMobileViewport(): boolean {
  return useSyncExternalStore(
    subscribeToMobileViewport,
    getMobileViewportSnapshot,
    getDesktopViewportSnapshot,
  );
}

function TarotMeaningSection({ heading, text }: { heading: string; text: string }) {
  return (
    <section className="space-y-2" data-tarot-meaning-section={heading}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{heading}</h3>
      <p className="text-sm leading-6 text-foreground/85">{text}</p>
    </section>
  );
}

function TarotSelectedCardContent({
  locale,
  selection,
}: {
  locale: TarotLocale;
  selection: TarotDetailsSelection;
}) {
  const copy = getTarotCopy(locale);
  const isHorizontal = selection.position?.fixedRotationDeg === 90;
  const orientationLabel = isHorizontal
    ? copy.labels.horizontal
    : selection.selectedCard.reversed
      ? copy.labels.reversed
      : copy.labels.upright;

  return (
    <div
      className="min-h-0 space-y-5"
      data-tarot-selected-card={selection.selectedCard.cardId}
      data-testid="tarot-selected-card"
    >
      <div className="flex flex-col items-center gap-3 md:items-start">
        <div
          className={cn(
            'relative overflow-hidden rounded-xl border border-border/70 bg-background/70 p-1 shadow-sm',
            isHorizontal ? 'h-[126px] w-[188px] md:h-[162px] md:w-[242px]' : 'h-[188px] w-[126px] md:h-[242px] md:w-[162px]',
          )}
        >
          <Image
            src={selection.card.imageSrc}
            alt={selection.card.name[locale]}
            width={160}
            height={240}
            unoptimized
            className={cn(
              'absolute left-1/2 top-1/2 object-contain -translate-x-1/2 -translate-y-1/2',
              isHorizontal
                ? 'h-[186px] w-[124px] rotate-90 md:h-[240px] md:w-[160px]'
                : 'h-[186px] w-[124px] md:h-[240px] md:w-[160px]',
              !isHorizontal && selection.selectedCard.reversed && 'rotate-180',
            )}
            data-tarot-card-image="true"
            data-testid="tarot-card-image"
          />
        </div>

        <div className="min-w-0 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {copy.labels.cardName}
          </p>
          <h3 className="break-words text-base font-semibold text-foreground" data-tarot-card-name="true">
            {selection.card.name[locale]}
          </h3>
          {selection.position !== null ? (
            <p className="mt-1 text-sm text-muted-foreground" data-tarot-card-position="true">
              {copy.labels.position}: {selection.position.number}
            </p>
          ) : null}
          <p className="mt-1 text-sm font-medium text-primary" data-tarot-card-orientation="true">
            {orientationLabel}
          </p>
        </div>
      </div>

      {selection.position !== null ? (
        <section className="space-y-2 border-t border-border/60 pt-4" data-tarot-position-meaning="true">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {copy.labels.positionMeaning}
          </h3>
          <p className="text-sm font-medium leading-6 text-foreground">{selection.position.label[locale]}</p>
          <p className="text-sm leading-6 text-muted-foreground">{selection.position.description[locale]}</p>
        </section>
      ) : null}

      <div className="space-y-4 border-t border-border/60 pt-4" data-tarot-card-meanings="true">
        <TarotMeaningSection heading={copy.labels.uprightMeaning} text={selection.meaning.upright[locale]} />
        <TarotMeaningSection heading={copy.labels.reversedMeaning} text={selection.meaning.reversed[locale]} />
      </div>
    </div>
  );
}

function TarotDetailsBody({
  locale,
  copy,
  selection,
}: {
  locale: TarotLocale;
  copy: ReturnType<typeof getTarotCopy>;
  selection: TarotDetailsSelection | null;
}) {
  if (selection === null) {
    return (
      <p className="mt-5 text-sm leading-6 text-muted-foreground" data-tarot-details-empty="true">
        {copy.messages.selectCardHint}
      </p>
    );
  }

  return (
    <div className="mt-5">
      <TarotSelectedCardContent locale={locale} selection={selection} />
    </div>
  );
}

function TarotMobileDetailsDialog({
  locale,
  copy,
  open,
  selection,
  onClose,
}: {
  locale: TarotLocale;
  copy: ReturnType<typeof getTarotCopy>;
  open: boolean;
  selection: TarotDetailsSelection | null;
  onClose: () => void;
}) {
  const titleId = useId();

  if (selection === null) return null;

  function handleOpenChange(nextOpen: boolean) {
    if (typeof nextOpen !== 'boolean') {
      throw new TypeError(`Tarot details dialog open state must be a boolean. Received ${describeReceivedValue(nextOpen)}.`);
    }

    if (!nextOpen) onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogBackdrop className="md:hidden" data-tarot-details-backdrop="true" />
        <DialogViewport className="items-end p-0 sm:items-end sm:p-0 md:hidden" data-tarot-details-viewport="true">
          <DialogPrimitive.Popup
            aria-labelledby={titleId}
            className="relative flex max-h-[min(82svh,42rem)] w-full flex-col overflow-hidden rounded-t-2xl border border-border/70 bg-card text-card-foreground shadow-2xl outline-none"
            data-tarot-details-mobile-dialog="true"
            data-slot="dialog-content"
            data-tarot-details-state="selected"
            finalFocus
            initialFocus
          >
            <div lang={locale} className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 pb-4 pt-5">
                <DialogTitle id={titleId} className="text-foreground">
                  {copy.labels.selectedCard}
                </DialogTitle>
                <DialogDescription className="sr-only">{copy.labels.selectedCard}</DialogDescription>
                <DialogClose aria-label={copy.actions.close} className="static size-11 min-h-11 min-w-11 shrink-0" />
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <TarotDetailsBody locale={locale} copy={copy} selection={selection} />
              </div>
            </div>
          </DialogPrimitive.Popup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}

export function TarotDetailsPanel({
  locale,
  selectedCard,
  position,
  onClose,
}: TarotDetailsPanelProps) {
  const copy = getTarotCopy(locale);
  const desktopHeadingId = useId();
  const selection = requireDetailsSelection(selectedCard, position);
  const isMobile = useMobileViewport();

  if (typeof onClose !== 'function') {
    throw new TypeError(`Tarot details onClose must be a function. Received ${describeReceivedValue(onClose)}.`);
  }

  return (
    <>
      {selection === null || isMobile !== true ? (
        <aside
          aria-labelledby={desktopHeadingId}
          className="hidden h-full min-w-0 w-[304px] shrink-0 flex-col border-l border-border bg-card text-card-foreground md:flex"
          data-tarot-details-panel="true"
          data-tarot-details-state={selection === null ? 'empty' : 'selected'}
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <h2 id={desktopHeadingId} className="text-sm font-semibold text-foreground">
              {selection === null ? copy.labels.details : copy.labels.selectedCard}
            </h2>
            <TarotDetailsBody locale={locale} copy={copy} selection={selection} />
          </div>
        </aside>
      ) : null}
      <TarotMobileDetailsDialog
        locale={locale}
        copy={copy}
        open={selection !== null && isMobile === true}
        selection={selection}
        onClose={onClose}
      />
    </>
  );
}
