import type { CircularTestimonial } from '@/components/armor-creator/circular-testimonials';
import type { SiteLocale } from '@/lib/site-locale';

export type FamilyTreeCaseStudyGroupCopy = {
  readonly id: string;
  readonly imagePosition: 'left' | 'right';
  readonly carouselLabel: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly examples: readonly CircularTestimonial[];
};

export type FamilyTreeCaseStudiesCopy = {
  readonly title: string;
  readonly description: string;
  readonly groups: readonly FamilyTreeCaseStudyGroupCopy[];
};

const FAMILY_TREE_CASE_IMAGE_PATHS = {
  royalSuccession: '/family-tree/cases/01-royal-succession.png',
  familyAlliance: '/family-tree/cases/02-family-alliance.png',
  missingHeir: '/family-tree/cases/03-missing-heir.png',
  merchantFamily: '/family-tree/cases/04-merchant-family.png',
  elvenLineage: '/family-tree/cases/05-elven-lineage.png',
  dwarvenClan: '/family-tree/cases/06-dwarven-clan.png',
  halfElfAncestry: '/family-tree/cases/07-half-elf-ancestry.png',
  orcFamily: '/family-tree/cases/08-orc-family.png',
  adventurerBackground: '/family-tree/cases/09-adventurer-background.png',
  villageNpcFamilies: '/family-tree/cases/10-village-npc-families.png',
  adoptiveFamily: '/family-tree/cases/11-adoptive-family.png',
  warlockBloodline: '/family-tree/cases/12-warlock-bloodline.png',
} as const;

const englishFamilyTreeCaseStudies: FamilyTreeCaseStudiesCopy = {
  title: 'Family tree examples for stories, worlds, and campaigns',
  description:
    'Explore 12 original family tree examples built with Fantasy Family Tree Maker for novel planning, worldbuilding lineages, and TRPG character backgrounds. Each case uses portraits, names, four generations, and author-chosen connections to show a different relationship pattern.',
  groups: [
    {
      id: 'novel-families',
      imagePosition: 'right',
      carouselLabel: 'Novel family tree examples',
      previousLabel: 'Previous novel family example',
      nextLabel: 'Next novel family example',
      examples: [
        {
          name: 'Royal Succession',
          designation: 'Novel family tree · succession',
          quote:
            'With Fantasy Family Tree Maker, a founding royal couple branches into a crown household and a river line, with outside partners keeping the succession readable across four generations.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.royalSuccession,
          alt: 'Four-generation royal family tree with a founding couple, a crown branch, a river branch, and young heirs.',
        },
        {
          name: 'Family Alliance',
          designation: 'Novel family tree · alliance',
          quote:
            'Two houses meet through a marriage line, then continue into a shared next generation; Fantasy Family Tree Maker keeps the two origins visible with separate bars.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.familyAlliance,
          alt: 'Family tree showing two houses joining through a central marriage line before continuing into a shared branch.',
        },
        {
          name: 'Missing Heir',
          designation: 'Novel family tree · mystery',
          quote:
            'In this Fantasy Family Tree Maker example, a central line narrows toward an uncertain heir through a small number of dashed endpoints chosen by the author.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.missingHeir,
          alt: 'Family tree with a central succession line, an uncertain heir branch, and a small dashed connection break.',
        },
        {
          name: 'Merchant Family',
          designation: 'Novel family tree · trade dynasty',
          quote:
            'Arrange a merchant family in Fantasy Family Tree Maker with city and caravan branches, then keep both routes visible through later generations.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.merchantFamily,
          alt: 'Merchant family tree splitting from one founding couple into city and caravan branches.',
        },
      ],
    },
    {
      id: 'worldbuilding-lineages',
      imagePosition: 'left',
      carouselLabel: 'Worldbuilding lineage examples',
      previousLabel: 'Previous worldbuilding lineage example',
      nextLabel: 'Next worldbuilding lineage example',
      examples: [
        {
          name: 'Elven Lineage',
          designation: 'Worldbuilding lineage · elven house',
          quote:
            'For a fantasy setting, arrange a long-eared house in Fantasy Family Tree Maker across court, forest, and wayfarer branches as a clear ancestry reference.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.elvenLineage,
          alt: 'Elven lineage with long-eared ancestors branching into court, forest, and wayfarer families.',
        },
        {
          name: 'Dwarven Clan',
          designation: 'Worldbuilding lineage · dwarven clan',
          quote:
            "Arrange a compact founder pair in Fantasy Family Tree Maker to show the mountain clan's craft, guard, and archive branches in a setting guide.",
          src: FAMILY_TREE_CASE_IMAGE_PATHS.dwarvenClan,
          alt: 'Dwarven clan tree with a founder pair and craft, guard, and archive branches.',
        },
        {
          name: 'Half-Elf Ancestry',
          designation: 'Worldbuilding lineage · mixed ancestry',
          quote:
            'For a half-elf ancestry reference, place human and elven branches side by side in Fantasy Family Tree Maker so a setting can track where the mixed line enters the family.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.halfElfAncestry,
          alt: 'Half-elf ancestry tree placing human and elven branches beside a mixed family line.',
        },
        {
          name: 'Orc Family',
          designation: 'Worldbuilding lineage · orc family',
          quote:
            'Use broad branch spacing in Fantasy Family Tree Maker to keep an orc household, a traveling branch, and the next generation readable.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.orcFamily,
          alt: 'Orc family tree with a household branch, a traveling branch, and a later generation.',
        },
      ],
    },
    {
      id: 'trpg-backgrounds',
      imagePosition: 'right',
      carouselLabel: 'TRPG character background examples',
      previousLabel: 'Previous TRPG background example',
      nextLabel: 'Next TRPG background example',
      examples: [
        {
          name: 'Adventurer Background',
          designation: 'TRPG background · adventuring party',
          quote:
            'A GM can use Fantasy Family Tree Maker to connect mentors, siblings, and a later adventuring generation behind a campaign cast.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.adventurerBackground,
          alt: 'TRPG family tree connecting mentors, siblings, and a later adventuring generation.',
        },
        {
          name: 'Village NPC Families',
          designation: 'TRPG background · village NPCs',
          quote:
            'Keep several village households together with Fantasy Family Tree Maker so NPC families and neighboring branches stay in one session reference.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.villageNpcFamilies,
          alt: 'Village NPC family tree grouping several households and neighboring branches.',
        },
        {
          name: 'Adoptive Family',
          designation: 'TRPG background · chosen family',
          quote:
            'In the chosen-family example, Fantasy Family Tree Maker lets an author choose a dashed endpoint for a visual distinction; the tool does not assign adoption meaning automatically.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.adoptiveFamily,
          alt: 'Chosen-family tree with a manually dashed endpoint marking a visually distinct connection.',
        },
        {
          name: 'Warlock Bloodline',
          designation: 'TRPG background · character origin',
          quote:
            'Arrange a warlock bloodline in Fantasy Family Tree Maker by tracing an old pact-era branch into the current party generation, keeping the character origin visible beside the campaign cast.',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.warlockBloodline,
          alt: 'Warlock bloodline tracing an old pact-era branch into a current party generation.',
        },
      ],
    },
  ],
};

