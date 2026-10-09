import type { SiteLocale } from '@/lib/site-locale';
import { getMapMakerShowcaseCopy, type MapMakerShowcaseCopy } from '@/lib/map-maker/showcase-copy';

export type MapMakerFeatureIcon = 'coastline' | 'random' | 'elements' | 'labels' | 'saves' | 'export';

export type MapMakerPageCopy = {
  readonly whatIs: {
    readonly title: string;
    readonly description: string;
  };
  readonly showcase: MapMakerShowcaseCopy;
  readonly features: {
    readonly title: string;
    readonly description: string;
    readonly items: readonly {
      readonly icon: MapMakerFeatureIcon;
      readonly title: string;
      readonly description: string;
    }[];
  };
  readonly comparison: {
    readonly title: string;
    readonly description: string;
    readonly tableLabel: string;
    readonly dimensionHeading: string;
    readonly mapMakerHeading: string;
    readonly photoshopHeading: string;
    readonly illustratorHeading: string;
    readonly rows: readonly {
      readonly dimension: string;
      readonly mapMaker: string;
      readonly photoshop: string;
      readonly illustrator: string;
    }[];
  };
  readonly howItWorks: {
    readonly eyebrow: string;
    readonly title: string;
    readonly steps: readonly {
      readonly title: string;
      readonly description: string;
    }[];
  };
  readonly callToAction: {
    readonly title: string;
    readonly description: string;
    readonly label: string;
  };
  readonly faq: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly {
      readonly question: string;
      readonly answer: string;
    }[];
  };
};

