import { getI18nDictionary } from '@/lib/i18n/dictionary';
import type { WeaponCategory } from '@/lib/weapon-creator/catalog';

const WEAPON_CREATOR_LOCALES = ['en', 'zh'] as const;

type WeaponCreatorLocale = (typeof WEAPON_CREATOR_LOCALES)[number];

export type WeaponCreatorFeatureIcon =
  | 'categories'
  | 'parts'
  | 'layers'
  | 'slots'
  | 'preview'
  | 'export';

export type WeaponCreatorFeatureCopy = {
  icon: WeaponCreatorFeatureIcon;
  title: string;
  description: string;
};

export type WeaponCreatorFeatureOverviewCopy = {
  title: string;
  subtitle: string;
  features: readonly [
    WeaponCreatorFeatureCopy,
    WeaponCreatorFeatureCopy,
    WeaponCreatorFeatureCopy,
    WeaponCreatorFeatureCopy,
    WeaponCreatorFeatureCopy,
    WeaponCreatorFeatureCopy,
  ];
};

export type WeaponCreatorCaseStudyCopy = {
  name: string;
  designation: string;
  quote: string;
  src: string;
  alt: string;
};

export type WeaponCreatorCaseStudyGroupCopy = {
  id: string;
  title: string;
  description: string;
  imagePosition: 'left' | 'right';
  carouselLabel: string;
  previousLabel: string;
  nextLabel: string;
  examples: readonly [
    WeaponCreatorCaseStudyCopy,
    WeaponCreatorCaseStudyCopy,
    WeaponCreatorCaseStudyCopy,
    WeaponCreatorCaseStudyCopy,
  ];
};

export type WeaponCreatorCaseStudiesCopy = {
  title: string;
  description: string;
  groups: readonly [
    WeaponCreatorCaseStudyGroupCopy,
    WeaponCreatorCaseStudyGroupCopy,
    WeaponCreatorCaseStudyGroupCopy,
  ];
};

export type WeaponCreatorHowToUseStepCopy = {
  title: string;
  description: string;
};

export type WeaponCreatorFaqItemCopy = {
  question: string;
  answer: string;
};

export type WeaponCreatorToolComparisonRowCopy = {
  dimension: string;
  weaponCreator: string;
  photoshop: string;
  illustrator: string;
};

export type WeaponCreatorToolComparisonCopy = {
  title: string;
  description: string;
  tableLabel: string;
  dimensionHeading: string;
  weaponCreatorHeading: string;
  photoshopHeading: string;
  illustratorHeading: string;
  rows: readonly WeaponCreatorToolComparisonRowCopy[];
};

export type WeaponCreatorCopy = {
  navigationName: string;
  pageTitle: string;
  pageDescription: string;
  heading: string;
  description: string;
  heroAction: string;
  categoryPickerLabel: string;
  categoryLabels: Readonly<Record<WeaponCategory, string>>;
  previewLabel: string;
  preview: string;
  saveSlot: (slotNumber: number) => string;
  loadSlot: (slotNumber: number) => string;
  weaponSlot: (slotNumber: number) => string;
  clearEquipment: string;
  downloadImage: string;
  exportSizeLabel: string;
  exportSizeStandardLabel: string;
  exportSizeLargeLabel: string;
  exportSizeDescription: string;
  imageLoadError: (imagePath: string) => string;
  previewLoadError: string;
  previewTransitionError: string;
  saveLoadError: string;
  replaceSaveConfirm: (slotNumber: number) => string;
  whatIsTitle: string;
  whatIsDescription: string;
  caseStudies: WeaponCreatorCaseStudiesCopy;
  featureOverview: WeaponCreatorFeatureOverviewCopy;
  howToUseEyebrow: string;
  howToUseTitle: string;
  howToUseSteps: readonly [
    WeaponCreatorHowToUseStepCopy,
    WeaponCreatorHowToUseStepCopy,
    WeaponCreatorHowToUseStepCopy,
  ];
  howToUseCallToActionTitle: string;
  howToUseCallToActionDescription: string;
  howToUseAction: string;
  toolComparison: WeaponCreatorToolComparisonCopy;
  faqEyebrow: string;
  faqTitle: string;
  faqDescription: string;
  faqItems: readonly [
    WeaponCreatorFaqItemCopy,
    WeaponCreatorFaqItemCopy,
    WeaponCreatorFaqItemCopy,
    WeaponCreatorFaqItemCopy,
    WeaponCreatorFaqItemCopy,
  ];
};

const WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS = {
  wardenGreatblade: '/weapon-creator/cases/01-warden-greatblade.png',
  moonlitDuelist: '/weapon-creator/cases/02-moonlit-duelist.png',
  stormLancer: '/weapon-creator/cases/03-storm-lancer.png',
  emberWitchStaff: '/weapon-creator/cases/04-ember-witch-staff.png',
  tavernMercenary: '/weapon-creator/cases/05-tavern-mercenary.png',
  royalArmourer: '/weapon-creator/cases/06-royal-armourer.png',
  caravanGuard: '/weapon-creator/cases/07-caravan-guard.png',
  ruinKeeper: '/weapon-creator/cases/08-ruin-keeper.png',
  frostboundRelic: '/weapon-creator/cases/09-frostbound-relic.png',
  skyshipNavigator: '/weapon-creator/cases/10-skyship-navigator.png',
  thornCourtSceptre: '/weapon-creator/cases/11-thorn-court-sceptre.png',
  deepRoadScythe: '/weapon-creator/cases/12-deep-road-scythe.png',
} as const;

const englishWeaponCreatorCaseStudies: WeaponCreatorCaseStudiesCopy = {
  title: 'What can you build with Weapon Creator?',
  description:
    'One parts library, many weapon concepts. Use Weapon Creator to explore 12 assembled references for RPG and D&D characters, recurring NPCs, and fantasy worlds to guide your campaign notes, fiction, or worldbuilding.',
  groups: [
    {
      id: 'rpg',
      title: 'RPG / D&D character roles',
      description:
        'Four weapon references for adventuring roles, from a guard captain’s blade to a storm-touched staff.',
      imagePosition: 'right',
      carouselLabel: 'RPG / D&D weapon examples',
      previousLabel: 'Previous RPG weapon example',
      nextLabel: 'Next RPG weapon example',
      examples: [
        {
          name: 'Warden Greatblade',
          designation: 'RPG / D&D character concept',
          quote:
            'A broad blade, guarded hilt, and long grip create a sturdy two-handed silhouette for a frontier warden.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.wardenGreatblade,
          alt: 'White line-art fantasy greatblade assembled from a blade, crossguard, hilt, and pommel.',
        },
        {
          name: 'Moonlit Duelist',
          designation: 'RPG / D&D character concept',
          quote:
            'A narrow blade with a curved guard and decorated pommel gives a duelist a light, precise outline.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.moonlitDuelist,
          alt: 'White line-art fantasy dueling sword assembled from a narrow blade, hilt, crossguard, and pommel.',
        },
        {
          name: 'Storm Lancer',
          designation: 'RPG / D&D character concept',
          quote:
            'A spear point and long shaft make a readable reach weapon for a mounted scout or storm-chasing lancer.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.stormLancer,
          alt: 'White line-art fantasy spear assembled from a spear head and long weapon shaft.',
        },
        {
          name: 'Ember Witch Staff',
          designation: 'RPG / D&D character concept',
          quote:
            'A staff top, shaft, and weighted bottom suggest a travelling spellcaster without adding rules text or stats.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.emberWitchStaff,
          alt: 'White line-art fantasy staff assembled from a staff top, shaft, and bottom piece.',
        },
      ],
    },
    {
      id: 'npcs',
      title: 'NPCs and social roles',
      description:
        'Four weapon references for recurring NPCs, guards, craftspeople, and keepers of dangerous places.',
      imagePosition: 'left',
      carouselLabel: 'NPC and social role weapon examples',
      previousLabel: 'Previous NPC weapon example',
      nextLabel: 'Next NPC weapon example',
      examples: [
        {
          name: 'Tavern Mercenary',
          designation: 'Everyday NPC concept',
          quote:
            'A compact axe head on a practical handle gives a tavern guard a clear, work-worn weapon silhouette.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.tavernMercenary,
          alt: 'White line-art fantasy hand axe assembled from an axe head and weapon handle.',
        },
        {
          name: 'Royal Armourer',
          designation: 'Court NPC concept',
          quote:
            'A heavy hammer head and long handle provide a straightforward reference for a ceremonial armourer or smith.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.royalArmourer,
          alt: 'White line-art fantasy warhammer assembled from a hammer head and weapon handle.',
        },
        {
          name: 'Caravan Guard',
          designation: 'Travelling NPC concept',
          quote:
            'A simple bow, grip, and tips make a practical ranged weapon reference for a caravan escort.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.caravanGuard,
          alt: 'White line-art fantasy bow assembled from bow limbs, a bow grip, and bow tips.',
        },
        {
          name: 'Ruin Keeper',
          designation: 'Location NPC concept',
          quote:
            'A mace head and handle create a blunt, dependable outline for a shrine guardian or ruin keeper.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.ruinKeeper,
          alt: 'White line-art fantasy mace assembled from a mace head and weapon handle.',
        },
      ],
    },
    {
      id: 'settings',
      title: 'Worldbuilding and story settings',
      description:
        'Four weapon references for cold frontiers, skyships, courtly fantasy, and roads beneath the surface.',
      imagePosition: 'right',
      carouselLabel: 'Worldbuilding weapon examples',
      previousLabel: 'Previous worldbuilding weapon example',
      nextLabel: 'Next worldbuilding weapon example',
      examples: [
        {
          name: 'Frostbound Relic',
          designation: 'Worldbuilding concept',
          quote:
            'A blade, crossguard, and pommel form a relic silhouette that can belong to an old northern dynasty.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.frostboundRelic,
          alt: 'White line-art fantasy relic sword assembled from a blade, crossguard, hilt, and pommel.',
        },
        {
          name: 'Skyship Navigator',
          designation: 'Worldbuilding concept',
          quote:
            'A bow frame with a deliberate grip and tips fits a navigator’s compact weapon reference on a skyship deck.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.skyshipNavigator,
          alt: 'White line-art fantasy bow assembled from bow limbs, a bow grip, and bow tips.',
        },
        {
          name: 'Thorn Court Sceptre',
          designation: 'Worldbuilding concept',
          quote:
            'A staff top, shaft, and bottom give a courtly sceptre a readable vertical silhouette for a thorn-bound kingdom.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.thornCourtSceptre,
          alt: 'White line-art fantasy sceptre assembled from a staff top, shaft, and bottom piece.',
        },
        {
          name: 'Deep Road Scythe',
          designation: 'Worldbuilding concept',
          quote:
            'A scythe component and long pole create a stark reference for a forgotten road beneath the mountains.',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.deepRoadScythe,
          alt: 'White line-art fantasy scythe assembled from a scythe part and a long handle or shaft.',
        },
      ],
    },
  ],
};

