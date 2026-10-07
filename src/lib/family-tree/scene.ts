import {
  requireFamilyTreeAvatar,
  type FamilyTreeAvatar,
} from '@/lib/family-tree/avatar';

export const FAMILY_TREE_VERSION = 1 as const;
export const FAMILY_TREE_GENERATION_COUNT = 4 as const;
export const FAMILY_TREE_SAVE_SLOT_COUNT = 5 as const;
export const FAMILY_TREE_MIN_CONNECTION_WIDTH = 24;

export const FAMILY_TREE_ENDPOINT_DIRECTIONS = [
  'top',
  'bottom',
  'left',
  'right',
] as const;

export const FAMILY_TREE_ENDPOINT_STYLES = ['none', 'solid', 'dashed'] as const;

export type FamilyTreeGenerationIndex = 0 | 1 | 2 | 3;
export type FamilyTreeConnectionGap = 0 | 1 | 2;
export type FamilyTreeEndpointDirection =
  (typeof FAMILY_TREE_ENDPOINT_DIRECTIONS)[number];
export type FamilyTreeEndpointStyle = (typeof FAMILY_TREE_ENDPOINT_STYLES)[number];

export type FamilyTreePerson = {
  id: string;
  generation: FamilyTreeGenerationIndex;
  x: number;
  avatar: FamilyTreeAvatar;
  name: string;
  age: string;
  description: string;
  endpoints: Record<FamilyTreeEndpointDirection, FamilyTreeEndpointStyle>;
};

export type FamilyTreePersonDraft = Pick<
  FamilyTreePerson,
  'avatar' | 'name' | 'age' | 'description'
>;

export type FamilyTreeConnection = {
  id: string;
  gap: FamilyTreeConnectionGap;
  x: number;
  width: number;
};

export type FamilyTreeGenerations = readonly [
  readonly FamilyTreePerson[],
  readonly FamilyTreePerson[],
  readonly FamilyTreePerson[],
  readonly FamilyTreePerson[],
];

export type FamilyTreeScene = {
  version: typeof FAMILY_TREE_VERSION;
  generations: FamilyTreeGenerations;
  connections: readonly FamilyTreeConnection[];
  selectedPersonId: string | null;
  resizeEnabled: boolean;
};

type PlainRecord = Record<string, unknown>;

const GENERATION_INDICES: readonly FamilyTreeGenerationIndex[] = [0, 1, 2, 3];
const CONNECTION_GAPS: readonly FamilyTreeConnectionGap[] = [0, 1, 2];
const ENDPOINT_DIRECTIONS: readonly FamilyTreeEndpointDirection[] = [
  ...FAMILY_TREE_ENDPOINT_DIRECTIONS,
];
const ENDPOINT_STYLES: readonly FamilyTreeEndpointStyle[] = [
  ...FAMILY_TREE_ENDPOINT_STYLES,
];

function formatReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'symbol' ||
    typeof value === 'function'
  ) {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? String(value) : serialized;
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${reason})`;
  }
}

function requirePlainRecord(value: unknown, label: string): PlainRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object, received ${formatReceivedValue(value)}.`);
  }

  return value as PlainRecord;
}

function requireExactFields(
  record: PlainRecord,
  expectedFields: readonly string[],
  label: string,
): void {
  const actualFields = Object.keys(record).sort();
  const sortedExpectedFields = [...expectedFields].sort();

  if (
    actualFields.length !== sortedExpectedFields.length ||
    actualFields.some((field, index) => field !== sortedExpectedFields[index])
  ) {
    throw new Error(
      `${label} must contain exactly ${sortedExpectedFields.join(', ')}. Received ${formatReceivedValue(record)}.`,
    );
  }
}

function requireNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string, received ${formatReceivedValue(value)}.`);
  }

  return value;
}

function requireText(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${label} must be a string, received ${formatReceivedValue(value)}.`);
  }

  return value;
}

function requireFiniteNonNegativeNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error(
      `${label} must be a finite number greater than or equal to 0, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireConnectionWidth(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < FAMILY_TREE_MIN_CONNECTION_WIDTH
  ) {
    throw new Error(
      `Family tree connection width must be a finite number greater than or equal to ${FAMILY_TREE_MIN_CONNECTION_WIDTH}, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireVersion(value: unknown): typeof FAMILY_TREE_VERSION {
  if (value !== FAMILY_TREE_VERSION) {
    throw new Error(
      `Family tree scene version must be ${FAMILY_TREE_VERSION}, received ${formatReceivedValue(value)}.`,
    );
  }

  return FAMILY_TREE_VERSION;
}

function requireGenerationIndex(value: unknown): FamilyTreeGenerationIndex {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    GENERATION_INDICES.includes(value as FamilyTreeGenerationIndex)
  ) {
    return value as FamilyTreeGenerationIndex;
  }

  throw new Error(
    `Family tree generation must be an integer from 0 to 3, received ${formatReceivedValue(value)}.`,
  );
}

function requireConnectionGap(value: unknown): FamilyTreeConnectionGap {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    CONNECTION_GAPS.includes(value as FamilyTreeConnectionGap)
  ) {
    return value as FamilyTreeConnectionGap;
  }

  throw new Error(
    `Family tree connection gap must be an integer from 0 to 2, received ${formatReceivedValue(value)}.`,
  );
}

function requireEndpointDirection(value: unknown): FamilyTreeEndpointDirection {
  if (typeof value === 'string' && ENDPOINT_DIRECTIONS.includes(value as FamilyTreeEndpointDirection)) {
    return value as FamilyTreeEndpointDirection;
  }

  throw new Error(
    `Family tree endpoint direction must be one of ${ENDPOINT_DIRECTIONS.join(', ')}, received ${formatReceivedValue(value)}.`,
  );
}

function requireEndpointStyle(value: unknown): FamilyTreeEndpointStyle {
  if (typeof value === 'string' && ENDPOINT_STYLES.includes(value as FamilyTreeEndpointStyle)) {
    return value as FamilyTreeEndpointStyle;
  }

  throw new Error(
    `Family tree endpoint style must be one of ${ENDPOINT_STYLES.join(', ')}, received ${formatReceivedValue(value)}.`,
  );
}

function requireBoolean(value: unknown, label: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`${label} must be a boolean, received ${formatReceivedValue(value)}.`);
  }

  return value;
}

function requirePersonId(value: unknown): string {
  return requireNonEmptyString(value, 'Family tree person id');
}

function requireConnectionId(value: unknown): string {
  return requireNonEmptyString(value, 'Family tree connection id');
}

function initialEndpointStyles(): Record<
  FamilyTreeEndpointDirection,
  FamilyTreeEndpointStyle
> {
  return {
    top: 'none',
    bottom: 'none',
    left: 'none',
    right: 'none',
  };
}

function requireAvatar(value: unknown, label: string): FamilyTreeAvatar {
  try {
    return requireFamilyTreeAvatar(value);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`${label} is invalid: ${error.message}`, { cause: error });
    }

    throw error;
  }
}

function readEndpointStyles(value: unknown, personId: string): Record<
  FamilyTreeEndpointDirection,
  FamilyTreeEndpointStyle
> {
  const record = requirePlainRecord(value, `Family tree person ${JSON.stringify(personId)} endpoints`);
  requireExactFields(record, ENDPOINT_DIRECTIONS, `Family tree person ${JSON.stringify(personId)} endpoints`);

  return {
    top: requireEndpointStyle(record.top),
    bottom: requireEndpointStyle(record.bottom),
    left: requireEndpointStyle(record.left),
    right: requireEndpointStyle(record.right),
  };
}

