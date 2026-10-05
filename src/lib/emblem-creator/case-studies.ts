import type { CircularTestimonial } from '@/components/armor-creator/circular-testimonials';
import type { EmblemLocale } from './types';

export type EmblemCreatorCaseStudyGroupCopy = {
  readonly id: string;
  readonly carouselLabel: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly imagePosition: 'left' | 'right';
  readonly examples: readonly CircularTestimonial[];
};

export type EmblemCreatorCaseStudiesCopy = {
  readonly title: string;
  readonly description: string;
  readonly groups: readonly EmblemCreatorCaseStudyGroupCopy[];
};

const EMBLEM_CASE_IMAGE_PATHS = {
  adventurersGuild: '/emblem-creator/examples/01-adventurers-guild.png',
  knightOrder: '/emblem-creator/examples/02-knight-order.png',
  magesCouncil: '/emblem-creator/examples/03-mages-council.png',
  thievesGuild: '/emblem-creator/examples/04-thieves-guild.png',
  dragonHouse: '/emblem-creator/examples/05-dragon-house.png',
  forestWardens: '/emblem-creator/examples/06-forest-wardens.png',
  pirateAlliance: '/emblem-creator/examples/07-pirate-alliance.png',
  solarTemple: '/emblem-creator/examples/08-solar-temple.png',
  shadowCult: '/emblem-creator/examples/09-shadow-cult.png',
  recruit: '/emblem-creator/examples/10-rank-recruit.png',
  elite: '/emblem-creator/examples/11-rank-elite.png',
  commander: '/emblem-creator/examples/12-rank-commander.png',
} as const;

const englishCaseStudies: EmblemCreatorCaseStudiesCopy = {
  title: 'What can you create with Emblem Maker?',
  description:
    'One set of black-and-white assets, many worldbuilding marks. Explore 12 emblem concepts for guilds, factions, faiths, and ranks, each showing a different combination of catalog subjects, details, icons, and base shapes.',
  groups: [
    {
      id: 'guilds',
      carouselLabel: 'Guild and order emblem examples',
      previousLabel: 'Previous guild emblem example',
      nextLabel: 'Next guild emblem example',
      imagePosition: 'right',
      examples: [
        {
          name: "Adventurers' Guild",
          designation: 'Guild emblem concept',
          quote:
            "In Emblem Maker, combine the shield, crossed weapons, star, and branch detail to give an adventurers' guild a compact mark.",
          src: EMBLEM_CASE_IMAGE_PATHS.adventurersGuild,
          alt: 'White shield emblem with crossed black weapons, a small star above them, and a branch decoration along the lower edge.',
        },
        {
          name: 'Knight Order',
          designation: 'Order emblem concept',
          quote:
            'Set the shield behind an upright sword, crown, and branch in Emblem Maker to shape a formal badge for a knightly order.',
          src: EMBLEM_CASE_IMAGE_PATHS.knightOrder,
          alt: 'White shield emblem with a black crown above an upright sword and a branch decoration at the bottom.',
        },
        {
          name: "Mages' Council",
          designation: 'Council emblem concept',
          quote:
            'For a council seal, use Emblem Maker to layer a hexagonal field with two crescent-and-star motifs and an outlined diamond.',
          src: EMBLEM_CASE_IMAGE_PATHS.magesCouncil,
          alt: 'White hexagonal emblem with two crescent-and-star motifs and an outlined diamond.',
        },
        {
          name: "Thieves' Guild",
          designation: 'Guild emblem concept',
          quote:
            "Build a discreet thieves' guild sign by arranging the leaf-shaped field, crescent, star, key, and dagger in Emblem Maker.",
          src: EMBLEM_CASE_IMAGE_PATHS.thievesGuild,
          alt: 'White leaf-shaped emblem with a crescent and small star above a crossed key and dagger.',
        },
      ],
    },
    {
      id: 'factions',
      carouselLabel: 'Faction and faith emblem examples',
      previousLabel: 'Previous faction emblem example',
      nextLabel: 'Next faction emblem example',
      imagePosition: 'left',
      examples: [
        {
          name: 'Dragon House',
          designation: 'Family emblem concept',
          quote:
            'Frame a fanged serpentine beast head and two wings with a shield in Emblem Maker, then place the crown above the head.',
          src: EMBLEM_CASE_IMAGE_PATHS.dragonHouse,
          alt: 'White shield emblem with a crown above a fanged serpentine beast head and two wings.',
        },
        {
          name: 'Forest Wardens',
          designation: 'Warden emblem concept',
          quote:
            "Use Emblem Maker to combine a round field, a front-facing stag head with wide antlers, and two leaves into a woodland wardens' mark.",
          src: EMBLEM_CASE_IMAGE_PATHS.forestWardens,
          alt: 'White circular emblem with a front-facing stag head, wide antlers, and two black leaves near the bottom.',
        },
        {
          name: 'Pirate Alliance',
          designation: 'Alliance emblem concept',
          quote:
            'Use Emblem Maker to place a skull-topped anchor with curved arms inside the round field for a pirate alliance symbol.',
          src: EMBLEM_CASE_IMAGE_PATHS.pirateAlliance,
          alt: 'White circular emblem with a black anchor, curved arms, and a skull at the top.',
        },
        {
          name: 'Shadow Cult',
          designation: 'Cult emblem concept',
          quote:
            'In Emblem Maker, put a horned beast head above a black flame inside an inverted-triangle field to establish a stark shadow-cult sign.',
          src: EMBLEM_CASE_IMAGE_PATHS.shadowCult,
          alt: 'White inverted-triangle emblem with a horned beast head above a black flame.',
        },
      ],
    },
    {
      id: 'faith-and-ranks',
      carouselLabel: 'Temple and rank insignia examples',
      previousLabel: 'Previous temple or rank example',
      nextLabel: 'Next temple or rank example',
      imagePosition: 'right',
      examples: [
        {
          name: 'Solar Temple',
          designation: 'Faith emblem concept',
          quote:
            'A many-rayed sun and small torch can be layered inside a pointed field in Emblem Maker for a ceremonial temple emblem.',
          src: EMBLEM_CASE_IMAGE_PATHS.solarTemple,
          alt: 'White pointed emblem with a many-rayed black sun and a small torch beneath it.',
        },
        {
          name: 'Recruit',
          designation: 'Entry rank insignia',
          quote:
            'Start the rank set in Emblem Maker with a tall shield, centered sword, and single-layer lower chevron for a recruit insignia.',
          src: EMBLEM_CASE_IMAGE_PATHS.recruit,
          alt: 'Tall white shield insignia with a centered black sword and a single chevron near the lower point.',
        },
        {
          name: 'Elite',
          designation: 'Elite rank insignia',
          quote:
            'Add a star above the sword and double lower bands in Emblem Maker to turn the same tall shield into an elite rank insignia.',
          src: EMBLEM_CASE_IMAGE_PATHS.elite,
          alt: 'Tall white shield insignia with a centered black sword, a star above it, and double bands near the lower point.',
        },
        {
          name: 'Commander',
          designation: 'Command rank insignia',
          quote:
            "In Emblem Maker, place a crown above the centered sword, with layered bands and a branch decoration along the shield's lower edge, to complete the commander insignia.",
          src: EMBLEM_CASE_IMAGE_PATHS.commander,
          alt: 'Tall white shield insignia with a crown above a centered sword, layered bands below it, and a branch decoration along the bottom.',
        },
      ],
    },
  ],
};

