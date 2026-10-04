// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ArmyFormationCreator } from '@/components/army-formation/ArmyFormationCreator';
import * as armyFormationBackgroundUpload from '@/lib/army-formation/background-image-upload';
import { getArmyFormationCreatorCopy } from '@/lib/army-formation/copy';
import {
  toArmyFormationMapPoint,
  type ArmyFormationBackgroundTransform,
} from '@/lib/army-formation/background-image-geometry';
import { ARMY_FORMATION_DOCUMENT_STORAGE_KEY } from '@/lib/army-formation/browser-saves';
import {
  addArmyFormationPiece,
  createEmptyArmyFormationDocument,
  rotateSelectedArmyFormationPieces,
  setArmyBackgroundImageUrlForBattlefield,
  serializeArmyFormationDocument,
  setArmyBackgroundImageUrl,
  toggleArmyFormationPieceSelection,
  type ArmyFormationDocument,
} from '@/lib/army-formation/document';
import * as armyFormationImageExport from '@/lib/army-formation/export-image';

let originalWindowMatchMedia: PropertyDescriptor | undefined;

function pieceButtons(): HTMLButtonElement[] {
  return [...document.querySelectorAll('[data-army-piece]')].map((piece) => {
    if (!(piece instanceof HTMLButtonElement)) {
      throw new Error(`Army piece button is missing. Received ${piece.constructor.name}.`);
    }

    return piece;
  });
}

function piecePosition(piece: HTMLButtonElement): string {
  const x = piece.getAttribute('data-piece-x');
  const y = piece.getAttribute('data-piece-y');
  if (x === null || y === null) {
    throw new Error(`Army piece is missing a position. x=${String(x)} y=${String(y)}.`);
  }

  return `${x},${y}`;
}

function requireHeading(name: string): HTMLElement {
  const heading = [...document.querySelectorAll('h2')].find((node) => node.textContent === name);
  if (!(heading instanceof HTMLElement)) {
    throw new Error(`Army formation heading is missing. Received ${JSON.stringify(name)}.`);
  }

  return heading;
}

function controlGroup(title: string): HTMLElement {
  const group = requireHeading(title).parentElement;
  if (!(group instanceof HTMLElement) || group.tagName !== 'SECTION') {
    const received = group === null ? 'null' : group.tagName;
    throw new Error(
      `Army formation control group is missing. Received ${received} for ${JSON.stringify(title)}.`,
    );
  }

  return group;
}

function requireArmyFormationInput(label: string): HTMLInputElement {
  const input = screen.getByLabelText(label);
  if (!(input instanceof HTMLInputElement)) {
    throw new Error(`Army formation input is missing for ${JSON.stringify(label)}. Received ${input.constructor.name}.`);
  }

  return input;
}

function expectInputFailure(
  input: HTMLInputElement,
  expectedMessage: string,
  groupTitle: string,
): HTMLElement {
  expect(input.getAttribute('aria-invalid')).toBe('true');
  const descriptionIds = input.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
  const failure = descriptionIds
    .map((descriptionId) => document.getElementById(descriptionId))
    .find((description) => description?.textContent === expectedMessage);
  if (!(failure instanceof HTMLElement)) {
    throw new Error(
      `Input ${JSON.stringify(input.value)} has no associated error ${JSON.stringify(expectedMessage)}. aria-describedby=${JSON.stringify(descriptionIds)}.`,
    );
  }

  expect(controlGroup(groupTitle).contains(failure)).toBe(true);
  expect(input.compareDocumentPosition(failure) & Node.DOCUMENT_POSITION_FOLLOWING)
    .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(failure.closest('.fixed')).toBeNull();
  return failure;
}

function requireSharedControlContainer(
  failure: HTMLElement,
  buttons: HTMLElement[],
): HTMLElement {
  let container = failure.parentElement;
  while (container !== null && !buttons.every((button) => container?.contains(button))) {
    container = container.parentElement;
  }
  if (container === null) {
    throw new Error(`Error ${JSON.stringify(failure.textContent)} has no container shared with its controls.`);
  }

  return container;
}

function expectFixedBottomRightFailure(failure: HTMLElement): HTMLElement {
  const notice = failure.closest('.fixed');
  if (!(notice instanceof HTMLElement)) {
    throw new Error(`Error ${JSON.stringify(failure.textContent)} is missing its fixed notification.`);
  }

  expect([...notice.classList].some((className) => className.startsWith('bottom-'))).toBe(true);
  expect([...notice.classList].some((className) => className.startsWith('right-'))).toBe(true);
  return notice;
}

function requireScrollableArmyFormationFailureDismissButton(
  failure: HTMLElement,
  dismissLabel: string,
): HTMLButtonElement {
  const notice = expectFixedBottomRightFailure(failure);
  const failureClassNames = [...failure.classList];
  expect(failureClassNames.some((className) => className === 'overflow-y-auto' || className === 'overflow-y-scroll'))
    .toBe(true);
  expect(failureClassNames.some((className) => className.startsWith('max-h-') && /\d+d?vh/.test(className)))
    .toBe(true);
  expect(failureClassNames).toContain('break-words');

  const dismissButton = within(notice).getByRole('button', { name: dismissLabel });
  if (!(dismissButton instanceof HTMLButtonElement)) {
    throw new Error(`Dismiss button for ${JSON.stringify(failure.textContent)} is missing or not a button.`);
  }
  expect(failure.contains(dismissButton)).toBe(false);
  return dismissButton;
}

function expectButtonFollowsHeading(buttonName: string, headingName: string): HTMLElement {
  const button = screen.getByRole('button', { name: buttonName });
  const heading = requireHeading(headingName);
  const buttonFollowsHeading = heading.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING;
  expect(buttonFollowsHeading).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  return button;
}

function storeArmyFormationHelmet(pieceId: string) {
  const armyDocument = addArmyFormationPiece(
    createEmptyArmyFormationDocument(),
    'helmet-01',
    pieceId,
    780,
  );
  localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, serializeArmyFormationDocument(armyDocument));
}

function storeArmyFormationBackgroundImages(
  backgroundImageUrls: readonly string[],
): void {
  let armyDocument = createEmptyArmyFormationDocument();
  for (const [battlefieldIndex, backgroundImageUrl] of backgroundImageUrls.entries()) {
    armyDocument = setArmyBackgroundImageUrlForBattlefield(
      armyDocument,
      battlefieldIndex,
      backgroundImageUrl,
    );
  }
  localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, serializeArmyFormationDocument(armyDocument));
}

function requireArmyFormationField(battlefieldIndex = 0): HTMLDivElement {
  const field = [...document.querySelectorAll('[data-army-field]')].find(
    (node) => Number(node.getAttribute('data-battlefield-index')) === battlefieldIndex,
  );
  if (!(field instanceof HTMLDivElement)) {
    throw new Error(`Army formation battlefield field ${battlefieldIndex + 1} is missing.`);
  }

  return field;
}

function requireArmyBackgroundImage(battlefieldIndex = 0): HTMLImageElement {
  const image = requireArmyFormationField(battlefieldIndex).querySelector('img');
  if (!(image instanceof HTMLImageElement)) {
    throw new Error(`Army formation background image ${battlefieldIndex + 1} is missing.`);
  }

  return image;
}

function requireArmyBattlefieldViewLayer(battlefieldIndex = 0): HTMLDivElement {
  const viewLayer = requireArmyFormationField(battlefieldIndex).querySelector('[data-army-view-layer]');
  if (!(viewLayer instanceof HTMLDivElement)) {
    throw new Error(`Army formation battlefield view layer ${battlefieldIndex + 1} is missing.`);
  }

  return viewLayer;
}

function readArmyBattlefieldViewTransform(battlefieldIndex = 0): ArmyFormationBackgroundTransform {
  const viewLayer = requireArmyBattlefieldViewLayer(battlefieldIndex);
  const transformMatch = /^translate\((-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)$/.exec(
    viewLayer.style.transform,
  );
  if (transformMatch === null) {
    throw new Error(`Army battlefield CSS transform is invalid. Received ${viewLayer.style.transform}.`);
  }

  return {
    offsetXPx: Number(transformMatch[1]),
    offsetYPx: Number(transformMatch[2]),
    scale: Number(transformMatch[3]),
  };
}

function setArmyFormationFieldRect(
  field: HTMLDivElement,
  { left = 0, top = 0, width = 780, height = 480 }: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
  } = {},
): void {
  vi.spyOn(field, 'getBoundingClientRect').mockReturnValue(new DOMRect(left, top, width, height));
}

function chooseArmyFormationBackgroundImage(file: File): void {
  const input = screen.getByLabelText('背景图');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error(`Army formation background image input is missing. Received ${input.constructor.name}.`);
  }

  Object.defineProperty(input, 'files', {
    configurable: true,
    value: [file],
  });
  fireEvent.change(input);
}

function dispatchArmyBattlefieldWheel(
  target: HTMLElement,
  { clientX = 100, clientY = 100, deltaY = -100 }: {
    clientX?: number;
    clientY?: number;
    deltaY?: number;
  } = {},
): WheelEvent {
  const event = new WheelEvent('wheel', {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
    deltaY,
  });
  act(() => target.dispatchEvent(event));
  return event;
}

function restoreArmyFormationRecord(locale: 'en' | 'zh' = 'zh'): void {
  fireEvent.click(
    screen.getByRole('button', { name: locale === 'en' ? 'Restore' : '回到上次' }),
  );
}

function renderArmyFormationWithStoredBackgrounds(
  backgroundImageUrls: readonly string[],
  locale: 'en' | 'zh' = 'zh',
) {
  storeArmyFormationBackgroundImages(backgroundImageUrls);
  const view = render(<ArmyFormationCreator locale={locale} />);
  restoreArmyFormationRecord(locale);
  return view;
}

function createBackgroundImageUrlDocument(backgroundImageUrl: string): ArmyFormationDocument {
  return setArmyBackgroundImageUrlForBattlefield(
    createEmptyArmyFormationDocument(),
    0,
    backgroundImageUrl,
  );
}

function storeArmyFormationPiecesWithSelectedRotation(
  selectedPieceId: string,
  unselectedPieceId: string,
  selectedRotationDegrees: number,
) {
  let armyDocument = addArmyFormationPiece(
    createEmptyArmyFormationDocument(),
    'helmet-01',
    selectedPieceId,
    780,
  );
  armyDocument = addArmyFormationPiece(armyDocument, 'helmet-02', unselectedPieceId, 780);
  armyDocument = toggleArmyFormationPieceSelection(armyDocument, selectedPieceId);
  armyDocument = rotateSelectedArmyFormationPieces(armyDocument, selectedRotationDegrees);
  localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, serializeArmyFormationDocument(armyDocument));
}

function chooseArmyFormationFile(file: File, inputLabel = '选择文件') {
  const input = requireArmyFormationInput(inputLabel);

  Object.defineProperty(input, 'files', {
    configurable: true,
    value: [file],
  });
  fireEvent.change(input);
}

function placeArmyFormationPiece(iconName: string): string {
  const buttonsBeforePlacement = screen.getAllByRole('button');
  fireEvent.click(screen.getByRole('button', { name: iconName }));

  const addedPieceButton = screen.getAllByRole('button').find(
    (button) => !buttonsBeforePlacement.includes(button),
  );
  if (!(addedPieceButton instanceof HTMLButtonElement)) {
    throw new Error(`Placing ${JSON.stringify(iconName)} did not add an accessible piece button.`);
  }

  const accessibleName = addedPieceButton.getAttribute('aria-label');
  if (accessibleName === null || accessibleName.length === 0) {
    throw new Error(`Piece placed from ${JSON.stringify(iconName)} has no accessible name.`);
  }

  return accessibleName;
}

function requireArmyFormationEditorBody(): HTMLDivElement {
  const editor = screen.getByRole('region', { name: '军阵' });
  const editorBody = editor.firstElementChild;
  if (!(editorBody instanceof HTMLDivElement)) {
    throw new Error('Army formation editor body is missing or is not a div.');
  }

  return editorBody;
}

function dispatchArmyFormationKeyDown(
  target: HTMLElement,
  key: string,
  options: KeyboardEventInit = {},
  legacyKeyCode?: number,
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    ...options,
    bubbles: true,
    cancelable: true,
    key,
  });
  if (legacyKeyCode !== undefined) {
    Object.defineProperty(event, 'keyCode', { configurable: true, value: legacyKeyCode });
  }

  act(() => target.dispatchEvent(event));
  return event;
}

