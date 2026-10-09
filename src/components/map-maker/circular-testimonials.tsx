'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export type CircularTestimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  alt?: string;
};

export type CircularTestimonialsColors = {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
};

export type CircularTestimonialsFontSizes = {
  name?: string;
  designation?: string;
  quote?: string;
};

export type CircularTestimonialsProps = {
  testimonials: readonly CircularTestimonial[];
  previousLabel: string;
  nextLabel: string;
  autoplay?: boolean;
  colors?: CircularTestimonialsColors;
  fontSizes?: CircularTestimonialsFontSizes;
  ariaLabel?: string;
  imagePosition?: 'left' | 'right';
  imageAspectRatio?: number;
  onImageClick?: (testimonial: CircularTestimonial, imageTrigger: HTMLButtonElement) => void;
  imageActionLabel?: string;
};

const DEFAULT_NAME_COLOR = '#000';
const DEFAULT_DESIGNATION_COLOR = '#6b7280';
const DEFAULT_TESTIMONY_COLOR = '#4b5563';
const DEFAULT_ARROW_BACKGROUND = '#141414';
const DEFAULT_ARROW_FOREGROUND = '#f1f1f7';
const DEFAULT_ARROW_HOVER_BACKGROUND = '#00a6fb';
const DEFAULT_NAME_FONT_SIZE = '1.5rem';
const DEFAULT_DESIGNATION_FONT_SIZE = '0.925rem';
const DEFAULT_QUOTE_FONT_SIZE = '1.125rem';
const AUTOPLAY_INTERVAL_MS = 5000;

function describeCircularTestimonialsValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === null || value === undefined) {
    return String(value);
  }

  if (typeof value === 'object') {
    return JSON.stringify(value) ?? String(value);
  }

  return String(value);
}

function requireNonEmptyString(value: unknown, fieldPath: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      `CircularTestimonials: ${fieldPath} must be a non-empty string, received ${describeCircularTestimonialsValue(value)}.`,
    );
  }

  return value;
}

function validateTestimonialItem(item: unknown, testimonialIndex: number): void {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new Error(
      `CircularTestimonials: testimonials[${testimonialIndex}] must be an item object, received ${describeCircularTestimonialsValue(item)}.`,
    );
  }

  const testimonial = item as CircularTestimonial;
  requireNonEmptyString(testimonial.quote, `testimonials[${testimonialIndex}].quote`);
  requireNonEmptyString(testimonial.name, `testimonials[${testimonialIndex}].name`);
  requireNonEmptyString(testimonial.designation, `testimonials[${testimonialIndex}].designation`);
  requireNonEmptyString(testimonial.src, `testimonials[${testimonialIndex}].src`);

  if (testimonial.alt !== undefined) {
    requireNonEmptyString(testimonial.alt, `testimonials[${testimonialIndex}].alt`);
  }
}

function validateOptionalStyleValues(value: unknown, fieldPath: string): void {
  if (value === undefined) {
    return;
  }

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(
      `CircularTestimonials: ${fieldPath} must be an object, received ${describeCircularTestimonialsValue(value)}.`,
    );
  }

  for (const [styleName, styleValue] of Object.entries(value)) {
    if (styleValue !== undefined) {
      requireNonEmptyString(styleValue, `${fieldPath}.${styleName}`);
    }
  }
}

function assertCircularTestimonialsInput(props: CircularTestimonialsProps): void {
  const { testimonials, previousLabel, nextLabel } = props;

  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    throw new Error(
      `CircularTestimonials: testimonials must be a non-empty array, received ${describeCircularTestimonialsValue(testimonials)}.`,
    );
  }

  requireNonEmptyString(previousLabel, 'previousLabel');
  requireNonEmptyString(nextLabel, 'nextLabel');
  testimonials.forEach((testimonial, index) => validateTestimonialItem(testimonial, index));
  validateOptionalStyleValues(props.colors, 'colors');
  validateOptionalStyleValues(props.fontSizes, 'fontSizes');

  if (props.ariaLabel !== undefined) {
    requireNonEmptyString(props.ariaLabel, 'ariaLabel');
  }

  if (props.imagePosition !== undefined && props.imagePosition !== 'left' && props.imagePosition !== 'right') {
    throw new Error(
      `CircularTestimonials: imagePosition must be "left" or "right", received ${describeCircularTestimonialsValue(props.imagePosition)}.`,
    );
  }

  if (
    props.imageAspectRatio !== undefined &&
    (typeof props.imageAspectRatio !== 'number' || !Number.isFinite(props.imageAspectRatio) || props.imageAspectRatio <= 0)
  ) {
    throw new Error(
      `CircularTestimonials: imageAspectRatio must be a positive finite number, received ${describeCircularTestimonialsValue(props.imageAspectRatio)}.`,
    );
  }

  if (props.autoplay !== undefined && typeof props.autoplay !== 'boolean') {
    throw new Error(
      `CircularTestimonials: autoplay must be a boolean, received ${describeCircularTestimonialsValue(props.autoplay)}.`,
    );
  }

  if (props.onImageClick !== undefined && typeof props.onImageClick !== 'function') {
    throw new Error(
      `CircularTestimonials: onImageClick must be a function, received ${describeCircularTestimonialsValue(props.onImageClick)}.`,
    );
  }

  if (props.imageActionLabel !== undefined) {
    requireNonEmptyString(props.imageActionLabel, 'imageActionLabel');

    if (props.onImageClick === undefined) {
      throw new Error(
        `CircularTestimonials: imageActionLabel requires onImageClick, received ${describeCircularTestimonialsValue(props.onImageClick)}.`,
      );
    }
  }
}

