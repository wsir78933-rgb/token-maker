import {
  SHARE_DIALOG_SUPPRESS_MS,
  SHARE_DIALOG_SUPPRESSED_UNTIL_KEY,
} from './constants';

type ShareDialogStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function getBrowserStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function resolveStorage(storage?: ShareDialogStorage | null) {
  return storage ?? getBrowserStorage();
}

export function getShareDialogSuppressedUntil(storage?: ShareDialogStorage | null) {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) return 0;

  try {
    const value = Number(resolvedStorage.getItem(SHARE_DIALOG_SUPPRESSED_UNTIL_KEY) || 0);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function isShareDialogSuppressed(now = Date.now(), storage?: ShareDialogStorage | null) {
  return getShareDialogSuppressedUntil(storage) > now;
}

export function shouldShowShareDialog(now = Date.now(), storage?: ShareDialogStorage | null) {
  return !isShareDialogSuppressed(now, storage);
}

export function suppressShareDialogFor24Hours(
  now = Date.now(),
  storage?: ShareDialogStorage | null
) {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) return 0;

  const suppressedUntil = now + SHARE_DIALOG_SUPPRESS_MS;

  try {
    resolvedStorage.setItem(SHARE_DIALOG_SUPPRESSED_UNTIL_KEY, String(suppressedUntil));
  } catch {
    return 0;
  }

  return suppressedUntil;
}

export function clearShareDialogSuppression(storage?: ShareDialogStorage | null) {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) return;

  try {
    resolvedStorage.removeItem(SHARE_DIALOG_SUPPRESSED_UNTIL_KEY);
  } catch {
    // Ignore storage failures; suppression is a convenience, not a hard dependency.
  }
}
