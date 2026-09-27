export type ArmyFormationIcon = {
  id: string;
  svgMarkup: string;
};

const animalOutlineOpen =
  '<g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">';
const animalOutlineClose = '</g>';

function expectedAnimalIconId(index: number): string {
  if (!Number.isInteger(index) || index < 0 || index > 29) {
    throw new Error(`Army animal icon index is outside 0..29: ${index}`);
  }
  return `animal-${31 + index}`;
}

function knobCrossedBonesMarkup(): string {
  return [
    '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">',
    '<path d="M3.4 17.4 L13.2 27.2"/>',
    '<path d="M3.4 27.2 L13.2 17.4"/>',
    '<path d="M36.8 17.4 L46.6 27.2"/>',
    '<path d="M36.8 27.2 L46.6 17.4"/>',
    '</g>',
    '<g fill="currentColor">',
    '<circle cx="3.4" cy="17.4" r="1.45"/>',
    '<circle cx="13.2" cy="27.2" r="1.45"/>',
    '<circle cx="3.4" cy="27.2" r="1.45"/>',
    '<circle cx="13.2" cy="17.4" r="1.45"/>',
    '<circle cx="36.8" cy="17.4" r="1.45"/>',
    '<circle cx="46.6" cy="27.2" r="1.45"/>',
    '<circle cx="36.8" cy="27.2" r="1.45"/>',
    '<circle cx="46.6" cy="17.4" r="1.45"/>',
    '</g>',
  ].join('');
}

function notchCrossedBonesMarkup(): string {
  return [
    '<g fill="none" stroke="currentColor" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round">',
    '<path d="M2.6 18.2 L14.4 28"/>',
    '<path d="M1.4 19.6 L3.8 16.8"/>',
    '<path d="M13.2 28.8 L15.8 26.4"/>',
    '<path d="M2.6 28 L14.4 18.2"/>',
    '<path d="M1.4 26.6 L3.8 29.4"/>',
    '<path d="M13.2 17.2 L15.8 19.6"/>',
    '<path d="M47.4 18.2 L35.6 28"/>',
    '<path d="M48.6 19.6 L46.2 16.8"/>',
    '<path d="M36.8 28.8 L34.2 26.4"/>',
    '<path d="M47.4 28 L35.6 18.2"/>',
    '<path d="M48.6 26.6 L46.2 29.4"/>',
    '<path d="M36.8 17.2 L34.2 19.6"/>',
    '</g>',
  ].join('');
}

function elephantHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M23 7.2 C16.4 5.2 13.6 11 16.4 15.6 C18 18 20.6 16.8 21.8 14.6"/>',
    '<path d="M27 7.2 C33.6 5.2 36.4 11 33.6 15.6 C32 18 29.4 16.8 28.2 14.6"/>',
    '<path d="M22.2 9.4 C21.2 13.2 22.2 16.4 23.6 18"/>',
    '<path d="M27.8 9.4 C28.8 13.2 27.8 16.4 26.4 18"/>',
    '<path d="M24.2 13.2 C23.2 18.4 23.4 23.2 25 27.2"/>',
    '<path d="M25.8 13.2 C26.8 18.4 26.6 23.2 25 27.2"/>',
    '<path d="M22.4 18.2 C20.4 21.6 21.2 25 23.4 24.2"/>',
    '<path d="M27.6 18.2 C29.6 21.6 28.8 25 26.6 24.2"/>',
    animalOutlineClose,
    '<circle cx="22.6" cy="11.4" r="0.7" fill="currentColor"/>',
    '<circle cx="27.4" cy="11.4" r="0.7" fill="currentColor"/>',
  ].join('');
}

function stagHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M21.4 11.2 L18.2 3.2"/>',
    '<path d="M19.4 6.2 L16.6 5"/>',
    '<path d="M20.2 8.6 L17.6 9.8"/>',
    '<path d="M28.6 11.2 L31.8 3.2"/>',
    '<path d="M30.6 6.2 L33.4 5"/>',
    '<path d="M29.8 8.6 L32.4 9.8"/>',
    '<path d="M22.2 11.6 C20.2 14.4 19.6 18.6 21.2 23.2 C22.6 26.4 27.4 26.4 28.8 23.2 C30.4 18.6 29.8 14.4 27.8 11.6"/>',
    '<path d="M21.2 12.6 C19.2 14 19 16.2 20.8 16"/>',
    '<path d="M28.8 12.6 C30.8 14 31 16.2 29.2 16"/>',
    animalOutlineClose,
    '<circle cx="23.3" cy="16.2" r="0.65" fill="currentColor"/>',
    '<circle cx="26.7" cy="16.2" r="0.65" fill="currentColor"/>',
    '<circle cx="25" cy="24.4" r="0.55" fill="currentColor"/>',
  ].join('');
}

function goatHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M22.4 13.4 C17.6 10.2 15.4 6 18 2.6 C20.2 1.2 21.2 4 20.2 7" stroke-width="2.3"/>',
    '<path d="M27.6 13.4 C32.4 10.2 34.6 6 32 2.6 C29.8 1.2 28.8 4 29.8 7" stroke-width="2.3"/>',
    '<path d="M21.4 13.4 C19.2 17.4 19.6 22.4 22.2 25.6 C23.6 27.2 26.4 27.2 27.8 25.6 C30.4 22.4 30.8 17.4 28.6 13.4"/>',
    '<path d="M24.2 26.8 L25 29.4 L25.8 26.8"/>',
    animalOutlineClose,
    '<circle cx="23.2" cy="17.6" r="0.65" fill="currentColor"/>',
    '<circle cx="26.8" cy="17.6" r="0.65" fill="currentColor"/>',
  ].join('');
}

function foxHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M20.6 13.2 L17.2 6.2 L23.4 11.6"/>',
    '<path d="M29.4 13.2 L32.8 6.2 L26.6 11.6"/>',
    '<path d="M20.2 13.4 L18.2 18.2 L22.2 23.4 L25 26.4 L27.8 23.4 L31.8 18.2 L29.8 13.4"/>',
    '<path d="M21.4 18.6 L18.2 17.8"/>',
    '<path d="M21.2 20.4 L18 20.6"/>',
    '<path d="M28.6 18.6 L31.8 17.8"/>',
    '<path d="M28.8 20.4 L32 20.6"/>',
    animalOutlineClose,
    '<circle cx="23" cy="16.2" r="0.6" fill="currentColor"/>',
    '<circle cx="27" cy="16.2" r="0.6" fill="currentColor"/>',
    '<circle cx="25" cy="25.2" r="0.7" fill="currentColor"/>',
  ].join('');
}

function lionHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M25 4 L22.2 7 L18 5.4 L17.2 9.4 L13.8 11.2 L16.2 14.4 L14 17.6 L17.2 19.6 L16.2 23.4 L20.2 23.2 L22.4 27.2 L25 25.2 L27.6 27.2 L29.8 23.2 L33.8 23.4 L32.8 19.6 L36 17.6 L33.8 14.4 L36.2 11.2 L32.8 9.4 L32 5.4 L27.8 7 Z"/>',
    '<path d="M21.2 13.4 C20.4 16.6 21.2 20.8 25 23 C28.8 20.8 29.6 16.6 28.8 13.4 C27.4 12.2 22.6 12.2 21.2 13.4"/>',
    '<path d="M23.4 19.8 L25 22 L26.6 19.8"/>',
    animalOutlineClose,
    '<circle cx="23.2" cy="16.2" r="0.6" fill="currentColor"/>',
    '<circle cx="26.8" cy="16.2" r="0.6" fill="currentColor"/>',
  ].join('');
}

function bearHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<circle cx="19" cy="7" r="2.35"/>',
    '<circle cx="31" cy="7" r="2.35"/>',
    '<path d="M18.2 9.4 C14 11.2 13.4 17.6 16.2 22.4 C18.6 26.8 21.8 28.2 25 28.2 C28.2 28.2 31.4 26.8 33.8 22.4 C36.6 17.6 36 11.2 31.8 9.4 C29.2 8 20.8 8 18.2 9.4"/>',
    '<ellipse cx="25" cy="22.2" rx="4.3" ry="3"/>',
    '<path d="M23.2 23.4 H26.8"/>',
    animalOutlineClose,
    '<circle cx="22.2" cy="15.2" r="0.7" fill="currentColor"/>',
    '<circle cx="27.8" cy="15.2" r="0.7" fill="currentColor"/>',
    '<ellipse cx="25" cy="21.2" rx="1.3" ry="0.9" fill="currentColor"/>',
  ].join('');
}

function wolfHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M21.2 12.6 L18.6 4.2 L24.2 11.4"/>',
    '<path d="M28.8 12.6 L31.4 4.2 L25.8 11.4"/>',
    '<path d="M20.2 13 C17.4 16.4 17.8 21 21.2 24.2 L25 27.6 L28.8 24.2 C32.2 21 32.6 16.4 29.8 13 C28 11.4 22 11.4 20.2 13"/>',
    '<path d="M21.6 15.6 L19.8 17.8"/>',
    '<path d="M28.4 15.6 L30.2 17.8"/>',
    animalOutlineClose,
    '<circle cx="22.8" cy="16.2" r="0.6" fill="currentColor"/>',
    '<circle cx="27.2" cy="16.2" r="0.6" fill="currentColor"/>',
    '<circle cx="25" cy="26.2" r="0.75" fill="currentColor"/>',
  ].join('');
}

function sheepHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M20.4 11.2 C17.6 9.2 17.8 6 20.8 6.6 C21.4 4.2 24 3.6 25 5.4 C26 3.6 28.6 4.2 29.2 6.6 C32.2 6 32.4 9.2 29.6 11.2"/>',
    '<path d="M18.6 12.4 C15.2 14.2 15.6 18.6 18.8 18"/>',
    '<path d="M31.4 12.4 C34.8 14.2 34.4 18.6 31.2 18"/>',
    '<path d="M20.6 12.4 C18.6 16.4 19.2 21.6 22.2 24.6 C23.6 26.2 26.4 26.2 27.8 24.6 C30.8 21.6 31.4 16.4 29.4 12.4"/>',
    animalOutlineClose,
    '<circle cx="23" cy="16.4" r="0.65" fill="currentColor"/>',
    '<circle cx="27" cy="16.4" r="0.65" fill="currentColor"/>',
    '<ellipse cx="25" cy="22.2" rx="1.5" ry="1" fill="currentColor"/>',
  ].join('');
}

function bullHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M18.6 15.2 C13.2 13.4 11.4 8.2 14.6 5.6" stroke-width="2.3"/>',
    '<path d="M31.4 15.2 C36.8 13.4 38.6 8.2 35.4 5.6" stroke-width="2.3"/>',
    '<path d="M18.2 15.4 C15.2 18.8 15.6 23.4 19 26.2 C21.6 28.4 28.4 28.4 31 26.2 C34.4 23.4 34.8 18.8 31.8 15.4 C29.2 13.2 20.8 13.2 18.2 15.4"/>',
    '<path d="M22 22.8 C23.2 24.4 26.8 24.4 28 22.8"/>',
    '<path d="M23.2 23.6 V25"/>',
    '<path d="M26.8 23.6 V25"/>',
    animalOutlineClose,
    '<circle cx="22.2" cy="17.8" r="0.65" fill="currentColor"/>',
    '<circle cx="27.8" cy="17.8" r="0.65" fill="currentColor"/>',
  ].join('');
}

function spiderMarkup(): string {
  return [
    '<ellipse cx="25" cy="16.2" rx="3.3" ry="4.8" fill="currentColor"/>',
    '<g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round">',
    '<path d="M22.4 13 C17.2 10.2 13.4 7.6 10.6 5.6"/>',
    '<path d="M22.2 15.2 C15.8 14.4 12 15.2 9.2 16.8"/>',
    '<path d="M22.4 18 C16.4 20.6 13.2 23.6 11.2 26.2"/>',
    '<path d="M23.2 20 C19.4 23.2 17.8 25.8 19.2 27.6"/>',
    '<path d="M27.6 13 C32.8 10.2 36.6 7.6 39.4 5.6"/>',
    '<path d="M27.8 15.2 C34.2 14.4 38 15.2 40.8 16.8"/>',
    '<path d="M27.6 18 C33.6 20.6 36.8 23.6 38.8 26.2"/>',
    '<path d="M26.8 20 C30.6 23.2 32.2 25.8 30.8 27.6"/>',
    animalOutlineClose,
  ].join('');
}

function eagleHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M25 4.4 C20 5.2 17 9.6 17.6 14.2 C15.4 16.4 16.8 22.2 21.4 25.2 C23.2 26.8 26.8 26.8 28.6 25.2 C33.2 22.2 34.6 16.4 32.4 14.2 C33 9.6 30 5.2 25 4.4"/>',
    '<path d="M20.2 12.4 L23 13.6"/>',
    '<path d="M29.8 12.4 L27 13.6"/>',
    '<path d="M18.4 18.6 L21.2 20.4"/>',
    '<path d="M31.6 18.6 L28.8 20.4"/>',
    '<path d="M19.2 21.6 L21.8 22.6"/>',
    '<path d="M30.8 21.6 L28.2 22.6"/>',
    animalOutlineClose,
    '<path d="M22.6 13.2 C24 17.4 23.4 20.6 26.4 22.6 C24.2 20.2 25.2 16.8 27.4 13.2 C26.2 15.2 23.8 15.2 22.6 13.2 Z" fill="currentColor"/>',
    '<circle cx="21.2" cy="12.2" r="0.7" fill="currentColor"/>',
    '<circle cx="28.8" cy="12.2" r="0.7" fill="currentColor"/>',
  ].join('');
}

function snakeHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M25 4.2 L18.8 11 L17.6 17.2 L21.8 24.4 L25 26.2 L28.2 24.4 L32.4 17.2 L31.2 11 Z"/>',
    '<path d="M21.2 8.6 H23.4"/>',
    '<path d="M26.6 8.6 H28.8"/>',
    '<path d="M21.6 12.8 H23.4"/>',
    '<path d="M26.6 12.8 H28.4"/>',
    '<path d="M25 26.2 L23.4 29.2"/>',
    '<path d="M25 26.2 L26.6 29.2"/>',
    animalOutlineClose,
    '<circle cx="22.2" cy="15.4" r="0.7" fill="currentColor"/>',
    '<circle cx="27.8" cy="15.4" r="0.7" fill="currentColor"/>',
  ].join('');
}

function boarHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M21.6 11.6 C20 9.2 21.8 8 23.2 10.4"/>',
    '<path d="M28.4 11.6 C30 9.2 28.2 8 26.8 10.4"/>',
    '<path d="M20.6 11.6 C18.8 15 19.4 19.2 21.6 21.4 L21.4 26.6 L28.6 26.6 L28.4 21.4 C30.6 19.2 31.2 15 29.4 11.6 C27.4 10 22.6 10 20.6 11.6"/>',
    '<path d="M21.4 22.6 H28.6"/>',
    '<path d="M21.4 24.8 H28.6"/>',
    '<path d="M21.2 20.4 C16.4 16.8 15.6 22.4 19.8 24.2"/>',
    '<path d="M28.8 20.4 C33.6 16.8 34.4 22.4 30.2 24.2"/>',
    animalOutlineClose,
    '<circle cx="23.2" cy="15.2" r="0.55" fill="currentColor"/>',
    '<circle cx="26.8" cy="15.2" r="0.55" fill="currentColor"/>',
  ].join('');
}

function tigerHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M20.4 9.4 C18.8 6.2 21 4.2 22.6 6.6 C22.2 8.2 21.2 9.4 20.4 9.4"/>',
    '<path d="M29.6 9.4 C31.2 6.2 29 4.2 27.4 6.6 C27.8 8.2 28.8 9.4 29.6 9.4"/>',
    '<path d="M19.4 10.6 C16.6 13.8 16.8 19.6 19.6 23.4 C22 26.6 28 26.6 30.4 23.4 C33.2 19.6 33.4 13.8 30.6 10.6 C28.4 8.8 21.6 8.8 19.4 10.6"/>',
    '<path d="M23.2 9 L23.8 12.8"/>',
    '<path d="M25 8.2 L25 13.2"/>',
    '<path d="M26.8 9 L26.2 12.8"/>',
    '<path d="M18.8 16.2 L21.4 17"/>',
    '<path d="M18.6 18.4 L21.6 18.4"/>',
    '<path d="M31.2 16.2 L28.6 17"/>',
    '<path d="M31.4 18.4 L28.4 18.4"/>',
    '<path d="M20.4 20.6 L17.6 19.8"/>',
    '<path d="M20.4 22 L17.4 22.6"/>',
    '<path d="M29.6 20.6 L32.4 19.8"/>',
    '<path d="M29.6 22 L32.6 22.6"/>',
    animalOutlineClose,
    '<circle cx="22.6" cy="15.6" r="0.65" fill="currentColor"/>',
    '<circle cx="27.4" cy="15.6" r="0.65" fill="currentColor"/>',
    '<path d="M24 21.8 L25 23.4 L26 21.8 Z" fill="currentColor"/>',
  ].join('');
}

function ramHeadMarkup(): string {
  return [
    animalOutlineOpen,
    '<path d="M21.8 12.4 C14.6 9.8 11.6 14 13.8 18.6 C16 23.2 21.4 21.2 21.8 16.6 C22 13.8 19.4 12.8 17.6 14.6"/>',
    '<path d="M28.2 12.4 C35.4 9.8 38.4 14 36.2 18.6 C34 23.2 28.6 21.2 28.2 16.6 C28 13.8 30.6 12.8 32.4 14.6"/>',
    '<path d="M22.2 13.6 C20.4 17 20.6 21.8 22.8 24.6 C24 26.4 26 26.4 27.2 24.6 C29.4 21.8 29.6 17 27.8 13.6"/>',
    animalOutlineClose,
    '<circle cx="23.6" cy="17.4" r="0.6" fill="currentColor"/>',
    '<circle cx="26.4" cy="17.4" r="0.6" fill="currentColor"/>',
    '<ellipse cx="25" cy="22.6" rx="1.3" ry="0.85" fill="currentColor"/>',
  ].join('');
}

