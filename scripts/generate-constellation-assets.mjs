import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CONSTELLATION_THEMES_01_20 } from './constellation-assets/themes-01-20.mjs';
import { CONSTELLATION_THEMES_21_40 } from './constellation-assets/themes-21-40.mjs';
import { CONSTELLATION_THEMES_41_61 } from './constellation-assets/themes-41-61.mjs';

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSET_DIRECTORY = resolve(REPOSITORY_ROOT, 'public/constellation-map-creator');
const ASSET_CATEGORIES = ['image', 'plain', 'line'];
const THEME_GROUPS = ['creature', 'figure', 'object', 'nature', 'symbol', 'cluster'];
const ASSET_WIDTH = 98;
const ASSET_HEIGHT = 93;

function requireThemeString(receivedString, fieldName, themeIndex) {
  if (typeof receivedString !== 'string' || receivedString.trim().length === 0) {
    throw new Error(`Constellation ${themeIndex} ${fieldName} must be a non-empty string. Received ${JSON.stringify(receivedString)}.`);
  }
}

function requireStarCoordinates(star, themeIndex, starIndex) {
  if (!Array.isArray(star) || star.length !== 3) {
    throw new Error(`Constellation ${themeIndex} star ${starIndex} must contain [x, y, radius]. Received ${JSON.stringify(star)}.`);
  }
  const [x, y, radius] = star;
  if (![x, y, radius].every(Number.isFinite) || x < 8 || x > 92 || y < 8 || y > 92 || radius < 1.15 || radius > 2.3) {
    throw new Error(`Constellation ${themeIndex} star ${starIndex} must use coordinates 8..92 and radius 1.15..2.3. Received ${JSON.stringify(star)}.`);
  }
}

function requireThemeStars(theme) {
  if (!Array.isArray(theme.stars) || theme.stars.length < 6 || theme.stars.length > 15) {
    throw new Error(`Constellation ${theme.index} must contain 6..15 stars. Received ${JSON.stringify(theme.stars)}.`);
  }
  theme.stars.forEach((star, starIndex) => requireStarCoordinates(star, theme.index, starIndex));
  if (new Set(theme.stars.map(([x, y]) => `${x},${y}`)).size !== theme.stars.length) {
    throw new Error(`Constellation ${theme.index} contains duplicate star coordinates: ${JSON.stringify(theme.stars)}.`);
  }
  if (new Set(theme.stars.map(([, , radius]) => radius)).size < 2) {
    throw new Error(`Constellation ${theme.index} must distinguish main and secondary stars. Received ${JSON.stringify(theme.stars)}.`);
  }
}

function requireThemeSegments(theme) {
  if (!Array.isArray(theme.segments) || theme.segments.length === 0) {
    throw new Error(`Constellation ${theme.index} must contain at least one valid skeleton segment. Received ${JSON.stringify(theme.segments)}.`);
  }
  const uniqueSegments = new Set();
  for (const segment of theme.segments) {
    if (!Array.isArray(segment) || segment.length !== 2 || !segment.every((starIndex) => Number.isInteger(starIndex) && starIndex >= 0 && starIndex < theme.stars.length) || segment[0] === segment[1]) {
      throw new Error(`Constellation ${theme.index} segment must reference two different existing stars. Received ${JSON.stringify(segment)} with ${theme.stars.length} stars.`);
    }
    const segmentKey = [...segment].sort((firstIndex, secondIndex) => firstIndex - secondIndex).join(',');
    if (uniqueSegments.has(segmentKey)) {
      throw new Error(`Constellation ${theme.index} repeats segment ${JSON.stringify(segment)}.`);
    }
    uniqueSegments.add(segmentKey);
  }
}

