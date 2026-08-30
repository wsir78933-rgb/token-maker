// @vitest-environment jsdom

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CoatMakerSeoContent } from './CoatMakerSeoContent';
import { getCoatMakerSeoCopy } from './coat-maker-seo-copy';

function countEnglishTokens(text: string) {
  return text.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g)?.length ?? 0;
}

function countChineseTokens(text: string) {
  const hanCharacterCount = text.match(/[\p{Script=Han}]/gu)?.length ?? 0;

  return hanCharacterCount + countEnglishTokens(text);
}

function collectVisibleSemanticText(contentRoot: HTMLElement) {
  const visibleSemanticTextSelector = 'h1, h2, h3, p, li, a, th, td';
  const semanticTextElements = Array.from(contentRoot.querySelectorAll<HTMLElement>(visibleSemanticTextSelector));

  return semanticTextElements
    .filter((semanticTextElement) => !semanticTextElement.querySelector(visibleSemanticTextSelector))
    .map((semanticTextElement) => semanticTextElement.textContent?.trim() ?? '')
    .filter((semanticText) => semanticText.length > 0)
    .join(' ');
}

function countEnglishKeyphraseOccurrences(text: string, keyphrase: string) {
  const escapedKeyphrase = keyphrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replaceAll(' ', '\\s+');
  const keyphrasePattern = new RegExp(`\\b${escapedKeyphrase}\\b`, 'gi');

  return text.match(keyphrasePattern)?.length ?? 0;
}

function countChineseKeyphraseOccurrences(text: string, keyphrase: string) {
  return text.split(keyphrase).length - 1;
}

function calculateKeyphraseDensity(semanticText: string, keyphrase: string, locale: 'en' | 'zh') {
  const countTokens = locale === 'en' ? countEnglishTokens : countChineseTokens;
  const totalTokenCount = countTokens(semanticText);
  const keyphraseTokenCount = countTokens(keyphrase);
  const keyphraseOccurrenceCount = locale === 'en'
    ? countEnglishKeyphraseOccurrences(semanticText, keyphrase)
    : countChineseKeyphraseOccurrences(semanticText, keyphrase);

  return (keyphraseOccurrenceCount * keyphraseTokenCount) / totalTokenCount;
}

function resolvePublicAssetFilePath(publicAssetSource: string) {
  if (!publicAssetSource.startsWith('/')) {
    throw new Error(`Expected a root-relative public asset source, received: ${publicAssetSource}`);
  }

  return resolve(process.cwd(), 'public', publicAssetSource.slice(1));
}

afterEach(() => {
  cleanup();
});

