import type { SiteLocale } from '@/lib/site-locale';

export type ConstellationShowcaseCase = {
  readonly title: string;
  readonly audience: string;
  readonly description: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
};

export type ConstellationShowcaseGroup = {
  readonly id: string;
  readonly title: string;
  readonly cases: readonly ConstellationShowcaseCase[];
};

export type ConstellationShowcaseCopy = {
  readonly title: string;
  readonly description: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly imageActionLabel: string;
  readonly closeImageLabel: string;
  readonly groups: readonly ConstellationShowcaseGroup[];
};

const CASE_IMAGE_PATHS = {
  northboundHomecoming: '/constellation-map-creator/showcase/northbound-homecoming.webp',
  stargateKey: '/constellation-map-creator/showcase/stargate-key.webp',
  starDruid: '/constellation-map-creator/showcase/star-druid.webp',
  dragonCrownOmen: '/constellation-map-creator/showcase/dragon-crown-omen.webp',
  twinFates: '/constellation-map-creator/showcase/twin-fates.webp',
  phoenixReborn: '/constellation-map-creator/showcase/phoenix-reborn.webp',
  forestNightSky: '/constellation-map-creator/showcase/forest-night-sky.webp',
  threeSigilStarPuzzle: '/constellation-map-creator/showcase/three-sigil-star-puzzle.webp',
  magesAstralArchive: '/constellation-map-creator/showcase/mages-astral-archive.webp',
  fourSeasonsOfStars: '/constellation-map-creator/showcase/four-seasons-of-stars.webp',
  seafarersSky: '/constellation-map-creator/showcase/seafarers-sky.webp',
  templeFirmament: '/constellation-map-creator/showcase/temple-firmament.webp',
} as const;

