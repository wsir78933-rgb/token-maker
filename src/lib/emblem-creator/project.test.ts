import { describe, expect, it } from 'vitest';
import {
  applyEmblemProjectCommand,
  assertEmblemProject,
  createDefaultEmblemProject,
  createEmblemElement,
  getEmblemTargetLayer,
  parseEmblemProjectJson,
  serializeEmblemProject,
} from './project';
import {
  EMBLEM_CANVAS,
  EMBLEM_LAYER_ORDER,
  MAX_EMBLEM_PROJECT_FILE_BYTES,
  type EmblemElement,
  type EmblemElementSource,
  type EmblemLayerId,
  type EmblemProject,
} from './types';

const catalogSource: EmblemElementSource = {
  kind: 'catalog',
  assetId: 'crest-sun',
  url: '/emblem-creator/original/crest-sun.svg',
  naturalWidth: 100,
  naturalHeight: 80,
};

function projectElement(id: string): EmblemElement {
  return createEmblemElement(catalogSource, id);
}

function projectWithLayerElements(
  layerId: EmblemLayerId,
  elements: readonly EmblemElement[],
): EmblemProject {
  const project = createDefaultEmblemProject();
  return {
    ...project,
    layers: {
      ...project.layers,
      [layerId]: { ...project.layers[layerId], elements },
    },
  };
}

function parsedProjectValue(): Record<string, unknown> {
  return JSON.parse(serializeEmblemProject(createDefaultEmblemProject())) as Record<string, unknown>;
}

