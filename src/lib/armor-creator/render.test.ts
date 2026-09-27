import { describe, expect, it } from 'vitest';

import {
  ARMOR_PREVIEW_HEIGHT,
  ARMOR_PREVIEW_WIDTH,
  listArmorPieceIds,
  type ArmorGender,
  type ArmorMaterial,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';
import { armorBodyImagePath, armorPieceImagePath } from '@/lib/armor-creator/icons';
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

type RecordedArmorDraw = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  mirrored: boolean;
  translateX: number | null;
  translateY: number | null;
};

function recordedArmorImageSource(image: CanvasImageSource): string {
  const source: unknown = 'src' in image ? image.src : undefined;
  if (typeof source !== 'string') {
    throw new Error(
      `Armor draw recorder image src must be a string. Received ${JSON.stringify(source)}.`,
    );
  }

  return source;
}

type QueuedArmorImage = {
  onload: null | (() => void);
  onerror: null | (() => void);
  src: string;
};

function createArmorDrawRecorder() {
  const draws: RecordedArmorDraw[] = [];
  let clearCount = 0;
  const mirrorStack: boolean[] = [];
  let mirrored = false;
  let translateX: number | null = null;
  let translateY: number | null = null;

  return {
    draws,
    clearCount: () => clearCount,
    context: {
      canvas: { width: ARMOR_PREVIEW_WIDTH, height: ARMOR_PREVIEW_HEIGHT },
      clearRect(x: number, y: number, width: number, height: number) {
        if (x !== 0 || y !== 0 || width !== ARMOR_PREVIEW_WIDTH || height !== ARMOR_PREVIEW_HEIGHT) {
          throw new Error(
            `Unexpected armor clear ${String(x)},${String(y)} ${String(width)}x${String(height)}.`,
          );
        }

        clearCount += 1;
      },
      save() {
        mirrorStack.push(mirrored);
      },
      restore() {
        const previous = mirrorStack.pop();
        if (previous === undefined) {
          throw new Error('Armor draw recorder restore was called without save.');
        }

        mirrored = previous;
        translateX = null;
        translateY = null;
      },
      translate(x: number, y: number) {
        translateX = x;
        translateY = y;
      },
      scale(x: number, y: number) {
        if (x !== -1 || y !== 1) {
          throw new Error(`Unexpected armor scale ${String(x)},${String(y)}.`);
        }

        mirrored = true;
      },
      drawImage(image: CanvasImageSource, x: number, y: number, width: number, height: number) {
        draws.push({
          src: recordedArmorImageSource(image),
          x,
          y,
          width,
          height,
          mirrored,
          translateX,
          translateY,
        });
      },
    },
  };
}

function createQueuedArmorImages() {
  const pending: QueuedArmorImage[] = [];

  function QueuedArmorImageConstructor(this: QueuedArmorImage) {
    this.onload = null;
    this.onerror = null;
    let source = '';
    Object.defineProperty(this, 'src', {
      configurable: true,
      enumerable: true,
      get() {
        return source;
      },
      set(this: QueuedArmorImage, nextSource: string) {
        source = nextSource;
        pending.push(this);
      },
    });
  }

  return {
    QueuedArmorImageConstructor,
    takePending(): QueuedArmorImage[] {
      return pending.splice(0, pending.length);
    },
    finish(images: readonly QueuedArmorImage[]) {
      for (const image of images) {
        if (image.onload === null) {
          throw new Error(`Armor image ${JSON.stringify(image.src)} is missing onload.`);
        }

        image.onload();
      }
    },
    fail(image: QueuedArmorImage) {
      if (image.onerror === null) {
        throw new Error(`Armor image ${JSON.stringify(image.src)} is missing onerror.`);
      }

      image.onerror();
    },
  };
}

async function withQueuedArmorImages<T>(
  run: (queue: ReturnType<typeof createQueuedArmorImages>) => Promise<T>,
): Promise<T> {
  const imageGlobal = globalThis as { Image?: unknown };
  const previousImage = imageGlobal.Image;
  const queue = createQueuedArmorImages();
  imageGlobal.Image = queue.QueuedArmorImageConstructor;

  try {
    return await run(queue);
  } finally {
    imageGlobal.Image = previousImage;
  }
}

function expectLocalArmorPng(sourceUrl: string): void {
  expect(sourceUrl.startsWith('/armor-creator/')).toBe(true);
  expect(sourceUrl.endsWith('.png')).toBe(true);
}

