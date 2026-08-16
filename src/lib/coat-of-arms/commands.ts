import { createDefaultProject, getAssetColorSources, getCoatAsset, listAssetsByKind } from './assets';
import { textFontFamilies } from './types';
import type {
  BackgroundGradient,
  CanvasTransform,
  CoatField,
  CoatGroup,
  CoatLayer,
  CoatProject,
  LocalUpload,
  TextAlignment,
  TextFontFamily,
  TextFontStyle,
  TextFontWeight,
  TextPathPlacement,
  FieldDivision,
  FieldDivisionLineStyle,
  FieldOrnament,
  FieldOrnamentKind,
  FieldPattern,
  FieldPlacement,
  FieldRegionId,
  CoatRasterVariantId,
} from './types';
import { fieldDivisionLineStyles, supportsFieldDivisionLine } from './field-division-line';
import { fieldRegionIds } from './field-regions';
import { assertFieldPatternConfig, fieldPatterns } from './field-pattern';
import { assertFieldRegions } from './field-regions';
import { createLocalCoatId } from './id';
import { assertCustomShieldOutlinePath, normalizeCustomShieldOutlinePath } from './shield-outline';
import { replaceEditableLayerColour } from './layer-colours';

const validDivisions: readonly FieldDivision[] = [
  'solid',
  'per-pale',
  'per-fess',
  'per-bend',
  'per-bend-sinister',
  'per-chevron',
  'quarterly',
  'gyronny',
  'tierced-per-pale',
  'tierced-per-fess',
  'per-saltire',
  'barry',
  'paly',
  'bendy',
];
const validPatterns: readonly FieldPattern[] = fieldPatterns;
const validFieldPlacements: readonly FieldPlacement[] = ['overall', 'dexter', 'sinister', 'chief', 'base', 'q1', 'q2', 'q3', 'q4'];
const validFieldRegionIds = fieldRegionIds;
const validFieldOrnamentKinds: readonly FieldOrnamentKind[] = ['bar', 'base', 'bendlet', 'chief', 'cross', 'fess', 'mountain', 'pale', 'pile', 'escutcheon', 'bordure', 'canton', 'chevron', 'pall', 'saltire', 'fretty'];
const fieldOrnamentWidthKinds: readonly FieldOrnamentKind[] = ['bar', 'base', 'chief', 'fess', 'mountain', 'canton', 'pile', 'chevron'];
const fieldOrnamentHeightKinds: readonly FieldOrnamentKind[] = ['base', 'chief', 'mountain', 'canton'];
const fieldOrnamentThicknessKinds: readonly FieldOrnamentKind[] = ['bar', 'bendlet', 'fess', 'pale', 'chevron', 'pall', 'bordure', 'saltire', 'fretty'];
const fieldOrnamentReversibleKinds: readonly FieldOrnamentKind[] = ['pile', 'chevron', 'pall'];
const fieldOrnamentEdgeKinds: readonly FieldOrnamentKind[] = ['base', 'chief', 'bendlet', 'fess', 'pale'];
const fieldOrnamentCrossKinds: readonly FieldOrnamentKind[] = ['cross'];
const fieldOrnamentSaltireKinds: readonly FieldOrnamentKind[] = ['saltire'];
const fieldOrnamentChevronKinds: readonly FieldOrnamentKind[] = ['chevron'];
const fieldOrnamentPallKinds: readonly FieldOrnamentKind[] = ['pall'];
const fieldOrnamentMountainKinds: readonly FieldOrnamentKind[] = ['mountain'];
const validLayerTypes = ['background', 'shield', 'ordinary', 'charge', 'top', 'draw', 'image', 'text'] as const;

export const COAT_PROJECT_LIMITS = {
  maxCanvasDimension: 4096,
  maxLayerCount: 64,
  maxLocalUploadCount: 8,
  maxLocalUploadBytes: 262_144,
  maxTotalLocalUploadBytes: 524_288,
  maxTextLength: 240,
} as const;

export type RandomValueSource = () => number;

export type LayerAlignmentAxis = 'left' | 'horizontal-centre' | 'right' | 'top' | 'vertical-centre' | 'bottom';
export type LayerDistributionAxis = 'horizontal' | 'vertical';
export type LayerOrderDirection = 'forward' | 'backward' | 'front' | 'back';
type MovableCoatLayer = Exclude<CoatLayer, { type: 'background' }>;

export type CoatLayerPatch = {
  assetId?: string;
  color?: string;
  field?: CoatField;
  text?: string;
  fontSize?: number;
  fontFamily?: TextFontFamily;
  fontStyle?: TextFontStyle;
  fontWeight?: TextFontWeight;
  colorReplacements?: Record<string, string>;
  opacity?: number;
  fill?: string;
  strokeWidth?: number;
  pathData?: string;
  motif?: FieldPattern;
  alignment?: TextAlignment;
  path?: TextPathPlacement;
  transform?: CanvasTransform;
};

export type CoatProjectCommand =
  | { type: 'add-layer'; assetId: string; rasterVariantId?: CoatRasterVariantId }
  | { type: 'update-layer'; layerId: string; patch: CoatLayerPatch }
  | { type: 'update-layers'; updates: Array<{ layerId: string; patch: CoatLayerPatch }> }
  | { type: 'remove-layer'; layerId: string }
  | { type: 'remove-layers'; layerIds: string[] }
  | { type: 'duplicate-layers'; sourceLayerIds: string[]; newLayerIds: string[] }
  | { type: 'move-layer'; layerId: string; toIndex: number }
  | { type: 'set-layer-visibility'; layerId: string; visible: boolean }
  | { type: 'set-layer-lock'; layerId: string; locked: boolean }
  | { type: 'group-layers'; groupId: string; layerIds: string[] }
  | { type: 'ungroup-layers'; groupId: string }
  | { type: 'set-group-opacity'; groupId: string; opacity: number }
  | { type: 'align-layer-ids'; axis: LayerAlignmentAxis; layerIds: string[] }
  | { type: 'distribute-layer-ids'; axis: LayerDistributionAxis; layerIds: string[] }
  | { type: 'move-layer-ids'; direction: LayerOrderDirection; layerIds: string[] }
  | { type: 'set-layer-ids-visibility'; layerIds: string[]; visible: boolean }
  | { type: 'set-layer-ids-lock'; layerIds: string[]; locked: boolean }
  | { type: 'group-layer-ids'; groupId: string; layerIds: string[] }
  | { type: 'ungroup-layer-ids'; layerIds: string[] }
  | { type: 'set-layer-ids-opacity'; layerIds: string[]; opacity: number }
  | { type: 'resize-layer-ids'; layerIds: string[]; width: number; height: number; keepAspectRatio: boolean }
  | { type: 'set-field'; layerId: string; field: CoatField }
  | { type: 'set-custom-shield-mask'; layerId: string; uploadId?: string }
  | { type: 'set-custom-shield-outline'; layerId: string; path?: string }
  | { type: 'set-background'; assetId: string; motif?: FieldPattern; opacity?: number; fill?: string; gradient?: BackgroundGradient | null }
  | { type: 'set-canvas-size'; width: number; height: number }
  | { type: 'add-drawing-layer'; path: string; color: string; strokeWidth: number; transform?: CanvasTransform }
  | { type: 'set-project-name'; name: string }
  | { type: 'add-text-layer'; text: string; color: string; fontSize: number; fontFamily?: TextFontFamily; fontStyle?: TextFontStyle; fontWeight?: TextFontWeight; alignment: TextAlignment; path: TextPathPlacement; transform?: CanvasTransform }
  | { type: 'remove-text-layer'; layerId: string }
  | { type: 'register-local-upload'; upload: LocalUpload }
  | { type: 'add-local-upload-images'; uploads: LocalUpload[] }
  | { type: 'remove-local-upload'; uploadId: string }
  | { type: 'add-image-layer'; uploadId: string; opacity?: number; transform?: CanvasTransform }
  | { type: 'remove-image-layer'; layerId: string }
  | { type: 'replace-layer-colour'; layerId: string; fromColor: string; toColor: string }
  | { type: 'replace-all-colour'; fromColor: string; toColor: string }
  | { type: 'add-custom-palette-color'; color: string }
  | { type: 'remove-custom-palette-color'; color: string };

export function applyProjectCommand(
  project: CoatProject,
  command: CoatProjectCommand,
): CoatProject {
  assertCoatProject(project);
  assertProjectCommand(command);

  switch (command.type) {
    case 'add-layer':
      return addAssetLayer(project, command.assetId, command.rasterVariantId);
    case 'update-layer':
      return updateProjectLayer(project, command.layerId, command.patch);
    case 'update-layers':
      return updateProjectLayers(project, command.updates);
    case 'remove-layer':
      return removeProjectLayer(project, command.layerId);
    case 'remove-layers':
      return removeProjectLayers(project, command.layerIds);
    case 'duplicate-layers':
      return duplicateProjectLayers(project, command.sourceLayerIds, command.newLayerIds);
    case 'move-layer':
      return moveProjectLayer(project, command.layerId, command.toIndex);
    case 'set-layer-visibility':
      return setProjectLayerVisibility(project, command.layerId, command.visible);
    case 'set-layer-lock':
      return setProjectLayerLock(project, command.layerId, command.locked);
    case 'group-layers':
      return groupProjectLayers(project, command.groupId, command.layerIds);
    case 'ungroup-layers':
      return ungroupProjectLayers(project, command.groupId);
    case 'set-group-opacity':
      return setGroupOpacity(project, command.groupId, command.opacity);
    case 'align-layer-ids':
      return alignLayerIds(project, command.layerIds, command.axis);
    case 'distribute-layer-ids':
      return distributeLayerIds(project, command.layerIds, command.axis);
    case 'move-layer-ids':
      return moveLayerIds(project, command.layerIds, command.direction);
    case 'set-layer-ids-visibility':
      return setLayerIdsVisibility(project, command.layerIds, command.visible);
    case 'set-layer-ids-lock':
      return setLayerIdsLock(project, command.layerIds, command.locked);
    case 'group-layer-ids':
      return groupLayerIds(project, command.groupId, command.layerIds);
    case 'ungroup-layer-ids':
      return ungroupLayerIds(project, command.layerIds);
    case 'set-layer-ids-opacity':
      return setLayerIdsOpacity(project, command.layerIds, command.opacity);
    case 'resize-layer-ids':
      return resizeLayerIds(project, command.layerIds, command.width, command.height, command.keepAspectRatio);
    case 'set-field':
      return setProjectField(project, command.layerId, command.field);
    case 'set-custom-shield-mask':
      return setCustomShieldMask(project, command.layerId, command.uploadId);
    case 'set-custom-shield-outline':
      return setCustomShieldOutline(project, command.layerId, command.path);
    case 'set-background':
      return setProjectBackground(project, command.assetId, command.motif, command.opacity, command.fill, command.gradient);
    case 'set-canvas-size':
      return setProjectCanvasSize(project, command.width, command.height);
    case 'add-drawing-layer':
      return addDrawingLayer(project, command);
    case 'set-project-name':
      return setProjectName(project, command.name);
    case 'add-text-layer':
      return addTextLayer(project, command);
    case 'remove-text-layer':
      return removeTextLayer(project, command.layerId);
    case 'register-local-upload':
      return registerLocalUpload(project, command.upload);
    case 'add-local-upload-images':
      return addLocalUploadImages(project, command.uploads);
    case 'remove-local-upload':
      return removeLocalUpload(project, command.uploadId);
    case 'add-image-layer':
      return addImageLayer(project, command);
    case 'remove-image-layer':
      return removeImageLayer(project, command.layerId);
    case 'replace-layer-colour':
      return replaceProjectLayerColour(project, command.layerId, command.fromColor, command.toColor);
    case 'replace-all-colour':
      return replaceAllColour(project, command.fromColor, command.toColor);
    case 'add-custom-palette-color':
      return addCustomPaletteColor(project, command.color);
    case 'remove-custom-palette-color':
      return removeCustomPaletteColor(project, command.color);
    default:
      return assertNeverCommand(command);
  }
}

