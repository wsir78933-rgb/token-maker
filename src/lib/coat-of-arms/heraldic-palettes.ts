export const heraldicPaletteIds = [
  'coa-maker-default',
  'forgotten-realm',
  'splendor-palace',
  'plain-white',
  'rokoko-romance',
  'vampire-castle',
  'seven-seas',
] as const;

export type HeraldicPaletteId = typeof heraldicPaletteIds[number];
export type HeraldicPaletteGroupId = 'metals' | 'colors' | 'other-colors' | 'extra';

export interface HeraldicPaletteSwatch {
  hex: string;
  name: string;
  tincture: string;
}

export interface HeraldicPaletteGroup {
  id: HeraldicPaletteGroupId;
  swatches: readonly HeraldicPaletteSwatch[];
}

export interface HeraldicPalette {
  canAdd: boolean;
  groups: readonly HeraldicPaletteGroup[];
  id: HeraldicPaletteId;
  name: string;
}

export const DEFAULT_HERALDIC_PALETTE_ID: HeraldicPaletteId = 'coa-maker-default';

const palettes: readonly HeraldicPalette[] = deepFreeze([
  {
    id: 'coa-maker-default',
    name: 'CoaMaker Default',
    canAdd: false,
    groups: [
      metals(swatch('or', 'Or', '#F7C702'), swatch('argent', 'Argent', '#F2F2F2')),
      colors(
        swatch('azure', 'Azure', '#013B90'),
        swatch('gules', 'Gules', '#BB212C'),
        swatch('purpure', 'Purpure', '#742974'),
        swatch('sable', 'Sable', '#1B1B1B'),
        swatch('vert', 'Vert', '#1D5E23'),
      ),
      otherColors(
        swatch('tenne', 'Tenné', '#CE956C'),
        swatch('carnation', 'Carnation', '#E4BA99'),
        swatch('copper', 'Copper', '#793D11'),
        swatch('cendree', 'Cendrée', '#B5B5B5'),
        swatch('orange', 'Orange', '#F0701A'),
      ),
    ],
  },
  {
    id: 'forgotten-realm',
    name: 'Forgotten Realm',
    canAdd: true,
    groups: [
      metals(swatch('or', 'Or', '#C8AF55'), swatch('argent', 'Argent', '#EFEDE5')),
      colors(
        swatch('azure', 'Azure', '#445B89'),
        swatch('gules', 'Gules', '#942E2E'),
        swatch('purpure', 'Purpure', '#62416D'),
        swatch('sable', 'Sable', '#2B2626'),
        swatch('vert', 'Vert', '#58804D'),
      ),
      otherColors(
        swatch('tenne', 'Tenné', '#92816D'),
        swatch('carnation', 'Carnation', '#E5D0BB'),
        swatch('copper', 'Copper', '#634236'),
        swatch('cendree', 'Cendrée', '#AFACA1'),
        swatch('orange', 'Orange', '#DB7210'),
      ),
      extra(swatch('pig-lady', 'Pig Lady', '#C58FAC')),
    ],
  },
  {
    id: 'splendor-palace',
    name: 'Splendor Palace',
    canAdd: true,
    groups: [
      metals(swatch('or', 'Or', '#D7AD00'), swatch('argent', 'Argent', '#EAECEC')),
      colors(
        swatch('azure', 'Azure', '#0B79B4'),
        swatch('gules', 'Gules', '#B2232D'),
        swatch('purpure', 'Purpure', '#6C5592'),
        swatch('sable', 'Sable', '#1E162A'),
        swatch('vert', 'Vert', '#038C4C'),
      ),
      otherColors(
        swatch('tenne', 'Tenné', '#F1BD89'),
        swatch('carnation', 'Carnation', '#FFBDA2'),
        swatch('copper', 'Copper', '#733D29'),
        swatch('cendree', 'Cendrée', '#B1B8BD'),
        swatch('orange', 'Orange', '#E97A0D'),
      ),
      extra(swatch('peacock-teal', 'Peacock Teal', '#0C7478')),
    ],
  },
  {
    id: 'plain-white',
    name: 'Plain White',
    canAdd: false,
    groups: [metals(swatch('or', 'Or', '#FFFFFF'))],
  },
  {
    id: 'rokoko-romance',
    name: 'Rokoko Romance',
    canAdd: true,
    groups: [
      metals(swatch('or', 'Or', '#DDBA81'), swatch('argent', 'Argent', '#F3F0E8')),
      colors(
        swatch('azure', 'Azure', '#B7CCE2'),
        swatch('gules', 'Gules', '#E57563'),
        swatch('purpure', 'Purpure', '#DCD3E3'),
        swatch('sable', 'Sable', '#323036'),
        swatch('vert', 'Vert', '#B1C2AE'),
      ),
      otherColors(
        swatch('tenne', 'Tenné', '#EBC7AE'),
        swatch('carnation', 'Carnation', '#FADFCC'),
        swatch('copper', 'Copper', '#A67041'),
        swatch('cendree', 'Cendrée', '#D3D3D3'),
        swatch('orange', 'Orange', '#F1BD89'),
      ),
    ],
  },
  {
    id: 'vampire-castle',
    name: 'Vampire Castle',
    canAdd: true,
    groups: [
      metals(swatch('or', 'Or', '#EAC26B'), swatch('argent', 'Argent', '#F8F8FF')),
      colors(
        swatch('azure', 'Azure', '#032495'),
        swatch('gules', 'Gules', '#880808'),
        swatch('purpure', 'Purpure', '#651466'),
        swatch('sable', 'Sable', '#1D1E33'),
        swatch('vert', 'Vert', '#657B50'),
      ),
      otherColors(
        swatch('tenne', 'Tenné', '#BBC1C1'),
        swatch('carnation', 'Carnation', '#F5F0DF'),
        swatch('copper', 'Copper', '#594540'),
        swatch('cendree', 'Cendrée', '#636364'),
        swatch('orange', 'Orange', '#E79F4B'),
      ),
      extra(
        swatch('ethereal-ghost', 'Ethereal Ghost', '#79DAEA'),
        swatch('glowing-eyes', 'Glowing Eyes', '#FF0000'),
      ),
    ],
  },
  {
    id: 'seven-seas',
    name: 'Seven Seas',
    canAdd: true,
    groups: [
      metals(swatch('or', 'Or', '#EEB52D'), swatch('argent', 'Argent', '#DFE8F1')),
      colors(
        swatch('azure', 'Azure', '#005A80'),
        swatch('gules', 'Gules', '#D53219'),
        swatch('purpure', 'Purpure', '#A3285D'),
        swatch('sable', 'Sable', '#2E1836'),
        swatch('vert', 'Vert', '#016F49'),
      ),
      otherColors(
        swatch('tenne', 'Tenné', '#E2AD6A'),
        swatch('carnation', 'Carnation', '#EED2A9'),
        swatch('copper', 'Copper', '#693725'),
        swatch('cendree', 'Cendrée', '#92AEC5'),
        swatch('orange', 'Orange', '#F27B13'),
      ),
      extra(
        swatch('merfolk', 'Merfolk', '#16C5B7'),
        swatch('the-deep', 'The Deep', '#003C5F'),
        swatch('paradise', 'Paradise', '#52B3C9'),
      ),
    ],
  },
]);

