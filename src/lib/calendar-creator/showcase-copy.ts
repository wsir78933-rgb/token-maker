import type { SiteLocale } from '@/lib/site-locale';

export type CalendarCreatorShowcaseExample = {
  readonly name: string;
  readonly designation: string;
  readonly quote: string;
  readonly src: string;
  readonly alt: string;
};

export type CalendarCreatorShowcaseGroup = {
  readonly id: 'worlds' | 'adventures' | 'stories';
  readonly title: string;
  readonly imagePosition: 'left' | 'right';
  readonly examples: readonly CalendarCreatorShowcaseExample[];
};

export type CalendarCreatorShowcaseCopy = {
  readonly title: string;
  readonly description: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly openImageLabel: string;
  readonly closeImageLabel: string;
  readonly groups: readonly CalendarCreatorShowcaseGroup[];
};

const englishCalendarCreatorShowcaseCopy: CalendarCreatorShowcaseCopy = {
  title: 'Fantasy Calendar Generator examples',
  description:
    'These screenshots show Chinese-language examples using the Fantasy Calendar Generator: custom months, weekdays, moons, disasters, notes, and marked dates.',
  previousLabel: 'Previous calendar example',
  nextLabel: 'Next calendar example',
  openImageLabel: 'Open calendar image',
  closeImageLabel: 'Close calendar image',
  groups: [
    {
      id: 'worlds',
      title: 'World settings',
      imagePosition: 'left',
      examples: [
        {
          name: 'Dual-Moon Kingdom',
          designation: 'For royal worldbuilding',
          quote:
            'Use the Fantasy Calendar Generator to turn two moon cycles, court dates, and border watches into a usable Frost Month reference for a kingdom.',
          src: '/calendar-creator/examples/calendar-01.webp',
          alt: 'Chinese-language calendar example for a dual-moon kingdom with royal events',
        },
        {
          name: 'Three-Moon Omens',
          designation: 'For prophecy-driven settings',
          quote:
            "With the Fantasy Calendar Generator, three moon cycles and marked omens give the 302nd year's Omen Month a clear rhythm for prophecies.",
          src: '/calendar-creator/examples/calendar-02.webp',
          alt: 'Chinese-language calendar example with three moons and omen events',
        },
        {
          name: 'Mage Academy',
          designation: 'For magical school calendars',
          quote:
            'Across a 29-day academy month, the Fantasy Calendar Generator helps you record three staggered moon cycles, trials, lectures, and experiments.',
          src: '/calendar-creator/examples/calendar-06.webp',
          alt: 'Chinese-language mage academy calendar example with moon cycles and study events',
        },
        {
          name: 'Elven Forest',
          designation: 'For nature-centered worlds',
          quote:
            'Long forest weeks, two moon cycles, and leaf, flower, and animal marks become a quiet woodland chronology in the Fantasy Calendar Generator.',
          src: '/calendar-creator/examples/calendar-09.webp',
          alt: 'Chinese-language elven forest calendar example with nature marks',
        },
      ],
    },
    {
      id: 'adventures',
      title: 'Journeys and survival',
      imagePosition: 'right',
      examples: [
        {
          name: 'TRPG Expedition',
          designation: 'For campaign travel planning',
          quote:
            'For an expedition, use the Fantasy Calendar Generator to combine a short 28-day month with camp, route, mapping, combat, and supply markers.',
          src: '/calendar-creator/examples/calendar-03.webp',
          alt: 'Chinese-language TRPG expedition calendar example with travel events',
        },
        {
          name: 'Winter Siege',
          designation: 'For fortress campaigns',
          quote:
            'A 32-day Frost Fort month in the Fantasy Calendar Generator pairs two moon cycles with wall alerts, counterattacks, and thaw warnings.',
          src: '/calendar-creator/examples/calendar-05.webp',
          alt: 'Chinese-language winter siege calendar example with fortress events',
        },
        {
          name: 'Sea Voyage',
          designation: 'For maritime adventures',
          quote:
            'Anchor, fog, storm, and shore markers make the Tide Month a practical log when planned in the Fantasy Calendar Generator.',
          src: '/calendar-creator/examples/calendar-07.webp',
          alt: 'Chinese-language sea voyage calendar example with anchor and storm marks',
        },
        {
          name: 'Desert Caravan',
          designation: 'For travel across harsh terrain',
          quote:
            'Track caravan departures, route checks, sandstorms, water, and reunions with the Fantasy Calendar Generator in a compact 28-day month.',
          src: '/calendar-creator/examples/calendar-08.webp',
          alt: 'Chinese-language desert caravan calendar example with route events',
        },
      ],
    },
    {
      id: 'stories',
      title: 'Stories and scenes',
      imagePosition: 'left',
      examples: [
        {
          name: 'Harvest Festival',
          designation: 'For seasonal village stories',
          quote:
            'A five-day week and a white moon cycle become a seasonal schedule in the Fantasy Calendar Generator for sowing, orchard work, harvest, and shared meals.',
          src: '/calendar-creator/examples/calendar-04.webp',
          alt: 'Chinese-language harvest calendar example with farming and festival marks',
        },
        {
          name: 'Dwarven Forge',
          designation: 'For craft and industry settings',
          quote:
            'In the Fantasy Calendar Generator, forge shifts, red-moon work, tools, gears, ore, and finished marks structure a working month.',
          src: '/calendar-creator/examples/calendar-10.webp',
          alt: 'Chinese-language dwarven forge calendar example with craft marks',
        },
        {
          name: 'Courtly Novel',
          designation: 'For political and romantic plots',
          quote:
            'Crown, ballroom, letters, council, banquet, and alliance marks are easy to place in time with the Fantasy Calendar Generator.',
          src: '/calendar-creator/examples/calendar-11.webp',
          alt: 'Chinese-language court calendar example with political and social events',
        },
        {
          name: 'Interstellar Colony',
          designation: 'For science-fiction settlements',
          quote:
            'Shift changes, research, maintenance, meteor alerts, harvests, and new homes give a colony month a working rhythm when mapped in the Fantasy Calendar Generator.',
          src: '/calendar-creator/examples/calendar-12.webp',
          alt: 'Chinese-language interstellar colony calendar example with shift and maintenance marks',
        },
      ],
    },
  ],
};

