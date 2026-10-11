export type PopulationNumberKind = 'integer' | 'decimal';

export type PopulationNumberInterpretation =
  | { status: 'valid'; value: number }
  | { status: 'incomplete' }
  | { status: 'invalid' };

const INTEGER_DRAFT = /^(?:0|[1-9]\d*)$/;
const DECIMAL_DRAFT = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;
const INCOMPLETE_DECIMAL_DRAFT = /^(?:0|[1-9]\d*)\.$/;
const MAX_NUMBER_DRAFT_LENGTH = 40;

export function interpretPopulationNumberDraft(
  rawText: string,
  kind: PopulationNumberKind,
): PopulationNumberInterpretation {
  if (typeof rawText !== 'string') {
    throw new Error(
      `Population number draft must be a string. Received ${typeof rawText}.`,
    );
  }

  if (kind !== 'integer' && kind !== 'decimal') {
    throw new Error(`Population number kind must be "integer" or "decimal". Received ${JSON.stringify(kind)}.`);
  }

  if (rawText.length > MAX_NUMBER_DRAFT_LENGTH) {
    return { status: 'invalid' };
  }

  if (kind === 'decimal' && INCOMPLETE_DECIMAL_DRAFT.test(rawText)) {
    return { status: 'incomplete' };
  }

  const pattern = kind === 'integer' ? INTEGER_DRAFT : DECIMAL_DRAFT;
  if (!pattern.test(rawText)) {
    return { status: 'invalid' };
  }

  const value = Number(rawText);
  if (!Number.isFinite(value) || value < 0) {
    return { status: 'invalid' };
  }

  if (kind === 'integer' && !Number.isSafeInteger(value)) {
    return { status: 'invalid' };
  }

  return { status: 'valid', value };
}

export function roundAreaSquareMeasure(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Area must be a non-negative finite number. Received ${String(value)}.`);
  }

  return Number(value.toFixed(3));
}

export function formatAreaSquareMeasure(value: number): string {
  return roundAreaSquareMeasure(value).toFixed(3);
}

export function formatPopulationCount(value: number): string {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Population count must be a non-negative integer. Received ${String(value)}.`);
  }

  return String(value);
}

export function formatStoredPopulationNumber(value: number, kind: PopulationNumberKind): string {
  return kind === 'decimal' ? formatAreaSquareMeasure(value) : formatPopulationCount(value);
}
