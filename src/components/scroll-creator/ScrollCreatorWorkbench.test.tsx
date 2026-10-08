// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import { getScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import type { ScrollProject, ScrollTextStyle } from '@/lib/scroll-creator/types';
import * as scrollFontLoading from '@/lib/scroll-creator/fonts';
import * as scrollImageLoading from '@/lib/scroll-creator/image-loading';

import { ScrollCreatorWorkbench } from './ScrollCreatorWorkbench';

type CanvasStubProps = {
  project: ScrollProject;
  onTextChange: (text: string) => void;
  onTextOverflowChange: (hasOverflow: boolean) => void;
};

type SettingsStubProps = {
  onPaperChoice: (paperId: string) => void;
  onPaperSizeChange: (width: number, height: number) => void;
  onPaperSizeReset: () => void;
  onTextStyleChange: (patch: Partial<ScrollTextStyle>) => void;
  onAddImage: (url: string) => Promise<void>;
  onAddFont: (source: string, family: string) => Promise<void>;
};

type SaveDialogStubProps = {
  open: boolean;
  onSave: (slot: number) => void;
  onLoad: (slot: number) => void;
};

vi.mock('@/components/scroll-creator/ScrollCanvas', () => ({
  ScrollCanvas: ({ project, onTextChange, onTextOverflowChange }: CanvasStubProps) => (
    <section aria-label="canvas stub">
      <output data-testid="project-text">{project.text}</output>
      <output data-testid="project-images">{project.images.length}</output>
      <output data-testid="project-state">{JSON.stringify(project)}</output>
      <button type="button" onClick={() => onTextChange('new message')}>
        type message
      </button>
      <button type="button" onClick={() => onTextOverflowChange(true)}>
        report text overflow
      </button>
      <button type="button" onClick={() => onTextOverflowChange(false)}>
        clear text overflow
      </button>
    </section>
  ),
}));

function SettingsStub({
  onPaperChoice,
  onPaperSizeChange,
  onPaperSizeReset,
  onTextStyleChange,
  onAddImage,
  onAddFont,
}: SettingsStubProps) {
  const [operationResult, setOperationResult] = useState('');

  function startImageLoad(): void {
    void onAddImage('https://example.com/image.png')
      .then(() => setOperationResult('image complete'))
      .catch(() => setOperationResult('image rejected'));
  }

  function startFontLoad(): void {
    void onAddFont('https://fonts.googleapis.com/css2?family=Cinzel', 'Cinzel')
      .then(() => setOperationResult('font complete'))
      .catch(() => setOperationResult('font rejected'));
  }

  return (
    <section aria-label="settings stub">
      <button type="button" onClick={() => onPaperChoice('paper05')}>
        choose paper
      </button>
      <button type="button" onClick={() => onTextStyleChange({
        fontFamily: 'Cinzel',
        fontSize: 32,
        color: '#123456',
        bold: true,
        italic: true,
        align: 'center',
      })}>
        style text
      </button>
      <button type="button" onClick={() => onPaperSizeChange(910, 1200)}>
        resize paper
      </button>
      <button type="button" onClick={onPaperSizeReset}>
        reset paper
      </button>
      <button type="button" onClick={startImageLoad}>
        add image
      </button>
      <button type="button" onClick={startImageLoad}>
        repeat image
      </button>
      <button type="button" onClick={startFontLoad}>
        add font
      </button>
      <button type="button" onClick={startFontLoad}>
        repeat font
      </button>
      <output data-testid="operation-result">{operationResult}</output>
    </section>
  );
}

vi.mock('@/components/scroll-creator/ScrollSettingsPanel', () => ({
  ScrollSettingsPanel: SettingsStub,
}));

vi.mock('@/components/scroll-creator/ScrollSaveDialog', () => ({
  ScrollSaveDialog: ({ open, onSave, onLoad }: SaveDialogStubProps) =>
    open ? (
      <div role="dialog" aria-label="save dialog stub">
        <button type="button" onClick={() => onSave(1)}>
          save slot
        </button>
        <button type="button" onClick={() => onLoad(1)}>
          load slot
        </button>
      </div>
    ) : null,
}));

vi.mock('@/components/scroll-creator/ScrollHelpDialog', () => ({
  ScrollHelpDialog: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div role="dialog" aria-label="help dialog stub">
        <button type="button" onClick={onClose}>
          close help
        </button>
      </div>
    ) : null,
}));

