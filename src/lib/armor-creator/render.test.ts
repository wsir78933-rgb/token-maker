import { describe, expect, it } from 'vitest';

import {
  ARMOR_PREVIEW_HEIGHT,
  ARMOR_PREVIEW_WIDTH,
  listArmorPieceIds,
  type ArmorGender,
  type ArmorMaterial,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';
import {
  createInitialArmorSelection,
  selectArmorGender,
  selectArmorMaterial,
  setChestCurve,
  toggleArmorPiece,
  type ArmorSelection,
} from '@/lib/armor-creator/selection';
import {
  drawArmorLayers,
  listArmorRenderLayers,
  type ArmorRenderLayer,
  type ArmorRenderSlot,
} from '@/lib/armor-creator/render';

function firstPieceId(
  gender: ArmorGender,
  material: ArmorMaterial,
  slot: Exclude<ArmorSlot, 'crown' | 'wing'>,
): string {
  const pieceIds = listArmorPieceIds({ slot, gender, material });
  const pieceId = pieceIds[0];
  if (pieceId === undefined) {
    throw new Error(`Missing ${gender} ${material} piece for ${slot}.`);
  }

  return pieceId;
}

function firstSharedPieceId(slot: 'crown' | 'wing'): string {
  const pieceIds = listArmorPieceIds({ slot });
  const pieceId = pieceIds[0];
  if (pieceId === undefined) {
    throw new Error(`Missing shared piece for ${slot}.`);
  }

  return pieceId;
}

function renderLayer(
  slot: ArmorRenderSlot,
  pieceId: string | null,
  mirror = false,
  flatChest = false,
): ArmorRenderLayer {
  return { slot, pieceId, mirror, flatChest };
}

describe('listArmorRenderLayers', () => {
  it('空装备时仍然有 body', () => {
    expect(listArmorRenderLayers(createInitialArmorSelection())).toEqual([
      renderLayer('body', null),
    ]);
  });

  it('从后往前排层，脚后跟复用脚的编号，只有左肩镜像，女板胸曲线关闭时平胸', () => {
    const feet = firstPieceId('female', 'plate', 'feet');
    const chest = firstPieceId('female', 'plate', 'chest');
    const selection: ArmorSelection = {
      gender: 'female',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: false,
      equippedPieceIds: {
        wing: firstSharedPieceId('wing'),
        cloakBack: firstPieceId('female', 'plate', 'cloakBack'),
        feet,
        legs: firstPieceId('female', 'plate', 'legs'),
        gloves: firstPieceId('female', 'plate', 'gloves'),
        chest,
        cloakFront: firstPieceId('female', 'plate', 'cloakFront'),
        shoulderLeft: firstPieceId('female', 'plate', 'shoulderLeft'),
        shoulderRight: firstPieceId('female', 'plate', 'shoulderRight'),
        helm: firstPieceId('female', 'plate', 'helm'),
        crown: firstSharedPieceId('crown'),
      },
    };

    expect(listArmorRenderLayers(selection)).toEqual([
      renderLayer('wing', selection.equippedPieceIds.wing ?? null),
      renderLayer('cloakBack', selection.equippedPieceIds.cloakBack ?? null),
      renderLayer('body', null),
      renderLayer('feetBack', feet),
      renderLayer('legs', selection.equippedPieceIds.legs ?? null),
      renderLayer('feet', feet),
      renderLayer('gloves', selection.equippedPieceIds.gloves ?? null),
      renderLayer('chest', chest, false, true),
      renderLayer('cloakFront', selection.equippedPieceIds.cloakFront ?? null),
      renderLayer('shoulderLeft', selection.equippedPieceIds.shoulderLeft ?? null, true),
      renderLayer('shoulderRight', selection.equippedPieceIds.shoulderRight ?? null),
      renderLayer('helm', selection.equippedPieceIds.helm ?? null),
      renderLayer('crown', selection.equippedPieceIds.crown ?? null),
    ]);
  });

  it('没穿的部位不出现，穿过的部位仍按从后往前的顺序', () => {
    const feet = firstPieceId('male', 'plate', 'feet');
    const helm = firstPieceId('male', 'plate', 'helm');
    const wing = firstSharedPieceId('wing');
    let selection = createInitialArmorSelection();
    selection = toggleArmorPiece(selection, wing);
    selection = toggleArmorPiece(selection, feet);
    selection = toggleArmorPiece(selection, helm);

    expect(listArmorRenderLayers(selection).map((layer) => layer.slot)).toEqual([
      'wing',
      'body',
      'feetBack',
      'feet',
      'helm',
    ]);
    expect(listArmorRenderLayers(selection).filter((layer) => layer.slot === 'feetBack')).toEqual([
      renderLayer('feetBack', feet),
    ]);
  });

  it('胸甲曲线开启，或不是女板胸时，不平胸', () => {
    const femalePlateChest = firstPieceId('female', 'plate', 'chest');
    const curved = setChestCurve(
      toggleArmorPiece(selectArmorGender(createInitialArmorSelection(), 'female'), femalePlateChest),
      true,
    );
    expect(listArmorRenderLayers(curved).find((layer) => layer.slot === 'chest')?.flatChest).toBe(
      false,
    );

    const maleChest = firstPieceId('male', 'plate', 'chest');
    const maleFlatRequest = setChestCurve(
      toggleArmorPiece(createInitialArmorSelection(), maleChest),
      false,
    );
    expect(
      listArmorRenderLayers(maleFlatRequest).find((layer) => layer.slot === 'chest')?.flatChest,
    ).toBe(false);

    const femaleLeatherChest = firstPieceId('female', 'leather', 'chest');
    const leather = setChestCurve(
      toggleArmorPiece(
        selectArmorGender(selectArmorMaterial(createInitialArmorSelection(), 'leather'), 'female'),
        femaleLeatherChest,
      ),
      false,
    );
    expect(listArmorRenderLayers(leather).find((layer) => layer.slot === 'chest')?.flatChest).toBe(
      false,
    );
  });

  it('某个槽位的编号是 undefined 时抛错，并带上槽位名', () => {
    const selection = createInitialArmorSelection();

    expect(() =>
      listArmorRenderLayers({
        ...selection,
        equippedPieceIds: { helm: undefined },
      }),
    ).toThrowError('Armor equipped piece for slot "helm" is undefined. Received undefined.');
  });
});

function armorPreviewDrawContext() {
  return {
    canvas: { width: ARMOR_PREVIEW_WIDTH, height: ARMOR_PREVIEW_HEIGHT },
    clearRect() {},
    save() {},
    restore() {},
    translate() {},
    scale() {},
    drawImage() {},
  };
}

function failingImageConstructor() {
  const image = {
    onload: null as null | (() => void),
    onerror: null as null | (() => void),
  };

  return Object.defineProperty(image, 'src', {
    set(_source: string) {
      if (image.onerror === null) {
        throw new Error('Armor image decode test expected onerror. Received null.');
      }

      image.onerror();
    },
  });
}

describe('drawArmorLayers failure messages', () => {
  it('Image 不是函数时写上 typeof，解码失败时带上 label', async () => {
    const imageGlobal = globalThis as { Image?: unknown };
    const previousImage = imageGlobal.Image;

    try {
      imageGlobal.Image = undefined;
      await expect(
        drawArmorLayers(armorPreviewDrawContext(), createInitialArmorSelection()),
      ).rejects.toThrow(
        'Armor SVG for "body" cannot be drawn because Image is not a function. Received typeof undefined.',
      );

      imageGlobal.Image = failingImageConstructor;
      await expect(
        drawArmorLayers(armorPreviewDrawContext(), createInitialArmorSelection()),
      ).rejects.toThrow('Armor SVG for "body" could not be decoded. Received label "body".');
    } finally {
      imageGlobal.Image = previousImage;
    }
  });
});
