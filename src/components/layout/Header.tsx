'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Undo2, Redo2 } from 'lucide-react';
import { useHistoryStore } from '@/lib/store/history';
import { useEditorStore } from '@/lib/store/editor-store';
import { Button } from '@/components/ui/button';
import { SiteMark } from '@/components/site/SiteMark';
import { getNavLabels } from '@/lib/site-content';
import { getLocalizedPath, switchLocalePath } from '@/lib/site-locale';
import { cn } from '@/lib/utils';

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();

  return (
    target.isContentEditable ||
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select'
  );
}

export function Header() {
  const { locale, t } = useI18n();
  const history = useHistoryStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navLabels = getNavLabels(locale);
  const homeHref = getLocalizedPath(locale, '/');
  const links = [
    { href: homeHref, label: navLabels.editor },
    { href: getLocalizedPath(locale, '/templates'), label: navLabels.templates },
    { href: getLocalizedPath(locale, '/guides'), label: navLabels.guides },
    { href: getLocalizedPath(locale, '/faq'), label: navLabels.faq },
    { href: getLocalizedPath(locale, '/privacy'), label: navLabels.privacy },
  ];
  const nextLocale = locale === 'zh' ? 'en' : 'zh';
  const switchedPath = switchLocalePath(pathname, nextLocale);
  const queryString = searchParams.toString();
  const localeHref = queryString ? `${switchedPath}?${queryString}` : switchedPath;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !isEditableTarget(e.target) &&
        (e.key === 'Delete' || e.key === 'Backspace')
      ) {
        const { selectedTextId, removeTextBox, isImageSelected, imageElement, clearImage } =
          useEditorStore.getState();
        if (selectedTextId) {
          e.preventDefault();
          removeTextBox(selectedTextId);
          return;
        }

        if (isImageSelected && imageElement) {
          e.preventDefault();
          clearImage();
          return;
        }
      }

      // 匹配 Cmd/Ctrl + Z (撤销)，或加上 Shift (重做)，或者 Ctrl+Y
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z') {
           e.preventDefault();
           if (e.shiftKey) {
             history.redo();
           } else {
             history.undo();
           }
        } else if (e.key === 'y') {
           e.preventDefault();
           history.redo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history]);

  return (
    <header className="border-b border-[#d7b46a]/12 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <SiteMark />
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2 font-semibold tracking-tight text-lg">
                {t('appName')}
                <span className="hidden rounded-full border border-[#d7b46a]/20 bg-[#d7b46a]/8 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#e8cb8f] sm:inline-flex">
                  Local-first
                </span>
              </div>
              <span className="hidden text-xs text-muted-foreground font-normal md:inline-block">
                {t('appSubtitle')}
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-1 border-l border-border/50 pl-6 sm:flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              disabled={history.past.length === 0}
              onClick={history.undo}
              title={`${t('undo')} (Cmd+Z)`}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              disabled={history.future.length === 0}
              onClick={history.redo}
              title={`${t('redo')} (Cmd+Shift+Z)`}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={localeHref}
            className="rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {navLabels.switchLocale}
          </Link>
        </div>
      </div>

      <nav className="mt-4 flex flex-wrap items-center gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] transition-colors',
                isActive
                  ? 'border-[#d7b46a]/35 bg-[#d7b46a]/12 text-[#f1d492]'
                  : 'border-border/50 text-muted-foreground hover:border-[#d7b46a]/25 hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
