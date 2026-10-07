import type { SiteLocale } from '@/lib/site-locale';

export type PeriodicTableCaseExampleCopy = {
  readonly caseId: string;
  readonly name: string;
  readonly quote: string;
  readonly designation: string;
  readonly alt: string;
};

export type PeriodicTableCaseGroupCopy = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly imagePosition: 'left' | 'right';
  readonly examples: readonly PeriodicTableCaseExampleCopy[];
};

export type PeriodicTableCaseStudiesCopy = {
  readonly title: string;
  readonly description: string;
  readonly useCase: string;
  readonly downloadTemplate: string;
  readonly loadingCase: string;
  readonly caseLoaded: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly groups: readonly PeriodicTableCaseGroupCopy[];
};

const englishCaseStudiesCopy: PeriodicTableCaseStudiesCopy = {
  title: 'See what you can build with Periodic Table Creator',
  description:
    'Start with an editable 24-entry table, then reshape symbols, names, sources, uses, and costs for your own world. Explore original fantasy, alchemy, and science-fiction examples.',
  useCase: 'Use this case',
  downloadTemplate: 'Download TXT template',
  loadingCase: 'Loading case…',
  caseLoaded: 'Loaded {name}',
  previousLabel: 'Previous case',
  nextLabel: 'Next case',
  groups: [
    {
      id: 'magic',
      title: 'Magic systems',
      description:
        'Use columns for schools or forces and rows for increasing practice, charge, or breach levels. These examples turn fictional magic into a readable reference for a setting.',
      imagePosition: 'left',
      examples: [
        {
          caseId: 'elemental-schools',
          name: 'Elemental Schools',
          quote:
            'Map the six schools of Aetherfall magic from first spark to realm-shaping practice.',
          designation: 'Magic system example',
          alt: 'Original four-row, six-column Elemental Schools table with Ember, Tide, Gale, Stone, Verdant, and Umbral columns and Spark, Channel, Weave, and Crown rows.',
        },
        {
          caseId: 'arcane-crystals',
          name: 'Arcane Crystals',
          quote:
            'Sort the crystals of the Lumen Coast by charge stage, source, practical use, and handling risk.',
          designation: 'Magic system example',
          alt: 'Original four-row, six-column Arcane Crystals table with Dawn, Frost, Storm, Root, Echo, and Void columns and Flicker, Steady, Bright, and Overload rows.',
        },
        {
          caseId: 'forbidden-elements',
          name: 'Forbidden Elements',
          quote:
            'Track sealed forces by breach level so a dark setting can show both temptation and consequence.',
          designation: 'Dark magic system example',
          alt: 'Original four-row, six-column Forbidden Elements table with Flesh, Memory, Space, Time, Hunger, and Silence columns and Trace, Breach, Calamity, and Null rows.',
        },
        {
          caseId: 'enchantment-gems',
          name: 'Enchantment Gems',
          quote:
            'Map original gems by enchantment family, crafting stage, spell use, and magical cost.',
          designation: 'Enchantment system example',
          alt: 'Original four-row, six-column Enchantment Gems table with Ward Stones, Memory Gems, Pulse Crystals, Veil Jewels, Frost Shards, and Dawn Pearls columns and Raw, Cut, Charged, and Bound rows.',
        },
      ],
    },
    {
      id: 'fantasy-and-alchemy',
      title: 'Fantasy materials and alchemy',
      description:
        'Group fictional metals, living materials, herbs, creature components, and reagents by family and stage for crafting notes, field guides, or setting references.',
      imagePosition: 'right',
      examples: [
        {
          caseId: 'forge-metals',
          name: 'Forge Metals',
          quote:
            'Sort original forge metals by stage, source, workshop use, and handling drawback.',
          designation: 'Fantasy materials example',
          alt: 'Original four-row, six-column Forge Metals table with Core Iron, Moon Alloy, Sun Brass, Void Steel, Glassmetal, and Runic Bronze columns and Ore, Ingot, Tempered, and Masterwork rows.',
        },
        {
          caseId: 'organic-materials',
          name: 'Organic Materials',
          quote:
            'Organize living materials by growth stage, habitat, crafting use, and care limitation.',
          designation: 'Fantasy materials example',
          alt: 'Original four-row, six-column Organic Materials table with Sinew Fibers, Spore Woods, Chitin Plates, Resin Sap, Scale Hides, and Root Vines columns and Seed, Grown, Treated, and Awakened rows.',
        },
        {
          caseId: 'forest-herbarium',
          name: 'Forest Herbarium',
          quote:
            "Sorts original forest herbs by harvest tier and plant family for a woodland apothecary's field guide.",
          designation: 'Alchemy field guide example',
          alt: 'Original four-row, six-column Forest Herbarium table with Moonleaf, Barkbloom, Sporecup, Thornvine, Sapfruit, and Mistmoss columns and Sprout, Grove, Canopy, and Elder rows.',
        },
        {
          caseId: 'creature-components',
          name: 'Creature Component Atlas',
          quote:
            "Maps original creature parts by preservation tier and source family for a monster hunter's crafting ledger.",
          designation: 'Monster crafting example',
          alt: 'Original four-row, six-column Creature Component Atlas with Scale Kin, Horn Kin, Mire Kin, Sky Kin, Burrow Kin, and Wisp Kin columns and Fresh, Cured, Stabilized, and Mythic rows.',
        },
        {
          caseId: 'alchemical-reagents',
          name: 'Alchemical Reagent Index',
          quote:
            "Groups original reagents by preparation stage and source family for a worldbuilder's laboratory index.",
          designation: 'Alchemy index example',
          alt: 'Original four-row, six-column Alchemical Reagent Index with Mineral, Botanical, Nocturnal, Ember, Aether, and Tidal columns and Raw, Distilled, Bound, and Catalytic rows.',
        },
      ],
    },
    {
      id: 'science-fiction',
      title: 'Science-fiction resources',
      description:
        'Compare fictional minerals, power media, and alloys across four stages so mining, engineering, trade, and habitat ideas stay easy to scan.',
      imagePosition: 'left',
      examples: [
        {
          caseId: 'stellar-minerals',
          name: 'Stellar Mineral Atlas',
          quote:
            'Classify six frontier mineral families by refinement stage for mining, crafting, and trade scenes.',
          designation: 'Science-fiction resource example',
          alt: 'Original four-row, six-column Stellar Mineral Atlas with Solar, Frost, Grav, Tide, Void, and Bloom columns and Vein, Cut, Charged, and Crown rows.',
        },
        {
          caseId: 'energy-media',
          name: 'Energy Media',
          quote:
            'Map six original power media across four charge stages for starship batteries, beacons, and habitats.',
          designation: 'Science-fiction resource example',
          alt: 'Original four-row, six-column Energy Media table with Thermal, Lumen, Pulse, Vector, Echo, and Vital columns and Spark, Stored, Linked, and Cascade rows.',
        },
        {
          caseId: 'engineering-alloys',
          name: 'Engineering Alloys',
          quote:
            'Compare six original alloy families by fabrication stage for hulls, tools, and habitat hardware.',
          designation: 'Science-fiction engineering example',
          alt: 'Original four-row, six-column Engineering Alloys table with Frame, Seal, Conduit, Lens, Flex, and Shield columns and Ore, Cast, Tuned, and Fielded rows.',
        },
      ],
    },
  ],
};

