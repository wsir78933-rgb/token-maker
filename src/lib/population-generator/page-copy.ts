import type { SiteLocale } from '@/lib/site-locale';

export const POPULATION_GENERATOR_PATH = '/population-generator';
export const POPULATION_GENERATOR_WORKSPACE_ID = 'population-generator-workspace';

const POPULATION_GENERATOR_RULE_COUNT = 3;
const POPULATION_GENERATOR_RESULT_PARAGRAPH_COUNT = 3;
const POPULATION_GENERATOR_FILE_PARAGRAPH_COUNT = 4;
const POPULATION_GENERATOR_FAQ_COUNT = 8;
const POPULATION_GENERATOR_AGRICULTURE_COUNT = 6;
const POPULATION_GENERATOR_FEATURE_COUNT = 6;
const POPULATION_GENERATOR_HOW_TO_STEP_COUNT = 4;

const POPULATION_RANGE_FIGURES = [
  { medieval: '0–1,000', modernFuture: '0–5,000' },
  { medieval: '1,000–10,000', modernFuture: '5,000–20,000' },
  { medieval: '10,000–20,000', modernFuture: '20,000–200,000' },
  { medieval: '20,000–270,000', modernFuture: '200,000–1,100,000' },
  { medieval: '', modernFuture: '1,000,000–9,000,000' },
] as const;

export type PopulationGeneratorRangeRow = {
  size: string;
  medieval: string;
  modernFuture: string;
};

export type PopulationGeneratorFaqItem = {
  question: string;
  answer: string;
};

export type PopulationGeneratorFeatureItem = {
  title: string;
  description: string;
};

export type PopulationGeneratorHowToStep = {
  title: string;
  description: string;
};

export type PopulationGeneratorPageCopy = {
  navigationTitle: string;
  pageTitle: string;
  pageDescription: string;
  title: string;
  description: string;
  workspaceLabel: string;
  audience: {
    title: string;
    body: string;
  };
  rules: {
    title: string;
    paragraphs: readonly string[];
  };
  ranges: {
    title: string;
    intro: string;
    sizeHeading: string;
    medievalHeading: string;
    modernFutureHeading: string;
    notUsed: string;
    rows: readonly PopulationGeneratorRangeRow[];
  };
  result: {
    title: string;
    paragraphs: readonly string[];
    agricultureLead: string;
    agricultureNames: readonly string[];
  };
  files: {
    title: string;
    paragraphs: readonly string[];
  };
  whatIs: {
    title: string;
    body: string;
  };
  features: {
    title: string;
    intro: string;
    items: readonly PopulationGeneratorFeatureItem[];
  };
  howToUse: {
    title: string;
    intro: string;
    steps: readonly PopulationGeneratorHowToStep[];
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly PopulationGeneratorFaqItem[];
  };
};

function buildPopulationRangeRows(sizeLabels: readonly string[]): readonly PopulationGeneratorRangeRow[] {
  if (sizeLabels.length !== POPULATION_RANGE_FIGURES.length) {
    throw new Error(
      `Population generator size labels must contain ${POPULATION_RANGE_FIGURES.length} entries. Received ${sizeLabels.length}: ${JSON.stringify(sizeLabels)}.`,
    );
  }

  return sizeLabels.map((size, index) => {
    const figures = POPULATION_RANGE_FIGURES[index];
    if (figures === undefined) {
      throw new Error(`Population generator range figures are missing at index ${index}.`);
    }
    if (size.trim() === '') {
      throw new Error(`Population generator size label is empty at index ${index}. Received ${JSON.stringify(size)}.`);
    }

    return {
      size,
      medieval: figures.medieval,
      modernFuture: figures.modernFuture,
    };
  });
}

