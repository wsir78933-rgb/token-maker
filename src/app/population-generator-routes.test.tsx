// @vitest-environment jsdom

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPopulationGeneratorCopy } from '@/components/population-generator/population-generator-copy';
import {
  formatPopulationRange,
  orderPopulationPresets,
} from '@/components/population-generator/population-preset-list';
import { getPopulationPresets, type PopulationEra } from '@/lib/population-generator';
import {
  getPopulationPageCopy,
  POPULATION_GENERATOR_PATH,
  POPULATION_GENERATOR_WORKSPACE_ID,
} from '@/lib/population-generator/page-copy';
import sitemap from '@/app/sitemap';
import { getContentSiteTopbarModel } from '@/lib/content-site-navigation';
import { getSiteUrl } from '@/lib/site-content';
import type { SiteLocale } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const workbenchPath = resolve(
  process.cwd(),
  'src/components/population-generator/PopulationGeneratorWorkbench.tsx',
);
const workbenchStylesPath = resolve(
  process.cwd(),
  'src/components/population-generator/PopulationGeneratorWorkbench.module.css',
);
const canRenderPopulationWorkbench = existsSync(workbenchPath) && existsSync(workbenchStylesPath);
const pageViewPath = resolve(
  process.cwd(),
  'src/components/population-generator/PopulationGeneratorPageView.tsx',
);
const englishPagePath = resolve(process.cwd(), 'src/app/(en)/population-generator/page.tsx');
const chinesePagePath = resolve(process.cwd(), 'src/app/(zh)/zh/population-generator/page.tsx');

const localizedPopulationGeneratorRoutes = [
  {
    locale: 'en' as const,
    path: '/population-generator',
    openGraphLocale: 'en_US',
  },
  {
    locale: 'zh' as const,
    path: '/zh/population-generator',
    openGraphLocale: 'zh_CN',
  },
];

function requireSection(headingId: string, locale: SiteLocale): HTMLElement {
  const heading = document.getElementById(headingId);
  if (!(heading instanceof HTMLElement)) {
    throw new Error(
      `Population generator heading ${JSON.stringify(headingId)} is missing for locale ${JSON.stringify(locale)}.`,
    );
  }

  const section = heading.closest('section');
  if (!(section instanceof HTMLElement)) {
    throw new Error(
      `Population generator section for heading ${JSON.stringify(headingId)} is missing for locale ${JSON.stringify(locale)}.`,
    );
  }

  return section;
}

function requireFollowing(previous: Node, next: Node, label: string, locale: SiteLocale): void {
  if ((previous.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING) === 0) {
    throw new Error(
      `Population generator ${label} is out of order for locale ${JSON.stringify(locale)}.`,
    );
  }
}

function requirePopulationGeneratorCallToAction(
  section: HTMLElement,
  buttonText: string,
  locale: SiteLocale,
): HTMLElement {
  const link = within(section).queryByRole('link', { name: buttonText });
  if (link instanceof HTMLElement) {
    return link;
  }

  const button = within(section).queryByRole('button', { name: buttonText });
  if (button instanceof HTMLElement) {
    return button;
  }

  throw new Error(
    `Population generator CTA ${JSON.stringify(buttonText)} is missing for locale ${JSON.stringify(locale)}.`,
  );
}

function requireFaqAnswer(faqSection: HTMLElement, questionButton: HTMLElement, locale: SiteLocale): HTMLElement {
  const answerId = questionButton.getAttribute('aria-controls');
  if (answerId === null || answerId.trim() === '') {
    throw new Error(
      `Population generator FAQ question ${JSON.stringify(questionButton.textContent)} has no aria-controls for locale ${JSON.stringify(locale)}.`,
    );
  }

  const answer = document.getElementById(answerId);
  if (!(answer instanceof HTMLElement) || !faqSection.contains(answer)) {
    throw new Error(
      `Population generator FAQ answer ${JSON.stringify(answerId)} is missing from its section for locale ${JSON.stringify(locale)}.`,
    );
  }

  return answer;
}

const POPULATION_HELP_ERAS = ['medieval', 'modern', 'future'] as const satisfies readonly PopulationEra[];
const POPULATION_HELP_SIZES = ['village', 'town', 'city', 'large-city', 'metropolis'] as const;

