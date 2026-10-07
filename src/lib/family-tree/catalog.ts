export const FAMILY_TREE_AVATAR_CATEGORIES = [
  'faces',
  'hair',
  'ears',
  'eyes',
  'eyebrows',
  'noses',
  'mouths',
  'extras',
] as const;

export type FamilyTreeAvatarCategory = (typeof FAMILY_TREE_AVATAR_CATEGORIES)[number];

export const FAMILY_TREE_COLOR_KEYS = [
  'skinColor',
  'hairColor',
  'eyeColor',
  'eyebrowColor',
  'moustacheColor',
] as const;

export type FamilyTreeAvatarColorKey = (typeof FAMILY_TREE_COLOR_KEYS)[number];

export type FamilyTreeAvatarChoiceGroup =
  | 'faces'
  | 'beards'
  | 'hair'
  | 'ears'
  | 'eyes'
  | 'eyebrows'
  | 'noses'
  | 'moustaches'
  | 'mouths'
  | 'faceWrinkles'
  | 'eyeWrinkles'
  | 'scars'
  | 'reset';

export type FamilyTreeAvatarChoice = {
  readonly id: string;
  readonly category: FamilyTreeAvatarCategory;
  readonly group: FamilyTreeAvatarChoiceGroup;
  readonly index: number;
  readonly name: {
    readonly en: string;
    readonly zh: string;
  };
};

export const FAMILY_TREE_COLOR_PALETTES = {
  skinColor: [
    '#FBC6AF',
    '#F0CFCF',
    '#614033',
    '#DD9478',
    '#D6A28B',
    '#F3C9C0',
    '#E19E9E',
    '#F5DCD7',
    '#D3A19B',
    '#EEC0D9',
    '#FCD5C6',
    '#EBC8B9',
    '#FCE1E1',
    '#DBB7A8',
    '#FDE4D9',
    '#E5BEB9',
    '#CE9B93',
    '#E9B6A3',
    '#351D15',
    '#AF7943',
    '#938C7A',
    '#83A070',
    '#916949',
    '#406D23',
  ],
  hairColor: [
    '#8A3F1D',
    '#3E2212',
    '#CC956E',
    '#804F39',
    '#D36033',
    '#8E331D',
    '#3A1B12',
    '#70605E',
    '#44312E',
    '#80332B',
    '#F2DA90',
    '#1D1E1E',
    '#EBECED',
    '#4861D8',
    '#457535',
    '#CF4BEF',
  ],
  eyeColor: [
    '#658AC7',
    '#7F5534',
    '#517334',
    '#888F94',
    '#AE6C3D',
    '#2D1505',
    '#BAEA8C',
    '#0C63EF',
    '#AA330E',
    '#C597F2',
  ],
  eyebrowColor: [
    '#8A3F1D',
    '#3E2212',
    '#CC956E',
    '#804F39',
    '#D36033',
    '#8E331D',
    '#3A1B12',
    '#70605E',
    '#44312E',
    '#80332B',
    '#F2DA90',
    '#1D1E1E',
    '#EBECED',
    '#4861D8',
    '#457535',
    '#CF4BEF',
  ],
  moustacheColor: [
    '#8A3F1D',
    '#3E2212',
    '#CC956E',
    '#804F39',
    '#D36033',
    '#8E331D',
    '#3A1B12',
    '#70605E',
    '#44312E',
    '#80332B',
    '#F2DA90',
    '#1D1E1E',
    '#EBECED',
    '#4861D8',
    '#457535',
    '#CF4BEF',
  ],
} as const satisfies Readonly<Record<FamilyTreeAvatarColorKey, readonly string[]>>;

export const FAMILY_TREE_AVATAR_ASSET_ROOT = '/family-tree/rollforfantasy/images/npc';

function createChoice(
  category: FamilyTreeAvatarCategory,
  group: FamilyTreeAvatarChoiceGroup,
  id: string,
  index: number,
  englishName: string,
  chineseName: string,
): FamilyTreeAvatarChoice {
  return {
    id,
    category,
    group,
    index,
    name: { en: englishName, zh: chineseName },
  };
}

function numberedChoices(
  category: FamilyTreeAvatarCategory,
  group: FamilyTreeAvatarChoiceGroup,
  idPrefix: string,
  count: number,
  englishPrefix: string,
  chinesePrefix: string,
  startIndex = 1,
): FamilyTreeAvatarChoice[] {
  const choices: FamilyTreeAvatarChoice[] = [];
  for (let offset = 0; offset < count; offset += 1) {
    const index = startIndex + offset;
    choices.push(
      createChoice(
        category,
        group,
        `${idPrefix}${index}`,
        index,
        `${englishPrefix} ${index}`,
        `${chinesePrefix}${index}`,
      ),
    );
  }
  return choices;
}

