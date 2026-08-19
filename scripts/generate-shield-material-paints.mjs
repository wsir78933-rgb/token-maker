import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HEX_COLOUR = /^#[0-9A-Fa-f]{6}$/;
const PAINT_ATTRIBUTE = /\b(?:fill|stroke)\s*=\s*(["'])([^"']+)\1/g;
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const shieldsRoot = join(repoRoot, 'public/coat-assets/materials/shields');
const catalogPath = join(repoRoot, 'src/lib/coat-of-arms/shield-material-catalog.json');

function extractSvgPaintColours(svgText) {
  if (typeof svgText !== 'string') {
    throw new Error(`Invalid SVG text: ${String(svgText)}`);
  }
  const seenColours = new Set();
  const colours = [];
  for (const match of svgText.matchAll(PAINT_ATTRIBUTE)) {
    const paint = match[2];
    if (paint === undefined || paint.toLowerCase() === 'none' || !HEX_COLOUR.test(paint)) continue;
    const canonicalColour = paint.toUpperCase();
    if (seenColours.has(canonicalColour)) continue;
    seenColours.add(canonicalColour);
    colours.push(paint);
  }
  return colours;
}

async function listSvgFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listSvgFiles(entryPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.svg')) files.push(entryPath);
  }
  return files;
}

const svgPaths = await listSvgFiles(shieldsRoot);
const catalog = {};
for (const svgPath of svgPaths.sort()) {
  const assetId = svgPath.slice(svgPath.lastIndexOf('/') + 1, -4);
  const svgText = await readFile(svgPath, 'utf8');
  const colours = extractSvgPaintColours(svgText);
  if (colours.length === 0) {
    throw new Error(`Shield material has no hex paints: ${relative(repoRoot, svgPath)}`);
  }
  if (catalog[assetId] !== undefined) {
    throw new Error(`Duplicate shield material id: ${assetId}`);
  }
  catalog[assetId] = { colours, svg: svgText };
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Wrote ${Object.keys(catalog).length} shield materials to ${relative(repoRoot, catalogPath)}`);