export function assertCoatProject(project: unknown): asserts project is CoatProject {
  if (!isRecord(project)) throw new Error(`Invalid coat project: ${String(project)}`);
  assertExactKeys(project, ['id', 'locale', 'name', 'canvas', 'palette', 'uploads', 'groups', 'layers'], 'coat project');
  assertNonEmptyString(project.id, 'project id');
  if (project.locale !== 'en' && project.locale !== 'zh') {
    throw new Error(`Invalid project locale: ${String(project.locale)}`);
  }
  assertProjectName(project.name);
  assertCanvas(project.canvas);
  assertProjectPalette(project.palette);
  if (!Array.isArray(project.uploads)) throw new Error(`Invalid project uploads: ${String(project.uploads)}`);
  if (!Array.isArray(project.groups)) throw new Error(`Invalid project groups: ${String(project.groups)}`);
  if (!Array.isArray(project.layers)) throw new Error(`Invalid project layers: ${String(project.layers)}`);
  if (project.layers.length > COAT_PROJECT_LIMITS.maxLayerCount) {
    throw new Error(`Invalid project layer count: ${project.layers.length}; limit is ${COAT_PROJECT_LIMITS.maxLayerCount}`);
  }
  if (project.uploads.length > COAT_PROJECT_LIMITS.maxLocalUploadCount) {
    throw new Error(`Invalid local upload count: ${project.uploads.length}; limit is ${COAT_PROJECT_LIMITS.maxLocalUploadCount}`);
  }

  const layerIds = new Set<string>();
  const uploadById = new Map<string, LocalUpload>();
  let totalLocalUploadBytes = 0;
  for (const upload of project.uploads) {
    const uploadBytes = assertLocalUpload(upload);
    totalLocalUploadBytes += uploadBytes;
    if (uploadById.has(upload.id)) throw new Error(`Duplicate local upload id: ${upload.id}`);
    uploadById.set(upload.id, upload);
  }
  if (totalLocalUploadBytes > COAT_PROJECT_LIMITS.maxTotalLocalUploadBytes) {
    throw new Error(`Invalid total local upload bytes: ${totalLocalUploadBytes}; limit is ${COAT_PROJECT_LIMITS.maxTotalLocalUploadBytes}`);
  }
  for (const layer of project.layers) {
    assertCoatLayer(layer, uploadById);
    if (layerIds.has(layer.id)) throw new Error(`Duplicate coat layer id: ${layer.id}`);
    layerIds.add(layer.id);
  }
  assertRequiredBaseLayers(project.layers);
  assertGroupMemberships(project.layers, project.groups);
}

/** Creates a fully local project from the catalog; inject random for repeatable callers and tests. */
export function createRandomCoatProject(
  locale: 'en' | 'zh',
  randomValue: RandomValueSource = Math.random,
): CoatProject {
  assertRandomValueSource(randomValue);
  const fieldColors = ['#1855A5', '#B11F24', '#F5E6A1'];
  const divisions: readonly FieldDivision[] = ['solid', 'per-pale', 'per-fess', 'per-bend', 'per-bend-sinister', 'per-chevron', 'quarterly', 'gyronny', 'tierced-per-pale', 'tierced-per-fess', 'per-saltire', 'barry', 'paly', 'bendy'];
  const patterns: readonly FieldPattern[] = ['solid', 'stripes', 'dots', 'checks', 'lozengy', 'crosses', 'waves', 'masoned', 'honeycomb', 'fretty', 'scales'];
  const background = pickRandom(listAssetsByKind('background'), randomValue, 'background asset');
  const shield = pickRandom(listAssetsByKind('shield'), randomValue, 'shield asset');
  const ordinary = pickRandom(listAssetsByKind('ordinary'), randomValue, 'ordinary asset');
  const charge = pickRandom(listAssetsByKind('charge'), randomValue, 'charge asset');
  const division = pickRandom(divisions, randomValue, 'field division');
  const pattern = pickRandom(patterns, randomValue, 'field pattern');
  const primaryColor = pickRandom(fieldColors, randomValue, 'field color');
  const secondaryColor = pickRandom(fieldColors, randomValue, 'field color');
  const field: CoatField = {
    division,
    pattern,
    colors: division === 'solid' && pattern === 'solid' ? [primaryColor] : [primaryColor, secondaryColor],
  };

  let project = createDefaultProject(locale);
  const baseShield = project.layers.find((layer) => layer.type === 'shield');
  if (!baseShield) throw new Error('Random coat project is missing its base shield');
  project = applyProjectCommand(project, {
    type: 'set-background', assetId: background.id, motif: pattern, opacity: 1,
  });
  project = applyProjectCommand(project, {
    type: 'update-layer', layerId: baseShield.id, patch: { assetId: shield.id, field },
  });
  project = applyProjectCommand(project, { type: 'add-layer', assetId: ordinary.id });
  project = applyProjectCommand(project, { type: 'add-layer', assetId: charge.id });
  assertCoatProject(project);
  return project;
}

function addAssetLayer(
  project: CoatProject,
  assetId: string,
  rasterVariantId: CoatRasterVariantId | undefined,
): CoatProject {
  const asset = getCoatAsset(assetId);
  const layer = createAssetLayer(asset, rasterVariantId);
  return withLayers(project, [...project.layers, layer]);
}

function updateProjectLayer(project: CoatProject, layerId: string, patch: CoatLayerPatch): CoatProject {
  const layer = getUnlockedLayer(project, layerId);
  assertLayerPatch(layer, patch);
  const updatedLayer = applyLayerPatch(layer, patch);
  return replaceLayer(project, layerId, updatedLayer);
}

function updateProjectLayers(
  project: CoatProject,
  updates: Array<{ layerId: string; patch: CoatLayerPatch }>,
): CoatProject {
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new Error(`Invalid layer updates: ${String(updates)}`);
  }
  const updatedById = new Map<string, CoatLayer>();
  for (const update of updates) {
    if (!isRecord(update)) throw new Error(`Invalid layer update: ${String(update)}`);
    assertExactKeys(update, ['layerId', 'patch'], 'layer update');
    const layer = getUnlockedLayer(project, update.layerId);
    if (updatedById.has(layer.id)) throw new Error(`Duplicate layer update id: ${layer.id}`);
    assertLayerPatch(layer, update.patch);
    updatedById.set(layer.id, applyLayerPatch(layer, update.patch));
  }
  return withLayers(project, project.layers.map((layer) => updatedById.get(layer.id) ?? layer));
}

function removeProjectLayer(project: CoatProject, layerId: string): CoatProject {
  const layer = getUnlockedLayer(project, layerId);
  assertBaseLayerCanBeRemoved(project, [layer]);
  return withLayers(project, project.layers.filter((layer) => layer.id !== layerId));
}

function removeProjectLayers(project: CoatProject, layerIds: string[]): CoatProject {
  const selectedIds = assertUniqueUnlockedLayerIds(project, layerIds, 'remove layer ids');
  assertBaseLayerCanBeRemoved(project, project.layers.filter((layer) => selectedIds.has(layer.id)));
  return withLayers(project, project.layers.filter((layer) => !selectedIds.has(layer.id)));
}

function duplicateProjectLayers(
  project: CoatProject,
  sourceLayerIds: string[],
  newLayerIds: string[],
): CoatProject {
  const selectedIds = assertUniqueUnlockedLayerIds(project, sourceLayerIds, 'duplicate source layer ids');
  if (!Array.isArray(newLayerIds) || newLayerIds.length !== sourceLayerIds.length) {
    throw new Error(`Invalid duplicate layer ids: ${String(newLayerIds)}`);
  }
  const existingIds = new Set(project.layers.map((layer) => layer.id));
  const replacementIds = new Set<string>();
  for (const newLayerId of newLayerIds) {
    assertNonEmptyString(newLayerId, 'duplicate layer id');
    if (existingIds.has(newLayerId) || replacementIds.has(newLayerId)) {
      throw new Error(`Duplicate coat layer id: ${newLayerId}`);
    }
    replacementIds.add(newLayerId);
  }
  const sourceById = new Map(project.layers.map((layer) => [layer.id, layer]));
  const duplicatedLayers = sourceLayerIds.map((sourceLayerId, index) => {
    const sourceLayer = sourceById.get(sourceLayerId);
    if (!sourceLayer || !selectedIds.has(sourceLayer.id)) {
      throw new Error(`Unknown coat layer id: ${sourceLayerId}`);
    }
    return cloneLayerForDuplicate(sourceLayer, newLayerIds[index]!);
  });
  return withLayers(project, [...project.layers, ...duplicatedLayers]);
}

function assertUniqueUnlockedLayerIds(
  project: CoatProject,
  layerIds: unknown,
  label: string,
): Set<string> {
  if (!Array.isArray(layerIds) || layerIds.length === 0) {
    throw new Error(`Invalid ${label}: ${String(layerIds)}`);
  }
  const selectedIds = new Set<string>();
  for (const layerId of layerIds) {
    const layer = getUnlockedLayer(project, layerId);
    if (selectedIds.has(layer.id)) throw new Error(`Duplicate coat layer id: ${layer.id}`);
    selectedIds.add(layer.id);
  }
  return selectedIds;
}

function moveProjectLayer(project: CoatProject, layerId: string, toIndex: number): CoatProject {
  const layer = getUnlockedLayer(project, layerId);
  if (!Number.isInteger(toIndex) || toIndex < 0 || toIndex >= project.layers.length) {
    throw new Error(`Invalid target layer index: ${String(toIndex)}`);
  }
  const withoutLayer = project.layers.filter((candidate) => candidate.id !== layer.id);
  const movedLayers = [...withoutLayer];
  movedLayers.splice(toIndex, 0, layer);
  return withLayers(project, movedLayers);
}

function setProjectLayerVisibility(project: CoatProject, layerId: string, visible: boolean): CoatProject {
  if (typeof visible !== 'boolean') throw new Error(`Invalid layer visibility: ${String(visible)}`);
  const layer = getUnlockedLayer(project, layerId);
  return replaceLayer(project, layer.id, { ...layer, visible });
}

function setProjectLayerLock(project: CoatProject, layerId: string, locked: boolean): CoatProject {
  if (typeof locked !== 'boolean') throw new Error(`Invalid layer lock: ${String(locked)}`);
  const layer = getLayerById(project, layerId);
  return replaceLayer(project, layer.id, { ...layer, locked });
}

function groupProjectLayers(project: CoatProject, groupId: string, layerIds: string[]): CoatProject {
  assertGroupId(groupId);
  const groupAlreadyExists = project.layers.some((layer) => layer.groupId === groupId);
  if (!Array.isArray(layerIds) || layerIds.length < (groupAlreadyExists ? 1 : 2)) {
    throw new Error(`Invalid group layer ids: ${String(layerIds)}`);
  }
  if (new Set(layerIds).size !== layerIds.length) throw new Error(`Duplicate group layer id: ${groupId}`);
  const selectedIds = new Set(layerIds);
  for (const layerId of layerIds) getUnlockedLayer(project, layerId);
  assertSelectedGroupLayerIdsAreContiguous(project.layers, selectedIds, groupId);
  return withLayersAndGroups(
    project,
    project.layers.map((layer) => (selectedIds.has(layer.id) ? { ...layer, groupId } : layer)),
    project.groups.some((group) => group.id === groupId)
      ? project.groups
      : [...project.groups, { id: groupId, opacity: 1 }],
  );
}

function ungroupProjectLayers(project: CoatProject, groupId: string): CoatProject {
  assertGroupId(groupId);
  const groupedLayers = project.layers.filter((layer) => layer.groupId === groupId);
  if (groupedLayers.length === 0) throw new Error(`Unknown coat layer group: ${groupId}`);
  for (const layer of groupedLayers) getUnlockedLayer(project, layer.id);
  return withLayersAndGroups(
    project,
    project.layers.map((layer) => (layer.groupId === groupId ? { ...layer, groupId: null } : layer)),
    project.groups.filter((group) => group.id !== groupId),
  );
}

function setGroupOpacity(project: CoatProject, groupId: string, opacity: number): CoatProject {
  assertGroupId(groupId);
  assertOpacity(opacity, 'group opacity');
  if (!project.groups.some((group) => group.id === groupId)) {
    throw new Error(`Unknown coat layer group: ${groupId}`);
  }
  return withLayersAndGroups(
    project,
    project.layers,
    project.groups.map((group) => (group.id === groupId ? { ...group, opacity } : group)),
  );
}

function alignLayerIds(project: CoatProject, layerIds: string[], axis: LayerAlignmentAxis): CoatProject {
  assertLayerAlignmentAxis(axis);
  const movableLayerIds = assertMovableLayerIds(project, layerIds, 'movable layer ids');
  const alignmentPatch = getLayerAlignmentPatch(axis);
  return withLayers(project, project.layers.map((layer) => (
    movableLayerIds.has(layer.id) && isMovableLayer(layer)
      ? { ...layer, transform: { ...layer.transform, ...alignmentPatch } }
      : layer
  )));
}