export function listHeraldicPalettes(): readonly HeraldicPalette[] {
  return palettes;
}

export function requireHeraldicPaletteId(value: unknown): HeraldicPaletteId {
  if (typeof value !== 'string' || !heraldicPaletteIds.includes(value as HeraldicPaletteId)) {
    throw new Error(`Unknown heraldic palette id: ${String(value)}`);
  }
  return value as HeraldicPaletteId;
}

export function requireHeraldicPalette(paletteId: unknown): HeraldicPalette {
  const palette = typeof paletteId === 'string'
    ? palettes.find((candidate) => candidate.id === paletteId)
    : undefined;
  if (!palette) throw new Error(`Unknown heraldic palette id: ${String(paletteId)}`);
  return palette;
}

export function listHeraldicPaletteSwatches(palette: HeraldicPalette): HeraldicPaletteSwatch[] {
  return palette.groups.flatMap((group) => [...group.swatches]);
}

export function resolveDefaultHeraldicPaletteId(paletteId: unknown): HeraldicPaletteId {
  return paletteId === undefined ? DEFAULT_HERALDIC_PALETTE_ID : requireHeraldicPaletteId(paletteId);
}

function swatch(tincture: string, name: string, hex: string): HeraldicPaletteSwatch {
  return { tincture, name, hex };
}

function metals(...swatches: HeraldicPaletteSwatch[]): HeraldicPaletteGroup {
  return { id: 'metals', swatches };
}

function colors(...swatches: HeraldicPaletteSwatch[]): HeraldicPaletteGroup {
  return { id: 'colors', swatches };
}

function otherColors(...swatches: HeraldicPaletteSwatch[]): HeraldicPaletteGroup {
  return { id: 'other-colors', swatches };
}

function extra(...swatches: HeraldicPaletteSwatch[]): HeraldicPaletteGroup {
  return { id: 'extra', swatches };
}

function deepFreeze<Value>(value: Value): Value {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value as Record<string, unknown>)) deepFreeze(nestedValue);
  }
  return value;
}
