export type ArmyFormationIcon = {
  id: string;
  svgMarkup: string;
};

const ARMY_NATO_PART1_ICON_COUNT = 48;
const ARMY_NATO_FRIENDLY_ICON_COUNT = 36;
const ARMY_NATO_STROKE =
  'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

type ArmyNatoFrame = 'friendly' | 'hostile';

export function listArmyNatoIconsPart1(): readonly ArmyFormationIcon[] {
  const icons = collectArmyNatoPart1Icons();
  assertArmyNatoPart1Icons(icons);
  return icons;
}

function collectArmyNatoPart1Icons(): readonly ArmyFormationIcon[] {
  const icons: ArmyFormationIcon[] = [];

  for (let iconNumber = 1; iconNumber <= ARMY_NATO_PART1_ICON_COUNT; iconNumber += 1) {
    icons.push(buildArmyNatoPart1Icon(iconNumber));
  }

  return icons;
}

function buildArmyNatoPart1Icon(iconNumber: number): ArmyFormationIcon {
  const frame = armyNatoPart1Frame(iconNumber);
  const symbolNumber = armyNatoPart1SymbolNumber(iconNumber);

  return {
    id: formatArmyNatoPart1IconId(iconNumber),
    svgMarkup: armyNatoSvgDocument(
      armyNatoFrameMarkup(frame),
      armyNatoSymbolMarkup(symbolNumber, frame),
    ),
  };
}

function formatArmyNatoPart1IconId(iconNumber: number): string {
  if (!Number.isInteger(iconNumber) || iconNumber < 1 || iconNumber > ARMY_NATO_PART1_ICON_COUNT) {
    throw new Error(
      `army NATO part 1 icon number ${iconNumber} is outside 1..${ARMY_NATO_PART1_ICON_COUNT}`,
    );
  }

  return `nato-${String(iconNumber).padStart(3, '0')}`;
}

function armyNatoPart1Frame(iconNumber: number): ArmyNatoFrame {
  if (!Number.isInteger(iconNumber) || iconNumber < 1 || iconNumber > ARMY_NATO_PART1_ICON_COUNT) {
    throw new Error(
      `army NATO part 1 icon number ${iconNumber} is outside 1..${ARMY_NATO_PART1_ICON_COUNT}`,
    );
  }

  if (iconNumber <= ARMY_NATO_FRIENDLY_ICON_COUNT) {
    return 'friendly';
  }

  return 'hostile';
}

function armyNatoPart1SymbolNumber(iconNumber: number): number {
  if (iconNumber >= 1 && iconNumber <= ARMY_NATO_FRIENDLY_ICON_COUNT) {
    return iconNumber;
  }

  if (iconNumber >= ARMY_NATO_FRIENDLY_ICON_COUNT + 1 && iconNumber <= ARMY_NATO_PART1_ICON_COUNT) {
    return iconNumber - ARMY_NATO_FRIENDLY_ICON_COUNT;
  }

  throw new Error(
    `army NATO part 1 icon number ${iconNumber} is outside 1..${ARMY_NATO_PART1_ICON_COUNT}`,
  );
}

function armyNatoFrameMarkup(frame: ArmyNatoFrame): string {
  if (frame === 'friendly') {
    return friendlyRectangleMarkup();
  }

  if (frame === 'hostile') {
    return hostileDiamondMarkup();
  }

  throw new Error(`army NATO frame ${frame} is not friendly or hostile`);
}

function friendlyRectangleMarkup(): string {
  return `<rect x="1.5" y="1.5" width="47" height="27" ${ARMY_NATO_STROKE}/>`;
}

function hostileDiamondMarkup(): string {
  return `<polygon points="25,1.5 48.5,15 25,28.5 1.5,15" ${ARMY_NATO_STROKE}/>`;
}

function armyNatoSvgDocument(frameMarkup: string, symbolMarkup: string): string {
  return `<svg viewBox="0 0 50 30">${frameMarkup}${symbolMarkup}</svg>`;
}

