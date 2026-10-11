import { describe, expect, it } from 'vitest';

import { NoticeBoardStorageError, loadNoticeBoardSlot, readNoticeBoardSlots, saveNoticeBoardSlot } from '@/lib/notice-board-creator/storage';
import { createBoardNotice, createEmptyNoticeBoardProject, serializeNoticeBoardFile } from '@/lib/notice-board-creator/project';
import type { NoticeBoardSlotIndex } from '@/lib/notice-board-creator/types';

type NoticeBoardMemoryStorage = Pick<Storage, 'getItem' | 'setItem'> & { entries: Map<string, string> };

function createNoticeBoardMemoryStorage(): NoticeBoardMemoryStorage {
  const entries = new Map<string, string>();

  return {
    entries,
    getItem(key) {
      return entries.get(key) ?? null;
    },
    setItem(key, value) {
      entries.set(key, value);
    },
  };
}

function createProjectForSlot(slotIndex: NoticeBoardSlotIndex) {
  const emptyProject = createEmptyNoticeBoardProject();

  return {
    ...emptyProject,
    boardWidth: 960 + slotIndex,
    notices: [createBoardNotice('paper-01', `slot-${slotIndex}-notice`, 960)],
  };
}

describe('notice board local slots', () => {
  it('reads four empty slots and round trips a complete project in every slot', () => {
    const storage = createNoticeBoardMemoryStorage();
    const slotIndexes = [1, 2, 3, 4] as const satisfies readonly NoticeBoardSlotIndex[];

    expect(readNoticeBoardSlots(storage)).toEqual(
      slotIndexes.map((slotIndex) => ({
        slotIndex,
        status: 'empty',
        project: null,
        error: null,
      })),
    );

    for (const slotIndex of slotIndexes) {
      saveNoticeBoardSlot(storage, slotIndex, createProjectForSlot(slotIndex));
    }

    expect(readNoticeBoardSlots(storage)).toEqual(
      slotIndexes.map((slotIndex) => ({
        slotIndex,
        status: 'valid',
        project: createProjectForSlot(slotIndex),
        error: null,
      })),
    );
    for (const slotIndex of slotIndexes) {
      expect(loadNoticeBoardSlot(storage, slotIndex)).toEqual(createProjectForSlot(slotIndex));
    }
  });

  it('rejects slot indices outside one through four before changing storage', () => {
    const storage = createNoticeBoardMemoryStorage();

    expect(() => loadNoticeBoardSlot(storage, 0 as NoticeBoardSlotIndex)).toThrow(NoticeBoardStorageError);
    expect(() => loadNoticeBoardSlot(storage, 0 as NoticeBoardSlotIndex)).toThrow('0');
    expect(() => saveNoticeBoardSlot(storage, 5 as NoticeBoardSlotIndex, createProjectForSlot(1))).toThrow(
      NoticeBoardStorageError,
    );
    expect(() => saveNoticeBoardSlot(storage, 5 as NoticeBoardSlotIndex, createProjectForSlot(1))).toThrow('5');
    expect(storage.entries.size).toBe(0);
  });

  it('isolates a corrupt slot, keeps other slots readable, and allows an explicit overwrite', () => {
    const storage = createNoticeBoardMemoryStorage();
    const unaffectedSlotIndexes = [1, 3, 4] as const satisfies readonly NoticeBoardSlotIndex[];
    for (const slotIndex of unaffectedSlotIndexes) {
      storage.entries.set(
        `notice-board-creator:slot:${slotIndex}`,
        serializeNoticeBoardFile(createProjectForSlot(slotIndex)),
      );
    }
    storage.entries.set('notice-board-creator:slot:2', '{broken');

    const slotResults = readNoticeBoardSlots(storage);
    const corruptSlotResult = slotResults[1];

    expect(slotResults.map(({ status }) => status)).toEqual(['valid', 'invalid', 'valid', 'valid']);
    if (corruptSlotResult?.status !== 'invalid') {
      throw new Error('Expected slot 2 to expose its invalid stored-project error.');
    }
    expect(corruptSlotResult.slotIndex).toBe(2);
    expect(corruptSlotResult.error).toBeInstanceOf(NoticeBoardStorageError);
    expect(corruptSlotResult.error.message).toContain('slot 2');
    expect(corruptSlotResult.error.message).toContain('{broken');
    expect(loadNoticeBoardSlot(storage, 1)).toEqual(createProjectForSlot(1));
    expect(loadNoticeBoardSlot(storage, 3)).toEqual(createProjectForSlot(3));
    expect(loadNoticeBoardSlot(storage, 4)).toEqual(createProjectForSlot(4));
    expect(() => loadNoticeBoardSlot(storage, 2)).toThrow(NoticeBoardStorageError);
    expect(() => loadNoticeBoardSlot(storage, 2)).toThrow('slot 2');

    const replacementProject = createProjectForSlot(2);
    saveNoticeBoardSlot(storage, 2, replacementProject);

    expect(loadNoticeBoardSlot(storage, 2)).toEqual(replacementProject);
    expect(readNoticeBoardSlots(storage).map(({ status }) => status)).toEqual([
      'valid',
      'valid',
      'valid',
      'valid',
    ]);
  });

  it('wraps browser security and quota failures with the affected storage key', () => {
    const blockedRead = new DOMException('storage is blocked', 'SecurityError');
    const readFailingStorage: Pick<Storage, 'getItem' | 'setItem'> = {
      getItem() {
        throw blockedRead;
      },
      setItem() {
        throw new Error('Read test unexpectedly attempted to write storage.');
      },
    };
    const blockedWrite = new DOMException('storage quota exceeded', 'QuotaExceededError');
    const writeFailingStorage: Pick<Storage, 'getItem' | 'setItem'> = {
      getItem() {
        return null;
      },
      setItem() {
        throw blockedWrite;
      },
    };

    expect(() => readNoticeBoardSlots(readFailingStorage)).toThrow(NoticeBoardStorageError);
    expect(() => readNoticeBoardSlots(readFailingStorage)).toThrow('notice-board-creator:slot:1');
    expect(() => saveNoticeBoardSlot(writeFailingStorage, 2, createProjectForSlot(2))).toThrow(
      NoticeBoardStorageError,
    );
    expect(() => saveNoticeBoardSlot(writeFailingStorage, 2, createProjectForSlot(2))).toThrow(
      'notice-board-creator:slot:2',
    );
  });

  it('preserves unknown storage exceptions instead of silently wrapping them', () => {
    const unexpectedFailure = new Error('unexpected adapter failure');
    const storage: Pick<Storage, 'getItem' | 'setItem'> = {
      getItem() {
        throw unexpectedFailure;
      },
      setItem() {
        throw new Error('Unknown read failure test unexpectedly attempted to write storage.');
      },
    };

    expect(() => loadNoticeBoardSlot(storage, 1)).toThrow(unexpectedFailure);
  });
});
