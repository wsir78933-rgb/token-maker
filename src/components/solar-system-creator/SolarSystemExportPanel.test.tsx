// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getSolarSystemCopy } from '@/lib/solar-system-creator/copy';

import { SolarSystemExportPanel } from './SolarSystemExportPanel';

afterEach(cleanup);

describe('SolarSystemExportPanel', () => {
  it.each(['en', 'zh'] as const)('renders random export copy and callbacks in %s', (locale) => {
    const copy = getSolarSystemCopy(locale);
    const onGenerateImage = vi.fn();
    const onPrint = vi.fn();

    render(
      <SolarSystemExportPanel
        copy={copy}
        mode="random"
        onGenerateImage={onGenerateImage}
        onPrint={onPrint}
      />,
    );

    expect(screen.getByRole('heading', { name: copy.exportTitle })).toBeDefined();
    expect(screen.getByText(copy.randomImageExcludesDetails)).toBeDefined();
    expect(screen.getByText(copy.randomPrintIncludesDetails)).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: copy.imageGenerate }));
    fireEvent.click(screen.getByRole('button', { name: copy.print }));

    expect(onGenerateImage).toHaveBeenCalledExactlyOnceWith();
    expect(onPrint).toHaveBeenCalledExactlyOnceWith();
  });

  it('disables both random export actions while busy', () => {
    const copy = getSolarSystemCopy('en');
    const onGenerateImage = vi.fn();
    const onPrint = vi.fn();

    render(
      <SolarSystemExportPanel
        copy={copy}
        mode="random"
        onGenerateImage={onGenerateImage}
        onPrint={onPrint}
        busy
      />,
    );

    const imageButton = screen.getByRole('button', { name: copy.generatingStatus }) as HTMLButtonElement;
    const printButton = screen.getByRole('button', { name: copy.print }) as HTMLButtonElement;
    const exportHeading = screen.getByRole('heading', { name: copy.exportTitle });
    const exportPanel = exportHeading.closest('section');

    expect(imageButton.disabled).toBe(true);
    expect(printButton.disabled).toBe(true);
    expect(exportPanel?.getAttribute('aria-busy')).toBe('true');

    fireEvent.click(imageButton);
    fireEvent.click(printButton);

    expect(onGenerateImage).not.toHaveBeenCalled();
    expect(onPrint).not.toHaveBeenCalled();
  });

  it('keeps manual export descriptions and callbacks', () => {
    const copy = getSolarSystemCopy('zh');
    const onGenerateImage = vi.fn();
    const onPrint = vi.fn();

    render(
      <SolarSystemExportPanel
        copy={copy}
        mode="manual"
        onGenerateImage={onGenerateImage}
        onPrint={onPrint}
      />,
    );

    expect(screen.getByText(copy.imageExcludesDescription)).toBeDefined();
    expect(screen.getByText(copy.printIncludesDescriptions)).toBeDefined();
    expect(screen.queryByText(copy.randomImageExcludesDetails)).toBeNull();
    expect(screen.queryByText(copy.randomPrintIncludesDetails)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: copy.imageGenerate }));
    fireEvent.click(screen.getByRole('button', { name: copy.print }));

    expect(onGenerateImage).toHaveBeenCalledExactlyOnceWith();
    expect(onPrint).toHaveBeenCalledExactlyOnceWith();
  });
});