function armyNatoSymbolMarkup(symbolNumber: number, frame: ArmyNatoFrame): string {
  if (frame === 'hostile' && (symbolNumber < 1 || symbolNumber > 12)) {
    throw new Error(`army NATO hostile symbol number ${symbolNumber} is outside 1..12`);
  }

  if (symbolNumber === 1) return downChevronMarkup();
  if (symbolNumber === 2) return spokedWheelMarkup();
  if (symbolNumber === 3) return peakedArchMarkup();
  if (symbolNumber === 4) return bottomBandMarkup(frame);
  if (symbolNumber === 5) return armyNatoLabelMarkup('SOF', frame);
  if (symbolNumber === 6) return armyNatoLabelMarkup('SF', frame);
  if (symbolNumber === 7) return risingDiagonalMarkup(frame);
  if (symbolNumber === 8) return megaphoneMarkup();
  if (symbolNumber === 9) return lightningBoltMarkup();
  if (symbolNumber === 10) return circledSaltireMarkup();
  if (symbolNumber === 11) return crossedPaddlesMarkup();
  if (symbolNumber === 12) return anchorMarkup();
  if (symbolNumber === 13) return armyNatoLabelMarkup('MP', frame);
  if (symbolNumber === 14) return upwardArrowMarkup();
  if (symbolNumber === 15) return invertedArchMarkup();
  if (symbolNumber === 16) return armyNatoLabelMarkup('MET', frame);
  if (symbolNumber === 17) return fourPaneMarkup();
  if (symbolNumber === 18) return crescentBarMarkup();
  if (symbolNumber === 19) return saltireMarkup();
  if (symbolNumber === 20) return topBandMarkup();
  if (symbolNumber === 21) return crossedHashMarkup();
  if (symbolNumber === 22) return forkedStemMarkup();
  if (symbolNumber === 23) return armyNatoLabelMarkup('EOD', frame);
  if (symbolNumber === 24) return armyNatoLabelMarkup('EW', frame);
  if (symbolNumber === 25) return splitBridgeMarkup();
  if (symbolNumber === 26) return bowedPairMarkup();
  if (symbolNumber === 27) return facingCurvesMarkup();
  if (symbolNumber === 28) return filledBowtieMarkup();
  if (symbolNumber === 29) return openBowtieMarkup();
  if (symbolNumber === 30) return filledDiscMarkup();
  if (symbolNumber === 31) return horizontalOvalMarkup();
  if (symbolNumber === 32) return upwardTriangleMarkup();
  if (symbolNumber === 33) return stemmedArchMarkup();
  if (symbolNumber === 34) return bottomArcMarkup();
  if (symbolNumber === 35) return armyNatoLabelMarkup('CSS', frame);
  if (symbolNumber === 36) return fallingBoltMarkup();

  throw new Error(`army NATO symbol number ${symbolNumber} is outside 1..36`);
}

function strokeTags(openTags: readonly string[]): string {
  return openTags.map((openTag) => `${openTag} ${ARMY_NATO_STROKE}/>`).join('');
}

function downChevronMarkup(): string {
  return strokeTags(['<polyline points="16,9 25,14 34,9"']);
}

function spokedWheelMarkup(): string {
  return strokeTags([
    '<circle cx="25" cy="15" r="6.4"',
    '<line x1="25" y1="8.6" x2="25" y2="21.4"',
    '<line x1="18.6" y1="15" x2="31.4" y2="15"',
    '<line x1="20.5" y1="10.5" x2="29.5" y2="19.5"',
    '<line x1="29.5" y1="10.5" x2="20.5" y2="19.5"',
  ]);
}

function peakedArchMarkup(): string {
  return strokeTags([
    '<path d="M17 22 Q21 8 25 7 Q29 8 33 22"',
    '<line x1="19.4" y1="16.4" x2="30.6" y2="16.4"',
  ]);
}

function bottomBandMarkup(frame: ArmyNatoFrame): string {
  if (frame === 'hostile') {
    return strokeTags(['<line x1="21" y1="24" x2="29" y2="24"']);
  }

  return strokeTags(['<line x1="4" y1="23" x2="46" y2="23"']);
}

function armyNatoLabelMarkup(label: ArmyNatoLabel, frame: ArmyNatoFrame): string {
  const fontSize = armyNatoLabelFontSize(label, frame);
  const baseline = frame === 'hostile' ? 17.6 : 19.6;

  return `<text x="25" y="${baseline}" text-anchor="middle" font-family="sans-serif" font-size="${fontSize}" font-weight="700" fill="currentColor">${label}</text>`;
}

