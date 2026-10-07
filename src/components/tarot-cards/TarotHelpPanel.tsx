'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import type { TarotLocale } from '@/lib/tarot-cards/types';

export interface TarotHelpPanelProps {
  locale: TarotLocale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function TarotHelpPanel({ locale, open, onOpenChange }: TarotHelpPanelProps) {
  const copy = getTarotCopy(locale);

  if (typeof open !== 'boolean') {
    throw new TypeError(`Tarot help open must be a boolean. Received ${describeReceivedValue(open)}.`);
  }

  if (typeof onOpenChange !== 'function') {
    throw new TypeError(
      `Tarot help onOpenChange must be a function. Received ${describeReceivedValue(onOpenChange)}.`,
    );
  }

  if (copy.help.sections.length === 0) {
    throw new Error(`Tarot help sections must not be empty. Received length ${copy.help.sections.length}.`);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (typeof nextOpen !== 'boolean') {
      throw new TypeError(
        `Tarot help next open state must be a boolean. Received ${describeReceivedValue(nextOpen)}.`,
      );
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[min(88svh,44rem)] max-w-[min(40rem,calc(100vw-2rem))] rounded-t-2xl p-0 sm:rounded-2xl"
        data-tarot-help-dialog="true"
      >
        <div lang={locale} className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border/60 px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-7">
            <DialogTitle className="pr-12 text-foreground">{copy.help.title}</DialogTitle>
            <DialogDescription className="sr-only">{copy.help.title}</DialogDescription>
            <DialogClose aria-label={copy.actions.close} />
          </div>

          <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            <div className="space-y-5">
              {copy.help.sections.map((section) => (
                <section key={section.title} className="space-y-2" data-tarot-help-section={section.title}>
                  <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
