import type { Metadata } from 'next';
import {
  absoluteUrl,
  getCollectionPageCopy,
  getFaqItems,
  getPrivacySections,
  getSiteConfig,
  getSiteUrl,
  type FaqItem,
} from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';


export interface FaqDocGroup {
  id: string;
  title: string;
  description: string;
  itemIndexes: number[];
}

export interface FaqDocModel {
  updatedAt: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  groups: FaqDocGroup[];
  signals: Array<{ title: string; description: string }>;
}

export interface PrivacyDocModel {
  updatedAt: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  principles: Array<{ title: string; description: string }>;
  commitments: string[];
}


const faqDocModels: Record<SiteLocale, FaqDocModel> = {
  en: {
    updatedAt: '2026-03-17',
    eyebrow: 'FAQ',
    title: 'Five common questions about Token Maker',
    description: 'Find quick answers about workflow fit, image handling, styles, and export size.',
    intro:
      'Use this page when you want the short version first. Each section answers a practical question, then points you to the editor, templates, or privacy note when a deeper check is useful.',
    groups: [
      {
        id: 'fit',
        title: 'Start here',
        description: 'Confirm what the editor is for and whether the tabletop workflow matches your use case.',
        itemIndexes: [0, 2],
      },
      {
        id: 'control',
        title: 'Control and style',
        description: 'Know what stays local and how far you can push masks, borders, and campaign-specific styling.',
        itemIndexes: [1, 3],
      },
      {
        id: 'export',
        title: 'Export call',
        description: 'Pick a first-pass resolution without overbuilding every token.',
        itemIndexes: [4],
      },
    ],
    signals: [
      {
        title: 'What the tool is good at',
        description: 'Understand whether Token Maker matches the tabletop workflow you already use.',
      },
      {
        title: 'How local editing works',
        description: 'See what stays in the browser during the default crop-and-export flow.',
      },
      {
        title: 'What to export first',
        description: 'Pick a sensible PNG size without overbuilding every token from the start.',
      },
    ],
  },
  zh: {
    updatedAt: '2026-03-17',
    eyebrow: '常见问题',
    title: '关于 Token Maker 的五个常见问题',
    description: '集中回答工作流适配、图片处理、样式选择和导出尺寸这些高频问题。',
    intro:
      '想先看简洁版答案，就从这里开始。每一组问题都只回答实际使用中最常见的判断点，需要更深入时再继续去编辑器、模板页或隐私说明。',
    groups: [
      {
        id: 'fit',
        title: '先确认适不适合',
        description: '先判断这个编辑器主要解决什么问题，以及你的桌面工作流是否匹配。',
        itemIndexes: [0, 2],
      },
      {
        id: 'control',
        title: '控制边界与样式空间',
        description: '弄清默认本地处理边界，以及形状、边框和遮罩能扩展到什么程度。',
        itemIndexes: [1, 3],
      },
      {
        id: 'export',
        title: '导出怎么拍板',
        description: '先选出一个够用的分辨率，不要一开始就把每张 token 都做得过重。',
        itemIndexes: [4],
      },
    ],
    signals: [
      {
        title: '这个工具适合做什么',
        description: '先判断 Token Maker 是否匹配你现在的桌面工作流。',
      },
      {
        title: '默认图片怎么处理',
        description: '了解正常裁切和导出流程里，图片会不会离开浏览器。',
      },
      {
        title: '先导出多大合适',
        description: '先选一个够用的 PNG 尺寸，不必一开始就把每张 token 都做得很重。',
      },
    ],
  },
};

