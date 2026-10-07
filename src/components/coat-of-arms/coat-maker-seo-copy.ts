import type { SiteLocale } from '@/lib/site-locale';

interface CoatMakerSeoFaqItem {
  question: string;
  answer: string;
}

interface CoatMakerSeoLink {
  href: string;
  label: string;
}

export interface CoatMakerSeoComparisonRow {
  rowLabel: string;
  cellText: readonly string[];
}

export type CoatMakerFeatureIcon = 'shield' | 'symbols' | 'text' | 'layers' | 'drawing' | 'export';

export interface CoatMakerFeatureOverviewCopy {
  title: string;
  subtitle: string;
  features: readonly {
    icon: CoatMakerFeatureIcon;
    title: string;
    description: string;
  }[];
}

const englishTitle = 'Coat of Arms Maker: Free Online Fantasy and Guild Badges';
const englishDescription =
  'Draw your own fantasy shields and guild badges in this free online coat of arms maker, then export PNG, JPEG, or PDF.';
const chineseTitle = '纹章制作器：免费在线做奇幻与公会徽章';
const chineseDescription =
  '在这款免费在线纹章制作器里自己画奇幻盾牌和公会徽章，再导出 PNG、JPEG 或 PDF。';

export interface CoatMakerSeoCopy {
  heading: string;
  metadataTitle: string;
  metadataDescription: string;
  introduction: string;
  whatIsTitle: string;
  whatIsDescription: string;
  howItWorksEyebrow: string;
  howItWorksHeading: string;
  howItWorksSteps: readonly {
    title: string;
    description: string;
  }[];
  featureOverview: CoatMakerFeatureOverviewCopy;
  comparisonHeading: string;
  comparisonLead: string;
  comparisonDimensionHeading: string;
  comparisonTableLabel: string;
  comparisonColumns: readonly string[];
  comparisonRows: readonly CoatMakerSeoComparisonRow[];
  editorCtaHeading: string;
  editorCtaEmphasis: string;
  editorCtaDescription: string;
  editorCtaLabel: string;
  faqEyebrow: string;
  faqHeading: string;
  faqDescription: string;
  faqItems: readonly CoatMakerSeoFaqItem[];
  relatedToolsHeading: string;
  contextualLinks: readonly CoatMakerSeoLink[];
  webApplicationFeatureNames: readonly string[];
}

