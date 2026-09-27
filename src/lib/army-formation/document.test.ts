import { describe, expect, it } from 'vitest';

import {
  ARMY_BATTLEFIELD_COUNT,
  ARMY_FORMATION_VERSION,
  ARMY_PIECE_HEIGHT,
  ARMY_PIECE_WIDTH,
  ARMY_PLACEMENT_STEP_PX,
  addArmyFormationPiece,
  addArmyPaletteSwatch,
  clearArmyFormationPieces,
  createEmptyArmyFormationDocument,
  deleteSelectedArmyFormationPieces,
  deleteSelectedArmyPaletteSwatch,
  moveArmyFormationPiece,
  parseArmyFormationDocument,
  rotateSelectedArmyFormationPieces,
  selectArmyPaletteSwatch,
  serializeArmyFormationDocument,
  setArmyBackgroundImageUrl,
  setArmyBattlefieldHeight,
  setArmyFieldBackgroundColor,
  stepArmyBattlefield,
  toggleArmyFormationPieceSelection,
  type ArmyBattlefield,
  type ArmyFormationDocument,
} from '@/lib/army-formation/document';

const FIELD_WIDTH_PX = 240;

function emptyBattlefield(): ArmyBattlefield {
  return {
    pieces: [],
    palette: [],
    selectedPieceIds: [],
    selectedSwatchId: null,
    activeBackgroundColor: '#ffffff',
    heightPx: 480,
    fieldBackgroundColor: '#ffffff',
    backgroundImageUrl: '',
  };
}

function documentWithPiece(pieceId: string, fieldWidthPx = FIELD_WIDTH_PX): ArmyFormationDocument {
  return addArmyFormationPiece(
    createEmptyArmyFormationDocument(),
    'soldier',
    pieceId,
    fieldWidthPx,
  );
}

function pieceBoxesOverlap(
  firstX: number,
  firstY: number,
  secondX: number,
  secondY: number,
): boolean {
  const separatedHorizontally =
    firstX + ARMY_PIECE_WIDTH <= secondX || secondX + ARMY_PIECE_WIDTH <= firstX;
  const separatedVertically =
    firstY + ARMY_PIECE_HEIGHT <= secondY || secondY + ARMY_PIECE_HEIGHT <= firstY;

  return !separatedHorizontally && !separatedVertically;
}

describe('createEmptyArmyFormationDocument', () => {
  it('给出 4 个空战场，当前场是第 0 场，高度 480，两个颜色都是白色', () => {
    const document = createEmptyArmyFormationDocument();

    expect(ARMY_FORMATION_VERSION).toBe(1);
    expect(ARMY_BATTLEFIELD_COUNT).toBe(4);
    expect(ARMY_PIECE_WIDTH).toBe(50);
    expect(ARMY_PIECE_HEIGHT).toBe(30);
    expect(ARMY_PLACEMENT_STEP_PX).toBe(5);
    expect(document.version).toBe(ARMY_FORMATION_VERSION);
    expect(document.activeBattlefieldIndex).toBe(0);
    expect(document.battlefields).toHaveLength(ARMY_BATTLEFIELD_COUNT);
    expect(document.battlefields[0]).toEqual(emptyBattlefield());
    expect(document.battlefields[1]).toEqual(emptyBattlefield());
    expect(document.battlefields[2]).toEqual(emptyBattlefield());
    expect(document.battlefields[3]).toEqual(emptyBattlefield());
    expect(document.battlefields[0]).not.toBe(document.battlefields[1]);
  });
});

