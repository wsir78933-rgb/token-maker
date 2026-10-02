import { getI18nDictionary } from '@/lib/i18n/dictionary';
import type { SiteLocale } from '@/lib/site-locale';

export type ArmyFormationCreatorCaseCarouselCopy = {
  cases01To06Label: string;
  cases07To12Label: string;
  previousExampleLabel: string;
  nextExampleLabel: string;
};

export type ArmyFormationCreatorPageStepCopy = {
  title: string;
  description: string;
};

export type ArmyFormationCreatorToolComparisonRowCopy = {
  dimension: string;
  armyFormationCreator: string;
  photoshop: string;
  illustrator: string;
};

export type ArmyFormationCreatorToolComparisonCopy = {
  title: string;
  description: string;
  dimensionHeading: string;
  armyFormationCreatorHeading: string;
  photoshopHeading: string;
  illustratorHeading: string;
  tableLabel: string;
  rows: readonly ArmyFormationCreatorToolComparisonRowCopy[];
};

export type ArmyFormationCreatorPageFaqItemCopy = {
  question: string;
  answer: string;
};

export type ArmyFormationCreatorPageCopy = {
  overviewTitle: string;
  overviewDescription: string;
  stepsEyebrow: string;
  stepsTitle: string;
  stepsLabel: string;
  steps: readonly ArmyFormationCreatorPageStepCopy[];
  callToActionTitle: string;
  callToActionDescription: string;
  callToActionLabel: string;
  toolComparison: ArmyFormationCreatorToolComparisonCopy;
  faqEyebrow: string;
  faqTitle: string;
  faqDescription: string;
  faq: readonly ArmyFormationCreatorPageFaqItemCopy[];
};

const ARMY_FORMATION_CASE_CAROUSEL_COPY: Record<SiteLocale, ArmyFormationCreatorCaseCarouselCopy> = {
  en: {
    cases01To06Label: 'Army formation examples 1 to 6',
    cases07To12Label: 'Army formation examples 7 to 12',
    previousExampleLabel: 'Previous example',
    nextExampleLabel: 'Next example',
  },
  zh: {
    cases01To06Label: '军阵案例 01 至 06',
    cases07To12Label: '军阵案例 07 至 12',
    previousExampleLabel: '上一个案例',
    nextExampleLabel: '下一个案例',
  },
};

