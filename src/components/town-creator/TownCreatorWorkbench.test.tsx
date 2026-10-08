// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SiteLocale } from '@/lib/site-locale';
import type { TownDocument, TownLayerId, TownObject, TownObjectPatch } from '@/lib/town-creator/types';

type TownCanvasTestProps = {
  document: TownDocument;
  selectedObjectId: string | null;
  snapEnabled: boolean;
  resizeEnabled: boolean;
  locale: SiteLocale;
  onSelectObject: (id: string | null) => void;
  onSelectObjectInLayer: (objectId: string, layerId: TownLayerId) => void;
  onUpdateObject: (id: string, patch: TownObjectPatch) => void;
};

const canvasState = vi.hoisted(() => ({
  props: null as TownCanvasTestProps | null,
}));

vi.mock('./TownCanvas', () => ({
  TownCanvas: (props: TownCanvasTestProps) => {
    canvasState.props = props;
    return (
      <div data-testid="town-canvas" data-object-count={props.document.layers.flatMap((layer) => layer.objects).length}>
        <button type="button" onClick={() => props.onSelectObject(null)}>Clear canvas selection</button>
      </div>
    );
  },
}));

import { TownCreatorWorkbench } from './TownCreatorWorkbench';

afterEach(() => {
  cleanup();
  canvasState.props = null;
});

function getCottageButton(): HTMLButtonElement {
  const button = screen.getByRole('button', { name: 'Add to active layer: Cottage' });
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error('The cottage asset add control is not a button.');
  }
  return button;
}

const WORKBENCH_LOCALE = {
  en: {
    addCottage: 'Add to active layer: Cottage',
    added: 'Added to active layer.',
    backgroundLoaded: 'Background applied.',
    backgroundLoading: 'Loading background image…',
    backgroundFailed: 'Background image could not be loaded',
    projectLoaded: 'Town project loaded.',
    dialogLoaded: 'Town project loaded. Review the canvas before continuing.',
    dialogSaved: 'Town project saved.',
    canvas: 'Canvas',
    color: 'Color',
    imageUrl: 'Background image URL',
    loadBackground: 'Load background',
    clearImage: 'Clear image',
    load: 'Load',
    close: 'Close',
    hiddenLayer: 'hidden',
    copy: 'Copy object',
    delete: 'Delete object',
    middle: 'Middle',
    middleVisible: 'MiddleVisible',
    upper: 'Upper',
    editingMiddle: 'Editing: Middle',
    editingLower: 'Editing: Lower',
    object: 'Object',
    navigation: 'Town Creator',
    layers: 'Layers',
    settings: 'Layers & canvas',
    save: 'Save',
    more: 'More',
    width: 'Width',
    invalid: 'Select an object in the active visible layer first.',
    errorPrefix: 'Error:',
  },
  zh: {
    addCottage: '添加到当前图层: 小屋',
    added: '已添加到当前图层。',
    backgroundLoaded: '背景已应用。',
    backgroundLoading: '正在加载背景图片……',
    backgroundFailed: '背景图片加载失败',
    projectLoaded: '城镇项目已加载。',
    dialogLoaded: '城镇项目已加载，请检查画布后继续。',
    dialogSaved: '城镇项目已保存。',
    canvas: '画布',
    color: '颜色',
    imageUrl: '背景图片 URL',
    loadBackground: '加载背景',
    clearImage: '清除图片',
    load: '加载',
    close: '关闭',
    hiddenLayer: '已隐藏',
    copy: '复制对象',
    delete: '删除对象',
    middle: '中层',
    middleVisible: '中层可见',
    upper: '上层',
    editingMiddle: '编辑: 中层',
    editingLower: '编辑: 下层',
    object: '对象',
    navigation: '城镇创建器',
    layers: '图层',
    settings: '图层与画布',
    save: '保存',
    more: '更多',
    width: '宽度',
    invalid: '请先选择当前可见图层中的对象。',
    errorPrefix: '错误:',
  },
} as const;

function requireCanvasProps(): TownCanvasTestProps {
  const props = canvasState.props;
  if (!props) {
    throw new Error('Town canvas props were not captured.');
  }
  return props;
}

function requireWorkbench(): HTMLElement {
  const workbench = document.querySelector('[data-town-workbench="true"]');
  if (!(workbench instanceof HTMLElement)) {
    throw new Error('Town workbench section is missing.');
  }
  return workbench;
}

function requireLayerObjects(layerId: TownLayerId): readonly TownObject[] {
  const layer = requireCanvasProps().document.layers.find((candidate) => candidate.id === layerId);
  if (!layer) {
    throw new Error(`Rendered town document is missing layer ${JSON.stringify(layerId)}.`);
  }
  return layer.objects;
}

function requireTownObject(layerId: TownLayerId, objectId: string): TownObject {
  const object = requireLayerObjects(layerId).find((candidate) => candidate.id === objectId);
  if (!object) {
    throw new Error(`Layer ${JSON.stringify(layerId)} is missing object ${JSON.stringify(objectId)}.`);
  }
  return object;
}

