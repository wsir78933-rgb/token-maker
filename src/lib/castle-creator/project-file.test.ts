import { describe, expect, it } from 'vitest';

import {
  MAX_CASTLE_PROJECT_FILE_BYTES,
  parseCastleProjectFile,
  serializeCastleProject,
} from '@/lib/castle-creator/project-file';
import { moveCastlePieceToLayer } from '@/lib/castle-creator/project';
import type { CastleProject } from '@/lib/castle-creator/types';

function createProject(): CastleProject {
  return {
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
  };
}

describe('castle project files', () => {
  it('round trips the editable project settings without UI selection state', () => {
    const project = createProject();
    const serializedProject = serializeCastleProject(project);

    expect(parseCastleProjectFile(serializedProject)).toEqual(project);
    expect(serializedProject).not.toContain('selection');
  });

  it('round trips a piece after moving it to a different layer', () => {
    const project: CastleProject = {
      ...createProject(),
      pieces: [{
        id: 'wall-1',
        assetId: 'walls-1',
        layerId: 'middle',
        x: 12,
        y: 34,
        width: 25,
        height: 48,
        buildingColor: 2,
        roofColor: 5,
      }],
    };
    const movedProject = moveCastlePieceToLayer(project, 'wall-1', 'upper');

    expect(parseCastleProjectFile(serializeCastleProject(movedProject))).toEqual(movedProject);
  });

  it('rejects malformed JSON and save-record wrappers with a concrete reason', () => {
    expect(() => parseCastleProjectFile('{broken')).toThrowError('invalid JSON syntax');
    expect(() =>
      parseCastleProjectFile(
        JSON.stringify({ version: 1, slotNumber: 1, project: createProject(), updatedAt: 'now' }),
      ),
    ).toThrowError('Castle project file is invalid');
  });

  it('rejects input larger than the project file limit before parsing', () => {
    const oversizedByteLength = MAX_CASTLE_PROJECT_FILE_BYTES + 1;
    const oversizedText = 'x'.repeat(oversizedByteLength);

    expect(MAX_CASTLE_PROJECT_FILE_BYTES).toBe(2 * 1024 * 1024);
    expect(() => parseCastleProjectFile(oversizedText)).toThrowError(
      `Received ${oversizedByteLength} bytes`,
    );
  });

  it('rejects a project with an invalid field before serialization', () => {
    const invalidProject = { ...createProject(), activeLayer: 'unknown' };

    expect(() => serializeCastleProject(invalidProject as never)).toThrowError('active layer');
  });
});
