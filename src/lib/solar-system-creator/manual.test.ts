import { describe, expect, it } from 'vitest';

import {
  addManualPlanet,
  assertManualSolarSystem,
  clearManualPlanets,
  createManualSolarSystem,
  createSolarSaveSnapshot,
  deleteSelectedManualPlanet,
  restoreManualSolarSystem,
  setManualDraggingEnabled,
  setManualResizingEnabled,
  setManualStar,
  toggleManualPlanetSelection,
  updateManualPlanetDescription,
  updateManualPlanetTransform,
} from './manual';

function addPlanet(state: ReturnType<typeof createManualSolarSystem>, index: number) {
  return addManualPlanet(state, 'type-1-1', `planet-${index}`);
}

describe('manual solar system state', () => {
  it('creates an empty canvas with both manual controls enabled', () => {
    expect(createManualSolarSystem()).toEqual({
      starAssetId: 'star-1',
      planets: [],
      selectedPlanetId: null,
      draggingEnabled: true,
      resizingEnabled: true,
    });
  });

  it('replaces the star, supports repeated planets beyond ten, and starts them at the source origin', () => {
    let state = setManualStar(createManualSolarSystem(), 'star-7');
    for (let planetIndex = 1; planetIndex <= 11; planetIndex += 1) {
      state = addPlanet(state, planetIndex);
    }

    expect(state.starAssetId).toBe('star-7');
    expect(state.planets).toHaveLength(11);
    expect(state.planets[0]).toMatchObject({
      id: 'planet-1',
      assetId: 'type-1-1',
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      description: '',
    });
  });

  it('toggles one selected planet and edits its independent description and transform', () => {
    let state = addPlanet(createManualSolarSystem(), 1);
    state = addManualPlanet(state, 'type-2-3', 'planet-2');
    state = toggleManualPlanetSelection(state, 'planet-2');
    state = updateManualPlanetDescription(state, 'planet-2', 'A ringed world');
    state = updateManualPlanetTransform(state, 'planet-2', {
      x: 120,
      y: 80,
      width: 108,
      height: 108,
    });

    expect(state.selectedPlanetId).toBe('planet-2');
    expect(state.planets[0]?.description).toBe('');
    expect(state.planets[1]).toMatchObject({
      description: 'A ringed world',
      x: 120,
      y: 80,
      width: 108,
      height: 108,
    });

    state = toggleManualPlanetSelection(state, 'planet-2');
    expect(state.selectedPlanetId).toBeNull();
  });

  it('keeps drag and resize switches independent', () => {
    let state = createManualSolarSystem();
    state = setManualDraggingEnabled(state, false);
    expect(state.draggingEnabled).toBe(false);
    expect(state.resizingEnabled).toBe(true);

    state = setManualResizingEnabled(state, false);
    expect(state.draggingEnabled).toBe(false);
    expect(state.resizingEnabled).toBe(false);
  });

  it('deletes the selected planet with its description and clears all planets while retaining the star', () => {
    let state = setManualStar(createManualSolarSystem(), 'star-2');
    state = addPlanet(state, 1);
    state = updateManualPlanetDescription(state, 'planet-1', 'Keep this only until deletion');
    state = toggleManualPlanetSelection(state, 'planet-1');
    state = deleteSelectedManualPlanet(state);

    expect(state.starAssetId).toBe('star-2');
    expect(state.planets).toEqual([]);
    expect(state.selectedPlanetId).toBeNull();

    state = addPlanet(state, 2);
    state = clearManualPlanets(state);
    expect(state.starAssetId).toBe('star-2');
    expect(state.planets).toEqual([]);
  });

  it('round-trips only the manual layout and enables both controls after restore', () => {
    let state = setManualStar(createManualSolarSystem(), 'star-9');
    state = addPlanet(state, 1);
    state = updateManualPlanetDescription(state, 'planet-1', '');
    state = toggleManualPlanetSelection(state, 'planet-1');
    state = setManualDraggingEnabled(state, false);
    state = setManualResizingEnabled(state, false);

    const snapshot = createSolarSaveSnapshot(state);
    const restored = restoreManualSolarSystem(snapshot);

    expect(snapshot).toEqual({
      starAssetId: 'star-9',
      planets: [expect.objectContaining({ id: 'planet-1', description: '' })],
    });
    expect(restored).toMatchObject({
      starAssetId: 'star-9',
      selectedPlanetId: null,
      draggingEnabled: true,
      resizingEnabled: true,
    });
    expect(restored.planets).toEqual(snapshot.planets);
  });

  it('rejects invalid ids, duplicate ids, invalid transforms, and stale selections', () => {
    expect(() => setManualStar(createManualSolarSystem(), 'type-1-1')).toThrow(
      'Solar star asset id must use the star category',
    );
    expect(() => addManualPlanet(createManualSolarSystem(), 'star-1', 'planet-1')).toThrow(
      'Solar planet asset id must use type-1 through type-5',
    );

    const state = addPlanet(createManualSolarSystem(), 1);
    expect(() => addManualPlanet(state, 'type-1-1', 'planet-1')).toThrow('duplicate');
    expect(() => toggleManualPlanetSelection(state, 'missing')).toThrow('not found');
    expect(() => updateManualPlanetTransform(state, 'planet-1', {
      x: 0,
      y: 0,
      width: 40,
      height: 20,
    })).toThrow('square aspect ratio');
    expect(() => updateManualPlanetTransform(state, 'planet-1', {
      x: 780,
      y: 0,
      width: 40,
      height: 40,
    })).toThrow('inside the 800×400 canvas');

    expect(() => assertManualSolarSystem({ ...state, selectedPlanetId: 'missing' })).toThrow(
      'not found',
    );
  });
});
