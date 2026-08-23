// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { nameGeneratorTypes } from '@/lib/coat-of-arms/name-generator';
import { NamePanel } from './NamePanel';
import { getCoatWorkbenchCopy } from './workbench-copy';

function stubClipboardWriteText(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
}

describe('NamePanel', () => {
  beforeEach(() => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('keeps the list empty until generate, then shows five copyable names', () => {
    const copy = getCoatWorkbenchCopy('en').panels;
    render(<NamePanel locale="en" />);
    const panel = screen.getByRole('region', { name: copy.names });
    const typeSelect = screen.getByLabelText(copy.nameGeneratorType);
    const languageSelect = screen.getByLabelText(copy.nameGeneratorLanguage);

    expect(typeSelect.querySelectorAll('option')).toHaveLength(nameGeneratorTypes.length);
    expect((typeSelect as HTMLSelectElement).value).toBe('city');
    expect((languageSelect as HTMLSelectElement).value).toBe('en');
    expect(screen.getByRole('button', { name: copy.generateNames('City') })).toBeDefined();
    expect(within(panel).queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.queryByRole('button', { name: 'Use project name' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Add generated motto' })).toBeNull();
    expect(screen.queryByText('Generated project name')).toBeNull();
    expect(screen.queryByText('Project identity actions')).toBeNull();

    fireEvent.change(typeSelect, { target: { value: 'dragon' } });
    fireEvent.change(languageSelect, { target: { value: 'de' } });
    expect(screen.getByRole('button', { name: copy.generateNames('Dragon') })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: copy.generateNames('Dragon') }));

    const generatedList = within(panel).getByRole('list', { name: copy.nameResults });
    const generatedItems = within(generatedList).getAllByRole('listitem');
    expect(generatedItems).toHaveLength(5);
    const firstName = generatedItems[0]?.querySelector('span')?.textContent;
    if (!firstName) throw new Error('Expected a generated name after clicking generate');
    expect(within(generatedItems[0]!).getByRole('button', { name: copy.copyGeneratedName(firstName) })).toBeDefined();
    expect(within(panel).queryByText(copy.savedNames)).toBeNull();
  });

  it('copies a generated name into the saved list and can remove it', async () => {
    const copy = getCoatWorkbenchCopy('en').panels;
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboardWriteText(writeText);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<NamePanel locale="en" />);
    const panel = screen.getByRole('region', { name: copy.names });

    fireEvent.click(screen.getByRole('button', { name: copy.generateNames('City') }));
    const firstName = within(within(panel).getByRole('list', { name: copy.nameResults })).getAllByRole('listitem')[0]?.querySelector('span')?.textContent;
    if (!firstName) throw new Error('Expected a generated name after clicking generate');

    fireEvent.click(screen.getByRole('button', { name: copy.copyGeneratedName(firstName) }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(firstName));
    expect(within(panel).getByRole('status').textContent).toBe(copy.nameCopied(firstName));
    expect(within(panel).getByText(copy.savedNames)).toBeDefined();
    expect(within(panel).getByRole('button', { name: copy.removeSavedName(firstName) })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: copy.copyGeneratedName(firstName) }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));
    expect(within(panel).getAllByRole('button', { name: copy.removeSavedName(firstName) })).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: copy.removeSavedName(firstName) }));
    expect(within(panel).queryByText(copy.savedNames)).toBeNull();
  });

  it('reports a clipboard failure with the specific name', async () => {
    const copy = getCoatWorkbenchCopy('en').panels;
    stubClipboardWriteText(() => Promise.reject(new Error('permission denied')));
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<NamePanel locale="en" />);
    const panel = screen.getByRole('region', { name: copy.names });

    fireEvent.click(screen.getByRole('button', { name: copy.generateNames('City') }));
    const firstName = within(within(panel).getByRole('list', { name: copy.nameResults })).getAllByRole('listitem')[0]?.querySelector('span')?.textContent;
    if (!firstName) throw new Error('Expected a generated name after clicking generate');

    fireEvent.click(screen.getByRole('button', { name: copy.copyGeneratedName(firstName) }));
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain(firstName);
    expect(alert.textContent).toContain('permission denied');
    expect(within(panel).queryByText(copy.savedNames)).toBeNull();
  });

  it('uses Chinese UI copy without changing the generator language choices', () => {
    const copy = getCoatWorkbenchCopy('zh').panels;
    render(<NamePanel locale="zh" />);

    expect(screen.getByRole('button', { name: copy.generateNames('城市') })).toBeDefined();
    expect((screen.getByLabelText(copy.nameGeneratorLanguage) as HTMLSelectElement).value).toBe('en');
    expect(screen.queryByText('Generate City Names')).toBeNull();
  });
});