function distributeLayerIds(project: CoatProject, layerIds: string[], axis: LayerDistributionAxis): CoatProject {
  assertLayerDistributionAxis(axis);
  const movableLayerIds = assertMovableLayerIds(project, layerIds, 'movable layer ids');
  const movableLayers = project.layers.filter((layer): layer is MovableCoatLayer => (
    movableLayerIds.has(layer.id) && isMovableLayer(layer)
  ));
  if (movableLayers.length < 3) {
    throw new Error(`Cannot distribute fewer than three movable layer ids: ${JSON.stringify(layerIds)}`);
  }
  const transformCoordinate = axis === 'horizontal' ? 'x' : 'y';
  const orderedLayers = [...movableLayers].sort((firstLayer, secondLayer) => (
    firstLayer.transform[transformCoordinate] - secondLayer.transform[transformCoordinate]
  ));
  const firstCoordinate = orderedLayers[0]!.transform[transformCoordinate];
  const finalCoordinate = orderedLayers.at(-1)!.transform[transformCoordinate];
  const coordinateStep = (finalCoordinate - firstCoordinate) / (orderedLayers.length - 1);
  const coordinateByLayerId = new Map(orderedLayers.map((layer, index) => [
    layer.id,
    firstCoordinate + coordinateStep * index,
  ]));
  return withLayers(project, project.layers.map((layer) => {
    if (!isMovableLayer(layer)) return layer;
    const coordinate = coordinateByLayerId.get(layer.id);
    return coordinate === undefined
      ? layer
      : { ...layer, transform: { ...layer.transform, [transformCoordinate]: coordinate } };
  }));
}

function moveLayerIds(project: CoatProject, layerIds: string[], direction: LayerOrderDirection): CoatProject {
  assertLayerOrderDirection(direction);
  const movableLayerIds = assertMovableLayerIds(project, layerIds, 'movable layer ids');
  const selectedLayers = project.layers.filter((layer) => movableLayerIds.has(layer.id));
  const unselectedLayers = project.layers.filter((layer) => !movableLayerIds.has(layer.id));
  if (direction === 'front') return withLayers(project, [...unselectedLayers, ...selectedLayers]);
  if (direction === 'back') {
    const backgroundLayers = unselectedLayers.filter((layer) => layer.type === 'background');
    const movableUnselectedLayers = unselectedLayers.filter((layer) => layer.type !== 'background');
    return withLayers(project, [...backgroundLayers, ...selectedLayers, ...movableUnselectedLayers]);
  }
  const reorderedLayers = [...project.layers];
  if (direction === 'forward') {
    for (let index = reorderedLayers.length - 2; index >= 0; index -= 1) {
      if (movableLayerIds.has(reorderedLayers[index]!.id) && !movableLayerIds.has(reorderedLayers[index + 1]!.id)) {
        [reorderedLayers[index], reorderedLayers[index + 1]] = [reorderedLayers[index + 1]!, reorderedLayers[index]!];
      }
    }
  } else {
    for (let index = 2; index < reorderedLayers.length; index += 1) {
      if (movableLayerIds.has(reorderedLayers[index]!.id) && !movableLayerIds.has(reorderedLayers[index - 1]!.id)) {
        [reorderedLayers[index], reorderedLayers[index - 1]] = [reorderedLayers[index - 1]!, reorderedLayers[index]!];
      }
    }
  }
  return withLayers(project, reorderedLayers);
}

function setLayerIdsVisibility(project: CoatProject, layerIds: string[], visible: boolean): CoatProject {
  if (typeof visible !== 'boolean') throw new Error(`Invalid layer visibility: ${String(visible)}`);
  const movableLayerIds = assertMovableLayerIds(project, layerIds, 'movable layer ids');
  return withLayers(project, project.layers.map((layer) => (
    movableLayerIds.has(layer.id) ? { ...layer, visible } : layer
  )));
}

function setLayerIdsLock(project: CoatProject, layerIds: string[], locked: boolean): CoatProject {
  if (typeof locked !== 'boolean') throw new Error(`Invalid layer lock: ${String(locked)}`);
  const movableLayerIds = assertMovableLayerIds(project, layerIds, 'movable layer ids', { allowLocked: !locked });
  return withLayers(project, project.layers.map((layer) => (
    movableLayerIds.has(layer.id) ? { ...layer, locked } : layer
  )));
}

function groupLayerIds(project: CoatProject, groupId: string, layerIds: string[]): CoatProject {
  assertMovableLayerIds(project, layerIds, 'movable layer ids');
  return groupProjectLayers(project, groupId, layerIds);
}

function ungroupLayerIds(project: CoatProject, layerIds: string[]): CoatProject {
  const movableLayerIds = assertMovableLayerIds(project, layerIds, 'movable layer ids');
  const selectedLayers = project.layers.filter((layer) => movableLayerIds.has(layer.id));
  const selectedGroupId = selectedLayers[0]?.groupId;
  if (selectedGroupId === null || selectedGroupId === undefined) {
    throw new Error(`Cannot ungroup layer ids without a group: ${JSON.stringify(layerIds)}`);
  }
  if (selectedLayers.some((layer) => layer.groupId !== selectedGroupId)) {
    throw new Error(`Cannot ungroup layer ids from multiple groups: ${JSON.stringify(layerIds)}`);
  }
  return ungroupProjectLayers(project, selectedGroupId);
}

function setLayerIdsOpacity(project: CoatProject, layerIds: string[], opacity: number): CoatProject {
  assertOpacity(opacity, 'layer opacity');
  const movableLayerIds = assertMovableLayerIds(project, layerIds, 'movable layer ids');
  return withLayers(project, project.layers.map((layer) => (
    movableLayerIds.has(layer.id) && isMovableLayer(layer)
      ? { ...layer, transform: { ...layer.transform, opacity } }
      : layer
  )));
}

function resizeLayerIds(
  project: CoatProject,
  layerIds: string[],
  width: number,
  height: number,
  keepAspectRatio: boolean,
): CoatProject {
  assertLayerSize(width, 'layer width');
  assertLayerSize(height, 'layer height');
  if (typeof keepAspectRatio !== 'boolean') {
    throw new Error(`Invalid layer aspect ratio lock: ${String(keepAspectRatio)}`);
  }
  const movableLayerIds = assertMovableLayerIds(project, layerIds, 'movable layer ids');
  return withLayers(project, project.layers.map((layer) => {
    if (!movableLayerIds.has(layer.id) || !isMovableLayer(layer)) return layer;
    const currentHorizontalScale = layer.transform.scaleX ?? layer.transform.scale;
    const currentVerticalScale = layer.transform.scaleY ?? layer.transform.scale;
    const nextHorizontalScale = width / 100;
    const nextVerticalScale = keepAspectRatio
      ? nextHorizontalScale * (currentVerticalScale / currentHorizontalScale)
      : height / 100;
    return {
      ...layer,
      transform: {
        ...layer.transform,
        scale: nextHorizontalScale,
        scaleX: nextHorizontalScale,
        scaleY: nextVerticalScale,
      },
    };
  }));
}

function setProjectField(project: CoatProject, layerId: string, field: CoatField): CoatProject {
  const layer = getUnlockedLayer(project, layerId);
  if (layer.type !== 'shield') throw new Error(`Layer does not support a field: ${layerId}`);
  assertCoatField(field);
  return replaceLayer(project, layer.id, { ...layer, field: cloneField(field) });
}

function setCustomShieldMask(project: CoatProject, layerId: string, uploadId: string | undefined): CoatProject {
  const layer = getUnlockedLayer(project, layerId);
  if (layer.type !== 'shield') throw new Error(`Layer does not support a custom shield mask: ${layerId}`);
  if (uploadId === undefined) {
    const shieldWithoutCustomMask = { ...layer };
    delete shieldWithoutCustomMask.customMaskUploadId;
    return replaceLayer(project, layer.id, shieldWithoutCustomMask);
  }
  assertNonEmptyString(uploadId, 'custom shield mask upload id');
  if (!project.uploads.some((upload) => upload.id === uploadId)) {
    throw new Error(`Unknown custom shield mask upload: ${uploadId}`);
  }
  return replaceLayer(project, layer.id, { ...layer, customMaskUploadId: uploadId });
}

function setCustomShieldOutline(project: CoatProject, layerId: string, path: string | undefined): CoatProject {
  const layer = getUnlockedLayer(project, layerId);
  if (layer.type !== 'shield') throw new Error(`Layer does not support a custom shield outline: ${layerId}`);
  if (path === undefined) {
    const shieldWithLibraryOutline = { ...layer };
    delete shieldWithLibraryOutline.customOutlinePath;
    return replaceLayer(project, layer.id, shieldWithLibraryOutline);
  }
  return replaceLayer(project, layer.id, { ...layer, customOutlinePath: normalizeCustomShieldOutlinePath(path) });
}

function setProjectBackground(
  project: CoatProject,
  assetId: string,
  motif: FieldPattern = 'solid',
  opacity: number = 1,
  fill: string | undefined = undefined,
  gradient: BackgroundGradient | null | undefined = undefined,
): CoatProject {
  const asset = getCoatAsset(assetId);
  if (asset.kind !== 'background') throw new Error(`Asset is not a background: ${assetId}`);
  assertFieldPattern(motif);
  assertOpacity(opacity, 'background opacity');
  if (fill !== undefined) assertColor(fill, 'background fill');
  if (gradient !== undefined && gradient !== null) assertBackgroundGradient(gradient);
  const backgroundLayer = project.layers.find((layer) => layer.type === 'background');
  if (!backgroundLayer) {
    const createdBackgroundLayer = createAssetLayer(asset);
    if (createdBackgroundLayer.type !== 'background') {
      throw new Error(`Expected background layer for asset: ${assetId}`);
    }
    return withLayers(project, [{ ...createdBackgroundLayer, motif, opacity, ...(fill ? { fill } : {}), ...(gradient ? { gradient } : {}) }, ...project.layers]);
  }
  getUnlockedLayer(project, backgroundLayer.id);
  const updatedBackgroundLayer = { ...backgroundLayer, assetId: asset.id, motif, opacity, ...(fill ? { fill } : {}) };
  if (gradient === null) delete updatedBackgroundLayer.gradient;
  if (gradient) updatedBackgroundLayer.gradient = { ...gradient };
  return replaceLayer(project, backgroundLayer.id, updatedBackgroundLayer);
}

function setProjectCanvasSize(project: CoatProject, width: number, height: number): CoatProject {
  const canvas = { width, height };
  assertCanvas(canvas);
  return { ...project, canvas };
}

function addDrawingLayer(
  project: CoatProject,
  command: Extract<CoatProjectCommand, { type: 'add-drawing-layer' }>,
): CoatProject {
  assertDrawingPath(command.path);
  assertColor(command.color, 'drawing color');
  assertStrokeWidth(command.strokeWidth);
  const transform = command.transform ?? defaultTransform();
  assertTransform(transform);
  const layer: CoatLayer = {
    id: createLayerId(), type: 'draw', path: command.path, color: command.color,
    strokeWidth: command.strokeWidth, transform: cloneCanvasTransform(transform), visible: true, locked: false, groupId: null,
  };
  return withLayers(project, [...project.layers, layer]);
}

function setProjectName(project: CoatProject, name: string): CoatProject {
  assertProjectName(name);
  return { ...project, name };
}

function addTextLayer(
  project: CoatProject,
  command: Extract<CoatProjectCommand, { type: 'add-text-layer' }>,
): CoatProject {
  assertTextLength(command.text);
  assertColor(command.color, 'text layer color');
  assertPositiveFiniteNumber(command.fontSize, 'text layer font size');
  const fontFamily = command.fontFamily ?? 'serif';
  const fontStyle = command.fontStyle ?? 'normal';
  const fontWeight = command.fontWeight ?? 'normal';
  assertTextFontFamily(fontFamily);
  assertTextFontStyle(fontStyle);
  assertTextFontWeight(fontWeight);
  assertTextAlignment(command.alignment);
  assertTextPath(command.path);
  const transform = command.transform ?? defaultTransform();
  assertTransform(transform);
  return withLayers(project, [
    ...project.layers,
    {
      id: createLayerId(), type: 'text', text: command.text, color: command.color,
      fontSize: command.fontSize, fontFamily, fontStyle, fontWeight, alignment: command.alignment, path: cloneTextPath(command.path),
      transform: cloneCanvasTransform(transform), visible: true, locked: false, groupId: null,
    },
  ]);
}

function removeTextLayer(project: CoatProject, layerId: string): CoatProject {
  const layer = getUnlockedLayer(project, layerId);
  if (layer.type !== 'text') throw new Error(`Layer is not a text layer: ${layerId}`);
  return withLayers(project, project.layers.filter((candidate) => candidate.id !== layerId));
}

