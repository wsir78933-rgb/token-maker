// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  ARMY_FORMATION_CREATOR_EDITOR_ID,
  ArmyFormationCreatorPageHeading,
} from '@/components/army-formation/ArmyFormationCreatorPageHeading';
import { ArmyFormationCreatorPageView } from '@/components/army-formation/ArmyFormationCreatorPageView';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function renderedHeading(locale: 'en' | 'zh'): HTMLElement {
  render(<ArmyFormationCreatorPageHeading locale={locale} />);
  return screen.getByRole('heading', { level: 1 });
}

describe('ArmyFormationCreatorPageHeading', () => {
  it('英文 hero 有大标题、说明和试用按钮，关键词带下划线', () => {
    const heading = renderedHeading('en');
    const action = screen.getByRole('button', { name: 'Try for Free' });

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(heading.textContent).toBe('Plan D&D and tabletop RPG battles online Army formation creator');
    expect(heading.querySelector('span span')?.textContent).toBe('Army formation creator');
    expect(heading.querySelector('span span')?.className).toContain('font-normal');
    expect(heading.querySelector('span span')?.className).not.toContain('italic');
    expect(heading.querySelector('span span')?.className).toContain('md:text-7xl');
    expect(heading.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(
      screen.getByText(
        'Arrange forces, creatures, and siege pieces, then export an image for your players or worldbuilding notes.',
      ),
    ).toBeTruthy();
    expect(action.className).toContain('bg-foreground');
    expect(action.className).toContain('text-background');
  });

  it('中文 hero 点明 D&D 与 RPG 场景，按钮是黑底白字', () => {
    const heading = renderedHeading('zh');
    const action = screen.getByRole('button', { name: '免费试用' });

    expect(heading.textContent).toBe('在线规划 D&D 与桌面 RPG 战场 军队阵型制作器');
    expect(heading.querySelector('span span')?.textContent).toBe('军队阵型制作器');
    expect(heading.textContent).not.toContain('Army');
    expect(
      screen.getByText('免费摆放军队、生物和攻城器械，导出阵型图片，分享给玩家或留作奇幻设定资料。'),
    ).toBeTruthy();
    expect(action.className).toContain('bg-foreground');
    expect(action.className).toContain('text-background');
  });
});

describe('ArmyFormationCreatorPageView', () => {
  it('中文页面把 hero 放在编辑器前面，并且整页只有一个 h1', () => {
    render(<ArmyFormationCreatorPageView locale="zh" />);

    const heading = screen.getByRole('heading', { level: 1 });
    const editor = document.getElementById(ARMY_FORMATION_CREATOR_EDITOR_ID);
    const tool = screen.getByRole('region', { name: '军阵' });

    expect(editor).not.toBeNull();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(heading.textContent).toBe('在线规划 D&D 与桌面 RPG 战场 军队阵型制作器');
    expect(heading.compareDocumentPosition(tool) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(editor?.contains(tool)).toBe(true);
  });

  it('英文页面 hero 在编辑器前面', () => {
    render(<ArmyFormationCreatorPageView locale="en" />);

    const heading = screen.getByRole('heading', { level: 1 });
    const tool = screen.getByRole('region', { name: 'Army formation creator' });

    expect(heading.textContent).toBe('Plan D&D and tabletop RPG battles online Army formation creator');
    expect(screen.getByRole('button', { name: 'Try for Free' }).className).toContain('bg-foreground');
    expect(heading.compareDocumentPosition(tool) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
