export type ArmyFormationIcon = {
  id: string;
  svgMarkup: string;
};

const EXPECTED_HELMET_COUNT = 39;

const CHINSTRAP_SHELL =
  'M 25 4 C 17 4 14 8 14 12 C 14 16 16 17 18 17 L 18 26 C 18 27 19 27 20 26 L 21 20 L 21 17 L 29 17 L 29 20 L 30 26 C 31 27 32 27 32 26 L 32 17 C 34 17 36 16 36 12 C 36 8 33 4 25 4 Z';

const CROSS_HOLE = 'M 23 7 H 27 V 9.5 H 30 V 12.5 H 27 V 15 H 23 V 12.5 H 20 V 9.5 H 23 Z';

const STAR_HOLE =
  'M 25 6 L 26.7 9.3 L 30.4 9.7 L 27.5 12.2 L 28.4 16 L 25 14 L 21.6 16 L 22.5 12.2 L 19.6 9.7 L 23.3 9.3 Z';

const GOGGLE_HOLES =
  'M 18.6 11 A 2.2 2.2 0 1 0 23 11 A 2.2 2.2 0 1 0 18.6 11 Z M 27 11 A 2.2 2.2 0 1 0 31.4 11 A 2.2 2.2 0 1 0 27 11 Z';

function filledPath(pathData: string): string {
  if (pathData.trim() === '') {
    throw new Error(`Helmet path is empty. Received: ${JSON.stringify(pathData)}`);
  }

  return `<path fill="currentColor" d="${pathData}"/>`;
}

function cutoutPath(pathData: string): string {
  if (pathData.trim() === '') {
    throw new Error(`Helmet cutout path is empty. Received: ${JSON.stringify(pathData)}`);
  }

  return `<path fill="currentColor" fill-rule="evenodd" d="${pathData}"/>`;
}

function joinHelmetMarkup(parts: readonly string[]): string {
  if (parts.length === 0) {
    throw new Error('Helmet markup parts must not be empty. Received: 0 parts');
  }

  return parts
    .map((part, index) => {
      if (part.trim() === '') {
        throw new Error(`Helmet markup part ${index} is empty. Received: ${JSON.stringify(part)}`);
      }

      return part;
    })
    .join('');
}

function domeOnNeckBody(): string {
  return joinHelmetMarkup([
    filledPath(
      'M 15 15 C 15 8 19 4 25 4 C 31 4 35 8 35 15 C 35 18 31 19 25 19 C 19 19 15 18 15 15 Z',
    ),
    filledPath('M 23 17 H 27 V 27 H 23 Z'),
  ]);
}

function brodieBrimBody(): string {
  return filledPath(
    'M 7 16 C 9 13 15 11 18 11 C 18 6 21 4 25 4 C 29 4 32 6 32 11 C 35 11 41 13 43 16 C 41 19 34 20 25 20 C 16 20 9 19 7 16 Z',
  );
}

function conicalBrimBody(): string {
  return joinHelmetMarkup([
    filledPath('M 23 1 H 27 V 4 H 23 Z'),
    filledPath('M 25 4 C 22 8 18 12 16 16 L 34 16 C 32 12 28 8 25 4 Z'),
    filledPath('M 4 15 C 8 18 14 17 18 16 L 32 16 C 36 17 42 18 46 15 C 44 20 36 21 25 21 C 14 21 6 20 4 15 Z'),
  ]);
}

function pointedGreatHelmBody(): string {
  return cutoutPath(
    'M 17 11 C 17 6 20 4 23 3 L 25 1 L 27 3 C 30 4 33 6 33 11 L 34 25 L 16 25 Z M 19 12 H 31 V 16 H 27 V 22 H 23 V 16 H 19 Z',
  );
}

function corinthianEyesBody(): string {
  return cutoutPath(
    'M 16 11 C 16 4 20 3 25 3 C 30 3 34 4 34 11 L 34 20 L 31 27 L 28 21 L 25 24 L 22 21 L 19 27 L 16 20 Z M 19 12 H 23 V 15 H 19 Z M 27 12 H 31 V 15 H 27 Z',
  );
}

function fanCrestHelmBody(): string {
  return joinHelmetMarkup([
    filledPath('M 8 15 C 8 2 42 2 42 15 Z'),
    cutoutPath(
      'M 16 13 L 34 13 L 34 18 L 31 26 L 28 20 L 22 20 L 19 26 L 16 18 Z M 19 16 H 23 V 19 H 19 Z M 27 16 H 31 V 19 H 27 Z',
    ),
  ]);
}

