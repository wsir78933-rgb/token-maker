// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { CoatOfArmsMaker } from './CoatOfArmsMaker';

describe('CoatOfArmsMaker project dialog backdrop', () => {
  beforeEach(() => {
    let nextId = 0;
    localStorage.clear();
    vi.stubGlobal('crypto', { randomUUID: () => `project-dialog-test-id-${nextId++}` });
    useCoatProjectStore.setState(useCoatProjectStore.getInitialState(), true);
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('closes the project dialog when its backdrop is clicked', () => {
    render(<CoatOfArmsMaker locale="en" />);

    const projectsTrigger = screen.getByRole('button', { name: 'Open local project library' });
    projectsTrigger.focus();
    fireEvent.click(projectsTrigger);
    expect(screen.getByRole('dialog', { name: 'Local projects' })).toBeDefined();
    expect(screen.getByRole('main').querySelector('.coat-workbench-content')?.getAttribute('inert')).not.toBeNull();

    fireEvent.click(screen.getByTestId('coat-project-modal-backdrop'));

    expect(screen.queryByRole('dialog', { name: 'Local projects' })).toBeNull();
    expect(screen.queryByTestId('coat-project-modal-backdrop')).toBeNull();
    expect(screen.getByRole('main').querySelector('.coat-workbench-content')?.getAttribute('inert')).toBeNull();
    expect(document.activeElement).toBe(projectsTrigger);
  });
});
