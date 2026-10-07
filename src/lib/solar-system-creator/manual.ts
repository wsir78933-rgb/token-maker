import {
  SOLAR_ASSET_COUNT_PER_CATEGORY,
  SOLAR_CANVAS_HEIGHT,
  SOLAR_CANVAS_WIDTH,
  SOLAR_DEFAULT_PLANET_HEIGHT,
  SOLAR_DEFAULT_PLANET_WIDTH,
  type ManualSolarPlanet,
  type ManualSolarSystem,
  type SolarAssetCategory,
  type SolarPlanetTransform,
  type SolarSaveSnapshot,
} from './types';

const SOLAR_PLANET_CATEGORIES: readonly SolarAssetCategory[] = [
  'type-1',
  'type-2',
  'type-3',
  'type-4',
  'type-5',
];

const SOLAR_STAR_CATEGORY = 'star' as const;

function describeReceivedValue(receivedValue: unknown): string {
  if (typeof receivedValue === 'string') return JSON.stringify(receivedValue);
  if (receivedValue === undefined) return 'undefined';
  if (receivedValue === null) return 'null';
  if (
    typeof receivedValue === 'number' ||
    typeof receivedValue === 'boolean' ||
    typeof receivedValue === 'bigint'
  ) {
    return String(receivedValue);
  }

  try {
    const serializedValue = JSON.stringify(receivedValue);
    return serializedValue === undefined ? String(receivedValue) : serializedValue;
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      return `${Object.prototype.toString.call(receivedValue)} (JSON.stringify failed)`;
    }

    throw error;
  }
}

function isPlainObject(receivedValue: unknown): receivedValue is Record<string, unknown> {
  return receivedValue !== null && typeof receivedValue === 'object' && !Array.isArray(receivedValue);
}

