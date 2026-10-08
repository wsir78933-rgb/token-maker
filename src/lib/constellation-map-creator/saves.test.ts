import { describe, expect, it } from 'vitest';

import {
  addConstellation,
  addConstellationStar,
  createDefaultConstellationProject,
  transformConstellationObject,
} from './state';
import {
  loadConstellationSlot,
  readConstellationSaveSlots,
  saveConstellationSlot,
} from './saves';

function createMemoryStorage(initialText: string | null = null) {
  let storedText = initialText;
  return {
    getItem() {
      return storedText;
    },
    setItem(_key: string, value: string) {
      storedText = value;
    },
    readText() {
      return storedText;
    },
  };
}

describe('constellation browser saves', () => {
  it('saves and reads back a non-empty complete project in one of five slots', () => {
    const storage = createMemoryStorage();
    let project = createDefaultConstellationProject();
    project = addConstellation(project, 'line-23', 'constellation-1');
    project = addConstellationStar(project, 'star-1');

    const saveSlots = saveConstellationSlot(3, project, storage);
    const readSlots = readConstellationSaveSlots(storage);
    const loadedProject = loadConstellationSlot(3, storage);

    expect(saveSlots).toHaveLength(5);
    expect(readSlots[2]?.project).toEqual(project);
    expect(readSlots[2]?.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(loadedProject).toEqual(project);
    expect(JSON.parse(storage.readText() ?? 'null')).toHaveLength(5);
  });

  it('does not overwrite malformed stored slots while saving', () => {
    const storage = createMemoryStorage('[null,null,{"bad":true},null,null]');
    const project = createDefaultConstellationProject();

    expect(() => saveConstellationSlot(1, project, storage)).toThrow(
      'must contain exactly project and savedAt',
    );
    expect(storage.readText()).toBe('[null,null,{"bad":true},null,null]');
  });

  it('rejects loading an empty slot and invalid slot numbers', () => {
    const storage = createMemoryStorage();
    expect(() => loadConstellationSlot(1, storage)).toThrow('slot 1 is empty');
    expect(() => readConstellationSaveSlots({ getItem: () => '{bad', setItem: () => undefined })).toThrow(
      'contains invalid JSON',
    );
    expect(() => saveConstellationSlot(6 as never, createDefaultConstellationProject(), storage)).toThrow(
      'must be an integer from 1 to 5',
    );
  });

  it('round-trips rotation in five browser slots and loads an old slot without rotation as 0', () => {
    const storage = createMemoryStorage();
    let project = createDefaultConstellationProject();
    project = addConstellation(project, 'line-23', 'constellation-1');
    project = addConstellationStar(project, 'star-1');
    const slotOneProject = transformConstellationObject(project, 'constellation-1', {
      x: 11,
      y: 22,
      width: 98,
      height: 93,
      rotation: 15,
    });
    const slotFiveProject = transformConstellationObject(slotOneProject, 'star-1', {
      x: 5,
      y: 6,
      width: 20,
      height: 20,
      rotation: -30,
    });

    saveConstellationSlot(1, slotOneProject, storage);
    saveConstellationSlot(5, slotFiveProject, storage);
    const readSlots = readConstellationSaveSlots(storage);

    expect(readSlots).toHaveLength(5);
    expect(readSlots[1]).toBeNull();
    expect(readSlots[2]).toBeNull();
    expect(readSlots[3]).toBeNull();
    expect(loadConstellationSlot(1, storage).objects[0]).toMatchObject({
      x: 11,
      y: 22,
      width: 98,
      height: 93,
      rotation: 15,
    });
    expect(loadConstellationSlot(5, storage).objects[1]).toMatchObject({
      x: 5,
      y: 6,
      width: 20,
      height: 20,
      rotation: 330,
    });
    expect(loadConstellationSlot(5, storage).objects[0]).toMatchObject({
      x: 11,
      y: 22,
      width: 98,
      height: 93,
      rotation: 15,
    });

    const storedSlots = JSON.parse(storage.readText() ?? 'null') as Array<{
      project: { objects: Array<Record<string, unknown>> };
    } | null>;
    const slotFiveRecord = storedSlots[4];
    if (slotFiveRecord === null) throw new Error('Expected slot 5 to contain a saved project.');
    for (const object of slotFiveRecord.project.objects) delete object.rotation;
    expect(slotFiveRecord.project.objects.every((object) => !Object.keys(object).includes('rotation'))).toBe(
      true,
    );
    storage.setItem('tokenmaker.constellation-map-creator.saves', JSON.stringify(storedSlots));

    const loadedOldProject = loadConstellationSlot(5, storage);
    expect(loadedOldProject.objects[0]).toMatchObject({
      x: 11,
      y: 22,
      width: 98,
      height: 93,
      rotation: 0,
    });
    expect(loadedOldProject.objects[1]).toMatchObject({
      x: 5,
      y: 6,
      width: 20,
      height: 20,
      rotation: 0,
    });
    expect(loadConstellationSlot(1, storage).objects[0]).toMatchObject({
      x: 11,
      y: 22,
      width: 98,
      height: 93,
      rotation: 15,
    });
  });

  it('rejects an illegal stored or incoming rotation without replacing it or rewriting storage', () => {
    let project = createDefaultConstellationProject();
    project = addConstellation(project, 'image-1', 'constellation-1');
    project = transformConstellationObject(project, 'constellation-1', {
      x: 9,
      y: 8,
      width: 70,
      height: 60,
      rotation: 20,
    });
    const storage = createMemoryStorage();
    saveConstellationSlot(3, project, storage);
    const storedText = storage.readText();
    if (storedText === null) throw new Error('Expected slot storage to contain JSON.');
    const storedSlots = JSON.parse(storedText) as Array<{
      project: { objects: Array<Record<string, unknown>> };
    } | null>;
    const savedSlot = storedSlots[2];
    if (savedSlot === null) throw new Error('Expected slot 3 to contain a saved project.');
    savedSlot.project.objects[0].rotation = null;
    const illegalText = JSON.stringify(storedSlots);
    storage.setItem('tokenmaker.constellation-map-creator.saves', illegalText);

    expect(() => loadConstellationSlot(3, storage)).toThrow('Received null');
    expect(storage.readText()).toBe(illegalText);

    const infiniteProject = {
      ...project,
      objects: [{ ...project.objects[0], rotation: Number.POSITIVE_INFINITY }],
    };
    expect(() => saveConstellationSlot(1, infiniteProject, storage)).toThrow('Received Infinity');
    expect(storage.readText()).toBe(illegalText);
  });
});