function registerLocalUpload(project: CoatProject, upload: LocalUpload): CoatProject {
  assertLocalUpload(upload);
  if (project.uploads.some((candidate) => candidate.id === upload.id)) {
    throw new Error(`Duplicate local upload id: ${upload.id}`);
  }
  const nextProject = { ...project, uploads: [...project.uploads, { ...upload }] };
  assertCoatProject(nextProject);
  return nextProject;
}

/** Adds a fully validated upload selection in one history entry, or changes nothing. */
function addLocalUploadImages(project: CoatProject, uploads: LocalUpload[]): CoatProject {
  if (!Array.isArray(uploads) || uploads.length === 0) {
    throw new Error('Local upload image selection must contain at least one file');
  }
  const existingUploadIds = new Set(project.uploads.map((upload) => upload.id));
  const selectedUploadIds = new Set<string>();
  for (const upload of uploads) {
    assertLocalUpload(upload);
    if (existingUploadIds.has(upload.id) || selectedUploadIds.has(upload.id)) {
      throw new Error(`Duplicate local upload id: ${upload.id}`);
    }
    selectedUploadIds.add(upload.id);
  }
  const projectWithUploads: CoatProject = {
    ...project,
    uploads: [...project.uploads, ...uploads.map((upload) => ({ ...upload }))],
  };
  assertCoatProject(projectWithUploads);
  const nextLayerCount = project.layers.length + uploads.length;
  if (nextLayerCount > COAT_PROJECT_LIMITS.maxLayerCount) {
    throw new Error(`Invalid project layer count: ${nextLayerCount}; limit is ${COAT_PROJECT_LIMITS.maxLayerCount}`);
  }
  return uploads.reduce((projectWithImageLayers, upload) => (
    addImageLayer(projectWithImageLayers, { type: 'add-image-layer', uploadId: upload.id })
  ), projectWithUploads);
}

function removeLocalUpload(project: CoatProject, uploadId: string): CoatProject {
  assertNonEmptyString(uploadId, 'local upload id');
  if (!project.uploads.some((upload) => upload.id === uploadId)) {
    throw new Error(`Unknown local upload id: ${uploadId}`);
  }
  if (project.layers.some((layer) => layer.type === 'image' && layer.uploadId === uploadId)) {
    throw new Error(`Local upload is still referenced by an image layer: ${uploadId}`);
  }
  if (project.layers.some((layer) => layer.type === 'shield' && layer.customMaskUploadId === uploadId)) {
    throw new Error(`Local upload is still referenced by a custom shield mask: ${uploadId}`);
  }
  return { ...project, uploads: project.uploads.filter((upload) => upload.id !== uploadId) };
}

function addImageLayer(
  project: CoatProject,
  command: Extract<CoatProjectCommand, { type: 'add-image-layer' }>,
): CoatProject {
  assertNonEmptyString(command.uploadId, 'local upload id');
  const upload = project.uploads.find((candidate) => candidate.id === command.uploadId);
  if (!upload) throw new Error(`Unknown local upload id: ${command.uploadId}`);
  const opacity = command.opacity ?? 1;
  const transform = command.transform ?? defaultTransform();
  assertOpacity(opacity, 'image layer opacity');
  assertTransform(transform);
  return withLayers(project, [
    ...project.layers,
    {
      id: createLayerId(), type: 'image', source: 'local-upload', uploadId: upload.id,
      mimeType: upload.mimeType, opacity, transform: cloneCanvasTransform(transform), visible: true,
      locked: false, groupId: null,
    },
  ]);
}

function removeImageLayer(project: CoatProject, layerId: string): CoatProject {
  const layer = getUnlockedLayer(project, layerId);
  if (layer.type !== 'image') throw new Error(`Layer is not an image layer: ${layerId}`);
  return withLayers(project, project.layers.filter((candidate) => candidate.id !== layerId));
}

function replaceAllColour(project: CoatProject, fromColor: string, toColor: string): CoatProject {
  assertColor(fromColor, 'source color');
  assertColor(toColor, 'replacement color');
  const replaceColor = (color: string) => (color.toUpperCase() === fromColor.toUpperCase() ? toColor : color);
  const recoloredProject = withLayersAndGroups(project, project.layers.map((layer) => {
      if (layer.type === 'shield') {
        return {
          ...layer,
          field: replaceShieldFieldColours(layer.field, replaceColor),
        };
      }
      if (layer.type === 'ordinary' || layer.type === 'charge' || layer.type === 'top' || layer.type === 'draw' || layer.type === 'text') {
        return {
          ...layer,
          color: replaceColor(layer.color),
          ...('colorReplacements' in layer && layer.colorReplacements ? {
            colorReplacements: Object.fromEntries(Object.entries(layer.colorReplacements).map(([sourceColor, replacementColor]) => [sourceColor, replaceColor(replacementColor)])),
          } : {}),
        };
      }
      return layer;
    }), project.groups);
  return {
    ...recoloredProject,
    palette: uniqueColors(project.palette.map(replaceColor)),
  };
}

function replaceProjectLayerColour(project: CoatProject, layerId: string, fromColor: string, toColor: string): CoatProject {
  assertColor(fromColor, 'source color');
  assertColor(toColor, 'replacement color');
  const layer = getUnlockedLayer(project, layerId);
  return replaceLayer(project, layer.id, replaceEditableLayerColour(layer, fromColor, toColor));
}

function replaceShieldFieldColours(field: CoatField, replaceColor: (color: string) => string): CoatField {
  return {
    ...field,
    colors: field.colors.map(replaceColor),
    ...(field.regions ? {
      regions: Object.fromEntries(Object.entries(field.regions).map(([regionId, region]) => [
        regionId,
        region ? { ...region, colors: region.colors.map(replaceColor) } : region,
      ])),
    } : {}),
    ...(field.ornaments ? {
      ornaments: field.ornaments.map((ornament) => ({
        ...ornament,
        color: replaceColor(ornament.color),
        ...(ornament.colors ? { colors: ornament.colors.map(replaceColor) } : {}),
      })),
    } : {}),
    ...(field.outline ? { outline: { ...field.outline, color: replaceColor(field.outline.color) } } : {}),
  };
}

function addCustomPaletteColor(project: CoatProject, color: string): CoatProject {
  assertColor(color, 'custom palette color');
  if (project.palette.some((candidate) => candidate.toUpperCase() === color.toUpperCase())) {
    throw new Error(`Duplicate custom palette color: ${color}`);
  }
  return { ...project, palette: [...project.palette, color] };
}

function removeCustomPaletteColor(project: CoatProject, color: string): CoatProject {
  assertColor(color, 'custom palette color');
  if (!project.palette.some((candidate) => candidate.toUpperCase() === color.toUpperCase())) {
    throw new Error(`Unknown custom palette color: ${color}`);
  }
  return { ...project, palette: project.palette.filter((candidate) => candidate.toUpperCase() !== color.toUpperCase()) };
}

function createAssetLayer(
  asset: ReturnType<typeof getCoatAsset>,
  rasterVariantId?: CoatRasterVariantId,
): CoatLayer {
  const layerMetadata = { id: createLayerId(), visible: true, locked: false, groupId: null };
  switch (asset.kind) {
    case 'background':
      if (rasterVariantId !== undefined) throw new Error(`Asset does not support a raster variant: ${asset.id}`);
      return { ...layerMetadata, type: 'background', assetId: asset.id, motif: 'solid', opacity: 1 };
    case 'shield':
      if (rasterVariantId !== undefined) throw new Error(`Asset does not support a raster variant: ${asset.id}`);
      return {
        ...layerMetadata,
        type: 'shield',
        assetId: asset.id,
        field: { division: 'solid', colors: ['#1855A5'], pattern: 'solid' },
        transform: defaultTransform(),
      };
    case 'ordinary':
      if (rasterVariantId !== undefined) throw new Error(`Asset does not support a raster variant: ${asset.id}`);
      return {
        ...layerMetadata,
        type: 'ordinary',
        assetId: asset.id,
        color: '#B11F24',
        transform: defaultTransform(),
      };
    case 'charge':
    case 'top':
      const selectedRasterVariantId = getSelectedRasterVariantId(asset, rasterVariantId);
      return {
        ...layerMetadata,
        type: asset.kind,
        assetId: asset.id,
        ...(selectedRasterVariantId ? { rasterVariantId: selectedRasterVariantId } : {}),
        color: '#B11F24',
        transform: defaultTransform(),
      };
    case 'pattern':
      throw new Error(`Asset cannot be added as a layer: ${asset.id}`);
  }
}

function getSelectedRasterVariantId(
  asset: Extract<ReturnType<typeof getCoatAsset>, { kind: 'charge' | 'top' }>,
  requestedVariantId: CoatRasterVariantId | undefined,
): CoatRasterVariantId | undefined {
  if (!asset.rasterVariants) {
    if (requestedVariantId !== undefined) throw new Error(`Asset does not support a raster variant: ${asset.id}`);
    return undefined;
  }
  const selectedVariantId = requestedVariantId ?? asset.rasterVariants[0].id;
  if (!asset.rasterVariants.some((variant) => variant.id === selectedVariantId)) {
    throw new Error(`Invalid raster variant ${String(requestedVariantId)} for asset: ${asset.id}`);
  }
  return selectedVariantId;
}

function getLayerById(project: CoatProject, layerId: string): CoatLayer {
  assertNonEmptyString(layerId, 'layer id');
  const layer = project.layers.find((candidate) => candidate.id === layerId);
  if (!layer) throw new Error(`Unknown coat layer id: ${layerId}`);
  return layer;
}

function getUnlockedLayer(project: CoatProject, layerId: string): CoatLayer {
  const layer = getLayerById(project, layerId);
  if (layer.locked) throw new Error(`Coat layer is locked: ${layer.id}`);
  return layer;
}

function assertBaseLayerCanBeRemoved(project: CoatProject, removedLayers: CoatLayer[]): void {
  for (const baseLayerType of ['background', 'shield'] as const) {
    const remainingLayerCount = project.layers.filter((layer) => (
      layer.type === baseLayerType && !removedLayers.some((removedLayer) => removedLayer.id === layer.id)
    )).length;
    if (remainingLayerCount === 0) {
      const removedBaseLayer = removedLayers.find((layer) => layer.type === baseLayerType);
      throw new Error(`Cannot remove the sole base ${baseLayerType} layer: ${removedBaseLayer?.id}`);
    }
  }
}

function assertRequiredBaseLayers(layers: CoatLayer[]): void {
  for (const baseLayerType of ['background', 'shield'] as const) {
    const baseLayerCount = layers.filter((layer) => layer.type === baseLayerType).length;
    if (baseLayerCount === 0) {
      throw new Error(`Invalid project base ${baseLayerType} layer count: ${baseLayerCount}; minimum is 1`);
    }
  }
}

function replaceLayer(project: CoatProject, layerId: string, updatedLayer: CoatLayer): CoatProject {
  return withLayers(
    project,
    project.layers.map((layer) => (layer.id === layerId ? updatedLayer : layer)),
  );
}

function withLayers(project: CoatProject, layers: CoatLayer[]): CoatProject {
  return withLayersAndGroups(project, layers, project.groups);
}

function applyLayerPatch(layer: CoatLayer, patch: CoatLayerPatch): CoatLayer {
  const clonedPatch = cloneLayerPatch(patch);
  if (layer.type === 'draw' && clonedPatch.pathData !== undefined) {
    const { pathData, ...remainingPatch } = clonedPatch;
    return { ...layer, ...remainingPatch, path: pathData };
  }
  return { ...layer, ...clonedPatch } as CoatLayer;
}

function withLayersAndGroups(
  project: CoatProject,
  layers: CoatLayer[],
  groups: CoatGroup[],
): CoatProject {
  const normalized = normalizeLayerGroups(layers, groups);
  assertGroupMemberships(normalized.layers, normalized.groups);
  const nextProject = { ...project, layers: normalized.layers, groups: normalized.groups };
  assertCoatProject(nextProject);
  return nextProject;
}

