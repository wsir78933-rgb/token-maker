import type { SiteLocale } from '@/lib/site-locale';

export type HomeShowcaseTone = 'gold' | 'grave' | 'ember' | 'violet' | 'ice' | 'steel';

export interface HomeShowcaseItem {
  id: string;
  imageSrc: string;
  presetId: string;
  title: string;
  description: string;
  alt: string;
  tags: string[];
  tone: HomeShowcaseTone;
}

export interface HomeShowcaseModel {
  quickStart: HomeShowcaseItem[];
  gallery: HomeShowcaseItem[];
}

const showcaseByLocale: Record<SiteLocale, HomeShowcaseModel> = {
  zh: {
    quickStart: [
      {
        id: 'radiant-paladin',
        imageSrc: '/showcase/radiant-paladin-circle.png',
        presetId: 'cleric',
        title: '圣辉骑士',
        description: '金色圆环和正中构图，适合主角头像与阵营核心角色。',
        alt: '金色圆环的圣骑士 token 成品示例',
        tags: ['主角向', '金环', '角色头像'],
        tone: 'gold',
      },
      {
        id: 'moon-archmage',
        imageSrc: '/showcase/moon-archmage-gold.png',
        presetId: 'mage',
        title: '月下法师',
        description: '冷蓝法术和月夜背景，适合高辨识度的法系角色。',
        alt: '月夜蓝色法术风格的法师 token 成品示例',
        tags: ['法系', '冷蓝', '月夜'],
        tone: 'violet',
      },
      {
        id: 'grave-necromancer',
        imageSrc: '/showcase/grave-necromancer-silver.png',
        presetId: 'undead',
        title: '墓域亡语者',
        description: '银刺边框和幽绿色烟雾，更适合亡灵首领与危险敌人。',
        alt: '银色尖刺边框的亡灵法师 token 成品示例',
        tags: ['亡灵', '银刺', '敌人单位'],
        tone: 'grave',
      },
    ],
    gallery: [
      {
        id: 'inferno-drake',
        imageSrc: '/showcase/inferno-drake-fire.png',
        presetId: 'monster',
        title: '炼狱龙先锋',
        description: '高温火焰边框和压近构图，适合怪物首领、精英单位和需要第一眼就有威压感的遭遇战入口。',
        alt: '火焰边框的红龙战士 token 成品示例',
        tags: ['怪物包', '火焰边框', '首领战'],
        tone: 'ember',
      },
      {
        id: 'dusk-rogue',
        imageSrc: '/showcase/dusk-rogue-ring.png',
        presetId: 'rogue',
        title: '暮城潜行者',
        description: '深色外环和贴脸构图，适合盗贼、刺客、侦查角色与城市场景 NPC。',
        alt: '深红外环的盗贼角色 token 成品示例',
        tags: ['潜行', '近景', '城市角色'],
        tone: 'steel',
      },
      {
        id: 'void-sorceress',
        imageSrc: '/showcase/void-sorceress-frame.png',
        presetId: 'mage',
        title: '虚空召法者',
        description: '紫黑能量和厚重圆框更适合法术核心、稀有敌人和高戏剧性的施法角色。',
        alt: '紫色虚空法术风格的女性法师 token 成品示例',
        tags: ['施法者', '紫黑能量', '稀有单位'],
        tone: 'violet',
      },
      {
        id: 'frost-ranger',
        imageSrc: '/showcase/frost-ranger-ice.png',
        presetId: 'ranger',
        title: '霜环游侠',
        description: '冰晶边框和偏冷森林背景，适合游侠、精灵、北境角色和偏自然系的队伍成员。',
        alt: '冰晶边框的精灵游侠 token 成品示例',
        tags: ['游侠', '冰晶', '精灵角色'],
        tone: 'ice',
      },
      {
        id: 'scale-brute',
        imageSrc: '/showcase/scale-brute-silver.png',
        presetId: 'warrior',
        title: '鳞甲战斗者',
        description: '银色尖环和强轮廓主体，适合兽人、蜥蜴人、近战怪与高识别度的前排单位。',
        alt: '银色尖刺边框的蜥蜴战士 token 成品示例',
        tags: ['近战', '强轮廓', '前排单位'],
        tone: 'steel',
      },
    ],
  },
  en: {
    quickStart: [
      {
        id: 'radiant-paladin',
        imageSrc: '/showcase/radiant-paladin-circle.png',
        presetId: 'cleric',
        title: 'Radiant Paladin',
        description: 'A gold ring and centered crop for hero portraits and faction anchors.',
        alt: 'Finished paladin token with a radiant gold ring border',
        tags: ['Hero', 'Gold ring', 'Portrait'],
        tone: 'gold',
      },
      {
        id: 'moon-archmage',
        imageSrc: '/showcase/moon-archmage-gold.png',
        presetId: 'mage',
        title: 'Moonlit Archmage',
        description: 'Cold blue magic and a moonlit backdrop for high-readability casters.',
        alt: 'Finished archmage token with moonlit blue magic effects',
        tags: ['Caster', 'Blue magic', 'Night scene'],
        tone: 'violet',
      },
      {
        id: 'grave-necromancer',
        imageSrc: '/showcase/grave-necromancer-silver.png',
        presetId: 'undead',
        title: 'Grave Necromancer',
        description: 'Silver spikes and sickly green haze for undead bosses and cursed enemies.',
        alt: 'Finished necromancer token with silver spiked frame',
        tags: ['Undead', 'Spikes', 'Enemy unit'],
        tone: 'grave',
      },
    ],
    gallery: [
      {
        id: 'inferno-drake',
        imageSrc: '/showcase/inferno-drake-fire.png',
        presetId: 'monster',
        title: 'Inferno Drake',
        description: 'An aggressive fire frame and close crop for monster bosses, elite enemies, and encounter openers that need instant threat.',
        alt: 'Finished dragon token with a fiery circular border',
        tags: ['Monster pack', 'Fire frame', 'Boss encounter'],
        tone: 'ember',
      },
      {
        id: 'dusk-rogue',
        imageSrc: '/showcase/dusk-rogue-ring.png',
        presetId: 'rogue',
        title: 'Dusk Rogue',
        description: 'A dark outer ring and face-first crop for rogues, assassins, scouts, and city NPCs.',
        alt: 'Finished rogue token with a dark red ring border',
        tags: ['Stealth', 'Close crop', 'City cast'],
        tone: 'steel',
      },
      {
        id: 'void-sorceress',
        imageSrc: '/showcase/void-sorceress-frame.png',
        presetId: 'mage',
        title: 'Void Sorceress',
        description: 'Purple-black energy and a heavier frame for dramatic spellcasters, rare enemies, and high-magic table moments.',
        alt: 'Finished sorceress token with purple arcane energy',
        tags: ['Spellcaster', 'Void glow', 'Rare unit'],
        tone: 'violet',
      },
      {
        id: 'frost-ranger',
        imageSrc: '/showcase/frost-ranger-ice.png',
        presetId: 'ranger',
        title: 'Frost Ranger',
        description: 'A crystalline ice frame for rangers, elves, frontier characters, and colder wilderness parties.',
        alt: 'Finished ranger token with an icy crystal border',
        tags: ['Ranger', 'Ice frame', 'Elf portrait'],
        tone: 'ice',
      },
      {
        id: 'scale-brute',
        imageSrc: '/showcase/scale-brute-silver.png',
        presetId: 'warrior',
        title: 'Scale Vanguard',
        description: 'A silver spike silhouette for lizardfolk, bruisers, frontliners, and any unit that needs a bold combat read.',
        alt: 'Finished reptile warrior token with a silver spiked ring',
        tags: ['Melee', 'Bold silhouette', 'Frontline'],
        tone: 'steel',
      },
    ],
  },
};

export function getHomeShowcase(locale: SiteLocale) {
  return showcaseByLocale[locale];
}