const coatMakerSeoCopyByLocale: Record<SiteLocale, CoatMakerSeoCopy> = {
  en: {
    heading: englishTitle,
    metadataTitle: englishTitle,
    metadataDescription: englishDescription,
    introduction: englishDescription,
    whatIsTitle: 'What is the Coat of Arms Maker?',
    whatIsDescription:
      'Coat of Arms Maker is a free online editor for creating custom shields, character emblems, and guild badges. Choose a shield shape and field pattern, combine symbols, text, and layers, or add your own images and drawn details. Download the finished design as PNG, JPEG, or PDF.',
    howItWorksEyebrow: 'How it works',
    howItWorksHeading: 'How to use the Coat of Arms Maker',
    howItWorksSteps: [
      {
        title: 'Choose a shield and field',
        description: 'In Coat of Arms Maker, choose a shield shape, set its field divisions, and adjust patterns and colors to define the base of your design.',
      },
      {
        title: 'Combine symbols and text',
        description: 'Use Coat of Arms Maker to combine built-in symbols and text, then add your own images or draw extra details in the editor.',
      },
      {
        title: 'Preview and export',
        description: 'Preview your design in Coat of Arms Maker, adjust layer positions and sizes, then download it as PNG, JPEG, or PDF.',
      },
    ],
    featureOverview: {
      title: 'Create Your Own Coat of Arms',
      subtitle:
        'Use Coat of Arms Maker to shape the shield, add symbols and a motto, then arrange the details and export your design—all in your browser.',
      features: [
        {
          icon: 'shield',
          title: 'Shield shapes and field patterns',
          description: 'Choose a shield shape, divide the field, and adjust patterns and colors to build the base of your design in Coat of Arms Maker.',
        },
        {
          icon: 'symbols',
          title: 'Heraldic symbols',
          description: 'Browse the built-in symbols by category in Coat of Arms Maker and add the shapes that suit your character, family, or guild.',
        },
        {
          icon: 'text',
          title: 'Text and mottos',
          description: 'Add a name or motto as straight, curved, or ring text in Coat of Arms Maker, then adjust its font, size, and color.',
        },
        {
          icon: 'layers',
          title: 'Layer controls',
          description: 'Use Coat of Arms Maker to reorder, group, hide, lock, or duplicate layers, and adjust the position, size, rotation, and opacity of your elements.',
        },
        {
          icon: 'drawing',
          title: 'Draw or add your own images',
          description: 'Upload an image from your device or draw details in Coat of Arms Maker with adjustable brush width, color, and opacity.',
        },
        {
          icon: 'export',
          title: 'Browser drafts and exports',
          description: 'Restore a recent draft in Coat of Arms Maker when your browser still has it, then download your finished design as PNG, JPEG, or PDF.',
        },
      ],
    },
    comparisonHeading: 'Why choose our coat of arms maker',
    comparisonLead:
      'Start creating in Coat of Arms Maker without an account or paid plan. Add your own images for free, finish an original coat of arms in the browser, and export PNG, JPEG, or PDF; print and batch export are available when you need them.',
    comparisonDimensionHeading: 'Comparison',
    comparisonTableLabel: 'Coat of Arms Maker comparison',
    comparisonColumns: ['Our coat of arms maker', 'CoaMaker', 'Roll for Fantasy'],
    comparisonRows: [
      {
        rowLabel: 'Start',
        cellText: [
          'Open Coat of Arms Maker and draw at once — the editor is already on the canvas, with no login and no paywall.',
          'The editor opens too, but the free workspace already shows ads, a Go Pro header, and in-editor Upgrade Now cards.',
          'Loads inline with no login or paywall.',
        ],
      },
      {
        rowLabel: 'Edit',
        cellText: [
          'Local images are free to use — no PRO gate — plus shields, field patterns, charges, text, layers, and drawing tools.',
          'Uploading your own images, a custom shield outline, and the extra element packs all require PRO.',
          'You build by picking a shield, crest, and color on a small 248×275 canvas, and its images may not be reused in another coat-of-arms creator.',
        ],
      },
      {
        rowLabel: 'Export',
        cellText: [
          'Use Coat of Arms Maker for one-click real export to PNG, JPEG, or PDF, with print and batch ZIP in the same menu.',
          'Its export dialog covers PNG, JPG, PDF, print, and share for the current design.',
          'Export is "Turn to image" then right-click save; in the live test it produced no image and no download link, and it suggests a screenshot when that fails.',
        ],
      },
      {
        rowLabel: 'Account',
        cellText: [
          'No login and no paywall, local-first, and a browser draft can be restored after a reload.',
          'Save designs, templates, and uploads sit behind PRO, the free editor shows ads, and the default license is non-commercial.',
          'No paywall, but the page runs ads and asks for support, and commercial use needs the owner\'s permission.',
        ],
      },
    ],
    editorCtaHeading: 'Start with a shield. Leave with a mark of your own.',
    editorCtaEmphasis: 'Keep shaping the shield, field, symbols, and text in Coat of Arms Maker',
    editorCtaDescription:
      'Finish your design in the editor, then export PNG, JPEG, or PDF for a character, faction, guild, or invented family.',
    editorCtaLabel: 'Start creating',
    faqEyebrow: 'FAQ',
    faqHeading: 'Frequently asked questions',
    faqDescription: 'Find answers about free use of Coat of Arms Maker, browser drafts, accounts, your own images, and export formats.',
    faqItems: [
      {
        question: 'Is this coat of arms maker free to use?',
        answer: 'Yes. You can use Coat of Arms Maker to create and export a design in the browser without a paid plan.',
      },
      {
        question: 'Can I return to a design later?',
        answer:
          'Yes. If the browser still has a recent draft, you can restore it when you reopen Coat of Arms Maker. Export an image when you want a finished copy.',
      },
      {
        question: 'Which image formats can I export?',
        answer:
          'Use Coat of Arms Maker to download PNG or JPEG images, export PDF documents, or use the print and batch tools when they fit your work.',
      },
      {
        question: 'Do I need an account to use the coat of arms maker?',
        answer:
          'No. You can use Coat of Arms Maker to edit and export a design directly in the browser, and the project stays in your current browser.',
      },
      {
        question: 'Can I add my own images to the coat of arms?',
        answer:
          'Yes. Add a local image to Coat of Arms Maker, adjust its position, size, and layer in the editor, then export it as part of the finished design.',
      },
    ],
    relatedToolsHeading: 'Keep creating',
    contextualLinks: [
      { href: '/templates/square-token-maker', label: 'Square Token Maker' },
      { href: '/dice-roller-dnd', label: 'Dice Roller' },
      { href: '/faq', label: 'Read the FAQ' },
    ],
    webApplicationFeatureNames: [
      'Shield styles and field patterns',
      'Charges, text, layers, and drawing tools',
      'PNG, JPEG, PDF, and batch export options',
    ],
  },
  zh: {
    heading: chineseTitle,
    metadataTitle: chineseTitle,
    metadataDescription: chineseDescription,
    introduction: chineseDescription,
    whatIsTitle: '什么是纹章制作器？',
    whatIsDescription:
      '纹章制作器是一款免费在线视觉编辑工具，用于制作自己的盾徽、角色标志和公会徽章。你可以选择盾形与底纹，组合图形、文字和图层，也可加入图片或绘制细节。完成后将设计导出为 PNG、JPEG 或 PDF。',
    howItWorksEyebrow: '使用方式',
    howItWorksHeading: '如何使用纹章制作器？',
    howItWorksSteps: [
      {
        title: '选择盾形与底纹',
        description: '使用纹章制作器选择盾形，设置底色分区，再调整底纹和颜色，确定设计基础。',
      },
      {
        title: '组合图形与文字',
        description: '使用纹章制作器组合内置图形和文字，也可以加入自己的图片或绘制额外细节。',
      },
      {
        title: '预览并导出',
        description: '在纹章制作器中预览设计，调整图层位置和大小，再下载 PNG、JPEG 或 PDF。',
      },
    ],
    featureOverview: {
      title: '设计属于你的纹章',
      subtitle: '使用纹章制作器选择盾形与底纹，加入图形和格言，再调整细节并导出设计，整个过程都在浏览器中完成。',
      features: [
        {
          icon: 'shield',
          title: '盾形与底纹',
          description: '使用纹章制作器选择盾牌轮廓，划分底色区域，再调整底纹与颜色，为设计打好基础。',
        },
        {
          icon: 'symbols',
          title: '图形符号',
          description: '在纹章制作器中按分类浏览内置图形，加入适合角色、家族或公会的纹章符号。',
        },
        {
          icon: 'text',
          title: '文字与格言',
          description: '在纹章制作器中加入普通文字、弧形文字或环形文字，填写名字与格言，再调整字体、大小和颜色。',
        },
        {
          icon: 'layers',
          title: '图层管理',
          description: '使用纹章制作器调整图层顺序，分组、隐藏、锁定或复制元素，并设置位置、大小、旋转和透明度。',
        },
        {
          icon: 'drawing',
          title: '绘图与自有图片',
          description: '在纹章制作器中加入设备上的图片，或用可调整粗细、颜色和透明度的画笔绘制细节。',
        },
        {
          icon: 'export',
          title: '草稿恢复与导出',
          description: '如果浏览器仍保留纹章制作器的最近草稿，可恢复后继续编辑；完成后下载 PNG、JPEG 或 PDF。',
        },
      ],
    },
    comparisonHeading: '为什么选择我们的纹章制作器',
    comparisonLead: '无需账号或付费方案，即可使用纹章制作器开始制作。你可以免费加入自己的图片，在浏览器中完成原创纹章，并导出 PNG、JPEG 或 PDF；需要时也能打印或批量导出。',
    comparisonDimensionHeading: '对比维度',
    comparisonTableLabel: '纹章制作器对比',
    comparisonColumns: ['我们的纹章制作器', 'CoaMaker', 'Roll for Fantasy'],
    comparisonRows: [
      {
        rowLabel: '开始',
        cellText: [
          '打开纹章制作器即可在画布上直接开画，免登录、免付费墙。',
          '也是打开即用，但免费界面已有广告、顶栏 Go Pro，以及编辑器内的 Upgrade Now 升级卡。',
          '内嵌加载，免登录、免付费墙。',
        ],
      },
      {
        rowLabel: '编辑',
        cellText: [
          '本地图片免费用，无 PRO 门槛，另有盾形、底纹、图形、文字、图层与绘图工具。',
          '上传自有图片、自定义盾形轮廓、额外元素包都要 PRO。',
          '在仅 248×275 的小画布上选盾、冠饰和配色来拼，且其图片不得用于另一个纹章制作器。',
        ],
      },
      {
        rowLabel: '导出',
        cellText: [
          '纹章制作器支持一键真导出 PNG、JPEG、PDF，同一菜单还有打印与批量 ZIP。',
          '导出对话框对当前设计提供 PNG、JPG、PDF、打印和分享。',
          '导出是"Turn to image"后右键保存；实测点击后无图、无下载链接，失败时只建议截图。',
        ],
      },
      {
        rowLabel: '账号',
        cellText: [
          '免登录、免付费墙，本地优先，浏览器草稿刷新后可恢复。',
          '保存设计、模板、上传都在 PRO 后面，免费编辑器有广告，默认授权为非商用。',
          '无付费墙，但页面投广告并请访客赞助，商用还需站方许可。',
        ],
      },
    ],
    editorCtaHeading: '从一面盾开始，做出属于你的标志',
    editorCtaEmphasis: '在纹章制作器中继续调整盾形、底纹、图形和文字',
    editorCtaDescription: '在编辑器里完成设计，再从设备上导出 PNG、JPEG 或 PDF，用于角色、阵营、社团或虚构家族。',
    editorCtaLabel: '开始制作纹章',
    faqEyebrow: 'FAQ',
    faqHeading: '常见问题',
    faqDescription: '了解免费使用纹章制作器、浏览器草稿、账号、自有图片和导出格式等常见问题。',
    faqItems: [
      {
        question: '纹章制作器可以免费使用吗？',
        answer: '可以。你可以直接使用纹章制作器在浏览器中创建和导出设计，不需要付费方案。',
      },
      {
        question: '以后还能继续编辑吗？',
        answer: '可以。重新打开纹章制作器时，如果浏览器仍保留最近草稿，可以恢复后继续调整。需要成品时再导出图片。',
      },
      {
        question: '可以导出哪些格式？',
        answer: '使用纹章制作器可导出 PNG、JPEG 和 PDF；需要时也能使用打印或批量导出工具。',
      },
      {
        question: '使用纹章制作器需要注册账号吗？',
        answer: '不需要。你可以直接在纹章制作器中编辑和导出设计，项目会保留在当前浏览器中。',
      },
      {
        question: '可以把自己的图片加入纹章吗？',
        answer: '可以。你可以把本地图片加入纹章制作器，在编辑器中调整位置、大小和图层，然后随整个设计一起导出。',
      },
    ],
    relatedToolsHeading: '继续创作',
    contextualLinks: [
      { href: '/templates/square-token-maker', label: '方形 Token 制作器' },
      { href: '/dice-roller-dnd', label: '骰子工具' },
      { href: '/faq', label: '查看常见问题' },
    ],
    webApplicationFeatureNames: [
      '盾牌样式与底纹',
      '图形、文字、图层和绘图工具',
      'PNG、JPEG、PDF 与批量导出选项',
    ],
  },
};