const englishPopulationGeneratorPageCopy: PopulationGeneratorPageCopy = {
  navigationTitle: 'Population Generator',
  pageTitle: 'Population Generator | Settlement Size, Occupations, and Farms',
  pageDescription:
    'Generate a medieval, modern, or future settlement for a tabletop game or story. Edit the name, population, households, area, occupations, and farm figures, then save five copies in this browser or download population.txt. The file stores the population, agriculture, and occupation details as HTML.',
  title: 'Free Population Generator for RPGs, Novels & Worldbuilding',
  description:
    'Generate village and city populations with counts for 170 professions. Choose medieval, modern or future settings, then edit and save your results.',
  workspaceLabel: 'Population generator',
  audience: {
    title: 'Who it is for',
    body: 'Game masters, writers, and worldbuilders can generate a settlement’s name, population, households, area, occupations, and farm figures, then edit the labels and counts.',
  },
  rules: {
    title: 'How a settlement is generated',
    paragraphs: [
      'Each era has its own list of 170 occupations, and a share can be zero. Occupation names, each occupation’s share of the population, and the chance that an occupation appears all follow the era: Medieval, Modern, or Future.',
      'Medieval has four sizes: Village, Town, City, and Large city. Modern and Future each add Metropolis, fourteen sizes in all. The first visit picks one of those fourteen at random and fills in a settlement. Changing the era only changes which sizes you can choose. Choosing a size fills in a settlement. Generate again uses the size already on the current result.',
      'Each occupation row has one count. That count follows the occupation’s share of the population and then varies by about 20 percent. An occupation can be left out when that era’s appearance chance says so. For your world, that one count can mean how many people do the job, how many institutions there are, or how many people take part in the related work. Those counts do not have to add up to the population. If you have edited the result, generating, loading, or importing asks before it replaces your work. Cancel keeps the current settlement and the size on it.',
    ],
  },
  ranges: {
    title: 'Population each size can roll',
    intro: 'The population is chosen inside the range for that era and size. Medieval does not offer Metropolis.',
    sizeHeading: 'Size',
    medievalHeading: 'Medieval',
    modernFutureHeading: 'Modern and Future',
    notUsed: 'Not offered',
    rows: buildPopulationRangeRows(['Village', 'Town', 'City', 'Large city', 'Metropolis']),
  },
  result: {
    title: 'What you can edit',
    paragraphs: [
      'You can edit the settlement name, every field label, each occupation name, and every count on its own. Each occupation row has one count. For your world, that one count can mean how many people do the job, how many institutions there are, or how many people take part in the related work. Those counts are reference figures for the settlement, and they do not have to add up to the population. Changing the population does not recalculate the other fields.',
      'Households are a count. Area is shown in square kilometres (km²) and square miles (mi²), each to three decimal places. Counts must be whole numbers, zero or greater. Area may include a decimal, and it must be zero or greater and finite. An edit that is not a valid number shows a clear error.',
      'Search occupation names and Hide zero counts only change which rows are on screen. On a wide screen the occupation list scrolls inside its own panel. On a phone the occupation list scrolls inside a height-limited area, with Search, Hide zero counts, and the column headings at the top; all 170 occupations remain accessible.',
    ],
    agricultureLead:
      'Agriculture details start folded. Cultivated farmland is shown in acres. Saving, loading, exporting, and printing keep all six figures while the section is folded.',
    agricultureNames: [
      'Farmers',
      'Cultivated farmland',
      'Total livestock',
      'Poultry',
      'Cattle and pigs',
      'Other',
    ],
  },
  files: {
    title: 'Saves, text files, and printing',
    paragraphs: [
      'Five slots stay in this browser. Save / Load sits with the settlement overview, and you can save or load from there. An empty slot cannot be loaded. Saving over a slot that already has a settlement asks first and names that slot. A slot stores the whole settlement, including edits.',
      'File / Print is a single list: Export TXT, Import file, and Print full result. Closing that menu leaves the settlement unchanged. Export TXT downloads population.txt. The file stores the population, agriculture, and occupation details as HTML, including zero counts, folded agriculture, and rows hidden by search.',
      'Import reads UTF-8. You can import population.txt from this tool again to continue editing, and you can read JSON archives this tool exported before. If you cancel, or if the file cannot be read, the settlement stays as it is and the page shows the specific error. Print shows every statistic, the agriculture details, and all 170 occupations in black text, without the site controls or buttons, and it keeps the edits you made.',
      'Every question about replacing the current settlement can be cancelled. Cancelling leaves the settlement and its size as they are.',
    ],
  },
  whatIs: {
    title: 'What is a Population Generator',
    body: 'A population generator is a free online tool for creating population and occupation distributions for fictional worlds. Choose an era and settlement size to generate a settlement name, total population, household count, area, agriculture figures, and counts for 170 occupations. You can edit the results, search occupations, save locally, export, and print. Use it to plan villages and cities for tabletop adventures, story settings for novels, or settlements and residents for games as a reference for your worldbuilding. The population generator is designed for tabletop role-playing game masters, novelists, game writers and world designers, and anyone who enjoys creating fictional worlds.',
  },
  features: {
    title: 'Features',
    intro: 'Draft a settlement with the population generator, then change the figures yourself.',
    items: [
      {
        title: 'Three eras',
        description: 'Medieval, Modern, and Future. Medieval has four sizes. Modern and Future also have Metropolis.',
      },
      {
        title: 'Editable figures',
        description: 'The population generator gives the name, population, households, area, and farm figures each their own field.',
      },
      {
        title: '170 occupations',
        description: 'Each occupation has one name and one count you can edit.',
      },
      {
        title: 'Search the list',
        description: 'Search occupation names, or hide counts that are zero.',
      },
      {
        title: 'Five saves',
        description: 'The population generator keeps five Save / load slots in this browser. An empty slot cannot be loaded.',
      },
      {
        title: 'File / print',
        description: 'Export TXT, import a file, or print the full result.',
      },
    ],
  },
  howToUse: {
    title: 'How to Use',
    intro: 'In the population generator, choosing a size generates the settlement. Generate again is optional.',
    steps: [
      {
        title: 'Choose an era',
        description: 'Pick Medieval, Modern, or Future. That choice sets which sizes are available.',
      },
      {
        title: 'Choose a size',
        description: 'Selecting a size generates the settlement in the population generator. Generate again is optional and uses that same size.',
      },
      {
        title: 'Edit the figures',
        description: 'Change the name, population, households, area, farm figures, and occupations on the population generator page.',
      },
      {
        title: 'Save or export',
        description: 'Use Save / load for a slot, or open File / print to export a file or print.',
      },
    ],
  },
  cta: {
    title: 'Build a settlement',
    description: 'Choose an era and a size in the population generator, then edit the population and occupations on the page.',
    buttonText: 'Generate a Population for Free',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Common questions',
    description: 'Short answers about how the population generator handles eras, sizes, edits, saves, text files, and printing.',
    items: [
      {
        question: 'Who is the population generator for?',
        answer:
          'The population generator is for game masters, writers, and worldbuilders who need a settlement’s name, population, households, area, occupations, and farm figures, and who want to edit those labels and counts.',
      },
      {
        question: 'What happens on the first visit, and when I change the era?',
        answer:
          'On the first visit, the population generator picks one of the fourteen sizes at random and fills in a settlement. Medieval offers Village, Town, City, and Large city. Modern and Future also offer Metropolis. Changing the era only updates those size choices. A settlement is generated when you choose a size. Generate again uses the size already on the current result. If you have edited it, the population generator asks before replacing it, and cancel keeps the current settlement and its size.',
      },
      {
        question: 'What population can each size roll?',
        answer:
          'These are the ranges in the population generator. Medieval: Village 0–1,000, Town 1,000–10,000, City 10,000–20,000, Large city 20,000–270,000. Modern and Future: Village 0–5,000, Town 5,000–20,000, City 20,000–200,000, Large city 200,000–1,100,000, Metropolis 1,000,000–9,000,000. Medieval does not offer Metropolis.',
      },
      {
        question: 'Do the occupation counts have to match the population?',
        answer:
          'In the population generator, each occupation row has one count. For your world, that one count can mean how many people do the job, how many institutions there are, or how many people take part in the related work. Those counts are reference figures, and they do not have to add up to the population. The count starts from that occupation’s share, varies by about 20 percent, and an occupation may be absent according to the era’s appearance chance. Changing the population does not recalculate the other fields.',
      },
      {
        question: 'What is kept when agriculture details are folded?',
        answer:
          'The folded section in the population generator still has six figures: Farmers, Cultivated farmland in acres, Total livestock, Poultry, Cattle and pigs, and Other. Saving, exporting, and printing keep all six.',
      },
      {
        question: 'What do search and Hide zero counts change?',
        answer:
          'They change only which rows are on screen in the population generator. The settlement still has all 170 occupations. Export and print include hidden rows, including zero counts. On a wide screen the list scrolls inside its panel. On a phone the list scrolls inside a height-limited area, with Search, Hide zero counts, and the column headings at the top; all 170 occupations remain accessible.',
      },
      {
        question: 'Where do the five saves stay?',
        answer:
          'The population generator keeps them in this browser. Save / Load is on the settlement overview. An empty slot cannot be loaded. Saving over a filled slot asks first. Each slot stores the whole settlement, including folded agriculture and your edits.',
      },
      {
        question: 'What does Export TXT contain, and what if import cannot read the file?',
        answer:
          'File / Print in the population generator offers Export TXT, Import file, and Print full result. Export TXT downloads population.txt. The file stores the population, agriculture, and occupation details as HTML, including zero counts, folded agriculture, and rows hidden by search. You can import that file again to continue editing, and JSON archives exported earlier by this population generator can still be read. Cancel, or a file the page cannot read, leaves the current settlement unchanged and shows the specific error. Print includes the statistics, agriculture details, and all 170 occupations in black text, without the site controls or buttons, and it keeps your edits.',
      },
    ],
  },
};