function readPopulationHelpRangeText(locale: SiteLocale, era: PopulationEra, size: (typeof POPULATION_HELP_SIZES)[number]): string {
  const toolCopy = getPopulationGeneratorCopy(locale);
  const preset = orderPopulationPresets(era, getPopulationPresets(era)).find((entry) => entry.size === size);
  if (preset !== undefined) {
    return formatPopulationRange(preset.min, preset.max, locale);
  }

  if (era === 'medieval' && size === 'metropolis') {
    return toolCopy.helpUnavailable;
  }

  throw new Error(
    `Population generator help range is missing for ${era}/${size} in locale ${JSON.stringify(locale)}.`,
  );
}

function requireHelpTable(tableId: string, locale: SiteLocale): HTMLTableElement {
  const table = document.getElementById(tableId);
  if (!(table instanceof HTMLTableElement)) {
    throw new Error(
      `Population generator help table ${JSON.stringify(tableId)} is missing for locale ${JSON.stringify(locale)}.`,
    );
  }

  return table;
}

function readHelpRowTexts(table: HTMLTableElement, sizeLabel: string, locale: SiteLocale): string[] {
  const rowHeader = within(table).getByRole('rowheader', { name: sizeLabel });
  const row = rowHeader.closest('tr');
  if (!(row instanceof HTMLTableRowElement)) {
    throw new Error(
      `Population generator help row ${JSON.stringify(sizeLabel)} is missing for locale ${JSON.stringify(locale)}.`,
    );
  }

  return [...row.cells].map((cell) => cell.textContent?.trim() ?? '');
}

