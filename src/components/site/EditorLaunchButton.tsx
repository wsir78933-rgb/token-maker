'use client';

import { startTransition, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

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

    startTransition(() => {
      router.push(href);
    });
  };

  return <button type="button" onClick={handleClick} {...props} />;
}
