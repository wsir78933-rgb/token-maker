import Link from 'next/link';
import { Swords } from 'lucide-react';
import { SiteMark } from '@/components/site/SiteMark';
import { getSharePageCopy } from '@/lib/share/page-model';
import type { SiteLocale } from '@/lib/site-locale';

export function SharePageView({
  locale,
  imageUrl,
}: {
  locale: SiteLocale;
  imageUrl: string;
}) {
  const copy = getSharePageCopy(locale);

  return (
    <main
      lang={locale === 'zh' ? 'zh-CN' : 'en'}
      className="min-h-screen bg-[#070b0d] text-stone-100"
    >
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(215,180,106,0.12),transparent_34%),linear-gradient(180deg,#0b1114_0%,#070b0d_100%)]">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 sm:py-8">
          <header className="flex items-center justify-between border-b border-white/8 pb-5">
            <Link href={copy.ctaHref} className="flex items-center gap-3">
              <SiteMark className="h-10 w-10 rounded-full ring-1 ring-[#d7b46a]/40" />
              <span className="font-serif text-2xl font-semibold tracking-wide text-stone-100 sm:text-3xl">
                Token Maker
              </span>
            </Link>
            <Link
              href={copy.ctaHref}
              className="hidden rounded-lg border border-[#d7b46a] px-5 py-3 text-sm font-semibold text-[#d7b46a] transition hover:bg-[#d7b46a] hover:text-[#171008] sm:inline-flex"
            >
              {copy.cta}
            </Link>
          </header>

          <section className="flex w-full min-w-0 flex-1 flex-col items-center justify-center py-10 text-center sm:py-14">
            <div className="w-[calc(100vw-2.5rem)] max-w-[560px] rounded-lg border border-white/10 bg-[#0d1417] p-3 shadow-[0_40px_140px_-80px_rgba(215,180,106,0.45)]">
              <div className="bg-[linear-gradient(45deg,rgba(255,255,255,0.035)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.035)_75%),linear-gradient(45deg,rgba(255,255,255,0.035)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.035)_75%)] bg-[length:28px_28px] bg-[position:0_0,14px_14px]">
                {/* R2 images are user-generated and live outside next/image remote config. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={copy.imageAlt}
                  className="aspect-square w-full object-contain"
                />
              </div>
            </div>

            <p className="mt-8 text-lg font-semibold text-[#d7b46a] sm:text-xl">
              <span aria-hidden="true">✦ </span>
              {copy.madeWith}
              <span aria-hidden="true"> ✦</span>
            </p>
            <p className="mt-4 max-w-full text-base leading-7 text-stone-400 sm:max-w-2xl sm:text-lg">
              {copy.body}
            </p>

            <Link
              href={copy.ctaHref}
              className="mt-8 inline-flex w-[calc(100vw-2.5rem)] max-w-md items-center justify-center gap-3 rounded-lg border border-[#f4c96a]/40 bg-[linear-gradient(180deg,#f5cf72_0%,#d69a2f_100%)] px-6 py-4 text-base font-bold text-[#171008] shadow-[0_20px_60px_-36px_rgba(245,207,114,0.9)] transition hover:brightness-110 sm:text-lg"
            >
              <Swords className="h-5 w-5" />
              {copy.cta}
            </Link>
          </section>

          <footer className="pb-4 text-center">
            <div className="mx-auto mb-4 flex max-w-xl items-center justify-center gap-4 text-white/10">
              <span className="h-px flex-1 bg-white/10" />
              <SiteMark className="h-7 w-7 rounded-full opacity-50" />
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <p className="text-sm text-stone-500">{copy.footer}</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