function readFamilyTreePerson(value: unknown): FamilyTreePerson {
  const record = requirePlainRecord(value, 'Family tree person');
  requireExactFields(
    record,
    ['id', 'generation', 'x', 'avatar', 'name', 'age', 'description', 'endpoints'],
    'Family tree person',
  );

  const id = requirePersonId(record.id);

  return {
    id,
    generation: requireGenerationIndex(record.generation),
    x: requireFiniteNonNegativeNumber(record.x, `Family tree person ${JSON.stringify(id)} x`),
    avatar: requireAvatar(record.avatar, `Family tree person ${JSON.stringify(id)} avatar`),
    name: requireText(record.name, `Family tree person ${JSON.stringify(id)} name`),
    age: requireText(record.age, `Family tree person ${JSON.stringify(id)} age`),
    description: requireText(
      record.description,
      `Family tree person ${JSON.stringify(id)} description`,
    ),
    endpoints: readEndpointStyles(record.endpoints, id),
  };
}

function readFamilyTreeConnection(value: unknown): FamilyTreeConnection {
  const record = requirePlainRecord(value, 'Family tree connection');
  requireExactFields(record, ['id', 'gap', 'x', 'width'], 'Family tree connection');

  const id = requireConnectionId(record.id);
  return {
    id,
    gap: requireConnectionGap(record.gap),
    x: requireFiniteNonNegativeNumber(
      record.x,
      `Family tree connection ${JSON.stringify(id)} x`,
    ),
    width: requireConnectionWidth(record.width),
  };
}

function requireUniqueIds(
  people: readonly FamilyTreePerson[],
  connections: readonly FamilyTreeConnection[],
): void {
  const seenIds = new Set<string>();

  for (const person of people) {
    if (seenIds.has(person.id)) {
      throw new Error(`Family tree id ${JSON.stringify(person.id)} already exists.`);
    }

    seenIds.add(person.id);
  }

  for (const connection of connections) {
    if (seenIds.has(connection.id)) {
      throw new Error(`Family tree id ${JSON.stringify(connection.id)} already exists.`);
    }

    seenIds.add(connection.id);
  }
}

function requireGenerationTuple(value: unknown): FamilyTreeGenerations {
  if (!Array.isArray(value) || value.length !== FAMILY_TREE_GENERATION_COUNT) {
    const received = Array.isArray(value) ? value.length : value;
    throw new Error(
      `Family tree scene must contain ${FAMILY_TREE_GENERATION_COUNT} generations, received ${formatReceivedValue(received)}.`,
    );
  }

  const generations = GENERATION_INDICES.map((generation) => {
    const receivedPeople = value[generation];
    if (!Array.isArray(receivedPeople)) {
      throw new Error(
        `Family tree generation ${generation} must be an array, received ${formatReceivedValue(receivedPeople)}.`,
      );
    }

    return receivedPeople.map((personValue) => {
      const person = readFamilyTreePerson(personValue);
      if (person.generation !== generation) {
        throw new Error(
          `Family tree person ${JSON.stringify(person.id)} belongs to generation ${person.generation}, but was stored in generation ${generation}.`,
        );
      }

      return person;
    });
  });

  const firstGeneration = generations[0];
  const secondGeneration = generations[1];
  const thirdGeneration = generations[2];
  const fourthGeneration = generations[3];

  if (
    firstGeneration === undefined ||
    secondGeneration === undefined ||
    thirdGeneration === undefined ||
    fourthGeneration === undefined
  ) {
    throw new Error(
      `Family tree scene must contain ${FAMILY_TREE_GENERATION_COUNT} generations, received ${generations.length}.`,
    );
  }

  return [firstGeneration, secondGeneration, thirdGeneration, fourthGeneration];
}

function requireConnections(value: unknown): readonly FamilyTreeConnection[] {
  if (!Array.isArray(value)) {
    throw new Error(`Family tree connections must be an array, received ${formatReceivedValue(value)}.`);
  }

  return value.map(readFamilyTreeConnection);
}

function findPersonLocation(
  scene: FamilyTreeScene,
  personId: string,
): { generation: FamilyTreeGenerationIndex; personIndex: number } {
  for (const generation of GENERATION_INDICES) {
    const personIndex = scene.generations[generation].findIndex((person) => person.id === personId);
    if (personIndex !== -1) {
      return { generation, personIndex };
    }
  }

  throw new Error(`Family tree person id ${JSON.stringify(personId)} was not found.`);
}

