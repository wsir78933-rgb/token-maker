// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ArmyFormationCreator } from '@/components/army-formation/ArmyFormationCreator';
import * as armyFormationBackgroundImageUpload from '@/lib/army-formation/background-image-upload';
import { ARMY_FORMATION_DOCUMENT_STORAGE_KEY } from '@/lib/army-formation/browser-saves';
import { getArmyFormationCreatorCopy } from '@/lib/army-formation/copy';
import {
  addArmyFormationPiece,
  createEmptyArmyFormationDocument,
  rotateSelectedArmyFormationPieces,
  serializeArmyFormationDocument,
  setArmyBackgroundImageUrl,
  toggleArmyFormationPieceSelection,
} from '@/lib/army-formation/document';
import * as armyFormationImageExport from '@/lib/army-formation/export-image';

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

function rotationHandleButtons(): HTMLButtonElement[] {
  return [...document.querySelectorAll('[data-army-rotation-handle]')].map((rotationHandle) => {
    if (!(rotationHandle instanceof HTMLButtonElement)) {
      throw new Error(
        `Army rotation handle is not a button. Received ${rotationHandle.constructor.name}.`,
      );
    }

    return rotationHandle;
  });
}

function requireRotationHandleForPiece(pieceId: string): HTMLButtonElement {
  const rotationHandle = rotationHandleButtons().find(
    (candidate) => candidate.getAttribute('data-piece-id') === pieceId,
  );
  if (rotationHandle === undefined) {
    throw new Error(`Army rotation handle is missing for piece ${JSON.stringify(pieceId)}.`);
  }

  return rotationHandle;
}

function mockArmyPieceBounds(
  piece: HTMLButtonElement,
  left = 100,
  top = 100,
  width = 40,
  height = 40,
): void {
  vi.spyOn(piece, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(left, top, width, height),
  );
}

function mockArmyFieldBoundsForDrag(piece: HTMLElement): void {
  const battlefieldField = piece.parentElement;
  if (!(battlefieldField instanceof HTMLElement) || !battlefieldField.hasAttribute('data-army-field')) {
    throw new Error('Army formation drag target is missing its battlefield field.');
  }

  const fieldWidth = Number.parseFloat(battlefieldField.style.width);
  const fieldHeight = Number.parseFloat(battlefieldField.style.height);
  if (
    !Number.isFinite(fieldWidth)
    || fieldWidth <= 0
    || !Number.isFinite(fieldHeight)
    || fieldHeight <= 0
  ) {
    throw new Error(
      `Army formation drag field layout must be positive. width=${fieldWidth} height=${fieldHeight}.`,
    );
  }

  vi.spyOn(battlefieldField, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 0, fieldWidth, fieldHeight),
  );
}

function readArmyInlinePixelStyle(
  element: HTMLElement,
  property: 'left' | 'top' | 'width' | 'height' | 'fontSize' | 'lineHeight' | 'paddingBottom',
): number {
  const value = element.style[property];
  const pixelValue = Number.parseFloat(value);
  if (!value.endsWith('px') || !Number.isFinite(pixelValue)) {
    throw new Error(
      `Army inline ${property} style must be a finite pixel value. Received ${JSON.stringify(value)}.`,
    );
  }

  return pixelValue;
}