function drawnAt(
  draws: readonly RecordedArmorDraw[],
  sourceUrl: string,
): RecordedArmorDraw {
  const matches = draws.filter((draw) => draw.src === sourceUrl);
  if (matches.length !== 1) {
    throw new Error(
      `Expected one draw for ${JSON.stringify(sourceUrl)}. Received ${String(matches.length)}.`,
    );
  }

  const draw = matches[0];
  if (draw === undefined) {
    throw new Error(`Missing draw for ${JSON.stringify(sourceUrl)}.`);
  }

  return draw;
}

function expectStraightBox(
  draw: RecordedArmorDraw,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  expect(draw.mirrored).toBe(false);
  expect(draw.translateX).toBeNull();
  expect(draw).toMatchObject({ x, y, width, height });
}

function expectMirroredBox(
  draw: RecordedArmorDraw,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  expect(draw.mirrored).toBe(true);
  expect(draw.translateX).toBe(x + width);
  expect(draw.translateY).toBe(y);
  expect(draw).toMatchObject({ x: 0, y: 0, width, height });
}

describe('drawArmorLayers 原始图片', () => {
  it('男女身体使用不同的本地图', async () => {
    const malePath = armorBodyImagePath('male');
    const femalePath = armorBodyImagePath('female');
    expectLocalArmorPng(malePath);
    expectLocalArmorPng(femalePath);
    expect(malePath).not.toBe(femalePath);

    await withQueuedArmorImages(async (queue) => {
      const maleRecorder = createArmorDrawRecorder();
      const maleDrawing = drawArmorLayers(maleRecorder.context, createInitialArmorSelection());
      const maleImages = queue.takePending();
      expect(maleImages.map((image) => image.src)).toEqual([malePath]);
      expect(maleRecorder.clearCount()).toBe(0);
      queue.finish(maleImages);
      await maleDrawing;
      expect(maleRecorder.clearCount()).toBe(1);
      expectStraightBox(drawnAt(maleRecorder.draws, malePath), 200, 102, 200, 400);

      const femaleRecorder = createArmorDrawRecorder();
      const femaleDrawing = drawArmorLayers(
        femaleRecorder.context,
        selectArmorGender(createInitialArmorSelection(), 'female'),
      );
      queue.finish(queue.takePending());
      await femaleDrawing;
      expectStraightBox(drawnAt(femaleRecorder.draws, femalePath), 200, 102, 200, 400);
    });
  });

  it('混穿时按每件自己的材质坐标绘制，布甲左肩镜像，不用当前浏览的板甲坐标', async () => {
    const helm = firstPieceId('male', 'leather', 'helm');
    const chest = firstPieceId('male', 'cloth', 'chest');
    const feet = firstPieceId('male', 'cloth', 'feet');
    const legs = firstPieceId('male', 'leather', 'legs');
    const gloves = firstPieceId('male', 'plate', 'gloves');
    const cloakFront = firstPieceId('male', 'leather', 'cloakFront');
    const shoulderLeft = firstPieceId('male', 'cloth', 'shoulderLeft');
    const shoulderRight = firstPieceId('male', 'plate', 'shoulderRight');
    const selection: ArmorSelection = {
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: {
        helm,
        chest,
        feet,
        legs,
        gloves,
        cloakFront,
        shoulderLeft,
        shoulderRight,
      },
    };
    const bodyPath = armorBodyImagePath('male');
    const feetBackPath = armorPieceImagePath(feet, { feetBack: true });
    const feetPath = armorPieceImagePath(feet);
    const expectedSources = [
      bodyPath,
      feetBackPath,
      armorPieceImagePath(legs),
      feetPath,
      armorPieceImagePath(gloves),
      armorPieceImagePath(chest),
      armorPieceImagePath(cloakFront),
      armorPieceImagePath(shoulderLeft),
      armorPieceImagePath(shoulderRight),
      armorPieceImagePath(helm),
    ];

    for (const sourceUrl of expectedSources) {
      expectLocalArmorPng(sourceUrl);
    }
    expect(feetBackPath).not.toBe(feetPath);

    await withQueuedArmorImages(async (queue) => {
      const recorder = createArmorDrawRecorder();
      const drawing = drawArmorLayers(recorder.context, selection);
      const pending = queue.takePending();
      expect(pending.map((image) => image.src)).toEqual(expectedSources);
      expect(recorder.clearCount()).toBe(0);
      expect(recorder.draws).toEqual([]);
      queue.finish(pending);
      await drawing;

      expect(recorder.clearCount()).toBe(1);
      expect(recorder.draws.map((draw) => draw.src)).toEqual(expectedSources);
      expectStraightBox(drawnAt(recorder.draws, bodyPath), 200, 102, 200, 400);
      expectStraightBox(drawnAt(recorder.draws, feetBackPath), 238, 402, 120, 120);
      expectStraightBox(drawnAt(recorder.draws, armorPieceImagePath(legs)), 239, 280, 120, 180);
      expectStraightBox(drawnAt(recorder.draws, feetPath), 238, 402, 120, 120);
      expectStraightBox(drawnAt(recorder.draws, armorPieceImagePath(gloves)), 220, 249, 160, 90);
      expectStraightBox(drawnAt(recorder.draws, armorPieceImagePath(chest)), 222, 183, 155, 300);
      expectStraightBox(drawnAt(recorder.draws, armorPieceImagePath(cloakFront)), 235, 164, 130, 110);
      expectMirroredBox(drawnAt(recorder.draws, armorPieceImagePath(shoulderLeft)), 208, 151, 90, 110);
      expectStraightBox(drawnAt(recorder.draws, armorPieceImagePath(shoulderRight)), 302, 151, 90, 90);
      expectStraightBox(drawnAt(recorder.draws, armorPieceImagePath(helm)), 250, 112, 100, 100);
    });
  });

  it('后脚使用独立图，女板平胸使用另一张胸甲图', async () => {
    const feet = firstPieceId('female', 'plate', 'feet');
    const chest = firstPieceId('female', 'plate', 'chest');
    const selection: ArmorSelection = {
      gender: 'female',
      material: 'leather',
      shoulderSymmetry: false,
      chestCurve: false,
      equippedPieceIds: { feet, chest },
    };
    const bodyPath = armorBodyImagePath('female');
    const feetBackPath = armorPieceImagePath(feet, { feetBack: true });
    const feetPath = armorPieceImagePath(feet);
    const flatChestPath = armorPieceImagePath(chest, { flatChest: true });
    const curvedChestPath = armorPieceImagePath(chest);

    expect(feetBackPath).not.toBe(feetPath);
    expect(flatChestPath).not.toBe(curvedChestPath);
    expectLocalArmorPng(feetBackPath);
    expectLocalArmorPng(flatChestPath);

    await withQueuedArmorImages(async (queue) => {
      const recorder = createArmorDrawRecorder();
      const drawing = drawArmorLayers(recorder.context, selection);
      const pending = queue.takePending();
      expect(pending.map((image) => image.src)).toEqual([
        bodyPath,
        feetBackPath,
        feetPath,
        flatChestPath,
      ]);
      queue.finish(pending);
      await drawing;

      expectStraightBox(drawnAt(recorder.draws, feetBackPath), 239, 402, 120, 120);
      expectStraightBox(drawnAt(recorder.draws, feetPath), 239, 402, 120, 120);
      expectStraightBox(drawnAt(recorder.draws, flatChestPath), 231, 179, 135, 135);
      expect(recorder.draws.some((draw) => draw.src === curvedChestPath)).toBe(false);
    });
  });

  it('布甲头盔、皮甲胸、布甲前斗篷和固定层使用源站坐标', async () => {
    const helm = firstPieceId('female', 'cloth', 'helm');
    const chest = firstPieceId('female', 'leather', 'chest');
    const cloakFront = firstPieceId('female', 'cloth', 'cloakFront');
    const cloakBack = firstPieceId('female', 'plate', 'cloakBack');
    const shoulderLeft = firstPieceId('female', 'leather', 'shoulderLeft');
    const wing = firstSharedPieceId('wing');
    const crown = firstSharedPieceId('crown');
    const selection: ArmorSelection = {
      gender: 'female',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: {
        helm,
        chest,
        cloakFront,
        cloakBack,
        shoulderLeft,
        wing,
        crown,
      },
    };
    const wingPath = armorPieceImagePath(wing);
    const cloakBackPath = armorPieceImagePath(cloakBack);
    const bodyPath = armorBodyImagePath('female');
    const chestPath = armorPieceImagePath(chest);
    const cloakFrontPath = armorPieceImagePath(cloakFront);
    const shoulderPath = armorPieceImagePath(shoulderLeft);
    const helmPath = armorPieceImagePath(helm);
    const crownPath = armorPieceImagePath(crown);

    await withQueuedArmorImages(async (queue) => {
      const recorder = createArmorDrawRecorder();
      const drawing = drawArmorLayers(recorder.context, selection);
      const pending = queue.takePending();
      expect(recorder.clearCount()).toBe(0);
      queue.finish(pending);
      await drawing;

      expect(recorder.clearCount()).toBe(1);
      expect(recorder.draws.map((draw) => draw.src)).toEqual([
        wingPath,
        cloakBackPath,
        bodyPath,
        chestPath,
        cloakFrontPath,
        shoulderPath,
        helmPath,
        crownPath,
      ]);
      expectStraightBox(drawnAt(recorder.draws, wingPath), 0, 0, 600, 500);
      expectStraightBox(drawnAt(recorder.draws, cloakBackPath), 219, 215, 175, 260);
      expectStraightBox(drawnAt(recorder.draws, chestPath), 230, 177, 135, 166);
      expectStraightBox(drawnAt(recorder.draws, cloakFrontPath), 255, 188, 90, 95);
      expectMirroredBox(drawnAt(recorder.draws, shoulderPath), 208, 151, 90, 90);
      expectStraightBox(drawnAt(recorder.draws, helmPath), 250, 106, 100, 120);
      expectStraightBox(drawnAt(recorder.draws, crownPath), 269, 121, 60, 60);
    });
  });
});

