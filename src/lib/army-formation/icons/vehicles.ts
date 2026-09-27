export type ArmyFormationIcon = {
  id: string;
  svgMarkup: string;
};

const VEHICLE_ICON_COUNT = 26;

const VEHICLE_DRAWINGS = [
  drawBombard,
  drawFieldGun,
  drawTrebuchet,
  drawJibCrane,
  drawDerrick,
  drawBatteringRam,
  drawSupplyWagon,
  drawSiegeTower,
  drawMangonel,
  drawLongBarrelTank,
  drawRoundedTank,
  drawAntennaVan,
  drawRoofGunJeep,
  drawBoxTruck,
  drawMissileTruck,
  drawArmoredCar,
  drawGunTruck,
  drawOnager,
  drawSweptJet,
  drawFighterJet,
  drawDeltaDart,
  drawRotorcraftTop,
  drawHelicopterSide,
  drawFinnedRocket,
  drawElevatedCannon,
  drawSpokedWheelCannon,
] as const;

function formatCoordinate(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error(`SVG coordinate must be finite, got ${value}`);
  }

  const rounded = Math.round(value * 100) / 100;
  if (rounded === 0) {
    return '0';
  }

  return String(rounded);
}

function circlePath(centerX: number, centerY: number, radius: number): string {
  if (!(radius > 0)) {
    throw new Error(`Circle radius must be positive, got ${radius}`);
  }

  const startX = formatCoordinate(centerX - radius);
  const centerYText = formatCoordinate(centerY);
  const radiusText = formatCoordinate(radius);
  const diameterText = formatCoordinate(radius * 2);
  const negativeDiameterText = formatCoordinate(-radius * 2);
  return `M${startX} ${centerYText}a${radiusText} ${radiusText} 0 1 0 ${diameterText} 0a${radiusText} ${radiusText} 0 1 0 ${negativeDiameterText} 0`;
}

function paint(pathData: string): string {
  if (pathData.trim().length === 0) {
    throw new Error('Vehicle path data must not be empty, got an empty string');
  }

  if (pathData.includes('"') || pathData.includes('<')) {
    throw new Error(`Vehicle path data must not contain quotes or tags, got ${pathData}`);
  }

  return `<path fill="currentColor" d="${pathData}"/>`;
}

function paintCutout(pathData: string): string {
  if (pathData.trim().length === 0) {
    throw new Error('Vehicle cutout path data must not be empty, got an empty string');
  }

  if (pathData.includes('"') || pathData.includes('<')) {
    throw new Error(`Vehicle cutout path data must not contain quotes or tags, got ${pathData}`);
  }

  return `<path fill="currentColor" fill-rule="evenodd" d="${pathData}"/>`;
}

function wheel(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
): string {
  if (!(innerRadius > 0) || innerRadius >= outerRadius) {
    throw new Error(
      `Wheel inner radius must be greater than 0 and less than ${outerRadius}, got ${innerRadius}`,
    );
  }

  return paintCutout(
    `${circlePath(centerX, centerY, outerRadius)}${circlePath(centerX, centerY, innerRadius)}`,
  );
}

function formatVehicleIconId(index: number): string {
  if (!Number.isInteger(index) || index < 1 || index > VEHICLE_ICON_COUNT) {
    throw new Error(
      `Vehicle icon index must be an integer from 1 to ${VEHICLE_ICON_COUNT}, got ${index}`,
    );
  }

  return `vehicle-${String(index).padStart(2, '0')}`;
}

function buildVehicleSvgMarkup(drawing: string): string {
  if (drawing.trim().length === 0) {
    throw new Error('Vehicle icon drawing must not be empty, got an empty string');
  }

  return `<svg viewBox="0 0 50 30">${drawing}</svg>`;
}

function assertVehicleIcon(icon: ArmyFormationIcon, index: number): void {
  const expectedId = formatVehicleIconId(index);
  if (icon.id !== expectedId) {
    throw new Error(`Vehicle icon id must be ${expectedId}, got ${icon.id}`);
  }

  const svgMarkup = icon.svgMarkup;
  const svgOpenTagCount = svgMarkup.match(/<svg\b/gi)?.length ?? 0;
  if (svgOpenTagCount !== 1 || !svgMarkup.startsWith('<svg ') || !svgMarkup.endsWith('</svg>')) {
    throw new Error(
      `Vehicle icon ${icon.id} svgMarkup must be one complete svg element, got ${svgMarkup}`,
    );
  }

  if (!svgMarkup.includes('viewBox="0 0 50 30"')) {
    throw new Error(
      `Vehicle icon ${icon.id} svgMarkup must include viewBox="0 0 50 30", got ${svgMarkup}`,
    );
  }

  if (!svgMarkup.includes('currentColor')) {
    throw new Error(
      `Vehicle icon ${icon.id} svgMarkup must paint with currentColor, got ${svgMarkup}`,
    );
  }

  const loweredMarkup = svgMarkup.toLowerCase();
  if (loweredMarkup.includes('http')) {
    throw new Error(`Vehicle icon ${icon.id} svgMarkup must not contain http, got ${svgMarkup}`);
  }

  if (loweredMarkup.includes('<image') || loweredMarkup.includes('href') || loweredMarkup.includes('url(')) {
    throw new Error(
      `Vehicle icon ${icon.id} svgMarkup must not contain an external link or image, got ${svgMarkup}`,
    );
  }
}