const chineseFamilyTreeCaseStudies: FamilyTreeCaseStudiesCopy = {
  title: '小说、世界观与战役中的家谱案例',
  description:
    '这 12 个原创人物家谱案例都使用奇幻人物家谱制作器整理小说创作、世界观家系和 TRPG 角色背景。每个案例都使用头像、姓名、四代布局和作者自行安排的连线，展示不同的关系结构。',
  groups: [
    {
      id: 'novel-families',
      imagePosition: 'right',
      carouselLabel: '小说人物家谱案例',
      previousLabel: '上一个小说家谱案例',
      nextLabel: '下一个小说家谱案例',
      examples: [
        {
          name: '王室继承',
          designation: '小说家谱 · 继承线',
          quote: '用奇幻人物家谱制作器排列一对王室先祖及其王冠支系与河岸支系；外来配偶加入后，四代继承关系仍然清晰。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.royalSuccession,
          alt: '四代王室人物家谱，从一对先祖分出王冠支系、河岸支系和年轻继承人。',
        },
        {
          name: '双家族联姻',
          designation: '小说家谱 · 联姻关系',
          quote: '两个家族通过联姻相遇，再延续到共同的下一代；奇幻人物家谱制作器用分开的横线保留两个家族的起点。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.familyAlliance,
          alt: '两个家族通过中央联姻关系汇合，并继续延伸到共同支系的人物家谱。',
        },
        {
          name: '失踪继承人',
          designation: '小说家谱 · 谜团线索',
          quote: '在这个奇幻人物家谱制作器案例中，中央家系逐渐收束到一位下落不明的继承人，少量虚线端点由作者自行选择。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.missingHeir,
          alt: '中央继承线通向一条不确定的继承人支线，并带有少量虚线连接断点。',
        },
        {
          name: '商人家族',
          designation: '小说家谱 · 商业家系',
          quote: '用奇幻人物家谱制作器排列一对商人先祖，展示城镇仓库与商路两条支系，之后几代继续保留两条路线。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.merchantFamily,
          alt: '商人家族从一对先祖分出城镇支系和商路支系的人物家谱。',
        },
      ],
    },
    {
      id: 'worldbuilding-lineages',
      imagePosition: 'left',
      carouselLabel: '世界观家系案例',
      previousLabel: '上一个世界观家系案例',
      nextLabel: '下一个世界观家系案例',
      examples: [
        {
          name: '精灵家系',
          designation: '世界观家系 · 精灵家族',
          quote: '对于世界观设定，你可以用奇幻人物家谱制作器手动展示精灵家族的宫廷、森林与远行者家系，保留清晰的血缘参考。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.elvenLineage,
          alt: '精灵家系从长耳先祖分出宫廷、森林和远行者家族支系。',
        },
        {
          name: '矮人氏族',
          designation: '世界观家系 · 矮人氏族',
          quote: '你可以用奇幻人物家谱制作器排列山地氏族的一对先祖、工匠、守卫和档案支系，适合放进世界观设定资料。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.dwarvenClan,
          alt: '矮人氏族从先祖分出工匠、守卫和档案支系的人物家谱。',
        },
        {
          name: '半精灵血缘',
          designation: '世界观家系 · 混合血缘',
          quote: '用奇幻人物家谱制作器整理半精灵血缘参考，把人类与精灵支系并列放入家谱，标出混合血缘进入家族的位置，方便整理设定。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.halfElfAncestry,
          alt: '半精灵血缘家谱把人类与精灵支系并列，并标出混合家族线。',
        },
        {
          name: '兽人家族',
          designation: '世界观家系 · 兽人家族',
          quote: '在奇幻人物家谱制作器中用更宽的分支间距排列兽人家庭、迁徙支系与下一代，让世界观关系保持易读。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.orcFamily,
          alt: '兽人家族家谱展示家庭支系、迁徙支系和下一代人物。',
        },
      ],
    },
    {
      id: 'trpg-backgrounds',
      imagePosition: 'right',
      carouselLabel: 'TRPG 角色背景案例',
      previousLabel: '上一个 TRPG 背景案例',
      nextLabel: '下一个 TRPG 背景案例',
      examples: [
        {
          name: '冒险者背景',
          designation: 'TRPG 背景 · 冒险小队',
          quote: 'GM 可以用奇幻人物家谱制作器把导师、兄弟姐妹和后来的冒险者世代连在一起，查看战役角色背后的关系。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.adventurerBackground,
          alt: 'TRPG 人物家谱连接导师、兄弟姐妹和后来的冒险者世代。',
        },
        {
          name: '村庄 NPC 家族',
          designation: 'TRPG 背景 · 村庄 NPC',
          quote: '借助奇幻人物家谱制作器，可以把几个村庄家庭放在同一张家谱中，方便在团务资料里一起查看 NPC 家族与相邻支系。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.villageNpcFamilies,
          alt: '村庄 NPC 家谱把多个家庭和相邻支系整理在一起。',
        },
        {
          name: '收养家庭',
          designation: 'TRPG 背景 · 选择的家人',
          quote: '在选择的家庭案例中，作者可以用奇幻人物家谱制作器为家庭设置虚线端点作视觉区分；工具不会自动赋予虚线收养含义。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.adoptiveFamily,
          alt: '选择的家庭关系使用手动设置的虚线端点作视觉区分。',
        },
        {
          name: '术士血脉',
          designation: 'TRPG 背景 · 角色出身',
          quote: '用奇幻人物家谱制作器排列术士血脉的旧日契约支系与当前队伍世代，把角色出身放在战役人物关系旁边。',
          src: FAMILY_TREE_CASE_IMAGE_PATHS.warlockBloodline,
          alt: '术士血脉家谱从旧日契约支系延伸到当前队伍世代。',
        },
      ],
    },
  ],
};

export function getFamilyTreeCaseStudiesCopy(locale: SiteLocale): FamilyTreeCaseStudiesCopy {
  if (locale === 'en') return englishFamilyTreeCaseStudies;
  if (locale === 'zh') return chineseFamilyTreeCaseStudies;
  throw new Error(`Unknown family tree case studies locale: ${JSON.stringify(locale)}.`);
}
