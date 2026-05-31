import { describe, expect, it } from 'vitest';
import {
  SHARE_DIALOG_SUPPRESS_MS,
  SHARE_DIALOG_SUPPRESSED_UNTIL_KEY,
} from './constants';
import {
  clearShareDialogSuppression,
  getShareDialogSuppressedUntil,
  shouldShowShareDialog,
  suppressShareDialogFor24Hours,
} from './local-frequency';

function createStorage() {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
}

describe('share dialog local frequency', () => {
  it('shows the dialog when no suppression exists', () => {
    expect(shouldShowShareDialog(1000, createStorage())).toBe(true);
  });

  it('suppresses the dialog for 24 hours', () => {
    const storage = createStorage();
    const now = 1000;

    const suppressedUntil = suppressShareDialogFor24Hours(now, storage);

    expect(suppressedUntil).toBe(now + SHARE_DIALOG_SUPPRESS_MS);
    expect(getShareDialogSuppressedUntil(storage)).toBe(suppressedUntil);
    expect(storage.getItem(SHARE_DIALOG_SUPPRESSED_UNTIL_KEY)).toBe(String(suppressedUntil));
    expect(shouldShowShareDialog(suppressedUntil - 1, storage)).toBe(false);
    expect(shouldShowShareDialog(suppressedUntil, storage)).toBe(true);
  });

  it('clears suppression state', () => {
    const storage = createStorage();
    suppressShareDialogFor24Hours(1000, storage);

    clearShareDialogSuppression(storage);

    expect(shouldShowShareDialog(1001, storage)).toBe(true);
  });
});
