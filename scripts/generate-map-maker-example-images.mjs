import { mkdir, readdir } from 'node:fs/promises';
import { dirname, parse, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const examplesDirectory = resolve(repositoryRoot, 'public/map-maker/examples');
const outputWidths = [640, 1024, 1536, 2240];
const expectedSourceCount = 12;
const expectedSourceWidth = 2240;
const expectedSourceHeight = 1260;

const sourceFiles = (await readdir(examplesDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.png'))
  .map((entry) => entry.name)
  .sort();

if (sourceFiles.length !== expectedSourceCount) {
  throw new Error(
    `Map Maker example conversion requires exactly ${expectedSourceCount} PNG source files in ${JSON.stringify(examplesDirectory)}. Received ${sourceFiles.length}: ${JSON.stringify(sourceFiles)}.`,
  );
}

for (const sourceFile of sourceFiles) {
  const sourcePath = resolve(examplesDirectory, sourceFile);
  const imageName = `${parse(sourceFile).name}.webp`;
  const sourceMetadata = await sharp(sourcePath).metadata();

  if (sourceMetadata.format !== 'png' || sourceMetadata.width !== expectedSourceWidth || sourceMetadata.height !== expectedSourceHeight) {
    throw new Error(
      `Map Maker example ${JSON.stringify(sourcePath)} must be a ${expectedSourceWidth}x${expectedSourceHeight} PNG. Received format=${JSON.stringify(sourceMetadata.format)}, dimensions=${sourceMetadata.width}x${sourceMetadata.height}.`,
    );
  }

  for (const width of outputWidths) {
    const outputDirectory = width === expectedSourceWidth
      ? examplesDirectory
      : resolve(examplesDirectory, String(width));
    const outputPath = resolve(outputDirectory, imageName);
    const expectedHeight = Math.round((expectedSourceHeight * width) / expectedSourceWidth);

    await mkdir(outputDirectory, { recursive: true });
    const outputInfo = await sharp(sourcePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    if (outputInfo.format !== 'webp' || outputInfo.width !== width || outputInfo.height !== expectedHeight) {
      throw new Error(
        `Map Maker example output ${JSON.stringify(outputPath)} must be ${width}x${expectedHeight} WebP. Received format=${JSON.stringify(outputInfo.format)}, dimensions=${outputInfo.width}x${outputInfo.height}.`,
      );
    }

    console.log(`${imageName} ${outputInfo.width}x${outputInfo.height} ${outputInfo.size} bytes`);
  }
}
