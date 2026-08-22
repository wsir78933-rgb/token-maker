// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultProject } from './assets';
import {
  COAT_PROJECT_DRAFT_STORAGE_KEY,
  discardProjectDraft,
  loadProjectDraft,
  saveProjectDraft,
} from './project-storage';

describe('coat project local storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores a recoverable draft without using a Token Maker key', () => {
    const draftProject = { ...createDefaultProject('zh'), name: '未保存草稿' };
    saveProjectDraft(draftProject);

    expect(COAT_PROJECT_DRAFT_STORAGE_KEY).toBe('coat-of-arms-maker-draft');
    expect(COAT_PROJECT_DRAFT_STORAGE_KEY).not.toContain('token-maker');
    const loadedDraft = loadProjectDraft();
    expect(loadedDraft).toEqual(draftProject);
    expect(loadedDraft).not.toBe(draftProject);
    discardProjectDraft();
    expect(loadProjectDraft()).toBeNull();
  });

  it('fails fast and preserves malformed local drafts until an explicit discard', () => {
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, '{');
    expect(() => loadProjectDraft()).toThrow('Invalid coat project draft JSON');
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBe('{');

    const invalidDraft = JSON.stringify({ version: 1, project: { remoteUrl: 'https://example.com' } });
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, invalidDraft);
    expect(() => loadProjectDraft()).toThrow('remoteUrl');
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBe(invalidDraft);
  });

  it('rejects an oversized draft document', () => {
    const oversizedProject = { ...createDefaultProject('en'), id: `id-${'x'.repeat(1_048_576)}` };

    expect(() => saveProjectDraft(oversizedProject)).toThrow('limit is 1048576');
  });

  it('round-trips persisted group metadata through a draft', () => {
    const project = { ...createDefaultProject('en'), groups: [{ id: 'pair', opacity: 0.45 }] };
    const groupedProject = {
      ...project,
      layers: project.layers.map((layer, index) => (
        index === 0 || index === 1 ? { ...layer, groupId: 'pair' } : layer
      )),
    };
    saveProjectDraft(groupedProject);

    expect(loadProjectDraft()?.groups).toEqual([{ id: 'pair', opacity: 0.45 }]);
  });

  it('round-trips rasterTint through a local draft without changing omitted layers', () => {
    const baseProject = createDefaultProject('en');
    const project = {
      ...baseProject,
      layers: [
        ...baseProject.layers,
        {
          id: 'tinted-charge',
          type: 'charge' as const,
          assetId: 'material-symbol-alchemical-fire',
          color: '#1855A5',
          rasterTint: true,
          transform: { x: 0, y: 0, scale: 1, rotation: 0 },
          visible: true,
          locked: false,
          groupId: null,
        },
        {
          id: 'untinted-ordinary',
          type: 'ordinary' as const,
          assetId: 'material-ordinary-gusset',
          color: '#B11F24',
          rasterTint: false,
          transform: { x: 0, y: 0, scale: 1, rotation: 0 },
          visible: true,
          locked: false,
          groupId: null,
        },
      ],
    };
    saveProjectDraft(project);

    const loadedDraft = loadProjectDraft();
    expect(loadedDraft).toEqual(project);
    expect(loadedDraft?.layers.find((layer) => layer.id === 'tinted-charge')).toMatchObject({ rasterTint: true });
    expect(loadedDraft?.layers.find((layer) => layer.id === 'untinted-ordinary')).toMatchObject({ rasterTint: false });
    expect(loadedDraft?.layers.find((layer) => layer.type === 'shield')).not.toHaveProperty('rasterTint');
  });

  it('rejects a draft whose rasterTint is not a boolean', () => {
    const baseProject = createDefaultProject('en');
    const invalidDraft = JSON.stringify({
      version: 1,
      project: {
        ...baseProject,
        layers: [
          ...baseProject.layers,
          {
            id: 'invalid-tint-charge',
            type: 'charge',
            assetId: 'material-symbol-alchemical-fire',
            color: '#1855A5',
            rasterTint: 'yes',
            transform: { x: 0, y: 0, scale: 1, rotation: 0 },
            visible: true,
            locked: false,
            groupId: null,
          },
        ],
      },
    });
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, invalidDraft);

    expect(() => loadProjectDraft()).toThrow('Invalid raster tint: yes');
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBe(invalidDraft);
  });
});
