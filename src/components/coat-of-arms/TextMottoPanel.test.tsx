// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { TextMottoPanel } from './TextMottoPanel';

describe('TextMottoPanel', () => {
  beforeEach(() => {
    let nextId = 0;
    vi.stubGlobal('crypto', { randomUUID: () => `text-panel-${nextId++}` });
    useCoatProjectStore.setState(useCoatProjectStore.getInitialState(), true);
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('adds a blackletter motto with italic bold styling', () => {
    render(<TextMottoPanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Font family'), { target: { value: 'blackletter' } });
    fireEvent.change(screen.getByLabelText('Font style'), { target: { value: 'italic' } });
    fireEvent.change(screen.getByLabelText('Font weight'), { target: { value: 'bold' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add motto' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'text',
      fontFamily: 'blackletter',
      fontStyle: 'italic',
      fontWeight: 'bold',
    });
  });
});
