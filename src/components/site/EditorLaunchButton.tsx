'use client';

import { startTransition, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { trackBlogToEditorClick, trackStartEditor } from '@/lib/analytics';

interface EditorLaunchButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  href: string;
}

export function EditorLaunchButton({
  href,
  onClick,
  ...props
}: EditorLaunchButtonProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (href.includes('#editor-workspace')) {
      trackStartEditor('editor_launch_button');

      if (
        window.location.pathname === '/blog' ||
        window.location.pathname.endsWith('/blog') ||
        window.location.pathname.includes('/blog/')
      ) {
        trackBlogToEditorClick(href);
      }
    }

    startTransition(() => {
      router.push(href);
    });
  };

  return <button type="button" onClick={handleClick} {...props} />;
}
