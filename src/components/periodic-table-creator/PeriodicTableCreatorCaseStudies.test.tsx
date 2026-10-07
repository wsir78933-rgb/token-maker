// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PeriodicTableCreatorCaseStudies } from '@/components/periodic-table-creator/PeriodicTableCreatorCaseStudies';
import { getPeriodicTableCaseStudiesCopy } from '@/lib/periodic-table-creator/case-studies-copy';
import type { PeriodicTableDocument } from '@/lib/periodic-table-creator/types';

const { loadDocumentMock, requestTableMock } = vi.hoisted(() => ({
  loadDocumentMock: vi.fn(),
  requestTableMock: vi.fn(),
}));

vi.mock('@/lib/periodic-table-creator/case-studies', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/periodic-table-creator/case-studies')>();
  return { ...actual, loadPeriodicTableCaseDocument: loadDocumentMock };
});

vi.mock('@/components/periodic-table-creator/PeriodicTableCreatorCaseLoadProvider', () => ({
  usePeriodicTableCaseLoad: () => ({ request: null, requestTable: requestTableMock }),
}));

function createTestPeriodicTableDocument(): PeriodicTableDocument {
  return {
    version: 1,
    rows: 1,
    columns: 1,
    cells: [
      {
        id: 'r1c1',
        text: {
          topLeft: 'Stage',
          topRight: 'Source',
          symbol: 'X',
          name: 'Example',
          bottomLeft: 'Use',
          bottomRight: 'Cost',
        },
        style: {
          backgroundColor: '#101010',
          textColor: '#ffffff',
          borderColor: '#d7b46a',
          borderVisible: true,
          backgroundImageUrl: '',
        },
        selected: false,
      },
    ],
  };
}

function stubMatchMedia(matches = false): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' && matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(() => false),
    })),
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

beforeEach(() => {
  stubMatchMedia();
  loadDocumentMock.mockResolvedValue(createTestPeriodicTableDocument());
});

