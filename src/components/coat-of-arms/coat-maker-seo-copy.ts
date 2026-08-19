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
  useCases: readonly string[];
  privacyHeading: string;
  localPrivacy: string;
  exportExplanation: string;
  faqHeading: string;
  faqItems: readonly CoatMakerSeoFaqItem[];
  relatedToolsHeading: string;
  contextualLinks: readonly CoatMakerSeoLink[];
  webApplicationFeatureNames: readonly string[];
}

const coatMakerSeoCopyByLocale: Record<SiteLocale, CoatMakerSeoCopy> = {
  en: {
    heading: 'Coat of Arms Maker',
    metadataTitle: 'Coat of Arms Maker — Free Online Heraldry Creator',
    metadataDescription:
      'Use this free coat of arms maker to customize shields, colours, charges, text, and layers in your browser, then export PNG, JPEG, or PDF files.',
    introduction:
      'Build a personal heraldic design in the browser, then export a finished image for your game, group, or story. Start from a blank shield, refine the colours, symbols, and wording at your own pace before sharing a finished result.',
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
    useCasesHeading: 'Useful for',
    useCases: [
      'Tabletop campaign houses and factions',
      'Guild, club, and community identities',
      'Fantasy characters and family banners',
      'Props for personal worldbuilding projects',
    ],
    privacyHeading: 'Local editing and exports',
    localPrivacy: 'Your project stays in your browser',
    exportExplanation:
      'Exports are handled on your device, so you can keep working without sending a design to an account or shared workspace.',
    faqHeading: 'Frequently asked questions',
    faqItems: [
      {
        question: 'Is this coat of arms maker free to use?',
        answer: 'Yes. You can create and export a design in the browser without a paid plan.',
      },
      {
        question: 'Can I return to a design later?',
        answer: 'Yes. If the browser still has a recent draft, you can restore it when you reopen the maker. Export an image when you want a finished copy.',
      },
      {
        question: 'Which image formats can I export?',
        answer: 'Use PNG or JPEG for images, export PDF for documents, or use the print and batch tools when they fit your work.',
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
    heading: '纹章制作器',
    metadataTitle: '纹章制作器 | 免费徽章编辑器',
    metadataDescription: '使用这款免费纹章制作器，在浏览器中自定义盾牌、颜色、图形、文字和图层，并导出 PNG、JPEG 或 PDF 文件。',
    introduction: '在浏览器中组合盾牌、颜色、图形、文字与图层，制作适合游戏、社团或个人故事的徽记。打开页面即可开始，不必安装软件。',
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
    useCasesHeading: '适合用于',
    useCases: [
      '桌面角色扮演中的家族与阵营',
      '公会、社团和社区标识',
      '奇幻角色与家族旗帜',
      '个人世界观设定的道具',
    ],
    privacyHeading: '本地编辑与导出',
    localPrivacy: '你的项目保留在浏览器中',
    exportExplanation: '导出由你的设备处理，无需把设计发送到账号或共享工作区，也能继续编辑。',
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

export function getCoatMakerSeoCopy(locale: SiteLocale): CoatMakerSeoCopy {
  if (!Object.hasOwn(coatMakerSeoCopyByLocale, locale)) {
    throw new Error(`Unsupported Coat Maker SEO locale: ${locale}`);
  }

  const copy = coatMakerSeoCopyByLocale[locale];

  return copy;
}
