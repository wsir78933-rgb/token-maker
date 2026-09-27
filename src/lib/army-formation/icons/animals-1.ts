export type ArmyFormationIcon = {
  id: string;
  svgMarkup: string;
};

const ANIMAL_ICON_COUNT = 30;
const ANIMAL_HEAD_COUNT = 15;

function animalIconId(order: number): string {
  if (!Number.isInteger(order) || order < 1 || order > ANIMAL_ICON_COUNT) {
    throw new Error(`Army formation animal icon order is out of range: ${order}`);
  }

  return `animal-${String(order).padStart(2, '0')}`;
}

function animalEyeMarkup(leftX: number, rightX: number, y: number): string {
  if (leftX >= rightX) {
    throw new Error(`Army formation animal eyes are out of order: ${leftX}, ${rightX}`);
  }

  return `<circle cx="${leftX}" cy="${y}" r="0.7" fill="currentColor" stroke="none"/><circle cx="${rightX}" cy="${y}" r="0.7" fill="currentColor" stroke="none"/>`;
}

function wrapArmyIconSvg(innerMarkup: string): string {
  if (innerMarkup.includes('http') || innerMarkup.includes('<image')) {
    throw new Error(`Army formation animal icon markup is not allowed: ${innerMarkup}`);
  }

  return `<svg viewBox="0 0 50 30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${innerMarkup}</svg>`;
}

function sidePennantMarkup(): string {
  return '<path d="M4 17 L11 22 L4 27 Z" fill="currentColor" stroke="none"/><path d="M46 17 L39 22 L46 27 Z" fill="currentColor" stroke="none"/>';
}

function withSidePennants(headMarkup: string): string {
  return `${headMarkup}${sidePennantMarkup()}`;
}

function buildArmyAnimalIcon(order: number, innerMarkup: string): ArmyFormationIcon {
  if (innerMarkup.trim() === '') {
    throw new Error(`Army formation animal icon ${order} has empty markup`);
  }

  return {
    id: animalIconId(order),
    svgMarkup: wrapArmyIconSvg(innerMarkup),
  };
}

function elephantHeadMarkup(): string {
  return `<ellipse cx="17" cy="12" rx="6.5" ry="7"/><ellipse cx="33" cy="12" rx="6.5" ry="7"/><ellipse cx="25" cy="12" rx="5" ry="5.5"/>${animalEyeMarkup(23, 27, 11)}<path d="M24 17 C24 22 21 24 22 28"/><path d="M26 17 C26 22 29 24 28 28"/><path d="M22 27 Q25 29 28 27"/>`;
}

function stagHeadMarkup(): string {
  return `<path d="M19 11 L16 3"/><path d="M16 6 L13 5"/><path d="M16 8 L13 10"/><path d="M31 11 L34 3"/><path d="M34 6 L37 5"/><path d="M34 8 L37 10"/><path d="M20 12 L17 10 L20 15"/><path d="M30 12 L33 10 L30 15"/><path d="M20 13 Q25 11 30 13 L31 20 Q25 26 19 20 Z"/>${animalEyeMarkup(22, 28, 16)}`;
}

function longhornHeadMarkup(): string {
  return `<path d="M19 12 C14 5 17 1 20 3"/><path d="M31 12 C36 5 33 1 30 3"/><path d="M17 13 Q25 9 33 13 L32 21 Q25 27 18 21 Z"/>${animalEyeMarkup(22, 28, 16)}<path d="M23 22 Q25 24 27 22"/>`;
}

function foxHeadMarkup(): string {
  return `<path d="M18 12 L12 2 L24 12"/><path d="M32 12 L38 2 L26 12"/><path d="M17 13 Q25 11 33 13 L30 22 Q25 28 20 22 Z"/>${animalEyeMarkup(21, 29, 16)}<path d="M25 19 L25 22"/>`;
}

