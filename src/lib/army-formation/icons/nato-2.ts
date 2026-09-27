export type ArmyFormationIcon = {
  id: string;
  svgMarkup: string;
};

type ArmyNatoFrameKind = 'diamond' | 'square';

const FRAME_LEFT = 12;
const FRAME_TOP = 2;
const FRAME_RIGHT = 38;
const FRAME_BOTTOM = 28;
const CENTER_X = 25;
const CENTER_Y = 15;

const ICON_STROKE =
  'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
const EDGE_STROKE =
  'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="butt" stroke-linejoin="miter"';
const ICON_FILL = 'fill="currentColor"';

function armyNatoIconId(iconNumber: number): string {
  if (!Number.isInteger(iconNumber) || iconNumber < 49 || iconNumber > 96) {
    throw new Error(`NATO icon number must be an integer from 49 to 96, received ${iconNumber}`);
  }

  return `nato-${String(iconNumber).padStart(3, '0')}`;
}

function hostileDiamondFrame(): string {
  return `<path d="M${CENTER_X} ${FRAME_TOP} L${FRAME_RIGHT} ${CENTER_Y} L${CENTER_X} ${FRAME_BOTTOM} L${FRAME_LEFT} ${CENTER_Y} Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="miter"/>`;
}

function neutralSquareFrame(): string {
  const frameSize = FRAME_RIGHT - FRAME_LEFT;
  return `<rect x="${FRAME_LEFT}" y="${FRAME_TOP}" width="${frameSize}" height="${frameSize}" fill="none" stroke="currentColor" stroke-width="1.8"/>`;
}

function armyFormationSvg(frameMarkup: string, symbolMarkup: string): string {
  if (frameMarkup.includes('http') || symbolMarkup.includes('http')) {
    throw new Error(
      `NATO svg contains http in frame or symbol: frame=${frameMarkup} symbol=${symbolMarkup}`,
    );
  }

  if (frameMarkup.includes('<image') || symbolMarkup.includes('<image')) {
    throw new Error(
      `NATO svg contains an image tag in frame or symbol: frame=${frameMarkup} symbol=${symbolMarkup}`,
    );
  }

  const svgMarkup = `<svg viewBox="0 0 50 30">${frameMarkup}${symbolMarkup}</svg>`;
  if (!svgMarkup.includes('currentColor')) {
    throw new Error(`NATO svg is missing currentColor: ${svgMarkup}`);
  }

  return svgMarkup;
}

function armyFormationIcon(
  iconNumber: number,
  frameMarkup: string,
  symbolMarkup: string,
): ArmyFormationIcon {
  return {
    id: armyNatoIconId(iconNumber),
    svgMarkup: armyFormationSvg(frameMarkup, symbolMarkup),
  };
}

function letterFontSize(letterCount: number, frame: ArmyNatoFrameKind): number {
  if (letterCount === 2 && frame === 'diamond') {
    return 9;
  }

  if (letterCount === 3 && frame === 'diamond') {
    return 6.4;
  }

  if (letterCount === 2 && frame === 'square') {
    return 12;
  }

  if (letterCount === 3 && frame === 'square') {
    return 9;
  }

  throw new Error(`NATO letter size is not defined for ${letterCount} letters in frame ${frame}`);
}

function framedLetters(letters: string, frame: ArmyNatoFrameKind): string {
  if (!/^[A-Z]{2,3}$/.test(letters)) {
    throw new Error(`NATO label must be 2 or 3 uppercase letters, received ${letters}`);
  }

  if (frame !== 'diamond' && frame !== 'square') {
    throw new Error(`NATO label frame must be diamond or square, received ${frame}`);
  }

  const fontSize = letterFontSize(letters.length, frame);
  return `<text x="${CENTER_X}" y="${CENTER_Y}" text-anchor="middle" dominant-baseline="central" fill="currentColor" font-family="Arial, sans-serif" font-weight="700" font-size="${fontSize}">${letters}</text>`;
}

