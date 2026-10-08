// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import { createDefaultScrollProject } from '@/lib/scroll-creator/project';

import { ScrollSettingsPanel } from './ScrollSettingsPanel';

afterEach(cleanup);

function renderPanel(overrides: Partial<ComponentProps<typeof ScrollSettingsPanel>> = {}) {
  const project = overrides.project ?? createDefaultScrollProject();
  const copy = overrides.copy ?? getScrollCreatorCopy('en');
  const handlers = {
    onPaperChoice: vi.fn(),
    onPaperResizingChange: vi.fn(),
    onPaperSizeChange: vi.fn(),
    onPaperSizeReset: vi.fn(),
    onTextStyleChange: vi.fn(),
    onImageVisibilityChange: vi.fn(),
    onImageDraggingChange: vi.fn(),
    onImageResizingChange: vi.fn(),
    onAddImage: vi.fn(async () => undefined),
    onDeleteSelectedImages: vi.fn(),
    onAddFont: vi.fn(async () => undefined),
  };

  const panelProps: ComponentProps<typeof ScrollSettingsPanel> = {
    project,
    copy,
    activeTab: 'paper',
    paperResizing: false,
    imagesVisible: true,
    imagesDraggable: true,
    imagesResizable: true,
    selectedImageIds: [],
    imagePending: false,
    fontPending: false,
    ...handlers,
    ...overrides,
  };
  const rendered = render(
    <ScrollSettingsPanel
      {...panelProps}
    />,
  );

  return {
    copy,
    handlers,
    rerenderProject: (nextProject: typeof project) => {
      rendered.rerender(<ScrollSettingsPanel {...panelProps} project={nextProject} />);
    },
  };
}

