import { describe, expect, it } from 'vitest';

import {
  addMapMakerLabel,
  createDefaultMapMakerProject,
  parseMapMakerProject,
  serializeMapMakerProject,
} from './index';

describe('Map Maker versioned project text', () => {
  it('round-trips a project through the version 1 TXT format', () => {
    const project = addMapMakerLabel(createDefaultMapMakerProject(), {
      id: 'label-westmere',
      text: 'Westmere',
      x: 40,
      y: 70,
      width: 180,
      height: 32,
      fontSize: 18,
    });

    const serializedText = serializeMapMakerProject(project);
    expect(JSON.parse(serializedText)).toMatchObject({ schemaVersion: 1 });
    expect(parseMapMakerProject(serializedText)).toEqual(project);
  });

  it('rejects malformed JSON and unsupported schema versions with the received value', () => {
    expect(() => parseMapMakerProject('{')).toThrow(/invalid JSON.*Received/);
    expect(() => parseMapMakerProject('{"schemaVersion":2,"project":{}}')).toThrow(/must be 1\. Received 2/);
  });

  it('rejects projects that have an invalid base tile without mutating the current project', () => {
    const originalProject = createDefaultMapMakerProject();
    const invalidSerialized = JSON.stringify({
      schemaVersion: 1,
      project: { ...originalProject, columns: 5 },
    });

    expect(() => parseMapMakerProject(invalidSerialized)).toThrow('Received 5');
    expect(originalProject.columns).toBe(12);
    expect(originalProject.baseTiles).toHaveLength(72);
  });
});