function lionHeadMarkup(): string {
  return `<path d="M25 4 C22 4 20 6 18 5 C15 4 13 7 14 10 C11 11 10 15 13 17 C11 20 14 23 17 22 C18 26 22 26 24 24 C26 27 31 26 32 22 C36 23 38 19 36 16 C39 14 38 10 35 9 C36 6 33 4 30 5 C28 3 26 4 25 4"/><ellipse cx="25" cy="14" rx="5" ry="5"/>${animalEyeMarkup(23, 27, 13)}<path d="M25 17 L25 20"/><path d="M23 23 Q25 28 27 23"/>`;
}

function bearHeadMarkup(): string {
  return `<circle cx="16" cy="8" r="3"/><circle cx="34" cy="8" r="3"/><ellipse cx="25" cy="16" rx="9" ry="8"/><ellipse cx="25" cy="19.5" rx="3.2" ry="2.4"/>${animalEyeMarkup(21, 29, 15)}<path d="M25 18 L25 20.2"/>`;
}

function wolfHeadMarkup(): string {
  return `<path d="M20 11 L18 2 L24 10"/><path d="M30 11 L32 2 L26 10"/><path d="M18 12 Q25 9 32 12 L33 17 Q29 20 25 20 Q21 20 17 17 Z"/><path d="M21 19 L20 26 Q25 28 30 26 L29 19"/>${animalEyeMarkup(22, 28, 14)}<path d="M23 25 L27 25"/>`;
}

function camelHeadMarkup(): string {
  return `<path d="M16 9 Q12 7 15 13"/><path d="M34 9 Q38 7 35 13"/><path d="M18 11 Q25 8 32 11 L34 18 Q31 25 25 26 Q19 25 16 18 Z"/>${animalEyeMarkup(22, 28, 14)}<path d="M22 22 L22 25"/><path d="M28 22 L28 25"/>`;
}

function bullHeadMarkup(): string {
  return `<path d="M18 13 C10 8 7 15 11 17"/><path d="M32 13 C40 8 43 15 39 17"/><path d="M18 14 Q25 11 32 14 L33 22 Q25 28 17 22 Z"/>${animalEyeMarkup(22, 28, 17)}<path d="M22 23 Q25 25 28 23"/>`;
}

function spiderMarkup(): string {
  return `<ellipse cx="25" cy="18" rx="3.6" ry="4.4" fill="currentColor" stroke="none"/><circle cx="25" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M23 12 L15 6 L11 5"/><path d="M22.5 13 L13 12 L8 13"/><path d="M22.5 15 L13 18 L9 22"/><path d="M23.5 18 L16 23 L14 28"/><path d="M27 12 L35 6 L39 5"/><path d="M27.5 13 L37 12 L42 13"/><path d="M27.5 15 L37 18 L41 22"/><path d="M26.5 18 L34 23 L36 28"/>`;
}

function eagleHeadMarkup(): string {
  return `<path d="M17 14 Q16 6 25 7 Q34 6 33 14 Q35 18 31 20 Q25 17 19 20 Q15 18 17 14"/><path d="M22 15 L28 15 L27 20 Q25 22 23 20 Z"/>${animalEyeMarkup(21, 29, 12)}<path d="M18 19 Q15 23 20 22"/><path d="M32 19 Q35 23 30 22"/>`;
}

function snakeHeadMarkup(): string {
  return `<path d="M15 14 Q25 5 35 14 L31 20 Q25 24 19 20 Z"/><path d="M21 13 L21 17"/><path d="M29 13 L29 17"/><path d="M25 21 L25 25"/><path d="M25 25 L16 29"/><path d="M25 25 L34 29"/>`;
}

function saberCatHeadMarkup(): string {
  return `<path d="M19 12 L15 3 L24 11"/><path d="M31 12 L35 3 L26 11"/><path d="M18 12 Q25 10 32 12 L31 19 Q25 23 19 19 Z"/><path d="M21 19 Q25 22 29 19"/><path d="M22 19 L21 27"/><path d="M28 19 L29 27"/>${animalEyeMarkup(22, 28, 15)}`;
}

