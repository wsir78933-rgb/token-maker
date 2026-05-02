import { create } from 'zustand';
import { useEditorStore } from './editor-store';
import type { EditorState } from '@/types/editor';

// 我们只需跟踪配置参数，忽略临时状态和庞大的图像数据
type TrackedKey =
  | 'imageOffsetX'
  | 'imageOffsetY'
  | 'imageScale'
  | 'selectedBorderId'
  | 'selectedMaskId'
  | 'borderLibraryMode'
  | 'borderTint'
  | 'imageBorderTintEnabled'
  | 'textColor'
  | 'overlayTint'
  | 'borderOpacity'
  | 'overlayOpacity'
  | 'textBoxes'
  | 'activePresetId';

type PartialTrackedState = Pick<EditorState, TrackedKey>;

function extractState(state: EditorState): PartialTrackedState {
  return {
    imageOffsetX: state.imageOffsetX,
    imageOffsetY: state.imageOffsetY,
    imageScale: state.imageScale,
    selectedBorderId: state.selectedBorderId,
    selectedMaskId: state.selectedMaskId,
    borderLibraryMode: state.borderLibraryMode,
    borderTint: state.borderTint,
    imageBorderTintEnabled: state.imageBorderTintEnabled,
    textColor: state.textColor,
    overlayTint: state.overlayTint,
    borderOpacity: state.borderOpacity,
    overlayOpacity: state.overlayOpacity,
    textBoxes: JSON.parse(JSON.stringify(state.textBoxes)) as EditorState['textBoxes'],
    activePresetId: state.activePresetId,
  };
}

const HISTORY_LIMIT = 50;
const HISTORY_DEBOUNCE_MS = 400;

function stringifyTrackedState(state: PartialTrackedState) {
  return JSON.stringify(state);
}

interface HistoryState {
  past: PartialTrackedState[];
  future: PartialTrackedState[];
  isTimeTraveling: boolean;
  
  commit: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  isTimeTraveling: false,

  commit: () => {
    flushPendingHistoryCommit();
  },

  undo: () => {
    flushPendingHistoryCommit();
    const { past, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const currentTracked = extractState(useEditorStore.getState());

    set({
      isTimeTraveling: true,
      past: past.slice(0, past.length - 1),
      future: [currentTracked, ...future],
    });

    useEditorStore.setState(previous);
    setHistoryBaseline(previous);

    // 释放标志位，使得后续普通操作可以正常触发订阅
    setTimeout(() => {
      set({ isTimeTraveling: false });
    }, 0);
  },

  redo: () => {
    flushPendingHistoryCommit();
    const { past, future } = get();
    if (future.length === 0) return;

    const next = future[0];
    const currentTracked = extractState(useEditorStore.getState());

    set({
      isTimeTraveling: true,
      past: [...past, currentTracked],
      future: future.slice(1),
    });

    useEditorStore.setState(next);
    setHistoryBaseline(next);

    setTimeout(() => {
      set({ isTimeTraveling: false });
    }, 0);
  },

  clearHistory: () => {
    clearPendingHistoryCommit();
    setHistoryBaseline(extractState(useEditorStore.getState()));
    set({ past: [], future: [] });
  }
}));

// ============== 自动防抖抓取中间件 (非侵入式) ==============
let saveTimeout: NodeJS.Timeout | null = null;
let baselineState = extractState(useEditorStore.getState());
let baselineStateStr = stringifyTrackedState(baselineState);
let pendingPastState: PartialTrackedState | null = null;
let pendingCurrentState: PartialTrackedState | null = null;

function clearPendingHistoryCommit() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }

  pendingPastState = null;
  pendingCurrentState = null;
}

function setHistoryBaseline(state: PartialTrackedState) {
  clearPendingHistoryCommit();
  baselineState = state;
  baselineStateStr = stringifyTrackedState(state);
}

function pushPastState(snapshot: PartialTrackedState) {
  const snapshotStr = stringifyTrackedState(snapshot);

  useHistoryStore.setState((state) => {
    const last = state.past[state.past.length - 1];
    const past =
      last && stringifyTrackedState(last) === snapshotStr
        ? state.past
        : [...state.past, snapshot].slice(-HISTORY_LIMIT);

    return { past, future: [] };
  });
}

function flushPendingHistoryCommit() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }

  if (!pendingPastState || !pendingCurrentState) return;

  const snapshot = pendingPastState;
  const current = pendingCurrentState;
  pendingPastState = null;
  pendingCurrentState = null;

  pushPastState(snapshot);
  baselineState = current;
  baselineStateStr = stringifyTrackedState(current);
}

// 订阅全局变化自动节流收录历史，降低手动调用的心智负担
useEditorStore.subscribe((state) => {
  const historyStore = useHistoryStore.getState();
  if (historyStore.isTimeTraveling) return;

  const tracked = extractState(state);
  const currentStr = stringifyTrackedState(tracked);

  if (currentStr === baselineStateStr) {
    clearPendingHistoryCommit();
    return;
  }

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  pendingPastState ??= baselineState;
  pendingCurrentState = tracked;

  saveTimeout = setTimeout(() => {
    flushPendingHistoryCommit();
  }, HISTORY_DEBOUNCE_MS);
});