const chineseWeaponCreatorCaseStudies: WeaponCreatorCaseStudiesCopy = {
  title: '用武器制作器能做什么？',
  description:
    '武器制作器提供一套部件库，可以组合出多种武器概念。下面的 12 个案例覆盖 RPG / D&D 角色、常驻 NPC 和奇幻世界设定，可用于战役笔记、小说创作与世界观参考。',
  groups: [
    {
      id: 'rpg',
      title: 'RPG / D&D 角色定位',
      description: '用四个武器案例参考边境守卫、决斗者、骑枪手和施法者的武器轮廓。',
      imagePosition: 'right',
      carouselLabel: 'RPG / D&D 武器案例轮播',
      previousLabel: '上一个 RPG 武器案例',
      nextLabel: '下一个 RPG 武器案例',
      examples: [
        {
          name: '边境守卫大剑',
          designation: 'RPG / D&D 角色概念',
          quote: '宽刃、护手和长握柄组合出稳重的双手武器轮廓，适合作为边境守卫的视觉参考。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.wardenGreatblade,
          alt: '由剑刃、护手、剑握柄和柄首组合成的白色线稿奇幻大剑。',
        },
        {
          name: '月光决斗剑',
          designation: 'RPG / D&D 角色概念',
          quote: '窄刃、弧形护手和装饰柄首带来轻巧利落的轮廓，适合决斗者角色参考。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.moonlitDuelist,
          alt: '由窄剑刃、剑握柄、护手和柄首组合成的白色线稿奇幻决斗剑。',
        },
        {
          name: '风暴骑枪',
          designation: 'RPG / D&D 角色概念',
          quote: '长矛部件配合长柄，形成清晰的攻击距离轮廓，可作为骑枪手或风暴猎人的视觉参考。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.stormLancer,
          alt: '由长矛部件和武器长柄组合成的白色线稿奇幻长矛。',
        },
        {
          name: '余烬女巫法杖',
          designation: 'RPG / D&D 角色概念',
          quote: '法杖顶部、杖身和底部组合出旅行施法者的武器轮廓，不附加规则或属性说明。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.emberWitchStaff,
          alt: '由法杖顶部、杖身和法杖底部组合成的白色线稿奇幻法杖。',
        },
      ],
    },
    {
      id: 'npcs',
      title: 'NPC 与社会身份',
      description: '用四个武器案例参考酒馆佣兵、宫廷工匠、商队护卫和遗迹看守者。',
      imagePosition: 'left',
      carouselLabel: 'NPC 与社会身份武器案例轮播',
      previousLabel: '上一个 NPC 武器案例',
      nextLabel: '下一个 NPC 武器案例',
      examples: [
        {
          name: '酒馆佣兵斧',
          designation: '日常 NPC 概念',
          quote: '实用的斧头和握柄组合出带有日常痕迹的武器轮廓，适合酒馆护卫或雇佣兵。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.tavernMercenary,
          alt: '由斧头和武器握柄组合成的白色线稿奇幻手斧。',
        },
        {
          name: '王室铸甲师战锤',
          designation: '宫廷 NPC 概念',
          quote: '厚重战锤头和长握柄形成直接的武器参考，适合宫廷铸甲师或铁匠角色。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.royalArmourer,
          alt: '由战锤头和武器握柄组合成的白色线稿奇幻战锤。',
        },
        {
          name: '商队护卫弓',
          designation: '旅行 NPC 概念',
          quote: '弓臂、握把和弓端部件组合成实用的远程武器轮廓，可参考商队护卫的装备。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.caravanGuard,
          alt: '由弓臂、弓握把和弓端部件组合成的白色线稿奇幻弓。',
        },
        {
          name: '遗迹看守者钉头锤',
          designation: '地点 NPC 概念',
          quote: '钉头锤头与握柄形成可靠直接的轮廓，适合神殿守卫或遗迹看守者。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.ruinKeeper,
          alt: '由钉头锤头和武器握柄组合成的白色线稿奇幻钉头锤。',
        },
      ],
    },
    {
      id: 'settings',
      title: '世界观与故事场景',
      description: '用四个武器案例参考冰原遗物、空艇航行、荆棘王庭和地下道路。',
      imagePosition: 'right',
      carouselLabel: '世界观武器案例轮播',
      previousLabel: '上一个世界观武器案例',
      nextLabel: '下一个世界观武器案例',
      examples: [
        {
          name: '冰封遗物剑',
          designation: '世界观概念',
          quote: '剑刃、护手和柄首形成遗物武器轮廓，可作为北境古老王朝的设定参考。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.frostboundRelic,
          alt: '由剑刃、护手、剑握柄和柄首组合成的白色线稿奇幻遗物剑。',
        },
        {
          name: '空艇领航弓',
          designation: '世界观概念',
          quote: '弓身、握把和弓端部件组合成紧凑的武器概念，适合空艇甲板上的领航员。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.skyshipNavigator,
          alt: '由弓臂、弓握把和弓端部件组合成的白色线稿奇幻弓。',
        },
        {
          name: '荆棘王庭权杖',
          designation: '世界观概念',
          quote: '法杖顶部、杖身和底部构成竖向权杖轮廓，可用于荆棘王国的宫廷设定。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.thornCourtSceptre,
          alt: '由法杖顶部、杖身和法杖底部组合成的白色线稿奇幻权杖。',
        },
        {
          name: '深路镰刀',
          designation: '世界观概念',
          quote: '镰刀部件和长柄组合出鲜明的武器概念，适合山下被遗忘的道路与地下世界。',
          src: WEAPON_CREATOR_CASE_STUDY_IMAGE_PATHS.deepRoadScythe,
          alt: '由镰刀刀头和长柄组合成的白色线稿奇幻镰刀。',
        },
      ],
    },
  ],
};

