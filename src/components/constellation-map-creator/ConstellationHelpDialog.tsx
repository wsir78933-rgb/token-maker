'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ConstellationWorkspaceCopy } from '@/lib/constellation-map-creator/copy-types';

export interface ConstellationHelpDialogProps {
  copy: ConstellationWorkspaceCopy;
  open: boolean;
  onOpenChange(open: boolean): void;
}

export function ConstellationHelpDialog({ copy, open, onOpenChange }: ConstellationHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(42rem,calc(100vh-2rem))] gap-3 overflow-y-auto p-4">
        <DialogTitle className="pr-12">{copy.helpTitle}</DialogTitle>
        <DialogDescription>{copy.help}</DialogDescription>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--site-ink)]">
          {copy.helpSteps.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}
        </ol>
        <DialogClose aria-label={copy.close} className="absolute right-3 top-3 min-h-11 min-w-11 rounded-md border border-[var(--site-border-soft)]">×</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
