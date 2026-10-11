// @vitest-environment jsdom

import { act, cleanup, createEvent, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NoticeBoardCreatorWorkbench } from '@/components/notice-board-creator/NoticeBoardCreatorWorkbench';
import { getNoticeBoardEditorCopy } from '@/lib/notice-board-creator/editor-copy';
import type { NoticeBoardEditorCopy } from '@/lib/notice-board-creator/editor-copy';
import { parseGoogleFontInputs } from '@/lib/notice-board-creator/fonts';
import {
  createBoardNotice,
  createEmptyNoticeBoardProject,
  NOTICE_BOARD_MAX_CUSTOM_FONTS,
  NOTICE_BOARD_MAX_PROJECT_FILE_BYTES,
  serializeNoticeBoardFile,
} from '@/lib/notice-board-creator/project';
import { loadNoticeBoardSlot } from '@/lib/notice-board-creator/storage';
import type { NoticeBoardFont, NoticeBoardProject, NoticeBoardSlotIndex } from '@/lib/notice-board-creator/types';

type IsolatedNoticeBoardStorage = Storage & {
  storedProjectsByKey: Map<string, string>;
};

function createIsolatedNoticeBoardStorage(): IsolatedNoticeBoardStorage {
  const storedProjectsByKey = new Map<string, string>();

  return {
    get length() {
      return storedProjectsByKey.size;
    },
    clear() {
      storedProjectsByKey.clear();
    },
    getItem(storageKey) {
      return storedProjectsByKey.get(storageKey) ?? null;
    },
    key(storageIndex) {
      return Array.from(storedProjectsByKey.keys())[storageIndex] ?? null;
    },
    removeItem(storageKey) {
      storedProjectsByKey.delete(storageKey);
    },
    setItem(storageKey, projectText) {
      storedProjectsByKey.set(storageKey, projectText);
    },
    storedProjectsByKey,
  };
}

function createNoticeBoardProject(
  boardWidth: number,
  noticeText: string,
  customFonts: readonly NoticeBoardFont[] = [],
): NoticeBoardProject {
  const emptyProject = createEmptyNoticeBoardProject();
  const notice = createBoardNotice('paper-01', 'seeded-notice', boardWidth);
  notice.text = noticeText;

  return {
    ...emptyProject,
    boardWidth,
    notices: [notice],
    customFonts: [...customFonts],
  };
}

function createGoogleFontAtIndex(fontIndex: number): NoticeBoardFont {
  const family = `QuestFont${fontIndex}`;

  return parseGoogleFontInputs(
    `https://fonts.googleapis.com/css2?family=${family}&display=swap`,
    family,
  );
}

function getNoticeContentElement(noticeButton: HTMLElement): HTMLSpanElement {
  const noticeContent = noticeButton.querySelector('span');
  if (!(noticeContent instanceof HTMLSpanElement)) {
    throw new Error(`Notice button ${JSON.stringify(noticeButton.getAttribute('aria-label'))} has no content span.`);
  }
  return noticeContent;
}

function openSaveOpenDialog(saveOpenLabel = 'Save/Open'): HTMLElement {
  const saveOpenTrigger = screen.getAllByRole('button', { name: saveOpenLabel })[0];
  if (saveOpenTrigger === undefined) {
    throw new Error(`The Save/Open trigger ${JSON.stringify(saveOpenLabel)} is missing.`);
  }
  fireEvent.click(saveOpenTrigger);
  return screen.getByRole('dialog');
}

type ControlledNoticeBoardIntersectionObserver = {
  observedTargets: Element[];
  reportIntersection: (isIntersecting: boolean) => void;
};

function createControlledNoticeBoardIntersectionObserver(): ControlledNoticeBoardIntersectionObserver {
  let intersectionCallback: IntersectionObserverCallback | null = null;
  const observedTargets: Element[] = [];
  const observerInstance: IntersectionObserver = {
    root: null,
    rootMargin: '0px',
    thresholds: [],
    observe: vi.fn((observedElement: Element) => {
      observedTargets.push(observedElement);
    }),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(() => []),
  };

  const intersectionObserverConstructor = vi.fn(
    function noticeBoardIntersectionObserver(callback: IntersectionObserverCallback) {
      intersectionCallback = callback;
      return observerInstance;
    },
  );
  vi.stubGlobal('IntersectionObserver', intersectionObserverConstructor);

  function reportIntersection(isIntersecting: boolean): void {
    const observedWorkbench = observedTargets[0];
    if (observedWorkbench === undefined) {
      throw new Error('The notice board workbench was not observed.');
    }
    if (intersectionCallback === null) {
      throw new Error('The notice board intersection callback was not registered.');
    }

    const observedBounds = observedWorkbench.getBoundingClientRect();
    const intersectionEntry = {
      target: observedWorkbench,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: observedBounds,
      intersectionRect: observedBounds,
      rootBounds: null,
      time: 0,
    } as IntersectionObserverEntry;
    intersectionCallback([intersectionEntry], observerInstance);
  }

  return { observedTargets, reportIntersection };
}

function getApplyFormattingButton(copy: NoticeBoardEditorCopy): HTMLButtonElement {
  const escapedApplyLabel = copy.applyFormatting.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const applyLabelPrefix = new RegExp(`^${escapedApplyLabel}`);
  const applyButton = screen.getByRole('button', { name: applyLabelPrefix });
  if (!(applyButton instanceof HTMLButtonElement)) {
    throw new Error(`Apply formatting control must be a button; received ${applyButton.tagName}.`);
  }
  return applyButton;
}

function dispatchFocusedKeyDown(
  focusedElement: HTMLElement,
  keyEventOptions: {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    isComposing?: boolean;
    keyCode?: number;
  },
): boolean {
  if (document.activeElement !== focusedElement) {
    const actualFocusedElement = document.activeElement;
    const actualFocusDescription = actualFocusedElement instanceof HTMLElement
      ? actualFocusedElement.tagName
      : String(actualFocusedElement);
    throw new Error(
      `Cannot dispatch ${JSON.stringify(keyEventOptions.key)}: expected focus on ${focusedElement.tagName}, received ${actualFocusDescription}.`,
    );
  }

  return fireEvent.keyDown(focusedElement, keyEventOptions);
}

function getNoticeCardElement(noticeButton: HTMLElement): HTMLDivElement {
  const noticeCardElement = noticeButton.closest('[data-notice-id]');
  if (!(noticeCardElement instanceof HTMLDivElement)) {
    throw new Error(
      `Notice button ${JSON.stringify(noticeButton.getAttribute('aria-label'))} is not inside a notice card.`,
    );
  }
  return noticeCardElement;
}

