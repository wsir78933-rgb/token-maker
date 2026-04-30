// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DiceRollerTool } from '@/components/dice/DiceRollerTool';

afterEach(() => cleanup());

beforeEach(() => {
  Element.prototype.animate = vi.fn(() => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    cancel: vi.fn(),
  })) as unknown as typeof Element.prototype.animate;
});

describe('DiceRollerTool', () => {
  it('renders localized core controls', () => {
    render(<DiceRollerTool locale="en" />);

    expect(screen.getByRole('button', { name: /Roll!/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Clear$/i })).toBeTruthy();
    expect(screen.getByText('No rolls yet.')).toBeTruthy();
  });

  it('can add dice and roll to create history', () => {
    render(<DiceRollerTool locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: /Add a 4-sided die/i }));
    fireEvent.click(screen.getByRole('button', { name: /Roll!/i }));

    expect(screen.queryByText('No rolls yet.')).toBeNull();
  });

  it('renders zh copy', () => {
    render(<DiceRollerTool locale="zh" />);

    expect(screen.getByRole('button', { name: /投掷/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /清空托盘/ })).toBeTruthy();
    expect(screen.getByText('还没有掷骰记录。')).toBeTruthy();
  });
});
