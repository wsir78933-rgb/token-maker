import {
  SOLAR_ASSET_COUNT_PER_CATEGORY,
  SOLAR_CANVAS_HEIGHT,
  SOLAR_CANVAS_WIDTH,
  SOLAR_FIXED_MAX_PLANETS,
  SOLAR_RANDOM_MAX_PLANETS,
  SOLAR_RANDOM_MIN_PLANETS,
  SOLAR_STAR_WIDTH,
  type RandomSolarPlanet,
  type RandomSolarSystem,
  type SolarPlanetField,
  type SolarPlanetFields,
  type SolarPlanetTransform,
  type SolarRandomOptions,
  type SolarStarRange,
  type SolarSystemLocale,
} from './types';

type SolarPlanetCategoryName = 'type-1' | 'type-2' | 'type-3' | 'type-4' | 'type-5';

const SOLAR_PLANET_FIELDS: readonly SolarPlanetField[] = [
  'environment',
  'atmosphere',
  'surfaceMap',
  'dayHours',
  'gravity',
  'orbitYears',
  'moons',
  'axialTilt',
];

const ENGLISH_ATMOSPHERES = [
  'None',
  'Thick',
  'Thin',
  'Unknown',
  'Fairly thick',
  'Fairly thin',
  'Very thick',
  'Very thin',
] as const;

const CHINESE_ATMOSPHERES = [
  '无',
  '厚',
  '薄',
  '未知',
  '较厚',
  '较薄',
  '很厚',
  '很薄',
] as const;

const ENGLISH_ENVIRONMENTS = [
  'Hospitable',
  'Gentle',
  'Moderate',
  'Fairly gentle',
  'Fairly hospitable',
  'Unknown',
  'Quite hostile',
  'Hostile',
  'Very hostile',
  'Dangerous',
  'Very dangerous',
  'Deadly',
  'Unsafe',
  'Treacherous',
  'Unstable',
] as const;

const CHINESE_ENVIRONMENTS = [
  '宜居',
  '温和',
  '中等',
  '较温和',
  '较宜居',
  '未知',
  '相当恶劣',
  '恶劣',
  '非常恶劣',
  '危险',
  '非常危险',
  '致命',
  '不安全',
  '险恶',
  '不稳定',
] as const;

const ENGLISH_SURFACE_MAPS = ['Yes', 'No', 'Outdated version'] as const;
const CHINESE_SURFACE_MAPS = ['是', '否', '旧版'] as const;

const SOLAR_RANDOM_PLANET_MIN_SIZE = 20;
const SOLAR_RANDOM_PLANET_MIN_GAP = 1;
const SOLAR_LAYOUT_FLOATING_POINT_TOLERANCE = 1e-9;
const SOLAR_RANDOM_STATE_MIN_PLANETS = 1;

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
  } catch (caught: unknown) {
    if (caught instanceof TypeError) {
      return `${Object.prototype.toString.call(receivedValue)} (JSON.stringify failed)`;
    }

    throw caught;
  }
}

function isPlainObject(receivedValue: unknown): receivedValue is Record<string, unknown> {
  return receivedValue !== null && typeof receivedValue === 'object' && !Array.isArray(receivedValue);
}

