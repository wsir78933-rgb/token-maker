// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LiteYouTubeEmbed } from './LiteYouTubeEmbed';
import { RichTextHtml } from './RichTextHtml';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('site video fallback copy', () => {
  afterEach(() => {
    cleanup();
  });

  it('uses injected YouTube fallback copy in the lite embed iframe state', () => {
    const videoProps = {
      videoId: 'hjE_N0wTHOc',
      title: '方形 Token 视频',
      thumbnailAlt: '视频封面',
      playLabel: '加载视频',
      youtubeFallbackLabel: '在 YouTube 打开',
    };

    render(<LiteYouTubeEmbed {...videoProps} />);

    fireEvent.click(screen.getByRole('button', { name: '加载视频: 方形 Token 视频' }));

    expect(screen.getByRole('link', { name: '在 YouTube 打开' }).getAttribute('href')).toBe(
      'https://www.youtube.com/watch?v=hjE_N0wTHOc',
    );
    expect(screen.queryByText('Open on YouTube / 在 YouTube 打开')).toBeNull();
  });

  it('uses locale fallback props and HTML data attributes for rich text videos', () => {
    const richTextProps = {
      html: '<div class="lite-video" data-video-id="IPOddAMdy5k" data-youtube-fallback-label="从 HTML 打开视频" role="button" tabindex="0">加载</div>',
      videoFallbackTitle: '视频',
      youtubeFallbackLabel: '在 YouTube 打开',
    };

    const { container } = render(<RichTextHtml {...richTextProps} />);

    fireEvent.click(screen.getByRole('button', { name: '加载' }));

    expect(container.querySelector('iframe')?.getAttribute('title')).toBe('视频');
    expect(screen.getByRole('link', { name: '从 HTML 打开视频' }).getAttribute('href')).toBe(
      'https://www.youtube.com/watch?v=IPOddAMdy5k',
    );
    expect(screen.queryByText('Open on YouTube / 在 YouTube 打开')).toBeNull();
  });
});