function assertProjectCommand(command: unknown): asserts command is CoatProjectCommand {
  if (!isRecord(command) || typeof command.type !== 'string') {
    throw new Error(`Invalid coat project command: ${String(command)}`);
  }
  const validTypes = new Set<CoatProjectCommand['type']>([
    'add-layer', 'update-layer', 'update-layers', 'remove-layer', 'remove-layers', 'duplicate-layers', 'move-layer', 'set-layer-visibility',
    'set-layer-lock', 'group-layers', 'ungroup-layers', 'set-group-opacity', 'align-layer-ids', 'distribute-layer-ids', 'move-layer-ids', 'set-layer-ids-visibility', 'set-layer-ids-lock', 'group-layer-ids', 'ungroup-layer-ids', 'set-layer-ids-opacity', 'resize-layer-ids', 'set-field', 'set-custom-shield-mask', 'set-custom-shield-outline', 'set-background', 'set-canvas-size', 'add-drawing-layer', 'set-project-name',
    'add-text-layer', 'remove-text-layer', 'register-local-upload', 'add-local-upload-images', 'remove-local-upload',
    'add-image-layer', 'remove-image-layer', 'replace-layer-colour', 'replace-all-colour', 'add-custom-palette-color',
    'remove-custom-palette-color',
  ]);
  if (!validTypes.has(command.type as CoatProjectCommand['type'])) {
    throw new Error(`Invalid coat project command type: ${command.type}`);
  }
  const allowedCommandKeys: Record<CoatProjectCommand['type'], readonly string[]> = {
    'add-layer': ['type', 'assetId', 'rasterVariantId'],
    'update-layer': ['type', 'layerId', 'patch'],
    'update-layers': ['type', 'updates'],
    'remove-layer': ['type', 'layerId'],
    'remove-layers': ['type', 'layerIds'],
    'duplicate-layers': ['type', 'sourceLayerIds', 'newLayerIds'],
    'move-layer': ['type', 'layerId', 'toIndex'],
    'set-layer-visibility': ['type', 'layerId', 'visible'],
    'set-layer-lock': ['type', 'layerId', 'locked'],
    'group-layers': ['type', 'groupId', 'layerIds'],
    'ungroup-layers': ['type', 'groupId'],
    'set-group-opacity': ['type', 'groupId', 'opacity'],
    'align-layer-ids': ['type', 'axis', 'layerIds'],
    'distribute-layer-ids': ['type', 'axis', 'layerIds'],
    'move-layer-ids': ['type', 'direction', 'layerIds'],
    'set-layer-ids-visibility': ['type', 'layerIds', 'visible'],
    'set-layer-ids-lock': ['type', 'layerIds', 'locked'],
    'group-layer-ids': ['type', 'groupId', 'layerIds'],
    'ungroup-layer-ids': ['type', 'layerIds'],
    'set-layer-ids-opacity': ['type', 'layerIds', 'opacity'],
    'resize-layer-ids': ['type', 'layerIds', 'width', 'height', 'keepAspectRatio'],
    'set-field': ['type', 'layerId', 'field'],
    'set-custom-shield-mask': ['type', 'layerId', 'uploadId'],
    'set-custom-shield-outline': ['type', 'layerId', 'path'],
    'set-background': ['type', 'assetId', 'motif', 'opacity', 'fill', 'gradient'],
    'set-canvas-size': ['type', 'width', 'height'],
    'add-drawing-layer': ['type', 'path', 'color', 'strokeWidth', 'transform'],
    'set-project-name': ['type', 'name'],
    'add-text-layer': ['type', 'text', 'color', 'fontSize', 'fontFamily', 'fontStyle', 'fontWeight', 'alignment', 'path', 'transform'],
    'remove-text-layer': ['type', 'layerId'],
    'register-local-upload': ['type', 'upload'],
    'add-local-upload-images': ['type', 'uploads'],
    'remove-local-upload': ['type', 'uploadId'],
    'add-image-layer': ['type', 'uploadId', 'opacity', 'transform'],
    'remove-image-layer': ['type', 'layerId'],
    'replace-layer-colour': ['type', 'layerId', 'fromColor', 'toColor'],
    'replace-all-colour': ['type', 'fromColor', 'toColor'],
    'add-custom-palette-color': ['type', 'color'],
    'remove-custom-palette-color': ['type', 'color'],
  };
  assertExactKeys(command, allowedCommandKeys[command.type as CoatProjectCommand['type']], 'coat project command');
}

function assertLayerPatch(layer: CoatLayer, patch: unknown): asserts patch is CoatLayerPatch {
  if (!isRecord(patch) || Object.keys(patch).length === 0) {
    throw new Error(`Invalid layer patch: ${String(patch)}`);
  }
  const allowedPatchKeys: Record<CoatLayer['type'], readonly string[]> = {
    background: ['assetId', 'motif', 'opacity', 'fill'], shield: ['assetId', 'field', 'transform'],
    ordinary: ['assetId', 'color', 'colorReplacements', 'transform'], charge: ['assetId', 'color', 'colorReplacements', 'transform'], top: ['assetId', 'color', 'colorReplacements', 'transform'],
    draw: ['pathData', 'color', 'strokeWidth', 'transform'],
    image: ['opacity', 'transform'], text: ['text', 'color', 'fontSize', 'fontFamily', 'fontStyle', 'fontWeight', 'alignment', 'path', 'transform'],
  };
  for (const patchKey of Object.keys(patch)) {
    if (!allowedPatchKeys[layer.type].includes(patchKey)) {
      throw new Error(`Invalid ${layer.type} layer patch key: ${patchKey}`);
    }
  }
  if ('assetId' in patch) assertLayerAsset(layer.type, patch.assetId);
  if ('color' in patch) assertColor(patch.color, 'layer color');
  if ('colorReplacements' in patch) assertLayerColorReplacements(layer, patch.colorReplacements);
  if ('field' in patch) assertCoatField(patch.field);
  if ('text' in patch) assertTextLength(patch.text);
  if ('fontSize' in patch) assertPositiveFiniteNumber(patch.fontSize, 'text layer font size');
  if ('fontFamily' in patch) assertTextFontFamily(patch.fontFamily);
  if ('fontStyle' in patch) assertTextFontStyle(patch.fontStyle);
  if ('fontWeight' in patch) assertTextFontWeight(patch.fontWeight);
  if ('opacity' in patch) assertOpacity(patch.opacity, `${layer.type} layer opacity`);
  if ('fill' in patch) assertColor(patch.fill, 'background fill');
  if ('strokeWidth' in patch) assertStrokeWidth(patch.strokeWidth);
  if ('pathData' in patch) assertDrawingPath(patch.pathData);
  if ('motif' in patch) assertFieldPattern(patch.motif);
  if ('alignment' in patch) assertTextAlignment(patch.alignment);
  if ('path' in patch) assertTextPath(patch.path);
  if ('transform' in patch) assertTransform(patch.transform);
}

function assertCoatLayer(layer: unknown, uploadById: Map<string, LocalUpload>): asserts layer is CoatLayer {
  if (!isRecord(layer) || !validLayerTypes.includes(layer.type as typeof validLayerTypes[number])) {
    throw new Error(`Invalid coat layer: ${String(layer)}`);
  }
  assertNonEmptyString(layer.id, 'layer id');
  if (typeof layer.visible !== 'boolean') throw new Error(`Invalid layer visibility: ${String(layer.visible)}`);
  if (typeof layer.locked !== 'boolean') throw new Error(`Invalid layer lock: ${String(layer.locked)}`);
  if (layer.groupId !== null) assertGroupId(layer.groupId);
  switch (layer.type) {
    case 'background':
      assertExactKeys(layer, ['id', 'type', 'assetId', 'motif', 'opacity', 'fill', 'gradient', 'visible', 'locked', 'groupId'], 'background layer');
      assertLayerAsset('background', layer.assetId); assertFieldPattern(layer.motif); assertOpacity(layer.opacity, 'background opacity'); if ('fill' in layer) assertColor(layer.fill, 'background fill'); if ('gradient' in layer) assertBackgroundGradient(layer.gradient);
      return;
    case 'shield':
      assertExactKeys(layer, ['id', 'type', 'assetId', 'customMaskUploadId', 'customOutlinePath', 'field', 'transform', 'visible', 'locked', 'groupId'], 'shield layer');
      assertLayerAsset('shield', layer.assetId); if ('customMaskUploadId' in layer) { assertNonEmptyString(layer.customMaskUploadId, 'custom shield mask upload id'); if (!uploadById.has(layer.customMaskUploadId)) throw new Error(`Invalid custom shield mask upload: ${layer.customMaskUploadId}`); } if ('customOutlinePath' in layer) assertCustomShieldOutlinePath(layer.customOutlinePath); assertCoatField(layer.field); assertTransform(layer.transform); return;
    case 'ordinary':
    case 'charge':
    case 'top':
      assertExactKeys(layer, ['id', 'type', 'assetId', 'rasterVariantId', 'color', 'colorReplacements', 'transform', 'visible', 'locked', 'groupId'], `${layer.type} layer`);
      assertNonEmptyString(layer.assetId, `${layer.type} layer asset id`); assertLayerAsset(layer.type, layer.assetId); if ('rasterVariantId' in layer) assertLayerRasterVariant(layer.assetId, layer.rasterVariantId); assertColor(layer.color, 'layer color'); if ('colorReplacements' in layer) assertAssetColorReplacements(layer.assetId, layer.colorReplacements); assertTransform(layer.transform); return;
    case 'draw':
      assertExactKeys(layer, ['id', 'type', 'path', 'color', 'strokeWidth', 'transform', 'visible', 'locked', 'groupId'], 'draw layer');
      assertDrawingPath(layer.path); assertColor(layer.color, 'drawing color'); assertStrokeWidth(layer.strokeWidth); assertTransform(layer.transform); return;
    case 'image':
      assertExactKeys(layer, ['id', 'type', 'source', 'uploadId', 'mimeType', 'opacity', 'transform', 'visible', 'locked', 'groupId'], 'image layer');
      assertNonEmptyString(layer.uploadId, 'local upload layer id');
      const upload = uploadById.get(layer.uploadId);
      if (layer.source !== 'local-upload' || !upload) throw new Error(`Invalid local upload layer: ${String(layer.uploadId)}`);
      assertMimeType(layer.mimeType); if (layer.mimeType !== upload.mimeType) throw new Error(`Image layer mime type does not match upload: ${layer.uploadId}`);
      assertOpacity(layer.opacity, 'image layer opacity');
      assertTransform(layer.transform); return;
    case 'text':
      assertExactKeys(layer, ['id', 'type', 'text', 'color', 'fontSize', 'fontFamily', 'fontStyle', 'fontWeight', 'alignment', 'path', 'transform', 'visible', 'locked', 'groupId'], 'text layer');
      assertTextLength(layer.text); assertColor(layer.color, 'text layer color'); assertPositiveFiniteNumber(layer.fontSize, 'text layer font size'); if ('fontFamily' in layer) assertTextFontFamily(layer.fontFamily); if ('fontStyle' in layer) assertTextFontStyle(layer.fontStyle); if ('fontWeight' in layer) assertTextFontWeight(layer.fontWeight); assertTextAlignment(layer.alignment); assertTextPath(layer.path); assertTransform(layer.transform); return;
  }
}

function assertLocalUpload(upload: unknown): number {
  if (!isRecord(upload)) throw new Error(`Invalid local upload: ${String(upload)}`);
  assertExactKeys(upload, ['id', 'mimeType', 'encoding', 'data'], 'local upload');
  assertNonEmptyString(upload.id, 'local upload id'); assertMimeType(upload.mimeType);
  if (upload.encoding !== 'base64') throw new Error(`Invalid local upload encoding: ${String(upload.encoding)}`);
  const uploadBytes = decodeLocalUploadBase64(upload.data);
  if (uploadBytes.length > COAT_PROJECT_LIMITS.maxLocalUploadBytes) {
    throw new Error(`Invalid local upload bytes: ${uploadBytes.length}; limit is ${COAT_PROJECT_LIMITS.maxLocalUploadBytes}`);
  }
  assertLocalUploadContent(upload.mimeType, uploadBytes);
  return uploadBytes.length;
}

function decodeLocalUploadBase64(data: unknown): Uint8Array {
  if (typeof data !== 'string' || !isStrictNonEmptyBase64(data)) {
    throw new Error(`Invalid local upload data: ${String(data)}`);
  }
  if (typeof globalThis.atob === 'function') {
    try {
      const binaryData = globalThis.atob(data);
      return Uint8Array.from(binaryData, (character) => character.charCodeAt(0));
    } catch {
      throw new Error(`Invalid local upload data: ${data}`);
    }
  }
  const nodeBuffer = (globalThis as unknown as {
    Buffer?: { from: (value: string, encoding: 'base64') => Uint8Array };
  }).Buffer;
  if (nodeBuffer) return Uint8Array.from(nodeBuffer.from(data, 'base64'));
  throw new Error('Base64 decoder is unavailable for local upload data');
}

function isStrictNonEmptyBase64(data: string): boolean {
  return data.length > 0 && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data);
}