describe('CoatMakerSeoContent', () => {
  it.each([
    {
      locale: 'en' as const,
      heading: 'Free Family Crest and Coat of Arms Maker',
      verifiedCapability: 'Shield styles, field patterns, charges, text, layers, and drawing tools',
      editorCtaEmphasis: 'Keep shaping the shield, field, symbols, and text',
      faqQuestion: 'Is this coat of arms maker free to use?',
      internalLink: 'Square Token Maker',
      href: '/templates/square-token-maker',
      firstComparisonColumnKeyphrase: 'Our coat of arms maker',
      expectedComparisonRowLabels: ['Start', 'Edit', 'Export', 'Account'],
    },
    {
      locale: 'zh' as const,
      heading: '免费家族纹章与纹章制作器',
      verifiedCapability: '盾牌样式、底纹、图形、文字、图层和绘图工具',
      editorCtaEmphasis: '盾形、底纹、图形和文字都可以继续调整',
      faqQuestion: '纹章制作器可以免费使用吗？',
      internalLink: '方形 Token 制作器',
      href: '/zh/templates/square-token-maker',
      firstComparisonColumnKeyphrase: '我们的纹章制作器',
      expectedComparisonRowLabels: ['开始', '编辑', '导出', '账号'],
    },
  ])('renders the complete $locale localized SEO contract', ({
    locale,
    heading,
    verifiedCapability,
    editorCtaEmphasis,
    faqQuestion,
    internalLink,
    href,
    firstComparisonColumnKeyphrase,
    expectedComparisonRowLabels,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const copy = getCoatMakerSeoCopy(locale);

    expect(within(contentRoot).getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      within(contentRoot).queryByRole('heading', { level: 1, name: heading }),
      `Missing ${locale} heading: ${heading}`,
    ).not.toBeNull();
    const stepsList = within(contentRoot).getByRole('list', { name: /steps|步骤/i });

    expect(stepsList.tagName).toBe('OL');
    expect(within(stepsList).getAllByRole('listitem')).toHaveLength(3);
    expect(within(contentRoot).getByText(verifiedCapability)).not.toBeNull();
    expect(within(contentRoot).getByText(editorCtaEmphasis)).not.toBeNull();
    expect(
      within(contentRoot).queryByRole('heading', { name: faqQuestion }),
      `Missing ${locale} heading: ${faqQuestion}`,
    ).not.toBeNull();
    expect(within(contentRoot).getByRole('link', { name: internalLink }).getAttribute('href')).toBe(href);

    const useCasesSectionHeading = within(contentRoot).queryByRole('heading', {
      level: 2,
      name: copy.useCasesHeading,
    });

    expect(
      useCasesSectionHeading,
      `Missing ${locale} heading: ${copy.useCasesHeading}`,
    ).not.toBeNull();

    const useCasesSection = useCasesSectionHeading?.closest('section');

    expect(
      useCasesSection,
      `Missing ${locale} section for heading: ${copy.useCasesHeading}`,
    ).not.toBeNull();

    if (!useCasesSection) {
      expect.fail(`Missing ${locale} section for heading: ${copy.useCasesHeading}`);
    }

    const visibleUseCaseArticles = within(useCasesSection).queryAllByRole('article');
    const visibleUseCaseHeadings = within(useCasesSection).queryAllByRole('heading', { level: 3 });
    const visibleUseCaseImages = within(useCasesSection).queryAllByRole('img');

    expect(visibleUseCaseArticles, `Expected exactly 4 visible ${locale} use-case articles`).toHaveLength(4);
    expect(visibleUseCaseHeadings, `Expected exactly 4 visible ${locale} use-case headings`).toHaveLength(4);
    expect(visibleUseCaseImages, `Expected exactly 4 visible ${locale} use-case images`).toHaveLength(4);
    for (const [useCaseIndex, useCase] of copy.useCases.entries()) {
      expect(
        visibleUseCaseArticles.some((visibleArticle) => (
          within(visibleArticle).queryByRole('heading', { level: 3, name: useCase.title }) !== null
        )),
        `Missing ${locale} heading: ${useCase.title}`,
      ).toBe(true);
      expect(visibleUseCaseImages[useCaseIndex]?.getAttribute('src')).toBe(useCase.imageSrc);
      expect(visibleUseCaseImages[useCaseIndex]?.getAttribute('alt')).toBe(useCase.imageAlt);
      expect(
        existsSync(resolvePublicAssetFilePath(useCase.imageSrc)),
        `Missing public asset for ${locale} use case: ${useCase.imageSrc}`,
      ).toBe(true);
    }

    const comparisonSectionHeading = within(contentRoot).queryByRole('heading', {
      level: 2,
      name: copy.comparisonHeading,
    });

    expect(
      comparisonSectionHeading,
      `Missing ${locale} heading: ${copy.comparisonHeading}`,
    ).not.toBeNull();

    const comparisonSection = comparisonSectionHeading?.closest('section');

    expect(
      comparisonSection,
      `Missing ${locale} section for heading: ${copy.comparisonHeading}`,
    ).not.toBeNull();

    if (!comparisonSection) {
      expect.fail(`Missing ${locale} section for heading: ${copy.comparisonHeading}`);
    }

    expect(
      within(comparisonSection).queryByText(copy.comparisonLead),
      `Missing ${locale} comparison lead: ${copy.comparisonLead}`,
    ).not.toBeNull();

    const comparisonTable = within(comparisonSection).queryByRole('table');

    expect(comparisonTable, `Missing ${locale} comparison table`).not.toBeNull();

    if (!comparisonTable) {
      expect.fail(`Missing ${locale} comparison table`);
    }

    const expectedComparisonColumnFragments = [
      firstComparisonColumnKeyphrase,
      'CoaMaker',
      'Roll for Fantasy',
    ];
    const removedComparisonColumn = 'Crest and Arms';
    const visibleComparisonColumnHeaders = Array.from(
      comparisonTable.querySelectorAll<HTMLTableCellElement>('thead th[scope="col"]'),
    );

    expect(copy.comparisonColumns, `Expected exactly 3 ${locale} comparison columns`).toHaveLength(3);
    expect(visibleComparisonColumnHeaders, `Expected exactly 3 visible ${locale} comparison columns`).toHaveLength(3);
    expect(
      visibleComparisonColumnHeaders[0]?.textContent?.trim(),
      `Missing ${locale} comparison column string: ${firstComparisonColumnKeyphrase}`,
    ).toBe(firstComparisonColumnKeyphrase);
    for (const [columnIndex, expectedColumnFragment] of expectedComparisonColumnFragments.entries()) {
      expect(
        copy.comparisonColumns[columnIndex]?.includes(expectedColumnFragment),
        `Missing ${locale} comparison column string: ${expectedColumnFragment}`,
      ).toBe(true);
      expect(
        visibleComparisonColumnHeaders[columnIndex]?.textContent?.includes(expectedColumnFragment),
        `Missing visible ${locale} comparison column string: ${expectedColumnFragment}`,
      ).toBe(true);
    }
    expect(
      copy.comparisonColumns.some((comparisonColumn) => comparisonColumn.includes(removedComparisonColumn)),
      `Unexpected ${locale} comparison column string: ${removedComparisonColumn}`,
    ).toBe(false);
    expect(
      visibleComparisonColumnHeaders.some((comparisonColumnHeader) => (
        comparisonColumnHeader.textContent?.includes(removedComparisonColumn) === true
      )),
      `Unexpected visible ${locale} comparison column string: ${removedComparisonColumn}`,
    ).toBe(false);

    const visibleComparisonRows = Array.from(comparisonTable.querySelectorAll<HTMLTableRowElement>('tbody tr'));
    const copyComparisonRowLabels = copy.comparisonRows.map((comparisonRow) => comparisonRow.rowLabel);
    const visibleComparisonRowLabels = visibleComparisonRows.map((comparisonRow) => (
      comparisonRow.querySelector<HTMLTableCellElement>('th[scope="row"]')?.textContent?.trim() ?? ''
    ));

    expect(copy.comparisonRows, `Expected exactly 4 ${locale} comparison rows`).toHaveLength(4);
    expect(visibleComparisonRows, `Expected exactly 4 visible ${locale} comparison rows`).toHaveLength(4);
    expect(
      copyComparisonRowLabels,
      `Missing or extra ${locale} comparison row strings: expected ${expectedComparisonRowLabels.join(', ')}, received ${copyComparisonRowLabels.join(', ')}`,
    ).toEqual(expectedComparisonRowLabels);
    expect(
      visibleComparisonRowLabels,
      `Missing or extra visible ${locale} comparison row strings: expected ${expectedComparisonRowLabels.join(', ')}, received ${visibleComparisonRowLabels.join(', ')}`,
    ).toEqual(expectedComparisonRowLabels);
    for (const [rowIndex, comparisonRow] of copy.comparisonRows.entries()) {
      expect(
        comparisonRow.rowLabel.trim(),
        `Missing ${locale} comparison string: comparisonRows[${rowIndex}].rowLabel`,
      ).not.toBe('');
      expect(
        comparisonRow.cellText,
        `Expected exactly 3 ${locale} cells for comparison row: ${comparisonRow.rowLabel}`,
      ).toHaveLength(3);

      const visibleComparisonRow = visibleComparisonRows[rowIndex];
      const visibleRowLabel = visibleComparisonRow?.querySelector<HTMLTableCellElement>('th[scope="row"]');
      const visibleComparisonCells = Array.from(
        visibleComparisonRow?.querySelectorAll<HTMLTableCellElement>('td') ?? [],
      );

      expect(
        visibleRowLabel?.textContent?.trim(),
        `Missing visible ${locale} comparison row string: ${comparisonRow.rowLabel}`,
      ).toBe(comparisonRow.rowLabel);
      expect(
        visibleComparisonCells,
        `Expected exactly 3 visible ${locale} cells for comparison row: ${comparisonRow.rowLabel}`,
      ).toHaveLength(3);
      for (const [cellIndex, cellText] of comparisonRow.cellText.entries()) {
        expect(
          cellText.trim(),
          `Missing ${locale} comparison string: comparisonRows[${rowIndex}].cellText[${cellIndex}]`,
        ).not.toBe('');
        expect(
          visibleComparisonCells[cellIndex]?.textContent?.trim(),
          `Missing visible ${locale} comparison cell string: ${cellText}`,
        ).toBe(cellText);
      }
    }

    const stepsSectionHeading = within(contentRoot).queryByRole('heading', { level: 2, name: copy.stepsHeading });
    const toolsSectionHeading = within(contentRoot).queryByRole('heading', { level: 2, name: copy.featuresHeading });

    expect(stepsSectionHeading, `Missing ${locale} heading: ${copy.stepsHeading}`).not.toBeNull();
    expect(toolsSectionHeading, `Missing ${locale} heading: ${copy.featuresHeading}`).not.toBeNull();

    if (!stepsSectionHeading || !toolsSectionHeading) {
      expect.fail(`Missing ${locale} steps/tools heading: ${copy.stepsHeading} / ${copy.featuresHeading}`);
    }

    const lastUseCaseArticle = visibleUseCaseArticles.at(-1);
    const stepsAndToolsBlock = stepsSectionHeading.closest('section')?.parentElement;

    expect(lastUseCaseArticle, `Missing fourth ${locale} use-case card before steps/tools block`).toBeDefined();
    expect(stepsAndToolsBlock, `Missing ${locale} steps/tools block`).toBeDefined();
    expect(
      stepsAndToolsBlock?.contains(toolsSectionHeading),
      `Missing ${locale} tools heading from steps/tools block: ${copy.featuresHeading}`,
    ).toBe(true);

    if (!lastUseCaseArticle || !stepsAndToolsBlock) {
      expect.fail(`Missing ${locale} DOM order boundary for use cases, steps/tools, and comparison table`);
    }

    expect(
      lastUseCaseArticle.compareDocumentPosition(stepsAndToolsBlock) & Node.DOCUMENT_POSITION_FOLLOWING,
      `Expected ${locale} steps/tools block after fourth use-case card`,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      stepsAndToolsBlock.compareDocumentPosition(comparisonTable) & Node.DOCUMENT_POSITION_FOLLOWING,
      `Expected ${locale} steps/tools block before comparison table`,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    expect(copy).not.toHaveProperty('overviewParagraphs');
    expect(copy).not.toHaveProperty('featuresIntro');
    expect(copy).not.toHaveProperty('useCasesIntro');
    expect(
      contentRoot.querySelector('h1 + p + p'),
      `Unexpected ${locale} overview paragraph stack after heading: ${heading}`,
    ).toBeNull();
  });

  it.each([
    {
      locale: 'en' as const,
      heading: 'Why choose our coat of arms maker',
      readerCopy:
        'Start creating without an account or paid plan. Add your own images for free, finish an original coat of arms in the browser, and export PNG, JPEG, or PDF; print and batch export are available when you need them.',
      authorNarration: /rows below|other makers/i,
    },
    {
      locale: 'zh' as const,
      heading: '为什么选择我们的纹章制作器',
      readerCopy:
        '无需账号或付费方案，即可开始制作。你可以免费加入自己的图片，在浏览器中完成原创纹章，并导出 PNG、JPEG 或 PDF；需要时也能打印或批量导出。',
      authorNarration: /下面几行|另外两家|逐项摆开比/,
    },
  ])('renders the $locale comparison introduction for readers without author-facing narration', ({
    locale,
    heading,
    readerCopy,
    authorNarration,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const comparisonHeading = within(contentRoot).getByRole('heading', { level: 2, name: heading });
    const comparisonSection = comparisonHeading.closest('section');

    expect(comparisonSection, `Missing ${locale} comparison section`).not.toBeNull();

    if (!comparisonSection) {
      expect.fail(`Missing ${locale} comparison section`);
    }

    expect(within(comparisonSection).getByText(readerCopy)).not.toBeNull();
    expect(comparisonSection.textContent).not.toMatch(authorNarration);
  });

  it.each([
    {
      locale: 'en' as const,
      heading: 'Start with a shield. Leave with a mark of your own.',
      emphasis: 'Keep shaping the shield, field, symbols, and text',
      description:
        'Finish your design in the editor, then export PNG, JPEG, or PDF for a character, faction, guild, or invented family.',
      ctaLabel: 'Start creating',
    },
    {
      locale: 'zh' as const,
      heading: '从一面盾开始，做出属于你的标志',
      emphasis: '盾形、底纹、图形和文字都可以继续调整',
      description:
        '在编辑器里完成设计，再从设备上导出 PNG、JPEG 或 PDF，用于角色、阵营、社团或虚构家族。',
      ctaLabel: '开始制作纹章',
    },
  ])('renders the approved $locale coat maker CTA with a working editor hash', ({
    locale,
    heading,
    emphasis,
    description,
    ctaLabel,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const ctaHeading = within(contentRoot).getByRole('heading', { level: 2, name: heading });
    const ctaSection = ctaHeading.closest('section');

    expect(ctaSection, `Missing ${locale} coat maker CTA section`).not.toBeNull();

    if (!ctaSection) {
      expect.fail(`Missing ${locale} coat maker CTA section`);
    }

    expect(within(ctaSection).getByText(emphasis)).not.toBeNull();
    expect(within(ctaSection).getByText(description)).not.toBeNull();
    expect(within(ctaSection).getByRole('link', { name: ctaLabel }).getAttribute('href')).toBe(
      '#coat-editor-workspace',
    );
  });

  it.each([
    {
      locale: 'en' as const,
      firstQuestion: 'Is this coat of arms maker free to use?',
      secondQuestion: 'Can I return to a design later?',
    },
    {
      locale: 'zh' as const,
      firstQuestion: '纹章制作器可以免费使用吗？',
      secondQuestion: '以后还能继续编辑吗？',
    },
  ])('renders the $locale FAQ as a single-select collapsible accordion', ({
    locale,
    firstQuestion,
    secondQuestion,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const copy = getCoatMakerSeoCopy(locale);
    const firstAnswer = copy.faqItems[0]?.answer;
    const secondAnswer = copy.faqItems[1]?.answer;

    if (firstAnswer === undefined || secondAnswer === undefined) {
      expect.fail(`Missing ${locale} FAQ answers for the first two items`);
    }

    const firstTrigger = within(contentRoot).getByRole('button', { name: firstQuestion });
    const secondTrigger = within(contentRoot).getByRole('button', { name: secondQuestion });
    const firstDetails = firstTrigger.closest('details');
    const secondDetails = secondTrigger.closest('details');
    const firstPanel = document.getElementById(`coat-maker-faq-panel-${locale}-0`);
    const secondPanel = document.getElementById(`coat-maker-faq-panel-${locale}-1`);

    expect(firstTrigger.id).toBe(`coat-maker-faq-trigger-${locale}-0`);
    expect(secondTrigger.id).toBe(`coat-maker-faq-trigger-${locale}-1`);
    expect(firstTrigger.tagName).toBe('SUMMARY');
    expect(secondTrigger.tagName).toBe('SUMMARY');
    expect(firstDetails, `Missing ${locale} first FAQ details`).not.toBeNull();
    expect(secondDetails, `Missing ${locale} second FAQ details`).not.toBeNull();
    expect(firstDetails?.getAttribute('name')).toBe('coat-maker-faq');
    expect(secondDetails?.getAttribute('name')).toBe('coat-maker-faq');
    expect(firstPanel, `Missing ${locale} first FAQ panel`).not.toBeNull();
    expect(secondPanel, `Missing ${locale} second FAQ panel`).not.toBeNull();
    expect(firstPanel?.id).toBe(`coat-maker-faq-panel-${locale}-0`);
    expect(secondPanel?.id).toBe(`coat-maker-faq-panel-${locale}-1`);
    expect(firstPanel?.getAttribute('aria-labelledby')).toBe(firstTrigger.id);
    expect(secondPanel?.getAttribute('aria-labelledby')).toBe(secondTrigger.id);
    expect(firstDetails?.open).toBe(false);
    expect(secondDetails?.open).toBe(false);
    expect(within(contentRoot).getByText(firstAnswer)).not.toBeNull();
    expect(within(contentRoot).getByText(secondAnswer)).not.toBeNull();

    fireEvent.click(firstTrigger);

    expect(firstDetails?.open).toBe(true);
    expect(secondDetails?.open).toBe(false);

    fireEvent.click(secondTrigger);

    expect(firstDetails?.open).toBe(false);
    expect(secondDetails?.open).toBe(true);

    fireEvent.click(secondTrigger);

    expect(secondDetails?.open).toBe(false);
    expect(within(contentRoot).getByText(firstAnswer)).not.toBeNull();
    expect(within(contentRoot).getByText(secondAnswer)).not.toBeNull();
  });

  it.each([
    {
      locale: 'en' as const,
      faqHeading: 'Frequently asked questions',
      accountQuestion: 'Do I need an account to use the coat of arms maker?',
      accountAnswer:
        'No. You can edit and export a design directly in the browser, and the project stays in your current browser.',
      uploadQuestion: 'Can I add my own images to the coat of arms?',
      uploadAnswer:
        'Yes. Add a local image, adjust its position, size, and layer in the editor, then export it as part of the finished design.',
    },
    {
      locale: 'zh' as const,
      faqHeading: '常见问题',
      accountQuestion: '使用纹章制作器需要注册账号吗？',
      accountAnswer: '不需要。你可以直接在浏览器中编辑和导出设计，项目会保留在当前浏览器中。',
      uploadQuestion: '可以把自己的图片加入纹章吗？',
      uploadAnswer: '可以。你可以加入本地图片，在编辑器中调整位置、大小和图层，然后随整个设计一起导出。',
    },
  ])('renders five $locale FAQ items including account and local-image guidance', ({
    locale,
    faqHeading,
    accountQuestion,
    accountAnswer,
    uploadQuestion,
    uploadAnswer,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const heading = within(contentRoot).getByRole('heading', { level: 2, name: faqHeading });
    const faqSection = heading.closest('section');

    expect(faqSection, `Missing ${locale} FAQ section`).not.toBeNull();

    if (!faqSection) {
      expect.fail(`Missing ${locale} FAQ section`);
    }

    expect(within(faqSection).getAllByRole('button')).toHaveLength(5);
    expect(within(faqSection).getByRole('button', { name: accountQuestion })).not.toBeNull();
    expect(within(faqSection).getByText(accountAnswer)).not.toBeNull();
    expect(within(faqSection).getByRole('button', { name: uploadQuestion })).not.toBeNull();
    expect(within(faqSection).getByText(uploadAnswer)).not.toBeNull();
  });

  it('counts Chinese all-content tokens as Han characters plus Latin and numeric tokens', () => {
    expect(countChineseTokens('纹章制作器 Token 5e')).toBe(7);
  });

  it('collects visible semantic text from headings, paragraphs, list items, links, and table cells only', () => {
    render(
      <section data-testid="semantic-text-fixture">
        <h1>Heading one</h1>
        <h2>Heading two</h2>
        <h3>Heading three</h3>
        <p>Paragraph</p>
        <ul>
          <li>List item</li>
        </ul>
        <a href="/semantic-link">Link</a>
        <table>
          <thead>
            <tr>
              <th>Column heading</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Table cell</td>
            </tr>
          </tbody>
        </table>
        <h4>Heading four</h4>
        <div>Division</div>
        <span>Span</span>
        <button type="button">Button</button>
      </section>,
    );

    expect(collectVisibleSemanticText(screen.getByTestId('semantic-text-fixture'))).toBe(
      'Heading one Heading two Heading three Paragraph List item Link Column heading Table cell',
    );
  });

  it.each([
    { locale: 'en' as const, keyphrase: 'coat of arms maker' },
    { locale: 'zh' as const, keyphrase: '纹章制作器' },
  ])('records the $locale keyphrase density after putting metadata copy on the page', ({ locale, keyphrase }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const semanticText = collectVisibleSemanticText(contentRoot);
    const density = calculateKeyphraseDensity(semanticText, keyphrase, locale);
    const totalTokenCount = locale === 'zh' ? countChineseTokens(semanticText) : countEnglishTokens(semanticText);
    const keyphraseOccurrenceCount = locale === 'zh'
      ? countChineseKeyphraseOccurrences(semanticText, keyphrase)
      : countEnglishKeyphraseOccurrences(semanticText, keyphrase);
    const keyphraseTokenCount = locale === 'zh' ? countChineseTokens(keyphrase) : countEnglishTokens(keyphrase);

    expect(
      density,
      `Expected ${locale} keyphrase density to be at least 2%, received ${density} (${density * 100}%)`,
    ).toBeGreaterThanOrEqual(0.02);
    expect(
      density,
      `Expected ${locale} keyphrase density to be at most 4%, received ${density} (${density * 100}%)`,
    ).toBeLessThanOrEqual(0.04);
    expect(density).toBeCloseTo((keyphraseOccurrenceCount * keyphraseTokenCount) / totalTokenCount, 10);
  });

  it.each(['en', 'zh'] as const)('exposes verified WebApplication feature names for $locale', (locale) => {
    const copy = getCoatMakerSeoCopy(locale);

    expect(copy.webApplicationFeatureNames).toHaveLength(3);
    expect(copy.webApplicationFeatureNames.every((featureName) => featureName.trim().length > 0)).toBe(true);
  });

  it.each(['fr', 'toString', 'constructor', '__proto__'])('rejects unsupported locale key %s before returning copy', (invalidLocale) => {
    expect(() => getCoatMakerSeoCopy(invalidLocale as Parameters<typeof getCoatMakerSeoCopy>[0])).toThrow(
      `Unsupported Coat Maker SEO locale: ${invalidLocale}`,
    );
  });
});
