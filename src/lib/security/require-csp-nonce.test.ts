import { describe, expect, it } from 'vitest';

import { requireCspNonce } from './require-csp-nonce';

describe('requireCspNonce', () => {
  it('returns the supplied nonce without changing it', () => {
    expect(requireCspNonce('GoogleAdSense', ' nonce-with-spaces ')).toBe(' nonce-with-spaces ');
  });

  it.each([undefined, null, '', '   ', 123])(
    'rejects an invalid nonce received by %s',
    (receivedNonce) => {
      expect(() => requireCspNonce('GoogleAdSense', receivedNonce)).toThrow(
        `GoogleAdSense requires a non-empty CSP nonce; received value: ${String(receivedNonce)}`
      );
    }
  );
});
