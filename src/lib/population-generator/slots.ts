import { describePopulationValue } from './describe-population-value';
import { validatePopulationResult } from './validate';
import type { PopulationResult } from './types';

export const POPULATION_SLOT_COUNT = 5;
export const POPULATION_SLOT_STORAGE_KEY = 'tokenmaker.population-generator.slots.v1';

const SLOT_DOCUMENT_FORMAT = 'tokenmaker-population-generator-slots';
const SLOT_DOCUMENT_VERSION = 1;
const SLOT_DOCUMENT_KEYS = ['format', 'formatVersion', 'slots'] as const;

type PopulationSlotReader = Pick<Storage, 'getItem'>;
type PopulationSlotWriter = Pick<Storage, 'getItem' | 'setItem'>;

function requireSlotReader(storage: unknown): PopulationSlotReader {
  if (storage === null || typeof storage !== 'object' || typeof (storage as PopulationSlotReader).getItem !== 'function') {
    throw new Error(`Population slot storage must have getItem. Received ${describePopulationValue(storage)}.`);
  }

  return storage as PopulationSlotReader;
}

function requireSlotWriter(storage: unknown): PopulationSlotWriter {
  const reader = requireSlotReader(storage);
  if (typeof (storage as PopulationSlotWriter).setItem !== 'function') {
    throw new Error(`Population slot storage must have setItem. Received ${describePopulationValue(storage)}.`);
  }

  return reader as PopulationSlotWriter;
}

function requireSlotIndex(slotIndex: unknown): number {
  if (typeof slotIndex !== 'number' || Object.is(slotIndex, -0) || !Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > 4) {
    throw new Error(`Population slot index must be an integer from 0 to 4. Received ${describePopulationValue(slotIndex)}.`);
  }

  return slotIndex;
}

function emptySlots(): Array<PopulationResult | null> {
  return [null, null, null, null, null];
}

function snippet(text: string): string {
  return JSON.stringify(text.slice(0, 180));
}

function parseStoredJson(storedText: string): unknown {
  try {
    return JSON.parse(storedText);
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : describePopulationValue(error);
    throw new Error(
      `Population slots are not valid JSON (${storedText.length} characters). Received ${snippet(storedText)}. ${reason}.`,
    );
  }
}

function requireStoredRecord(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Population slot document must be an object. Received ${describePopulationValue(value)}.`);
  }

  return value as Record<string, unknown>;
}

function readSlotEntry(slotIndex: number, value: unknown): PopulationResult | null {
  if (value === null) {
    return null;
  }

  try {
    return validatePopulationResult(value);
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : describePopulationValue(error);
    throw new Error(`Population slot ${slotIndex} is invalid. ${reason}`);
  }
}

function readStoredSlots(storedText: string): Array<PopulationResult | null> {
  const record = requireStoredRecord(parseStoredJson(storedText));
  for (const key of Object.keys(record)) {
    if (!SLOT_DOCUMENT_KEYS.includes(key as (typeof SLOT_DOCUMENT_KEYS)[number])) {
      throw new Error(
        `Population slot document has unknown field ${JSON.stringify(key)}. Received ${describePopulationValue(record)}.`,
      );
    }
  }

  if (record.format !== SLOT_DOCUMENT_FORMAT) {
    throw new Error(
      `Population slot document format must be ${JSON.stringify(SLOT_DOCUMENT_FORMAT)}. Received ${describePopulationValue(record.format)}.`,
    );
  }

  if (record.formatVersion !== SLOT_DOCUMENT_VERSION) {
    throw new Error(
      `Population slot document formatVersion must be ${SLOT_DOCUMENT_VERSION}. Received ${describePopulationValue(record.formatVersion)}.`,
    );
  }

  if (!Array.isArray(record.slots)) {
    throw new Error(`Population slots must be an array. Received ${describePopulationValue(record.slots)}.`);
  }

  if (record.slots.length !== POPULATION_SLOT_COUNT) {
    throw new Error(`Population slots must contain ${POPULATION_SLOT_COUNT} entries. Received ${record.slots.length}.`);
  }

  return record.slots.map((entry, index) => readSlotEntry(index, entry));
}

function readStoredText(storage: PopulationSlotReader): string | null {
  const storedText = storage.getItem(POPULATION_SLOT_STORAGE_KEY);
  if (storedText === null) {
    return null;
  }

  if (typeof storedText !== 'string') {
    throw new Error(
      `Population slot storage getItem must return a string or null. Received ${describePopulationValue(storedText)}.`,
    );
  }

  return storedText;
}

export function readPopulationSlots(storage: Pick<Storage, 'getItem'>): Array<PopulationResult | null> {
  const slotReader = requireSlotReader(storage);
  const storedText = readStoredText(slotReader);
  if (storedText === null) {
    return emptySlots();
  }

  return readStoredSlots(storedText);
}

function serializeSlots(slots: Array<PopulationResult | null>): string {
  return JSON.stringify({
    format: SLOT_DOCUMENT_FORMAT,
    formatVersion: SLOT_DOCUMENT_VERSION,
    slots,
  });
}

export function savePopulationSlot(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  slotIndex: number,
  result: PopulationResult,
): void {
  const slotWriter = requireSlotWriter(storage);
  const index = requireSlotIndex(slotIndex);
  const validated = validatePopulationResult(result);
  const slots = readPopulationSlots(slotWriter);
  slots[index] = validated;
  slotWriter.setItem(POPULATION_SLOT_STORAGE_KEY, serializeSlots(slots));
}
