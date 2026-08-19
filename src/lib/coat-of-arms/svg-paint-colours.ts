const HEX_COLOUR = /^#[0-9A-Fa-f]{6}$/;
const PAINT_ATTRIBUTE = /\b(?:fill|stroke)\s*=\s*(["'])([^"']+)\1/g;

export function extractSvgPaintColours(svgText: string): string[] {
  assertSvgText(svgText);
  const seenColours = new Set<string>();
  const colours: string[] = [];
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

export function applySvgPaintReplacements(
  svgText: string,
  replacements: Record<string, string>,
): string {
  assertSvgText(svgText);
  if (!isReplacementRecord(replacements)) {
    throw new Error(`Invalid SVG paint replacements: ${String(replacements)}`);
  }

  const sourceColours = new Set(extractSvgPaintColours(svgText).map((colour) => colour.toUpperCase()));
  const replacementBySource = new Map<string, string>();
  for (const [sourceColour, replacementColour] of Object.entries(replacements)) {
    if (!HEX_COLOUR.test(sourceColour)) {
      throw new Error(`Invalid SVG paint replacement key: ${sourceColour}`);
    }
    if (!HEX_COLOUR.test(replacementColour)) {
      throw new Error(`Invalid SVG paint replacement colour: ${replacementColour}`);
    }
    if (!sourceColours.has(sourceColour.toUpperCase())) {
      throw new Error(`Unknown SVG paint replacement key: ${sourceColour}`);
    }
    replacementBySource.set(sourceColour.toUpperCase(), replacementColour);
  }

  return svgText.replace(PAINT_ATTRIBUTE, (fullMatch, quote: string, paint: string) => {
    if (!HEX_COLOUR.test(paint)) return fullMatch;
    const replacementColour = replacementBySource.get(paint.toUpperCase());
    if (replacementColour === undefined) return fullMatch;
    const attributeName = fullMatch.startsWith('stroke') ? 'stroke' : 'fill';
    return `${attributeName}=${quote}${replacementColour}${quote}`;
  });
}

function assertSvgText(svgText: unknown): asserts svgText is string {
  if (typeof svgText !== 'string') {
    throw new Error(`Invalid SVG text: ${String(svgText)}`);
  }
}

function isReplacementRecord(value: unknown): value is Record<string, string> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
