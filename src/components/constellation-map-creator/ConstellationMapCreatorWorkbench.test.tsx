// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createDefaultConstellationProject, serializeConstellationProject } from '@/lib/constellation-map-creator';
import { CONSTELLATION_MAX_FILE_BYTES } from '@/lib/constellation-map-creator/types';
import { getConstellationMapCopy } from '@/lib/constellation-map-creator/copy';

vi.mock('next/image', () => ({
  default: ({ src, alt, unoptimized, ...imageProps }: { src: string; alt: string; unoptimized?: boolean }) => {
    void unoptimized;
    // eslint-disable-next-line @next/next/no-img-element -- the test double renders a plain image element.
    return <img {...imageProps} src={src} alt={alt} />;
  },
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ open, children }: { open: boolean; children: ReactNode }) => open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children, ...props }: ComponentProps<'div'>) => <div {...props}>{children}</div>,
  DialogClose: ({ onClick, 'aria-label': ariaLabel }: { onClick?: () => void; 'aria-label'?: string }) => <button type="button" aria-label={ariaLabel} onClick={onClick}>×</button>,
  DialogDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
}));

import { ConstellationMapCreatorWorkbench } from './ConstellationMapCreatorWorkbench';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

beforeEach(() => {
  vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'constellation-test-object') });
});