const chineseCalendarCreatorShowcaseCopy: CalendarCreatorShowcaseCopy = {
  title: '奇幻历法生成器案例展示',
  description: '看看奇幻历法生成器如何服务不同的世界观与故事，处理自定义月份、星期、月相、灾害、笔记和日期标记。',
  previousLabel: '上一个历法案例',
  nextLabel: '下一个历法案例',
  openImageLabel: '打开历法图片',
  closeImageLabel: '关闭历法图片',
  groups: [
    {
      id: 'worlds',
      title: '世界设定',
      imagePosition: 'left',
      examples: [
        {
          name: '双月王国',
          designation: '适合王国世界观',
          quote: '安排两组月亮周期、王室日期和边境换防时，奇幻历法生成器让霜月成为可直接查阅的王国历法。',
          src: '/calendar-creator/examples/calendar-01.webp',
          alt: '双月王国的中文历法案例，标记王室事件',
        },
        {
          name: '三月预兆',
          designation: '适合预言型设定',
          quote: '用三组月亮周期和预兆标记时，奇幻历法生成器为第 302 年的预兆月建立清晰节奏。',
          src: '/calendar-creator/examples/calendar-02.webp',
          alt: '三月预兆的中文历法案例，展示三组月亮周期和预兆事件',
        },
        {
          name: '法师学院',
          designation: '适合法术学院设定',
          quote: '在 29 天的学院月份里，奇幻历法生成器帮助你记录三组错开的月亮周期、试炼、讲座和实验。',
          src: '/calendar-creator/examples/calendar-06.webp',
          alt: '法师学院的中文历法案例，标记月相和学习事件',
        },
        {
          name: '精灵森林',
          designation: '适合自然主题世界',
          quote: '较长的星期、两组月亮周期，以及树叶花朵和动物标记，可以在奇幻历法生成器中组成安静的森林时间线。',
          src: '/calendar-creator/examples/calendar-09.webp',
          alt: '精灵森林的中文历法案例，标记自然主题日期',
        },
      ],
    },
    {
      id: 'adventures',
      title: '远征与生存',
      imagePosition: 'right',
      examples: [
        {
          name: 'TRPG远征',
          designation: '适合战役远征规划',
          quote: '用奇幻历法生成器把 28 天月份、扎营、路线、测绘、战斗和补给安排在同一张远征历法上。',
          src: '/calendar-creator/examples/calendar-03.webp',
          alt: 'TRPG远征的中文历法案例，标记旅行事件',
        },
        {
          name: '冬季守城',
          designation: '适合要塞战役',
          quote: '在奇幻历法生成器中，32 天的霜堡月结合两组月亮周期，记录城墙警报、反击和解冻预警。',
          src: '/calendar-creator/examples/calendar-05.webp',
          alt: '冬季守城的中文历法案例，标记要塞事件',
        },
        {
          name: '海上航行',
          designation: '适合海上冒险',
          quote: '锚点、海雾、风暴和靠岸标记可由奇幻历法生成器集中记录，让潮汐月成为航行中的实用记录。',
          src: '/calendar-creator/examples/calendar-07.webp',
          alt: '海上航行的中文历法案例，标记锚点和风暴事件',
        },
        {
          name: '沙漠商队',
          designation: '适合荒漠旅行设定',
          quote: '紧凑的 28 天月份可以用奇幻历法生成器记录出发、定位、沙暴、补水和驼队会合。',
          src: '/calendar-creator/examples/calendar-08.webp',
          alt: '沙漠商队的中文历法案例，标记路线事件',
        },
      ],
    },
    {
      id: 'stories',
      title: '故事与场景',
      imagePosition: 'left',
      examples: [
        {
          name: '丰收节',
          designation: '适合季节村镇故事',
          quote: '在奇幻历法生成器里，五日星期和白月周期可以把播种、采摘、收割与宴饮安排成完整的金穗月。',
          src: '/calendar-creator/examples/calendar-04.webp',
          alt: '丰收节的中文历法案例，标记农事与庆典日期',
        },
        {
          name: '矮人锻造',
          designation: '适合工匠与工业设定',
          quote: '锻炉班次、红月、工具、齿轮、矿脉和铸印标记，用奇幻历法生成器构成一整个月的工作节奏。',
          src: '/calendar-creator/examples/calendar-10.webp',
          alt: '矮人锻造的中文历法案例，标记工坊事件',
        },
        {
          name: '小说宫廷',
          designation: '适合宫廷与情感剧情',
          quote: '加冕、舞会、密信、议政、晚宴和订盟标记，通过奇幻历法生成器让宫廷剧情有清晰时间位置。',
          src: '/calendar-creator/examples/calendar-11.webp',
          alt: '小说宫廷的中文历法案例，标记政治与社交事件',
        },
        {
          name: '星际殖民地',
          designation: '适合科幻殖民地设定',
          quote: '用奇幻历法生成器记录轮班、研究、维修、陨石警报、温室收获和新居落成，组成殖民地的工作节奏。',
          src: '/calendar-creator/examples/calendar-12.webp',
          alt: '星际殖民地的中文历法案例，标记轮班与维护事件',
        },
      ],
    },
  ],
};

export function getCalendarCreatorShowcaseCopy(locale: SiteLocale): CalendarCreatorShowcaseCopy {
  if (locale === 'en') {
    return englishCalendarCreatorShowcaseCopy;
  }

  if (locale === 'zh') {
    return chineseCalendarCreatorShowcaseCopy;
  }

  throw new Error(`Unknown calendar creator showcase locale. Received ${JSON.stringify(locale)}.`);
}
