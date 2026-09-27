export type ArmyFormationIcon = {
  id: string;
  svgMarkup: string;
};

const WEAPON_ICON_COUNT = 23;

const WEAPON_BODY_BUILDERS = [
  weapon01CrossedHandAxes,
  weapon02ThreeSpears,
  weapon03PlainCrossedBlades,
  weapon04CrossedMorningStars,
  weapon05CrossedFlails,
  weapon06ThreeSwords,
  weapon07TwoCrossedSwords,
  weapon08CrossedBroadAxes,
  weapon09CrossedBeardedAxes,
  weapon10CrossedLeafSwords,
  weapon11CrossedSabers,
  weapon12CrossedHornedAxes,
  weapon13BowAndArrow,
  weapon14Crossbow,
  weapon15ThreeHeaterShields,
  weapon16ThreePaviseShields,
  weapon17CurvedMagazineRifle,
  weapon18CarryHandleRifle,
  weapon19BullpupRifle,
  weapon20ScopedRifle,
  weapon21Revolver,
  weapon22Pistol,
  weapon23SubmachineGun,
] as const;

export function listArmyWeaponIcons(): readonly ArmyFormationIcon[] {
  const weaponIcons = buildWeaponIcons();
  assertWeaponIcons(weaponIcons);
  return freezeWeaponIcons(weaponIcons);
}

function buildWeaponIcons(): ArmyFormationIcon[] {
  if (WEAPON_BODY_BUILDERS.length !== WEAPON_ICON_COUNT) {
    throw new Error(
      `weapon body builder count must be ${WEAPON_ICON_COUNT}, received ${WEAPON_BODY_BUILDERS.length}`,
    );
  }

  return WEAPON_BODY_BUILDERS.map((buildBody, index) => buildWeaponIcon(buildBody, index));
}

function buildWeaponIcon(buildBody: () => string, index: number): ArmyFormationIcon {
  const weaponNumber = index + 1;
  return {
    id: weaponId(weaponNumber),
    svgMarkup: weaponSvg(buildBody()),
  };
}

function weaponId(weaponNumber: number): string {
  return `weapon-${String(weaponNumber).padStart(2, '0')}`;
}

function freezeWeaponIcons(weaponIcons: ArmyFormationIcon[]): readonly ArmyFormationIcon[] {
  return Object.freeze(weaponIcons);
}

function assertWeaponIcons(weaponIcons: readonly ArmyFormationIcon[]): void {
  if (weaponIcons.length !== WEAPON_ICON_COUNT) {
    throw new Error(`weapon icon count must be ${WEAPON_ICON_COUNT}, received ${weaponIcons.length}`);
  }

  const seenIds = new Set<string>();
  const seenMarkup = new Set<string>();

  for (const weaponIcon of weaponIcons) {
    assertWeaponIcon(weaponIcon, seenIds, seenMarkup);
  }

  for (let weaponNumber = 1; weaponNumber <= WEAPON_ICON_COUNT; weaponNumber += 1) {
    const id = weaponId(weaponNumber);
    if (!seenIds.has(id)) {
      throw new Error(`weapon icon id is missing: ${id}`);
    }
  }
}

function assertWeaponIcon(
  weaponIcon: ArmyFormationIcon,
  seenIds: Set<string>,
  seenMarkup: Set<string>,
): void {
  if (!/^weapon-(0[1-9]|1\d|2[0-3])$/.test(weaponIcon.id)) {
    throw new Error(`weapon icon id must be weapon-01 through weapon-23, received ${weaponIcon.id}`);
  }

  if (seenIds.has(weaponIcon.id)) {
    throw new Error(`weapon icon id is duplicated: ${weaponIcon.id}`);
  }

  seenIds.add(weaponIcon.id);
  assertWeaponSvg(weaponIcon.id, weaponIcon.svgMarkup);

  if (seenMarkup.has(weaponIcon.svgMarkup)) {
    throw new Error(`weapon icon svg markup is duplicated for ${weaponIcon.id}`);
  }

  seenMarkup.add(weaponIcon.svgMarkup);
}

