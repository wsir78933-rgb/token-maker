import { getLocalizedPath } from '@/lib/site-locale';

// Cover images
export const DND_CLASSES_COVER_PATH = '/blog/covers/en/dnd-classes-explained.webp';
export const DND_CLASSES_RANKED_COVER_PATH = '/blog/covers/en/dnd-classes-ranked.webp';
export const DND_ARMOR_COVER_PATH = '/blog/covers/en/dnd-armor-guide.jpg';
export const DND_CONSTITUTION_COVER_PATH = '/blog/covers/en/dnd-constitution-guide-v2.webp';
export const DND_DRUID_SPELLS_COVER_PATH = '/blog/covers/en/dnd-druid-spells.webp';
export const DND_DHAMPIR_COVER_PATH = '/blog/covers/en/dnd-dhampir-guide.svg';
export const DND_GRUNG_COVER_PATH = '/blog/covers/en/dnd-grung-guide.webp';
export const DND_COUNTERSPELL_COVER_PATH = '/blog/covers/en/dnd-counterspell-cinematic.webp';

// Inline images
export const DND_CLASSES_TABLETOP_IMAGE_PATH = '/blog/inline/dnd-classes/tabletop-atmosphere.webp';
export const DND_CLASSES_MARTIAL_IMAGE_PATH = '/blog/inline/dnd-classes/martial-blade-inline.jpg';
export const DND_CLASSES_RANKED_PARTY_IMAGE_PATH = '/blog/inline/dnd-classes-ranked/party-lineup.webp';
export const DND_ARMOR_TYPES_IMAGE_PATH = '/blog/inline/dnd-armor/armor-types-armory.webp';
export const DND_ARMOR_HEAVY_IMAGE_PATH = '/blog/inline/dnd-armor/heavy-armor-paladin.webp';
export const DND_DHAMPIR_CEILING_IMAGE_PATH = '/blog/inline/dnd-dhampir/dhampir-ceiling-crawl.svg';
export const DND_DHAMPIR_BITE_IMAGE_PATH = '/blog/inline/dnd-dhampir/dhampir-bite-plan.svg';
export const DND_CONSTITUTION_INLINE_IMAGE_PATH = '/blog/inline/dnd-constitution/constitution-survival-inline.webp';
export const DND_GRUNG_LEAP_IMAGE_PATH = '/blog/inline/dnd-grung/grung-ruins-leap.webp';
export const DND_GRUNG_POISON_IMAGE_PATH = '/blog/inline/dnd-grung/grung-poison-closeup.webp';
export const DND_GRUNG_VIDEO_PLACEHOLDER_PATH = '/blog/inline/dnd-grung/grung-video-placeholder.webp';
export const DND_COUNTERSPELL_TIMING_IMAGE_PATH = '/blog/inline/dnd-counterspell/counterspell-alchemy-reaction-window.webp';
export const DND_COUNTERSPELL_FIELD_NOTES_IMAGE_PATH = '/blog/inline/dnd-counterspell/counterspell-field-notes.webp';
export const DND_COUNTERSPELL_VIDEO_PLACEHOLDER_PATH = '/blog/inline/dnd-counterspell/counterspell-video-placeholder.webp';

// External URLs
export const DND_DHAMPIR_LINEAGE_URL = 'https://www.dndbeyond.com/posts/1014-play-a-dhampir-hexblood-or-reborn-with-rules-from';
export const DND_DHAMPIR_VAMPIRE_URL = 'https://www.dndbeyond.com/posts/1467-playing-as-a-vampire-in-d-d';
export const DHAMPIR_WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/Dhampir';
export const DND_DHAMPIR_VIDEO_URL = 'https://www.youtube.com/watch?v=ZXcwHPW3GR8';
export const DND_GRUNG_SOURCE_URL = 'https://marketplace.dndbeyond.com/category/SRC-00060';
export const DND_GRUNG_WIKI_URL = 'https://forgottenrealms.fandom.com/wiki/Grung';
export const DND_GRUNG_VIDEO_URL = 'https://www.youtube.com/watch?v=EVwBW5GbGwQ';
export const DND_COUNTERSPELL_2014_RULES_URL = 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Counterspell';
export const DND_COUNTERSPELL_2024_RULES_URL = 'https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Counterspell';
export const DND_COUNTERSPELL_VIDEO_URL = 'https://www.youtube.com/watch?v=VQ1rmjrX4K0';

// Localized paths
export const EN_DND_CLASSES_PATH = getLocalizedPath('en', '/blog/dnd-classes-explained');
export const ZH_DND_CLASSES_PATH = getLocalizedPath('zh', '/blog/dnd-classes-explained');
export const EN_DND_CONSTITUTION_PATH = getLocalizedPath('en', '/blog/dnd-constitution-guide');
export const ZH_DND_CONSTITUTION_PATH = getLocalizedPath('zh', '/blog/dnd-constitution-guide');
export const EN_DND_DRUID_SPELLS_PATH = getLocalizedPath('en', '/blog/dnd-druid-spells');
export const ZH_DND_DRUID_SPELLS_PATH = getLocalizedPath('zh', '/blog/dnd-druid-spells');
export const EN_EDITOR_PATH = `${getLocalizedPath('en', '/')}#editor-workspace`;
export const ZH_EDITOR_PATH = `${getLocalizedPath('zh', '/')}#editor-workspace`;
export const EN_DICE_ROLLER_PATH = getLocalizedPath('en', '/dice-roller-dnd');
export const ZH_DICE_ROLLER_PATH = getLocalizedPath('zh', '/dice-roller-dnd');

export function liteVideoEmbed(videoId: string, title: string, thumbnail?: { src: string; alt: string }): string {
  const thumb = thumbnail?.src ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const thumbAlt = thumbnail?.alt ?? title;

  return `<div class="inline-embed inline-embed--video lite-video" data-video-id="${videoId}" data-video-title="${title}" role="button" tabindex="0" aria-label="Play video: ${title}">
  <img class="lite-video__thumb" src="${thumb}" alt="${thumbAlt}" loading="lazy" decoding="async" width="480" height="360" />
  <div class="lite-video__overlay" aria-hidden="true"></div>
  <button class="lite-video__play" type="button" aria-label="Play: ${title}">
    <svg class="lite-video__play-icon" viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"/>
      <path d="M45 24 27 14v20" fill="#fff"/>
    </svg>
  </button>
</div>`;
}