type ArmyNatoLabel = 'SOF' | 'SF' | 'MP' | 'MET' | 'EOD' | 'EW' | 'CSS';

function armyNatoLabelFontSize(label: ArmyNatoLabel, frame: ArmyNatoFrame): number {
  if (frame === 'hostile' && label === 'SOF') return 6.5;
  if (frame === 'hostile' && label === 'SF') return 8;

  if (frame === 'hostile') {
    throw new Error(`army NATO label ${label} has no hostile size in part 1`);
  }

  if (label === 'SOF' || label === 'MET' || label === 'EOD' || label === 'CSS') return 11;
  if (label === 'SF' || label === 'MP' || label === 'EW') return 13;

  throw new Error(`army NATO label ${label} has no friendly size`);
}

function risingDiagonalMarkup(frame: ArmyNatoFrame): string {
  if (frame === 'hostile') {
    return strokeTags(['<line x1="18" y1="22" x2="32" y2="8"']);
  }

  return strokeTags(['<line x1="5" y1="25" x2="45" y2="5"']);
}

function megaphoneMarkup(): string {
  return strokeTags([
    '<rect x="15" y="12" width="8" height="6"',
    '<path d="M23 12 L29 9 L29 21 L23 18 Z"',
    '<line x1="31" y1="12" x2="35" y2="12"',
    '<line x1="31" y1="15" x2="36" y2="15"',
    '<line x1="31" y1="18" x2="35" y2="18"',
  ]);
}

function lightningBoltMarkup(): string {
  return strokeTags(['<polyline points="30,6 22,14 27,14 20,24"']);
}

function circledSaltireMarkup(): string {
  return strokeTags([
    '<circle cx="25" cy="15" r="5"',
    '<line x1="21.5" y1="11.5" x2="28.5" y2="18.5"',
    '<line x1="28.5" y1="11.5" x2="21.5" y2="18.5"',
  ]);
}

function crossedPaddlesMarkup(): string {
  return [
    `<g transform="rotate(-38 25 15)"><ellipse cx="25" cy="15" rx="2" ry="7.2" ${ARMY_NATO_STROKE}/></g>`,
    `<g transform="rotate(38 25 15)"><ellipse cx="25" cy="15" rx="2" ry="7.2" ${ARMY_NATO_STROKE}/></g>`,
  ].join('');
}

function anchorMarkup(): string {
  return strokeTags([
    '<circle cx="25" cy="8.2" r="1.7"',
    '<line x1="25" y1="9.9" x2="25" y2="21"',
    '<line x1="20.5" y1="12.2" x2="29.5" y2="12.2"',
    '<path d="M18 16.5 Q18 22.5 25 22.5 Q32 22.5 32 16.5"',
  ]);
}

function upwardArrowMarkup(): string {
  return strokeTags([
    '<circle cx="25" cy="20" r="2.4"',
    '<line x1="25" y1="17.6" x2="25" y2="8"',
    '<polyline points="21,12 25,6.5 29,12"',
  ]);
}

function invertedArchMarkup(): string {
  return strokeTags(['<path d="M18 22 V12 Q18 7 25 7 Q32 7 32 12 V22"']);
}

function fourPaneMarkup(): string {
  return strokeTags([
    '<rect x="12" y="7" width="26" height="16"',
    '<line x1="25" y1="7" x2="25" y2="23"',
    '<line x1="12" y1="15" x2="38" y2="15"',
  ]);
}

function crescentBarMarkup(): string {
  return strokeTags([
    '<path d="M14 9 Q8 15 14 21"',
    '<line x1="14" y1="15" x2="36" y2="15"',
    '<path d="M36 9 Q42 15 36 21"',
  ]);
}

function saltireMarkup(): string {
  return strokeTags([
    '<line x1="4" y1="4" x2="46" y2="26"',
    '<line x1="46" y1="4" x2="4" y2="26"',
  ]);
}

function topBandMarkup(): string {
  return strokeTags(['<line x1="4" y1="7" x2="46" y2="7"']);
}