const englishWeaponCreatorCopy: Omit<WeaponCreatorCopy, 'heading' | 'description'> = {
  navigationName: 'Weapon Creator',
  pageTitle: 'Weapon Creator | Create RPG & TTRPG Fantasy Weapons for Free',
  pageDescription:
    'Use Weapon Creator to combine sword, axe, bow, staff, and polearm parts online for free. Save your RPG and TTRPG weapon designs and download PNG images for character references, campaign notes, and worldbuilding.',
  heroAction: 'Try Weapon Creator',
  categoryPickerLabel: 'Weapon part categories',
  categoryLabels: {
    hilts: 'Hilts',
    pommels: 'Pommels',
    crossguards: 'Crossguards',
    blade: 'Blades',
    handle: 'Handles',
    axe: 'Axe heads',
    mace: 'Mace heads',
    hammer: 'Warhammer heads',
    bow: 'Bow limbs',
    bowhandle: 'Bow grips',
    bowtip: 'Bow tips',
    stafftop: 'Staff tops',
    staffbtm: 'Staff bottoms',
    staff: 'Staff shafts',
    scythe: 'Scythe parts',
    polearm: 'Polearm parts',
    spear: 'Spear parts',
  },
  previewLabel: 'Weapon preview',
  preview: 'Preview',
  saveSlot(slotNumber: number) {
    return formatWeaponSlotLabel('Save', slotNumber);
  },
  loadSlot(slotNumber: number) {
    return formatWeaponSlotLabel('Load', slotNumber);
  },
  weaponSlot(slotNumber: number) {
    return formatWeaponSlotLabel('Weapon', slotNumber);
  },
  clearEquipment: 'Clear weapon',
  downloadImage: 'Download PNG',
  exportSizeLabel: 'Export size',
  exportSizeStandardLabel: 'Standard size',
  exportSizeLargeLabel: 'Large size',
  exportSizeDescription:
    'Large size smooths and enlarges the existing artwork without adding new detail.',
  imageLoadError(imagePath: string) {
    return `Weapon part image failed to load. Received ${JSON.stringify(imagePath)}.`;
  },
  previewLoadError: 'The weapon preview could not be rendered.',
  previewTransitionError: 'The previous weapon preview could not be captured for the transition.',
  saveLoadError: 'The selected weapon slot could not be loaded.',
  replaceSaveConfirm(slotNumber: number) {
    return formatWeaponSlotLabel('Replace save', slotNumber, '?');
  },
  whatIsTitle: 'What is the Weapon Creator?',
  whatIsDescription:
    'Weapon Creator is an online visual tool for D&D and TTRPG players, DM / GMs, fantasy writers, worldbuilders, and anyone who needs a weapon concept reference. Choose illustrated parts such as blades, hilts, crossguards, axe heads, bow pieces, staff pieces, scythes, polearms, and spears, then review the assembled white line-art preview. Save up to four combinations in your current browser and download the result as a PNG for campaign notes, character references, or story planning.',
  caseStudies: englishWeaponCreatorCaseStudies,
  featureOverview: {
    title: 'Assemble a Weapon Concept',
    subtitle:
      'Choose one part from each available category in Weapon Creator, let the preset layer positions keep the silhouette readable, and keep alternate ideas ready for your campaign or story.',
    features: [
      {
        icon: 'categories',
        title: 'Browse 17 Categories',
        description:
          'In Weapon Creator, explore hilts, pommels, blades, handles, axe heads, mace heads, bows, staffs, scythes, polearms, spears, and more.',
      },
      {
        icon: 'parts',
        title: 'Choose Illustrated Parts',
        description:
          'Select a white line-art part from the category picker. The library contains 540 options across 17 categories, including 60 pommels and 30 options in each other category.',
      },
      {
        icon: 'layers',
        title: 'Combine Preset Layers',
        description:
          'Parts from different categories can be combined, while a new choice in the same category replaces the previous part.',
      },
      {
        icon: 'slots',
        title: 'Keep Four Weapon Slots',
        description:
          "Use Weapon Creator's four local browser slots to save alternate weapon combinations while you compare concepts for a character or setting.",
      },
      {
        icon: 'preview',
        title: 'Review the Live Preview',
        description:
          'See selected parts layered into the weapon preview as you make each choice, then clear the preview whenever you want a fresh start.',
      },
      {
        icon: 'export',
        title: 'Download a PNG',
        description:
          'Download the assembled white line-art weapon as a PNG for a campaign handout, a design note, or a visual reference.',
      },
    ],
  },
  howToUseEyebrow: 'How it works',
  howToUseTitle: 'How to use the Weapon Creator',
  howToUseSteps: [
    {
      title: 'Open a weapon category',
      description: 'In Weapon Creator, choose a category such as blades, axe heads, bow parts, staff parts, or spears to browse its line-art options.',
    },
    {
      title: 'Combine the parts',
      description: 'Select parts from different categories in Weapon Creator. Choose another part in the same category to replace it, or click the selected part again to remove it.',
    },
    {
      title: 'Save or download the concept',
      description: 'Use Weapon Creator to keep alternate combinations in four weapon slots, then download the current assembled preview as a PNG.',
    },
  ],
  howToUseCallToActionTitle: 'Start assembling a weapon concept',
  howToUseCallToActionDescription:
    'Use Weapon Creator to choose a category, combine illustrated parts, and keep a clean PNG reference for your next character or setting.',
  howToUseAction: 'Start creating',
  toolComparison: {
    title: 'Weapon Creator vs. Photoshop vs. Illustrator',
    description:
      'Weapon Creator gives you a focused parts library and preset composition for quick concept references, while general drawing tools leave the asset preparation and layer arrangement to you.',
    tableLabel: 'Weapon creation tools comparison',
    dimensionHeading: 'Comparison',
    weaponCreatorHeading: 'Weapon Creator',
    photoshopHeading: 'Photoshop',
    illustratorHeading: 'Illustrator',
    rows: [
      {
        dimension: 'Weapon assets',
        weaponCreator: 'Built-in illustrated parts for 17 categories',
        photoshop: 'Prepare, find, or draw the assets yourself',
        illustrator: 'Draw or import vector assets yourself',
      },
      {
        dimension: 'Assembly',
        weaponCreator: 'Choose parts with automatic preset layering and a live preview',
        photoshop: 'Arrange layers, positions, and sizes yourself',
        illustrator: 'Arrange objects, paths, and layouts yourself',
      },
      {
        dimension: 'Alternate concepts',
        weaponCreator: 'Four weapon slots let you compare combinations quickly',
        photoshop: 'Use layer comps, file copies, or saved versions',
        illustrator: 'Use multiple artboards or saved versions',
      },
      {
        dimension: 'Resume later',
        weaponCreator: 'Keep slots saved in the current browser',
        photoshop: 'Save a PSD with editable layers',
        illustrator: 'Save an AI file with editable objects',
      },
      {
        dimension: 'Export',
        weaponCreator: 'Download the assembled line art directly as a PNG',
        photoshop: 'Export PNG, JPG, and other formats with configurable settings',
        illustrator: 'Export SVG, PDF, and other formats with configurable settings',
      },
    ],
  },
  faqEyebrow: 'FAQ',
  faqTitle: 'Weapon Creator FAQ',
  faqDescription:
    'Learn how Weapon Creator handles weapon categories, part replacement, saved slots, preview layering, and PNG downloads.',
  faqItems: [
    {
      question: 'Who is Weapon Creator for?',
      answer:
        'Weapon Creator is designed for D&D and TTRPG players, DM / GMs, fantasy writers, worldbuilders, and anyone who needs a weapon concept reference.',
    },
    {
      question: 'Is Weapon Creator free to use?',
      answer: 'Yes. Weapon Creator lets you combine parts, save four weapon slots, and download the current preview in your browser for free.',
    },
    {
      question: 'Which weapon categories are available?',
      answer:
        'The library includes hilts, pommels, crossguards, blades, handles, axe heads, mace heads, warhammer heads, bow parts, staff parts, scythe parts, polearm parts, and spear parts across 17 categories.',
    },
    {
      question: 'Can I combine parts from different weapon types?',
      answer:
        'Yes. Select parts from any categories you want to explore. A new choice replaces the previous choice in the same category, and selecting the active part again removes it.',
    },
    {
      question: 'Can I save and export a weapon concept?',
      answer:
        'Yes. Use the four weapon slots to keep alternate combinations, then download the current white line-art preview as a PNG image.',
    },
  ],
};

