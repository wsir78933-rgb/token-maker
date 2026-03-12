import { cn } from '@/lib/utils';

interface SiteMarkProps {
  className?: string;
}

export function SiteMark({ className }: SiteMarkProps) {
  return (
    <img
      src="/icon.svg?v=20260312b"
      alt=""
      aria-hidden="true"
      className={cn('h-9 w-9 shrink-0 rounded-xl', className)}
    />
  );
}
