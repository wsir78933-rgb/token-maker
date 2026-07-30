import { describe, expect, it, vi } from 'vitest';
import { createLocalCoatId } from './id';

describe('createLocalCoatId', () => {
  it('uses the platform UUID when it is available', () => {
    vi.stubGlobal('crypto', { randomUUID: () => 'platform-id' });

    expect(createLocalCoatId()).toBe('platform-id');
    vi.unstubAllGlobals();
  });

  it('keeps local editing functional when a constrained browser omits crypto', () => {
    vi.stubGlobal('crypto', undefined);

    const firstId = createLocalCoatId();
    const secondId = createLocalCoatId();

    expect(firstId).toMatch(/^local-[a-z0-9]+-[a-z0-9]+$/);
    expect(secondId).not.toBe(firstId);
    vi.unstubAllGlobals();
  });
});