function requireThemeIllustration(theme) {
  requireThemeString(theme.illustration, 'illustration', theme.index);
  const allowedIllustrationTags = ['path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'line'];
  const illustrationTags = [...theme.illustration.matchAll(/<\/?([a-zA-Z][\w:-]*)\b/g)].map((match) => match[1]);
  if (illustrationTags.length === 0 || illustrationTags.some((tag) => !allowedIllustrationTags.includes(tag)) || /(?:\bon\w+\s*=|\b(?:href|style|fill|stroke|filter|id)\s*=|url\s*\()/i.test(theme.illustration)) {
    throw new Error(`Constellation ${theme.index} illustration must contain only local unstyled SVG shapes. Received ${JSON.stringify(theme.illustration)}.`);
  }
}

function requireConstellationThemes(themes) {
  if (!Array.isArray(themes) || themes.length !== 61) {
    throw new Error(`Constellation library must contain exactly 61 themes. Received length=${String(themes?.length)}.`);
  }
  const themeSlugs = new Set();
  for (const [themeOffset, theme] of themes.entries()) {
    if (theme.index !== themeOffset + 1) {
      throw new Error(`Constellation theme at offset ${themeOffset} must use index ${themeOffset + 1}. Received ${String(theme.index)}.`);
    }
    for (const fieldName of ['slug', 'nameEn', 'nameZh', 'group']) requireThemeString(theme[fieldName], fieldName, theme.index);
    if (!/^[a-z]+(?:-[a-z]+)*$/.test(theme.slug) || themeSlugs.has(theme.slug)) {
      throw new Error(`Constellation ${theme.index} must use a unique descriptive slug. Received ${JSON.stringify(theme.slug)}.`);
    }
    if (!THEME_GROUPS.includes(theme.group)) {
      throw new Error(`Constellation ${theme.index} has unsupported group ${JSON.stringify(theme.group)}.`);
    }
    themeSlugs.add(theme.slug);
    requireThemeStars(theme);
    requireThemeSegments(theme);
    requireThemeIllustration(theme);
  }
}

function escapeXmlText(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function renderStarHalos(stars) {
  const halos = stars.filter(([, , radius]) => radius >= 1.7).map(([x, y, radius]) => `<circle cx="${x}" cy="${y}" r="${radius * 2.6}"/>`).join('');
  return `<g fill="#bddae9" opacity="0.12">${halos}</g>`;
}

function renderStars(stars) {
  const starCircles = stars.map(([x, y, radius]) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="#f8fbff" stroke="#536d82" stroke-width="0.4"/>`).join('');
  return `<g id="stars">${starCircles}</g>`;
}

function renderConnections(theme) {
  const lines = theme.segments.map(([startIndex, endIndex]) => {
    const [startX, startY] = theme.stars[startIndex];
    const [endX, endY] = theme.stars[endIndex];
    return `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}"/>`;
  }).join('');
  return `<g id="connections" fill="none" stroke="#7294aa" stroke-opacity="0.9" stroke-width="0.7" stroke-linecap="round">${lines}</g>`;
}

function renderConstellationSvg(theme, category) {
  let artwork = '';
  if (category === 'image') artwork = `<g id="illustration" fill="none" stroke="#7896aa" stroke-opacity="0.95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${theme.illustration}</g>`;
  else if (category === 'line') artwork = renderConnections(theme);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ASSET_WIDTH}" height="${ASSET_HEIGHT}" viewBox="0 0 100 100"><title>${escapeXmlText(theme.nameEn)} — ${category}</title>${artwork}${renderStarHalos(theme.stars)}${renderStars(theme.stars)}</svg>\n`;
}

function describeAssetBytes(svgText) {
  return { sha256: createHash('sha256').update(svgText).digest('hex'), byteLength: Buffer.byteLength(svgText) };
}

async function writeConstellationAsset(theme, category) {
  const filename = `assets/${category}/${category}-${String(theme.index).padStart(2, '0')}.svg`;
  const svgText = renderConstellationSvg(theme, category);
  await writeFile(resolve(ASSET_DIRECTORY, filename), svgText);
  return {
    id: `${category}-${theme.index}`, category, index: theme.index,
    theme: theme.slug, nameEn: theme.nameEn, nameZh: theme.nameZh, group: theme.group,
    filename, publicPath: `/constellation-map-creator/${filename}`,
    ...describeAssetBytes(svgText), width: ASSET_WIDTH, height: ASSET_HEIGHT,
  };
}

async function writeStarAsset() {
  const svgText = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><title>Star</title><circle cx="10" cy="10" r="6" fill="#bddae9" opacity="0.12"/><path d="M10 3V17M3 10H17" fill="none" stroke="#d9eaf2" stroke-width="0.7" stroke-opacity="0.6"/><circle cx="10" cy="10" r="2.3" fill="#f8fbff"/></svg>\n';
  const filename = 'assets/star.svg';
  await writeFile(resolve(ASSET_DIRECTORY, filename), svgText);
  return { id: 'star', filename, publicPath: `/constellation-map-creator/${filename}`, ...describeAssetBytes(svgText), width: 20, height: 20 };
}

async function writeThemeNames(themes) {
  const names = themes.map(({ index, slug, nameEn, nameZh, group }) => ({ index, slug, nameEn, nameZh, group }));
  const source = `// Generated by scripts/generate-constellation-assets.mjs. Edit the theme sources instead.\nexport const CONSTELLATION_THEME_NAMES = ${JSON.stringify(names, null, 2)} as const;\n`;
  await writeFile(resolve(REPOSITORY_ROOT, 'src/lib/constellation-map-creator/theme-names.ts'), source);
}

async function writeManifest(assets, star) {
  const manifest = {
    version: 1,
    source: { type: 'original', description: 'Original Token Maker SVG constellations with deliberately drawn thematic outlines and star anchors; no random paths or copied competitor artwork.', generator: 'scripts/generate-constellation-assets.mjs' },
    assetDirectory: '/constellation-map-creator/assets', star, assets,
  };
  await writeFile(resolve(ASSET_DIRECTORY, 'asset-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

async function generateConstellationAssets() {
  const themes = [...CONSTELLATION_THEMES_01_20, ...CONSTELLATION_THEMES_21_40, ...CONSTELLATION_THEMES_41_61];
  requireConstellationThemes(themes);
  for (const category of ASSET_CATEGORIES) await mkdir(resolve(ASSET_DIRECTORY, 'assets', category), { recursive: true });
  const assets = [];
  for (const category of ASSET_CATEGORIES) {
    for (const theme of themes) assets.push(await writeConstellationAsset(theme, category));
  }
  const star = await writeStarAsset();
  await writeThemeNames(themes);
  await writeManifest(assets, star);
  console.log(`Generated ${themes.length} original themes, ${assets.length} constellation SVGs, and one star in ${ASSET_DIRECTORY}.`);
}

await generateConstellationAssets();