function downwardChevron(): string {
  return `<path d="M14 6 L25 14 L36 6" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function spokedWheel(): string {
  return [
    `<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="7.5" ${ICON_STROKE}/>`,
    `<line x1="25" y1="7.5" x2="25" y2="22.5" ${ICON_STROKE}/>`,
    `<line x1="17.5" y1="15" x2="32.5" y2="15" ${ICON_STROKE}/>`,
    `<line x1="19.7" y1="9.7" x2="30.3" y2="20.3" ${ICON_STROKE}/>`,
    `<line x1="30.3" y1="9.7" x2="19.7" y2="20.3" ${ICON_STROKE}/>`,
  ].join('');
}

function peakedCanopy(): string {
  return `<path d="M16 18 C19 11 22 7 25 5 C28 7 31 11 34 18 M20 16 C23 14 24 18 25 19 C26 18 27 14 30 16" ${ICON_STROKE}/>`;
}

function bottomBand(): string {
  return `<line x1="${FRAME_LEFT}" y1="24" x2="${FRAME_RIGHT}" y2="24" ${EDGE_STROKE}/>`;
}

function squareDiagonal(): string {
  return `<line x1="${FRAME_LEFT}" y1="${FRAME_BOTTOM}" x2="${FRAME_RIGHT}" y2="${FRAME_TOP}" ${EDGE_STROKE}/>`;
}

function muzzleRays(): string {
  return [
    `<rect x="15" y="11" width="14" height="8" ${ICON_STROKE}/>`,
    `<line x1="29" y1="13" x2="35" y2="13" ${ICON_STROKE}/>`,
    `<line x1="29" y1="15" x2="35" y2="15" ${ICON_STROKE}/>`,
    `<line x1="29" y1="17" x2="35" y2="17" ${ICON_STROKE}/>`,
  ].join('');
}

function lightningBolt(): string {
  return `<polyline points="30,6 18,14 24,14 17,23" ${ICON_STROKE}/>`;
}

function circledSaltire(): string {
  return [
    `<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="6" ${ICON_STROKE}/>`,
    `<line x1="19" y1="9" x2="31" y2="21" ${ICON_STROKE}/>`,
    `<line x1="31" y1="9" x2="19" y2="21" ${ICON_STROKE}/>`,
  ].join('');
}

function crossedPaddles(): string {
  return [
    `<ellipse cx="${CENTER_X}" cy="${CENTER_Y}" rx="3.2" ry="6.2" transform="rotate(-50 25 15)" ${ICON_FILL}/>`,
    `<ellipse cx="${CENTER_X}" cy="${CENTER_Y}" rx="3.2" ry="6.2" transform="rotate(50 25 15)" ${ICON_FILL}/>`,
  ].join('');
}

function anchorMark(): string {
  return [
    `<circle cx="25" cy="8" r="1.8" ${ICON_FILL}/>`,
    `<line x1="25" y1="9.6" x2="25" y2="21" ${ICON_STROKE}/>`,
    `<line x1="19" y1="13" x2="31" y2="13" ${ICON_STROKE}/>`,
    `<path d="M17 17 C17 23 21 24 25 24 C29 24 33 23 33 17" ${ICON_STROKE}/>`,
  ].join('');
}

function upwardArrowCircle(): string {
  return [
    `<line x1="25" y1="8" x2="25" y2="19" ${ICON_STROKE}/>`,
    `<polyline points="21.5,12 25,8 28.5,12" ${ICON_STROKE}/>`,
    `<circle cx="25" cy="21.5" r="2.1" ${ICON_STROKE}/>`,
  ].join('');
}

function narrowArch(): string {
  return `<path d="M22.5 22 V12.5 Q22.5 8.5 25 8.5 Q27.5 8.5 27.5 12.5 V22 M25 8.5 V22" ${ICON_STROKE}/>`;
}

function frameAxes(): string {
  return [
    `<line x1="${FRAME_LEFT}" y1="${CENTER_Y}" x2="${FRAME_RIGHT}" y2="${CENTER_Y}" ${EDGE_STROKE}/>`,
    `<line x1="${CENTER_X}" y1="${FRAME_TOP}" x2="${CENTER_X}" y2="${FRAME_BOTTOM}" ${EDGE_STROKE}/>`,
  ].join('');
}

function outwardCrescents(): string {
  return [
    `<path d="M20 11 Q16 15 20 19" ${ICON_STROKE}/>`,
    `<line x1="20" y1="15" x2="30" y2="15" ${ICON_STROKE}/>`,
    `<path d="M30 11 Q34 15 30 19" ${ICON_STROKE}/>`,
  ].join('');
}

function squareSaltire(): string {
  return [
    `<line x1="${FRAME_LEFT}" y1="${FRAME_TOP}" x2="${FRAME_RIGHT}" y2="${FRAME_BOTTOM}" ${EDGE_STROKE}/>`,
    `<line x1="${FRAME_RIGHT}" y1="${FRAME_TOP}" x2="${FRAME_LEFT}" y2="${FRAME_BOTTOM}" ${EDGE_STROKE}/>`,
  ].join('');
}

function diamondSaltire(): string {
  return [
    `<line x1="18.5" y1="8.5" x2="31.5" y2="21.5" ${EDGE_STROKE}/>`,
    `<line x1="31.5" y1="8.5" x2="18.5" y2="21.5" ${EDGE_STROKE}/>`,
  ].join('');
}

function squareTopBand(): string {
  return `<line x1="${FRAME_LEFT}" y1="6" x2="${FRAME_RIGHT}" y2="6" ${EDGE_STROKE}/>`;
}

function diamondTopBand(): string {
  return `<line x1="17" y1="10" x2="33" y2="10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="butt"/>`;
}

