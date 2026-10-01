// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ArmorCreatorPageHeading } from '@/components/armor-creator/ArmorCreatorPageHeading';
import { ArmorCreatorPageView } from '@/components/armor-creator/ArmorCreatorPageView';

afterEach(() => {
  cleanup();
});

function renderedHeading(locale: 'en' | 'zh'): HTMLElement {
  render(<ArmorCreatorPageHeading locale={locale} />);
  return screen.getByRole('heading', { level: 1 });
}

describe('ArmorCreatorPageHeading', () => {
  it('英文标题只有一个 h1，关键词更大并且带装饰下划线', () => {
    const heading = renderedHeading('en');

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(heading.textContent).toBe('Free Armor Creator for RPG Characters, NPCs & Fantasy Worlds');
    expect(heading.querySelector('span span')?.textContent).toBe('Armor Creator');
    expect(heading.querySelector('span span')?.className).toContain('font-display');
    expect(heading.querySelector('span span')?.className).toContain('italic');
    expect(heading.querySelector('span span')?.className).toContain('md:text-7xl');
    expect(heading.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(
      screen.getByText(
        'This free Armor Creator offers armor inspiration for RPG/TTRPG characters, campaign NPCs, and fantasy settings. Mix armor pieces and preview character looks.',
      ),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Try for Free' }).getAttribute('href')).toBe(
      '#armor-creator-editor',
    );
  });

  it('中文标题把护甲放在下划线里，并且不在护甲和造型之间加空格', () => {
    const heading = renderedHeading('zh');

    expect(heading.textContent).toBe('免费护甲搭配工具：为 RPG 角色、NPC 与奇幻世界提供灵感');
    expect(heading.querySelector('span span')?.textContent).toBe('护甲搭配工具');
    expect(heading.querySelector('span span')?.className).toContain('italic');
    expect(
      screen.getByText(
        '这是一款免费护甲搭配工具，为 RPG/TTRPG 角色、战役 NPC 和奇幻世界设定提供护甲造型灵感。你可以组合不同护甲部件、预览角色造型。',
      ),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Try for Free' }).getAttribute('href')).toBe('#armor-creator-editor');
  });
});

describe('ArmorCreatorPageView', () => {
  it('中文页面把标题放在编辑器前面，并且整页只有一个 h1', () => {
    render(<ArmorCreatorPageView locale="zh" />);

    const heading = screen.getByRole('heading', { level: 1 });
    const preview = screen.getByRole('heading', { level: 2, name: '预览' });

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(heading.textContent).toBe('免费护甲搭配工具：为 RPG 角色、NPC 与奇幻世界提供灵感');
    const editor = document.getElementById('armor-creator-editor');
    const action = screen.getByRole('link', { name: 'Try for Free' });

    expect(editor).toBeTruthy();
    expect(heading.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(action.compareDocumentPosition(editor as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('英文页面标题在编辑器前面', () => {
    render(<ArmorCreatorPageView locale="en" />);

    const heading = screen.getByRole('heading', { level: 1 });
    const preview = screen.getByRole('heading', { level: 2, name: 'Preview' });

    expect(heading.textContent).toBe('Free Armor Creator for RPG Characters, NPCs & Fantasy Worlds');
    expect(screen.getByRole('link', { name: 'Try for Free' }).getAttribute('href')).toBe(
      '#armor-creator-editor',
    );
    expect(heading.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
