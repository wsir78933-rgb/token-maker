import { describe, expect, it } from 'vitest';

import {
  FAMILY_TREE_CONNECTION_COLOR,
  FAMILY_TREE_CONNECTION_STROKE_WIDTH,
  FAMILY_TREE_CONTENT_LEFT,
  FAMILY_TREE_GENERATION_ROW_HEIGHT,
  FAMILY_TREE_PERSON_HEIGHT,
  FAMILY_TREE_PERSON_WIDTH,
  FAMILY_TREE_SCENE_MIN_WIDTH,
  FAMILY_TREE_SCENE_TOP_PADDING,
  familyTreeAvatarBox,
  familyTreeConnectionY,
  familyTreeEndpointSegment,
  familyTreePersonBox,
  familyTreePersonNameBox,
  familyTreeSceneSize,
} from '@/lib/family-tree/layout';
import type { FamilyTreePerson, FamilyTreeScene } from '@/lib/family-tree/scene';

function person(overrides: Partial<FamilyTreePerson> = {}): FamilyTreePerson {
  return {
    id: 'person-a',
    generation: 0,
    x: 40,
    avatar: {} as FamilyTreePerson['avatar'],
    name: '人物 A',
    age: '30',
    description: '',
    endpoints: { top: 'none', bottom: 'none', left: 'none', right: 'none' },
    ...overrides,
  };
}

function scene(overrides: Partial<FamilyTreeScene> = {}): FamilyTreeScene {
  return {
    version: 1,
    generations: [[], [], [], []],
    connections: [],
    selectedPersonId: null,
    resizeEnabled: false,
    ...overrides,
  };
}

describe('family tree layout', () => {
  it('publishes the shared connection rendering contract for canvas and image export', () => {
    expect(FAMILY_TREE_CONNECTION_COLOR).toBe('#b66b38');
    expect(FAMILY_TREE_CONNECTION_STROKE_WIDTH).toBe(2);
  });

  it('keeps the person, avatar, and name boxes aligned to the shared geometry', () => {
    const selectedPerson = person({ generation: 2, x: 40 });
    const box = familyTreePersonBox(selectedPerson);

    expect(box).toEqual({
      x: FAMILY_TREE_CONTENT_LEFT + 40,
      y: FAMILY_TREE_SCENE_TOP_PADDING + 2 * FAMILY_TREE_GENERATION_ROW_HEIGHT,
      width: FAMILY_TREE_PERSON_WIDTH,
      height: FAMILY_TREE_PERSON_HEIGHT,
    });
    expect(familyTreeAvatarBox(selectedPerson)).toEqual({
      x: box.x + 22,
      y: box.y + 10,
      width: 72,
      height: 72,
    });
    expect(familyTreePersonNameBox(selectedPerson)).toEqual({
      x: box.x,
      y: box.y + 87,
      width: box.width,
      height: 20,
    });
  });

  it('places each connection in the gap between adjacent generation rows', () => {
    expect(familyTreeConnectionY(0)).toBe(
      FAMILY_TREE_SCENE_TOP_PADDING + FAMILY_TREE_PERSON_HEIGHT +
        (FAMILY_TREE_GENERATION_ROW_HEIGHT - FAMILY_TREE_PERSON_HEIGHT) / 2,
    );
    expect(familyTreeConnectionY(2) - familyTreeConnectionY(0)).toBe(2 * FAMILY_TREE_GENERATION_ROW_HEIGHT);
  });

  it('returns short endpoint segments from each side of the person card', () => {
    const selectedPerson = person({ generation: 1, x: 20 });
    const box = familyTreePersonBox(selectedPerson);

    expect(familyTreeEndpointSegment(selectedPerson, 'top')).toEqual({
      start: { x: box.x + box.width / 2, y: box.y },
      end: { x: box.x + box.width / 2, y: box.y - 24.5 },
    });
    expect(familyTreeEndpointSegment(selectedPerson, 'bottom')).toEqual({
      start: { x: box.x + box.width / 2, y: box.y + box.height },
      end: { x: box.x + box.width / 2, y: box.y + box.height + 24.5 },
    });
    expect(familyTreeEndpointSegment(selectedPerson, 'left')).toEqual({
      start: { x: box.x, y: box.y + box.height / 2 },
      end: { x: box.x - 16, y: box.y + box.height / 2 },
    });
    expect(familyTreeEndpointSegment(selectedPerson, 'right')).toEqual({
      start: { x: box.x + box.width, y: box.y + box.height / 2 },
      end: { x: box.x + box.width + 16, y: box.y + box.height / 2 },
    });
  });

  it('uses the minimum scene width and expands for people or connections', () => {
    expect(familyTreeSceneSize(scene())).toEqual({
      width: FAMILY_TREE_SCENE_MIN_WIDTH,
      height: FAMILY_TREE_SCENE_TOP_PADDING + 4 * FAMILY_TREE_GENERATION_ROW_HEIGHT,
    });

    const measured = familyTreeSceneSize(scene({
      generations: [[person({ x: 1000 })], [], [], []],
      connections: [{ id: 'connection-a', gap: 1, x: 850, width: 200 }],
    }));
    expect(measured.width).toBe(1244);
  });

  it('rejects an invalid connection width with the received value', () => {
    expect(() => familyTreeSceneSize(scene({
      connections: [{ id: 'connection-a', gap: 0, x: 0, width: 23 }],
    }))).toThrow('received 23');
  });

  it('rejects a scene with the wrong generation tuple before reading layout geometry', () => {
    expect(() => familyTreeSceneSize({
      version: 1,
      generations: [[]] as unknown as FamilyTreeScene['generations'],
      connections: [],
      selectedPersonId: null,
      resizeEnabled: false,
    })).toThrow('exactly 4 arrays');
  });
});