function fireLostPointerCapture(target: HTMLButtonElement, pointerId: number): void {
  const event = new Event('lostpointercapture', { bubbles: true });
  Object.defineProperty(event, 'pointerId', { value: pointerId });
  fireEvent(target, event);
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

describe('ArmyFormationCreator', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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

  it('点一个图标后战场出现棋子，再点一个不会叠在同一个位置', () => {
    render(<ArmyFormationCreator locale="zh" />);

    const helmet = screen.getByRole('button', { name: /^helmet-01$/ });
    fireEvent.click(helmet);
    expect(pieceButtons()).toHaveLength(1);
    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('0,0');

    fireEvent.click(screen.getByRole('button', { name: /^helmet-01$/ }));

    const pieces = pieceButtons();
    expect(pieces).toHaveLength(2);
    expect(pieces.map(piecePosition)).toEqual(['0,0', '50,0']);
  });

  it('不把线框说明和读取按钮做进页面', () => {
    render(<ArmyFormationCreator locale="zh" />);

    expect(screen.queryByText('点一个图标，新棋子落到空位')).toBeNull();
    expect(screen.queryByText('换成头盔图标')).toBeNull();
    expect(screen.queryByRole('button', { name: '读取' })).toBeNull();
    expect(screen.queryByRole('button', { name: '读取文件' })).toBeNull();
    expect(screen.queryByRole('button', { name: '变成图片' })).toBeNull();
    expect(screen.getByText('空位')).toBeTruthy();
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
    await screen.findByText('空位');
    expect(screen.queryByRole('button', { name: firstPieceName })).toBeNull();

    const secondPieceName = placeArmyFormationPiece('helmet-01');
    expect(screen.getByRole('button', { name: secondPieceName })).toBeTruthy();
    expect(screen.queryByRole('button', { name: firstPieceName })).toBeNull();

    fireEvent.click(nextBattlefieldButton);
    await screen.findByText('空位');
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

    fireEvent.click(firstPiece());
    expect(firstPiece().getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(firstPiece());
    expect(firstPiece().getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(firstPiece());
    fireEvent.change(screen.getByLabelText('角度'), { target: { value: '45' } });
    expect(firstPiece().getAttribute('data-rotation-degrees')).toBe('45');
    expect(secondPiece().getAttribute('data-rotation-degrees')).toBe('0');
    fireEvent.click(screen.getByRole('button', { name: '重置旋转' }));
    expect(firstPiece().getAttribute('data-rotation-degrees')).toBe('0');
    expect((screen.getByLabelText('角度') as HTMLInputElement).value).toBe('90');

    fireEvent.click(screen.getByRole('button', { name: '删除所选' }));
    expect(pieceButtons()).toHaveLength(1);
    expect(pieceButtons()[0]?.getAttribute('data-rotation-degrees')).toBe('0');

    fireEvent.change(screen.getByLabelText('高度'), { target: { value: '600' } });
    expect(document.querySelector('[data-army-field]')?.getAttribute('data-field-height')).toBe('600');
    fireEvent.click(screen.getByRole('button', { name: /^helmet-02$/ }));
    fireEvent.click(screen.getByRole('button', { name: '清空战场' }));

    expect(pieceButtons()).toHaveLength(0);
    expect(document.querySelector('[data-army-field]')?.getAttribute('data-field-height')).toBe('600');
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
    const angleInput = screen.getByLabelText('角度');

    fireEvent.change(angleInput, { target: { value: '30' } });
    expect(screen.getByRole('button', { name: pieceName }).getAttribute('data-rotation-degrees')).toBe('0');

    fireEvent.click(screen.getByRole('button', { name: '重置旋转' }));
    expect(screen.getByRole('button', { name: pieceName }).getAttribute('data-rotation-degrees')).toBe('0');
    expect((angleInput as HTMLInputElement).value).toBe('90');
  });

  it('selected pieces expose sibling rotation handles while unselected pieces do not', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const firstPieceName = placeArmyFormationPiece('helmet-01');
    const secondPieceName = placeArmyFormationPiece('helmet-02');
    const firstPiece = screen.getByRole('button', { name: firstPieceName });
    const secondPiece = screen.getByRole('button', { name: secondPieceName });

    expect(rotationHandleButtons()).toHaveLength(0);
    expect(firstPiece.getAttribute('aria-label')).toBe(firstPieceName);
    expect(firstPiece.hasAttribute('data-army-piece')).toBe(true);
    expect(firstPiece.getAttribute('data-piece-x')).not.toBeNull();
    expect(firstPiece.getAttribute('data-piece-y')).not.toBeNull();
    expect(firstPiece.getAttribute('data-rotation-degrees')).toBe('0');
    piecePosition(firstPiece as HTMLButtonElement);

    fireEvent.click(firstPiece);
    expect(firstPiece.getAttribute('aria-pressed')).toBe('true');
    expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
      .toEqual([firstPieceName]);
    const firstHandle = requireRotationHandleForPiece(firstPieceName);
    expect(firstHandle.getAttribute('aria-label')).toBe('旋转棋子');
    expect(firstHandle.hasAttribute('data-army-rotation-handle')).toBe(true);
    expect(firstHandle.parentElement).toBe(firstPiece.parentElement);
    expect(firstPiece.contains(firstHandle)).toBe(false);
    expect(secondPiece.getAttribute('aria-pressed')).toBe('false');
    expect(rotationHandleButtons().some((handle) => handle.getAttribute('data-piece-id') === secondPieceName))
      .toBe(false);

    fireEvent.click(secondPiece);
    expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
      .toEqual([firstPieceName, secondPieceName]);
    fireEvent.click(firstPiece);

    expect(firstPiece.getAttribute('aria-pressed')).toBe('false');
    expect(secondPiece.getAttribute('aria-pressed')).toBe('true');
    expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
      .toEqual([secondPieceName]);
  });

  it.each([
    {
      locale: 'en',
      rotatePieceLabel: 'Rotate piece',
      rotationHint: 'Drag the ↻ handle above a selected piece to rotate it.',
    },
    {
      locale: 'zh',
      rotatePieceLabel: '旋转棋子',
      rotationHint: '拖动选中棋子上方的 ↻ 手柄即可旋转。',
    },
  ] as const)('$locale shows the localized rotation handle label and hint', ({
    locale,
    rotatePieceLabel,
    rotationHint,
  }) => {
    render(<ArmyFormationCreator locale={locale} />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    fireEvent.click(screen.getByRole('button', { name: pieceName }));

    const rotationHandle = screen.getByRole('button', { name: rotatePieceLabel });
    expect(rotationHandle.getAttribute('data-army-rotation-handle')).not.toBeNull();
    expect(rotationHandle.getAttribute('data-piece-id')).toBe(pieceName);
    expect(screen.getByText(rotationHint)).toBeTruthy();
  });

  it.each([
    { fieldScale: 0.3, display: 'mobile' },
    { fieldScale: 0.5, display: 'mobile' },
    { fieldScale: 1, display: 'desktop' },
    { fieldScale: 1.15, display: 'desktop' },
  ])('keeps the rotation symbol and target geometry at $fieldScale for $display', ({ fieldScale }) => {
    class ArmyFormationTestResizeObserver implements ResizeObserver {
      constructor(private readonly callback: ResizeObserverCallback) {}

      observe(): void {
        this.callback(
          [{ contentRect: new DOMRect(0, 0, 780 * fieldScale, 0) } as ResizeObserverEntry],
          this,
        );
      }

      unobserve(): void {}

      disconnect(): void {}
    }

    vi.stubGlobal('ResizeObserver', ArmyFormationTestResizeObserver);
    render(<ArmyFormationCreator locale="en" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
    fireEvent.click(piece);

    const rotationHandle = requireRotationHandleForPiece(pieceName);
    const battlefieldField = document.querySelector('[data-army-field]');
    if (!(battlefieldField instanceof HTMLElement)) {
      throw new Error('Rotation symbol scale test requires the public battlefield field element.');
    }

    const fieldScaleMatch = /^scale\(([^)]+)\)$/.exec(battlefieldField.style.transform);
    const renderedFieldScale = Number(fieldScaleMatch?.[1]);
    if (!Number.isFinite(renderedFieldScale) || renderedFieldScale <= 0) {
      throw new Error(
        `Battlefield scale must be positive and finite for the rotation symbol test. Received ${JSON.stringify(battlefieldField.style.transform)}.`,
      );
    }

    const symbolFontSizePx = readArmyInlinePixelStyle(rotationHandle, 'fontSize');
    const symbolLineHeightPx = readArmyInlinePixelStyle(rotationHandle, 'lineHeight');
    const symbolPaddingBottomPx = readArmyInlinePixelStyle(rotationHandle, 'paddingBottom');
    const handleWidth = readArmyInlinePixelStyle(rotationHandle, 'width');
    const handleHeight = readArmyInlinePixelStyle(rotationHandle, 'height');
    const handleLeft = readArmyInlinePixelStyle(rotationHandle, 'left');
    const handleTop = readArmyInlinePixelStyle(rotationHandle, 'top');
    const fieldTop = readArmyInlinePixelStyle(battlefieldField, 'top');
    const fieldWidth = readArmyInlinePixelStyle(battlefieldField, 'width');
    const pieceXText = piece.getAttribute('data-piece-x');
    if (pieceXText === null || !Number.isFinite(Number(pieceXText))) {
      throw new Error(`Army piece x must be finite in the scale test. Received ${JSON.stringify(pieceXText)}.`);
    }
    const pieceTop = readArmyInlinePixelStyle(piece, 'top');
    const pieceWidth = readArmyInlinePixelStyle(piece, 'width');
    const requestedHandleLeft = Number(pieceXText) + pieceWidth / 2 - handleWidth / 2;
    const expectedHandleLeft = Math.min(
      Math.max(requestedHandleLeft, 0),
      fieldWidth - handleWidth,
    );
    const rotationHandleClassNames = [...rotationHandle.classList];

    expect(renderedFieldScale).toBeCloseTo(fieldScale, 5);
    expect(rotationHandle.textContent).toBe('↻');
    expect(rotationHandleClassNames).toContain('box-border');
    expect(rotationHandleClassNames).toContain('items-end');
    expect(rotationHandleClassNames).toContain('bg-transparent');
    expect(rotationHandleClassNames).toContain('text-black');
    expect(rotationHandleClassNames).toContain('hover:bg-transparent');
    expect(rotationHandleClassNames).toContain('focus-visible:outline');
    expect(rotationHandleClassNames.some((className) => className.startsWith('rounded'))).toBe(false);
    expect(rotationHandleClassNames.some((className) => className === 'border' || className.startsWith('border-')))
      .toBe(false);
    expect(rotationHandleClassNames.some((className) => className.startsWith('shadow'))).toBe(false);
    expect(rotationHandleClassNames.filter((className) => className.startsWith('hover:')))
      .toEqual(['hover:bg-transparent']);
    expect(symbolFontSizePx * renderedFieldScale).toBeCloseTo(16, 2);
    expect(symbolLineHeightPx * renderedFieldScale).toBeCloseTo(16, 2);
    expect(symbolPaddingBottomPx * renderedFieldScale).toBeCloseTo(4, 2);
    expect(handleWidth * renderedFieldScale).toBeGreaterThanOrEqual(44 - 0.01);
    expect(handleWidth * renderedFieldScale).toBeLessThanOrEqual(44 + 0.01);
    expect(handleHeight * renderedFieldScale).toBeGreaterThanOrEqual(44 - 0.01);
    expect(handleHeight * renderedFieldScale).toBeLessThanOrEqual(44 + 0.01);
    const symbolCenterOffsetFromHandleCenter =
      handleHeight * renderedFieldScale
      - symbolPaddingBottomPx * renderedFieldScale
      - (symbolLineHeightPx * renderedFieldScale) / 2
      - (handleHeight * renderedFieldScale) / 2;
    expect(symbolCenterOffsetFromHandleCenter).toBeCloseTo(10, 2);
    expect(handleLeft).toBeCloseTo(expectedHandleLeft, 4);
    expect(handleTop).toBeCloseTo(pieceTop - fieldTop / renderedFieldScale, 4);

    const handleScreenBottom = fieldTop + (handleTop + handleHeight) * renderedFieldScale;
    const pieceScreenTop = fieldTop + pieceTop * renderedFieldScale;
    expect(pieceScreenTop - handleScreenBottom).toBeGreaterThanOrEqual(8);
  });

  it('keeps the top-edge rotation handle visible with an 8px gap at 45 degrees', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
    fireEvent.click(piece);
    expect(piece.style.top).toBe('0px');
    mockArmyPieceBounds(piece, 100, 100, 50, 30);
    const rotationHandle = requireRotationHandleForPiece(pieceName);
    const diagonalOffset = 20 * Math.SQRT1_2;

    fireEvent.pointerDown(rotationHandle, {
      pointerId: 19,
      button: 0,
      clientX: 145,
      clientY: 115,
    });
    fireEvent.pointerMove(rotationHandle, {
      pointerId: 19,
      clientX: 125 + diagonalOffset,
      clientY: 115 + diagonalOffset,
    });
    fireEvent.pointerUp(rotationHandle, {
      pointerId: 19,
      clientX: 125 + diagonalOffset,
      clientY: 115 + diagonalOffset,
    });

    expect(piece.getAttribute('data-rotation-degrees')).toBe('45');
    expect(piece.style.transform).toBe('rotate(45deg)');
    expect(piece.style.width).toBe('50px');
    expect(piece.style.height).toBe('30px');

    const battlefieldField = document.querySelector('[data-army-field]');
    if (!(battlefieldField instanceof HTMLElement)) {
      throw new Error('Top-edge rotation geometry test requires the public battlefield field element.');
    }
    const fieldScaleMatch = /^scale\(([^)]+)\)$/.exec(battlefieldField.style.transform);
    const fieldScale = Number(fieldScaleMatch?.[1]);
    if (!Number.isFinite(fieldScale) || fieldScale <= 0) {
      throw new Error(
        `Battlefield scale must be positive and finite for the geometry test. Received ${JSON.stringify(battlefieldField.style.transform)}.`,
      );
    }

    const fieldTop = readArmyInlinePixelStyle(battlefieldField, 'top');
    const fieldWidth = readArmyInlinePixelStyle(battlefieldField, 'width');
    const fieldHeight = readArmyInlinePixelStyle(battlefieldField, 'height');
    const pieceTop = readArmyInlinePixelStyle(piece, 'top');
    const pieceWidth = readArmyInlinePixelStyle(piece, 'width');
    const pieceHeight = readArmyInlinePixelStyle(piece, 'height');
    const handleLeft = readArmyInlinePixelStyle(rotationHandle, 'left');
    const handleTop = readArmyInlinePixelStyle(rotationHandle, 'top');
    const handleWidth = readArmyInlinePixelStyle(rotationHandle, 'width');
    const handleHeight = readArmyInlinePixelStyle(rotationHandle, 'height');
    const rotationRadians = (45 * Math.PI) / 180;
    const rotatedPieceHeight =
      Math.abs(pieceWidth * Math.sin(rotationRadians))
      + Math.abs(pieceHeight * Math.cos(rotationRadians));
    const handleScreenLeft = handleLeft * fieldScale;
    const handleScreenRight = (handleLeft + handleWidth) * fieldScale;
    const handleScreenTop = fieldTop + handleTop * fieldScale;
    const handleScreenBottom = fieldTop + (handleTop + handleHeight) * fieldScale;
    const rotatedPieceScreenTop =
      fieldTop + (pieceTop + (pieceHeight - rotatedPieceHeight) / 2) * fieldScale;

    expect(handleScreenLeft).toBeGreaterThanOrEqual(0);
    expect(handleScreenRight).toBeLessThanOrEqual(fieldWidth * fieldScale);
    expect(handleScreenTop).toBeGreaterThanOrEqual(0);
    expect(handleScreenBottom).toBeLessThanOrEqual(fieldTop + fieldHeight * fieldScale);
    expect(rotatedPieceScreenTop - handleScreenBottom).toBeGreaterThanOrEqual(8);
  });

  it('dragging a selected rotation handle rotates the piece without moving or deselecting it', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
    fireEvent.click(piece);
    mockArmyPieceBounds(piece);
    const startingPosition = piecePosition(piece);
    const rotationHandle = requireRotationHandleForPiece(pieceName);

    fireEvent.pointerDown(rotationHandle, {
      pointerId: 11,
      button: 0,
      clientX: 120,
      clientY: 100,
    });
    fireEvent.pointerMove(rotationHandle, { pointerId: 11, clientX: 140, clientY: 120 });
    fireEvent.pointerUp(rotationHandle, { pointerId: 11, clientX: 140, clientY: 120 });

    const rotatedPiece = screen.getByRole('button', { name: pieceName });
    expect(rotatedPiece.getAttribute('data-rotation-degrees')).toBe('90');
    expect(piecePosition(rotatedPiece as HTMLButtonElement)).toBe(startingPosition);
    expect(rotatedPiece.getAttribute('aria-pressed')).toBe('true');
  });

  it('allows another piece to rotate after deleting the piece during an active rotation gesture', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const firstPieceName = placeArmyFormationPiece('helmet-01');
    const firstPiece = screen.getByRole('button', { name: firstPieceName }) as HTMLButtonElement;
    fireEvent.click(firstPiece);
    mockArmyPieceBounds(firstPiece);
    const firstRotationHandle = requireRotationHandleForPiece(firstPieceName);

    fireEvent.pointerDown(firstRotationHandle, {
      pointerId: 20,
      button: 0,
      clientX: 120,
      clientY: 100,
    });
    fireEvent.click(screen.getByRole('button', { name: '删除所选' }));
    expect(screen.queryByRole('button', { name: firstPieceName })).toBeNull();

    const secondPieceName = placeArmyFormationPiece('helmet-02');
    const secondPiece = screen.getByRole('button', { name: secondPieceName }) as HTMLButtonElement;
    fireEvent.click(secondPiece);
    mockArmyPieceBounds(secondPiece);
    const secondRotationHandle = requireRotationHandleForPiece(secondPieceName);

    fireEvent.pointerDown(secondRotationHandle, {
      pointerId: 21,
      button: 0,
      clientX: 120,
      clientY: 100,
    });
    fireEvent.pointerMove(secondRotationHandle, { pointerId: 21, clientX: 140, clientY: 120 });
    fireEvent.pointerUp(secondRotationHandle, { pointerId: 21, clientX: 140, clientY: 120 });

    const finalRotationDegrees = Number(secondPiece.getAttribute('data-rotation-degrees'));
    expect(finalRotationDegrees).toBeCloseTo(90, 1);
  });

  it('allows another piece to rotate after the active battlefield handle unmounts', async () => {
    render(<ArmyFormationCreator locale="zh" />);
    const firstPieceName = placeArmyFormationPiece('helmet-01');
    const firstPiece = screen.getByRole('button', { name: firstPieceName }) as HTMLButtonElement;
    fireEvent.click(firstPiece);
    mockArmyPieceBounds(firstPiece);
    const firstRotationHandle = requireRotationHandleForPiece(firstPieceName);

    fireEvent.pointerDown(firstRotationHandle, {
      pointerId: 22,
      button: 0,
      clientX: 120,
      clientY: 100,
    });
    fireEvent.click(screen.getByRole('button', { name: '切换到下一场' }));
    expect(screen.getByText('战场 2/4', { exact: true })).toBeTruthy();
    await waitFor(() => {
      expect(
        rotationHandleButtons().some((handle) => handle.getAttribute('data-piece-id') === firstPieceName),
      ).toBe(false);
    });

    fireEvent.click(screen.getByRole('button', { name: '武器' }));
    const secondPieceName = placeArmyFormationPiece('weapon-01');
    const secondPiece = screen.getByRole('button', { name: secondPieceName }) as HTMLButtonElement;
    fireEvent.click(secondPiece);
    mockArmyPieceBounds(secondPiece);
    const secondRotationHandle = requireRotationHandleForPiece(secondPieceName);

    fireEvent.pointerDown(secondRotationHandle, {
      pointerId: 23,
      button: 0,
      clientX: 120,
      clientY: 100,
    });
    fireEvent.pointerMove(secondRotationHandle, { pointerId: 23, clientX: 140, clientY: 120 });
    fireEvent.pointerUp(secondRotationHandle, { pointerId: 23, clientX: 140, clientY: 120 });

    const finalRotationDegrees = Number(secondPiece.getAttribute('data-rotation-degrees'));
    expect(finalRotationDegrees).toBeCloseTo(90, 1);
  });

  it('rotation handle affects only its piece in a multi-selection', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const firstPieceName = placeArmyFormationPiece('helmet-01');
    const secondPieceName = placeArmyFormationPiece('helmet-02');
    const firstPiece = screen.getByRole('button', { name: firstPieceName }) as HTMLButtonElement;
    const secondPiece = screen.getByRole('button', { name: secondPieceName }) as HTMLButtonElement;
    fireEvent.click(firstPiece);
    fireEvent.click(secondPiece);
    mockArmyPieceBounds(firstPiece);
    const firstStartingPosition = piecePosition(firstPiece);
    const secondStartingPosition = piecePosition(secondPiece);
    const rotationHandle = requireRotationHandleForPiece(firstPieceName);

    fireEvent.pointerDown(rotationHandle, {
      pointerId: 12,
      button: 0,
      clientX: 120,
      clientY: 100,
    });
    fireEvent.pointerMove(rotationHandle, { pointerId: 12, clientX: 140, clientY: 120 });
    fireEvent.pointerUp(rotationHandle, { pointerId: 12, clientX: 140, clientY: 120 });

    const rotatedFirstPiece = screen.getByRole('button', { name: firstPieceName });
    const unchangedSecondPiece = screen.getByRole('button', { name: secondPieceName });
    expect(rotatedFirstPiece.getAttribute('data-rotation-degrees')).toBe('90');
    expect(unchangedSecondPiece.getAttribute('data-rotation-degrees')).toBe('0');
    expect(piecePosition(rotatedFirstPiece as HTMLButtonElement)).toBe(firstStartingPosition);
    expect(piecePosition(unchangedSecondPiece as HTMLButtonElement)).toBe(secondStartingPosition);
    expect(rotatedFirstPiece.getAttribute('aria-pressed')).toBe('true');
    expect(unchangedSecondPiece.getAttribute('aria-pressed')).toBe('true');
  });

  it.each([
    {
      boundary: '180 degree',
      startX: 20,
      startY: 119,
      endX: 20,
      endY: 121,
      expectedAdjustment: -1.146,
    },
    {
      boundary: '360 degree',
      startX: 220,
      startY: 119,
      endX: 220,
      endY: 121,
      expectedAdjustment: 1.146,
    },
  ])('crossing the $boundary pointer boundary does not jump the angle', ({
    startX,
    startY,
    endX,
    endY,
    expectedAdjustment,
  }) => {
    render(<ArmyFormationCreator locale="zh" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
    fireEvent.click(piece);
    mockArmyPieceBounds(piece);
    const rotationHandle = requireRotationHandleForPiece(pieceName);
    const angleInput = requireArmyFormationInput('角度');
    expect(piece.getAttribute('data-rotation-degrees')).toBe('0');
    expect(angleInput.value).toBe('90');

    fireEvent.pointerDown(rotationHandle, {
      pointerId: 13,
      button: 0,
      clientX: startX,
      clientY: startY,
    });
    fireEvent.pointerMove(rotationHandle, { pointerId: 13, clientX: endX, clientY: endY });
    fireEvent.pointerUp(rotationHandle, { pointerId: 13, clientX: endX, clientY: endY });

    const finalRotation = Number(screen.getByRole('button', { name: pieceName }).getAttribute('data-rotation-degrees'));
    expect(Number.isFinite(finalRotation)).toBe(true);
    expect(finalRotation).toBeCloseTo(expectedAdjustment, 2);
    expect(Number(angleInput.value)).toBeCloseTo(expectedAdjustment, 2);
  });

  it('keeps accumulating a full turn while the pointer crosses 180 and 360 degrees', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
    fireEvent.click(piece);
    mockArmyPieceBounds(piece);
    const rotationHandle = requireRotationHandleForPiece(pieceName);
    const angleInput = requireArmyFormationInput('角度');
    expect(piece.getAttribute('data-rotation-degrees')).toBe('0');
    expect(angleInput.value).toBe('90');
    const pointerMoves = [
      { clientX: 140, clientY: 119 },
      { clientX: 140, clientY: 121 },
      { clientX: 120, clientY: 140 },
      { clientX: 100, clientY: 121 },
      { clientX: 100, clientY: 119 },
      { clientX: 120, clientY: 100 },
    ];

    fireEvent.pointerDown(rotationHandle, {
      pointerId: 18,
      button: 0,
      clientX: 120,
      clientY: 100,
    });
    for (const pointerMove of pointerMoves) {
      fireEvent.pointerMove(rotationHandle, { pointerId: 18, ...pointerMove });
    }
    fireEvent.pointerUp(rotationHandle, { pointerId: 18, clientX: 120, clientY: 100 });

    const finalRotation = Number(screen.getByRole('button', { name: pieceName }).getAttribute('data-rotation-degrees'));
    expect(Number.isFinite(finalRotation)).toBe(true);
    expect(finalRotation).toBeCloseTo(360, 0);
    expect(Number(angleInput.value)).toBeCloseTo(360, 0);
  });

  it.each(['pointercancel', 'lostpointercapture'] as const)(
    '%s stops further rotation after the gesture ends',
    (endEvent) => {
      render(<ArmyFormationCreator locale="zh" />);
      const pieceName = placeArmyFormationPiece('helmet-01');
      const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
      fireEvent.click(piece);
      mockArmyPieceBounds(piece);
      const rotationHandle = requireRotationHandleForPiece(pieceName);
      const angleInput = requireArmyFormationInput('角度');
      expect(piece.getAttribute('data-rotation-degrees')).toBe('0');
      expect(angleInput.value).toBe('90');

      fireEvent.pointerDown(rotationHandle, {
        pointerId: 14,
        button: 0,
        clientX: 120,
        clientY: 100,
      });
      fireEvent.pointerMove(rotationHandle, { pointerId: 14, clientX: 140, clientY: 120 });
      const rotationBeforeEnd = screen.getByRole('button', { name: pieceName })
        .getAttribute('data-rotation-degrees');
      const angleBeforeEnd = angleInput.value;
      expect(rotationBeforeEnd).toBe('90');
      expect(angleBeforeEnd).toBe('90');

      if (endEvent === 'pointercancel') {
        fireEvent.pointerCancel(rotationHandle, { pointerId: 14 });
      } else {
        fireLostPointerCapture(rotationHandle, 14);
      }
      fireEvent.pointerMove(rotationHandle, { pointerId: 14, clientX: 120, clientY: 140 });

      expect(screen.getByRole('button', { name: pieceName }).getAttribute('data-rotation-degrees'))
        .toBe(rotationBeforeEnd);
      expect(requireArmyFormationInput('角度').value).toBe(angleBeforeEnd);
    },
  );

  it('ignores rotation pointer events from a different pointer id', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
    fireEvent.click(piece);
    mockArmyPieceBounds(piece);
    const rotationHandle = requireRotationHandleForPiece(pieceName);

    fireEvent.pointerDown(rotationHandle, {
      pointerId: 15,
      button: 0,
      clientX: 120,
      clientY: 100,
    });
    fireEvent.pointerMove(rotationHandle, { pointerId: 16, clientX: 140, clientY: 120 });
    fireEvent.pointerUp(rotationHandle, { pointerId: 16, clientX: 140, clientY: 120 });
    expect(screen.getByRole('button', { name: pieceName }).getAttribute('data-rotation-degrees')).toBe('0');
    expect(requireArmyFormationInput('角度').value).toBe('90');

    fireEvent.pointerMove(rotationHandle, { pointerId: 15, clientX: 140, clientY: 120 });
    fireEvent.pointerUp(rotationHandle, { pointerId: 15, clientX: 140, clientY: 120 });

    expect(screen.getByRole('button', { name: pieceName }).getAttribute('data-rotation-degrees')).toBe('90');
  });

  it('rotation handle deltas merge with the angle input and reset to the original direction', () => {
    storeArmyFormationPiecesWithSelectedRotation('selected-piece', 'unselected-piece', 35);
    render(<ArmyFormationCreator locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: '回到上次' }));

    const selectedPiece = screen.getByRole('button', { name: 'selected-piece' }) as HTMLButtonElement;
    const unselectedPiece = screen.getByRole('button', { name: 'unselected-piece' });
    const angleInput = requireArmyFormationInput('角度');
    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('35');
    expect(unselectedPiece.getAttribute('data-rotation-degrees')).toBe('0');

    fireEvent.change(angleInput, { target: { value: '89' } });
    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('124');
    fireEvent.change(angleInput, { target: { value: '90' } });
    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('125');

    mockArmyPieceBounds(selectedPiece);
    const rotationHandle = requireRotationHandleForPiece('selected-piece');
    fireEvent.pointerDown(rotationHandle, {
      pointerId: 17,
      button: 0,
      clientX: 120,
      clientY: 100,
    });
    fireEvent.pointerMove(rotationHandle, { pointerId: 17, clientX: 140, clientY: 120 });
    fireEvent.pointerUp(rotationHandle, { pointerId: 17, clientX: 140, clientY: 120 });

    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('215');
    expect(angleInput.value).toBe('180');
    fireEvent.click(screen.getByRole('button', { name: '重置旋转' }));

    expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('35');
    expect(unselectedPiece.getAttribute('data-rotation-degrees')).toBe('0');
    expect(selectedPiece.getAttribute('aria-pressed')).toBe('true');
    expect(angleInput.value).toBe('90');
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

  it.each(['en', 'zh'] as const)(
    '%s selects an unselected piece when dragging starts and preserves the other selection and rotation',
    (locale) => {
      const copy = getArmyFormationCreatorCopy(locale);
      render(<ArmyFormationCreator locale={locale} />);
      const selectedPieceName = placeArmyFormationPiece('helmet-01');
      const draggedPieceName = placeArmyFormationPiece('helmet-02');
      const selectedPiece = screen.getByRole('button', { name: selectedPieceName }) as HTMLButtonElement;
      const draggedPiece = screen.getByRole('button', { name: draggedPieceName }) as HTMLButtonElement;
      fireEvent.click(selectedPiece);

      const angleInput = screen.getByLabelText(copy.angle) as HTMLInputElement;
      fireEvent.change(angleInput, { target: { value: '35' } });
      expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('35');
      expect(draggedPiece.getAttribute('data-rotation-degrees')).toBe('0');
      expect(selectedPiece.getAttribute('aria-pressed')).toBe('true');
      expect(draggedPiece.getAttribute('aria-pressed')).toBe('false');
      expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
        .toEqual([selectedPieceName]);

      mockArmyFieldBoundsForDrag(draggedPiece);
      fireEvent.pointerDown(draggedPiece, {
        pointerId: 31,
        clientX: 50,
        clientY: 50,
        button: 0,
      });
      fireEvent.pointerMove(draggedPiece, { pointerId: 31, clientX: 53, clientY: 50 });

      expect(selectedPiece.getAttribute('aria-pressed')).toBe('true');
      expect(draggedPiece.getAttribute('aria-pressed')).toBe('true');
      expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
        .toEqual([selectedPieceName, draggedPieceName]);
      expect(angleInput.value).toBe('35');
      expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('35');
      expect(draggedPiece.getAttribute('data-rotation-degrees')).toBe('0');

      const positionAtDragStart = piecePosition(draggedPiece);
      const pieceLeftAtDragStart = Number.parseFloat(draggedPiece.style.left);
      const pieceTopAtDragStart = Number.parseFloat(draggedPiece.style.top);
      const handleAtDragStart = requireRotationHandleForPiece(draggedPieceName);
      const handleLeftAtDragStart = readArmyInlinePixelStyle(handleAtDragStart, 'left');
      const handleTopAtDragStart = readArmyInlinePixelStyle(handleAtDragStart, 'top');
      fireEvent.pointerMove(draggedPiece, { pointerId: 31, clientX: 83, clientY: 70 });

      const positionAfterDragMove = piecePosition(draggedPiece);
      const pieceLeftAfterDragMove = Number.parseFloat(draggedPiece.style.left);
      const pieceTopAfterDragMove = Number.parseFloat(draggedPiece.style.top);
      const handleAfterDragMove = requireRotationHandleForPiece(draggedPieceName);
      expect(positionAfterDragMove).not.toBe(positionAtDragStart);
      expect(readArmyInlinePixelStyle(handleAfterDragMove, 'left') - handleLeftAtDragStart)
        .toBe(pieceLeftAfterDragMove - pieceLeftAtDragStart);
      expect(readArmyInlinePixelStyle(handleAfterDragMove, 'top') - handleTopAtDragStart)
        .toBe(pieceTopAfterDragMove - pieceTopAtDragStart);

      fireEvent.pointerUp(draggedPiece, { pointerId: 31, clientX: 83, clientY: 70 });
      expect(selectedPiece.getAttribute('aria-pressed')).toBe('true');
      expect(draggedPiece.getAttribute('aria-pressed')).toBe('true');
      expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
        .toEqual([selectedPieceName, draggedPieceName]);
      fireEvent.click(draggedPiece);

      expect(selectedPiece.getAttribute('aria-pressed')).toBe('true');
      expect(draggedPiece.getAttribute('aria-pressed')).toBe('true');
      expect(angleInput.value).toBe('35');
      expect(selectedPiece.getAttribute('data-rotation-degrees')).toBe('35');
      expect(draggedPiece.getAttribute('data-rotation-degrees')).toBe('0');
    },
  );

  it.each(['en', 'zh'] as const)(
    '%s keeps an already selected piece selected while it is dragged',
    (locale) => {
      render(<ArmyFormationCreator locale={locale} />);
      const pieceName = placeArmyFormationPiece('helmet-01');
      const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
      fireEvent.click(piece);
      mockArmyFieldBoundsForDrag(piece);

      fireEvent.pointerDown(piece, { pointerId: 32, clientX: 10, clientY: 10, button: 0 });
      fireEvent.pointerMove(piece, { pointerId: 32, clientX: 13, clientY: 10 });
      expect(piece.getAttribute('aria-pressed')).toBe('true');
      expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
        .toEqual([pieceName]);
      fireEvent.pointerMove(piece, { pointerId: 32, clientX: 43, clientY: 30 });
      expect(piece.getAttribute('aria-pressed')).toBe('true');
      expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
        .toEqual([pieceName]);
      fireEvent.pointerUp(piece, { pointerId: 32, clientX: 43, clientY: 30 });
      fireEvent.click(piece);

      expect(piece.getAttribute('aria-pressed')).toBe('true');
      expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
        .toEqual([pieceName]);
    },
  );

  it.each(['en', 'zh'] as const)(
    '%s does not auto-select below the drag threshold and ordinary clicks still toggle selection',
    (locale) => {
      render(<ArmyFormationCreator locale={locale} />);
      const pieceName = placeArmyFormationPiece('helmet-01');
      const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
      mockArmyFieldBoundsForDrag(piece);

      fireEvent.pointerDown(piece, { pointerId: 33, clientX: 10, clientY: 10, button: 0 });
      fireEvent.pointerMove(piece, { pointerId: 33, clientX: 12, clientY: 11 });
      expect(piece.getAttribute('aria-pressed')).toBe('false');
      expect(rotationHandleButtons()).toHaveLength(0);
      fireEvent.pointerUp(piece, { pointerId: 33, clientX: 12, clientY: 11 });
      expect(piece.getAttribute('aria-pressed')).toBe('false');
      expect(rotationHandleButtons()).toHaveLength(0);

      fireEvent.click(piece);
      expect(piece.getAttribute('aria-pressed')).toBe('true');
      fireEvent.click(piece);
      expect(piece.getAttribute('aria-pressed')).toBe('false');
    },
  );

  it('a keyboard-activated click toggles a focused piece normally', () => {
    render(<ArmyFormationCreator locale="en" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
    piece.focus();
    expect(document.activeElement).toBe(piece);

    fireEvent.click(piece, { detail: 0 });
    expect(piece.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(piece, { detail: 0 });
    expect(piece.getAttribute('aria-pressed')).toBe('false');
  });

  it('pointercancel ends a started drag and leaves later keyboard clicks available', () => {
    render(<ArmyFormationCreator locale="en" />);
    const pieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: pieceName }) as HTMLButtonElement;
    mockArmyFieldBoundsForDrag(piece);

    fireEvent.pointerDown(piece, { pointerId: 34, clientX: 10, clientY: 10, button: 0 });
    fireEvent.pointerMove(piece, { pointerId: 34, clientX: 13, clientY: 10 });
    expect(piece.getAttribute('aria-pressed')).toBe('true');
    fireEvent.pointerCancel(piece, { pointerId: 34 });
    const positionAfterCancel = piecePosition(piece);
    fireEvent.pointerMove(piece, { pointerId: 34, clientX: 53, clientY: 50 });

    expect(piecePosition(piece)).toBe(positionAfterCancel);
    expect(piece.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(piece, { detail: 0 });
    expect(piece.getAttribute('aria-pressed')).toBe('false');
    expect(rotationHandleButtons()).toHaveLength(0);

    const positionBeforeNewDrag = piecePosition(piece);
    fireEvent.pointerDown(piece, { pointerId: 35, clientX: 10, clientY: 10, button: 0 });
    fireEvent.pointerMove(piece, { pointerId: 35, clientX: 43, clientY: 30 });
    expect(piecePosition(piece)).not.toBe(positionBeforeNewDrag);
    expect(piece.getAttribute('aria-pressed')).toBe('true');
    expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
      .toEqual([pieceName]);
    fireEvent.pointerUp(piece, { pointerId: 35, clientX: 43, clientY: 30 });
    expect(piece.getAttribute('aria-pressed')).toBe('true');
    expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
      .toEqual([pieceName]);
    fireEvent.click(piece);
    expect(piece.getAttribute('aria-pressed')).toBe('true');
    expect(rotationHandleButtons().map((handle) => handle.getAttribute('data-piece-id')))
      .toEqual([pieceName]);
  });

  it('拖动棋子后位置按格子移动', () => {
    render(<ArmyFormationCreator locale="zh" />);
    const placedPieceName = placeArmyFormationPiece('helmet-01');
    const piece = screen.getByRole('button', { name: placedPieceName });

    mockArmyFieldBoundsForDrag(piece);

    fireEvent.pointerDown(piece, { pointerId: 1, clientX: 0, clientY: 0, button: 0 });
    fireEvent.pointerMove(piece, { pointerId: 1, clientX: 40, clientY: 20, button: 0 });
    fireEvent.pointerUp(piece, { pointerId: 1, clientX: 40, clientY: 20, button: 0 });

    expect(piecePosition(pieceButtons()[0] as HTMLButtonElement)).toBe('40,20');
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
      armyFormationBackgroundImageUpload,
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
    expect(document.querySelector('[data-army-field] img')?.getAttribute('src')).toBe(backgroundImageUrl);
    expect(screen.getByRole('button', { name: copy.removeBackgroundImage })).toBeTruthy();
    expect(compressBackgroundImage).toHaveBeenCalledWith(imageFile, 780, 480);
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
    expect(document.querySelector('[data-army-field] img')?.getAttribute('src')).toBe(backgroundImageUrl);
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

    render(<ArmyFormationCreator locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: '导出 PNG' }));

    await waitFor(() => expect(createObjectURL).toHaveBeenCalledTimes(1));
    const downloadedBlob = createObjectURL.mock.calls[0]?.[0];
    const downloadLink = anchorClick.mock.contexts[0] as HTMLAnchorElement | undefined;
    expect(buildArmyFormationPng).toHaveBeenCalledTimes(1);
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