const englishConstellationShowcaseCopy: ConstellationShowcaseCopy = {
  title: 'Constellation map examples',
  description:
    'Browse 12 constellation map examples showing how star points, lines, and constellation motifs can support campaign clues, novel settings, game art, and fantasy worldbuilding.',
  previousLabel: 'Previous case',
  nextLabel: 'Next case',
  imageActionLabel: 'View full image',
  closeImageLabel: 'Close image',
  groups: [
    {
      id: 'campaign-and-omens',
      title: 'Campaigns & Omens',
      cases: [
        {
          title: 'Northbound Homecoming',
          audience: 'D&D GM · Wilderness navigation',
          description:
            'A compass, mountain, ship, and anchor mark a diagonal route home while sparse stars act as waypoints. Use the Constellation Map Creator to arrange this route as a visual aid for wilderness navigation scenes, getting-lost recovery, return checks, and clues to a safe harbor.',
          imageSrc: CASE_IMAGE_PATHS.northboundHomecoming,
          imageAlt:
            'Deep blue star map with a compass, mountain, ship, and anchor arranged along a diagonal route home, surrounded by sparse waypoint stars.',
        },
        {
          title: 'Stargate Key',
          audience: 'D&D GM · Ruin puzzle',
          description:
            'A star chain hints at the sequence, the central gate anchors the puzzle, and the lower-right key points to the solution along a traceable arc. In the Constellation Map Creator, arrange these elements for a ruin mechanism or observation clue.',
          imageSrc: CASE_IMAGE_PATHS.stargateKey,
          imageAlt:
            'Purple-black star map with a star chain leading to a central gate, a key in the lower right, and an arcing puzzle path.',
        },
        {
          title: 'Star Druid',
          audience: 'D&D GM · Character star map',
          description:
            'Dragon, Archer, and Chalice form a triangular star map for a character myth, a source of omens, and visible clues that can frame a difficult choice at the table. The Constellation Map Creator helps you place these motifs as a readable character star map.',
          imageSrc: CASE_IMAGE_PATHS.starDruid,
          imageAlt:
            'Deep blue star map with Dragon, Archer, and Chalice motifs arranged as a triangle among connected star points.',
        },
        {
          title: 'Dragon Crown Omen',
          audience: 'Novel writer · Dynastic fate',
          description:
            'Dragon and Crown face each other across the sky while a dark eclipse-like cluster weighs down the center. Use the Constellation Map Creator to arrange the composition for succession conflict, dynastic decline, and recurring celestial omens.',
          imageSrc: CASE_IMAGE_PATHS.dragonCrownOmen,
          imageAlt:
            'Purple-red star map with Dragon and Crown at opposite sides and a dark eclipse-like star cluster below the central axis.',
        },
      ],
    },
    {
      id: 'stories-and-games',
      title: 'Stories & Games',
      cases: [
        {
          title: 'Twin Fates',
          audience: 'Novelists',
          description:
            'Twins and Scales hold a symmetrical tension around the Crescent, with open space between the background stars. Arrange the composition in the Constellation Map Creator as a character prophecy, a divided inheritance, or a choice that binds two lives.',
          imageSrc: CASE_IMAGE_PATHS.twinFates,
          imageAlt:
            'Indigo star map with Twins and Scales balanced around a Crescent, framed by arcing stars and generous open space.',
        },
        {
          title: 'Phoenix Reborn',
          audience: 'Novelists',
          description:
            'Flame, Phoenix, and Star Arc gather upward from the low field into a clear resurrection motion. Use the Constellation Map Creator to sketch a rebirth legend, a returned hero, or a cycle that begins again after ruin.',
          imageSrc: CASE_IMAGE_PATHS.phoenixReborn,
          imageAlt:
            'Deep purple star map with Flame at lower left, Phoenix above center, and a Star Arc rising from the bottom toward the upper right.',
        },
        {
          title: 'Forest Night Sky',
          audience: 'Game developers',
          description:
            'Scattered stars accompany Stag, Owl, and Tree as woodland cues. Build this scene in the Constellation Map Creator as two-dimensional sky art direction for a forest region, map screen, or quiet exploration zone.',
          imageSrc: CASE_IMAGE_PATHS.forestNightSky,
          imageAlt:
            'Deep teal star map where scattered stars accompany Stag, Owl, and Tree as woodland cues.',
        },
        {
          title: 'Three-Sigil Star Puzzle',
          audience: 'Game developers and puzzle designers',
          description:
            'The same Key appears left to right as star points, connecting lines, and a complete motif. In the Constellation Map Creator, compare the three stages as a visual draft for a puzzle reveal, keeping stage notes outside the artwork.',
          imageSrc: CASE_IMAGE_PATHS.threeSigilStarPuzzle,
          imageAlt:
            'Deep navy star map showing the same Key from left to right as star points, connecting lines, and a complete motif.',
        },
      ],
    },
    {
      id: 'cultures-and-worlds',
      title: 'Cultures & Worldbuilding',
      cases: [
        {
          title: "Mage's Astral Archive",
          audience: 'Game developers: character codex and mage-class art direction',
          description:
            'A mage stands on the left, with a spellbook at upper right and an orbiting constellation at lower right. Arrange the mage, spellbook, and constellation in the Constellation Map Creator as two-dimensional art direction for a character codex, skill page, or worldbuilding screen.',
          imageSrc: CASE_IMAGE_PATHS.magesAstralArchive,
          imageAlt:
            'Horizontal deep-blue star map with a mage on the left, a spellbook at upper right, and an orbiting constellation at lower right, arranged like a character archive.',
        },
        {
          title: 'Four Seasons of Stars',
          audience: 'Worldbuilders: fantasy calendars and seasonal myths',
          description:
            'Planter, Leaf, Reaper, and Crescent occupy four seasonal zones around a quiet central ring. Use the Constellation Map Creator to plan the layout as a reference for a fantasy calendar, festival cycle, or seasonal myth.',
          imageSrc: CASE_IMAGE_PATHS.fourSeasonsOfStars,
          imageAlt:
            'Deep blue star map with Planter, Leaf, Reaper, and Crescent placed in four seasonal zones around a central star ring.',
        },
        {
          title: "Seafarers' Sky",
          audience: 'Worldbuilders: maritime cultures and celestial navigation',
          description:
            'Ship, Whale, Anchor, and Compass follow a horizontal voyage while the central sea remains open. Arrange the voyage in the Constellation Map Creator to show how a maritime culture remembers routes, waypoints, and safe harbors by the stars.',
          imageSrc: CASE_IMAGE_PATHS.seafarersSky,
          imageAlt:
            'Wide deep-blue star map with Ship, Whale, Anchor, and Compass along a sea route, leaving an open central field of stars.',
        },
        {
          title: 'Temple Firmament',
          audience: 'Worldbuilders: sacred rituals and temple murals',
          description:
            'Orbit and Sun form a central sacred emblem while Chalice and Guardian radiate inward from both sides. Use the Constellation Map Creator to draft the composition for a temple dome, ritual mural, or belief system.',
          imageSrc: CASE_IMAGE_PATHS.templeFirmament,
          imageAlt:
            'Deep purple star map with Orbit and Sun forming a central emblem while Chalice and Guardian radiate inward from both sides.',
        },
      ],
    },
  ],
};