function findConnectionIndex(scene: FamilyTreeScene, connectionId: string): number {
  const connectionIndex = scene.connections.findIndex((connection) => connection.id === connectionId);
  if (connectionIndex === -1) {
    throw new Error(`Family tree connection id ${JSON.stringify(connectionId)} was not found.`);
  }

  return connectionIndex;
}

function replacePerson(
  scene: FamilyTreeScene,
  personId: string,
  replace: (person: FamilyTreePerson) => FamilyTreePerson,
): FamilyTreeScene {
  const location = findPersonLocation(scene, personId);
  const generations = scene.generations.map((people, generation) => {
    if (generation !== location.generation) {
      return people;
    }

    return people.map((person, personIndex) =>
      personIndex === location.personIndex ? replace(person) : person,
    );
  }) as unknown as FamilyTreeGenerations;

  return {
    ...scene,
    generations,
  };
}

function replaceConnection(
  scene: FamilyTreeScene,
  connectionId: string,
  replace: (connection: FamilyTreeConnection) => FamilyTreeConnection,
): FamilyTreeScene {
  const connectionIndex = findConnectionIndex(scene, connectionId);

  return {
    ...scene,
    connections: scene.connections.map((connection, index) =>
      index === connectionIndex ? replace(connection) : connection,
    ),
  };
}

function nextEndpointStyle(style: FamilyTreeEndpointStyle): FamilyTreeEndpointStyle {
  if (style === 'none') {
    return 'solid';
  }

  if (style === 'solid') {
    return 'dashed';
  }

  return 'none';
}

function requireSceneRecord(value: unknown): PlainRecord {
  const record = requirePlainRecord(value, 'Family tree scene');
  requireExactFields(
    record,
    ['version', 'generations', 'connections', 'selectedPersonId', 'resizeEnabled'],
    'Family tree scene',
  );
  return record;
}

export function requireFamilyTreeScene(value: unknown): FamilyTreeScene {
  const record = requireSceneRecord(value);
  const generations = requireGenerationTuple(record.generations);
  const connections = requireConnections(record.connections);
  const people = generations.flat();
  requireUniqueIds(people, connections);

  let selectedPersonId: string | null;
  if (record.selectedPersonId === null) {
    selectedPersonId = null;
  } else {
    selectedPersonId = requirePersonId(record.selectedPersonId);
    if (!people.some((person) => person.id === selectedPersonId)) {
      throw new Error(
        `Family tree selected person id ${JSON.stringify(selectedPersonId)} was not found.`,
      );
    }
  }

  return {
    version: requireVersion(record.version),
    generations,
    connections,
    selectedPersonId,
    resizeEnabled: requireBoolean(record.resizeEnabled, 'Family tree resize enabled'),
  };
}

function requirePersonDraft(value: unknown): FamilyTreePersonDraft {
  const record = requirePlainRecord(value, 'Family tree person draft');
  requireExactFields(record, ['avatar', 'name', 'age', 'description'], 'Family tree person draft');

  return {
    avatar: requireAvatar(record.avatar, 'Family tree person draft avatar'),
    name: requireText(record.name, 'Family tree person draft name'),
    age: requireText(record.age, 'Family tree person draft age'),
    description: requireText(record.description, 'Family tree person draft description'),
  };
}

function requirePerson(value: unknown): FamilyTreePerson {
  return readFamilyTreePerson(value);
}

function requireConnection(value: unknown): FamilyTreeConnection {
  return readFamilyTreeConnection(value);
}

export function createInitialFamilyTreeScene(): FamilyTreeScene {
  return {
    version: FAMILY_TREE_VERSION,
    generations: [[], [], [], []],
    connections: [],
    selectedPersonId: null,
    resizeEnabled: false,
  };
}

