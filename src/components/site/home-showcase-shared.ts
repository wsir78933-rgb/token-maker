import en from '@/lib/i18n/en';
import zh from '@/lib/i18n/zh';
import type { SiteLocale } from '@/lib/site-locale';
import { getLocalizedPath } from '@/lib/site-locale';
import type { HomeShowcaseTone } from '@/lib/home-showcase';

const dictionaries: Record<SiteLocale, Record<string, string>> = {
  en,
  zh,
};

export const toneClasses: Record<HomeShowcaseTone, { shell: string; chip: string; glow: string }> =
  {
    gold: {
      shell: 'from-[#f4e0a6]/18 via-white/6 to-transparent',
      chip: 'border-[#e3be6a]/35 bg-[#d7b46a]/12 text-[#f7ddb0]',
      glow: 'bg-[radial-gradient(circle_at_top,rgba(231,194,112,0.22),transparent_58%)]',
    },
    grave: {
      shell: 'from-emerald-300/12 via-white/6 to-transparent',
      chip: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100',
      glow: 'bg-[radial-gradient(circle_at_top,rgba(113,255,174,0.16),transparent_58%)]',
    },
    ember: {
      shell: 'from-[#ff9a52]/22 via-white/6 to-transparent',
      chip: 'border-[#ff9a52]/30 bg-[#ff9a52]/12 text-[#ffd7b7]',
      glow: 'bg-[radial-gradient(circle_at_top,rgba(255,137,58,0.24),transparent_56%)]',
    },
    violet: {
      shell: 'from-[#8f7cff]/20 via-white/6 to-transparent',
      chip: 'border-[#9d92ff]/28 bg-[#8f7cff]/12 text-[#e3ddff]',
      glow: 'bg-[radial-gradient(circle_at_top,rgba(154,126,255,0.18),transparent_58%)]',
    },
    ice: {
      shell: 'from-[#93d5ff]/20 via-white/6 to-transparent',
      chip: 'border-[#93d5ff]/30 bg-[#93d5ff]/12 text-[#dff4ff]',
      glow: 'bg-[radial-gradient(circle_at_top,rgba(130,207,255,0.2),transparent_56%)]',
    },
    steel: {
      shell: 'from-white/14 via-white/6 to-transparent',
      chip: 'border-white/16 bg-white/8 text-stone-200',
      glow: 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_58%)]',
    },
  };

export const QUICK_START_IMAGE_SIZES =
  '(min-width: 1280px) 112px, (min-width: 768px) 96px, 20vw';

interface PresetHrefSelection {
  borderId?: string;
  maskId?: string;
  borderTint?: string;
}

export function getShowcaseText(locale: SiteLocale, key: string) {
  return dictionaries[locale][key] ?? key;
}

export function getPresetHref(
  locale: SiteLocale,
  presetId: string,
  selection: PresetHrefSelection = {}
) {
  const editorSearchParams = new URLSearchParams({ preset: presetId });

  if (selection.maskId) {
    editorSearchParams.set('mask', selection.maskId);
  }

  if (selection.borderId) {
    editorSearchParams.set('border', selection.borderId);
  }

  if (selection.borderTint) {
    editorSearchParams.set('borderTint', selection.borderTint);
  }

  return `${getLocalizedPath(locale, '/')}?${editorSearchParams.toString()}#editor-workspace`;
}

export function getShowcaseCardImageSizes(featured: boolean) {
  if (featured) {
    return '(min-width: 1024px) 620px, 100vw';
  }

  return '(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw';
}