function requireString(receivedValue: unknown, fieldName: string): string {
  if (typeof receivedValue !== 'string') {
    throw new Error(
      `${fieldName} must be a string. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function requireRandomValue(randomValue: () => number): number {
  if (typeof randomValue !== 'function') {
    throw new Error(
      `Solar random value source must be a function. Received ${describeReceivedValue(randomValue)}.`,
    );
  }

  const receivedRandomValue = randomValue();
  if (
    typeof receivedRandomValue !== 'number' ||
    !Number.isFinite(receivedRandomValue) ||
    receivedRandomValue < 0 ||
    receivedRandomValue >= 1
  ) {
    throw new Error(
      `Solar random value source must return a finite number from 0 inclusive to 1 exclusive. Received ${describeReceivedValue(receivedRandomValue)}.`,
    );
  }

  return receivedRandomValue;
}

function randomInteger(randomValue: () => number, exclusiveLimit: number): number {
  return Math.floor(requireRandomValue(randomValue) * exclusiveLimit);
}

function requireLocale(locale: unknown): SolarSystemLocale {
  if (locale !== 'en' && locale !== 'zh') {
    throw new Error(
      `Solar system locale must be en or zh. Received ${describeReceivedValue(locale)}.`,
    );
  }

  return locale;
}

function requireStarRange(starRange: unknown): SolarStarRange {
  if (starRange !== 'normal' && starRange !== 'include-blue' && starRange !== 'only-blue') {
    throw new Error(
      `Solar star range must be normal, include-blue, or only-blue. Received ${describeReceivedValue(starRange)}.`,
    );
  }

  return starRange;
}

function requirePlanetCount(requestedPlanetCount: unknown): number | null {
  if (requestedPlanetCount === null) return null;
  if (
    typeof requestedPlanetCount !== 'number' ||
    !Number.isInteger(requestedPlanetCount) ||
    requestedPlanetCount < 0 ||
    requestedPlanetCount > SOLAR_FIXED_MAX_PLANETS
  ) {
    throw new Error(
      `Solar requested planet count must be null or an integer from 0 to ${SOLAR_FIXED_MAX_PLANETS}. Received ${describeReceivedValue(requestedPlanetCount)}.`,
    );
  }

  return requestedPlanetCount;
}

function requireRandomOptions(options: SolarRandomOptions): SolarRandomOptions {
  if (!isPlainObject(options)) {
    throw new Error(
      `Solar random options must be an object. Received ${describeReceivedValue(options)}.`,
    );
  }

  return {
    starRange: requireStarRange(options.starRange),
    requestedPlanetCount: requirePlanetCount(options.requestedPlanetCount),
  };
}

function requirePlanetField(field: unknown): SolarPlanetField {
  if (!SOLAR_PLANET_FIELDS.includes(field as SolarPlanetField)) {
    throw new Error(
      `Solar planet field is invalid. Received ${describeReceivedValue(field)}.`,
    );
  }

  return field as SolarPlanetField;
}

function requireAssetId(assetId: unknown, label: string): string {
  const validAssetId = requireString(assetId, label);
  if (!/^(star|type-[1-5])-([1-9]|[1-3][0-9]|40)$/.test(validAssetId)) {
    throw new Error(
      `${label} must use the solar asset id format. Received ${JSON.stringify(validAssetId)}.`,
    );
  }

  return validAssetId;
}

function requirePlanetAssetId(assetId: unknown, label: string): string {
  const validAssetId = requireAssetId(assetId, label);
  if (validAssetId.startsWith('star-')) {
    throw new Error(
      `${label} must use a planet category. Received ${JSON.stringify(validAssetId)}.`,
    );
  }

  return validAssetId;
}

function requirePlanetId(planetId: unknown): string {
  const validPlanetId = requireString(planetId, 'Random planet id');
  if (validPlanetId.length === 0) {
    throw new Error(
      `Random planet id must not be empty. Received ${JSON.stringify(validPlanetId)}.`,
    );
  }

  return validPlanetId;
}

function requireFiniteNumber(receivedValue: unknown, fieldName: string): number {
  if (typeof receivedValue !== 'number' || !Number.isFinite(receivedValue)) {
    throw new Error(
      `${fieldName} must be a finite number. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function requirePlanetTransform(receivedPlanet: Record<string, unknown>, planetIndex: number): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const x = requireFiniteNumber(receivedPlanet.x, `Random planet ${planetIndex + 1} x`);
  const y = requireFiniteNumber(receivedPlanet.y, `Random planet ${planetIndex + 1} y`);
  const width = requireFiniteNumber(receivedPlanet.width, `Random planet ${planetIndex + 1} width`);
  const height = requireFiniteNumber(receivedPlanet.height, `Random planet ${planetIndex + 1} height`);
  if (width <= 0 || height <= 0) {
    throw new Error(
      `Random planet ${planetIndex + 1} width and height must be greater than 0. Received width=${width}, height=${height}.`,
    );
  }
  if (x < 0 || y < 0 || x + width > SOLAR_CANVAS_WIDTH || y + height > SOLAR_CANVAS_HEIGHT) {
    throw new Error(
      `Random planet ${planetIndex + 1} must stay inside the ${SOLAR_CANVAS_WIDTH}×${SOLAR_CANVAS_HEIGHT} canvas. Received x=${x}, y=${y}, width=${width}, height=${height}.`,
    );
  }

  return { x, y, width, height };
}

function requirePlanetFields(receivedFields: unknown, planetIndex: number): SolarPlanetFields {
  if (!isPlainObject(receivedFields)) {
    throw new Error(
      `Random planet ${planetIndex + 1} fields must be an object. Received ${describeReceivedValue(receivedFields)}.`,
    );
  }

  const fields = {} as SolarPlanetFields;
  for (const field of SOLAR_PLANET_FIELDS) {
    fields[field] = requireString(
      receivedFields[field],
      `Random planet ${planetIndex + 1} ${field}`,
    );
  }

  return fields;
}

function requireRandomPlanet(receivedPlanet: unknown, planetIndex: number): RandomSolarPlanet {
  if (!isPlainObject(receivedPlanet)) {
    throw new Error(
      `Random planet ${planetIndex + 1} must be an object. Received ${describeReceivedValue(receivedPlanet)}.`,
    );
  }

  const id = requirePlanetId(receivedPlanet.id);
  const assetId = requirePlanetAssetId(
    receivedPlanet.assetId,
    `Random planet ${planetIndex + 1} asset id`,
  );
  const transform = requirePlanetTransform(receivedPlanet, planetIndex);
  const fields = requirePlanetFields(receivedPlanet.fields, planetIndex);
  return { id, assetId, ...transform, fields };
}

function requireRandomSolarSystem(receivedState: unknown): RandomSolarSystem {
  if (!isPlainObject(receivedState)) {
    throw new Error(
      `Random solar system must be an object. Received ${describeReceivedValue(receivedState)}.`,
    );
  }

  const starAssetId = requireAssetId(receivedState.starAssetId, 'Random star asset id');
  if (!starAssetId.startsWith('star-')) {
    throw new Error(
      `Random star asset id must use the star category. Received ${JSON.stringify(starAssetId)}.`,
    );
  }
  if (!Array.isArray(receivedState.planets)) {
    throw new Error(
      `Random solar planets must be an array. Received ${describeReceivedValue(receivedState.planets)}.`,
    );
  }
  if (
    receivedState.planets.length < SOLAR_RANDOM_STATE_MIN_PLANETS ||
    receivedState.planets.length > SOLAR_FIXED_MAX_PLANETS
  ) {
    throw new Error(
      `Random solar planets length must be from ${SOLAR_RANDOM_STATE_MIN_PLANETS} to ${SOLAR_FIXED_MAX_PLANETS}. Received length=${receivedState.planets.length}.`,
    );
  }

  const planetIds = new Set<string>();
  const planets = receivedState.planets.map((receivedPlanet, planetIndex) => {
    const planet = requireRandomPlanet(receivedPlanet, planetIndex);
    if (planetIds.has(planet.id)) {
      throw new Error(`Random planet id must be unique. Received duplicate ${JSON.stringify(planet.id)}.`);
    }
    planetIds.add(planet.id);
    return planet;
  });
  const selectedPlanetId = receivedState.selectedPlanetId === null
    ? null
    : requirePlanetId(receivedState.selectedPlanetId);
  if (selectedPlanetId !== null && !planetIds.has(selectedPlanetId)) {
    throw new Error(
      `Random selected planet id was not found. Received ${JSON.stringify(selectedPlanetId)}.`,
    );
  }

  return { starAssetId, planets, selectedPlanetId };
}

function cloneRandomPlanet(planet: RandomSolarPlanet): RandomSolarPlanet {
  return {
    id: planet.id,
    assetId: planet.assetId,
    x: planet.x,
    y: planet.y,
    width: planet.width,
    height: planet.height,
    fields: { ...planet.fields },
  };
}

function cloneRandomState(state: RandomSolarSystem): RandomSolarSystem {
  return {
    starAssetId: state.starAssetId,
    planets: state.planets.map(cloneRandomPlanet),
    selectedPlanetId: state.selectedPlanetId,
  };
}

function localizedValues(locale: SolarSystemLocale): {
  atmospheres: readonly string[];
  environments: readonly string[];
  surfaceMaps: readonly string[];
} {
  if (locale === 'zh') {
    return {
      atmospheres: CHINESE_ATMOSPHERES,
      environments: CHINESE_ENVIRONMENTS,
      surfaceMaps: CHINESE_SURFACE_MAPS,
    };
  }

  return {
    atmospheres: ENGLISH_ATMOSPHERES,
    environments: ENGLISH_ENVIRONMENTS,
    surfaceMaps: ENGLISH_SURFACE_MAPS,
  };
}

function randomPlanetCount(
  requestedPlanetCount: number | null,
  randomValue: () => number,
): number {
  if (requestedPlanetCount !== null && requestedPlanetCount > 0) {
    return requestedPlanetCount;
  }

  return randomInteger(randomValue, SOLAR_RANDOM_MAX_PLANETS - SOLAR_RANDOM_MIN_PLANETS + 1) + SOLAR_RANDOM_MIN_PLANETS;
}

function randomStarAssetId(starRange: SolarStarRange, randomValue: () => number): string {
  let firstIndex = 0;
  let availableCount = 30;
  if (starRange === 'include-blue') availableCount = SOLAR_ASSET_COUNT_PER_CATEGORY;
  if (starRange === 'only-blue') {
    firstIndex = 30;
    availableCount = 10;
  }

  return `star-${firstIndex + randomInteger(randomValue, availableCount) + 1}`;
}

function indexedPlanetAssetId(categoryName: SolarPlanetCategoryName, index: number): string {
  return `${categoryName}-${index + 1}`;
}

function createCombinedPlanetAssets(): string[] {
  const earthAssets = Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, index) => indexedPlanetAssetId('type-1', index));
  const layerAssets = Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, index) => indexedPlanetAssetId('type-5', index));
  const terrestrialAssets = Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, index) => indexedPlanetAssetId('type-4', index));
  const moonAssets = Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, index) => indexedPlanetAssetId('type-3', index));
  const gasAssets = Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, index) => indexedPlanetAssetId('type-2', index));
  return [...earthAssets, ...layerAssets, ...layerAssets, ...terrestrialAssets, ...moonAssets, ...gasAssets];
}

