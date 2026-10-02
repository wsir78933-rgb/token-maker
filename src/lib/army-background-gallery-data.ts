import sourceMaps from './army-background-gallery-maps.json';

export type ArmyBackgroundGallerySource = 'dyson' | 'texttotabletop';

export type ArmyBackgroundGalleryCategory =
  | 'outdoors'
  | 'settlements'
  | 'buildings'
  | 'dungeons'
  | 'fortifications'
  | 'temples'
  | 'regional'
  | 'other';

export interface ArmyBackgroundGalleryMap {
  id: string;
  title: string;
  description: string;
  source: ArmyBackgroundGallerySource;
  sourceName: string;
  sourcePage: string;
  attribution: string;
  originalDimensions: string;
  previewSrc: string;
  category: ArmyBackgroundGalleryCategory;
}

const categoryTerms: Record<ArmyBackgroundGalleryCategory, string[]> = {
  dungeons: [
    'cave', 'caves', 'cavern', 'caverns', 'catacomb', 'catacombs', 'dungeon',
    'dungeons', 'grotto', 'grottos', 'crypt', 'crypts', 'tomb', 'tombs',
    'sewer', 'sewers', 'tunnel', 'tunnels', 'mine', 'mines', 'labyrinth',
    'undercroft', 'underworld', 'burrow', 'lair', 'pit', 'passage', 'passages',
    'barrow', 'barrows', 'mound', 'mounds', 'warren', 'vault', 'vaults',
    'basement', 'basements', 'deeps', 'depths', 'descent', 'sepulchre',
    'sepulcher', 'drop', 'hole', 'vein', 'sink', 'crucible', 'the cut',
  ],
  temples: [
    'temple', 'temples', 'shrine', 'shrines', 'sanctuary', 'monastery', 'abbey',
    'chapel', 'cathedral', 'ruin', 'ruins', 'ruined', 'necropolis', 'ziggurat',
    'altar', 'holy site', 'basilica', 'sanctum', 'pyramid', 'monument',
    'monuments', 'statue', 'statues', 'ritual', 'druidic circle',
  ],
  fortifications: [
    'castle', 'castles', 'fort', 'forts', 'fortress', 'fortresses', 'stronghold',
    'citadel', 'bastion', 'keep', 'keeps', 'palisade', 'gatehouse', 'outpost',
    'watchtower', 'barracks', 'rampart', 'ramparts', 'redoubt', 'siege',
    'fortification', 'fortifications', 'wall', 'walls', 'hold', 'watch',
    'beacon',
  ],
  settlements: [
    'city', 'cities', 'town', 'towns', 'village', 'villages', 'street', 'streets',
    'district', 'districts', 'borough', 'boroughs', 'hamlet', 'hamlets',
    'settlement', 'settlements', 'harbor', 'harbour', 'dock', 'docks', 'ward',
    'market', 'markets', 'port', 'ports', 'township', 'capital', 'darklingtown',
    'frogsport', 'fishmarket', 'smallharbour',
  ],
  regional: [
    'region', 'regional', 'kingdom', 'realm', 'province', 'duchy', 'empire',
    'archipelago', 'borderlands', 'hex map', 'world map', 'campaign map',
    'continent', 'territory', 'principalities', 'bay', 'lands', 'land', 'isle',
    'isles', 'hexmap', 'glowlands',
  ],
  outdoors: [
    'forest', 'forests', 'woodland', 'woods', 'island', 'islands', 'mountain',
    'mountains', 'swamp', 'marsh', 'jungle', 'desert', 'river', 'lake', 'cliff',
    'canyon', 'field', 'meadow', 'grove', 'glade', 'waterfall', 'coast', 'beach',
    'glacier', 'tundra', 'volcano', 'bog', 'valley', 'trail', 'garden', 'wilds',
    'wilderness', 'shore', 'shoreline', 'pass', 'cay', 'ford', 'dunes', 'sands',
    'spring', 'camp', 'campsite', 'graveyard', 'cemetery', 'waste',
  ],
  buildings: [
    'house', 'houses', 'manor', 'mansion', 'hall', 'tower', 'inn', 'tavern',
    'shop', 'mill', 'barn', 'farm', 'library', 'apartment', 'estate', 'villa',
    'palace', 'interior', 'cellar', 'warehouse', 'brewery', 'workshop',
    'observatory', 'academy', 'theater', 'theatre', 'school', 'hospital',
    'museum', 'building', 'buildings', 'stable', 'residence', 'foundry', 'home',
    'manse', 'refuge', 'lighthouse', 'farmstead', 'windmill', 'dome', 'facility',
    'retreat', 'spire',
  ],
  other: [],
};

