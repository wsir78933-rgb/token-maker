import type { SiteLocale } from '@/lib/site-locale';

export type HomeSeoLinkTarget =
  | 'editor'
  | 'classGuide'
  | 'monsterGuide'
  | 'squareTemplate'
  | 'faq';

type LinkedContentCard = {
  title: string;
  body: string;
  linkLabel: string;
  linkTarget: HomeSeoLinkTarget;
};

type HomeSeoContentCopy = {
  definition: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    takeawaysLabel: string;
    takeaways: string[];
    cta: string;
  };
  workflow: {
    eyebrow: string;
    title: string;
    introduction: string;
    steps: Array<{ title: string; body: string }>;
    cta: string;
  };
  useCases: {
    eyebrow: string;
    title: string;
    introduction: string;
    cards: LinkedContentCard[];
  };
  shapes: {
    eyebrow: string;
    title: string;
    introduction: string;
    choices: Array<{ title: string; body: string }>;
    closing: string;
    linkLabel: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    introduction: string;
    items: Array<{ question: string; answer: string }>;
    linkLabel: string;
  };
};

const homeSeoContentCopy: Record<SiteLocale, HomeSeoContentCopy> = {
  en: {
    definition: {
      eyebrow: 'Token-making guide',
      title: 'Make a VTT token that stays readable on the map',
      paragraphs: [
        'A tabletop token is a compact map marker made from character art. It gives players and game masters a clear way to identify heroes, allies, enemies, summons, and important objects when a virtual tabletop is zoomed out. A useful token keeps the face or silhouette recognizable without asking the original illustration to carry every detail.',
        'Some players use the phrase token stamp for this same quick portrait-to-marker workflow: choose an image, frame the subject, add a consistent edge, and export the result for play. The aim is not to replace the artwork. It is to turn that artwork into a practical piece of campaign UI that can be read at a glance.',
      ],
      takeawaysLabel: 'What matters on a battle map',
      takeaways: [
        'A crop that favors the face, pose, or strongest silhouette.',
        'Enough border contrast to separate the token from light and dark maps.',
        'A consistent visual rule so players can distinguish allies, enemies, and special units.',
      ],
      cta: 'Start with your character art',
    },
    workflow: {
      eyebrow: 'From portrait to play',
      title: 'A practical three-step token workflow',
      introduction:
        'Good results come from a few deliberate choices, not from adding every available effect. Use this sequence when preparing one hero or an entire encounter.',
      steps: [
        {
          title: 'Upload and choose the focal point',
          body:
            'Begin with the clearest source image you have. Center the face for dialogue-heavy characters, or preserve more of the pose when a weapon, wings, or creature silhouette carries the identity. Leave a little breathing room around the subject so the border does not cut into important details.',
        },
        {
          title: 'Match the mask and border to the role',
          body:
            'Select a circle, square, or polygon mask based on how the token will be used. Then choose a border with enough contrast for the maps in your campaign. Reuse a small set of border colors or labels to communicate factions and status without making the portrait harder to read.',
        },
        {
          title: 'Export, import, and check at map scale',
          body:
            'Export a transparent PNG, place it in Roll20, Foundry VTT, or Owlbear, and inspect it at the zoom level used during play. If the face disappears or the edge blends into the scene, return to the crop or border. That quick check prevents repeated resizing during a session.',
        },
      ],
      cta: 'Open the token editor',
    },
    useCases: {
      eyebrow: 'Campaign use cases',
      title: 'Build tokens for every role in the encounter',
      introduction:
        'The best crop and visual treatment depend on what the marker needs to communicate during play. Start with the role, then decide how much detail belongs inside the frame.',
      cards: [
        {
          title: 'Player characters and recurring allies',
          body:
            'Keep the face recognizable and preserve one signature detail, such as a hat, weapon, or color. A stable border helps the same character remain easy to find across towns, dungeons, and large combats. This is the everyday job of a character token maker.',
          linkLabel: 'Make a character token',
          linkTarget: 'editor',
        },
        {
          title: 'NPCs, factions, and social scenes',
          body:
            'Use related border colors for guards, guilds, rivals, or family groups, while keeping individual portraits distinct. A clear NPC token maker workflow makes busy scenes easier to scan and lets the game master reuse important supporting characters without rebuilding their look.',
          linkLabel: 'Browse character guides',
          linkTarget: 'classGuide',
        },
        {
          title: 'Monsters, summons, and encounter markers',
          body:
            'Prioritize the creature silhouette, unusual head shape, or defining feature instead of forcing every monster into a face-first crop. With a repeatable monster token maker setup, variants can share a visual family while elite or summoned units receive a clear accent.',
          linkLabel: 'Explore monster ideas',
          linkTarget: 'monsterGuide',
        },
      ],
    },
    shapes: {
      eyebrow: 'Shape decisions',
      title: 'Choose the right token shape',
      introduction:
        'Shape is more than decoration. It changes how much artwork survives the crop and how naturally the finished token sits on a grid.',
      choices: [
        {
          title: 'Circle for quick character recognition',
          body:
            'Circular tokens suit portraits, player characters, and most creatures because the centered shape draws attention to a face. They also remain visually distinct from square map tiles and scenery.',
        },
        {
          title: 'Square for more of the original composition',
          body:
            'Square tokens preserve shoulders, equipment, mounts, and wider silhouettes. They are useful for grid-aligned markers, props, or artwork that feels cramped inside a circle.',
        },
        {
          title: 'Polygon for factions and special units',
          body:
            'Polygon masks can separate bosses, objectives, summons, or faction leaders from ordinary units. Use the shape consistently so it becomes a readable campaign signal, not a one-off effect.',
        },
      ],
      closing:
        'When you are unsure, test the same portrait in two shapes at the size used on your map. Pick the version that keeps the subject readable before adding more decoration.',
      linkLabel: 'See the square token workflow',
    },
    faq: {
      eyebrow: 'Practical answers',
      title: 'Practical token-making questions',
      introduction:
        'These answers focus on the decisions that affect clarity and consistency before a token reaches your VTT.',
      items: [
        {
          question: 'What is a token stamp, and when should you use one?',
          answer:
            'Token stamp commonly describes a fast browser workflow that turns existing character art into a framed tabletop marker. Use it when you already have a portrait and need a consistent crop, border, shape, and transparent PNG for an upcoming game.',
        },
        {
          question: 'What kind of image makes the clearest token?',
          answer:
            'Choose art with a distinct subject, enough resolution for a clean crop, and visible separation between the character and background. Strong lighting and an identifiable silhouette matter more at map scale than tiny costume details or a very large source file.',
        },
        {
          question: 'How tightly should I crop a character portrait?',
          answer:
            'Crop close enough that the face or defining feature survives when the map is zoomed out, but leave space between that feature and the border. For large creatures, favor the head and silhouette instead of squeezing the complete body into the frame.',
        },
        {
          question: 'Should I use a circular, square, or polygon token?',
          answer:
            'Use circles for portrait-led characters, squares when composition or equipment needs more room, and polygons for special categories you want players to recognize quickly. Consistency across the campaign is more useful than choosing a different shape for every illustration.',
        },
        {
          question: 'How do I keep a campaign token library consistent?',
          answer:
            'Pick a small set of rules for crop distance, border color, shape, labels, export size, and file names. Apply them by role or faction, then check new tokens beside older ones at the same scale before adding them to your library.',
        },
      ],
      linkLabel: 'Read export, compatibility, and privacy answers',
    },
  },
  zh: {
    definition: {
      eyebrow: 'Token 制作指南',
      title: '制作一枚放到 VTT 地图上仍然清楚的 Token',
      paragraphs: [
        '跑团 Token 是从角色立绘中提炼出来的小型地图标记。当虚拟桌面缩小显示时，它帮助玩家和 GM 快速分辨英雄、盟友、敌人、召唤物与关键道具。实用的 Token 不需要保留原图中的每一处细节，更重要的是让脸部、姿态或轮廓在地图尺寸下仍然容易认出。',
        '有些玩家也会用英文 token stamp 来搜索这类“立绘变标记”的快速流程：选择图片、确定取景、添加统一边缘，再导出到跑团平台。它并不是替代原始插画，而是把插画整理成可在战役中反复使用的界面元素，让桌上的人一眼就知道这枚标记代表谁。',
      ],
      takeawaysLabel: '战斗地图上真正重要的事',
      takeaways: [
        '裁切时优先保留脸部、姿态或最有辨识度的轮廓。',
        '边框要与明暗地图都有足够对比，缩小后不会融进背景。',
        '建立统一规则，让玩家能区分盟友、敌人与特殊单位。',
      ],
      cta: '从你的角色立绘开始',
    },
    workflow: {
      eyebrow: '从立绘到开团',
      title: '从立绘到 VTT：三步完成 Token',
      introduction:
        '清楚好用的结果来自几次有目的的选择，而不是把所有效果都堆上去。无论你在准备一名英雄还是整场遭遇，都可以按这个顺序处理。',
      steps: [
        {
          title: '上传图片并确定视觉中心',
          body:
            '先使用你手里最清楚的原图。对话较多的角色可以把脸部放在中心；如果武器、翅膀或怪物轮廓才是身份特征，就多保留一些姿态。主体周围要留出少量空间，避免边框压住发型、角、武器等关键细节。',
        },
        {
          title: '按照角色用途选择遮罩与边框',
          body:
            '根据 Token 的实际用途选择圆形、方形或多边形遮罩，再挑一条能适应战役地图的高对比边框。可以重复使用少量边框颜色或文字标签来表达阵营、派系和状态，但不要让装饰抢走角色本身的辨识度。',
        },
        {
          title: '导出、导入，并在地图尺寸下检查',
          body:
            '导出透明 PNG，放进 Roll20、Foundry VTT 或 Owlbear，再用开团时常用的缩放比例检查。如果脸部消失或边缘融进场景，就回到裁切和边框继续调整。开团前多做这一次检查，可以避免游戏过程中反复改尺寸。',
        },
      ],
      cta: '打开 Token 编辑器',
    },
    useCases: {
      eyebrow: '战役使用场景',
      title: '为遭遇中的每个角色制作合适的 Token',
      introduction:
        '最佳裁切和视觉处理取决于这枚标记在游戏中需要传达什么。先明确角色用途，再决定画面里应该留下多少细节。',
      cards: [
        {
          title: '玩家角色与长期盟友',
          body:
            '让脸部保持清楚，同时保留帽子、武器或代表色等一处标志性细节。稳定的边框规则能让同一角色在城镇、地城和大型战斗中始终容易找到。这是角色 Token 制作器最常见、也最需要保持一致的任务。',
          linkLabel: '制作角色 Token',
          linkTarget: 'editor',
        },
        {
          title: 'NPC、派系与社交场景',
          body:
            '为守卫、公会、对手或家族使用有关联的边框颜色，同时保留每张脸的区别。清楚的 NPC Token 制作流程能让拥挤场景更容易浏览，也方便 GM 再次调用重要配角，而不用重新设计其外观。',
          linkLabel: '浏览角色指南',
          linkTarget: 'classGuide',
        },
        {
          title: '怪物、召唤物与遭遇标记',
          body:
            '优先保留怪物轮廓、独特头部或最关键的特征，不要强迫所有生物都使用以脸部为中心的裁切。建立可重复的怪物 Token 制作规则后，同类变体可以共享视觉家族，精英或召唤单位则用明确强调来区分。',
          linkLabel: '查看怪物灵感',
          linkTarget: 'monsterGuide',
        },
      ],
    },
    shapes: {
      eyebrow: '形状选择',
      title: '如何选择 Token 的形状',
      introduction:
        '形状不只是装饰。它会改变原画有多少内容能留在裁切范围内，也会影响成品放到网格上之后是否自然。',
      choices: [
        {
          title: '圆形：快速识别角色',
          body:
            '圆形适合肖像、玩家角色和大多数生物，因为居中的形状会把注意力引向脸部。它也能与方形地图格、地块和场景物件形成明显区别。',
        },
        {
          title: '方形：保留更多原始构图',
          body:
            '方形可以留下肩部、装备、坐骑和较宽的轮廓。它适合对齐网格的标记、道具，或放进圆形后显得过于拥挤的立绘。',
        },
        {
          title: '多边形：标记派系与特殊单位',
          body:
            '多边形可以把 Boss、目标、召唤物或派系领袖从普通单位中分离出来。要稳定使用同一规则，让形状成为可读的战役信号，而不是只出现一次的特效。',
        },
      ],
      closing:
        '如果拿不准，就用同一张立绘测试两种形状，并缩放到实际地图尺寸。先选择主体更清楚的版本，再考虑增加更多装饰。',
      linkLabel: '查看方形 Token 制作流程',
    },
    faq: {
      eyebrow: '实用解答',
      title: 'Token 制作中的常见实用问题',
      introduction:
        '下面集中回答 Token 进入 VTT 之前，最影响清晰度与整套素材一致性的几个决定。',
      items: [
        {
          question: '什么是 token stamp，什么时候适合使用？',
          answer:
            'token stamp 通常指一种快速的浏览器制作流程：把现有角色立绘整理成带边框的跑团标记。当你已经有肖像，并希望在开团前统一裁切、边框、形状，再导出透明 PNG 时，就适合使用这类流程。',
        },
        {
          question: '什么样的图片能做出最清楚的 Token？',
          answer:
            '优先选择主体明确、分辨率足够裁切，并且角色与背景有明显分离的图片。在地图尺寸下，清楚的光线和有辨识度的轮廓，比服装上的微小细节或单纯很大的原文件更重要。',
        },
        {
          question: '角色肖像应该裁得多紧？',
          answer:
            '裁切要让脸部或核心特征在地图缩小时仍然看得见，但也要在特征与边框之间留出空间。处理大型生物时，优先保留头部和轮廓，不必为了放进完整身体而把所有细节都缩得很小。',
        },
        {
          question: '应该使用圆形、方形还是多边形 Token？',
          answer:
            '以肖像为主的角色适合圆形；需要保留构图或装备时选择方形；希望玩家快速识别特殊类别时使用多边形。对整场战役而言，稳定执行一套规则，比每张立绘都换一种形状更有价值。',
        },
        {
          question: '怎样让战役 Token 素材库保持一致？',
          answer:
            '为裁切距离、边框颜色、形状、文字、导出尺寸和文件名确定少量规则，再按角色用途或派系执行。新 Token 加入素材库之前，把它与旧 Token 放在相同缩放比例下并排检查。',
        },
      ],
      linkLabel: '继续查看导出、兼容性与隐私问题',
    },
  },
};

export function getHomeSeoContentCopy(locale: SiteLocale): HomeSeoContentCopy {
  return homeSeoContentCopy[locale];
}