describe('addArmyFormationPiece', () => {
  it('两枚棋子按格子从左到右排开，矩形不重叠', () => {
    const withFirst = documentWithPiece('piece-1');
    const withSecond = addArmyFormationPiece(withFirst, 'archer', 'piece-2', FIELD_WIDTH_PX);
    const firstPiece = withSecond.battlefields[0].pieces[0];
    const secondPiece = withSecond.battlefields[0].pieces[1];

    expect(firstPiece).toEqual({
      id: 'piece-1',
      iconId: 'soldier',
      x: 0,
      y: 0,
      rotationDegrees: 0,
      backgroundColor: '#ffffff',
    });
    expect(secondPiece).toMatchObject({
      id: 'piece-2',
      iconId: 'archer',
      x: ARMY_PIECE_WIDTH,
      y: 0,
      rotationDegrees: 0,
      backgroundColor: '#ffffff',
    });
    expect(pieceBoxesOverlap(firstPiece.x, firstPiece.y, secondPiece.x, secondPiece.y)).toBe(
      false,
    );
  });

  it('第一行放不下时放到下一行的第一个空位', () => {
    const fieldWidthPx = ARMY_PIECE_WIDTH * 2;
    const withFirst = documentWithPiece('piece-1', fieldWidthPx);
    const withSecond = addArmyFormationPiece(withFirst, 'soldier', 'piece-2', fieldWidthPx);
    const withThird = addArmyFormationPiece(withSecond, 'soldier', 'piece-3', fieldWidthPx);

    expect(withThird.battlefields[0].pieces.map((piece) => ({ x: piece.x, y: piece.y }))).toEqual([
      { x: 0, y: 0 },
      { x: ARMY_PIECE_WIDTH, y: 0 },
      { x: 0, y: ARMY_PIECE_HEIGHT },
    ]);
  });

  it('已有棋子挡住左上角时，新棋子用第一个空位', () => {
    const moved = moveArmyFormationPiece(documentWithPiece('piece-1'), 'piece-1', 50, 0, FIELD_WIDTH_PX);
    const withSecond = addArmyFormationPiece(moved, 'soldier', 'piece-2', FIELD_WIDTH_PX);

    expect(withSecond.battlefields[0].pieces[1]).toMatchObject({ id: 'piece-2', x: 0, y: 0 });
  });

  it('没有选中色块时新棋子是白色，选中色块后用色块颜色', () => {
    const withSwatch = addArmyPaletteSwatch(
      createEmptyArmyFormationDocument(),
      'red-swatch',
      '#ff0000',
    );
    const beforeSelect = addArmyFormationPiece(withSwatch, 'soldier', 'piece-1', FIELD_WIDTH_PX);
    const selected = selectArmyPaletteSwatch(withSwatch, 'red-swatch');
    const afterSelect = addArmyFormationPiece(selected, 'soldier', 'piece-2', FIELD_WIDTH_PX);

    expect(beforeSelect.battlefields[0].pieces[0].backgroundColor).toBe('#ffffff');
    expect(afterSelect.battlefields[0].pieces[0].backgroundColor).toBe('#ff0000');
    expect(selected.battlefields[0].activeBackgroundColor).toBe('#ff0000');
  });

  it('新棋子颜色跟选中色块走，不跟另一份当前颜色走', () => {
    const serialized = JSON.parse(
      serializeArmyFormationDocument(createEmptyArmyFormationDocument()),
    ) as {
      battlefields: Array<Record<string, unknown>>;
    };
    serialized.battlefields[0].palette = [{ id: 'red-swatch', color: '#ff0000' }];
    serialized.battlefields[0].selectedSwatchId = 'red-swatch';
    serialized.battlefields[0].activeBackgroundColor = '#0000ff';
    const parsed = parseArmyFormationDocument(JSON.stringify(serialized));
    const withPiece = addArmyFormationPiece(parsed, 'soldier', 'piece-1', FIELD_WIDTH_PX);

    expect(withPiece.battlefields[0].pieces[0].backgroundColor).toBe('#ff0000');
  });

  it('同一场的棋子 id 重复时抛错，错误里有这个 id', () => {
    const document = documentWithPiece('piece-1');

    expect(() => addArmyFormationPiece(document, 'soldier', 'piece-1', FIELD_WIDTH_PX)).toThrow(
      'Army formation piece id "piece-1" already exists.',
    );
  });

  it('另一场可以用同一个棋子 id', () => {
    const onSecond = stepArmyBattlefield(documentWithPiece('piece-1'), 1);
    const withSameId = addArmyFormationPiece(onSecond, 'knight', 'piece-1', FIELD_WIDTH_PX);

    expect(withSameId.battlefields[0].pieces[0]).toMatchObject({ id: 'piece-1', iconId: 'soldier' });
    expect(withSameId.battlefields[1].pieces[0]).toMatchObject({ id: 'piece-1', iconId: 'knight' });
  });

  it('找不到空位时抛错，错误里有场宽、场高和已有棋子数量', () => {
    let document = setArmyBattlefieldHeight(createEmptyArmyFormationDocument(), 200);
    const fieldWidthPx = ARMY_PIECE_WIDTH;

    for (let pieceIndex = 0; pieceIndex < 6; pieceIndex += 1) {
      document = addArmyFormationPiece(document, 'soldier', `piece-${pieceIndex}`, fieldWidthPx);
    }

    expect(() => addArmyFormationPiece(document, 'soldier', 'piece-6', fieldWidthPx)).toThrow(
      'No open position for a new piece on a field of width 50 and height 200 with existing piece count 6.',
    );
  });

  it('不修改入参', () => {
    const original = createEmptyArmyFormationDocument();
    const before = serializeArmyFormationDocument(original);

    addArmyFormationPiece(original, 'soldier', 'piece-1', FIELD_WIDTH_PX);

    expect(serializeArmyFormationDocument(original)).toBe(before);
  });
});