describe('population generator page copy', () => {
  it('keeps English and Chinese guide structure and population figures aligned', () => {
    const englishCopy = getPopulationPageCopy('en');
    const chineseCopy = getPopulationPageCopy('zh');

    expect(englishCopy.navigationTitle).toBe('Population Generator');
    expect(chineseCopy.navigationTitle).toBe('人口生成器');
    expect(englishCopy.title).toBe('Free Population Generator for RPGs, Novels & Worldbuilding');
    expect(englishCopy.description).toBe(
      'Generate village and city populations with counts for 170 professions. Choose medieval, modern or future settings, then edit and save your results.',
    );
    expect(chineseCopy.title).toBe('免费人口生成器｜跑团、小说与架空世界设定');
    expect(chineseCopy.description).toBe(
      '快速生成虚构村庄或城市的人口总量与 170 种职业人数，支持中世纪、现代和未来背景。为跑团主持人、小说作者与游戏策划提供可编辑、可保存的人口设定。',
    );
    expect(englishCopy.pageTitle).toBe('Population Generator | Settlement Size, Occupations, and Farms');
    expect(chineseCopy.pageTitle).toBe('人口生成器｜聚落规模、职业与农业');
    expect(englishCopy.pageDescription).toBe(
      'Generate a medieval, modern, or future settlement for a tabletop game or story. Edit the name, population, households, area, occupations, and farm figures, then save five copies in this browser or download population.txt. The file stores the population, agriculture, and occupation details as HTML.',
    );
    expect(chineseCopy.pageDescription).toBe(
      '为跑团或故事生成一座中世纪、现代或未来聚落。可以修改名称、人口、住户、面积、职业和农业数字，在这个浏览器里保存五个槽位，或下载 population.txt。文件保存人口统计、农业与职业明细的 HTML。',
    );
    expect(englishCopy.rules.paragraphs).toHaveLength(chineseCopy.rules.paragraphs.length);
    expect(englishCopy.result.paragraphs).toHaveLength(chineseCopy.result.paragraphs.length);
    expect(englishCopy.files.paragraphs).toHaveLength(chineseCopy.files.paragraphs.length);
    expect(englishCopy.faq.items).toHaveLength(chineseCopy.faq.items.length);
    expect(englishCopy.result.agricultureNames).toHaveLength(6);
    expect(chineseCopy.result.agricultureNames).toEqual([
      '农民人数',
      '种植农田',
      '牲畜总数',
      '禽类',
      '牛与猪',
      '其他',
    ]);
    expect(englishCopy.ranges.rows.map((row) => row.modernFuture)).toEqual(
      chineseCopy.ranges.rows.map((row) => row.modernFuture),
    );
    expect(englishCopy.ranges.rows.map((row) => row.medieval)).toEqual(
      chineseCopy.ranges.rows.map((row) => row.medieval),
    );
    expect(englishCopy.ranges.rows.map((row) => row.size)).toEqual([
      'Village',
      'Town',
      'City',
      'Large city',
      'Metropolis',
    ]);
    expect(chineseCopy.ranges.rows.map((row) => row.size)).toEqual(['村庄', '城镇', '城市', '大城市', '大都市']);
    expect(englishCopy.ranges.rows[1]?.modernFuture).toBe('5,000–20,000');
    expect(englishCopy.ranges.rows[4]?.medieval).toBe('');
    expect(englishCopy.rules.title).toBe('How a settlement is generated');
    expect(chineseCopy.rules.title).toBe('聚落怎样生成');
    expect(englishCopy.ranges.title).toBe('Population each size can roll');
    expect(chineseCopy.ranges.title).toBe('每个规模会抽到的人口');
    expect(englishCopy.result.title).toBe('What you can edit');
    expect(chineseCopy.result.title).toBe('哪些内容可以改');
    expect(englishCopy.audience.title).toBe('Who it is for');
    expect(chineseCopy.audience.title).toBe('给谁用');
    expect(englishCopy.files.title).toBe('Saves, text files, and printing');
    expect(chineseCopy.files.title).toBe('保存、文本文件和打印');
    expect(englishCopy.faq.title).toBe('Common questions');
    expect(chineseCopy.faq.title).toBe('常见问题');
    expect(englishCopy.whatIs.title).toBe('What is a Population Generator');
    expect(chineseCopy.whatIs.title).toBe('什么是人口生成器');
    expect(englishCopy.whatIs.body).toContain('170');
    expect(chineseCopy.whatIs.body).toContain('170');
    expect(englishCopy.whatIs.body).not.toMatch(/does not generate an image|text\/html/i);
    expect(chineseCopy.whatIs.body).not.toMatch(/不生成图片|text\/html/);
    expect(englishCopy.features.title).toBe('Features');
    expect(chineseCopy.features.title).toBe('核心功能');
    expect(englishCopy.features.items).toHaveLength(chineseCopy.features.items.length);
    expect(englishCopy.features.items).toHaveLength(6);
    expect(englishCopy.howToUse.title).toBe('How to Use');
    expect(chineseCopy.howToUse.title).toBe('如何使用');
    expect(englishCopy.howToUse.steps).toHaveLength(chineseCopy.howToUse.steps.length);
    expect(englishCopy.howToUse.steps).toHaveLength(4);
    expect(englishCopy.howToUse.steps[1]?.description).toMatch(/Selecting a size generates/i);
    expect(englishCopy.howToUse.steps[1]?.description).toMatch(/optional/i);
    expect(chineseCopy.howToUse.steps[1]?.description).toContain('点选规模就会生成');
    expect(chineseCopy.howToUse.steps[1]?.description).toContain('可选');
    expect('comparison' in englishCopy).toBe(false);
    expect('comparison' in chineseCopy).toBe(false);
    expect(englishCopy.cta.buttonText).toBe('Generate a Population for Free');
    expect(chineseCopy.cta.buttonText).toBe('免费生成人口设定');
    expect(englishCopy.pageDescription).not.toMatch(/NPC|cloud sync|地图生成/i);
    expect(chineseCopy.pageDescription).not.toMatch(/NPC|云同步|地图/);
  });

  it('rejects an unknown locale with the received value', () => {
    expect(() => getPopulationPageCopy('fr' as SiteLocale)).toThrow(/"fr"/);
  });
});

describe('population generator sitemap entries', () => {
  it('includes exactly one entry per language with reciprocal alternates', () => {
    const siteUrl = getSiteUrl().replace(/\/$/, '');
    const englishUrl = `${siteUrl}${POPULATION_GENERATOR_PATH}`;
    const chineseUrl = `${siteUrl}/zh${POPULATION_GENERATOR_PATH}`;
    const expectedAlternates = {
      'x-default': englishUrl,
      'en-US': englishUrl,
      'zh-CN': chineseUrl,
    };

    for (const url of [englishUrl, chineseUrl]) {
      expect(sitemap().filter((entry) => entry.url === url)).toHaveLength(1);
      const entry = sitemap().find((candidate) => candidate.url === url);
      if (entry === undefined) {
        throw new Error(`Population generator sitemap entry is missing for ${url}.`);
      }
      expect(entry.lastModified).toEqual(new Date('2026-10-07'));
      expect(entry.changeFrequency).toBe('weekly');
      expect(entry.priority).toBe(0.8);
      expect(entry.alternates?.languages).toEqual(expectedAlternates);
    }
  });
});

