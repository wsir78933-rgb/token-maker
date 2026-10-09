import { describe, expect, it } from 'vitest';

import {
  createDefaultMapMakerProject,
  loadMapMakerSlot,
  MAP_MAKER_SAVE_STORAGE_KEY,
  readMapMakerSaveSlots,
  saveMapMakerSlot,
} from './index';
import type { MapMakerSaveSlot } from './types';

function createStorage(initialText: string | null = null) {
  let storedText = initialText;
  return {
    getItem(key: string): string | null {
      if (key !== MAP_MAKER_SAVE_STORAGE_KEY) return null;
      return storedText;
    },
    setItem(key: string, text: string): void {
      if (key !== MAP_MAKER_SAVE_STORAGE_KEY) {
        throw new Error(`Unexpected Map Maker storage key ${JSON.stringify(key)}.`);
      }
      storedText = text;
    },
    readStoredText(): string | null {
      return storedText;
    },
  };
}

describe('Map Maker eight-slot browser saves', () => {
  it('saves and loads eight independent projects by slot', () => {
    const storage = createStorage();
    const defaultProject = createDefaultMapMakerProject();

    for (let slotNumber = 1; slotNumber <= 8; slotNumber += 1) {
      const project = {
        ...defaultProject,
        settings: { ...defaultProject.settings, hexSizePercent: slotNumber },
      };
      saveMapMakerSlot(slotNumber as MapMakerSaveSlot, project, storage);
    }

    const savedSlots = readMapMakerSaveSlots(storage);
    expect(savedSlots).toHaveLength(8);
    expect(savedSlots.every((savedProject) => savedProject !== null)).toBe(true);
    expect(loadMapMakerSlot(1, storage).settings.hexSizePercent).toBe(1);
    expect(loadMapMakerSlot(8, storage).settings.hexSizePercent).toBe(8);
  });

  it('does not overwrite malformed storage when a save is attempted', () => {
    const corruptedText = '{"slots":"not-an-array"}';
    const storage = createStorage(corruptedText);

    expect(() => saveMapMakerSlot(1, createDefaultMapMakerProject(), storage)).toThrow(/exactly 8 slots/);
    expect(storage.readStoredText()).toBe(corruptedText);
  });

  it('rejects an empty slot and invalid slot values', () => {
    const storage = createStorage();
    expect(() => loadMapMakerSlot(1, storage)).toThrow(/slot 1 is empty/);
    expect(() => saveMapMakerSlot(0 as MapMakerSaveSlot, createDefaultMapMakerProject(), storage)).toThrow('Received 0');
  });
});
