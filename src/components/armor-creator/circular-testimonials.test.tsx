// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, waitFor, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import {
  CircularTestimonials,
  type CircularTestimonial,
} from '@/components/armor-creator/circular-testimonials';

const reducedMotionState = vi.hoisted(() => ({ enabled: false }));
const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)';
const reducedMotionMediaQueryListeners = new Set<(event: MediaQueryListEvent) => void>();

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
  };
});

const TESTIMONIALS: readonly CircularTestimonial[] = [
  {
    quote: 'First armor case quote.',
    name: 'First character',
    designation: 'Plate armor',
    src: '/armor-creator/cases/first.png',
  },
  {
    quote: 'Second armor case quote.',
    name: 'Second character',
    designation: 'Leather armor',
    src: '/armor-creator/cases/second.png',
  },
  {
    quote: 'Third armor case quote.',
    name: 'Third character',
    designation: 'Cloth armor',
    src: '/armor-creator/cases/third.png',
  },
];

const IMAGE_POSITION_TESTIMONIALS: readonly CircularTestimonial[] = [
  ...TESTIMONIALS,
  {
    quote: 'Fourth armor case quote.',
    name: 'Fourth character',
    designation: 'Scale armor',
    src: '/armor-creator/cases/fourth.png',
  },
];

const TESTIMONIAL_IMAGE_TRANSITION_CURVE = String.raw`cubic-bezier\(\s*0?\.4\s*,\s*2\s*,\s*0?\.3\s*,\s*1\s*\)`;
const TESTIMONIAL_IMAGE_TRANSITION_STYLE = new RegExp(
  String.raw`^transform 800ms ${TESTIMONIAL_IMAGE_TRANSITION_CURVE}\s*,\s*opacity 800ms ${TESTIMONIAL_IMAGE_TRANSITION_CURVE}$`,
);

const IMAGE_LAYER_ROLE_STYLES = {
  active: {
    transform: /translateX\(0px\).*translateY\(0px\).*scale\(1\).*rotateY\(0deg\)/,
    opacity: '1',
    pointerEvents: 'auto',
    zIndex: '3',
    position: 'center',
  },
  previous: {
    transform: /translateX\(-[1-9][\d.]*px\).*translateY\(-[1-9][\d.]*px\).*scale\(0\.85\).*rotateY\(15deg\)/,
    opacity: '1',
    pointerEvents: 'auto',
    zIndex: '2',
    position: 'left',
  },
  next: {
    transform: /translateX\([1-9][\d.]*px\).*translateY\(-[1-9][\d.]*px\).*scale\(0\.85\).*rotateY\(-15deg\)/,
    opacity: '1',
    pointerEvents: 'auto',
    zIndex: '2',
    position: 'right',
  },
  hidden: {
    transform: /^$/,
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '1',
    position: 'hidden',
  },
} as const;

type ImageLayerRole = keyof typeof IMAGE_LAYER_ROLE_STYLES;

const PREVIOUS_LABEL = 'Previous armor case';
const NEXT_LABEL = 'Next armor case';

function renderedCarousel(testimonials: readonly CircularTestimonial[] = TESTIMONIALS) {
  return render(
    <CircularTestimonials
      testimonials={testimonials}
      ariaLabel="Armor cases"
      previousLabel={PREVIOUS_LABEL}
      nextLabel={NEXT_LABEL}
      autoplay={false}
    />,
  );
}