function normalizeMapText(value: string): string {
  return ` ${value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;
}

function hasCategoryTerm(normalizedMapText: string, terms: string[]): boolean {
  return terms.some((term) => normalizedMapText.includes(` ${term} `));
}

function getArmyBackgroundCategory(
  title: string,
  description: string,
): ArmyBackgroundGalleryCategory {
  const normalizedMapText = normalizeMapText(`${title} ${description}`);
  const categoryPriority: ArmyBackgroundGalleryCategory[] = [
    'dungeons',
    'temples',
    'fortifications',
    'settlements',
    'regional',
    'outdoors',
    'buildings',
  ];

  return categoryPriority.find((category) =>
    hasCategoryTerm(normalizedMapText, categoryTerms[category]),
  ) ?? 'other';
}

function requireMapString(
  value: unknown,
  fieldName: string,
  mapIndex: number,
  allowEmpty = false,
): string {
  if (typeof value !== 'string' || (!allowEmpty && value.trim().length === 0)) {
    throw new Error(
      `Army background gallery maps[${mapIndex}].${fieldName} must be ${allowEmpty ? 'a string' : 'a non-empty string'}, received: ${JSON.stringify(value)}`,
    );
  }

  return value;
}

function validateArmyBackgroundMap(
  value: unknown,
  mapIndex: number,
): Omit<ArmyBackgroundGalleryMap, 'category'> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(
      `Army background gallery maps[${mapIndex}] must be an object, received: ${JSON.stringify(value)}`,
    );
  }

  const mapRecord = value as Record<string, unknown>;
  const source = requireMapString(mapRecord.source, 'source', mapIndex);
  if (source !== 'dyson' && source !== 'texttotabletop') {
    throw new Error(
      `Army background gallery maps[${mapIndex}].source has unsupported value: ${JSON.stringify(source)}`,
    );
  }

  const description = requireMapString(
    mapRecord.description,
    'description',
    mapIndex,
    true,
  );
  const sourcePage = requireMapString(mapRecord.sourcePage, 'sourcePage', mapIndex);
  if (!sourcePage.startsWith('https://')) {
    throw new Error(
      `Army background gallery maps[${mapIndex}].sourcePage must use https://, received: ${JSON.stringify(sourcePage)}`,
    );
  }

  return {
    id: requireMapString(mapRecord.id, 'id', mapIndex),
    title: requireMapString(mapRecord.title, 'title', mapIndex),
    description,
    source,
    sourceName: requireMapString(mapRecord.sourceName, 'sourceName', mapIndex),
    sourcePage,
    attribution: requireMapString(mapRecord.attribution, 'attribution', mapIndex),
    originalDimensions: requireMapString(
      mapRecord.originalDimensions,
      'originalDimensions',
      mapIndex,
      true,
    ),
    previewSrc: requireMapString(mapRecord.previewSrc, 'previewSrc', mapIndex),
  };
}

function validateArmyBackgroundMaps(value: unknown): ArmyBackgroundGalleryMap[] {
  if (!Array.isArray(value) || value.length !== 717) {
    throw new Error(
      `Army background gallery maps must contain 717 records, received: ${Array.isArray(value) ? value.length : JSON.stringify(value)}`,
    );
  }

  const seenMapIds = new Set<string>();

  return value.map((record, mapIndex) => {
    const mapRecord = validateArmyBackgroundMap(record, mapIndex);
    if (seenMapIds.has(mapRecord.id)) {
      throw new Error(
        `Army background gallery maps[${mapIndex}].id is duplicated: ${JSON.stringify(mapRecord.id)}`,
      );
    }
    seenMapIds.add(mapRecord.id);

    return {
      ...mapRecord,
      category: getArmyBackgroundCategory(mapRecord.title, mapRecord.description),
    };
  });
}

export const armyBackgroundGalleryMaps = validateArmyBackgroundMaps(sourceMaps);
