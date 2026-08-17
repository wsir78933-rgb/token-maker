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
      eyebrow: 'Token maker guide',
      title: 'Make a VTT token that stays readable on the map',
      paragraphs: [
        'A token maker turns character art into a compact map marker for a virtual tabletop. The result helps players and game masters identify heroes, allies, enemies, summons, and important objects when the map is zoomed out. A useful token keeps the face or silhouette recognizable without asking the original illustration to carry every detail.',
        'Some players use the phrase token stamp for this browser-based portrait-to-marker tool and workflow. Here, stamp refers to the framing process; the exported file is still a map-ready token or transparent PNG. A browser token maker frames the subject, adds a consistent edge, and prepares the artwork as practical campaign UI. Keeping the workflow focused makes the result easier for the table to read at a glance.',
      ],
      takeawaysLabel: 'What a token maker needs on a battle map',
      takeaways: [
        'A stamp crop that favors the face, pose, or strongest silhouette.',
        'A stamp border with enough contrast for both light and dark maps.',
        'A consistent visual rule so players can distinguish allies, enemies, and special units.',
      ],
      cta: 'Start in the token maker',
    },
    workflow: {
      eyebrow: 'From portrait to play',
      title: 'A practical three-step token workflow',
      introduction:
        'A dependable token maker workflow comes from a few deliberate choices, not from adding every available effect. Use this stamp sequence to keep each result clear when preparing one hero or an entire encounter.',
      steps: [
        {
          title: 'Upload art and choose the focal point',
          body:
            'Begin with the clearest source image you have. The stamp workspace in the maker lets you center the face for dialogue-heavy characters or preserve more of the pose when a weapon, wings, or creature silhouette carries the identity. Leave a little breathing room around the subject so the crop does not cut off important details. Review the stamp crop in the maker preview before moving on.',
        },
        {
          title: 'Match the mask and border to the role',
          body:
            'In the maker, choose a circle, square, or polygon mask based on the role on the map. A stamp contrast check should cover both pale floors and dark dungeon art. Reuse a small set of colors or labels to communicate factions and status without making the portrait harder to read, then save that choice in your stamp settings.',
        },
        {
          title: 'Export, import, and check at map scale',
          body:
            'Place the transparent PNG in Roll20, Foundry VTT, or Owlbear and inspect it at the zoom level used during play. If the token loses its face or its edge blends into the scene, return to the maker and adjust the crop or border. Compare the stamp preview with the imported result. A final stamp check prevents repeated resizing during a session.',
        },
      ],
      cta: 'Open the token maker',
    },
    useCases: {
      eyebrow: 'Campaign use cases',
      title: 'Give Every Character a Look Worthy of Your Campaign',
      introduction:
        'A carefully built campaign deserves more than mismatched character portraits. Use Token Maker to give heroes, NPCs, and monsters a shared visual language while preserving the face, faction cue, or silhouette that makes each one distinct.',
      cards: [
        {
          title: 'Player characters and recurring allies',
          body:
            'A character token maker should keep the face recognizable and preserve one signature detail, such as a hat, weapon, or color. In a character stamp workflow, give the border a stable treatment so the same hero remains easy to find across towns, dungeons, and large combats. Reusing the stamp settings keeps later portraits consistent even when the surrounding map changes.',
          linkLabel: 'Make a character token',
          linkTarget: 'editor',
        },
        {
          title: 'NPCs, factions, and social scenes',
          body:
            'An NPC token maker can apply related border colors to guards, guilds, rivals, or family groups while keeping individual portraits distinct. During a stamp session, give each supporting character one clear face and a faction cue. Save that visual language as a stamp preset so busy social scenes remain easier to scan and the game master can reuse the same cast.',
          linkLabel: 'Browse character guides',
          linkTarget: 'classGuide',
        },
        {
          title: 'Monsters, summons, and encounter markers',
          body:
            'A monster token maker should prioritize the creature silhouette, unusual head shape, or defining feature instead of forcing every image into a face-first crop. Use the same maker setup throughout the stamp workflow so variants share a visual family, then save one clear accent as the stamp treatment for elite or boss units.',
          linkLabel: 'Explore monster ideas',
          linkTarget: 'monsterGuide',
        },
      ],
    },
    shapes: {
      eyebrow: 'Shape decisions',
      title: 'Circle, Square, or Polygon? Let the Map Decide',
      introduction:
        'Use circles for portrait-led characters, squares when the composition needs room, and polygons for bosses or objectives. The best shape is the one that stays clear at the scale your players actually see.',
      choices: [
        {
          title: 'Circle for quick character recognition',
          body:
            'A circular stamp mask suits portraits, player characters, and most creatures because the centered shape draws attention to a face. In the stamp preview, the round result also remains visually distinct from square map tiles and scenery.',
        },
        {
          title: 'Square for more of the original composition',
          body:
            'A square stamp mask preserves shoulders, equipment, mounts, and wider silhouettes. The wider stamp frame suits grid-aligned markers, props, or artwork that feels cramped inside a circle.',
        },
        {
          title: 'Polygon for factions and special units',
          body:
            'Polygon stamp masks can separate bosses, objectives, summons, or faction leaders from ordinary units. Save the shape as a special stamp preset so it becomes a readable campaign signal, not a one-off effect.',
        },
      ],
      closing:
        'When you are unsure, compare the same portrait in two shapes inside the stamp preview. Pick the version that keeps the subject readable before adding more decoration. If both work, save the easier-to-recognize option in your stamp settings.',
      linkLabel: 'See the square token workflow',
    },
    faq: {
      eyebrow: 'Practical answers',
      title: 'Practical token-making questions',
      introduction:
        'These answers cover the maker and stamp choices that affect clarity and consistency before a token reaches your VTT.',
      items: [
        {
          question: 'What is a token stamp, and when should you use one?',
          answer:
            'Token stamp describes a browser-based maker workflow for character tokens. Use the stamp workflow when you already have a portrait and need a consistent crop, border, shape, and transparent PNG output for an upcoming game.',
        },
        {
          question: 'What source image produces the clearest result?',
          answer:
            'Choose art with a distinct subject, enough resolution for a clean crop, and visible separation between the character and background. Check both the maker and stamp previews at map scale: strong lighting and an identifiable silhouette usually produce a clearer token than tiny costume details or a very large source file. A clean source also keeps the stamp mask edge easier to recognize.',
        },
        {
          question: 'How tightly should I crop a character portrait?',
          answer:
            'Set the maker crop close enough that the face or defining feature survives when the map is zoomed out, but leave space between that feature and the border. During large-creature stamp setup, favor the head and silhouette instead of squeezing the complete body into the frame. A final stamp preview should not feel crowded against its border.',
        },
        {
          question: 'Should I use a circular, square, or polygon mask?',
          answer:
            'Use the maker to compare circles for portrait-led characters, squares when composition or equipment needs more room, and polygons for special categories. Choose one rule for each role in the stamp workflow and save the maker settings; campaign consistency is more useful than changing shape for every illustration.',
        },
        {
          question: 'How do I keep a campaign token library consistent?',
          answer:
            'Keep a small maker recipe for crop distance, border color, shape, labels, export size, and file names. Apply that stamp recipe by role or faction, then compare every new token with older files at the same map scale. Run one final stamp consistency check before adding it to the library.',
        },
      ],
      linkLabel: 'Read export, compatibility, and privacy answers',
    },
  },
  zh: {
    definition: {
      eyebrow: 'Token Maker 制作指南',
      title: '制作一枚放到 VTT 地图上仍然清楚的 Token',
      paragraphs: [
        'Token Maker 会把角色立绘整理成适合虚拟桌面的小型地图标记。当地图缩小显示时，得到的结果能帮助玩家和 GM 快速分辨英雄、盟友、敌人、召唤物与关键道具。实用的 Token 不需要保留原图中的每一处细节，更重要的是让脸部、姿态或轮廓在地图尺寸下仍然容易认出。',
        '有些玩家会用英文 token stamp 来搜索这类浏览器制作工具与“立绘变标记”的流程。这里的 stamp 指构图和加框过程；导出物仍然是地图可用的 Token 或透明 PNG。浏览器 Token Maker 负责确定取景、添加统一边缘，并把原图整理成实用的战役界面素材。保持这套流程简单，能让桌上的人更快看懂最终结果。',
      ],
      takeawaysLabel: 'Token Maker 在战斗地图上需要注意什么',
      takeaways: [
        '制作流程中的裁切优先保留脸部、姿态或最有辨识度的轮廓。',
        '制作流程中的边框要与明暗地图都有足够对比，缩小后不会融进背景。',
        '建立统一的视觉规则，让玩家能区分盟友、敌人与特殊单位。',
      ],
      cta: '进入 Token Maker 开始制作',
    },
    workflow: {
      eyebrow: '从立绘到开团',
      title: '从立绘到 VTT：三步完成 Token',
      introduction:
        '稳定的 Token Maker 流程来自几次有目的的选择，而不是把所有效果都堆上去。无论你在准备一名英雄还是整场遭遇，都可以按这套制作顺序让每枚成品保持清楚。',
      steps: [
        {
          title: '上传立绘并确定视觉中心',
          body:
            '先使用你手里最清楚的原图。制作工作区可以把对话较多角色的脸部放在中心；如果武器、翅膀或怪物轮廓才是身份特征，就多保留一些姿态。主体周围要留出少量空间，避免裁掉发型、角、武器等关键细节。进入下一步之前，再在制作器预览中检查裁切结果。',
        },
        {
          title: '按照角色用途选择遮罩与边框',
          body:
            '在制作器中，根据角色在地图上的用途选择圆形、方形或多边形遮罩。边框对比检查要同时覆盖浅色地板和深色地城画面。可以重复使用少量颜色或文字标签来表达阵营、派系和状态，但不要让装饰抢走角色本身的辨识度；确定后把这套选择保存为制作设置。',
        },
        {
          title: '导出、导入，并在地图尺寸下检查',
          body:
            '把透明 PNG 放进 Roll20、Foundry VTT 或 Owlbear，再用开团时常用的缩放比例检查。如果 Token 中的脸部消失或边缘融进场景，就回到制作器调整裁切和边框。把制作器预览与导入结果进行比较，最后再检查一次，可以避免游戏过程中反复改尺寸。',
        },
      ],
      cta: '打开 Token Maker',
    },
    useCases: {
      eyebrow: '战役使用场景',
      title: '让每个角色都配得上你的战役',
      introduction:
        '精心准备的战役，不该被风格混乱的角色肖像破坏。使用 Token Maker 为英雄、NPC 和怪物建立统一的视觉语言，同时保留脸部、派系线索或轮廓中最有辨识度的部分。',
      cards: [
        {
          title: '玩家角色与长期盟友',
          body:
            '角色 Token Maker 应该让脸部保持清楚，同时保留帽子、武器或代表色等一处标志性细节。在角色制作流程中使用稳定边框，同一名英雄在城镇、地城和大型战斗中都会更容易找到。复用这些制作设置，也能让之后加入的肖像保持一致，即使周围地图发生变化也不会显得陌生。',
          linkLabel: '制作角色 Token',
          linkTarget: 'editor',
        },
        {
          title: 'NPC、派系与社交场景',
          body:
            'NPC Token Maker 可以为守卫、公会、对手或家族使用有关联的边框颜色，同时保留每张脸的区别。制作时，给每名配角留下一张清楚的脸和一个派系线索，再把这套视觉语言保存为派系预设。这样既能单独识别角色，也能表现群体关系，让 GM 在拥挤场景中重复使用同一批人物。',
          linkLabel: '浏览角色指南',
          linkTarget: 'classGuide',
        },
        {
          title: '怪物、召唤物与遭遇标记',
          body:
            '怪物 Token Maker 应该优先保留生物轮廓、独特头部或最关键的特征，不要强迫每张图片都使用以脸部为中心的裁切。在整套制作流程中复用同一组设置，让同类变体共享视觉家族，再把一处明确强调保存为精英或 Boss 的专用处理。',
          linkLabel: '查看怪物灵感',
          linkTarget: 'monsterGuide',
        },
      ],
    },
    shapes: {
      eyebrow: '形状选择',
      title: '圆形、方形还是多边形？让地图用途来决定',
      introduction:
        '肖像角色适合圆形，需要保留构图时选择方形，Boss 和任务目标可以使用多边形。最合适的形状，是玩家在实际地图比例下仍能看清的那一种。',
      choices: [
        {
          title: '圆形：快速识别角色',
          body:
            '圆形遮罩适合肖像、玩家角色和大多数生物，因为居中的形状会把注意力引向脸部。在制作器预览中，圆形结果也能与方形地图格、地块和场景物件形成明显区别。',
        },
        {
          title: '方形：保留更多原始构图',
          body:
            '方形遮罩可以留下肩部、装备、坐骑和较宽的轮廓。更宽的取景范围适合对齐网格的标记、道具，或放进圆形后显得过于拥挤的立绘。',
        },
        {
          title: '多边形：标记派系与特殊单位',
          body:
            '多边形遮罩可以把 Boss、目标、召唤物或派系领袖从普通单位中分离出来。把这种形状保存为特殊单位预设，让它成为可读的战役信号，而不是只出现一次的特效。',
        },
      ],
      closing:
        '如果拿不准，就在制作器预览中用同一张立绘比较两种形状。先选择主体更清楚的版本，再考虑增加更多装饰。如果两种都可用，就把不放大也更容易辨认的选项保存到制作设置。',
      linkLabel: '查看方形 Token 制作流程',
    },
    faq: {
      eyebrow: '实用解答',
      title: 'Token 制作中的常见实用问题',
      introduction:
        '下面集中回答 Token 进入 VTT 之前，最影响清晰度与整套素材一致性的制作器和制作流程选择。',
      items: [
        {
          question: '什么是 token stamp，什么时候适合使用？',
          answer:
            'token stamp 指一种在浏览器中制作角色 Token 的工具和流程。当你已经有肖像，并希望统一裁切、边框和形状，再得到透明 PNG 成品时，就适合使用这类制作流程。',
        },
        {
          question: '什么样的原图能得到最清楚的结果？',
          answer:
            '优先选择主体明确、分辨率足够裁切，并且角色与背景有明显分离的图片。在制作器和裁切预览中检查地图尺寸：清楚的光线和有辨识度的轮廓，通常比服装上的微小细节或单纯很大的原文件更容易得到清楚 Token；干净的原图也会让遮罩边缘更容易识别。',
        },
        {
          question: '角色肖像应该裁得多紧？',
          answer:
            '在制作器里把裁切收紧到脸部或核心特征在地图缩小时仍然看得见，同时在特征与边框之间留出空间。制作大型生物 Token 时，优先保留头部和轮廓，不必为了放进完整身体而把所有细节都缩得很小；最后一次预览不应该显得贴着边框。',
        },
        {
          question: '应该使用圆形、方形还是多边形遮罩？',
          answer:
            '在制作器中比较三种选择：以肖像为主的角色适合圆形；需要保留构图或装备时选择方形；希望玩家快速识别特殊类别时使用多边形。在制作流程中为每类角色确定一套规则并保留设置，比每张立绘都换一种形状更有价值。',
        },
        {
          question: '怎样让战役 Token 素材库保持一致？',
          answer:
            '为裁切距离、边框颜色、形状、文字、导出尺寸和文件名保留一份简短的制作器配方，再按角色用途或派系执行。每枚新 Token 都要与旧文件在相同地图比例下并排比较，并在加入素材库前完成最后一次一致性检查。',
        },
      ],
      linkLabel: '继续查看导出、兼容性与隐私问题',
    },
  },
};

export function getHomeSeoContentCopy(locale: SiteLocale): HomeSeoContentCopy {
  return homeSeoContentCopy[locale];
}
