import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CUSTOM_SHIELD_OUTLINE_PATH,
  normalizeCustomShieldOutlinePath,
} from './shield-outline';
import { createDefaultProject } from './assets';
import { applyProjectCommand } from './commands';
import { renderCoatSceneSvg } from './scene-svg';

describe('custom shield outline paths', () => {
  it('normalizes a bounded M/L/Z polygon into deterministic SVG path data', () => {
    expect(normalizeCustomShieldOutlinePath(' M 10,0 L 90 0 L100 55 L 50 110 L0 55 z ')).toBe(
      'M10 0 L90 0 L100 55 L50 110 L0 55 Z',
    );
    expect(DEFAULT_CUSTOM_SHIELD_OUTLINE_PATH).toBe('M50 0 L94 16 L94 58 L50 110 L6 58 L6 16 Z');
  });

  it('rejects an unsafe or out-of-bounds outline instead of passing it to SVG', () => {
    expect(() => normalizeCustomShieldOutlinePath('M0 0 L100 0 L100 110 L0 110 Z onload=alert(1)')).toThrow(
      'Invalid custom shield outline path',
    );
    expect(() => normalizeCustomShieldOutlinePath('M0 0 L101 0 L50 110 Z')).toThrow(
      'outside the 100 by 110 shield bounds',
    );
  });

  it('persists a normalized outline through the shield command and restores the library source', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');

    const customOutlineProject = applyProjectCommand(project, {
      type: 'set-custom-shield-outline',
      layerId: shield.id,
      path: 'M 10 0 L90 0 L100 55 L50 110 L0 55 Z',
    } as never);

    expect(customOutlineProject.layers.find((layer) => layer.id === shield.id)).toMatchObject({
      type: 'shield',
      customOutlinePath: 'M10 0 L90 0 L100 55 L50 110 L0 55 Z',
    });

    const libraryOutlineProject = applyProjectCommand(customOutlineProject, {
      type: 'set-custom-shield-outline', layerId: shield.id,
    } as never);
    expect(libraryOutlineProject.layers.find((layer) => layer.id === shield.id)).not.toHaveProperty('customOutlinePath');
  });

  it('clips the field and renders the border from the custom outline during SVG export', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const customOutlineProject = applyProjectCommand(project, {
      type: 'set-custom-shield-outline',
      layerId: shield.id,
      path: 'M 12 0 L 88 0 L 100 52 L50 110 L0 52 Z',
    } as never);

    const svg = renderCoatSceneSvg(customOutlineProject, { width: 512, height: 512 });

    expect(svg).toContain('data-custom-shield-outline="true"');
    expect(svg).toContain('<path d="M12 0 L88 0 L100 52 L50 110 L0 52 Z"/></clipPath>');
    expect(svg).toContain('<path d="M12 0 L88 0 L100 52 L50 110 L0 52 Z" fill="none" stroke="#1E293B" stroke-width="1.5"/>');
  });
});