function assertLocalUploadContent(mimeType: unknown, uploadBytes: Uint8Array): void {
  switch (mimeType) {
    case 'image/png':
      if (!hasBytePrefix(uploadBytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
        throw new Error('Invalid local upload MIME content: image/png');
      }
      return;
    case 'image/jpeg':
      if (!hasBytePrefix(uploadBytes, [0xff, 0xd8])) {
        throw new Error('Invalid local upload MIME content: image/jpeg');
      }
      return;
    case 'image/webp':
      if (!hasBytePrefix(uploadBytes, [0x52, 0x49, 0x46, 0x46]) || !hasBytePrefix(uploadBytes, [0x57, 0x45, 0x42, 0x50], 8)) {
        throw new Error('Invalid local upload MIME content: image/webp');
      }
      return;
    case 'image/svg+xml':
      assertSafeLocalSvg(decodeUtf8LocalUpload(uploadBytes));
      return;
    default:
      throw new Error(`Invalid local upload mime type: ${String(mimeType)}`);
  }
}

function hasBytePrefix(bytes: Uint8Array, expectedBytes: number[], offset: number = 0): boolean {
  return bytes.length >= offset + expectedBytes.length && expectedBytes.every((byte, index) => bytes[offset + index] === byte);
}

function decodeUtf8LocalUpload(uploadBytes: Uint8Array): string {
  if (typeof globalThis.TextDecoder !== 'function') {
    throw new Error('UTF-8 decoder is unavailable for local SVG upload data');
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(uploadBytes);
  } catch {
    throw new Error('Invalid UTF-8 local SVG upload data');
  }
}

function assertSafeLocalSvg(svgText: string): void {
  const normalizedSvg = svgText.replace(/^\uFEFF/, '').trimStart();
  if (!/^<svg(?:\s|>)/i.test(normalizedSvg)) {
    throw new Error('Invalid local SVG content: expected <svg document');
  }
  if (/<!DOCTYPE\b|<!ENTITY\b|\bENTITY\b/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: declaration');
  }
  if (/&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]+);/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: XML entity');
  }
  if (/<\/?(?:script|foreignObject|image|use|feImage|audio|video|iframe|object|embed)\b/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: non-geometry element');
  }
  if (/\bon[a-z]+\s*=/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: event handler attribute');
  }
  if (/\b(?:(?:xlink\s*:)?href|src)\s*=/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: resource reference attribute');
  }
  if (/<style\b|\bstyle\s*=/i.test(normalizedSvg) || /url\s*\(/i.test(normalizedSvg) || /@import\b/i.test(normalizedSvg)) {
    throw new Error('Unsafe local SVG content: CSS dependency');
  }
  if (/\b(?:https?|file|javascript|data)\s*:|\/\//i.test(normalizedSvg.replace(/\bxmlns\s*=\s*(['"])[^'"]*\1/ig, ''))) {
    throw new Error('Unsafe local SVG content: external protocol');
  }
}

function assertCanvas(canvas: unknown): void {
  if (!isRecord(canvas)) throw new Error(`Invalid project canvas: ${String(canvas)}`);
  assertExactKeys(canvas, ['width', 'height'], 'project canvas');
  assertPositiveFiniteNumber(canvas.width, 'canvas width'); assertPositiveFiniteNumber(canvas.height, 'canvas height');
  if (canvas.width > COAT_PROJECT_LIMITS.maxCanvasDimension) {
    throw new Error(`Invalid canvas width: ${canvas.width}; limit is ${COAT_PROJECT_LIMITS.maxCanvasDimension}`);
  }
  if (canvas.height > COAT_PROJECT_LIMITS.maxCanvasDimension) {
    throw new Error(`Invalid canvas height: ${canvas.height}; limit is ${COAT_PROJECT_LIMITS.maxCanvasDimension}`);
  }
}

function assertProjectPalette(palette: unknown): asserts palette is string[] {
  if (!Array.isArray(palette)) throw new Error(`Invalid project palette: ${String(palette)}`);
  const normalizedColors = new Set<string>();
  for (const color of palette) {
    assertColor(color, 'custom palette color');
    const normalizedColor = color.toUpperCase();
    if (normalizedColors.has(normalizedColor)) throw new Error(`Duplicate custom palette color: ${color}`);
    normalizedColors.add(normalizedColor);
  }
}

function assertGroupMemberships(layers: CoatLayer[], groups: unknown[]): void {
  const groupMemberCounts = new Map<string, number>();
  const groupLayerIndices = new Map<string, number[]>();
  for (const [layerIndex, layer] of layers.entries()) {
    if (layer.groupId !== null) {
      groupMemberCounts.set(layer.groupId, (groupMemberCounts.get(layer.groupId) ?? 0) + 1);
      const layerIndices = groupLayerIndices.get(layer.groupId) ?? [];
      layerIndices.push(layerIndex);
      groupLayerIndices.set(layer.groupId, layerIndices);
    }
  }
  const metadataById = new Map<string, CoatGroup>();
  for (const group of groups) {
    assertCoatGroup(group);
    if (metadataById.has(group.id)) throw new Error(`Duplicate coat group id: ${group.id}`);
    metadataById.set(group.id, group);
  }
  for (const [groupId, memberCount] of groupMemberCounts) {
    if (memberCount < 2) throw new Error(`Invalid layer group membership: ${groupId}`);
    if (!metadataById.has(groupId)) throw new Error(`Missing coat group metadata: ${groupId}`);
    assertGroupLayerIndicesAreContiguous(groupLayerIndices.get(groupId)!, groupId);
  }
  for (const groupId of metadataById.keys()) {
    if (!groupMemberCounts.has(groupId)) throw new Error(`Unused coat group metadata: ${groupId}`);
  }
}

function assertSelectedGroupLayerIdsAreContiguous(
  layers: CoatLayer[],
  selectedIds: Set<string>,
  groupId: string,
): void {
  const selectedLayerIndices = layers.flatMap((layer, layerIndex) => (
    selectedIds.has(layer.id) ? [layerIndex] : []
  ));
  assertGroupLayerIndicesAreContiguous(selectedLayerIndices, groupId, 'group layer selection');
}

function assertGroupLayerIndicesAreContiguous(
  layerIndices: number[],
  groupId: string,
  label: 'coat group membership' | 'group layer selection' = 'coat group membership',
): void {
  for (let index = 1; index < layerIndices.length; index += 1) {
    if (layerIndices[index] !== layerIndices[index - 1]! + 1) {
      const errorPrefix = label === 'coat group membership'
        ? 'Non-contiguous coat group membership'
        : 'Non-contiguous group layer selection';
      throw new Error(`${errorPrefix}: ${groupId}`);
    }
  }
}

function assertCoatGroup(group: unknown): asserts group is CoatGroup {
  if (!isRecord(group)) throw new Error(`Invalid coat group: ${String(group)}`);
  assertExactKeys(group, ['id', 'opacity'], 'coat group');
  assertGroupId(group.id);
  assertOpacity(group.opacity, 'group opacity');
}

function assertCoatField(field: unknown): asserts field is CoatField {
  if (!isCoatFieldCore(field)) {
    throw new Error(`Invalid coat field: ${String(field)}`);
  }
  assertExactKeys(field, ['division', 'colors', 'pattern', 'patternConfig', 'regions', 'divisionLine', 'ornaments', 'outline'], 'coat field');
  const minimumColors = field.division === 'solid' && field.pattern === 'solid' ? 1 : 2;
  if (field.colors.length < minimumColors) throw new Error(`Invalid coat field colors for ${field.division}/${field.pattern}: ${field.colors.length}`);
  for (const color of field.colors) assertColor(color, 'field color');
  assertFieldPatternConfig(field.pattern, field.patternConfig);
  assertFieldRegions(field.division, field.regions, field.divisionLine, validPatterns);
  if (field.divisionLine !== undefined) assertFieldDivisionLine(field.division, field.divisionLine);
  if (field.ornaments !== undefined) assertFieldOrnaments(field.ornaments);
  if (field.outline !== undefined) assertFieldOutline(field.outline);
}

function isCoatFieldCore(value: unknown): value is Record<string, unknown> & {
  division: FieldDivision;
  colors: string[];
  pattern: FieldPattern;
  regions?: unknown;
  divisionLine?: unknown;
  ornaments?: unknown;
  outline?: unknown;
} {
  return isRecord(value)
    && validDivisions.some((division) => division === value.division)
    && validPatterns.some((pattern) => pattern === value.pattern)
    && Array.isArray(value.colors)
    && value.colors.every((color) => typeof color === 'string');
}

function assertFieldDivisionLine(division: FieldDivision, divisionLine: unknown): void {
  if (!supportsFieldDivisionLine(division)) {
    throw new Error(`Field division ${division} does not support a configurable division line`);
  }
  if (!isRecord(divisionLine)) throw new Error(`Invalid field division line: ${String(divisionLine)}`);
  assertExactKeys(divisionLine, ['style', 'frequency', 'amplitude'], 'field division line');
  if (!fieldDivisionLineStyles.includes(divisionLine.style as FieldDivisionLineStyle)) {
    throw new Error(`Invalid field division line style: ${String(divisionLine.style)}`);
  }
  assertFieldDivisionLineNumber(divisionLine.frequency, 'frequency', 1, 30);
  assertFieldDivisionLineNumber(divisionLine.amplitude, 'amplitude', 1, 20);
}

function assertFieldDivisionLineNumber(value: unknown, label: string, minimum: number, maximum: number): void {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`Invalid field division line ${label}: ${String(value)}`);
  }
}

function assertFieldOrnaments(ornaments: unknown): asserts ornaments is FieldOrnament[] {
  if (!Array.isArray(ornaments) || ornaments.length > 32) {
    throw new Error(`Invalid field ornaments: ${String(ornaments)}`);
  }
  const ornamentIds = new Set<string>();
  for (const ornament of ornaments) {
    if (!isRecord(ornament)) throw new Error(`Invalid field ornament: ${String(ornament)}`);
    assertExactKeys(ornament, ['id', 'kind', 'color', 'colors', 'colorAmplitudes', 'x', 'y', 'scale', 'rotation', 'width', 'height', 'thickness', 'reversed', 'keepAspectRatio', 'overlap', 'bendSinister', 'edge', 'crossHorizontalThickness', 'crossVerticalThickness', 'crossCenterX', 'crossCenterY', 'saltireCenterX', 'saltireCenterY', 'chevronPeakHeight', 'chevronVerticalPosition', 'pallForkX', 'pallForkY', 'mountainPeakCount', 'mountainSteepness'], 'field ornament');
    assertNonEmptyString(ornament.id, 'field ornament id');
    if (ornamentIds.has(ornament.id)) throw new Error(`Duplicate field ornament id: ${ornament.id}`);
    ornamentIds.add(ornament.id);
    if (!validFieldOrnamentKinds.includes(ornament.kind as FieldOrnamentKind)) throw new Error(`Invalid field ornament kind: ${String(ornament.kind)}`);
    assertColor(ornament.color, 'field ornament color');
    assertFieldOrnamentColors(ornament);
    assertFieldOrnamentNumber(ornament.x, 'x', -100, 100);
    assertFieldOrnamentNumber(ornament.y, 'y', -110, 110);
    assertFieldOrnamentNumber(ornament.scale, 'scale', 0.1, 5);
    assertFieldOrnamentNumber(ornament.rotation, 'rotation', -360, 360);
    assertFieldOrnamentGeometry(ornament);
  }
}

function assertFieldOrnamentColors(ornament: Record<string, unknown>): void {
  if (ornament.colors === undefined && ornament.colorAmplitudes === undefined) return;
  if (!Array.isArray(ornament.colors) || ornament.colors.length < 2 || ornament.colors.length > 4) {
    throw new Error(`Invalid field ornament colors: ${String(ornament.colors)}`);
  }
  for (const color of ornament.colors) assertColor(color, 'field ornament palette color');
  if (!Array.isArray(ornament.colorAmplitudes) || ornament.colorAmplitudes.length !== ornament.colors.length) {
    throw new Error(`Invalid field ornament colorAmplitudes length: ${String(ornament.colorAmplitudes)}`);
  }
  for (const amplitude of ornament.colorAmplitudes) {
    assertFieldOrnamentNumber(amplitude, 'color amplitude', 0.1, 100);
  }
}

