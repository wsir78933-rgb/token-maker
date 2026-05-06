'use client';

import Link from 'next/link';
import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { trackBlogToEditorClick, trackStartEditor } from '@/lib/analytics';

interface TrackedEditorLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  prefetch?: boolean;
}

function isBlogPath(pathname: string) {
  return pathname === '/blog' || pathname.endsWith('/blog') || pathname.includes('/blog/');
}

export function TrackedEditorLink({
  href,
  onClick,
  ...props
}: TrackedEditorLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || !href.includes('#editor-workspace')) {
      return;
    }

    trackStartEditor('editor_link');

    if (isBlogPath(window.location.pathname)) {
      trackBlogToEditorClick(href);
    }
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
