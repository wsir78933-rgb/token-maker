import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const assetOutputDirectory = resolve(repositoryRoot, 'public/family-tree/rollforfantasy/images/npc');
const manifestOutputPath = resolve(repositoryRoot, 'public/family-tree/rollforfantasy/manifest.json');
const checksumOutputPath = resolve(repositoryRoot, 'public/family-tree/rollforfantasy/SHA256SUMS');
const sourceAssetRoot = 'https://rollforfantasy.com/images/npc';
const localAssetRoot = '/family-tree/rollforfantasy/images/npc';
const requestConcurrency = 8;
const backHairStyleIndices = [5, 13, 17, 18, 22, 23, 24, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40];
const missingBackHairStyleIndices = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 19, 20, 21, 25, 31];
const backHairColorCount = 16;
const missingBackHairRedirectUrl = 'https://rollforfantasy.com/404.php';

const ASSET_RANGES = [
  ['head', 528],
  ['mhead', 432],
  ['beard', 17],
  ['beards', 272],
  ['hair', 640],
  ['bhair', 336],
  ['earHuman', 24],
  ['earElf', 24],
  ['earDwarf', 24],
  ['earHalfling', 24],
  ['earOrc', 24],
  ['earhElf', 24],
  ['eyes', 200],
  ['eyesOrc', 200],
  ['eb', 1280],
  ['nose', 30],
  ['mstch', 448],
  ['mouth', 40],
  ['mouthOrc', 40],
  ['old', 11],
  ['eyesp', 10],
  ['scar', 30],
];

function buildAssetManifest() {
  const assets = [];
  for (const [prefix, count] of ASSET_RANGES) {
    const indices = prefix === 'bhair'
      ? Array.from(
          { length: backHairColorCount },
          (_, colorOffset) => backHairStyleIndices.map((styleIndex) => colorOffset * 40 + styleIndex),
        ).flat()
      : Array.from({ length: count }, (_, indexOffset) => indexOffset + 1);
    for (const index of indices) {
      const filename = `${prefix}${index}.png`;
      assets.push({
        filename,
        sourceUrl: `${sourceAssetRoot}/${filename}`,
        localUrl: `${localAssetRoot}/${filename}`,
      });
    }
  }

  const optionalMissingBackHair = Array.from(
    { length: backHairColorCount },
    (_, colorOffset) => missingBackHairStyleIndices.map((styleIndex) => {
      const index = colorOffset * 40 + styleIndex;
      const filename = `bhair${index}.png`;
      return {
        filename,
        sourceUrl: `${sourceAssetRoot}/${filename}`,
        reason: 'HTTP 302 redirect to the official 404 page; no source PNG exists.',
        redirectUrl: missingBackHairRedirectUrl,
      };
    }),
  ).flat();

  return {
    sourcePage: 'https://rollforfantasy.com/tools/family-tree-creator.php',
    sourceScript: 'https://rollforfantasy.com/scripts/familyTree.js?rdwwwwqcwwiww',
    sourceStylesheet: 'https://rollforfantasy.com/css/famTree.css',
    sourceAssetRoot,
    localAssetRoot,
    assetCount: assets.length,
    assets,
    optionalMissingBackHair,
  };
}

function assertPngBytes(bytes, filename) {
  if (bytes.length < 24 || bytes.readUInt32BE(0) !== 0x89504e47) {
    throw new Error(`Family tree asset ${JSON.stringify(filename)} is not a PNG response.`);
  }

  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width <= 0 || height <= 0) {
    throw new Error(
      `Family tree asset ${JSON.stringify(filename)} has invalid dimensions ${String(width)}x${String(height)}.`,
    );
  }

  return { width, height };
}

