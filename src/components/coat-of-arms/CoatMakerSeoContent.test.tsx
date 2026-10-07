// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CoatMakerSeoContent } from './CoatMakerSeoContent';
import { getCoatMakerShowcaseCopy } from './coat-maker-showcase-copy';
import { getCoatMakerSeoCopy } from './coat-maker-seo-copy';

afterEach(() => {
  cleanup();
});

describe('CoatMakerSeoContent', () => {
  it.each([
    {
      locale: 'en' as const,
      heading: 'Coat of Arms Maker: Free Online Fantasy and Guild Badges',
      removedSectionHeadings: [
        'Jobs for this coat of arms maker',
        'Create a heraldic design in three steps',
        'Tools for a complete design',
      ],
      removedUseCaseCardTitles: [
        'Tabletop houses and factions',
        'Guild, club, and community badges',
        'Fantasy characters and invented banners',
        'Worldbuilding maps and title pages',
      ],
      removedUseCaseImageAlts: [
        'House shields laid out on a tabletop session handout',
        'A guild badge on a roster header and a printed sticker sheet',
        'An invented banner on a character sheet and a costume cloak',
        'Regional banners on a setting map and a title page',
      ],
      removedStepTexts: ['Choose a shield', 'Add your symbols', 'Finish and export'],
      removedFeatureTexts: [
        'Shield styles, field patterns, charges, text, layers, and drawing tools',
        'Browser draft recovery after a reload',
        'PNG, JPEG, PDF, print, and batch export options',
      ],
      editorCtaEmphasis: 'Keep shaping the shield, field, symbols, and text in Coat of Arms Maker',
      faqQuestion: 'Is this coat of arms maker free to use?',
      relatedToolsHeading: 'Keep creating',
      contextualLinkLabels: ['Square Token Maker', 'Dice Roller', 'Read the FAQ'],
      firstComparisonColumnKeyphrase: 'Our coat of arms maker',
      expectedComparisonRowLabels: ['Start', 'Edit', 'Export', 'Account'],
    },
    {
      locale: 'zh' as const,
      heading: '纹章制作器：免费在线做奇幻与公会徽章',
      removedSectionHeadings: ['这个纹章制作器适合完成的工作', '三步完成纹章设计', '完成设计所需的工具'],
      removedUseCaseCardTitles: [
        '桌面团的家族与阵营',
        '公会、社团和社区徽章',
        '奇幻角色与发明的旗帜',
        '世界观地图与扉页',
      ],
      removedUseCaseImageAlts: [
        '几面家族盾摆在桌面团讲义上',
        '社团徽章印在名册页眉和贴纸页上',
        '角色卡和披风上的虚构旗帜',
        '设定地图和扉页上的地区旗帜',
      ],
      removedStepTexts: ['选择盾牌', '添加元素', '完成并导出'],
      removedFeatureTexts: [
        '盾牌样式、底纹、图形、文字、图层和绘图工具',
        '重新打开页面后可恢复浏览器草稿',
        'PNG、JPEG、PDF、打印和批量导出选项',
      ],
      editorCtaEmphasis: '在纹章制作器中继续调整盾形、底纹、图形和文字',
      faqQuestion: '纹章制作器可以免费使用吗？',
      relatedToolsHeading: '继续创作',
      contextualLinkLabels: ['方形 Token 制作器', '骰子工具', '查看常见问题'],
      firstComparisonColumnKeyphrase: '我们的纹章制作器',
      expectedComparisonRowLabels: ['开始', '编辑', '导出', '账号'],
    },
  ])('renders the remaining $locale localized SEO contract', ({
    locale,
    heading,
    removedSectionHeadings,
    removedUseCaseCardTitles,
    removedUseCaseImageAlts,
    removedStepTexts,
    removedFeatureTexts,
    editorCtaEmphasis,
    faqQuestion,
    relatedToolsHeading,
    contextualLinkLabels,
    firstComparisonColumnKeyphrase,
    expectedComparisonRowLabels,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const copy = getCoatMakerSeoCopy(locale);

    expect(copy).not.toHaveProperty('stepsHeading');
    expect(copy).not.toHaveProperty('stepsAriaLabel');
    expect(copy).not.toHaveProperty('steps');
    expect(copy).not.toHaveProperty('featuresHeading');
    expect(copy).not.toHaveProperty('verifiedCapabilities');
    expect(copy).not.toHaveProperty('useCasesHeading');
    expect(copy).not.toHaveProperty('useCasesLead');
    expect(copy).not.toHaveProperty('useCases');

    expect(within(contentRoot).queryByRole('heading', { level: 1 })).toBeNull();
    expect(
      within(contentRoot).queryByRole('heading', { level: 1, name: heading }),
      `Unexpected ${locale} heading below the editor: ${heading}`,
    ).toBeNull();

    for (const removedSectionHeading of removedSectionHeadings) {
      expect(
        within(contentRoot).queryByRole('heading', { name: removedSectionHeading }),
        `Unexpected removed ${locale} section heading: ${removedSectionHeading}`,
      ).toBeNull();
    }
    for (const removedUseCaseCardTitle of removedUseCaseCardTitles) {
      expect(
        within(contentRoot).queryByRole('heading', { level: 3, name: removedUseCaseCardTitle }),
        `Unexpected removed ${locale} use-case card title: ${removedUseCaseCardTitle}`,
      ).toBeNull();
    }
    for (const removedUseCaseImageAlt of removedUseCaseImageAlts) {
      expect(
        within(contentRoot).queryByRole('img', { name: removedUseCaseImageAlt }),
        `Unexpected removed ${locale} use-case image: ${removedUseCaseImageAlt}`,
      ).toBeNull();
    }
    for (const removedStepText of removedStepTexts) {
      expect(
        within(contentRoot).queryByText(removedStepText),
        `Unexpected removed ${locale} step text: ${removedStepText}`,
      ).toBeNull();
    }
    for (const removedFeatureText of removedFeatureTexts) {
      expect(
        within(contentRoot).queryByText(removedFeatureText),
        `Unexpected removed ${locale} feature text: ${removedFeatureText}`,
      ).toBeNull();
    }
    expect(within(contentRoot).getByText(editorCtaEmphasis)).not.toBeNull();
    expect(
      within(contentRoot).queryByRole('heading', { name: faqQuestion }),
      `Missing ${locale} heading: ${faqQuestion}`,
    ).not.toBeNull();
    expect(copy.contextualLinks.map((contextualLink) => contextualLink.label)).toEqual(contextualLinkLabels);
    expect(
      within(contentRoot).queryByRole('heading', { level: 2, name: relatedToolsHeading }),
      `Unexpected ${locale} removed related-tools heading: ${relatedToolsHeading}`,
    ).toBeNull();
    expect(
      within(contentRoot).queryByRole('navigation', { name: relatedToolsHeading }),
      `Unexpected ${locale} removed related-tools navigation: ${relatedToolsHeading}`,
    ).toBeNull();
    for (const contextualLinkLabel of contextualLinkLabels) {
      expect(
        within(contentRoot).queryByRole('link', { name: contextualLinkLabel }),
        `Unexpected ${locale} related-tools link: ${contextualLinkLabel}`,
      ).toBeNull();
    }

    const comparisonSectionHeading = document.getElementById('coat-maker-comparison-heading');

    expect(
      comparisonSectionHeading,
      `Missing ${locale} heading: ${copy.comparisonHeading}`,
    ).not.toBeNull();

    const comparisonSection = document.getElementById('coat-maker-comparison');

    expect(
      comparisonSection,
      `Missing ${locale} section for heading: ${copy.comparisonHeading}`,
    ).not.toBeNull();

    if (!comparisonSection) {
      expect.fail(`Missing ${locale} section for heading: ${copy.comparisonHeading}`);
    }

    expect(comparisonSection.parentElement).toBe(contentRoot);
    expect(comparisonSection.getAttribute('aria-labelledby')).toBe('coat-maker-comparison-heading');
    expect(comparisonSectionHeading?.closest('section')).toBe(comparisonSection);

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
    expect(visibleComparisonColumnHeaders, `Expected one dimension and 3 visible ${locale} comparison columns`).toHaveLength(4);
    expect(
      visibleComparisonColumnHeaders[0]?.textContent?.trim(),
      `Missing ${locale} comparison dimension heading: ${copy.comparisonDimensionHeading}`,
    ).toBe(copy.comparisonDimensionHeading);
    for (const [columnIndex, expectedColumnFragment] of expectedComparisonColumnFragments.entries()) {
      expect(
        copy.comparisonColumns[columnIndex]?.includes(expectedColumnFragment),
        `Missing ${locale} comparison column string: ${expectedColumnFragment}`,
      ).toBe(true);
      expect(
        visibleComparisonColumnHeaders[columnIndex + 1]?.textContent?.includes(expectedColumnFragment),
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
      eyebrow: 'How it works',
      heading: 'How to use the Coat of Arms Maker',
      steps: [
        {
          title: 'Choose a shield and field',
          description:
            'In Coat of Arms Maker, choose a shield shape, set its field divisions, and adjust patterns and colors to define the base of your design.',
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
    },
    {
      locale: 'zh' as const,
      eyebrow: '使用方式',
      heading: '如何使用纹章制作器？',
      steps: [
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
    },
  ])('renders the localized $locale how-it-works steps with ordered semantics', ({
    locale,
    eyebrow,
    heading,
    steps,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const copy = getCoatMakerSeoCopy(locale);
    const howItWorksSection = document.getElementById('coat-maker-how-it-works');
    const howItWorksHeading = document.getElementById('coat-maker-how-it-works-heading');

    expect(copy.howItWorksEyebrow).toBe(eyebrow);
    expect(copy.howItWorksHeading).toBe(heading);
    expect(copy.howItWorksSteps).toEqual(steps);
    expect(howItWorksSection, `Missing ${locale} how-it-works section`).not.toBeNull();
    expect(howItWorksHeading, `Missing ${locale} how-it-works heading`).not.toBeNull();

    if (!howItWorksSection || !howItWorksHeading) {
      expect.fail(`Missing ${locale} how-it-works landmark`);
    }

    expect(howItWorksSection.parentElement).toBe(contentRoot);
    expect(howItWorksSection.getAttribute('aria-labelledby')).toBe(howItWorksHeading.id);
    expect(howItWorksHeading.textContent?.trim()).toBe(heading);
    expect(within(howItWorksSection).getByText(eyebrow)).not.toBeNull();

    const orderedSteps = within(howItWorksSection).getByRole('list');
    const stepItems = within(orderedSteps).getAllByRole('listitem');

    expect(orderedSteps.tagName).toBe('OL');
    expect(stepItems).toHaveLength(3);
    expect(copy.howItWorksSteps.map((step) => step.title)).toEqual(steps.map((step) => step.title));

    for (const [stepIndex, step] of steps.entries()) {
      const stepItem = stepItems[stepIndex];

      expect(stepItem?.tagName).toBe('LI');
      expect(within(stepItem).getByText(String(stepIndex + 1).padStart(2, '0'))).not.toBeNull();
      expect(within(stepItem).getByRole('heading', { level: 3, name: step.title })).not.toBeNull();
      expect(within(stepItem).getByText(step.description)).not.toBeNull();
    }
  });

  it.each([
    {
      locale: 'en' as const,
      comparisonDimensionHeading: 'Comparison',
      comparisonTableLabel: 'Coat of Arms Maker comparison',
    },
    {
      locale: 'zh' as const,
      comparisonDimensionHeading: '对比维度',
      comparisonTableLabel: '纹章制作器对比',
    },
  ])('exposes the localized $locale comparison table landmarks', ({
    locale,
    comparisonDimensionHeading,
    comparisonTableLabel,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const copy = getCoatMakerSeoCopy(locale);
    const comparisonSection = document.getElementById('coat-maker-comparison');
    const comparisonHeading = document.getElementById('coat-maker-comparison-heading');
    const comparisonScrollFrame = document.getElementById('coat-maker-comparison-scroll');

    expect(copy.comparisonDimensionHeading).toBe(comparisonDimensionHeading);
    expect(copy.comparisonTableLabel).toBe(comparisonTableLabel);
    expect(comparisonSection, `Missing ${locale} comparison section`).not.toBeNull();
    expect(comparisonHeading, `Missing ${locale} comparison heading`).not.toBeNull();
    expect(comparisonScrollFrame, `Missing ${locale} comparison scroll frame`).not.toBeNull();

    if (!comparisonSection || !comparisonHeading || !comparisonScrollFrame) {
      expect.fail(`Missing ${locale} comparison landmark`);
    }

    expect(contentRoot.querySelectorAll('#coat-maker-comparison')).toHaveLength(1);
    expect(comparisonSection.parentElement).toBe(contentRoot);
    expect(comparisonSection.getAttribute('aria-labelledby')).toBe(comparisonHeading.id);
    expect(comparisonHeading.textContent?.trim()).toBe(copy.comparisonHeading);
    expect(comparisonScrollFrame.parentElement).toBe(comparisonSection);
    expect(comparisonScrollFrame.getAttribute('role')).toBe('region');
    expect(comparisonScrollFrame.tabIndex).toBe(0);
    expect(comparisonScrollFrame.getAttribute('aria-label')).toBe(copy.comparisonTableLabel);

    const comparisonTable = within(comparisonScrollFrame).getByRole('table');
    const tableCaptions = comparisonTable.querySelectorAll('caption');
    const comparisonColumnHeaders = Array.from(
      comparisonTable.querySelectorAll<HTMLTableCellElement>('thead th[scope="col"]'),
    );
    const comparisonRows = Array.from(comparisonTable.querySelectorAll<HTMLTableRowElement>('tbody tr'));

    expect(tableCaptions, `Expected one ${locale} comparison table caption`).toHaveLength(1);
    expect(tableCaptions[0]?.textContent?.trim()).toBe(copy.comparisonHeading);
    expect(comparisonColumnHeaders, `Expected one dimension and 3 ${locale} tool columns`).toHaveLength(4);
    expect(comparisonColumnHeaders[0]?.textContent?.trim()).toBe(comparisonDimensionHeading);
    expect(comparisonColumnHeaders.slice(1).map((headerCell) => headerCell.textContent?.trim())).toEqual(
      copy.comparisonColumns,
    );
    expect(comparisonRows, `Expected exactly 4 visible ${locale} comparison rows`).toHaveLength(4);
    for (const comparisonRow of comparisonRows) {
      expect(comparisonRow.querySelectorAll('td')).toHaveLength(3);
    }
  });

  it.each([
    {
      locale: 'en' as const,
      whatIsTitle: 'What is the Coat of Arms Maker?',
      whatIsDescription:
        'Coat of Arms Maker is a free online editor for creating custom shields, character emblems, and guild badges. Choose a shield shape and field pattern, combine symbols, text, and layers, or add your own images and drawn details. Download the finished design as PNG, JPEG, or PDF.',
      featureOverviewTitle: 'Create Your Own Coat of Arms',
      featureOverviewSubtitle:
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
    {
      locale: 'zh' as const,
      whatIsTitle: '什么是纹章制作器？',
      whatIsDescription:
        '纹章制作器是一款免费在线视觉编辑工具，用于制作自己的盾徽、角色标志和公会徽章。你可以选择盾形与底纹，组合图形、文字和图层，也可加入图片或绘制细节。完成后将设计导出为 PNG、JPEG 或 PDF。',
      featureOverviewTitle: '设计属于你的纹章',
      featureOverviewSubtitle: '使用纹章制作器选择盾形与底纹，加入图形和格言，再调整细节并导出设计，整个过程都在浏览器中完成。',
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
  ])('renders the localized What Is and feature overview contract for $locale', ({
    locale,
    whatIsTitle,
    whatIsDescription,
    featureOverviewTitle,
    featureOverviewSubtitle,
    features,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const copy = getCoatMakerSeoCopy(locale);
    const whatIsHeading = within(contentRoot).getByRole('heading', { level: 2, name: whatIsTitle });
    const whatIsSection = whatIsHeading.closest('section');

    expect(copy.whatIsTitle).toBe(whatIsTitle);
    expect(copy.whatIsDescription).toBe(whatIsDescription);
    expect(copy.featureOverview.title).toBe(featureOverviewTitle);
    expect(copy.featureOverview.subtitle).toBe(featureOverviewSubtitle);
    expect(copy.featureOverview.features.map((feature) => feature.icon)).toEqual(
      features.map((feature) => feature.icon),
    );
    expect(whatIsSection, `Missing ${locale} What Is section`).not.toBeNull();

    if (!whatIsSection) {
      expect.fail(`Missing ${locale} What Is section`);
    }

    expect(whatIsSection.id).toBe('coat-maker-what-is');
    expect(whatIsSection.parentElement).toBe(contentRoot);
    expect(whatIsSection.getAttribute('aria-labelledby')).toBe('coat-maker-what-is-heading');
    expect(whatIsHeading.id).toBe('coat-maker-what-is-heading');
    expect(whatIsSection.querySelectorAll('p')).toHaveLength(1);
    expect(within(whatIsSection).getByText(whatIsDescription)).not.toBeNull();

    const featureSection = document.getElementById('coat-maker-features');
    expect(featureSection, `Missing ${locale} feature section`).not.toBeNull();

    if (!featureSection) {
      expect.fail(`Missing ${locale} feature section`);
    }

    const featureHeading = within(featureSection).getByRole('heading', { level: 2, name: featureOverviewTitle });
    const featureCards = within(featureSection).getAllByRole('article');

    expect(featureSection.parentElement).toBe(contentRoot);
    expect(featureSection.getAttribute('aria-labelledby')).toBe('coat-maker-features-heading');
    expect(featureHeading.id).toBe('coat-maker-features-heading');
    expect(within(featureSection).getByText(featureOverviewSubtitle)).not.toBeNull();
    expect(featureCards).toHaveLength(6);
    expect(featureSection.querySelectorAll('article svg')).toHaveLength(6);
    expect(featureSection.querySelectorAll('article svg:not([aria-hidden="true"])')).toHaveLength(0);

    for (const feature of features) {
      const featureCardHeading = within(featureSection).getByRole('heading', {
        level: 3,
        name: feature.title,
      });
      const featureCard = featureCardHeading.closest('article');

      expect(featureCard, `Missing ${locale} feature card: ${feature.title}`).not.toBeNull();

      if (!featureCard) {
        expect.fail(`Missing ${locale} feature card: ${feature.title}`);
      }

      expect(within(featureCard).getByText(feature.description)).not.toBeNull();
    }

    const howItWorksSection = document.getElementById('coat-maker-how-it-works');
    const comparisonSection = document.getElementById('coat-maker-comparison');
    const ctaSection = within(contentRoot)
      .getByRole('heading', { level: 2, name: copy.editorCtaHeading })
      .closest('section');
    const faqSection = within(contentRoot)
      .getByRole('heading', { level: 2, name: copy.faqHeading })
      .closest('section');

    expect(howItWorksSection, `Missing ${locale} how-it-works section`).not.toBeNull();
    expect(comparisonSection, `Missing ${locale} comparison section`).not.toBeNull();
    expect(ctaSection, `Missing ${locale} CTA section`).not.toBeNull();
    expect(faqSection, `Missing ${locale} FAQ section`).not.toBeNull();

    if (!howItWorksSection || !comparisonSection || !ctaSection || !faqSection) {
      expect.fail(`Missing ${locale} downstream SEO section after the new What Is/features sections`);
    }

    const orderedSeoBlocks = [whatIsSection, featureSection, howItWorksSection, comparisonSection, ctaSection, faqSection];

    for (const [blockIndex, currentBlock] of orderedSeoBlocks.entries()) {
      const nextBlock = orderedSeoBlocks[blockIndex + 1];

      if (!nextBlock) {
        continue;
      }

      expect(
        currentBlock.compareDocumentPosition(nextBlock) & Node.DOCUMENT_POSITION_FOLLOWING,
        `Expected ${locale} SEO block ${blockIndex} to precede block ${blockIndex + 1}`,
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    }
  });

  it.each([
    {
      locale: 'en' as const,
      heading: 'Why choose our coat of arms maker',
      readerCopy:
        'Start creating in Coat of Arms Maker without an account or paid plan. Add your own images for free, finish an original coat of arms in the browser, and export PNG, JPEG, or PDF; print and batch export are available when you need them.',
      authorNarration: /rows below|other makers/i,
    },
    {
      locale: 'zh' as const,
      heading: '为什么选择我们的纹章制作器',
      readerCopy:
        '无需账号或付费方案，即可使用纹章制作器开始制作。你可以免费加入自己的图片，在浏览器中完成原创纹章，并导出 PNG、JPEG 或 PDF；需要时也能打印或批量导出。',
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
      emphasis: 'Keep shaping the shield, field, symbols, and text in Coat of Arms Maker',
      description:
        'Finish your design in the editor, then export PNG, JPEG, or PDF for a character, faction, guild, or invented family.',
      ctaLabel: 'Start creating',
    },
    {
      locale: 'zh' as const,
      heading: '从一面盾开始，做出属于你的标志',
      emphasis: '在纹章制作器中继续调整盾形、底纹、图形和文字',
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
    expect(within(contentRoot).getAllByRole('link')).toHaveLength(1);
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
      faqEyebrow: 'FAQ',
      faqDescription: 'Find answers about free use of Coat of Arms Maker, browser drafts, accounts, your own images, and export formats.',
      accountQuestion: 'Do I need an account to use the coat of arms maker?',
      accountAnswer:
        'No. You can use Coat of Arms Maker to edit and export a design directly in the browser, and the project stays in your current browser.',
      uploadQuestion: 'Can I add my own images to the coat of arms?',
      uploadAnswer:
        'Yes. Add a local image to Coat of Arms Maker, adjust its position, size, and layer in the editor, then export it as part of the finished design.',
    },
    {
      locale: 'zh' as const,
      faqHeading: '常见问题',
      faqEyebrow: 'FAQ',
      faqDescription: '了解免费使用纹章制作器、浏览器草稿、账号、自有图片和导出格式等常见问题。',
      accountQuestion: '使用纹章制作器需要注册账号吗？',
      accountAnswer: '不需要。你可以直接在纹章制作器中编辑和导出设计，项目会保留在当前浏览器中。',
      uploadQuestion: '可以把自己的图片加入纹章吗？',
      uploadAnswer: '可以。你可以把本地图片加入纹章制作器，在编辑器中调整位置、大小和图层，然后随整个设计一起导出。',
    },
  ])('renders five $locale FAQ items including account and local-image guidance', ({
    locale,
    faqHeading,
    faqEyebrow,
    faqDescription,
    accountQuestion,
    accountAnswer,
    uploadQuestion,
    uploadAnswer,
  }) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const contentRoot = screen.getByTestId('coat-maker-seo-content');
    const copy = getCoatMakerSeoCopy(locale);
    const heading = document.getElementById('coat-maker-faq-heading');
    const faqSection = document.getElementById('coat-maker-faq');
    const description = document.getElementById('coat-maker-faq-description');

    expect(heading, `Missing ${locale} FAQ heading`).not.toBeNull();
    expect(faqSection, `Missing ${locale} FAQ section`).not.toBeNull();
    expect(description, `Missing ${locale} FAQ description`).not.toBeNull();

    if (!heading || !faqSection || !description) {
      expect.fail(`Missing ${locale} FAQ section`);
    }

    expect(contentRoot.querySelectorAll('#coat-maker-faq')).toHaveLength(1);
    expect(faqSection.parentElement).toBe(contentRoot);
    expect(faqSection.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(faqSection.getAttribute('aria-describedby')).toBe(description.id);
    expect(heading.textContent?.trim()).toBe(faqHeading);
    expect(within(faqSection).getByText(faqEyebrow)).not.toBeNull();
    expect(description.tagName).toBe('P');
    expect(description.textContent?.trim()).toBe(faqDescription);
    const faqButtons = within(faqSection).getAllByRole('button');

    expect(faqButtons).toHaveLength(5);
    expect(faqButtons.map((faqButton) => faqButton.textContent?.trim())).toEqual(
      copy.faqItems.map((faqItem) => faqItem.question),
    );
    for (const faqItem of copy.faqItems) {
      expect(within(faqSection).getByRole('button', { name: faqItem.question })).not.toBeNull();
      expect(within(faqSection).getByText(faqItem.answer)).not.toBeNull();
    }
    expect(within(faqSection).getByRole('button', { name: accountQuestion })).not.toBeNull();
    expect(within(faqSection).getByText(accountAnswer)).not.toBeNull();
    expect(within(faqSection).getByRole('button', { name: uploadQuestion })).not.toBeNull();
    expect(within(faqSection).getByText(uploadAnswer)).not.toBeNull();
  });

  it.each(['en', 'zh'] as const)('exposes verified WebApplication feature names for $locale', (locale) => {
    const copy = getCoatMakerSeoCopy(locale);

    expect(copy.webApplicationFeatureNames).toHaveLength(3);
    expect(copy.webApplicationFeatureNames.every((featureName) => featureName.trim().length > 0)).toBe(true);
  });

  it.each(['en', 'zh'] as const)('renders the localized three-group showcase with isolated carousels for $locale', async (locale) => {
    render(<CoatMakerSeoContent locale={locale} />);

    const showcaseSection = screen.getByTestId('coat-maker-showcase');
    const copy = getCoatMakerShowcaseCopy(locale);
    const groupSections = Array.from(showcaseSection.querySelectorAll<HTMLElement>('[data-showcase-group]'));
    const whatIsSection = document.getElementById('coat-maker-what-is');
    const featureSection = document.getElementById('coat-maker-features');

    expect(showcaseSection.getAttribute('aria-label')).toBe(copy.heading);
    expect(showcaseSection.getAttribute('aria-labelledby')).toBeNull();
    expect(within(showcaseSection).queryByRole('heading', { level: 2, name: copy.heading })).toBeNull();
    expect(within(showcaseSection).queryByText(copy.description)).toBeNull();
    expect(showcaseSection.parentElement).toBe(screen.getByTestId('coat-maker-seo-content'));
    expect(whatIsSection).not.toBeNull();
    expect(featureSection).not.toBeNull();

    if (!whatIsSection || !featureSection) {
      expect.fail(`Missing ${locale} What Is or feature section around showcase.`);
    }

    expect(whatIsSection.compareDocumentPosition(showcaseSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(showcaseSection.compareDocumentPosition(featureSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(groupSections).toHaveLength(3);
    expect(groupSections.map((groupSection) => groupSection.dataset.showcaseGroup)).toEqual([
      'characters',
      'guilds',
      'regions',
    ]);

    const groupCarousels: HTMLElement[] = [];

    for (const [groupIndex, groupCopy] of copy.groups.entries()) {
      const groupSection = groupSections[groupIndex];

      if (!groupSection) {
        expect.fail(`Missing ${locale} showcase group at index ${groupIndex}.`);
      }

      expect(within(groupSection).getByRole('heading', { level: 3, name: groupCopy.title })).not.toBeNull();
      expect(within(groupSection).getByText(groupCopy.description)).not.toBeNull();

      const carousel = groupSection.querySelector<HTMLElement>('[data-circular-testimonials="true"]');

      expect(carousel, `Missing ${locale} showcase carousel: ${groupCopy.id}`).not.toBeNull();

      if (!carousel) {
        expect.fail(`Missing ${locale} showcase carousel: ${groupCopy.id}`);
      }

      expect(carousel.getAttribute('aria-label')).toBe(groupCopy.title);
      expect(carousel.querySelectorAll('[data-part="testimonial-image-frame"]')).toHaveLength(4);
      expect(within(carousel).getAllByRole('button')).toHaveLength(2);
      expect(within(carousel).getByRole('button', { name: `${copy.previousLabel} — ${groupCopy.title}` })).not.toBeNull();
      expect(within(carousel).getByRole('button', { name: `${copy.nextLabel} — ${groupCopy.title}` })).not.toBeNull();
      groupCarousels.push(carousel);
    }

    const firstGroup = copy.groups[0];
    const secondGroup = copy.groups[1];
    const firstCarousel = groupCarousels[0];
    const secondCarousel = groupCarousels[1];

    if (!firstGroup || !secondGroup || !firstCarousel || !secondCarousel) {
      expect.fail(`Missing ${locale} showcase carousel interaction fixture.`);
    }

    const firstGroupInitialExample = firstGroup.examples[0];
    const firstGroupNextExample = firstGroup.examples[1];
    const secondGroupInitialExample = secondGroup.examples[0];

    if (!firstGroupInitialExample || !firstGroupNextExample || !secondGroupInitialExample) {
      expect.fail(`Missing ${locale} showcase examples for carousel interaction fixture.`);
    }

    expect(within(firstCarousel).getByText(firstGroupInitialExample.name)).not.toBeNull();
    expect(within(secondCarousel).getByText(secondGroupInitialExample.name)).not.toBeNull();

    fireEvent.click(within(firstCarousel).getByRole('button', {
      name: `${copy.nextLabel} — ${firstGroup.title}`,
    }));

    await waitFor(() => {
      expect(within(firstCarousel).getByText(firstGroupNextExample.name)).not.toBeNull();
    });
    expect(within(secondCarousel).getByText(secondGroupInitialExample.name)).not.toBeNull();
  });

  it.each(['fr', 'toString', 'constructor', '__proto__'])('rejects unsupported locale key %s before returning copy', (invalidLocale) => {
    expect(() => getCoatMakerSeoCopy(invalidLocale as Parameters<typeof getCoatMakerSeoCopy>[0])).toThrow(
      `Unsupported Coat Maker SEO locale: ${invalidLocale}`,
    );
  });
});