function createNonEarthPlanetAssets(): string[] {
  const layerAssets = Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, index) => indexedPlanetAssetId('type-5', index));
  const terrestrialAssets = Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, index) => indexedPlanetAssetId('type-4', index));
  const moonAssets = Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, index) => indexedPlanetAssetId('type-3', index));
  const gasAssets = Array.from({ length: SOLAR_ASSET_COUNT_PER_CATEGORY }, (_, index) => indexedPlanetAssetId('type-2', index));
  return [...layerAssets, ...layerAssets, ...terrestrialAssets, ...moonAssets, ...gasAssets];
}

function choosePlanetAsset(
  availablePlanetAssets: string[],
  randomValue: () => number,
): string {
  const selectedIndex = randomInteger(randomValue, availablePlanetAssets.length);
  const selectedAssetId = availablePlanetAssets[selectedIndex];
  if (selectedAssetId === undefined) {
    throw new Error(
      `Solar random planet asset selection returned an empty list. Received index=${selectedIndex}, count=${availablePlanetAssets.length}.`,
    );
  }

  availablePlanetAssets.splice(selectedIndex, 1);
  return selectedAssetId;
}

function choosePlanetAssetForPosition(
  positionIndex: number,
  hasEarthPlanet: boolean,
  combinedPlanetAssets: string[],
  nonEarthPlanetAssets: readonly string[],
  randomValue: () => number,
): { assetId: string; hasEarthPlanet: boolean } {
  if (positionIndex >= 6) {
    const assetId = nonEarthPlanetAssets[randomInteger(randomValue, nonEarthPlanetAssets.length)];
    if (assetId === undefined) {
      throw new Error(
        `Solar non-Earth planet asset selection returned an empty list. Received count=${nonEarthPlanetAssets.length}.`,
      );
    }
    return { assetId, hasEarthPlanet };
  }

  if (hasEarthPlanet) {
    const nonEarthIndex = randomInteger(randomValue, nonEarthPlanetAssets.length);
    const assetId = nonEarthPlanetAssets[nonEarthIndex];
    if (assetId === undefined) {
      throw new Error(
        `Solar non-Earth planet asset selection returned an empty list. Received index=${nonEarthIndex}, count=${nonEarthPlanetAssets.length}.`,
      );
    }
    return { assetId, hasEarthPlanet };
  }

  const selectedAssetId = choosePlanetAsset(combinedPlanetAssets, randomValue);
  return {
    assetId: selectedAssetId,
    hasEarthPlanet: selectedAssetId.startsWith('type-1-'),
  };
}

