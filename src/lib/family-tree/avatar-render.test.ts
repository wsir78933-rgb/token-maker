import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createInitialFamilyTreeAvatar,
  selectFamilyTreeAvatarChoice,
  setFamilyTreeAvatarColor,
} from '@/lib/family-tree/avatar';
import {
  FAMILY_TREE_AVATAR_CATEGORIES,
  FAMILY_TREE_COLOR_PALETTES,
  getFamilyTreeCategoryChoices,
  type FamilyTreeAvatarCategory,
  type FamilyTreeAvatarColorKey,
} from '@/lib/family-tree/catalog';
import {
  drawFamilyTreeAvatar,
  FAMILY_TREE_AVATAR_HEIGHT,
  FAMILY_TREE_AVATAR_WIDTH,
  getFamilyTreeAvatarLayers,
  getFamilyTreeChoiceImagePath,
} from '@/lib/family-tree/avatar-render';
import familyTreeManifest from '../../../public/family-tree/rollforfantasy/manifest.json';

afterEach(() => {
  vi.unstubAllGlobals();
});

function selectChoices(
  initialAvatar: ReturnType<typeof createInitialFamilyTreeAvatar>,
  choiceIds: readonly string[],
) {
  return choiceIds.reduce(
    (avatar, choiceId) => selectFamilyTreeAvatarChoice(avatar, choiceId),
    initialAvatar,
  );
}

const COLOR_KEYS_BY_CATEGORY: Readonly<
  Partial<Record<FamilyTreeAvatarCategory, readonly FamilyTreeAvatarColorKey[]>>
> = {
  faces: ['skinColor'],
  hair: ['hairColor'],
  ears: ['skinColor'],
  eyes: ['eyeColor'],
  eyebrows: ['eyebrowColor'],
  noses: ['moustacheColor'],
};

const assetLocalUrls = new Set(familyTreeManifest.assets.map((asset) => asset.localUrl));

function requireManifestAssetPath(path: string, choiceId: string): void {
  if (!assetLocalUrls.has(path)) {
    throw new Error(
      `Family tree choice ${JSON.stringify(choiceId)} resolved to ${JSON.stringify(path)}, which is absent from the verified asset manifest.`,
    );
  }
}

function choiceColorKeys(
  category: FamilyTreeAvatarCategory,
  choiceGroup: string,
): readonly FamilyTreeAvatarColorKey[] {
  if (category === 'faces' && choiceGroup === 'beards') {
    return ['hairColor'];
  }

  return COLOR_KEYS_BY_CATEGORY[category] ?? [];
}