export function createFamilyTreePerson(
  draft: FamilyTreePersonDraft,
  id: string,
  generation: FamilyTreeGenerationIndex,
  x: number,
): FamilyTreePerson {
  const validatedDraft = requirePersonDraft(draft);
  const validatedId = requirePersonId(id);
  const validatedGeneration = requireGenerationIndex(generation);
  const validatedX = requireFiniteNonNegativeNumber(
    x,
    `Family tree person ${JSON.stringify(validatedId)} x`,
  );

  return {
    id: validatedId,
    generation: validatedGeneration,
    x: validatedX,
    avatar: validatedDraft.avatar,
    name: validatedDraft.name,
    age: validatedDraft.age,
    description: validatedDraft.description,
    endpoints: initialEndpointStyles(),
  };
}

export function getFamilyTreePerson(
  scene: FamilyTreeScene,
  personId: string,
): FamilyTreePerson {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedPersonId = requirePersonId(personId);
  const location = findPersonLocation(currentScene, validatedPersonId);
  return currentScene.generations[location.generation][location.personIndex];
}

export function addFamilyTreePerson(
  scene: FamilyTreeScene,
  person: FamilyTreePerson,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedPerson = requirePerson(person);
  const people = currentScene.generations.flat();

  if (people.some((existingPerson) => existingPerson.id === validatedPerson.id)) {
    throw new Error(`Family tree person id ${JSON.stringify(validatedPerson.id)} already exists.`);
  }

  const generations = currentScene.generations.map((generationPeople, generation) => {
    if (generation !== validatedPerson.generation) {
      return generationPeople;
    }

    return [...generationPeople, validatedPerson];
  }) as unknown as FamilyTreeGenerations;

  return {
    ...currentScene,
    generations,
  };
}

export function updateFamilyTreePerson(
  scene: FamilyTreeScene,
  personId: string,
  patch: Partial<Pick<FamilyTreePerson, 'avatar' | 'name' | 'age' | 'description'>>,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedPersonId = requirePersonId(personId);
  const patchRecord = requirePlainRecord(patch, 'Family tree person update');
  requireExactFields(
    patchRecord,
    Object.keys(patchRecord).filter((field) =>
      ['avatar', 'name', 'age', 'description'].includes(field),
    ),
    'Family tree person update',
  );

  for (const field of Object.keys(patchRecord)) {
    if (!['avatar', 'name', 'age', 'description'].includes(field)) {
      throw new Error(
        `Family tree person update field must be avatar, name, age, or description, received ${JSON.stringify(field)}.`,
      );
    }
  }

  const validatedPatch: Partial<Pick<FamilyTreePerson, 'avatar' | 'name' | 'age' | 'description'>> = {};
  if (Object.prototype.hasOwnProperty.call(patchRecord, 'avatar')) {
    validatedPatch.avatar = requireAvatar(
      patchRecord.avatar,
      `Family tree person ${JSON.stringify(validatedPersonId)} avatar`,
    );
  }
  if (Object.prototype.hasOwnProperty.call(patchRecord, 'name')) {
    validatedPatch.name = requireText(
      patchRecord.name,
      `Family tree person ${JSON.stringify(validatedPersonId)} name`,
    );
  }
  if (Object.prototype.hasOwnProperty.call(patchRecord, 'age')) {
    validatedPatch.age = requireText(
      patchRecord.age,
      `Family tree person ${JSON.stringify(validatedPersonId)} age`,
    );
  }
  if (Object.prototype.hasOwnProperty.call(patchRecord, 'description')) {
    validatedPatch.description = requireText(
      patchRecord.description,
      `Family tree person ${JSON.stringify(validatedPersonId)} description`,
    );
  }

  return replacePerson(currentScene, validatedPersonId, (person) => ({
    ...person,
    ...validatedPatch,
  }));
}

export function selectFamilyTreePerson(
  scene: FamilyTreeScene,
  personId: string | null,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  if (personId === null) {
    return {
      ...currentScene,
      selectedPersonId: null,
    };
  }

  const validatedPersonId = requirePersonId(personId);
  findPersonLocation(currentScene, validatedPersonId);

  return {
    ...currentScene,
    selectedPersonId: validatedPersonId,
  };
}

