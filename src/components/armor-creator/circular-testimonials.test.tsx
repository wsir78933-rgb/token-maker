// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import {
  CircularTestimonials,
  type CircularTestimonial,
} from '@/components/armor-creator/circular-testimonials';

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

function activeQuoteText(carousel: HTMLElement): string | null {
  return carousel.querySelector<HTMLElement>('[data-part="testimonial-quote"]')?.textContent?.trim() ?? null;
}

describe('CircularTestimonials', () => {
  afterEach(() => {
    cleanup();
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
            testimonials={TESTIMONIALS}
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
