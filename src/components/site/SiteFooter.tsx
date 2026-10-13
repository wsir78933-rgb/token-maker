import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { BookOpenText, Dices, Info, Mail, PencilRuler, ShieldCheck, Sparkles } from 'lucide-react';

import { SiteMark } from '@/components/site/SiteMark';
import { getSiteConfig } from '@/lib/site-content';
import { getLocalizedPath, stripLocalePrefix, type SiteLocale } from '@/lib/site-locale';
import { getToolDirectoryLinks } from '@/lib/tool-directory';
import { cn } from '@/lib/utils';

interface FooterLink {
  label: string;
  path: string;
  href?: string;
}

interface FooterSectionHeading {
  title: string;
  icon: LucideIcon;
}

interface FooterSection extends FooterSectionHeading {
  links: FooterLink[];
}

interface FooterCopy {
  homeAriaLabel: string;
  description: string;
  navigationLabel: string;
  copyright: string;
  legalLinks: FooterLink[];
  toolSection: FooterSectionHeading;
  sections: readonly [FooterSection, FooterSection];
}

interface SiteFooterProps {
  locale: SiteLocale;
  currentPath?: string;
  contentWidth?: SiteFooterContentWidth;
  className?: string;
}

type SiteFooterContentWidth = 'contained' | 'nearFull';

const editorPath = '/';
const blogPath = '/blog';
const aboutPath = '/about';
const changelogPath = '/changelog';
const faqPath = '/faq';
const privacyPath = '/privacy';
const contactPath = '/contact';

const footerCopyByLocale: Record<SiteLocale, FooterCopy> = {
  en: {
    homeAriaLabel: 'Token Maker home',
    description:
      'Make browser-based DnD and VTT tokens for Roll20, Foundry VTT, Owlbear, and tabletop prep without opening a full image editor.',
    navigationLabel: 'Footer navigation',
    copyright: '© 2026 Token Maker. All rights reserved.',
    legalLinks: [
      { label: 'Privacy policy', path: privacyPath },
      { label: 'Contact support', path: contactPath },
    ],
    toolSection: {
      title: 'Tools',
      icon: Sparkles,
    },
    sections: [
      {
        title: 'Learn',
        icon: BookOpenText,
        links: [
          { label: 'Blog', path: blogPath },
          { label: 'About', path: aboutPath },
          { label: 'Changelog', path: changelogPath },
        ],
      },
      {
        title: 'Support',
        icon: ShieldCheck,
        links: [
          { label: 'FAQ', path: faqPath },
          { label: 'Privacy', path: privacyPath },
          { label: 'Contact', path: contactPath },
        ],
      },
    ],
  },
  zh: {
    homeAriaLabel: 'Token Maker 首页',
    description:
      '在浏览器里制作适合 DnD、Roll20、Foundry VTT 和 Owlbear 的 VTT Token，不需要打开完整修图软件。',
    navigationLabel: '页脚导航',
    copyright: '© 2026 Token Maker. 保留所有权利。',
    legalLinks: [
      { label: '隐私政策', path: privacyPath },
      { label: '联系支持', path: contactPath },
    ],
    toolSection: {
      title: '工具',
      icon: PencilRuler,
    },
    sections: [
      {
        title: '了解',
        icon: BookOpenText,
        links: [
          { label: '博客', path: blogPath },
          { label: '关于', path: aboutPath },
          { label: '更新记录', path: changelogPath },
        ],
      },
      {
        title: '支持',
        icon: ShieldCheck,
        links: [
          { label: '常见问题', path: faqPath },
          { label: '隐私', path: privacyPath },
          { label: '联系', path: contactPath },
        ],
      },
    ],
  },
};

const footerContentShellClassName = 'mx-auto w-full max-w-[92rem] px-6 py-10 lg:px-8 lg:py-12';

const footerContentShellClassByWidth: Record<SiteFooterContentWidth, string> = {
  contained: footerContentShellClassName,
  nearFull: footerContentShellClassName,
};

function getFooterLinkHref(locale: SiteLocale, path: string) {
  const localizedPath = getLocalizedPath(locale, path);

  if (path === editorPath) {
    return `${localizedPath}#editor-workspace`;
  }

  return localizedPath;
}

function isFooterLinkActive(currentPath: string | undefined, path: string) {
  if (!currentPath) {
    return false;
  }

  const normalizedCurrentPath = stripLocalePrefix(currentPath);

  if (path === editorPath) {
    return normalizedCurrentPath === editorPath;
  }

  return normalizedCurrentPath === path || normalizedCurrentPath.startsWith(`${path}/`);
}

