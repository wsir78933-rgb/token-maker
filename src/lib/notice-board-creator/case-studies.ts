import { isSiteLocale, type SiteLocale } from '@/lib/site-locale';

export type NoticeBoardCreatorCaseStudyItem = {
  name: string;
  designation: string;
  quote: string;
  src: string;
  alt: string;
};

export type NoticeBoardCreatorCaseStudyGroup = {
  id: string;
  imagePosition: 'left' | 'right';
  ariaLabel: string;
  items: readonly NoticeBoardCreatorCaseStudyItem[];
};

export type NoticeBoardCreatorCaseStudiesCopy = {
  title: string;
  description: string;
  previousLabel: string;
  nextLabel: string;
  groups: readonly NoticeBoardCreatorCaseStudyGroup[];
};

const englishNoticeBoardCreatorCaseStudies: NoticeBoardCreatorCaseStudiesCopy = {
  title: 'Fantasy Notice Board Case Studies',
  description:
    'These 12 board images cover tavern and village life, guild and festival notices, travel and trade, wilderness and ruins, harbor work, mysteries, temple duties, and city factions. Use the scenes as inspiration, then arrange your own notices in the Notice Board Creator.',
  previousLabel: 'Previous example',
  nextLabel: 'Next example',
  groups: [
    {
      id: 'everyday',
      imagePosition: 'left',
      ariaLabel: 'Everyday life and guild notice board examples',
      items: [
        {
          name: 'First Job at the Village Tavern',
          designation: 'GM handout · Village life',
          quote:
            'A midnight knock from a cellar door shares space with a ferry-watch soup run and a harvest supper. Use the Notice Board Creator to present these mysteries and village errands as opening-session hooks, with easy ways to meet local residents.',
          src: '/notice-board-creator/cases/01-tavern-jobs.webp',
          alt: 'Four English notices for a midnight cellar knock, ferry-watch soup, a harvest fiddler, and a tavern gathering.',
        },
        {
          name: 'Mossbrook Village',
          designation: 'GM handout · Village life',
          quote:
            'A jammed millwheel, lost shears, fence repairs, and herb gathering turn Mossbrook chores into playable hooks. In the Notice Board Creator, group these small chores as neighborly jobs for the gaps between larger quests.',
          src: '/notice-board-creator/cases/10-mossbrook-village.webp',
          alt: 'Four village notices for a stuck millwheel, missing shears, fence repairs, and herb bundles.',
        },
        {
          name: 'The Lantern Fair',
          designation: 'GM handout · Festival session',
          quote:
            'A lantern race, mask-makers, bell-stage singers, and shared pear buns fill the riverside fair. Build a notice board for a timed festival session with the Notice Board Creator, adding optional social scenes around the race and friendly competition.',
          src: '/notice-board-creator/cases/09-lantern-fair.webp',
          alt: 'Four fair notices for a lantern race, mask makers, bell-stage singers, and a warm-brazier gathering.',
        },
        {
          name: 'Guild Contracts',
          designation: 'GM handout · Guild jobs',
          quote:
            'A signet trial, supply-cart run, road-map check, and newcomer breakfast give the guild several ways to welcome the party. Before an expedition, the Notice Board Creator can present these guild contacts and low-stakes jobs together.',
          src: '/notice-board-creator/cases/08-guild-contracts.webp',
          alt: 'Four guild notices for a signet trial, supply cart, south-road map check, and newcomer breakfast.',
        },
      ],
    },
    {
      id: 'expedition',
      imagePosition: 'right',
      ariaLabel: 'Travel and expedition notice board examples',
      items: [
        {
          name: 'Caravan Escort & Trade',
          designation: 'GM handout · Travel and trade',
          quote:
            'A dawn grain caravan, a ford survey, a stranded wagon, and a ridge-road signal all point toward the next stretch of road. Build a trade-focused board in the Notice Board Creator around route choices, repairs, and travel safety.',
          src: '/notice-board-creator/cases/04-caravan-road.webp',
          alt: 'Four road notices for a grain caravan, ford mapping, an empty wagon, and ridge-road safety.',
        },
        {
          name: 'Greenwood Contracts',
          designation: 'GM handout · Wilderness expedition',
          quote:
            'Moonleaf gathering, glasshorn tracking, mushroom baskets, and a Greenwood cookfire bring the forest into everyday reach. For a scouting session, place the gathering, tracking, and cookfire hooks together in the Notice Board Creator.',
          src: '/notice-board-creator/cases/05-greenwood-contracts.webp',
          alt: 'Four Greenwood notices for moonleaf, glasshorn tracks, bramblecap mushrooms, and a trail cookfire.',
        },
        {
          name: 'Ruins and Relics',
          designation: 'GM handout · Ruin exploration',
          quote:
            'A brass star-disc and marked vault doorway draw attention to the Old Meridian Ruin, while a survey camp needs lamp oil. The Notice Board Creator can frame an expedition around relic recovery, careful documentation, and support for the waiting camp.',
          src: '/notice-board-creator/cases/06-ruins-and-relics.webp',
          alt: 'Four Stonewake notices for an Old Meridian relic, copying door marks, lamp oil, and an open archive.',
        },
        {
          name: 'Harbor Notices',
          designation: 'GM handout · Harbor adventure',
          quote:
            'A blue lantern offshore leads to a weather-log search, alongside a salt-barge escort, a bell recovery, and a fisher supper. In the Notice Board Creator, combine the weather-log search with tide-bound jobs and a port-side supper scene.',
          src: '/notice-board-creator/cases/07-harbor-notices.webp',
          alt: 'Four harbor notices for a weather-log search, salt-barge guards, a submerged bell, and a fisher supper.',
        },
      ],
    },
    {
      id: 'mystery',
      imagePosition: 'left',
      ariaLabel: 'Mystery and city notice board examples',
      items: [
        {
          name: 'Watch Bounties & Notices',
          designation: 'GM handout · Watch patrol',
          quote:
            'A wanted purse-cutter, marsh-boar tracks, a two-night bell-tower watch, and an early gate closure share the city watch board. Arrange the clues, civic duties, and deadlines together in the Notice Board Creator for a city-patrol session.',
          src: '/notice-board-creator/cases/02-wanted-posters.webp',
          alt: 'Four watch notices for a wanted suspect, marsh-boar tracks, a bell-tower lantern post, and early gate closure.',
        },
        {
          name: 'Missing Persons & Midnight Mysteries',
          designation: 'GM handout · Urban investigation',
          quote:
            'A missing mapmaker, stolen archive bell, darkened Candle Row lamps, and sealed market letters bring four leads together on one board. The Notice Board Creator can put these leads in front of players before the family coach leaves town.',
          src: '/notice-board-creator/cases/03-midnight-mysteries.webp',
          alt: 'Four Lantern Lane notices about a missing mapmaker, stolen moon bell, darkened lamps, and sealed letters.',
        },
        {
          name: 'The Hollow Bells',
          designation: 'GM handout · Temple mystery',
          quote:
            'Witnesses are wanted after the shrine bell rang with its rope tied; the same board lists vigil supplies, night patrols, and lost prayer beads. Use the Notice Board Creator to bring the witness search, vigil supplies, and temple patrol into one session.',
          src: '/notice-board-creator/cases/11-hollow-bells.webp',
          alt: 'Four Hollow Bells temple notices for a midnight bell, vigil supplies, night patrols, and lost prayer beads.',
        },
        {
          name: 'City Notices and Factions',
          designation: 'GM handout · Faction intrigue',
          quote:
            'The Assembly and Bronze Charter League seek testimony about a missing tax seal; the Royal Chancery needs a courier, and the Lantern Ward seeks lamp lighters. For a city session, the Notice Board Creator can place the witness requests, sealed delivery, and lamp-lighting duty on one board.',
          src: '/notice-board-creator/cases/12-city-warrants.webp',
          alt: 'Four city notices about testimony for a missing tax seal, a sealed courier packet, a counter-witness, and lamp lighters.',
        },
      ],
    },
  ],
};