describe('ConstellationMapCreatorWorkbench', () => {
  it('closes the mobile asset sheet after adding an object and leaves the object selectable', () => {
    const copy = getConstellationMapCopy('en').workspace;
    render(<ConstellationMapCreatorWorkbench locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: copy.assetsTitle }));
    const mobileSheet = screen.getByTestId('constellation-mobile-assets');
    fireEvent.click(within(mobileSheet).getByTestId('constellation-asset-image-1'));

    expect(screen.queryByTestId('constellation-mobile-assets')).toBeNull();
    expect(document.querySelector('[data-constellation-object-id="constellation-test-object"]')).toBeTruthy();
  });

  it('shows slot feedback inside the open save dialog and shows oversized file errors there', async () => {
    const copy = getConstellationMapCopy('en').workspace;
    render(<ConstellationMapCreatorWorkbench locale="en" />);

    fireEvent.click(screen.getAllByRole('button', { name: copy.filesTitle })[0]);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: `${copy.save} ${copy.slotLabel.replace('{number}', '1')}` }));
    expect(within(dialog).getByRole('status').textContent).toContain(copy.savedSlot.replace('{number}', '1'));

    const oversizedProject = new File([new Uint8Array(CONSTELLATION_MAX_FILE_BYTES + 1)], 'oversized.txt', { type: 'text/plain' });
    const fileInput = within(dialog).getByLabelText(copy.chooseProject) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [oversizedProject] } });
    fireEvent.click(within(dialog).getByRole('button', { name: copy.loadProject }));

    await waitFor(() => expect(within(dialog).getByRole('alert').textContent).toContain(String(CONSTELLATION_MAX_FILE_BYTES)));
  });

  it('rotates the selected star from the round handle while drag and resize are off', () => {
    const copy = getConstellationMapCopy('en').workspace;
    render(<ConstellationMapCreatorWorkbench locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: copy.addStar }));
    fireEvent.click(screen.getByRole('checkbox', { name: copy.dragging }));
    fireEvent.click(screen.getByRole('checkbox', { name: copy.resizing }));

    expect(screen.queryByRole('button', { name: copy.resizeLabel.replace('{number}', '1') })).toBeNull();
    const rotationHandle = screen.getByRole('button', { name: copy.rotateLabel.replace('{number}', '1') });
    fireEvent.keyDown(rotationHandle, { key: 'ArrowRight', shiftKey: true });

    const frame = document.querySelector('[data-constellation-object-frame="constellation-test-object"]');
    expect(frame?.getAttribute('data-constellation-rotation')).toBe('10');
    expect(frame?.getAttribute('transform')).toContain('rotate(10 ');
    const image = frame?.querySelector('image');
    expect(image?.getAttribute('x')).toBe('0');
    expect(image?.getAttribute('y')).toBe('0');

    cleanup();
    render(<ConstellationMapCreatorWorkbench locale="zh" />);
    const chinese = getConstellationMapCopy('zh').workspace;
    fireEvent.click(screen.getByRole('button', { name: chinese.addStar }));
    expect(screen.getByRole('button', { name: chinese.rotateLabel.replace('{number}', '1') })).toBeTruthy();
  });

  it('restores the keyboard trigger focus after closing a mobile panel', () => {
    const copy = getConstellationMapCopy('en').workspace;
    render(<ConstellationMapCreatorWorkbench locale="en" />);
    const assetsButton = screen.getByRole('button', { name: copy.assetsTitle });
    assetsButton.focus();
    fireEvent.keyDown(assetsButton, { key: 'ArrowRight' });
    const settingsSheet = screen.getByTestId('constellation-mobile-settings');
    expect(settingsSheet.id).toBe('constellation-mobile-settings');
    fireEvent.click(within(settingsSheet).getByRole('button', { name: copy.close }));
    expect(document.activeElement).toBe(assetsButton);
  });

  it.each([
    ['en', 'Delete'],
    ['en', 'Backspace'],
    ['zh', 'Delete'],
    ['zh', 'Backspace'],
  ] as const)('%s: %s removes only the selected object', (locale, key) => {
    const copy = getConstellationMapCopy(locale).workspace;
    const randomUUID = vi.fn()
      .mockReturnValueOnce('constellation-first-object')
      .mockReturnValueOnce('constellation-selected-object');
    vi.stubGlobal('crypto', { randomUUID });
    render(<ConstellationMapCreatorWorkbench locale={locale} />);

    fireEvent.click(screen.getByRole('button', { name: copy.addStar }));
    fireEvent.click(screen.getByRole('button', { name: copy.addStar }));
    expect(document.querySelector('[data-constellation-object-id="constellation-first-object"]')).toBeTruthy();
    expect(document.querySelector('[data-constellation-object-id="constellation-selected-object"]')).toBeTruthy();

    fireEvent.keyDown(document.body, { key });

    expect(document.querySelector('[data-constellation-object-id="constellation-first-object"]')).toBeTruthy();
    expect(document.querySelector('[data-constellation-object-id="constellation-selected-object"]')).toBeNull();
  });

  it.each(['en', 'zh'] as const)('%s: Delete and Backspace leave the canvas unchanged when nothing is selected', (locale) => {
    const copy = getConstellationMapCopy(locale).workspace;
    render(<ConstellationMapCreatorWorkbench locale={locale} />);
    fireEvent.click(screen.getByRole('button', { name: copy.addStar }));
    const canvas = document.querySelector('[data-constellation-canvas="true"]');
    expect(canvas).toBeTruthy();
    if (canvas === null) throw new Error('Expected the constellation canvas to be rendered.');
    fireEvent.keyDown(canvas, { key: 'Escape' });

    fireEvent.keyDown(document.body, { key: 'Delete' });
    fireEvent.keyDown(document.body, { key: 'Backspace' });

    expect(document.querySelector('[data-constellation-object-id="constellation-test-object"]')).toBeTruthy();
    expect(screen.getByRole('status').textContent).not.toContain(copy.deletedObject);
  });

  it.each([
    ['text input', 'Delete'],
    ['textarea', 'Backspace'],
    ['select', 'Delete'],
    ['contenteditable', 'Backspace'],
    ['textbox role', 'Delete'],
  ] as const)('does not delete an object while the %s is the keyboard target', (editor, key) => {
    const copy = getConstellationMapCopy('en').workspace;
    render(
      <>
        <ConstellationMapCreatorWorkbench locale="en" />
        <textarea aria-label="Test notes" />
        <select aria-label="Test selection"><option value="one">One</option></select>
        <div aria-label="Editable notes" contentEditable="true" tabIndex={0} suppressContentEditableWarning>Notes</div>
        <div aria-label="Textbox notes" role="textbox" tabIndex={0}>Notes</div>
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: copy.addStar }));

    let keyboardTarget: HTMLElement;
    if (editor === 'text input') {
      keyboardTarget = screen.getByLabelText(copy.backgroundUrl);
    } else if (editor === 'textarea') {
      keyboardTarget = screen.getByRole('textbox', { name: 'Test notes' });
    } else if (editor === 'select') {
      keyboardTarget = screen.getByRole('combobox', { name: 'Test selection' });
    } else if (editor === 'contenteditable') {
      keyboardTarget = screen.getByLabelText('Editable notes');
      // JSDOM does not reflect the browser's native isContentEditable property.
      Object.defineProperty(keyboardTarget, 'isContentEditable', { configurable: true, value: true });
    } else {
      keyboardTarget = screen.getByRole('textbox', { name: 'Textbox notes' });
    }
    keyboardTarget.focus();
    fireEvent.keyDown(keyboardTarget, { key });

    expect(document.querySelector('[data-constellation-object-id="constellation-test-object"]')).toBeTruthy();
  });

  it.each([
    ['help dialog', 'help'],
    ['mobile settings panel', 'settings'],
  ] as const)('does not delete an object while the %s is open', (_surface, surface) => {
    const copy = getConstellationMapCopy('en').workspace;
    render(<ConstellationMapCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: copy.addStar }));

    if (surface === 'help') {
      fireEvent.click(screen.getByRole('button', { name: copy.help }));
    } else {
      fireEvent.click(screen.getByRole('button', { name: copy.settingsTitle }));
    }
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(document.body, { key: 'Delete' });

    expect(document.querySelector('[data-constellation-object-id="constellation-test-object"]')).toBeTruthy();
  });

  it.each([
    ['IME composition', { key: 'Delete', isComposing: true }],
    ['a modified shortcut', { key: 'Backspace', ctrlKey: true }],
    ['a repeated key', { key: 'Delete', repeat: true }],
  ] as const)('does not delete an object during %s', (_condition, keyboardEvent) => {
    const copy = getConstellationMapCopy('en').workspace;
    render(<ConstellationMapCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: copy.addStar }));

    fireEvent.keyDown(document.body, keyboardEvent);

    expect(document.querySelector('[data-constellation-object-id="constellation-test-object"]')).toBeTruthy();
  });

  it('does not delete an object when another handler has already prevented the Delete event', () => {
    const copy = getConstellationMapCopy('en').workspace;
    render(<ConstellationMapCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: copy.addStar }));
    const preventedDeleteEvent = new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true });
    preventedDeleteEvent.preventDefault();

    window.dispatchEvent(preventedDeleteEvent);

    expect(preventedDeleteEvent.defaultPrevented).toBe(true);
    expect(document.querySelector('[data-constellation-object-id="constellation-test-object"]')).toBeTruthy();
  });

  it('does not delete an object while a project file is loading after the mobile files panel closes', async () => {
    const copy = getConstellationMapCopy('en').workspace;
    const serializedProject = serializeConstellationProject(createDefaultConstellationProject());
    let resolveProjectText: ((text: string) => void) | undefined;
    const pendingProjectText = new Promise<string>((resolve) => {
      resolveProjectText = resolve;
    });
    const projectFile = new File([serializedProject], 'constellation-project.txt', { type: 'text/plain' });
    Object.defineProperty(projectFile, 'text', { configurable: true, value: () => pendingProjectText });
    render(<ConstellationMapCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: copy.addStar }));
    const mobileNavigation = screen.getByRole('navigation', { name: copy.workspaceTitle });
    fireEvent.click(within(mobileNavigation).getByRole('button', { name: copy.filesTitle }));
    const filesPanel = screen.getByTestId('constellation-mobile-files');
    const projectFileInput = within(filesPanel).getByLabelText(copy.chooseProject) as HTMLInputElement;
    fireEvent.change(projectFileInput, { target: { files: [projectFile] } });
    fireEvent.click(within(filesPanel).getByRole('button', { name: copy.loadProject }));
    fireEvent.click(within(filesPanel).getByRole('button', { name: copy.close }));

    fireEvent.keyDown(document.body, { key: 'Delete' });

    expect(screen.queryByTestId('constellation-mobile-files')).toBeNull();
    expect(document.querySelector('[data-constellation-object-id="constellation-test-object"]')).toBeTruthy();

    if (resolveProjectText === undefined) throw new Error('The project file text promise has no resolver.');
    resolveProjectText(serializedProject);
    await waitFor(() => expect(document.querySelector('[data-constellation-object-id="constellation-test-object"]')).toBeNull());
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain(copy.loadedProject));
  });

  it('keeps background color selection and apply working without a hex text field', () => {
    const copy = getConstellationMapCopy('en').workspace;
    render(<ConstellationMapCreatorWorkbench locale="en" />);
    const settingsPanel = screen.getByTestId('constellation-settings-panel');
    const colorPicker = within(settingsPanel).getByLabelText(copy.backgroundColor) as HTMLInputElement;

    expect(colorPicker.type).toBe('color');
    expect(within(settingsPanel).queryByRole('textbox', { name: copy.backgroundColor })).toBeNull();
    fireEvent.change(colorPicker, { target: { value: '#123456' } });
    fireEvent.click(within(settingsPanel).getByRole('button', { name: copy.applyColor }));

    const canvas = document.querySelector('[data-constellation-canvas="true"]');
    expect(canvas?.querySelector('rect')?.getAttribute('fill')).toBe('#123456');
  });
});