function crossedHashMarkup(): string {
  return strokeTags([
    '<line x1="8" y1="15" x2="42" y2="15"',
    '<line x1="18" y1="9" x2="18" y2="21"',
    '<line x1="32" y1="9" x2="32" y2="21"',
  ]);
}

function forkedStemMarkup(): string {
  return strokeTags([
    '<line x1="25" y1="23" x2="25" y2="14"',
    '<line x1="25" y1="14" x2="16" y2="7"',
    '<line x1="25" y1="14" x2="34" y2="7"',
  ]);
}

function splitBridgeMarkup(): string {
  return strokeTags(['<path d="M13 21 V11 H22"', '<path d="M28 11 H37 V21"']);
}

function bowedPairMarkup(): string {
  return strokeTags(['<path d="M10 12 Q25 6 40 12"', '<path d="M10 18 Q25 24 40 18"']);
}

function facingCurvesMarkup(): string {
  return strokeTags(['<path d="M22 7 Q15 15 22 23"', '<path d="M28 7 Q35 15 28 23"']);
}

function filledBowtieMarkup(): string {
  return '<path d="M12 9 L24 15 L12 21 Z M38 9 L26 15 L38 21 Z" fill="currentColor"/>';
}

function openBowtieMarkup(): string {
  return strokeTags(['<path d="M12 9 L24 15 L12 21 Z"', '<path d="M38 9 L26 15 L38 21 Z"']);
}

function filledDiscMarkup(): string {
  return '<circle cx="25" cy="15" r="5.2" fill="currentColor"/>';
}

function horizontalOvalMarkup(): string {
  return strokeTags(['<ellipse cx="25" cy="15" rx="15" ry="6.5"']);
}

function upwardTriangleMarkup(): string {
  return strokeTags(['<path d="M8 24 L25 6 L42 24 Z"']);
}

function stemmedArchMarkup(): string {
  return strokeTags([
    '<path d="M16 16 Q16 7 25 7 Q34 7 34 16"',
    '<line x1="25" y1="7" x2="25" y2="23"',
  ]);
}

function bottomArcMarkup(): string {
  return strokeTags(['<path d="M5 24 Q25 12 45 24"']);
}

function fallingBoltMarkup(): string {
  return strokeTags([
    '<line x1="45" y1="5" x2="6" y2="25"',
    '<polyline points="36,7 24,13 32,15 20,23"',
  ]);
}

function assertArmyNatoPart1Icons(icons: readonly ArmyFormationIcon[]): void {
  if (icons.length !== ARMY_NATO_PART1_ICON_COUNT) {
    throw new Error(
      `army NATO part 1 icon count ${icons.length} is not ${ARMY_NATO_PART1_ICON_COUNT}`,
    );
  }

  const seenIds = new Set<string>();

  for (let index = 0; index < icons.length; index += 1) {
    const icon = icons[index];
    const expectedId = formatArmyNatoPart1IconId(index + 1);

    if (!icon) {
      throw new Error(`army NATO part 1 icon at index ${index} is missing`);
    }

    if (icon.id !== expectedId) {
      throw new Error(`army NATO part 1 icon id ${icon.id} is not ${expectedId}`);
    }

    if (seenIds.has(icon.id)) {
      throw new Error(`army NATO part 1 icon id ${icon.id} is duplicated`);
    }

    seenIds.add(icon.id);
    assertArmyNatoSvgMarkup(icon);
  }
}

function assertArmyNatoSvgMarkup(icon: ArmyFormationIcon): void {
  const opensSvg = icon.svgMarkup.startsWith('<svg viewBox="0 0 50 30">');
  const closesSvg = icon.svgMarkup.endsWith('</svg>');

  if (!opensSvg || !closesSvg) {
    throw new Error(`army NATO icon ${icon.id} svg is not a complete 50 by 30 svg document`);
  }

  if (!icon.svgMarkup.includes('currentColor')) {
    throw new Error(`army NATO icon ${icon.id} svg is missing currentColor`);
  }

  const markup = icon.svgMarkup.toLowerCase();

  if (markup.includes('http') || markup.includes('<image')) {
    throw new Error(`army NATO icon ${icon.id} svg contains an external reference`);
  }
}