function animalIcon(iconId: string, boneMarkup: string, creatureMarkup: string): ArmyFormationIcon {
  if (!/^animal-(3[1-9]|[45][0-9]|60)$/.test(iconId)) {
    throw new Error(`Army formation animal icon id is outside animal-31..animal-60: ${iconId}`);
  }
  if (boneMarkup.includes('currentColor') === false) {
    throw new Error(`Army formation bones are not drawn in currentColor: ${iconId}`);
  }
  if (creatureMarkup.includes('currentColor') === false) {
    throw new Error(`Army formation creature is not drawn in currentColor: ${iconId}`);
  }
  const svgMarkup = `<svg viewBox="0 0 50 30">${boneMarkup}${creatureMarkup}</svg>`;
  if (svgMarkup.includes('http') || svgMarkup.includes('<image')) {
    throw new Error(`Army formation animal icon must stay local and inline: ${iconId} ${svgMarkup}`);
  }
  return { id: iconId, svgMarkup };
}

function buildArmyAnimalIconsPart2(): ArmyFormationIcon[] {
  const knobBones = knobCrossedBonesMarkup();
  const notchBones = notchCrossedBonesMarkup();
  return [
    animalIcon('animal-31', knobBones, elephantHeadMarkup()),
    animalIcon('animal-32', knobBones, stagHeadMarkup()),
    animalIcon('animal-33', knobBones, goatHeadMarkup()),
    animalIcon('animal-34', knobBones, foxHeadMarkup()),
    animalIcon('animal-35', knobBones, lionHeadMarkup()),
    animalIcon('animal-36', knobBones, bearHeadMarkup()),
    animalIcon('animal-37', knobBones, wolfHeadMarkup()),
    animalIcon('animal-38', knobBones, sheepHeadMarkup()),
    animalIcon('animal-39', knobBones, bullHeadMarkup()),
    animalIcon('animal-40', knobBones, spiderMarkup()),
    animalIcon('animal-41', knobBones, eagleHeadMarkup()),
    animalIcon('animal-42', knobBones, snakeHeadMarkup()),
    animalIcon('animal-43', knobBones, boarHeadMarkup()),
    animalIcon('animal-44', knobBones, tigerHeadMarkup()),
    animalIcon('animal-45', knobBones, ramHeadMarkup()),
    animalIcon('animal-46', notchBones, elephantHeadMarkup()),
    animalIcon('animal-47', notchBones, stagHeadMarkup()),
    animalIcon('animal-48', notchBones, goatHeadMarkup()),
    animalIcon('animal-49', notchBones, foxHeadMarkup()),
    animalIcon('animal-50', notchBones, lionHeadMarkup()),
    animalIcon('animal-51', notchBones, bearHeadMarkup()),
    animalIcon('animal-52', notchBones, wolfHeadMarkup()),
    animalIcon('animal-53', notchBones, sheepHeadMarkup()),
    animalIcon('animal-54', notchBones, bullHeadMarkup()),
    animalIcon('animal-55', notchBones, spiderMarkup()),
    animalIcon('animal-56', notchBones, eagleHeadMarkup()),
    animalIcon('animal-57', notchBones, snakeHeadMarkup()),
    animalIcon('animal-58', notchBones, boarHeadMarkup()),
    animalIcon('animal-59', notchBones, tigerHeadMarkup()),
    animalIcon('animal-60', notchBones, ramHeadMarkup()),
  ];
}

function assertArmyAnimalIconList(icons: readonly ArmyFormationIcon[]): void {
  if (icons.length !== 30) {
    throw new Error(`Army animal icon part 2 count is not 30: ${icons.length}`);
  }
  const seenMarkup = new Set<string>();
  for (let index = 0; index < icons.length; index += 1) {
    const icon = icons[index];
    const expectedId = expectedAnimalIconId(index);
    if (icon.id !== expectedId) {
      throw new Error(`Army animal icon at index ${index} has id ${icon.id}, expected ${expectedId}`);
    }
    if (seenMarkup.has(icon.svgMarkup)) {
      throw new Error(`Duplicate army animal icon shape for id: ${icon.id}`);
    }
    seenMarkup.add(icon.svgMarkup);
    if (icon.svgMarkup.includes('viewBox="0 0 50 30"') === false) {
      throw new Error(`Army animal icon is missing the 50 by 30 viewBox: ${icon.id}`);
    }
  }
}

export function listArmyAnimalIconsPart2(): readonly ArmyFormationIcon[] {
  const icons = buildArmyAnimalIconsPart2();
  assertArmyAnimalIconList(icons);
  return icons;
}