describe('ArmyFormationCreator', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    originalWindowMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: true }),
    });
  });

  afterEach(() => {
    cleanup();
    if (originalWindowMatchMedia === undefined) {
      Reflect.deleteProperty(window, 'matchMedia');
    } else {
      Object.defineProperty(window, 'matchMedia', originalWindowMatchMedia);
    }
    vi.restoreAllMocks();
  });

  it('英文产品名是 Army formation creator', () => {
    render(<ArmyFormationCreator locale="en" />);

    expect(screen.getByRole('region', { name: 'Army formation creator' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Helmets' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Save battlefield 1' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Save in this browser' })).toBeNull();
    expect(screen.queryByRole('navigation', { name: 'Editor' })).toBeNull();
  });

  it.each([
    {
      locale: 'zh',
      colorInputLabel: '改变底色',
      resetButtonLabel: '重置底色',
    },
    {
      locale: 'en',
      colorInputLabel: 'Change background color',
      resetButtonLabel: 'Reset background color',
    },
  ] as const)('$locale applies the field color immediately and resets it', ({
    locale,
    colorInputLabel,
    resetButtonLabel,
  }) => {
    render(<ArmyFormationCreator locale={locale} />);

    const colorInput = screen.getByLabelText(colorInputLabel);
    const battlefieldField = document.querySelector('[data-army-field]');
    if (!(colorInput instanceof HTMLInputElement)) {
      throw new Error(`Battlefield color input is missing. Received ${colorInput.constructor.name}.`);
    }
    if (!(battlefieldField instanceof HTMLElement)) {
      throw new Error('Battlefield field is missing.');
    }

    fireEvent.change(colorInput, { target: { value: '#ff0000' } });
    expect(colorInput.value).toBe('#ff0000');
    expect(battlefieldField.style.backgroundColor).toBe('rgb(255, 0, 0)');

    fireEvent.click(screen.getByRole('button', { name: resetButtonLabel }));
    expect(colorInput.value).toBe('#ffffff');
    expect(battlefieldField.style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('所有图标选择器缩略图都使用白色滤镜', () => {
    render(<ArmyFormationCreator locale="en" />);

    const categoryIcons = [
      ['Helmets', 'helmet-01'],
      ['Weapons', 'weapon-01'],
      ['Animals', 'animal-01'],
      ['Vehicles and siege', 'vehicle-01'],
      ['NATO', 'nato-001'],
    ] as const;

    for (const [categoryLabel, iconId] of categoryIcons) {
      fireEvent.click(screen.getByRole('button', { name: categoryLabel }));
      const iconButton = screen.getByRole('button', { name: iconId });
      const thumbnail = iconButton.querySelector('span');

      expect(thumbnail).not.toBeNull();
      expect((thumbnail as HTMLElement).style.filter).toBe('brightness(0) invert(1)');
    }
  });

  it('页面上没有保存战场，也没有保存在这个浏览器', () => {
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByText('保存在这个浏览器')).toBeNull();
    expect(screen.queryByRole('button', { name: '保存战场 1' })).toBeNull();
    expect(screen.queryByRole('button', { name: '保存战场 2' })).toBeNull();
    expect(screen.queryByRole('button', { name: '保存战场 3' })).toBeNull();
    expect(screen.queryByRole('button', { name: '保存战场 4' })).toBeNull();
  });

  it('快速重复添加棋子使用当前战场视角，允许重叠并只选中最上层棋子', () => {
    render(<ArmyFormationCreator locale="zh" />);

    const helmet = screen.getByRole('button', { name: /^helmet-01$/ });
    fireEvent.click(helmet);
    expect(pieceButtons()).toHaveLength(1);
    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('8,8');
    expect(pieceButtons()[0]?.getAttribute('aria-pressed')).toBe('true');

    act(() => {
      helmet.click();
      helmet.click();
    });

    const pieces = pieceButtons();
    expect(pieces).toHaveLength(3);
    expect(pieces.map(piecePosition)).toEqual(['8,8', '8,8', '8,8']);
    expect(new Set(pieces.map((piece) => piece.getAttribute('aria-label'))).size).toBe(3);
    expect(pieces.map((piece) => piece.getAttribute('aria-pressed'))).toEqual(['false', 'false', 'true']);
    expect(pieces[0]?.className).toContain('z-10');
    expect(pieces[1]?.className).toContain('z-10');
    expect(pieces[2]?.className).toContain('z-20');
    expect(pieces[0]?.style.width).toBe(pieces[2]?.style.width);
    expect(pieces[0]?.style.height).toBe(pieces[2]?.style.height);
    expect(requireArmyBattlefieldViewLayer().style.transform).toBe('translate(0px, 0px) scale(1)');
  });

  it('平移视角后再添加棋子会落在不同地图坐标', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const helmet = screen.getByRole('button', { name: /^helmet-01$/ });
    fireEvent.click(helmet);
    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('8,8');

    const field = requireArmyFormationField();
    const viewLayer = requireArmyBattlefieldViewLayer();
    setArmyFormationFieldRect(field);
    fireEvent.pointerDown(viewLayer, {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
      button: 0,
      isPrimary: true,
    });
    fireEvent.pointerMove(field, { pointerId: 1, clientX: 58, clientY: 100 });
    fireEvent.pointerUp(field, { pointerId: 1, clientX: 58, clientY: 100 });
    expect(viewLayer.style.transform).toBe('translate(-42px, 0px) scale(1)');

    fireEvent.click(helmet);
    const pieces = pieceButtons();
    expect(pieces).toHaveLength(2);
    expect(pieces.map(piecePosition)).toEqual(['8,8', '50,8']);
    expect(new Set(pieces.map(piecePosition)).size).toBe(2);
  });

  it('不把线框说明和读取按钮做进页面', () => {
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByText('点一个图标，新棋子落到空位')).toBeNull();
    expect(screen.queryByText('换成头盔图标')).toBeNull();
    expect(screen.queryByRole('button', { name: '读取' })).toBeNull();
    expect(screen.queryByRole('button', { name: '读取文件' })).toBeNull();
    expect(screen.queryByRole('button', { name: '变成图片' })).toBeNull();
    expect(screen.queryByText('空位')).toBeNull();
  });

  it.each([
    {
      locale: 'zh',
      battlefieldLabel: '战场',
      nextButton: '切换到下一场',
      previousButton: '切换到上一场',
    },
    {
      locale: 'en',
      battlefieldLabel: 'Battlefield',
      nextButton: 'Switch to next battle',
      previousButton: 'Switch to previous battle',
    },
  ] as const)(
    '$locale battlefield indicator follows next and previous controls through wrap-around',
    ({ locale, battlefieldLabel, nextButton, previousButton }) => {
      render(<ArmyFormationCreator locale={locale} />);

      const nextBattlefieldButton = screen.getByRole('button', { name: nextButton });
      const previousBattlefieldButton = screen.getByRole('button', { name: previousButton });
      const expectActiveBattlefield = (position: number) => {
        expect(
          screen.getByText(`${battlefieldLabel} ${position}/4`, { exact: true }),
        ).toBeTruthy();
      };

      expectActiveBattlefield(1);
      for (let position = 2; position <= 4; position += 1) {
        fireEvent.click(nextBattlefieldButton);
        expectActiveBattlefield(position);
      }

      fireEvent.click(nextBattlefieldButton);
      expectActiveBattlefield(1);

      fireEvent.click(previousBattlefieldButton);
      expectActiveBattlefield(4);
      for (let position = 3; position >= 1; position -= 1) {
        fireEvent.click(previousBattlefieldButton);
        expectActiveBattlefield(position);
      }

      fireEvent.click(previousBattlefieldButton);
      expectActiveBattlefield(4);
    },
  );

  it('棋子只显示在自己的战场，切换回来后仍然可见', async () => {
    render(<ArmyFormationCreator locale="zh" />);

    const nextBattlefieldButton = screen.getByRole('button', { name: '切换到下一场' });
    const previousBattlefieldButton = screen.getByRole('button', { name: '切换到上一场' });
    const firstPieceName = placeArmyFormationPiece('helmet-01');
    expect(screen.getByRole('button', { name: firstPieceName })).toBeTruthy();

    fireEvent.click(nextBattlefieldButton);
    await waitFor(() => expect(screen.getByText('战场 2/4', { exact: true })).toBeTruthy());
    expect(screen.queryByRole('button', { name: firstPieceName })).toBeNull();

    const secondPieceName = placeArmyFormationPiece('helmet-01');
    expect(screen.getByRole('button', { name: secondPieceName })).toBeTruthy();
    expect(screen.queryByRole('button', { name: firstPieceName })).toBeNull();

    fireEvent.click(nextBattlefieldButton);
    await waitFor(() => expect(screen.getByText('战场 3/4', { exact: true })).toBeTruthy());
    expect(screen.queryByRole('button', { name: firstPieceName })).toBeNull();
    expect(screen.queryByRole('button', { name: secondPieceName })).toBeNull();

    fireEvent.click(previousBattlefieldButton);
    await screen.findByRole('button', { name: secondPieceName });
    expect(screen.getByRole('button', { name: secondPieceName })).toBeTruthy();
    expect(screen.queryByRole('button', { name: firstPieceName })).toBeNull();

    fireEvent.click(previousBattlefieldButton);
    await screen.findByRole('button', { name: firstPieceName });
    expect(screen.getByRole('button', { name: firstPieceName })).toBeTruthy();
    expect(screen.queryByRole('button', { name: secondPieceName })).toBeNull();
  });

  it('角度输入即时旋转所选棋子，重置后删除和清空只影响棋子', () => {
    render(<ArmyFormationCreator locale="zh" />);

    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));
    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));
    const firstPiece = () => pieceButtons()[0] as HTMLButtonElement;
    const secondPiece = () => pieceButtons()[1] as HTMLButtonElement;

    fireEvent.click(secondPiece());
    fireEvent.click(firstPiece());
    expect(firstPiece().getAttribute('aria-pressed')).toBe('true');
    expect(secondPiece().getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(firstPiece());
    expect(firstPiece().getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(firstPiece());
    fireEvent.change(screen.getByLabelText('角度'), { target: { value: '45' } });
    expect(firstPiece().getAttribute('data-rotation-degrees')).toBe('45');
    expect(secondPiece().getAttribute('data-rotation-degrees')).toBe('0');
    fireEvent.click(screen.getByRole('button', { name: '重置旋转' }));
    expect(firstPiece().getAttribute('data-rotation-degrees')).toBe('0');
    expect((screen.getByLabelText('角度') as HTMLInputElement).value).toBe('90');

    fireEvent.click(
      screen.getByRole('button', {
        name: getArmyFormationCreatorCopy('zh').deleteSelected,
      }),
    );
    expect(pieceButtons()).toHaveLength(1);
    expect(pieceButtons()[0]?.getAttribute('data-rotation-degrees')).toBe('0');

    fireEvent.change(screen.getByLabelText('高度'), { target: { value: '600' } });
    expect(document.querySelector('[data-army-field]')?.getAttribute('data-field-height')).toBe('600');
    fireEvent.click(screen.getByRole('button', { name: /^helmet-02$/ }));
    fireEvent.click(screen.getByRole('button', { name: '清空战场' }));

    expect(pieceButtons()).toHaveLength(0);
    expect(document.querySelector('[data-army-field]')?.getAttribute('data-field-height')).toBe('600');
  });

  it('Delete 删除当前单选棋子，保留删除后的自动旋转清理', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const selectedPieceName = placeArmyFormationPiece('helmet-01');
    const preservedPieceName = placeArmyFormationPiece('helmet-01');
    const selectedPiece = screen.getByRole<HTMLButtonElement>('button', { name: selectedPieceName });

    fireEvent.click(screen.getByRole<HTMLButtonElement>('button', { name: preservedPieceName }));
    fireEvent.click(selectedPiece);
    fireEvent.change(screen.getByLabelText('角度'), { target: { value: '45' } });
    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('45');

    selectedPiece.focus();
    expect(document.activeElement).toBe(selectedPiece);
    const keyEvent = dispatchArmyFormationKeyDown(selectedPiece, 'Delete');

    expect(keyEvent.defaultPrevented).toBe(true);
    expect(screen.queryByRole('button', { name: selectedPieceName })).toBeNull();
    expect(screen.getByRole('button', { name: preservedPieceName })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '重置旋转' }));
    expect((screen.getByLabelText('角度') as HTMLInputElement).value).toBe('90');
  });

  it('Backspace 删除最新多选状态中的所选棋子并保留未选中棋子', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const firstPieceName = placeArmyFormationPiece('helmet-01');
    const middlePieceName = placeArmyFormationPiece('helmet-01');
    const lastPieceName = placeArmyFormationPiece('helmet-01');
    const firstPiece = screen.getByRole<HTMLButtonElement>('button', { name: firstPieceName });
    const lastPiece = screen.getByRole<HTMLButtonElement>('button', { name: lastPieceName });

    fireEvent.click(firstPiece);
    expect(firstPiece.getAttribute('aria-pressed')).toBe('true');
    expect(lastPiece.getAttribute('aria-pressed')).toBe('true');

    lastPiece.focus();
    const keyEvent = dispatchArmyFormationKeyDown(lastPiece, 'Backspace');

    expect(keyEvent.defaultPrevented).toBe(true);
    expect(screen.queryByRole('button', { name: firstPieceName })).toBeNull();
    expect(screen.getByRole('button', { name: middlePieceName })).toBeTruthy();
    expect(screen.queryByRole('button', { name: lastPieceName })).toBeNull();
  });

  it('没有选中棋子时 Delete 和 Backspace 不阻止默认行为', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole<HTMLButtonElement>('button', { name: pieceName });
    fireEvent.click(piece);
    piece.focus();

    for (const key of ['Delete', 'Backspace']) {
      const keyEvent = dispatchArmyFormationKeyDown(piece, key);
      expect(keyEvent.defaultPrevented).toBe(false);
      expect(pieceButtons()).toHaveLength(1);
    }
  });

  it('数字、颜色、文件输入和可编辑内容中的 Backspace 不删除所选棋子', () => {
    render(<ArmyFormationCreator locale="zh" />);
    placeArmyFormationPiece('helmet-01');
    const piece = pieceButtons()[0];
    if (piece === undefined) {
      throw new Error('Army formation editable-target test requires a piece.');
    }

    const textarea = document.createElement('textarea');
    const select = document.createElement('select');
    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    const editableChild = document.createElement('span');
    editable.append(editableChild);
    requireArmyFormationEditorBody().append(textarea, select, editable);

    const colorInput = controlGroup('上色').querySelector('input[type="color"]');
    if (!(colorInput instanceof HTMLInputElement)) {
      throw new Error('Army formation color input is missing from the color controls.');
    }

    const editableTargets = [
      screen.getByLabelText('角度'),
      screen.getByLabelText('高度'),
      colorInput,
      screen.getByLabelText('改变底色'),
      screen.getByLabelText('背景图'),
      screen.getByLabelText('选择文件'),
      textarea,
      select,
      editableChild,
    ];
    for (const target of editableTargets) {
      const keyEvent = dispatchArmyFormationKeyDown(target, 'Backspace');
      expect(keyEvent.defaultPrevented).toBe(false);
      expect(pieceButtons()).toHaveLength(1);
    }
  });

  it('忽略已取消事件、所有修饰键和 IME 组合中的删除键', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole<HTMLButtonElement>('button', { name: pieceName });
    piece.focus();

    const ignoredEvents = [
      dispatchArmyFormationKeyDown(piece, 'Delete', { altKey: true }),
      dispatchArmyFormationKeyDown(piece, 'Delete', { ctrlKey: true }),
      dispatchArmyFormationKeyDown(piece, 'Delete', { metaKey: true }),
      dispatchArmyFormationKeyDown(piece, 'Delete', { shiftKey: true }),
      dispatchArmyFormationKeyDown(piece, 'Backspace', { isComposing: true }),
      dispatchArmyFormationKeyDown(piece, 'Backspace', {}, 229),
    ];
    const alreadyPreventedEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Delete',
    });
    alreadyPreventedEvent.preventDefault();
    act(() => piece.dispatchEvent(alreadyPreventedEvent));

    expect(ignoredEvents.every((event) => !event.defaultPrevented)).toBe(true);
    expect(alreadyPreventedEvent.defaultPrevented).toBe(true);
    expect(screen.getByRole('button', { name: pieceName })).toBeTruthy();
  });

  it('编辑器外的删除键不删除当前选中的棋子', () => {
    render(
      <>
        <ArmyFormationCreator locale="zh" />
        <button type="button">编辑器外</button>
      </>,
    );
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole<HTMLButtonElement>('button', { name: pieceName });
    expect(piece.getAttribute('aria-pressed')).toBe('true');

    const outsideButton = screen.getByRole<HTMLButtonElement>('button', { name: '编辑器外' });
    outsideButton.focus();
    const outsideKeyEvent = dispatchArmyFormationKeyDown(outsideButton, 'Delete');
    expect(outsideKeyEvent.defaultPrevented).toBe(false);
    expect(screen.getByRole('button', { name: pieceName })).toBeTruthy();
  });

  it('恢复弹窗内的删除键不会删掉稍后恢复的棋子', () => {
    const pieceName = 'restored-selected-piece';
    storeArmyFormationPiecesWithSelectedRotation(pieceName, 'restored-unselected-piece', 30);
    render(<ArmyFormationCreator locale="zh" />);

    const restoreButton = screen.getByRole<HTMLButtonElement>('button', { name: '回到上次' });
    const dialogKeyEvent = dispatchArmyFormationKeyDown(restoreButton, 'Backspace');
    expect(dialogKeyEvent.defaultPrevented).toBe(false);
    fireEvent.click(restoreButton);

    expect(screen.getByRole('button', { name: pieceName })).toBeTruthy();
    expect(pieceButtons()).toHaveLength(2);
  });

  it('角度连续输入不重复累加，重置会恢复自动调角前的朝向', () => {
    storeArmyFormationPiecesWithSelectedRotation('selected-piece', 'unselected-piece', 35);
    render(<ArmyFormationCreator locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: '回到上次' }));

    const [selectedPiece, unselectedPiece] = pieceButtons();
    if (selectedPiece === undefined || unselectedPiece === undefined) {
      throw new Error('Army formation angle reset test requires two restored pieces.');
    }
    const angleInput = screen.getByLabelText('角度');
    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('35');
    expect(unselectedPiece.getAttribute('data-rotation-degrees')).toBe('0');

    fireEvent.change(angleInput, { target: { value: '30' } });
    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('65');
    expect(unselectedPiece.getAttribute('data-rotation-degrees')).toBe('0');

    fireEvent.change(angleInput, { target: { value: '45' } });
    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('80');
    fireEvent.change(angleInput, { target: { value: '5' } });
    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('40');

    fireEvent.click(screen.getByRole('button', { name: '重置旋转' }));
    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('35');
    expect(unselectedPiece.getAttribute('data-rotation-degrees')).toBe('0');
    expect((angleInput as HTMLInputElement).value).toBe('90');
  });

  it('没有选中棋子时角度输入和重置保持安全', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    fireEvent.click(screen.getByRole<HTMLButtonElement>('button', { name: pieceName }));
    const angleInput = screen.getByLabelText('角度');

    fireEvent.change(angleInput, { target: { value: '30' } });
    expect(screen.getByRole('button', { name: pieceName }).getAttribute('data-rotation-degrees')).toBe('0');

    fireEvent.click(screen.getByRole('button', { name: '重置旋转' }));
    expect(screen.getByRole('button', { name: pieceName }).getAttribute('data-rotation-degrees')).toBe('0');
    expect((angleInput as HTMLInputElement).value).toBe('90');
  });

  it.each(['en', 'zh'] as const)(
    '%s angle drafts preserve rotation until valid, show errors on blur and reset to the original direction',
    (locale) => {
      const copy = getArmyFormationCreatorCopy(locale);
      storeArmyFormationPiecesWithSelectedRotation('selected-piece', 'unselected-piece', 35);
      render(<ArmyFormationCreator locale={locale} />);
      fireEvent.click(screen.getByRole('button', { name: copy.restorePreviousRecord }));

      const selectedPiece = screen.getByRole('button', { name: 'selected-piece' });
      const unselectedPiece = screen.getByRole('button', { name: 'unselected-piece' });
      const angleInput = requireArmyFormationInput(copy.angle);
      fireEvent.change(angleInput, { target: { value: '30' } });
      expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('65');

      for (const invalidDraft of ['', 'not-a-number']) {
        const savedBeforeEditing = localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);
        fireEvent.focus(angleInput);
        fireEvent.change(angleInput, { target: { value: invalidDraft } });
        // Native number inputs sanitize nonnumeric drafts to an empty value.
        const receivedDraft = angleInput.value;
        expect(receivedDraft === '' || !Number.isFinite(Number(receivedDraft))).toBe(true);
        expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('65');
        expect(unselectedPiece.getAttribute('data-rotation-degrees')).toBe('0');
        expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(savedBeforeEditing);
        expect(screen.queryByRole('alert')).toBeNull();
        expect(angleInput.getAttribute('aria-invalid')).not.toBe('true');

        fireEvent.blur(angleInput);
        const failure = expectInputFailure(
          angleInput,
          copy.angleInputError.replace('{received}', JSON.stringify(receivedDraft)),
          copy.changeSelectedPieces,
        );
        expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('65');

        fireEvent.change(angleInput, { target: { value: '45' } });
        expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('80');
        expect(unselectedPiece.getAttribute('data-rotation-degrees')).toBe('0');
        expect(failure.isConnected).toBe(false);
        expect(angleInput.getAttribute('aria-invalid')).not.toBe('true');
        expect(angleInput.getAttribute('aria-describedby')).toBeNull();
        expect(screen.queryByRole('alert')).toBeNull();

        fireEvent.change(angleInput, { target: { value: '30' } });
        expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('65');
      }

      fireEvent.change(angleInput, { target: { value: '' } });
      fireEvent.blur(angleInput);
      expectInputFailure(
        angleInput,
        copy.angleInputError.replace('{received}', '""'),
        copy.changeSelectedPieces,
      );
      fireEvent.click(screen.getByRole('button', { name: copy.resetSelectedRotation }));
      expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('35');
      expect(unselectedPiece.getAttribute('data-rotation-degrees')).toBe('0');
      expect(angleInput.value).toBe('90');
      expect(angleInput.getAttribute('aria-invalid')).not.toBe('true');
      expect(angleInput.getAttribute('aria-describedby')).toBeNull();
      expect(screen.queryByRole('alert')).toBeNull();
    },
  );

  it.each(['en', 'zh'] as const)(
    '%s height drafts preserve the applied height, validate on blur and recover immediately to 600 or reset 480',
    (locale) => {
      const copy = getArmyFormationCreatorCopy(locale);
      render(<ArmyFormationCreator locale={locale} />);
      const heightInput = requireArmyFormationInput(copy.height);
      const battlefieldField = document.querySelector('[data-army-field]');
      if (!(battlefieldField instanceof HTMLElement)) {
        throw new Error('Height draft regression requires a battlefield field. Received null.');
      }

      expect(battlefieldField.getAttribute('data-field-height')).toBe('480');
      for (const invalidDraft of ['', 'not-a-number', '199', '2001']) {
        fireEvent.focus(heightInput);
        fireEvent.change(heightInput, { target: { value: invalidDraft } });
        const receivedDraft = heightInput.value;
        expect(battlefieldField.getAttribute('data-field-height')).toBe('480');
        expect(screen.queryByRole('alert')).toBeNull();
        expect(heightInput.getAttribute('aria-invalid')).not.toBe('true');

        fireEvent.blur(heightInput);
        const expectedTemplate = invalidDraft === '199' || invalidDraft === '2001'
          ? copy.heightRangeError
          : copy.heightInputError;
        const failure = expectInputFailure(
          heightInput,
          expectedTemplate.replace('{received}', JSON.stringify(receivedDraft)),
          copy.changeBattlefield,
        );
        expect(battlefieldField.getAttribute('data-field-height')).toBe('480');

        fireEvent.change(heightInput, { target: { value: '600' } });
        expect(battlefieldField.getAttribute('data-field-height')).toBe('600');
        expect(heightInput.value).toBe('600');
        expect(failure.isConnected).toBe(false);
        expect(heightInput.getAttribute('aria-invalid')).not.toBe('true');
        expect(heightInput.getAttribute('aria-describedby')).toBeNull();
        expect(screen.queryByRole('alert')).toBeNull();

        fireEvent.change(heightInput, { target: { value: invalidDraft } });
        expect(battlefieldField.getAttribute('data-field-height')).toBe('600');
        expect(screen.queryByRole('alert')).toBeNull();
        fireEvent.blur(heightInput);
        expectInputFailure(
          heightInput,
          expectedTemplate.replace('{received}', JSON.stringify(heightInput.value)),
          copy.changeBattlefield,
        );

        fireEvent.click(screen.getByRole('button', { name: copy.resetHeight }));
        expect(battlefieldField.getAttribute('data-field-height')).toBe('480');
        expect(heightInput.value).toBe('480');
        expect(heightInput.getAttribute('aria-invalid')).not.toBe('true');
        expect(heightInput.getAttribute('aria-describedby')).toBeNull();
        expect(screen.queryByRole('alert')).toBeNull();
      }
    },
  );

  it.each([
    { locale: 'zh', angleResetLabel: '重置旋转', heightLabel: '高度', heightResetLabel: '重置高度' },
    { locale: 'en', angleResetLabel: 'Reset rotation', heightLabel: 'Height', heightResetLabel: 'Reset height' },
  ] as const)(
    '$locale angle and height reset controls apply the height immediately and restore 480',
    ({ locale, angleResetLabel, heightLabel, heightResetLabel }) => {
      render(<ArmyFormationCreator locale={locale} />);

      expect(screen.getByRole('button', { name: angleResetLabel })).toBeTruthy();
      const heightInput = screen.getByLabelText(heightLabel);
      fireEvent.change(heightInput, { target: { value: '600' } });
      expect(document.querySelector('[data-army-field]')?.getAttribute('data-field-height')).toBe('600');

      fireEvent.click(screen.getByRole('button', { name: heightResetLabel }));
      expect(document.querySelector('[data-army-field]')?.getAttribute('data-field-height')).toBe('480');
      expect((heightInput as HTMLInputElement).value).toBe('480');
    },
  );

  it('拖动棋子后位置按格子移动', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const placedPieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: placedPieceName });
    setArmyFormationFieldRect(requireArmyFormationField());

    fireEvent.pointerDown(piece, { pointerId: 1, clientX: 8, clientY: 8, button: 0 });
    fireEvent.pointerMove(piece, { pointerId: 1, clientX: 48, clientY: 28, button: 0 });
    fireEvent.pointerUp(piece, { pointerId: 1, clientX: 48, clientY: 28, button: 0 });

    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('50,30');
  });

  it.each([
    {
      locale: 'zh',
      resetLabel: '适配整个战场',
      hint: '拖动空白处可平移整个战场，滚动滚轮可缩放整个战场；拖动兵棋只会移动该兵棋。视角仅在本次页面会话内保留，不会保存，刷新页面或导入后会重置。',
    },
    {
      locale: 'en',
      resetLabel: 'Fit the entire battlefield',
      hint: 'Drag an empty area to pan the entire battlefield. Use the scroll wheel to zoom the entire battlefield. Drag a game piece to move only that piece. The view is kept for this page session only; it is not saved and resets on refresh or import.',
    },
  ] as const)('$locale shows shared battlefield view controls with or without an image', ({ locale, resetLabel, hint }) => {
    render(<ArmyFormationCreator locale={locale} />);
    expect(screen.getByRole('button', { name: resetLabel })).toBeTruthy();
    expect(screen.getByText(hint)).toBeTruthy();
    expect(requireArmyBattlefieldViewLayer().style.transform).toBe('translate(0px, 0px) scale(1)');

    cleanup();
    renderArmyFormationWithStoredBackgrounds(['data:image/webp;base64,initial'], locale);

    const image = requireArmyBackgroundImage();
    expect(image.className).toContain('pointer-events-none');
    expect(image.className).toContain('object-contain');
    expect(image.className).toContain('object-center');
    expect(image.style.transform).toBe('');
    expect(image.parentElement).toBe(requireArmyBattlefieldViewLayer());
    expect(requireArmyBattlefieldViewLayer().style.transform).toBe('translate(0px, 0px) scale(1)');
    expect(requireArmyBattlefieldViewLayer().style.transformOrigin).toBe('0 0');
    expect(screen.getByRole('button', { name: resetLabel })).toBeTruthy();
    expect(screen.getByText(hint)).toBeTruthy();
  });

  it('拖动空白处平移视角，缩放后的棋子拖动只更新地图坐标，新棋子共用同一尺寸视角', () => {
    renderArmyFormationWithStoredBackgrounds(['data:image/webp;base64,initial']);
    const field = requireArmyFormationField();
    setArmyFormationFieldRect(field, { left: 100, top: 50, width: 390, height: 240 });
    const viewLayer = requireArmyBattlefieldViewLayer();
    const setPointerCapture = vi.fn();
    Object.defineProperty(field, 'setPointerCapture', { configurable: true, value: setPointerCapture });
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole<HTMLButtonElement>('button', { name: pieceName });
    fireEvent.change(screen.getByLabelText('角度'), { target: { value: '45' } });
    const pieceMapPositionBeforePan = piecePosition(piece);
    const pieceAttributesBeforeAdd = {
      rotationDegrees: piece.getAttribute('data-rotation-degrees'),
      backgroundColor: piece.style.backgroundColor,
      width: piece.style.width,
      height: piece.style.height,
    };

    fireEvent.pointerDown(viewLayer, {
      pointerId: 1,
      clientX: 100,
      clientY: 50,
      button: 0,
      isPrimary: true,
    });
    fireEvent.pointerMove(field, { pointerId: 1, clientX: 115, clientY: 60 });
    expect(viewLayer.style.transform).toBe('translate(30px, 20px) scale(1)');
    expect(piecePosition(piece)).toBe(pieceMapPositionBeforePan);
    fireEvent.pointerUp(field, { pointerId: 1, clientX: 115, clientY: 60 });
    expect(setPointerCapture).toHaveBeenCalledWith(1);

    const pieceWheelEvent = dispatchArmyBattlefieldWheel(piece, {
      clientX: 115,
      clientY: 60,
      deltaY: -200,
    });
    const zoomedView = readArmyBattlefieldViewTransform();
    expect(pieceWheelEvent.defaultPrevented).toBe(true);
    expect(zoomedView.offsetXPx).toBeCloseTo(30);
    expect(zoomedView.offsetYPx).toBeCloseTo(20);
    expect(zoomedView.scale).toBeCloseTo(Math.exp(0.4));
    expect(piecePosition(piece)).toBe(pieceMapPositionBeforePan);

    const addedPieceName = placeArmyFormationPiece('helmet-01');
    const addedPiece = screen.getByRole<HTMLButtonElement>('button', { name: addedPieceName });
    const addedPiecePoint = toArmyFormationMapPoint(zoomedView, 8, 8);
    expect(piecePosition(addedPiece)).toBe(`${addedPiecePoint.x},${addedPiecePoint.y}`);
    expect(zoomedView.offsetXPx + addedPiecePoint.x * zoomedView.scale).toBeCloseTo(8);
    expect(zoomedView.offsetYPx + addedPiecePoint.y * zoomedView.scale).toBeCloseTo(8);
    expect(piecePosition(piece)).toBe(pieceMapPositionBeforePan);
    expect({
      rotationDegrees: piece.getAttribute('data-rotation-degrees'),
      backgroundColor: piece.style.backgroundColor,
      width: piece.style.width,
      height: piece.style.height,
    }).toEqual(pieceAttributesBeforeAdd);
    expect(piece.parentElement).toBe(viewLayer);
    expect(addedPiece.parentElement).toBe(viewLayer);
    expect(addedPiece.style.width).toBe(piece.style.width);
    expect(addedPiece.style.height).toBe(piece.style.height);

    fireEvent.pointerDown(piece, { pointerId: 2, clientX: 115, clientY: 60, button: 0 });
    fireEvent.pointerMove(piece, { pointerId: 2, clientX: 145, clientY: 75, button: 0 });
    fireEvent.pointerUp(piece, { pointerId: 2, clientX: 145, clientY: 75, button: 0 });

    expect(piecePosition(piece)).toBe('50,30');
    expect(viewLayer.style.transform).toBe(
      `translate(${zoomedView.offsetXPx}px, ${zoomedView.offsetYPx}px) scale(${zoomedView.scale})`,
    );
  });

  it('最大缩放且整张地图移出视口时，新棋子仍落在可见左上角并能继续场外拖动', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const field = requireArmyFormationField();
    setArmyFormationFieldRect(field);
    const viewLayer = requireArmyBattlefieldViewLayer();

    dispatchArmyBattlefieldWheel(viewLayer, {
      clientX: 0,
      clientY: 0,
      deltaY: -10000,
    });
    expect(readArmyBattlefieldViewTransform().scale).toBe(8);

    fireEvent.pointerDown(viewLayer, {
      pointerId: 41,
      clientX: 0,
      clientY: 0,
      button: 0,
      isPrimary: true,
    });
    fireEvent.pointerMove(field, { pointerId: 41, clientX: 1200, clientY: 1200 });
    fireEvent.pointerUp(field, { pointerId: 41, clientX: 1200, clientY: 1200 });

    const transformBeforeAdd = readArmyBattlefieldViewTransform();
    expect(transformBeforeAdd).toEqual({ offsetXPx: 1200, offsetYPx: 1200, scale: 8 });
    expect(transformBeforeAdd.offsetXPx).toBeGreaterThan(780);
    expect(transformBeforeAdd.offsetYPx).toBeGreaterThan(480);

    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole<HTMLButtonElement>('button', { name: pieceName });
    const piecePoint = toArmyFormationMapPoint(transformBeforeAdd, 8, 8);
    expect(piecePosition(piece)).toBe(`${piecePoint.x},${piecePoint.y}`);
    expect(piecePoint.x).toBeLessThan(0);
    expect(piecePoint.y).toBeLessThan(0);
    expect(transformBeforeAdd.offsetXPx + piecePoint.x * transformBeforeAdd.scale).toBeCloseTo(8);
    expect(transformBeforeAdd.offsetYPx + piecePoint.y * transformBeforeAdd.scale).toBeCloseTo(8);
    expect(piece.getAttribute('aria-pressed')).toBe('true');
    expect(readArmyBattlefieldViewTransform()).toEqual(transformBeforeAdd);

    fireEvent.pointerDown(piece, { pointerId: 42, clientX: 8, clientY: 8, button: 0 });
    fireEvent.pointerMove(piece, { pointerId: 42, clientX: 48, clientY: 28, button: 0 });
    fireEvent.pointerUp(piece, { pointerId: 42, clientX: 48, clientY: 28, button: 0 });

    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('-145,-145');
    expect(Number.parseFloat(piece.style.left)).toBeLessThan(0);
    expect(Number.parseFloat(piece.style.top)).toBeLessThan(0);
    expect(readArmyBattlefieldViewTransform()).toEqual(transformBeforeAdd);
  });

  it('四个战场在各自最大缩放和移出视口的视角中都把新棋子放在左上角', async () => {
    render(<ArmyFormationCreator locale="zh" />);
    const nextButton = screen.getByRole('button', { name: '切换到下一场' });
    const previousButton = screen.getByRole('button', { name: '切换到上一场' });
    const addedPieceNames: string[] = [];
    const battlefieldTransforms: string[] = [];

    for (let battlefieldIndex = 0; battlefieldIndex < 4; battlefieldIndex += 1) {
      const field = requireArmyFormationField(battlefieldIndex);
      setArmyFormationFieldRect(field, { left: 10, top: 20, width: 390, height: 240 });
      const viewLayer = requireArmyBattlefieldViewLayer(battlefieldIndex);
      dispatchArmyBattlefieldWheel(viewLayer, {
        clientX: 10,
        clientY: 20,
        deltaY: -10000,
      });

      fireEvent.pointerDown(viewLayer, {
        pointerId: 50 + battlefieldIndex,
        clientX: 10,
        clientY: 20,
        button: 0,
        isPrimary: true,
      });
      fireEvent.pointerMove(field, {
        pointerId: 50 + battlefieldIndex,
        clientX: 1010 + battlefieldIndex * 10,
        clientY: 1020 + battlefieldIndex * 10,
      });
      fireEvent.pointerUp(field, {
        pointerId: 50 + battlefieldIndex,
        clientX: 1010 + battlefieldIndex * 10,
        clientY: 1020 + battlefieldIndex * 10,
      });

      const transformBeforeAdd = readArmyBattlefieldViewTransform(battlefieldIndex);
      battlefieldTransforms.push(viewLayer.style.transform);
      expect(transformBeforeAdd.scale).toBe(8);
      expect(transformBeforeAdd.offsetXPx).toBeGreaterThan(780);
      expect(transformBeforeAdd.offsetYPx).toBeGreaterThan(480);
      const pieceName = placeArmyFormationPiece('helmet-01');
      addedPieceNames.push(pieceName);
      const piece = screen.getByRole<HTMLButtonElement>('button', { name: pieceName });
      const piecePoint = toArmyFormationMapPoint(transformBeforeAdd, 8, 8);

      expect(piecePosition(piece)).toBe(`${piecePoint.x},${piecePoint.y}`);
      expect(transformBeforeAdd.offsetXPx + piecePoint.x * transformBeforeAdd.scale).toBeCloseTo(8);
      expect(transformBeforeAdd.offsetYPx + piecePoint.y * transformBeforeAdd.scale).toBeCloseTo(8);
      expect(piece.getAttribute('aria-pressed')).toBe('true');
      expect(readArmyBattlefieldViewTransform(battlefieldIndex)).toEqual(transformBeforeAdd);

      if (battlefieldIndex < 3) {
        fireEvent.click(nextButton);
        await waitFor(() =>
          expect(screen.getByText(`战场 ${battlefieldIndex + 2}/4`, { exact: true })).toBeTruthy(),
        );
        expect(screen.queryByRole('button', { name: pieceName })).toBeNull();
      }
    }

    expect(addedPieceNames).toHaveLength(4);
    expect(new Set(battlefieldTransforms).size).toBe(4);
    for (let battlefieldIndex = 2; battlefieldIndex >= 0; battlefieldIndex -= 1) {
      fireEvent.click(previousButton);
      await waitFor(() =>
        expect(screen.getByText(`战场 ${battlefieldIndex + 1}/4`, { exact: true })).toBeTruthy(),
      );
      expect(readArmyBattlefieldViewTransform(battlefieldIndex).scale).toBe(8);
      expect(requireArmyBattlefieldViewLayer(battlefieldIndex).style.transform).toBe(
        battlefieldTransforms[battlefieldIndex],
      );
      expect(screen.getByRole('button', { name: addedPieceNames[battlefieldIndex] })).toBeTruthy();
    }
  });

  it('无背景时空白拖动可平移，右键、pointercancel 和窗口失焦会停止拖动', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const field = requireArmyFormationField();
    setArmyFormationFieldRect(field);
    const viewLayer = requireArmyBattlefieldViewLayer();

    fireEvent.pointerDown(viewLayer, { pointerId: 3, clientX: 0, clientY: 0, button: 2 });
    fireEvent.pointerMove(field, { pointerId: 3, clientX: 25, clientY: 10 });
    expect(viewLayer.style.transform).toBe('translate(0px, 0px) scale(1)');

    fireEvent.pointerDown(viewLayer, {
      pointerId: 4,
      clientX: 0,
      clientY: 0,
      button: 0,
      isPrimary: true,
    });
    fireEvent.pointerMove(field, { pointerId: 4, clientX: 10, clientY: 5 });
    fireEvent.pointerCancel(field, { pointerId: 4 });
    fireEvent.pointerMove(field, { pointerId: 4, clientX: 30, clientY: 20 });
    expect(viewLayer.style.transform).toBe('translate(10px, 5px) scale(1)');

    fireEvent.pointerDown(viewLayer, {
      pointerId: 5,
      clientX: 0,
      clientY: 0,
      button: 0,
      isPrimary: true,
    });
    fireEvent.pointerMove(field, { pointerId: 5, clientX: 10, clientY: 5 });
    fireEvent(window, new Event('blur'));
    fireEvent.pointerMove(field, { pointerId: 5, clientX: 40, clientY: 30 });
    expect(viewLayer.style.transform).toBe('translate(20px, 10px) scale(1)');
  });

  it('无背景时空白和棋子上的滚轮都以鼠标为锚点缩放整个战场', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const field = requireArmyFormationField();
    setArmyFormationFieldRect(field, { left: 100, top: 50, width: 390, height: 240 });
    const viewLayer = requireArmyBattlefieldViewLayer();
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole<HTMLButtonElement>('button', { name: pieceName });
    const pieceMapPositionBeforeZoom = piecePosition(piece);
    const blankPointBeforeZoom = toArmyFormationMapPoint(readArmyBattlefieldViewTransform(), 120, 80);

    const zoomEvent = dispatchArmyBattlefieldWheel(viewLayer, {
      clientX: 160,
      clientY: 90,
      deltaY: -10000,
    });
    const maxZoomView = readArmyBattlefieldViewTransform();
    expect(zoomEvent.defaultPrevented).toBe(true);
    expect(maxZoomView.offsetXPx).toBeCloseTo(120 - (120 * 8), 6);
    expect(maxZoomView.offsetYPx).toBeCloseTo(80 - (80 * 8), 6);
    expect(maxZoomView.scale).toBe(8);
    const blankPointAfterZoom = toArmyFormationMapPoint(maxZoomView, 120, 80);
    expect(blankPointAfterZoom.x).toBeCloseTo(blankPointBeforeZoom.x);
    expect(blankPointAfterZoom.y).toBeCloseTo(blankPointBeforeZoom.y);
    expect(piecePosition(piece)).toBe(pieceMapPositionBeforeZoom);

    fireEvent.click(screen.getByRole('button', { name: '适配整个战场' }));
    expect(viewLayer.style.transform).toBe('translate(0px, 0px) scale(1)');
    expect(piecePosition(piece)).toBe(pieceMapPositionBeforeZoom);
    const piecePointBeforeZoom = toArmyFormationMapPoint(readArmyBattlefieldViewTransform(), 25, 15);
    const pieceWheelEvent = dispatchArmyBattlefieldWheel(piece, {
      clientX: 112.5,
      clientY: 57.5,
      deltaY: -100,
    });
    const pieceZoomView = readArmyBattlefieldViewTransform();
    const toolbarWheelEvent = dispatchArmyBattlefieldWheel(
      screen.getByRole('button', { name: '上传图片' }),
      { deltaY: -100 },
    );
    expect(pieceWheelEvent.defaultPrevented).toBe(true);
    expect(toolbarWheelEvent.defaultPrevented).toBe(false);
    expect(pieceZoomView.scale).toBeCloseTo(Math.exp(0.2));
    const piecePointAfterZoom = toArmyFormationMapPoint(pieceZoomView, 25, 15);
    expect(piecePointAfterZoom.x).toBeCloseTo(piecePointBeforeZoom.x);
    expect(piecePointAfterZoom.y).toBeCloseTo(piecePointBeforeZoom.y);
  });

  it('四个战场各自保留会话视角，复位只恢复当前视角且不写入存档', () => {
    renderArmyFormationWithStoredBackgrounds([
      'data:image/webp;base64,battle-1',
      'data:image/webp;base64,battle-2',
      'data:image/webp;base64,battle-3',
      'data:image/webp;base64,battle-4',
    ]);

    const nextButton = screen.getByRole('button', { name: '切换到下一场' });
    const battlefieldTransforms: string[] = [];
    for (let battlefieldIndex = 0; battlefieldIndex < 4; battlefieldIndex += 1) {
      const field = requireArmyFormationField(battlefieldIndex);
      setArmyFormationFieldRect(field);
      if (battlefieldIndex > 0) {
        expect(requireArmyBattlefieldViewLayer(battlefieldIndex).style.transform).toBe(
          'translate(0px, 0px) scale(1)',
        );
      }
      dispatchArmyBattlefieldWheel(requireArmyBattlefieldViewLayer(battlefieldIndex), {
        clientX: 120,
        clientY: 80,
        deltaY: -100,
      });
      battlefieldTransforms.push(requireArmyBattlefieldViewLayer(battlefieldIndex).style.transform);
      fireEvent.click(nextButton);
    }

    expect(screen.getByText('战场 1/4', { exact: true })).toBeTruthy();
    for (let battlefieldIndex = 0; battlefieldIndex < 4; battlefieldIndex += 1) {
      expect(requireArmyBattlefieldViewLayer(battlefieldIndex).style.transform).toBe(
        battlefieldTransforms[battlefieldIndex],
      );
      fireEvent.click(nextButton);
    }

    fireEvent.click(screen.getByRole('button', { name: '适配整个战场' }));
    expect(requireArmyBattlefieldViewLayer().style.transform).toBe('translate(0px, 0px) scale(1)');
    fireEvent.click(nextButton);
    expect(requireArmyBattlefieldViewLayer(1).style.transform).toBe(battlefieldTransforms[1]);

    const storedDocument = JSON.parse(
      localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY) ?? 'null',
    ) as { battlefields: readonly Record<string, unknown>[] };
    for (const battlefield of storedDocument.battlefields) {
      expect(battlefield).not.toHaveProperty('backgroundImageTransform');
      expect(battlefield).not.toHaveProperty('battlefieldViewTransform');
    }
  });

  it('上传时切换战场仍把图片写入最初捕获的战场', async () => {
    let resolveCompression!: (
      result: Awaited<ReturnType<typeof armyFormationBackgroundUpload.compressArmyFormationBackgroundImage>>,
    ) => void;
    const pendingCompression = new Promise<
      Awaited<ReturnType<typeof armyFormationBackgroundUpload.compressArmyFormationBackgroundImage>>
    >((resolve) => {
      resolveCompression = resolve;
    });
    const compress = vi
      .spyOn(armyFormationBackgroundUpload, 'compressArmyFormationBackgroundImage')
      .mockReturnValue(pendingCompression);
    render(<ArmyFormationCreator locale="zh" />);

    const file = new File(['image'], 'battle-background.png', { type: 'image/png' });
    chooseArmyFormationBackgroundImage(file);
    expect(compress).toHaveBeenCalledWith(
      file,
      armyFormationBackgroundUpload.ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX,
      armyFormationBackgroundUpload.ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX,
    );

    fireEvent.click(screen.getByRole('button', { name: '切换到下一场' }));
    expect(screen.getByText('战场 2/4', { exact: true })).toBeTruthy();
    resolveCompression({ status: 'compressed', dataUrl: 'data:image/webp;base64,uploaded' });

    await waitFor(() => {
      const savedDocument = JSON.parse(
        localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY) ?? 'null',
      ) as { battlefields: readonly { backgroundImageUrl: string }[] };
      expect(savedDocument.battlefields[0]?.backgroundImageUrl).toBe(
        'data:image/webp;base64,uploaded',
      );
      expect(savedDocument.battlefields[1]?.backgroundImageUrl).toBe('');
    });
    expect(requireArmyFormationField(1).querySelector('img')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '切换到上一场' }));
    expect(requireArmyBackgroundImage(0).getAttribute('src')).toBe(
      'data:image/webp;base64,uploaded',
    );
  });

  it('替换和移除背景都会复位视角，移除后仍可缩放并复位', async () => {
    renderArmyFormationWithStoredBackgrounds(['data:image/webp;base64,original']);
    const field = requireArmyFormationField();
    const viewLayer = requireArmyBattlefieldViewLayer();
    setArmyFormationFieldRect(field);
    dispatchArmyBattlefieldWheel(field, { clientX: 180, clientY: 120, deltaY: -100 });
    expect(viewLayer.style.transform).not.toBe('translate(0px, 0px) scale(1)');

    const file = new File(['replacement'], 'replacement.png', { type: 'image/png' });
    const compress = vi
      .spyOn(armyFormationBackgroundUpload, 'compressArmyFormationBackgroundImage')
      .mockResolvedValue({ status: 'compressed', dataUrl: 'data:image/webp;base64,replacement' });
    chooseArmyFormationBackgroundImage(file);

    await waitFor(() => {
      expect(requireArmyBackgroundImage().getAttribute('src')).toBe(
        'data:image/webp;base64,replacement',
      );
    });
    expect(compress).toHaveBeenCalledWith(
      file,
      armyFormationBackgroundUpload.ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX,
      armyFormationBackgroundUpload.ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX,
    );
    expect(viewLayer.style.transform).toBe('translate(0px, 0px) scale(1)');

    dispatchArmyBattlefieldWheel(field, { clientX: 180, clientY: 120, deltaY: -100 });
    fireEvent.click(screen.getByRole('button', { name: '移除图片' }));
    expect(requireArmyFormationField().querySelector('img')).toBeNull();
    expect(screen.getByRole('button', { name: '适配整个战场' })).toBeTruthy();
    expect(viewLayer.style.transform).toBe('translate(0px, 0px) scale(1)');
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBeNull();

    dispatchArmyBattlefieldWheel(viewLayer, { clientX: 180, clientY: 120, deltaY: -100 });
    expect(viewLayer.style.transform).not.toBe('translate(0px, 0px) scale(1)');
    fireEvent.click(screen.getByRole('button', { name: '适配整个战场' }));
    expect(viewLayer.style.transform).toBe('translate(0px, 0px) scale(1)');
  });

  it('上传存档失败时保留旧内存图片和旧文档', async () => {
    storeArmyFormationBackgroundImages(['data:image/webp;base64,original']);
    render(<ArmyFormationCreator locale="zh" />);
    restoreArmyFormationRecord();
    const previousStoredDocument = localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);
    if (previousStoredDocument === null) {
      throw new Error('Army formation storage failure test requires the existing document.');
    }

    const setItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      key: string,
      value: string,
    ) {
      if (key === ARMY_FORMATION_DOCUMENT_STORAGE_KEY) {
        throw new Error('Storage quota exceeded.');
      }
      setItem.call(this, key, value);
    });
    vi.spyOn(armyFormationBackgroundUpload, 'compressArmyFormationBackgroundImage').mockResolvedValue({
      status: 'compressed',
      dataUrl: 'data:image/webp;base64,rejected-by-storage',
    });

    chooseArmyFormationBackgroundImage(
      new File(['replacement'], 'replacement.png', { type: 'image/png' }),
    );

    expect((await screen.findByRole('alert')).textContent).toContain('Storage quota exceeded.');
    expect(requireArmyBackgroundImage().getAttribute('src')).toBe(
      'data:image/webp;base64,original',
    );
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(previousStoredDocument);
  });

  it('导入和重新挂载都把会话视角恢复为默认视图', async () => {
    const firstView = renderArmyFormationWithStoredBackgrounds(['data:image/webp;base64,original']);
    const field = requireArmyFormationField();
    const viewLayer = requireArmyBattlefieldViewLayer();
    setArmyFormationFieldRect(field);
    dispatchArmyBattlefieldWheel(viewLayer, { clientX: 150, clientY: 100, deltaY: -100 });
    expect(viewLayer.style.transform).not.toBe('translate(0px, 0px) scale(1)');

    const storedDocumentBeforeImport = localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);
    expect(storedDocumentBeforeImport).not.toBeNull();
    expect(storedDocumentBeforeImport).not.toContain('backgroundImageTransform');
    const importedDocument = createBackgroundImageUrlDocument('data:image/webp;base64,imported');
    chooseArmyFormationFile(
      new File([serializeArmyFormationDocument(importedDocument)], 'imported.txt', {
        type: 'text/plain',
      }),
    );
    await waitFor(() => {
      expect(requireArmyBackgroundImage().getAttribute('src')).toBe(
        'data:image/webp;base64,imported',
      );
    });
    expect(requireArmyBattlefieldViewLayer().style.transform).toBe('translate(0px, 0px) scale(1)');

    dispatchArmyBattlefieldWheel(requireArmyBattlefieldViewLayer(), {
      clientX: 150,
      clientY: 100,
      deltaY: -100,
    });
    firstView.unmount();
    render(<ArmyFormationCreator locale="zh" />);
    restoreArmyFormationRecord();
    expect(requireArmyBattlefieldViewLayer().style.transform).toBe('translate(0px, 0px) scale(1)');
  });

  it('选择文件后直接打开，坏文件会把原字符串显示出来', async () => {
    const loaded = addArmyFormationPiece(
      createEmptyArmyFormationDocument(),
      'helmet-01',
      'piece-from-file',
      780,
    );
    render(<ArmyFormationCreator locale="zh" />);

    chooseArmyFormationFile(
      new File([serializeArmyFormationDocument(loaded)], 'formation.txt', { type: 'text/plain' }),
    );

    expect(await screen.findByRole('button', { name: 'piece-from-file' })).toBeTruthy();
    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('0,0');
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('helmet-01');
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('piece-from-file');

    chooseArmyFormationFile(new File(['not-json-at-all'], 'broken.txt', { type: 'text/plain' }));

    expect((await screen.findByRole('alert')).textContent).toContain('not-json-at-all');
  });

  it.each(['en', 'zh'] as const)('%s rejected background images show the actual error beside upload controls', async (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    render(<ArmyFormationCreator locale={locale} />);

    chooseArmyFormationFile(
      new File(['unsupported-image'], 'background.gif', { type: 'image/gif' }),
      copy.backgroundImage,
    );

    const failure = await screen.findByRole('alert');
    expect(failure.textContent).toBe(copy.backgroundImageFormatError.replace('{received}', 'image/gif'));
    const uploadContainer = requireSharedControlContainer(failure, [
      screen.getByRole('button', { name: copy.uploadBackgroundImage }),
    ]);
    expect(uploadContainer.contains(screen.getByLabelText(copy.height))).toBe(false);
    expect(uploadContainer.contains(screen.getByRole('button', { name: copy.resetBackgroundColor }))).toBe(false);
    expect(uploadContainer.querySelector('[data-army-field]')).toBeNull();
    expect(failure.closest('.fixed')).toBeNull();
  });

  it.each(['en', 'zh'] as const)('%s broken imports show their original content beside file controls and preserve the current document', async (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    render(<ArmyFormationCreator locale={locale} />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const savedBeforeImport = localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);

    chooseArmyFormationFile(
      new File(['not-json-at-all'], 'broken.txt', { type: 'text/plain' }),
      copy.chooseFile,
    );

    const failure = await screen.findByRole('alert');
    expect(failure.textContent).toContain('not-json-at-all');
    const fileContainer = requireSharedControlContainer(failure, [
      screen.getByRole('button', { name: copy.exportFile }),
      screen.getByRole('button', { name: copy.exportPng }),
      screen.getByRole('button', { name: copy.chooseFile }),
    ]);
    expect(fileContainer.contains(screen.getByLabelText(copy.height))).toBe(false);
    expect(fileContainer.querySelector('[data-army-field]')).toBeNull();
    expect(failure.closest('.fixed')).toBeNull();
    expect(screen.getByRole('button', { name: pieceName })).toBeTruthy();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(savedBeforeImport);
  });

  it.each(['en', 'zh'] as const)('%s applied background uploads report autosave failures globally while rejected images remain local', async (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j6mQAAAAASUVORK5CYII=';
    const backgroundImageUrl = `data:image/png;base64,${pngBase64}`;
    const imageFile = new File(
      [Uint8Array.from(atob(pngBase64), (character) => character.charCodeAt(0))],
      'background.png',
      { type: 'image/png' },
    );
    const compressBackgroundImage = vi.spyOn(
      armyFormationBackgroundUpload,
      'compressArmyFormationBackgroundImage',
    ).mockResolvedValueOnce({ status: 'compressed', dataUrl: backgroundImageUrl });
    render(<ArmyFormationCreator locale={locale} />);
    placeArmyFormationPiece('helmet-01');
    const savedBeforeUpload = localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);
    const saveFailure = new Error('Army formation autosave failed after applying background.png.');
    const writeBrowserSave = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw saveFailure;
    });

    chooseArmyFormationFile(imageFile, copy.backgroundImage);

    const failure = await screen.findByRole('alert');
    expect(failure.textContent).toContain(saveFailure.message);
    const notice = expectFixedBottomRightFailure(failure);
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(controlGroup(copy.changeBattlefield).contains(failure)).toBe(false);
    expect(document.querySelector('[data-army-field] img')).toBeNull();
    expect(screen.queryByRole('button', { name: copy.removeBackgroundImage })).toBeNull();
    expect(compressBackgroundImage).toHaveBeenCalledWith(
      imageFile,
      armyFormationBackgroundUpload.ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX,
      armyFormationBackgroundUpload.ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX,
    );
    expect(writeBrowserSave).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(savedBeforeUpload);
    fireEvent.click(within(notice).getByRole('button', { name: copy.dismissError }));
    expect(screen.queryByRole('alert')).toBeNull();

    chooseArmyFormationFile(
      new File(['unsupported-image'], 'background.gif', { type: 'image/gif' }),
      copy.backgroundImage,
    );
    const imageFailure = await screen.findByRole('alert');
    expect(imageFailure.textContent).toBe(copy.backgroundImageFormatError.replace('{received}', 'image/gif'));
    expect(imageFailure.closest('.fixed')).toBeNull();
    requireSharedControlContainer(imageFailure, [
      screen.getByRole('button', { name: copy.uploadBackgroundImage }),
    ]);
    expect(writeBrowserSave).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-army-field] img')).toBeNull();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(savedBeforeUpload);
  });

  it.each(['en', 'zh'] as const)('%s applied background removal reports autosave failures in a dismissible global notice', (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    const backgroundImageUrl = 'https://example.com/army-field.png';
    const savedDocument = setArmyBackgroundImageUrl(
      addArmyFormationPiece(createEmptyArmyFormationDocument(), 'helmet-01', 'piece-with-background', 780),
      backgroundImageUrl,
    );
    localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, serializeArmyFormationDocument(savedDocument));
    render(<ArmyFormationCreator locale={locale} />);
    fireEvent.click(screen.getByRole('button', { name: copy.restorePreviousRecord }));
    const savedBeforeRemoval = localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);
    expect(document.querySelector('[data-army-field] img')?.getAttribute('src')).toBe(backgroundImageUrl);
    const saveFailure = new Error('Army formation autosave failed after removing the background image.');
    const writeBrowserSave = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw saveFailure;
    });

    fireEvent.click(screen.getByRole('button', { name: copy.removeBackgroundImage }));

    const failure = screen.getByRole('alert');
    expect(failure.textContent).toContain(saveFailure.message);
    const notice = expectFixedBottomRightFailure(failure);
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(controlGroup(copy.changeBattlefield).contains(failure)).toBe(false);
    expect(document.querySelector('[data-army-field] img')).toBeNull();
    expect(screen.queryByRole('button', { name: copy.removeBackgroundImage })).toBeNull();
    expect(screen.getByRole('button', { name: 'piece-with-background' })).toBeTruthy();
    expect(writeBrowserSave).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(savedBeforeRemoval);
    fireEvent.click(within(notice).getByRole('button', { name: copy.dismissError }));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it.each(['en', 'zh'] as const)('%s applied imports report autosave failures globally while invalid imports remain local', async (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    const importedDocument = addArmyFormationPiece(
      createEmptyArmyFormationDocument(),
      'helmet-02',
      'piece-from-unsaved-import',
      780,
    );
    render(<ArmyFormationCreator locale={locale} />);
    const previousPieceName = placeArmyFormationPiece('helmet-01');
    const savedBeforeImport = localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);
    const saveFailure = new Error('Army formation autosave failed after applying formation.txt.');
    const writeBrowserSave = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw saveFailure;
    });

    chooseArmyFormationFile(
      new File([serializeArmyFormationDocument(importedDocument)], 'formation.txt', { type: 'text/plain' }),
      copy.chooseFile,
    );

    const failure = await screen.findByRole('alert');
    expect(failure.textContent).toContain(saveFailure.message);
    const notice = expectFixedBottomRightFailure(failure);
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'piece-from-unsaved-import' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: previousPieceName })).toBeNull();
    expect(writeBrowserSave).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(savedBeforeImport);
    fireEvent.click(within(notice).getByRole('button', { name: copy.dismissError }));
    expect(screen.queryByRole('alert')).toBeNull();

    chooseArmyFormationFile(
      new File(['invalid-import-after-save-failure'], 'broken.txt', { type: 'text/plain' }),
      copy.chooseFile,
    );
    const fileFailure = await screen.findByRole('alert');
    expect(fileFailure.textContent).toContain('invalid-import-after-save-failure');
    expect(fileFailure.closest('.fixed')).toBeNull();
    const fileContainer = requireSharedControlContainer(fileFailure, [
      screen.getByRole('button', { name: copy.exportFile }),
      screen.getByRole('button', { name: copy.exportPng }),
      screen.getByRole('button', { name: copy.chooseFile }),
    ]);
    expect(fileContainer.contains(screen.getByLabelText(copy.height))).toBe(false);
    expect(fileContainer.querySelector('[data-army-field]')).toBeNull();
    expect(screen.getByRole('button', { name: 'piece-from-unsaved-import' })).toBeTruthy();
    expect(writeBrowserSave).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(savedBeforeImport);
  });

  it.each(['en', 'zh'] as const)('%s unrelated successful actions preserve errors from other controls', async (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    render(<ArmyFormationCreator locale={locale} />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    fireEvent.click(screen.getByRole('button', { name: pieceName }));
    chooseArmyFormationFile(
      new File(['invalid-formation-file'], 'broken.txt', { type: 'text/plain' }),
      copy.chooseFile,
    );
    const fileFailure = await screen.findByRole('alert');
    expect(fileFailure.textContent).toContain('invalid-formation-file');

    const angleInput = requireArmyFormationInput(copy.angle);
    const heightInput = requireArmyFormationInput(copy.height);
    fireEvent.change(angleInput, { target: { value: '30' } });
    fireEvent.change(heightInput, { target: { value: '600' } });
    expect(fileFailure.isConnected).toBe(true);

    chooseArmyFormationFile(
      new File(['unsupported-image'], 'background.gif', { type: 'image/gif' }),
      copy.backgroundImage,
    );
    const imageFailure = await screen.findByText(
      copy.backgroundImageFormatError.replace('{received}', 'image/gif'),
      { exact: true },
    );
    expect(fileFailure.isConnected).toBe(true);

    fireEvent.change(angleInput, { target: { value: '' } });
    fireEvent.blur(angleInput);
    const angleFailure = expectInputFailure(
      angleInput,
      copy.angleInputError.replace('{received}', '""'),
      copy.changeSelectedPieces,
    );
    fireEvent.change(heightInput, { target: { value: '700' } });
    expect(angleFailure.isConnected).toBe(true);
    expect(fileFailure.isConnected).toBe(true);
    expect(imageFailure.isConnected).toBe(true);

    fireEvent.change(angleInput, { target: { value: '45' } });
    expect(angleFailure.isConnected).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: copy.resetHeight }));
    expect(fileFailure.isConnected).toBe(true);
    expect(imageFailure.isConnected).toBe(true);
  });

  it('不点保存按钮，摆上 helmet-01 后记录里就有这枚棋子', () => {
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));

    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('helmet-01');
  });

  it('有上次记录时先询问，回到上次后棋子出现且记录还在', () => {
    storeArmyFormationHelmet('piece-from-record');
    render(<ArmyFormationCreator locale="zh" />);

    expect(pieceButtons()).toHaveLength(0);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText('发现上次的记录。要回到上次的记录吗？')).toBeTruthy();
    expect(screen.getByRole('button', { name: '回到上次' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '从空白开始' })).toBeTruthy();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('helmet-01');

    fireEvent.click(screen.getByRole('button', { name: '回到上次' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(pieceButtons()).toHaveLength(1);
    expect(pieceButtons()[0]?.getAttribute('aria-label')).toBe('piece-from-record');
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain('helmet-01');
  });

  it('从空白开始会立刻删掉旧记录，再次打开不再询问', () => {
    storeArmyFormationHelmet('piece-from-record');
    const first = render(<ArmyFormationCreator locale="zh" />);

    expect(pieceButtons()).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: '从空白开始' }));

    expect(pieceButtons()).toHaveLength(0);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();

    first.unmount();
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByText('发现上次的记录。要回到上次的记录吗？')).toBeNull();
    expect(screen.queryByRole('button', { name: '回到上次' })).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(pieceButtons()).toHaveLength(0);
  });

  it('空白记录不是可恢复记录，读到后会删掉钥匙', () => {
    localStorage.setItem(
      ARMY_FORMATION_DOCUMENT_STORAGE_KEY,
      serializeArmyFormationDocument(createEmptyArmyFormationDocument()),
    );
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(pieceButtons()).toHaveLength(0);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBeNull();
  });

  it('英文询问显示上次记录的三句文案', () => {
    storeArmyFormationHelmet('piece-from-record');
    render(<ArmyFormationCreator locale="en" />);

    expect(pieceButtons()).toHaveLength(0);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText('A previous record was found. Restore it?')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Restore' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Start blank' })).toBeTruthy();
  });

  it('坏的浏览器存档会抛到页面上并带上原字符串', () => {
    const raw = 'broken-army-formation-save';
    localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, raw);

    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.getByRole('alert').textContent).toContain(raw);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByText('发现上次的记录。要回到上次的记录吗？')).toBeNull();
    expect(pieceButtons()).toHaveLength(0);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(raw);
  });

  it.each(['en', 'zh'] as const)('%s invalid browser saves show a fixed bottom-right error that can be dismissed without deleting the save', (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    const raw = 'broken-army-formation-save';
    localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, raw);
    render(<ArmyFormationCreator locale={locale} />);

    const failure = screen.getByRole('alert');
    expect(failure.textContent).toContain(raw);
    const notice = expectFixedBottomRightFailure(failure);
    fireEvent.click(within(notice).getByRole('button', { name: copy.dismissError }));

    expect(screen.queryByRole('alert')).toBeNull();
    expect(notice.isConnected).toBe(false);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(raw);
    expect(pieceButtons()).toHaveLength(0);
  });

  it.each(['en', 'zh'] as const)('%s local errors keep a dismissed invalid startup save closed while new autosave failures remain visible', async (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    const invalidSavedText = 'broken-army-formation-save';
    localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, invalidSavedText);
    render(<ArmyFormationCreator locale={locale} />);
    const startupFailure = screen.getByRole('alert');
    expect(startupFailure.textContent).toContain(invalidSavedText);
    const startupNotice = expectFixedBottomRightFailure(startupFailure);
    fireEvent.click(within(startupNotice).getByRole('button', { name: copy.dismissError }));
    expect(screen.queryByRole('alert')).toBeNull();
    const writeBrowserSave = vi.spyOn(Storage.prototype, 'setItem');

    const angleInput = requireArmyFormationInput(copy.angle);
    fireEvent.change(angleInput, { target: { value: '' } });
    fireEvent.blur(angleInput);
    const angleFailure = expectInputFailure(
      angleInput,
      copy.angleInputError.replace('{received}', '""'),
      copy.changeSelectedPieces,
    );
    expect(screen.queryByText(/broken-army-formation-save/)).toBeNull();
    expect(screen.queryByRole('button', { name: copy.dismissError })).toBeNull();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(invalidSavedText);

    const heightInput = requireArmyFormationInput(copy.height);
    fireEvent.change(heightInput, { target: { value: '199' } });
    fireEvent.blur(heightInput);
    const heightFailure = expectInputFailure(
      heightInput,
      copy.heightRangeError.replace('{received}', '"199"'),
      copy.changeBattlefield,
    );
    expect(document.querySelector('[data-army-field]')?.getAttribute('data-field-height')).toBe('480');
    expect(screen.queryByText(/broken-army-formation-save/)).toBeNull();
    expect(screen.queryByRole('button', { name: copy.dismissError })).toBeNull();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(invalidSavedText);

    chooseArmyFormationFile(
      new File(['unsupported-image'], 'background.gif', { type: 'image/gif' }),
      copy.backgroundImage,
    );
    const imageFailure = await screen.findByText(
      copy.backgroundImageFormatError.replace('{received}', 'image/gif'),
      { exact: true },
    );
    expect(imageFailure.closest('.fixed')).toBeNull();
    requireSharedControlContainer(imageFailure, [
      screen.getByRole('button', { name: copy.uploadBackgroundImage }),
    ]);
    expect(screen.queryByText(/broken-army-formation-save/)).toBeNull();
    expect(screen.queryByRole('button', { name: copy.dismissError })).toBeNull();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(invalidSavedText);

    chooseArmyFormationFile(
      new File(['invalid-import-after-startup-dismissal'], 'broken.txt', { type: 'text/plain' }),
      copy.chooseFile,
    );
    const fileFailure = await screen.findByText(/invalid-import-after-startup-dismissal/);
    expect(fileFailure.closest('.fixed')).toBeNull();
    const fileContainer = requireSharedControlContainer(fileFailure, [
      screen.getByRole('button', { name: copy.exportFile }),
      screen.getByRole('button', { name: copy.exportPng }),
      screen.getByRole('button', { name: copy.chooseFile }),
    ]);
    expect(fileContainer.contains(screen.getByLabelText(copy.height))).toBe(false);
    expect(screen.queryByText(/broken-army-formation-save/)).toBeNull();
    expect(screen.queryByRole('button', { name: copy.dismissError })).toBeNull();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(invalidSavedText);
    expect(writeBrowserSave).not.toHaveBeenCalled();
    expect(startupNotice.isConnected).toBe(false);
    expect(pieceButtons()).toHaveLength(0);

    const saveFailure = new Error('New army formation autosave failed after dismissing the invalid startup save.');
    writeBrowserSave.mockImplementation(() => {
      throw saveFailure;
    });
    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));
    const globalFailure = screen.getByText(saveFailure.message, { exact: false });
    const globalNotice = expectFixedBottomRightFailure(globalFailure);
    expect(writeBrowserSave).toHaveBeenCalledTimes(1);
    expect(pieceButtons()).toHaveLength(1);
    expect(screen.queryByText(/broken-army-formation-save/)).toBeNull();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(invalidSavedText);
    fireEvent.click(within(globalNotice).getByRole('button', { name: copy.dismissError }));
    expect(globalNotice.isConnected).toBe(false);
    expect(screen.queryByText(/broken-army-formation-save/)).toBeNull();
    expect(screen.queryByRole('button', { name: copy.dismissError })).toBeNull();
    expect(angleFailure.isConnected).toBe(true);
    expect(heightFailure.isConnected).toBe(true);
    expect(imageFailure.isConnected).toBe(true);
    expect(fileFailure.isConnected).toBe(true);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(invalidSavedText);
  });

  it.each(['en', 'zh'] as const)('%s autosave failures use a dismissible global notice and report a new failure after dismissal', (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    render(<ArmyFormationCreator locale={locale} />);
    const saveFailure = new Error('Army formation autosave failed: browser storage write refused.');
    const writeBrowserSave = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw saveFailure;
    });

    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));
    const failure = screen.getByRole('alert');
    expect(failure.textContent).toContain(saveFailure.message);
    const notice = expectFixedBottomRightFailure(failure);
    expect(writeBrowserSave).toHaveBeenCalledTimes(1);
    fireEvent.click(within(notice).getByRole('button', { name: copy.dismissError }));
    expect(screen.queryByRole('alert')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /^helmet-02$/ }));
    expect(writeBrowserSave).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('alert').textContent).toContain(saveFailure.message);
    expectFixedBottomRightFailure(screen.getByRole('alert'));
  });

  it.each(['en', 'zh'] as const)('%s storage failures for valid numbers stay global without invalidating angle or height inputs', (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    render(<ArmyFormationCreator locale={locale} />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: pieceName });
    fireEvent.click(piece);
    const saveFailure = new Error('Army formation autosave failed while applying a valid number.');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw saveFailure;
    });

    const angleInput = requireArmyFormationInput(copy.angle);
    const heightInput = requireArmyFormationInput(copy.height);
    fireEvent.change(angleInput, { target: { value: '45' } });
    expect(piece.getAttribute('data-rotation-degrees')).toBe('45');
    expect(angleInput.value).toBe('45');
    expect(angleInput.getAttribute('aria-invalid')).not.toBe('true');
    expect(angleInput.getAttribute('aria-describedby')).toBeNull();
    expect(screen.getByRole('alert').textContent).toContain(saveFailure.message);
    expectFixedBottomRightFailure(screen.getByRole('alert'));

    fireEvent.change(heightInput, { target: { value: '600' } });
    expect(document.querySelector('[data-army-field]')?.getAttribute('data-field-height')).toBe('600');
    expect(heightInput.value).toBe('600');
    expect(heightInput.getAttribute('aria-invalid')).not.toBe('true');
    expect(heightInput.getAttribute('aria-describedby')).toBeNull();
    expect(screen.getByRole('alert').textContent).toContain(saveFailure.message);
    expectFixedBottomRightFailure(screen.getByRole('alert'));
  });

  it.each(['en', 'zh'] as const)('%s restore-dialog storage failures remain visible above the modal and can be dismissed outside inert content', (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    storeArmyFormationHelmet('piece-from-record');
    const savedBeforeStartingBlank = localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);
    render(<ArmyFormationCreator locale={locale} />);
    const removeFailure = new Error('Could not remove the previous army formation browser save.');
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw removeFailure;
    });

    fireEvent.click(screen.getByRole('button', { name: copy.startBlank }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    const failure = screen.getByRole('alert');
    expect(failure.textContent).toContain(removeFailure.message);
    const notice = expectFixedBottomRightFailure(failure);
    expect(notice.closest('[inert]')).toBeNull();
    const stackingClass = [...notice.classList].find((className) => /^z-(\d+|\[\d+\])$/.test(className));
    const stackingOrder = Number(stackingClass?.replace(/^z-\[?|\]$/g, ''));
    expect(stackingOrder).toBeGreaterThan(60);
    const dismissButton = within(notice).getByRole('button', { name: copy.dismissError });
    expect(dismissButton.closest('[inert]')).toBeNull();
    fireEvent.click(dismissButton);

    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBe(savedBeforeStartingBlank);
  });

  it('坏档警告在写入 helmet-01 后消失，钥匙换成新文档', () => {
    const raw = 'broken-army-formation-save';
    localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, raw);
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.getByRole('alert').textContent).toContain(raw);

    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));

    expect(screen.queryByRole('alert')?.textContent ?? '').not.toContain(raw);
    const stored = localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);
    expect(stored).toContain('helmet-01');
    expect(stored).not.toContain(raw);
  });

  it('坏档警告在导入空白文档后消失，钥匙被删掉', async () => {
    const raw = 'broken-army-formation-save';
    localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, raw);
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.getByRole('alert').textContent).toContain(raw);

    chooseArmyFormationFile(
      new File(
        [serializeArmyFormationDocument(createEmptyArmyFormationDocument())],
        'empty-formation.txt',
        { type: 'text/plain' },
      ),
    );

    await waitFor(() => {
      expect(screen.queryByRole('alert')?.textContent ?? '').not.toContain(raw);
    });
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toBeNull();
  });

  it('未知图标的存档显示 icon id，不询问也不画出棋子', () => {
    const missingIconId = 'missing-icon-99';
    const armyDocument = addArmyFormationPiece(
      createEmptyArmyFormationDocument(),
      missingIconId,
      'piece-missing-icon',
      780,
    );
    localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, serializeArmyFormationDocument(armyDocument));

    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.getByRole('alert').textContent).toContain(missingIconId);
    expect(screen.queryByRole('button', { name: '回到上次' })).toBeNull();
    expect(pieceButtons()).toHaveLength(0);
    expect(localStorage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY)).toContain(missingIconId);
  });

  it('导出 PNG 直接下载，不创建 SVG 导出文件或图片预览', async () => {
    const createObjectURL = vi.fn((file: Blob | MediaSource) => {
      if (!(file instanceof Blob) || file.type !== 'image/png') {
        throw new Error(`Expected PNG download Blob. file=${String(file)}`);
      }
      return 'blob:army-formation';
    });
    const revokeObjectURL = vi.fn();
    const pngBlob = new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' });
    const buildArmyFormationPng = vi
      .spyOn(armyFormationImageExport, 'buildArmyFormationPng')
      .mockResolvedValue(pngBlob);
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    vi.spyOn(URL, 'createObjectURL').mockImplementation(createObjectURL);
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(revokeObjectURL);

    renderArmyFormationWithStoredBackgrounds(['data:image/webp;base64,export']);
    const field = requireArmyFormationField();
    setArmyFormationFieldRect(field);
    fireEvent.pointerDown(field, {
      pointerId: 8,
      clientX: 0,
      clientY: 0,
      button: 0,
      isPrimary: true,
    });
    fireEvent.pointerMove(field, { pointerId: 8, clientX: 25, clientY: 15 });
    fireEvent.pointerUp(field, { pointerId: 8, clientX: 25, clientY: 15 });
    dispatchArmyBattlefieldWheel(requireArmyBattlefieldViewLayer(), {
      clientX: 100,
      clientY: 80,
      deltaY: -100,
    });
    const expectedViewTransform = readArmyBattlefieldViewTransform();
    expect(expectedViewTransform.scale).toBeCloseTo(Math.exp(0.2));
    fireEvent.click(screen.getByRole('button', { name: '导出 PNG' }));

    await waitFor(() => expect(createObjectURL).toHaveBeenCalledTimes(1));
    const downloadedBlob = createObjectURL.mock.calls[0]?.[0];
    const downloadLink = anchorClick.mock.contexts[0] as HTMLAnchorElement | undefined;
    expect(buildArmyFormationPng).toHaveBeenCalledTimes(1);
    expect(buildArmyFormationPng).toHaveBeenCalledWith(
      expect.objectContaining({
        backgroundImageUrl: 'data:image/webp;base64,export',
        backgroundImageTransform: expectedViewTransform,
      }),
      armyFormationImageExport.ARMY_FORMATION_PNG_EXPORT_SCALE,
    );
    expect(downloadedBlob).toBe(pngBlob);
    expect(downloadedBlob).toMatchObject({ type: 'image/png' });
    expect(downloadLink?.download).toBe('army-formation-creator.png');
    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:army-formation');
    expect(document.querySelector('svg[aria-label="Army formation creator"]')).toBeNull();
    expect(screen.queryByRole('img', { name: 'Army formation creator' })).toBeNull();
  });

  it('PNG 下载点击失败时撤销对象 URL 并显示原始错误', async () => {
    const clickFailure = new Error('Army formation download click failed.');
    const createObjectURL = vi.fn(() => 'blob:army-formation-failure');
    const revokeObjectURL = vi.fn();
    const pngBlob = new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' });
    vi.spyOn(armyFormationImageExport, 'buildArmyFormationPng').mockResolvedValue(pngBlob);
    vi.spyOn(URL, 'createObjectURL').mockImplementation(createObjectURL);
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(revokeObjectURL);
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
      throw clickFailure;
    });

    render(<ArmyFormationCreator locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: '导出 PNG' }));

    expect((await screen.findByRole('alert')).textContent).toContain(clickFailure.message);
    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:army-formation-failure');
  });

  it.each([
    { locale: 'en', format: 'txt' },
    { locale: 'zh', format: 'txt' },
    { locale: 'en', format: 'png' },
    { locale: 'zh', format: 'png' },
  ] as const)('$locale $format export failures show the actual error beside file controls', async ({ locale, format }) => {
    const copy = getArmyFormationCreatorCopy(locale);
    const exportFailure = new Error(`Army formation ${format} object URL creation failed.`);
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation(() => {
      throw exportFailure;
    });
    const buildArmyFormationPng = vi.spyOn(armyFormationImageExport, 'buildArmyFormationPng')
      .mockResolvedValue(new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' }));
    render(<ArmyFormationCreator locale={locale} />);

    fireEvent.click(screen.getByRole('button', { name: format === 'txt' ? copy.exportFile : copy.exportPng }));

    const failure = await screen.findByRole('alert');
    expect(failure.textContent).toContain(exportFailure.message);
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(buildArmyFormationPng).toHaveBeenCalledTimes(format === 'png' ? 1 : 0);
    const fileContainer = requireSharedControlContainer(failure, [
      screen.getByRole('button', { name: copy.exportFile }),
      screen.getByRole('button', { name: copy.exportPng }),
      screen.getByRole('button', { name: copy.chooseFile }),
    ]);
    expect(fileContainer.contains(screen.getByLabelText(copy.angle))).toBe(false);
    expect(fileContainer.querySelector('[data-army-field]')).toBeNull();
    expect(failure.closest('.fixed')).toBeNull();
  });

  it('保留 TXT 阵型文件导出', async () => {
    const createObjectURL = vi.fn((file: Blob | MediaSource) => {
      if (!(file instanceof Blob) || file.type !== 'text/plain;charset=utf-8') {
        throw new Error(`Expected TXT download Blob. file=${String(file)}`);
      }
      return 'blob:army-formation-text';
    });
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    vi.spyOn(URL, 'createObjectURL').mockImplementation(createObjectURL);
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    render(<ArmyFormationCreator locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: '导出文件' }));

    const downloadedBlob = createObjectURL.mock.calls[0]?.[0];
    const downloadLink = anchorClick.mock.contexts[0] as HTMLAnchorElement | undefined;
    expect(downloadedBlob).toBeInstanceOf(Blob);
    if (!(downloadedBlob instanceof Blob)) {
      throw new Error(`TXT download Blob is missing. downloadedBlob=${String(downloadedBlob)}`);
    }
    expect(JSON.parse(await downloadedBlob.text()).battlefields).toHaveLength(4);
    expect(downloadLink?.download).toBe('army-formation-creator.txt');
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:army-formation-text');
  });

  it('导出文件、导出 PNG、选择文件在战场标题后面，并且不在改战场那一组里', () => {
    render(<ArmyFormationCreator locale="zh" />);
    for (const label of ['导出文件', '导出 PNG', '选择文件']) {
      const button = expectButtonFollowsHeading(label, '战场 1/4');
      expect(controlGroup('改战场').contains(button)).toBe(false);
    }

    cleanup();
    render(<ArmyFormationCreator locale="en" />);
    for (const label of ['Export file', 'Export PNG', 'Choose file']) {
      const button = expectButtonFollowsHeading(label, 'Battlefield 1/4');
      expect(controlGroup('Change battlefield').contains(button)).toBe(false);
    }
  });

  it.each(['en', 'zh'] as const)('%s long invalid startup errors retain the full saved value in a scrollable dismissible notice', (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    const invalidSavedText = `broken-army-formation-save:${'UNEXPECTED-VALUE-异常-'.repeat(250)}`;
    expect(invalidSavedText.length).toBeGreaterThan(4000);
    localStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, invalidSavedText);
    render(<ArmyFormationCreator locale={locale} />);

    const failure = screen.getByRole('alert');
    expect(failure.textContent).toContain(invalidSavedText);
    expect(failure.textContent).toContain(JSON.stringify(invalidSavedText));
    const toastContainer = failure.closest('.fixed');
    expect(toastContainer?.classList.contains('bg-[var(--card)]')).toBe(true);
    expect(toastContainer?.classList.contains('bg-[var(--site-accent-bg)]')).toBe(false);
    const dismissButton = requireScrollableArmyFormationFailureDismissButton(failure, copy.dismissError);
    expect(dismissButton.isConnected).toBe(true);

    fireEvent.click(dismissButton);

    expect(screen.queryByRole('alert')).toBeNull();
    expect(dismissButton.isConnected).toBe(false);
  });

  it.each(['en', 'zh'] as const)('%s long global failures retain the full error and remain independently dismissible', (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    const failureMessage = `Army formation autosave failed with received value: ${'UNEXPECTED-STORAGE-VALUE-异常-'.repeat(200)}END_OF_VALUE`;
    expect(failureMessage.length).toBeGreaterThan(4000);
    const saveFailure = new Error(failureMessage);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw saveFailure;
    });
    render(<ArmyFormationCreator locale={locale} />);

    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));

    const failure = screen.getByRole('alert');
    expect(failure.textContent).toBe(failureMessage);
    const toastContainer = failure.closest('.fixed');
    expect(toastContainer?.classList.contains('bg-[var(--card)]')).toBe(true);
    expect(toastContainer?.classList.contains('bg-[var(--site-accent-bg)]')).toBe(false);
    const dismissButton = requireScrollableArmyFormationFailureDismissButton(failure, copy.dismissError);
    expect(dismissButton.isConnected).toBe(true);

    fireEvent.click(dismissButton);

    expect(screen.queryByRole('alert')).toBeNull();
    expect(dismissButton.isConnected).toBe(false);
  });

  it.each(['en', 'zh'] as const)('%s long invalid JSON imports retain the full raw text and wrap beside file controls', async (locale) => {
    const copy = getArmyFormationCreatorCopy(locale);
    const invalidJsonText = `INVALIDJSON${'X'.repeat(2000)}ABNORMAL_VALUE_END`;
    expect(invalidJsonText.length).toBeGreaterThan(1600);
    render(<ArmyFormationCreator locale={locale} />);

    chooseArmyFormationFile(
      new File([invalidJsonText], 'long-broken.txt', { type: 'text/plain' }),
      copy.chooseFile,
    );

    const failure = await screen.findByRole('alert');
    expect(failure.textContent).toContain(invalidJsonText);
    expect(failure.classList).toContain('break-words');
    expect(failure.closest('.fixed')).toBeNull();
    requireSharedControlContainer(failure, [
      screen.getByRole('button', { name: copy.exportFile }),
      screen.getByRole('button', { name: copy.exportPng }),
      screen.getByRole('button', { name: copy.chooseFile }),
    ]);
  });
});
