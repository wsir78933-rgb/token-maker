import {
  listArmyFormationIconsInCategory,
  requireArmyFormationCatalogIcon,
  type ArmyFormationIconCategoryId,
} from './icon-catalog';

const ARMY_FORMATION_ICON_CELL_WIDTH = 50;
const ARMY_FORMATION_ICON_CELL_HEIGHT = 30;
const ARMY_FORMATION_ICON_SPRITE_ROOT = '/army-formation-icons/sprites';

const ARMY_FORMATION_ICON_SPRITE_URL_BY_CATEGORY: Readonly<
  Record<ArmyFormationIconCategoryId, string>
> = Object.freeze({
  helmet: `${ARMY_FORMATION_ICON_SPRITE_ROOT}/helmet-f0e090d2a26f528d.png`,
  weapon: `${ARMY_FORMATION_ICON_SPRITE_ROOT}/weapon-29ed5fa49d5e4711.png`,
  animal: `${ARMY_FORMATION_ICON_SPRITE_ROOT}/animal-860f43a07baa5e9a.png`,
  vehicle: `${ARMY_FORMATION_ICON_SPRITE_ROOT}/vehicle-350ea7f9c1cf9899.png`,
  nato: `${ARMY_FORMATION_ICON_SPRITE_ROOT}/nato-290cc929bcb9eece.png`,
});

function requireArmyFormationIconSpriteUrl(categoryId: ArmyFormationIconCategoryId): string {
  listArmyFormationIconsInCategory(categoryId);
  const spriteUrl = ARMY_FORMATION_ICON_SPRITE_URL_BY_CATEGORY[categoryId];
  if (typeof spriteUrl !== 'string' || spriteUrl.length === 0) {
    throw new Error(`Army formation icon sprite URL is missing for category ${JSON.stringify(categoryId)}.`);
  }

  return spriteUrl;
}

export function getArmyFormationIconSpriteUrl(categoryId: ArmyFormationIconCategoryId): string {
  return requireArmyFormationIconSpriteUrl(categoryId);
}

function buildArmyFormationIconThumbnailSvgMarkup(
  spriteUrl: string,
  spriteHeight: number,
  iconIndex: number,
): string {
  const iconOffsetY = iconIndex * ARMY_FORMATION_ICON_CELL_HEIGHT;
  return `<svg width="${ARMY_FORMATION_ICON_CELL_WIDTH}" height="${ARMY_FORMATION_ICON_CELL_HEIGHT}" viewBox="0 0 ${ARMY_FORMATION_ICON_CELL_WIDTH} ${ARMY_FORMATION_ICON_CELL_HEIGHT}" overflow="hidden"><image href="${spriteUrl}" x="0" y="-${iconOffsetY}" width="${ARMY_FORMATION_ICON_CELL_WIDTH}" height="${spriteHeight}" preserveAspectRatio="none"/></svg>`;
}

export function getArmyFormationIconThumbnailSvgMarkup(iconId: string): string {
  const icon = requireArmyFormationCatalogIcon(iconId);
  const categoryIcons = listArmyFormationIconsInCategory(icon.categoryId);
  const iconIndex = categoryIcons.findIndex((categoryIcon) => categoryIcon.id === icon.id);
  if (iconIndex < 0) {
    throw new Error(
      `Army formation icon ${JSON.stringify(icon.id)} is missing from category ${JSON.stringify(icon.categoryId)}.`,
    );
  }

  const spriteUrl = requireArmyFormationIconSpriteUrl(icon.categoryId);
  const spriteHeight = categoryIcons.length * ARMY_FORMATION_ICON_CELL_HEIGHT;
  return buildArmyFormationIconThumbnailSvgMarkup(spriteUrl, spriteHeight, iconIndex);
}