function requireRadio(name: string): HTMLInputElement {
  const radio = screen.getByRole('radio', { name });
  if (!(radio instanceof HTMLInputElement)) {
    throw new Error(`Copy target ${JSON.stringify(name)} is not a radio input.`);
  }
  return radio;
}

function dispatchTownKey(target: Element, init: KeyboardEventInit): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
}

function addCottage(locale: SiteLocale): string {
  const button = screen.getByRole('button', { name: WORKBENCH_LOCALE[locale].addCottage });
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Cottage add control is not a button. Received ${button.nodeName}.`);
  }
  fireEvent.click(button);
  const objectId = requireCanvasProps().selectedObjectId;
  if (!objectId) {
    throw new Error('Adding a cottage did not select an object.');
  }
  return objectId;
}

function expectNoCopyOrDeleteSuccessText(): void {
  expect(screen.queryByText('Object copied to selected layer.')).toBeNull();
  expect(screen.queryByText('对象已复制到选择的图层。')).toBeNull();
  expect(screen.queryByText('Object deleted.')).toBeNull();
  expect(screen.queryByText('对象已删除。')).toBeNull();
}

function workbenchFeedbackBar(): HTMLElement | null {
  const bar = requireWorkbench().querySelector(':scope > [role="status"], :scope > [role="alert"]');
  if (bar === null) return null;
  if (!(bar instanceof HTMLElement)) {
    throw new Error(`Workbench feedback bar is not an HTML element. Received ${bar.nodeName}.`);
  }
  return bar;
}

function expectNoSuccessFeedback(locale: SiteLocale): void {
  const phrase = WORKBENCH_LOCALE[locale];
  const bar = workbenchFeedbackBar();
  if (bar?.className.includes('feedback-success')) {
    throw new Error(`Workbench success style is still applied. Received class ${JSON.stringify(bar.className)}.`);
  }
  expect(screen.queryByText(phrase.added)).toBeNull();
  expect(screen.queryByText(phrase.backgroundLoaded)).toBeNull();
  expect(screen.queryByText(phrase.projectLoaded)).toBeNull();
  expectNoCopyOrDeleteSuccessText();
}

type MockBackgroundImage = {
  onload: (() => void) | null;
  onerror: (() => void) | null;
  src: string;
};

function installMockBackgroundImage(): { images: MockBackgroundImage[]; restore: () => void } {
  const nativeImageConstructor = window.Image;
  const images: MockBackgroundImage[] = [];
  class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    private currentSource = '';

    set src(value: string) {
      this.currentSource = value;
      images.push(this);
    }

    get src(): string {
      return this.currentSource;
    }
  }

  window.Image = MockImage as unknown as typeof window.Image;
  return {
    images,
    restore() {
      window.Image = nativeImageConstructor;
    },
  };
}

function requireMockBackgroundImage(images: readonly MockBackgroundImage[], index: number): MockBackgroundImage {
  const image = images[index];
  if (!image) {
    throw new Error(`Background image request ${index} was not created. Received ${images.length} requests.`);
  }
  return image;
}

describe('TownCreatorWorkbench', () => {
  it('starts with the shared 1200 by 800 lower-layer document contract', () => {
    render(<TownCreatorWorkbench locale="en" />);

    expect(screen.getByText('1200 × 800')).toBeTruthy();
    expect(screen.getByText('Editing: Lower')).toBeTruthy();
    expect(screen.getByText('192')).toBeTruthy();
    expect(canvasState.props?.document.backgroundColor).toBe('#e5ddc4');
    expect(canvasState.props?.document.activeLayer).toBe('lower');
  });

  it('keeps material on existing objects when a new material is selected', () => {
    render(<TownCreatorWorkbench locale="en" />);

    fireEvent.click(getCottageButton());
    expect(canvasState.props?.document.layers[0]?.objects[0]?.material).toBe('wood');

    fireEvent.click(screen.getByRole('button', { name: 'Stone' }));
    fireEvent.click(getCottageButton());

    const objects = canvasState.props?.document.layers[0]?.objects ?? [];
    expect(objects).toHaveLength(2);
    expect(objects.map((object) => object.material)).toEqual(['wood', 'stone']);
  });

  it('does not add to a hidden active layer and reports the layer explicitly', () => {
    render(<TownCreatorWorkbench locale="en" />);
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Town Creator' })).getByRole('button', { name: 'Layers' }));

    const settingsPanel = screen.getByRole('heading', { name: 'Layers & canvas' }).closest('section');
    if (!(settingsPanel instanceof HTMLElement)) {
      throw new Error('Town settings panel is missing.');
    }
    const layerVisibility = within(settingsPanel).getAllByRole('checkbox')[0];
    fireEvent.click(layerVisibility);
    expect(canvasState.props?.document.layers[0]?.visible).toBe(false);

    fireEvent.click(getCottageButton());
    expect(canvasState.props?.document.layers[0]?.objects).toHaveLength(0);
    expect(screen.getByRole('alert').textContent).toContain('active layer');
    expect(screen.queryByText('Added to active layer.')).toBeNull();
  });

  it('copies twice to the selected target without changing the editing layer', () => {
    render(<TownCreatorWorkbench locale="en" />);
    fireEvent.click(getCottageButton());
    const sourceObjectId = canvasState.props?.selectedObjectId;

    const upperTarget = screen.getByRole('radio', { name: 'Upper' });
    fireEvent.click(upperTarget);
    fireEvent.click(screen.getByRole('button', { name: 'Copy object' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy object' }));

    const document = canvasState.props?.document;
    expect(document?.activeLayer).toBe('lower');
    expect(document?.layers.find((layer) => layer.id === 'lower')?.objects).toHaveLength(1);
    expect(document?.layers.find((layer) => layer.id === 'upper')?.objects).toHaveLength(2);
    expect(canvasState.props?.selectedObjectId).toBe(sourceObjectId);
    expect(screen.getByText('Editing: Lower')).toBeTruthy();
  });

  it('exposes the four mobile panel entry points and opens settings on demand', () => {
    render(<TownCreatorWorkbench locale="zh" />);

    const mobileNavigation = within(screen.getByRole('navigation', { name: '城镇创建器' }));
    expect(mobileNavigation.getByRole('button', { name: '素材' })).toBeTruthy();
    expect(mobileNavigation.getByRole('button', { name: '对象' })).toBeTruthy();
    expect(mobileNavigation.getByRole('button', { name: '图层' })).toBeTruthy();
    expect(mobileNavigation.getByRole('button', { name: '画布' })).toBeTruthy();

    fireEvent.click(mobileNavigation.getByRole('button', { name: '图层' }));
    expect(screen.getByRole('heading', { name: '图层与画布' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '适配显示宽度' })).toBeTruthy();
  });

  it('opens the real save dialog from the desktop project action', () => {
    render(<TownCreatorWorkbench locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Town project files/ })).toBeTruthy();
  });

  it('ignores stale background image callbacks after a newer request and clearing', () => {
    const nativeImageConstructor = window.Image;
    const imageInstances: Array<{
      onload: (() => void) | null;
      onerror: (() => void) | null;
      src: string;
    }> = [];
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private currentSource = '';

      set src(value: string) {
        this.currentSource = value;
        imageInstances.push(this);
      }

      get src(): string {
        return this.currentSource;
      }
    }
    window.Image = MockImage as unknown as typeof window.Image;

    try {
      render(<TownCreatorWorkbench locale="en" />);
      fireEvent.click(within(screen.getByRole('navigation', { name: 'Town Creator' })).getByRole('button', { name: 'Canvas' }));

      const backgroundInput = screen.getByLabelText('Background image URL');
      fireEvent.change(backgroundInput, { target: { value: 'https://example.com/old.png' } });
      fireEvent.click(screen.getByRole('button', { name: 'Load background' }));
      fireEvent.change(backgroundInput, { target: { value: 'https://example.com/new.png' } });
      fireEvent.click(screen.getByRole('button', { name: 'Load background' }));

      expect(imageInstances).toHaveLength(2);
      act(() => imageInstances[0]?.onload?.());
      expect(canvasState.props?.document.backgroundImageUrl).toBe('');
      act(() => imageInstances[1]?.onload?.());
      expect(canvasState.props?.document.backgroundImageUrl).toBe('https://example.com/new.png');

      fireEvent.click(screen.getByRole('button', { name: 'Clear image' }));
      expect(canvasState.props?.document.backgroundImageUrl).toBe('');
      act(() => imageInstances[1]?.onload?.());
      expect(canvasState.props?.document.backgroundImageUrl).toBe('');
    } finally {
      window.Image = nativeImageConstructor;
    }
  });

  it.each(['en', 'zh'] as const)(
    'selects a visible object on another layer and updates it in the same gesture (%s)',
    (locale) => {
      const phrase = WORKBENCH_LOCALE[locale];
      render(<TownCreatorWorkbench locale={locale} />);
      const sourceId = addCottage(locale);
      const source = requireTownObject('lower', sourceId);
      fireEvent.click(screen.getByRole('button', { name: phrase.object }));
      expect(requireWorkbench().getAttribute('data-mobile-panel')).toBe('none');

      act(() => {
        const props = requireCanvasProps();
        props.onSelectObjectInLayer(sourceId, 'lower');
        props.onUpdateObject(sourceId, { x: source.x + 8, y: source.y + 6 });
      });

      expect(requireCanvasProps().document.activeLayer).toBe('lower');
      expect(requireCanvasProps().selectedObjectId).toBe(sourceId);
      expect(requireTownObject('lower', sourceId)).toMatchObject({ x: source.x + 8, y: source.y + 6 });
      expect(requireWorkbench().getAttribute('data-mobile-panel')).toBe('object');

      fireEvent.click(screen.getByRole('button', { name: phrase.copy }));
      const copyId = requireLayerObjects('middle')[0]?.id;
      if (!copyId) {
        throw new Error('Copy did not create a middle-layer object.');
      }
      const copiedBeforeMove = requireTownObject('middle', copyId);
      expect(copiedBeforeMove).toMatchObject({ x: source.x + 8, y: source.y + 6 });
      fireEvent.click(requireRadio(phrase.upper));
      fireEvent.click(screen.getByRole('button', { name: phrase.object }));
      expect(requireWorkbench().getAttribute('data-mobile-panel')).toBe('none');

      act(() => {
        const props = requireCanvasProps();
        props.onSelectObjectInLayer(copyId, 'middle');
        props.onUpdateObject(copyId, { x: source.x + 30, y: source.y + 12 });
      });

      expect(requireCanvasProps().document.activeLayer).toBe('middle');
      expect(requireCanvasProps().selectedObjectId).toBe(copyId);
      expect(screen.getByText(phrase.editingMiddle)).toBeTruthy();
      expect(requireTownObject('middle', copyId)).toMatchObject({ x: source.x + 30, y: source.y + 12 });
      expect(requireTownObject('lower', sourceId)).toMatchObject({ x: source.x + 8, y: source.y + 6 });
      expect(requireRadio(phrase.upper).checked).toBe(true);
      expect(requireWorkbench().getAttribute('data-mobile-panel')).toBe('object');
      expect(screen.getByRole('button', { name: phrase.object }).getAttribute('aria-pressed')).toBe('true');
      expect(screen.queryByRole('alert')).toBeNull();
    },
  );

  it.each(['en', 'zh'] as const)(
    'rejects hidden and unknown layer selection without changing the document (%s)',
    (locale) => {
      const phrase = WORKBENCH_LOCALE[locale];
      render(<TownCreatorWorkbench locale={locale} />);
      const sourceId = addCottage(locale);
      fireEvent.click(screen.getByRole('button', { name: phrase.copy }));
      const copyId = requireLayerObjects('middle')[0]?.id;
      if (!copyId) {
        throw new Error('Copy did not create a middle-layer object.');
      }

      fireEvent.click(within(screen.getByRole('navigation', { name: phrase.navigation })).getByRole('button', { name: phrase.layers }));
      const settingsPanel = screen.getByRole('heading', { name: phrase.settings }).closest('section');
      if (!(settingsPanel instanceof HTMLElement)) {
        throw new Error('Town settings panel is missing.');
      }
      fireEvent.click(within(settingsPanel).getByRole('checkbox', { name: phrase.middleVisible }));

      expect(requireCanvasProps().document.layers.find((layer) => layer.id === 'middle')?.visible).toBe(false);
      act(() => {
        requireCanvasProps().onSelectObjectInLayer(copyId, 'middle');
      });
      const hiddenAlert = screen.getByRole('alert').textContent ?? '';
      expect(hiddenAlert.startsWith(phrase.errorPrefix)).toBe(true);
      expect(hiddenAlert).toContain('"middle"');
      expect(hiddenAlert).toContain(`"${copyId}"`);
      expect(hiddenAlert).toContain('hidden');
      expect(requireCanvasProps().document.activeLayer).toBe('lower');
      expect(requireCanvasProps().selectedObjectId).toBe(sourceId);

      act(() => {
        requireCanvasProps().onSelectObjectInLayer('missing-town-object', 'upper');
      });
      const unknownObjectAlert = screen.getByRole('alert').textContent ?? '';
      expect(unknownObjectAlert).toContain('"missing-town-object"');
      expect(unknownObjectAlert).toContain('"upper"');
      expect(unknownObjectAlert).toContain('does not contain');

      act(() => {
        requireCanvasProps().onSelectObjectInLayer(sourceId, 'basement' as TownLayerId);
      });
      const unknownLayerAlert = screen.getByRole('alert').textContent ?? '';
      expect(unknownLayerAlert).toContain('basement');
      expect(unknownLayerAlert).toContain('lower, middle, or upper');

      act(() => {
        requireCanvasProps().onSelectObjectInLayer('', 'lower');
      });
      expect(screen.getByRole('alert').textContent).toContain('non-empty string');

      act(() => {
        requireCanvasProps().onSelectObject(copyId);
      });
      const guardAlert = screen.getByRole('alert').textContent ?? '';
      expect(guardAlert).toContain(phrase.invalid);
      expect(guardAlert).toContain(`"${copyId}"`);
      expect(requireCanvasProps().document.activeLayer).toBe('lower');
      expect(requireCanvasProps().selectedObjectId).toBe(sourceId);
      expect(requireLayerObjects('lower')).toHaveLength(1);
      expect(requireLayerObjects('middle')).toHaveLength(1);

      fireEvent.click(screen.getByRole('button', { name: phrase.copy }));
      expect(screen.queryByRole('alert')).toBeNull();
      expect(screen.queryByRole('status')).toBeNull();
      expectNoCopyOrDeleteSuccessText();
      expect(requireCanvasProps().document.activeLayer).toBe('lower');
      expect(requireCanvasProps().selectedObjectId).toBe(sourceId);
      expect(requireLayerObjects('upper')).toHaveLength(0);
      expect(screen.getByText(phrase.editingLower)).toBeTruthy();
    },
  );

  it.each(['en', 'zh'] as const)(
    'keeps the copy target independent without a success status (%s)',
    (locale) => {
      const phrase = WORKBENCH_LOCALE[locale];
      render(<TownCreatorWorkbench locale={locale} />);
      const sourceId = addCottage(locale);
      const source = requireTownObject('lower', sourceId);
      expect(workbenchFeedbackBar()).toBeNull();
      expect(screen.queryByText(phrase.added)).toBeNull();
      expect(requireRadio(phrase.middle).checked).toBe(true);

      fireEvent.click(screen.getByRole('button', { name: phrase.copy }));
      const middleCopy = requireLayerObjects('middle')[0];
      if (!middleCopy) {
        throw new Error('Copy did not create a middle-layer object.');
      }
      expect(middleCopy).toMatchObject({
        assetId: source.assetId,
        material: source.material,
        x: source.x,
        y: source.y,
        width: source.width,
        height: source.height,
        rotationDegrees: source.rotationDegrees,
      });
      expect(middleCopy.id).not.toBe(sourceId);
      expect(requireCanvasProps().document.activeLayer).toBe('lower');
      expect(requireCanvasProps().selectedObjectId).toBe(sourceId);
      expect(requireRadio(phrase.middle).checked).toBe(true);
      expect(screen.queryByRole('status')).toBeNull();
      expect(screen.queryByText(phrase.added)).toBeNull();
      expectNoCopyOrDeleteSuccessText();

      fireEvent.click(requireRadio(phrase.upper));
      fireEvent.click(screen.getByRole('button', { name: phrase.copy }));
      const upperCopy = requireLayerObjects('upper')[0];
      if (!upperCopy) {
        throw new Error('Copy did not create an upper-layer object.');
      }
      expect(upperCopy).toMatchObject({ x: source.x, y: source.y, width: source.width, height: source.height });
      expect(requireTownObject('middle', middleCopy.id)).toMatchObject({ x: source.x, y: source.y });
      expect(requireCanvasProps().document.activeLayer).toBe('lower');
      expect(requireCanvasProps().selectedObjectId).toBe(sourceId);
      expect(requireRadio(phrase.upper).checked).toBe(true);
      expect(screen.getByText(phrase.editingLower)).toBeTruthy();
      expectNoCopyOrDeleteSuccessText();
    },
  );

  it.each(['en', 'zh'] as const)(
    'deletes the selected object with Delete, Backspace, and the delete button (%s)',
    (locale) => {
      const phrase = WORKBENCH_LOCALE[locale];
      render(<TownCreatorWorkbench locale={locale} />);

      const deleteFrom = (target: Element, key: 'Delete' | 'Backspace'): void => {
        const sourceId = addCottage(locale);
        expect(workbenchFeedbackBar()).toBeNull();
        expect(screen.queryByText(phrase.added)).toBeNull();
        const ignored = dispatchTownKey(document.body, { key });
        expect(ignored.defaultPrevented).toBe(false);
        expect(requireLayerObjects('lower')).toHaveLength(1);
        expect(requireCanvasProps().selectedObjectId).toBe(sourceId);

        const deleted = dispatchTownKey(target, { key });
        expect(deleted.defaultPrevented).toBe(true);
        expect(requireLayerObjects('lower')).toHaveLength(0);
        expect(requireCanvasProps().selectedObjectId).toBeNull();
        expect(screen.queryByRole('status')).toBeNull();
        expect(screen.queryByRole('alert')).toBeNull();
        expect(screen.queryByText(phrase.added)).toBeNull();
        expectNoCopyOrDeleteSuccessText();
      };

      deleteFrom(screen.getByTestId('town-canvas'), 'Delete');
      deleteFrom(requireWorkbench(), 'Backspace');

      const buttonSourceId = addCottage(locale);
      expect(requireCanvasProps().selectedObjectId).toBe(buttonSourceId);
      expect(workbenchFeedbackBar()).toBeNull();
      expect(screen.queryByText(phrase.added)).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: phrase.delete }));
      expect(requireLayerObjects('lower')).toHaveLength(0);
      expect(requireCanvasProps().selectedObjectId).toBeNull();
      expect(screen.queryByRole('status')).toBeNull();
      expect(screen.queryByRole('alert')).toBeNull();
      expectNoCopyOrDeleteSuccessText();
    },
  );

  it.each(['en', 'zh'] as const)(
    'ignores delete keys while typing, composing, modified, blocked, or with nothing selected (%s)',
    (locale) => {
      const phrase = WORKBENCH_LOCALE[locale];
      render(<TownCreatorWorkbench locale={locale} />);
      const workbench = requireWorkbench();

      for (const key of ['Delete', 'Backspace'] as const) {
        const idle = dispatchTownKey(workbench, { key });
        expect(idle.defaultPrevented).toBe(false);
      }
      expect(screen.queryByRole('alert')).toBeNull();
      expectNoCopyOrDeleteSuccessText();

      const sourceId = addCottage(locale);
      const layerSelect = document.getElementById('town-quick-layer');
      if (!(layerSelect instanceof HTMLSelectElement)) {
        throw new Error('Town quick layer control is not a select.');
      }
      fireEvent.change(layerSelect, { target: { value: 'upper' } });
      expect(requireCanvasProps().selectedObjectId).toBeNull();
      expect(requireCanvasProps().document.activeLayer).toBe('upper');
      const clearedSelection = dispatchTownKey(screen.getByTestId('town-canvas'), { key: 'Delete' });
      expect(clearedSelection.defaultPrevented).toBe(false);
      expect(requireLayerObjects('lower')).toHaveLength(1);
      expect(screen.queryByRole('alert')).toBeNull();

      fireEvent.change(layerSelect, { target: { value: 'lower' } });
      act(() => {
        requireCanvasProps().onSelectObject(sourceId);
      });
      expect(requireCanvasProps().selectedObjectId).toBe(sourceId);

      const widthInput = screen.getByLabelText(phrase.width);
      const textarea = document.createElement('textarea');
      const editable = document.createElement('div');
      editable.setAttribute('contenteditable', 'true');
      const editableChild = document.createElement('span');
      editableChild.textContent = 'note';
      editable.append(editableChild);
      workbench.append(textarea, editable);

      const blockedTargets: Array<[Element, string]> = [
        [widthInput, 'input'],
        [textarea, 'textarea'],
        [layerSelect, 'select'],
        [editableChild, 'contenteditable ancestor'],
      ];
      for (const [target, label] of blockedTargets) {
        const blocked = dispatchTownKey(target, { key: 'Backspace' });
        if (blocked.defaultPrevented) {
          throw new Error(`Backspace was prevented while the target was ${label}.`);
        }
        expect(requireLayerObjects('lower')).toHaveLength(1);
        expect(requireCanvasProps().selectedObjectId).toBe(sourceId);
      }

      const composing = dispatchTownKey(workbench, { key: 'Delete', isComposing: true });
      const processKey = dispatchTownKey(workbench, { key: 'Process' });
      const modifiedKeys = [
        dispatchTownKey(workbench, { key: 'Delete', ctrlKey: true }),
        dispatchTownKey(workbench, { key: 'Backspace', metaKey: true }),
        dispatchTownKey(workbench, { key: 'Delete', altKey: true }),
        dispatchTownKey(workbench, { key: 'Backspace', shiftKey: true }),
      ];
      expect(composing.defaultPrevented).toBe(false);
      expect(processKey.defaultPrevented).toBe(false);
      for (const modified of modifiedKeys) {
        expect(modified.defaultPrevented).toBe(false);
      }
      expect(requireLayerObjects('lower')).toHaveLength(1);

      workbench.addEventListener('keydown', (event) => {
        if (event.key === 'Delete') {
          event.preventDefault();
        }
      }, true);
      const alreadyPrevented = dispatchTownKey(workbench, { key: 'Delete' });
      expect(alreadyPrevented.defaultPrevented).toBe(true);
      expect(requireLayerObjects('lower')).toHaveLength(1);
      expect(requireCanvasProps().selectedObjectId).toBe(sourceId);

      fireEvent.click(screen.getByRole('button', { name: phrase.more }));
      expect(screen.getByRole('menu')).toBeTruthy();
      const menuBlocked = dispatchTownKey(screen.getByTestId('town-canvas'), { key: 'Backspace' });
      expect(menuBlocked.defaultPrevented).toBe(false);
      expect(requireLayerObjects('lower')).toHaveLength(1);
      fireEvent.click(screen.getByRole('button', { name: phrase.more }));

      fireEvent.click(screen.getByRole('button', { name: phrase.save }));
      expect(screen.getByRole('dialog')).toBeTruthy();
      const dialogBlocked = dispatchTownKey(screen.getByTestId('town-canvas'), { key: 'Backspace' });
      expect(dialogBlocked.defaultPrevented).toBe(false);
      expect(requireLayerObjects('lower')).toHaveLength(1);
      expect(requireCanvasProps().selectedObjectId).toBe(sourceId);
      expect(screen.queryByRole('alert')).toBeNull();
      expectNoCopyOrDeleteSuccessText();
    },
  );

  it.each(['en', 'zh'] as const)(
    'adds, copies, and deletes without a success bar (%s)',
    (locale) => {
      const phrase = WORKBENCH_LOCALE[locale];
      render(<TownCreatorWorkbench locale={locale} />);
      fireEvent.click(within(screen.getByRole('navigation', { name: phrase.navigation })).getByRole('button', { name: phrase.layers }));
      const settingsPanel = screen.getByRole('heading', { name: phrase.settings }).closest('section');
      if (!(settingsPanel instanceof HTMLElement)) {
        throw new Error('Town settings panel is missing.');
      }
      const lowerVisibility = within(settingsPanel).getAllByRole('checkbox')[0];
      if (!(lowerVisibility instanceof HTMLInputElement)) {
        throw new Error('Lower layer visibility control is not a checkbox.');
      }

      fireEvent.click(lowerVisibility);
      fireEvent.click(screen.getByRole('button', { name: phrase.addCottage }));
      const hiddenAlert = workbenchFeedbackBar();
      expect(hiddenAlert?.getAttribute('role')).toBe('alert');
      expect(hiddenAlert?.textContent?.startsWith(phrase.errorPrefix)).toBe(true);
      expect(hiddenAlert?.textContent).toContain(phrase.hiddenLayer);
      expect(requireLayerObjects('lower')).toHaveLength(0);
      expectNoSuccessFeedback(locale);

      fireEvent.click(lowerVisibility);
      const sourceId = addCottage(locale);
      const source = requireTownObject('lower', sourceId);
      expect(workbenchFeedbackBar()).toBeNull();
      expectNoSuccessFeedback(locale);

      fireEvent.click(screen.getByRole('button', { name: phrase.copy }));
      const copiedObject = requireLayerObjects('middle')[0];
      if (!copiedObject) {
        throw new Error('Copy did not create a middle-layer object.');
      }
      expect(copiedObject).toMatchObject({ assetId: source.assetId, x: source.x, y: source.y });
      expect(requireCanvasProps().selectedObjectId).toBe(sourceId);
      expect(requireCanvasProps().document.activeLayer).toBe('lower');
      expect(workbenchFeedbackBar()).toBeNull();
      expectNoSuccessFeedback(locale);

      fireEvent.click(screen.getByRole('button', { name: phrase.delete }));
      expect(requireLayerObjects('lower')).toHaveLength(0);
      expect(requireLayerObjects('middle')).toHaveLength(1);
      expect(requireCanvasProps().selectedObjectId).toBeNull();
      expect(workbenchFeedbackBar()).toBeNull();
      expectNoSuccessFeedback(locale);
    },
  );

  it.each(['en', 'zh'] as const)(
    'keeps background errors and loading without a success bar (%s)',
    (locale) => {
      const phrase = WORKBENCH_LOCALE[locale];
      const backgroundImages = installMockBackgroundImage();
      try {
        render(<TownCreatorWorkbench locale={locale} />);
        fireEvent.click(within(screen.getByRole('navigation', { name: phrase.navigation })).getByRole('button', { name: phrase.canvas }));

        fireEvent.change(screen.getByLabelText(phrase.color), { target: { value: '   ' } });
        fireEvent.click(screen.getByRole('button', { name: phrase.loadBackground }));
        const invalidColorAlert = workbenchFeedbackBar();
        expect(invalidColorAlert?.getAttribute('role')).toBe('alert');
        expect(invalidColorAlert?.textContent).toContain(`${phrase.color} must be a non-empty value.`);
        expect(backgroundImages.images).toHaveLength(0);
        expectNoSuccessFeedback(locale);

        fireEvent.change(screen.getByLabelText(phrase.color), { target: { value: '#112233' } });
        fireEvent.change(screen.getByLabelText(phrase.imageUrl), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: phrase.loadBackground }));
        expect(requireCanvasProps().document.backgroundColor).toBe('#112233');
        expect(requireCanvasProps().document.backgroundImageUrl).toBe('');
        expect(workbenchFeedbackBar()).toBeNull();
        expectNoSuccessFeedback(locale);

        fireEvent.change(screen.getByLabelText(phrase.imageUrl), { target: { value: 'https://example.com/old.png' } });
        fireEvent.click(screen.getByRole('button', { name: phrase.loadBackground }));
        const firstLoadingBar = workbenchFeedbackBar();
        expect(firstLoadingBar?.getAttribute('role')).toBe('status');
        expect(firstLoadingBar?.textContent).toContain(phrase.backgroundLoading);
        expect(firstLoadingBar?.querySelector('[aria-hidden="true"]')).toBeTruthy();
        expect(firstLoadingBar?.className.includes('feedback-info')).toBe(true);
        expect(firstLoadingBar?.className.includes('feedback-success')).toBe(false);

        fireEvent.change(screen.getByLabelText(phrase.imageUrl), { target: { value: 'https://example.com/new.png' } });
        fireEvent.click(screen.getByRole('button', { name: phrase.loadBackground }));
        expect(backgroundImages.images).toHaveLength(2);
        act(() => {
          requireMockBackgroundImage(backgroundImages.images, 0).onload?.();
          requireMockBackgroundImage(backgroundImages.images, 0).onerror?.();
        });
        expect(requireCanvasProps().document.backgroundImageUrl).toBe('');
        expect(workbenchFeedbackBar()?.getAttribute('role')).toBe('status');
        expect(workbenchFeedbackBar()?.textContent).toContain(phrase.backgroundLoading);

        act(() => {
          requireMockBackgroundImage(backgroundImages.images, 1).onerror?.();
        });
        const imageAlert = workbenchFeedbackBar();
        expect(imageAlert?.getAttribute('role')).toBe('alert');
        expect(imageAlert?.textContent).toContain(`${phrase.backgroundFailed}: https://example.com/new.png`);
        expect(requireCanvasProps().document.backgroundImageUrl).toBe('');
        expectNoSuccessFeedback(locale);

        fireEvent.click(screen.getByRole('button', { name: phrase.clearImage }));
        expect(requireCanvasProps().document.backgroundColor).toBe('#112233');
        expect(requireCanvasProps().document.backgroundImageUrl).toBe('');
        expect(workbenchFeedbackBar()).toBeNull();

        fireEvent.change(screen.getByLabelText(phrase.imageUrl), { target: { value: 'https://example.com/ready.png' } });
        fireEvent.click(screen.getByRole('button', { name: phrase.loadBackground }));
        expect(workbenchFeedbackBar()?.textContent).toContain(phrase.backgroundLoading);
        act(() => {
          requireMockBackgroundImage(backgroundImages.images, 2).onload?.();
        });
        expect(requireCanvasProps().document.backgroundImageUrl).toBe('https://example.com/ready.png');
        expect(requireCanvasProps().document.backgroundColor).toBe('#112233');
        expect(workbenchFeedbackBar()).toBeNull();
        expectNoSuccessFeedback(locale);
      } finally {
        backgroundImages.restore();
      }
    },
  );

  it.each(['en', 'zh'] as const)(
    'loads a saved project without a workbench success bar (%s)',
    async (locale) => {
      const phrase = WORKBENCH_LOCALE[locale];
      window.localStorage.removeItem('tokenmaker.town-creator.slots');
      try {
        render(<TownCreatorWorkbench locale={locale} />);
        fireEvent.click(within(screen.getByRole('navigation', { name: phrase.navigation })).getByRole('button', { name: phrase.canvas }));
        fireEvent.change(screen.getByLabelText(phrase.color), { target: { value: '#112233' } });
        fireEvent.click(screen.getByRole('button', { name: phrase.loadBackground }));
        expect(requireCanvasProps().document.backgroundColor).toBe('#112233');
        expect(workbenchFeedbackBar()).toBeNull();

        fireEvent.click(screen.getByRole('button', { name: phrase.save }));
        await act(async () => {
          await Promise.resolve();
        });
        const dialog = screen.getByRole('dialog');
        const slotSaveButtons = within(dialog).getAllByRole('button', { name: phrase.save });
        const slotSaveButton = slotSaveButtons[0];
        if (!(slotSaveButton instanceof HTMLButtonElement) || slotSaveButton.disabled) {
          throw new Error(`Slot 1 save is not an enabled button. Received ${slotSaveButtons.length} save buttons.`);
        }
        fireEvent.click(slotSaveButton);
        expect(within(dialog).getByRole('status').textContent).toBe(phrase.dialogSaved);
        expect(workbenchFeedbackBar()).toBeNull();
        fireEvent.click(within(dialog).getByRole('button', { name: phrase.close }));
        expect(screen.queryByRole('dialog')).toBeNull();

        fireEvent.change(screen.getByLabelText(phrase.color), { target: { value: '#abcdef' } });
        fireEvent.click(screen.getByRole('button', { name: phrase.loadBackground }));
        expect(requireCanvasProps().document.backgroundColor).toBe('#abcdef');
        expect(workbenchFeedbackBar()).toBeNull();

        fireEvent.change(screen.getByLabelText(phrase.color), { target: { value: '   ' } });
        fireEvent.click(screen.getByRole('button', { name: phrase.loadBackground }));
        expect(requireCanvasProps().document.backgroundColor).toBe('#abcdef');
        expect(workbenchFeedbackBar()?.getAttribute('role')).toBe('alert');
        expect(workbenchFeedbackBar()?.textContent).toContain(`${phrase.color} must be a non-empty value.`);

        fireEvent.click(screen.getByRole('button', { name: phrase.save }));
        await act(async () => {
          await Promise.resolve();
        });
        const loadDialog = screen.getByRole('dialog');
        const slotLoadButtons = within(loadDialog).getAllByRole('button', { name: phrase.load });
        const slotLoadButton = slotLoadButtons[0];
        if (!(slotLoadButton instanceof HTMLButtonElement) || slotLoadButton.disabled) {
          throw new Error(`Slot 1 load is not an enabled button. Received ${slotLoadButtons.length} load buttons.`);
        }
        fireEvent.click(slotLoadButton);
        expect(requireCanvasProps().document.backgroundColor).toBe('#112233');
        expect(requireCanvasProps().document.backgroundImageUrl).toBe('');
        expect(requireCanvasProps().selectedObjectId).toBeNull();
        expect(workbenchFeedbackBar()).toBeNull();
        expect(within(loadDialog).getByRole('status').textContent).toBe(phrase.dialogLoaded);
        expect(screen.queryByText(phrase.projectLoaded)).toBeNull();
        expectNoSuccessFeedback(locale);
      } finally {
        window.localStorage.removeItem('tokenmaker.town-creator.slots');
      }
    },
  );
});
