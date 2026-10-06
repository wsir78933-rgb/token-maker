import { drawFamilyTreeAvatar } from '@/lib/family-tree/avatar-render';
import type { FamilyTreeCopy } from '@/lib/family-tree/copy';
import {
  FAMILY_TREE_CONNECTION_COLOR,
  FAMILY_TREE_CONNECTION_STROKE_WIDTH,
  FAMILY_TREE_CONTENT_LEFT,
  FAMILY_TREE_GENERATION_ROW_HEIGHT,
  FAMILY_TREE_SCENE_TOP_PADDING,
  familyTreeAvatarBox,
  familyTreeConnectionY,
  familyTreeEndpointSegment,
  familyTreePersonBox,
  familyTreePersonNameBox,
  familyTreeSceneSize,
} from '@/lib/family-tree/layout';
import {
  FAMILY_TREE_ENDPOINT_DIRECTIONS,
  requireFamilyTreeScene,
  type FamilyTreePerson,
  type FamilyTreeScene,
} from '@/lib/family-tree/scene';

const GENERATION_KEYS = ['generation1', 'generation2', 'generation3', 'generation4'] as const;

function formatReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
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

function requireWhiteBackground(value: unknown): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(
      `Family tree whiteBackground must be a boolean, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function drawGenerationLabels(context: CanvasRenderingContext2D, copy: FamilyTreeCopy): void {
  context.font = '14px sans-serif';
  context.fillStyle = '#6d655b';
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  GENERATION_KEYS.forEach((key, index) => {
    context.fillText(copy.generations[key], 16, FAMILY_TREE_SCENE_TOP_PADDING + index * FAMILY_TREE_GENERATION_ROW_HEIGHT + 56);
  });
}

function drawConnections(context: CanvasRenderingContext2D, scene: FamilyTreeScene): void {
  context.strokeStyle = FAMILY_TREE_CONNECTION_COLOR;
  context.lineWidth = FAMILY_TREE_CONNECTION_STROKE_WIDTH;
  context.setLineDash([]);
  for (const connection of scene.connections) {
    const x = FAMILY_TREE_CONTENT_LEFT + connection.x;
    const y = familyTreeConnectionY(connection.gap);
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + connection.width, y);
    context.stroke();
  }
  for (const person of scene.generations.flat()) {
    for (const direction of FAMILY_TREE_ENDPOINT_DIRECTIONS) {
      const style = person.endpoints[direction];
      if (style === 'none') continue;
      const segment = familyTreeEndpointSegment(person, direction);
      context.setLineDash(style === 'dashed' ? [5, 4] : []);
      context.beginPath();
      context.moveTo(segment.start.x, segment.start.y);
      context.lineTo(segment.end.x, segment.end.y);
      context.stroke();
    }
  }
  context.setLineDash([]);
}

function fitPersonName(context: CanvasRenderingContext2D, name: string, width: number): string {
  const normalizedName = name.replace(/\s+/g, ' ');
  if (context.measureText(normalizedName).width <= width) return normalizedName;
  const characters = Array.from(normalizedName);
  while (characters.length > 0 && context.measureText(`${characters.join('')}…`).width > width) characters.pop();
  return `${characters.join('')}…`;
}

async function drawPerson(context: CanvasRenderingContext2D, person: FamilyTreePerson, copy: FamilyTreeCopy): Promise<void> {
  const box = familyTreePersonBox(person);
  context.fillStyle = '#ffffff';
  context.fillRect(box.x, box.y, box.width, box.height);
  context.strokeStyle = '#d6cec2';
  context.lineWidth = 1;
  context.strokeRect(box.x, box.y, box.width, box.height);
  const avatarBox = familyTreeAvatarBox(person);
  context.fillStyle = '#f7f4ef';
  context.fillRect(avatarBox.x, avatarBox.y, avatarBox.width, avatarBox.height);
  await drawFamilyTreeAvatar(context, person.avatar, avatarBox.x, avatarBox.y, avatarBox.width, avatarBox.height);
  const nameBox = familyTreePersonNameBox(person);
  context.font = '13px sans-serif';
  context.fillStyle = '#3f3a35';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(fitPersonName(context, person.name || copy.unnamedPerson, nameBox.width - 10), nameBox.x + nameBox.width / 2, nameBox.y + nameBox.height / 2);
}

function canvasPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error(`PNG encoding failed for canvas ${canvas.width} × ${canvas.height}.`));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });
}

export async function renderFamilyTreePng(
  scene: FamilyTreeScene,
  copy: FamilyTreeCopy,
  whiteBackground: boolean = false,
): Promise<Blob> {
  const checkedWhiteBackground = requireWhiteBackground(whiteBackground);
  const checkedScene = requireFamilyTreeScene(scene);
  const size = familyTreeSceneSize(checkedScene);
  const width = Math.ceil(size.width);
  const height = Math.ceil(size.height);
  // Fail before allocating a canvas beyond Chromium's supported dimension.
  if (width > 32767 || height > 32767 || width * height > 268435456) {
    throw new Error(`Family tree image dimensions ${width} × ${height} exceed the canvas limit.`);
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error(`A 2D canvas context could not be created for ${width} × ${height}.`);
  if (checkedWhiteBackground) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
  }
  drawGenerationLabels(context, copy);
  drawConnections(context, checkedScene);
  for (const person of checkedScene.generations.flat()) await drawPerson(context, person, copy);
  return canvasPngBlob(canvas);
}

export function downloadFamilyTreeBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  try {
    link.click();
  } finally {
    link.remove();
    // The browser must consume the click before the URL is revoked.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