function sha256Hex(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function createAssetRecord(asset, bytes) {
  const dimensions = assertPngBytes(bytes, asset.filename);
  return {
    ...asset,
    bytes: bytes.length,
    sha256: sha256Hex(bytes),
    width: dimensions.width,
    height: dimensions.height,
  };
}

async function fetchAsset(asset) {
  const response = await fetch(asset.sourceUrl, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) {
    throw new Error(
      `Family tree asset ${JSON.stringify(asset.filename)} returned HTTP ${String(response.status)} from ${JSON.stringify(asset.sourceUrl)}.`,
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('image/png')) {
    throw new Error(
      `Family tree asset ${JSON.stringify(asset.filename)} returned content type ${JSON.stringify(contentType)}.`,
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    ...createAssetRecord(asset, bytes),
    contents: bytes,
  };
}

async function readExistingAsset(asset) {
  const assetPath = resolve(assetOutputDirectory, asset.filename);
  let bytes;
  try {
    bytes = await readFile(assetPath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(
        `Family tree asset ${JSON.stringify(asset.filename)} is missing at ${JSON.stringify(assetPath)}.`,
        { cause: error },
      );
    }

    throw error;
  }

  return createAssetRecord(asset, bytes);
}

async function writeAsset(downloadedAsset) {
  const outputPath = resolve(assetOutputDirectory, downloadedAsset.filename);
  const existingBytes = await readFile(outputPath).catch((error) => {
    if (error?.code === 'ENOENT') {
      return null;
    }

    throw error;
  });

  if (existingBytes !== null) {
    const existingChecksum = sha256Hex(existingBytes);
    if (existingChecksum !== downloadedAsset.sha256) {
      throw new Error(
        `Family tree asset ${JSON.stringify(downloadedAsset.filename)} already exists with checksum ${existingChecksum}, expected ${downloadedAsset.sha256}.`,
      );
    }
    return;
  }

  await writeFile(outputPath, downloadedAsset.contents);
}

async function downloadAllAssets(manifest) {
  const downloadedAssets = new Array(manifest.assets.length);
  let nextAssetIndex = 0;

  async function downloadWorker() {
    while (true) {
      const assetIndex = nextAssetIndex;
      nextAssetIndex += 1;
      const asset = manifest.assets[assetIndex];
      if (asset === undefined) {
        return;
      }

      const downloadedAsset = await fetchAsset(asset);
      await writeAsset(downloadedAsset);
      downloadedAssets[assetIndex] = {
        filename: downloadedAsset.filename,
        sourceUrl: downloadedAsset.sourceUrl,
        localUrl: downloadedAsset.localUrl,
        bytes: downloadedAsset.bytes,
        sha256: downloadedAsset.sha256,
        width: downloadedAsset.width,
        height: downloadedAsset.height,
      };
      process.stdout.write(`Downloaded ${String(assetIndex + 1)}/${String(manifest.assets.length)} ${asset.filename}\n`);
    }
  }

  const workers = Array.from(
    { length: Math.min(requestConcurrency, manifest.assets.length) },
    () => downloadWorker(),
  );
  await Promise.all(workers);
  return downloadedAssets;
}

async function verifyExistingAssets(manifest) {
  const verifiedAssets = new Array(manifest.assets.length);
  let nextAssetIndex = 0;

  async function verifyWorker() {
    while (true) {
      const assetIndex = nextAssetIndex;
      nextAssetIndex += 1;
      const asset = manifest.assets[assetIndex];
      if (asset === undefined) {
        return;
      }

      verifiedAssets[assetIndex] = await readExistingAsset(asset);
      if ((assetIndex + 1) % 100 === 0 || assetIndex + 1 === manifest.assets.length) {
        process.stdout.write(`Verified ${String(assetIndex + 1)}/${String(manifest.assets.length)} ${asset.filename}\n`);
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(requestConcurrency, manifest.assets.length) },
    () => verifyWorker(),
  );
  await Promise.all(workers);
  if (verifiedAssets.some((asset) => asset === undefined)) {
    throw new Error('Family tree asset verification finished with missing manifest records.');
  }

  return verifiedAssets;
}

const manifest = buildAssetManifest();
await mkdir(assetOutputDirectory, { recursive: true });

if (process.argv.includes('--manifest-only')) {
  await writeFile(
    manifestOutputPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  console.log(`Wrote ${String(manifest.assetCount)} family tree asset URLs to ${manifestOutputPath}`);
  process.exit(0);
}

if (process.argv.includes('--verify-existing')) {
  const verifiedAssets = await verifyExistingAssets(manifest);
  await writeFile(
    manifestOutputPath,
    `${JSON.stringify({ ...manifest, assets: verifiedAssets }, null, 2)}\n`,
    'utf8',
  );
  await writeFile(
    checksumOutputPath,
    `${verifiedAssets.map((asset) => `${asset.sha256}  ${asset.filename}`).join('\n')}\n`,
    'utf8',
  );
  console.log(`Verified and catalogued ${String(verifiedAssets.length)} existing family tree assets.`);
  process.exit(0);
}

await writeFile(
  manifestOutputPath,
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

const downloadedAssets = await downloadAllAssets(manifest);
if (downloadedAssets.some((asset) => asset === undefined)) {
  throw new Error('Family tree asset download finished with missing manifest records.');
}

const resolvedAssets = downloadedAssets;
await writeFile(
  manifestOutputPath,
  `${JSON.stringify({ ...manifest, assets: resolvedAssets }, null, 2)}\n`,
  'utf8',
);
await writeFile(
  checksumOutputPath,
  `${resolvedAssets.map((asset) => `${asset.sha256}  ${asset.filename}`).join('\n')}\n`,
  'utf8',
);
console.log(`Downloaded and verified ${String(resolvedAssets.length)} family tree assets.`);
