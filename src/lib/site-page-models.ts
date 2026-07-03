import type { Metadata } from 'next';
import {
  absoluteUrl,
  getAboutSections,
  getChangelogEntries,
  getCollectionPageCopy,
  getFaqItems,
  getPrivacySections,
  getSiteConfig,
  getSiteUrl,
  getTemplatePage,
  type FaqItem,
} from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath, type SiteLocale } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

export type StaticSupportPage = 'faq' | 'privacy' | 'about' | 'changelog';

type StaticSupportPath = `/${StaticSupportPage}`;
type SupportEvidenceLink = { label: string; path: StaticSupportPath };

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

export interface AboutDocModel {
  updatedAt: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  principles: Array<{ title: string; description: string; evidenceLink?: SupportEvidenceLink }>;
  sections: ReturnType<typeof getAboutSections>;
}

export interface ChangelogDocModel {
  updatedAt: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  entries: ReturnType<typeof getChangelogEntries>;
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
    updatedAt: '2026-07-03',
    eyebrow: 'Privacy',
    title: 'How Token Maker handles images, sharing, analytics, ads, and contact messages',
    description:
      'Current facts about local PNG downloads, public share links, R2 storage, Clarity, Google Analytics, Google advertising cookies, and contact messages.',
    intro:
      'Ordinary PNG downloads are generated locally in your browser. Copy-link and social-share actions use /api/share to upload a generated PNG to R2 and create a public share link.',
    principles: [
      {
        title: 'Default editing and download stay local',
        description: 'Cropping, framing, and the regular Download action use the browser workflow without requiring remote object storage.',
      },
      {
        title: 'Share links are public remote uploads',
        description: 'Copy link, X, Pinterest, and Reddit sharing upload a generated PNG through /api/share before opening or copying a public link.',
      },
      {
        title: 'Analytics are disclosed by current loading behavior',
        description: 'Microsoft Clarity is included on the live site outside development. Google Analytics runs only in production when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.',
      },
      {
        title: 'Google advertising cookies',
        description: 'Google and third-party advertising vendors may use cookies, web beacons, IP addresses, device identifiers, or similar technologies to serve and measure ads.',
      },
      {
        title: 'Contact messages go through Resend',
        description: 'The contact form sends your name, email address, message, and locale through Resend so I can reply and handle abuse reports.',
      },
    ],
    commitments: [
      'Token Maker does not provide a self-service deletion or retention promise on this page.',
      'Public share links are viewable by anyone who has the link.',
      'The regular Download action stays separate from copy-link and social-share uploads.',
      'Google Ads Settings and aboutads.info provide controls for some personalized ads.',
      'Contact message deletion requests can be sent through the contact page.',
    ],
  },
  zh: {
    updatedAt: '2026-07-03',
    eyebrow: '隐私',
    title: 'Token Maker 如何处理图片、分享、统计、广告和联系消息',
    description: '说明本地 PNG 下载、公开分享链接、R2 存储、Clarity、Google Analytics、Google 广告 Cookie 和联系消息的当前事实。',
    intro:
      '普通 PNG 下载会在你的浏览器本地生成。复制链接和社媒分享会通过 /api/share 上传生成后的 PNG 到 R2，并生成公开分享链接。',
    principles: [
      {
        title: '默认编辑和下载留在本地',
        description: '裁切、加框和普通下载使用浏览器流程，不要求远程对象存储参与。',
      },
      {
        title: '分享链接是公开远程上传',
        description: '复制链接、X、Pinterest 和 Reddit 分享会先通过 /api/share 上传生成后的 PNG，再打开或复制公开链接。',
      },
      {
        title: '统计加载行为按当前实现披露',
        description: 'Microsoft Clarity 会在非开发环境的站点加载。只有在生产环境且配置 NEXT_PUBLIC_GA_MEASUREMENT_ID 时，Google Analytics 才会启用。',
      },
      {
        title: 'Google 广告 Cookie',
        description: 'Google 和第三方广告供应商可能会使用 Cookie、网络信标、IP 地址、设备标识符或类似技术来投放和衡量广告。',
      },
      {
        title: '联系消息通过 Resend 发送',
        description: '联系表单会发送你的称呼、邮箱、消息内容和语言环境，并通过 Resend 发送到站点收件箱，方便回复和处理滥用反馈。',
      },
    ],
    commitments: [
      '这个页面没有提供自助删除入口，也没有提供保留承诺。',
      '拥有公开分享链接的人可以查看生成后的 Token 图片。',
      '普通下载动作和复制链接、社媒分享上传是分开的。',
      'Google 广告设置和 aboutads.info 提供部分个性化广告控制方式。',
      '联系消息的删除请求可以通过联系页面发送。',
    ],
  },
};

const aboutDocModels: Record<
  SiteLocale,
  Omit<AboutDocModel, 'sections'>