const chinesePopulationGeneratorPageCopy: PopulationGeneratorPageCopy = {
  navigationTitle: '人口生成器',
  pageTitle: '人口生成器｜聚落规模、职业与农业',
  pageDescription:
    '为跑团或故事生成一座中世纪、现代或未来聚落。可以修改名称、人口、住户、面积、职业和农业数字，在这个浏览器里保存五个槽位，或下载 population.txt。文件保存人口统计、农业与职业明细的 HTML。',
  title: '免费人口生成器｜跑团、小说与架空世界设定',
  description:
    '快速生成虚构村庄或城市的人口总量与 170 种职业人数，支持中世纪、现代和未来背景。为跑团主持人、小说作者与游戏策划提供可编辑、可保存的人口设定。',
  workspaceLabel: '人口生成器',
  audience: {
    title: '给谁用',
    body: '跑团主持、作者和世界观作者可以生成聚落名称、总人口、住户数、面积、职业和农业数字，再单独修改标签和数值。',
  },
  rules: {
    title: '聚落怎样生成',
    paragraphs: [
      '每个时代有自己的 170 个职业，比例可以是零。职业名称、各项占人口的比例，以及一项职业是否出现，都跟着时代走：中世纪、现代或未来。',
      '中世纪有四档规模：村庄、城镇、城市、大城市。现代和未来各多一档大都市，一共十四档。第一次打开会从这十四档里随机选一档并填好聚落。切换时代只更新可选的规模。点选规模才会生成聚落。再次生成沿用当前结果上的规模。',
      '每个职业只有一行、一个数量。这个数量按该职业占人口的比例计算，再大约上下浮动 20%。按该时代的出现概率，有的职业可以不出现。按你的世界设定，这一个数量可以表示从业人数、机构数或相关业务参与者。各职业数量加总后不必等于总人口。结果经过手工修改后，再次生成、读取或导入会先询问是否替换。取消会留下当前聚落和它的规模。',
    ],
  },
  ranges: {
    title: '每个规模会抽到的人口',
    intro: '人口落在该时代和该规模的范围里。中世纪不提供大都市。',
    sizeHeading: '规模',
    medievalHeading: '中世纪',
    modernFutureHeading: '现代和未来',
    notUsed: '不提供',
    rows: buildPopulationRangeRows(['村庄', '城镇', '城市', '大城市', '大都市']),
  },
  result: {
    title: '哪些内容可以改',
    paragraphs: [
      '聚落名称、所有字段标签、职业名称和每一项数值都可以单独修改。每个职业只有一行、一个数量。按你的世界设定，这一个数量可以表示从业人数、机构数或相关业务参与者。这些数量是聚落设定的参考，加总后不必等于总人口。修改总人口不会自动重算其他数值。',
      '住户数是一个整数。聚落面积同时给出平方千米（km²）和平方英里（mi²），都显示到小数点后三位。数量必须是大于或等于零的整数。面积可以带小数，但必须是大于或等于零的有限数字。无效编辑会显示清楚的错误。',
      '搜索职业名称和隐藏零数量只改变屏幕上看到的行。宽屏时职业列表在自己的区域里滚动。手机上职业列表在限高区域内滚动，搜索、隐藏零数量和列标题保持在列表顶部，170 条职业仍可全部访问。',
    ],
    agricultureLead:
      '农业明细默认折叠。种植农田用英亩表示。保存、读取、导出和打印都会保留这六项，即使这一区是折叠的。',
    agricultureNames: ['农民人数', '种植农田', '牲畜总数', '禽类', '牛与猪', '其他'],
  },
  files: {
    title: '保存、文本文件和打印',
    paragraphs: [
      '五个槽位保存在这个浏览器里。保存 / 读取放在聚落概况处，可以直接保存或读取。空槽位不能读取。覆盖已经有聚落的槽位时会先确认，并标出是哪一个槽位。一个槽位保存整份聚落，包括手工修改。',
      '文件 / 打印是单层菜单，里面有导出 TXT、导入文件和打印完整结果。关掉菜单不会改变当前聚落。导出 TXT 会下载 population.txt，文件保存人口统计、农业与职业明细的 HTML，包括零值、折叠的农业明细，以及被搜索或隐藏零数量挡住的行。',
      '导入按 UTF-8 读取。可以重新导入本工具的 population.txt 继续编辑，也支持读取本工具以前导出的 JSON 存档。取消，或文件无法读取时，当前聚落保持原样，页面会显示具体错误。打印包含全部统计、农业明细和全部 170 条职业，使用黑字，不显示站点控件和按钮，并保留你的编辑。',
      '所有要替换当前聚落的询问都可以取消。取消后，聚落和它的规模都保持不变。',
    ],
  },
  whatIs: {
    title: '什么是人口生成器',
    body: '人口生成器是一款为虚构世界生成人口与职业分布的免费在线工具。选择时代和聚落规模，即可生成聚落名称、总人口、住户数量、面积、农业数据及 170 项职业数量，并支持编辑、职业搜索、本地保存、导出和打印。你可以用它设定跑团冒险中的村庄与城市、小说中的故事发生地，或游戏中的聚落与居民构成，为世界观创作提供参考。人口生成器适合桌面角色扮演游戏主持人、小说作者、游戏剧情与世界观策划，以及架空世界创作爱好者。',
  },
  features: {
    title: '核心功能',
    intro: '先用人口生成器起草一份聚落，再自己修改这些数字。',
    items: [
      {
        title: '三个时代',
        description: '中世纪、现代和未来。中世纪有四种规模。现代和未来还有大都市。',
      },
      {
        title: '可改的数字',
        description: '人口生成器里，名称、总人口、住户、面积和农业数字各自是单独字段。',
      },
      {
        title: '170 个职业',
        description: '每个职业有一个名称和一个可以修改的数量。',
      },
      {
        title: '搜索列表',
        description: '可以搜索职业名称，或隐藏数量为零的行。',
      },
      {
        title: '五个存档',
        description: '人口生成器的「保存 / 读取」在这个浏览器里保留五个槽位。空槽位不能读取。',
      },
      {
        title: '文件 / 打印',
        description: '可以导出 TXT、导入文件，或打印完整结果。',
      },
    ],
  },
  howToUse: {
    title: '如何使用',
    intro: '在人口生成器里，点选规模就会生成聚落。再次生成是可选的。',
    steps: [
      {
        title: '选择时代',
        description: '选中世纪、现代或未来。这一选择决定有哪些规模。',
      },
      {
        title: '选择规模',
        description: '在人口生成器里，点选规模就会生成聚落。再次生成是可选的，仍用这个规模。',
      },
      {
        title: '修改数字',
        description: '在人口生成器的页面上修改名称、总人口、住户、面积、农业数字和职业。',
      },
      {
        title: '保存或导出',
        description: '用「保存 / 读取」留下一个槽位，或打开「文件 / 打印」导出文件或打印。',
      },
    ],
  },
  cta: {
    title: '做一份聚落人口',
    description: '在人口生成器里选好时代和规模，再在页面上修改人口和职业。',
    buttonText: '免费生成人口设定',
  },
  faq: {
    eyebrow: '问答',
    title: '常见问题',
    description: '关于人口生成器的时代、规模、修改、保存、文本文件和打印的简短说明。',
    items: [
      {
        question: '人口生成器给谁用？',
        answer:
          '人口生成器适合需要聚落名称、总人口、住户数、面积、职业和农业数字，并想自己修改标签和数值的跑团主持、作者和世界观作者。',
      },
      {
        question: '第一次打开，以及切换时代时会发生什么？',
        answer:
          '第一次打开时，人口生成器会从十四档规模里随机选一档并填好聚落。中世纪提供村庄、城镇、城市、大城市。现代和未来还提供大都市。切换时代只更新这些规模选项。点选规模才会生成。再次生成沿用当前结果上的规模。结果有手工修改时，人口生成器会先询问是否替换，取消则保留当前聚落和规模。',
      },
      {
        question: '每个规模的人口范围是多少？',
        answer:
          '这些是人口生成器里的范围。中世纪：村庄 0–1,000，城镇 1,000–10,000，城市 10,000–20,000，大城市 20,000–270,000。现代和未来：村庄 0–5,000，城镇 5,000–20,000，城市 20,000–200,000，大城市 200,000–1,100,000，大都市 1,000,000–9,000,000。中世纪不提供大都市。',
      },
      {
        question: '职业数量必须等于总人口吗？',
        answer:
          '在人口生成器里，每个职业只有一行、一个数量。按你的世界设定，这一个数量可以表示从业人数、机构数或相关业务参与者。这些数量是设定参考，加总后不必等于总人口。这个数量从该职业的人口比例出发，大约上下浮动 20%，也可能按该时代的出现概率不出现。修改总人口不会重算其他数值。',
      },
      {
        question: '农业明细折叠后还保留哪些数字？',
        answer: '在人口生成器里，折叠后仍有六项：农民人数、种植农田（英亩）、牲畜总数、禽类、牛与猪、其他。保存、导出和打印都会保留这六项。',
      },
      {
        question: '搜索和隐藏零数量会改掉职业吗？',
        answer:
          '在人口生成器里，它们只改变屏幕上显示的行。聚落里仍有全部 170 条。导出和打印包含被挡住的行，也包括零值。宽屏时列表在自己的区域里滚动。手机上列表在限高区域内滚动，搜索、隐藏零数量和列标题保持在列表顶部，170 条职业仍可全部访问。',
      },
      {
        question: '五个保存槽位放在哪里？',
        answer:
          '人口生成器把五个槽位放在这个浏览器里。保存 / 读取在聚落概况处。空槽位不能读取。覆盖已有内容的槽位会先确认。每个槽位保存整份聚落，包括折叠的农业明细和手工修改。',
      },
      {
        question: '导出 TXT 包含什么？文件读不了时会怎样？',
        answer:
          '人口生成器的文件 / 打印里有导出 TXT、导入文件和打印完整结果。导出 TXT 会下载 population.txt，文件保存人口统计、农业与职业明细的 HTML，包括零值、折叠的农业明细和被搜索挡住的行。可重新导入人口生成器的这份文件继续编辑，也支持读取本工具以前导出的 JSON 存档。取消，或页面读不了该文件时，当前聚落不变，并显示具体错误。打印包含统计、农业明细和全部 170 条职业，使用黑字，不显示站点控件和按钮，并保留编辑。',
      },
    ],
  },
};