function assertFieldOrnamentGeometry(ornament: Record<string, unknown>): void {
  const kind = ornament.kind as FieldOrnamentKind;
  assertOptionalFieldOrnamentNumber(ornament.width, 'width', kind, fieldOrnamentWidthKinds, 5, 100);
  assertOptionalFieldOrnamentNumber(ornament.height, 'height', kind, fieldOrnamentHeightKinds, 5, 110);
  assertOptionalFieldOrnamentNumber(ornament.thickness, 'thickness', kind, fieldOrnamentThicknessKinds, 1, 50);
  if (ornament.reversed !== undefined) {
    if (!fieldOrnamentReversibleKinds.includes(kind)) throw new Error(`Field ornament ${kind} does not support reversed`);
    if (typeof ornament.reversed !== 'boolean') throw new Error(`Invalid field ornament reversed: ${String(ornament.reversed)}`);
  }
  if (ornament.keepAspectRatio !== undefined) {
    if (kind !== 'canton') throw new Error(`Field ornament ${kind} does not support keepAspectRatio`);
    if (typeof ornament.keepAspectRatio !== 'boolean') throw new Error(`Invalid field ornament keepAspectRatio: ${String(ornament.keepAspectRatio)}`);
  }
  if (ornament.overlap !== undefined) {
    if (kind !== 'mountain') throw new Error(`Field ornament ${kind} does not support overlap`);
    assertFieldOrnamentNumber(ornament.overlap, 'overlap', 0, 100);
  }
  if (ornament.bendSinister !== undefined) {
    if (kind !== 'bendlet') throw new Error(`Field ornament ${kind} does not support bendSinister`);
    if (typeof ornament.bendSinister !== 'boolean') throw new Error(`Invalid field ornament bendSinister: ${String(ornament.bendSinister)}`);
  }
  if (ornament.edge !== undefined) {
    if (!fieldOrnamentEdgeKinds.includes(kind)) throw new Error(`Field ornament ${kind} does not support edge`);
    assertFieldOrnamentEdge(ornament.edge);
  }
  assertOptionalFieldOrnamentNumber(ornament.crossHorizontalThickness, 'cross horizontal thickness', kind, fieldOrnamentCrossKinds, 1, 50);
  assertOptionalFieldOrnamentNumber(ornament.crossVerticalThickness, 'cross vertical thickness', kind, fieldOrnamentCrossKinds, 1, 50);
  assertOptionalFieldOrnamentNumber(ornament.crossCenterX, 'cross centre x', kind, fieldOrnamentCrossKinds, 0, 100);
  assertOptionalFieldOrnamentNumber(ornament.crossCenterY, 'cross centre y', kind, fieldOrnamentCrossKinds, 0, 110);
  assertOptionalFieldOrnamentNumber(ornament.saltireCenterX, 'saltire centre x', kind, fieldOrnamentSaltireKinds, 0, 100);
  assertOptionalFieldOrnamentNumber(ornament.saltireCenterY, 'saltire centre y', kind, fieldOrnamentSaltireKinds, 0, 110);
  assertOptionalFieldOrnamentNumber(ornament.chevronPeakHeight, 'chevron peak height', kind, fieldOrnamentChevronKinds, 5, 75);
  assertOptionalFieldOrnamentNumber(ornament.chevronVerticalPosition, 'chevron vertical position', kind, fieldOrnamentChevronKinds, 0, 110);
  assertOptionalFieldOrnamentNumber(ornament.pallForkX, 'pall fork x', kind, fieldOrnamentPallKinds, 11, 89);
  assertOptionalFieldOrnamentNumber(ornament.pallForkY, 'pall fork y', kind, fieldOrnamentPallKinds, 10, 71);
  const mountainPeakCount = ornament.mountainPeakCount;
  if (mountainPeakCount !== undefined) {
    if (!fieldOrnamentMountainKinds.includes(kind)) throw new Error(`Field ornament ${kind} does not support mountain peak count`);
    if (typeof mountainPeakCount !== 'number' || !Number.isInteger(mountainPeakCount) || mountainPeakCount < 1 || mountainPeakCount > 8) {
      throw new Error(`Invalid field ornament mountain peak count: ${String(mountainPeakCount)}`);
    }
  }
  assertOptionalFieldOrnamentNumber(ornament.mountainSteepness, 'mountain steepness', kind, fieldOrnamentMountainKinds, 0.1, 1);
}

function assertOptionalFieldOrnamentNumber(
  value: unknown,
  label: string,
  kind: FieldOrnamentKind,
  supportedKinds: readonly FieldOrnamentKind[],
  minimum: number,
  maximum: number,
): void {
  if (value === undefined) return;
  if (!supportedKinds.includes(kind)) throw new Error(`Field ornament ${kind} does not support ${label}`);
  assertFieldOrnamentNumber(value, label, minimum, maximum);
}

function assertFieldOrnamentEdge(edge: unknown): void {
  if (!isRecord(edge)) throw new Error(`Invalid field ornament edge: ${String(edge)}`);
  assertExactKeys(edge, ['style', 'frequency', 'amplitude'], 'field ornament edge');
  if (!fieldDivisionLineStyles.includes(edge.style as FieldDivisionLineStyle)) {
    throw new Error(`Invalid field ornament edge style: ${String(edge.style)}`);
  }
  assertFieldDivisionLineNumber(edge.frequency, 'frequency', 1, 30);
  assertFieldDivisionLineNumber(edge.amplitude, 'amplitude', 1, 20);
}

function assertFieldOrnamentNumber(value: unknown, label: string, minimum: number, maximum: number): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum || value > maximum) {
    throw new Error(`Invalid field ornament ${label}: ${String(value)}`);
  }
}

function assertFieldOutline(outline: unknown): void {
  if (!isRecord(outline)) throw new Error(`Invalid shield outline: ${String(outline)}`);
  assertExactKeys(outline, ['visible', 'color', 'width'], 'shield outline');
  if (typeof outline.visible !== 'boolean') throw new Error(`Invalid shield outline visibility: ${String(outline.visible)}`);
  assertColor(outline.color, 'shield outline color');
  if (typeof outline.width !== 'number' || !Number.isFinite(outline.width) || outline.width < 0.25 || outline.width > 10) {
    throw new Error(`Invalid shield outline width: ${String(outline.width)}`);
  }
}

function assertTransform(transform: unknown): void {
  if (!isRecord(transform)) throw new Error(`Invalid layer transform: ${String(transform)}`);
  assertExactKeys(transform, ['x', 'y', 'scale', 'scaleX', 'scaleY', 'rotation', 'flipHorizontal', 'flipVertical', 'crop', 'fieldPlacement', 'fieldRegionId', 'clipToField', 'opacity'], 'layer transform');
  for (const transformKey of ['x', 'y', 'scale', 'rotation'] as const) {
    if (typeof transform[transformKey] !== 'number' || !Number.isFinite(transform[transformKey])) {
      throw new Error(`Invalid layer transform ${transformKey}: ${String(transform[transformKey])}`);
    }
  }
  assertPositiveFiniteNumber(transform.scale, 'layer transform scale');
  if ('scaleX' in transform) assertPositiveFiniteNumber(transform.scaleX, 'layer transform horizontal scale');
  if ('scaleY' in transform) assertPositiveFiniteNumber(transform.scaleY, 'layer transform vertical scale');
  if ('flipHorizontal' in transform && typeof transform.flipHorizontal !== 'boolean') {
    throw new Error(`Invalid layer horizontal flip: ${String(transform.flipHorizontal)}`);
  }
  if ('flipVertical' in transform && typeof transform.flipVertical !== 'boolean') {
    throw new Error(`Invalid layer vertical flip: ${String(transform.flipVertical)}`);
  }
  if ('crop' in transform) assertCanvasCrop(transform.crop);
  if ('fieldPlacement' in transform && !validFieldPlacements.includes(transform.fieldPlacement as FieldPlacement)) throw new Error(`Invalid field placement: ${String(transform.fieldPlacement)}`);
  if ('fieldRegionId' in transform && !validFieldRegionIds.includes(transform.fieldRegionId as FieldRegionId)) throw new Error(`Invalid field region id: ${String(transform.fieldRegionId)}`);
  if ('clipToField' in transform && typeof transform.clipToField !== 'boolean') throw new Error(`Invalid clip to field value: ${String(transform.clipToField)}`);
  if ('opacity' in transform) assertOpacity(transform.opacity, 'layer transform opacity');
}

function assertCanvasCrop(crop: unknown): void {
  if (!isRecord(crop)) throw new Error(`Invalid layer crop: ${String(crop)}`);
  assertExactKeys(crop, ['x', 'y', 'width', 'height'], 'layer crop');
  const x = assertCropCoordinate(crop.x, 'x');
  const y = assertCropCoordinate(crop.y, 'y');
  const width = assertCropCoordinate(crop.width, 'width');
  const height = assertCropCoordinate(crop.height, 'height');
  if (x < 0 || width < 1 || x + width > 100) {
    throw new Error(`Invalid layer crop horizontal bounds: ${x}+${width}`);
  }
  if (y < 0 || height < 1 || y + height > 110) {
    throw new Error(`Invalid layer crop vertical bounds: ${y}+${height}`);
  }
}

