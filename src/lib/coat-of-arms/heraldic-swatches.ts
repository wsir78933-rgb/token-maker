export const heraldicSwatchGroupIds = ['metals', 'colours', 'stains', 'other'] as const;

export type HeraldicSwatchGroupId = typeof heraldicSwatchGroupIds[number];

export interface HeraldicSwatch {
  id: string;
  hex: string;
}

export interface HeraldicSwatchGroup {
  id: HeraldicSwatchGroupId;
  swatches: readonly HeraldicSwatch[];
}

export const heraldicSwatchGroups: readonly HeraldicSwatchGroup[] = [
  {
    id: 'metals',
    swatches: [
      { id: 'or', hex: '#F5E6A1' },
      { id: 'argent', hex: '#F2F2F2' },
      { id: 'argent-white', hex: '#FFFFFF' },
      { id: 'steel', hex: '#B5B5B5' },
    ],
  },
  {
    id: 'colours',
    swatches: [
      { id: 'gules', hex: '#B11F24' },
      { id: 'gules-bright', hex: '#BB212C' },
      { id: 'azure', hex: '#1855A5' },
      { id: 'azure-deep', hex: '#013B90' },
      { id: 'vert', hex: '#1D5E23' },
      { id: 'purpure', hex: '#742974' },
      { id: 'sable', hex: '#1B1B1B' },
      { id: 'or-bright', hex: '#F7C702' },
    ],
  },
  {
    id: 'stains',
    swatches: [
      { id: 'tenne', hex: '#F0701A' },
      { id: 'tenne-leather', hex: '#CE956C' },
      { id: 'buff', hex: '#E4BA99' },
      { id: 'murrey-brown', hex: '#793D11' },
    ],
  },
  {
    id: 'other',
    swatches: [
      { id: 'iron', hex: '#47464B' },
    ],
  },
];

export function listHeraldicSwatches(): HeraldicSwatch[] {
  return heraldicSwatchGroups.flatMap((group) => [...group.swatches]);
}

export function requireHeraldicSwatchGroup(groupId: string): HeraldicSwatchGroup {
  const group = heraldicSwatchGroups.find((candidate) => candidate.id === groupId);
  if (!group) throw new Error(`Unknown heraldic swatch group: ${JSON.stringify(groupId)}`);
  return group;
}
