import { existsSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  listArmorPieceIds,
  type ArmorGender,
  type ArmorMaterial,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';
import { armorBodyImagePath, armorPieceImagePath } from '@/lib/armor-creator/icons';

const GENDERED_FILE_STEMS = {
  helm: 'helm',
  chest: 'chest',
  feet: 'feet',
  shoulderLeft: 'shoulder',
  legs: 'legs',
  gloves: 'hands',
  shoulderRight: 'shoulder',
  cloakFront: 'cape',
  cloakBack: 'bcape',
} as const satisfies Record<
  Exclude<ArmorSlot, 'crown' | 'wing'>,
  string
>;

function twoDigitIndex(index: number): string {
  return String(index).padStart(2, '0');
}

function expectedGenderedPath(
  gender: ArmorGender,
  material: ArmorMaterial,
  slot: Exclude<ArmorSlot, 'crown' | 'wing'>,
  index: number,
): string {
  const directory = material === 'plate' ? gender : `${gender}/${material}`;
  return `/armor-creator/${directory}/${GENDERED_FILE_STEMS[slot]}${twoDigitIndex(index)}.png`;
}

function localPublicArmorFile(imagePath: string): string {
  if (!imagePath.startsWith('/armor-creator/') || !imagePath.endsWith('.png')) {
    throw new Error(`Armor image path ${JSON.stringify(imagePath)} is not a local PNG address.`);
  }

  return path.join(process.cwd(), 'public', imagePath.slice(1));
}

describe('armorBodyImagePath', () => {
  it('男女身体图在各自目录的 body.png', () => {
    expect(armorBodyImagePath('male')).toBe('/armor-creator/male/body.png');
    expect(armorBodyImagePath('female')).toBe('/armor-creator/female/body.png');
  });

  it('非法性别抛错，并带上收到的原值', () => {
    expect(() => armorBodyImagePath('robot' as ArmorGender)).toThrowError(
      'Invalid armor gender. Received "robot".',
    );
    expect(() => armorBodyImagePath(null as unknown as ArmorGender)).toThrowError(
      'Invalid armor gender. Received null.',
    );
    expect(() => armorBodyImagePath({ gender: 'male' } as unknown as ArmorGender)).toThrowError(
      'Invalid armor gender. Received {"gender":"male"}.',
    );
  });
});

describe('armorPieceImagePath', () => {
  it('只公开身体和零件两条本地 PNG 路径', () => {
    expect(armorBodyImagePath('female')).toMatch(/^\/armor-creator\/female\/body\.png$/);
    expect(armorPieceImagePath('male:plate:helm:1')).toMatch(/\.png$/);
    expect(armorPieceImagePath('shared:crown:1')).not.toContain('http');
    expect(armorPieceImagePath('male:plate:helm:1')).not.toContain('images/armor');
    expect(armorPieceImagePath('male:plate:helm:1')).not.toContain('/plate/');
  });

  it('板甲没有 plate 目录，皮甲和布甲各自进子目录', () => {
    expect(armorPieceImagePath('male:plate:helm:1')).toBe('/armor-creator/male/helm01.png');
    expect(armorPieceImagePath('female:plate:chest:30')).toBe('/armor-creator/female/chest30.png');
    expect(armorPieceImagePath('male:leather:legs:8')).toBe(
      '/armor-creator/male/leather/legs08.png',
    );
    expect(armorPieceImagePath('female:cloth:legs:1')).toBe('/armor-creator/female/cloth/legs01.png');
    expect(armorPieceImagePath('male:cloth:legs:30')).toBe('/armor-creator/male/cloth/legs30.png');
    expect(armorPieceImagePath('female:leather:helm:15')).toBe(
      '/armor-creator/female/leather/helm15.png',
    );
  });

  it('部位文件名按源图：手套是 hands，肩是 shoulder，斗篷是 cape 和 bcape', () => {
    expect(armorPieceImagePath('male:plate:gloves:1')).toBe('/armor-creator/male/hands01.png');
    expect(armorPieceImagePath('female:leather:gloves:30')).toBe(
      '/armor-creator/female/leather/hands30.png',
    );
    expect(armorPieceImagePath('male:plate:cloakFront:1')).toBe('/armor-creator/male/cape01.png');
    expect(armorPieceImagePath('female:cloth:cloakFront:15')).toBe(
      '/armor-creator/female/cloth/cape15.png',
    );
    expect(armorPieceImagePath('male:leather:cloakBack:15')).toBe(
      '/armor-creator/male/leather/bcape15.png',
    );
    expect(armorPieceImagePath('female:plate:cloakBack:9')).toBe('/armor-creator/female/bcape09.png');
  });

  it('带性别的编号补成两位，左右肩同一序号路径相同', () => {
    for (const gender of ['male', 'female'] as const) {
      for (const material of ['plate', 'leather', 'cloth'] as const) {
        for (const slot of Object.keys(GENDERED_FILE_STEMS) as Array<
          keyof typeof GENDERED_FILE_STEMS
        >) {
          const pieceCount = slot === 'cloakFront' || slot === 'cloakBack' ? 15 : 30;
          for (const index of [1, pieceCount]) {
            expect(armorPieceImagePath(`${gender}:${material}:${slot}:${index}`)).toBe(
              expectedGenderedPath(gender, material, slot, index),
            );
          }
        }
      }
    }

    expect(armorPieceImagePath('female:cloth:shoulderLeft:8')).toBe(
      '/armor-creator/female/cloth/shoulder08.png',
    );
    expect(armorPieceImagePath('female:cloth:shoulderLeft:8')).toBe(
      armorPieceImagePath('female:cloth:shoulderRight:8'),
    );
    expect(armorPieceImagePath('male:plate:shoulderLeft:20')).toBe(
      armorPieceImagePath('male:plate:shoulderRight:20'),
    );
  });

  it('王冠和翅膀在根目录，序号不补零', () => {
    expect(armorPieceImagePath('shared:crown:1')).toBe('/armor-creator/crown1.png');
    expect(armorPieceImagePath('shared:crown:9')).toBe('/armor-creator/crown9.png');
    expect(armorPieceImagePath('shared:crown:10')).toBe('/armor-creator/crown10.png');
    expect(armorPieceImagePath('shared:wing:1')).toBe('/armor-creator/wing1.png');
    expect(armorPieceImagePath('shared:wing:30')).toBe('/armor-creator/wing30.png');

    const crownPaths = listArmorPieceIds({ slot: 'crown' }).map((pieceId) =>
      armorPieceImagePath(pieceId),
    );
    const wingPaths = listArmorPieceIds({ slot: 'wing' }).map((pieceId) =>
      armorPieceImagePath(pieceId),
    );
    expect(new Set(crownPaths).size).toBe(30);
    expect(new Set(wingPaths).size).toBe(30);
    expect(crownPaths.some((imagePath) => imagePath.endsWith('/crown01.png'))).toBe(false);
    expect(wingPaths.some((imagePath) => imagePath.includes('/male/'))).toBe(false);
    expect(crownPaths.some((imagePath) => imagePath.includes('/female/'))).toBe(false);
  });

  it('平胸只给女板胸，文件是 female/bchestNN.png', () => {
    expect(armorPieceImagePath('female:plate:chest:1', { flatChest: true })).toBe(
      '/armor-creator/female/bchest01.png',
    );
    expect(armorPieceImagePath('female:plate:chest:30', { flatChest: true })).toBe(
      '/armor-creator/female/bchest30.png',
    );
    expect(armorPieceImagePath('female:plate:chest:1', { flatChest: false })).toBe(
      '/armor-creator/female/chest01.png',
    );

    const flatPaths = new Set<string>();
    for (const pieceId of listArmorPieceIds({
      slot: 'chest',
      material: 'plate',
      gender: 'female',
    })) {
      const flatChestPath = armorPieceImagePath(pieceId, { flatChest: true });
      expect(flatChestPath).not.toBe(armorPieceImagePath(pieceId));
      expect(flatPaths.has(flatChestPath)).toBe(false);
      flatPaths.add(flatChestPath);
    }
  });

  it('脚后跟只给脚：板甲和皮甲是 bfeetNN，布甲所有编号都是 bfeet01', () => {
    expect(armorPieceImagePath('male:plate:feet:7', { feetBack: true })).toBe(
      '/armor-creator/male/bfeet07.png',
    );
    expect(armorPieceImagePath('female:leather:feet:15', { feetBack: true })).toBe(
      '/armor-creator/female/leather/bfeet15.png',
    );
    expect(armorPieceImagePath('male:plate:feet:7', { feetBack: false })).toBe(
      '/armor-creator/male/feet07.png',
    );
    expect(armorPieceImagePath('female:cloth:feet:30')).toBe('/armor-creator/female/cloth/feet30.png');

    for (let index = 1; index <= 30; index += 1) {
      expect(armorPieceImagePath(`male:cloth:feet:${index}`, { feetBack: true })).toBe(
        '/armor-creator/male/cloth/bfeet01.png',
      );
      expect(armorPieceImagePath(`female:cloth:feet:${index}`, { feetBack: true })).toBe(
        '/armor-creator/female/cloth/bfeet01.png',
      );
    }

    const plateBackPaths = listArmorPieceIds({
      slot: 'feet',
      material: 'plate',
      gender: 'female',
    }).map((pieceId) => armorPieceImagePath(pieceId, { feetBack: true }));
    expect(new Set(plateBackPaths).size).toBe(30);
    expect(plateBackPaths[0]).toBe('/armor-creator/female/bfeet01.png');
    expect(plateBackPaths[29]).toBe('/armor-creator/female/bfeet30.png');
  });

  it('不同部位的正面图路径不同', () => {
    const imagePaths = [
      armorPieceImagePath('male:plate:helm:1'),
      armorPieceImagePath('male:plate:chest:1'),
      armorPieceImagePath('male:plate:feet:1'),
      armorPieceImagePath('male:plate:shoulderLeft:1'),
      armorPieceImagePath('male:plate:legs:1'),
      armorPieceImagePath('male:plate:gloves:1'),
      armorPieceImagePath('male:plate:cloakFront:1'),
      armorPieceImagePath('male:plate:cloakBack:1'),
      armorPieceImagePath('shared:crown:1'),
      armorPieceImagePath('shared:wing:1'),
    ];

    expect(new Set(imagePaths).size).toBe(imagePaths.length);
  });

  it('非法编号抛错，消息包含该原值', () => {
    expect(() => armorPieceImagePath('nope')).toThrowError(
      'Invalid armor piece id. Received "nope".',
    );
    expect(() => armorPieceImagePath('nope', { flatChest: true })).toThrowError(
      'Invalid armor piece id. Received "nope".',
    );
    expect(() => armorPieceImagePath('male:plate:helm:31')).toThrowError('male:plate:helm:31');
    expect(() => armorPieceImagePath('male:plate:helm:0')).toThrowError('male:plate:helm:0');
    expect(() => armorPieceImagePath('female:cloth:cloakFront:16')).toThrowError(
      'female:cloth:cloakFront:16',
    );
    expect(() => armorPieceImagePath(31 as unknown as string)).toThrowError(
      'Invalid armor piece id. Received 31.',
    );
  });

  it('不是女板胸的零件都不能平胸，消息带上该编号', () => {
    const rejectedPieceIds = [
      'female:leather:chest:1',
      'female:cloth:chest:2',
      'female:plate:helm:1',
      'male:plate:chest:1',
      'male:plate:feet:1',
      'shared:crown:1',
    ];

    for (const pieceId of rejectedPieceIds) {
      expect(() => armorPieceImagePath(pieceId, { flatChest: true })).toThrowError(pieceId);
      expect(() => armorPieceImagePath(pieceId, { flatChest: true })).toThrowError('flatChest');
    }
  });

  it('不是脚的零件都不能要脚后跟，消息带上该编号', () => {
    const rejectedPieceIds = [
      'male:plate:helm:1',
      'female:plate:chest:1',
      'male:leather:gloves:2',
      'female:cloth:cloakBack:1',
      'shared:wing:3',
    ];

    for (const pieceId of rejectedPieceIds) {
      expect(() => armorPieceImagePath(pieceId, { feetBack: true })).toThrowError(pieceId);
      expect(() => armorPieceImagePath(pieceId, { feetBack: true })).toThrowError('feetBack');
    }
  });

  it('平胸和脚后跟不能一起开，消息带上该编号', () => {
    expect(() =>
      armorPieceImagePath('female:plate:chest:1', { flatChest: true, feetBack: true }),
    ).toThrowError(
      'Armor image options cannot combine flatChest and feetBack. Received "female:plate:chest:1".',
    );
    expect(() =>
      armorPieceImagePath('male:plate:feet:4', { flatChest: true, feetBack: true }),
    ).toThrowError(
      'Armor image options cannot combine flatChest and feetBack. Received "male:plate:feet:4".',
    );
  });

  it('选项不是合法对象或布尔值时抛错，并带上收到的值', () => {
    expect(() =>
      armorPieceImagePath('female:plate:chest:1', {
        flatChest: 'yes' as unknown as boolean,
      }),
    ).toThrowError('flatChest must be a boolean. Received "yes".');
    expect(() =>
      armorPieceImagePath('male:plate:feet:1', {
        feetBack: 1 as unknown as boolean,
      }),
    ).toThrowError('feetBack must be a boolean. Received 1.');
    expect(() =>
      armorPieceImagePath('female:plate:chest:1', null as unknown as undefined),
    ).toThrowError('Armor image options must be an object. Received null.');
    expect(() =>
      armorPieceImagePath('male:plate:helm:1', ['feetBack'] as unknown as undefined),
    ).toThrowError('Armor image options must be an object. Received ["feetBack"].');
    expect(() =>
      armorPieceImagePath('male:plate:helm:1', { mirror: true } as { flatChest?: boolean }),
    ).toThrowError('Armor image option "mirror" is not allowed. Received true.');
  });

  it('本地 PNG 还没放进 public 时，缺文件不算映射错误', () => {
    const imagePaths = [
      armorBodyImagePath('male'),
      armorBodyImagePath('female'),
      armorPieceImagePath('male:plate:helm:1'),
      armorPieceImagePath('female:cloth:legs:1'),
      armorPieceImagePath('male:cloth:feet:30', { feetBack: true }),
      armorPieceImagePath('shared:wing:1'),
    ];

    for (const imagePath of imagePaths) {
      expect(imagePath.startsWith('/armor-creator/')).toBe(true);
      const filePath = localPublicArmorFile(imagePath);
      if (!existsSync(filePath)) {
        continue;
      }

      expect(filePath.includes(`${path.sep}public${path.sep}armor-creator${path.sep}`)).toBe(true);
    }
  });
});