function randomDecimal(randomValue: () => number, minimum: number, span: number, decimals: number): string {
  return (requireRandomValue(randomValue) * span + minimum).toFixed(decimals);
}

function createPlanetFields(
  assetId: string,
  locale: SolarSystemLocale,
  randomValue: () => number,
): SolarPlanetFields {
  const values = localizedValues(locale);
  const environmentValue = values.environments[randomInteger(randomValue, values.environments.length)];
  let atmosphereIndex = randomInteger(randomValue, values.atmospheres.length);
  const surfaceMapValue = values.surfaceMaps[randomInteger(randomValue, values.surfaceMaps.length)];
  if (environmentValue === undefined || surfaceMapValue === undefined) {
    throw new Error(
      `Solar localized random value list returned undefined. Received environmentIndex or surfaceMapIndex.`,
    );
  }

  const isEarthPlanet = assetId.startsWith('type-1-');
  if (isEarthPlanet && atmosphereIndex === 0) {
    atmosphereIndex = randomInteger(randomValue, values.atmospheres.length - 1) + 1;
  }
  const atmosphereValue = values.atmospheres[atmosphereIndex];
  if (atmosphereValue === undefined) {
    throw new Error(
      `Solar localized atmosphere list returned undefined. Received atmosphereIndex=${atmosphereIndex}.`,
    );
  }

  const dayType = randomInteger(randomValue, 2);
  const dayHours = isEarthPlanet || dayType === 1
    ? String(randomInteger(randomValue, 43) + 8)
    : String(randomInteger(randomValue, 4001) + 2000);
  const gravity = randomDecimal(randomValue, 0.2, 4.8, 2);
  const orbitType = randomInteger(randomValue, 2);
  const orbitYears = isEarthPlanet || orbitType === 1
    ? randomDecimal(randomValue, 0.2, 2.8, 2)
    : String(randomInteger(randomValue, 191) + 10);
  const moons = isEarthPlanet
    ? String(randomInteger(randomValue, 5))
    : String(randomInteger(randomValue, 60));
  const axialTilt = randomDecimal(randomValue, 0, 180, 2);

  return {
    environment: environmentValue,
    atmosphere: atmosphereValue,
    surfaceMap: surfaceMapValue,
    dayHours,
    gravity,
    orbitYears,
    moons,
    axialTilt,
  };
}