describe('moveArmyFormationPiece', () => {
  it('把坐标吸到 5 像素格子上', () => {
    const moved = moveArmyFormationPiece(documentWithPiece('piece-1'), 'piece-1', 7, 12, FIELD_WIDTH_PX);

    expect(moved.battlefields[0].pieces[0]).toMatchObject({ x: 5, y: 10 });
  });

  it('可以放到贴着边界的格子上', () => {
    const moved = moveArmyFormationPiece(documentWithPiece('piece-1'), 'piece-1', 190, 450, FIELD_WIDTH_PX);

    expect(moved.battlefields[0].pieces[0]).toMatchObject({ x: 190, y: 450 });
  });

  it('出界时抛错，错误里有这个 x、y 和场的宽高', () => {
    const document = documentWithPiece('piece-1', 200);

    expect(() => moveArmyFormationPiece(document, 'piece-1', -3, 4, 200)).toThrow(
      'Piece position x=-3, y=4 is outside a field of width 200 and height 480.',
    );
    expect(serializeArmyFormationDocument(document)).toBe(
      serializeArmyFormationDocument(documentWithPiece('piece-1', 200)),
    );
  });

  it('找不到棋子时抛错，错误里有这个 id', () => {
    expect(() =>
      moveArmyFormationPiece(createEmptyArmyFormationDocument(), 'missing-piece', 0, 0, FIELD_WIDTH_PX),
    ).toThrow('Army formation piece id "missing-piece" was not found.');
  });

  it('只移动当前场，不改其他场的棋子', () => {
    const onSecond = stepArmyBattlefield(documentWithPiece('piece-1'), 1);

    expect(() => moveArmyFormationPiece(onSecond, 'piece-1', 10, 0, FIELD_WIDTH_PX)).toThrow(
      '"piece-1"',
    );
    expect(onSecond.battlefields[0].pieces[0]).toMatchObject({ x: 0, y: 0 });
  });
});

describe('toggleArmyFormationPieceSelection', () => {
  it('点一次选中，再点一次取消', () => {
    const document = documentWithPiece('piece-1');
    const selected = toggleArmyFormationPieceSelection(document, 'piece-1');
    const cleared = toggleArmyFormationPieceSelection(selected, 'piece-1');

    expect(selected.battlefields[0].selectedPieceIds).toEqual(['piece-1']);
    expect(cleared.battlefields[0].selectedPieceIds).toEqual([]);
    expect(document.battlefields[0].selectedPieceIds).toEqual([]);
  });

  it('找不到棋子时抛错，错误里有这个 id', () => {
    expect(() => toggleArmyFormationPieceSelection(documentWithPiece('piece-1'), 'missing-piece')).toThrow(
      'Army formation piece id "missing-piece" was not found.',
    );
  });
});