function FooterSectionHeader({
  footerSection,
  align = 'responsive',
}: {
  footerSection: FooterSectionHeading;
  align?: 'responsive' | 'start';
}) {
  const SectionIcon = footerSection.icon;

  return (
    <div
      className={cn(
        'flex min-w-0 gap-2 sm:gap-3',
        align === 'start'
          ? 'flex-row items-center text-left'
          : 'flex-col items-center text-center sm:flex-row sm:text-left',
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-[#f1d492] sm:h-9 sm:w-9">
        <SectionIcon className="h-4 w-4" />
      </span>
      <h2 className="text-xs font-semibold text-stone-50 sm:text-sm">{footerSection.title}</h2>
    </div>
  );
}

function FooterSectionLinks({
  locale,
  currentPath,
  footerSection,
  align = 'responsive',
  listClassName,
}: {
  locale: SiteLocale;
  currentPath?: string;
  footerSection: FooterSection;
  align?: 'responsive' | 'start';
  listClassName?: string;
}) {
  return (
    <ul
      className={cn(
        'min-w-0 text-xs sm:text-sm',
        align === 'start' ? 'text-left' : 'text-center sm:text-left',
        listClassName ?? 'mt-3 space-y-2 sm:mt-4 sm:space-y-3',
      )}
    >
      {footerSection.links.map((footerLink) => {
        const localizedHref = footerLink.href ?? getFooterLinkHref(locale, footerLink.path);
        const isActive = isFooterLinkActive(currentPath, footerLink.path);

        return (
          <li key={footerLink.path} className="min-w-0">
            <Link
              href={localizedHref}
              prefetch={false}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex max-w-full break-words leading-5 text-stone-400 transition hover:text-[#f1d492]',
                align === 'start' ? 'justify-start' : 'justify-center sm:justify-start',
                isActive && 'text-[#f1d492]',
              )}
            >
              {footerLink.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function buildToolSection(locale: SiteLocale, toolSection: FooterSectionHeading): FooterSection {
  return {
    title: toolSection.title,
    icon: toolSection.icon,
    links: getToolDirectoryLinks(locale).map((toolLink) => {
      if (toolLink.href.trim() === '') {
        throw new Error(
          `Tool directory link "${toolLink.id}" has an empty href for locale ${JSON.stringify(locale)}.`,
        );
      }

      return {
        label: toolLink.name,
        path: toolLink.path,
        href: toolLink.href,
      };
    }),
  };
}

export function SiteFooter({ locale, currentPath, contentWidth = 'contained', className }: SiteFooterProps) {
  const footerCopy = footerCopyByLocale[locale];
  const siteConfig = getSiteConfig(locale);
  const homeHref = getLocalizedPath(locale, editorPath);
  const [learnSection, supportSection] = footerCopy.sections;
  const toolSection = buildToolSection(locale, footerCopy.toolSection);

  return (
    <footer className={cn('border-t border-white/10 bg-black/24 text-stone-100', className)}>
      <div className={footerContentShellClassByWidth[contentWidth]}>
        <nav
          aria-label={footerCopy.navigationLabel}
          className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,32rem)] lg:items-start"
        >
          <div className="max-w-xl">
            <Link
              href={homeHref}
              prefetch={false}
              aria-label={footerCopy.homeAriaLabel}
              className="site-brand-link inline-flex items-center gap-3"
            >
              <SiteMark className="h-10 w-10 rounded-2xl ring-1 ring-[#d7b46a]/15" />
              <span className="flex flex-col">
                <span className="site-brand-title text-base font-semibold">{siteConfig.name}</span>
                <span className="site-brand-subtitle text-xs">{siteConfig.shortName}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-stone-400">{footerCopy.description}</p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-stone-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2">
                <Dices className="h-3.5 w-3.5 text-[#f1d492]" />
                Roll20
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2">
                <Info className="h-3.5 w-3.5 text-[#8fb7ff]" />
                Foundry VTT
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2">
                <Mail className="h-3.5 w-3.5 text-[#f1d492]" />
                Owlbear
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-8">
            {[learnSection, supportSection].map((footerSection) => (
              <div key={footerSection.title} className="min-w-0">
                <FooterSectionHeader footerSection={footerSection} />
                <FooterSectionLinks locale={locale} currentPath={currentPath} footerSection={footerSection} />
              </div>
            ))}
          </div>

          <div className="min-w-0 lg:col-span-2">
            <FooterSectionHeader footerSection={toolSection} align="start" />
            <FooterSectionLinks
              locale={locale}
              currentPath={currentPath}
              footerSection={toolSection}
              align="start"
              listClassName="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-3 lg:grid-cols-4"
            />
          </div>
        </nav>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>{footerCopy.copyright}</p>
          <ul className="flex flex-wrap gap-4">
            {footerCopy.legalLinks.map((footerLink) => (
              <li key={footerLink.path}>
                <Link
                  href={getFooterLinkHref(locale, footerLink.path)}
                  prefetch={false}
                  className="transition hover:text-[#f1d492]"
                >
                  {footerLink.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
