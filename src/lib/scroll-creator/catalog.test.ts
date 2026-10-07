import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  SCROLL_FONT_OPTIONS,
  SCROLL_PAPERS,
  getScrollPaper,
} from '@/lib/scroll-creator/catalog';

const EXPECTED_PAPER_SHA256 = {
  paper01: 'de1e794d111b17052a167ca85d149e539a2ec560bb102d2956fe6e9a987e4225',
  paper02: '264f7b1149e270c2b6017878647ae8af1ebbb9b905b31e30b762775cc67d6ba4',
  paper03: '8288aa56ad103d7bbcf4496f6aa8847c51e2df4fbced3be602660ae51e330319',
  paper04: '0cabfe2a89f7e6d615c37973c15f00a0e3a706553d5608fed00a0c4f3a49c00e',
  paper05: '31d73cec6da9d4fbbaaab47bff0a8af2f7e80cd00f3dd1b4ddb7e5377e196fdf',
  paper06: '7b6b14c84b8070741952ce1d74a8765e3a702f6bfea9c334663ed52de7fc02fe',
  paper07: '5a1a317ffcfc0aec4b91c45fdc785cafe0cd06385c8d777c71911374b387e825',
  paper08: '9d56256b6c2c2d7fe6a2be6441fe50944a7f6df4b03bc005d78d1d36e41f9832',
  paper09: '2b70defb779b17da04a7e7b0cb117f50dbc1fa728f86d5ff01d813a7879b022e',
  paper10: '7543486122242dc0a9cf2db09fe93b58085d8b5be679a497a9e597867e34486f',
  paper11: 'c503a1e5d6a60cb1c694f3a5cbbb193e1ff683319a2716450a702af7a638fe74',
  paper12: 'a7e474296590e5b978ee4ae2803470cd20543a97161d4601fb0366bcbbc8e04a',
  paper13: 'e5984ab1523ef0871e225d0e444e114084d3f2e64fe0c6da6137cf8669bc4c15',
  paper14: 'a012e78728bfaa63aa3c055ad860c0a033789a22d926cec2e42fb47bc93923e0',
  paper15: '94b9949bcde84581da66fe98c17760f040851df4a59effd917aa557c766fda7b',
} as const satisfies Readonly<Record<(typeof SCROLL_PAPERS)[number]['id'], string>>;

describe('scroll paper catalogue', () => {
  it('exposes the fifteen downloaded competitor paper choices in order', () => {
    expect(SCROLL_PAPERS).toHaveLength(15);
    expect(SCROLL_PAPERS.map((paper) => paper.id)).toEqual(
      Array.from({ length: 15 }, (_, index) => `paper${String(index + 1).padStart(2, '0')}`),
    );
    expect(SCROLL_PAPERS.map((paper) => paper.src)).toEqual(
      Array.from({ length: 15 }, (_, index) => `/scroll-creator/scroll-${index + 1}.png`),
    );
  });

  it('keeps every paper as a valid 347x500 PNG with the recorded source hash', () => {
    for (const paper of SCROLL_PAPERS) {
      const fileBytes = readFileSync(resolve(process.cwd(), 'public', paper.src.slice(1)));
      const imageHash = createHash('sha256').update(fileBytes).digest('hex');

      expect(fileBytes.subarray(0, 8)).toEqual(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      );
      expect(fileBytes.readUInt32BE(16)).toBe(347);
      expect(fileBytes.readUInt32BE(20)).toBe(500);
      expect(imageHash).toBe(EXPECTED_PAPER_SHA256[paper.id]);
    }
  });

  it('fails fast when a paper id is not in the downloaded catalogue', () => {
    expect(getScrollPaper('paper04')).toEqual({
      id: 'paper04',
      src: '/scroll-creator/scroll-4.png',
    });
    expect(() => getScrollPaper('paper99')).toThrowError(
      'Unknown scroll paper id. Received "paper99".',
    );
    expect(() => getScrollPaper(null)).toThrowError(
      'Unknown scroll paper id. Received null.',
    );
  });
});

describe('scroll font catalogue', () => {
  it('contains the eight fonts supported by the competitor tool', () => {
    expect(SCROLL_FONT_OPTIONS).toEqual([
      { name: 'Trebuchet MS', family: 'Trebuchet MS' },
      { name: 'Verdana', family: 'Verdana' },
      { name: 'Courier New', family: 'Courier New' },
      { name: 'Lucida Console', family: 'Lucida Console' },
      { name: 'Impact', family: 'Impact' },
      { name: 'Comic Sans MS', family: 'Comic Sans MS' },
      { name: 'Arial Black', family: 'Arial Black' },
      { name: 'Times New Roman', family: 'Times New Roman' },
    ]);
  });
});