function tallPlumeHelmBody(): string {
  return joinHelmetMarkup([
    filledPath('M 22 1 H 28 C 28 3 29 4 28 6 C 30 7 28 8 28 10 H 22 C 22 8 20 7 22 6 C 21 4 22 3 22 1 Z'),
    cutoutPath(
      'M 16 11 C 16 9 20 8 25 8 C 30 8 34 9 34 11 L 34 17 L 31 25 L 28 19 L 22 19 L 19 25 L 16 17 Z M 19 14 H 31 V 18 H 19 Z',
    ),
  ]);
}

function droopingBrimBody(): string {
  return filledPath(
    'M 8 18 L 14 10 L 20 5 L 25 3 L 30 5 L 36 10 L 42 18 L 38 21 L 25 20 L 12 21 Z',
  );
}

function hornedBeardBody(): string {
  return joinHelmetMarkup([
    filledPath('M 6 5 C 9 8 13 11 17 13 C 15 10 13 8 15 6 C 12 7 8 6 6 5 Z'),
    filledPath('M 44 5 C 41 8 37 11 33 13 C 35 10 37 8 35 6 C 38 7 42 6 44 5 Z'),
    filledPath(
      'M 16 12 C 16 8 20 7 25 7 C 30 7 34 8 34 12 C 36 16 32 20 28 22 L 25 26 L 22 22 C 18 20 14 16 16 12 Z',
    ),
  ]);
}

function tallHornBowlBody(): string {
  return joinHelmetMarkup([
    filledPath('M 9 2 C 10 7 13 11 17 15 C 15 11 13 8 14 4 C 12 5 10 4 9 2 Z'),
    filledPath('M 41 2 C 40 7 37 11 33 15 C 35 11 37 8 36 4 C 38 5 40 4 41 2 Z'),
    filledPath(
      'M 17 14 C 17 11 20 10 25 10 C 30 10 33 11 33 14 C 35 18 31 21 25 21 C 19 21 15 18 17 14 Z',
    ),
  ]);
}

function bustBody(): string {
  return joinHelmetMarkup([
    filledPath('M 19 3 C 19 1 22 1 25 1 C 28 1 31 1 31 3 C 31 7 28 8 25 8 C 22 8 19 7 19 3 Z'),
    filledPath('M 23 8 H 27 V 12 H 23 Z'),
    filledPath('M 14 13 L 22 12 H 28 L 36 13 L 34 21 H 16 Z'),
    filledPath('M 18 20 H 23 V 28 H 18 Z'),
    filledPath('M 27 20 H 32 V 28 H 27 Z'),
  ]);
}

function slitAlmondHelmBody(): string {
  return cutoutPath(
    'M 25 3 C 17 6 15 12 16 16 C 17 22 21 27 25 28 C 29 27 33 22 34 16 C 35 12 33 6 25 3 Z M 18 14 H 32 V 17 H 18 Z',
  );
}

function spikedCorinthianBody(): string {
  return cutoutPath(
    'M 24 2 H 26 V 5 L 33 8 C 34 12 34 16 33 19 L 30 26 L 27 20 L 25 23 L 23 20 L 20 26 L 17 19 C 16 16 16 12 17 8 L 24 5 Z M 19 11 H 23 V 14 H 19 Z M 27 11 H 31 V 14 H 27 Z',
  );
}

function sideWingBulkBody(): string {
  return cutoutPath(
    'M 5 12 L 13 10 L 15 7 C 18 4 21 4 25 4 C 29 4 32 4 35 7 L 37 10 L 45 12 L 40 16 L 36 14 C 36 18 33 21 31 23 L 28 21 L 25 25 L 22 21 L 19 23 C 17 21 14 18 14 14 L 10 16 Z M 19 13 H 31 V 16 H 19 Z M 21 18 H 29 V 21 H 21 Z',
  );
}

function kuwagataHelmBody(): string {
  return joinHelmetMarkup([
    filledPath('M 4 8 L 8 2 L 14 3 L 18 12 L 14 14 L 9 6 Z'),
    filledPath('M 46 8 L 42 2 L 36 3 L 32 12 L 36 14 L 41 6 Z'),
    cutoutPath(
      'M 17 12 C 17 8 20 7 25 7 C 30 7 33 8 33 12 L 33 18 L 30 26 L 27 20 L 23 20 L 20 26 L 17 18 Z M 20 13 H 23 V 16 H 20 Z M 27 13 H 30 V 16 H 27 Z',
    ),
  ]);
}

