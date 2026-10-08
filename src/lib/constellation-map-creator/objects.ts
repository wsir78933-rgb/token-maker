import {
  CONSTELLATION_STAR_ASSET_ID,
  CONSTELLATION_STAR_ASSET_SRC,
  getConstellationAsset,
} from './catalog';
import {
  describeConstellationValue,
  isConstellationRecord,
} from './validation';
import type { ConstellationObject } from './types';

export function getConstellationObjectSrc(object: ConstellationObject): string {
  if (!isConstellationRecord(object)) {
    throw new Error(
      `Constellation object must be an object. Received ${describeConstellationValue(object)}.`,
    );
  }

  if (object.kind === 'star') {
    if (object.assetId !== CONSTELLATION_STAR_ASSET_ID) {
      throw new Error(
        `Constellation star assetId must be ${JSON.stringify(CONSTELLATION_STAR_ASSET_ID)}. Received ${describeConstellationValue(object.assetId)}.`,
      );
    }
    return CONSTELLATION_STAR_ASSET_SRC;
  }

  if (object.kind !== 'constellation') {
    throw new Error(
      `Constellation object kind must be constellation or star. Received ${describeConstellationValue(object.kind)}.`,
    );
  }

  return getConstellationAsset(object.assetId).src;
}