describe('deleteSelectedArmyFormationPieces', () => {
  it('只删除选中的棋子', () => {
    const withTwo = addArmyFormationPiece(documentWithPiece('piece-1'), 'archer', 'piece-2', FIELD_WIDTH_PX);
    const selected = toggleArmyFormationPieceSelection(withTwo, 'piece-1');
    const deleted = deleteSelectedArmyFormationPieces(selected);

    expect(deleted.battlefields[0].pieces.map((piece) => piece.id)).toEqual(['piece-2']);
    expect(deleted.battlefields[0].selectedPieceIds).toEqual([]);
  });
});

describe('clearArmyFormationPieces', () => {
  it('只删棋子，保留调色盘、高度和背景', () => {
    let document = addArmyPaletteSwatch(createEmptyArmyFormationDocument(), 'red-swatch', '#ff0000');
    document = selectArmyPaletteSwatch(document, 'red-swatch');
    document = setArmyBattlefieldHeight(document, 640);
    document = setArmyFieldBackgroundColor(document, '#112233');
    document = setArmyBackgroundImageUrl(document, 'https://example.com/field.png');
    document = addArmyFormationPiece(document, 'soldier', 'piece-1', FIELD_WIDTH_PX);
    document = toggleArmyFormationPieceSelection(document, 'piece-1');
    const cleared = clearArmyFormationPieces(document);

    expect(cleared.battlefields[0].pieces).toEqual([]);
    expect(cleared.battlefields[0].selectedPieceIds).toEqual([]);
    expect(cleared.battlefields[0].palette).toEqual([{ id: 'red-swatch', color: '#ff0000' }]);
    expect(cleared.battlefields[0].selectedSwatchId).toBe('red-swatch');
    expect(cleared.battlefields[0].activeBackgroundColor).toBe('#ff0000');
    expect(cleared.battlefields[0].heightPx).toBe(640);
    expect(cleared.battlefields[0].fieldBackgroundColor).toBe('#112233');
    expect(cleared.battlefields[0].backgroundImageUrl).toBe('https://example.com/field.png');
  });
});

describe('rotateSelectedArmyFormationPieces', () => {
  it('只给选中的棋子累加角度', () => {
    const withTwo = addArmyFormationPiece(documentWithPiece('piece-1'), 'archer', 'piece-2', FIELD_WIDTH_PX);
    const selected = toggleArmyFormationPieceSelection(withTwo, 'piece-1');
    const once = rotateSelectedArmyFormationPieces(selected, 15);
    const twice = rotateSelectedArmyFormationPieces(once, -5);

    expect(twice.battlefields[0].pieces[0].rotationDegrees).toBe(10);
    expect(twice.battlefields[0].pieces[1].rotationDegrees).toBe(0);
  });

  it('坏角度抛错，错误里能看到那个坏值', () => {
    const selected = toggleArmyFormationPieceSelection(documentWithPiece('piece-1'), 'piece-1');

    expect(() => rotateSelectedArmyFormationPieces(selected, Number.NaN)).toThrow(
      'Rotation degrees must be a finite number, received NaN.',
    );
    expect(() => rotateSelectedArmyFormationPieces(selected, Number.POSITIVE_INFINITY)).toThrow(
      'received Infinity',
    );
    expect(selected.battlefields[0].pieces[0].rotationDegrees).toBe(0);
  });
});