function sumFiniteNumbers(values: readonly number[], fieldName: string): number {
  let total = 0;
  for (const value of values) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(
        `${fieldName} must contain only finite numbers. Received ${describeReceivedValue(value)}.`,
      );
    }
    total += value;
  }
  return total;
}

function rescaleRandomPlanetSizes(
  randomPlanetSizes: readonly number[],
  widthBudget: number,
): number[] {
  const minimumWidthTotal = randomPlanetSizes.length * SOLAR_RANDOM_PLANET_MIN_SIZE;
  const randomWidthTotal = sumFiniteNumbers(randomPlanetSizes, 'Random planet sizes');
  if (randomWidthTotal <= widthBudget) return [...randomPlanetSizes];

  const availableExtraWidth = Math.max(widthBudget - minimumWidthTotal, 0);
  const randomExtraWidth = randomWidthTotal - minimumWidthTotal;
  const extraWidthScale = randomExtraWidth === 0 ? 0 : availableExtraWidth / randomExtraWidth;

  return randomPlanetSizes.map(
    (randomPlanetSize) => SOLAR_RANDOM_PLANET_MIN_SIZE +
      (randomPlanetSize - SOLAR_RANDOM_PLANET_MIN_SIZE) * extraWidthScale,
  );
}

function distributeRandomPlanetGaps(
  randomPlanetSizes: readonly number[],
  randomGapWeights: readonly number[],
  availableWidth: number,
): number[] {
  const gapCount = Math.max(randomPlanetSizes.length - 1, 0);
  if (gapCount === 0) return [];

  const minimumGapTotal = gapCount * SOLAR_RANDOM_PLANET_MIN_GAP;
  const sizeTotal = sumFiniteNumbers(randomPlanetSizes, 'Laid out random planet sizes');
  const remainingGapWidth = Math.max(availableWidth - sizeTotal, minimumGapTotal);
  const effectiveGapWeights = randomGapWeights.slice(0, gapCount);
  const gapWeightTotal = sumFiniteNumbers(effectiveGapWeights, 'Random planet gap weights');
  if (gapWeightTotal <= 0) {
    throw new Error(
      `Random planet gap weights must total more than 0. Received ${gapWeightTotal}.`,
    );
  }

  const extraGapWidth = remainingGapWidth - minimumGapTotal;
  return effectiveGapWeights.map(
    (randomGapWeight) => SOLAR_RANDOM_PLANET_MIN_GAP +
      (extraGapWidth * randomGapWeight) / gapWeightTotal,
  );
}