function calculateGap(width: number): number {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;

  if (width <= minWidth) {
    return minGap;
  }
  if (width >= maxWidth) {
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  }

  return minGap + ((maxGap - minGap) * (width - minWidth)) / (maxWidth - minWidth);
}

function getCircularImageStyle({
  index,
  activeIndex,
  testimonialsLength,
  containerWidth,
}: {
  index: number;
  activeIndex: number;
  testimonialsLength: number;
  containerWidth: number;
}): CSSProperties {
  const gap = calculateGap(containerWidth);
  const maxStickUp = gap * 0.8;
  const isActive = index === activeIndex;
  const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
  const isRight = (activeIndex + 1) % testimonialsLength === index;

  if (isActive) {
    return {
      zIndex: 3,
      opacity: 1,
      pointerEvents: 'auto',
      transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)',
      transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
    };
  }
  if (isLeft) {
    return {
      zIndex: 2,
      opacity: 1,
      pointerEvents: 'auto',
      transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
      transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
    };
  }
  if (isRight) {
    return {
      zIndex: 2,
      opacity: 1,
      pointerEvents: 'auto',
      transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
      transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
    };
  }

  return {
    zIndex: 1,
    opacity: 0,
    pointerEvents: 'none',
    transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
  };
}

const quoteVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
  previousLabel,
  nextLabel,
  ariaLabel = 'Circular testimonials',
  imagePosition = 'left',
  imageAspectRatio,
  onImageClick,
  imageActionLabel,
}: CircularTestimonialsProps) {
  assertCircularTestimonialsInput({
    testimonials,
    autoplay,
    colors,
    fontSizes,
    previousLabel,
    nextLabel,
    ariaLabel,
    imagePosition,
    imageAspectRatio,
    onImageClick,
    imageActionLabel,
  });

  const colorName = colors.name ?? DEFAULT_NAME_COLOR;
  const colorDesignation = colors.designation ?? DEFAULT_DESIGNATION_COLOR;
  const colorTestimony = colors.testimony ?? DEFAULT_TESTIMONY_COLOR;
  const colorArrowBackground = colors.arrowBackground ?? DEFAULT_ARROW_BACKGROUND;
  const colorArrowForeground = colors.arrowForeground ?? DEFAULT_ARROW_FOREGROUND;
  const colorArrowHoverBackground = colors.arrowHoverBackground ?? DEFAULT_ARROW_HOVER_BACKGROUND;
  const fontSizeName = fontSizes.name ?? DEFAULT_NAME_FONT_SIZE;
  const fontSizeDesignation = fontSizes.designation ?? DEFAULT_DESIGNATION_FONT_SIZE;
  const fontSizeQuote = fontSizes.quote ?? DEFAULT_QUOTE_FONT_SIZE;

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveringPrevious, setHoveringPrevious] = useState(false);
  const [hoveringNext, setHoveringNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const testimonialsLength = testimonials.length;
  const currentActiveIndex = activeIndex % testimonialsLength;
  const activeTestimonial = testimonials[currentActiveIndex];

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % testimonialsLength);
    stopAutoplay();
  }, [stopAutoplay, testimonialsLength]);

  const handlePrevious = useCallback(() => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + testimonialsLength) % testimonialsLength);
    stopAutoplay();
  }, [stopAutoplay, testimonialsLength]);

  useEffect(() => {
    function updateContainerWidth(): void {
      const imageContainer = imageContainerRef.current;

      if (imageContainer) {
        setContainerWidth(imageContainer.offsetWidth);
      }
    }

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  useEffect(() => {
    if (!autoplay || testimonialsLength < 2) {
      return undefined;
    }

    autoplayIntervalRef.current = setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % testimonialsLength);
    }, AUTOPLAY_INTERVAL_MS);

    return stopAutoplay;
  }, [autoplay, stopAutoplay, testimonialsLength]);

  useEffect(() => () => stopAutoplay(), [stopAutoplay]);

  function handleCarouselKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrevious();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    }
  }

  if (!activeTestimonial) {
    throw new Error(
      `CircularTestimonials: no testimonial at activeIndex=${currentActiveIndex} (length=${testimonialsLength}).`,
    );
  }

  const imageOrderClassName = imagePosition === 'right' ? 'md:order-2' : 'md:order-1';
  const copyOrderClassName = imagePosition === 'right' ? 'md:order-1' : 'md:order-2';
  const imageStageClassName =
    imageAspectRatio === undefined ? 'relative h-96 w-full' : 'relative w-full';

  return (
    <section
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className="relative w-full max-w-4xl p-8 text-stone-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00a6fb]"
      data-circular-testimonials="true"
      onKeyDown={handleCarouselKeyDown}
      tabIndex={0}
    >
      <div className="grid gap-20 md:grid-cols-2" data-part="layout">
        <div
          ref={imageContainerRef}
          className={`${imageStageClassName} ${imageOrderClassName}`}
          data-part="image-stage"
          style={{
            perspective: '1000px',
            ...(imageAspectRatio === undefined ? {} : { aspectRatio: imageAspectRatio }),
          }}
        >
          {testimonials.map((testimonial, index) => {
            const isActiveImage = index === currentActiveIndex;
            const isLeftPreview = (currentActiveIndex - 1 + testimonialsLength) % testimonialsLength === index;
            const isRightPreview = (currentActiveIndex + 1) % testimonialsLength === index;
            const isVisibleImage = isActiveImage || isLeftPreview || isRightPreview;
            const imageStyle = getCircularImageStyle({
              index,
              activeIndex: currentActiveIndex,
              testimonialsLength,
              containerWidth,
            });

            if (prefersReducedMotion) {
              imageStyle.transition = 'none';
            }

            const imageElement = (
              <img
                src={testimonial.src}
                alt={isVisibleImage ? testimonial.alt ?? testimonial.name : ''}
                className="absolute inset-0 h-full w-full rounded-3xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                data-index={index}
                style={{
                  objectFit: imageAspectRatio === undefined ? 'cover' : 'contain',
                }}
              />
            );

            return (
              <div
                key={`${testimonial.src}-${index}`}
                aria-hidden={!isVisibleImage}
                className="absolute inset-0"
                data-index={index}
                data-part={isActiveImage ? 'active-testimonial-image' : 'testimonial-image-layer'}
                style={imageStyle}
              >
                {onImageClick ? (
                  <button
                    aria-label={
                      imageActionLabel
                        ? `${imageActionLabel}: ${testimonial.name}`
                        : testimonial.alt ?? testimonial.name
                    }
                    aria-hidden={!isVisibleImage}
                    className="absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00a6fb]"
                    onClick={(event) => onImageClick(testimonial, event.currentTarget)}
                    tabIndex={isVisibleImage ? 0 : -1}
                    type="button"
                  >
                    {imageElement}
                  </button>
                ) : (
                  imageElement
                )}
              </div>
            );
          })}
        </div>
        <div
          className={`flex flex-col justify-between ${copyOrderClassName}`}
          data-part="testimonial-copy"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActiveIndex}
              variants={quoteVariants}
              initial={prefersReducedMotion ? false : 'initial'}
              animate="animate"
              exit="exit"
              transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: 'easeInOut' }}
              data-part="active-testimonial"
            >
              <h3
                className="mb-1 font-bold text-black dark:text-white"
                data-part="testimonial-name"
                style={{
                  ...(colors.name ? { color: colorName } : {}),
                  fontSize: fontSizeName,
                }}
              >
                {activeTestimonial.name}
              </h3>
              <p
                className="mb-8 text-gray-500 dark:text-neutral-400"
                style={{
                  ...(colors.designation ? { color: colorDesignation } : {}),
                  fontSize: fontSizeDesignation,
                }}
              >
                {activeTestimonial.designation}
              </p>
              <motion.p
                className="leading-7 text-gray-600 dark:text-neutral-300"
                style={{
                  ...(colors.testimony ? { color: colorTestimony } : {}),
                  fontSize: fontSizeQuote,
                }}
              >
                {activeTestimonial.quote.split(' ').map((word, wordIndex) => (
                  <motion.span
                    key={`${currentActiveIndex}-${wordIndex}`}
                    initial={
                      prefersReducedMotion
                        ? false
                        : {
                            filter: 'blur(10px)',
                            opacity: 0,
                            y: 5,
                          }
                    }
                    animate={{
                      filter: 'blur(0px)',
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.22,
                      ease: 'easeInOut',
                      delay: prefersReducedMotion ? 0 : 0.025 * wordIndex,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-6 pt-12 md:pt-0">
            <button
              type="button"
              className="flex h-[2.7rem] w-[2.7rem] cursor-pointer items-center justify-center rounded-full border-0 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a6fb]"
              onClick={handlePrevious}
              style={{
                backgroundColor: hoveringPrevious ? colorArrowHoverBackground : colorArrowBackground,
              }}
              onMouseEnter={() => setHoveringPrevious(true)}
              onMouseLeave={() => setHoveringPrevious(false)}
              aria-label={previousLabel}
            >
              <IconArrowLeft size={28} color={colorArrowForeground} />
            </button>
            <button
              type="button"
              className="flex h-[2.7rem] w-[2.7rem] cursor-pointer items-center justify-center rounded-full border-0 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a6fb]"
              onClick={handleNext}
              style={{
                backgroundColor: hoveringNext ? colorArrowHoverBackground : colorArrowBackground,
              }}
              onMouseEnter={() => setHoveringNext(true)}
              onMouseLeave={() => setHoveringNext(false)}
              aria-label={nextLabel}
            >
              <IconArrowRight size={28} color={colorArrowForeground} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CircularTestimonials;
