// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/tool-recommendations', async () => {
  const actual = await vi.importActual<typeof import('@/lib/tool-recommendations')>(
    '@/lib/tool-recommendations',
  );

  return {
    ...actual,
    getToolRecommendationSet: vi.fn(actual.getToolRecommendationSet),
  };
});

import { getToolRecommendationSet } from '@/lib/tool-recommendations';

import { ToolRecommendationSection } from './ToolRecommendationSection';

beforeEach(async () => {
  const actual = await vi.importActual<typeof import('@/lib/tool-recommendations')>(
    '@/lib/tool-recommendations',
  );
  vi.mocked(getToolRecommendationSet).mockImplementation(actual.getToolRecommendationSet);
});

afterEach(() => {
  cleanup();
  vi.mocked(getToolRecommendationSet).mockReset();
});

describe('ToolRecommendationSection', () => {
  it('renders four English recommendations for the emblem creator, including the language generator text preview', () => {
    render(<ToolRecommendationSection locale="en" currentPath="/emblem-creator" />);

    expect(screen.getByRole('heading', { level: 2, name: 'More tools you may like' })).toBeTruthy();
    expect(screen.getByText('Four other tools that pair with Emblem Creator.')).toBeTruthy();

    const recommendationLinks = screen.getAllByRole('link');
    expect(recommendationLinks).toHaveLength(4);

    for (const recommendationLink of recommendationLinks) {
      expect(recommendationLink.getAttribute('href')).not.toBe('/emblem-creator');
    }

    const languageGeneratorLink = screen.getByRole('link', { name: /Fantasy Language Generator/ });
    expect(languageGeneratorLink.getAttribute('href')).toBe('/language-generator');
    expect(languageGeneratorLink.querySelector('img')).toBeNull();
    expect(screen.getByText('English source word / sentence')).toBeTruthy();
    expect(screen.getByText('the gate opens at dawn')).toBeTruthy();
    expect(screen.getByText('Generated spelling')).toBeTruthy();
    expect(screen.getByText('klo sako avort ak bavr')).toBeTruthy();
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'Finished fantasy calendar created with the calendar tool' }).className).toContain(
      'object-cover',
    );
    expect(screen.getByRole('img', { name: 'Royal family tree showing lines of succession' }).className).toContain(
      'object-contain',
    );
  });

  it('renders the Chinese heading and Chinese tool names for the emblem creator', () => {
    render(<ToolRecommendationSection locale="zh" currentPath="/zh/emblem-creator" />);

    expect(screen.getByRole('heading', { level: 2, name: '你可能还会用到这些工具' })).toBeTruthy();
    expect(screen.getByText('这四个工具可以和势力徽章制作器一起用。')).toBeTruthy();

    const toolNames = ['奇幻语言生成器', '奇幻日历生成器', '奇幻家谱制作器', '星座地图制作器'];

    for (const toolName of toolNames) {
      expect(screen.getByRole('heading', { level: 3, name: toolName })).toBeTruthy();
    }

    const recommendationLinks = screen.getAllByRole('link');
    expect(recommendationLinks).toHaveLength(4);
    expect(screen.getByRole('link', { name: /奇幻语言生成器/ }).getAttribute('href')).toBe(
      '/zh/language-generator',
    );
  });

  it('throws when the current path is the site root', () => {
    expect(() => render(<ToolRecommendationSection locale="en" currentPath="/" />)).toThrow(
      'The homepage must not request tool recommendations. Received "/".',
    );
  });

  it('throws when the recommendation set does not contain 4 tools', () => {
    const recommendationSet = getToolRecommendationSet('en', '/emblem-creator');
    vi.mocked(getToolRecommendationSet).mockImplementation(() => ({
      currentToolName: recommendationSet.currentToolName,
      recommendedTools: recommendationSet.recommendedTools.slice(0, 3),
    }));

    expect(() => render(<ToolRecommendationSection locale="en" currentPath="/emblem-creator" />)).toThrow(
      'Received length 3',
    );
  });
});
