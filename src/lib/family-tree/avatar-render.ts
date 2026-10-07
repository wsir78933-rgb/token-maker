import {
  FAMILY_TREE_AVATAR_ASSET_ROOT,
  getFamilyTreeAvatarChoice,
  type FamilyTreeAvatarChoice,
} from '@/lib/family-tree/catalog';
import { requireFamilyTreeAvatar, type FamilyTreeAvatar } from '@/lib/family-tree/avatar';

export const FAMILY_TREE_AVATAR_WIDTH = 250;
export const FAMILY_TREE_AVATAR_HEIGHT = 250;

export type FamilyTreeAvatarLayer = {
  readonly id: string;
  readonly src: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly opacity?: number;
};

const EAR_FILE_PREFIX_BY_CHOICE_ID: Readonly<Record<string, string>> = {
  ears1: 'earHuman',
  ears2: 'earElf',
  ears3: 'earDwarf',
  ears4: 'earHalfling',
  ears5: 'earOrc',
};

const NO_EAR_HAIR_STYLES = new Set([
  'hair13',
  'hair17',
  'hair18',
  'hair22',
  'hair27',
  'hair29',
  'hair31',
  'hair34',
  'hair35',
  'hair37',
  'hair38',
  'hair39',
]);

const BACK_HAIR_STYLE_IDS = new Set([
  'hair5',
  'hair13',
  'hair17',
  'hair18',
  'hair22',
  'hair23',
  'hair24',
  'hair26',
  'hair27',
  'hair28',
  'hair29',
  'hair30',
  'hair32',
  'hair33',
  'hair34',
  'hair35',
  'hair36',
  'hair37',
  'hair38',
  'hair39',
  'hair40',
]);

const BEARD_FACE_ONE_STYLE_IDS = new Set(['beards7', 'beards9', 'beards16']);

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    const serializedValue = JSON.stringify(value);
    return serializedValue === undefined ? Object.prototype.toString.call(value) : serializedValue;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${error.message}).`;
    }

    throw error;
  }
}

function requireFinitePositiveNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a finite number greater than 0. Received ${describeReceivedValue(value)}.`);
  }

  return value;
}

function sourcePath(filename: string): string {
  return `${FAMILY_TREE_AVATAR_ASSET_ROOT}/${filename}`;
}

function sourceIndex(choice: FamilyTreeAvatarChoice): number {
  if (!Number.isSafeInteger(choice.index) || choice.index < 0) {
    throw new Error(
      `Family tree avatar choice ${JSON.stringify(choice.id)} has an invalid source index. Received ${describeReceivedValue(choice.index)}.`,
    );
  }

  return choice.index;
}

function faceSourcePath(avatar: FamilyTreeAvatar): string {
  const choice = getFamilyTreeAvatarChoice(avatar.faces);
  const index = sourceIndex(choice);

  if (choice.group === 'faces' && choice.id.startsWith('face')) {
    return sourcePath(`head${(avatar.skinColor - 1) * 22 + index}.png`);
  }

  if (choice.group === 'faces' && choice.id.startsWith('mface')) {
    return sourcePath(`mhead${(avatar.skinColor - 1) * 18 + index}.png`);
  }

  if (choice.group === 'beards') {
    const baseFaceIndex = BEARD_FACE_ONE_STYLE_IDS.has(choice.id) ? 1 : 11;
    return sourcePath(`mhead${(avatar.skinColor - 1) * 18 + baseFaceIndex}.png`);
  }

  throw new Error(`Family tree avatar face choice is unsupported. Received ${JSON.stringify(choice.id)}.`);
}

function choiceImagePath(avatar: FamilyTreeAvatar, choice: FamilyTreeAvatarChoice): string | null {
  const index = sourceIndex(choice);

  if (choice.category === 'faces') {
    if (choice.group === 'beards') {
      return sourcePath(`beards${(avatar.hairColor - 1) * 17 + index}.png`);
    }

    if (choice.id.startsWith('face')) {
      return sourcePath(`head${(avatar.skinColor - 1) * 22 + index}.png`);
    }

    return sourcePath(`mhead${(avatar.skinColor - 1) * 18 + index}.png`);
  }

  if (choice.category === 'hair') {
    if (choice.id === 'hair0') {
      return null;
    }

    return sourcePath(`hair${(avatar.hairColor - 1) * 40 + index}.png`);
  }

  if (choice.category === 'ears') {
    const prefix = EAR_FILE_PREFIX_BY_CHOICE_ID[choice.id];
    if (prefix === undefined) {
      throw new Error(`Family tree avatar ear choice has no source prefix. Received ${JSON.stringify(choice.id)}.`);
    }

    return sourcePath(`${prefix}${avatar.skinColor}.png`);
  }

  if (choice.category === 'eyes') {
    if (index <= 20) {
      return sourcePath(`eyes${(avatar.eyeColor - 1) * 20 + index}.png`);
    }

    return sourcePath(`eyesOrc${(avatar.eyeColor - 1) * 20 + index - 20}.png`);
  }

  if (choice.category === 'eyebrows') {
    return sourcePath(`eb${(avatar.eyebrowColor - 1) * 80 + index}.png`);
  }

  if (choice.category === 'noses') {
    if (choice.group === 'moustaches') {
      return sourcePath(`mstch${(avatar.moustacheColor - 1) * 28 + index}.png`);
    }

    return sourcePath(`nose${index}.png`);
  }

  if (choice.category === 'mouths') {
    if (index <= 40) {
      return sourcePath(`mouth${index}.png`);
    }

    return sourcePath(`mouthOrc${index - 40}.png`);
  }

  if (choice.group === 'reset') {
    return null;
  }

  if (choice.group === 'faceWrinkles') {
    return sourcePath(`old${index}.png`);
  }

  if (choice.group === 'eyeWrinkles') {
    return sourcePath(`eyesp${index}.png`);
  }

  if (choice.group === 'scars') {
    return sourcePath(`scar${index}.png`);
  }

  throw new Error(`Family tree avatar choice has no source path. Received ${JSON.stringify(choice.id)}.`);
}

