// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { ProjectLibraryDialog } from './ProjectLibraryDialog';

describe('ProjectLibraryDialog outside click', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('closes when its backdrop is clicked', () => {
    const onOpenChange = vi.fn();

    render(
      <ProjectLibraryDialog
        locale="en"
        onOpenChange={onOpenChange}
        onProjectChange={vi.fn()}
        open
        project={createDefaultProject('en')}
        renderTrigger={false}
        triggerRef={{ current: null }}
      />,
    );

    fireEvent.click(screen.getByTestId('coat-project-modal-backdrop'));

    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('keeps the dialog open when it is clicked', () => {
    const onOpenChange = vi.fn();

    render(
      <ProjectLibraryDialog
        locale="en"
        onOpenChange={onOpenChange}
        onProjectChange={vi.fn()}
        open
        project={createDefaultProject('en')}
        renderTrigger={false}
        triggerRef={{ current: null }}
      />,
    );

    fireEvent.click(screen.getByRole('dialog', { name: 'Local projects' }));

    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