function crossChinstrapBody(): string {
  return cutoutPath(`${CHINSTRAP_SHELL} ${CROSS_HOLE}`);
}

function starChinstrapBody(): string {
  return cutoutPath(`${CHINSTRAP_SHELL} ${STAR_HOLE}`);
}

function plainChinstrapBody(): string {
  return filledPath(CHINSTRAP_SHELL);
}

function goggleChinstrapBody(): string {
  return cutoutPath(`${CHINSTRAP_SHELL} ${GOGGLE_HOLES}`);
}

function skullcapBody(): string {
  return filledPath(
    'M 11 17 C 11 8 16 4 25 4 C 34 4 39 8 39 17 C 35 19 30 19 25 19 C 20 19 15 19 11 17 Z',
  );
}

function beardedCapBody(): string {
  return joinHelmetMarkup([
    filledPath('M 14 10 C 14 3 19 2 25 2 C 31 2 36 3 36 10 C 34 12 30 13 25 13 C 20 13 16 12 14 10 Z'),
    filledPath('M 15 10 H 18 V 20 H 15 Z'),
    filledPath('M 32 10 H 35 V 20 H 32 Z'),
    filledPath('M 16 19 C 16 22 19 27 25 27 C 31 27 34 22 34 19 C 30 21 28 21 25 21 C 22 21 20 21 16 19 Z'),
  ]);
}

function gasMaskBody(): string {
  return joinHelmetMarkup([
    cutoutPath(
      'M 14 8 C 14 3 18 2 25 2 C 32 2 36 4 36 9 C 36 14 33 16 31 17 L 28 23 L 25 20 L 22 23 L 18 18 C 16 16 13 13 14 8 Z M 19 8 A 3 3 0 1 0 25 8 A 3 3 0 1 0 19 8 Z',
    ),
    filledPath('M 30 15 L 38 16 L 38 20 L 29 19 Z'),
    filledPath('M 36 14 L 42 16 L 44 21 L 42 26 L 36 26 L 34 21 Z'),
  ]);
}

function blockCrestHelmBody(): string {
  return cutoutPath(
    'M 22 1 H 28 L 30 6 L 33 8 L 33 25 L 17 25 L 17 8 L 20 6 Z M 23 11 H 27 V 15 H 31 V 18 H 19 V 15 H 23 Z',
  );
}

function twoEyeClosedHelmBody(): string {
  return cutoutPath(
    'M 25 4 C 17 6 15 12 16 16 C 17 22 21 27 25 28 C 29 27 33 22 34 16 C 35 12 33 6 25 4 Z M 18 12 H 23 V 16 H 18 Z M 27 12 H 32 V 16 H 27 Z',
  );
}

function ringHelmBody(): string {
  return cutoutPath(
    'M 25 3 C 16 5 14 12 15 16 C 16 23 20 28 25 28 C 30 28 34 23 35 16 C 36 12 34 5 25 3 Z M 25 8 C 20 9 19 13 20 16 C 21 21 23 23 25 23 C 27 23 29 21 30 16 C 31 13 30 9 25 8 Z',
  );
}

function openHoodBody(): string {
  return cutoutPath(
    'M 25 3 C 16 8 14 14 15 18 C 16 24 20 28 25 28 C 30 28 34 24 35 18 C 36 14 34 8 25 3 Z M 25 11 C 21 13 20 16 21 18 C 22 22 23 23 25 23 C 27 23 28 22 29 18 C 30 16 29 13 25 11 Z',
  );
}

function splitHoodBody(): string {
  return cutoutPath(
    'M 25 3 C 16 7 14 13 15 17 C 16 23 20 26 24 27 L 25 29 L 26 27 C 30 26 34 23 35 17 C 36 13 34 7 25 3 Z M 21 12 L 29 12 L 30 18 L 25 23 L 20 18 Z',
  );
}

function leaningPointedHatBody(): string {
  return filledPath(
    'M 32 2 C 36 7 33 12 30 14 L 46 16 L 43 21 L 7 21 L 10 16 L 18 14 C 16 8 20 3 32 2 Z',
  );
}