export function getFamilyTreeChoiceImagePath(
  avatar: FamilyTreeAvatar,
  choiceId: string,
): string | null {
  const currentAvatar = requireFamilyTreeAvatar(avatar);
  const choice = getFamilyTreeAvatarChoice(choiceId);
  return choiceImagePath(currentAvatar, choice);
}

function createLayer(id: string, src: string, opacity?: number): FamilyTreeAvatarLayer {
  return {
    id,
    src,
    x: 0,
    y: 0,
    width: FAMILY_TREE_AVATAR_WIDTH,
    height: FAMILY_TREE_AVATAR_HEIGHT,
    ...(opacity === undefined ? {} : { opacity }),
  };
}

function layerForChoice(avatar: FamilyTreeAvatar, choiceId: string): FamilyTreeAvatarLayer | null {
  const src = getFamilyTreeChoiceImagePath(avatar, choiceId);
  return src === null ? null : createLayer(choiceId, src);
}

function backHairLayer(avatar: FamilyTreeAvatar): FamilyTreeAvatarLayer | null {
  if (!BACK_HAIR_STYLE_IDS.has(avatar.hair)) {
    return null;
  }

  const hairChoice = getFamilyTreeAvatarChoice(avatar.hair);
  const index = sourceIndex(hairChoice);
  return createLayer('bhair', sourcePath(`bhair${(avatar.hairColor - 1) * 40 + index}.png`));
}

function sortedScarIds(scarIds: readonly string[]): readonly string[] {
  return [...scarIds].sort((firstScarId, secondScarId) => {
    const firstIndex = Number(firstScarId.slice('scar'.length));
    const secondIndex = Number(secondScarId.slice('scar'.length));
    return firstIndex - secondIndex;
  });
}

function earLayer(avatar: FamilyTreeAvatar): FamilyTreeAvatarLayer | null {
  const hairCoversEar = NO_EAR_HAIR_STYLES.has(avatar.hair);
  if (hairCoversEar && avatar.ears !== 'ears2') {
    return null;
  }

  const earPrefix = hairCoversEar ? 'earhElf' : EAR_FILE_PREFIX_BY_CHOICE_ID[avatar.ears];
  if (earPrefix === undefined) {
    throw new Error(`Family tree avatar ear choice is invalid. Received ${JSON.stringify(avatar.ears)}.`);
  }

  return createLayer('ear', sourcePath(`${earPrefix}${avatar.skinColor}.png`));
}

