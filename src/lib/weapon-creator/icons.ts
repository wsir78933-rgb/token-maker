import { requireWeaponPieceId } from '@/lib/weapon-creator/catalog';
import { WEAPON_EXPORT_SCALE } from '@/lib/weapon-creator/constants';

const WEAPON_HIGH_RESOLUTION_IMAGE_ROOT = '/weapon-creator/high-resolution';

export function weaponPieceImagePath(pieceId: unknown): string {
  const validPieceId = requireWeaponPieceId(pieceId);
  return `${WEAPON_HIGH_RESOLUTION_IMAGE_ROOT}/${validPieceId}-${WEAPON_EXPORT_SCALE}x.png`;
}