function squarePostedWindow(): string {
  return [
    frameAxes(),
    `<line x1="18.5" y1="${FRAME_TOP}" x2="18.5" y2="${CENTER_Y}" ${EDGE_STROKE}/>`,
    `<line x1="31.5" y1="${FRAME_TOP}" x2="31.5" y2="${CENTER_Y}" ${EDGE_STROKE}/>`,
  ].join('');
}

function diamondPostedBar(): string {
  return [
    `<line x1="${FRAME_LEFT}" y1="${CENTER_Y}" x2="${FRAME_RIGHT}" y2="${CENTER_Y}" ${EDGE_STROKE}/>`,
    `<line x1="22" y1="9" x2="22" y2="${CENTER_Y}" ${EDGE_STROKE}/>`,
    `<line x1="28" y1="9" x2="28" y2="${CENTER_Y}" ${EDGE_STROKE}/>`,
  ].join('');
}

function antennaFork(): string {
  return [
    `<polyline points="20,8 25,14 30,8" ${ICON_STROKE}/>`,
    `<line x1="25" y1="14" x2="25" y2="22" ${ICON_STROKE}/>`,
  ].join('');
}

function engineerComb(): string {
  return [
    `<line x1="18" y1="11" x2="32" y2="11" ${ICON_STROKE}/>`,
    `<line x1="18" y1="11" x2="18" y2="19" ${ICON_STROKE}/>`,
    `<line x1="25" y1="11" x2="25" y2="19" ${ICON_STROKE}/>`,
    `<line x1="32" y1="11" x2="32" y2="19" ${ICON_STROKE}/>`,
  ].join('');
}

function flaredRails(): string {
  return [
    `<polyline points="17,11 20,13 30,13 33,11" ${ICON_STROKE}/>`,
    `<polyline points="17,19 20,17 30,17 33,19" ${ICON_STROKE}/>`,
  ].join('');
}

function facingParentheses(): string {
  return `<path d="M22 9 Q19 15 22 21 M28 9 Q31 15 28 21" ${ICON_STROKE}/>`;
}

function pinchedBowtie(): string {
  return [
    `<polygon points="17,11 25,15 17,19" ${ICON_FILL}/>`,
    `<polygon points="33,11 25,15 33,19" ${ICON_FILL}/>`,
  ].join('');
}

function outwardArrowheads(): string {
  return [
    `<polygon points="16,15 23,11.5 23,18.5" ${ICON_FILL}/>`,
    `<polygon points="34,15 27,11.5 27,18.5" ${ICON_FILL}/>`,
    `<rect x="23" y="14.2" width="4" height="1.6" ${ICON_FILL}/>`,
  ].join('');
}

function filledDisc(): string {
  return `<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="4.2" ${ICON_FILL}/>`;
}

function horizontalOval(): string {
  return `<ellipse cx="${CENTER_X}" cy="${CENTER_Y}" rx="8" ry="3.4" ${ICON_STROKE}/>`;
}

function peakedTriangle(): string {
  return `<polyline points="25,2 19.5,21 30.5,21 25,2" ${ICON_STROKE}/>`;
}

function archOnBase(): string {
  return `<path d="M21 20 V14 Q21 10 25 10 Q29 10 29 14 V20 M18 20 H32" ${ICON_STROKE}/>`;
}

function lowerHill(): string {
  return `<path d="M20 22 C22 14 28 14 30 22" ${ICON_STROKE}/>`;
}

function kinkedDiagonal(): string {
  return `<polyline points="19,9 23,16 28,12 31,21" ${ICON_STROKE}/>`;
}

