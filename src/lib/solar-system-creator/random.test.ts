import { describe, expect, it } from 'vitest';

import {
  assertRandomSolarSystem,
  createRandomSolarSystem,
  selectRandomPlanet,
  updateRandomPlanetField,
} from './random';

const stableRandomValue = () => 0.5;

describe('random solar system state', () => {
  it('uses four to ten planets for null and zero, and honors a fixed count from one to ten', () => {
    const randomCountState = createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: null },
      'en',
      stableRandomValue,
    );
    const zeroCountState = createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 0 },
      'en',
      stableRandomValue,
    );
    const fixedCountState = createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 3 },
      'en',
      stableRandomValue,
    );

    expect(randomCountState.planets.length).toBe(7);
    expect(zeroCountState.planets.length).toBe(7);
    expect(fixedCountState.planets).toHaveLength(3);
  });

  it('keeps the three star ranges and generated visuals inside the canvas', () => {
    const normalState = createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 1 },
      'en',
      stableRandomValue,
    );
    const blueAllowedState = createRandomSolarSystem(
      { starRange: 'include-blue', requestedPlanetCount: 1 },
      'en',
      stableRandomValue,
    );
    const blueOnlyState = createRandomSolarSystem(
      { starRange: 'only-blue', requestedPlanetCount: 1 },
      'en',
      stableRandomValue,
    );

    expect(Number(normalState.starAssetId.slice(5))).toBeGreaterThanOrEqual(1);
    expect(Number(normalState.starAssetId.slice(5))).toBeLessThanOrEqual(30);
    expect(Number(blueAllowedState.starAssetId.slice(5))).toBeGreaterThanOrEqual(1);
    expect(Number(blueAllowedState.starAssetId.slice(5))).toBeLessThanOrEqual(40);
    expect(Number(blueOnlyState.starAssetId.slice(5))).toBeGreaterThanOrEqual(31);
    expect(Number(blueOnlyState.starAssetId.slice(5))).toBeLessThanOrEqual(40);

    for (const planet of normalState.planets) {
      expect(planet.x).toBeGreaterThanOrEqual(0);
      expect(planet.y).toBeGreaterThanOrEqual(0);
      expect(planet.x + planet.width).toBeLessThanOrEqual(800);
      expect(planet.y + planet.height).toBeLessThanOrEqual(400);
      expect(planet.width).toBeGreaterThanOrEqual(20);
      expect(planet.width).toBeLessThan(71);
      expect(planet.height).toBe(planet.width);
    }
  });

  it('keeps every planet visible and horizontally separated for every fixed count', () => {
    for (let requestedPlanetCount = 1; requestedPlanetCount <= 10; requestedPlanetCount += 1) {
      const state = createRandomSolarSystem(
        { starRange: 'normal', requestedPlanetCount },
        'en',
        () => 0.999,
      );
      let previousRightEdge = 175;

      expect(state.planets).toHaveLength(requestedPlanetCount);
      for (const planet of state.planets) {
        expect(planet.x).toBeGreaterThanOrEqual(175);
        expect(planet.x).toBeGreaterThanOrEqual(previousRightEdge);
        expect(planet.x + planet.width).toBeLessThanOrEqual(800);
        expect(planet.width).toBeGreaterThanOrEqual(20);
        expect(planet.width).toBeLessThan(71);
        previousRightEdge = planet.x + planet.width;
      }
    }
  });

  it('generates all eight editable fields and keeps English and Chinese values synchronized by locale', () => {
    const englishState = createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 1 },
      'en',
      stableRandomValue,
    );
    const chineseState = createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 1 },
      'zh',
      stableRandomValue,
    );
    const englishFields = englishState.planets[0]?.fields;
    const chineseFields = chineseState.planets[0]?.fields;

    expect(englishFields).toEqual({
      environment: 'Hostile',
      atmosphere: 'Fairly thick',
      surfaceMap: 'No',
      dayHours: expect.any(String),
      gravity: expect.any(String),
      orbitYears: expect.any(String),
      moons: expect.any(String),
      axialTilt: expect.any(String),
    });
    expect(chineseFields).toEqual({
      environment: '恶劣',
      atmosphere: '较厚',
      surfaceMap: '否',
      dayHours: expect.any(String),
      gravity: expect.any(String),
      orbitYears: expect.any(String),
      moons: expect.any(String),
      axialTilt: expect.any(String),
    });
  });

  it('keeps an Earth atmosphere non-empty even when the injected random source always returns zero', () => {
    const state = createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 1 },
      'en',
      () => 0,
    );

    expect(state.planets[0]?.assetId).toBe('type-1-1');
    expect(state.planets[0]?.fields.atmosphere).toBe('Thick');
  });

  it('selects and edits a planet without changing the other planets', () => {
    const initialState = createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 2 },
      'en',
      stableRandomValue,
    );
    const selectedState = selectRandomPlanet(initialState, 'planet-1');
    const updatedState = updateRandomPlanetField(
      selectedState,
      'planet-1',
      'environment',
      'Custom environment',
    );

    expect(updatedState.selectedPlanetId).toBe('planet-1');
    expect(updatedState.planets[0]?.fields.environment).toBe('Custom environment');
    expect(updatedState.planets[1]).toEqual(initialState.planets[1]);
    expect(selectRandomPlanet(updatedState, null).selectedPlanetId).toBeNull();
  });

  it('rejects random states with a star asset planet or more than ten planets', () => {
    const scene = createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 1 },
      'en',
      stableRandomValue,
    );
    const sourcePlanet = scene.planets[0];
    if (sourcePlanet === undefined) {
      throw new Error('The boundary test requires one generated planet.');
    }

    expect(() => assertRandomSolarSystem({
      ...scene,
      planets: [{ ...sourcePlanet, assetId: 'star-1' }],
    })).toThrow('star-1');

    const tooManyPlanets = Array.from({ length: 11 }, (_, planetIndex) => ({
      ...sourcePlanet,
      id: `planet-${planetIndex + 1}`,
    }));
    expect(() => assertRandomSolarSystem({
      ...scene,
      planets: tooManyPlanets,
    })).toThrow('length=11');
  });

  it('rejects invalid generation options, random sources, fields, and ids', () => {
    expect(() => createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 11 },
      'en',
      stableRandomValue,
    )).toThrow('Received 11');
    expect(() => createRandomSolarSystem(
      { starRange: 'unknown' as 'normal', requestedPlanetCount: 1 },
      'en',
      stableRandomValue,
    )).toThrow('Received "unknown"');
    expect(() => createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 1 },
      'fr' as 'en',
      stableRandomValue,
    )).toThrow('Received "fr"');
    expect(() => createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 1 },
      'en',
      () => 1,
    )).toThrow('Received 1');

    const state = createRandomSolarSystem(
      { starRange: 'normal', requestedPlanetCount: 1 },
      'en',
      stableRandomValue,
    );
    expect(() => selectRandomPlanet(state, 'missing')).toThrow('not found');
    expect(() => updateRandomPlanetField(
      state,
      'planet-1',
      'unknown' as 'environment',
      'value',
    )).toThrow('invalid');
    expect(() => assertRandomSolarSystem({ ...state, selectedPlanetId: 'missing' })).toThrow(
      'not found',
    );
  });
});