export function moveFamilyTreePersonHorizontally(
  scene: FamilyTreeScene,
  personId: string,
  x: number,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedPersonId = requirePersonId(personId);
  const validatedX = requireFiniteNonNegativeNumber(
    x,
    `Family tree person ${JSON.stringify(validatedPersonId)} x`,
  );

  return replacePerson(currentScene, validatedPersonId, (person) => ({
    ...person,
    x: validatedX,
  }));
}

export function deleteFamilyTreePerson(
  scene: FamilyTreeScene,
  personId: string,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedPersonId = requirePersonId(personId);
  const location = findPersonLocation(currentScene, validatedPersonId);
  const generations = currentScene.generations.map((people, generation) => {
    if (generation !== location.generation) {
      return people;
    }

    return people.filter((person) => person.id !== validatedPersonId);
  }) as unknown as FamilyTreeGenerations;

  return {
    ...currentScene,
    generations,
    selectedPersonId:
      currentScene.selectedPersonId === validatedPersonId
        ? null
        : currentScene.selectedPersonId,
  };
}

export function setFamilyTreeEndpointStyle(
  scene: FamilyTreeScene,
  personId: string,
  direction: FamilyTreeEndpointDirection,
  style: FamilyTreeEndpointStyle,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedPersonId = requirePersonId(personId);
  const validatedDirection = requireEndpointDirection(direction);
  const validatedStyle = requireEndpointStyle(style);

  return replacePerson(currentScene, validatedPersonId, (person) => ({
    ...person,
    endpoints: {
      ...person.endpoints,
      [validatedDirection]: validatedStyle,
    },
  }));
}

export function cycleFamilyTreeEndpointStyle(
  scene: FamilyTreeScene,
  personId: string,
  direction: FamilyTreeEndpointDirection,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedPersonId = requirePersonId(personId);
  const validatedDirection = requireEndpointDirection(direction);

  return replacePerson(currentScene, validatedPersonId, (person) => ({
    ...person,
    endpoints: {
      ...person.endpoints,
      [validatedDirection]: nextEndpointStyle(person.endpoints[validatedDirection]),
    },
  }));
}

export function addFamilyTreeConnection(
  scene: FamilyTreeScene,
  connection: FamilyTreeConnection,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedConnection = requireConnection(connection);
  const existingIds = new Set([
    ...currentScene.generations.flat().map((person) => person.id),
    ...currentScene.connections.map((existingConnection) => existingConnection.id),
  ]);

  if (existingIds.has(validatedConnection.id)) {
    throw new Error(`Family tree id ${JSON.stringify(validatedConnection.id)} already exists.`);
  }

  return {
    ...currentScene,
    connections: [...currentScene.connections, validatedConnection],
  };
}

export function moveFamilyTreeConnection(
  scene: FamilyTreeScene,
  connectionId: string,
  x: number,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedConnectionId = requireConnectionId(connectionId);
  const validatedX = requireFiniteNonNegativeNumber(
    x,
    `Family tree connection ${JSON.stringify(validatedConnectionId)} x`,
  );

  return replaceConnection(currentScene, validatedConnectionId, (connection) => ({
    ...connection,
    x: validatedX,
  }));
}

export function resizeFamilyTreeConnection(
  scene: FamilyTreeScene,
  connectionId: string,
  width: number,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedConnectionId = requireConnectionId(connectionId);
  const validatedWidth = requireConnectionWidth(width);

  return replaceConnection(currentScene, validatedConnectionId, (connection) => ({
    ...connection,
    width: validatedWidth,
  }));
}

export function clearFamilyTreeConnections(scene: FamilyTreeScene): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);

  return {
    ...currentScene,
    connections: [],
  };
}

export function setFamilyTreeResizeEnabled(
  scene: FamilyTreeScene,
  enabled: boolean,
): FamilyTreeScene {
  const currentScene = requireFamilyTreeScene(scene);
  const validatedEnabled = requireBoolean(enabled, 'Family tree resize enabled');

  return {
    ...currentScene,
    resizeEnabled: validatedEnabled,
  };
}