function createVehicleIcon(index: number, drawing: string): ArmyFormationIcon {
  const icon = {
    id: formatVehicleIconId(index),
    svgMarkup: buildVehicleSvgMarkup(drawing),
  };
  assertVehicleIcon(icon, index);
  return Object.freeze(icon);
}

function assertUniqueVehicleSvgMarkup(icons: readonly ArmyFormationIcon[]): void {
  const seenMarkup = new Set<string>();
  for (const icon of icons) {
    if (seenMarkup.has(icon.svgMarkup)) {
      throw new Error(`Duplicate vehicle svgMarkup on ${icon.id}: ${icon.svgMarkup}`);
    }

    seenMarkup.add(icon.svgMarkup);
  }
}

function buildArmyVehicleIcons(): readonly ArmyFormationIcon[] {
  if (VEHICLE_DRAWINGS.length !== VEHICLE_ICON_COUNT) {
    throw new Error(
      `Expected ${VEHICLE_ICON_COUNT} vehicle drawings, got ${VEHICLE_DRAWINGS.length}`,
    );
  }

  const icons = VEHICLE_DRAWINGS.map((drawVehicle, drawingIndex) => {
    return createVehicleIcon(drawingIndex + 1, drawVehicle());
  });
  assertUniqueVehicleSvgMarkup(icons);
  return Object.freeze(icons);
}

function drawBombard(): string {
  return [
    paintCutout(`${circlePath(11, 15, 8)}${circlePath(11, 15, 4.2)}M17 11H40V16.4H17Z`),
    paint(circlePath(43.2, 17.6, 2.1)),
    paint(circlePath(46.4, 20.2, 1.9)),
    paint(circlePath(42.4, 21.4, 1.9)),
  ].join('');
}

function drawFieldGun(): string {
  return [
    paint('M1.4 8H8.4V15.6H1.4Z'),
    paint('M6 5H42V11.4H6Z'),
    paint('M40 3.6H47.6V12.8H40Z'),
    wheel(17, 17.2, 6.2, 2.4),
    wheel(34, 17.2, 6.2, 2.4),
  ].join('');
}

function drawTrebuchet(): string {
  return [
    paint('M2 22.4H48V25.6H2Z'),
    paint('M4 10H13V22.4H4Z'),
    paint('M18 23L28 5H31.2L22.2 23Z'),
    paint('M35 23L30 7.2H33.2L39.4 23Z'),
    paint('M7 12.2L42 14.4L41 17.6L8 15.4Z'),
    paint(circlePath(45, 18.2, 3)),
  ].join('');
}

function drawJibCrane(): string {
  return [
    paint('M3 25H47V27.8H3Z'),
    paint('M5 24L34 4.2L37.6 7.4L9.6 26.2Z'),
    wheel(40, 6, 3.3, 1.4),
    paint('M22 25.6L29 11H32.2L26.6 25.6Z'),
    paint('M36 25.6L31.4 13H34.4L40 25.6Z'),
    paint('M39.2 9.2V15.6H40.8V9.2Z'),
    paint('M37.4 15.6H42.4V17.3H37.4Z'),
  ].join('');
}

function drawDerrick(): string {
  return [
    paint('M8 25.4H42V28H8Z'),
    paint('M17 25.2L22.6 6.2H25.2L20.6 25.2Z'),
    paint('M33 25.2L27.4 6.2H24.8L29.4 25.2Z'),
    paint('M17.4 13.6L31.2 19.4L29.8 21.2L16.2 15.2Z'),
    paint('M17 21.2L31.4 14.2L32.8 16L18.4 22.8Z'),
    wheel(24.8, 5, 2.9, 1.2),
  ].join('');
}

function drawBatteringRam(): string {
  return [
    paint('M0.6 11.6H44.5V16.6H0.6Z'),
    paint('M44.5 11.6L49.2 14.1L44.5 16.6Z'),
    paint('M6 21.4L13.2 5.8H16.2L10.2 21.4Z'),
    paint('M24.4 21.4L17.2 5.8H14.2L20.2 21.4Z'),
    paint('M11 5.8H19.4V8.8H11Z'),
    wheel(15.2, 24.2, 3.8, 1.5),
    paint('M27 21.4L34.2 5.8H37.2L31.2 21.4Z'),
    paint('M45.4 21.4L38.2 5.8H35.2L41.2 21.4Z'),
    paint('M32 5.8H40.4V8.8H32Z'),
    wheel(36.2, 24.2, 3.8, 1.5),
  ].join('');
}

