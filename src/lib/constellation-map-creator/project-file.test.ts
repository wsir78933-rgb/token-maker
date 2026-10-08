import { describe, expect, it } from 'vitest';

import {
  addConstellation,
  addConstellationStar,
  createDefaultConstellationProject,
  transformConstellationObject,
} from './state';
import {
  CONSTELLATION_PROJECT_SCHEMA_VERSION,
  parseConstellationProject,
  serializeConstellationProject,
} from './project-file';

describe('constellation project files', () => {
  it('round-trips a non-empty project with background metadata', () => {
    let project = createDefaultConstellationProject();
    project = addConstellation(project, 'plain-17', 'constellation-1');
    project = addConstellationStar(project, 'star-1');

    const serializedProject = serializeConstellationProject(project);
    const parsedProject = parseConstellationProject(serializedProject);

    expect(JSON.parse(serializedProject).schemaVersion).toBe(CONSTELLATION_PROJECT_SCHEMA_VERSION);
    expect(parsedProject).toEqual(project);
  });

  it('rejects unsupported schema, malformed JSON, and oversized text', () => {
    const project = createDefaultConstellationProject();
    const serializedProject = serializeConstellationProject(project);

    expect(() => parseConstellationProject('{"schemaVersion":2,"project":{}}')).toThrow(
      'schemaVersion must be 1',
    );
    expect(() => parseConstellationProject('{bad')).toThrow('invalid JSON');
    expect(() => parseConstellationProject('x'.repeat(1_048_577))).toThrow('at most 1048576 bytes');
    expect(() => parseConstellationProject(serializedProject.replace('"project":', '"extra":'))).toThrow(
      'exactly project and schemaVersion',
    );
  });

  it('keeps schema version 1 and round-trips normalized rotation without moving the object', () => {
    let project = createDefaultConstellationProject();
    project = addConstellation(project, 'image-1', 'constellation-1');
    project = addConstellationStar(project, 'star-1');
    project = transformConstellationObject(project, 'constellation-1', {
      x: 12.25,
      y: 8.5,
      width: 98.5,
      height: 93.25,
      rotation: 450,
    });
    project = transformConstellationObject(project, 'star-1', {
      x: 3,
      y: 4,
      width: 20,
      height: 20,
      rotation: -90,
    });

    const serializedProject = serializeConstellationProject(project);
    const parsedProject = parseConstellationProject(serializedProject);
    const serializedRecord = JSON.parse(serializedProject) as {
      schemaVersion: number;
      project: { objects: Array<{ rotation?: number }> };
    };

    expect(serializedRecord.schemaVersion).toBe(CONSTELLATION_PROJECT_SCHEMA_VERSION);
    expect(serializedRecord.schemaVersion).toBe(1);
    expect(parsedProject).toEqual(project);
    expect(parsedProject.objects[0]).toMatchObject({
      x: 12.25,
      y: 8.5,
      width: 98.5,
      height: 93.25,
      rotation: 90,
    });
    expect(parsedProject.objects[1]).toMatchObject({ x: 3, y: 4, width: 20, height: 20, rotation: 270 });
  });

  it('loads a real old project file without rotation as 0 degrees', () => {
    let project = createDefaultConstellationProject();
    project = addConstellation(project, 'plain-17', 'constellation-1');
    project = addConstellationStar(project, 'star-1');
    project = transformConstellationObject(project, 'constellation-1', {
      x: 12.25,
      y: 8.5,
      width: 98.5,
      height: 93.25,
      rotation: 33,
    });
    const serializedRecord = JSON.parse(serializeConstellationProject(project)) as {
      project: { objects: Array<Record<string, unknown>> };
    };
    for (const object of serializedRecord.project.objects) {
      delete object.rotation;
    }
    const oldProjectText = JSON.stringify(serializedRecord);

    expect(oldProjectText).not.toContain('rotation');
    const parsedProject = parseConstellationProject(oldProjectText);
    expect(parsedProject.objects[0]).toMatchObject({
      id: 'constellation-1',
      x: 12.25,
      y: 8.5,
      width: 98.5,
      height: 93.25,
      rotation: 0,
    });
    expect(parsedProject.objects[1]).toMatchObject({
      id: 'star-1',
      x: 0,
      y: 0,
      width: 20,
      height: 20,
      rotation: 0,
    });
  });

  it('rejects illegal or unknown object fields and still accepts explicit rotation 0', () => {
    let project = createDefaultConstellationProject();
    project = addConstellation(project, 'image-1', 'constellation-1');
    project = transformConstellationObject(project, 'constellation-1', {
      x: 10,
      y: 20,
      width: 30,
      height: 40,
      rotation: 15,
    });
    const serializedRecord = JSON.parse(serializeConstellationProject(project)) as {
      project: {
        objects: Array<Record<string, unknown>>;
        rotation?: number;
        background: { rotation?: number };
      };
    };

    serializedRecord.project.objects[0].rotation = 0;
    expect(parseConstellationProject(JSON.stringify(serializedRecord)).objects[0]?.rotation).toBe(0);

    serializedRecord.project.objects[0].rotation = 360;
    expect(parseConstellationProject(JSON.stringify(serializedRecord)).objects[0]).toMatchObject({
      x: 10,
      y: 20,
      width: 30,
      height: 40,
      rotation: 0,
    });

    const illegalObjectRotations = [
      { rotation: null, received: 'null' },
      { rotation: '45', received: '"45"' },
    ];
    for (const illegalRotation of illegalObjectRotations) {
      serializedRecord.project.objects[0].rotation = illegalRotation.rotation;
      expect(() => parseConstellationProject(JSON.stringify(serializedRecord))).toThrow(
        `Received ${illegalRotation.received}`,
      );
    }

    delete serializedRecord.project.objects[0].rotation;
    serializedRecord.project.objects[0].spin = 15;
    expect(() => parseConstellationProject(JSON.stringify(serializedRecord))).toThrow('Unknown ["spin"]');

    delete serializedRecord.project.objects[0].spin;
    serializedRecord.project.rotation = 10;
    expect(() => parseConstellationProject(JSON.stringify(serializedRecord))).toThrow(
      'must contain exactly background, height, objects, width',
    );
    delete serializedRecord.project.rotation;
    serializedRecord.project.background.rotation = 10;
    expect(() => parseConstellationProject(JSON.stringify(serializedRecord))).toThrow(
      'must contain exactly color, imageHeight, imageUrl, imageWidth, transparent',
    );
  });
});

