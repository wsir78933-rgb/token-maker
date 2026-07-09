// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DiceRollerTool } from '@/components/dice/DiceRollerTool';

vi.mock('@/components/dice/DiceTray', () => ({
  DiceTray: ({
    playback,
    stagedGroups,
    stagedExpr,
    getStagedDieAlt,
    locale,
    title,
  }: {
    playback: { headline: string; result: { total: number } } | null;
    stagedGroups?: Array<{ sides: number; count: number }>;
    stagedExpr?: string;
    getStagedDieAlt?: (sides: number) => string;
    locale: string;
    title: string;
  }) => (
    <div data-testid="dice-tray">
      {stagedGroups?.map((group) =>
        Array.from({ length: group.count }, (_, index) => (
          <span
            key={`${group.sides}-${index}`}
            role="img"
            aria-label={
              getStagedDieAlt?.(group.sides) ??
              `${group.sides}-sided die (d${group.sides}) ready to roll`
            }
          />
        ))
      )}
      {title}:{playback ? playback.headline : stagedExpr ?? 'idle'}:{locale}:
      {playback ? playback.result.total : 'idle'}
    </div>
  ),
}));

describe('DiceRollerTool', () => {
  beforeEach(() => {
    cleanup();
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

    await waitFor(() => {
      expect(screen.getByTestId('dice-tray').textContent).toContain('2d6 + 3:en');
    });

    const bonusInput = screen.getByLabelText('Bonus modifier') as HTMLInputElement;
    const copyButton = screen.getByRole('button', { name: 'Copy Result' }) as HTMLButtonElement;

    expect(bonusInput.value).toBe('3');
    expect(copyButton.disabled).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Roll Dice' }));

    await waitFor(() => {
      expect(copyButton.disabled).toBe(false);
    });

    expect(screen.queryByText('No rolls yet.')).toBeNull();
    expect(screen.getByTestId('dice-tray').textContent).toContain('2d6 + 3:en');
    expect(new URLSearchParams(window.location.search).get('expr')).toBe('2d6 + 3');
  });

  it('支持手写 URL 里未转义的加号表达式', async () => {
    window.history.pushState({}, '', '/dice-roller-dnd?expr=2d6+3');

    render(<DiceRollerTool locale="en" />);

    await waitFor(() => {
      expect(screen.getByTestId('dice-tray').textContent).toContain('2d6 + 3:en');
    });

    expect((screen.getByLabelText('Bonus modifier') as HTMLInputElement).value).toBe('3');
  });

  it('复制成功后重新选择骰子或重置都会清掉 copied 状态', async () => {
    window.history.pushState({}, '', '/dice-roller-dnd');
    render(<DiceRollerTool locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Add d4 die' }));
    fireEvent.click(screen.getByRole('button', { name: 'Roll Dice' }));

    await waitFor(() => {
      expect((screen.getByRole('button', { name: 'Copy Result' }) as HTMLButtonElement).disabled).toBe(false);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Copy Result' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied' })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add d6 die' }));

    await waitFor(() => {
      expect((screen.getByRole('button', { name: 'Copy Result' }) as HTMLButtonElement).disabled).toBe(true);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Roll Dice' }));

    await waitFor(() => {
      expect((screen.getByRole('button', { name: 'Copy Result' }) as HTMLButtonElement).disabled).toBe(false);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    expect((screen.getByRole('button', { name: 'Copy Result' }) as HTMLButtonElement).disabled).toBe(true);
    expect(window.location.search).toBe('');
  });

  it('中文路由会使用中文文案和托盘 locale', async () => {
    window.history.pushState({}, '', '/zh/dice-roller-dnd?expr=1d20%2B7');

    render(<DiceRollerTool locale="zh" />);

    await waitFor(() => {
      expect(screen.getByTestId('dice-tray').textContent).toContain('1d20 + 7:zh');
    });

    expect((screen.getByLabelText('加值') as HTMLInputElement).value).toBe('7');

    fireEvent.click(screen.getByRole('button', { name: '开始掷骰' }));

    await waitFor(() => {
      expect((screen.getByRole('button', { name: '复制结果' }) as HTMLButtonElement).disabled).toBe(false);
    });

    expect(screen.queryByText('还没有掷骰记录。')).toBeNull();
  });

  it('中文路由会使用中文骰子 aria、alt 和复制标签', async () => {
    window.history.pushState({}, '', '/zh/dice-roller-dnd');

    render(<DiceRollerTool locale="zh" />);

    const addD4Button = screen.getByRole('button', { name: '添加 d4 骰子' });
    expect(screen.getByAltText('将一个 4 面骰 (d4) 加入骰池')).toBeDefined();

    fireEvent.click(addD4Button);

    expect(await screen.findByRole('img', { name: '4 面骰 (d4) 准备投掷' })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: '开始掷骰' }));

    await waitFor(() => {
      expect((screen.getByRole('button', { name: '复制结果' }) as HTMLButtonElement).disabled).toBe(false);
    });

    fireEvent.click(screen.getByRole('button', { name: '复制结果' }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
    const clipboardText = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)?.[0] ?? '';
    expect(clipboardText).toContain('掷骰: ');
    expect(clipboardText).not.toContain('Rolls:');
  });
});
