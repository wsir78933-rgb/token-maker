export interface BlogCoverDimensions {
  width: number;
  height: number;
}

const BLOG_COVER_DIMENSIONS: Record<string, BlogCoverDimensions> = {
  '/blog/covers/en/dnd-5e-armorer-guide.webp': { width: 1536, height: 1024 },
  '/blog/covers/en/dnd-alignment-chart-guide.webp': { width: 2770, height: 1504 },
  '/blog/covers/en/dnd-armor-guide-redesign.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-artificer-guide.webp': { width: 1536, height: 1024 },
  '/blog/covers/en/dnd-backgrounds-guide.webp': { width: 1536, height: 834 },
  '/blog/covers/en/dnd-bard-spells-guide.webp': { width: 1672, height: 941 },
  '/blog/covers/en/dnd-beholder-guide.webp': { width: 1920, height: 1080 },
  '/blog/covers/en/dnd-bless-guide.webp': { width: 1672, height: 941 },
  '/blog/covers/en/dnd-campaigns.webp': { width: 1536, height: 1024 },
  '/blog/covers/en/dnd-character-sheet-guide.webp': { width: 1536, height: 834 },
  '/blog/covers/en/dnd-classes-comparison-cover.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-classes-explained-redesign.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-classes-ranked-redesign.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-cleric-spells-guide.webp': { width: 1920, height: 1080 },
  '/blog/covers/en/dnd-conditions-guide.webp': { width: 1280, height: 720 },
  '/blog/covers/en/dnd-constitution-guide-v2.webp': { width: 1254, height: 1254 },
  '/blog/covers/en/dnd-counterspell-cinematic.webp': { width: 1672, height: 941 },
  '/blog/covers/en/dnd-dagger-guide-v2.webp': { width: 1800, height: 978 },
  '/blog/covers/en/dnd-death-knight-guide.webp': { width: 1700, height: 923 },
  '/blog/covers/en/dnd-demons-guide.webp': { width: 1800, height: 978 },
  '/blog/covers/en/dnd-dhampir-guide-redesign.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-dragonborn-guide.webp': { width: 1248, height: 832 },
  '/blog/covers/en/dnd-druid-guide.webp': { width: 1920, height: 1080 },
  '/blog/covers/en/dnd-druid-spells-redesign.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-dwarf-names-guide.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-fighter-guide.webp': { width: 1536, height: 834 },
  '/blog/covers/en/dnd-find-familiar-guide.webp': { width: 2770, height: 1504 },
  '/blog/covers/en/dnd-flumph-guide.webp': { width: 1659, height: 948 },
  '/blog/covers/en/dnd-ghost-guide.webp': { width: 1536, height: 1024 },
  '/blog/covers/en/dnd-giants-guide.webp': { width: 1672, height: 941 },
  '/blog/covers/en/dnd-glaive-guide.webp': { width: 1672, height: 941 },
  '/blog/covers/en/dnd-gnome-names-guide.webp': { width: 1600, height: 1067 },
  '/blog/covers/en/dnd-grung-guide.webp': { width: 1536, height: 1024 },
  '/blog/covers/en/dnd-halfling-guide.webp': { width: 1672, height: 941 },
  '/blog/covers/en/dnd-hex-guide.webp': { width: 2770, height: 1504 },
  '/blog/covers/en/dnd-hunters-mark-cinematic.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-kenku-guide.webp': { width: 1280, height: 720 },
  '/blog/covers/en/dnd-kobold-guide.webp': { width: 1280, height: 720 },
  '/blog/covers/en/dnd-kobold-zh-guide.webp': { width: 1920, height: 1080 },
  '/blog/covers/en/dnd-languages-guide.webp': { width: 2770, height: 1504 },
  '/blog/covers/en/dnd-mace-guide.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-mage-armor-guide.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-maul-guide.webp': { width: 1536, height: 834 },
  '/blog/covers/en/dnd-meaning-guide.webp': { width: 2770, height: 1504 },
  '/blog/covers/en/dnd-necromancer-spells-guide.webp': { width: 1600, height: 900 },
  '/blog/covers/en/dnd-paladin-guide.webp': { width: 1702, height: 924 },
  '/blog/covers/en/dnd-quarterstaff-guide.webp': { width: 1538, height: 795 },
  '/blog/covers/en/dnd-races-guide.webp': { width: 2770, height: 1504 },
  '/blog/covers/en/dnd-ranger-guide.webp': { width: 1536, height: 834 },
  '/blog/covers/en/dnd-ranger-spells-guide.webp': { width: 1672, height: 941 },
  '/blog/covers/en/dnd-rapier-guide.webp': { width: 1672, height: 941 },
  '/blog/covers/en/dnd-schools-of-magic-guide.webp': { width: 1280, height: 720 },
  '/blog/covers/en/dnd-shatter-5e-guide.webp': { width: 1536, height: 834 },
  '/blog/covers/en/dnd-shortsword-guide.webp': { width: 1701, height: 925 },
  '/blog/covers/en/dnd-silvery-barbs-guide.webp': { width: 1672, height: 941 },
  '/blog/covers/en/dnd-skills-guide.webp': { width: 1280, height: 720 },
  '/blog/covers/en/dnd-stats-guide.webp': { width: 1536, height: 834 },
  '/blog/covers/en/dnd-sword-sheaths-guide.webp': { width: 1536, height: 1024 },
  '/blog/covers/en/dnd-thunderclap-guide.webp': { width: 2770, height: 1504 },
  '/blog/covers/en/dnd-wizard-spells-guide.webp': { width: 1364, height: 768 },
  '/blog/covers/en/dwelf-dnd-guide.webp': { width: 1536, height: 1024 },
  '/blog/covers/en/firebolt-dnd-5e-guide.webp': { width: 1536, height: 834 },
  '/blog/covers/en/mephistopheles-dnd-guide.webp': { width: 1672, height: 941 },
  '/blog/covers/en/mind-flayer-dnd-guide.webp': { width: 1920, height: 1080 },
  '/blog/covers/en/paladin-2024-spells-dnd-guide.webp': { width: 1672, height: 941 },
  '/blog/covers/en/players-handbook-dnd-5e-guide.webp': { width: 1700, height: 925 },
  '/blog/covers/en/spectator-dnd-guide.webp': { width: 1536, height: 834 },
  '/blog/covers/zh/dnd-schools-of-magic-caster.webp': { width: 1280, height: 720 },
  '/blog/inline/dnd-warlock-spells/eldritch-blast.webp': { width: 1536, height: 1024 },
};

export function getBlogCoverDimensions(coverImage: string): BlogCoverDimensions {
  const dimensions = BLOG_COVER_DIMENSIONS[coverImage];

  if (!dimensions) {
    throw new Error(`Missing blog cover dimensions for image: ${coverImage}`);
  }

  return dimensions;
}