const ARMY_FORMATION_CREATOR_PAGE_COPY: Record<SiteLocale, ArmyFormationCreatorPageCopy> = {
  en: {
    overviewTitle: 'What is the Army Formation Creator?',
    overviewDescription:
      "The Army Formation Creator is a battlefield planning tool for tabletop role-playing games. Game masters can map out encounters, ambushes, and sieges to show players where each side is positioned; players can use the diagram to discuss their party's positioning and tactics. Whether you're preparing a D&D adventure or a war-themed session, place troop and equipment icons, set the battlefield background, and export an image to share or a formation file to edit later.",
    stepsEyebrow: 'How it works',
    stepsTitle: 'How to use the Army Formation Creator',
    stepsLabel: 'How to use the Army Formation Creator',
    steps: [
      {
        title: 'Choose pieces',
        description:
          'Choose icons from helmets, weapons, animals, vehicles and siege equipment, or NATO symbols. Select an icon to place a piece on the battlefield.',
      },
      {
        title: 'Arrange your formation',
        description:
          'Drag pieces across the battlefield to position them. Select a piece to adjust its angle or color, or remove it.',
      },
      {
        title: 'Set up the battlefield',
        description: 'Adjust the battlefield height and base color, or add a background image.',
      },
      {
        title: 'Export your work',
        description:
          'Export an image to share your battlefield, or export a formation file to save it. Import the file later to continue editing.',
      },
    ],
    callToActionTitle: 'Start building your formation',
    callToActionDescription:
      'Choose pieces, arrange your troops, and create a battlefield formation diagram.',
    callToActionLabel: 'Start creating',
    toolComparison: {
      title: 'Army Formation Creator vs. Photoshop vs. Illustrator',
      description:
        'Compare symbol libraries, formation editing, battlefield management, saving, and export.',
      dimensionHeading: 'Feature',
      armyFormationCreatorHeading: 'Army Formation Creator',
      photoshopHeading: 'Photoshop',
      illustratorHeading: 'Illustrator',
      tableLabel: 'Army Formation Creator tool comparison',
      rows: [
        {
          dimension: 'Formation symbols',
          armyFormationCreator: '292 categorized icons, ready to use',
          photoshop: 'No dedicated formation symbol library',
          illustrator: 'No dedicated formation symbol library',
        },
        {
          dimension: 'Formation editing',
          armyFormationCreator: 'Drag and drop to arrange icons with ease',
          photoshop: 'Flexible editing; formations take more manual adjustment',
          illustrator: 'Precise vector control; formations take more manual adjustment',
        },
        {
          dimension: 'Battlefield management',
          armyFormationCreator: 'Manage four switchable battlefields in one plan',
          photoshop: 'No dedicated battlefield management',
          illustrator: 'No dedicated battlefield management',
        },
        {
          dimension: 'Plan saving',
          armyFormationCreator: 'Saved in the browser; import a plan file to continue editing',
          photoshop: 'PSD retains layers and editable content',
          illustrator: 'AI retains editable vector objects',
        },
        {
          dimension: 'File export',
          armyFormationCreator: 'Export formation diagrams as PNG',
          photoshop: 'PNG, JPG, and other image formats',
          illustrator: 'SVG, PDF, and other formats',
        },
      ],
    },
    faqEyebrow: 'Army Formation Creator',
    faqTitle: 'Frequently asked questions',
    faqDescription:
      'Quick answers about adding pieces, setting up the battlefield, saving your work, and exporting a formation.',
    faq: [
      {
        question: 'What types of pieces can I add?',
        answer:
          'Pieces are grouped into categories such as helmets, weapons, animals, vehicles and siege equipment, and NATO symbols. Add the ones you need to your battlefield.',
      },
      {
        question: 'How can I move or adjust pieces?',
        answer:
          'After adding a piece, drag it on the battlefield to move it. Select it to adjust its angle or color, or delete it.',
      },
      {
        question: 'Can I change the battlefield appearance?',
        answer: 'Yes. Adjust the battlefield height and base color, or add a background image.',
      },
      {
        question: 'Is my work saved automatically?',
        answer:
          'Your work is saved in the current browser. The next time you open the page, you can restore your last save or start with a blank battlefield.',
      },
      {
        question: 'How do I export my work and continue editing?',
        answer:
          'Export an image or a formation file. To continue editing later, import the formation file.',
      },
    ],
  },
  zh: {
    overviewTitle: '什么是军阵制作器？',
    overviewDescription:
      '军阵制作器是一款面向桌面角色扮演游戏的战场示意图工具。GM 可以用它布置遭遇战、伏击或攻城场景，向玩家展示敌我双方的位置；玩家也能借助阵型图讨论队伍站位和战术。无论是 D&D 等奇幻冒险，还是战争题材的团务，都可以摆放部队与装备图标、设置战场背景，并导出图片或方案文件，方便展示、分享或留待下次继续编辑。',
    stepsEyebrow: '操作流程',
    stepsTitle: '如何使用军阵制作器？',
    stepsLabel: '军阵制作器使用步骤',
    steps: [
      {
        title: '选择棋子',
        description:
          '在头盔、武器、动物、载具与攻城器械、北约符号等类别中选择图标，点击后将棋子放入战场。',
      },
      {
        title: '摆放阵型',
        description: '在战场上拖动棋子来安排位置；选中棋子后，可以调整角度、颜色或删除棋子。',
      },
      {
        title: '设置战场',
        description: '根据需要调整战场高度和底色，或为战场设置背景图。',
      },
      {
        title: '导出作品',
        description: '导出战场图片用于展示，也可以导出方案文件留存；之后选择方案文件即可继续编辑。',
      },
    ],
    callToActionTitle: '现在开始布置军阵',
    callToActionDescription: '挑选棋子，安排队伍位置，制作你的战场阵型示意图。',
    callToActionLabel: '开始制作',
    toolComparison: {
      title: '军阵制作器 vs Photoshop vs Illustrator',
      description: '比较军阵素材、阵型编辑、多战场管理和文件处理能力。',
      dimensionHeading: '对比维度',
      armyFormationCreatorHeading: 'Army Formation Creator',
      photoshopHeading: 'Photoshop',
      illustratorHeading: 'Illustrator',
      tableLabel: '军阵图制作工具对比',
      rows: [
        {
          dimension: '军阵素材',
          armyFormationCreator: '内置 292 个分类图标，直接调用',
          photoshop: '无军阵专属素材库',
          illustrator: '无军阵专属素材库',
        },
        {
          dimension: '阵型编辑',
          armyFormationCreator: '直接拖放排布，操作简单方便',
          photoshop: '编辑自由度高，阵型排布需要更多手动调整',
          illustrator: '矢量控制精准，阵型排布需要更多手动调整',
        },
        {
          dimension: '多战场管理',
          armyFormationCreator: '单个方案管理 4 个可切换战场',
          photoshop: '无专用战场管理',
          illustrator: '无专用战场管理',
        },
        {
          dimension: '方案保存',
          armyFormationCreator: '浏览器自动保存；方案文件可导入续编',
          photoshop: 'PSD 保留图层和编辑内容',
          illustrator: 'AI 保留可编辑矢量对象',
        },
        {
          dimension: '文件导出',
          armyFormationCreator: '导出 PNG 军阵图',
          photoshop: '支持 PNG、JPG 等图片格式',
          illustrator: '支持 SVG、PDF 等格式',
        },
      ],
    },
    faqEyebrow: '军阵制作器',
    faqTitle: '常见问题',
    faqDescription: '了解棋子添加与调整、战场设置、内容保存和方案导出。',
    faq: [
      {
        question: '可以添加哪些类型的棋子？',
        answer: '棋子分为头盔、武器、动物、载具与攻城器械、北约符号等类别，可按需要放入战场。',
      },
      {
        question: '怎样移动或调整棋子？',
        answer: '添加棋子后，可在战场上拖动它来调整位置。选中棋子后，还可以调整角度、改色或删除。',
      },
      {
        question: '可以调整战场的外观吗？',
        answer: '可以调整战场高度和底色，也可以设置背景图。',
      },
      {
        question: '制作内容会自动保存吗？',
        answer: '内容会保存在当前浏览器中。再次打开时，可以选择恢复上次记录或从空白开始。',
      },
      {
        question: '怎样导出作品并继续编辑？',
        answer: '可以导出战场图片，也可以导出方案文件。需要继续编辑时，选择方案文件即可导入。',
      },
    ],
  },
};

export function getArmyFormationCreatorCaseCarouselCopy(
  locale: string,
): ArmyFormationCreatorCaseCarouselCopy {
  return getI18nDictionary(locale, ARMY_FORMATION_CASE_CAROUSEL_COPY, 'army formation case carousel');
}

export function getArmyFormationCreatorPageCopy(locale: string): ArmyFormationCreatorPageCopy {
  return getI18nDictionary(locale, ARMY_FORMATION_CREATOR_PAGE_COPY, 'army formation page');
}