function assertWeaponSvg(id: string, svgMarkup: string): void {
  if (!svgMarkup.includes('viewBox="0 0 50 30"')) {
    throw new Error(`weapon icon ${id} svg is missing viewBox="0 0 50 30"`);
  }

  if (!svgMarkup.includes('currentColor')) {
    throw new Error(`weapon icon ${id} svg is missing currentColor`);
  }

  if (svgMarkup.includes('http')) {
    throw new Error(`weapon icon ${id} svg contains http`);
  }

  if (svgMarkup.toLowerCase().includes('<image')) {
    throw new Error(`weapon icon ${id} svg contains <image>`);
  }

  if (svgMarkup.includes('NaN') || svgMarkup.includes('Infinity')) {
    throw new Error(`weapon icon ${id} svg contains a non-finite number`);
  }
}

function weaponSvg(body: string): string {
  if (body.trim() === '') {
    throw new Error('weapon svg body is empty');
  }

  if (body.includes('<svg') || body.includes('</svg')) {
    throw new Error(`weapon svg body must not include its own svg tag, received ${body}`);
  }

  const svgMarkup = `<svg viewBox="0 0 50 30" fill="currentColor">${body}</svg>`;
  assertWeaponSvg('wrapper', svgMarkup);
  return svgMarkup;
}

function joinMarkup(parts: readonly string[]): string {
  if (parts.length === 0) {
    throw new Error('weapon markup parts are empty');
  }

  for (const part of parts) {
    if (part.trim() === '') {
      throw new Error('weapon markup part is empty');
    }
  }

  return parts.join('');
}

function weapon01CrossedHandAxes(): string {
  return joinMarkup([
    barPolygon(16, 12, 40, 27, 2.2),
    barPolygon(34, 12, 10, 27, 2.2),
    `<polygon points="16,6 16,11 6,14 3,8 6,3"/>`,
    `<polygon points="34,6 34,11 44,14 47,8 44,3"/>`,
  ]);
}

function weapon02ThreeSpears(): string {
  return joinMarkup([
    spearShaftMarkup(25, 3, 25, 27),
    spearShaftMarkup(8, 6, 42, 24),
    spearShaftMarkup(42, 6, 8, 24),
  ]);
}

function weapon03PlainCrossedBlades(): string {
  return joinMarkup([
    barPolygon(7, 7, 43, 23, 3.2),
    barPolygon(43, 7, 7, 23, 3.2),
  ]);
}

function weapon04CrossedMorningStars(): string {
  return joinMarkup([
    barPolygon(14, 12, 40, 26, 2),
    barPolygon(36, 12, 10, 26, 2),
    starMarkup(12, 8, 5.4, 3, 8),
    starMarkup(38, 8, 5.4, 3, 8),
  ]);
}

function weapon05CrossedFlails(): string {
  return joinMarkup([
    barPolygon(25, 2, 25, 7, 2.2),
    `<path d="M25,7 Q13,11 10,19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1.1 1.7"/>`,
    `<path d="M25,7 Q37,11 40,19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1.1 1.7"/>`,
    starMarkup(10, 23, 4.8, 2.6, 9),
    starMarkup(40, 23, 4.8, 2.6, 9),
  ]);
}

function weapon06ThreeSwords(): string {
  return joinMarkup([
    straightSwordMarkup(10, 25, 40, 4, 1.6, 6.5),
    straightSwordMarkup(40, 25, 10, 4, 1.6, 6.5),
    straightSwordMarkup(25, 27, 25, 3, 2.1, 12),
  ]);
}

function weapon07TwoCrossedSwords(): string {
  return joinMarkup([
    straightSwordMarkup(8, 26, 42, 4, 2.1, 8),
    straightSwordMarkup(42, 26, 8, 4, 2.1, 8),
  ]);
}

