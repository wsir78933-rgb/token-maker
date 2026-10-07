import { describe, expect, it } from 'vitest';

import { createInitialFamilyTreeDocument } from '@/lib/family-tree/document';
import { FAMILY_TREE_SAVE_SLOT_COUNT } from '@/lib/family-tree/scene';
import {
  FAMILY_TREE_SAVE_STORAGE_KEY,
  familyTreeSaveSlotIsFilled,
  readFamilyTreeSaveSlot,
  readFamilyTreeSaveSlots,
  requireFamilyTreeSaveSlotNumber,
  writeFamilyTreeSaveSlot,
  type FamilyTreeSaveStorage,
} from '@/lib/family-tree/saves';

function createMemoryStorage(initialValue: string | null = null): FamilyTreeSaveStorage & {
  readStoredValue: () => string | null;
} {
  let storedValue = initialValue;

  return {
    getItem(key: string) {
      if (key !== FAMILY_TREE_SAVE_STORAGE_KEY) {
        throw new Error(`Unexpected family tree save key ${JSON.stringify(key)}.`);
      }

      return storedValue;
    },
    setItem(key: string, value: string) {
      if (key !== FAMILY_TREE_SAVE_STORAGE_KEY) {
        throw new Error(`Unexpected family tree save key ${JSON.stringify(key)}.`);
      }

      storedValue = value;
    },
    readStoredValue() {
      return storedValue;
    },
  };
}

describe('family tree browser saves', () => {
  it('uses one key and provides five empty slots', () => {
    const storage = createMemoryStorage();

    expect(FAMILY_TREE_SAVE_STORAGE_KEY).toBe('tokenmaker.family-tree.saves');
    expect(FAMILY_TREE_SAVE_SLOT_COUNT).toBe(5);
    expect(readFamilyTreeSaveSlots(storage)).toEqual([null, null, null, null, null]);
    expect(readFamilyTreeSaveSlot(storage, 1)).toBeNull();
    expect(familyTreeSaveSlotIsFilled(storage, 5)).toBe(false);
  });

  it('writes and reads every slot as a complete document', () => {
    const storage = createMemoryStorage();
    const firstDocument = createInitialFamilyTreeDocument();
    const secondDocument = {
      ...firstDocument,
      scene: { ...firstDocument.scene, resizeEnabled: true },
    };

    writeFamilyTreeSaveSlot(storage, 1, firstDocument);
    writeFamilyTreeSaveSlot(storage, 5, secondDocument);

    expect(readFamilyTreeSaveSlot(storage, 1)).toEqual(firstDocument);
    expect(readFamilyTreeSaveSlot(storage, 5)).toEqual(secondDocument);
    expect(familyTreeSaveSlotIsFilled(storage, 1)).toBe(true);
    expect(familyTreeSaveSlotIsFilled(storage, 2)).toBe(false);

    const storedValue = storage.readStoredValue();
    expect(storedValue).not.toBeNull();
    expect(JSON.parse(storedValue ?? 'null')).toHaveLength(5);
  });

  it('overwrites one slot while retaining the other four', () => {
    const storage = createMemoryStorage();
    const firstDocument = createInitialFamilyTreeDocument();
    const secondDocument = {
      ...firstDocument,
      scene: { ...firstDocument.scene, selectedPersonId: null, resizeEnabled: true },
    };

    writeFamilyTreeSaveSlot(storage, 3, firstDocument);
    writeFamilyTreeSaveSlot(storage, 3, secondDocument);

    expect(readFamilyTreeSaveSlots(storage)).toEqual([null, null, secondDocument, null, null]);
  });

  it('rejects invalid slot numbers and bad storage JSON', () => {
    const storage = createMemoryStorage();

    expect(() => requireFamilyTreeSaveSlotNumber(0)).toThrow(
      'must be an integer from 1 to 5, received 0',
    );
    expect(() => readFamilyTreeSaveSlot(storage, 6)).toThrow(
      'must be an integer from 1 to 5, received 6',
    );

    storage.setItem(FAMILY_TREE_SAVE_STORAGE_KEY, '{broken');
    expect(() => readFamilyTreeSaveSlots(storage)).toThrow('invalid JSON syntax');

    storage.setItem(FAMILY_TREE_SAVE_STORAGE_KEY, '[]');
    expect(() => readFamilyTreeSaveSlots(storage)).toThrow('must contain 5 slots, received 0');
  });

  it('rejects malformed slot documents and does not silently accept old HTML', () => {
    const storage = createMemoryStorage(
      JSON.stringify([
        null,
        { version: 999 },
        null,
        null,
        '<div>legacy html</div>',
      ]),
    );

    expect(() => readFamilyTreeSaveSlots(storage)).toThrow('slot 2 is invalid');

    storage.setItem(
      FAMILY_TREE_SAVE_STORAGE_KEY,
      JSON.stringify([null, null, null, null, '<div>legacy html</div>']),
    );
    expect(() => readFamilyTreeSaveSlots(storage)).toThrow(
      'must be a document or null, received "<div>legacy html</div>"',
    );
  });

  it('validates storage object methods and invalid documents before writing', () => {
    expect(() => readFamilyTreeSaveSlots(null as never)).toThrow(
      'Family tree save storage must be an object, received null.',
    );

    const invalidStorage = {
      getItem() {
        return null;
      },
      setItem: 'not-a-function',
    } as unknown as FamilyTreeSaveStorage;
    expect(() => writeFamilyTreeSaveSlot(invalidStorage, 1, createInitialFamilyTreeDocument())).toThrow(
      'setItem must be a function, received "not-a-function"',
    );

    const storage = createMemoryStorage();
    expect(() => writeFamilyTreeSaveSlot(storage, 1, {
      version: 999,
      scene: createInitialFamilyTreeDocument().scene,
    } as never)).toThrow('document version must be 1, received 999');
    expect(storage.readStoredValue()).toBeNull();
  });
});
