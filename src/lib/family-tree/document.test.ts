import { describe, expect, it } from 'vitest';

import { createInitialFamilyTreeAvatar } from '@/lib/family-tree/avatar';
import {
  FAMILY_TREE_DOCUMENT_VERSION,
  createFamilyTreeDocument,
  createInitialFamilyTreeDocument,
  parseFamilyTreeDocument,
  requireFamilyTreeDocument,
  serializeFamilyTreeDocument,
  type FamilyTreeDocument,
} from '@/lib/family-tree/document';
import {
  addFamilyTreePerson,
  createFamilyTreePerson,
  createInitialFamilyTreeScene,
  type FamilyTreeScene,
} from '@/lib/family-tree/scene';

function createPopulatedScene(): FamilyTreeScene {
  const person = createFamilyTreePerson(
    {
      avatar: createInitialFamilyTreeAvatar(),
      name: 'Ari',
      age: '32',
      description: 'A cartographer',
    },
    'person-1',
    1,
    48,
  );

  return addFamilyTreePerson(createInitialFamilyTreeScene(), person);
}

describe('family tree document', () => {
  it('creates a versioned empty document', () => {
    expect(createInitialFamilyTreeDocument()).toEqual({
      version: FAMILY_TREE_DOCUMENT_VERSION,
      scene: {
        version: FAMILY_TREE_DOCUMENT_VERSION,
        generations: [[], [], [], []],
        connections: [],
        selectedPersonId: null,
        resizeEnabled: false,
      },
    });
  });

  it('serializes and parses a complete scene without losing fields', () => {
    const document = createFamilyTreeDocument(createPopulatedScene());
    const serialized = serializeFamilyTreeDocument(document);
    const parsed = parseFamilyTreeDocument(serialized);

    expect(parsed).toEqual(document);
    expect(JSON.parse(serialized)).toEqual(document);
  });

  it('validates object and string boundaries with the received value', () => {
    expect(() => requireFamilyTreeDocument(null)).toThrow(
      'Family tree document must be an object, received null.',
    );
    expect(() => parseFamilyTreeDocument(null as never)).toThrow(
      'Family tree document text must be a string, received null.',
    );
    expect(() => parseFamilyTreeDocument('<div>legacy family tree</div>')).toThrow(
      'invalid JSON syntax',
    );
  });

  it('rejects unsupported versions and malformed scenes', () => {
    const document = createInitialFamilyTreeDocument();

    expect(() => requireFamilyTreeDocument({ ...document, version: 2 })).toThrow(
      'document version must be 1, received 2',
    );
    expect(() => requireFamilyTreeDocument({
      ...document,
      scene: { ...document.scene, version: 2 },
    })).toThrow('scene version must be 1, received 2');
    expect(() => requireFamilyTreeDocument({
      ...document,
      scene: { ...document.scene, generations: [[], []] },
    })).toThrow('must contain 4 generations, received 2');
  });

  it('does not accept extra document fields or executable legacy HTML', () => {
    const document = createInitialFamilyTreeDocument();
    const extraFieldDocument = { ...document, legacyHtml: '<script>alert(1)</script>' };

    expect(() => requireFamilyTreeDocument(extraFieldDocument)).toThrow(
      'must contain exactly scene and version',
    );
    expect(() => parseFamilyTreeDocument('<script>document.body.innerHTML = "x"</script>')).toThrow(
      'invalid JSON syntax',
    );
  });

  it('rejects malformed documents before serialization', () => {
    const malformedDocument = {
      version: FAMILY_TREE_DOCUMENT_VERSION,
      scene: { version: FAMILY_TREE_DOCUMENT_VERSION },
    } as unknown as FamilyTreeDocument;

    expect(() => serializeFamilyTreeDocument(malformedDocument)).toThrow(
      'must contain exactly connections, generations, resizeEnabled, selectedPersonId, version',
    );
  });
});
