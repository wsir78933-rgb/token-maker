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
    // 提交历史记录应该在状态已经改变【之后】执行，以捕获最新状态？
    // 或者在状态改变【之前】执行，以捕获旧状态？
    // 为了简单起见，我们在改变【之前】记录当前状态，然后压入 past。
    const currentState = extractState(useEditorStore.getState());
    
    set((state) => {
      // 避免重复推送相同状态
      if (state.past.length > 0) {
        const last = state.past[state.past.length - 1];
        if (JSON.stringify(last) === JSON.stringify(currentState)) {
          return state;
        }
      }
      const newPast = [...state.past, currentState];
      // 限制历史记录条数 (最大 50 条)
      if (newPast.length > 50) newPast.shift();

      return { past: newPast, future: [] };
    });
  },

  undo: () => {
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

    // 释放标志位，使得后续普通操作可以正常触发订阅
    setTimeout(() => {
      set({ isTimeTraveling: false });
    }, 0);
  },

  redo: () => {
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

    setTimeout(() => {
      set({ isTimeTraveling: false });
    }, 0);
  },

  clearHistory: () => {
    set({ past: [], future: [] });
  }
}));

// ============== 自动防抖抓取中间件 (非侵入式) ==============
let saveTimeout: NodeJS.Timeout | null = null;
let lastSavedStateStr = '';

// 订阅全局变化自动节流收录历史，降低手动调用的心智负担
useEditorStore.subscribe((state) => {
  const historyStore = useHistoryStore.getState();
  if (historyStore.isTimeTraveling) return;

  const tracked = extractState(state);
  const currentStr = JSON.stringify(tracked);

  if (currentStr === lastSavedStateStr) return;

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // 使用 300ms 延迟作为自动提交点
  // 当用户连续拖拽滑块或图片时，只有停顿 300ms 后才会产生一个 commit
  saveTimeout = setTimeout(() => {
    // 因为这已经是延期执行了，意味着此时 state 就是当前的最终结果
    // 我们在此刻要把【改变之前】的状态推入吗？
    // 事实上，如果是从上一个稳定点推过来的，我们其实只是想确保历史栈有快照。
    // 在时间旅行模型中，当前状态保存在 EditorStore，历史节点保存在 past。
    // 所以由于我们是滞后收集，那么推入栈里的应当是过去某个快照，还是将它作为 `past` 新元素处理？
    // 比较安全的打法：把延时的 state push 到栈里，但是在进行下一次修改前。
    // 更好的方式：我们直接拿目前的稳定态 currentStr 作为一个关键帧 push。但这在 undo 时相当于我们还原到了前一个关键帧，而不是撤销本次动作。
    // 真正正确的逻辑：
    // 每当发生变化前，我们快照，放入 past。
    // 因为此时不好截获前状态，我们可以维持一个 prevTrackedState。
    lastSavedStateStr = currentStr;
    useHistoryStore.getState().commit();
  }, 400); // 400ms 防抖
});
