// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultProject } from './assets';
import {
  COAT_PROJECT_DRAFT_STORAGE_KEY,
  COAT_PROJECT_STORAGE_KEY,
  discardProjectDraft,
  deleteProjectRecord,
  exportProjectDocument,
  importProjectDocument,
  loadProjectDraft,
  listProjectRecords,
  loadProjectRecord,
  saveProjectRecord,
  saveProjectDraft,
} from './project-storage';

function encodeBytesBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

describe('coat project local storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips a saved project through browser storage', () => {
    const project = createDefaultProject('zh');
    saveProjectRecord({ id: project.id, name: '徽章测试', project });

    expect(loadProjectRecord(project.id)?.project).toEqual(project);
    expect(loadProjectRecord(project.id)?.name).toBe('徽章测试');
  });

  it('keeps coat project records in a dedicated key rather than a Token Maker key', () => {
    const project = createDefaultProject('en');
    saveProjectRecord({ id: project.id, name: 'Arms', project });

    expect(COAT_PROJECT_STORAGE_KEY).toBe('coat-of-arms-maker-storage');
    expect(COAT_PROJECT_STORAGE_KEY).not.toContain('token-maker');
    expect(localStorage.getItem(COAT_PROJECT_STORAGE_KEY)).toContain(project.id);
  });

  it('exports model JSON and imports an independent validated document', () => {
    const project = createDefaultProject('en');
    const serializedProject = exportProjectDocument(project);
    const imported = importProjectDocument(serializedProject);

    expect(JSON.parse(serializedProject)).toMatchObject({ version: 1, id: project.id });
    expect(imported).toEqual(project);
    expect(imported).not.toBe(project);
  });

  it('rejects an oversized JSON document before parsing it', () => {
    const serializedProject = exportProjectDocument(createDefaultProject('en'));
    const oversizedDocument = `${serializedProject}${' '.repeat(1_048_576)}`;

    expect(() => importProjectDocument(oversizedDocument)).toThrow('limit is 1048576');
  });

  it('enforces layer, canvas, and cumulative upload limits during direct import', () => {
    const project = createDefaultProject('en');
    const overwideCanvas = { ...project, canvas: { width: 4097, height: 1200 } };
    const tooManyLayers = {
      ...project,
      layers: Array.from({ length: 65 }, (_, index) => index < 2 ? project.layers[index]! : {
        id: `charge-${index}`,
        type: 'charge', assetId: 'golden-lion', color: '#B11F24',
        transform: { x: 0, y: 0, scale: 1, rotation: 0 }, visible: true, locked: false, groupId: null,
      }),
    };

    expect(() => importProjectDocument(JSON.stringify({ version: 1, ...overwideCanvas })))
      .toThrow('4097; limit is 4096');
    expect(() => importProjectDocument(JSON.stringify({ version: 1, ...tooManyLayers })))
      .toThrow('65; limit is 64');
  });

  it('does not let direct imports bypass per-file, cumulative, or upload-count limits', () => {
    const project = createDefaultProject('en');
    const oversizedPng = new Uint8Array(262_145);
    oversizedPng.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const validPng = new Uint8Array(200_000);
    validPng.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const validSvg = btoa('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>');
    const upload = (id: string, data: string, mimeType: 'image/png' | 'image/svg+xml' = 'image/png') => ({
      id, mimeType, encoding: 'base64' as const, data,
    });

    expect(() => importProjectDocument(JSON.stringify({
      version: 1, ...project, uploads: [upload('oversized', encodeBytesBase64(oversizedPng))],
    }))).toThrow('262145; limit is 262144');
    expect(() => importProjectDocument(JSON.stringify({
      version: 1,
      ...project,
      uploads: ['a', 'b', 'c'].map((id) => upload(id, encodeBytesBase64(validPng))),
    }))).toThrow('600000; limit is 524288');
    expect(() => importProjectDocument(JSON.stringify({
      version: 1,
      ...project,
      uploads: Array.from({ length: 9 }, (_, index) => upload(`svg-${index}`, validSvg, 'image/svg+xml')),
    }))).toThrow('9; limit is 8');
  });

  it('stores a separate recoverable draft without changing saved project records', () => {
    const savedProject = createDefaultProject('en');
    const draftProject = { ...createDefaultProject('zh'), name: '未保存草稿' };
    saveProjectRecord({ id: savedProject.id, name: savedProject.name, project: savedProject });
    saveProjectDraft(draftProject);

    expect(COAT_PROJECT_DRAFT_STORAGE_KEY).toBe('coat-of-arms-maker-draft');
    expect(COAT_PROJECT_DRAFT_STORAGE_KEY).not.toBe(COAT_PROJECT_STORAGE_KEY);
    expect(loadProjectDraft()).toEqual(draftProject);
    expect(listProjectRecords()).toEqual([{ id: savedProject.id, name: savedProject.name, project: savedProject }]);
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

  it('round-trips persisted group metadata through project export and browser storage', () => {
    const project = { ...createDefaultProject('en'), groups: [{ id: 'pair', opacity: 0.45 }] };
    const groupedProject = {
      ...project,
      layers: project.layers.map((layer, index) => (
        index === 0 || index === 1 ? { ...layer, groupId: 'pair' } : layer
      )),
    };
    saveProjectRecord({ id: groupedProject.id, name: 'Grouped Arms', project: groupedProject });

    const imported = importProjectDocument(exportProjectDocument(groupedProject));

    expect(loadProjectRecord(groupedProject.id)?.project.groups).toEqual([{ id: 'pair', opacity: 0.45 }]);
    expect(imported.groups).toEqual([{ id: 'pair', opacity: 0.45 }]);
  });

  it('rejects imported JSON that references an unknown asset', () => {
    const invalidDocument = JSON.stringify({
      version: 1,
      layers: [{ id: 'x', type: 'charge', assetId: 'unknown-charge' }],
    });

    expect(() => importProjectDocument(invalidDocument)).toThrow('unknown-charge');
  });

  it('rejects a persisted document that contains a remote URL', () => {
    const project = createDefaultProject('en');
    const documentWithRemoteUrl = JSON.stringify({
      version: 1,
      ...project,
      remoteUrl: 'https://example.com/coat.json',
    });

    expect(() => importProjectDocument(documentWithRemoteUrl)).toThrow('remoteUrl');
  });

  it('rejects a record whose id does not match its project document', () => {
    const project = createDefaultProject('en');

    expect(() =>
      saveProjectRecord({ id: 'different-project-id', name: 'Mismatch', project }),
    ).toThrow('different-project-id');
  });

  it('rejects an imported document with a group that has only one member', () => {
    const project = createDefaultProject('en');
    const documentWithInvalidGroup = JSON.stringify({
      version: 1,
      ...project,
      layers: project.layers.map((layer, index) =>
        index === 1 ? { ...layer, groupId: 'orphaned-group' } : layer,
      ),
    });

    expect(() => importProjectDocument(documentWithInvalidGroup)).toThrow('orphaned-group');
  });

  it('rejects an imported document with non-contiguous group members', () => {
    const project = createDefaultProject('en');
    const withCharges = {
      ...project,
      groups: [{ id: 'spaced', opacity: 1 }],
      layers: [
        { ...project.layers[0]!, groupId: 'spaced' },
        { ...project.layers[1]!, groupId: null },
        {
          id: 'charge-1', type: 'charge', assetId: 'golden-lion', color: '#B11F24',
          transform: { x: 0, y: 0, scale: 1, rotation: 0 }, visible: true, locked: false,
          groupId: 'spaced',
        },
      ],
    };

    expect(() => importProjectDocument(JSON.stringify({ version: 1, ...withCharges }))).toThrow(
      'Non-contiguous coat group membership: spaced',
    );
  });

  it('lists cloned records, overwrites by id, and deletes the selected project', () => {
    const first = createDefaultProject('en');
    const second = createDefaultProject('zh');
    saveProjectRecord({ id: first.id, name: 'First', project: first });
    saveProjectRecord({ id: second.id, name: 'Second', project: second });
    saveProjectRecord({ id: first.id, name: 'First renamed', project: first });

    const listedRecords = listProjectRecords();
    expect(listedRecords).toHaveLength(2);
    expect(listedRecords.find((record) => record.id === first.id)?.name).toBe('First renamed');
    listedRecords[0]!.project.name = 'Caller mutation';
    expect(loadProjectRecord(listedRecords[0]!.id)?.project.name).not.toBe('Caller mutation');
    deleteProjectRecord(second.id);
    expect(listProjectRecords().map((record) => record.id)).toEqual([first.id]);
  });

  it.each([
    ['malformed JSON', '{'],
    ['wrong version', JSON.stringify({ version: 2, records: [] })],
    ['wrong shape', JSON.stringify({ version: 1, records: {} })],
  ])('fails fast for a %s stored collection', (_label, rawCollection) => {
    localStorage.setItem(COAT_PROJECT_STORAGE_KEY, rawCollection);

    expect(() => listProjectRecords()).toThrow(COAT_PROJECT_STORAGE_KEY);
  });

  it('fails fast for duplicate stored project record ids', () => {
    const project = createDefaultProject('en');
    localStorage.setItem(COAT_PROJECT_STORAGE_KEY, JSON.stringify({
      version: 1,
      records: [
        { id: project.id, name: 'First', project },
        { id: project.id, name: 'Duplicate', project },
      ],
    }));

    expect(() => listProjectRecords()).toThrow(project.id);
  });

  it('rejects a corrupted stored upload through every project-library read or write path', () => {
    const project = createDefaultProject('en');
    const corruptedProject = {
      ...project,
      uploads: [{ id: 'bad-upload', mimeType: 'image/png', encoding: 'base64', data: '' }],
    };
    localStorage.setItem(COAT_PROJECT_STORAGE_KEY, JSON.stringify({
      version: 1,
      records: [{ id: project.id, name: 'Corrupted', project: corruptedProject }],
    }));
    const validProject = createDefaultProject('en');
    const validRecord = { id: validProject.id, name: 'Valid', project: validProject };

    expect(() => listProjectRecords()).toThrow('local upload data');
    expect(() => loadProjectRecord(project.id)).toThrow('local upload data');
    expect(() => saveProjectRecord(validRecord)).toThrow('local upload data');
    expect(() => deleteProjectRecord(project.id)).toThrow('local upload data');
    expect(() => importProjectDocument(JSON.stringify({ version: 1, ...corruptedProject }))).toThrow('local upload data');
  });

  it('rejects an unsafe SVG upload through every persistence boundary', () => {
    const project = createDefaultProject('en');
    const corruptedProject = {
      ...project,
      uploads: [{
        id: 'bad-svg', mimeType: 'image/svg+xml', encoding: 'base64',
        data: btoa('<svg><image href="crest.svg"/></svg>'),
      }],
    };
    localStorage.setItem(COAT_PROJECT_STORAGE_KEY, JSON.stringify({
      version: 1,
      records: [{ id: project.id, name: 'Unsafe SVG', project: corruptedProject }],
    }));
    const validProject = createDefaultProject('en');
    const validRecord = { id: validProject.id, name: 'Valid', project: validProject };

    expect(() => listProjectRecords()).toThrow('SVG');
    expect(() => loadProjectRecord(project.id)).toThrow('SVG');
    expect(() => saveProjectRecord(validRecord)).toThrow('SVG');
    expect(() => deleteProjectRecord(project.id)).toThrow('SVG');
    expect(() => importProjectDocument(JSON.stringify({ version: 1, ...corruptedProject }))).toThrow('SVG');
  });
});