function tigerHeadMarkup(): string {
  return `<circle cx="17" cy="9" r="2.8"/><circle cx="33" cy="9" r="2.8"/><ellipse cx="25" cy="16" rx="8" ry="7"/><path d="M22 8 L21.2 12"/><path d="M25 7 L25 12"/><path d="M28 8 L28.8 12"/><path d="M18 15 L21 16"/><path d="M32 15 L29 16"/><ellipse cx="25" cy="20" rx="2.8" ry="2"/>${animalEyeMarkup(21.5, 28.5, 15)}`;
}

function ramHeadMarkup(): string {
  return `<path d="M20 14 C12 5 9 15 15 18 C18 19 18 14 16 13"/><path d="M30 14 C38 5 41 15 35 18 C32 19 32 14 34 13"/><path d="M20 15 Q25 12 30 15 L31 22 Q25 27 19 22 Z"/>${animalEyeMarkup(22, 28, 18)}`;
}

function listAnimalHeadMarkup(): readonly string[] {
  const headMarkup = [
    elephantHeadMarkup(),
    stagHeadMarkup(),
    longhornHeadMarkup(),
    foxHeadMarkup(),
    lionHeadMarkup(),
    bearHeadMarkup(),
    wolfHeadMarkup(),
    camelHeadMarkup(),
    bullHeadMarkup(),
    spiderMarkup(),
    eagleHeadMarkup(),
    snakeHeadMarkup(),
    saberCatHeadMarkup(),
    tigerHeadMarkup(),
    ramHeadMarkup(),
  ];

  if (headMarkup.length !== ANIMAL_HEAD_COUNT) {
    throw new Error(
      `Army formation animal head count is ${headMarkup.length}, expected ${ANIMAL_HEAD_COUNT}`,
    );
  }

  return headMarkup;
}

function buildPlainAnimalIcons(headMarkup: readonly string[]): ArmyFormationIcon[] {
  return headMarkup.map((innerMarkup, index) => buildArmyAnimalIcon(index + 1, innerMarkup));
}

function buildPennantAnimalIcons(headMarkup: readonly string[]): ArmyFormationIcon[] {
  return headMarkup.map((innerMarkup, index) =>
    buildArmyAnimalIcon(index + headMarkup.length + 1, withSidePennants(innerMarkup)),
  );
}

function assertAnimalIconList(icons: readonly ArmyFormationIcon[]): readonly ArmyFormationIcon[] {
  if (icons.length !== ANIMAL_ICON_COUNT) {
    throw new Error(
      `Army formation animal icon count is ${icons.length}, expected ${ANIMAL_ICON_COUNT}`,
    );
  }

  const seenMarkup = new Set<string>();

  icons.forEach((icon, index) => {
    const expectedId = animalIconId(index + 1);

    if (icon.id !== expectedId) {
      throw new Error(`Army formation animal icon id is ${icon.id}, expected ${expectedId}`);
    }

    if (seenMarkup.has(icon.svgMarkup)) {
      throw new Error(`Army formation animal icon shape is duplicated: ${icon.id}`);
    }

    if (!icon.svgMarkup.includes('viewBox="0 0 50 30"')) {
      throw new Error(
        `Army formation animal icon ${icon.id} is missing viewBox="0 0 50 30": ${icon.svgMarkup}`,
      );
    }

    if (!icon.svgMarkup.includes('currentColor')) {
      throw new Error(
        `Army formation animal icon ${icon.id} is missing currentColor: ${icon.svgMarkup}`,
      );
    }

    if (icon.svgMarkup.includes('http') || icon.svgMarkup.includes('<image')) {
      throw new Error(
        `Army formation animal icon ${icon.id} has a forbidden reference: ${icon.svgMarkup}`,
      );
    }

    seenMarkup.add(icon.svgMarkup);
  });

  return icons;
}

function freezeAnimalIcons(icons: readonly ArmyFormationIcon[]): readonly ArmyFormationIcon[] {
  return Object.freeze(icons.map((icon) => Object.freeze(icon)));
}

export function listArmyAnimalIconsPart1(): readonly ArmyFormationIcon[] {
  const headMarkup = listAnimalHeadMarkup();
  const icons = [...buildPlainAnimalIcons(headMarkup), ...buildPennantAnimalIcons(headMarkup)];

  return freezeAnimalIcons(assertAnimalIconList(icons));
}
