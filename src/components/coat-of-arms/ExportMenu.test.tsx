// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
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
    fireEvent.click(screen.getByLabelText('File type'));

    expect(screen.getByRole('region', { name: 'Local export options' })).not.toBeNull();
  });

  it('updates the live dimensions label when the quality slider changes', () => {
    render(<ExportMenu locale="en" project={createDefaultProject('en')} />);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    expect(screen.getByText('1024 × 1024 px')).toBeDefined();

    fireEvent.change(screen.getByLabelText('Quality'), { target: { value: '0' } });

    expect(screen.getByText('256 × 256 px')).toBeDefined();
  });

  it('shows Download PNG as the default primary action', () => {
    render(<ExportMenu locale="en" project={createDefaultProject('en')} />);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));

    expect(screen.getByRole('button', { name: 'Download PNG' })).toBeDefined();
  });

  it('keeps caller-owned controls and section IDs unique when two menus are open', () => {
    const project = createDefaultProject('en');
    render(<>
      <ExportMenu locale="en" menuId="desktop-export-options" project={project} />
      <ExportMenu locale="en" menuId="mobile-export-options" project={project} />
    </>);
    const triggers = screen.getAllByRole('button', { name: 'Export' });

    expect(triggers.map((trigger) => trigger.getAttribute('aria-controls'))).toEqual([
      'desktop-export-options',
      'mobile-export-options',
    ]);
    act(() => {
      triggers[0]?.click();
      triggers[1]?.click();
    });

    const menus = screen.getAllByRole('region', { name: 'Local export options' });
    expect(menus.map((menu) => menu.id)).toEqual(['desktop-export-options', 'mobile-export-options']);
    expect(document.querySelectorAll('#desktop-export-options')).toHaveLength(1);
    expect(document.querySelectorAll('#mobile-export-options')).toHaveLength(1);
  });

  it('fails fast when a caller provides a blank menu ID', () => {
    expect(() => render(
      <ExportMenu locale="en" menuId="  " project={createDefaultProject('en')} />,
    )).toThrow('Export menu ID must be non-empty; received "  "');
  });
});