function cockedHatBody(): string {
  return joinHelmetMarkup([
    filledPath('M 6 15 L 34 14 L 33 19 L 7 20 Z'),
    filledPath('M 10 15 C 10 8 16 6 24 8 C 30 9 32 12 30 15 Z'),
    filledPath('M 30 16 L 46 18 L 38 26 L 32 18 Z'),
  ]);
}

function eyeBandHopliteBody(): string {
  return cutoutPath(
    'M 16 8 C 16 3 20 2 25 2 C 30 2 34 3 34 8 L 34 14 L 32 24 L 28 19 L 26 26 L 24 19 L 22 26 L 18 19 L 16 24 Z M 18 10 H 32 V 13 H 18 Z',
  );
}

function spikedOpenFaceBody(): string {
  return cutoutPath(
    'M 24 2 H 26 V 5 L 33 8 C 34 12 34 14 33 16 L 32 26 L 28 22 L 22 22 L 18 26 L 17 16 C 16 14 16 12 17 8 L 24 5 Z M 19 11 H 31 V 14 H 19 Z M 21 17 H 29 V 21 H 21 Z',
  );
}

function wingedNasalBody(): string {
  return cutoutPath(
    'M 12 7 C 10 4 14 3 16 6 C 18 3 21 2 25 2 C 29 2 32 3 34 6 C 36 3 40 4 38 7 C 40 9 38 11 36 10 L 35 14 L 33 26 L 29 20 L 27 26 L 25 21 L 23 26 L 21 20 L 17 26 L 15 14 L 14 10 C 12 11 10 9 12 7 Z M 18 9 H 32 V 12 H 18 Z',
  );
}

function hornedCheekGuardBody(): string {
  return joinHelmetMarkup([
    filledPath('M 12 3 C 14 7 16 10 19 12 C 17 9 16 6 17 4 C 15 5 13 4 12 3 Z'),
    filledPath('M 38 3 C 36 7 34 10 31 12 C 33 9 34 6 33 4 C 35 5 37 4 38 3 Z'),
    cutoutPath(
      'M 17 11 C 17 8 20 7 25 7 C 30 7 33 8 33 11 L 33 16 L 30 26 L 27 20 L 25 23 L 23 20 L 20 26 L 17 16 Z M 20 13 H 23 V 16 H 20 Z M 27 13 H 30 V 16 H 27 Z',
    ),
  ]);
}

function needleCrestHelmBody(): string {
  return cutoutPath(
    'M 24.3 1 H 25.7 L 27 7 C 33 9 35 13 35 17 C 35 23 31 27 25 28 C 19 27 15 23 15 17 C 15 13 17 9 23 7 Z M 19 13 H 31 V 16 H 27 V 21 H 23 V 16 H 19 Z',
  );
}

function openCheekGuardBody(): string {
  return cutoutPath(
    'M 16 8 C 16 3 20 2 25 2 C 30 2 34 3 34 8 L 34 14 L 32 26 L 28 21 L 22 21 L 18 26 L 16 14 Z M 19 11 H 31 V 19 H 19 Z',
  );
}

function columnCrestHelmBody(): string {
  return cutoutPath(
    'M 21 2 H 29 V 8 L 33 10 L 33 16 L 30 25 L 27 20 L 25 23 L 23 20 L 20 25 L 17 16 L 17 10 L 21 8 Z M 20 12 H 30 V 15 H 27 V 19 H 23 V 15 H 20 Z',
  );
}

function flaredCheekHelmBody(): string {
  return cutoutPath(
    'M 16 6 C 16 2 20 2 25 2 C 30 2 34 2 34 6 L 35 10 L 38 14 L 36 24 L 31 18 L 28 14 L 26 20 L 25 23 L 24 20 L 22 14 L 19 18 L 14 24 L 12 14 L 15 10 Z M 19 8 H 23 V 11 H 19 Z M 27 8 H 31 V 11 H 27 Z',
  );
}

function skullMaskBody(): string {
  return cutoutPath(
    'M 16 8 C 16 3 20 2 25 2 C 30 2 34 3 34 8 C 35 14 33 20 25 25 C 17 20 15 14 16 8 Z M 18 10 L 23 12 L 23 15 L 18 14 Z M 32 10 L 27 12 L 27 15 L 32 14 Z',
  );
}

