import type { ScrollLocale } from './types';

export type ScrollCreatorFeatureIcon =
  | 'paper'
  | 'dimensions'
  | 'text'
  | 'images'
  | 'save'
  | 'print';

export type ScrollCreatorFaqItemCopy = {
  readonly question: string;
  readonly answer: string;
};

export type ScrollCreatorPageContentCopy = {
  readonly whatIs: {
    readonly title: string;
    readonly description: string;
  };
  readonly features: {
    readonly title: string;
    readonly description: string;
    readonly items: readonly {
      readonly icon: ScrollCreatorFeatureIcon;
      readonly title: string;
      readonly description: string;
    }[];
  };
  readonly comparison: {
    readonly title: string;
    readonly description: string;
    readonly tableLabel: string;
    readonly dimensionHeading: string;
    readonly scrollCreatorHeading: string;
    readonly wordHeading: string;
    readonly photoshopHeading: string;
    readonly rows: readonly {
      readonly dimension: string;
      readonly scrollCreator: string;
      readonly word: string;
      readonly photoshop: string;
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
  readonly cta: {
    readonly title: string;
    readonly description: string;
    readonly action: string;
  };
  readonly faq: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly ScrollCreatorFaqItemCopy[];
  };
};

const englishPageContent: ScrollCreatorPageContentCopy = {
  whatIs: {
    title: 'What is a Parchment Scroll Creator?',
    description:
      'Parchment Scroll Creator is a free online editor for making scrolls and fantasy letters with parchment backgrounds. Choose a paper style, adjust the paper size and text formatting, add images and move or resize them, then save a draft or print the finished design. Use it to create quest notices, wanted posters, NPC letters, and ancient documents for tabletop campaigns or fantasy stories. It is designed for D&D and TTRPG game masters and players preparing handouts, as well as fantasy authors and worldbuilders.',
  },
  features: {
    title: 'Features for D&D props and fantasy writing',
    description:
      'Choose a parchment background, arrange text and images, then save or print your fantasy letter.',
    items: [
      {
        icon: 'paper',
        title: 'Choose from 15 parchment styles',
        description:
          'In Parchment Scroll Creator, pick one of fifteen parchment styles and preview your letter on the selected paper.',
      },
      {
        icon: 'dimensions',
        title: 'Adjust the paper size',
        description:
          'Use Parchment Scroll Creator to turn on paper resizing, set the width and height in pixels, or reset to the standard size.',
      },
      {
        icon: 'text',
        title: 'Text layout and fonts',
        description:
          'Type directly on the paper in Parchment Scroll Creator, choose from eight built-in fonts or add a Google Fonts stylesheet, then set size, color, bold, italic, and alignment.',
      },
      {
        icon: 'images',
        title: 'Add and arrange images',
        description:
          'Add an image by URL in Parchment Scroll Creator, then show, hide, select, move, resize, or delete it on the paper.',
      },
      {
        icon: 'save',
        title: 'Keep four local drafts',
        description:
          'With Parchment Scroll Creator, save four different drafts in local browser slots and return later to continue editing.',
      },
      {
        icon: 'print',
        title: 'Print the scroll',
        description:
          'Print the finished scroll in your browser with Parchment Scroll Creator. If the text overflows, increase the paper height or reduce the font size first.',
      },
    ],
  },
  comparison: {
    title: 'Parchment Scroll Creator vs Word and Photoshop',
    description:
      'Compare the focused scroll workflow with general-purpose writing and image-editing tools when you are preparing a fantasy prop.',
    tableLabel: 'Parchment Scroll Creator, Word, and Photoshop comparison',
    dimensionHeading: 'Dimension',
    scrollCreatorHeading: 'Scroll Creator',
    wordHeading: 'Word',
    photoshopHeading: 'Photoshop',
    rows: [
      {
        dimension: 'Parchment background',
        scrollCreator: 'Choose from 15 parchment styles',
        word: 'Insert a background picture or use a picture watermark',
        photoshop: 'Import a parchment background, then combine text and image layers',
      },
      {
        dimension: 'Dimensions',
        scrollCreator: 'Set paper width and height; resize images on the paper',
        word: 'Drag or enter picture height and width to set image size',
        photoshop: 'Use transform handles to adjust asset size and position',
      },
      {
        dimension: 'Text and images',
        scrollCreator: 'Type on the paper; add URL images, then move and resize them',
        word: 'Place text and pictures in a document',
        photoshop: 'Place text and images on an image canvas',
      },
      {
        dimension: 'Saving',
        scrollCreator: 'Four local slots in the current browser',
        word: 'Save a document, reopen it, and continue editing',
        photoshop: 'Save a PSD to preserve layers and continue editing',
      },
      {
        dimension: 'Output',
        scrollCreator: 'Confirm the full text fits inside the paper, then print in your browser',
        word: 'Print documents',
        photoshop: 'Print or export images',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'How it works',
    title: 'Make a scroll in three steps',
    steps: [
      {
        title: 'Choose the paper and size',
        description:
          'Start in Parchment Scroll Creator by picking a parchment background, turning on paper resizing if needed, entering the width and height, or resetting to the standard size.',
      },
      {
        title: 'Write and format the letter',
        description:
          'After choosing a paper in Parchment Scroll Creator, type directly on the preview, then choose the font, font size, color, emphasis, and alignment. Add a Google Fonts stylesheet when you need another font.',
      },
      {
        title: 'Arrange, save, and print',
        description:
          'Finish in Parchment Scroll Creator by adding images by URL and arranging them on the paper. Save the draft in one of four local slots, then print after the full text fits the paper.',
      },
    ],
  },
  cta: {
    title: 'Create your next fantasy scroll',
    description:
      'Open Parchment Scroll Creator, start with a parchment background, write the letter, and prepare a prop for your next session or story.',
    action: 'Create a Scroll',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Parchment Scroll Creator FAQ',
    description:
      'Answers about paper choices, text styling, images, local saves, overflow, and printing.',
    items: [
      {
        question: 'What can I make with Parchment Scroll Creator?',
        answer:
          'Use Parchment Scroll Creator to make printable quest notices, character letters, ancient prophecies, and other fantasy handouts for D&D, TTRPG sessions, novels, and worldbuilding.',
      },
      {
        question: 'How many parchment papers are available?',
        answer:
          'Parchment Scroll Creator includes 15 parchment paper choices. Select a paper in the Paper panel to change the scroll background.',
      },
      {
        question: 'Can I change the paper dimensions?',
        answer:
          'Yes. In Parchment Scroll Creator, turn on paper resizing to enter the width and height in pixels, or use Reset size to return to the standard dimensions.',
      },
      {
        question: 'Which fonts and text styles can I use?',
        answer:
          'In Parchment Scroll Creator, choose from eight built-in fonts or add a Google Fonts stylesheet. You can also set the font size and color, toggle bold or italic, and choose left, center, or right alignment.',
      },
      {
        question: 'Can I add images to a scroll?',
        answer:
          'Yes. Add an image by URL in Parchment Scroll Creator, then show, hide, select, move, resize, or delete it on the paper.',
      },
      {
        question: 'Where are saved scrolls kept?',
        answer:
          'Parchment Scroll Creator keeps four save slots in the current browser on the current device. They are local to that browser, and private browsing windows lose them when the session ends.',
      },
      {
        question: 'What happens when the text is too long?',
        answer:
          'Parchment Scroll Creator keeps all text, and the text area can scroll within the paper. Increase the paper height or reduce the font size so the full text fits inside the paper before printing.',
      },
      {
        question: 'How do I print my finished scroll?',
        answer:
          'Use Print in the toolbar. The browser print view uses the scroll preview and hides the editor controls. Resolve any text overflow before printing.',
      },
    ],
  },
};

const chinesePageContent: ScrollCreatorPageContentCopy = {
  whatIs: {
    title: '什么是羊皮纸卷轴制作器？',
    description:
      '羊皮纸卷轴制作器是一款免费的在线编辑工具，用于制作带有羊皮纸背景的卷轴和奇幻信件。你可以选择纸张样式、调整纸张尺寸和文字排版，添加并移动或缩放图片，再保存草稿或打印成品。它可用于制作任务委托、悬赏告示、NPC 来信、古代文献，以及奇幻故事中的信件和文书。适合为 D&D/TRPG 准备跑团道具的 GM 和玩家，也适合奇幻小说作者与世界观创作者。',
  },
  features: {
    title: '为 D&D 道具和奇幻写作准备的功能',
    description:
      '选择羊皮纸背景，编排文字与图片，再保存或打印你的奇幻信件。',
    items: [
      {
        icon: 'paper',
        title: '15 种羊皮纸样式',
        description: '在羊皮纸卷轴制作器中，从 15 种羊皮纸样式中选择一种，在选定的纸张上预览你的信件。',
      },
      {
        icon: 'dimensions',
        title: '调整纸张尺寸',
        description: '调整纸张时，羊皮纸卷轴制作器支持输入宽度和高度（px），也可以重置为标准尺寸。',
      },
      {
        icon: 'text',
        title: '文字排版与字体',
        description:
          '羊皮纸卷轴制作器让你直接在纸张上输入正文，从 8 种内置字体中选择或添加 Google Fonts 样式表，再设置字号、颜色、粗体、斜体和对齐方式。',
      },
      {
        icon: 'images',
        title: '添加并排列图片',
        description: '通过图片地址在羊皮纸卷轴制作器中添加素材，然后在纸张上显示、隐藏、选择、移动、调整大小或删除图片。',
      },
      {
        icon: 'save',
        title: '保留四个本地草稿',
        description: '使用羊皮纸卷轴制作器的四个本地槽位保存不同草稿，回来继续编辑。',
      },
      {
        icon: 'print',
        title: '打印卷轴',
        description:
          '用浏览器打印完成的卷轴；如果羊皮纸卷轴制作器提示正文超出纸张，请先增加纸张高度或减小字号。',
      },
    ],
  },
  comparison: {
    title: '羊皮纸卷轴制作器、Word 与 Photoshop 对比',
    description:
      '准备奇幻道具时，可以根据需求比较专注的卷轴制作流程与通用文字编辑、图像编辑工具。',
    tableLabel: '羊皮纸卷轴制作器、Word 与 Photoshop 功能对比',
    dimensionHeading: '对比维度',
    scrollCreatorHeading: '卷轴制作器',
    wordHeading: 'Word',
    photoshopHeading: 'Photoshop',
    rows: [
      {
        dimension: '羊皮纸背景',
        scrollCreator: '选择 15 种羊皮纸样式',
        word: '可插入背景图片或使用图片水印',
        photoshop: '导入羊皮纸背景，再组合文字和图片图层',
      },
      {
        dimension: '尺寸',
        scrollCreator: '设置纸张宽高，并调整纸张上的图片大小',
        word: '拖拽或输入图片宽高，设置图片大小',
        photoshop: '使用变换手柄调整素材大小与位置',
      },
      {
        dimension: '文字与图片',
        scrollCreator: '在纸张上输入文字，通过地址添加、移动和调整图片',
        word: '在文档中放置文字和图片',
        photoshop: '在图像画布上放置文字和图片',
      },
      {
        dimension: '保存方式',
        scrollCreator: '当前浏览器中的四个本地槽位',
        word: '保存文档，重新打开后继续编辑',
        photoshop: '保存 PSD 以保留图层并继续编辑',
      },
      {
        dimension: '输出方式',
        scrollCreator: '确认正文完整放在纸内后，用浏览器打印',
        word: '打印文档',
        photoshop: '打印或导出图像',
      },
    ],
  },
  howItWorks: {
    eyebrow: '使用方法',
    title: '三步制作一张卷轴',
    steps: [
      {
        title: '选择纸张和尺寸',
        description: '在羊皮纸卷轴制作器中选择羊皮纸背景；需要时开启纸张调整，输入宽度和高度，或重置为标准尺寸。',
      },
      {
        title: '输入并排版正文',
        description:
          '选好纸张后，在羊皮纸卷轴制作器的预览中输入文字，然后选择字体、字号、颜色、粗斜体和对齐方式。需要其他字体时，可以添加 Google Fonts 样式表。',
      },
      {
        title: '排列、保存并打印',
        description:
          '最后，在羊皮纸卷轴制作器中通过地址添加图片并排列。将草稿保存到四个本地槽位之一，确认正文完整放在纸内后打印。',
      },
    ],
  },
  cta: {
    title: '制作你的下一张奇幻卷轴',
    description: '打开羊皮纸卷轴制作器，从羊皮纸背景开始写下信件，为下一场跑团或故事准备一件道具。',
    action: '开始制作卷轴',
  },
  faq: {
    eyebrow: '常见问题',
    title: '羊皮纸卷轴制作器 FAQ',
    description: '了解纸张选择、文字样式、图片、本地保存、正文溢出和打印方式。',
    items: [
      {
        question: '羊皮纸卷轴制作器可以制作什么？',
        answer:
          '羊皮纸卷轴制作器可以制作适合打印的任务委托、角色书信、古老预言和其他奇幻信件，用于 D&D、TRPG 跑团、小说和世界观设定。',
      },
      {
        question: '有多少种羊皮纸可以选择？',
        answer: '羊皮纸卷轴制作器提供 15 种羊皮纸选择。在“纸张”面板中选择纸张即可更换卷轴背景。',
      },
      {
        question: '可以修改纸张尺寸吗？',
        answer: '可以。在羊皮纸卷轴制作器中开启纸张调整后输入宽度和高度（px），也可以点击“重置大小”恢复标准尺寸。',
      },
      {
        question: '可以使用哪些字体和文字样式？',
        answer:
          '羊皮纸卷轴制作器提供 8 种内置字体，也可以添加 Google Fonts 样式表。还可以设置字号和颜色，切换粗体或斜体，并选择左对齐、居中对齐或右对齐。',
      },
      {
        question: '可以给卷轴添加图片吗？',
        answer: '可以通过图片地址在羊皮纸卷轴制作器中添加图片，然后在纸张上显示、隐藏、选择、移动、调整大小或删除。',
      },
      {
        question: '保存的卷轴存在哪里？',
        answer: '羊皮纸卷轴制作器的四个保存槽位保存在当前设备的当前浏览器中，只属于这个浏览器。无痕窗口结束会话后，其中的存档会丢失。',
      },
      {
        question: '正文太长时会发生什么？',
        answer:
          '羊皮纸卷轴制作器会保留全文，正文可在纸内滚动编辑。增加纸张高度或减小字号，使正文完整放在纸内后再打印。',
      },
      {
        question: '如何打印完成的卷轴？',
        answer:
          '点击工具栏中的“打印”。浏览器打印视图使用卷轴预览并隐藏编辑控件。打印前请先处理正文溢出。',
      },
    ],
  },
};

export function getScrollCreatorPageContent(locale: ScrollLocale): ScrollCreatorPageContentCopy {
  if (locale === 'en') {
    return englishPageContent;
  }

  if (locale === 'zh') {
    return chinesePageContent;
  }

  throw new Error(`Unknown scroll creator page content locale. Received ${JSON.stringify(locale)}.`);
}
