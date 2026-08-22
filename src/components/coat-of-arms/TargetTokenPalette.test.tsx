// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { TargetTokenPalette } from './TargetTokenPalette';

describe('TargetTokenPalette', () => {
  beforeEach(() => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(cleanup);

  it('filters symbols and adds the selected local WebP material', () => {
    render(<TargetTokenPalette locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Symbols' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search tokens' }), { target: { value: 'eternal flame' } });
    const sunCard = screen.getByRole('button', { name: 'Add Eternal Flame token' });
    expect(sunCard.querySelector('img')?.getAttribute('src')).toBe('/coat-assets/materials/symbols/eternal-flame.webp');
    expect(sunCard.className).toContain('coat-gallery-card');
    expect(sunCard.querySelector('.coat-gallery-card-name')?.textContent).toBe('Eternal Flame');
    fireEvent.click(sunCard);

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'material-symbol-eternal-flame',
    });
  });

  it('renders featured tokens from the WebP catalogue', () => {
    render(<TargetTokenPalette locale="en" />);

    const lionCard = screen.getByRole('button', { name: 'Add Wolf Rampant token' });
    expect(lionCard.querySelector('img')?.getAttribute('src')).toBe('/coat-assets/materials/animals/wolf-rampant.webp');
  });
});