> = {
  en: {
    updatedAt: '2026-06-24',
    eyebrow: 'About',
    title: 'About Token Maker',
    description:
      'Token Maker is a browser-based VTT token editor for DnD, Roll20, Foundry VTT, Owlbear, and similar tabletop workflows.',
    intro:
      'The project focuses on one job: make tabletop tokens quickly from artwork you already have, while keeping the default editing workflow local-first.',
    principles: [
      {
        title: 'Narrow product scope',
        description: 'The editor is for token creation. Campaign management, asset hosting, and full image editing are kept outside the main workflow.',
      },
      {
        title: 'Clear image handling',
        description: 'A user should know what happens to private campaign art before dropping it into the editor.',
        evidenceLink: { label: 'Privacy', path: '/privacy' },
      },
      {
        title: 'Visible maintenance',
        description: 'Feedback can be sent through the contact page. Visible fixes may be recorded in changelog entries.',
        evidenceLink: { label: 'Changelog', path: '/changelog' },
      },
    ],
  },
  zh: {
    updatedAt: '2026-06-24',
    eyebrow: '关于',
    title: '关于 Token Maker',
    description:
      'Token Maker 是面向 DnD、Roll20、Foundry VTT、Owlbear 和类似桌面工作流的浏览器 VTT Token 编辑器。',
    intro:
      '这个项目只专注一件事：把你已经有的角色图快速做成桌面 Token，同时让默认编辑流程保持本地优先。',
    principles: [
      {
        title: '产品边界要窄',
        description: '编辑器只负责 Token 制作。战役管理、素材托管和完整修图功能不塞进主工作流。',
      },
      {
        title: '图片处理边界清楚',
        description: '用户在放入私有战役素材前，应该先知道默认裁切和导出流程会怎样处理图片。',
        evidenceLink: { label: '隐私', path: '/privacy' },
      },
      {
        title: '维护记录要看得见',
        description: '反馈可以通过联系页发送；可见修复可能记录在更新记录里。',
        evidenceLink: { label: '更新记录', path: '/changelog' },
      },
    ],
  },
};

const changelogDocModels: Record<
  SiteLocale,
  Omit<ChangelogDocModel, 'entries'>
> = {
  en: {
    updatedAt: '2026-06-24',
    eyebrow: 'Changelog',
    title: 'Token Maker Changelog',
    description:
      'Recent visible updates to the Token Maker site, support pages, and tabletop token workflow.',
    intro:
      'This page tracks product-facing changes that matter to users. Internal maintenance and minor copy edits are only listed when they affect the public workflow.',
  },
  zh: {
    updatedAt: '2026-06-24',
    eyebrow: '更新记录',
    title: 'Token Maker 更新记录',
    description:
      '记录 Token Maker 站点、支持页面和桌面 Token 工作流的近期可见更新。',
    intro:
      '这页只记录对用户有实际影响的产品变化。内部维护和小文案调整，只有影响公开工作流时才会列出。',
  },
};

const staticPageLastModifiedByLocale: Record<
  SiteLocale,
  Record<StaticSupportPage, string>
> = {
  en: {
    faq: faqDocModels.en.updatedAt,
    privacy: privacyDocModels.en.updatedAt,
    about: aboutDocModels.en.updatedAt,
    changelog: changelogDocModels.en.updatedAt,
  },
  zh: {
    faq: faqDocModels.zh.updatedAt,
    privacy: privacyDocModels.zh.updatedAt,
    about: aboutDocModels.zh.updatedAt,
    changelog: changelogDocModels.zh.updatedAt,
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

export function getAboutDocModel(locale: SiteLocale): AboutDocModel {
  return {
    ...aboutDocModels[locale],
    sections: getAboutSections(locale),
  };
}

export function getChangelogDocModel(locale: SiteLocale): ChangelogDocModel {
  return {
    ...changelogDocModels[locale],
    entries: getChangelogEntries(locale),
  };
}

export function getStaticPageLastModified(
  locale: SiteLocale,
  page: StaticSupportPage,
) {
  return staticPageLastModifiedByLocale[locale][page];
}

function getStaticSupportPath(page: StaticSupportPage): StaticSupportPath {
  return `/${page}`;
}

export function createCollectionMetadata(locale: SiteLocale, page: StaticSupportPage): Metadata {
  const copy = getCollectionPageCopy(locale)[page];
  const basePath = getStaticSupportPath(page);
  const path = getLocalizedPath(locale, basePath);
  const siteConfig = getSiteConfig(locale);
  const seoImageKind = page === 'faq' || page === 'privacy' ? page : 'home';

  return {
    metadataBase: new URL(getSiteUrl()),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: path,
      languages: getLanguageAlternates(basePath),
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
          url: getSeoImageUrl(locale, seoImageKind),
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
      images: [getSeoImageUrl(locale, seoImageKind)],
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
  path: StaticSupportPath,
  name: string,
  description: string,
  dateModified?: string,
) {
  const siteConfig = getSiteConfig(locale);

  return {
    '@context': 'https://schema.org',
    '@type': path === '/faq' ? 'CollectionPage' : path === '/about' ? 'AboutPage' : 'WebPage',
    name,
    url: absoluteUrl(getLocalizedPath(locale, path)),
    description,
    ...(dateModified ? { dateModified } : {}),
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: absoluteUrl(getLocalizedPath(locale, '/')),
    },
  };
}

export function createTemplatePageMetadata(locale: SiteLocale, slug: string): Metadata {
  const page = getTemplatePage(locale, slug);
  const siteConfig = getSiteConfig(locale);
  const path = `/templates/${slug}`;
  const localizedPath = getLocalizedPath(locale, path);

  if (!page) {
    return {
      title: locale === 'zh' ? '模板页不存在' : 'Template not found',
    };
  }

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      absolute: page.metadataTitle,
    },
    description: page.metadataDescription,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title: page.metadataTitle,
      description: page.metadataDescription,
      url: absoluteUrl(localizedPath),
      siteName: siteConfig.name,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: getSeoImageUrl(locale, 'home'),
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metadataTitle,
      description: page.metadataDescription,
      images: [getSeoImageUrl(locale, 'home')],
    },
  };
}
