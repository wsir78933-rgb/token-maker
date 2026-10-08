// @vitest-environment jsdom

import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TOWN_CREATOR_EDITOR_ID } from '@/lib/town-creator/copy';

import { TownCreatorEditorSection } from './TownCreatorEditorSection';

class TrackingIntersectionObserver {
  private readonly callback: IntersectionObserverCallback;
  private isObserving = false;
  readonly observe = vi.fn(() => {
    this.isObserving = true;
  });
  readonly disconnect = vi.fn(() => {
    this.isObserving = false;
  });

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  trigger(isIntersecting: boolean): void {
    if (!this.isObserving) {
      return;
    }

    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

const observerInstances: TrackingIntersectionObserver[] = [];

function installTrackingIntersectionObserver(): void {
  class InstalledTrackingIntersectionObserver extends TrackingIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      super(callback);
      observerInstances.push(this);
    }
  }

  vi.stubGlobal('IntersectionObserver', InstalledTrackingIntersectionObserver);
}

afterEach(() => {
  cleanup();
  observerInstances.length = 0;
  vi.unstubAllGlobals();
});

beforeEach(() => {
  installTrackingIntersectionObserver();
});

describe('TownCreatorEditorSection', () => {
  it('keeps the editor hidden initially, follows visibility, preserves children, and disconnects', () => {
    const view = render(
      <TownCreatorEditorSection>
        <div data-testid="town-editor-child">Editor child</div>
      </TownCreatorEditorSection>,
    );
    const editorSection = document.getElementById(TOWN_CREATOR_EDITOR_ID);
    if (!(editorSection instanceof HTMLElement)) {
      throw new Error(`Expected town editor section ${JSON.stringify(TOWN_CREATOR_EDITOR_ID)}.`);
    }

    expect(editorSection.tagName).toBe('SECTION');
    expect(editorSection.dataset.inView).toBe('false');
    expect(editorSection.className).toContain('max-w-[96rem]');
    expect(editorSection.className).toContain('scroll-mt-20');
    expect(editorSection.querySelector('[data-testid="town-editor-child"]')).toBeTruthy();

    const observer = observerInstances[0];
    if (observer === undefined) {
      throw new Error('Expected a town editor IntersectionObserver.');
    }
    expect(observer.observe).toHaveBeenCalledWith(editorSection);

    act(() => observer.trigger(true));
    expect(editorSection.dataset.inView).toBe('true');

    act(() => observer.trigger(false));
    expect(editorSection.dataset.inView).toBe('false');

    view.unmount();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it('fails fast when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    expect(() => render(
      <TownCreatorEditorSection>
        <div>Editor child</div>
      </TownCreatorEditorSection>,
    )).toThrow(
      'Town creator editor requires IntersectionObserver. Received "undefined".',
    );
  });
});
