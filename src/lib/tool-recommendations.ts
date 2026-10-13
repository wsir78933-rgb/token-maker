import { stripLocalePrefix, type SiteLocale } from '@/lib/site-locale';
import {
  getToolDirectoryItems,
  getToolDirectoryLinks,
  type ToolDirectoryItem,
  type ToolDirectoryLink,
} from '@/lib/tool-directory';

const recommendedToolCount = 4;

export type ToolRecommendationSet = {
  currentToolName: string;
  recommendedTools: readonly ToolDirectoryItem[];
};

export function getToolRecommendationSet(
  locale: SiteLocale,
  currentPath: string,
): ToolRecommendationSet {
  const normalizedPath = normalizeToolRecommendationPath(currentPath);
  const directoryLinks = getToolDirectoryLinks(locale);
  const currentIndex = findCurrentToolLinkIndex(directoryLinks, normalizedPath, currentPath);

  return {
    currentToolName: directoryLinks[currentIndex].name,
    recommendedTools: selectRecommendedToolItems(
      directoryLinks,
      getToolDirectoryItems(locale),
      currentIndex,
    ),
  };
}

function normalizeToolRecommendationPath(currentPath: string): string {
  const hashStart = currentPath.indexOf('#');
  const pathWithoutHash = hashStart === -1 ? currentPath : currentPath.slice(0, hashStart);
  const queryStart = pathWithoutHash.indexOf('?');
  const pathWithoutQuery = queryStart === -1 ? pathWithoutHash : pathWithoutHash.slice(0, queryStart);

  return stripLocalePrefix(pathWithoutQuery);
}

function findCurrentToolLinkIndex(
  directoryLinks: readonly ToolDirectoryLink[],
  normalizedPath: string,
  currentPath: string,
): number {
  if (normalizedPath === '/') {
    throw new Error(
      `The homepage must not request tool recommendations. Received ${JSON.stringify(currentPath)}.`,
    );
  }

  const currentIndex = directoryLinks.findIndex((directoryLink) => directoryLink.path === normalizedPath);

  if (currentIndex === -1) {
    throw new Error(
      `No directory tool has path ${JSON.stringify(normalizedPath)}.`,
    );
  }

  return currentIndex;
}

function selectRecommendedToolItems(
  directoryLinks: readonly ToolDirectoryLink[],
  directoryItems: readonly ToolDirectoryItem[],
  currentIndex: number,
): readonly ToolDirectoryItem[] {
  const minimumCatalogLength = recommendedToolCount + 1;

  if (directoryLinks.length < minimumCatalogLength) {
    throw new Error(
      `Tool recommendations require at least ${minimumCatalogLength} directory tools. Catalog length is ${directoryLinks.length}.`,
    );
  }

  const recommendedTools: ToolDirectoryItem[] = [];

  for (let offset = 1; offset <= recommendedToolCount; offset += 1) {
    const followingIndex = (currentIndex + offset) % directoryLinks.length;
    const followingLink = directoryLinks[followingIndex];

    if (!followingLink) {
      throw new Error(
        `Tool directory link at index ${followingIndex} is missing. Catalog length is ${directoryLinks.length}.`,
      );
    }

    const recommendedTool = directoryItems.find((directoryItem) => directoryItem.id === followingLink.id);

    if (!recommendedTool) {
      throw new Error(
        `Tool directory item is missing for id ${JSON.stringify(followingLink.id)}.`,
      );
    }

    recommendedTools.push(recommendedTool);
  }

  return recommendedTools;
}