function layoutRandomPlanetTransforms(
  randomPlanetSizes: readonly number[],
  randomGapWeights: readonly number[],
): SolarPlanetTransform[] {
  if (randomPlanetSizes.length !== randomGapWeights.length) {
    throw new Error(
      `Random planet sizes and gap weights must have the same length. Received sizes=${randomPlanetSizes.length}, gaps=${randomGapWeights.length}.`,
    );
  }

  if (randomPlanetSizes.length === 0) return [];

  const availableStartX = SOLAR_STAR_WIDTH;
  const availableWidth = SOLAR_CANVAS_WIDTH - availableStartX;
  const minimumGapTotal = Math.max(randomPlanetSizes.length - 1, 0) * SOLAR_RANDOM_PLANET_MIN_GAP;
  const widthBudget = availableWidth - minimumGapTotal;
  const laidOutSizes = rescaleRandomPlanetSizes(randomPlanetSizes, widthBudget);
  const laidOutGaps = distributeRandomPlanetGaps(laidOutSizes, randomGapWeights, availableWidth);
  const transforms: SolarPlanetTransform[] = [];
  let nextX = availableStartX;
  let previousRightEdge = availableStartX;

  for (let planetIndex = 0; planetIndex < laidOutSizes.length; planetIndex += 1) {
    const planetSize = laidOutSizes[planetIndex];
    if (planetSize === undefined) {
      throw new Error(`Random planet layout size is missing at index ${planetIndex}.`);
    }

    const lastAllowedX = SOLAR_CANVAS_WIDTH - planetSize;
    let x = nextX;
    if (x > lastAllowedX) {
      const overflowWidth = x - lastAllowedX;
      if (
        planetIndex !== laidOutSizes.length - 1 ||
        overflowWidth > SOLAR_LAYOUT_FLOATING_POINT_TOLERANCE
      ) {
        throw new Error(
          `Random planet layout position exceeds the available canvas region. Received x=${nextX}, width=${planetSize}, regionStart=${availableStartX}, canvas=${SOLAR_CANVAS_WIDTH}.`,
        );
      }
      x = lastAllowedX;
    }
    if (x < previousRightEdge) {
      throw new Error(
        `Random planet layout overlaps the previous planet. Received x=${x}, previousRight=${previousRightEdge}, width=${planetSize}.`,
      );
    }
    const y = (SOLAR_CANVAS_HEIGHT - planetSize) / 2;
    transforms.push({ x, y, width: planetSize, height: planetSize });
    previousRightEdge = x + planetSize;

    const gapAfterPlanet = laidOutGaps[planetIndex];
    nextX = x + planetSize + (gapAfterPlanet ?? 0);
  }

  const lastTransform = transforms.at(-1);
  if (
    lastTransform !== undefined &&
    lastTransform.x + lastTransform.width > SOLAR_CANVAS_WIDTH
  ) {
    throw new Error(
      `Random planet layout exceeds the canvas width. Received right=${lastTransform.x + lastTransform.width}, canvas=${SOLAR_CANVAS_WIDTH}.`,
    );
  }

  return transforms;
}

function clonePlanetFields(fields: SolarPlanetFields): SolarPlanetFields {
  return { ...fields };
}

