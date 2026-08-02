// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { ExportMenu } from './ExportMenu';

describe('ExportMenu', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('closes the export menu when the user clicks outside it', () => {
    render(<><button type="button">Outside export menu</button><ExportMenu locale="en" project={createDefaultProject('en')} /></>);

    const exportTrigger = screen.getByRole('button', { name: 'Export' });
    fireEvent.click(exportTrigger);
    expect(screen.getByRole('region', { name: 'Local export options' })).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Outside export menu' }));

    expect(screen.queryByRole('region', { name: 'Local export options' })).toBeNull();
    expect(document.activeElement).toBe(exportTrigger);
  });

  it('keeps the export menu open when the user clicks inside it', () => {
    render(<><button type="button">Outside export menu</button><ExportMenu locale="en" project={createDefaultProject('en')} /></>);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.click(screen.getByLabelText('Export size'));

    expect(screen.getByRole('region', { name: 'Local export options' })).not.toBeNull();
  });
});