describe('PeriodicTableCreatorCaseStudies', () => {
  it.each(['en', 'zh'] as const)('renders the confirmed 4/5/3 groups for %s', (locale) => {
    const copy = getPeriodicTableCaseStudiesCopy(locale);
    render(<PeriodicTableCreatorCaseStudies locale={locale} />);

    const section = document.getElementById('periodic-table-creator-case-studies');
    if (!(section instanceof HTMLElement)) {
      throw new Error(`Missing periodic table case studies section for ${JSON.stringify(locale)}.`);
    }

    expect(screen.getByRole('heading', { level: 2, name: copy.title })).toBeTruthy();
    const groups = Array.from(section.querySelectorAll<HTMLElement>('[data-periodic-table-case-group]'));
    expect(groups).toHaveLength(3);
    expect(groups.map((group) => group.querySelectorAll('[data-index]').length)).toEqual([4, 5, 3]);
    expect(groups.map((group) => group.dataset.imagePosition)).toEqual(['left', 'right', 'left']);

    copy.groups.forEach((caseGroup, groupIndex) => {
      const group = groups[groupIndex];
      if (!group) {
        throw new Error(`Missing periodic table case group at index ${groupIndex}.`);
      }

      const carousel = within(group).getByRole('region', {
        name: `${caseGroup.title} — ${copy.useCase}`,
      });
      expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');
      expect(within(carousel).getByText(caseGroup.title)).toBeTruthy();
      expect(within(carousel).getByRole('button', {
        name: `${copy.previousLabel} — ${caseGroup.title}`,
      })).toBeTruthy();
      expect(within(carousel).getByRole('button', {
        name: `${copy.nextLabel} — ${caseGroup.title}`,
      })).toBeTruthy();
      expect(within(carousel).getByRole('link', {
        name: `${caseGroup.examples[0]?.name}: ${copy.downloadTemplate}`,
      })).toBeTruthy();
      expect(carousel.querySelector('[data-case-preview-active]')).toBeTruthy();
      expect(carousel.querySelector('[data-case-preview-active]')?.getAttribute('style')).toContain(
        'pointer-events: none',
      );
      expect(carousel.querySelector('img')?.getAttribute('data-image-fit')).toBe('contain');
    });
  });

  it('keeps each row independent and maps the active image, copy, and actions to one case', () => {
    const copy = getPeriodicTableCaseStudiesCopy('en');
    render(<PeriodicTableCreatorCaseStudies locale="en" />);

    const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-periodic-table-case-group]'));
    const firstCarousel = within(groups[0] as HTMLElement).getByRole('region');
    const secondCarousel = within(groups[1] as HTMLElement).getByRole('region');

    expect(firstCarousel.dataset.periodicTableCaseId).toBe('elemental-schools');
    expect(secondCarousel.dataset.periodicTableCaseId).toBe('forge-metals');

    fireEvent.keyDown(firstCarousel, { key: 'ArrowRight' });

    expect(firstCarousel.dataset.periodicTableCaseId).toBe('arcane-crystals');
    expect(secondCarousel.dataset.periodicTableCaseId).toBe('forge-metals');

    const firstGroup = groups[0] as HTMLElement;
    expect(within(firstGroup).getByRole('heading', { level: 3, name: 'Arcane Crystals' })).toBeTruthy();
    expect(within(firstGroup).getByRole('button', {
      name: `Arcane Crystals: ${copy.useCase}`,
    })).toBeTruthy();
    expect(firstGroup.querySelector('[data-case-preview-active="arcane-crystals"]')).toBeTruthy();
    expect(firstGroup.querySelector('[data-case-preview-active="elemental-schools"]')).toBeNull();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(firstCarousel.dataset.periodicTableCaseId).toBe('arcane-crystals');
    expect(secondCarousel.dataset.periodicTableCaseId).toBe('forge-metals');
  });

  it('loads the active case through the provider and exposes its TXT template link', async () => {
    const copy = getPeriodicTableCaseStudiesCopy('zh');
    render(<PeriodicTableCreatorCaseStudies locale="zh" />);

    const firstGroup = document.querySelector('[data-periodic-table-case-group="magic"]');
    if (!(firstGroup instanceof HTMLElement)) {
      throw new Error('Missing magic case group.');
    }

    fireEvent.click(within(firstGroup).getByRole('button', {
      name: `元素学派表: ${copy.useCase}`,
    }));

    await waitFor(() => expect(requestTableMock).toHaveBeenCalledTimes(1));
    expect(requestTableMock).toHaveBeenCalledWith(
      createTestPeriodicTableDocument(),
      '已加载：元素学派表',
    );
    expect(within(firstGroup).getByRole('link', {
      name: `元素学派表: ${copy.downloadTemplate}`,
    }).getAttribute('href')).toBe('/periodic-table-creator/cases/elemental-schools.txt');
    expect(within(firstGroup).getByRole('link', {
      name: `元素学派表: ${copy.downloadTemplate}`,
    }).hasAttribute('download')).toBe(true);
  });

  it('locks all use buttons while loading and makes loader errors visible', async () => {
    let resolveDocument: ((document: PeriodicTableDocument) => void) | undefined;
    loadDocumentMock.mockImplementationOnce(
      () => new Promise<PeriodicTableDocument>((resolve) => {
        resolveDocument = resolve;
      }),
    );

    render(<PeriodicTableCreatorCaseStudies locale="en" />);
    const useButtons = screen.getAllByRole('button', { name: /Use this case$/u });
    expect(useButtons).toHaveLength(3);

    fireEvent.click(useButtons[0] as HTMLElement);
    expect(useButtons.every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
    expect(screen.getByText('Loading case…')).toBeTruthy();

    resolveDocument?.(createTestPeriodicTableDocument());
    await waitFor(() => expect(requestTableMock).toHaveBeenCalledTimes(1));
    expect(useButtons.every((button) => (button as HTMLButtonElement).disabled)).toBe(false);

    loadDocumentMock.mockRejectedValueOnce(new Error('HTTP 503 Service Unavailable'));
    fireEvent.click(useButtons[0] as HTMLElement);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('HTTP 503 Service Unavailable'));

    const magicGroup = document.querySelector('[data-periodic-table-case-group="magic"]');
    if (!(magicGroup instanceof HTMLElement)) {
      throw new Error('Missing magic case group after loader failure.');
    }

    fireEvent.click(within(magicGroup).getByRole('button', { name: /Next case — Magic systems$/u }));
    expect(within(magicGroup).queryByRole('alert')).toBeNull();
  });

  it('pauses the loading group autoplay until its case request settles', () => {
    vi.useFakeTimers();
    loadDocumentMock.mockImplementationOnce(
      () => new Promise<PeriodicTableDocument>(() => undefined),
    );

    render(<PeriodicTableCreatorCaseStudies locale="en" />);
    const magicGroup = document.querySelector('[data-periodic-table-case-group="magic"]');
    if (!(magicGroup instanceof HTMLElement)) {
      throw new Error('Missing magic case group for loading autoplay test.');
    }

    const magicCarousel = within(magicGroup).getByRole('region');
    fireEvent.click(within(magicGroup).getByRole('button', { name: /Use this case$/u }));
    vi.advanceTimersByTime(6000);

    expect(magicCarousel.dataset.periodicTableCaseId).toBe('elemental-schools');
  });

  it('does not autoplay or blur quote segments when reduced motion is enabled', () => {
    vi.useFakeTimers();
    stubMatchMedia(true);
    render(<PeriodicTableCreatorCaseStudies locale="zh" />);
    const firstGroup = document.querySelector('[data-periodic-table-case-group="magic"]');
    if (!(firstGroup instanceof HTMLElement)) {
      throw new Error('Missing magic case group for reduced-motion test.');
    }

    vi.advanceTimersByTime(6000);
    expect(firstGroup.dataset.imagePosition).toBe('left');
    expect(firstGroup.querySelector('[data-periodic-table-case-id="elemental-schools"] [data-case-preview-active]')).toBeTruthy();
    expect(firstGroup.querySelectorAll('[data-part="periodic-table-case-quote"] span')).not.toHaveLength(0);
  });
});
