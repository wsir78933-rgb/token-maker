import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  addCastlePiece,
  bringCastlePieceToFront,
  clearCastleLayer,
  clearCastlePieces,
  copyCastlePiece,
  createCastleProject,
  deleteCastlePiece,
  moveCastlePiece,
  resizeCastlePiece,
  setCastleActiveLayer,
  setCastleCanvasSettings,
  setCastleLayerVisibility,
  validateCastleProject,
} from './project';
import type { CastleAsset, CastlePiece, CastleProject } from './types';

const CATALOG_ASSETS: Record<string, CastleAsset> = {
  'walls-1': { id: 'walls-1', category: 'walls', number: 1, width: 120, height: 80 },
  'gates-1': { id: 'gates-1', category: 'gates', number: 1, width: 200, height: 140 },
};

vi.mock('./catalog', () => ({
  getCastleAsset: (assetId: string): CastleAsset => {
    const asset = CATALOG_ASSETS[assetId];
    if (!asset) throw new Error(`Unknown Castle asset id: ${JSON.stringify(assetId)}.`);
    return { ...asset };
  },
}));

const WALL_ASSET = CATALOG_ASSETS['walls-1'];
const GATE_ASSET = CATALOG_ASSETS['gates-1'];

function createPiece(
  id: string,
  layerId: CastlePiece['layerId'],
  overrides: Partial<CastlePiece> = {},
): CastlePiece {
  return {
    id,
    assetId: WALL_ASSET.id,
    layerId,
    x: 10,
    y: 20,
    width: WALL_ASSET.width,
    height: WALL_ASSET.height,
    buildingColor: 1,
    roofColor: 1,
    ...overrides,
  };
}