const chineseNoticeBoardCreatorCaseStudies: NoticeBoardCreatorCaseStudiesCopy = {
  title: '奇幻任务公告板案例',
  description:
    '这 12 张公告板涵盖酒馆与村镇日常、公会与节庆告示、商路贸易、荒野与遗迹探索、港口事务、谜案、神殿值守和王城派系。制作自己的公告板时，可参考这些场景，再用奇幻任务公告板制作器编排告示。',
  previousLabel: '上一个案例',
  nextLabel: '下一个案例',
  groups: [
    {
      id: 'everyday',
      imagePosition: 'left',
      ariaLabel: '日常生活与公会公告板案例',
      items: [
        {
          name: '小镇酒馆初次委托',
          designation: 'GM/DM 跑团手卡 · 村镇日常',
          quote:
            '酒馆地下室门在午夜传来敲击声，送汤差事与丰收晚宴也让镇民登上告示。用奇幻任务公告板制作器制作开场公告，并列呈现谜团与村镇差事，让玩家借此认识镇民。',
          src: '/notice-board-creator/cases/01-tavern-jobs.webp',
          alt: '四则英文酒馆告示：午夜地下室敲门、渡口送汤、丰收宴乐师招募和炉边聚餐。',
        },
        {
          name: '苔溪村日常',
          designation: 'GM/DM 跑团手卡 · 村镇日常',
          quote:
            '磨坊水轮卡住、修枝剪遗失、牧栏待修，还有病房草药需要采集，让苔溪村的日常变成可玩的委托。在奇幻任务公告板制作器中编排这些日常差事，可让队伍在大型任务之间顺手帮助邻里。',
          src: '/notice-board-creator/cases/10-mossbrook-village.webp',
          alt: '四则村庄告示：水轮故障、修枝剪失物、山羊牧栏修理和病房草药采集。',
        },
        {
          name: '灯火集会',
          designation: 'GM/DM 跑团手卡 · 节庆冒险',
          quote:
            '河畔集会安排了提灯竞速、面具制作、钟台歌手和炉边分梨包。用奇幻任务公告板制作器为限时节庆冒险制作公告板，呈现提灯竞赛、友好比拼与可选社交场景。',
          src: '/notice-board-creator/cases/09-lantern-fair.webp',
          alt: '四则集会告示：提灯竞速、面具制作、钟台歌手招募和炉边分享梨包。',
        },
        {
          name: '公会委托',
          designation: 'GM/DM 跑团手卡 · 公会任务',
          quote:
            '印戒试炼、补给车护送、南路测绘和新人早餐，为队伍提供了多种加入公会的入口。远征前，可在奇幻任务公告板制作器中并列展示公会联系人和几项低风险差事。',
          src: '/notice-board-creator/cases/08-guild-contracts.webp',
          alt: '四则公会告示：印戒试炼、补给车护送、南路里程标测绘和新人早餐。',
        },
      ],
    },
    {
      id: 'expedition',
      imagePosition: 'right',
      ariaLabel: '商路与远征公告板案例',
      items: [
        {
          name: '商队护送与贸易',
          designation: 'GM/DM 跑团手卡 · 商路与贸易',
          quote:
            '清晨出发的粮车商队、浅滩测绘、遗留货车和山脊路况信号，都指向下一段旅程。制作商路主题公告板时，可用奇幻任务公告板制作器呈现路线选择、货车修理和行路安全。',
          src: '/notice-board-creator/cases/04-caravan-road.webp',
          alt: '四则道路告示：护送粮车、绘制浅滩路线、取回空货车和山脊路况信号。',
        },
        {
          name: '绿木林委托',
          designation: 'GM/DM 跑团手卡 · 荒野探索',
          quote:
            '采集月叶、追踪玻角鹿、采摘冬储蘑菇和参加林中篝火，让绿木林的探索贴近日常。奇幻任务公告板制作器可将侦察、采集和篝火交流这几类委托放在同一块板上。',
          src: '/notice-board-creator/cases/05-greenwood-contracts.webp',
          alt: '四则绿木林告示：月叶采集、追踪玻角鹿、采摘荆帽菇和参加林中篝火。',
        },
        {
          name: '遗迹与遗物',
          designation: 'GM/DM 跑团手卡 · 遗迹探索',
          quote:
            '黄铜星盘与封存门廊上的刻痕指向古子午线遗迹，测绘营地也正等待灯油补给。在奇幻任务公告板制作器中并列呈现遗物回收、刻痕记录与营地补给，可用来安排远征。',
          src: '/notice-board-creator/cases/06-ruins-and-relics.webp',
          alt: '四则石醒镇告示：古子午线遗迹星盘、门上刻痕拓印、营地灯油和开放档案室。',
        },
        {
          name: '港口告示',
          designation: 'GM/DM 跑团手卡 · 港口冒险',
          quote:
            '海上的蓝灯引出气象日志搜寻，公告板上还招募盐驳船护卫、打捞铜钟，并邀请渔民晚餐。在奇幻任务公告板制作器中，可将气象日志调查、潮汐限时差事与港口角色扮演排在一块公告板上。',
          src: '/notice-board-creator/cases/07-harbor-notices.webp',
          alt: '四则港口告示：寻找气象日志、护送盐驳船、打捞沉钟和参加渔民晚餐。',
        },
      ],
    },
    {
      id: 'mystery',
      imagePosition: 'left',
      ariaLabel: '谜案与城邦公告板案例',
      items: [
        {
          name: '城卫悬赏与告示',
          designation: 'GM/DM 跑团手卡 · 城卫巡查',
          quote:
            '城卫悬赏一名扒手，边界石旁出现沼猪足迹，钟楼还需要守灯人，南门也将提前关闭。奇幻任务公告板制作器可将线索、公务与时限安排在一块城卫巡查告示板上。',
          src: '/notice-board-creator/cases/02-wanted-posters.webp',
          alt: '四则城卫告示：缉拿扒手、调查沼猪足迹、钟楼守灯和南门提前关闭。',
        },
        {
          name: '失踪者与午夜谜案',
          designation: 'GM/DM 跑团手卡 · 城镇调查',
          quote:
            '制图学徒失踪、档案室银铃被盗、烛街灯火熄灭，兰灯巷的集市还收存密封信件。在奇幻任务公告板制作器中并列展示这些线索，可让玩家在家人马车离镇前选择调查方向。',
          src: '/notice-board-creator/cases/03-midnight-mysteries.webp',
          alt: '四则兰灯巷告示：寻找失踪制图师、寻回月铃、修复熄灭的街灯和代存密封信件。',
        },
        {
          name: '空鸣钟殿',
          designation: 'GM/DM 跑团手卡 · 神殿谜案',
          quote:
            '钟绳明明系紧，神殿钟声却在午夜响起；告示还征求守夜证人、补充守夜物资、招募巡路人并寻找遗失念珠。用奇幻任务公告板制作器整理这些告示，可安排询问证人、递送物资并巡查神殿外围。',
          src: '/notice-board-creator/cases/11-hollow-bells.webp',
          alt: '四则空鸣钟殿告示：午夜钟声、守夜物资、神殿巡路和遗失念珠。',
        },
        {
          name: '王城告示与派系',
          designation: 'GM/DM 跑团手卡 · 派系纷争',
          quote:
            '公开议会与青铜宪章盟征集税印失踪案的证词，王室文书厅招募信使，灯区守卫招募点灯人。在奇幻任务公告板制作器中并列安排两派证词征集、密封递送和点灯差事，可作为城市冒险入口。',
          src: '/notice-board-creator/cases/12-city-warrants.webp',
          alt: '四则王城告示：税印证词、密封公文递送、反向证人招募和街灯点亮。',
        },
      ],
    },
  ],
};

const noticeBoardCreatorCaseStudiesCopy: Record<SiteLocale, NoticeBoardCreatorCaseStudiesCopy> = {
  en: englishNoticeBoardCreatorCaseStudies,
  zh: chineseNoticeBoardCreatorCaseStudies,
};

export function getNoticeBoardCreatorCaseStudiesCopy(locale: SiteLocale): NoticeBoardCreatorCaseStudiesCopy {
  if (!isSiteLocale(locale)) {
    const receivedLocale = JSON.stringify(locale) ?? String(locale);
    throw new Error(`Unknown notice board creator case studies locale. Received ${receivedLocale}.`);
  }

  return noticeBoardCreatorCaseStudiesCopy[locale];
}
