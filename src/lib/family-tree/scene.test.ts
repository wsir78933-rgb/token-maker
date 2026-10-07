import { describe, expect, it } from 'vitest';

import { createInitialFamilyTreeAvatar } from '@/lib/family-tree/avatar';
import {
  FAMILY_TREE_MIN_CONNECTION_WIDTH,
  FAMILY_TREE_VERSION,
  addFamilyTreeConnection,
  addFamilyTreePerson,
  clearFamilyTreeConnections,
  createFamilyTreePerson,
  createInitialFamilyTreeScene,
  cycleFamilyTreeEndpointStyle,
  deleteFamilyTreePerson,
  getFamilyTreePerson,
  moveFamilyTreeConnection,
  moveFamilyTreePersonHorizontally,
  requireFamilyTreeScene,
  resizeFamilyTreeConnection,
  selectFamilyTreePerson,
  setFamilyTreeEndpointStyle,
  setFamilyTreeResizeEnabled,
  updateFamilyTreePerson,
  type FamilyTreeConnection,
  type FamilyTreePerson,
  type FamilyTreePersonDraft,
  type FamilyTreeScene,
} from '@/lib/family-tree/scene';

function createPersonDraft(): FamilyTreePersonDraft {
  return {
    avatar: createInitialFamilyTreeAvatar(),
    name: 'Ari',
    age: '32',
    description: 'A cartographer',
  };
}

function createPerson(
  id: string,
  generation: 0 | 1 | 2 | 3 = 0,
  x = 24,
): FamilyTreePerson {
  return createFamilyTreePerson(createPersonDraft(), id, generation, x);
}

function addPerson(
  scene: FamilyTreeScene,
  id: string,
  generation: 0 | 1 | 2 | 3 = 0,
  x = 24,
): FamilyTreeScene {
  return addFamilyTreePerson(scene, createPerson(id, generation, x));
}

function createConnection(
  id: string,
  gap: 0 | 1 | 2 = 0,
  x = 48,
  width = FAMILY_TREE_MIN_CONNECTION_WIDTH,
): FamilyTreeConnection {
  return { id, gap, x, width };
}

