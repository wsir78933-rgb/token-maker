'use client';

import { startTransition, type MouseEvent, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { trackBlogToEditorClick, trackStartEditor } from '@/lib/analytics';

interface RichTextHtmlProps {
  as?: 'article' | 'div' | 'section';
  className?: string;
  html: string;
  videoFallbackTitle: string;
  youtubeFallbackLabel: string;
}

interface RichTextVideoCopy {
  videoFallbackTitle: string;
  youtubeFallbackLabel: string;
}

function activateLiteVideo(container: HTMLElement, videoCopy: RichTextVideoCopy) {
  const videoId = container.dataset.videoId;

  if (!videoId) return;

  const title = container.dataset.videoTitle ?? videoCopy.videoFallbackTitle;
  const fallbackLabel = container.dataset.youtubeFallbackLabel ?? videoCopy.youtubeFallbackLabel;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const wrapper = document.createElement('div');
  wrapper.className = 'inline-embed inline-embed--video video-embed-shell';

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
  iframe.title = title;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.allowFullscreen = true;

  const fallback = document.createElement('a');
  fallback.href = videoUrl;
  fallback.target = '_blank';
  fallback.rel = 'noreferrer noopener';
  fallback.className = 'video-embed-shell__fallback';
  fallback.textContent = fallbackLabel;

  wrapper.append(iframe, fallback);
  container.replaceWith(wrapper);
}

function isModifiedClick(event: MouseEvent<HTMLElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function RichTextHtml({
  as = 'div',
  className,
  html,
  videoFallbackTitle,
  youtubeFallbackLabel,
}: RichTextHtmlProps) {
  const router = useRouter();
  const Component = as;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    // Lite video embed activation
    const liteVideo = target.closest<HTMLElement>('.lite-video');
    if (liteVideo) {
      event.preventDefault();
      activateLiteVideo(liteVideo, { videoFallbackTitle, youtubeFallbackLabel });
      return;
    }

    const launchButton = target.closest<HTMLElement>('[data-editor-launch]');
    const editorLink = target.closest<HTMLAnchorElement>('a[href*="#editor-workspace"]');
    const href = launchButton?.getAttribute('data-editor-launch') ?? editorLink?.getAttribute('href');

    if (!href || !href.includes('#editor-workspace')) {
      return;
    }

    trackStartEditor('rich_text_editor_link');
    trackBlogToEditorClick(href);

    if (editorLink && isModifiedClick(event)) {
      return;
    }

    event.preventDefault();

    startTransition(() => {
      router.push(href);
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const liteVideo = target.closest<HTMLElement>('.lite-video');
    if (liteVideo) {
      event.preventDefault();
      activateLiteVideo(liteVideo, { videoFallbackTitle, youtubeFallbackLabel });
    }
  };

  return (
    <Component
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