function installReducedMotionMatchMedia(): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((media: string) => ({
      get matches() {
        return media === REDUCED_MOTION_MEDIA_QUERY && reducedMotionState.enabled;
      },
      media,
      onchange: null,
      addEventListener: (
        eventName: string,
        listener: EventListenerOrEventListenerObject | null,
      ) => {
        if (eventName === 'change' && typeof listener === 'function') {
          reducedMotionMediaQueryListeners.add(listener as (event: MediaQueryListEvent) => void);
        }
      },
      removeEventListener: (
        eventName: string,
        listener: EventListenerOrEventListenerObject | null,
      ) => {
        if (eventName === 'change' && typeof listener === 'function') {
          reducedMotionMediaQueryListeners.delete(listener as (event: MediaQueryListEvent) => void);
        }
      },
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

function changeReducedMotionPreference(enabled: boolean): void {
  reducedMotionState.enabled = enabled;
  const event = {
    matches: enabled,
    media: REDUCED_MOTION_MEDIA_QUERY,
  } as MediaQueryListEvent;

  reducedMotionMediaQueryListeners.forEach((listener) => listener(event));
}

function renderedCarouselWithInvalidStyleOption(field: 'colors' | 'fontSizes', invalidValue: unknown) {
  if (field === 'colors') {
    return render(
      <CircularTestimonials
        testimonials={TESTIMONIALS}
        ariaLabel="Invalid style carousel"
        previousLabel={PREVIOUS_LABEL}
        nextLabel={NEXT_LABEL}
        autoplay={false}
        colors={invalidValue as never}
      />,
    );
  }

  return render(
    <CircularTestimonials
      testimonials={TESTIMONIALS}
      ariaLabel="Invalid style carousel"
      previousLabel={PREVIOUS_LABEL}
      nextLabel={NEXT_LABEL}
      autoplay={false}
      fontSizes={invalidValue as never}
    />,
  );
}

function carouselRegions(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('[data-circular-testimonials="true"]'));
}

function testimonialImageLayer(carousel: HTMLElement, index: number): HTMLElement {
  const layer = carousel.querySelector<HTMLElement>(`[data-index="${index}"]`);
  if (!layer) {
    throw new Error(`CircularTestimonials test expected an image layer with data-index="${index}".`);
  }

  return layer;
}

function expectImageLayerRole(carousel: HTMLElement, index: number, role: ImageLayerRole): void {
  const layer = testimonialImageLayer(carousel, index);
  const { style } = layer;
  const expected = IMAGE_LAYER_ROLE_STYLES[role];

  expect(style.transform).toMatch(expected.transform);
  expect(style.translate).toBe('-50% -50%');
  expect(style.transition).toMatch(TESTIMONIAL_IMAGE_TRANSITION_STYLE);
  expect(style.opacity).toBe(expected.opacity);
  expect(style.pointerEvents).toBe(expected.pointerEvents);
  expect(style.zIndex).toBe(expected.zIndex);
  expect(layer.getAttribute('data-position')).toBe(expected.position);
}

function activeQuoteText(carousel: HTMLElement): string | null {
  return carousel.querySelector<HTMLElement>('[data-part="testimonial-quote"]')?.textContent?.trim() ?? null;
}

describe('CircularTestimonials', () => {
  beforeEach(() => {
    reducedMotionState.enabled = false;
    reducedMotionMediaQueryListeners.clear();
    installReducedMotionMatchMedia();
  });

  afterEach(() => {
    cleanup();
    reducedMotionState.enabled = false;
    reducedMotionMediaQueryListeners.clear();
    vi.unstubAllGlobals();
  });

  it('前后按钮循环切换案例并且保留可访问按钮名称', async () => {
    const { container } = renderedCarousel();
    const carousel = carouselRegions(container)[0];
    if (!carousel) {
      throw new Error('CircularTestimonials test expected one carousel region.');
    }

    const controls = within(carousel);
    const previousButton = controls.getByRole('button', { name: PREVIOUS_LABEL });
    const nextButton = controls.getByRole('button', { name: NEXT_LABEL });

    expect(previousButton.getAttribute('type')).toBe('button');
    expect(nextButton.getAttribute('type')).toBe('button');
    expect(previousButton.getAttribute('aria-label')).toBe(PREVIOUS_LABEL);
    expect(nextButton.getAttribute('aria-label')).toBe(NEXT_LABEL);
    expect(carousel.getAttribute('aria-label')).toBe('Armor cases');
    expect(previousButton.className).toContain('focus-visible:outline');
    expect(carousel.querySelector('[data-part="layout"]')?.className).toContain('md:flex-row');
    expect(activeQuoteText(carousel)).toBe('First armor case quote.');

    fireEvent.click(nextButton);
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('Second armor case quote.'));

    fireEvent.click(previousButton);
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('First armor case quote.'));

    fireEvent.click(previousButton);
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('Third armor case quote.'));
  });

  it.each([
    ['active center', 0, 'active'],
    ['previous left neighbor', 3, 'previous'],
    ['next right neighbor', 1, 'next'],
    ['hidden image', 2, 'hidden'],
  ] as const)('initially positions the %s image layer', (_description, index, role) => {
    const { container } = renderedCarousel(IMAGE_POSITION_TESTIMONIALS);
    const [carousel] = carouselRegions(container);
    if (!carousel) {
      throw new Error('CircularTestimonials test expected one carousel region.');
    }

    expectImageLayerRole(carousel, index, role);
  });

  it('moves image layers with next, previous, and wrapped arrow navigation', async () => {
    const { container } = renderedCarousel(IMAGE_POSITION_TESTIMONIALS);
    const [carousel] = carouselRegions(container);
    if (!carousel) {
      throw new Error('CircularTestimonials test expected one carousel region.');
    }

    const controls = within(carousel);
    const previousButton = controls.getByRole('button', { name: PREVIOUS_LABEL });
    const nextButton = controls.getByRole('button', { name: NEXT_LABEL });

    fireEvent.click(nextButton);
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('Second armor case quote.'));
    expectImageLayerRole(carousel, 0, 'previous');
    expectImageLayerRole(carousel, 1, 'active');
    expectImageLayerRole(carousel, 2, 'next');
    expectImageLayerRole(carousel, 3, 'hidden');

    fireEvent.click(previousButton);
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('First armor case quote.'));
    expectImageLayerRole(carousel, 0, 'active');
    expectImageLayerRole(carousel, 1, 'next');
    expectImageLayerRole(carousel, 2, 'hidden');
    expectImageLayerRole(carousel, 3, 'previous');

    fireEvent.click(previousButton);
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('Fourth armor case quote.'));
    expectImageLayerRole(carousel, 0, 'next');
    expectImageLayerRole(carousel, 1, 'hidden');
    expectImageLayerRole(carousel, 2, 'previous');
    expectImageLayerRole(carousel, 3, 'active');

    fireEvent.click(nextButton);
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('First armor case quote.'));
    expectImageLayerRole(carousel, 0, 'active');
    expectImageLayerRole(carousel, 1, 'next');
    expectImageLayerRole(carousel, 2, 'hidden');
    expectImageLayerRole(carousel, 3, 'previous');
  });

  it('uses the navigation direction to position the neighbor with two testimonials', async () => {
    const { container } = renderedCarousel(TESTIMONIALS.slice(0, 2));
    const [carousel] = carouselRegions(container);
    if (!carousel) {
      throw new Error('CircularTestimonials test expected one carousel region.');
    }

    expectImageLayerRole(carousel, 1, 'previous');

    const controls = within(carousel);
    fireEvent.click(controls.getByRole('button', { name: NEXT_LABEL }));
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('Second armor case quote.'));
    expectImageLayerRole(carousel, 0, 'previous');

    fireEvent.click(controls.getByRole('button', { name: PREVIOUS_LABEL }));
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('First armor case quote.'));
    expectImageLayerRole(carousel, 1, 'next');

    carousel.focus();
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('Second armor case quote.'));
    expectImageLayerRole(carousel, 0, 'previous');

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('First armor case quote.'));
    expectImageLayerRole(carousel, 1, 'next');
  });

  it('adjusts side image gaps from the measured image-stage width', async () => {
    const resizeObservers: ControlledImageStageResizeObserver[] = [];

    class ControlledImageStageResizeObserver implements ResizeObserver {
      private readonly callback: ResizeObserverCallback;
      observedElement: Element | null = null;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        resizeObservers.push(this);
      }

      observe(target: Element): void {
        this.observedElement = target;
      }

      unobserve(target: Element): void {
        if (this.observedElement === target) {
          this.observedElement = null;
        }
      }

      disconnect(): void {
        this.observedElement = null;
      }

      reportWidth(width: number): void {
        if (!this.observedElement) {
          throw new Error('CircularTestimonials test expected an observed image stage.');
        }

        this.callback(
          [
            {
              target: this.observedElement,
              contentRect: { width } as DOMRectReadOnly,
            } as ResizeObserverEntry,
          ],
          this,
        );
      }
    }

    vi.stubGlobal('ResizeObserver', ControlledImageStageResizeObserver);
    let unmountCarousel: (() => void) | undefined;

    try {
      const { container, unmount } = renderedCarousel(IMAGE_POSITION_TESTIMONIALS);
      unmountCarousel = unmount;
      const [carousel] = carouselRegions(container);
      const [resizeObserver] = resizeObservers;
      if (!carousel || !resizeObserver) {
        throw new Error('CircularTestimonials test expected one carousel and its resize observer.');
      }

      expect(resizeObserver.observedElement).toBe(
        carousel.querySelector('[data-part="image-stage"]'),
      );

      await act(async () => resizeObserver.reportWidth(320));
      expect(testimonialImageLayer(carousel, 1).style.transform).toContain('translateX(80px)');
      expect(testimonialImageLayer(carousel, 3).style.transform).toContain('translateX(-80px)');

      await act(async () => resizeObserver.reportWidth(440));
      expect(testimonialImageLayer(carousel, 1).style.transform).toContain('translateX(110px)');
      expect(testimonialImageLayer(carousel, 3).style.transform).toContain('translateX(-110px)');

      await act(async () => resizeObserver.reportWidth(560));
      expect(testimonialImageLayer(carousel, 1).style.transform).toContain('translateX(140px)');
      expect(testimonialImageLayer(carousel, 3).style.transform).toContain('translateX(-140px)');
    } finally {
      unmountCarousel?.();
      vi.unstubAllGlobals();
    }
  });

  it('renders a single testimonial without crashing', () => {
    const { container } = renderedCarousel(TESTIMONIALS.slice(0, 1));
    const [carousel] = carouselRegions(container);
    if (!carousel) {
      throw new Error('CircularTestimonials test expected one carousel region.');
    }

    expect(activeQuoteText(carousel)).toBe('First armor case quote.');
    expect(within(carousel).getByRole('img', { name: 'First character' }).className).toContain(
      'object-contain',
    );
    expect(within(carousel).getByRole('button', { name: PREVIOUS_LABEL })).toBeTruthy();
    expect(within(carousel).getByRole('button', { name: NEXT_LABEL })).toBeTruthy();
  });

  it('支持左右交替图文位置，且两个实例的切换状态互不影响', async () => {
    const { container } = render(
      <>
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="Left armor cases"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
          imagePosition="left"
        />
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="Right armor cases"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
          imagePosition="right"
        />
      </>,
    );
    const [leftCarousel, rightCarousel] = carouselRegions(container);
    if (!leftCarousel || !rightCarousel) {
      throw new Error('CircularTestimonials test expected two carousel regions.');
    }

    const leftLayout = leftCarousel.querySelector<HTMLElement>('[data-part="layout"]');
    const rightLayout = rightCarousel.querySelector<HTMLElement>('[data-part="layout"]');
    expect(leftLayout?.className).toContain('flex-col md:flex-row');
    expect(leftLayout?.className).not.toContain('md:flex-row-reverse');
    expect(rightLayout?.className).toContain('flex-col-reverse');
    expect(rightLayout?.className).toContain('md:flex-row-reverse');
    expect(Array.from(leftLayout?.children ?? []).map((child) => child.getAttribute('data-part'))).toEqual([
      'image-stage',
      'testimonial-copy',
    ]);
    expect(Array.from(rightLayout?.children ?? []).map((child) => child.getAttribute('data-part'))).toEqual([
      'image-stage',
      'testimonial-copy',
    ]);
    expect(leftCarousel.getAttribute('aria-label')).toBe('Left armor cases');
    expect(rightCarousel.getAttribute('aria-label')).toBe('Right armor cases');
    expect(leftCarousel.getAttribute('aria-label')).not.toBe(rightCarousel.getAttribute('aria-label'));

    const firstActiveImage = within(leftCarousel).getByRole('img', { name: 'First character' });
    expect(firstActiveImage.className).toContain('object-contain');
    expect(firstActiveImage.closest('[data-part="testimonial-image-frame"]')?.className).toContain(
      'bg-[#f4eee5]',
    );

    fireEvent.click(within(leftCarousel).getByRole('button', { name: NEXT_LABEL }));

    await waitFor(() => expect(activeQuoteText(leftCarousel)).toBe('Second armor case quote.'));
    expect(activeQuoteText(rightCarousel)).toBe('First armor case quote.');
  });

  it('默认保持米色图片框且不添加图片按钮，支持自定义图片背景', () => {
    const { container: defaultContainer } = renderedCarousel();
    const [defaultCarousel] = carouselRegions(defaultContainer);
    if (!defaultCarousel) {
      throw new Error('CircularTestimonials test expected one default carousel region.');
    }

    const defaultFrame = defaultCarousel.querySelector<HTMLElement>('[data-part="testimonial-image-frame"]');
    expect(defaultFrame?.className).toContain('bg-[#f4eee5]');
    expect(defaultCarousel.querySelectorAll('button[aria-haspopup="dialog"]')).toHaveLength(0);

    cleanup();

    const { container: customContainer } = render(
      <CircularTestimonials
        testimonials={TESTIMONIALS}
        ariaLabel="Custom background cases"
        previousLabel={PREVIOUS_LABEL}
        nextLabel={NEXT_LABEL}
        autoplay={false}
        colors={{ imageBackground: '#fffaf0' }}
      />,
    );
    const [customCarousel] = carouselRegions(customContainer);
    if (!customCarousel) {
      throw new Error('CircularTestimonials test expected one custom background carousel region.');
    }

    expect(customCarousel.querySelector<HTMLElement>('[data-part="testimonial-image-frame"]')?.style.backgroundColor).toBe(
      'rgb(255, 250, 240)',
    );
  });

  it('只让当前图片成为可访问的打开按钮，并将当前项和触发按钮传给回调', async () => {
    const onImageClick = vi.fn();
    const { container } = render(
      <CircularTestimonials
        testimonials={TESTIMONIALS}
        ariaLabel="Openable armor cases"
        previousLabel={PREVIOUS_LABEL}
        nextLabel={NEXT_LABEL}
        autoplay={false}
        imageActionLabel="Open image"
        onImageClick={onImageClick}
      />,
    );
    const [carousel] = carouselRegions(container);
    if (!carousel) {
      throw new Error('CircularTestimonials test expected one openable carousel region.');
    }

    const firstImageButton = within(carousel).getByRole('button', {
      name: 'Open image: First character',
    });
    expect(firstImageButton.getAttribute('aria-haspopup')).toBe('dialog');
    expect(carousel.querySelectorAll('button[aria-haspopup="dialog"]')).toHaveLength(1);
    expect(testimonialImageLayer(carousel, 1).querySelector('button')).toBeNull();

    fireEvent.click(firstImageButton);

    expect(onImageClick).toHaveBeenCalledTimes(1);
    expect(onImageClick.mock.calls[0]?.[0]).toEqual(TESTIMONIALS[0]);
    expect(onImageClick.mock.calls[0]?.[1]).toBe(firstImageButton);

    fireEvent.click(within(carousel).getByRole('button', { name: NEXT_LABEL }));
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('Second armor case quote.'));

    const secondImageButton = within(carousel).getByRole('button', {
      name: 'Open image: Second character',
    });
    expect(secondImageButton).not.toBe(firstImageButton);
    fireEvent.click(secondImageButton);
    expect(onImageClick.mock.calls[1]?.[0]).toEqual(TESTIMONIALS[1]);
    expect(onImageClick.mock.calls[1]?.[1]).toBe(secondImageButton);
  });

  it('点击当前图片后停止自动播放', async () => {
    vi.useFakeTimers();
    const onImageClick = vi.fn();

    try {
      const { container } = render(
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="Openable autoplay cases"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          imageActionLabel="Open image"
          onImageClick={onImageClick}
        />,
      );
      const [carousel] = carouselRegions(container);
      if (!carousel) {
        throw new Error('CircularTestimonials test expected one openable autoplay carousel region.');
      }

      fireEvent.click(within(carousel).getByRole('button', { name: 'Open image: First character' }));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000);
      });

      expect(activeQuoteText(carousel)).toBe('First armor case quote.');
      expect(onImageClick).toHaveBeenCalledTimes(1);
    } finally {
      cleanup();
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });

  it('只有当前轮播容器获得焦点时才响应左右方向键', async () => {
    const { container } = render(
      <>
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="First keyboard carousel"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
        />
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="Second keyboard carousel"
          previousLabel="上一案例"
          nextLabel="下一案例"
          autoplay={false}
        />
      </>,
    );
    const [firstCarousel, secondCarousel] = carouselRegions(container);
    if (!firstCarousel || !secondCarousel) {
      throw new Error('CircularTestimonials test expected two carousel regions.');
    }

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(activeQuoteText(firstCarousel)).toBe('First armor case quote.');
    expect(activeQuoteText(secondCarousel)).toBe('First armor case quote.');

    firstCarousel.focus();
    fireEvent.keyDown(firstCarousel, { key: 'ArrowRight' });

    await waitFor(() => expect(activeQuoteText(firstCarousel)).toBe('Second armor case quote.'));
    expect(activeQuoteText(secondCarousel)).toBe('First armor case quote.');
  });

  it('默认在五秒时自动切换并且每个实例使用自己的状态', async () => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(window, 'setInterval');
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

    try {
      const { container, unmount } = render(
        <>
          <CircularTestimonials
            testimonials={TESTIMONIALS.slice(0, 2)}
            ariaLabel="Autoplay carousel"
            previousLabel={PREVIOUS_LABEL}
            nextLabel={NEXT_LABEL}
          />
          <CircularTestimonials
            testimonials={TESTIMONIALS}
            ariaLabel="Paused carousel"
            previousLabel="上一案例"
            nextLabel="下一案例"
            autoplay={false}
          />
        </>,
      );
      const [autoplayCarousel, stoppedCarousel] = carouselRegions(container);
      if (!autoplayCarousel || !stoppedCarousel) {
        throw new Error('CircularTestimonials test expected two carousel regions.');
      }

      expect(setIntervalSpy).toHaveBeenCalledTimes(1);
      const autoplayIntervalId = setIntervalSpy.mock.results[0]?.value;
      expect(setIntervalSpy.mock.calls[0]?.[1]).toBe(5000);
      expect(activeQuoteText(autoplayCarousel)).toBe('First armor case quote.');
      expect(activeQuoteText(stoppedCarousel)).toBe('First armor case quote.');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(4999);
      });
      expect(activeQuoteText(autoplayCarousel)).toBe('First armor case quote.');
      expect(activeQuoteText(stoppedCarousel)).toBe('First armor case quote.');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(activeQuoteText(autoplayCarousel)).toBe('Second armor case quote.');
      expectImageLayerRole(autoplayCarousel, 0, 'previous');
      expect(activeQuoteText(stoppedCarousel)).toBe('First armor case quote.');

      unmount();
      expect(clearIntervalSpy).toHaveBeenCalledWith(autoplayIntervalId);
    } finally {
      cleanup();
      vi.clearAllTimers();
      setIntervalSpy.mockRestore();
      clearIntervalSpy.mockRestore();
      vi.useRealTimers();
    }
  });

  it('手动切换后停止自动播放', async () => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(window, 'setInterval');
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

    try {
      const { container } = render(
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="Autoplay carousel"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
        />,
      );
      const [carousel] = carouselRegions(container);
      if (!carousel) {
        throw new Error('CircularTestimonials test expected one carousel region.');
      }

      const autoplayIntervalId = setIntervalSpy.mock.results[0]?.value;
      if (autoplayIntervalId === undefined) {
        throw new Error('CircularTestimonials test expected an autoplay interval.');
      }

      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000);
      });
      expect(activeQuoteText(carousel)).toBe('Second armor case quote.');

      fireEvent.click(within(carousel).getByRole('button', { name: NEXT_LABEL }));
      expect(activeQuoteText(carousel)).toBe('Third armor case quote.');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000);
      });
      expect(activeQuoteText(carousel)).toBe('Third armor case quote.');
      expect(clearIntervalSpy).toHaveBeenCalledWith(autoplayIntervalId);
    } finally {
      cleanup();
      vi.clearAllTimers();
      setIntervalSpy.mockRestore();
      clearIntervalSpy.mockRestore();
      vi.useRealTimers();
    }
  });

  it('使用可选图片 alt，并让隐藏图片保持空 alt', async () => {
    const testimonialsWithAlt: readonly CircularTestimonial[] = [
      { ...TESTIMONIALS[0], alt: 'First character in ceremonial armor' },
      ...TESTIMONIALS.slice(1),
    ];
    const { container } = renderedCarousel(testimonialsWithAlt);
    const [carousel] = carouselRegions(container);
    if (!carousel) {
      throw new Error('CircularTestimonials test expected one carousel region.');
    }

    expect(within(carousel).getByRole('img', { name: 'First character in ceremonial armor' })).toBeTruthy();

    fireEvent.click(within(carousel).getByRole('button', { name: NEXT_LABEL }));
    await waitFor(() => expect(activeQuoteText(carousel)).toBe('Second armor case quote.'));

    expect(testimonialImageLayer(carousel, 0).querySelector('img')?.getAttribute('alt')).toBe('');
  });

  it('拒绝空的可选图片 alt 并报告收到的值', () => {
    expect(() =>
      renderedCarousel([
        {
          ...TESTIMONIALS[0],
          alt: '  ',
        },
      ]),
    ).toThrow('CircularTestimonials testimonials[0].alt must be a non-empty string. Received "  ".');
  });

  it('拒绝非布尔 clipImageStack 并报告收到的值', () => {
    expect(() =>
      render(
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="Invalid clipping carousel"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
          clipImageStack={'false' as never}
        />,
      ),
    ).toThrow('CircularTestimonials clipImageStack must be a boolean. Received "false".');
  });

  it('提供图片回调时拒绝缺少的操作标签', () => {
    expect(() =>
      render(
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="Missing image action label"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
          onImageClick={vi.fn()}
        />,
      ),
    ).toThrow('CircularTestimonials imageActionLabel must be a non-empty string. Received undefined.');
  });

  it('拒绝非函数图片回调并报告收到的值', () => {
    expect(() =>
      render(
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="Invalid image callback"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
          imageActionLabel="Open image"
          onImageClick={'open' as never}
        />,
      ),
    ).toThrow('CircularTestimonials onImageClick must be a function or undefined. Received "open".');
  });

  it('保留英文空格、对中文分词并支持中英混合文案自然换行', () => {
    const chineseQuote = '林地游侠适合森林旅行。';
    const englishQuote = 'A wrap  coat, panelled trousers.';
    const mixedChineseEnglishQuote =
      '泡袖上衣、围裙式长裙与简洁短靴，适合旅店经营者、酒馆联系人等日常 NPC。';
    const { container } = render(
      <>
        <CircularTestimonials
          testimonials={[{ ...TESTIMONIALS[0], quote: chineseQuote }]}
          ariaLabel="Chinese cases"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
        />
        <CircularTestimonials
          testimonials={[{ ...TESTIMONIALS[0], quote: englishQuote }]}
          ariaLabel="English cases"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
        />
        <CircularTestimonials
          testimonials={[{ ...TESTIMONIALS[0], quote: mixedChineseEnglishQuote }]}
          ariaLabel="Mixed Chinese and English cases"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
        />
      </>,
    );
    const [chineseCarousel, englishCarousel, mixedCarousel] = carouselRegions(container);
    if (!chineseCarousel || !englishCarousel || !mixedCarousel) {
      throw new Error('CircularTestimonials test expected three carousel regions.');
    }

    const chineseQuoteElement = chineseCarousel.querySelector<HTMLElement>('[data-part="testimonial-quote"]');
    const englishQuoteElement = englishCarousel.querySelector<HTMLElement>('[data-part="testimonial-quote"]');
    const mixedQuoteElement = mixedCarousel.querySelector<HTMLElement>('[data-part="testimonial-quote"]');
    const mixedQuoteSegments = Array.from(
      mixedQuoteElement?.querySelectorAll('span') ?? [],
      (segment) => segment.textContent ?? '',
    );
    expect(chineseQuoteElement?.textContent).toBe(chineseQuote);
    expect(chineseQuoteElement?.querySelectorAll('span').length).toBeGreaterThan(1);
    expect(englishQuoteElement?.textContent).toBe(englishQuote);
    expect(mixedQuoteElement?.textContent).toBe(mixedChineseEnglishQuote);
    expect(mixedQuoteSegments.length).toBeGreaterThan(1);
    expect(Math.max(...mixedQuoteSegments.map((segment) => segment.length))).toBeLessThan(20);
    expect(mixedQuoteSegments.some((segment) => segment.endsWith('、'))).toBe(true);
    expect(mixedQuoteSegments.some((segment) => segment.endsWith('。'))).toBe(true);
    expect(mixedQuoteSegments).not.toContain('、');
    expect(mixedQuoteSegments).not.toContain('。');
  });

  it('reduced motion 会关闭自动播放、模糊和长位移动画', () => {
    vi.useFakeTimers();
    reducedMotionState.enabled = true;
    const setIntervalSpy = vi.spyOn(window, 'setInterval');

    try {
      const { container } = renderedCarousel();
      const [carousel] = carouselRegions(container);
      if (!carousel) {
        throw new Error('CircularTestimonials test expected one carousel region.');
      }

      expect(setIntervalSpy.mock.calls.some(([, intervalMilliseconds]) => intervalMilliseconds === 5000)).toBe(false);
      expect(testimonialImageLayer(carousel, 0).style.transition).toBe('none');
      const quoteSpan = carousel.querySelector<HTMLElement>('[data-part="testimonial-quote"] span');
      expect(quoteSpan?.style.filter).toBe('none');
      expect(quoteSpan?.style.transform).toBe('none');
    } finally {
      cleanup();
      vi.clearAllTimers();
      setIntervalSpy.mockRestore();
      vi.useRealTimers();
    }
  });

  it('SSR hydration 使用服务端快照并在客户端应用 reduced motion', async () => {
    const setIntervalSpy = vi.spyOn(window, 'setInterval');
    const recoverableErrors: unknown[] = [];
    const container = document.createElement('div');
    container.innerHTML = renderToString(
      <CircularTestimonials
        testimonials={TESTIMONIALS}
        ariaLabel="Hydrated armor cases"
        previousLabel={PREVIOUS_LABEL}
        nextLabel={NEXT_LABEL}
      />,
    );
    document.body.append(container);
    changeReducedMotionPreference(true);

    const serverImageLayer = container.querySelector<HTMLElement>('[data-index="0"]');
    expect(serverImageLayer?.style.transition).toMatch(TESTIMONIAL_IMAGE_TRANSITION_STYLE);

    let hydratedRoot: ReturnType<typeof hydrateRoot> | null = null;
    try {
      hydratedRoot = await act(async () => {
        const root = hydrateRoot(
          container,
          <CircularTestimonials
            testimonials={TESTIMONIALS}
            ariaLabel="Hydrated armor cases"
            previousLabel={PREVIOUS_LABEL}
            nextLabel={NEXT_LABEL}
          />,
          { onRecoverableError: (error) => recoverableErrors.push(error) },
        );
        await Promise.resolve();
        return root;
      });

      await waitFor(() => {
        expect(container.querySelector<HTMLElement>('[data-index="0"]')?.style.transition).toBe('none');
        expect(container.querySelector<HTMLElement>('[data-part="testimonial-quote"] span')?.style.filter).toBe('none');
      });

      expect(setIntervalSpy.mock.calls.some(([, intervalMilliseconds]) => intervalMilliseconds === 5000)).toBe(false);
      expect(recoverableErrors).toEqual([]);
    } finally {
      const rootToUnmount = hydratedRoot;
      if (rootToUnmount !== null) {
        await act(async () => {
          rootToUnmount.unmount();
        });
      }
      container.remove();
      setIntervalSpy.mockRestore();
    }
  });

  it('非法测试项会指出字段和收到的值', () => {
    expect(() =>
      render(
        <CircularTestimonials
          testimonials={[
            {
              quote: '',
              name: 'First character',
              designation: 'Plate armor',
              src: '/armor-creator/cases/first.png',
            },
          ]}
          ariaLabel="Invalid test carousel"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
        />,
      ),
    ).toThrow(
      'CircularTestimonials testimonials[0].quote must be a non-empty string. Received "".',
    );
  });

  it('稀疏测试数组会指出缺失槽位的索引和值', () => {
    const sparseTestimonials = new Array<CircularTestimonial>(2);

    expect(() => renderedCarousel(sparseTestimonials)).toThrow(
      'CircularTestimonials testimonials[0] must be a non-array object. Received undefined.',
    );
  });

  it.each([
    ['colors', new Date('2026-10-01T00:00:00.000Z'), '[object Date]'],
    ['colors', new Map([['accent', '#00a6fb']]), '[object Map]'],
    ['colors', [], '[object Array]'],
    ['fontSizes', new Date('2026-10-01T00:00:00.000Z'), '[object Date]'],
    ['fontSizes', new Map([['quote', '1rem']]), '[object Map]'],
    ['fontSizes', [], '[object Array]'],
  ] as const)('%s rejects non-plain objects and reports the received value', (field, invalidValue, receivedValue) => {
    expect(() => renderedCarouselWithInvalidStyleOption(field, invalidValue)).toThrow(
      `CircularTestimonials ${field} must be a plain object or undefined. Received ${receivedValue}.`,
    );
  });

  it('接受普通对象颜色和字号配置', () => {
    const { container } = render(
      <CircularTestimonials
        testimonials={TESTIMONIALS}
        ariaLabel="Styled armor cases"
        previousLabel={PREVIOUS_LABEL}
        nextLabel={NEXT_LABEL}
        autoplay={false}
        colors={{ name: '#123456' }}
        fontSizes={{ quote: '1rem' }}
      />,
    );
    const testimonialName = container.querySelector<HTMLElement>('[data-part="testimonial-name"]');
    const testimonialQuote = container.querySelector<HTMLElement>('[data-part="testimonial-quote"]');

    expect(testimonialName?.style.color).not.toBe('');
    expect(testimonialQuote?.style.fontSize).toBe('1rem');
  });
});