function weapon08CrossedBroadAxes(): string {
  return joinMarkup([
    barPolygon(19, 15, 40, 28, 2.6),
    barPolygon(31, 15, 10, 28, 2.6),
    `<polygon points="20,4 20,15 5,18 1,9 5,1"/>`,
    `<polygon points="30,4 30,15 45,18 49,9 45,1"/>`,
  ]);
}

function weapon09CrossedBeardedAxes(): string {
  return joinMarkup([
    barPolygon(17, 12, 39, 27, 2.1),
    barPolygon(33, 12, 11, 27, 2.1),
    `<path d="M18,4 C10,3 4,5 3,9 C2,14 5,18 9,19 L12,12 L18,11 Z"/>`,
    `<path d="M32,4 C40,3 46,5 47,9 C48,14 45,18 41,19 L38,12 L32,11 Z"/>`,
  ]);
}

function weapon10CrossedLeafSwords(): string {
  return joinMarkup([
    leafSwordMarkup(8, 25, 42, 5),
    leafSwordMarkup(42, 25, 8, 5),
  ]);
}

function weapon11CrossedSabers(): string {
  return joinMarkup([
    `<path d="M9,26 C18,20 22,14 41,4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`,
    `<path d="M41,26 C32,20 28,14 9,4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`,
    `<path d="M9,26 C3,23 3,17 11,18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    `<path d="M41,26 C47,23 47,17 39,18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    diskMarkup(9, 26.2, 1.3),
    diskMarkup(41, 26.2, 1.3),
  ]);
}

function weapon12CrossedHornedAxes(): string {
  return joinMarkup([
    barPolygon(16, 13, 40, 27, 2.2),
    barPolygon(34, 13, 10, 27, 2.2),
    `<path d="M17,12 L15,3 L11,7 L7,2 L3,8 C4,13 8,16 17,13 Z"/>`,
    `<path d="M33,12 L35,3 L39,7 L43,2 L47,8 C46,13 42,16 33,13 Z"/>`,
  ]);
}

function weapon13BowAndArrow(): string {
  return joinMarkup([
    `<path d="M20,3 Q6,15 20,27" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>`,
    `<path d="M20,3 L20,27" fill="none" stroke="currentColor" stroke-width="1"/>`,
    barPolygon(40, 24, 16, 8, 1.15),
    spearTipMarkup(11, 4, 40, 24, 4),
    `<polygon points="36,22 42,22 40,26"/>`,
    `<polygon points="38,25 44,24 40,28"/>`,
  ]);
}

