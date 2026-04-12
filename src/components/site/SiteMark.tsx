import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SiteMarkProps {
  className?: string;
}

export function SiteMark({ className }: SiteMarkProps) {
  return (
    <Image
      src="/icon.svg?v=20260312b"
      alt="Token Maker logo"
      width={36}
      height={36}
      aria-hidden="true"
      className={cn('h-9 w-9 shrink-0 rounded-xl', className)}
    />
  );
}
