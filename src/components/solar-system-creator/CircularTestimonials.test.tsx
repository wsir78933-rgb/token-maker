// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import {
  CircularTestimonials,
  type CircularTestimonial,
} from '@/components/solar-system-creator/CircularTestimonials';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const reducedMotionState = { enabled: false };

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
  };
});

const TESTIMONIALS: readonly CircularTestimonial[] = [
  {
    quote: 'A calm beginning for a new planetary story.',
    name: 'New Home System',
    designation: 'Science-fiction novel authors',
    src: '/solar-system-creator/examples/new-home-system.png',
  },
  {
    quote: 'Blue worlds make the ocean civilization easy to read.',
    name: 'Ocean Civilization System',
    designation: 'Science-fiction novel authors',
    src: '/solar-system-creator/examples/ocean-civilization-system.png',
  },
  {
    quote: 'Sparse planets leave room for a long route between worlds.',
    name: 'Desert Trade System',
    designation: 'Science-fiction novel authors',
    src: '/solar-system-creator/examples/desert-trade-system.png',
  },
];

const PREVIOUS_LABEL = 'Previous example';
const NEXT_LABEL = 'Next example';

function installMatchMedia(): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((media: string) => ({
      matches: media === REDUCED_MOTION_QUERY && reducedMotionState.enabled,
      media,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

function carouselRegions(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('[data-circular-testimonials="true"]'));
}

function activeName(carousel: HTMLElement): string {
  return carousel.querySelector<HTMLElement>('[data-part="testimonial-name"]')?.textContent?.trim() ?? '';
}

function renderCarousel(
  testimonials: readonly CircularTestimonial[] = TESTIMONIALS,
  options: { autoplay?: boolean; imagePosition?: 'left' | 'right'; ariaLabel?: string } = {},
) {
  return render(
    <CircularTestimonials
      testimonials={testimonials}
      ariaLabel={options.ariaLabel ?? 'Solar system examples'}
      previousLabel={PREVIOUS_LABEL}
      nextLabel={NEXT_LABEL}
      autoplay={options.autoplay ?? false}
      imagePosition={options.imagePosition}
    />,
  );
}

describe('CircularTestimonials', () => {
  beforeEach(() => {
    reducedMotionState.enabled = false;
    installMatchMedia();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    reducedMotionState.enabled = false;
  });

  it('wraps previous and next navigation while keeping independent button labels', () => {
    const { container } = renderCarousel();
    const [carousel] = carouselRegions(container);
    if (!carousel) throw new Error('CircularTestimonials test expected one carousel region.');

    const controls = within(carousel);
    const previousButton = controls.getByRole('button', { name: PREVIOUS_LABEL });
    const nextButton = controls.getByRole('button', { name: NEXT_LABEL });

    expect(activeName(carousel)).toBe('New Home System');
    expect(previousButton.getAttribute('type')).toBe('button');
    expect(nextButton.getAttribute('type')).toBe('button');
    expect(previousButton.className).toContain('h-11');
    expect(previousButton.className).toContain('w-11');
    expect(previousButton.className).toContain('cursor-pointer');

    fireEvent.click(previousButton);
    expect(activeName(carousel)).toBe('Desert Trade System');
    fireEvent.click(nextButton);
    expect(activeName(carousel)).toBe('New Home System');
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    expect(activeName(carousel)).toBe('Desert Trade System');
  });

  it('keeps three carousel instances independent and scopes arrow keys to the focused instance', () => {
    const { container } = render(
      <>
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="First solar system examples"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
        />
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          ariaLabel="Second solar system examples"
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={false}
        />
      </>,
    );
    const [firstCarousel, secondCarousel] = carouselRegions(container);
    if (!firstCarousel || !secondCarousel) throw new Error('CircularTestimonials test expected two carousels.');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(activeName(firstCarousel)).toBe('New Home System');
    expect(activeName(secondCarousel)).toBe('New Home System');

    firstCarousel.focus();
    fireEvent.keyDown(firstCarousel, { key: 'ArrowRight' });
    expect(activeName(firstCarousel)).toBe('Ocean Civilization System');
    expect(activeName(secondCarousel)).toBe('New Home System');

    fireEvent.keyDown(secondCarousel, { key: 'ArrowRight' });
    expect(activeName(secondCarousel)).toBe('New Home System');
  });

  it('uses a 2:1 contained image frame and supports the right-hand image layout', () => {
    const { container } = renderCarousel(TESTIMONIALS, { imagePosition: 'right' });
    const [carousel] = carouselRegions(container);
    if (!carousel) throw new Error('CircularTestimonials test expected one carousel region.');

    const layout = carousel.querySelector<HTMLElement>('[data-part="layout"]');
    expect(layout?.className).toContain('flex-col-reverse');
    expect(layout?.className).toContain('md:flex-row-reverse');
    expect(carousel.querySelector('[data-part="image-stage"]')?.className).toContain('overflow-hidden');
    expect(carousel.querySelectorAll('[data-part="testimonial-image-frame"]')).toHaveLength(3);
    expect(carousel.querySelectorAll('[data-part="testimonial-image-frame"].aspect-\\[2\\/1\\]')).toHaveLength(3);
    expect(carousel.querySelector('[data-part="active-testimonial-image"]')?.className).toContain(
      'w-[min(78%,28rem)]',
    );

    const images = Array.from(carousel.querySelectorAll<HTMLImageElement>('img'));
    expect(images).toHaveLength(3);
    expect(images.every((image) => image.className.includes('object-contain'))).toBe(true);
    expect(images.some((image) => image.className.includes('object-cover'))).toBe(false);
    expect(carousel.querySelector('[data-part="testimonial-image-frame"]')?.className).toContain('bg-black');
    expect(carousel.querySelector('[data-part="testimonial-image-frame"]')?.className).toContain('rounded-3xl');
    expect(images.every((image) => !image.className.includes('p-3'))).toBe(true);
  });

  it('stops autoplay after an arrow click and skips autoplay for reduced motion', async () => {
    vi.useFakeTimers();
    const { container } = renderCarousel(TESTIMONIALS, { autoplay: true });
    const [carousel] = carouselRegions(container);
    if (!carousel) throw new Error('CircularTestimonials test expected one carousel region.');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(activeName(carousel)).toBe('Ocean Civilization System');

    fireEvent.click(within(carousel).getByRole('button', { name: NEXT_LABEL }));
    expect(activeName(carousel)).toBe('Desert Trade System');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(activeName(carousel)).toBe('Desert Trade System');

    cleanup();
    reducedMotionState.enabled = true;
    const reducedRender = renderCarousel(TESTIMONIALS, { autoplay: true });
    const [reducedCarousel] = carouselRegions(reducedRender.container);
    if (!reducedCarousel) throw new Error('CircularTestimonials test expected a reduced-motion carousel.');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });
    expect(activeName(reducedCarousel)).toBe('New Home System');
    expect(reducedCarousel.querySelector<HTMLElement>('[data-index="0"]')?.style.transition).toBe('none');
  });

  it('segments Chinese quotes and fails fast for invalid public values', () => {
    const chineseQuote = '太阳系创建器案例展示。';
    const { container } = renderCarousel([{ ...TESTIMONIALS[0], quote: chineseQuote }]);
    const [carousel] = carouselRegions(container);
    if (!carousel) throw new Error('CircularTestimonials test expected one carousel region.');

    const quote = carousel.querySelector<HTMLElement>('[data-part="testimonial-quote"]');
    expect(quote?.textContent).toBe(chineseQuote);
    expect(quote?.querySelectorAll('span').length).toBeGreaterThan(1);

    expect(() =>
      renderCarousel([], { autoplay: false }),
    ).toThrow('CircularTestimonials testimonials must be a non-empty array. Received [object Array].');

    expect(() =>
      render(
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          imagePosition={'center' as never}
          autoplay={false}
        />,
      ),
    ).toThrow('CircularTestimonials imagePosition must be "left" or "right". Received "center".');

    expect(() =>
      render(
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          previousLabel=" "
          nextLabel={NEXT_LABEL}
          autoplay={false}
        />,
      ),
    ).toThrow('CircularTestimonials previousLabel must be a non-empty string. Received " ".');

    expect(() =>
      render(
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          autoplay={1 as never}
        />,
      ),
    ).toThrow('CircularTestimonials autoplay must be a boolean. Received 1.');

    expect(() =>
      render(
        <CircularTestimonials
          testimonials={TESTIMONIALS}
          previousLabel={PREVIOUS_LABEL}
          nextLabel={NEXT_LABEL}
          colors={new Date('2026-10-06') as never}
        />,
      ),
    ).toThrow('CircularTestimonials colors must be a plain object. Received [object Date].');
  });
});