function getNoticeBoardWorkbenchElement(container: HTMLElement): HTMLDivElement {
  const workbenchElement = container.querySelector('[data-notice-board-workbench]');
  if (!(workbenchElement instanceof HTMLDivElement)) {
    throw new Error('Notice board workbench root is missing from the rendered editor.');
  }
  return workbenchElement;
}

let isolatedNoticeBoardStorage: IsolatedNoticeBoardStorage;

const noticeDeletionScenarios = [
  {
    locale: 'en' as const,
    addPaperLabels: ['Add paper 01', 'Add paper 02'] as const,
    selectedNoticeLabel: 'Notice 1',
    remainingNoticeLabel: 'Notice 2',
  },
  {
    locale: 'zh' as const,
    addPaperLabels: ['添加纸张 01', '添加纸张 02'] as const,
    selectedNoticeLabel: '公告 1',
    remainingNoticeLabel: '公告 2',
  },
];

const singleNoticeDeletionCases = noticeDeletionScenarios.flatMap((scenario) =>
  (['Delete', 'Backspace'] as const).map((key) => ({ ...scenario, key })),
);

const guardedNoticeDeletionCases: readonly {
  modifierLabel: string;
  key: 'Delete' | 'Backspace';
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  isComposing?: boolean;
  keyCode?: number;
}[] = [
  { modifierLabel: 'IME composition', key: 'Delete', isComposing: true },
  { modifierLabel: 'IME keyCode 229', key: 'Delete', keyCode: 229 },
  { modifierLabel: 'Control', key: 'Delete', ctrlKey: true },
  { modifierLabel: 'Meta', key: 'Backspace', metaKey: true },
  { modifierLabel: 'Alt', key: 'Delete', altKey: true },
  { modifierLabel: 'Shift', key: 'Delete', shiftKey: true },
];

const noticeDoubleClickEditingScenarios = [
  {
    locale: 'en' as const,
    addPaperLabels: ['Add paper 01', 'Add paper 02'] as const,
    firstNoticeLabel: 'Notice 1',
    secondNoticeLabel: 'Notice 2',
  },
  {
    locale: 'zh' as const,
    addPaperLabels: ['添加纸张 01', '添加纸张 02'] as const,
    firstNoticeLabel: '公告 1',
    secondNoticeLabel: '公告 2',
  },
];

beforeEach(() => {
  isolatedNoticeBoardStorage = createIsolatedNoticeBoardStorage();
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: isolatedNoticeBoardStorage,
  });
});

afterEach(() => {
  cleanup();
  isolatedNoticeBoardStorage.clear();
  vi.unstubAllGlobals();
});

