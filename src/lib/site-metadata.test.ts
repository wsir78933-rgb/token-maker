import { describe, expect, it } from 'vitest';
import { createLocaleLayoutMetadata } from '@/lib/site-metadata';

describe('site layout metadata', () => {
  it('includes the Yandex site verification token', () => {
    const metadata = createLocaleLayoutMetadata('en');

    expect(metadata.verification).toEqual({
      yandex: 'f252fddaf29fc1be',
    });
  });
});