export function createRandomSolarSystem(
  options: SolarRandomOptions,
  locale: SolarSystemLocale,
  randomValue: () => number = Math.random,
): RandomSolarSystem {
  const validOptions = requireRandomOptions(options);
  const validLocale = requireLocale(locale);
  if (typeof randomValue !== 'function') {
    throw new Error(
      `Solar random value source must be a function. Received ${describeReceivedValue(randomValue)}.`,
    );
  }

  const planetCount = randomPlanetCount(validOptions.requestedPlanetCount, randomValue);
  const starAssetId = randomStarAssetId(validOptions.starRange, randomValue);
  const combinedPlanetAssets = createCombinedPlanetAssets();
  const nonEarthPlanetAssets = createNonEarthPlanetAssets();
  const randomPlanetDrafts: Array<{
    assetId: string;
    planetSize: number;
    gapWeight: number;
    fields: SolarPlanetFields;
  }> = [];
  let hasEarthPlanet = false;

  for (let positionIndex = 0; positionIndex < planetCount; positionIndex += 1) {
    const gapWeight = requireRandomValue(randomValue) * 5.4 + 1;
    const selectedPlanet = choosePlanetAssetForPosition(
      positionIndex,
      hasEarthPlanet,
      combinedPlanetAssets,
      nonEarthPlanetAssets,
      randomValue,
    );
    hasEarthPlanet = selectedPlanet.hasEarthPlanet;
    const planetSize = requireRandomValue(randomValue) * 51 + 20;
    randomPlanetDrafts.push({
      assetId: selectedPlanet.assetId,
      planetSize,
      gapWeight,
      fields: createPlanetFields(selectedPlanet.assetId, validLocale, randomValue),
    });
  }

  const transforms = layoutRandomPlanetTransforms(
    randomPlanetDrafts.map((planetDraft) => planetDraft.planetSize),
    randomPlanetDrafts.map((planetDraft) => planetDraft.gapWeight),
  );
  const planets: RandomSolarPlanet[] = randomPlanetDrafts.map((planetDraft, planetIndex) => {
    const transform = transforms[planetIndex];
    if (transform === undefined) {
      throw new Error(`Random planet layout transform is missing at index ${planetIndex}.`);
    }

    return {
      id: `planet-${planetIndex + 1}`,
      assetId: planetDraft.assetId,
      ...transform,
      fields: planetDraft.fields,
    };
  });

  return {
    starAssetId,
    planets,
    selectedPlanetId: null,
  };
}

export function selectRandomPlanet(
  state: RandomSolarSystem,
  planetId: string | null,
): RandomSolarSystem {
  const currentState = requireRandomSolarSystem(state);
  if (planetId === null) {
    return { ...cloneRandomState(currentState), selectedPlanetId: null };
  }
  const validPlanetId = requirePlanetId(planetId);
  if (!currentState.planets.some((planet) => planet.id === validPlanetId)) {
    throw new Error(
      `Random planet id was not found. Received ${JSON.stringify(validPlanetId)}.`,
    );
  }

  return { ...cloneRandomState(currentState), selectedPlanetId: validPlanetId };
}

export function updateRandomPlanetField(
  state: RandomSolarSystem,
  planetId: string,
  field: SolarPlanetField,
  value: string,
): RandomSolarSystem {
  const currentState = requireRandomSolarSystem(state);
  const validPlanetId = requirePlanetId(planetId);
  const validField = requirePlanetField(field);
  const validValue = requireString(value, `Random planet ${validField}`);
  if (!currentState.planets.some((planet) => planet.id === validPlanetId)) {
    throw new Error(
      `Random planet id was not found. Received ${JSON.stringify(validPlanetId)}.`,
    );
  }

  return {
    ...cloneRandomState(currentState),
    planets: currentState.planets.map((planet) =>
      planet.id === validPlanetId
        ? { ...cloneRandomPlanet(planet), fields: { ...clonePlanetFields(planet.fields), [validField]: validValue } }
        : cloneRandomPlanet(planet),
    ),
  };
}

export function assertRandomSolarSystem(
  receivedState: unknown,
): asserts receivedState is RandomSolarSystem {
  requireRandomSolarSystem(receivedState);
}