describe('NoticeBoardCreatorWorkbench', () => {
  it.each([
    {
      locale: 'en' as const,
      addPaperLabel: 'Add paper 01',
      firstNoticeLabel: 'Notice 1',
      secondNoticeLabel: 'Notice 2',
      noticeTextLabel: 'Notice text',
    },
    {
      locale: 'zh' as const,
      addPaperLabel: '添加纸张 01',
      firstNoticeLabel: '公告 1',
      secondNoticeLabel: '公告 2',
      noticeTextLabel: '公告文字',
    },
  ])('selects each new paper and opens its editor for $locale', ({
    locale,
    addPaperLabel,
    firstNoticeLabel,
    secondNoticeLabel,
    noticeTextLabel,
  }) => {
    render(<NoticeBoardCreatorWorkbench locale={locale} />);

    const copy = getNoticeBoardEditorCopy(locale);
    const toolbarTitle = screen.getByRole('heading', { level: 2, name: copy.toolTitle });
    const toolbarElement = toolbarTitle.closest('header');
    if (!(toolbarElement instanceof HTMLElement)) {
      throw new Error(`The notice board toolbar is missing for locale ${JSON.stringify(locale)}.`);
    }
    const multiSelectButton = within(toolbarElement).getByRole('button', { name: copy.multiSelect });
    expect(multiSelectButton.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(multiSelectButton);
    const finishMultiSelectButton = within(toolbarElement).getByRole('button', {
      name: copy.finishMultiSelect,
    });
    expect(finishMultiSelectButton.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(finishMultiSelectButton);

    const addPaperButton = screen.getByRole('button', { name: addPaperLabel });
    fireEvent.click(addPaperButton);

    const firstNoticeButton = screen.getByRole('button', { name: firstNoticeLabel });
    const firstTextEditor = screen.getByRole('textbox', { name: noticeTextLabel }) as HTMLTextAreaElement;
    expect(firstNoticeButton.getAttribute('aria-pressed')).toBe('true');
    expect(firstTextEditor.value).toBe('');
    expect(document.activeElement).toBe(firstTextEditor);

    fireEvent.click(addPaperButton);
    const secondNoticeButton = screen.getByRole('button', { name: secondNoticeLabel });
    const secondTextEditor = screen.getByRole('textbox', { name: noticeTextLabel }) as HTMLTextAreaElement;
    expect(secondNoticeButton.getAttribute('aria-pressed')).toBe('true');
    expect(secondTextEditor.value).toBe('');
    expect(document.activeElement).toBe(secondTextEditor);

    firstNoticeButton.focus();
    fireEvent.click(firstNoticeButton);
    expect(firstNoticeButton.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(firstNoticeButton);
  });

  it.each(noticeDoubleClickEditingScenarios)(
    'opens text editing on double-click and keeps click and delete behavior for $locale',
    ({ locale, addPaperLabels, firstNoticeLabel, secondNoticeLabel }) => {
      const copy = getNoticeBoardEditorCopy(locale);
      render(<NoticeBoardCreatorWorkbench locale={locale} />);
      for (const addPaperLabel of addPaperLabels) {
        fireEvent.click(screen.getByRole('button', { name: addPaperLabel }));
      }

      const firstNoticeButton = screen.getByRole('button', { name: firstNoticeLabel });
      const secondNoticeButton = screen.getByRole('button', { name: secondNoticeLabel });
      firstNoticeButton.focus();
      fireEvent.click(firstNoticeButton);
      expect(firstNoticeButton.getAttribute('aria-pressed')).toBe('true');
      expect(document.activeElement).toBe(firstNoticeButton);

      fireEvent.click(firstNoticeButton);
      expect(document.activeElement).toBe(firstNoticeButton);
      fireEvent.doubleClick(firstNoticeButton);

      const noticeTextEditor = screen.getByRole('textbox', { name: copy.noticeText }) as HTMLTextAreaElement;
      expect(document.activeElement).toBe(noticeTextEditor);
      fireEvent.change(noticeTextEditor, { target: { value: 'Updated notice text.' } });
      expect(noticeTextEditor.value).toBe('Updated notice text.');
      expect(getNoticeContentElement(firstNoticeButton).textContent).toBe('Updated notice text.');

      const fontSizeInput = screen.getByRole('spinbutton', { name: copy.fontSize }) as HTMLInputElement;
      fontSizeInput.focus();
      fireEvent.change(fontSizeInput, { target: { value: '32' } });
      expect(fontSizeInput.value).toBe('32');
      expect(getNoticeContentElement(firstNoticeButton).style.fontSize).toBe('20px');

      firstNoticeButton.focus();
      fireEvent.doubleClick(firstNoticeButton);
      const repeatedNoticeTextEditor = screen.getByRole('textbox', { name: copy.noticeText });
      expect(document.activeElement).toBe(repeatedNoticeTextEditor);
      expect(screen.getByRole('spinbutton', { name: copy.fontSize })).toHaveProperty('value', '32');
      expect(getNoticeContentElement(firstNoticeButton).style.fontSize).toBe('20px');

      for (const key of ['Delete', 'Backspace'] as const) {
        expect(dispatchFocusedKeyDown(repeatedNoticeTextEditor, { key })).toBe(true);
        expect(firstNoticeButton.isConnected).toBe(true);
      }

      secondNoticeButton.focus();
      fireEvent.click(secondNoticeButton);
      expect(secondNoticeButton.getAttribute('aria-pressed')).toBe('true');
      expect(firstNoticeButton.getAttribute('aria-pressed')).toBe('false');
      expect(document.activeElement).toBe(secondNoticeButton);

      expect(dispatchFocusedKeyDown(secondNoticeButton, { key: 'Delete' })).toBe(false);
      expect(secondNoticeButton.isConnected).toBe(false);
      expect(firstNoticeButton.isConnected).toBe(true);
    },
  );

  it('keeps multi-select editing behavior on double-click', () => {
    const copy = getNoticeBoardEditorCopy('en');
    render(<NoticeBoardCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Add paper 01' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add paper 02' }));
    const multiSelectButton = screen.getByRole('button', { name: copy.multiSelect });
    fireEvent.click(multiSelectButton);

    const firstNoticeButton = screen.getByRole('button', { name: 'Notice 1' });
    firstNoticeButton.focus();
    fireEvent.click(firstNoticeButton);
    expect(firstNoticeButton.getAttribute('aria-pressed')).toBe('true');
    expect(multiSelectButton.getAttribute('aria-pressed')).toBe('true');

    fireEvent.doubleClick(firstNoticeButton);
    expect(firstNoticeButton.getAttribute('aria-pressed')).toBe('true');
    expect(multiSelectButton.getAttribute('aria-pressed')).toBe('true');
    expect(screen.queryByRole('textbox', { name: copy.noticeText })).toBeNull();
    expect(document.activeElement).toBe(firstNoticeButton);
  });

  it.each(singleNoticeDeletionCases)(
    'deletes only the focused single selection with $key in $locale',
    ({ locale, addPaperLabels, selectedNoticeLabel, remainingNoticeLabel, key }) => {
      const { container } = render(<NoticeBoardCreatorWorkbench locale={locale} />);
      for (const addPaperLabel of addPaperLabels) {
        fireEvent.click(screen.getByRole('button', { name: addPaperLabel }));
      }

      const selectedNoticeButton = screen.getByRole('button', { name: selectedNoticeLabel });
      const remainingNoticeButton = screen.getByRole('button', { name: remainingNoticeLabel });
      selectedNoticeButton.focus();
      fireEvent.click(selectedNoticeButton);
      expect(selectedNoticeButton.getAttribute('aria-pressed')).toBe('true');
      expect(document.activeElement).toBe(selectedNoticeButton);
      expect(dispatchFocusedKeyDown(selectedNoticeButton, { key })).toBe(false);

      expect(selectedNoticeButton.isConnected).toBe(false);
      expect(remainingNoticeButton.isConnected).toBe(true);
      expect(remainingNoticeButton.getAttribute('aria-pressed')).toBe('false');
      expect(document.activeElement).toBe(getNoticeBoardWorkbenchElement(container));
    },
  );

  it('deletes only selected notices in multi-select and leaves focus on the workbench', () => {
    const { container } = render(<NoticeBoardCreatorWorkbench locale="en" />);
    for (const addPaperLabel of ['Add paper 01', 'Add paper 02', 'Add paper 03']) {
      fireEvent.click(screen.getByRole('button', { name: addPaperLabel }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'Multi' }));

    const firstNoticeButton = screen.getByRole('button', { name: 'Notice 1' });
    const unselectedNoticeButton = screen.getByRole('button', { name: 'Notice 2' });
    const thirdNoticeButton = screen.getByRole('button', { name: 'Notice 3' });
    firstNoticeButton.focus();
    fireEvent.click(firstNoticeButton);
    expect(firstNoticeButton.getAttribute('aria-pressed')).toBe('true');
    expect(unselectedNoticeButton.getAttribute('aria-pressed')).toBe('false');
    expect(thirdNoticeButton.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(firstNoticeButton);
    expect(dispatchFocusedKeyDown(firstNoticeButton, { key: 'Backspace' })).toBe(false);

    expect(firstNoticeButton.isConnected).toBe(false);
    expect(thirdNoticeButton.isConnected).toBe(false);
    expect(unselectedNoticeButton.isConnected).toBe(true);
    expect(unselectedNoticeButton.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: 'Multi' }).getAttribute('aria-pressed')).toBe('false');
    expect(document.activeElement).toBe(getNoticeBoardWorkbenchElement(container));
  });

  it.each(['Delete', 'Backspace'] as const)(
    'does nothing when %s is pressed with no selected notices',
    (key) => {
      const { container } = render(<NoticeBoardCreatorWorkbench locale="en" />);
      const workbenchElement = getNoticeBoardWorkbenchElement(container);
      workbenchElement.focus();

      expect(document.activeElement).toBe(workbenchElement);
      expect(dispatchFocusedKeyDown(workbenchElement, { key })).toBe(true);
      expect(container.querySelector('[data-notice-id]')).toBeNull();
      expect(document.activeElement).toBe(workbenchElement);
    },
  );

  it.each(guardedNoticeDeletionCases)(
    'does not delete when $modifierLabel is active',
    (keyEventCase) => {
      render(<NoticeBoardCreatorWorkbench locale="en" />);
      fireEvent.click(screen.getByRole('button', { name: 'Add paper 01' }));
      const noticeButton = screen.getByRole('button', { name: 'Notice 1' });
      noticeButton.focus();
      const { modifierLabel, ...keyEventOptions } = keyEventCase;

      expect(
        dispatchFocusedKeyDown(noticeButton, keyEventOptions),
        `Expected ${JSON.stringify(modifierLabel)} keydown not to be canceled.`,
      ).toBe(true);
      expect(noticeButton.isConnected).toBe(true);
      expect(noticeButton.getAttribute('aria-pressed')).toBe('true');
    },
  );

  it('does not intercept deletion keys in text controls, selects, or an open dialog', () => {
    const copy = getNoticeBoardEditorCopy('en');
    render(<NoticeBoardCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Add paper 01' }));
    const noticeButton = screen.getByRole('button', { name: 'Notice 1' });

    const noticeTextEditor = screen.getByRole('textbox', { name: copy.noticeText }) as HTMLTextAreaElement;
    fireEvent.change(noticeTextEditor, { target: { value: 'A notice to keep.' } });
    noticeTextEditor.focus();
    expect(dispatchFocusedKeyDown(noticeTextEditor, { key: 'Backspace' })).toBe(true);
    expect(noticeButton.isConnected).toBe(true);

    const fontFamilySelect = screen.getByLabelText(copy.fontFamily) as HTMLSelectElement;
    fontFamilySelect.focus();
    expect(dispatchFocusedKeyDown(fontFamilySelect, { key: 'Delete' })).toBe(true);
    expect(noticeButton.isConnected).toBe(true);

    const fontSizeInput = screen.getByRole('spinbutton', { name: copy.fontSize }) as HTMLInputElement;
    fontSizeInput.focus();
    expect(dispatchFocusedKeyDown(fontSizeInput, { key: 'Backspace' })).toBe(true);
    expect(noticeButton.isConnected).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: copy.help }));
    const helpDialog = screen.getByRole('dialog');
    const closeHelpButton = within(helpDialog).getByRole('button', { name: copy.close });
    closeHelpButton.focus();
    expect(dispatchFocusedKeyDown(closeHelpButton, { key: 'Delete' })).toBe(true);
    expect(noticeButton.isConnected).toBe(true);
  });

  it('does not delete the selected notice when an earlier key handler canceled the event', () => {
    render(<NoticeBoardCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Add paper 01' }));
    const noticeButton = screen.getByRole('button', { name: 'Notice 1' });
    noticeButton.focus();
    const canceledDeleteEvent = createEvent.keyDown(noticeButton, { key: 'Delete' });
    canceledDeleteEvent.preventDefault();

    expect(fireEvent(noticeButton, canceledDeleteEvent)).toBe(false);
    expect(noticeButton.isConnected).toBe(true);
    expect(noticeButton.getAttribute('aria-pressed')).toBe('true');
  });

  it.each([
    { locale: 'en' as const, addPaperLabel: 'Add paper 01', noticeLabel: 'Notice 1' },
    { locale: 'zh' as const, addPaperLabel: '添加纸张 01', noticeLabel: '公告 1' },
  ])('keeps arrow movement and +/- resizing for $locale', ({ locale, addPaperLabel, noticeLabel }) => {
    render(<NoticeBoardCreatorWorkbench locale={locale} />);
    fireEvent.click(screen.getByRole('button', { name: addPaperLabel }));
    const noticeButton = screen.getByRole('button', { name: noticeLabel });
    const noticeCardElement = getNoticeCardElement(noticeButton);
    noticeButton.focus();

    dispatchFocusedKeyDown(noticeButton, { key: 'ArrowRight' });
    dispatchFocusedKeyDown(noticeButton, { key: 'ArrowDown' });
    expect({ left: noticeCardElement.style.left, top: noticeCardElement.style.top }).toEqual({
      left: '5px',
      top: '5px',
    });

    dispatchFocusedKeyDown(noticeButton, { key: '+' });
    expect(noticeCardElement.style.width).toBe('210px');
    dispatchFocusedKeyDown(noticeButton, { key: '-' });
    expect(noticeCardElement.style.width).toBe('200px');
  });

  it.each([
    {
      locale: 'en' as const,
      addPaperLabels: ['Add paper 01', 'Add paper 02', 'Add paper 03'] as const,
      noticeLabels: ['Notice 1', 'Notice 2', 'Notice 3'] as const,
      noticeTextLabel: 'Notice text',
      textColorLabel: 'Text color',
    },
    {
      locale: 'zh' as const,
      addPaperLabels: ['添加纸张 01', '添加纸张 02', '添加纸张 03'] as const,
      noticeLabels: ['公告 1', '公告 2', '公告 3'] as const,
      noticeTextLabel: '公告文字',
      textColorLabel: '文字颜色',
    },
  ])('commits batch formatting only to selected notices for $locale', ({
    locale,
    addPaperLabels,
    noticeLabels,
    noticeTextLabel,
    textColorLabel,
  }) => {
    const copy = getNoticeBoardEditorCopy(locale);
    render(<NoticeBoardCreatorWorkbench locale={locale} />);

    const noticeBodies = ['A selected notice.', 'An unselected notice.', 'Another selected notice.'];
    for (const [noticeIndex, paperLabel] of addPaperLabels.entries()) {
      const noticeBody = noticeBodies[noticeIndex];
      if (noticeBody === undefined) {
        throw new Error(`Missing seeded notice body for index ${noticeIndex}.`);
      }
      fireEvent.click(screen.getByRole('button', { name: paperLabel }));
      fireEvent.change(screen.getByRole('textbox', { name: noticeTextLabel }), {
        target: { value: noticeBody },
      });
    }

    const toolbarTitle = screen.getByRole('heading', { level: 2, name: copy.toolTitle });
    const toolbarElement = toolbarTitle.closest('header');
    if (!(toolbarElement instanceof HTMLElement)) {
      throw new Error(`The notice board toolbar is missing for locale ${JSON.stringify(locale)}.`);
    }
    fireEvent.click(within(toolbarElement).getByRole('button', { name: copy.multiSelect }));

    const firstNoticeButton = screen.getByRole('button', { name: noticeLabels[0] });
    const unselectedNoticeButton = screen.getByRole('button', { name: noticeLabels[1] });
    const thirdNoticeButton = screen.getByRole('button', { name: noticeLabels[2] });
    fireEvent.click(firstNoticeButton);

    expect(firstNoticeButton.getAttribute('aria-pressed')).toBe('true');
    expect(unselectedNoticeButton.getAttribute('aria-pressed')).toBe('false');
    expect(thirdNoticeButton.getAttribute('aria-pressed')).toBe('true');
    expect(screen.queryByRole('textbox', { name: noticeTextLabel })).toBeNull();
    expect(screen.queryByRole('button', { name: /Resize notice|缩放公告/ })).toBeNull();

    const selectedColorInput = screen.getByLabelText(textColorLabel) as HTMLInputElement;
    const firstContent = getNoticeContentElement(firstNoticeButton);
    const unselectedContent = getNoticeContentElement(unselectedNoticeButton);
    const thirdContent = getNoticeContentElement(thirdNoticeButton);
    const defaultTextColor = firstContent.style.color;
    expect(unselectedContent.style.color).toBe(defaultTextColor);
    expect(thirdContent.style.color).toBe(defaultTextColor);

    fireEvent.change(selectedColorInput, { target: { value: '#228844' } });
    expect(firstContent.style.color).toBe(defaultTextColor);
    expect(unselectedContent.style.color).toBe(defaultTextColor);
    expect(thirdContent.style.color).toBe(defaultTextColor);

    const applyFormattingButton = getApplyFormattingButton(copy);
    expect(applyFormattingButton.hasAttribute('disabled')).toBe(false);
    fireEvent.click(applyFormattingButton);
    expect(firstContent.style.color).toBe('rgb(34, 136, 68)');
    expect(unselectedContent.style.color).toBe(defaultTextColor);
    expect(thirdContent.style.color).toBe('rgb(34, 136, 68)');

    const firstNoticeCard = firstNoticeButton.closest('[data-notice-id]');
    const thirdNoticeCard = thirdNoticeButton.closest('[data-notice-id]');
    if (!(firstNoticeCard instanceof HTMLElement) || !(thirdNoticeCard instanceof HTMLElement)) {
      throw new Error('Selected notices must expose their board positions.');
    }
    const firstPosition = { left: firstNoticeCard.style.left, top: firstNoticeCard.style.top };
    const thirdPosition = { left: thirdNoticeCard.style.left, top: thirdNoticeCard.style.top };

    fireEvent.pointerDown(firstNoticeButton, {
      pointerId: 1,
      button: 0,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerMove(firstNoticeButton, {
      pointerId: 1,
      clientX: 140,
      clientY: 120,
    });
    fireEvent.pointerUp(firstNoticeButton, { pointerId: 1 });

    expect({ left: firstNoticeCard.style.left, top: firstNoticeCard.style.top }).toEqual(firstPosition);
    expect({ left: thirdNoticeCard.style.left, top: thirdNoticeCard.style.top }).toEqual(thirdPosition);

    const filesDialog = openSaveOpenDialog(copy.saveOpen);
    fireEvent.click(within(filesDialog).getByRole('button', { name: copy.saveSlot(1) }));
    const savedProject = loadNoticeBoardSlot(isolatedNoticeBoardStorage, 1);
    if (savedProject === null) {
      throw new Error('Expected the batch-formatted board to be saved in slot 1.');
    }
    expect(savedProject.notices.map((notice) => notice.text)).toEqual(noticeBodies);
    expect(savedProject.notices.map((notice) => notice.style.color)).toEqual([
      '#228844',
      '#1d0f03',
      '#228844',
    ]);
  });

  it.each([
    {
      locale: 'en' as const,
      addPaperLabels: ['Add paper 01', 'Add paper 02'] as const,
      noticeLabels: ['Notice 1', 'Notice 2'] as const,
    },
    {
      locale: 'zh' as const,
      addPaperLabels: ['添加纸张 01', '添加纸张 02'] as const,
      noticeLabels: ['公告 1', '公告 2'] as const,
    },
  ])('keeps style drafts local and resets them when selection or mode changes for $locale', ({
    locale,
    addPaperLabels,
    noticeLabels,
  }) => {
    const copy = getNoticeBoardEditorCopy(locale);
    render(<NoticeBoardCreatorWorkbench locale={locale} />);

    for (const paperLabel of addPaperLabels) {
      fireEvent.click(screen.getByRole('button', { name: paperLabel }));
    }

    const firstNoticeButton = screen.getByRole('button', { name: noticeLabels[0] });
    const secondNoticeButton = screen.getByRole('button', { name: noticeLabels[1] });
    const firstContent = getNoticeContentElement(firstNoticeButton);
    const secondContent = getNoticeContentElement(secondNoticeButton);
    const defaultTextColor = firstContent.style.color;
    const fontSizeInput = screen.getByRole('spinbutton', { name: copy.fontSize }) as HTMLInputElement;
    const textColorInput = screen.getByLabelText(copy.textColor) as HTMLInputElement;

    fireEvent.change(fontSizeInput, { target: { value: '32' } });
    fireEvent.change(textColorInput, { target: { value: '#228844' } });
    expect(firstContent.style.fontSize).toBe('20px');
    expect(secondContent.style.fontSize).toBe('20px');
    expect(firstContent.style.color).toBe(defaultTextColor);
    expect(secondContent.style.color).toBe(defaultTextColor);

    fireEvent.click(firstNoticeButton);
    const resetFontSizeInput = screen.getByRole('spinbutton', { name: copy.fontSize }) as HTMLInputElement;
    const resetTextColorInput = screen.getByLabelText(copy.textColor) as HTMLInputElement;
    expect(resetFontSizeInput.value).toBe('20');
    expect(resetTextColorInput.value).toBe('#1d0f03');
    expect(firstContent.style.fontSize).toBe('20px');
    expect(firstContent.style.color).toBe(defaultTextColor);

    fireEvent.change(resetFontSizeInput, { target: { value: '28' } });
    const toolbarTitle = screen.getByRole('heading', { level: 2, name: copy.toolTitle });
    const toolbarElement = toolbarTitle.closest('header');
    if (!(toolbarElement instanceof HTMLElement)) {
      throw new Error(`The notice board toolbar is missing for locale ${JSON.stringify(locale)}.`);
    }
    fireEvent.click(within(toolbarElement).getByRole('button', { name: copy.multiSelect }));
    expect(screen.getByRole('spinbutton', { name: copy.fontSize })).toHaveProperty('value', '20');
    fireEvent.click(within(toolbarElement).getByRole('button', { name: copy.finishMultiSelect }));
    expect(screen.getByRole('spinbutton', { name: copy.fontSize })).toHaveProperty('value', '20');
    expect(firstContent.style.fontSize).toBe('20px');
  });

  it.each(['en', 'zh'] as const)('provides a safe Google Fonts library link for %s', (locale) => {
    const copy = getNoticeBoardEditorCopy(locale);
    render(<NoticeBoardCreatorWorkbench locale={locale} />);
    fireEvent.click(screen.getByRole('button', { name: copy.addPaperLabel(1) }));
    fireEvent.click(screen.getByRole('button', { name: copy.addFont }));

    const fontsDialog = screen.getByRole('dialog');
    const googleFontsLibraryLink = within(fontsDialog).getByRole('link', {
      name: copy.browseGoogleFonts,
    });
    expect(googleFontsLibraryLink.getAttribute('href')).toBe('https://fonts.google.com/');
    expect(googleFontsLibraryLink.getAttribute('target')).toBe('_blank');
    expect(googleFontsLibraryLink.getAttribute('rel')?.split(/\s+/)).toEqual(
      expect.arrayContaining(['noopener', 'noreferrer']),
    );
  });

  it.each(['en', 'zh'] as const)('shows the localized desktop quick-start and output guidance for %s', (locale) => {
    const copy = getNoticeBoardEditorCopy(locale);
    render(<NoticeBoardCreatorWorkbench locale={locale} />);

    expect(screen.getByRole('heading', { name: copy.quickStartTitle })).toBeTruthy();
    expect(screen.getByText(copy.quickStartSteps)).toBeTruthy();
    expect(screen.getByRole('heading', { name: copy.savingOutputTitle })).toBeTruthy();
    expect(screen.getByText(copy.savingOutputDescription)).toBeTruthy();
  });

  it.each(['en', 'zh'] as const)('opens and closes the localized mobile paper panel for %s', (locale) => {
    const copy = getNoticeBoardEditorCopy(locale);
    render(<NoticeBoardCreatorWorkbench locale={locale} />);

    const mobileNavigation = screen.getByRole('navigation', { name: copy.mobileNavigation });
    const papersTab = within(mobileNavigation).getByRole('button', { name: copy.papersTab });
    expect(papersTab.getAttribute('aria-pressed')).toBe('true');

    const paperPanelHeading = screen.getByRole('heading', { name: copy.papersTitle });
    const paperPanel = paperPanelHeading.closest('section');
    if (!(paperPanel instanceof HTMLElement)) {
      throw new Error(`The paper panel is missing for locale ${JSON.stringify(locale)}.`);
    }
    fireEvent.click(within(paperPanel).getByRole('button', { name: copy.closePanel }));
    expect(papersTab.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(papersTab);
    expect(papersTab.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(within(paperPanel).getByRole('button', { name: copy.closePanel }));
    expect(papersTab.getAttribute('aria-pressed')).toBe('false');
  });

  it('gates mobile controls on workbench visibility without reopening a user-closed panel', () => {
    const copy = getNoticeBoardEditorCopy('en');
    const intersectionObserver = createControlledNoticeBoardIntersectionObserver();
    const { container } = render(<NoticeBoardCreatorWorkbench locale="en" />);

    const workbench = container.querySelector('[data-notice-board-workbench]');
    if (!(workbench instanceof HTMLElement)) {
      throw new Error('The notice board workbench root is missing.');
    }
    expect(intersectionObserver.observedTargets).toContain(workbench);
    expect(workbench.getAttribute('data-mobile-controls-visible')).toBe('false');

    const mobileNavigation = within(workbench).getByRole('navigation', { name: copy.mobileNavigation });
    const papersTab = within(mobileNavigation).getByRole('button', { name: copy.papersTab });
    expect(papersTab.getAttribute('aria-pressed')).toBe('true');

    act(() => intersectionObserver.reportIntersection(true));
    expect(workbench.getAttribute('data-mobile-controls-visible')).toBe('true');
    expect(papersTab.getAttribute('aria-pressed')).toBe('true');

    const paperPanelHeading = screen.getByRole('heading', { name: copy.papersTitle });
    const paperPanel = paperPanelHeading.closest('section');
    if (!(paperPanel instanceof HTMLElement)) {
      throw new Error('The paper panel is missing after the workbench became visible.');
    }
    fireEvent.click(within(paperPanel).getByRole('button', { name: copy.closePanel }));
    expect(papersTab.getAttribute('aria-pressed')).toBe('false');

    act(() => intersectionObserver.reportIntersection(false));
    expect(workbench.getAttribute('data-mobile-controls-visible')).toBe('false');
    act(() => intersectionObserver.reportIntersection(true));
    expect(workbench.getAttribute('data-mobile-controls-visible')).toBe('true');
    expect(papersTab.getAttribute('aria-pressed')).toBe('false');
  });

  it.each([
    {
      locale: 'en' as const,
      addPaperLabel: 'Add paper 01',
      settingsLabel: 'Board settings',
      dragLabel: 'Drag notices',
      resizeLabel: 'Resize notices',
      noticeTextLabel: 'Notice text',
      closeLabel: 'Close',
    },
    {
      locale: 'zh' as const,
      addPaperLabel: '添加纸张 01',
      settingsLabel: '公告板设置',
      dragLabel: '拖动公告',
      resizeLabel: '缩放公告',
      noticeTextLabel: '公告文字',
      closeLabel: '关闭',
    },
  ])('keeps drag, resize, and text editing independent for $locale', ({
    locale,
    addPaperLabel,
    settingsLabel,
    dragLabel,
    resizeLabel,
    noticeTextLabel,
    closeLabel,
  }) => {
    render(<NoticeBoardCreatorWorkbench locale={locale} />);
    fireEvent.click(screen.getByRole('button', { name: addPaperLabel }));
    fireEvent.click(screen.getByRole('button', { name: settingsLabel }));

    const settingsDialog = screen.getByRole('dialog');
    const dragToggle = within(settingsDialog).getByRole('checkbox', { name: dragLabel }) as HTMLInputElement;
    const resizeToggle = within(settingsDialog).getByRole('checkbox', { name: resizeLabel }) as HTMLInputElement;

    fireEvent.click(dragToggle);
    expect(dragToggle.checked).toBe(false);
    expect(resizeToggle.checked).toBe(true);
    fireEvent.click(resizeToggle);
    expect(dragToggle.checked).toBe(false);
    expect(resizeToggle.checked).toBe(false);

    fireEvent.click(within(settingsDialog).getByRole('button', { name: closeLabel }));
    const textEditor = screen.getByRole('textbox', { name: noticeTextLabel }) as HTMLTextAreaElement;
    expect(textEditor.disabled).toBe(false);
    fireEvent.change(textEditor, { target: { value: 'Text stays editable with layout controls off.' } });
    expect(textEditor.value).toBe('Text stays editable with layout controls off.');
  });

  it('uses one Save/Open dialog for four slots, TXT input, print, and screenshot guidance', () => {
    render(<NoticeBoardCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Add paper 01' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Notice text' }), {
      target: { value: 'A courier seeks a guide to the northern pass.' },
    });

    const saveOpenButtons = screen.getAllByRole('button', { name: 'Save/Open' });
    expect(saveOpenButtons.length).toBeGreaterThan(0);
    fireEvent.click(saveOpenButtons[0] as HTMLButtonElement);

    const saveOpenDialog = screen.getByRole('dialog');
    expect(within(saveOpenDialog).getByRole('heading', { name: 'Save, open and output' })).toBeTruthy();
    for (const slotIndex of [1, 2, 3, 4]) {
      expect(within(saveOpenDialog).getByRole('button', { name: `Save slot ${slotIndex}` })).toBeTruthy();
      expect(within(saveOpenDialog).getByRole('button', { name: `Load slot ${slotIndex}` })).toBeTruthy();
    }
    expect(within(saveOpenDialog).getByRole('button', { name: 'Save TXT' })).toBeTruthy();
    expect(within(saveOpenDialog).getByLabelText('Load TXT file')).toBeTruthy();
    expect(within(saveOpenDialog).getByRole('button', { name: 'Print board' })).toBeTruthy();
    expect(
      within(saveOpenDialog).getByText(getNoticeBoardEditorCopy('en').screenshotInstructions),
    ).toBeTruthy();

    const unsupportedActionName = /delete|duplicate|undo|png|\bai\b/i;
    expect(
      within(saveOpenDialog)
        .queryAllByRole('button')
        .some((button) => unsupportedActionName.test(button.getAttribute('aria-label') ?? button.textContent ?? '')),
    ).toBe(false);

    const originalNoticeText = 'A courier seeks a guide to the northern pass.';
    fireEvent.click(within(saveOpenDialog).getByRole('button', { name: 'Save slot 1' }));
    fireEvent.click(within(saveOpenDialog).getByRole('button', { name: 'Close' }));

    const noticeTextEditor = screen.getByRole('textbox', { name: 'Notice text' }) as HTMLTextAreaElement;
    fireEvent.change(noticeTextEditor, { target: { value: 'The saved text was replaced.' } });
    const reopenedSaveOpenTrigger = screen.getAllByRole('button', { name: 'Save/Open' })[0];
    if (reopenedSaveOpenTrigger === undefined) {
      throw new Error('The Save/Open trigger is missing after closing its dialog.');
    }
    fireEvent.click(reopenedSaveOpenTrigger);
    const reopenedSaveDialog = screen.getByRole('dialog');
    fireEvent.click(within(reopenedSaveDialog).getByRole('button', { name: 'Load slot 1' }));
    fireEvent.click(within(reopenedSaveDialog).getByRole('button', { name: 'Close' }));

    expect(screen.getByRole('textbox', { name: 'Notice text' })).toHaveProperty('value', originalNoticeText);
  });

  it.each(['en', 'zh'] as const)('blocks invalid style drafts until they are corrected and applied for %s', (locale) => {
    const copy = getNoticeBoardEditorCopy(locale);
    render(<NoticeBoardCreatorWorkbench locale={locale} />);
    fireEvent.click(screen.getByRole('button', { name: copy.addPaperLabel(1) }));

    fireEvent.change(screen.getByRole('spinbutton', { name: copy.fontSize }), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: copy.lineHeight }), {
      target: { value: '193' },
    });

    const invalidStyleAlerts = screen.getAllByRole('alert').map((alert) => alert.textContent ?? '').join(' ');
    expect(invalidStyleAlerts).toContain(copy.fontSizeInvalid('1000'));
    expect(invalidStyleAlerts).toContain(copy.lineHeightInvalid('193'));
    expect(getApplyFormattingButton(copy).hasAttribute('disabled')).toBe(true);

    const filesDialog = openSaveOpenDialog(copy.saveOpen);
    fireEvent.click(within(filesDialog).getByRole('button', { name: copy.saveSlot(1) }));
    const savedInvalidProject = loadNoticeBoardSlot(isolatedNoticeBoardStorage, 1);
    if (savedInvalidProject === null) {
      throw new Error('Expected slot 1 to contain the project saved with rejected number drafts.');
    }
    expect(savedInvalidProject.notices[0]?.style.fontSize).toBe(20);
    expect(savedInvalidProject.notices[0]?.style.lineHeight).toBe(20);
    fireEvent.click(within(filesDialog).getByRole('button', { name: copy.close }));

    fireEvent.change(screen.getByRole('spinbutton', { name: copy.fontSize }), {
      target: { value: '24' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: copy.lineHeight }), {
      target: { value: '32' },
    });
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
    const applyFormattingButton = getApplyFormattingButton(copy);
    expect(applyFormattingButton.hasAttribute('disabled')).toBe(false);
    fireEvent.click(applyFormattingButton);

    const reopenedFilesDialog = openSaveOpenDialog(copy.saveOpen);
    fireEvent.click(within(reopenedFilesDialog).getByRole('button', { name: copy.saveSlot(1) }));
    const savedCorrectedProject = loadNoticeBoardSlot(isolatedNoticeBoardStorage, 1);
    if (savedCorrectedProject === null) {
      throw new Error('Expected slot 1 to contain the project after correcting number inputs.');
    }
    expect(savedCorrectedProject.notices[0]?.style.fontSize).toBe(24);
    expect(savedCorrectedProject.notices[0]?.style.lineHeight).toBe(32);
  });

  it('shows the loaded board width when Settings is opened for the first time', () => {
    const loadedProject = createNoticeBoardProject(1280, 'The board width survives loading.');
    isolatedNoticeBoardStorage.storedProjectsByKey.set(
      'notice-board-creator:slot:1',
      serializeNoticeBoardFile(loadedProject),
    );

    render(<NoticeBoardCreatorWorkbench locale="en" />);
    const filesDialog = openSaveOpenDialog();
    fireEvent.click(within(filesDialog).getByRole('button', { name: 'Load slot 1' }));
    fireEvent.click(within(filesDialog).getByRole('button', { name: 'Close' }));
    fireEvent.click(screen.getByRole('button', { name: 'Board settings' }));

    const boardWidthInput = screen.getByRole('spinbutton', { name: 'Board width px' }) as HTMLInputElement;
    expect(boardWidthInput.value).toBe('1280');
  });

  it('isolates one corrupt save slot and lets users read and save the other slots', () => {
    const unaffectedSlotIndexes = [1, 3, 4] as const satisfies readonly NoticeBoardSlotIndex[];
    for (const slotIndex of unaffectedSlotIndexes) {
      isolatedNoticeBoardStorage.storedProjectsByKey.set(
        `notice-board-creator:slot:${slotIndex}`,
        serializeNoticeBoardFile(createNoticeBoardProject(960, `Saved project ${slotIndex}`)),
      );
    }
    isolatedNoticeBoardStorage.storedProjectsByKey.set('notice-board-creator:slot:2', '{broken');

    render(<NoticeBoardCreatorWorkbench locale="en" />);
    const filesDialog = openSaveOpenDialog();
    expect(within(filesDialog).getByRole('alert').textContent).toContain('slot 2');
    expect(within(filesDialog).getByRole('alert').textContent).toContain('{broken');
    expect(within(filesDialog).getByRole('button', { name: 'Load slot 2' }).hasAttribute('disabled')).toBe(true);
    expect(within(filesDialog).getByRole('button', { name: 'Save slot 2' }).hasAttribute('disabled')).toBe(false);

    for (const slotIndex of unaffectedSlotIndexes) {
      const loadButton = within(filesDialog).getByRole('button', { name: `Load slot ${slotIndex}` });
      const saveButton = within(filesDialog).getByRole('button', { name: `Save slot ${slotIndex}` });
      expect(loadButton.hasAttribute('disabled')).toBe(false);
      expect(saveButton.hasAttribute('disabled')).toBe(false);

      fireEvent.click(loadButton);
      expect(within(filesDialog).getByRole('status').textContent).toBe('Loaded the saved board.');
      fireEvent.click(saveButton);
      expect(within(filesDialog).getByRole('status').textContent).toBe('Saved to this browser.');
    }

    fireEvent.click(within(filesDialog).getByRole('button', { name: 'Save slot 2' }));
    expect(within(filesDialog).getByRole('button', { name: 'Load slot 2' }).hasAttribute('disabled')).toBe(false);
    const recoveredSlotProject = loadNoticeBoardSlot(isolatedNoticeBoardStorage, 2);
    if (recoveredSlotProject === null) {
      throw new Error('Expected explicit Save to replace the corrupt slot 2 record.');
    }
    expect(recoveredSlotProject.notices[0]?.text).toBe('Saved project 4');
  });

  it('rejects oversized TXT files before reading them and preserves the current board', async () => {
    const originalNoticeText = 'Keep this board when the incoming file is too large.';
    render(<NoticeBoardCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Add paper 01' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Notice text' }), {
      target: { value: originalNoticeText },
    });
    const filesDialog = openSaveOpenDialog();
    const oversizedProjectFile = new File(
      [new Uint8Array(NOTICE_BOARD_MAX_PROJECT_FILE_BYTES + 1)],
      'oversized-notice-board.txt',
      { type: 'text/plain' },
    );
    const fileTextReader = vi.fn(() => Promise.resolve('{not read}'));
    Object.defineProperty(oversizedProjectFile, 'text', {
      configurable: true,
      value: fileTextReader,
    });

    fireEvent.change(within(filesDialog).getByLabelText('Load TXT file'), {
      target: { files: [oversizedProjectFile] },
    });
    const oversizedFileAlert = await within(filesDialog).findByRole('alert');
    expect(oversizedFileAlert.textContent).toContain('oversized-notice-board.txt');
    expect(oversizedFileAlert.textContent).toContain(String(NOTICE_BOARD_MAX_PROJECT_FILE_BYTES + 1));
    expect(oversizedFileAlert.textContent).toContain(String(NOTICE_BOARD_MAX_PROJECT_FILE_BYTES));
    expect(fileTextReader).not.toHaveBeenCalled();

    fireEvent.click(within(filesDialog).getByRole('button', { name: 'Close' }));
    expect(screen.getByRole('textbox', { name: 'Notice text' })).toHaveProperty(
      'value',
      originalNoticeText,
    );
  });

  it('rejects a twenty-fifth custom font without making the saved project invalid', () => {
    const existingCustomFonts = Array.from(
      { length: NOTICE_BOARD_MAX_CUSTOM_FONTS },
      (_, fontIndex) => createGoogleFontAtIndex(fontIndex + 1),
    );
    isolatedNoticeBoardStorage.storedProjectsByKey.set(
      'notice-board-creator:slot:1',
      serializeNoticeBoardFile(createNoticeBoardProject(960, 'Twenty-four fonts are saved.', existingCustomFonts)),
    );

    render(<NoticeBoardCreatorWorkbench locale="en" />);
    const filesDialog = openSaveOpenDialog();
    fireEvent.click(within(filesDialog).getByRole('button', { name: 'Load slot 1' }));
    fireEvent.click(within(filesDialog).getByRole('button', { name: 'Close' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add font' }));

    const fontDialog = screen.getByRole('dialog');
    const nextFont = createGoogleFontAtIndex(NOTICE_BOARD_MAX_CUSTOM_FONTS + 1);
    fireEvent.change(within(fontDialog).getByLabelText('Google Fonts link code'), {
      target: { value: nextFont.stylesheetUrl },
    });
    fireEvent.change(within(fontDialog).getByLabelText('Font-family declaration'), {
      target: { value: nextFont.family },
    });
    fireEvent.click(within(fontDialog).getByRole('button', { name: 'Add to font list' }));

    const fontLimitAlert = within(fontDialog).getByRole('alert');
    expect(fontLimitAlert.textContent).toContain(
      getNoticeBoardEditorCopy('en').fontLimitReached(
        nextFont.family,
        NOTICE_BOARD_MAX_CUSTOM_FONTS,
        NOTICE_BOARD_MAX_CUSTOM_FONTS,
      ),
    );
    expect(within(fontDialog).getByRole('list').querySelectorAll('li')).toHaveLength(
      NOTICE_BOARD_MAX_CUSTOM_FONTS,
    );
    fireEvent.click(within(fontDialog).getByRole('button', { name: 'Close' }));

    const reopenedFilesDialog = openSaveOpenDialog();
    fireEvent.click(within(reopenedFilesDialog).getByRole('button', { name: 'Save slot 1' }));
    const savedProject = loadNoticeBoardSlot(isolatedNoticeBoardStorage, 1);
    if (savedProject === null) {
      throw new Error('Expected slot 1 to remain saveable after rejecting an additional font.');
    }
    expect(savedProject.customFonts).toHaveLength(NOTICE_BOARD_MAX_CUSTOM_FONTS);
  });

  it('rejects a custom font whose family only differs by letter case', () => {
    const existingFont = parseGoogleFontInputs(
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap',
      'Open Sans',
    );
    isolatedNoticeBoardStorage.storedProjectsByKey.set(
      'notice-board-creator:slot:1',
      serializeNoticeBoardFile(createNoticeBoardProject(960, 'The original font remains valid.', [existingFont])),
    );

    render(<NoticeBoardCreatorWorkbench locale="en" />);
    const filesDialog = openSaveOpenDialog();
    fireEvent.click(within(filesDialog).getByRole('button', { name: 'Load slot 1' }));
    fireEvent.click(within(filesDialog).getByRole('button', { name: 'Close' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add font' }));

    const fontDialog = screen.getByRole('dialog');
    fireEvent.change(within(fontDialog).getByLabelText('Google Fonts link code'), {
      target: {
        value: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@500&display=swap',
      },
    });
    fireEvent.change(within(fontDialog).getByLabelText('Font-family declaration'), {
      target: { value: 'open sans' },
    });
    fireEvent.click(within(fontDialog).getByRole('button', { name: 'Add to font list' }));

    expect(within(fontDialog).getByRole('alert').textContent?.toLowerCase()).toContain('open sans');
    const listedFonts = within(fontDialog).getByRole('list').querySelectorAll('li');
    expect(listedFonts).toHaveLength(1);
    expect(listedFonts[0]?.textContent).toContain('Open Sans');
    fireEvent.click(within(fontDialog).getByRole('button', { name: 'Close' }));

    const reopenedFilesDialog = openSaveOpenDialog();
    fireEvent.click(within(reopenedFilesDialog).getByRole('button', { name: 'Save slot 1' }));
    const savedProject = loadNoticeBoardSlot(isolatedNoticeBoardStorage, 1);
    if (savedProject === null) {
      throw new Error('Expected the saved project to remain available after rejecting a duplicate font.');
    }
    expect(savedProject.customFonts).toEqual([existingFont]);
  });
});