function requirePopulationGeneratorParagraphs(
  locale: SiteLocale,
  fieldName: string,
  paragraphs: readonly string[],
  expectedCount: number,
): void {
  if (paragraphs.length !== expectedCount) {
    throw new Error(
      `Population generator ${fieldName} for locale ${JSON.stringify(locale)} must contain ${expectedCount} paragraphs. Received ${paragraphs.length}.`,
    );
  }

  paragraphs.forEach((paragraph, index) => {
    if (paragraph.trim() === '') {
      throw new Error(
        `Population generator ${fieldName} paragraph ${index} for locale ${JSON.stringify(locale)} is empty.`,
      );
    }
  });
}

function requirePopulationGeneratorText(locale: SiteLocale, fieldName: string, value: string): void {
  if (value.trim() === '') {
    throw new Error(
      `Population generator ${fieldName} for locale ${JSON.stringify(locale)} must be a non-empty string. Received ${JSON.stringify(value)}.`,
    );
  }
}

function requirePopulationGeneratorFeatureItems(
  locale: SiteLocale,
  items: readonly PopulationGeneratorFeatureItem[],
): void {
  if (items.length !== POPULATION_GENERATOR_FEATURE_COUNT) {
    throw new Error(
      `Population generator features for locale ${JSON.stringify(locale)} must contain ${POPULATION_GENERATOR_FEATURE_COUNT} items. Received ${items.length}.`,
    );
  }

  items.forEach((item, index) => {
    if (item.title.trim() === '' || item.description.trim() === '') {
      throw new Error(
        `Population generator feature ${index} for locale ${JSON.stringify(locale)} has an empty title or description. Received ${JSON.stringify(item)}.`,
      );
    }
  });
}