function createCategoryChoices(): Readonly<Record<FamilyTreeAvatarCategory, readonly FamilyTreeAvatarChoice[]>> {
  const faces = [
    ...numberedChoices('faces', 'faces', 'face', 22, 'Face', '脸型 '),
    ...numberedChoices('faces', 'faces', 'mface', 18, 'Masculine face', '男性脸型 '),
    ...numberedChoices('faces', 'beards', 'beards', 17, 'Beard', '胡须 '),
  ];
  const hair = [
    createChoice('hair', 'hair', 'hair0', 0, 'No hair', '无头发'),
    ...numberedChoices('hair', 'hair', 'hair', 40, 'Hair', '发型 '),
  ];
  const ears = [
    createChoice('ears', 'ears', 'ears1', 1, 'Human ears', '人类耳朵'),
    createChoice('ears', 'ears', 'ears2', 2, 'Elf ears', '精灵耳朵'),
    createChoice('ears', 'ears', 'ears3', 3, 'Dwarf ears', '矮人耳朵'),
    createChoice('ears', 'ears', 'ears4', 4, 'Halfling ears', '半身人耳朵'),
    createChoice('ears', 'ears', 'ears5', 5, 'Orc ears', '兽人耳朵'),
  ];
  const eyes = numberedChoices('eyes', 'eyes', 'eyes', 40, 'Eyes', '眼睛 ');
  const eyebrows = numberedChoices('eyebrows', 'eyebrows', 'eb', 80, 'Eyebrows', '眉毛 ');
  const noses = [
    ...numberedChoices('noses', 'noses', 'nose', 30, 'Nose', '鼻子 '),
    ...numberedChoices('noses', 'moustaches', 'mstch', 28, 'Moustache', '小胡子 '),
  ];
  const mouths = numberedChoices('mouths', 'mouths', 'mouth', 80, 'Mouth', '嘴巴 ');
  const extras = [
    createChoice('extras', 'reset', 'reset-wrinkles', 0, 'Reset wrinkles', '重置皱纹'),
    ...numberedChoices('extras', 'faceWrinkles', 'old', 11, 'Face wrinkle', '面部皱纹 '),
    ...numberedChoices('extras', 'eyeWrinkles', 'eyesp', 10, 'Eye wrinkle', '眼部皱纹 '),
    ...numberedChoices('extras', 'scars', 'scar', 30, 'Scar', '疤痕 '),
  ];

  return { faces, hair, ears, eyes, eyebrows, noses, mouths, extras };
}

const CATEGORY_CHOICES = createCategoryChoices();

export function getFamilyTreeCategoryChoices(
  category: FamilyTreeAvatarCategory,
): readonly FamilyTreeAvatarChoice[] {
  if (!FAMILY_TREE_AVATAR_CATEGORIES.includes(category)) {
    throw new Error(`Family tree avatar category is invalid. Received ${JSON.stringify(category)}.`);
  }

  return CATEGORY_CHOICES[category];
}

export function getFamilyTreeAvatarChoice(choiceId: string): FamilyTreeAvatarChoice {
  if (typeof choiceId !== 'string' || choiceId.length === 0) {
    throw new Error(`Family tree avatar choice id must be a non-empty string. Received ${JSON.stringify(choiceId)}.`);
  }

  for (const category of FAMILY_TREE_AVATAR_CATEGORIES) {
    const choice = CATEGORY_CHOICES[category].find((candidate) => candidate.id === choiceId);
    if (choice !== undefined) {
      return choice;
    }
  }

  throw new Error(`Family tree avatar choice id is invalid. Received ${JSON.stringify(choiceId)}.`);
}

export function requireFamilyTreeAvatarColorKey(value: unknown): FamilyTreeAvatarColorKey {
  if (typeof value === 'string' && FAMILY_TREE_COLOR_KEYS.includes(value as FamilyTreeAvatarColorKey)) {
    return value as FamilyTreeAvatarColorKey;
  }

  throw new Error(`Family tree avatar color key is invalid. Received ${JSON.stringify(value)}.`);
}

export function familyTreeColorIndexCount(colorKey: FamilyTreeAvatarColorKey): number {
  const validColorKey = requireFamilyTreeAvatarColorKey(colorKey);
  return FAMILY_TREE_COLOR_PALETTES[validColorKey].length;
}
