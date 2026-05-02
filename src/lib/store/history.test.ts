import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useEditorStore } from '@/lib/store/editor-store';
import { useHistoryStore } from '@/lib/store/history';

function resetStores() {
  useEditorStore.getState().resetAll();
  useHistoryStore.getState().clearHistory();
}

describe('history store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetStores();
  });

  afterEach(() => {
    useHistoryStore.getState().clearHistory();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('不会在防抖窗口内回到 baseline 时写入历史', () => {
    const initialScale = useEditorStore.getState().imageScale;

    useEditorStore.getState().setImageScale(initialScale + 0.5);
    useEditorStore.getState().setImageScale(initialScale);
    vi.advanceTimersByTime(401);

    expect(useEditorStore.getState().imageScale).toBe(initialScale);
    expect(useHistoryStore.getState().past).toHaveLength(0);
  });

  it('提交的是变更前快照，undo 能回到上一个状态', () => {
    const initialScale = useEditorStore.getState().imageScale;

    useEditorStore.getState().setImageScale(initialScale + 0.5);
    vi.advanceTimersByTime(401);

    const history = useHistoryStore.getState();
    expect(history.past).toHaveLength(1);
    expect(history.past[0]?.imageScale).toBe(initialScale);

    history.undo();
    expect(useEditorStore.getState().imageScale).toBe(initialScale);
  });
});