function requirePopulationGeneratorHowToSteps(
  locale: SiteLocale,
  steps: readonly PopulationGeneratorHowToStep[],
): void {
  if (steps.length !== POPULATION_GENERATOR_HOW_TO_STEP_COUNT) {
    throw new Error(
      `Population generator how-to steps for locale ${JSON.stringify(locale)} must contain ${POPULATION_GENERATOR_HOW_TO_STEP_COUNT} steps. Received ${steps.length}.`,
    );
  }

  steps.forEach((step, index) => {
    if (step.title.trim() === '' || step.description.trim() === '') {
      throw new Error(
        `Population generator how-to step ${index} for locale ${JSON.stringify(locale)} has an empty title or description. Received ${JSON.stringify(step)}.`,
      );
    }
  });
}

function expectedPopulationGeneratorCallToActionButton(locale: SiteLocale): string {
  if (locale === 'en') {
    return 'Generate a Population for Free';
  }

  if (locale === 'zh') {
    return '免费生成人口设定';
  }

  throw new Error(`Population generator CTA has no button text for locale ${JSON.stringify(locale)}.`);
}

function requirePopulationGeneratorCallToActionButton(locale: SiteLocale, buttonText: string): void {
  const expectedButtonText = expectedPopulationGeneratorCallToActionButton(locale);
  if (buttonText !== expectedButtonText) {
    throw new Error(
      `Population generator CTA button for locale ${JSON.stringify(locale)} must be ${JSON.stringify(expectedButtonText)}. Received ${JSON.stringify(buttonText)}.`,
    );
  }
}