describe('population generator navigation', () => {
  it('lists the tool in both free-tool menus and marks its section active', () => {
    const englishCopy = getPopulationPageCopy('en');
    const chineseCopy = getPopulationPageCopy('zh');
    const englishModel = getContentSiteTopbarModel({
      locale: 'en',
      currentPath: POPULATION_GENERATOR_PATH,
      localeSwitchHref: `/zh${POPULATION_GENERATOR_PATH}`,
    });
    const chineseModel = getContentSiteTopbarModel({
      locale: 'zh',
      currentPath: `/zh${POPULATION_GENERATOR_PATH}`,
      localeSwitchHref: POPULATION_GENERATOR_PATH,
    });
    const siblingModel = getContentSiteTopbarModel({
      locale: 'en',
      currentPath: `${POPULATION_GENERATOR_PATH}-extra`,
      localeSwitchHref: '/zh',
    });

    expect(englishModel.freeTools).toContainEqual({
      href: POPULATION_GENERATOR_PATH,
      title: englishCopy.navigationTitle,
    });
    expect(chineseModel.freeTools).toContainEqual({
      href: `/zh${POPULATION_GENERATOR_PATH}`,
      title: chineseCopy.navigationTitle,
    });
    expect(englishModel.freeToolsMenuIsActive).toBe(true);
    expect(chineseModel.freeToolsMenuIsActive).toBe(true);
    expect(siblingModel.freeToolsMenuIsActive).toBe(false);
  });
});