describe('family tree avatar rendering', () => {
  it('maps every source family to the local asset URL and color index', () => {
    let avatar = createInitialFamilyTreeAvatar();
    avatar = setFamilyTreeAvatarColor(avatar, 'skinColor', 24);
    avatar = setFamilyTreeAvatarColor(avatar, 'hairColor', 16);
    avatar = setFamilyTreeAvatarColor(avatar, 'eyeColor', 10);
    avatar = setFamilyTreeAvatarColor(avatar, 'eyebrowColor', 16);
    avatar = setFamilyTreeAvatarColor(avatar, 'moustacheColor', 16);

    expect(getFamilyTreeChoiceImagePath(avatar, 'face1')).toBe(
      '/family-tree/rollforfantasy/images/npc/head507.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'mface18')).toBe(
      '/family-tree/rollforfantasy/images/npc/mhead432.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'beards17')).toBe(
      '/family-tree/rollforfantasy/images/npc/beards272.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'hair40')).toBe(
      '/family-tree/rollforfantasy/images/npc/hair640.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'ears5')).toBe(
      '/family-tree/rollforfantasy/images/npc/earOrc24.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'eyes21')).toBe(
      '/family-tree/rollforfantasy/images/npc/eyesOrc181.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'eb80')).toBe(
      '/family-tree/rollforfantasy/images/npc/eb1280.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'nose30')).toBe(
      '/family-tree/rollforfantasy/images/npc/nose30.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'mstch28')).toBe(
      '/family-tree/rollforfantasy/images/npc/mstch448.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'mouth80')).toBe(
      '/family-tree/rollforfantasy/images/npc/mouthOrc40.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'old11')).toBe(
      '/family-tree/rollforfantasy/images/npc/old11.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'eyesp10')).toBe(
      '/family-tree/rollforfantasy/images/npc/eyesp10.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'scar30')).toBe(
      '/family-tree/rollforfantasy/images/npc/scar30.png',
    );
    expect(getFamilyTreeChoiceImagePath(avatar, 'hair0')).toBeNull();
    expect(getFamilyTreeChoiceImagePath(avatar, 'reset-wrinkles')).toBeNull();
  });

  it('uses the source-specific base face for beard styles 7, 9, and 16', () => {
    let avatar = createInitialFamilyTreeAvatar();
    avatar = setFamilyTreeAvatarColor(avatar, 'skinColor', 24);

    for (const beardStyle of ['beards7', 'beards9', 'beards16']) {
      const selectedAvatar = selectFamilyTreeAvatarChoice(avatar, beardStyle);
      expect(getFamilyTreeAvatarLayers(selectedAvatar).find((layer) => layer.id === 'face')?.src).toBe(
        '/family-tree/rollforfantasy/images/npc/mhead415.png',
      );
    }

    const regularBeardAvatar = selectFamilyTreeAvatarChoice(avatar, 'beards17');
    expect(getFamilyTreeAvatarLayers(regularBeardAvatar).find((layer) => layer.id === 'face')?.src).toBe(
      '/family-tree/rollforfantasy/images/npc/mhead425.png',
    );
  });

  it('covers every candidate and corresponding palette against the verified asset manifest', () => {
    if (familyTreeManifest.assetCount !== familyTreeManifest.assets.length) {
      throw new Error(
        `Family tree manifest count ${familyTreeManifest.assetCount} does not match its asset records ${familyTreeManifest.assets.length}.`,
      );
    }

    for (const category of FAMILY_TREE_AVATAR_CATEGORIES) {
      for (const choice of getFamilyTreeCategoryChoices(category)) {
        const colorKeys = choiceColorKeys(category, choice.group);
        const colorVariants = colorKeys.length === 0
          ? [{ avatar: createInitialFamilyTreeAvatar(), colorLabel: 'default' }]
          : colorKeys.flatMap((colorKey) => {
              const colorCount = FAMILY_TREE_COLOR_PALETTES[colorKey].length;
              return Array.from({ length: colorCount }, (_, colorOffset) => {
                const colorIndex = colorOffset + 1;
                return {
                  avatar: setFamilyTreeAvatarColor(
                    createInitialFamilyTreeAvatar(),
                    colorKey,
                    colorIndex,
                  ),
                  colorLabel: `${colorKey}-${colorIndex}`,
                };
              });
            });

        for (const colorVariant of colorVariants) {
          const choicePath = getFamilyTreeChoiceImagePath(colorVariant.avatar, choice.id);
          if (choicePath === null) {
            if (choice.id !== 'hair0' && choice.id !== 'reset-wrinkles') {
              throw new Error(
                `Family tree choice ${JSON.stringify(choice.id)} unexpectedly resolved to no image for ${colorVariant.colorLabel}.`,
              );
            }
          } else {
            requireManifestAssetPath(choicePath, choice.id);
          }

          const selectedAvatar = selectFamilyTreeAvatarChoice(
            colorVariant.avatar,
            choice.id,
          );
          for (const layer of getFamilyTreeAvatarLayers(selectedAvatar)) {
            requireManifestAssetPath(layer.src, `${choice.id} (${colorVariant.colorLabel})`);
          }
        }
      }
    }
  });

  it('keeps source layer order, wrinkle opacity, and the hidden-ear rule', () => {
    const avatar = selectChoices(createInitialFamilyTreeAvatar(), [
      'beards17',
      'hair13',
      'ears2',
      'eyes21',
      'eb80',
      'mstch28',
      'mouth80',
      'old11',
      'eyesp10',
      'scar30',
      'scar2',
    ]);
    const layers = getFamilyTreeAvatarLayers(avatar);

    expect(layers.map((layer) => layer.id)).toEqual([
      'bhair',
      'face',
      'scar2',
      'scar30',
      'beard',
      'mouth',
      'nose',
      'eyes',
      'eyesSp',
      'faceSp',
      'eyebrows',
      'hair',
      'ear',
    ]);
    expect(layers.every((layer) => (
      layer.x === 0 &&
      layer.y === 0 &&
      layer.width === FAMILY_TREE_AVATAR_WIDTH &&
      layer.height === FAMILY_TREE_AVATAR_HEIGHT
    ))).toBe(true);
    expect(layers.find((layer) => layer.id === 'eyesSp')?.opacity).toBe(0.4);
    expect(layers.find((layer) => layer.id === 'faceSp')?.opacity).toBe(0.4);
    expect(layers.find((layer) => layer.id === 'ear')?.src).toBe(
      '/family-tree/rollforfantasy/images/npc/earhElf1.png',
    );

    const noEarLayerAvatar = selectFamilyTreeAvatarChoice(avatar, 'ears1');
    expect(getFamilyTreeAvatarLayers(noEarLayerAvatar).map((layer) => layer.id)).not.toContain('ear');
  });

  it('omits source-missing back hair while retaining the front hair layer', () => {
    const initialLayers = getFamilyTreeAvatarLayers(createInitialFamilyTreeAvatar());
    expect(initialLayers.map((layer) => layer.id)).not.toContain('bhair');
    expect(initialLayers.find((layer) => layer.id === 'hair')?.src).toBe(
      '/family-tree/rollforfantasy/images/npc/hair1.png',
    );

    const availableBackHairAvatar = selectFamilyTreeAvatarChoice(
      createInitialFamilyTreeAvatar(),
      'hair5',
    );
    expect(getFamilyTreeAvatarLayers(availableBackHairAvatar).find((layer) => layer.id === 'bhair')?.src).toBe(
      '/family-tree/rollforfantasy/images/npc/bhair5.png',
    );
  });

  it('loads and draws all layers without clearing the caller-owned background', async () => {
    class ImmediateImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onload?.();
      }
    }

    vi.stubGlobal('Image', ImmediateImage);
    const drawCalls: unknown[][] = [];
    const context = {
      clearRect: vi.fn(),
      drawImage: vi.fn((...argumentsList: unknown[]) => {
        drawCalls.push(argumentsList);
      }),
      globalAlpha: 0.75,
    } as unknown as CanvasRenderingContext2D;

    await drawFamilyTreeAvatar(context, createInitialFamilyTreeAvatar(), 4, 6, 72, 72);

    expect(context.clearRect).not.toHaveBeenCalled();
    expect(drawCalls).toHaveLength(getFamilyTreeAvatarLayers(createInitialFamilyTreeAvatar()).length);
    expect(drawCalls[0]?.slice(1)).toEqual([4, 6, 72, 72]);
    expect(context.globalAlpha).toBe(0.75);
  });

  it('restores alpha and reports a draw failure with the concrete cause', async () => {
    class ImmediateImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onload?.();
      }
    }

    vi.stubGlobal('Image', ImmediateImage);
    const context = {
      clearRect: vi.fn(),
      drawImage: vi.fn(() => {
        throw new Error('canvas is unavailable');
      }),
      globalAlpha: 0.6,
    } as unknown as CanvasRenderingContext2D;

    await expect(
      drawFamilyTreeAvatar(context, createInitialFamilyTreeAvatar(), 0, 0, 1, 1),
    ).rejects.toThrow('canvas is unavailable');
    expect(context.globalAlpha).toBe(0.6);
  });
});