function assertPopulationGeneratorPageCopy(locale: SiteLocale, copy: PopulationGeneratorPageCopy): void {
  if (copy.navigationTitle.trim() === '' || copy.pageTitle.trim() === '' || copy.title.trim() === '') {
    throw new Error(
      `Population generator titles for locale ${JSON.stringify(locale)} must be non-empty. Received navigationTitle ${JSON.stringify(copy.navigationTitle)}, pageTitle ${JSON.stringify(copy.pageTitle)}, title ${JSON.stringify(copy.title)}.`,
    );
  }

  requirePopulationGeneratorParagraphs(locale, 'rules', copy.rules.paragraphs, POPULATION_GENERATOR_RULE_COUNT);
  requirePopulationGeneratorParagraphs(
    locale,
    'result',
    copy.result.paragraphs,
    POPULATION_GENERATOR_RESULT_PARAGRAPH_COUNT,
  );
  requirePopulationGeneratorParagraphs(locale, 'files', copy.files.paragraphs, POPULATION_GENERATOR_FILE_PARAGRAPH_COUNT);
  requirePopulationGeneratorText(locale, 'whatIs.title', copy.whatIs.title);
  requirePopulationGeneratorText(locale, 'whatIs.body', copy.whatIs.body);
  requirePopulationGeneratorText(locale, 'features.title', copy.features.title);
  requirePopulationGeneratorText(locale, 'features.intro', copy.features.intro);
  requirePopulationGeneratorFeatureItems(locale, copy.features.items);
  requirePopulationGeneratorText(locale, 'howToUse.title', copy.howToUse.title);
  requirePopulationGeneratorText(locale, 'howToUse.intro', copy.howToUse.intro);
  requirePopulationGeneratorHowToSteps(locale, copy.howToUse.steps);
  requirePopulationGeneratorText(locale, 'cta.title', copy.cta.title);
  requirePopulationGeneratorText(locale, 'cta.description', copy.cta.description);
  requirePopulationGeneratorCallToActionButton(locale, copy.cta.buttonText);

  if (copy.result.agricultureNames.length !== POPULATION_GENERATOR_AGRICULTURE_COUNT) {
    throw new Error(
      `Population generator agriculture names for locale ${JSON.stringify(locale)} must contain ${POPULATION_GENERATOR_AGRICULTURE_COUNT} entries. Received ${copy.result.agricultureNames.length}: ${JSON.stringify(copy.result.agricultureNames)}.`,
    );
  }

  if (copy.faq.items.length !== POPULATION_GENERATOR_FAQ_COUNT) {
    throw new Error(
      `Population generator FAQ for locale ${JSON.stringify(locale)} must contain ${POPULATION_GENERATOR_FAQ_COUNT} items. Received ${copy.faq.items.length}.`,
    );
  }

  copy.faq.items.forEach((item, index) => {
    if (item.question.trim() === '' || item.answer.trim() === '') {
      throw new Error(
        `Population generator FAQ item ${index} for locale ${JSON.stringify(locale)} has an empty question or answer. Received ${JSON.stringify(item)}.`,
      );
    }
  });

  if (copy.ranges.rows.length !== POPULATION_RANGE_FIGURES.length) {
    throw new Error(
      `Population generator ranges for locale ${JSON.stringify(locale)} must contain ${POPULATION_RANGE_FIGURES.length} rows. Received ${copy.ranges.rows.length}.`,
    );
  }

  const unusedMedievalRows = copy.ranges.rows.filter((row) => row.medieval === '');
  if (unusedMedievalRows.length !== 1 || copy.ranges.rows[copy.ranges.rows.length - 1]?.medieval !== '') {
    throw new Error(
      `Population generator medieval ranges for locale ${JSON.stringify(locale)} must leave only the last size unused. Received ${JSON.stringify(copy.ranges.rows.map((row) => row.medieval))}.`,
    );
  }
}