function angryVisorMaskBody(): string {
  return joinHelmetMarkup([
    cutoutPath(
      'M 14 7 C 16 2 21 2 25 3 C 29 2 34 2 36 7 C 38 11 36 16 34 18 C 32 22 29 24 25 24 C 21 24 18 22 16 18 C 14 16 12 11 14 7 Z M 16 10 L 23 13 L 25 15 L 27 13 L 34 10 L 32 14 L 25 17 L 18 14 Z',
    ),
    filledPath('M 18 23 H 21 V 27 H 18 Z'),
    filledPath('M 29 23 H 32 V 27 H 29 Z'),
  ]);
}

const ARMY_HELMET_BODIES: readonly (() => string)[] = [
  domeOnNeckBody,
  brodieBrimBody,
  conicalBrimBody,
  pointedGreatHelmBody,
  corinthianEyesBody,
  fanCrestHelmBody,
  tallPlumeHelmBody,
  droopingBrimBody,
  hornedBeardBody,
  tallHornBowlBody,
  bustBody,
  slitAlmondHelmBody,
  spikedCorinthianBody,
  sideWingBulkBody,
  kuwagataHelmBody,
  crossChinstrapBody,
  starChinstrapBody,
  plainChinstrapBody,
  goggleChinstrapBody,
  skullcapBody,
  beardedCapBody,
  gasMaskBody,
  blockCrestHelmBody,
  twoEyeClosedHelmBody,
  ringHelmBody,
  openHoodBody,
  splitHoodBody,
  leaningPointedHatBody,
  cockedHatBody,
  eyeBandHopliteBody,
  spikedOpenFaceBody,
  wingedNasalBody,
  hornedCheekGuardBody,
  needleCrestHelmBody,
  openCheekGuardBody,
  columnCrestHelmBody,
  flaredCheekHelmBody,
  skullMaskBody,
  angryVisorMaskBody,
];

function helmetIconId(helmetIndex: number): string {
  if (!Number.isInteger(helmetIndex) || helmetIndex < 1 || helmetIndex > EXPECTED_HELMET_COUNT) {
    throw new Error(
      `Helmet index must be an integer from 1 to ${EXPECTED_HELMET_COUNT}. Received: ${helmetIndex}`,
    );
  }

  return `helmet-${String(helmetIndex).padStart(2, '0')}`;
}

function assertHelmetBodyMarkup(helmetId: string, bodyMarkup: string): void {
  if (bodyMarkup.trim() === '') {
    throw new Error(
      `Helmet ${helmetId} is missing SVG body markup. Received: ${JSON.stringify(bodyMarkup)}`,
    );
  }

  if (bodyMarkup.includes('http') || bodyMarkup.includes('<image')) {
    throw new Error(`Helmet ${helmetId} markup contains a forbidden reference. Received: ${bodyMarkup}`);
  }
}

function wrapHelmetSvg(bodyMarkup: string): string {
  return `<svg viewBox="0 0 50 30">${bodyMarkup}</svg>`;
}

function buildArmyHelmetIcon(helmetIndex: number, bodyMarkup: string): ArmyFormationIcon {
  const id = helmetIconId(helmetIndex);
  assertHelmetBodyMarkup(id, bodyMarkup);

  return Object.freeze({
    id,
    svgMarkup: wrapHelmetSvg(bodyMarkup),
  });
}

function buildArmyHelmetIcons(bodyBuilders: readonly (() => string)[]): readonly ArmyFormationIcon[] {
  if (bodyBuilders.length !== EXPECTED_HELMET_COUNT) {
    throw new Error(
      `Army helmet icon count must be ${EXPECTED_HELMET_COUNT}. Received: ${bodyBuilders.length}`,
    );
  }

  const seenMarkup = new Set<string>();
  const icons = bodyBuilders.map((buildBody, offset) => {
    const icon = buildArmyHelmetIcon(offset + 1, buildBody());

    if (seenMarkup.has(icon.svgMarkup)) {
      throw new Error(`Helmet ${icon.id} repeats another helmet shape. Received: ${icon.svgMarkup}`);
    }

    seenMarkup.add(icon.svgMarkup);
    return icon;
  });

  return Object.freeze(icons);
}

const ARMY_HELMET_ICONS = buildArmyHelmetIcons(ARMY_HELMET_BODIES);

export function listArmyHelmetIcons(): readonly ArmyFormationIcon[] {
  return ARMY_HELMET_ICONS;
}