function requireNonEmptyString(receivedValue: unknown, fieldName: string): string {
  if (typeof receivedValue !== 'string' || receivedValue.length === 0) {
    throw new Error(
      `${fieldName} must be a non-empty string. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function requireString(receivedValue: unknown, fieldName: string): string {
  if (typeof receivedValue !== 'string') {
    throw new Error(
      `${fieldName} must be a string. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function requireBoolean(receivedValue: unknown, fieldName: string): boolean {
  if (typeof receivedValue !== 'boolean') {
    throw new Error(
      `${fieldName} must be a boolean. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function requireFiniteNumber(receivedValue: unknown, fieldName: string): number {
  if (typeof receivedValue !== 'number' || !Number.isFinite(receivedValue)) {
    throw new Error(
      `${fieldName} must be a finite number. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function parseSolarAssetId(assetId: unknown): {
  category: SolarAssetCategory;
  index: number;
} {
  const validAssetId = requireNonEmptyString(assetId, 'Solar asset id');
  const match = /^(star|type-[1-5])-([1-9]|[1-3][0-9]|40)$/.exec(validAssetId);
  if (match === null) {
    throw new Error(
      `Solar asset id must use star-1..40 or type-1-1..type-5-40. Received ${JSON.stringify(validAssetId)}.`,
    );
  }

  const category = match[1] as SolarAssetCategory;
  const index = Number(match[2]);
  if (index < 1 || index > SOLAR_ASSET_COUNT_PER_CATEGORY) {
    throw new Error(
      `Solar asset index must be from 1 to ${SOLAR_ASSET_COUNT_PER_CATEGORY}. Received ${index}.`,
    );
  }

  return { category, index };
}

function requireStarAssetId(assetId: unknown): string {
  const validAssetId = requireNonEmptyString(assetId, 'Solar star asset id');
  const parsedAsset = parseSolarAssetId(validAssetId);
  if (parsedAsset.category !== SOLAR_STAR_CATEGORY) {
    throw new Error(
      `Solar star asset id must use the star category. Received ${JSON.stringify(validAssetId)}.`,
    );
  }

  return validAssetId;
}

function requirePlanetAssetId(assetId: unknown): string {
  const validAssetId = requireNonEmptyString(assetId, 'Solar planet asset id');
  const parsedAsset = parseSolarAssetId(validAssetId);
  if (!SOLAR_PLANET_CATEGORIES.includes(parsedAsset.category)) {
    throw new Error(
      `Solar planet asset id must use type-1 through type-5. Received ${JSON.stringify(validAssetId)}.`,
    );
  }

  return validAssetId;
}

function requirePlanetTransform(
  receivedTransform: unknown,
  fieldName: string,
): SolarPlanetTransform {
  if (!isPlainObject(receivedTransform)) {
    throw new Error(
      `${fieldName} must be an object with x, y, width, and height. Received ${describeReceivedValue(receivedTransform)}.`,
    );
  }

  const x = requireFiniteNumber(receivedTransform.x, `${fieldName}.x`);
  const y = requireFiniteNumber(receivedTransform.y, `${fieldName}.y`);
  const width = requireFiniteNumber(receivedTransform.width, `${fieldName}.width`);
  const height = requireFiniteNumber(receivedTransform.height, `${fieldName}.height`);

  if (width <= 0 || height <= 0) {
    throw new Error(
      `${fieldName} width and height must be greater than 0. Received width=${width}, height=${height}.`,
    );
  }

  if (Math.abs(width - height) > Number.EPSILON) {
    throw new Error(
      `${fieldName} must preserve the square aspect ratio. Received width=${width}, height=${height}.`,
    );
  }

  if (x < 0 || y < 0 || x + width > SOLAR_CANVAS_WIDTH || y + height > SOLAR_CANVAS_HEIGHT) {
    throw new Error(
      `${fieldName} must stay inside the ${SOLAR_CANVAS_WIDTH}×${SOLAR_CANVAS_HEIGHT} canvas. Received x=${x}, y=${y}, width=${width}, height=${height}.`,
    );
  }

  return { x, y, width, height };
}

function cloneManualPlanet(planet: ManualSolarPlanet): ManualSolarPlanet {
  return {
    id: planet.id,
    assetId: planet.assetId,
    x: planet.x,
    y: planet.y,
    width: planet.width,
    height: planet.height,
    description: planet.description,
  };
}

function cloneManualPlanets(planets: readonly ManualSolarPlanet[]): ManualSolarPlanet[] {
  return planets.map(cloneManualPlanet);
}

function requireManualPlanet(receivedPlanet: unknown, planetIndex: number): ManualSolarPlanet {
  if (!isPlainObject(receivedPlanet)) {
    throw new Error(
      `Manual solar planet ${planetIndex + 1} must be an object. Received ${describeReceivedValue(receivedPlanet)}.`,
    );
  }

  const planetId = requireNonEmptyString(
    receivedPlanet.id,
    `Manual solar planet ${planetIndex + 1} id`,
  );
  const assetId = requirePlanetAssetId(receivedPlanet.assetId);
  const transform = requirePlanetTransform(
    receivedPlanet,
    `Manual solar planet ${planetIndex + 1}`,
  );
  const description = requireString(
    receivedPlanet.description,
    `Manual solar planet ${planetIndex + 1} description`,
  );

  return { id: planetId, assetId, ...transform, description };
}

function requireManualPlanets(receivedPlanets: unknown): ManualSolarPlanet[] {
  if (!Array.isArray(receivedPlanets)) {
    throw new Error(
      `Manual solar planets must be an array. Received ${describeReceivedValue(receivedPlanets)}.`,
    );
  }

  const planetIds = new Set<string>();
  return receivedPlanets.map((receivedPlanet, planetIndex) => {
    const planet = requireManualPlanet(receivedPlanet, planetIndex);
    if (planetIds.has(planet.id)) {
      throw new Error(
        `Manual solar planet id must be unique. Received duplicate ${JSON.stringify(planet.id)}.`,
      );
    }

    planetIds.add(planet.id);
    return planet;
  });
}

function requireManualSolarSystem(receivedState: unknown): ManualSolarSystem {
  if (!isPlainObject(receivedState)) {
    throw new Error(
      `Manual solar system must be an object. Received ${describeReceivedValue(receivedState)}.`,
    );
  }

  const starAssetId = receivedState.starAssetId === null
    ? null
    : requireStarAssetId(receivedState.starAssetId);
  const planets = requireManualPlanets(receivedState.planets);
  const selectedPlanetId = receivedState.selectedPlanetId === null
    ? null
    : requireNonEmptyString(receivedState.selectedPlanetId, 'Manual selected planet id');

  if (selectedPlanetId !== null && !planets.some((planet) => planet.id === selectedPlanetId)) {
    throw new Error(
      `Manual selected planet id was not found. Received ${JSON.stringify(selectedPlanetId)}.`,
    );
  }

  return {
    starAssetId,
    planets,
    selectedPlanetId,
    draggingEnabled: requireBoolean(receivedState.draggingEnabled, 'Manual dragging enabled'),
    resizingEnabled: requireBoolean(receivedState.resizingEnabled, 'Manual resizing enabled'),
  };
}

function requireSolarSaveSnapshot(receivedSnapshot: unknown): SolarSaveSnapshot {
  if (!isPlainObject(receivedSnapshot)) {
    throw new Error(
      `Solar save snapshot must be an object. Received ${describeReceivedValue(receivedSnapshot)}.`,
    );
  }

  return {
    starAssetId: receivedSnapshot.starAssetId === null
      ? null
      : requireStarAssetId(receivedSnapshot.starAssetId),
    planets: requireManualPlanets(receivedSnapshot.planets),
  };
}

function requirePlanetId(state: ManualSolarSystem, planetId: unknown): string {
  const validPlanetId = requireNonEmptyString(planetId, 'Manual planet id');
  if (!state.planets.some((planet) => planet.id === validPlanetId)) {
    throw new Error(
      `Manual planet id was not found. Received ${JSON.stringify(validPlanetId)}.`,
    );
  }

  return validPlanetId;
}

function cloneManualState(state: ManualSolarSystem): ManualSolarSystem {
  return {
    starAssetId: state.starAssetId,
    planets: cloneManualPlanets(state.planets),
    selectedPlanetId: state.selectedPlanetId,
    draggingEnabled: state.draggingEnabled,
    resizingEnabled: state.resizingEnabled,
  };
}

export function createManualSolarSystem(): ManualSolarSystem {
  return {
    starAssetId: 'star-1',
    planets: [],
    selectedPlanetId: null,
    draggingEnabled: true,
    resizingEnabled: true,
  };
}

export function setManualStar(
  state: ManualSolarSystem,
  assetId: string,
): ManualSolarSystem {
  const currentState = requireManualSolarSystem(state);
  const validAssetId = requireStarAssetId(assetId);
  return { ...cloneManualState(currentState), starAssetId: validAssetId };
}

export function addManualPlanet(
  state: ManualSolarSystem,
  assetId: string,
  planetId: string,
): ManualSolarSystem {
  const currentState = requireManualSolarSystem(state);
  const validAssetId = requirePlanetAssetId(assetId);
  const validPlanetId = requireNonEmptyString(planetId, 'Manual planet id');
  if (currentState.planets.some((planet) => planet.id === validPlanetId)) {
    throw new Error(
      `Manual planet id must be unique. Received duplicate ${JSON.stringify(validPlanetId)}.`,
    );
  }

  const newPlanet: ManualSolarPlanet = {
    id: validPlanetId,
    assetId: validAssetId,
    x: 0,
    y: 0,
    width: SOLAR_DEFAULT_PLANET_WIDTH,
    height: SOLAR_DEFAULT_PLANET_HEIGHT,
    description: '',
  };

  return {
    ...cloneManualState(currentState),
    planets: [...currentState.planets.map(cloneManualPlanet), newPlanet],
  };
}

export function toggleManualPlanetSelection(
  state: ManualSolarSystem,
  planetId: string,
): ManualSolarSystem {
  const currentState = requireManualSolarSystem(state);
  const validPlanetId = requirePlanetId(currentState, planetId);
  return {
    ...cloneManualState(currentState),
    selectedPlanetId: currentState.selectedPlanetId === validPlanetId ? null : validPlanetId,
  };
}

export function updateManualPlanetDescription(
  state: ManualSolarSystem,
  planetId: string,
  description: string,
): ManualSolarSystem {
  const currentState = requireManualSolarSystem(state);
  const validPlanetId = requirePlanetId(currentState, planetId);
  const validDescription = requireString(description, 'Manual planet description');

  return {
    ...cloneManualState(currentState),
    planets: currentState.planets.map((planet) =>
      planet.id === validPlanetId ? { ...cloneManualPlanet(planet), description: validDescription } : cloneManualPlanet(planet),
    ),
  };
}

export function updateManualPlanetTransform(
  state: ManualSolarSystem,
  planetId: string,
  transform: SolarPlanetTransform,
): ManualSolarSystem {
  const currentState = requireManualSolarSystem(state);
  const validPlanetId = requirePlanetId(currentState, planetId);
  const validTransform = requirePlanetTransform(transform, 'Manual planet transform');

  return {
    ...cloneManualState(currentState),
    planets: currentState.planets.map((planet) =>
      planet.id === validPlanetId
        ? { ...cloneManualPlanet(planet), ...validTransform }
        : cloneManualPlanet(planet),
    ),
  };
}

export function setManualDraggingEnabled(
  state: ManualSolarSystem,
  enabled: boolean,
): ManualSolarSystem {
  const currentState = requireManualSolarSystem(state);
  const validEnabled = requireBoolean(enabled, 'Manual dragging enabled');
  return { ...cloneManualState(currentState), draggingEnabled: validEnabled };
}

export function setManualResizingEnabled(
  state: ManualSolarSystem,
  enabled: boolean,
): ManualSolarSystem {
  const currentState = requireManualSolarSystem(state);
  const validEnabled = requireBoolean(enabled, 'Manual resizing enabled');
  return { ...cloneManualState(currentState), resizingEnabled: validEnabled };
}

export function deleteSelectedManualPlanet(state: ManualSolarSystem): ManualSolarSystem {
  const currentState = requireManualSolarSystem(state);
  if (currentState.selectedPlanetId === null) return cloneManualState(currentState);

  return {
    ...cloneManualState(currentState),
    planets: currentState.planets
      .filter((planet) => planet.id !== currentState.selectedPlanetId)
      .map(cloneManualPlanet),
    selectedPlanetId: null,
  };
}

export function clearManualPlanets(state: ManualSolarSystem): ManualSolarSystem {
  const currentState = requireManualSolarSystem(state);
  return { ...cloneManualState(currentState), planets: [], selectedPlanetId: null };
}

export function createSolarSaveSnapshot(state: ManualSolarSystem): SolarSaveSnapshot {
  const currentState = requireManualSolarSystem(state);
  return {
    starAssetId: currentState.starAssetId,
    planets: cloneManualPlanets(currentState.planets),
  };
}

export function restoreManualSolarSystem(snapshot: SolarSaveSnapshot): ManualSolarSystem {
  const validSnapshot = requireSolarSaveSnapshot(snapshot);
  return {
    starAssetId: validSnapshot.starAssetId,
    planets: cloneManualPlanets(validSnapshot.planets),
    selectedPlanetId: null,
    draggingEnabled: true,
    resizingEnabled: true,
  };
}

export function assertManualSolarSystem(
  receivedState: unknown,
): asserts receivedState is ManualSolarSystem {
  requireManualSolarSystem(receivedState);
}

export function assertSolarSaveSnapshot(
  receivedSnapshot: unknown,
): asserts receivedSnapshot is SolarSaveSnapshot {
  requireSolarSaveSnapshot(receivedSnapshot);
}