function createProject(overrides: Partial<CastleProject> = {}): CastleProject {
  return {
    ...createCastleProject(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createCastleProject', () => {
  it('creates the confirmed default editor state', () => {
    expect(createCastleProject()).toEqual({
      version: 1,
      pieces: [],
      activeLayer: 'lower',
      visibleLayers: { lower: true, middle: true, upper: true },
      canvas: {
        width: 0,
        height: 635,
        backgroundColor: '#ffffff',
        backgroundImageUrl: null,
      },
      palette: { building: 1, roof: 1 },
      snapEnabled: false,
      resizeEnabled: true,
    });
  });
});

describe('validateCastleProject', () => {
  it('returns a deep independent project copy', () => {
    const sourceProject = createProject({
      pieces: [createPiece('wall-1', 'middle')],
    });

    const validatedProject = validateCastleProject(sourceProject);
    validatedProject.pieces[0]!.x = 900;
    validatedProject.visibleLayers.lower = false;
    validatedProject.canvas.backgroundColor = '#000000';

    expect(sourceProject.pieces[0]!.x).toBe(10);
    expect(sourceProject.visibleLayers.lower).toBe(true);
    expect(sourceProject.canvas.backgroundColor).toBe('#ffffff');
  });

  it('rejects invalid version, duplicate ids, unknown assets, and incomplete layer visibility', () => {
    expect(() => validateCastleProject({ ...createProject(), version: 2 })).toThrow('version: 2');

    expect(() => validateCastleProject({
      ...createProject(),
      pieces: [createPiece('duplicate', 'lower'), createPiece('duplicate', 'upper')],
    })).toThrow('Duplicate Castle piece id: "duplicate"');

    expect(() => validateCastleProject({
      ...createProject(),
      pieces: [createPiece('missing', 'lower', { assetId: 'missing-99' })],
    })).toThrow('missing-99');

    expect(() => validateCastleProject({
      ...createProject(),
      visibleLayers: { lower: true, middle: true },
    })).toThrow('Castle visible layers keys');
  });

  it('rejects invalid dimensions, coordinates, colors, and background URLs with their values', () => {
    expect(() => validateCastleProject({
      ...createProject(),
      pieces: [createPiece('negative-size', 'lower', { width: -1 })],
    })).toThrow('width: -1');

    expect(() => validateCastleProject({
      ...createProject(),
      pieces: [createPiece('infinite-position', 'lower', { x: Number.POSITIVE_INFINITY })],
    })).toThrow('Infinity');

    expect(() => validateCastleProject({
      ...createProject(),
      pieces: [createPiece('bad-color', 'lower', { buildingColor: 5 as CastlePiece['buildingColor'] })],
    })).toThrow('building color: 5');

    expect(() => validateCastleProject({
      ...createProject(),
      canvas: { ...createProject().canvas, backgroundColor: 'red' },
    })).toThrow('background color: "red"');

    expect(() => validateCastleProject({
      ...createProject(),
      canvas: { ...createProject().canvas, backgroundImageUrl: 'data:image/png;base64,abc' },
    })).toThrow('data:image/png;base64,abc');
  });

  it('rejects fractional canvas dimensions during project import with their values', () => {
    const project = createProject();

    expect(() => validateCastleProject({
      ...project,
      canvas: { ...project.canvas, width: 100.5 },
    })).toThrow('100.5');

    expect(() => validateCastleProject({
      ...project,
      canvas: { ...project.canvas, height: 635.5 },
    })).toThrow('635.5');
  });
});

describe('castle piece operations', () => {
  it('adds a natural-size piece using the active layer and palette snapshot', () => {
    const project = setCastleActiveLayer(
      { ...createProject(), palette: { building: 3, roof: 5 } },
      'upper',
    );
    const nextProject = addCastlePiece(project, GATE_ASSET, 'gate-1', { x: -12, y: 48 });

    expect(nextProject.pieces).toEqual([{
      id: 'gate-1',
      assetId: 'gates-1',
      layerId: 'upper',
      x: -12,
      y: 48,
      width: 200,
      height: 140,
      buildingColor: 3,
      roofColor: 5,
    }]);
  });

  it('moves without snapping when disabled and rounds both coordinates to a 5px grid when enabled', () => {
    const unsnappedProject = addCastlePiece(createProject(), WALL_ASSET, 'wall-1', { x: 0, y: 0 });
    const movedWithoutSnap = moveCastlePiece(unsnappedProject, 'wall-1', { x: 12, y: -13 });
    expect(movedWithoutSnap.pieces[0]).toMatchObject({ x: 12, y: -13 });

    const snappedProject = { ...unsnappedProject, snapEnabled: true };
    const movedWithSnap = moveCastlePiece(snappedProject, 'wall-1', { x: 12, y: -13 });
    expect(movedWithSnap.pieces[0]).toMatchObject({ x: 10, y: -15 });
  });

  it('resizes proportionally and rejects resizing when the toggle is disabled', () => {
    const project = addCastlePiece(createProject(), WALL_ASSET, 'wall-1', { x: 0, y: 0 });
    const resizedProject = resizeCastlePiece(project, 'wall-1', 240);
    expect(resizedProject.pieces[0]).toMatchObject({ width: 240, height: 160 });

    expect(() => resizeCastlePiece({ ...project, resizeEnabled: false }, 'wall-1', 240))
      .toThrow('resize is disabled');
  });

  it('copies a piece to the active layer without changing editor toggles', () => {
    const project = addCastlePiece(createProject(), WALL_ASSET, 'wall-1', { x: 15, y: 25 });
    const configuredProject = setCastleActiveLayer(
      { ...project, snapEnabled: true, resizeEnabled: false },
      'upper',
    );
    const copiedProject = copyCastlePiece(configuredProject, 'wall-1', 'wall-copy');

    expect(copiedProject.pieces[1]).toEqual({ ...configuredProject.pieces[0], id: 'wall-copy', layerId: 'upper' });
    expect(copiedProject.snapEnabled).toBe(true);
    expect(copiedProject.resizeEnabled).toBe(false);
  });

  it('deletes a piece and reports missing ids immediately', () => {
    const project = addCastlePiece(createProject(), WALL_ASSET, 'wall-1', { x: 0, y: 0 });
    expect(deleteCastlePiece(project, 'wall-1').pieces).toEqual([]);
    expect(() => deleteCastlePiece(project, 'missing')).toThrow('missing');
  });

  it('brings a piece to the front within its layer while preserving other layer slots', () => {
    const project = createProject({
      pieces: [
        createPiece('lower-a', 'lower'),
        createPiece('middle-a', 'middle'),
        createPiece('lower-b', 'lower'),
        createPiece('upper-a', 'upper'),
      ],
    });
    const broughtToFront = bringCastlePieceToFront(project, 'lower-a');
    expect(broughtToFront.pieces.map((piece) => piece.id)).toEqual([
      'lower-b',
      'middle-a',
      'lower-a',
      'upper-a',
    ]);
  });
});

describe('castle layer and canvas operations', () => {
  it('sets active layer and visibility, then clears one layer or all pieces', () => {
    const project = createProject({
      pieces: [createPiece('lower-a', 'lower'), createPiece('upper-a', 'upper')],
    });
    const configuredProject = setCastleLayerVisibility(
      setCastleActiveLayer(project, 'upper'),
      'upper',
      false,
    );
    expect(configuredProject.activeLayer).toBe('upper');
    expect(configuredProject.visibleLayers.upper).toBe(false);
    expect(clearCastleLayer(configuredProject, 'lower').pieces.map((piece) => piece.id)).toEqual(['upper-a']);
    expect(clearCastlePieces(configuredProject).pieces).toEqual([]);
  });

  it('keeps width zero, converts height zero to 635, and validates background settings', () => {
    const project = createProject({
      canvas: {
        width: 1000,
        height: 500,
        backgroundColor: '#000000',
        backgroundImageUrl: null,
      },
    });
    const nextProject = setCastleCanvasSettings(project, {
      width: 0,
      height: 0,
      backgroundColor: '#abcdef',
      backgroundImageUrl: 'https://example.com/castle.png',
    });
    expect(nextProject.canvas).toEqual({
      width: 0,
      height: 635,
      backgroundColor: '#abcdef',
      backgroundImageUrl: 'https://example.com/castle.png',
    });
  });

  it('rejects unsupported background URL protocols and oversized canvas dimensions', () => {
    const project = createProject();
    expect(() => setCastleCanvasSettings(project, {
      ...project.canvas,
      backgroundImageUrl: 'javascript:alert(1)',
    })).toThrow('only http and https are allowed');
    expect(() => setCastleCanvasSettings(project, {
      ...project.canvas,
      width: 8193,
    })).toThrow('8193');
  });

  it('rejects fractional canvas dimensions when settings are applied with their values', () => {
    const project = createProject();

    expect(() => setCastleCanvasSettings(project, {
      ...project.canvas,
      width: 100.5,
    })).toThrow('100.5');

    expect(() => setCastleCanvasSettings(project, {
      ...project.canvas,
      height: 635.5,
    })).toThrow('635.5');
  });
});