function assertCoatMakerSeoLocale(locale: SiteLocale): void {
  if (!Object.hasOwn(coatMakerSeoCopyByLocale, locale)) {
    throw new Error(`Unsupported Coat Maker SEO locale: ${locale}`);
  }
}

function assertCopyField(fieldName: string, value: string, locale: SiteLocale): void {
  if (value.trim().length === 0) {
    throw new Error(`Missing Coat Maker SEO field ${fieldName} for locale: ${locale}`);
  }
}

function assertDisplayCopyField(fieldName: string, value: string, locale: SiteLocale): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid Coat Maker display field ${fieldName} for locale ${locale}: ${JSON.stringify(value)}`);
  }
}

const allowedCoatMakerFeatureIcons: readonly CoatMakerFeatureIcon[] = [
  'shield', 'symbols', 'text', 'layers', 'drawing', 'export',
];

function assertCoatMakerFeatureText(fieldName: string, value: string, locale: SiteLocale): void {
  if (value.trim().length === 0) {
    throw new Error(`Invalid Coat Maker SEO field ${fieldName} for locale ${locale}: ${JSON.stringify(value)}`);
  }
}

function assertCoatMakerFeatureOverview(
  featureOverview: CoatMakerFeatureOverviewCopy,
  locale: SiteLocale,
): void {
  assertCoatMakerFeatureText('featureOverview.title', featureOverview.title, locale);
  assertCoatMakerFeatureText('featureOverview.subtitle', featureOverview.subtitle, locale);
  if (featureOverview.features.length !== 6) {
    throw new Error(`Invalid Coat Maker SEO featureOverview.features length for locale ${locale}: ${String(featureOverview.features.length)}`);
  }
  for (const [featureIndex, feature] of featureOverview.features.entries()) {
    if (!allowedCoatMakerFeatureIcons.includes(feature.icon)) {
      throw new Error(`Invalid Coat Maker SEO featureOverview.features[${featureIndex}].icon for locale ${locale}: ${JSON.stringify(feature.icon)}`);
    }
    assertCoatMakerFeatureText(`featureOverview.features[${featureIndex}].title`, feature.title, locale);
    assertCoatMakerFeatureText(`featureOverview.features[${featureIndex}].description`, feature.description, locale);
  }
}

function assertCoatMakerHowItWorksCopy(
  eyebrow: string,
  heading: string,
  steps: CoatMakerSeoCopy['howItWorksSteps'],
  locale: SiteLocale,
): void {
  assertDisplayCopyField('howItWorksEyebrow', eyebrow, locale);
  assertDisplayCopyField('howItWorksHeading', heading, locale);

  if (!Array.isArray(steps) || steps.length !== 3) {
    throw new Error(
      `Invalid Coat Maker SEO field howItWorksSteps[index=all] for locale ${locale}: ${JSON.stringify(steps)}`,
    );
  }

  for (const [stepIndex, howItWorksStep] of steps.entries()) {
    if (howItWorksStep === null || typeof howItWorksStep !== 'object') {
      throw new Error(
        `Invalid Coat Maker SEO field howItWorksSteps[${stepIndex}] for locale ${locale}: ${JSON.stringify(howItWorksStep)}`,
      );
    }
    assertDisplayCopyField(`howItWorksSteps[${stepIndex}].title`, howItWorksStep.title, locale);
    assertDisplayCopyField(`howItWorksSteps[${stepIndex}].description`, howItWorksStep.description, locale);
  }
}

function assertCoatMakerSeoCopyFields(copy: CoatMakerSeoCopy, locale: SiteLocale): void {
  assertCopyField('heading', copy.heading, locale);
  assertCopyField('metadataTitle', copy.metadataTitle, locale);
  assertCopyField('metadataDescription', copy.metadataDescription, locale);
  assertCopyField('introduction', copy.introduction, locale);
  assertCoatMakerFeatureText('whatIsTitle', copy.whatIsTitle, locale);
  assertCoatMakerFeatureText('whatIsDescription', copy.whatIsDescription, locale);
  assertCoatMakerHowItWorksCopy(
    copy.howItWorksEyebrow,
    copy.howItWorksHeading,
    copy.howItWorksSteps,
    locale,
  );
  assertCoatMakerFeatureOverview(copy.featureOverview, locale);
  assertCopyField('comparisonHeading', copy.comparisonHeading, locale);
  assertCopyField('comparisonLead', copy.comparisonLead, locale);
  assertDisplayCopyField('comparisonDimensionHeading', copy.comparisonDimensionHeading, locale);
  assertDisplayCopyField('comparisonTableLabel', copy.comparisonTableLabel, locale);
  assertCopyField('editorCtaHeading', copy.editorCtaHeading, locale);
  assertCopyField('editorCtaEmphasis', copy.editorCtaEmphasis, locale);
  assertCopyField('editorCtaDescription', copy.editorCtaDescription, locale);
  assertCopyField('editorCtaLabel', copy.editorCtaLabel, locale);
  assertDisplayCopyField('faqEyebrow', copy.faqEyebrow, locale);
  assertCopyField('faqHeading', copy.faqHeading, locale);
  assertDisplayCopyField('faqDescription', copy.faqDescription, locale);
  assertCopyField('relatedToolsHeading', copy.relatedToolsHeading, locale);

  if (copy.heading !== copy.metadataTitle) {
    throw new Error(`Missing Coat Maker SEO field heading for locale: ${locale}`);
  }

  if (copy.introduction !== copy.metadataDescription) {
    throw new Error(`Missing Coat Maker SEO field introduction for locale: ${locale}`);
  }

  if (copy.comparisonColumns.length !== 3) {
    throw new Error(`Missing Coat Maker SEO field comparisonColumns for locale: ${locale}`);
  }

  for (const [columnIndex, comparisonColumn] of copy.comparisonColumns.entries()) {
    assertCopyField(`comparisonColumns[${columnIndex}]`, comparisonColumn, locale);
  }

  if (copy.comparisonRows.length !== 4) {
    throw new Error(`Missing Coat Maker SEO field comparisonRows for locale: ${locale}`);
  }

  for (const [rowIndex, comparisonRow] of copy.comparisonRows.entries()) {
    assertCopyField(`comparisonRows[${rowIndex}].rowLabel`, comparisonRow.rowLabel, locale);

    if (comparisonRow.cellText.length !== 3) {
      throw new Error(`Missing Coat Maker SEO field comparisonRows[${rowIndex}].cellText for locale: ${locale}`);
    }

    for (const [cellIndex, cellText] of comparisonRow.cellText.entries()) {
      assertCopyField(`comparisonRows[${rowIndex}].cellText[${cellIndex}]`, cellText, locale);
    }
  }

  if (copy.faqItems.length !== 5) {
    throw new Error(`Missing Coat Maker SEO field faqItems for locale: ${locale}`);
  }

  for (const [faqIndex, faqItem] of copy.faqItems.entries()) {
    assertCopyField(`faqItems[${faqIndex}].question`, faqItem.question, locale);
    assertCopyField(`faqItems[${faqIndex}].answer`, faqItem.answer, locale);
  }

  if (copy.contextualLinks.length !== 3) {
    throw new Error(`Missing Coat Maker SEO field contextualLinks for locale: ${locale}`);
  }

  for (const [linkIndex, contextualLink] of copy.contextualLinks.entries()) {
    assertCopyField(`contextualLinks[${linkIndex}].href`, contextualLink.href, locale);
    assertCopyField(`contextualLinks[${linkIndex}].label`, contextualLink.label, locale);
  }

  if (copy.webApplicationFeatureNames.length !== 3) {
    throw new Error(`Missing Coat Maker SEO field webApplicationFeatureNames for locale: ${locale}`);
  }

  for (const [featureIndex, featureName] of copy.webApplicationFeatureNames.entries()) {
    assertCopyField(`webApplicationFeatureNames[${featureIndex}]`, featureName, locale);
  }
}

export function getCoatMakerSeoCopy(locale: SiteLocale): CoatMakerSeoCopy {
  assertCoatMakerSeoLocale(locale);
  const copy = coatMakerSeoCopyByLocale[locale];
  assertCoatMakerSeoCopyFields(copy, locale);
  return copy;
}