function drawSupplyWagon(): string {
  return [
    paint('M7 4.2H43V14.2H7Z'),
    paint('M4.5 14.2H45.5V17.8H4.5Z'),
    wheel(13, 22.8, 4.4, 1.7),
    wheel(25, 22.8, 4.4, 1.7),
    wheel(37, 22.8, 4.4, 1.7),
  ].join('');
}

function drawSiegeTower(): string {
  return [
    paint('M15 1.8H35V6.8H15Z'),
    paint('M17.2 6.8L12.6 27.2H17.4L21.2 6.8Z'),
    paint('M32.8 6.8L37.4 27.2H32.6L28.8 6.8Z'),
    paint('M14 14.6H36V17.4H14Z'),
    paint('M18 8L33.2 15.2L31.4 17L16.4 9.6Z'),
    paint('M18.2 16.8L33.4 9.2L35 11L20.2 18.4Z'),
  ].join('');
}

function drawMangonel(): string {
  return [
    paint('M6 27.2L19.6 15H23.2L11.2 27.2Z'),
    paint('M44 27.2L30.4 15H26.8L38.8 27.2Z'),
    paint('M22.2 27.2H27.8V14.6H22.2Z'),
    paint('M17.5 16.8L38.5 4.2L41.6 7.6L21.6 19.4Z'),
    paint('M36.6 2H46.2V7.2H40.8L37 10.4H36.6Z'),
  ].join('');
}

function drawLongBarrelTank(): string {
  return [
    paint('M31 6.2H48.5V9H31Z'),
    paint('M16 5H32.5V12.4H16Z'),
    paint('M20 3.2H26.2V5H20Z'),
    paint('M6 12.4H42V18H6Z'),
    paintCutout(
      [
        'M4 18H44.5V24.6H4Z',
        circlePath(11, 21.3, 1.7),
        circlePath(18, 21.3, 1.7),
        circlePath(25, 21.3, 1.7),
        circlePath(32, 21.3, 1.7),
        circlePath(39, 21.3, 1.7),
      ].join(''),
    ),
  ].join('');
}

function drawRoundedTank(): string {
  return [
    paint('M32 7.6H47.4V11.4H32Z'),
    paint('M15 5.8H33.2V13H15Z'),
    paint('M5 22.2C7 22.2 9.2 14.2 17 13H33C40 14.4 44.5 18 44.5 22.2Z'),
    wheel(15, 23.6, 4, 1.6),
    wheel(34, 23.6, 4, 1.6),
  ].join('');
}

function drawAntennaVan(): string {
  return [
    paint('M8 2H10.2V12H8Z'),
    paintCutout(['M4 12.4H24L30 9.6H35.5L42 15.2V21.2H4Z', 'M25 12.6H31.2L34.6 15.6H26.6Z'].join('')),
    wheel(14, 23.6, 4.1, 1.6),
    wheel(33, 23.6, 4.1, 1.6),
  ].join('');
}

function drawRoofGunJeep(): string {
  return [
    paint('M8.4 1.6H10.2V8H8.4Z'),
    paint('M13.5 4.6H21V8H13.5Z'),
    paint('M21 5.1H31.5V7H21Z'),
    paint('M11 9.2H22.5V13H11Z'),
    paint('M3 13.4H18L28 16.6H42V21.4H3Z'),
    wheel(13, 23.8, 4.3, 1.7),
    wheel(33, 23.8, 4.3, 1.7),
  ].join('');
}

function drawBoxTruck(): string {
  return [
    paintCutout(['M2 13H16V22H2Z', 'M4.2 15H13V19H4.2Z'].join('')),
    paint('M16 3.6H47.5V22H16Z'),
    wheel(9, 24.4, 3.5, 1.4),
    wheel(27, 24.4, 3.5, 1.4),
    wheel(40, 24.4, 3.5, 1.4),
  ].join('');
}

function drawMissileTruck(): string {
  return [
    paint('M2 15.6H14.5V23H2Z'),
    paint('M14.5 19H42V23H14.5Z'),
    paint('M16 17.6L41 3L43.6 5.8L18.6 20.2Z'),
    paint('M15.4 21L37.5 7.4L39.8 9.8L17.6 23.4Z'),
    wheel(9, 25.2, 3.3, 1.3),
    wheel(31, 25.2, 3.3, 1.3),
  ].join('');
}