function weapon14Crossbow(): string {
  return joinMarkup([
    barPolygon(7, 24, 40, 10, 3.3),
    `<path d="M26,3 Q44,11 33,21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    `<path d="M26,3 L33,21" fill="none" stroke="currentColor" stroke-width="1"/>`,
    barPolygon(28, 16, 46, 8, 1.1),
    spearTipMarkup(47, 7, 28, 16, 2.8),
  ]);
}

function weapon15ThreeHeaterShields(): string {
  return joinMarkup([
    heaterShieldMarkup(3, 5, 16, 21),
    heaterShieldMarkup(31, 5, 16, 21),
    heaterShieldMarkup(15, 3, 20, 24),
  ]);
}

function weapon16ThreePaviseShields(): string {
  return joinMarkup([
    paviseShieldMarkup(2, 3, 13, 24),
    paviseShieldMarkup(18.5, 3, 13, 24),
    paviseShieldMarkup(35, 3, 13, 24),
  ]);
}

function weapon17CurvedMagazineRifle(): string {
  return joinMarkup([
    `<polygon points="2,12 10,10 22,10 22,12 47,12 47,14.5 22,15 22,17 10,17 3,16"/>`,
    `<path d="M14,16 L19,16 Q21,22 16,27 Q10,26 11,21 Q12,17 14,16 Z"/>`,
    `<polygon points="44,8.5 47,8.5 47,12 44,12"/>`,
    barPolygon(22, 9.2, 42, 9.2, 1.15),
  ]);
}

function weapon18CarryHandleRifle(): string {
  return joinMarkup([
    `<polygon points="2,13 9,11 24,11 24,13 46,13 46,15 24,15 24,17 9,17 3,16"/>`,
    `<polygon points="12,6 22,6 22,8 12,8"/>`,
    `<polygon points="12,8 14,8 14,11 12,11"/>`,
    `<polygon points="20,8 22,8 22,11 20,11"/>`,
    `<polygon points="15,17 20,17 20,27 15,27"/>`,
    `<polygon points="9,17 13,17 12,24 8,23"/>`,
  ]);
}

function weapon19BullpupRifle(): string {
  return joinMarkup([
    `<polygon points="2,11 24,11 24,13 48,13 48,15 24,16 24,18 4,18 2,15"/>`,
    `<polygon points="5,18 10,18 10,27 5,27"/>`,
    `<polygon points="12,18 16,18 15,25 11,24"/>`,
    `<polygon points="30,10 34,10 34,13 30,13"/>`,
  ]);
}

function weapon20ScopedRifle(): string {
  return joinMarkup([
    `<polygon points="2,13 14,12 18,14 48,14 48,16 18,16 14,19 4,18"/>`,
    `<polygon points="5,18 9,17 10,24 6,24"/>`,
    `<rect x="16" y="7" width="16" height="3.6" rx="1.2"/>`,
    `<polygon points="20,10.6 22,14 24,14 22,10.6"/>`,
    `<polygon points="46,12 48,12 48,14 46,14"/>`,
  ]);
}

function weapon21Revolver(): string {
  return joinMarkup([
    `<polygon points="26,8 45,8 45,12.5 26,12.5"/>`,
    `<circle cx="21.5" cy="11" r="4.3" fill="none" stroke="currentColor" stroke-width="2.2"/>`,
    `<polygon points="15,13 22,13 20,27 12,25"/>`,
    `<polygon points="15,10 17,5.5 21,8 18,11"/>`,
    `<path d="M18,14 Q17,19 23,17.5" fill="none" stroke="currentColor" stroke-width="1.2"/>`,
  ]);
}

function weapon22Pistol(): string {
  return joinMarkup([
    `<polygon points="16,7 44,7 44,12 28,12 26,14 16,14"/>`,
    `<polygon points="16,14 25,14 23,27 14,26"/>`,
    `<path d="M25,15 Q24,20 31,18" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
    `<polygon points="40,7 43,5 44,7"/>`,
  ]);
}

function weapon23SubmachineGun(): string {
  return joinMarkup([
    `<polygon points="6,8 34,8 34,14 6,14"/>`,
    `<polygon points="2,10 6,10 6,14 2,14"/>`,
    `<polygon points="34,9.5 48,9.5 48,12.5 34,12.5"/>`,
    `<polygon points="14,14 20,14 20,27 14,27"/>`,
    `<polygon points="22,14 26,14 25,22 21,21"/>`,
    `<path d="M26,15 Q27,19 31,16.5" fill="none" stroke="currentColor" stroke-width="1.2"/>`,
  ]);
}

function spearShaftMarkup(startX: number, startY: number, endX: number, endY: number): string {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const length = Math.hypot(deltaX, deltaY);

  if (length < 8) {
    throw new Error(
      `spear shaft length ${length} from ${startX},${startY} to ${endX},${endY} is too short`,
    );
  }

  const unitX = deltaX / length;
  const unitY = deltaY / length;
  const inset = 2.5;

  return joinMarkup([
    barPolygon(
      startX + unitX * inset,
      startY + unitY * inset,
      endX - unitX * inset,
      endY - unitY * inset,
      1.5,
    ),
    spearTipMarkup(startX, startY, endX, endY, 3),
    spearTipMarkup(endX, endY, startX, startY, 3),
  ]);
}