const chineseCaseStudiesCopy: PeriodicTableCaseStudiesCopy = {
  title: '看看元素周期表制作器可以做什么？',
  description:
    '从一张可编辑的 24 格表格开始，按自己的世界观修改符号、名称、来源、用途和成本。浏览这些原创的奇幻、炼金与科幻案例，找到适合自己设定的整理方式。',
  useCase: '使用此案例',
  downloadTemplate: '下载 TXT 模板',
  loadingCase: '正在加载案例…',
  caseLoaded: '已加载：{name}',
  previousLabel: '上一个案例',
  nextLabel: '下一个案例',
  groups: [
    {
      id: 'magic',
      title: '魔法体系',
      description:
        '用列来区分学派或力量，用行来表现修习、充能或封印破损程度。这些案例展示如何把虚构魔法整理成易读的设定速查表。',
      imagePosition: 'left',
      examples: [
        {
          caseId: 'elemental-schools',
          name: '元素学派表',
          quote: '把以太陨落的六个魔法学派按从初火到塑界阶段整理出来。',
          designation: '魔法体系案例',
          alt: '原创四行六列元素学派表，六列为 Ember、Tide、Gale、Stone、Verdant、Umbral，四行为 Spark、Channel、Weave、Crown。',
        },
        {
          caseId: 'arcane-crystals',
          name: '魔法晶体表',
          quote: '按充能阶段、来源、实际用途和操作风险整理辉岸的魔法晶体。',
          designation: '魔法体系案例',
          alt: '原创四行六列魔法晶体表，六列为 Dawn、Frost、Storm、Root、Echo、Void，四行为 Flicker、Steady、Bright、Overload。',
        },
        {
          caseId: 'forbidden-elements',
          name: '禁忌元素表',
          quote: '按封印破损程度整理黑暗设定中的力量、诱惑与代价。',
          designation: '暗黑魔法体系案例',
          alt: '原创四行六列禁忌元素表，六列为 Flesh、Memory、Space、Time、Hunger、Silence，四行为 Trace、Breach、Calamity、Null。',
        },
        {
          caseId: 'enchantment-gems',
          name: '附魔宝石表',
          quote: '按附魔家族、制作阶段、法术用途和魔法代价整理原创宝石。',
          designation: '附魔体系案例',
          alt: '原创四行六列附魔宝石表，六列为 Ward Stones、Memory Gems、Pulse Crystals、Veil Jewels、Frost Shards、Dawn Pearls，四行为 Raw、Cut、Charged、Bound。',
        },
      ],
    },
    {
      id: 'fantasy-and-alchemy',
      title: '奇幻材料与炼金',
      description:
        '把虚构金属、生物材料、草药、生物素材和试剂按家族与阶段分组，用于制作记录、野外图鉴或世界观索引。',
      imagePosition: 'right',
      examples: [
        {
          caseId: 'forge-metals',
          name: '锻造金属表',
          quote: '按阶段、来源、工坊用途和处理限制整理原创锻造金属。',
          designation: '奇幻材料案例',
          alt: '原创四行六列锻造金属表，六列为 Core Iron、Moon Alloy、Sun Brass、Void Steel、Glassmetal、Runic Bronze，四行为 Ore、Ingot、Tempered、Masterwork。',
        },
        {
          caseId: 'organic-materials',
          name: '生物材料表',
          quote: '按生长阶段、栖息地、制作用途和养护限制整理生物材料。',
          designation: '奇幻材料案例',
          alt: '原创四行六列生物材料表，六列为 Sinew Fibers、Spore Woods、Chitin Plates、Resin Sap、Scale Hides、Root Vines，四行为 Seed、Grown、Treated、Awakened。',
        },
        {
          caseId: 'forest-herbarium',
          name: '暮林草药表',
          quote: '按采集层级与植物家族整理原创森林草药，供林地炼金师制作野外图鉴。',
          designation: '炼金野外图鉴案例',
          alt: '原创四行六列暮林草药表，六列为 Moonleaf、Barkbloom、Sporecup、Thornvine、Sapfruit、Mistmoss，四行为 Sprout、Grove、Canopy、Elder。',
        },
        {
          caseId: 'creature-components',
          name: '荒野生物素材表',
          quote: '按保存层级与来源家族整理原创生物素材，供怪物猎人记录制作材料。',
          designation: '怪物制作材料案例',
          alt: '原创四行六列荒野生物素材表，六列为 Scale Kin、Horn Kin、Mire Kin、Sky Kin、Burrow Kin、Wisp Kin，四行为 Fresh、Cured、Stabilized、Mythic。',
        },
        {
          caseId: 'alchemical-reagents',
          name: '炼金试剂索引',
          quote: '按制备阶段与来源家族整理原创炼金试剂，供世界观实验室索引使用。',
          designation: '炼金索引案例',
          alt: '原创四行六列炼金试剂表，六列为 Mineral、Botanical、Nocturnal、Ember、Aether、Tidal，四行为 Raw、Distilled、Bound、Catalytic。',
        },
      ],
    },
    {
      id: 'science-fiction',
      title: '科幻资源',
      description:
        '将虚构矿物、能源介质和合金按四个阶段对照整理，让采矿、工程、贸易和栖居地设定更易查阅。',
      imagePosition: 'left',
      examples: [
        {
          caseId: 'stellar-minerals',
          name: '星际矿物表',
          quote: '按精炼阶段整理六类边境星际矿物，用于采矿、制造和贸易设定。',
          designation: '科幻资源案例',
          alt: '原创四行六列星际矿物表，六列为 Solar、Frost、Grav、Tide、Void、Bloom，四行为 Vein、Cut、Charged、Crown。',
        },
        {
          caseId: 'energy-media',
          name: '能源介质表',
          quote: '按四个充能阶段整理六类原创能源介质，用于星舰电池、信标和栖居地设定。',
          designation: '科幻资源案例',
          alt: '原创四行六列能源介质表，六列为 Thermal、Lumen、Pulse、Vector、Echo、Vital，四行为 Spark、Stored、Linked、Cascade。',
        },
        {
          caseId: 'engineering-alloys',
          name: '工程合金表',
          quote: '按制造阶段比较六类原创合金，用于船体、工具和栖居地设备设定。',
          designation: '科幻工程案例',
          alt: '原创四行六列工程合金表，六列为 Frame、Seal、Conduit、Lens、Flex、Shield，四行为 Ore、Cast、Tuned、Fielded。',
        },
      ],
    },
  ],
};

export function getPeriodicTableCaseStudiesCopy(
  locale: SiteLocale,
): PeriodicTableCaseStudiesCopy {
  if (locale === 'en') {
    return englishCaseStudiesCopy;
  }

  if (locale === 'zh') {
    return chineseCaseStudiesCopy;
  }

  throw new Error(
    `Unknown periodic table case studies locale. Received ${JSON.stringify(locale)}.`,
  );
}