function hostileDiamondIcons(): ArmyFormationIcon[] {
  const frame = hostileDiamondFrame();
  return [
    armyFormationIcon(49, frame, framedLetters('MP', 'diamond')),
    armyFormationIcon(50, frame, upwardArrowCircle()),
    armyFormationIcon(51, frame, narrowArch()),
    armyFormationIcon(52, frame, framedLetters('MET', 'diamond')),
    armyFormationIcon(53, frame, frameAxes()),
    armyFormationIcon(54, frame, outwardCrescents()),
    armyFormationIcon(55, frame, diamondSaltire()),
    armyFormationIcon(56, frame, diamondTopBand()),
    armyFormationIcon(57, frame, diamondPostedBar()),
    armyFormationIcon(58, frame, antennaFork()),
    armyFormationIcon(59, frame, framedLetters('EOD', 'diamond')),
    armyFormationIcon(60, frame, framedLetters('EW', 'diamond')),
    armyFormationIcon(61, frame, engineerComb()),
    armyFormationIcon(62, frame, flaredRails()),
    armyFormationIcon(63, frame, facingParentheses()),
    armyFormationIcon(64, frame, pinchedBowtie()),
    armyFormationIcon(65, frame, outwardArrowheads()),
    armyFormationIcon(66, frame, filledDisc()),
    armyFormationIcon(67, frame, horizontalOval()),
    armyFormationIcon(68, frame, peakedTriangle()),
    armyFormationIcon(69, frame, archOnBase()),
    armyFormationIcon(70, frame, lowerHill()),
    armyFormationIcon(71, frame, framedLetters('CSS', 'diamond')),
    armyFormationIcon(72, frame, kinkedDiagonal()),
  ];
}

function neutralSquareIcons(): ArmyFormationIcon[] {
  const frame = neutralSquareFrame();
  return [
    armyFormationIcon(73, frame, downwardChevron()),
    armyFormationIcon(74, frame, spokedWheel()),
    armyFormationIcon(75, frame, peakedCanopy()),
    armyFormationIcon(76, frame, bottomBand()),
    armyFormationIcon(77, frame, framedLetters('SOF', 'square')),
    armyFormationIcon(78, frame, framedLetters('SF', 'square')),
    armyFormationIcon(79, frame, squareDiagonal()),
    armyFormationIcon(80, frame, muzzleRays()),
    armyFormationIcon(81, frame, lightningBolt()),
    armyFormationIcon(82, frame, circledSaltire()),
    armyFormationIcon(83, frame, crossedPaddles()),
    armyFormationIcon(84, frame, anchorMark()),
    armyFormationIcon(85, frame, framedLetters('MP', 'square')),
    armyFormationIcon(86, frame, upwardArrowCircle()),
    armyFormationIcon(87, frame, narrowArch()),
    armyFormationIcon(88, frame, framedLetters('MET', 'square')),
    armyFormationIcon(89, frame, frameAxes()),
    armyFormationIcon(90, frame, outwardCrescents()),
    armyFormationIcon(91, frame, squareSaltire()),
    armyFormationIcon(92, frame, squareTopBand()),
    armyFormationIcon(93, frame, squarePostedWindow()),
    armyFormationIcon(94, frame, antennaFork()),
    armyFormationIcon(95, frame, framedLetters('EOD', 'square')),
    armyFormationIcon(96, frame, framedLetters('EW', 'square')),
  ];
}

function requireDistinctArmyNatoIcons(
  icons: readonly ArmyFormationIcon[],
): readonly ArmyFormationIcon[] {
  if (icons.length !== 48) {
    throw new Error(`NATO part 2 must contain 48 icons, received ${icons.length}`);
  }

  const seenMarkup = new Set<string>();
  const frozenIcons = icons.map((icon, index) => {
    const expectedId = armyNatoIconId(49 + index);
    if (icon.id !== expectedId) {
      throw new Error(`NATO icon at position ${index} must be ${expectedId}, received ${icon.id}`);
    }

    if (seenMarkup.has(icon.svgMarkup)) {
      throw new Error(`duplicate NATO icon shape for ${icon.id}`);
    }

    seenMarkup.add(icon.svgMarkup);
    return Object.freeze(icon);
  });

  return Object.freeze(frozenIcons);
}

export function listArmyNatoIconsPart2(): readonly ArmyFormationIcon[] {
  return requireDistinctArmyNatoIcons([...hostileDiamondIcons(), ...neutralSquareIcons()]);
}