function straightSwordMarkup(
  hiltX: number,
  hiltY: number,
  pointX: number,
  pointY: number,
  bladeWidth: number,
  guardLength: number,
): string {
  const deltaX = pointX - hiltX;
  const deltaY = pointY - hiltY;
  const length = Math.hypot(deltaX, deltaY);

  if (length < 12) {
    throw new Error(`sword length ${length} from ${hiltX},${hiltY} to ${pointX},${pointY} is too short`);
  }

  const unitX = deltaX / length;
  const unitY = deltaY / length;
  const guardDistance = 6.2;
  const guardX = hiltX + unitX * guardDistance;
  const guardY = hiltY + unitY * guardDistance;
  const bladeEndX = pointX - unitX * 2.4;
  const bladeEndY = pointY - unitY * 2.4;

  return joinMarkup([
    barPolygon(hiltX, hiltY, guardX, guardY, bladeWidth * 0.65),
    barPolygon(guardX, guardY, bladeEndX, bladeEndY, bladeWidth),
    spearTipMarkup(pointX, pointY, hiltX, hiltY, 3.4),
    perpendicularBar(guardX, guardY, unitX, unitY, guardLength, 1.7),
    diskMarkup(hiltX - unitX * 1.3, hiltY - unitY * 1.3, 1.25),
  ]);
}

function leafSwordMarkup(hiltX: number, hiltY: number, pointX: number, pointY: number): string {
  const deltaX = pointX - hiltX;
  const deltaY = pointY - hiltY;
  const length = Math.hypot(deltaX, deltaY);

  if (length < 12) {
    throw new Error(
      `leaf sword length ${length} from ${hiltX},${hiltY} to ${pointX},${pointY} is too short`,
    );
  }

  const unitX = deltaX / length;
  const unitY = deltaY / length;
  const sideX = -unitY;
  const sideY = unitX;
  const guardDistance = 5.5;
  const guardX = hiltX + unitX * guardDistance;
  const guardY = hiltY + unitY * guardDistance;
  const bellyX = hiltX + deltaX * 0.78;
  const bellyY = hiltY + deltaY * 0.78;
  const halfWidth = 2.7;

  return joinMarkup([
    barPolygon(hiltX, hiltY, guardX, guardY, 1.45),
    `<polygon points="${svgPoint(guardX, guardY)} ${svgPoint(bellyX + sideX * halfWidth, bellyY + sideY * halfWidth)} ${svgPoint(pointX, pointY)} ${svgPoint(bellyX - sideX * halfWidth, bellyY - sideY * halfWidth)}"/>`,
    perpendicularBar(guardX, guardY, unitX, unitY, 6.5, 1.5),
    diskMarkup(hiltX - unitX * 1.2, hiltY - unitY * 1.2, 1.2),
  ]);
}

