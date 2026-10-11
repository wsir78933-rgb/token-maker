import { describe, expect, it } from 'vitest';

import {
  readKnownPopulationFileReadError,
  rethrowUnknownPopulationFileReadFailure,
} from './population-known-errors';

describe('population file read errors', () => {
  it('describes a DOMException with its name and message', () => {
    const readError = new DOMException('The file could not be read.', 'NotReadableError');

    expect(readKnownPopulationFileReadError(readError)).toBe(
      'NotReadableError: The file could not be read.',
    );
  });

  it('describes a DOMException that has an empty message', () => {
    expect(readKnownPopulationFileReadError(new DOMException('', 'AbortError'))).toBe(
      'AbortError with an empty message',
    );
  });

  it('does not treat an ordinary error as a known file read failure', () => {
    expect(readKnownPopulationFileReadError(new TypeError('sector 9'))).toBeNull();
    expect(readKnownPopulationFileReadError('NotReadableError')).toBeNull();
  });

  it('rethrows an unknown file read failure with the same error', () => {
    const unexpected = new TypeError('sector 9 is not a DOMException');

    expect(() => rethrowUnknownPopulationFileReadFailure(unexpected)).toThrow(unexpected);
  });
});
