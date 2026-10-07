import { getTarotCard } from '@/lib/tarot-cards/cards';
import type { SiteLocale } from '@/lib/site-locale';

export type TarotCaseStudyGroupCopy = {
  readonly id: 'characters' | 'worlds' | 'adventures';
  readonly imagePosition: 'left' | 'right';
  readonly carouselLabel: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly examples: readonly {
    readonly name: string;
    readonly designation: string;
    readonly quote: string;
    readonly src: string;
    readonly alt: string;
  }[];
};

export type TarotCaseStudiesCopy = {
  readonly title: string;
  readonly description: string;
  readonly groups: readonly TarotCaseStudyGroupCopy[];
};

const englishTarotCaseStudies: TarotCaseStudiesCopy = {
  title: 'Creative case studies: from a card to a story hook',
  description:
    'These examples show how one upright card prompt can become a character, world, or adventure detail for a story or RPG session.',
  groups: [
    {
      id: 'characters',
      imagePosition: 'left',
      carouselLabel: 'Character creation case studies',
      previousLabel: 'Previous character case',
      nextLabel: 'Next character case',
      examples: [
        {
          name: 'The Exiled Knight',
          designation: 'Character creation · Eight of Cups — Upright',
          quote:
            'Question: What might tarot cards reveal about why a knight leaves the banner they once defended? Key card prompt: Eight of Cups upright suggests walking away, a deeper search, and the courage to leave the familiar. Story setting: Sir Elian abandoned the border order after learning its victories depended on a buried pact; now he travels with a sealed map while riders pursue both the map and his silence.',
          src: getTarotCard('cups-08').imageSrc,
          alt: 'Eight of Cups — Upright',
        },
        {
          name: 'The Scholar Behind a False Name',
          designation: 'Character creation · The High Priestess — Upright',
          quote:
            'Question: What can tarot cards uncover about what a scholar protects by hiding their identity? Key card prompt: The High Priestess upright points to quiet knowing, hidden patterns, and a patient threshold. Story setting: Archivist Nera quietly publishes under a dead mentor’s name while decoding a library’s blank shelves; every missing volume marks a living witness she must find before the council notices the pattern.',
          src: getTarotCard('major-02-high-priestess').imageSrc,
          alt: 'The High Priestess — Upright',
        },
        {
          name: 'The Lantern Cartographer',
          designation: 'Character creation · The Hermit — Upright',
          quote:
            'Question: What do tarot cards suggest about who keeps mapping roads that no kingdom admits exist? Key card prompt: The Hermit upright suggests solitary study, lantern insight, and deliberate pause. Story setting: Mara is a retired surveyor who walks only at dusk, marking vanished bridges in a private atlas. When a young prince asks for the safest route through the border, she gives him a blank page and asks what he is willing to learn before he chooses a road.',
          src: getTarotCard('major-09-hermit').imageSrc,
          alt: 'The Hermit — Upright',
        },
        {
          name: 'The Quiet Envoy',
          designation: 'Character creation · Seven of Swords — Upright',
          quote:
            'Question: How might tarot cards shape an envoy’s plan to carry a peace offer without revealing who sent it? Key card prompt: Seven of Swords upright suggests quiet strategy, selective disclosure, and a clever exit. Story setting: Iven enters the rival city as a stagehand, hides the treaty inside a prop sword, and plans three ways out. The party must decide whether protecting the messenger matters more than exposing the faction that arranged the war.',
          src: getTarotCard('swords-07').imageSrc,
          alt: 'Seven of Swords — Upright',
        },
      ],
    },
    {
      id: 'worlds',
      imagePosition: 'right',
      carouselLabel: 'Worldbuilding case studies',
      previousLabel: 'Previous world case',
      nextLabel: 'Next world case',
      examples: [
        {
          name: 'The Fading Kingdom',
          designation: 'Worldbuilding · Death — Upright',
          quote:
            'Question: What do tarot cards ask a fading kingdom to surrender before it can survive? Key card prompt: Death upright suggests a closing chapter, necessary shedding, and a renewed shape. Story setting: The kingdom dissolves its hereditary court, opens the old roads to rival clans, and turns the abandoned palace into a public archive. Its first forbidden volume records why the crown had to end and what the new order still fears.',
          src: getTarotCard('major-13-death').imageSrc,
          alt: 'Death — Upright',
        },
        {
          name: 'The Divided Mage Council',
          designation: 'Worldbuilding · Five of Swords — Upright',
          quote:
            'Question: How do tarot cards frame why the mage council split when every faction claims to protect the city? Key card prompt: Five of Swords upright brings sharp conflict, competing pride, and the cost of winning. Story setting: Three archmages each seize one part of the weather engine, keeping the harbor safe while making another district colder; an apprentice must broker a truce before winter becomes a weapon.',
          src: getTarotCard('swords-05').imageSrc,
          alt: 'Five of Swords — Upright',
        },
        {
          name: 'The Rotating Tribunal',
          designation: 'Worldbuilding · Justice — Upright',
          quote:
            'Question: What can tarot cards test when a new alliance needs a rule after civil war? Key card prompt: Justice upright calls for clear accountability, balanced judgment, truthful measure, and fair exchange. Story setting: The river provinces share one tribunal whose seats rotate between former enemies; every verdict must publish its evidence and repair the harm. A missing ledger threatens to turn the alliance’s first test into its first purge.',
          src: getTarotCard('major-11-justice').imageSrc,
          alt: 'Justice — Upright',
        },
        {
          name: 'The Rival Guilds',
          designation: 'Worldbuilding · Five of Wands — Upright',
          quote:
            'Question: How might tarot cards frame two guilds competing to define a city’s magic? Key card prompt: Five of Wands upright brings lively contest, teaching friction, competing voices, and tested courage. Story setting: Glasswrights and stormsmiths race to power the same lighthouse, each sabotaging the other’s design without admitting it. The festival deadline forces apprentices from both guilds to build together before the coast loses its warning light.',
          src: getTarotCard('wands-05').imageSrc,
          alt: 'Five of Wands — Upright',
        },
      ],
    },
    {
      id: 'adventures',
      imagePosition: 'left',
      carouselLabel: 'Adventure design case studies',
      previousLabel: 'Previous adventure case',
      nextLabel: 'Next adventure case',
      examples: [
        {
          name: 'The Border Village in Fog',
          designation: 'Adventure design · The Moon — Upright',
          quote:
            'Question: What can tarot cards suggest the fog is hiding at a village beyond the border? Key card prompt: The Moon upright suggests shifting perception, dream symbols, uncertainty, and an instinctive tide. Story setting: Villagers leave lanterns beside paths that move overnight, while a child’s repeated dream maps a drowned road beneath the fields; the party must decide whether the fog is a warning, a guide, or a living boundary.',
          src: getTarotCard('major-18-moon').imageSrc,
          alt: 'The Moon — Upright',
        },
        {
          name: 'The Unstable Ruins',
          designation: 'Adventure design · The Tower — Upright',
          quote:
            'Question: What do tarot cards ask when an old ruin becomes an active threat? Key card prompt: The Tower upright points to sudden rupture, a false shelter falling, and freedom through change. Story setting: A buried observatory breaks open during a festival, exposing a machine that has been redirecting nearby rivers; the adventurers must cross the collapsing galleries to choose which valley receives the returning water.',
          src: getTarotCard('major-16-tower').imageSrc,
          alt: 'The Tower — Upright',
        },
        {
          name: 'The Caravan at Dawn',
          designation: 'Adventure design · The Chariot — Upright',
          quote:
            'Question: How can tarot cards frame what the party must keep moving when two forces pull the same caravan apart? Key card prompt: The Chariot upright suggests directed momentum, disciplined drive, and competing forces harnessed through focus. Story setting: A refugee caravan carries rival heirs toward a mountain pass that closes at dawn. The party must coordinate scouts, repair the lead wagon, and choose one route before the heirs’ guards turn the journey into a battlefield.',
          src: getTarotCard('major-07-chariot').imageSrc,
          alt: 'The Chariot — Upright',
        },
        {
          name: 'The Shared Stream',
          designation: 'Adventure design · Temperance — Upright',
          quote:
            'Question: What do tarot cards suggest about healing a poisoned valley without choosing which village loses its water? Key card prompt: Temperance upright suggests blended strengths, measured rhythm, calm repair, and harmonious proportion. Story setting: The party must combine a healer’s river filter with an alchemist’s neutralizing salt, then time the release between two tides. Success depends on cooperation, not a stronger spell, and leaves the villages with a shared ritual to protect the stream.',
          src: getTarotCard('major-14-temperance').imageSrc,
          alt: 'Temperance — Upright',
        },
      ],
    },
  ],
};

