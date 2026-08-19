import shieldMaterialCatalog from './shield-material-catalog.json';

interface ShieldMaterialRecord {
  colours: string[];
  svg: string;
}

const catalog = shieldMaterialCatalog as Record<string, ShieldMaterialRecord>;

export function isShieldMaterialAssetId(assetId: string): boolean {
  if (typeof assetId !== 'string' || assetId.trim().length === 0) {
    throw new Error(`Invalid shield material asset id: ${JSON.stringify(assetId)}`);
  }
  return catalog[assetId] !== undefined;
}

export function getShieldMaterialPaintColours(assetId: string): string[] {
  return [...requireShieldMaterial(assetId).colours];
}

export function getShieldMaterialSvgMarkup(assetId: string): string {
  return requireShieldMaterial(assetId).svg;
}

function requireShieldMaterial(assetId: string): ShieldMaterialRecord {
  if (typeof assetId !== 'string' || assetId.trim().length === 0) {
    throw new Error(`Invalid shield material asset id: ${JSON.stringify(assetId)}`);
  }
  const material = catalog[assetId];
  if (material === undefined) {
    throw new Error(`Unknown shield material: ${assetId}`);
  }
  if (!Array.isArray(material.colours) || material.colours.length === 0) {
    throw new Error(`Shield material has no paints: ${assetId}`);
  }
  if (typeof material.svg !== 'string' || material.svg.length === 0) {
    throw new Error(`Shield material has no SVG markup: ${assetId}`);
  }
  return material;
}
