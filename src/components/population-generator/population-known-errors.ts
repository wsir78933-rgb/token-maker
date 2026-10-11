import { describeReceivedValue } from './population-boundary';

const KNOWN_POPULATION_PARSE_ERROR_NAMES = new Set([
  'PopulationResultError',
  'ZodError',
  'SyntaxError',
]);

const DOMAIN_POPULATION_MESSAGE = /^(?:Population\b|Cannot determine era or size\b)/;

export class PopulationStorageUnavailableError extends Error {
  constructor(detail: string) {
    super(detail);
    this.name = 'PopulationStorageUnavailableError';
  }
}

export function readKnownPopulationFileReadError(error: unknown): string | null {
  if (!(error instanceof DOMException)) {
    return null;
  }

  const message = error.message.trim();
  if (message.length === 0) {
    return `${error.name} with an empty message`;
  }

  return `${error.name}: ${message}`;
}

export function rethrowUnknownPopulationFileReadFailure(error: unknown): never {
  throw error;
}

export function readKnownPopulationParseError(error: unknown): string | null {
  if (!(error instanceof Error) || error instanceof PopulationStorageUnavailableError) {
    return null;
  }

  const message = error.message.trim();
  const recognizedName =
    KNOWN_POPULATION_PARSE_ERROR_NAMES.has(error.name) || error.name.startsWith('Population');
  const recognizedMessage = DOMAIN_POPULATION_MESSAGE.test(message);
  if (!recognizedName && !recognizedMessage) {
    return null;
  }

  return message.length > 0 ? message : `${error.name} with an empty message`;
}

export function isKnownPopulationStorageError(error: unknown): error is DOMException {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' ||
      error.name === 'SecurityError' ||
      error.name === 'NotAllowedError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}

export function readBrowserPopulationStorage(): Storage {
  if (typeof window === 'undefined') {
    throw new PopulationStorageUnavailableError('window is undefined');
  }

  try {
    const storage = window.localStorage;
    if (!storage) {
      throw new PopulationStorageUnavailableError('localStorage is null');
    }

    return storage;
  } catch (error) {
    if (error instanceof PopulationStorageUnavailableError || isKnownPopulationStorageError(error)) {
      throw error;
    }

    throw error;
  }
}

export function buildPopulationDownloadName(settlementName: string): string {
  if (typeof settlementName !== 'string') {
    throw new Error(
      `Population download name must be a string. Received ${describeReceivedValue(settlementName)}.`,
    );
  }

  return 'population.txt';
}