describe('ScrollSettingsPanel', () => {
  it.each(['en', 'zh'] as const)('renders all 15 competitor paper choices in a 3-column grid for %s', (locale) => {
    const copy = getScrollCreatorCopy(locale);
    renderPanel({ copy });

    expect(screen.getAllByRole('button', { name: new RegExp(`^${copy.paperChoice}`) })).toHaveLength(15);
    expect(document.querySelectorAll('[data-scroll-paper-id]')).toHaveLength(15);
  });

  it.each(['en', 'zh'] as const)('keeps the paper panel as the visible natural-height panel for %s', (locale) => {
    const copy = getScrollCreatorCopy(locale);
    renderPanel({ copy, activeTab: 'paper' });

    const paperPanel = document.querySelector('[data-scroll-settings-panel="paper"]');
    expect(paperPanel?.getAttribute('aria-hidden')).toBe('false');
    expect(paperPanel?.hasAttribute('inert')).toBe(false);
    expect(document.querySelector('[data-scroll-settings-panel="text"]')).toBeNull();
    expect(document.querySelector('[data-scroll-settings-panel="images"]')).toBeNull();
  });

  it.each(['text', 'images'] as const)('hides the paper panel from keyboard and accessibility tree while %s is active', (activeTab) => {
    renderPanel({ activeTab });

    const paperPanel = document.querySelector('[data-scroll-settings-panel="paper"]');
    expect(paperPanel?.getAttribute('aria-hidden')).toBe('true');
    expect(paperPanel?.hasAttribute('inert')).toBe(true);
    expect(document.querySelector(`[data-scroll-settings-panel="${activeTab}"]`)).toBeTruthy();
    expect(document.querySelector(`[data-scroll-settings-panel="${activeTab === 'text' ? 'images' : 'text'}"]`)).toBeNull();
  });

  it.each(['en', 'zh'] as const)('shows a paper-size reset action in %s even when resizing is disabled', (locale) => {
    const copy = getScrollCreatorCopy(locale);
    const { handlers } = renderPanel({ copy });

    const resetButton = screen.getByRole('button', { name: copy.paperSizeReset });
    expect(resetButton).toBeTruthy();
    fireEvent.click(resetButton);
    expect(handlers.onPaperSizeReset).toHaveBeenCalledTimes(1);
  });

  it('shows editable width and height fields only while paper resizing is enabled and commits valid values on Enter', () => {
    const { copy, handlers } = renderPanel({ paperResizing: true });
    const widthInput = screen.getByLabelText(copy.paperWidth) as HTMLInputElement;
    const heightInput = screen.getByLabelText(copy.paperHeight) as HTMLInputElement;

    expect(widthInput.value).toBe('600');
    expect(heightInput.value).toBe('865');
    fireEvent.change(widthInput, { target: { value: '720' } });
    fireEvent.keyDown(widthInput, { key: 'Enter' });

    expect(handlers.onPaperSizeChange).toHaveBeenCalledWith(720, 865);
  });

  it('keeps the height field mounted when a controlled width update succeeds', () => {
    const initialProject = createDefaultScrollProject();
    const { copy, handlers, rerenderProject } = renderPanel({ project: initialProject, paperResizing: true });
    const heightInput = screen.getByLabelText(copy.paperHeight);
    const widthInput = screen.getByLabelText(copy.paperWidth) as HTMLInputElement;

    widthInput.focus();
    fireEvent.change(widthInput, { target: { value: '720' } });
    fireEvent.keyDown(widthInput, { key: 'Enter' });
    rerenderProject({ ...initialProject, width: 720 });

    expect(screen.getByLabelText(copy.paperWidth)).toBe(widthInput);
    expect(document.activeElement).toBe(widthInput);
    expect(screen.getByLabelText(copy.paperHeight)).toBe(heightInput);
    fireEvent.change(screen.getByLabelText(copy.paperHeight), { target: { value: '1020' } });
    fireEvent.keyDown(screen.getByLabelText(copy.paperHeight), { key: 'Enter' });
    expect(handlers.onPaperSizeChange).toHaveBeenLastCalledWith(720, 1020);
  });

  it.each(['', '99', '2401'] as const)('keeps an invalid paper width draft %j and reports the actual value', (invalidValue) => {
    const { copy, handlers } = renderPanel({ paperResizing: true });
    const widthInput = screen.getByLabelText(copy.paperWidth) as HTMLInputElement;

    fireEvent.change(widthInput, { target: { value: invalidValue } });
    fireEvent.blur(widthInput);

    expect(widthInput.value).toBe(invalidValue);
    expect(handlers.onPaperSizeChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain(JSON.stringify(invalidValue));
  });

  it('synchronizes width and height drafts after an external project size change', () => {
    const { copy, rerenderProject } = renderPanel({ paperResizing: true });
    const draftWidthInput = screen.getByLabelText(copy.paperWidth) as HTMLInputElement;
    fireEvent.change(draftWidthInput, { target: { value: '999' } });

    const updatedProject = {
      ...createDefaultScrollProject(),
      width: 740,
      height: 1020,
    };
    rerenderProject(updatedProject);

    expect((screen.getByLabelText(copy.paperWidth) as HTMLInputElement).value).toBe('740');
    expect((screen.getByLabelText(copy.paperHeight) as HTMLInputElement).value).toBe('1020');
  });

  it('keeps the width draft synchronized when a controlled size changes out and back', () => {
    const initialProject = createDefaultScrollProject();
    const { copy, rerenderProject } = renderPanel({ project: initialProject, paperResizing: true });
    const widthInput = screen.getByLabelText(copy.paperWidth) as HTMLInputElement;

    fireEvent.change(widthInput, { target: { value: '800' } });
    fireEvent.keyDown(widthInput, { key: 'Enter' });
    rerenderProject({ ...initialProject, width: 800 });
    expect(widthInput.value).toBe('800');

    rerenderProject(initialProject);
    expect(widthInput.value).toBe('600');
  });

  it('clears an invalid draft when an external size changes and later returns to the old value', () => {
    const initialProject = createDefaultScrollProject();
    const { copy, rerenderProject } = renderPanel({ project: initialProject, paperResizing: true });
    const widthInput = screen.getByLabelText(copy.paperWidth) as HTMLInputElement;

    fireEvent.change(widthInput, { target: { value: '99' } });
    expect(widthInput.value).toBe('99');
    rerenderProject({ ...initialProject, width: 800 });
    expect(widthInput.value).toBe('800');

    rerenderProject(initialProject);
    expect(widthInput.value).toBe('600');
  });

  it('keeps the font-size draft editable while rejecting an invalid value with the actual input', () => {
    const { copy, handlers } = renderPanel({ activeTab: 'text' });
    const fontSizeInput = screen.getByLabelText(copy.fontSize) as HTMLInputElement;

    fireEvent.change(fontSizeInput, { target: { value: '3' } });

    expect(fontSizeInput.value).toBe('3');
    expect(handlers.onTextStyleChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain(JSON.stringify('3'));

    fireEvent.change(fontSizeInput, { target: { value: '28' } });
    expect(handlers.onTextStyleChange).toHaveBeenCalledWith({ fontSize: 28 });
  });

  it('keeps the font-size input focused while a valid controlled value changes and returns', () => {
    const initialProject = createDefaultScrollProject();
    const { copy, rerenderProject } = renderPanel({ project: initialProject, activeTab: 'text' });
    const fontSizeInput = screen.getByLabelText(copy.fontSize) as HTMLInputElement;

    fontSizeInput.focus();
    fireEvent.change(fontSizeInput, { target: { value: '10' } });
    rerenderProject({
      ...initialProject,
      textStyle: { ...initialProject.textStyle, fontSize: 10 },
    });

    expect(screen.getByLabelText(copy.fontSize)).toBe(fontSizeInput);
    expect(document.activeElement).toBe(fontSizeInput);
    expect(fontSizeInput.value).toBe('10');

    rerenderProject(initialProject);
    expect(fontSizeInput.value).toBe('20');
  });

  it('does not revive an invalid font-size draft after an external value round trip', () => {
    const initialProject = createDefaultScrollProject();
    const { copy, rerenderProject } = renderPanel({ project: initialProject, activeTab: 'text' });
    const fontSizeInput = screen.getByLabelText(copy.fontSize) as HTMLInputElement;

    fireEvent.change(fontSizeInput, { target: { value: '3' } });
    expect(fontSizeInput.value).toBe('3');
    rerenderProject({
      ...initialProject,
      textStyle: { ...initialProject.textStyle, fontSize: 10 },
    });
    expect(fontSizeInput.value).toBe('10');

    rerenderProject(initialProject);
    expect(fontSizeInput.value).toBe('20');
  });

  it('applies text toggles and exposes the Google Fonts hint inside advanced controls', () => {
    const { copy, handlers } = renderPanel({ activeTab: 'text' });

    expect(screen.getByRole('group', { name: `${copy.bold} / ${copy.italic}` })).toBeTruthy();
    expect(screen.getByRole('group', {
      name: `${copy.alignLeft} / ${copy.alignCenter} / ${copy.alignRight}`,
    })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: new RegExp(copy.bold) }));
    fireEvent.click(screen.getByRole('button', { name: new RegExp(copy.alignCenter) }));

    expect(handlers.onTextStyleChange).toHaveBeenNthCalledWith(1, { bold: true });
    expect(handlers.onTextStyleChange).toHaveBeenNthCalledWith(2, { align: 'center' });

    fireEvent.click(screen.getByText(copy.advancedFonts));
    expect(screen.getByText(copy.fontHint)).toBeTruthy();
    const fontHintLink = screen.getByRole('link', { name: copy.googleFontsLink });
    expect(fontHintLink.getAttribute('href')).toBe('https://fonts.google.com/');
  });

  it('adds an image URL, toggles image controls, and deletes the current selection', async () => {
    const { copy, handlers } = renderPanel({ activeTab: 'images', selectedImageIds: ['image-a'] });
    const imageUrlInput = screen.getByLabelText(copy.imageUrl);

    fireEvent.change(imageUrlInput, { target: { value: 'https://example.com/map.png' } });
    fireEvent.click(screen.getByRole('button', { name: copy.addImage }));
    expect(handlers.onAddImage).toHaveBeenCalledWith('https://example.com/map.png');

    fireEvent.click(screen.getByLabelText(copy.showImages));
    fireEvent.click(screen.getByLabelText(copy.dragImages));
    fireEvent.click(screen.getByLabelText(copy.resizeImages));
    expect(handlers.onImageVisibilityChange).toHaveBeenCalledWith(false);
    expect(handlers.onImageDraggingChange).toHaveBeenCalledWith(false);
    expect(handlers.onImageResizingChange).toHaveBeenCalledWith(false);

    fireEvent.click(screen.getByRole('button', { name: copy.deleteSelected }));
    expect(handlers.onDeleteSelectedImages).toHaveBeenCalledTimes(1);
  });

  it('rejects an empty image URL before the callback and includes the offending value', () => {
    const { copy, handlers } = renderPanel({ activeTab: 'images' });

    fireEvent.click(screen.getByRole('button', { name: copy.addImage }));

    expect(handlers.onAddImage).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain(JSON.stringify(''));
  });

  it('passes a custom Google Font source and family to the async callback', () => {
    const { copy, handlers } = renderPanel({ activeTab: 'text' });
    fireEvent.click(screen.getByText(copy.advancedFonts));
    fireEvent.change(screen.getByLabelText(copy.fontSource), {
      target: { value: 'https://fonts.googleapis.com/css2?family=UnifrakturCook' },
    });
    fireEvent.change(screen.getByLabelText(copy.fontName), { target: { value: 'Unifraktur Cook' } });
    fireEvent.click(screen.getByRole('button', { name: copy.addFont }));

    expect(handlers.onAddFont).toHaveBeenCalledWith(
      'https://fonts.googleapis.com/css2?family=UnifrakturCook',
      'Unifraktur Cook',
    );
  });
});