const chineseCaseStudies: EmblemCreatorCaseStudiesCopy = {
  title: '用徽章制作器可以做出什么？',
  description:
    '一套黑白素材，可以组合出不同的世界观标识。下面 12 个徽标概念覆盖公会、阵营、信仰与等级，每个案例展示不同的主体、细节、图标和底形组合。',
  groups: [
    {
      id: 'guilds',
      carouselLabel: '公会与组织徽标案例轮播',
      previousLabel: '上一个公会徽标案例',
      nextLabel: '下一个公会徽标案例',
      imagePosition: 'right',
      examples: [
        {
          name: '冒险者公会',
          designation: '公会徽标概念',
          quote: '在徽章制作器中组合盾形底、交叉武器、小星形图标与枝叶细节，为冒险者公会做出紧凑的组织标识。',
          src: EMBLEM_CASE_IMAGE_PATHS.adventurersGuild,
          alt: '白色盾形徽标中央有交叉的黑色武器、上方有小星形图标，底部带枝叶装饰。',
        },
        {
          name: '骑士团',
          designation: '骑士团徽标概念',
          quote: '在徽章制作器中把盾形底、竖直长剑、王冠和枝叶装饰组合成正式的骑士团徽标。',
          src: EMBLEM_CASE_IMAGE_PATHS.knightOrder,
          alt: '白色盾形徽标中有竖直黑色长剑，长剑上方有黑色王冠，底部带枝叶装饰。',
        },
        {
          name: '法师议会',
          designation: '议会徽标概念',
          quote: '用六边形底形承载两组弯月与星形元素，再在徽章制作器中加入线框菱形，做出奥术议会标识。',
          src: EMBLEM_CASE_IMAGE_PATHS.magesCouncil,
          alt: '白色六边形徽标中有两组弯月与星形元素，底部有线框菱形。',
        },
        {
          name: '盗贼公会',
          designation: '公会徽标概念',
          quote: '在徽章制作器里排列叶片形底形、弯月、小星形图标、钥匙和匕首，做出低调的盗贼公会标识。',
          src: EMBLEM_CASE_IMAGE_PATHS.thievesGuild,
          alt: '白色叶片形徽标中，弯月和小星形图标位于交叉的钥匙与匕首上方。',
        },
      ],
    },
    {
      id: 'factions',
      carouselLabel: '阵营与信仰徽标案例轮播',
      previousLabel: '上一个阵营徽标案例',
      nextLabel: '下一个阵营徽标案例',
      imagePosition: 'left',
      examples: [
        {
          name: '巨龙家族',
          designation: '家族徽标概念',
          quote: '在徽章制作器中，用盾形底框住带獠牙的蛇形兽首和双翼，再把王冠放在兽首上方，做出巨龙家族徽标。',
          src: EMBLEM_CASE_IMAGE_PATHS.dragonHouse,
          alt: '白色盾形徽标中有带獠牙的蛇形兽首和双翼，兽首上方有王冠。',
        },
        {
          name: '森林守卫',
          designation: '守卫徽标概念',
          quote: '将圆形底形、正面鹿头、宽大鹿角和两片叶子放进徽章制作器，做出森林守卫的平衡标识。',
          src: EMBLEM_CASE_IMAGE_PATHS.forestWardens,
          alt: '白色圆形徽标中有正面的鹿头和宽大的鹿角，底部两侧有黑色叶片。',
        },
        {
          name: '海盗联盟',
          designation: '联盟徽标概念',
          quote: '在徽章制作器里把顶部骷髅、弧形锚臂和船锚置于圆形底形中，做出海盗联盟标识。',
          src: EMBLEM_CASE_IMAGE_PATHS.pirateAlliance,
          alt: '白色圆形徽标中有黑色船锚、弧形锚臂和顶部骷髅。',
        },
        {
          name: '暗影教团',
          designation: '教团徽标概念',
          quote: '在徽章制作器中将带角兽首放在黑色火焰上方，并置于倒三角底形内，做出冷峻的暗影教团符号。',
          src: EMBLEM_CASE_IMAGE_PATHS.shadowCult,
          alt: '白色倒三角徽标中，带角兽首位于黑色火焰上方。',
        },
      ],
    },
    {
      id: 'faith-and-ranks',
      carouselLabel: '神殿与等级徽记案例轮播',
      previousLabel: '上一个神殿或等级案例',
      nextLabel: '下一个神殿或等级案例',
      imagePosition: 'right',
      examples: [
        {
          name: '太阳神殿',
          designation: '信仰徽标概念',
          quote: '用徽章制作器把多重放射的太阳与小火炬叠入尖角底形，组合出太阳神殿的仪式徽标。',
          src: EMBLEM_CASE_IMAGE_PATHS.solarTemple,
          alt: '白色尖角徽标中有多重放射的黑色太阳，下方有一支小火炬。',
        },
        {
          name: '新兵',
          designation: '入门等级徽记',
          quote: '用高身盾形底、居中的长剑和底部单层折线在徽章制作器中做出新兵等级徽记。',
          src: EMBLEM_CASE_IMAGE_PATHS.recruit,
          alt: '高身白色盾形徽记中有居中的黑色长剑，底部附近有单层折线细节。',
        },
        {
          name: '精英',
          designation: '精英等级徽记',
          quote: '在徽章制作器里为同样的高身盾形与长剑增加上方星形图标和底部双层带状细节，做出精英等级徽记。',
          src: EMBLEM_CASE_IMAGE_PATHS.elite,
          alt: '高身白色盾形徽记中有居中的黑色长剑、上方星形图标，底部附近有双层带状细节。',
        },
        {
          name: '统领',
          designation: '统领等级徽记',
          quote: '在徽章制作器中组合王冠、居中的长剑、底部多层带状细节与枝叶装饰，做出层次丰富的统领等级徽记。',
          src: EMBLEM_CASE_IMAGE_PATHS.commander,
          alt: '高身白色盾形徽记中有王冠、居中的长剑、底部多层带状细节和枝叶装饰。',
        },
      ],
    },
  ],
};

export function getEmblemCreatorCaseStudies(locale: EmblemLocale): EmblemCreatorCaseStudiesCopy {
  if (locale === 'en') return englishCaseStudies;
  if (locale === 'zh') return chineseCaseStudies;
  throw new Error(`Unknown emblem creator case studies locale: ${JSON.stringify(locale)}.`);
}
