import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import type { PopulationGeneratorReadySession } from './use-population-generator';

import styles from './PopulationGeneratorWorkbench.module.css';

export function PopulationGeneratorSlotsDialog({ session }: { session: PopulationGeneratorReadySession }) {
  const { copy } = session;
  const open = session.dialog.kind === 'slots';

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          session.cancelDialog();
        }
      }}
    >
      <DialogContent className={styles.dialogContent}>
        <div className={styles.dialogHeader}>
          <DialogTitle>{copy.slotsTitle}</DialogTitle>
          <DialogDescription>{copy.slotsDescription}</DialogDescription>
          <DialogClose aria-label={copy.close} className={styles.dialogClose} />
        </div>
        <div className={styles.dialogBody}>
          {session.slotsNotice.kind !== 'idle' ? (
            <p
              className={session.slotsNotice.kind === 'error' ? styles.inlineError : styles.inlineStatus}
              role={session.slotsNotice.kind === 'error' ? 'alert' : 'status'}
            >
              {session.slotsNotice.message}
            </p>
          ) : null}
          {session.slots !== null ? (
            <ol className={styles.slotList}>
              {session.slots.map((slot, index) => {
                const slotNumber = index + 1;
                const savedName = slot === null ? null : slot.name.trim() || '—';
                return (
                  <li key={slotNumber} className={styles.slotRow} data-population-slot={slotNumber}>
                    <div className={styles.slotSummary}>
                      <p className={styles.slotName}>{copy.slotName(slotNumber)}</p>
                      <p className={styles.slotState}>
                        {savedName === null ? copy.slotEmpty : copy.slotSaved(savedName)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={styles.quietButton}
                      onClick={() => {
                        session.requestSave(index);
                      }}
                    >
                      {copy.save}
                    </button>
                    <button
                      type="button"
                      className={styles.quietButton}
                      disabled={slot === null}
                      onClick={() => {
                        session.requestLoad(index);
                      }}
                    >
                      {slot === null ? copy.loadUnavailable : copy.load}
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : null}
          <p className={styles.hint}>{copy.slotsBrowser}</p>
          <p className={styles.hint}>{copy.slotsBackup}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