vi.mock('@/lib/scroll-creator/image-loading', () => ({
  requireScrollImageUrl: (url: string) => url,
  loadScrollImage: vi.fn(async () => ({ width: 120, height: 80 })),
}));

vi.mock('@/lib/scroll-creator/fonts', () => ({
  requireScrollFont: (stylesheetUrl: string, family: string) => ({ family, stylesheetUrl }),
  loadScrollFont: vi.fn(async () => undefined),
}));

type DeferredValue<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

function createDeferredValue<T>(): DeferredValue<T> {
  let resolvePromise: ((value: T) => void) | undefined;
  const promise = new Promise<T>((resolve) => {
    resolvePromise = resolve;
  });
  if (resolvePromise === undefined) {
    throw new Error('Deferred promise resolver was not initialized.');
  }
  return { promise, resolve: resolvePromise };
}

function renderWorkbench(locale: 'en' | 'zh' = 'en') {
  const copy: ScrollCreatorCopy = getScrollCreatorCopy(locale);
  return render(<ScrollCreatorWorkbench locale={locale} copy={copy} />);
}

describe('ScrollCreatorWorkbench', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.stubGlobal('print', vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders the bilingual toolbar and switches the active mobile panel tab', () => {
    renderWorkbench('zh');

    expect(screen.getByRole('button', { name: '保存' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '加载' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '打印' })).toBeTruthy();
    const textTabs = screen.getAllByRole('tab', { name: '文字' });
    expect(textTabs).toHaveLength(1);
    fireEvent.click(textTabs[0]);
    expect(textTabs[0].getAttribute('aria-selected')).toBe('true');
  });

  it('provides roving desktop tab focus with arrow, Home, and End keys', () => {
    renderWorkbench();

    const tabList = screen.getByRole('tablist', { name: 'Scroll Creator' });
    const tabs = screen.getAllByRole('tab');
    expect(tabList).toBeTruthy();
    expect(tabs[0].getAttribute('aria-controls')).toBeTruthy();
    expect(tabs[0].getAttribute('tabindex')).toBe('0');
    expect(tabs[1].getAttribute('tabindex')).toBe('-1');

    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(tabs[1], { key: 'End' });
    expect(document.activeElement).toBe(tabs[2]);
    fireEvent.keyDown(tabs[2], { key: 'Home' });
    expect(document.activeElement).toBe(tabs[0]);
  });

  it('keeps direct preview edits in the project state', () => {
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'type message' }));

    expect(screen.getByTestId('project-text').textContent).toBe('new message');
  });

  it('blocks printing while Canvas reports overflow and restores printing after it clears', () => {
    const printSpy = vi.fn();
    vi.stubGlobal('print', printSpy);
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'report text overflow' }));
    expect(screen.getByText(getScrollCreatorCopy('en').textOverflowWarning)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Print' }));
    expect(printSpy).not.toHaveBeenCalled();
    expect(document.body.classList.contains('scrollCreatorPrintActive')).toBe(false);
    expect(screen.getByRole('alert').textContent).toContain(getScrollCreatorCopy('en').printOverflowBlocked);

    fireEvent.click(screen.getByRole('button', { name: 'clear text overflow' }));
    expect(screen.queryByText(getScrollCreatorCopy('en').textOverflowWarning)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Print' }));
    expect(printSpy).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new Event('afterprint'));
  });

  it('adds a loaded image without losing the current text', async () => {
    renderWorkbench();
    fireEvent.click(screen.getByRole('button', { name: 'type message' }));
    fireEvent.click(screen.getByRole('button', { name: 'add image' }));

    await waitFor(() => expect(screen.getByTestId('project-images').textContent).toBe('1'));
    expect(screen.getByTestId('project-text').textContent).toBe('new message');
  });

  it('resets paper dimensions while preserving the rest of a customized project', async () => {
    renderWorkbench();
    fireEvent.click(screen.getByRole('button', { name: 'type message' }));
    fireEvent.click(screen.getByRole('button', { name: 'choose paper' }));
    fireEvent.click(screen.getByRole('button', { name: 'add font' }));
    await waitFor(() => expect(screen.getByTestId('operation-result').textContent).toBe('font complete'));
    fireEvent.click(screen.getByRole('button', { name: 'style text' }));
    fireEvent.click(screen.getByRole('button', { name: 'add image' }));
    await waitFor(() => expect(screen.getByTestId('project-images').textContent).toBe('1'));

    fireEvent.click(screen.getByRole('button', { name: 'resize paper' }));
    let customizedProject = JSON.parse(screen.getByTestId('project-state').textContent ?? '') as ScrollProject;
    expect(customizedProject.width).toBe(910);
    expect(customizedProject.height).toBe(1200);

    fireEvent.click(screen.getByRole('button', { name: 'reset paper' }));
    customizedProject = JSON.parse(screen.getByTestId('project-state').textContent ?? '') as ScrollProject;

    expect(customizedProject.width).toBe(600);
    expect(customizedProject.height).toBe(865);
    expect(customizedProject.paperId).toBe('paper05');
    expect(customizedProject.text).toBe('new message');
    expect(customizedProject.images).toHaveLength(1);
    expect(customizedProject.customFonts).toEqual([
      {
        family: 'Cinzel',
        stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Cinzel',
      },
    ]);
    expect(customizedProject.textStyle).toEqual({
      fontFamily: 'Cinzel',
      fontSize: 32,
      color: '#123456',
      bold: true,
      italic: true,
      align: 'center',
    });
  });

  it('rejects a duplicate image or font request while the first request is pending', async () => {
    const deferredImage = createDeferredValue<{ width: number; height: number }>();
    vi.mocked(scrollImageLoading.loadScrollImage).mockImplementationOnce(() => deferredImage.promise);
    renderWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'add image' }));
    fireEvent.click(screen.getByRole('button', { name: 'repeat image' }));
    await waitFor(() => expect(screen.getByTestId('operation-result').textContent).toBe('image rejected'));
    expect(screen.getByRole('alert').textContent).toContain('Something went wrong');

    deferredImage.resolve({ width: 120, height: 80 });
    await waitFor(() => expect(screen.getByTestId('project-images').textContent).toBe('1'));

    const deferredFont = createDeferredValue<void>();
    vi.mocked(scrollFontLoading.loadScrollFont).mockImplementationOnce(() => deferredFont.promise);
    fireEvent.click(screen.getByRole('button', { name: 'add font' }));
    fireEvent.click(screen.getByRole('button', { name: 'repeat font' }));
    await waitFor(() => expect(screen.getByTestId('operation-result').textContent).toBe('font rejected'));

    deferredFont.resolve();
    await waitFor(() => expect(screen.getByTestId('operation-result').textContent).toBe('font complete'));
  });

  it('saves and restores a project through a local slot', async () => {
    renderWorkbench();
    fireEvent.click(screen.getByRole('button', { name: 'type message' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'save slot' }));
    fireEvent.click(screen.getByRole('button', { name: 'type message' }));
    fireEvent.click(screen.getByRole('button', { name: 'Load' }));
    fireEvent.click(screen.getByRole('button', { name: 'load slot' }));

    await waitFor(() => expect(screen.getByTestId('project-text').textContent).toBe('new message'));
  });

  it('opens and closes help without changing the current project', () => {
    renderWorkbench();
    fireEvent.click(screen.getByRole('button', { name: 'Help' }));
    expect(screen.getByRole('dialog', { name: 'help dialog stub' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'close help' }));
    expect(screen.queryByRole('dialog', { name: 'help dialog stub' })).toBeNull();
    expect(screen.getByTestId('project-text').textContent).toBe('');
  });

  it('focuses the mobile sheet close button and restores the triggering tab on Escape', async () => {
    renderWorkbench();

    const mobileTextTab = screen
      .getAllByRole('button', { name: 'Text' })
      .find((button) => button.getAttribute('aria-pressed') !== null);
    if (!(mobileTextTab instanceof HTMLButtonElement)) {
      throw new Error('Mobile Text tab was not rendered as a button.');
    }

    fireEvent.click(mobileTextTab);
    const closePanelButton = screen.getByRole('button', { name: 'Close panel' });
    await waitFor(() => expect(document.activeElement).toBe(closePanelButton));

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(document.activeElement).toBe(mobileTextTab));
    expect(screen.getByRole('complementary').getAttribute('data-mobile-sheet-open')).toBe('false');
  });
});
