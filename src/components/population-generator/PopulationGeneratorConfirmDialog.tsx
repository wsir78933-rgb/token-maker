import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import type { PopulationGeneratorCopy } from './population-generator-copy';
import type {
  PopulationConfirmRequest,
  PopulationGeneratorReadySession,
} from './use-population-generator';

import styles from './PopulationGeneratorWorkbench.module.css';

interface PopulationConfirmCopy {
  title: string;
  detail: string;
  body: string;
  keepLabel: string;
  continueLabel: string;
}

function describeConfirmRequest(
  copy: PopulationGeneratorCopy,
  request: PopulationConfirmRequest,
): PopulationConfirmCopy {
  if (request.kind === 'save') {
    const slotNumber = request.slotIndex + 1;
    return {
      title: copy.confirmSlotTitle(slotNumber),
      detail: copy.confirmSlotDetail(slotNumber),
      body: copy.confirmSlotBody(slotNumber),
      keepLabel: copy.keepSlot,
      continueLabel: copy.continueSave,
    };
  }

  if (request.kind === 'load') {
    return {
      title: copy.confirmReplaceTitle,
      detail: copy.confirmEdited,
      body: copy.confirmLoadBody,
      keepLabel: copy.keepResult,
      continueLabel: copy.continueLoad,
    };
  }

  if (request.kind === 'import') {
    return {
      title: copy.confirmReplaceTitle,
      detail: copy.confirmEdited,
      body: copy.confirmImportBody,
      keepLabel: copy.keepResult,
      continueLabel: copy.continueImport,
    };
  }

  return {
    title: copy.confirmReplaceTitle,
    detail: copy.confirmEdited,
    body: copy.confirmGenerateBody,
    keepLabel: copy.keepResult,
    continueLabel: copy.continueGenerate,
  };
}

export function PopulationGeneratorConfirmDialog({ session }: { session: PopulationGeneratorReadySession }) {
  const request = session.dialog.kind === 'confirm' ? session.dialog.request : null;
  const view = request === null ? null : describeConfirmRequest(session.copy, request);

  return (
    <Dialog
      open={view !== null}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          session.cancelDialog();
        }
      }}
    >
      {view !== null ? (
        <DialogContent className={styles.dialogContent}>
          <div className={styles.dialogHeader}>
            <DialogTitle>{view.title}</DialogTitle>
            <DialogDescription>{view.detail}</DialogDescription>
          </div>
          <div className={styles.dialogBody}>
            <p>{view.body}</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.quietButton} onClick={session.cancelDialog}>
                {view.keepLabel}
              </button>
              <button type="button" className={styles.primaryButton} onClick={session.confirmDialog}>
                {view.continueLabel}
              </button>
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