function assertPopulationGeneratorCopyAlignment(): void {
  assertPopulationGeneratorPageCopy('en', englishPopulationGeneratorPageCopy);
  assertPopulationGeneratorPageCopy('zh', chinesePopulationGeneratorPageCopy);

  const englishRanges = englishPopulationGeneratorPageCopy.ranges.rows;
  const chineseRanges = chinesePopulationGeneratorPageCopy.ranges.rows;
  englishRanges.forEach((englishRow, index) => {
    const chineseRow = chineseRanges[index];
    if (chineseRow === undefined) {
      throw new Error(`Population generator Chinese range row is missing at index ${index}.`);
    }
    if (englishRow.medieval !== chineseRow.medieval || englishRow.modernFuture !== chineseRow.modernFuture) {
      throw new Error(
        `Population generator range figures differ at index ${index}. English ${JSON.stringify(englishRow)} and Chinese ${JSON.stringify(chineseRow)}.`,
      );
    }
  });

  const englishLowerCopy = englishPopulationGeneratorPageCopy;
  const chineseLowerCopy = chinesePopulationGeneratorPageCopy;
  if (englishLowerCopy.features.items.length !== chineseLowerCopy.features.items.length) {
    throw new Error(
      `Population generator feature counts differ. English ${englishLowerCopy.features.items.length}, Chinese ${chineseLowerCopy.features.items.length}.`,
    );
  }
  if (englishLowerCopy.howToUse.steps.length !== chineseLowerCopy.howToUse.steps.length) {
    throw new Error(
      `Population generator how-to step counts differ. English ${englishLowerCopy.howToUse.steps.length}, Chinese ${chineseLowerCopy.howToUse.steps.length}.`,
    );
  }
}

assertPopulationGeneratorCopyAlignment();

export function getPopulationPageCopy(locale: SiteLocale): PopulationGeneratorPageCopy {
  switch (locale) {
    case 'en':
      return englishPopulationGeneratorPageCopy;
    case 'zh':
      return chinesePopulationGeneratorPageCopy;
    default: {
      const unexpectedLocale: never = locale;
      throw new Error(`Unknown population generator locale: ${JSON.stringify(unexpectedLocale)}.`);
    }
  }
}
