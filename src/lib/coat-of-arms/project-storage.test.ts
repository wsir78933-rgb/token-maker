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
});
