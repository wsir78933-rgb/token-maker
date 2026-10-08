import {
  CONSTELLATION_STAR_ASSET_ID,
  CONSTELLATION_STAR_HEIGHT,
  CONSTELLATION_STAR_WIDTH,
  getConstellationAsset,
} from './catalog';
import {
  requireConstellationBoolean,
  requireConstellationCanvasSize,
  requireConstellationColor,
  requireConstellationImageDimensions,
  requireConstellationImageUrl,
  requireConstellationObjectId,
  requireConstellationProject,
  requireConstellationTransform,
} from './validation';
import type {
  ConstellationProject,
  ConstellationTransform,
} from './types';

const DEFAULT_CONSTELLATION_WIDTH = 900;
const DEFAULT_CONSTELLATION_HEIGHT = 600;
const DEFAULT_CONSTELLATION_BACKGROUND_COLOR = '#0a0c3a';
const DEFAULT_CONSTELLATION_OBJECT_WIDTH = 98;
const DEFAULT_CONSTELLATION_OBJECT_HEIGHT = 93;

export function createDefaultConstellationProject(): ConstellationProject {
  return {
    width: DEFAULT_CONSTELLATION_WIDTH,
    height: DEFAULT_CONSTELLATION_HEIGHT,
    background: {
      color: DEFAULT_CONSTELLATION_BACKGROUND_COLOR,
      transparent: false,
      imageUrl: null,
      imageWidth: null,
      imageHeight: null,
    },
    objects: [],
  };
}

function requireNewConstellationObjectId(
  project: ConstellationProject,
  objectId: unknown,
): string {
  const validObjectId = requireConstellationObjectId(objectId);
  if (project.objects.some((object) => object.id === validObjectId)) {
    throw new Error(
      `Constellation object id must be unique. Received duplicate ${JSON.stringify(validObjectId)}.`,
    );
  }

  return validObjectId;
}

function findConstellationObjectIndex(
  project: ConstellationProject,
  objectId: unknown,
): number {
  const validObjectId = requireConstellationObjectId(objectId);
  const objectIndex = project.objects.findIndex((object) => object.id === validObjectId);
  if (objectIndex < 0) {
    throw new Error(
      `Constellation object id was not found. Received ${JSON.stringify(validObjectId)}.`,
    );
  }

  return objectIndex;
}

function buildConstellationObject(
  objectId: string,
  assetId: string,
  width: number,
  height: number,
  kind: 'constellation' | 'star',
): ConstellationProject['objects'][number] {
  return { id: objectId, kind, assetId, x: 0, y: 0, width, height, rotation: 0 };
}

export function addConstellation(
  project: ConstellationProject,
  assetId: string,
  objectId: string,
): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  const asset = getConstellationAsset(assetId);
  const validObjectId = requireNewConstellationObjectId(currentProject, objectId);
  return {
    ...currentProject,
    objects: [
      ...currentProject.objects,
      buildConstellationObject(
        validObjectId,
        asset.id,
        asset.width || DEFAULT_CONSTELLATION_OBJECT_WIDTH,
        asset.height || DEFAULT_CONSTELLATION_OBJECT_HEIGHT,
        'constellation',
      ),
    ],
  };
}

export function addConstellationStar(
  project: ConstellationProject,
  objectId: string,
): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  const validObjectId = requireNewConstellationObjectId(currentProject, objectId);
  return {
    ...currentProject,
    objects: [
      ...currentProject.objects,
      buildConstellationObject(
        validObjectId,
        CONSTELLATION_STAR_ASSET_ID,
        CONSTELLATION_STAR_WIDTH,
        CONSTELLATION_STAR_HEIGHT,
        'star',
      ),
    ],
  };
}

export function bringConstellationToFront(
  project: ConstellationProject,
  objectId: string,
): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  const objectIndex = findConstellationObjectIndex(currentProject, objectId);
  const [selectedObject] = currentProject.objects.splice(objectIndex, 1);
  if (selectedObject === undefined) {
    throw new Error(
      `Constellation object could not be moved to front at index ${objectIndex}. Received ${JSON.stringify(objectId)}.`,
    );
  }

  return { ...currentProject, objects: [...currentProject.objects, selectedObject] };
}

export function transformConstellationObject(
  project: ConstellationProject,
  objectId: string,
  transform: ConstellationTransform,
): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  const objectIndex = findConstellationObjectIndex(currentProject, objectId);
  const validTransform = requireConstellationTransform(transform, 'Constellation object transform');
  // Omitting rotation keeps the current angle. An explicit rotation, including 0, replaces it.
  const objects = currentProject.objects.map((object, index) =>
    index === objectIndex ? { ...object, ...validTransform } : object,
  );
  return { ...currentProject, objects };
}

export function removeConstellationObject(
  project: ConstellationProject,
  objectId: string,
): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  const objectIndex = findConstellationObjectIndex(currentProject, objectId);
  return {
    ...currentProject,
    objects: currentProject.objects.filter((_, index) => index !== objectIndex),
  };
}

export function clearConstellationObjects(project: ConstellationProject): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  return { ...currentProject, objects: [] };
}

export function resizeConstellationCanvas(
  project: ConstellationProject,
  width: number,
  height: number,
): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  const canvasSize = requireConstellationCanvasSize(width, height);
  return { ...currentProject, ...canvasSize };
}

export function setConstellationBackgroundColor(
  project: ConstellationProject,
  color: string,
): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  const validColor = requireConstellationColor(color);
  return {
    ...currentProject,
    background: { ...currentProject.background, color: validColor },
  };
}

export function setConstellationTransparentBase(
  project: ConstellationProject,
  transparent: boolean,
): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  const validTransparent = requireConstellationBoolean(transparent, 'Constellation transparent base');
  return {
    ...currentProject,
    background: { ...currentProject.background, transparent: validTransparent },
  };
}

export function setConstellationBackgroundImage(
  project: ConstellationProject,
  url: string,
  imageWidth: number,
  imageHeight: number,
): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  const validUrl = requireConstellationImageUrl(url);
  const dimensions = requireConstellationImageDimensions(imageWidth, imageHeight);
  return {
    ...currentProject,
    background: {
      ...currentProject.background,
      imageUrl: validUrl,
      imageWidth: dimensions.width,
      imageHeight: dimensions.height,
    },
  };
}

export function removeConstellationBackgroundImage(
  project: ConstellationProject,
): ConstellationProject {
  const currentProject = requireConstellationProject(project);
  return {
    ...currentProject,
    background: {
      ...currentProject.background,
      imageUrl: null,
      imageWidth: null,
      imageHeight: null,
    },
  };
}