function heaterShieldMarkup(x: number, y: number, width: number, height: number): string {
  requirePositive(width, 'heater shield width');
  requirePositive(height, 'heater shield height');
  const right = x + width;
  const mid = x + width / 2;
  const shoulder = y + height * 0.58;
  const bottom = y + height;

  return `<path d="M${roundedSvgNumber(x)},${roundedSvgNumber(y)} H${roundedSvgNumber(right)} V${roundedSvgNumber(shoulder)} L${roundedSvgNumber(mid)},${roundedSvgNumber(bottom)} L${roundedSvgNumber(x)},${roundedSvgNumber(shoulder)} Z" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
}

function paviseShieldMarkup(x: number, y: number, width: number, height: number): string {
  requirePositive(width, 'pavise shield width');
  requirePositive(height, 'pavise shield height');

  return `<rect x="${roundedSvgNumber(x)}" y="${roundedSvgNumber(y)}" width="${roundedSvgNumber(width)}" height="${roundedSvgNumber(height)}" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/>`;
}

function barPolygon(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  thickness: number,
): string {
  requireFiniteNumber(startX, 'bar start x');
  requireFiniteNumber(startY, 'bar start y');
  requireFiniteNumber(endX, 'bar end x');
  requireFiniteNumber(endY, 'bar end y');
  requirePositive(thickness, 'bar thickness');

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const length = Math.hypot(deltaX, deltaY);

  if (length === 0) {
    throw new Error(`bar length is 0 from ${startX},${startY} to ${endX},${endY}`);
  }

  const offsetX = (-deltaY / length) * (thickness / 2);
  const offsetY = (deltaX / length) * (thickness / 2);

  return `<polygon points="${svgPoint(startX + offsetX, startY + offsetY)} ${svgPoint(endX + offsetX, endY + offsetY)} ${svgPoint(endX - offsetX, endY - offsetY)} ${svgPoint(startX - offsetX, startY - offsetY)}"/>`;
}

function perpendicularBar(
  centerX: number,
  centerY: number,
  directionX: number,
  directionY: number,
  length: number,
  thickness: number,
): string {
  requirePositive(length, 'perpendicular bar length');
  const directionLength = Math.hypot(directionX, directionY);

  if (directionLength === 0) {
    throw new Error(`perpendicular bar direction length is 0 at ${centerX},${centerY}`);
  }

  const sideX = -directionY / directionLength;
  const sideY = directionX / directionLength;
  const half = length / 2;

  return barPolygon(
    centerX + sideX * half,
    centerY + sideY * half,
    centerX - sideX * half,
    centerY - sideY * half,
    thickness,
  );
}

function spearTipMarkup(
  tipX: number,
  tipY: number,
  fromX: number,
  fromY: number,
  size: number,
): string {
  requireFiniteNumber(tipX, 'spear tip x');
  requireFiniteNumber(tipY, 'spear tip y');
  requireFiniteNumber(fromX, 'spear tip from x');
  requireFiniteNumber(fromY, 'spear tip from y');
  requirePositive(size, 'spear tip size');

  const deltaX = tipX - fromX;
  const deltaY = tipY - fromY;
  const length = Math.hypot(deltaX, deltaY);

  if (length === 0) {
    throw new Error(`spear tip direction length is 0 at ${tipX},${tipY}`);
  }

  const unitX = deltaX / length;
  const unitY = deltaY / length;
  const baseX = tipX - unitX * size;
  const baseY = tipY - unitY * size;
  const halfWidth = size * 0.42;
  const sideX = -unitY * halfWidth;
  const sideY = unitX * halfWidth;

  return `<polygon points="${svgPoint(tipX, tipY)} ${svgPoint(baseX + sideX, baseY + sideY)} ${svgPoint(baseX - sideX, baseY - sideY)}"/>`;
}

function starMarkup(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  spikeCount: number,
): string {
  requireFiniteNumber(centerX, 'star center x');
  requireFiniteNumber(centerY, 'star center y');
  requirePositive(outerRadius, 'star outer radius');
  requirePositive(innerRadius, 'star inner radius');

  if (!Number.isInteger(spikeCount) || spikeCount < 3) {
    throw new Error(`star spike count must be an integer >= 3, received ${spikeCount}`);
  }

  if (innerRadius >= outerRadius) {
    throw new Error(
      `star inner radius ${innerRadius} must be smaller than outer radius ${outerRadius}`,
    );
  }

  const points: string[] = [];

  for (let index = 0; index < spikeCount * 2; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (index * Math.PI) / spikeCount;
    points.push(svgPoint(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius));
  }

  return `<polygon points="${points.join(' ')}"/>`;
}

function diskMarkup(centerX: number, centerY: number, radius: number): string {
  requireFiniteNumber(centerX, 'disk center x');
  requireFiniteNumber(centerY, 'disk center y');
  requirePositive(radius, 'disk radius');

  return `<circle cx="${roundedSvgNumber(centerX)}" cy="${roundedSvgNumber(centerY)}" r="${roundedSvgNumber(radius)}"/>`;
}

function svgPoint(x: number, y: number): string {
  return `${roundedSvgNumber(x)},${roundedSvgNumber(y)}`;
}

function roundedSvgNumber(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error(`svg number must be finite, received ${value}`);
  }

  return (Math.round(value * 100) / 100).toString();
}

function requireFiniteNumber(value: number, label: string): number {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number, received ${value}`);
  }

  return value;
}

function requirePositive(value: number, label: string): number {
  requireFiniteNumber(value, label);

  if (value <= 0) {
    throw new Error(`${label} must be a positive number, received ${value}`);
  }

  return value;
}