describe('palette swatches', () => {
  it('色块 id 重复或找不到时抛错，错误里有这个 id', () => {
    const withSwatch = addArmyPaletteSwatch(
      createEmptyArmyFormationDocument(),
      'red-swatch',
      '#ABCDEF',
    );

    expect(withSwatch.battlefields[0].palette).toEqual([{ id: 'red-swatch', color: '#ABCDEF' }]);
    expect(() => addArmyPaletteSwatch(withSwatch, 'red-swatch', '#00ff00')).toThrow(
      'Army formation palette swatch id "red-swatch" already exists.',
    );
    expect(() => selectArmyPaletteSwatch(withSwatch, 'missing-swatch')).toThrow(
      'Army formation palette swatch id "missing-swatch" was not found.',
    );
  });

  it('再选中同一个色块会取消选择，新棋子回到白色', () => {
    const selected = selectArmyPaletteSwatch(
      addArmyPaletteSwatch(createEmptyArmyFormationDocument(), 'red-swatch', '#ff0000'),
      'red-swatch',
    );
    const deselected = selectArmyPaletteSwatch(selected, 'red-swatch');
    const withPiece = addArmyFormationPiece(deselected, 'soldier', 'piece-1', FIELD_WIDTH_PX);

    expect(deselected.battlefields[0].selectedSwatchId).toBeNull();
    expect(deselected.battlefields[0].activeBackgroundColor).toBe('#ffffff');
    expect(withPiece.battlefields[0].pieces[0].backgroundColor).toBe('#ffffff');
    expect(deselected.battlefields[0].palette).toEqual([{ id: 'red-swatch', color: '#ff0000' }]);
  });

  it('删除选中的色块后，选择和当前颜色回到白色', () => {
    const selected = selectArmyPaletteSwatch(
      addArmyPaletteSwatch(createEmptyArmyFormationDocument(), 'red-swatch', '#ff0000'),
      'red-swatch',
    );
    const deleted = deleteSelectedArmyPaletteSwatch(selected);

    expect(deleted.battlefields[0].palette).toEqual([]);
    expect(deleted.battlefields[0].selectedSwatchId).toBeNull();
    expect(deleted.battlefields[0].activeBackgroundColor).toBe('#ffffff');
  });

  it('没有选中色块时删除会抛错，错误里能看到 null', () => {
    expect(() => deleteSelectedArmyPaletteSwatch(createEmptyArmyFormationDocument())).toThrow(
      'Army formation palette swatch id null was not found.',
    );
  });

  it('坏颜色抛错，错误里能看到那个坏值', () => {
    const document = createEmptyArmyFormationDocument();

    expect(() => setArmyFieldBackgroundColor(document, 'red')).toThrow(
      'Field background color must be # followed by 6 hex digits, received "red".',
    );
    expect(() => setArmyFieldBackgroundColor(document, '#fff')).toThrow('received "#fff"');
    expect(() => addArmyPaletteSwatch(document, 'bad-swatch', '#gggggg')).toThrow(
      'received "#gggggg"',
    );
    expect(document.battlefields[0].fieldBackgroundColor).toBe('#ffffff');
    expect(document.battlefields[0].palette).toEqual([]);
  });
});

describe('setArmyBattlefieldHeight', () => {
  it('只改当前场的高度', () => {
    const taller = setArmyBattlefieldHeight(createEmptyArmyFormationDocument(), 600);
    const onSecond = stepArmyBattlefield(taller, 1);
    const secondTaller = setArmyBattlefieldHeight(onSecond, 700);

    expect(secondTaller.battlefields[0].heightPx).toBe(600);
    expect(secondTaller.battlefields[1].heightPx).toBe(700);
    expect(secondTaller.battlefields[2].heightPx).toBe(480);
  });

  it('接受 200 和 2000', () => {
    const document = createEmptyArmyFormationDocument();

    expect(setArmyBattlefieldHeight(document, 200).battlefields[0].heightPx).toBe(200);
    expect(setArmyBattlefieldHeight(document, 2000).battlefields[0].heightPx).toBe(2000);
  });

  it('坏高度抛错，错误里能看到那个坏值', () => {
    const document = createEmptyArmyFormationDocument();

    expect(() => setArmyBattlefieldHeight(document, 199)).toThrow(
      'Battlefield height must be a finite number from 200 to 2000, received 199.',
    );
    expect(() => setArmyBattlefieldHeight(document, 2001)).toThrow('received 2001');
    expect(() => setArmyBattlefieldHeight(document, Number.NaN)).toThrow('received NaN');
    expect(document.battlefields[0].heightPx).toBe(480);
  });
});

describe('background', () => {
  it('只改当前场的背景色和背景图地址', () => {
    const colored = setArmyFieldBackgroundColor(createEmptyArmyFormationDocument(), '#abcdef');
    const withImage = setArmyBackgroundImageUrl(colored, 'https://example.com/map.png');
    const onSecond = stepArmyBattlefield(withImage, 1);
    const secondColored = setArmyFieldBackgroundColor(onSecond, '#001122');

    expect(secondColored.battlefields[0].fieldBackgroundColor).toBe('#abcdef');
    expect(secondColored.battlefields[0].backgroundImageUrl).toBe('https://example.com/map.png');
    expect(secondColored.battlefields[1].fieldBackgroundColor).toBe('#001122');
    expect(secondColored.battlefields[1].backgroundImageUrl).toBe('');
  });
});

