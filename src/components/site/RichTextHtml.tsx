'use client';

import { startTransition, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

interface RichTextHtmlProps {
  as?: 'article' | 'div' | 'section';
  className?: string;
  html: string;
}

export function RichTextHtml({
  as = 'div',
  className,
  html,
}: RichTextHtmlProps) {
  const router = useRouter();
  const Component = as;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const launchButton = target.closest<HTMLElement>('[data-editor-launch]');
    const href = launchButton?.getAttribute('data-editor-launch');

    if (!href) {
      return;
    }

    event.preventDefault();

    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Component
      className={className}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
