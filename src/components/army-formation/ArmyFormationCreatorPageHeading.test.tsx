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
    expect(heading.textContent).toBe('Place battlefield pieces in your browser Army formation creator');
    expect(heading.querySelector('span span')?.textContent).toBe('Army formation creator');
    expect(heading.querySelector('span span')?.className).toContain('font-normal');
    expect(heading.querySelector('span span')?.className).not.toContain('italic');
    expect(heading.querySelector('span span')?.className).toContain('md:text-7xl');
    expect(heading.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByText('Arrange the formation on the battlefield, then download an image.')).toBeTruthy();
    expect(action.className).toContain('bg-black');
    expect(action.className).toContain('text-white');
  });

  it('中文 hero 全部是中文，按钮是黑底白字', () => {
    const heading = renderedHeading('zh');
    const action = screen.getByRole('button', { name: '免费试用' });

    expect(heading.textContent).toBe('在浏览器里摆放战场棋子 军阵制作器');
    expect(heading.querySelector('span span')?.textContent).toBe('军阵制作器');
    expect(heading.textContent).not.toContain('Army');
    expect(screen.getByText('在战场上把阵型摆好，然后下载图片。')).toBeTruthy();
    expect(action.className).toContain('bg-black');
    expect(action.className).toContain('text-white');
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
    expect(heading.textContent).toBe('在浏览器里摆放战场棋子 军阵制作器');
    expect(heading.compareDocumentPosition(tool) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(editor?.contains(tool)).toBe(true);
  });

  it('英文页面 hero 在编辑器前面', () => {
    render(<ArmyFormationCreatorPageView locale="en" />);

    const heading = screen.getByRole('heading', { level: 1 });
    const tool = screen.getByRole('region', { name: 'Army formation creator' });

    expect(heading.textContent).toBe('Place battlefield pieces in your browser Army formation creator');
    expect(screen.getByRole('button', { name: 'Try for Free' }).className).toContain('bg-black');
    expect(heading.compareDocumentPosition(tool) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
