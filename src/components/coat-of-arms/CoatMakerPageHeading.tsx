import { getCoatMakerSeoCopy } from '@/components/coat-of-arms/coat-maker-seo-copy';
import type { SiteLocale } from '@/lib/site-locale';

export function CoatMakerPageHeading({ locale }: { locale: SiteLocale }) {
  const copy = getCoatMakerSeoCopy(locale);

  return (
    <header data-testid="coat-maker-page-heading" className="coat-maker-page-heading">
      <div className="coat-maker-page-heading-copy">
        <h1>{copy.heading}</h1>
        <p>{copy.introduction}</p>
      </div>
    </header>
  );
}