const englishPageCopy: MapMakerPageCopy = {
  whatIs: {
    title: 'What is Map Maker?',
    description:
      'Map Maker is a free online fantasy map tool for game masters, players, and worldbuilders. Build coastlines with tiles, place mountains, forests, and landmarks on two element layers, add place names, save in this browser or as a JSON project file, and download a PNG of the base map and visible, freely placed map elements.',
  },
  showcase: getMapMakerShowcaseCopy('en'),
  features: {
    title: 'Shape your fantasy map',
    description: 'Build the coastline and add landmarks with Map Maker, keeping an editable project as your world takes shape.',
    items: [
      {
        icon: 'coastline',
        title: 'Build the coast tile by tile',
        description: 'Use Map Maker’s built-in coastline tiles to replace one base tile or a selected group and shape land and shoreline.',
      },
      {
        icon: 'random',
        title: 'Start with a random coastline',
        description: 'Map Maker randomizes only the base tiles when you generate a compatible layout, leaving placed elements and labels in place.',
      },
      {
        icon: 'elements',
        title: 'Place features on two layers',
        description: 'Place natural features, buildings, plants, water details, and ships on either of Map Maker’s two element layers.',
      },
      {
        icon: 'labels',
        title: 'Name places on the map',
        description: 'Add place labels, edit their text on the canvas or in properties, and adjust placement with Map Maker.',
      },
      {
        icon: 'saves',
        title: 'Keep editable project files',
        description: 'Store a Map Maker project in one of eight browser slots, or download its JSON project file to continue later.',
      },
      {
        icon: 'export',
        title: 'Download a PNG map',
        description: 'A Map Maker PNG includes the base map and currently visible, freely placed map elements; labels and grid overlays are excluded.',
      },
    ],
  },
  comparison: {
    title: 'Why use Map Maker for fantasy maps?',
    description:
      'Map Maker offers ready-to-use map assets for shaping coastlines, placing landmarks, and saving an adventure world. The tile-based workflow helps you shape coastlines without professional drawing skills.',
    tableLabel: 'Map Maker advantages compared with drawing tools',
    dimensionHeading: 'Comparison point',
    mapMakerHeading: 'Map Maker',
    photoshopHeading: 'Photoshop',
    illustratorHeading: 'Illustrator',
    rows: [
      {
        dimension: 'Asset preparation',
        mapMaker: 'Choose from built-in coastline, mountain, forest, and other map assets.',
        photoshop: 'Prepare, import, or draw the materials you want to use.',
        illustrator: 'Prepare, import, or draw the materials you want to use.',
      },
      {
        dimension: 'Learning curve',
        mapMaker: 'Select a cell, then choose a tile to replace it—a straightforward way to get started.',
        photoshop: 'Requires familiarity with layers and raster-editing tools.',
        illustrator: 'Requires familiarity with objects and vector-path tools.',
      },
      {
        dimension: 'Coastline creation',
        mapMaker: 'Combine ready-made tiles to shape a coast without drawing it from scratch.',
        photoshop: 'Draw and adjust coastlines with drawing tools.',
        illustrator: 'Draw and adjust coastlines with vector paths.',
      },
      {
        dimension: 'Quick start',
        mapMaker: 'Generate a coastline base in one click, then edit it for your setting.',
        photoshop: 'Start with a base you draw or import.',
        illustrator: 'Start with a base you draw or import.',
      },
      {
        dimension: 'Saving and continuing',
        mapMaker: 'Save and load maps with eight browser slots.',
        photoshop: 'Save and manage maps as documents.',
        illustrator: 'Save and manage maps as documents.',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'A simple map-making flow',
    title: 'How does Map Maker work?',
    steps: [
      {
        title: 'Shape the coastline',
        description: 'In Map Maker, start from the sea-grid base or generate a compatible coastline, then replace individual tiles or selected groups.',
      },
      {
        title: 'Add features and place names',
        description: 'Place map assets on either of Map Maker’s two element layers, then add labels and adjust their text and position.',
      },
      {
        title: 'Save the project or download an image',
        description: 'Save a Map Maker project in one of eight browser slots or download its JSON file to continue later. The PNG export includes the base map and currently visible, freely placed map elements; it excludes labels and grid overlays.',
      },
    ],
  },
  callToAction: {
    title: 'Ready to map your next adventure?',
    description: 'Open Map Maker to shape a coastline, place landmarks, and label locations in your world.',
    label: 'Start making a map',
  },
  faq: {
    eyebrow: 'Map making questions',
    title: 'Map Maker FAQ',
    description: 'How Map Maker handles manual editing, random generation, saving, and PNG export.',
    items: [
      {
        question: 'Can I shape the coastline myself?',
        answer:
          'Yes. Map Maker starts with the default sea grid, where you can replace one tile or a selected group. Random generation is optional and changes only the base tiles, leaving placed elements and labels in place.',
      },
      {
        question: 'What can I add to a map?',
        answer:
          'Use coastline tiles for the base, then place natural features, buildings, plants, water details, and ships on either element layer. Add and edit place labels separately.',
      },
      {
        question: 'What is included in a PNG download?',
        answer:
          'The PNG contains the base map and currently visible, freely placed map elements. It does not include text labels or square and hex grid overlays.',
      },
      {
        question: 'How can I save and reopen a map?',
        answer:
          'Save a Map Maker project in one of eight slots in the current browser, or download its JSON project file and load it later. Loading replaces the current map.',
      },
      {
        question: 'Can I use the editor on a phone?',
        answer:
          'Yes. The controls rearrange for a narrow screen, with materials, layers, and properties available from the bottom navigation.',
      },
    ],
  },
};

const chinesePageCopy: MapMakerPageCopy = {
  whatIs: {
    title: '什么是地图制作器？',
    description:
      '地图制作器是一款免费的在线奇幻地图工具，适合桌面角色扮演游戏的主持人、玩家和奇幻世界创作者。你可以用海岸拼块搭建底图，在两个元素层中放置山脉、森林和地标，添加地点名称，并通过当前浏览器存档或工程文件保存地图，再下载包含底图与当前显示的自由摆放元素的 PNG。',
  },
  showcase: getMapMakerShowcaseCopy('zh'),
  features: {
    title: '绘制自己的奇幻地图',
    description: '地图制作器把海岸拼块、地标放置与工程保存放在同一套编辑流程中。',
    items: [
      {
        icon: 'coastline',
        title: '逐格拼出海岸线',
        description: '底图由地图制作器的海岸拼块构成，可替换单个拼块或一组已选格子，塑造陆地与海岸轮廓。',
      },
      {
        icon: 'random',
        title: '随机生成海岸底图',
        description: '地图制作器可生成边缘匹配的随机底图，同时保留已放置的元素和文字标签。',
      },
      {
        icon: 'elements',
        title: '在两个图层放置元素',
        description: '山脉、森林、建筑、植物、水域细节与船只，都可通过地图制作器放到两个元素层之一。',
      },
      {
        icon: 'labels',
        title: '标注地图地点',
        description: '地图制作器的地点文字可在画布或属性面板中编辑，并调整标签位置。',
      },
      {
        icon: 'saves',
        title: '保留可编辑工程',
        description: '保存时，地图制作器提供当前浏览器的 8 个存档位置，也可下载工程文件以便之后继续编辑。',
      },
      {
        icon: 'export',
        title: '下载 PNG 地图',
        description: '从地图制作器下载的 PNG 包含底图和当前显示的自由摆放元素；文字标签与网格覆盖层不在图中。',
      },
    ],
  },
  comparison: {
    title: '为什么用地图制作器制作奇幻地图？',
    description: '地图制作器提供现成地图素材，方便你拼出海岸、摆放地标并保存冒险世界。无需从空白画布开始，也无需掌握专业绘图操作。',
    tableLabel: '地图制作器优势与绘图工具对比',
    dimensionHeading: '对比角度',
    mapMakerHeading: '地图制作器',
    photoshopHeading: 'Photoshop',
    illustratorHeading: 'Illustrator',
    rows: [
      {
        dimension: '素材准备',
        mapMaker: '内置海岸、山脉、森林等地图素材，直接选用。',
        photoshop: '自行准备、导入或绘制素材。',
        illustrator: '自行准备、导入或绘制素材。',
      },
      {
        dimension: '上手门槛',
        mapMaker: '点选格子、替换拼块即可开始，操作直观。',
        photoshop: '需熟悉图层和位图编辑工具。',
        illustrator: '需熟悉对象和矢量路径工具。',
      },
      {
        dimension: '海岸线制作',
        mapMaker: '用现成拼块组合海岸，无需从头绘制。',
        photoshop: '使用绘图工具绘制和调整海岸。',
        illustrator: '使用矢量路径绘制和调整海岸。',
      },
      {
        dimension: '快速起稿',
        mapMaker: '一键生成海岸底图，再按设定继续编辑。',
        photoshop: '通过绘制或导入底图开始制作。',
        illustrator: '通过绘制或导入底图开始制作。',
      },
      {
        dimension: '保存与继续编辑',
        mapMaker: '8 个浏览器存档位，方便保存和载入地图。',
        photoshop: '按文档保存和管理地图。',
        illustrator: '按文档保存和管理地图。',
      },
    ],
  },
  howItWorks: {
    eyebrow: '简单三步制作地图',
    title: '如何使用地图制作器？',
    steps: [
      {
        title: '拼出海岸线',
        description: '打开地图制作器后，可从海面网格开始，手动替换单个或多个拼块，也可生成边缘匹配的随机海岸底图。',
      },
      {
        title: '添加元素与地点文字',
        description: '地图素材可放到任一元素层，随后在地图制作器中添加地点标签并调整文字和位置。',
      },
      {
        title: '保存工程或下载图片',
        description: '完成后，可在地图制作器中使用当前浏览器的 8 个存档位，或下载 JSON 工程文件稍后载入。PNG 包含底图和当前显示的自由摆放元素，不含标签或网格。',
      },
    ],
  },
  callToAction: {
    title: '开始绘制下一场冒险的地图',
    description: '进入地图制作器，拼接海岸、摆放地标，并为世界中的地点添加标注。',
    label: '开始制作地图',
  },
  faq: {
    eyebrow: '地图制作常见问题',
    title: '地图制作器常见问题',
    description: '了解地图制作器的手动编辑、随机生成、保存和图片导出方式。',
    items: [
      {
        question: '可以手动拼出海岸线吗？',
        answer:
          '可以。在地图制作器中，从默认海面网格开始，替换单个或多个已选拼块。随机生成是可选功能，只会更换底图，并保留已放置的元素和文字标签。',
      },
      {
        question: '地图上可以添加哪些内容？',
        answer:
          '使用地图制作器时，可用海岸拼块制作底图，再将自然地理、建筑、植被、水域和航海素材放到任一元素层。地点标签可以独立添加和编辑。',
      },
      {
        question: '下载的 PNG 图片包含什么？',
        answer:
          '地图制作器导出的 PNG 包含底图和当前显示的自由摆放元素，不包含文字标签、方格线或六边形网格。',
      },
      {
        question: '如何保存并重新打开地图？',
        answer:
          '可以通过地图制作器保存到当前浏览器的 8 个存档位置之一，也可以下载 JSON 工程文件，之后再载入。载入工程会替换当前地图。',
      },
      {
        question: '可以在手机上使用编辑器吗？',
        answer:
          '可以。窄屏下控件会重新排列，可通过底部导航打开素材、图层和属性面板。',
      },
    ],
  },
};

export function getMapMakerPageCopy(locale: SiteLocale): MapMakerPageCopy {
  if (locale === 'en') {
    return englishPageCopy;
  }

  if (locale === 'zh') {
    return chinesePageCopy;
  }

  throw new Error(`Unknown map maker page-copy locale: ${JSON.stringify(locale)}.`);
}
