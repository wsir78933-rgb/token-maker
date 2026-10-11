import { getBlogCoverDimensions } from './cover-dimensions';

const BLOG_COVER_PATH_PREFIX = '/blog/covers/';
const BLOG_INLINE_COVER_PATH = '/blog/inline/dnd-warlock-spells/eldritch-blast.webp';
const RESPONSIVE_COVER_PATH_PREFIX = '/blog/covers/responsive/';
const RESPONSIVE_COVER_WIDTHS = [640, 960, 1280, 1920] as const;
const FALLBACK_COVER_MAX_WIDTH = 1280;

export interface BlogCoverImageSources {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

function getResponsiveCoverPath(coverImage: string, width: number): string {
  const relativePath = coverImage.startsWith(BLOG_COVER_PATH_PREFIX)
    ? coverImage.slice(BLOG_COVER_PATH_PREFIX.length)
    : coverImage.slice('/blog/'.length);
  const extension = '.webp';

  return `${RESPONSIVE_COVER_PATH_PREFIX}${relativePath.slice(0, -extension.length)}-${width}w${extension}`;
}

export function getBlogCoverImageSources(coverImage: string): BlogCoverImageSources {
  if (
    (!coverImage.startsWith(BLOG_COVER_PATH_PREFIX) && coverImage !== BLOG_INLINE_COVER_PATH) ||
    !coverImage.endsWith('.webp')
  ) {
    throw new Error(
      `Blog cover source must be a .webp file under ${BLOG_COVER_PATH_PREFIX} or equal ${BLOG_INLINE_COVER_PATH}; received ${JSON.stringify(coverImage)}.`,
    );
  }

  const dimensions = getBlogCoverDimensions(coverImage);
  const candidates = [
    ...RESPONSIVE_COVER_WIDTHS.filter((width) => width < dimensions.width).map((width) => ({
      src: getResponsiveCoverPath(coverImage, width),
      width,
    })),
    { src: coverImage, width: dimensions.width },
  ];
  const fallbackSource = [...candidates]
    .reverse()
    .find((candidate) => candidate.width <= FALLBACK_COVER_MAX_WIDTH);

  if (!fallbackSource) {
    throw new Error(
      `Blog cover source has no responsive fallback at or below ${FALLBACK_COVER_MAX_WIDTH}px: ${JSON.stringify(coverImage)} (${dimensions.width}px).`,
    );
  }

  return {
    src: fallbackSource.src,
    srcSet: candidates.map((candidate) => `${candidate.src} ${candidate.width}w`).join(', '),
    width: dimensions.width,
    height: dimensions.height,
  };
}
