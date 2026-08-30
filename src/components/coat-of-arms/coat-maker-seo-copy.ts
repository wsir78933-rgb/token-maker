import type { SiteLocale } from '@/lib/site-locale';

interface CoatMakerSeoStep {
  title: string;
  description: string;
}

interface CoatMakerSeoFaqItem {
  question: string;
  answer: string;
}

interface CoatMakerSeoLink {
  href: string;
  label: string;
}

export interface CoatMakerSeoUseCase {
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
}

export interface CoatMakerSeoComparisonRow {
  rowLabel: string;
  cellText: readonly string[];
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
  stepsHeading: string;
  stepsAriaLabel: string;
  steps: readonly CoatMakerSeoStep[];
  featuresHeading: string;
  verifiedCapabilities: readonly string[];
  useCasesHeading: string;
  useCasesLead: string;
  useCases: readonly CoatMakerSeoUseCase[];
  comparisonHeading: string;
  comparisonLead: string;
  comparisonColumns: readonly string[];
  comparisonRows: readonly CoatMakerSeoComparisonRow[];
  editorCtaHeading: string;
  editorCtaEmphasis: string;
  editorCtaDescription: string;
  editorCtaLabel: string;
  faqHeading: string;
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
    stepsHeading: 'Create a heraldic design in three steps',
    stepsAriaLabel: 'Coat maker steps',
    steps: [
      {
        title: 'Choose a shield',
        description: 'Start with a shield style and field pattern that give the design its structure.',
      },
      {
        title: 'Add your symbols',
        description: 'Place charges, text, colours, and layers until the design reads clearly at a glance.',
      },
      {
        title: 'Finish and export',
        description: 'Adjust the final details, then export the image when it is ready.',
      },
    ],
    featuresHeading: 'Tools for a complete design',
    verifiedCapabilities: [
      'Shield styles, field patterns, charges, text, layers, and drawing tools',
      'Browser draft recovery after a reload',
      'PNG, JPEG, PDF, print, and batch export options',
    ],
    useCasesHeading: 'Jobs for this coat of arms maker',
    useCasesLead:
      'Most people arrive with a table, a club, a character, or a map that needs a mark they can export from this page and reuse on a handout, a header, or a title sheet.',
    useCases: [
      {
        title: 'Tabletop houses and factions',
        body: 'Give each tabletop house or faction a shield that still reads on a session handout, a virtual table portrait frame, or a printed banner behind the screen. This coat of arms maker lets you lock one strong charge as the house tell so players can spot the mark across the table without squinting at tiny flourishes or a busy field. Keep the field quieter than the charge, export a PNG for the digital table and a PDF for the printed pack, and reuse the same shield on every faction sheet in the campaign so the set stays consistent from the first session to the last.',
        imageSrc: '/coat-of-arms-maker/use-cases/tabletop-houses.webp',
        imageAlt: 'House shields laid out on a tabletop session handout',
      },
      {
        title: 'Guild, club, and community badges',
        body: 'Make a badge for a guild, a live-action group, a weekend club, or a community header that has to work as a small icon and as a sticker on a printed sheet. A coat of arms maker on this page gives you a clean-edged PNG you can drop on a roster, a header, and a print sheet without redrawing the mark in a second file. Pick one symbol, one contrast pair, and a short name on its own layer; if the badge muddies at stamp size, delete decoration instead of adding more charges to the field.',
        imageSrc: '/coat-of-arms-maker/use-cases/guild-badges.webp',
        imageAlt: 'A guild badge on a roster header and a printed sticker sheet',
      },
      {
        title: 'Fantasy characters and invented banners',
        body: 'Invent a banner for a fantasy character who never had a historical crest: a motto on a ribbon and a single beast is enough for a character sheet, a chapter heading, or a costume cloak. Use this coat of arms maker to try colours and charges until the thumbnail still reads at a glance, then export the file for the story rather than hunting a lineage you do not have. You are drawing an original graphic for fiction, a live-action persona, or a house that exists only in the campaign notes you already keep.',
        imageSrc: '/coat-of-arms-maker/use-cases/fantasy-banners.webp',
        imageAlt: 'An invented banner on a character sheet and a costume cloak',
      },
      {
        title: 'Worldbuilding maps and title pages',
        body: 'Build a set of banners for regional maps, title pages, appendix charts, and notebook headers so every place in the setting carries a mark that belongs on that page. Batch export helps when the same shield has to exist as a tiny map icon and as a large title-page plate without redrawing the charges by hand each time the scale changes for a print run. Keep a shared field colour across neighbouring regions if you want the atlas to feel like one world, and change only the main charge so readers can tell the realms apart at a glance on the map, the title page, and the notes.',
        imageSrc: '/coat-of-arms-maker/use-cases/worldbuilding-maps.webp',
        imageAlt: 'Regional banners on a setting map and a title page',
      },
    ],
    comparisonHeading: 'Why choose our coat of arms maker',
    comparisonLead:
      'Start creating without an account or paid plan. Add your own images for free, finish an original coat of arms in the browser, and export PNG, JPEG, or PDF; print and batch export are available when you need them.',
    comparisonColumns: ['Our coat of arms maker', 'CoaMaker', 'Roll for Fantasy'],
    comparisonRows: [
      {
        rowLabel: 'Start',
        cellText: [
          'Open the page and draw at once — the editor is already on the canvas, with no login and no paywall.',
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
          'One-click real export to PNG, JPEG, or PDF, with print and batch ZIP in the same menu.',
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
    editorCtaEmphasis: 'Keep shaping the shield, field, symbols, and text',
    editorCtaDescription:
      'Finish your design in the editor, then export PNG, JPEG, or PDF for a character, faction, guild, or invented family.',
    editorCtaLabel: 'Start creating',
    faqHeading: 'Frequently asked questions',
    faqItems: [
      {
        question: 'Is this coat of arms maker free to use?',
        answer: 'Yes. You can create and export a design in the browser without a paid plan.',
      },
      {
        question: 'Can I return to a design later?',
        answer:
          'Yes. If the browser still has a recent draft, you can restore it when you reopen the maker. Export an image when you want a finished copy.',
      },
      {
        question: 'Which image formats can I export?',
        answer:
          'Use PNG or JPEG for images, export PDF for documents, or use the print and batch tools when they fit your work.',
      },
      {
        question: 'Do I need an account to use the coat of arms maker?',
        answer:
          'No. You can edit and export a design directly in the browser, and the project stays in your current browser.',
      },
      {
        question: 'Can I add my own images to the coat of arms?',
        answer:
          'Yes. Add a local image, adjust its position, size, and layer in the editor, then export it as part of the finished design.',
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
    stepsHeading: '三步完成纹章设计',
    stepsAriaLabel: '纹章制作步骤',
    steps: [
      {
        title: '选择盾牌',
        description: '先选定盾牌样式和底纹，为整体结构定下基础。',
      },
      {
        title: '添加元素',
        description: '加入图形、文字、颜色和图层，让设计在缩小时依然清晰。',
      },
      {
        title: '完成并导出',
        description: '调整最后细节，再导出完成的图片。',
      },
    ],
    featuresHeading: '完成设计所需的工具',
    verifiedCapabilities: [
      '盾牌样式、底纹、图形、文字、图层和绘图工具',
      '重新打开页面后可恢复浏览器草稿',
      'PNG、JPEG、PDF、打印和批量导出选项',
    ],
    useCasesHeading: '这个纹章制作器适合完成的工作',
    useCasesLead: '多数人带着一桌游戏、一个社团、一个角色或一张地图而来，在本页导出后带走。',
    useCases: [
      {
        title: '桌面团的家族与阵营',
        body: '给桌面团里每个家族或阵营一块在讲义、头像框或印刷旗帜上仍能认出的盾。用这个纹章制作器锁住一枚主图当家记，玩家隔桌也能认出。底纹比主图安静，导出 PNG 给电子桌面、PDF 给印刷包，同一盾用在每张阵营表上。',
        imageSrc: '/coat-of-arms-maker/use-cases/tabletop-houses.webp',
        imageAlt: '几面家族盾摆在桌面团讲义上',
      },
      {
        title: '公会、社团和社区徽章',
        body: '给公会、社团、周末俱乐部或社区页眉做徽章，既当小图标也能印贴纸。本页编辑器导出边缘干净的 PNG，名册和印刷页共用，不必另画。选一枚符号和一对对比色；发糊就删装饰。',
        imageSrc: '/coat-of-arms-maker/use-cases/guild-badges.webp',
        imageAlt: '社团徽章印在名册页眉和贴纸页上',
      },
      {
        title: '奇幻角色与发明的旗帜',
        body: '给没有历史纹章的奇幻角色发明旗帜：一句格言加一只兽，就够用在角色卡或服饰上。在本页试颜色和图形，缩略图能读再交给故事，不必追查谱系。你画的是虚构或战役笔记里家族的原创图形。',
        imageSrc: '/coat-of-arms-maker/use-cases/fantasy-banners.webp',
        imageAlt: '角色卡和披风上的虚构旗帜',
      },
      {
        title: '世界观地图与扉页',
        body: '给地图、扉页、附录和笔记做一套旗帜，让每个地方带着属于那一页的标识。同一盾要当小图标和大图时，用批量导出。相邻地区共用底色、只改主图。',
        imageSrc: '/coat-of-arms-maker/use-cases/worldbuilding-maps.webp',
        imageAlt: '设定地图和扉页上的地区旗帜',
      },
    ],
    comparisonHeading: '为什么选择我们的纹章制作器',
    comparisonLead: '无需账号或付费方案，即可开始制作。你可以免费加入自己的图片，在浏览器中完成原创纹章，并导出 PNG、JPEG 或 PDF；需要时也能打印或批量导出。',
    comparisonColumns: ['我们的纹章制作器', 'CoaMaker', 'Roll for Fantasy'],
    comparisonRows: [
      {
        rowLabel: '开始',
        cellText: [
          '打开即在画布上，免登录、免付费墙，直接开画。',
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
          '一键真导出 PNG、JPEG、PDF，同一菜单还有打印与批量 ZIP。',
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
    editorCtaEmphasis: '盾形、底纹、图形和文字都可以继续调整',
    editorCtaDescription: '在编辑器里完成设计，再从设备上导出 PNG、JPEG 或 PDF，用于角色、阵营、社团或虚构家族。',
    editorCtaLabel: '开始制作纹章',
    faqHeading: '常见问题',
    faqItems: [
      {
        question: '纹章制作器可以免费使用吗？',
        answer: '可以。你可以直接在浏览器中创建和导出设计，不需要付费方案。',
      },
      {
        question: '以后还能继续编辑吗？',
        answer: '可以。重新打开制作器时，如果浏览器仍保留最近草稿，可以恢复后继续调整。需要成品时再导出图片。',
      },
      {
        question: '可以导出哪些格式？',
        answer: '可导出 PNG、JPEG 和 PDF；需要时也能使用打印或批量导出工具。',
      },
      {
        question: '使用纹章制作器需要注册账号吗？',
        answer: '不需要。你可以直接在浏览器中编辑和导出设计，项目会保留在当前浏览器中。',
      },
      {
        question: '可以把自己的图片加入纹章吗？',
        answer: '可以。你可以加入本地图片，在编辑器中调整位置、大小和图层，然后随整个设计一起导出。',
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

function assertCoatMakerSeoCopyFields(copy: CoatMakerSeoCopy, locale: SiteLocale): void {
  assertCopyField('heading', copy.heading, locale);
  assertCopyField('metadataTitle', copy.metadataTitle, locale);
  assertCopyField('metadataDescription', copy.metadataDescription, locale);
  assertCopyField('introduction', copy.introduction, locale);
  assertCopyField('stepsHeading', copy.stepsHeading, locale);
  assertCopyField('stepsAriaLabel', copy.stepsAriaLabel, locale);
  assertCopyField('featuresHeading', copy.featuresHeading, locale);
  assertCopyField('useCasesHeading', copy.useCasesHeading, locale);
  assertCopyField('useCasesLead', copy.useCasesLead, locale);
  assertCopyField('comparisonHeading', copy.comparisonHeading, locale);
  assertCopyField('comparisonLead', copy.comparisonLead, locale);
  assertCopyField('editorCtaHeading', copy.editorCtaHeading, locale);
  assertCopyField('editorCtaEmphasis', copy.editorCtaEmphasis, locale);
  assertCopyField('editorCtaDescription', copy.editorCtaDescription, locale);
  assertCopyField('editorCtaLabel', copy.editorCtaLabel, locale);
  assertCopyField('faqHeading', copy.faqHeading, locale);
  assertCopyField('relatedToolsHeading', copy.relatedToolsHeading, locale);

  if (copy.heading !== copy.metadataTitle) {
    throw new Error(`Missing Coat Maker SEO field heading for locale: ${locale}`);
  }

  if (copy.introduction !== copy.metadataDescription) {
    throw new Error(`Missing Coat Maker SEO field introduction for locale: ${locale}`);
  }

  if (copy.steps.length !== 3) {
    throw new Error(`Missing Coat Maker SEO field steps for locale: ${locale}`);
  }

  for (const [stepIndex, step] of copy.steps.entries()) {
    assertCopyField(`steps[${stepIndex}].title`, step.title, locale);
    assertCopyField(`steps[${stepIndex}].description`, step.description, locale);
  }

  if (copy.verifiedCapabilities.length !== 3) {
    throw new Error(`Missing Coat Maker SEO field verifiedCapabilities for locale: ${locale}`);
  }

  for (const [capabilityIndex, capability] of copy.verifiedCapabilities.entries()) {
    assertCopyField(`verifiedCapabilities[${capabilityIndex}]`, capability, locale);
  }

  if (copy.useCases.length !== 4) {
    throw new Error(`Missing Coat Maker SEO field useCases for locale: ${locale}`);
  }

  for (const [useCaseIndex, useCase] of copy.useCases.entries()) {
    assertCopyField(`useCases[${useCaseIndex}].title`, useCase.title, locale);
    assertCopyField(`useCases[${useCaseIndex}].body`, useCase.body, locale);
    assertCopyField(`useCases[${useCaseIndex}].imageSrc`, useCase.imageSrc, locale);
    assertCopyField(`useCases[${useCaseIndex}].imageAlt`, useCase.imageAlt, locale);
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
