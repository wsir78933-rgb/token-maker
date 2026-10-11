import assert from 'node:assert/strict';
import { mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const dimensionsFile = path.join(repositoryRoot, 'src/lib/blog/cover-dimensions.ts');
const publicDirectory = path.join(repositoryRoot, 'public');
const outputDirectory = path.join(publicDirectory, 'blog/covers/responsive');
const inlineCoverPath = '/blog/inline/dnd-warlock-spells/eldritch-blast.webp';
const targetWidths = [640, 960, 1280, 1920];
const quality = 80;

function readCoverDimensions(source) {
  const dimensions = new Map();
  const entryPattern = /^\s*'([^']+)': \{ width: (\d+), height: (\d+) \},?$/gm;

  for (const [, imagePath, width, height] of source.matchAll(entryPattern)) {
    if (
      (imagePath.startsWith('/blog/covers/') || imagePath === inlineCoverPath) &&
      imagePath.endsWith('.webp')
    ) {
      dimensions.set(imagePath, { width: Number(width), height: Number(height) });
    }
  }

  assert(dimensions.size > 0, `No blog cover dimensions found in ${dimensionsFile}.`);
  return dimensions;
}

function getVariantRelativePath(imagePath, width) {
  const relativeSourcePath = imagePath.startsWith('/blog/covers/')
    ? imagePath.slice('/blog/covers/'.length)
    : imagePath.slice('/blog/'.length);
  const extension = path.extname(relativeSourcePath);
  const filename = path.basename(relativeSourcePath, extension);
  const directory = path.dirname(relativeSourcePath);

  return path.join(directory, `${filename}-${width}w.webp`);
}

async function validateImage(imagePath, expectedWidth, expectedHeight) {
  const metadata = await sharp(imagePath).metadata();
  assert.equal(metadata.format, 'webp', `${imagePath} must be WebP, received ${metadata.format}.`);
  assert.equal(metadata.width, expectedWidth, `${imagePath} must be ${expectedWidth}px wide, received ${metadata.width}px.`);
  assert.equal(metadata.height, expectedHeight, `${imagePath} must be ${expectedHeight}px high, received ${metadata.height}px.`);
}

async function generateVariant(sourcePath, outputPath, width, expectedSourceHeight, sourceWidth) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(sourcePath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);

  const expectedHeight = Math.round((expectedSourceHeight * width) / sourceWidth);
  await validateImage(outputPath, width, expectedHeight);
  const outputStats = await stat(outputPath);

  return outputStats.size;
}

async function checkVariant(sourcePath, outputPath, width, expectedSourceHeight, sourceWidth) {
  const expectedHeight = Math.round((expectedSourceHeight * width) / sourceWidth);
  await validateImage(outputPath, width, expectedHeight);
  const outputStats = await stat(outputPath);

  return outputStats.size;
}

async function main() {
  const checkOnly = process.argv.includes('--check');
  const unexpectedArguments = process.argv.slice(2).filter((argument) => argument !== '--check');
  assert.deepEqual(unexpectedArguments, [], `Unexpected arguments: ${unexpectedArguments.join(', ')}.`);

  const dimensionMap = readCoverDimensions(await readFile(dimensionsFile, 'utf8'));
  let variantCount = 0;
  let totalBytes = 0;

  for (const [imagePath, expectedDimensions] of dimensionMap) {
    const sourcePath = path.join(publicDirectory, imagePath);
    const sourceMetadata = await sharp(sourcePath).metadata();
    assert.equal(sourceMetadata.format, 'webp', `${sourcePath} must be WebP, received ${sourceMetadata.format}.`);
    assert.equal(sourceMetadata.width, expectedDimensions.width, `${sourcePath} width does not match cover-dimensions.ts.`);
    assert.equal(sourceMetadata.height, expectedDimensions.height, `${sourcePath} height does not match cover-dimensions.ts.`);

    for (const width of targetWidths.filter((targetWidth) => targetWidth < expectedDimensions.width)) {
      const relativeOutputPath = getVariantRelativePath(imagePath, width);
      const outputPath = path.join(outputDirectory, relativeOutputPath);
      assert(
        outputPath.startsWith(`${outputDirectory}${path.sep}`),
        `Generated cover path escaped the responsive output directory: ${outputPath}.`,
      );

      const outputBytes = checkOnly
        ? await checkVariant(sourcePath, outputPath, width, expectedDimensions.height, expectedDimensions.width)
        : await generateVariant(sourcePath, outputPath, width, expectedDimensions.height, expectedDimensions.width);

      variantCount += 1;
      totalBytes += outputBytes;
    }
  }

  console.log(
    `${checkOnly ? 'Checked' : 'Generated'} ${variantCount} WebP cover variants from ${dimensionMap.size} referenced cover images; total variant bytes=${totalBytes}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