function assertCropCoordinate(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid layer crop ${label}: ${String(value)}`);
  }
  return value;
}

function assertStrokeWidth(strokeWidth: unknown): asserts strokeWidth is number {
  if (typeof strokeWidth !== 'number' || !Number.isFinite(strokeWidth) || strokeWidth < 0.5 || strokeWidth > 20) {
    throw new Error(`Invalid drawing stroke width: ${String(strokeWidth)}`);
  }
}

function assertDrawingPath(path: unknown): asserts path is string {
  if (typeof path !== 'string' || path.length > 4096 || !/^M -?(?:\d+\.?\d*|\.\d+) -?(?:\d+\.?\d*|\.\d+)(?: L -?(?:\d+\.?\d*|\.\d+) -?(?:\d+\.?\d*|\.\d+))+$/u.test(path)) {
    throw new Error(`Invalid drawing path: ${String(path)}`);
  }
}

function assertLayerAsset(layerType: CoatLayer['type'], assetId: unknown): void {
  if (layerType === 'image' || layerType === 'text') return;
  if (typeof assetId !== 'string') throw new Error(`Invalid coat asset id: ${String(assetId)}`);
  const asset = getCoatAsset(assetId);
  if (asset.kind !== layerType) throw new Error(`Invalid ${layerType} layer asset: ${assetId}`);
}

function assertLayerRasterVariant(assetId: string, rasterVariantId: unknown): asserts rasterVariantId is CoatRasterVariantId {
  const asset = getCoatAsset(assetId);
  if (
    (asset.kind !== 'charge' && asset.kind !== 'top')
    || !asset.rasterVariants
    || !asset.rasterVariants.some((variant) => variant.id === rasterVariantId)
  ) {
    throw new Error(`Invalid raster variant ${String(rasterVariantId)} for asset: ${assetId}`);
  }
}

function assertProjectName(name: unknown): asserts name is string {
  if (typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 120) {
    throw new Error(`Invalid project name: ${String(name)}`);
  }
}

function assertTextLength(text: unknown): asserts text is string {
  assertNonEmptyString(text, 'text layer text');
  if (text.length > COAT_PROJECT_LIMITS.maxTextLength) {
    throw new Error(`Invalid text layer length: ${text.length}; limit is ${COAT_PROJECT_LIMITS.maxTextLength}`);
  }
}

function assertGroupId(groupId: unknown): asserts groupId is string {
  if (typeof groupId !== 'string' || !/^[A-Za-z0-9_-]{1,120}$/.test(groupId)) {
    throw new Error(`Invalid layer group id: ${String(groupId)}`);
  }
}

function assertColor(color: unknown, label: string): asserts color is string {
  if (typeof color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(color)) throw new Error(`Invalid ${label}: ${String(color)}`);
}

function assertBackgroundGradient(gradient: unknown): asserts gradient is BackgroundGradient {
  if (!isRecord(gradient)) throw new Error(`Invalid background gradient: ${String(gradient)}`);
  assertExactKeys(gradient, ['angle', 'startColor', 'endColor'], 'background gradient');
  if (typeof gradient.angle !== 'number' || !Number.isFinite(gradient.angle) || gradient.angle < 0 || gradient.angle > 360) {
    throw new Error(`Invalid background gradient angle: ${String(gradient.angle)}`);
  }
  assertColor(gradient.startColor, 'background gradient start color');
  assertColor(gradient.endColor, 'background gradient end color');
}

function assertMimeType(mimeType: unknown): void {
  if (mimeType !== 'image/png' && mimeType !== 'image/jpeg' && mimeType !== 'image/webp' && mimeType !== 'image/svg+xml') throw new Error(`Invalid local upload mime type: ${String(mimeType)}`);
}

function assertFieldPattern(pattern: unknown): asserts pattern is FieldPattern {
  if (!validPatterns.includes(pattern as FieldPattern)) throw new Error(`Invalid field pattern: ${String(pattern)}`);
}

function assertOpacity(opacity: unknown, label: string): asserts opacity is number {
  if (typeof opacity !== 'number' || !Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
    throw new Error(`Invalid ${label}: ${String(opacity)}`);
  }
}

function assertLayerAlignmentAxis(axis: unknown): asserts axis is LayerAlignmentAxis {
  if (!['left', 'horizontal-centre', 'right', 'top', 'vertical-centre', 'bottom'].includes(axis as string)) {
    throw new Error(`Invalid layer alignment axis: ${String(axis)}`);
  }
}

function assertLayerDistributionAxis(axis: unknown): asserts axis is LayerDistributionAxis {
  if (axis !== 'horizontal' && axis !== 'vertical') {
    throw new Error(`Invalid layer distribution axis: ${String(axis)}`);
  }
}

function assertLayerOrderDirection(direction: unknown): asserts direction is LayerOrderDirection {
  if (!['forward', 'backward', 'front', 'back'].includes(direction as string)) {
    throw new Error(`Invalid layer order direction: ${String(direction)}`);
  }
}

function assertLayerSize(value: unknown, label: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 1 || value > 4096) {
    throw new Error(`Invalid ${label}: ${String(value)}`);
  }
}

function assertMovableLayerIds(
  project: CoatProject,
  layerIds: unknown,
  label: string,
  options: { allowLocked?: boolean } = {},
): Set<string> {
  if (!Array.isArray(layerIds) || layerIds.length === 0) {
    throw new Error(`Invalid ${label}: ${JSON.stringify(layerIds)}`);
  }
  const movableLayerIds = new Set<string>();
  for (const layerId of layerIds) {
    if (typeof layerId !== 'string' || layerId.trim().length === 0) {
      throw new Error(`Invalid movable layer id: ${String(layerId)}`);
    }
    if (movableLayerIds.has(layerId)) {
      throw new Error(`Duplicate movable layer id: ${layerId}`);
    }
    const layer = getLayerById(project, layerId);
    if (!isMovableLayer(layer)) {
      throw new Error(`Non-movable coat layer id: ${layerId}`);
    }
    if (!options.allowLocked && layer.locked) {
      throw new Error(`Fixed coat layer id: ${layerId}`);
    }
    movableLayerIds.add(layer.id);
  }
  return movableLayerIds;
}

function getLayerAlignmentPatch(axis: LayerAlignmentAxis): Partial<Pick<CanvasTransform, 'x' | 'y'>> {
  switch (axis) {
    case 'left': return { x: 0 };
    case 'horizontal-centre': return { x: 50 };
    case 'right': return { x: 100 };
    case 'top': return { y: 0 };
    case 'vertical-centre': return { y: 55 };
    case 'bottom': return { y: 110 };
  }
}

function isMovableLayer(layer: CoatLayer): layer is MovableCoatLayer {
  return layer.type !== 'background';
}

function assertTextAlignment(alignment: unknown): asserts alignment is TextAlignment {
  if (alignment !== 'left' && alignment !== 'center' && alignment !== 'right') {
    throw new Error(`Invalid text alignment: ${String(alignment)}`);
  }
}

function assertTextFontFamily(fontFamily: unknown): asserts fontFamily is TextFontFamily {
  if (!textFontFamilies.includes(fontFamily as TextFontFamily)) {
    throw new Error(`Invalid text font family: ${String(fontFamily)}`);
  }
}

function assertTextFontStyle(fontStyle: unknown): asserts fontStyle is TextFontStyle {
  if (fontStyle !== 'normal' && fontStyle !== 'italic') {
    throw new Error(`Invalid text font style: ${String(fontStyle)}`);
  }
}

function assertTextFontWeight(fontWeight: unknown): asserts fontWeight is TextFontWeight {
  if (fontWeight !== 'normal' && fontWeight !== 'bold') {
    throw new Error(`Invalid text font weight: ${String(fontWeight)}`);
  }
}

function assertLayerColorReplacements(layer: CoatLayer, colorReplacements: unknown): asserts colorReplacements is Record<string, string> {
  if (layer.type !== 'ordinary' && layer.type !== 'charge' && layer.type !== 'top') {
    throw new Error(`Layer does not support SVG part colour replacement: ${layer.id}`);
  }
  assertAssetColorReplacements(layer.assetId, colorReplacements);
}

function assertAssetColorReplacements(assetId: string, colorReplacements: unknown): asserts colorReplacements is Record<string, string> {
  if (!isRecord(colorReplacements)) {
    throw new Error(`Invalid SVG part colour replacements: ${String(colorReplacements)}`);
  }
  const supportedColors = getAssetColorSources(assetId).map((color) => color.toUpperCase());
  for (const [sourceColor, replacementColor] of Object.entries(colorReplacements)) {
    assertColor(sourceColor, 'SVG part source color');
    if (!supportedColors.includes(sourceColor.toUpperCase())) {
      throw new Error(`Invalid unsupported SVG part colour: ${sourceColor}`);
    }
    assertColor(replacementColor, 'SVG part replacement color');
  }
}

function assertTextPath(path: unknown): asserts path is TextPathPlacement {
  if (!isRecord(path) || typeof path.mode !== 'string') throw new Error(`Invalid text path: ${String(path)}`);
  if (path.mode === 'none') {
    assertExactKeys(path, ['mode'], 'text path');
    return;
  }
  if (path.mode === 'motto' || path.mode === 'curve') {
    assertExactKeys(path, ['mode', 'curve'], 'text path');
    if (path.curve === 'upper' || path.curve === 'lower') return;
  }
  if (path.mode === 'ring') {
    assertExactKeys(path, ['mode', 'curve'], 'text path');
    if (path.curve === 'clockwise' || path.curve === 'counterclockwise') return;
  }
  throw new Error(`Invalid text path: ${JSON.stringify(path)}`);
}

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error(`Invalid ${label}: ${String(value)}`);
}

function assertRandomValueSource(randomValue: unknown): asserts randomValue is RandomValueSource {
  if (typeof randomValue !== 'function') {
    throw new Error(`Invalid random value source: ${String(randomValue)}`);
  }
}

function pickRandom<Value>(
  choices: readonly Value[],
  randomValue: RandomValueSource,
  label: string,
): Value {
  const value = randomValue();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new Error(`Invalid random value for ${label}: ${String(value)}`);
  }
  const selectedValue = choices[Math.floor(value * choices.length)];
  if (selectedValue === undefined) throw new Error(`No local ${label} choices are available`);
  return selectedValue;
}

function assertPositiveFiniteNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) throw new Error(`Invalid ${label}: ${String(value)}`);
}

function cloneField(field: CoatField): CoatField {
  return { ...field, colors: [...field.colors], ...(field.patternConfig ? { patternConfig: { ...field.patternConfig } } : {}), ...(field.regions ? { regions: Object.fromEntries(Object.entries(field.regions).map(([regionId, style]) => [regionId, style ? { ...style, colors: [...style.colors], ...(style.patternConfig ? { patternConfig: { ...style.patternConfig } } : {}) } : style])) } : {}), ...(field.divisionLine ? { divisionLine: { ...field.divisionLine } } : {}), ...(field.ornaments ? { ornaments: field.ornaments.map((ornament) => ({ ...ornament, ...(ornament.colors ? { colors: [...ornament.colors] } : {}), ...(ornament.colorAmplitudes ? { colorAmplitudes: [...ornament.colorAmplitudes] } : {}), ...(ornament.edge ? { edge: { ...ornament.edge } } : {}) })) } : {}), ...(field.outline ? { outline: { ...field.outline } } : {}) };
}

function cloneLayerPatch(patch: CoatLayerPatch): CoatLayerPatch {
  return {
    ...patch,
    ...(patch.field ? { field: cloneField(patch.field) } : {}),
    ...(patch.colorReplacements ? { colorReplacements: { ...patch.colorReplacements } } : {}),
    ...(patch.transform ? { transform: cloneCanvasTransform(patch.transform) } : {}),
    ...(patch.path ? { path: cloneTextPath(patch.path) } : {}),
  };
}

function cloneLayerForDuplicate(layer: CoatLayer, newLayerId: string): CoatLayer {
  const metadata = { id: newLayerId, visible: layer.visible, locked: false, groupId: null };
  switch (layer.type) {
    case 'background':
      return { ...metadata, type: 'background', assetId: layer.assetId, motif: layer.motif, opacity: layer.opacity, ...(layer.fill ? { fill: layer.fill } : {}), ...(layer.gradient ? { gradient: { ...layer.gradient } } : {}) };
    case 'shield':
      return { ...metadata, type: 'shield', assetId: layer.assetId, ...(layer.customMaskUploadId ? { customMaskUploadId: layer.customMaskUploadId } : {}), ...(layer.customOutlinePath ? { customOutlinePath: layer.customOutlinePath } : {}), field: cloneField(layer.field), transform: cloneCanvasTransform(layer.transform) };
    case 'ordinary':
      return { ...metadata, type: 'ordinary', assetId: layer.assetId, color: layer.color, ...(layer.colorReplacements ? { colorReplacements: { ...layer.colorReplacements } } : {}), transform: cloneCanvasTransform(layer.transform) };
    case 'charge':
    case 'top':
      return { ...metadata, type: layer.type, assetId: layer.assetId, ...(layer.rasterVariantId ? { rasterVariantId: layer.rasterVariantId } : {}), color: layer.color, ...(layer.colorReplacements ? { colorReplacements: { ...layer.colorReplacements } } : {}), transform: cloneCanvasTransform(layer.transform) };
    case 'draw':
      return { ...metadata, type: 'draw', path: layer.path, color: layer.color, strokeWidth: layer.strokeWidth, transform: cloneCanvasTransform(layer.transform) };
    case 'image':
      return {
        ...metadata, type: 'image', source: 'local-upload', uploadId: layer.uploadId,
        mimeType: layer.mimeType, opacity: layer.opacity, transform: cloneCanvasTransform(layer.transform),
      };
    case 'text':
      return {
        ...metadata, type: 'text', text: layer.text, color: layer.color, fontSize: layer.fontSize,
        ...(layer.fontFamily ? { fontFamily: layer.fontFamily } : {}),
        ...(layer.fontStyle ? { fontStyle: layer.fontStyle } : {}),
        ...(layer.fontWeight ? { fontWeight: layer.fontWeight } : {}),
        alignment: layer.alignment, path: cloneTextPath(layer.path), transform: cloneCanvasTransform(layer.transform),
      };
  }
}

function cloneTextPath(path: TextPathPlacement): TextPathPlacement {
  return { ...path } as TextPathPlacement;
}

function cloneCanvasTransform(transform: CanvasTransform): CanvasTransform {
  return { ...transform, ...(transform.crop ? { crop: { ...transform.crop } } : {}) };
}

function normalizeLayerGroups(
  layers: CoatLayer[],
  groups: CoatGroup[],
): { layers: CoatLayer[]; groups: CoatGroup[] } {
  const groupMemberCounts = new Map<string, number>();
  for (const layer of layers) {
    if (layer.groupId !== null) groupMemberCounts.set(layer.groupId, (groupMemberCounts.get(layer.groupId) ?? 0) + 1);
  }
  const normalizedLayers = layers.map((layer) => (
    layer.groupId !== null && (groupMemberCounts.get(layer.groupId) ?? 0) < 2
      ? { ...layer, groupId: null }
      : layer
  ));
  const activeGroupIds = new Set(
    normalizedLayers.flatMap((layer) => layer.groupId === null ? [] : [layer.groupId]),
  );
  return {
    layers: normalizedLayers,
    groups: groups.filter((group) => activeGroupIds.has(group.id)),
  };
}

function uniqueColors(colors: string[]): string[] {
  const seenColors = new Set<string>();
  return colors.filter((color) => {
    const normalizedColor = color.toUpperCase();
    if (seenColors.has(normalizedColor)) return false;
    seenColors.add(normalizedColor);
    return true;
  });
}

function defaultTransform() {
  return { x: 0, y: 0, scale: 1, rotation: 0 };
}

function createLayerId(): string {
  return createLocalCoatId();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertExactKeys(record: Record<string, unknown>, allowedKeys: readonly string[], label: string): void {
  for (const recordKey of Object.keys(record)) {
    if (!allowedKeys.includes(recordKey)) throw new Error(`Invalid ${label} property: ${recordKey}`);
  }
}

function assertNeverCommand(command: never): never {
  throw new Error(`Unsupported coat project command: ${String(command)}`);
}
