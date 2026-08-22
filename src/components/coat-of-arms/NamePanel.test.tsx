// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { nameGeneratorTypes } from '@/lib/coat-of-arms/name-generator';
import { NamePanel } from './NamePanel';
import { getCoatWorkbenchCopy } from './workbench-copy';

describe('NamePanel', () => {
  beforeEach(() => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
  });

  it('generates a localized list from the selected type and language', () => {
    const copy = getCoatWorkbenchCopy('en').panels;
    render(<NamePanel locale="en" />);
    const panel = screen.getByRole('region', { name: copy.names });
    const typeSelect = screen.getByLabelText(copy.nameGeneratorType);
    const languageSelect = screen.getByLabelText(copy.nameGeneratorLanguage);

    expect(typeSelect.querySelectorAll('option')).toHaveLength(nameGeneratorTypes.length);
    expect((typeSelect as HTMLSelectElement).value).toBe('city');
    expect((languageSelect as HTMLSelectElement).value).toBe('en');
    expect(screen.getByRole('button', { name: copy.generateNames('City') })).toBeDefined();
    expect(within(panel).getAllByRole('listitem')).toHaveLength(8);

    fireEvent.change(typeSelect, { target: { value: 'dragon' } });
    fireEvent.change(languageSelect, { target: { value: 'de' } });
    expect(screen.getByRole('button', { name: copy.generateNames('Dragon') })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: copy.generateNames('Dragon') }));

    expect(within(panel).getAllByRole('listitem')).toHaveLength(8);
    expect(within(panel).getByText(copy.nameResults)).toBeDefined();
    expect(within(panel).getByText(copy.identityActions)).toBeDefined();
  });

  it('keeps identity mutation actions below the generator as secondary actions', () => {
    const copy = getCoatWorkbenchCopy('en').panels;
    render(<NamePanel locale="en" />);
    const panel = screen.getByRole('region', { name: copy.names });
    const generateButton = screen.getByRole('button', { name: copy.generateNames('City') });
    const actionsHeading = within(panel).getByText(copy.identityActions);

    expect(generateButton.className).toContain('coat-target-action-button--primary');
    expect(generateButton.compareDocumentPosition(actionsHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('button', { name: copy.useProjectName })).toBeDefined();
    expect(screen.getByRole('button', { name: copy.addGeneratedMotto })).toBeDefined();
    expect(panel.querySelector('.coat-target-name-language')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: copy.useProjectName }));
    expect(useCoatProjectStore.getState().project.name).not.toBe('');
    fireEvent.click(screen.getByRole('button', { name: copy.addGeneratedMotto }));
    expect(useCoatProjectStore.getState().project.layers.some((layer) => layer.type === 'text')).toBe(true);
  });

  it('uses Chinese UI copy without changing the generator language choices', () => {
    const copy = getCoatWorkbenchCopy('zh').panels;
    render(<NamePanel locale="zh" />);

    expect(screen.getByRole('button', { name: copy.generateNames('城市') })).toBeDefined();
    expect((screen.getByLabelText(copy.nameGeneratorLanguage) as HTMLSelectElement).value).toBe('en');
    expect(screen.queryByText('Generate City Names')).toBeNull();
  });
});
