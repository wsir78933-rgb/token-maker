// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DiceRollerTool } from '@/components/dice/DiceRollerTool';

const mockTrayRequests: Array<{ expression: string | null; locale: string }> = [];

vi.mock('@/components/dice/DiceTray3DLazy', () => ({
  DiceTray3DLazy: ({
    request,
    locale,
    title,
  }: {
    request: { expression: string } | null;
    locale: string;
    title: string;
  }) => {
    mockTrayRequests.push({
      expression: request?.expression ?? null,
      locale,
    });

    return (
      <div data-testid="dice-tray">
        {title}:{request?.expression ?? 'idle'}:{locale}
      </div>
    );
  },
}));

vi.mock('@/lib/dice/tray-3d', async () => {
  const actual = await vi.importActual<typeof import('@/lib/dice/tray-3d')>('@/lib/dice/tray-3d');

  return {
    ...actual,
    createDiceTrayPlayback: vi.fn((request: { rollId: string; expression: string; seed?: number }) =>
      actual.createDiceTrayPlayback({
        ...request,
        seed: request.seed ?? 123,
      }),
    ),
  };
});

describe('DiceRollerTool', () => {
  beforeEach(() => {
    cleanup();
    mockTrayRequests.length = 0;
    window.history.pushState({}, '', '/dice-roller-dnd?expr=2d6%2B3');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('会从 URL 读取表达式并在成功掷骰后更新托盘和历史', async () => {
    render(<DiceRollerTool locale="en" />);

    const input = screen.getByLabelText('Dice expression') as HTMLInputElement;
    const copyButton = screen.getByRole('button', { name: 'Copy Result' }) as HTMLButtonElement;

    expect(input.value).toBe('2d6+3');
    expect(copyButton.disabled).toBe(true);
    expect(screen.getByTestId('dice-tray').textContent).toContain('idle:en');
    expect(window.location.search).toBe('?expr=2d6%2B3');

    fireEvent.change(input, { target: { value: '1d4' } });

    expect(window.location.search).toBe('?expr=2d6%2B3');

    fireEvent.click(screen.getByRole('button', { name: 'Roll Dice' }));

    await waitFor(() => {
      expect(copyButton.disabled).toBe(false);
    });

    expect(screen.queryByText('No rolls yet.')).toBeNull();
    expect(screen.getByTestId('dice-tray').textContent).toContain('1d4:en');
    expect(screen.getByText(/1d4 = \d+/)).toBeTruthy();
    expect(window.location.search).toContain('expr=1d4');
  });

  it('在成功掷骰后遇到非法表达式时会清空旧结果并禁用复制', async () => {
    render(<DiceRollerTool locale="en" />);

    const input = screen.getByLabelText('Dice expression');
    const copyButton = screen.getByRole('button', { name: 'Copy Result' }) as HTMLButtonElement;

    fireEvent.click(screen.getByRole('button', { name: 'Roll Dice' }));
    await waitFor(() => {
      expect(copyButton.disabled).toBe(false);
    });

    fireEvent.change(input, { target: { value: 'bad-input' } });
    fireEvent.click(screen.getByRole('button', { name: 'Roll Dice' }));

    await waitFor(() => {
      expect(screen.getByText('Use formats like 1d20+5, 2d6+3, or 4d6dl1.')).toBeTruthy();
    });

    expect(copyButton.disabled).toBe(true);
    expect(screen.getByText('Run a roll to see the total, kept dice, and dropped values here.')).toBeTruthy();
    expect(screen.getByTestId('dice-tray').textContent).toContain('idle:en');
  });

  it('复制成功后重新掷骰或重置都会清掉 copied 状态', async () => {
    render(<DiceRollerTool locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Roll Dice' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copy Result' })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Copy Result' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied' })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: '1d4' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copy Result' })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    const resetCopyButton = screen.getByRole('button', { name: 'Copy Result' }) as HTMLButtonElement;
    expect(resetCopyButton.disabled).toBe(true);
    expect(window.location.search).toBe('');
  });

  it('中文路由会使用中文文案和托盘 locale', async () => {
    window.history.pushState({}, '', '/zh/dice-roller-dnd?expr=1d20%2B7');

    render(<DiceRollerTool locale="zh" />);

    expect((screen.getByLabelText('掷骰表达式') as HTMLInputElement).value).toBe('1d20+7');

    fireEvent.click(screen.getByRole('button', { name: '开始掷骰' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '复制结果' })).toBeTruthy();
    });

    expect(screen.getByTestId('dice-tray').textContent).toContain('1d20+7:zh');
    expect(screen.queryByText('还没有掷骰记录。')).toBeNull();
  });
});