export function getFamilyTreeAvatarLayers(avatar: FamilyTreeAvatar): FamilyTreeAvatarLayer[] {
  const currentAvatar = requireFamilyTreeAvatar(avatar);
  const layers: FamilyTreeAvatarLayer[] = [];

  const hairBackLayer = backHairLayer(currentAvatar);
  if (hairBackLayer !== null) {
    layers.push(hairBackLayer);
  }

  layers.push(createLayer('face', faceSourcePath(currentAvatar)));

  for (const scarId of sortedScarIds(currentAvatar.extras.scars)) {
    const scarLayer = layerForChoice(currentAvatar, scarId);
    if (scarLayer === null) {
      throw new Error(`Family tree scar choice unexpectedly has no image. Received ${JSON.stringify(scarId)}.`);
    }
    layers.push(scarLayer);
  }

  const faceChoice = getFamilyTreeAvatarChoice(currentAvatar.faces);
  if (faceChoice.group === 'beards') {
    const beardLayer = layerForChoice(currentAvatar, currentAvatar.faces);
    if (beardLayer === null) {
      throw new Error(`Family tree beard choice unexpectedly has no image. Received ${JSON.stringify(currentAvatar.faces)}.`);
    }
    layers.push({ ...beardLayer, id: 'beard' });
  }

  for (const [layerId, choiceId] of [
    ['mouth', currentAvatar.mouths],
    ['nose', currentAvatar.noses],
    ['eyes', currentAvatar.eyes],
  ] as const) {
    const layer = layerForChoice(currentAvatar, choiceId);
    if (layer === null) {
      throw new Error(`Family tree avatar choice unexpectedly has no image. Received ${JSON.stringify(choiceId)}.`);
    }
    layers.push({ ...layer, id: layerId });
  }

  if (currentAvatar.extras.eyeWrinkle !== null) {
    const eyeWrinkleLayer = layerForChoice(currentAvatar, currentAvatar.extras.eyeWrinkle);
    if (eyeWrinkleLayer === null) {
      throw new Error(`Family tree eye wrinkle choice unexpectedly has no image. Received ${JSON.stringify(currentAvatar.extras.eyeWrinkle)}.`);
    }
    layers.push({ ...eyeWrinkleLayer, id: 'eyesSp', opacity: 0.4 });
  }

  if (currentAvatar.extras.faceWrinkle !== null) {
    const faceWrinkleLayer = layerForChoice(currentAvatar, currentAvatar.extras.faceWrinkle);
    if (faceWrinkleLayer === null) {
      throw new Error(`Family tree face wrinkle choice unexpectedly has no image. Received ${JSON.stringify(currentAvatar.extras.faceWrinkle)}.`);
    }
    layers.push({ ...faceWrinkleLayer, id: 'faceSp', opacity: 0.4 });
  }

  for (const [layerId, choiceId] of [
    ['eyebrows', currentAvatar.eyebrows],
    ['hair', currentAvatar.hair],
  ] as const) {
    const layer = layerForChoice(currentAvatar, choiceId);
    if (layer !== null) {
      layers.push({ ...layer, id: layerId });
    }
  }

  const earsLayer = earLayer(currentAvatar);
  if (earsLayer !== null) {
    layers.push(earsLayer);
  }

  return layers;
}

function requireDrawContext(context: unknown): asserts context is Pick<CanvasRenderingContext2D, 'clearRect' | 'drawImage' | 'globalAlpha'> {
  if (context === null || typeof context !== 'object') {
    throw new Error(`Family tree avatar draw context must be an object. Received ${describeReceivedValue(context)}.`);
  }

  const candidateContext = context as Partial<Pick<CanvasRenderingContext2D, 'clearRect' | 'drawImage' | 'globalAlpha'>>;
  if (typeof candidateContext.clearRect !== 'function') {
    throw new Error(`Family tree avatar draw context clearRect must be a function. Received ${describeReceivedValue(candidateContext.clearRect)}.`);
  }
  if (typeof candidateContext.drawImage !== 'function') {
    throw new Error(`Family tree avatar draw context drawImage must be a function. Received ${describeReceivedValue(candidateContext.drawImage)}.`);
  }
}

function loadFamilyTreeAvatarImage(src: string): Promise<CanvasImageSource> {
  const ImageConstructor = globalThis.Image;
  if (typeof ImageConstructor !== 'function') {
    throw new Error(`Family tree avatar image cannot load because Image is not a function. Received typeof ${typeof ImageConstructor}.`);
  }

  return new Promise((resolve, reject) => {
    const image = new ImageConstructor();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Family tree avatar image failed to decode: ${JSON.stringify(src)}.`));

    try {
      image.src = src;
    } catch (error: unknown) {
      if (error instanceof Error) {
        reject(new Error(`Family tree avatar image failed to load ${JSON.stringify(src)}: ${error.message}.`, { cause: error }));
        return;
      }

      throw error;
    }
  });
}

function requireFiniteNonNegativeNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite number greater than or equal to 0. Received ${describeReceivedValue(value)}.`);
  }

  return value;
}

export async function drawFamilyTreeAvatar(
  context: CanvasRenderingContext2D,
  avatar: FamilyTreeAvatar,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<void> {
  requireDrawContext(context);
  const currentAvatar = requireFamilyTreeAvatar(avatar);
  const drawX = requireFiniteNonNegativeNumber(x, 'Family tree avatar x');
  const drawY = requireFiniteNonNegativeNumber(y, 'Family tree avatar y');
  const drawWidth = requireFinitePositiveNumber(width, 'Family tree avatar width');
  const drawHeight = requireFinitePositiveNumber(height, 'Family tree avatar height');
  const layers = getFamilyTreeAvatarLayers(currentAvatar);
  const images = await Promise.all(layers.map((layer) => loadFamilyTreeAvatarImage(layer.src)));

  const previousGlobalAlpha = context.globalAlpha;
  let currentLayerId = 'unknown';
  try {
    for (let layerIndex = 0; layerIndex < layers.length; layerIndex += 1) {
      const layer = layers[layerIndex];
      const image = images[layerIndex];
      if (layer === undefined || image === undefined) {
        throw new Error(`Family tree avatar layer ${String(layerIndex)} is missing during draw.`);
      }

      currentLayerId = layer.id;
      context.globalAlpha = layer.opacity ?? 1;
      context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Family tree avatar layer ${JSON.stringify(currentLayerId)} failed to draw: ${error.message}.`,
        { cause: error },
      );
    }

    throw error;
  } finally {
    context.globalAlpha = previousGlobalAlpha;
  }
}