const chineseWeaponCreatorCopy: Omit<WeaponCreatorCopy, 'heading' | 'description'> = {
  navigationName: '武器制作器',
  pageTitle: '武器制作器｜免费在线制作 RPG 与 TRPG 奇幻武器',
  pageDescription:
    '使用武器制作器，在线免费组合剑、斧、弓、法杖和长柄武器部件，制作 RPG 与 TRPG 奇幻武器。保存不同组合，并下载 PNG 图片，用于角色设定、战役笔记与世界观创作。',
  heroAction: '试用武器制作器',
  categoryPickerLabel: '武器部件分类',
  categoryLabels: {
    hilts: '剑握柄',
    pommels: '柄首',
    crossguards: '护手',
    blade: '剑刃',
    handle: '武器握柄',
    axe: '斧头',
    mace: '钉头锤头',
    hammer: '战锤头',
    bow: '弓臂',
    bowhandle: '弓握把',
    bowtip: '弓端部件',
    stafftop: '法杖顶部',
    staffbtm: '法杖底部',
    staff: '杖身',
    scythe: '镰刀部件',
    polearm: '长柄武器部件',
    spear: '长矛部件',
  },
  previewLabel: '武器预览',
  preview: '预览',
  saveSlot(slotNumber: number) {
    return formatWeaponSlotLabel('保存', slotNumber);
  },
  loadSlot(slotNumber: number) {
    return formatWeaponSlotLabel('读取', slotNumber);
  },
  weaponSlot(slotNumber: number) {
    return formatWeaponSlotLabel('武器', slotNumber);
  },
  clearEquipment: '清空武器',
  downloadImage: '下载 PNG',
  exportSizeLabel: '导出尺寸',
  exportSizeStandardLabel: '标准尺寸',
  exportSizeLargeLabel: '大尺寸',
  exportSizeDescription: '大尺寸采用平滑放大，保留原有图案细节。',
  imageLoadError(imagePath: string) {
    return `武器部件图片加载失败。收到的路径：${JSON.stringify(imagePath)}。`;
  },
  previewLoadError: '武器预览无法渲染。',
  previewTransitionError: '无法捕获上一张武器预览以播放切换动画。',
  saveLoadError: '无法读取所选武器槽位。',
  replaceSaveConfirm(slotNumber: number) {
    return formatWeaponSlotLabel('替换保存', slotNumber, '？');
  },
  whatIsTitle: '什么是武器制作器？',
  whatIsDescription:
    '武器制作器是一款面向 D&D / TRPG 玩家、DM/GM、奇幻小说作者、世界观创作者，以及需要武器概念参考的人的在线视觉工具。你可以从剑刃、握柄、护手、斧头、弓、法杖、镰刀、长柄武器和长矛等分类中选择白色线稿部件，查看自动叠放后的武器预览。你还可以在当前浏览器中保存最多四种组合，并将结果下载为 PNG，用于战役笔记、角色参考或故事设定。',
  caseStudies: chineseWeaponCreatorCaseStudies,
  featureOverview: {
    title: '组合一把武器概念',
    subtitle:
      '在武器制作器中，从可用分类中选择部件，让预设图层位置保持轮廓清晰，并为战役或故事保留不同的武器构想。',
    features: [
      {
        icon: 'categories',
        title: '浏览 17 类部件',
        description: '在武器制作器中浏览剑握柄、柄首、剑刃、握柄、斧头、钉头锤、弓、法杖、镰刀、长柄武器、长矛等部件。',
      },
      {
        icon: 'parts',
        title: '选择线稿部件',
        description: '从分类选择器中选择白色线稿部件；17 个分类共提供 540 个选项，其中柄首有 60 个，其余分类各有 30 个。',
      },
      {
        icon: 'layers',
        title: '组合预设图层',
        description: '不同分类的部件可以组合；同一分类再次选择其他部件时，会替换原来的部件。',
      },
      {
        icon: 'slots',
        title: '保留四个武器槽位',
        description: '使用武器制作器的四个本地浏览器槽位保存不同组合，比较角色或世界观概念时可以快速切换。',
      },
      {
        icon: 'preview',
        title: '查看实时预览',
        description: '每次选择都会将部件叠放到武器预览中；需要重新开始时可以清空当前预览。',
      },
      {
        icon: 'export',
        title: '下载 PNG 图片',
        description: '将组合好的白色线稿武器下载为 PNG，用于战役资料、设计笔记或视觉参考。',
      },
    ],
  },
  howToUseEyebrow: '使用方式',
  howToUseTitle: '如何使用武器制作器？',
  howToUseSteps: [
    {
      title: '打开武器部件分类',
      description: '在武器制作器中选择剑刃、斧头、弓、法杖、长矛等分类，浏览对应的线稿选项。',
    },
    {
      title: '组合武器部件',
      description: '从不同分类中选择部件，在武器制作器中进行组合；同一分类重新选择会替换原部件，再次点击当前部件即可移除。',
    },
    {
      title: '保存或下载概念',
      description: '使用武器制作器将不同组合保存在四个武器槽位中，完成后把当前组合预览下载为 PNG 图片。',
    },
  ],
  howToUseCallToActionTitle: '开始拼装武器概念',
  howToUseCallToActionDescription: '使用武器制作器选择分类，组合线稿部件，为下一个角色或世界观保留清晰的 PNG 参考。',
  howToUseAction: '开始创作',
  toolComparison: {
    title: '武器制作器 vs. Photoshop vs. Illustrator',
    description:
      '武器制作器提供专门的部件库和预设组合方式，适合快速制作概念参考；通用绘图工具则需要你自行准备素材和整理图层。',
    tableLabel: '武器创作工具对比',
    dimensionHeading: '对比项目',
    weaponCreatorHeading: '武器制作器',
    photoshopHeading: 'Photoshop',
    illustratorHeading: 'Illustrator',
    rows: [
      {
        dimension: '武器素材',
        weaponCreator: '内置 17 类线稿部件',
        photoshop: '自行准备、寻找或绘制素材',
        illustrator: '自行绘制或导入矢量素材',
      },
      {
        dimension: '组合方式',
        weaponCreator: '选择部件，自动预设叠放并实时预览',
        photoshop: '自行整理图层、位置和尺寸',
        illustrator: '自行整理对象、路径和布局',
      },
      {
        dimension: '多个概念',
        weaponCreator: '四个武器槽位，快速比较不同组合',
        photoshop: '使用图层复合、文件副本或保存版本',
        illustrator: '使用多个画板或保存版本',
      },
      {
        dimension: '回来继续',
        weaponCreator: '组合保存在当前浏览器的槽位中',
        photoshop: '保存 PSD 文件并保留可编辑图层',
        illustrator: '保存 AI 文件并保留可编辑对象',
      },
      {
        dimension: '导出',
        weaponCreator: '直接将组合后的线稿下载为 PNG',
        photoshop: '按需设置并导出 PNG、JPG 等格式',
        illustrator: '按需设置并导出 SVG、PDF 等格式',
      },
    ],
  },
  faqEyebrow: '常见问题',
  faqTitle: '武器制作器常见问题',
  faqDescription: '了解武器制作器中的武器分类、部件替换、保存槽位、预览叠放和 PNG 下载的使用方式。',
  faqItems: [
    {
      question: '武器制作器适合哪些人使用？',
      answer: '武器制作器适合 D&D / TRPG 玩家、DM/GM、奇幻小说作者、世界观创作者，以及需要武器概念参考的人。',
    },
    {
      question: '武器制作器可以免费使用吗？',
      answer: '可以。使用武器制作器，你可以在浏览器中免费组合部件、保存四个武器槽位，并下载当前预览。',
    },
    {
      question: '目前有哪些武器部件分类？',
      answer: '工具包含剑握柄、柄首、护手、剑刃、握柄、斧头、钉头锤头、战锤头、弓部件、法杖部件、镰刀、长柄武器和长矛等 17 类。',
    },
    {
      question: '可以组合不同类型的武器部件吗？',
      answer: '可以。你可以从任意分类中选择想尝试的部件；同一分类的新选择会替换原选择，再次点击当前部件即可移除。',
    },
    {
      question: '可以保存并导出武器概念吗？',
      answer: '可以使用四个武器槽位保存不同组合，并将当前白色线稿预览下载为 PNG 图片。',
    },
  ],
};

