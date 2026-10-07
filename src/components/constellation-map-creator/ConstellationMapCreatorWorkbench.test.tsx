// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
});