describe('drawArmorLayers failure messages', () => {
  it('Image 不是函数时写上 typeof 和身体图地址', async () => {
    const imageGlobal = globalThis as { Image?: unknown };
    const previousImage = imageGlobal.Image;
    const bodyPath = armorBodyImagePath('male');

    try {
      imageGlobal.Image = undefined;
      await expect(
        drawArmorLayers(createArmorDrawRecorder().context, createInitialArmorSelection()),
      ).rejects.toThrow(
        `Armor image for "body" cannot be drawn from ${JSON.stringify(bodyPath)} because Image is not a function. Received typeof undefined.`,
      );
    } finally {
      imageGlobal.Image = previousImage;
    }
  });

  it('解码失败时带上源地址和 pieceId，并且不清画布', async () => {
    const helm = firstPieceId('male', 'plate', 'helm');
    const helmPath = armorPieceImagePath(helm);
    const selection = toggleArmorPiece(createInitialArmorSelection(), helm);

    await withQueuedArmorImages(async (queue) => {
      const recorder = createArmorDrawRecorder();
      const drawing = drawArmorLayers(recorder.context, selection);
      const pending = queue.takePending();
      const helmImage = pending.find((image) => image.src === helmPath);
      if (helmImage === undefined) {
        throw new Error(`Helm image ${JSON.stringify(helmPath)} was not requested.`);
      }

      expect(recorder.clearCount()).toBe(0);
      queue.fail(helmImage);
      await expect(drawing).rejects.toThrow(helmPath);
      await expect(drawing).rejects.toThrow(helm);
      expect(recorder.clearCount()).toBe(0);
      expect(recorder.draws).toEqual([]);
    });
  });

  it('绘制谓词不是函数时带上收到的值', async () => {
    const notAFunction: unknown = 'later';

    await expect(
      drawArmorLayers(
        createArmorDrawRecorder().context,
        createInitialArmorSelection(),
        notAFunction as () => boolean,
      ),
    ).rejects.toThrow(
      'Armor draw predicate must be a function. Received "later".',
    );
  });
});