const WEAPON_CREATOR_COPY: Record<WeaponCreatorLocale, WeaponCreatorCopy> = {
  en: {
    ...englishWeaponCreatorCopy,
    heading: 'Weapon Creator | Create RPG & TTRPG Fantasy Weapons Online for Free',
    description: englishWeaponCreatorCopy.pageDescription,
  },
  zh: {
    ...chineseWeaponCreatorCopy,
    heading: chineseWeaponCreatorCopy.pageTitle,
    description: chineseWeaponCreatorCopy.pageDescription,
  },
};

function isWeaponCreatorLocale(locale: string): locale is WeaponCreatorLocale {
  return WEAPON_CREATOR_LOCALES.includes(locale as WeaponCreatorLocale);
}

function requireWeaponCreatorLocale(locale: string): WeaponCreatorLocale {
  if (isWeaponCreatorLocale(locale)) {
    return locale;
  }

  throw new Error(`Unknown weapon creator locale. Received ${JSON.stringify(locale)}.`);
}

function requireWeaponSlotNumber(slotNumber: number): void {
  if (!Number.isInteger(slotNumber) || slotNumber < 1 || slotNumber > 4) {
    throw new Error(
      `Weapon creator save slot must be an integer from 1 to 4. Received ${slotNumber}.`,
    );
  }
}

function formatWeaponSlotLabel(prefix: string, slotNumber: number, suffix = ''): string {
  requireWeaponSlotNumber(slotNumber);
  return `${prefix} ${slotNumber}${suffix}`;
}

export function getWeaponCreatorCopy(locale: string): WeaponCreatorCopy {
  return getI18nDictionary(
    requireWeaponCreatorLocale(locale),
    WEAPON_CREATOR_COPY,
    'weapon creator',
  );
}

export function getWeaponCreatorCategoryLabel(
  locale: string,
  category: WeaponCategory,
): string {
  const copy = getWeaponCreatorCopy(locale);
  const label = copy.categoryLabels[category];

  if (typeof label !== 'string' || label.trim().length === 0) {
    throw new Error(
      `Weapon creator category label is missing for ${JSON.stringify(category)} in locale ${JSON.stringify(locale)}.`,
    );
  }

  return label;
}
