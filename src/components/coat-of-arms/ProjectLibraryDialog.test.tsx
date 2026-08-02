// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { ProjectLibraryDialog } from './ProjectLibraryDialog';

function renderOpenProjectLibrary(portalHost?: HTMLElement | null) {
  const dialogProps = {
    locale: 'en' as const,
    onOpenChange: vi.fn(),
    onProjectChange: vi.fn(),
    open: true,
    project: createDefaultProject('en'),
    renderTrigger: false,
    triggerRef: { current: null },
    portalHost,
  };

  return render(<ProjectLibraryDialog {...dialogProps} />);
}

describe('ProjectLibraryDialog portal host', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('mounts the open dialog and backdrop in a supplied portal host', () => {
    const portalHost = document.createElement('div');
    document.body.append(portalHost);

    try {
      renderOpenProjectLibrary(portalHost);

      expect(within(portalHost).getByRole('dialog', { name: /local projects/i })).toBeDefined();
      expect(within(portalHost).getByTestId('coat-project-modal-backdrop')).toBeDefined();
    } finally {
      portalHost.remove();
    }
  });

  it('falls back to document.body when no portal host is available', () => {
    renderOpenProjectLibrary(null);

    expect(screen.getByRole('dialog', { name: /local projects/i }).parentElement).toBe(document.body);
    expect(screen.getByTestId('coat-project-modal-backdrop').parentElement).toBe(document.body);
  });
});