const privacyDocModels: Record<SiteLocale, PrivacyDocModel> = {
  en: {
    updatedAt: '2026-03-17',
    eyebrow: 'Privacy',
    title: 'How Token Maker handles images by default',
    description: 'Learn how the default local-first workflow handles image editing, PNG export, and any future remote features.',
    intro:
      'In the normal browser workflow, portrait images do not need to be uploaded just to crop or export a token.',
    principles: [
      {
        title: 'Default editing stays local',
        description: 'If a portrait can stay in the browser for the normal workflow, the product should say so clearly and behave that way.',
      },
      {
        title: 'Remote features need upfront disclosure',
        description: 'If uploads, share links, or hosted storage are added later, the provider, retention window, and deletion behavior should be explained before launch.',
      },
      {
        title: 'Operational details belong here',
        description: 'Analytics, error tracking, and abuse controls should stay on this page so the editor can stay focused on making tokens.',
      },
    ],
    commitments: [
      'Image-handling expectations change.',
      'Remote upload or hosted storage is introduced.',
      'Analytics or other operational tooling changes.',
    ],
  },
  zh: {
    updatedAt: '2026-03-17',
    eyebrow: '隐私',
    title: 'Token Maker 默认如何处理图片',
    description: '这里说明默认本地优先工作流如何处理图片、PNG 导出，以及未来如果加入远程能力会怎样披露。',
    intro:
      '在正常的浏览器工作流里，裁切和导出 token 不需要先把角色图上传到远程存储。',
    principles: [
      {
        title: '默认编辑流程留在本地浏览器',
        description: '如果日常工作流可以让图片一直停留在浏览器里，就应该直接说清楚，并让实现和说明保持一致。',
      },
      {
        title: '新增远程能力会先说明',
        description: '如果以后加入上传、分享链接或托管存储，会在正式启用前说明服务商、保留时间和删除方式。',
      },
      {
        title: '运维相关信息集中写在这里',
        description: '统计、错误追踪和限流这类说明会留在这页，不会混进制作 token 的主界面里。',
      },
    ],
    commitments: [
      '图片处理方式发生变化时。',
      '加入远程上传或托管存储时。',
      '统计或其他运维方案调整时。',
    ],
  },
};

const staticPageLastModifiedByLocale: Record<
  SiteLocale,
  Record<'faq' | 'privacy', string>
> = {
  en: {
    faq: faqDocModels.en.updatedAt,
    privacy: privacyDocModels.en.updatedAt,
  },
  zh: {
    faq: faqDocModels.zh.updatedAt,
    privacy: privacyDocModels.zh.updatedAt,
  },
};

export function getFaqDocModel(locale: SiteLocale): FaqDocModel & { items: FaqItem[] } {
  return {
    ...faqDocModels[locale],
    items: getFaqItems(locale),
  };
}

export function getPrivacyDocModel(locale: SiteLocale): PrivacyDocModel & {
  sections: ReturnType<typeof getPrivacySections>;
} {
  return {
    ...privacyDocModels[locale],
    sections: getPrivacySections(locale),
  };
}

export function getStaticPageLastModified(
  locale: SiteLocale,
  page: 'faq' | 'privacy',
) {
  return staticPageLastModifiedByLocale[locale][page];
}

export function createCollectionMetadata(locale: SiteLocale, page: 'faq' | 'privacy'): Metadata {
  const copy = getCollectionPageCopy(locale)[page];
  const path = getLocalizedPath(locale, page === 'faq' ? '/faq' : '/privacy');
  const siteConfig = getSiteConfig(locale);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: path,
      languages: getLanguageAlternates(page === 'faq' ? '/faq' : '/privacy'),
    },
    openGraph: {
      title: `${copy.title} | ${siteConfig.name}`,
      description: copy.description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: getSeoImageUrl(locale, page),
          width: 1200,
          height: 630,
          alt: copy.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${copy.title} | ${siteConfig.name}`,
      description: copy.description,
      images: [getSeoImageUrl(locale, page)],
    },
  };
}

export function buildBreadcrumbStructuredData(
  locale: SiteLocale,
  items: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(getLocalizedPath(locale, item.path)),
    })),
  };
}

export function buildCollectionStructuredData(
  locale: SiteLocale,
  path: '/faq' | '/privacy',
  name: string,
  description: string,
) {
  const siteConfig = getSiteConfig(locale);

  return {
    '@context': 'https://schema.org',
    '@type': path === '/privacy' ? 'WebPage' : 'CollectionPage',
    name,
    url: absoluteUrl(getLocalizedPath(locale, path)),
    description,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl(getLocalizedPath(locale, '/')),
    },
  };
}