describe('family tree scene', () => {
  it('creates four empty generations with the complete workspace state', () => {
    const scene = createInitialFamilyTreeScene();

    expect(scene).toEqual({
      version: FAMILY_TREE_VERSION,
      generations: [[], [], [], []],
      connections: [],
      selectedPersonId: null,
      resizeEnabled: false,
    });
  });

  it('creates and adds people without mutating the source scene', () => {
    const initialScene = createInitialFamilyTreeScene();
    const person = createPerson('person-1', 2, 72);
    const nextScene = addFamilyTreePerson(initialScene, person);

    expect(initialScene.generations).toEqual([[], [], [], []]);
    expect(nextScene.generations[2]).toEqual([person]);
    expect(getFamilyTreePerson(nextScene, 'person-1')).toEqual(person);
    expect(() => addFamilyTreePerson(nextScene, person)).toThrow(
      'Family tree person id "person-1" already exists.',
    );
  });

  it('initializes all four endpoint styles to none', () => {
    expect(createPerson('person-1').endpoints).toEqual({
      top: 'none',
      bottom: 'none',
      left: 'none',
      right: 'none',
    });
  });

  it('updates person text and avatar while preserving placement and endpoints', () => {
    const selectedScene = selectFamilyTreePerson(
      setFamilyTreeEndpointStyle(addPerson(createInitialFamilyTreeScene(), 'person-1'), 'person-1', 'top', 'dashed'),
      'person-1',
    );
    const updatedScene = updateFamilyTreePerson(selectedScene, 'person-1', {
      name: 'Bryn',
      age: '41',
      description: 'A retired ranger',
      avatar: createInitialFamilyTreeAvatar(),
    });
    const updatedPerson = getFamilyTreePerson(updatedScene, 'person-1');

    expect(updatedPerson).toMatchObject({
      id: 'person-1',
      generation: 0,
      x: 24,
      name: 'Bryn',
      age: '41',
      description: 'A retired ranger',
      endpoints: { top: 'dashed' },
    });
    expect(updatedScene.selectedPersonId).toBe('person-1');
  });

  it('selects and deselects people, and moves them only horizontally', () => {
    const scene = addPerson(createInitialFamilyTreeScene(), 'person-1', 3, 12);
    const selected = selectFamilyTreePerson(scene, 'person-1');
    const moved = moveFamilyTreePersonHorizontally(selected, 'person-1', 180);
    const deselected = selectFamilyTreePerson(moved, null);

    expect(selected.selectedPersonId).toBe('person-1');
    expect(getFamilyTreePerson(moved, 'person-1')).toMatchObject({ generation: 3, x: 180 });
    expect(deselected.selectedPersonId).toBeNull();
    expect(() => selectFamilyTreePerson(scene, 'missing')).toThrow(
      'Family tree person id "missing" was not found.',
    );
    expect(() => moveFamilyTreePersonHorizontally(scene, 'person-1', -1)).toThrow(
      'greater than or equal to 0, received -1',
    );
  });

  it('cycles endpoint styles in none, solid, dashed order', () => {
    const scene = addPerson(createInitialFamilyTreeScene(), 'person-1');
    const solid = cycleFamilyTreeEndpointStyle(scene, 'person-1', 'right');
    const dashed = cycleFamilyTreeEndpointStyle(solid, 'person-1', 'right');
    const none = cycleFamilyTreeEndpointStyle(dashed, 'person-1', 'right');

    expect(getFamilyTreePerson(solid, 'person-1').endpoints.right).toBe('solid');
    expect(getFamilyTreePerson(dashed, 'person-1').endpoints.right).toBe('dashed');
    expect(getFamilyTreePerson(none, 'person-1').endpoints.right).toBe('none');
  });

  it('deletes a person and selection while retaining independent generation connections', () => {
    let scene = addPerson(createInitialFamilyTreeScene(), 'person-1');
    scene = addPerson(scene, 'person-2', 1);
    scene = addFamilyTreeConnection(scene, createConnection('connection-1', 0));
    scene = selectFamilyTreePerson(scene, 'person-1');

    const deleted = deleteFamilyTreePerson(scene, 'person-1');

    expect(() => getFamilyTreePerson(deleted, 'person-1')).toThrow(
      'Family tree person id "person-1" was not found.',
    );
    expect(deleted.selectedPersonId).toBeNull();
    expect(deleted.generations[1]).toHaveLength(1);
    expect(deleted.connections).toEqual([createConnection('connection-1', 0)]);
  });

  it('adds, moves, resizes, repeats, and clears generation connections', () => {
    let scene = createInitialFamilyTreeScene();
    scene = addFamilyTreeConnection(scene, createConnection('connection-1', 0));
    scene = addFamilyTreeConnection(scene, createConnection('connection-2', 0, 120, 80));
    scene = addFamilyTreeConnection(scene, createConnection('connection-3', 2, 240, 60));
    const moved = moveFamilyTreeConnection(scene, 'connection-1', 96);
    const resized = resizeFamilyTreeConnection(moved, 'connection-1', 144);

    expect(resized.connections).toEqual([
      createConnection('connection-1', 0, 96, 144),
      createConnection('connection-2', 0, 120, 80),
      createConnection('connection-3', 2, 240, 60),
    ]);

    const cleared = clearFamilyTreeConnections(resized);
    expect(cleared.connections).toEqual([]);
    expect(cleared.generations).toEqual([[], [], [], []]);
    expect(() => addFamilyTreeConnection(cleared, createConnection('connection-1'))).not.toThrow();
  });

  it('toggles resize state without changing connection data', () => {
    const scene = addFamilyTreeConnection(
      createInitialFamilyTreeScene(),
      createConnection('connection-1'),
    );
    const enabled = setFamilyTreeResizeEnabled(scene, true);
    const disabled = setFamilyTreeResizeEnabled(enabled, false);

    expect(enabled.resizeEnabled).toBe(true);
    expect(disabled.resizeEnabled).toBe(false);
    expect(disabled.connections).toEqual(scene.connections);
  });

  it('rejects invalid scene boundaries and duplicate ids', () => {
    expect(() => createFamilyTreePerson(createPersonDraft(), '', 0, 0)).toThrow(
      'Family tree person id must be a non-empty string',
    );
    expect(() => createFamilyTreePerson(createPersonDraft(), 'person-1', 4 as never, 0)).toThrow(
      'generation must be an integer from 0 to 3, received 4',
    );
    expect(() => createFamilyTreePerson(createPersonDraft(), 'person-1', 0, Number.NaN)).toThrow(
      'received NaN',
    );
    expect(() => addFamilyTreeConnection(
      createInitialFamilyTreeScene(),
      createConnection('connection-1', 0, 0, FAMILY_TREE_MIN_CONNECTION_WIDTH - 1),
    )).toThrow(`greater than or equal to ${FAMILY_TREE_MIN_CONNECTION_WIDTH}`);

    const duplicatePersonScene = {
      ...createInitialFamilyTreeScene(),
      generations: [[createPerson('person-1'), createPerson('person-1')], [], [], []],
    } as unknown;
    expect(() => requireFamilyTreeScene(duplicatePersonScene)).toThrow(
      'Family tree id "person-1" already exists.',
    );
  });

  it('rejects a person stored in the wrong generation and a missing selection', () => {
    const person = createPerson('person-1', 0);
    expect(() => requireFamilyTreeScene({
      version: FAMILY_TREE_VERSION,
      generations: [[], [person], [], []],
      connections: [],
      selectedPersonId: null,
      resizeEnabled: false,
    })).toThrow(
      'belongs to generation 0, but was stored in generation 1',
    );

    expect(() => requireFamilyTreeScene({
      version: FAMILY_TREE_VERSION,
      generations: [[], [], [], []],
      connections: [],
      selectedPersonId: 'missing',
      resizeEnabled: false,
    })).toThrow('selected person id "missing" was not found');
  });
});
