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

export type ArmyFormationCreatorPageFeatureCopy = {
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
  featuresTitle: string;
  featuresDescription: string;
  features: readonly ArmyFormationCreatorPageFeatureCopy[];
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
    featuresTitle: 'Tools for Shaping a Battle Plan',
    featuresDescription:
      'Army Formation Creator brings icon browsing, formation placement, battlefield setup, and file tools into one workspace. Start with an encounter idea, arrange units and equipment on the canvas, then save a browser record or export a formation file for later editing.',
    features: [
      {
        title: 'Browse 292 Categorized Icons',
        description:
          'Choose from 292 categorized icons covering helmets, weapons, animals, vehicles and siege equipment, plus NATO symbols. Pick markers that fit your encounter, then place them directly on the battlefield. The grouped library keeps common tabletop planning pieces together as you build a scene.',
      },
      {
        title: 'Place, Rotate, and Remove Pieces',
        description:
          'Place selected icons on the battlefield, then drag them to positions that make the scene readable. Select a piece to rotate it when its direction matters, or remove it when the plan changes. Refine a line, flank, or route as you work.',
      },
      {
        title: 'Choose Color Before Placement',
        description:
          'Choose a palette color before adding pieces to set the appearance of your next additions. This helps a new group of markers share a chosen color from the start. You can still reposition, rotate, or remove pieces individually as the scene develops.',
      },
      {
        title: 'Customize the Battlefield',
        description:
          'Set battlefield height and base color to fit the working canvas, then add a background image when the scene benefits from more context. These controls let you shape the field around a map or reference image while keeping the formation pieces available to place.',
      },
      {
        title: 'Switch Across Four Battlefields',
        description:
          'Switch among four battlefields within one plan when an encounter needs separate views. Keep each composition on its own battlefield, then move between them as you compare positions or prepare another part of a session. The single plan keeps those areas together.',
      },
      {
        title: 'Save, Export, and Resume',
        description:
          'The editor saves work in the current browser, where you can restore the latest record the next time you open the page. Export the current battlefield as a PNG for a visual reference, or export an editable formation file to keep. Import that file later to continue editing.',
      },
    ],
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
    featuresTitle: '用于战场规划的功能',
    featuresDescription:
      'Army Formation Creator 将图标选择、阵型摆放、战场设置与方案文件操作放在同一工作区。你可以从遭遇战构想开始，在画布上安排部队和装备，再保存到当前浏览器，或导出方案文件以便之后继续编辑。',
    features: [
      {
        title: '292 个分类图标',
        description:
          '可从 292 个分类图标中选择头盔、武器、动物、载具与攻城器械，以及北约符号。根据遭遇场景挑选棋子并直接放入战场。分类素材将常用的桌面战斗标记集中在一起，便于逐步构建场景。',
      },
      {
        title: '摆放、旋转与移除棋子',
        description:
          '将选中的图标放入战场后，可以拖动棋子来调整位置。选中棋子即可旋转它的朝向；方案有变化时，也可以将它移除。在布置阵线、侧翼或行进路线时，你可以随时继续调整整体示意图。',
      },
      {
        title: '添加棋子前选择颜色',
        description:
          '在添加棋子前先从调色盘选择颜色，让接下来加入的棋子采用预先选定的颜色。这样可以从摆放开始就为新的一组标记统一颜色。随着场景逐渐成形，你仍可分别移动、旋转或移除棋子。',
      },
      {
        title: '自定义战场画布',
        description:
          '调整战场高度和底色，并在需要更多场景信息时添加背景图。这些设置让你可以根据地图或参考图片调整战场画布，同时仍能随时放置军阵棋子，逐步安排部队和装备的位置。',
      },
      {
        title: '切换四个战场',
        description:
          '你可以在同一方案中的四个战场之间切换，为一次遭遇战准备不同视图。每个战场都可单独安排阵型，也可以在查看位置或准备团务的其他环节时切换回来。四个战场仍归在同一个方案中。',
      },
      {
        title: '保存、导出并继续编辑',
        description:
          '作品保存在当前浏览器中，下次打开页面时可以恢复最近的记录。需要查看或分享时，可将当前战场导出为 PNG 图片；也可以导出可编辑的方案文件留存。之后导入该文件，即可继续编辑方案。',
      },
    ],
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