describe('Emblem project model', () => {
  it('creates six empty fixed layers with the specified initial visibility', () => {
    const project = createDefaultEmblemProject();

    expect(Object.keys(project.layers)).toEqual([...EMBLEM_LAYER_ORDER]);
    expect(project.canvas).toEqual(EMBLEM_CANVAS);
    expect(
      Object.fromEntries(
        EMBLEM_LAYER_ORDER.map((layerId) => [layerId, project.layers[layerId].visible]),
      ),
    ).toEqual({
      crests: true,
      details: true,
      body1: false,
      body2: false,
      body3: false,
      body4: true,
    });
    expect(EMBLEM_LAYER_ORDER.every((layerId) => project.layers[layerId].elements.length === 0)).toBe(
      true,
    );
  });

  it('creates centered elements scaled to a 256-pixel longest edge', () => {
    expect(createEmblemElement(catalogSource, 'crest-1')).toEqual({
      id: 'crest-1',
      source: catalogSource,
      transform: {
        x: 512,
        y: 512,
        scale: 2.56,
        rotation: 0,
        mirrorX: false,
      },
    });

    expect(() =>
      createEmblemElement({ ...catalogSource, naturalWidth: Number.NaN }, 'crest-invalid'),
    ).toThrow('naturalWidth must be a finite number; received NaN');
    expect(() =>
      createEmblemElement(
        { ...catalogSource, naturalWidth: Number.MIN_VALUE, naturalHeight: Number.MIN_VALUE },
        'crest-unscalable',
      ),
    ).toThrow('computed scale is Infinity');
    expect(() => createEmblemElement(catalogSource, '')).toThrow('element id');
  });

  it('automatically chooses the next empty body layer and rejects a full project with its actual occupancy', () => {
    let project = createDefaultEmblemProject();
    expect(getEmblemTargetLayer('body', project)).toBe('body4');

    const bodyLayerIds = ['body4', 'body3', 'body2', 'body1'] as const;
    const nextLayerIds = ['body3', 'body2', 'body1', undefined] as const;
    for (const [index, layerId] of bodyLayerIds.entries()) {
      project = applyEmblemProjectCommand(project, {
        type: 'add-element', layerId, element: projectElement('body-target-' + index),
      });
      const nextLayerId = nextLayerIds[index];
      if (nextLayerId) expect(getEmblemTargetLayer('body', project)).toBe(nextLayerId);
    }

    expect(() => getEmblemTargetLayer('body', project)).toThrow(
      'No empty body layer is available; 4/4 occupied (body4, body3, body2, body1).',
    );
    expect(getEmblemTargetLayer('detail', project)).toBe('details');
    expect(getEmblemTargetLayer('crest', project)).toBe('crests');
    expect(() => getEmblemTargetLayer('other' as never, project)).toThrow('"other"');
    expect(() => getEmblemTargetLayer('body', {} as never)).toThrow('project');
  });

  it('replaces the old element in a body layer without mutating either input project', () => {
    const emptyProject = createDefaultEmblemProject();
    const firstElement = projectElement('body-first');
    const withFirst = applyEmblemProjectCommand(emptyProject, {
      type: 'add-element',
      layerId: 'body4',
      element: firstElement,
    });
    const secondElement = projectElement('body-second');
    const withSecond = applyEmblemProjectCommand(withFirst, {
      type: 'add-element',
      layerId: 'body4',
      element: secondElement,
    });

    expect(emptyProject.layers.body4.elements).toEqual([]);
    expect(withFirst.layers.body4.elements).toEqual([firstElement]);
    expect(withSecond.layers.body4.elements).toEqual([secondElement]);
    expect(withFirst).not.toBe(emptyProject);
    expect(withSecond).not.toBe(withFirst);
  });

  it('allows multiple elements in the details and crests layers', () => {
    let project = createDefaultEmblemProject();
    project = applyEmblemProjectCommand(project, {
      type: 'add-element',
      layerId: 'details',
      element: projectElement('detail-1'),
    });
    project = applyEmblemProjectCommand(project, {
      type: 'add-element',
      layerId: 'details',
      element: projectElement('detail-2'),
    });
    project = applyEmblemProjectCommand(project, {
      type: 'add-element',
      layerId: 'crests',
      element: projectElement('crest-1'),
    });
    project = applyEmblemProjectCommand(project, {
      type: 'add-element',
      layerId: 'crests',
      element: projectElement('crest-2'),
    });

    expect(project.layers.details.elements.map((element) => element.id)).toEqual([
      'detail-1',
      'detail-2',
    ]);
    expect(project.layers.crests.elements.map((element) => element.id)).toEqual([
      'crest-1',
      'crest-2',
    ]);
  });

  it('applies transform, visibility, deletion, and layer clearing immutably', () => {
    const projectWithElement = projectWithLayerElements('details', [projectElement('detail-1')]);
    const nextTransform = {
      x: 10,
      y: 20,
      scale: 1.5,
      rotation: 45,
      mirrorX: true,
    };
    const transformedProject = applyEmblemProjectCommand(projectWithElement, {
      type: 'set-element-transform',
      elementId: 'detail-1',
      transform: nextTransform,
    });
    const visibleProject = applyEmblemProjectCommand(transformedProject, {
      type: 'set-layer-visibility',
      layerId: 'details',
      visible: false,
    });
    const clearedProject = applyEmblemProjectCommand(visibleProject, {
      type: 'clear-layer',
      layerId: 'details',
    });

    expect(projectWithElement.layers.details.elements[0]?.transform.x).toBe(512);
    expect(transformedProject.layers.details.elements[0]?.transform).toEqual(nextTransform);
    expect(visibleProject.layers.details.visible).toBe(false);
    expect(visibleProject.layers.details.elements).toHaveLength(1);
    expect(clearedProject.layers.details.visible).toBe(false);
    expect(clearedProject.layers.details.elements).toEqual([]);

    const removedProject = applyEmblemProjectCommand(projectWithElement, {
      type: 'remove-element',
      elementId: 'detail-1',
    });
    expect(removedProject.layers.details.elements).toEqual([]);
    expect(projectWithElement.layers.details.elements).toHaveLength(1);
  });

  it('reports unknown layers, elements, and command types with their actual values', () => {
    const project = createDefaultEmblemProject();

    expect(() =>
      applyEmblemProjectCommand(project, {
        type: 'clear-layer',
        layerId: 'unknown-layer',
      } as never),
    ).toThrow('"unknown-layer"');
    expect(() =>
      applyEmblemProjectCommand(project, {
        type: 'remove-element',
        elementId: 'missing-element',
      }),
    ).toThrow('"missing-element"');
    expect(() =>
      applyEmblemProjectCommand(project, { type: 'unknown-command' } as never),
    ).toThrow('"unknown-command"');
  });

  it('rejects duplicate element ids and more than one element in any body layer', () => {
    const duplicateProject = {
      ...createDefaultEmblemProject(),
      layers: {
        ...createDefaultEmblemProject().layers,
        details: { visible: true, elements: [projectElement('same-id')] },
        crests: { visible: true, elements: [projectElement('same-id')] },
      },
    };
    expect(() => assertEmblemProject(duplicateProject)).toThrow('Duplicate emblem element id "same-id"');

    const crowdedBodyProject = projectWithLayerElements('body2', [
      projectElement('body-a'),
      projectElement('body-b'),
    ]);
    expect(() => assertEmblemProject(crowdedBodyProject)).toThrow(
      'project.layers.body2 may contain at most one body element',
    );
  });

  it('rejects unknown or missing layer keys and unexpected project keys', () => {
    const projectValue = parsedProjectValue();
    const layers = projectValue.layers as Record<string, unknown>;
    layers.body5 = { visible: false, elements: [] };
    expect(() => assertEmblemProject(projectValue)).toThrow('"body5"');

    const missingLayerProject = parsedProjectValue();
    delete (missingLayerProject.layers as Record<string, unknown>).body3;
    expect(() => assertEmblemProject(missingLayerProject)).toThrow('body3');

    const extraProjectKey = { ...parsedProjectValue(), privateNote: 'unexpected' };
    expect(() => assertEmblemProject(extraProjectKey)).toThrow('privateNote');
  });

  it('rejects wrong schema versions, canvas dimensions, coordinates, scales, and URLs', () => {
    const wrongVersion = { ...parsedProjectValue(), schemaVersion: 2 };
    expect(() => assertEmblemProject(wrongVersion)).toThrow('schemaVersion must be 1; received 2');

    const wrongCanvas = parsedProjectValue();
    (wrongCanvas.canvas as Record<string, unknown>).width = 900;
    expect(() => assertEmblemProject(wrongCanvas)).toThrow('project.canvas.width must be 1024; received 900');

    const invalidCoordinate = projectWithLayerElements('details', [projectElement('invalid-x')]);
    const invalidCoordinateProject = {
      ...invalidCoordinate,
      layers: {
        ...invalidCoordinate.layers,
        details: {
          ...invalidCoordinate.layers.details,
          elements: [
            {
              ...invalidCoordinate.layers.details.elements[0],
              transform: { ...invalidCoordinate.layers.details.elements[0]?.transform, x: Infinity },
            },
          ],
        },
      },
    };
    expect(() => assertEmblemProject(invalidCoordinateProject)).toThrow('transform.x must be a finite number');

    const invalidScale = projectWithLayerElements('details', [
      {
        ...projectElement('invalid-scale'),
        transform: { ...projectElement('invalid-scale').transform, scale: 0 },
      },
    ]);
    expect(() => assertEmblemProject(invalidScale)).toThrow('transform.scale must be greater than 0; received 0');

    const invalidUrl = projectWithLayerElements('details', [
      {
        ...projectElement('invalid-url'),
        source: { ...catalogSource, url: 'data:image/png;base64,AA==' },
      },
    ]);
    expect(() => assertEmblemProject(invalidUrl)).toThrow('data:image/png;base64,AA==');
  });

  it('rejects missing or extra keys in the serialized project structure', () => {
    const missingCanvasField = parsedProjectValue();
    delete (missingCanvasField.canvas as Record<string, unknown>).height;
    expect(() => assertEmblemProject(missingCanvasField)).toThrow('project.canvas');

    const withElement = projectWithLayerElements('details', [projectElement('extra-transform')]);
    const transform = withElement.layers.details.elements[0]?.transform;
    const projectWithExtraTransform = {
      ...withElement,
      layers: {
        ...withElement.layers,
        details: {
          ...withElement.layers.details,
          elements: [
            {
              ...withElement.layers.details.elements[0],
              transform: { ...transform, skew: 4 },
            },
          ],
        },
      },
    };
    expect(() => assertEmblemProject(projectWithExtraTransform)).toThrow('skew');
  });

  it('round-trips versioned JSON and validates structure without loading images', () => {
    const project = applyEmblemProjectCommand(createDefaultEmblemProject(), {
      type: 'add-element',
      layerId: 'body4',
      element: projectElement('saved-crest'),
    });
    const serializedProject = serializeEmblemProject(project);

    expect(JSON.parse(serializedProject)).toMatchObject({ schemaVersion: 1, canvas: EMBLEM_CANVAS });
    expect(parseEmblemProjectJson(serializedProject)).toEqual(project);
    expect(parseEmblemProjectJson(serializedProject).layers.body4.elements[0]?.source.url).toBe(
      catalogSource.url,
    );
  });

  it('rejects malformed JSON and input or output above the 1 MiB UTF-8 boundary', () => {
    expect(() => parseEmblemProjectJson('{')).toThrow('Invalid emblem project JSON');

    const oversizedContents = ' '.repeat(MAX_EMBLEM_PROJECT_FILE_BYTES + 1);
    expect(() => parseEmblemProjectJson(oversizedContents)).toThrow(
      String(MAX_EMBLEM_PROJECT_FILE_BYTES + 1),
    );

    const oversizedId = 'x'.repeat(MAX_EMBLEM_PROJECT_FILE_BYTES);
    const oversizedProject = projectWithLayerElements('details', [projectElement(oversizedId)]);
    expect(() => serializeEmblemProject(oversizedProject)).toThrow('UTF-8 bytes; the maximum is');
  });
});
