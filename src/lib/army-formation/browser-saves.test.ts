import { describe, expect, it } from 'vitest';

import {
  ARMY_FORMATION_DOCUMENT_STORAGE_KEY,
  readArmyFormationBrowserSave,
  removeArmyFormationBrowserSave,
  writeArmyFormationBrowserSave,
  type ArmyFormationDocumentStorage,
} from '@/lib/army-formation/browser-saves';
import {
  addArmyFormationPiece,
  createEmptyArmyFormationDocument,
  parseArmyFormationDocument,
  serializeArmyFormationDocument,
} from '@/lib/army-formation/document';

type MemoryArmyFormationStorage = ArmyFormationDocumentStorage & {
  readStoredText: () => string | null;
};

function createMemoryArmyFormationStorage(initialText: string | null): MemoryArmyFormationStorage {
  let storedText = initialText;

  return {
    getItem(key: string) {
      if (key !== ARMY_FORMATION_DOCUMENT_STORAGE_KEY) {
        throw new Error(
          `Army formation document storage key must be ${JSON.stringify(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)}, received ${JSON.stringify(key)}.`,
        );
      }

      return storedText;
    },
    setItem(key: string, value: string) {
      if (key !== ARMY_FORMATION_DOCUMENT_STORAGE_KEY) {
        throw new Error(
          `Army formation document storage key must be ${JSON.stringify(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)}, received ${JSON.stringify(key)}.`,
        );
      }

      if (typeof value !== 'string') {
        throw new Error(`Stored army formation document must be a string, received ${String(value)}.`);
      }

      storedText = value;
    },
    removeItem(key: string) {
      if (key !== ARMY_FORMATION_DOCUMENT_STORAGE_KEY) {
        throw new Error(
          `Army formation document storage key must be ${JSON.stringify(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)}, received ${JSON.stringify(key)}.`,
        );
      }

      storedText = null;
    },
    readStoredText() {
      return storedText;
    },
  };
}

describe('army formation browser saves', () => {
  it('使用 tokenmaker.army-formation-creator.document', () => {
    expect(ARMY_FORMATION_DOCUMENT_STORAGE_KEY).toBe('tokenmaker.army-formation-creator.document');
  });

  it('没有存档时读到 null', () => {
    expect(readArmyFormationBrowserSave(createMemoryArmyFormationStorage(null))).toBeNull();
  });

  it('写入调用 serialize，读出调用 parse', () => {
    const storage = createMemoryArmyFormationStorage(null);
    const armyDocument = addArmyFormationPiece(
      createEmptyArmyFormationDocument(),
      'helmet-01',
      'piece-1',
      240,
    );

    writeArmyFormationBrowserSave(storage, armyDocument);

    const storedText = storage.readStoredText();
    expect(storedText).toBe(serializeArmyFormationDocument(armyDocument));
    expect(readArmyFormationBrowserSave(storage)).toEqual(parseArmyFormationDocument(storedText ?? ''));
  });

  it('坏存档会抛出并带上原字符串', () => {
    const raw = 'not-a-valid-army-formation-document';

    expect(() => readArmyFormationBrowserSave(createMemoryArmyFormationStorage(raw))).toThrow(raw);
  });

  it('坏的 JSON 对象会抛出并带上原字符串', () => {
    const raw = '{"version":999}';

    expect(() => readArmyFormationBrowserSave(createMemoryArmyFormationStorage(raw))).toThrow(raw);
  });

  it('存储不是对象时抛出并带上原值', () => {
    expect(() =>
      readArmyFormationBrowserSave(null as unknown as ArmyFormationDocumentStorage),
    ).toThrow('received null');
  });

  it('删除后读到 null，内存里的原文也不再存在', () => {
    const storage = createMemoryArmyFormationStorage(null);
    const armyDocument = addArmyFormationPiece(
      createEmptyArmyFormationDocument(),
      'helmet-01',
      'piece-1',
      240,
    );

    writeArmyFormationBrowserSave(storage, armyDocument);
    expect(storage.readStoredText()).toBe(serializeArmyFormationDocument(armyDocument));

    removeArmyFormationBrowserSave(storage);

    expect(readArmyFormationBrowserSave(storage)).toBeNull();
    expect(storage.readStoredText()).toBeNull();
  });

  it('removeItem 不是函数时抛出并带上原值', () => {
    const storage = {
      getItem() {
        return null;
      },
      setItem() {},
      removeItem: 'not-a-function',
    } as unknown as ArmyFormationDocumentStorage;

    expect(() => removeArmyFormationBrowserSave(storage)).toThrow(
      'Army formation document storage removeItem must be a function, received "not-a-function".',
    );
  });
});