describe('drawArmorLayers 过期绘制', () => {
  it('旧请求在图片加载完后发现已过期时，不清当前画布', async () => {
    await withQueuedArmorImages(async (queue) => {
      const recorder = createArmorDrawRecorder();
      let activeDraw = 'first';
      const firstDrawing = drawArmorLayers(
        recorder.context,
        createInitialArmorSelection(),
        () => activeDraw === 'first',
      );
      const firstImages = queue.takePending();
      expect(firstImages).toHaveLength(1);
      expect(recorder.clearCount()).toBe(0);

      activeDraw = 'second';
      const secondDrawing = drawArmorLayers(
        recorder.context,
        selectArmorGender(createInitialArmorSelection(), 'female'),
        () => activeDraw === 'second',
      );
      const secondImages = queue.takePending();
      queue.finish(secondImages);
      await secondDrawing;
      expect(recorder.clearCount()).toBe(1);
      expect(recorder.draws.map((draw) => draw.src)).toEqual([armorBodyImagePath('female')]);

      queue.finish(firstImages);
      await firstDrawing;
      expect(recorder.clearCount()).toBe(1);
      expect(recorder.draws.map((draw) => draw.src)).toEqual([armorBodyImagePath('female')]);
    });
  });

  it('谓词在加载后返回非布尔值时抛错，并且不清画布', async () => {
    await withQueuedArmorImages(async (queue) => {
      const recorder = createArmorDrawRecorder();
      const drawing = drawArmorLayers(
        recorder.context,
        createInitialArmorSelection(),
        () => 'yes' as unknown as boolean,
      );
      const pending = queue.takePending();
      expect(pending.length).toBeGreaterThan(0);
      expect(recorder.clearCount()).toBe(0);
      queue.finish(pending);
      await expect(drawing).rejects.toThrow(
        'Armor draw predicate must return a boolean. Received "yes".',
      );
      expect(recorder.clearCount()).toBe(0);
    });
  });
});