function drawArmoredCar(): string {
  return [
    paint('M2 17.2L11 12.6H19V8.4H32V12.6L46 17.2V22H2Z'),
    paint(circlePath(25.5, 9.6, 2.6)),
    wheel(14, 23.8, 4.5, 1.8),
    wheel(36, 23.8, 4.5, 1.8),
  ].join('');
}

function drawGunTruck(): string {
  return [
    paint('M0.4 10.2H16V13.6H0.4Z'),
    paint('M14 7H18.2V16.2H14Z'),
    paint('M7 16H24V21.2H7Z'),
    paint('M22 11.6H34V21.2H22Z'),
    paint('M34 15H45.6V21.2H34Z'),
    wheel(15, 24, 4, 1.6),
    wheel(37, 24, 4, 1.6),
  ].join('');
}

function drawOnager(): string {
  return [
    paint('M8 21.6H34V26.2H8Z'),
    paint('M28 15.2H32.4V26.2H28Z'),
    paint('M8 17.4H16.4V26.2H8Z'),
    paint('M14.2 20.6L41.5 5.4L43.6 7.8L17.4 22.8Z'),
  ].join('');
}

function drawSweptJet(): string {
  return paint(
    'M46.8 15L34 11.8L22 4.8L14 9.2L9 12.4L15 15L9 17.6L14 20.8L22 25.2L34 18.2Z',
  );
}

function drawFighterJet(): string {
  return [
    paint('M12 14.2H34L47.5 15L34 15.8H12L7.5 15Z'),
    paint('M24 14.3L7 3.6H13.5L32 14.1Z'),
    paint('M24 15.7L7 26.4H13.5L32 15.9Z'),
    paint('M16 14.3L6 8.6H10.4L20 14.2Z'),
    paint('M16 15.7L6 21.4H10.4L20 15.8Z'),
  ].join('');
}

function drawDeltaDart(): string {
  return paint('M2 2.4L48.5 15L2 27.6L16.5 15Z');
}

function drawRotorcraftTop(): string {
  return [
    paint('M6 13.2H40V16.8H6Z'),
    paint('M40 13.2L48.4 15L40 16.8Z'),
    paint('M3.2 10.6H9.4V19.4H3.2Z'),
    paint('M22 14L7.2 2.2H12.2L26.2 12.8Z'),
    paint('M28 14L42.8 2.2H47.6L30 12.8Z'),
    paint('M22 16L7.2 27.8H12.2L26.2 17.2Z'),
    paint('M28 16L42.8 27.8H47.6L30 17.2Z'),
  ].join('');
}

function drawHelicopterSide(): string {
  return [
    paint('M2.4 8.4H8V18H2.4Z'),
    paint('M0.4 10.6H3.6V14.4H0.4Z'),
    paint('M6 15H26V18.4H6Z'),
    paint('M24 7.2H27.2V16H24Z'),
    paint('M7 5.6H44.5V8.6H7Z'),
    paint('M22 14.2H38L44.8 18.2V22.4H28.5L22 18.2Z'),
    paint('M16 23.4H45V25H16Z'),
    paint('M20 22.2H22.2V23.6H20Z'),
    paint('M40 22.2H42.2V23.6H40Z'),
  ].join('');
}

function drawFinnedRocket(): string {
  return [
    paint('M16 11.2H34L47.6 15L34 18.8H16Z'),
    paint('M16 11.2L2.4 2.2H9.2L18.4 11.2Z'),
    paint('M16 18.8L2.4 27.8H9.2L18.4 18.8Z'),
    paint('M24 11.2L18 6.4H21.4L26.2 11.2Z'),
    paint('M24 18.8L18 23.6H21.4L26.2 18.8Z'),
  ].join('');
}

function drawElevatedCannon(): string {
  return [
    paint('M4 22.4H24V26.8H4Z'),
    wheel(27.2, 24, 3.5, 1.3),
    paint('M8 20.2L32.6 5.8L37.6 10.6L13.4 24.4Z'),
    paint('M31 3H44.6V9.8L37.6 10.6L32.6 5.8Z'),
    paint('M16 23.2L30 15.2H33L20.6 25.6Z'),
  ].join('');
}

function drawSpokedWheelCannon(): string {
  return [
    wheel(14, 18, 8.2, 3.5),
    paint('M13.1 15H14.9V21H13.1Z'),
    paint('M10.6 17.1H17.4V18.9H10.6Z'),
    paint('M18.4 12.6L47.2 3L48.8 5.6L20.8 15.6Z'),
    paint('M5.2 19.6C1.4 23.4 3.2 27.6 11.2 27.2L10.2 25C5.2 25 4.6 22.8 7.6 20.6Z'),
  ].join('');
}

const ARMY_VEHICLE_ICONS = buildArmyVehicleIcons();

export function listArmyVehicleIcons(): readonly ArmyFormationIcon[] {
  return ARMY_VEHICLE_ICONS;
}
