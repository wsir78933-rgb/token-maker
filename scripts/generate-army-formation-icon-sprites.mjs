import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const spriteOutputDirectory = resolve(repositoryRoot, 'public/army-formation-icons/sprites');
const sourceAssetRoot = '/army-formation-icons/roll-for-fantasy';
const spriteUrlRoot = '/army-formation-icons/sprites';
const iconCellWidth = 50;
const iconCellHeight = 30;
const categoryIds = ['helmet', 'weapon', 'animal', 'vehicle', 'nato'];

const { listArmyFormationIconsInCategory } = await import(
  '../src/lib/army-formation/icon-catalog.ts'
);

function readAssetUrlFromCatalogIcon(icon) {
  if (typeof icon?.id !== 'string' || icon.id.length === 0) {
    throw new Error(`Army formation catalog icon id must be non-empty. Received ${JSON.stringify(icon?.id)}.`);
  }
  if (typeof icon.svgMarkup !== 'string' || icon.svgMarkup.length === 0) {
    throw new Error(`Army formation catalog icon ${JSON.stringify(icon.id)} has empty svgMarkup.`);
  }

  const assetMatch = icon.svgMarkup.match(/<image\b[^>]*\bhref="([^"]+)"/);
  const assetUrl = assetMatch?.[1];
  if (assetUrl === undefined) {
    throw new Error(`Army formation catalog icon ${JSON.stringify(icon.id)} has no image href.`);
  }
  if (!assetUrl.startsWith(`${sourceAssetRoot}/`) || !assetUrl.endsWith('.png')) {
    throw new Error(
      `Army formation catalog icon ${JSON.stringify(icon.id)} has an unexpected asset URL: ${JSON.stringify(assetUrl)}.`,
    );
  }

  return assetUrl;
}

function resolveSourceAssetPath(assetUrl) {
  const sourceAssetPath = resolve(repositoryRoot, 'public', assetUrl.slice(1));
  const expectedAssetDirectory = resolve(repositoryRoot, 'public', sourceAssetRoot.slice(1));
  if (!sourceAssetPath.startsWith(`${expectedAssetDirectory}/`)) {
    throw new Error(`Army formation asset URL escaped its source directory: ${JSON.stringify(assetUrl)}.`);
  }

  return sourceAssetPath;
}

async function readSourceIconRgba(assetUrl, iconId) {
  const sourceAssetPath = resolveSourceAssetPath(assetUrl);
  const sourcePngBytes = await readFile(sourceAssetPath);
  const decodedSource = await sharp(sourcePngBytes)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = decodedSource.info;
  if (width !== iconCellWidth || height !== iconCellHeight || channels !== 4) {
    throw new Error(
      `Army formation icon ${JSON.stringify(iconId)} must decode as ${iconCellWidth}x${iconCellHeight} RGBA. Received ${width}x${height} channels=${channels} from ${JSON.stringify(assetUrl)}.`,
    );
  }

  return decodedSource.data;
}

async function buildCategorySpritePng(categoryId) {
  const catalogIcons = listArmyFormationIconsInCategory(categoryId);
  if (catalogIcons.length === 0) {
    throw new Error(`Army formation category ${JSON.stringify(categoryId)} contains no icons.`);
  }

  const sourceIconRgbaRows = [];
  for (const catalogIcon of catalogIcons) {
    const assetUrl = readAssetUrlFromCatalogIcon(catalogIcon);
    sourceIconRgbaRows.push(await readSourceIconRgba(assetUrl, catalogIcon.id));
  }

  const spriteRgbaBytes = Buffer.concat(sourceIconRgbaRows);
  const spriteHeight = catalogIcons.length * iconCellHeight;
  const expectedByteLength = iconCellWidth * spriteHeight * 4;
  if (spriteRgbaBytes.length !== expectedByteLength) {
    throw new Error(
      `Army formation ${JSON.stringify(categoryId)} sprite RGBA length must be ${expectedByteLength}. Received ${spriteRgbaBytes.length}.`,
    );
  }

  const spritePngBytes = await sharp(spriteRgbaBytes, {
    raw: { width: iconCellWidth, height: spriteHeight, channels: 4 },
  })
    .png({ compressionLevel: 9, adaptiveFiltering: false, palette: false })
    .toBuffer();

  return { catalogIcons, spriteHeight, spritePngBytes };
}

function contentHashForPng(pngBytes) {
  return createHash('sha256').update(pngBytes).digest('hex').slice(0, 16);
}

function spriteFilename(categoryId, spritePngBytes) {
  return `${categoryId}-${contentHashForPng(spritePngBytes)}.png`;
}

async function writeCategorySprite(categoryId) {
  const { catalogIcons, spriteHeight, spritePngBytes } = await buildCategorySpritePng(categoryId);
  const filename = spriteFilename(categoryId, spritePngBytes);
  const outputPath = resolve(spriteOutputDirectory, filename);
  await writeFile(outputPath, spritePngBytes);
  return {
    categoryId,
    iconCount: catalogIcons.length,
    height: spriteHeight,
    filename,
    bytes: spritePngBytes.length,
    url: `${spriteUrlRoot}/${filename}`,
  };
}

async function assertOutputDirectoryContainsFiveSprites(spriteRecords) {
  const outputNames = await readdir(spriteOutputDirectory);
  const expectedNames = spriteRecords.map((spriteRecord) => spriteRecord.filename).sort();
  const actualNames = outputNames.filter((name) => name.endsWith('.png')).sort();
  if (actualNames.length !== expectedNames.length || actualNames.some((name, index) => name !== expectedNames[index])) {
    throw new Error(
      `Army formation sprite directory must contain exactly ${expectedNames.length} PNG files. Received ${JSON.stringify(actualNames)}; expected ${JSON.stringify(expectedNames)}.`,
    );
  }
}

await mkdir(spriteOutputDirectory, { recursive: true });
const spriteRecords = [];
for (const categoryId of categoryIds) {
  spriteRecords.push(await writeCategorySprite(categoryId));
}
await assertOutputDirectoryContainsFiveSprites(spriteRecords);
console.log(JSON.stringify(spriteRecords, null, 2));