const chineseConstellationShowcaseCopy: ConstellationShowcaseCopy = {
  title: '星座地图案例',
  description:
    '查看 12 张由星点、连线和星座图案构成的案例，了解它们如何服务于跑团线索、小说设定、游戏美术和幻想世界观。',
  previousLabel: '上一个案例',
  nextLabel: '下一个案例',
  imageActionLabel: '查看大图',
  closeImageLabel: '关闭大图',
  groups: [
    {
      id: 'campaign-and-omens',
      title: '战役与预兆',
      cases: [
        {
          title: '北境归航',
          audience: 'D&D 主持人 · 野外导航',
          description:
            '罗盘、山峰、航船和锚沿对角线组成归航路线，稀疏星点充当航标；可用星座地图创建器安排这条路线，适合主持人设计迷路恢复、返程判断和安全港线索。',
          imageSrc: CASE_IMAGE_PATHS.northboundHomecoming,
          imageAlt: '深蓝星空中，罗盘、山峰、航船和锚沿对角线排成归航路线，稀疏星点分布在路线周围。',
        },
        {
          title: '星门密钥',
          audience: 'D&D 主持人 · 遗迹谜题',
          description:
            '左侧星链提示顺序，中央星门锁定谜题焦点，右下钥匙指向最终解法；在星座地图创建器中摆放这些元素，适合遗迹机关、观察顺序和玩家逐步追踪的解谜线索。',
          imageSrc: CASE_IMAGE_PATHS.stargateKey,
          imageAlt: '紫黑星空中，左侧星链通向中央星门，右下钥匙和弧形星点组成解谜路径。',
        },
        {
          title: '星辰德鲁伊',
          audience: 'D&D 主持人 · 角色星图',
          description:
            'Dragon、Archer 与 Chalice 三个星徽构成三角星图，可在星座地图创建器里组合成承载角色神话、法术来源与预兆的星图，并为桌面抉择提供可见的天空线索。',
          imageSrc: CASE_IMAGE_PATHS.starDruid,
          imageAlt: '深蓝星空中，龙、弓箭手和圣杯三个星徽以三角构图分布，周围点缀连接星点。',
        },
        {
          title: '龙冠预兆',
          audience: '小说作者 · 王朝命运',
          description:
            '巨龙与王冠分居两端，日蚀般的星群压在中轴下方；可用星座地图创建器安排这组构图，适合表现王朝兴衰、继承冲突和贯穿故事的天象预兆。',
          imageSrc: CASE_IMAGE_PATHS.dragonCrownOmen,
          imageAlt: '紫红星空中，巨龙与王冠分列两侧，中轴下方聚集日蚀般的暗色星群。',
        },
      ],
    },
    {
      id: 'stories-and-games',
      title: '故事与游戏',
      cases: [
        {
          title: '双子命运',
          audience: '小说作者',
          description:
            '双子和天平围绕新月形成对称张力，背景星点之间保留开阔留白；可在星座地图创建器中安排这组构图，用于表现人物预言、分裂的继承关系或牵动两条命运的抉择。',
          imageSrc: CASE_IMAGE_PATHS.twinFates,
          imageAlt: '靛蓝星空中，双子与天平在新月两侧形成对称构图，弧形星点和留白延伸到四周。',
        },
        {
          title: '凤凰重生',
          audience: '小说作者',
          description:
            '火焰、凤凰与弧形星群从低处向上汇聚，形成明确的复生动势；用星座地图创建器整理这组构图，适合承载重生传说、归来的主角或毁灭后重新开始的循环。',
          imageSrc: CASE_IMAGE_PATHS.phoenixReborn,
          imageAlt: '深紫星空中，火焰位于左下，凤凰居中上方，弧形星群从底部向右上方升起。',
        },
        {
          title: '密林夜空',
          audience: '游戏开发者',
          description:
            '散布的星点搭配鹿、猫头鹰和树作为林地提示；可在星座地图创建器中制作这组构图，作为游戏森林区域、地图界面或安静探索场景的二维天空美术参考。',
          imageSrc: CASE_IMAGE_PATHS.forestNightSky,
          imageAlt: '深青星空中，散布的星点搭配鹿、猫头鹰和树作为林地提示，形成林地天空构图。',
        },
        {
          title: '三印星阵',
          audience: '游戏开发者与谜题设计者',
          description:
            '同一把钥匙按左至右展示星点、连线和完整图案三阶段；在星座地图创建器中安排这三种版本，适合做谜题揭示流程的美术草案，阶段说明放在图外，图内不写字。',
          imageSrc: CASE_IMAGE_PATHS.threeSigilStarPuzzle,
          imageAlt: '深蓝星空中，同一把钥匙以星点、连线和完整图案三种版本从左至右并列展示。',
        },
      ],
    },
    {
      id: 'cultures-and-worlds',
      title: '文明与世界观',
      cases: [
        {
          title: '法师星图档案',
          audience: '游戏开发者：角色图鉴与法师职业美术',
          description:
            '法师位于左侧，魔法书在右上方，轨道星座落在右下方，可用星座地图创建器安排横向档案构图，作为角色图鉴、技能说明或世界观页面的夜空美术参考。',
          imageSrc: CASE_IMAGE_PATHS.magesAstralArchive,
          imageAlt: '深蓝横向星图中，法师位于左侧，魔法书在右上方，轨道星座在右下方，整体形成档案式构图。',
        },
        {
          title: '四季星环',
          audience: '世界观创作者：幻想历法与季节神话',
          description:
            '播种者、叶、收割者和新月分置四个季节区域，围绕中央星环排列；用星座地图创建器规划这组构图，适合设计幻想历法、节庆周期和随季节变化的神话。',
          imageSrc: CASE_IMAGE_PATHS.fourSeasonsOfStars,
          imageAlt: '深蓝星空中，播种者、叶、收割者和新月分置四个季节区域，围绕中央星环排列。',
        },
        {
          title: '海民天图',
          audience: '世界观创作者：航海文化与星象导航',
          description:
            '船、鲸、锚与罗盘沿横向航程排列，中央海域保留开阔星空；在星座地图创建器中安排这条航程，适合表现海民如何用星象记忆路线、航标和安全港。',
          imageSrc: CASE_IMAGE_PATHS.seafarersSky,
          imageAlt: '深蓝横向星图中，船、鲸、锚和罗盘沿海上航程排列，中央海域留有开阔星空。',
        },
        {
          title: '神殿穹顶',
          audience: '世界观创作者：信仰仪式与神殿壁画',
          description:
            '轨道与太阳组成中央圣徽，圣杯和守护者从两侧向中心放射；可用星座地图创建器绘制这组构图，作为神殿穹顶、祭礼壁画或虚构信仰体系的视觉草图。',
          imageSrc: CASE_IMAGE_PATHS.templeFirmament,
          imageAlt: '深紫星空中，轨道与太阳组成中央圣徽，圣杯和守护者从两侧向中心放射。',
        },
      ],
    },
  ],
};

export function getConstellationShowcaseCopy(locale: SiteLocale): ConstellationShowcaseCopy {
  if (locale === 'en') return englishConstellationShowcaseCopy;
  if (locale === 'zh') return chineseConstellationShowcaseCopy;

  throw new Error(`Constellation showcase copy locale must be en or zh. Received ${String(locale)}.`);
}
