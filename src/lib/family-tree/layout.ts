import type {
  FamilyTreeConnection,
  FamilyTreeEndpointDirection,
  FamilyTreePerson,
  FamilyTreeScene,
} from '@/lib/family-tree/scene';

export const FAMILY_TREE_SCENE_MIN_WIDTH = 1024;
export const FAMILY_TREE_SCENE_TOP_PADDING = 32;
export const FAMILY_TREE_CONTENT_LEFT = 104;
export const FAMILY_TREE_PERSON_WIDTH = 116;
export const FAMILY_TREE_PERSON_HEIGHT = 112;
export const FAMILY_TREE_AVATAR_SIZE = 72;
export const FAMILY_TREE_PERSON_AVATAR_OFFSET_X = 22;
export const FAMILY_TREE_PERSON_AVATAR_OFFSET_Y = 10;
export const FAMILY_TREE_PERSON_NAME_OFFSET_Y = 87;
export const FAMILY_TREE_PERSON_NAME_HEIGHT = 20;
export const FAMILY_TREE_GENERATION_ROW_HEIGHT = 161;
export const FAMILY_TREE_CONNECTION_MIN_WIDTH = 24;
export const FAMILY_TREE_CONNECTION_HANDLE_SIZE = 16;
export const FAMILY_TREE_ENDPOINT_LENGTH = 16;
export const FAMILY_TREE_VERTICAL_ENDPOINT_LENGTH = 24.5;
export const FAMILY_TREE_EDGE_PADDING = 24;
export const FAMILY_TREE_CONNECTION_COLOR = '#b66b38';
export const FAMILY_TREE_CONNECTION_STROKE_WIDTH = 2;

export type FamilyTreePoint = {
  x: number;
  y: number;
};

export type FamilyTreeSegment = {
  start: FamilyTreePoint;
  end: FamilyTreePoint;
};

