// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ArmyBackgroundGalleryExplorer } from '@/components/army-formation/ArmyBackgroundGalleryExplorer';
import { armyBackgroundGalleryMaps } from '@/lib/army-background-gallery-data';

afterEach(cleanup);

const locales = [
  {
    locale: 'zh',
    download: '下载预览图',
    preview: '预览地图',
    source: '查看来源',
    close: '关闭地图预览',
    search: '搜索地图名称或描述',
    pageTwo: '第 2',
  },
  {
    locale: 'en',
    download: 'Download preview',
    preview: 'Preview map',
    source: 'View source',
    close: 'Close map preview',
    search: 'Search map titles or descriptions',
    pageTwo: 'Page 2',
  },
] as const;

function verifyVisibleCardDownloads(downloadLabel: string) {
  const cards = [...document.querySelectorAll('article')];
  expect(cards).toHaveLength(12);

  for (const card of cards) {
    const image = within(card).getByRole('img');
    const map = armyBackgroundGalleryMaps.find(
      (candidate) => candidate.previewSrc === image.getAttribute('src'),
    );
    if (!map) throw new Error(`No gallery map matches image src: ${image.getAttribute('src')}`);

    const download = within(card).getByRole('link', {
      name: `${downloadLabel}: ${map.title}`,
    });
    expect(download.getAttribute('href')).toBe(map.previewSrc);
    expect(download.getAttribute('download')).toBe(`${map.id}.webp`);
    expect(download.closest('button')).toBeNull();
  }
}

function clickDownloadLink(link: HTMLElement) {
  // jsdom cannot perform a native download; browser acceptance covers the event.
  link.addEventListener('click', (event) => event.preventDefault(), { once: true });
  fireEvent.click(link);
}

describe.each(locales)('ArmyBackgroundGalleryExplorer ($locale)', (copy) => {
  it('binds every card download to its displayed map without opening a preview', () => {
    render(<ArmyBackgroundGalleryExplorer locale={copy.locale} />);
    verifyVisibleCardDownloads(copy.download);

    clickDownloadLink(screen.getAllByRole('link', { name: new RegExp(copy.download) })[0]);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getAllByRole('link', { name: copy.source })).toHaveLength(12);
  });

  it('downloads the selected preview map and preserves source and close actions', () => {
    render(<ArmyBackgroundGalleryExplorer locale={copy.locale} />);
    const previewButton = screen.getAllByRole('button', { name: new RegExp(`^${copy.preview}:`) })[1];
    const image = within(previewButton).getByRole('img');
    const map = armyBackgroundGalleryMaps.find(
      (candidate) => candidate.previewSrc === image.getAttribute('src'),
    );
    if (!map) throw new Error(`No gallery map matches image src: ${image.getAttribute('src')}`);

    fireEvent.click(previewButton);
    const dialog = screen.getByRole('dialog', { name: map.title });
    const download = within(dialog).getByRole('link', {
      name: `${copy.download}: ${map.title}`,
    });
    expect(download.getAttribute('href')).toBe(map.previewSrc);
    expect(download.getAttribute('download')).toBe(`${map.id}.webp`);
    expect(within(dialog).getByRole('link', { name: copy.source }).getAttribute('href')).toBe(map.sourcePage);
    clickDownloadLink(download);
    expect(screen.getByRole('dialog', { name: map.title })).toBe(dialog);

    fireEvent.click(within(dialog).getByRole('button', { name: copy.close }));
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(previewButton);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps searched card downloads bound to the matching map', () => {
    render(<ArmyBackgroundGalleryExplorer locale={copy.locale} />);
    fireEvent.change(screen.getByRole('searchbox', { name: copy.search }), {
      target: { value: 'hollowshore cairn' },
    });

    const download = screen.getByRole('link', { name: `${copy.download}: Hollowshore Cairn` });
    expect(download.getAttribute('href')).toBe('/army-background-gallery/previews/dyson-001.webp');
    expect(download.getAttribute('download')).toBe('dyson-001.webp');
    clickDownloadLink(download);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps page two downloads bound to the newly displayed maps', () => {
    render(<ArmyBackgroundGalleryExplorer locale={copy.locale} />);
    const firstPageHref = screen.getAllByRole('link', { name: new RegExp(copy.download) })[0].getAttribute('href');
    const pageTwo = screen.getByRole('button', { name: copy.pageTwo });
    fireEvent.click(pageTwo);

    expect(pageTwo.getAttribute('aria-current')).toBe('page');
    expect(screen.getAllByRole('link', { name: new RegExp(copy.download) })[0].getAttribute('href')).not.toBe(firstPageHref);
    verifyVisibleCardDownloads(copy.download);
  });
});