const chineseTarotCaseStudies: TarotCaseStudiesCopy = {
  title: '创作案例：从一张牌到故事线索',
  description: '以下案例展示如何把一张正位牌的提示，发展成适合故事或 RPG 场景的角色、世界设定和冒险细节。',
  groups: [
    {
      id: 'characters',
      imagePosition: 'left',
      carouselLabel: '角色创作案例',
      previousLabel: '上一个角色案例',
      nextLabel: '下一个角色案例',
      examples: [
        {
          name: '被放逐的骑士',
          designation: '角色创作 · 圣杯八（正位）',
          quote:
            '创作问题：用塔罗牌追问，一名被放逐的骑士为什么要离开曾守护的旗帜？关键牌提示：圣杯八正位指向转身离开、更深寻找，以及离开熟悉之处的勇气。故事设定：埃利安爵士发现边境骑士团的胜利建立在一份被掩埋的契约上，于是带着封存的地图出走。骑士团追捕地图，也追捕他隐瞒的真相；队伍必须在旧誓言与新道路之间选择。',
          src: getTarotCard('cups-08').imageSrc,
          alt: '圣杯八（正位）',
        },
        {
          name: '隐瞒身份的学者',
          designation: '角色创作 · 女祭司（正位）',
          quote:
            '创作问题：塔罗牌让我们继续追问，一名学者隐藏身份时究竟在保护什么？关键牌提示：女祭司正位带来安静的知觉、隐藏脉络与耐心等待的门槛。故事设定：档案学者奈拉借用已故导师的名字发表研究，悄悄破解一座图书馆的空白书架；每一个缺失的卷册都对应一名仍活着的证人，她必须在议会察觉这条脉络之前找到他们。',
          src: getTarotCard('major-02-high-priestess').imageSrc,
          alt: '女祭司（正位）',
        },
        {
          name: '提灯的制图师',
          designation: '角色创作 · 隐者（正位）',
          quote:
            '创作问题：借助塔罗牌，谁还在绘制那些王国不承认存在的道路？关键牌提示：隐者正位代表独自研习、灯笼般的洞见与有意停顿。故事设定：玛拉是一名退休测绘师，只在黄昏行走，把消失的桥梁画进私人地图。当年轻王子询问穿越边境的安全路线时，她递给他一张白纸，要求他先说清楚愿意在选路前学会什么。',
          src: getTarotCard('major-09-hermit').imageSrc,
          alt: '隐者（正位）',
        },
        {
          name: '沉默的使者',
          designation: '角色创作 · 宝剑七（正位）',
          quote:
            '创作问题：塔罗牌提示我们追问，使者怎样携带和平提议又不暴露送信者？关键牌提示：宝剑七正位指向安静策略、选择性透露与聪明退路。故事设定：伊文伪装成剧团杂役进入敌城，把条约藏进道具剑，并准备三条退路。队伍必须决定，保护这名使者是否比揭露那个挑起战争的派系更重要。',
          src: getTarotCard('swords-07').imageSrc,
          alt: '宝剑七（正位）',
        },
      ],
    },
    {
      id: 'worlds',
      imagePosition: 'right',
      carouselLabel: '世界设定创作案例',
      previousLabel: '上一个世界设定案例',
      nextLabel: '下一个世界设定案例',
      examples: [
        {
          name: '衰落的王国',
          designation: '世界设定 · 死神（正位）',
          quote:
            '创作问题：用塔罗牌追问，一个衰落王国要舍弃什么才有机会继续存在？关键牌提示：死神正位代表章节收束、必要舍弃、诚实过渡与新的形态。故事设定：王国解散世袭宫廷，开放旧道路给相互敌对的氏族，将荒废的宫殿改成公共档案馆。第一卷禁书记录了王冠为何必须终结，也记录了新秩序仍然惧怕的事。',
          src: getTarotCard('major-13-death').imageSrc,
          alt: '死神（正位）',
        },
        {
          name: '分裂的法师议会',
          designation: '世界设定 · 宝剑五（正位）',
          quote:
            '创作问题：塔罗牌如何帮助我们追问，每个派系都声称在保护城市，法师议会为何仍然分裂？关键牌提示：宝剑五正位呈现尖锐冲突、争胜的骄傲与胜利代价。故事设定：三位大法师分别夺走天气引擎的一部分，使港口保持安全，却让另一个城区持续降温。学徒必须在冬天变成武器前促成停火，并决定谁来承担修复的代价。',
          src: getTarotCard('swords-05').imageSrc,
          alt: '宝剑五（正位）',
        },
        {
          name: '轮值的审判庭',
          designation: '世界设定 · 正义（正位）',
          quote:
            '创作问题：借助塔罗牌，内战之后什么规则能让新联盟继续团结？关键牌提示：正义正位强调清楚问责、平衡判断、诚实衡量与公平交换。故事设定：河流诸省共同设立法庭，席位由昔日敌人轮流担任；每份判决都必须公开证据并修复伤害。一册失踪的账簿，可能让联盟第一次考验变成第一次清洗。',
          src: getTarotCard('major-11-justice').imageSrc,
          alt: '正义（正位）',
        },
        {
          name: '争夺灯塔的行会',
          designation: '世界设定 · 权杖五（正位）',
          quote:
            '创作问题：塔罗牌把问题指向两个行会争着定义一座城市的魔法，会发生什么？关键牌提示：权杖五正位带来活跃竞赛、能带来教训的摩擦、竞争声音与勇气考验。故事设定：玻璃匠与风暴铸师争夺同一座灯塔的能源，暗中破坏对方设计却都不承认。节庆期限迫使两派学徒合作，否则海岸将失去预警之光。',
          src: getTarotCard('wands-05').imageSrc,
          alt: '权杖五（正位）',
        },
      ],
    },
    {
      id: 'adventures',
      imagePosition: 'left',
      carouselLabel: '冒险设计创作案例',
      previousLabel: '上一个冒险案例',
      nextLabel: '下一个冒险案例',
      examples: [
        {
          name: '雾中的边境村',
          designation: '冒险设计 · 月亮（正位）',
          quote:
            '创作问题：用塔罗牌追问，边境之外的村庄雾里究竟藏着什么？关键牌提示：月亮正位带来变动的感知、梦的象征、不确定性与本能潮汐。故事设定：村民在会于夜间移动的小路旁留下灯笼，一个孩子反复梦见田地下面的溺水古道。冒险者必须判断这片雾是在警告他们、引导他们，还是一道有生命的边界。',
          src: getTarotCard('major-18-moon').imageSrc,
          alt: '月亮（正位）',
        },
        {
          name: '失控的遗迹',
          designation: '冒险设计 · 高塔（正位）',
          quote:
            '创作问题：塔罗牌让我们继续问，一座古老遗迹为什么会变成正在扩大的威胁？关键牌提示：高塔正位指向突然破裂、虚假庇护倒塌与变化带来的解放。故事设定：节庆期间，地下天文台突然裂开，露出一台一直改道河流的机器。冒险者必须穿过不断坍塌的回廊，决定回归的河水应该流向哪一座山谷。',
          src: getTarotCard('major-16-tower').imageSrc,
          alt: '高塔（正位）',
        },
        {
          name: '黎明前的商队',
          designation: '冒险设计 · 战车（正位）',
          quote:
            '创作问题：借助塔罗牌，两股力量把同一支商队向相反方向拉扯时队伍要坚持什么？关键牌提示：战车正位代表有向动能、自律驱动、驾驭对立力量与专注。故事设定：一支难民商队载着两位敌对继承人，必须在黎明前越过即将封闭的山口。冒险者要协调斥候、修好头车并选定路线，否则护卫会把旅途变成战场。',
          src: getTarotCard('major-07-chariot').imageSrc,
          alt: '战车（正位）',
        },
        {
          name: '共享溪流',
          designation: '冒险设计 · 节制（正位）',
          quote:
            '创作问题：用塔罗牌思考，一座中毒的山谷怎样在不牺牲某个村庄水源的情况下恢复？关键牌提示：节制正位强调力量融合、有度节奏、平静修复与和谐比例。故事设定：冒险者必须把医师的河流滤器与炼金师的中和盐结合，并在两次潮汐之间放水。成功依靠合作而非更强的法术，村民也因此共同建立守护溪流的仪式。',
          src: getTarotCard('major-14-temperance').imageSrc,
          alt: '节制（正位）',
        },
      ],
    },
  ],
};

const tarotCaseStudiesByLocale: Record<SiteLocale, TarotCaseStudiesCopy> = {
  en: englishTarotCaseStudies,
  zh: chineseTarotCaseStudies,
};

function isTarotLocale(locale: unknown): locale is SiteLocale {
  return locale === 'en' || locale === 'zh';
}

function describeTarotLocale(locale: unknown): string {
  if (typeof locale === 'string') {
    return JSON.stringify(locale);
  }

  const serializedLocale = JSON.stringify(locale);
  return typeof serializedLocale === 'string' ? serializedLocale : String(locale);
}

function requireTarotLocale(locale: SiteLocale): SiteLocale {
  if (isTarotLocale(locale)) {
    return locale;
  }

  throw new Error(`Unknown tarot case studies locale. Received ${describeTarotLocale(locale)}.`);
}

export function getTarotCaseStudies(locale: SiteLocale): TarotCaseStudiesCopy {
  return tarotCaseStudiesByLocale[requireTarotLocale(locale)];
}
