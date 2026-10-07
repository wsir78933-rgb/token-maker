// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getSolarSystemCopy } from '@/lib/solar-system-creator/copy';
import { getSolarSystemCaseStudiesCopy } from '@/lib/solar-system-creator/case-studies';
import { getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import EnglishSolarSystemCreatorPage, {
  metadata as englishMetadata,
} from './(en)/solar-system-creator/page';
import ChineseSolarSystemCreatorPage, {
  metadata as chineseMetadata,
} from './(zh)/zh/solar-system-creator/page';

vi.mock('@/components/solar-system-creator/SolarSystemCreatorWorkbench', () => ({
  SolarSystemCreatorWorkbench: ({
    locale,
    copy,
  }: {
    locale: string;
    copy: { heading: string };
  }) => (
    <div
      role="region"
      aria-label={`${locale} solar system workbench`}
      data-testid="mock-solar-system-workbench"
      data-locale={locale}
      data-copy-heading={copy.heading}
    />
  ),
}));

const localizedRoutes = [
  {
    locale: 'en' as const,
    Page: EnglishSolarSystemCreatorPage,
    metadata: englishMetadata,
    path: '/solar-system-creator',
    switchedPath: '/zh/solar-system-creator',
    heroTitle: 'Free Solar System Creator Build Your Own Planetary System',
    menuLabel: 'Free tools',
    switchLabel: '中文',
    openGraphLocale: 'en_US',
  },
  {
    locale: 'zh' as const,
    Page: ChineseSolarSystemCreatorPage,
    metadata: chineseMetadata,
    path: '/zh/solar-system-creator',
    switchedPath: '/solar-system-creator',
    heroTitle: '免费太阳系创建器 打造你的行星系统',
    menuLabel: '免费工具',
    switchLabel: 'English',
    openGraphLocale: 'zh_CN',
  },
];

afterEach(cleanup);

describe('solar system creator routes', () => {
  it.each(localizedRoutes)('provides canonical, hreflang and social metadata for $locale', ({
    locale,
    metadata,
    path,
    openGraphLocale,
  }) => {
    const copy = getSolarSystemCopy(locale);
    const metadataBase = metadata.metadataBase;

    expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(
      `${getSiteUrl()}/`,
    );
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/solar-system-creator',
        'en-US': '/solar-system-creator',
        'zh-CN': '/zh/solar-system-creator',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
      url: path,
      type: 'website',
      locale: openGraphLocale,
      images: [
        {
          url: getSeoImageUrl(locale, 'home'),
          width: 1200,
          height: 630,
          alt: copy.pageTitle,
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: copy.pageTitle,
      description: copy.pageDescription,
      images: [getSeoImageUrl(locale, 'home')],
    });
  });

  it.each(localizedRoutes)('renders the $locale shell, one H1 and the localized workbench contract', ({
    locale,
    Page,
    path,
    switchedPath,
    heroTitle,
    menuLabel,
    switchLabel,
  }) => {
    const copy = getSolarSystemCopy(locale);
    const { container } = render(<Page />);
    const pageHeading = screen.getByRole('heading', { level: 1, name: heroTitle });
    const workspace = screen.getByTestId('solar-system-creator-workspace');
    const mockedWorkbench = screen.getByTestId('mock-solar-system-workbench');
    const topbar = container.querySelector('.site-topbar');
    const footer = container.querySelector('footer');
    const solarHero = pageHeading.closest('section');
    const pageContent = container.querySelector('[data-solar-page-content="true"]');

    if (
      !(topbar instanceof HTMLElement) ||
      !(footer instanceof HTMLElement) ||
      !(solarHero instanceof HTMLElement) ||
      !(pageContent instanceof HTMLElement)
    ) {
      throw new Error(`Missing solar system creator shell for locale ${JSON.stringify(locale)}.`);
    }

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(solarHero.contains(pageHeading)).toBe(true);
    expect(topbar.compareDocumentPosition(pageHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pageHeading.compareDocumentPosition(workspace) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(workspace.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(workspace.compareDocumentPosition(pageContent) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(solarHero.getAttribute('data-solar-print-hidden')).toBe('true');
    expect(pageContent.getAttribute('data-solar-print-hidden')).toBe('true');
    expect(workspace.classList.contains('scroll-mt-20')).toBe(true);
    expect(mockedWorkbench.getAttribute('data-locale')).toBe(locale);
    expect(mockedWorkbench.getAttribute('data-copy-heading')).toBe(copy.heading);

    const pageContentCopy = copy.pageContent;
    const caseStudiesCopy = getSolarSystemCaseStudiesCopy(locale);
    const pageSections = Array.from(pageContent.querySelectorAll(':scope > section'));
    expect(pageSections).toHaveLength(7);
    expect(pageSections.map((section) => section.getAttribute('aria-labelledby'))).toEqual([
      'solar-system-creator-what-is-heading',
      'solar-system-creator-case-studies-title',
      'solar-system-creator-feature-grid-heading',
      'solar-system-creator-tool-comparison-title',
      'solar-system-creator-how-it-works-heading',
      'solar-system-creator-call-to-action-title',
      'solar-system-creator-faq-heading',
    ]);
    expect(within(pageContent).getByRole('heading', { level: 2, name: pageContentCopy.whatIsTitle })).toBeTruthy();
    expect(within(pageContent).getByRole('heading', { level: 2, name: caseStudiesCopy.title })).toBeTruthy();
    expect(within(pageContent).getByRole('heading', { level: 2, name: pageContentCopy.featureOverviewTitle })).toBeTruthy();
    expect(within(pageContent).getByRole('heading', { level: 2, name: pageContentCopy.toolComparison.title })).toBeTruthy();
    expect(within(pageContent).getByRole('heading', { level: 2, name: pageContentCopy.howItWorksTitle })).toBeTruthy();
    expect(within(pageContent).getByRole('heading', { level: 2, name: pageContentCopy.ctaTitle })).toBeTruthy();
    expect(within(pageContent).getByRole('heading', { level: 2, name: pageContentCopy.faqTitle })).toBeTruthy();
    const caseGroups = Array.from((pageSections[1] as HTMLElement).querySelectorAll('[data-solar-case-group]'));
    expect(caseGroups).toHaveLength(3);
    expect(caseGroups.map((group) => group.getAttribute('data-image-position'))).toEqual(['left', 'right', 'left']);
    expect(caseGroups.map((group) => group.getAttribute('data-solar-case-group'))).toEqual(['fiction', 'trpg', 'concept']);
    caseGroups.forEach((group, index) => {
      expect(Array.from(group.querySelectorAll('img'), (image) => image.getAttribute('src'))).toEqual(
        caseStudiesCopy.groups[index].examples.map((example) => example.src),
      );
      expect(within(group as HTMLElement).getByRole('button', { name: caseStudiesCopy.groups[index].previousLabel })).toBeTruthy();
      expect(within(group as HTMLElement).getByRole('button', { name: caseStudiesCopy.groups[index].nextLabel })).toBeTruthy();
    });
    expect(pageSections[2]?.querySelectorAll('article')).toHaveLength(6);
    const comparisonSection = pageSections[3] as HTMLElement;
    expect(within(comparisonSection).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(comparisonSection).getAllByRole('rowheader')).toHaveLength(5);
    expect(comparisonSection.querySelectorAll('tbody tr')).toHaveLength(5);
    expect(within(pageSections[4] as HTMLElement).getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(within(pageSections[6] as HTMLElement).getAllByRole('button')).toHaveLength(5);
    expect(
      pageSections[5]?.querySelector<HTMLAnchorElement>('a[href="#solar-system-creator-workspace"]'),
    ).not.toBeNull();

    const scrollIntoView = vi.fn();
    Object.defineProperty(workspace, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
    fireEvent.click(screen.getByRole('button', { name: copy.heroAction }));
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });

    const freeToolsLink = within(topbar).getByRole('link', { name: menuLabel });
    expect(freeToolsLink.closest('[data-active]')?.getAttribute('data-active')).toBe('true');
    const menuItem = freeToolsLink.closest('.site-nav-item');
    if (!(menuItem instanceof HTMLElement)) {
      throw new Error(`Missing Free tools menu for locale ${JSON.stringify(locale)}.`);
    }

    fireEvent.mouseEnter(menuItem);
    const menu = within(menuItem).getByRole('menu', { name: menuLabel });
    expect(within(menu).getByRole('menuitem', { name: copy.navigationTitle }).getAttribute('href')).toBe(path);
    expect(within(topbar).getByRole('link', { name: switchLabel }).getAttribute('href')).toBe(switchedPath);

    const webApplicationScript = document.getElementById(`solar-system-creator-${locale}-jsonld`);
    const breadcrumbScript = document.getElementById(
      `solar-system-creator-${locale}-breadcrumb-jsonld`,
    );
    if (!(webApplicationScript instanceof HTMLScriptElement) || !(breadcrumbScript instanceof HTMLScriptElement)) {
      throw new Error(`Missing solar system creator structured data for locale ${JSON.stringify(locale)}.`);
    }

    expect(JSON.parse(webApplicationScript.textContent ?? '{}')).toMatchObject({
      '@type': 'WebApplication',
      name: copy.pageTitle,
      url: `${getSiteUrl()}${path === '/solar-system-creator' ? path : path}`,
    });
    expect(JSON.parse(breadcrumbScript.textContent ?? '{}')).toMatchObject({
      '@type': 'BreadcrumbList',
    });
  });
});
