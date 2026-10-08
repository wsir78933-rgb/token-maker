import { afterEach, describe, expect, it, vi } from 'vitest';

import { createDefaultScrollProject } from './project';
import {
  SCROLL_SAVE_SLOT_COUNT,
  SCROLL_SAVE_STORAGE_KEY,
  readScrollSaveSlots,
  saveScrollToSlot,
  type ScrollSaveSlot,
} from './storage';
import type { ScrollProject } from './types';

type MemoryStorage = {
  values: Map<string, string>;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

function createMemoryStorage(): MemoryStorage {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

function createProjectWithCustomFont(): ScrollProject {
  return {
    ...createDefaultScrollProject(),
    paperId: 'paper09',
    text: 'The western gate opens at dusk.',
    customFonts: [
      {
        family: 'UnifrakturCook',
        stylesheetUrl: 'https://fonts.googleapis.com/css2?family=UnifrakturCook',
      },
    ],
  };
}

function createSavedSlot(slot: number, project: ScrollProject | null, savedAt: string | null): object {
  return { slot, project, savedAt };
}

describe('scroll creator local save slots', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns four empty slots without writing a missing storage key', () => {
    const storage = createMemoryStorage();

    expect(readScrollSaveSlots(storage)).toEqual([
      { slot: 1, savedAt: null, project: null },
      { slot: 2, savedAt: null, project: null },
      { slot: 3, savedAt: null, project: null },
      { slot: 4, savedAt: null, project: null },
    ] satisfies ScrollSaveSlot[]);
    expect(storage.getItem(SCROLL_SAVE_STORAGE_KEY)).toBeNull();
  });

  it('round trips one project while retaining the other empty slots and custom fonts', () => {
    const storage = createMemoryStorage();
    const project = createProjectWithCustomFont();
    vi.setSystemTime(new Date('2026-10-06T03:04:05.000Z'));

    const savedSlots = saveScrollToSlot(storage, 3, project);

    expect(savedSlots[2]).toEqual({
      slot: 3,
      savedAt: '2026-10-06T03:04:05.000Z',
      project,
    });
    expect(readScrollSaveSlots(storage)).toEqual(savedSlots);
    expect(readScrollSaveSlots(storage)[2].project?.customFonts).toEqual(project.customFonts);

    project.text = 'changed after save';
    expect(readScrollSaveSlots(storage)[2].project?.text).toBe('The western gate opens at dusk.');
  });

  it('rejects invalid slot numbers and invalid projects before reading or writing', () => {
    const storage = createMemoryStorage();
    const invalidSlotNumbers = [0, 5, 1.5, Number.NaN, '3', null];

    for (const invalidSlot of invalidSlotNumbers) {
      expect(() => saveScrollToSlot(storage, invalidSlot as number, createDefaultScrollProject())).toThrow(
        String(invalidSlot),
      );
    }
    expect(storage.getItem(SCROLL_SAVE_STORAGE_KEY)).toBeNull();

    expect(() => saveScrollToSlot(storage, 1, { ...createDefaultScrollProject(), paperId: 'paper99' })).toThrow(
      'paper99',
    );
    expect(storage.getItem(SCROLL_SAVE_STORAGE_KEY)).toBeNull();
  });

  it('rejects every malformed present payload instead of treating it as empty', () => {
    const storage = createMemoryStorage();
    const emptySlots = Array.from({ length: SCROLL_SAVE_SLOT_COUNT }, (_, index) =>
      createSavedSlot(index + 1, null, null),
    );
    const malformedPayloads = [
      '{broken',
      'null',
      JSON.stringify(emptySlots.slice(0, 3)),
      JSON.stringify([{ ...emptySlots[0], extra: true }, ...emptySlots.slice(1)]),
      JSON.stringify([{ ...emptySlots[0], slot: 2 }, ...emptySlots.slice(1)]),
      JSON.stringify([{ ...emptySlots[0], savedAt: 'yesterday' }, ...emptySlots.slice(1)]),
      JSON.stringify([{ ...emptySlots[0], savedAt: '2026-10-06T03:04:05.000Z' }, ...emptySlots.slice(1)]),
      JSON.stringify([
        {
          ...emptySlots[0],
          project: { ...createDefaultScrollProject(), paperId: 'paper99' },
        },
        ...emptySlots.slice(1),
      ]),
    ];

    for (const malformedPayload of malformedPayloads) {
      storage.values.set(SCROLL_SAVE_STORAGE_KEY, malformedPayload);
      expect(() => readScrollSaveSlots(storage)).toThrow();
      expect(storage.getItem(SCROLL_SAVE_STORAGE_KEY)).toBe(malformedPayload);
    }
  });

  it('requires savedAt and project to be present together', () => {
    const storage = createMemoryStorage();
    const project = createProjectWithCustomFont();
    const mixedSlotPayload = [
      createSavedSlot(1, project, null),
      ...Array.from({ length: 3 }, (_, index) => createSavedSlot(index + 2, null, null)),
    ];
    storage.values.set(SCROLL_SAVE_STORAGE_KEY, JSON.stringify(mixedSlotPayload));

    expect(() => readScrollSaveSlots(storage)).toThrow(/both savedAt and project/);
  });

  it('reports storage operation failures with key, slot, and original cause', () => {
    const readFailure = new Error('storage was disabled');
    const failingReader = {
      getItem: () => {
        throw readFailure;
      },
    };
    expect(() => readScrollSaveSlots(failingReader)).toThrow(
      /getItem failed.*tokenmaker\.scroll-creator\.saves.*storage was disabled/,
    );
    try {
      readScrollSaveSlots(failingReader);
    } catch (error: unknown) {
      expect(error).toMatchObject({ cause: readFailure });
    }

    const writeFailure = new Error('quota exceeded');
    const failingWriter = {
      getItem: () => null,
      setItem: () => {
        throw writeFailure;
      },
    };
    expect(() => saveScrollToSlot(failingWriter, 2, createDefaultScrollProject())).toThrow(
      /setItem failed.*tokenmaker\.scroll-creator\.saves.*slot 2.*quota exceeded/,
    );
    try {
      saveScrollToSlot(failingWriter, 2, createDefaultScrollProject());
    } catch (error: unknown) {
      expect(error).toMatchObject({ cause: writeFailure });
    }
  });

  it('rejects malformed storage objects with their received boundary values', () => {
    expect(() => readScrollSaveSlots(null as never)).toThrow(/Received null/);
    expect(() => readScrollSaveSlots({ getItem: 'nope' } as never)).toThrow(
      /getItem must be a function.*"nope"/,
    );
    expect(() => saveScrollToSlot({ getItem: () => null } as never, 1, createDefaultScrollProject())).toThrow(
      /setItem must be a function/,
    );
  });
});