describe('population generator route source', () => {
  it('wires both locales through the shared page view and the public workbench import', () => {
    const pageViewSource = readFileSync(pageViewPath, 'utf8');
    const englishPageSource = readFileSync(englishPagePath, 'utf8');
    const chinesePageSource = readFileSync(chinesePagePath, 'utf8');

    expect(pageViewSource).toContain(
      "import { PopulationGeneratorWorkbench } from '@/components/population-generator/PopulationGeneratorWorkbench';",
    );
    expect(pageViewSource).toContain("from '@/lib/population-generator/page-copy'");
    expect(pageViewSource).toContain('getPopulationPageCopy');
    expect(pageViewSource).not.toMatch(/@\/lib\/population-generator\/(?!page-copy['"])/);
    expect(pageViewSource).toContain(`id={${'POPULATION_GENERATOR_WORKSPACE_ID'}}`);
    expect(englishPageSource).toContain('export default function PopulationGeneratorPage');
    expect(englishPageSource).toContain("locale: 'en_US'");
    expect(englishPageSource).toContain('canonical: POPULATION_GENERATOR_PATH');
    expect(chinesePageSource).toContain('export default function ChinesePopulationGeneratorPage');
    expect(chinesePageSource).toContain("locale: 'zh_CN'");
    expect(chinesePageSource).toContain('canonical: localizedPath');
    expect(englishPageSource).toContain('getLanguageAlternates(POPULATION_GENERATOR_PATH)');
    expect(chinesePageSource).toContain('getLanguageAlternates(POPULATION_GENERATOR_PATH)');
    expect(POPULATION_GENERATOR_WORKSPACE_ID).toBe('population-generator-workspace');
  });
});

describe('population generator rendered routes', () => {
  afterEach(() => {
    cleanup();
  });

  it.skipIf(!canRenderPopulationWorkbench)(
    'renders localized metadata, site chrome, guide, and FAQ when the workbench module exists',
    async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((media: string) => ({
        matches: media === '(prefers-reduced-motion: reduce)',
        media,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );

    const englishPage = await import('./(en)/population-generator/page');
    const chinesePage = await import('./(zh)/zh/population-generator/page');
    const pages = [
      { locale: 'en' as const, PageComponent: englishPage.default, metadata: englishPage.metadata },
      { locale: 'zh' as const, PageComponent: chinesePage.default, metadata: chinesePage.metadata },
    ];

    for (const route of localizedPopulationGeneratorRoutes) {
      const page = pages.find((candidate) => candidate.locale === route.locale);
      if (page === undefined) {
        throw new Error(`Population generator page fixture is missing for locale ${JSON.stringify(route.locale)}.`);
      }

      const copy = getPopulationPageCopy(route.locale);
      const metadataBase = page.metadata.metadataBase;
      expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(`${getSiteUrl()}/`);
      expect(page.metadata.title).toEqual({ absolute: copy.pageTitle });
      expect(page.metadata.description).toBe(copy.pageDescription);
      expect(page.metadata.alternates).toEqual({
        canonical: route.path,
        languages: {
          'x-default': POPULATION_GENERATOR_PATH,
          'en-US': POPULATION_GENERATOR_PATH,
          'zh-CN': `/zh${POPULATION_GENERATOR_PATH}`,
        },
      });
      expect(page.metadata.openGraph).toMatchObject({
        title: copy.pageTitle,
        description: copy.pageDescription,
        url: route.path,
        type: 'website',
        locale: route.openGraphLocale,
        images: [
          {
            url: getSeoImageUrl(route.locale, 'home'),
            width: 1200,
            height: 630,
            alt: copy.pageTitle,
          },
        ],
      });
      expect(page.metadata.twitter).toMatchObject({
        card: 'summary_large_image',
        title: copy.pageTitle,
        description: copy.pageDescription,
        images: [getSeoImageUrl(route.locale, 'home')],
      });

      const view = render(<page.PageComponent />);
      expect(screen.getByRole('heading', { level: 1, name: copy.title })).toBeTruthy();
      expect(screen.getByText(copy.description)).toBeTruthy();
      const workspace = document.getElementById(POPULATION_GENERATOR_WORKSPACE_ID);
      if (!(workspace instanceof HTMLElement)) {
        throw new Error(`Population generator workspace is missing for locale ${JSON.stringify(route.locale)}.`);
      }
      expect(workspace.querySelector('h2')?.textContent).toBe(copy.workspaceLabel);
      expect(document.querySelector('.site-topbar')).toBeTruthy();
      expect(document.querySelector('main.site-shell > div > footer')).toBeTruthy();

      for (const removedHeadingId of [
        'population-generator-audience-heading',
        'population-generator-files-heading',
        'population-generator-rules-heading',
        'population-generator-ranges-heading',
        'population-generator-result-heading',
      ]) {
        expect(document.getElementById(removedHeadingId)).toBeNull();
      }
      for (const removedTitle of [
        copy.audience.title,
        copy.files.title,
        copy.rules.title,
        copy.ranges.title,
        copy.result.title,
      ]) {
        expect(screen.queryByRole('heading', { name: removedTitle })).toBeNull();
      }

      const whatIsSection = requireSection('population-generator-what-is-heading', route.locale);
      const featuresSection = requireSection('population-generator-features-heading', route.locale);
      const howToSection = requireSection('population-generator-how-to-use-heading', route.locale);
      const ctaSection = requireSection('population-generator-call-to-action-title', route.locale);
      const faqHeading = screen.getByRole('heading', { level: 2, name: copy.faq.title });
      const faqSection = faqHeading.closest('section');
      if (!(faqSection instanceof HTMLElement)) {
        throw new Error(`Population generator FAQ section is missing for locale ${JSON.stringify(route.locale)}.`);
      }

      expect(within(whatIsSection).getByRole('heading', { level: 2, name: copy.whatIs.title })).toBeTruthy();
      expect(within(whatIsSection).getByText(copy.whatIs.body)).toBeTruthy();
      expect(within(featuresSection).getByRole('heading', { level: 2, name: copy.features.title })).toBeTruthy();
      expect(within(featuresSection).getByText(copy.features.intro)).toBeTruthy();
      for (const feature of copy.features.items) {
        expect(within(featuresSection).getByText(feature.title)).toBeTruthy();
        expect(within(featuresSection).getByText(feature.description)).toBeTruthy();
      }
      expect(within(howToSection).getByRole('heading', { level: 2, name: copy.howToUse.title })).toBeTruthy();
      expect(
        within(howToSection)
          .getAllByRole('heading', { level: 3 })
          .map((heading) => heading.textContent?.trim()),
      ).toEqual(copy.howToUse.steps.map((step) => step.title));
      expect(document.getElementById('population-generator-comparison-heading')).toBeNull();
      const toolCopy = getPopulationGeneratorCopy(route.locale);
      const helpHeadings = screen.getAllByRole('heading', { level: 2, name: toolCopy.helpTitle });
      expect(helpHeadings).toHaveLength(1);
      const helpHeading = helpHeadings[0];
      if (!(helpHeading instanceof HTMLElement)) {
        throw new Error(
          `Population generator help heading is missing for locale ${JSON.stringify(route.locale)}.`,
        );
      }
      const helpSection = helpHeading.closest('section');
      if (!(helpSection instanceof HTMLElement)) {
        throw new Error(
          `Population generator help section is missing for locale ${JSON.stringify(route.locale)}.`,
        );
      }
      expect(helpSection.classList.contains('max-w-5xl')).toBe(true);
      expect(workspace.contains(helpSection)).toBe(false);
      expect(within(workspace).queryByRole('heading', { level: 2, name: toolCopy.helpTitle })).toBeNull();
      expect(within(helpSection).queryByRole('button')).toBeNull();
      expect(helpSection.querySelector('[aria-expanded]')).toBeNull();
      expect(helpSection.textContent).not.toContain('▾');
      expect(helpSection.textContent).not.toContain('▴');
      expect(within(helpSection).getByText(toolCopy.helpSummary)).toBeTruthy();
      for (const paragraph of [
        toolCopy.helpIntro,
        toolCopy.helpRegenerate,
        toolCopy.helpAreas,
        toolCopy.helpEdits,
        toolCopy.helpProfessions,
        toolCopy.helpAgriculture,
        toolCopy.helpSlots,
      ]) {
        expect(within(helpSection).getByText(paragraph)).toBeTruthy();
      }
      expect(
        within(helpSection)
          .getAllByRole('heading', { level: 3 })
          .map((heading) => heading.textContent?.trim()),
      ).toEqual([
        toolCopy.helpRulesTitle,
        toolCopy.helpRangesTitle,
        toolCopy.helpNumbersTitle,
        toolCopy.helpSavingTitle,
      ]);
      const desktopTable = requireHelpTable('population-generator-help-ranges-desktop', route.locale);
      const desktopFrame = desktopTable.parentElement;
      if (!(desktopFrame instanceof HTMLElement) || !helpSection.contains(desktopTable)) {
        throw new Error(
          `Population generator desktop help table is outside its section for locale ${JSON.stringify(route.locale)}.`,
        );
      }
      expect(desktopFrame.classList.contains('hidden')).toBe(true);
      expect(desktopFrame.classList.contains('lg:block')).toBe(true);
      expect(
        within(desktopTable)
          .getAllByRole('columnheader')
          .map((header) => header.textContent?.trim()),
      ).toEqual([
        toolCopy.helpSizeColumn,
        toolCopy.eras.medieval,
        toolCopy.eras.modern,
        toolCopy.eras.future,
      ]);
      const compactRanges = document.getElementById('population-generator-help-ranges-compact');
      if (!(compactRanges instanceof HTMLElement) || !helpSection.contains(compactRanges)) {
        throw new Error(
          `Population generator compact help ranges are missing for locale ${JSON.stringify(route.locale)}.`,
        );
      }
      expect(compactRanges.classList.contains('lg:hidden')).toBe(true);
      let offeredRangeCount = 0;
      for (const size of POPULATION_HELP_SIZES) {
        expect(readHelpRowTexts(desktopTable, toolCopy.sizes[size], route.locale)).toEqual([
          toolCopy.sizes[size],
          ...POPULATION_HELP_ERAS.map((era) => readPopulationHelpRangeText(route.locale, era, size)),
        ]);
      }
      for (const era of POPULATION_HELP_ERAS) {
        const eraTable = requireHelpTable(`population-generator-help-ranges-${era}`, route.locale);
        expect(compactRanges.contains(eraTable)).toBe(true);
        expect(eraTable.querySelector('caption')?.textContent?.trim()).toBe(toolCopy.eras[era]);
        expect(
          within(eraTable)
            .getAllByRole('columnheader')
            .map((header) => header.textContent?.trim()),
        ).toEqual([toolCopy.helpSizeColumn, toolCopy.helpRangeColumn]);
        for (const size of POPULATION_HELP_SIZES) {
          const rangeText = readPopulationHelpRangeText(route.locale, era, size);
          expect(readHelpRowTexts(eraTable, toolCopy.sizes[size], route.locale)).toEqual([
            toolCopy.sizes[size],
            rangeText,
          ]);
          if (rangeText !== toolCopy.helpUnavailable) {
            offeredRangeCount += 1;
          }
        }
      }
      if (offeredRangeCount !== 14) {
        throw new Error(
          `Population generator help ranges for locale ${JSON.stringify(route.locale)} must contain 14 offered ranges. Received ${offeredRangeCount}.`,
        );
      }
      expect(within(desktopTable).getByRole('cell', { name: toolCopy.helpUnavailable })).toBeTruthy();
      expect(
        within(requireHelpTable('population-generator-help-ranges-medieval', route.locale)).getByRole(
          'cell',
          { name: toolCopy.helpUnavailable },
        ),
      ).toBeTruthy();
      expect(within(ctaSection).getByRole('heading', { level: 2, name: copy.cta.title })).toBeTruthy();
      expect(within(ctaSection).getByText(copy.cta.description)).toBeTruthy();

      const ctaControl = requirePopulationGeneratorCallToAction(ctaSection, copy.cta.buttonText, route.locale);
      const scrollIntoView = vi.fn();
      Object.defineProperty(workspace, 'scrollIntoView', { configurable: true, value: scrollIntoView });
      fireEvent.click(ctaControl);
      const workspaceHash = `#${POPULATION_GENERATOR_WORKSPACE_ID}`;
      const href = ctaControl.getAttribute('href');
      const scrolledInstantly = scrollIntoView.mock.calls.some((call) => {
        const options: unknown = call[0];
        return (
          typeof options === 'object' &&
          options !== null &&
          'behavior' in options &&
          options.behavior === 'instant'
        );
      });
      const scrolledSmoothly = scrollIntoView.mock.calls.some((call) => {
        const options: unknown = call[0];
        return (
          typeof options === 'object' &&
          options !== null &&
          'behavior' in options &&
          options.behavior === 'smooth'
        );
      });
      if (href !== workspaceHash && !scrolledInstantly) {
        throw new Error(
          `Population generator CTA for locale ${JSON.stringify(route.locale)} did not target ${workspaceHash} under reduced motion. href=${JSON.stringify(href)} scrollCalls=${JSON.stringify(scrollIntoView.mock.calls)}.`,
        );
      }
      if (scrolledSmoothly) {
        throw new Error(
          `Population generator CTA used smooth scrolling while reduced motion was set for locale ${JSON.stringify(route.locale)}. Received ${JSON.stringify(scrollIntoView.mock.calls)}.`,
        );
      }
      expect(ctaControl.classList.contains('is-bouncing')).toBe(false);

      requireFollowing(workspace, whatIsSection, 'what-is after workspace', route.locale);
      requireFollowing(whatIsSection, featuresSection, 'features after what-is', route.locale);
      requireFollowing(featuresSection, howToSection, 'how-to after features', route.locale);
      requireFollowing(howToSection, helpSection, 'help after how-to', route.locale);
      requireFollowing(helpSection, faqSection, 'FAQ after help', route.locale);
      requireFollowing(faqSection, ctaSection, 'CTA after FAQ', route.locale);

      const faqButtons = within(faqSection).getAllByRole('button');
      expect(faqButtons.map((button) => button.textContent?.trim())).toEqual(
        copy.faq.items.map((item) => item.question),
      );
      const firstFaqButton = faqButtons[0];
      const secondFaqButton = faqButtons[1];
      if (firstFaqButton === undefined || secondFaqButton === undefined) {
        throw new Error(`Population generator FAQ buttons are missing for locale ${JSON.stringify(route.locale)}.`);
      }
      const firstFaqAnswer = requireFaqAnswer(faqSection, firstFaqButton, route.locale);
      expect(firstFaqButton.getAttribute('aria-expanded')).toBe('false');
      expect(firstFaqAnswer.hidden).toBe(true);
      fireEvent.click(firstFaqButton);
      expect(firstFaqButton.getAttribute('aria-expanded')).toBe('true');
      expect(firstFaqAnswer.hidden).toBe(false);
      expect(secondFaqButton.getAttribute('aria-expanded')).toBe('false');
      view.unmount();
    }

    vi.unstubAllGlobals();
  });
});