describe('stepArmyBattlefield', () => {
  it('切换后原场棋子还在，再绕回去也不会丢', () => {
    const started = documentWithPiece('piece-1');
    const onSecond = stepArmyBattlefield(started, 1);
    const secondWithPiece = addArmyFormationPiece(onSecond, 'knight', 'piece-2', FIELD_WIDTH_PX);
    const back = stepArmyBattlefield(secondWithPiece, -1);

    expect(onSecond.activeBattlefieldIndex).toBe(1);
    expect(onSecond.battlefields[1].pieces).toEqual([]);
    expect(onSecond.battlefields[0].pieces.map((piece) => piece.id)).toEqual(['piece-1']);
    expect(back.activeBattlefieldIndex).toBe(0);
    expect(back.battlefields[0].pieces.map((piece) => piece.id)).toEqual(['piece-1']);
    expect(back.battlefields[1].pieces.map((piece) => piece.id)).toEqual(['piece-2']);
  });

  it('到头后绕回', () => {
    const backward = stepArmyBattlefield(createEmptyArmyFormationDocument(), -1);
    let forward = createEmptyArmyFormationDocument();

    for (let stepCount = 0; stepCount < ARMY_BATTLEFIELD_COUNT; stepCount += 1) {
      forward = stepArmyBattlefield(forward, 1);
    }

    expect(backward.activeBattlefieldIndex).toBe(3);
    expect(forward.activeBattlefieldIndex).toBe(0);
    expect(backward.battlefields).toHaveLength(ARMY_BATTLEFIELD_COUNT);
  });

  it('方向不是 -1 或 1 时抛错，错误里能看到那个坏值', () => {
    const document = createEmptyArmyFormationDocument();

    expect(() => stepArmyBattlefield(document, 2 as -1)).toThrow(
      'Battlefield step direction must be -1 or 1, received 2.',
    );
    expect(() => stepArmyBattlefield(document, 0 as -1)).toThrow('received 0');
    expect(document.activeBattlefieldIndex).toBe(0);
  });
});

describe('serializeArmyFormationDocument and parseArmyFormationDocument', () => {
  it('保存后再读回来，四场棋子都还在', () => {
    let document = addArmyFormationPiece(createEmptyArmyFormationDocument(), 'soldier', 'piece-1', FIELD_WIDTH_PX);
    document = stepArmyBattlefield(document, 1);
    document = addArmyPaletteSwatch(document, 'red-swatch', '#ff0000');
    document = selectArmyPaletteSwatch(document, 'red-swatch');
    document = addArmyFormationPiece(document, 'knight', 'piece-2', FIELD_WIDTH_PX);
    document = setArmyBattlefieldHeight(document, 520);
    document = setArmyBackgroundImageUrl(document, 'https://example.com/field.png');
    const restored = parseArmyFormationDocument(serializeArmyFormationDocument(document));

    expect(restored).toEqual(document);
  });

  it('版本不对时抛错，错误里能看到收到的版本', () => {
    const serialized = JSON.stringify({
      version: 9,
      activeBattlefieldIndex: 0,
      battlefields: [],
    });

    expect(() => parseArmyFormationDocument(serialized)).toThrow(
      'Army formation document version must be 1, received 9.',
    );
  });

  it('场数不是 4 时抛错，错误里能看到收到的场数', () => {
    const serialized = JSON.stringify({
      version: 1,
      activeBattlefieldIndex: 0,
      battlefields: [{}, {}],
    });

    expect(() => parseArmyFormationDocument(serialized)).toThrow(
      'Army formation document must contain 4 battlefields, received 2.',
    );
  });

  it('坏 JSON 抛错，错误里能看到那个坏值', () => {
    const serialized = '{"version":';

    expect(() => parseArmyFormationDocument(serialized)).toThrow(JSON.stringify(serialized));
  });
});