export type FamilyTreeBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function assertFiniteNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite number greater than or equal to 0, received ${String(value)}.`);
  }
}

function assertPerson(person: FamilyTreePerson): void {
  if (!person || typeof person !== 'object') {
    throw new Error(`Family tree person must be an object, received ${String(person)}.`);
  }

  assertFiniteNonNegative(person.x, `Family tree person ${JSON.stringify(person.id)} x`);
  if (!Number.isInteger(person.generation) || person.generation < 0 || person.generation > 3) {
    throw new Error(
      `Family tree person ${JSON.stringify(person.id)} generation must be an integer from 0 to 3, received ${String(person.generation)}.`,
    );
  }
}

function assertConnection(connection: FamilyTreeConnection): void {
  if (!connection || typeof connection !== 'object') {
    throw new Error(`Family tree connection must be an object, received ${String(connection)}.`);
  }

  assertFiniteNonNegative(connection.x, `Family tree connection ${JSON.stringify(connection.id)} x`);
  if (!Number.isInteger(connection.gap) || connection.gap < 0 || connection.gap > 2) {
    throw new Error(
      `Family tree connection ${JSON.stringify(connection.id)} gap must be an integer from 0 to 2, received ${String(connection.gap)}.`,
    );
  }
  if (!Number.isFinite(connection.width) || connection.width < FAMILY_TREE_CONNECTION_MIN_WIDTH) {
    throw new Error(
      `Family tree connection ${JSON.stringify(connection.id)} width must be at least ${FAMILY_TREE_CONNECTION_MIN_WIDTH}, received ${String(connection.width)}.`,
    );
  }
}

export function familyTreePersonBox(person: FamilyTreePerson): FamilyTreeBox {
  assertPerson(person);

  return {
    x: FAMILY_TREE_CONTENT_LEFT + person.x,
    y: FAMILY_TREE_SCENE_TOP_PADDING + person.generation * FAMILY_TREE_GENERATION_ROW_HEIGHT,
    width: FAMILY_TREE_PERSON_WIDTH,
    height: FAMILY_TREE_PERSON_HEIGHT,
  };
}

export function familyTreeAvatarBox(person: FamilyTreePerson): FamilyTreeBox {
  const personBox = familyTreePersonBox(person);

  return {
    x: personBox.x + FAMILY_TREE_PERSON_AVATAR_OFFSET_X,
    y: personBox.y + FAMILY_TREE_PERSON_AVATAR_OFFSET_Y,
    width: FAMILY_TREE_AVATAR_SIZE,
    height: FAMILY_TREE_AVATAR_SIZE,
  };
}

export function familyTreePersonNameBox(person: FamilyTreePerson): FamilyTreeBox {
  const personBox = familyTreePersonBox(person);

  return {
    x: personBox.x,
    y: personBox.y + FAMILY_TREE_PERSON_NAME_OFFSET_Y,
    width: personBox.width,
    height: FAMILY_TREE_PERSON_NAME_HEIGHT,
  };
}

export function familyTreeConnectionY(gap: FamilyTreeConnection['gap']): number {
  if (!Number.isInteger(gap) || gap < 0 || gap > 2) {
    throw new Error(`Family tree connection gap must be an integer from 0 to 2, received ${String(gap)}.`);
  }

  const firstPersonY = FAMILY_TREE_SCENE_TOP_PADDING + gap * FAMILY_TREE_GENERATION_ROW_HEIGHT;
  const rowGap = FAMILY_TREE_GENERATION_ROW_HEIGHT - FAMILY_TREE_PERSON_HEIGHT;
  return firstPersonY + FAMILY_TREE_PERSON_HEIGHT + rowGap / 2;
}

export function familyTreeEndpointSegment(
  person: FamilyTreePerson,
  direction: FamilyTreeEndpointDirection,
): FamilyTreeSegment {
  const personBox = familyTreePersonBox(person);
  const centerX = personBox.x + personBox.width / 2;
  const centerY = personBox.y + personBox.height / 2;

  if (direction === 'top') {
    return {
      start: { x: centerX, y: personBox.y },
      end: { x: centerX, y: personBox.y - FAMILY_TREE_VERTICAL_ENDPOINT_LENGTH },
    };
  }

  if (direction === 'bottom') {
    return {
      start: { x: centerX, y: personBox.y + personBox.height },
      end: { x: centerX, y: personBox.y + personBox.height + FAMILY_TREE_VERTICAL_ENDPOINT_LENGTH },
    };
  }

  if (direction === 'left') {
    return {
      start: { x: personBox.x, y: centerY },
      end: { x: personBox.x - FAMILY_TREE_ENDPOINT_LENGTH, y: centerY },
    };
  }

  if (direction === 'right') {
    return {
      start: { x: personBox.x + personBox.width, y: centerY },
      end: { x: personBox.x + personBox.width + FAMILY_TREE_ENDPOINT_LENGTH, y: centerY },
    };
  }

  throw new Error(`Family tree endpoint direction is invalid, received ${JSON.stringify(direction)}.`);
}

export function familyTreeSceneSize(scene: FamilyTreeScene): { width: number; height: number } {
  if (!scene || typeof scene !== 'object') {
    throw new Error(`Family tree scene must be an object, received ${String(scene)}.`);
  }
  if (!Array.isArray(scene.generations) || scene.generations.length !== 4) {
    throw new Error(
      `Family tree scene generations must contain exactly 4 arrays, received ${String(scene.generations)}.`,
    );
  }
  if (!Array.isArray(scene.connections)) {
    throw new Error(`Family tree scene connections must be an array, received ${String(scene.connections)}.`);
  }

  let width = FAMILY_TREE_SCENE_MIN_WIDTH;
  for (const person of scene.generations.flat()) {
    const personBox = familyTreePersonBox(person);
    width = Math.max(width, personBox.x + personBox.width + FAMILY_TREE_EDGE_PADDING);
  }

  for (const connection of scene.connections) {
    assertConnection(connection);
    width = Math.max(
      width,
      FAMILY_TREE_CONTENT_LEFT + connection.x + connection.width + FAMILY_TREE_EDGE_PADDING,
    );
  }

  return {
    width,
    height: FAMILY_TREE_SCENE_TOP_PADDING + 4 * FAMILY_TREE_GENERATION_ROW_HEIGHT,
  };
}
