// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createInitialFamilyTreeAvatar } from '@/lib/family-tree/avatar';
import { drawFamilyTreeAvatar } from '@/lib/family-tree/avatar-render';
import { getFamilyTreeCopy } from '@/lib/family-tree/copy';
import { renderFamilyTreePng } from '@/lib/family-tree/export';
import { familyTreeSceneSize } from '@/lib/family-tree/layout';
import { addFamilyTreeConnection, addFamilyTreePerson, createFamilyTreePerson, createInitialFamilyTreeScene, setFamilyTreeEndpointStyle } from '@/lib/family-tree/scene';

vi.mock('@/lib/family-tree/avatar-render', () => ({ drawFamilyTreeAvatar: vi.fn().mockResolvedValue(undefined) }));

afterEach(() => { vi.restoreAllMocks(); vi.mocked(drawFamilyTreeAvatar).mockReset().mockResolvedValue(undefined); });

function installCanvas() {
  const context = {
    fillRect: vi.fn(), strokeRect: vi.fn(), fillText: vi.fn(), setLineDash: vi.fn(),
    beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 7 })),
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (this: HTMLCanvasElement, callback) { callback(new Blob(['png'], { type: 'image/png' })); });
  return context;
}

function namedScene() {
  const draft = { avatar: createInitialFamilyTreeAvatar(), name: 'Aster', age: '120', description: 'Ancestor' };
  const person = createFamilyTreePerson(draft, 'ancestor', 0, 24);
  return setFamilyTreeEndpointStyle(addFamilyTreeConnection(addFamilyTreePerson(createInitialFamilyTreeScene(), person), { id: 'line', gap: 0, x: 24, width: 240 }), person.id, 'bottom', 'dashed');
}

describe('family tree PNG output', () => {
  it('renders saved names, every person avatar, independent lines and dashed endpoints', async () => {
    const context = installCanvas();
    const scene = namedScene();
    const blob = await renderFamilyTreePng(scene, getFamilyTreeCopy('en'));
    expect(blob.type).toBe('image/png');
    expect(context.fillText).toHaveBeenCalledWith('Aster', expect.any(Number), expect.any(Number));
    expect(drawFamilyTreeAvatar).toHaveBeenCalledTimes(1);
    expect(context.stroke).toHaveBeenCalledTimes(2);
    expect(context.setLineDash).toHaveBeenCalledWith([5, 4]);
    const size = familyTreeSceneSize(scene);
    expect(context.fillRect).not.toHaveBeenCalledWith(0, 0, size.width, size.height);
  });

  it('keeps the default and false backgrounds transparent, with opt-in white background', async () => {
    const context = installCanvas();
    const scene = createInitialFamilyTreeScene();
    const copy = getFamilyTreeCopy('en');
    const size = familyTreeSceneSize(scene);

    await renderFamilyTreePng(scene, copy);
    expect(context.fillRect).not.toHaveBeenCalledWith(0, 0, size.width, size.height);

    context.fillRect.mockClear();
    await renderFamilyTreePng(scene, copy, false);
    expect(context.fillRect).not.toHaveBeenCalledWith(0, 0, size.width, size.height);

    context.fillRect.mockClear();
    await renderFamilyTreePng(scene, copy, true);
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, size.width, size.height);
  });

  it('rejects a non-boolean background flag before allocating a canvas', async () => {
    const createElement = vi.spyOn(document, 'createElement');

    await expect(
      renderFamilyTreePng(createInitialFamilyTreeScene(), getFamilyTreeCopy('en'), 'true' as never),
    ).rejects.toThrow('whiteBackground must be a boolean, received "true"');
    expect(createElement).not.toHaveBeenCalledWith('canvas');
  });

  it('waits for avatar completion before encoding and refuses a failed image', async () => {
    installCanvas();
    const encoding = vi.spyOn(HTMLCanvasElement.prototype, 'toBlob');
    let completeAvatar!: () => void;
    vi.mocked(drawFamilyTreeAvatar).mockImplementationOnce(() => new Promise<void>((resolve) => { completeAvatar = resolve; }));
    const result = renderFamilyTreePng(namedScene(), getFamilyTreeCopy('zh'));
    expect(encoding).not.toHaveBeenCalled();
    completeAvatar();
    await result;
    expect(encoding).toHaveBeenCalledOnce();
    vi.mocked(drawFamilyTreeAvatar).mockRejectedValueOnce(new Error('head999.png failed'));
    await expect(renderFamilyTreePng(namedScene(), getFamilyTreeCopy('zh'))).rejects.toThrow('head999.png');
    expect(encoding).toHaveBeenCalledOnce();
  });

  it('rejects an impossible canvas size before allocating it', async () => {
    installCanvas();
    const scene = addFamilyTreeConnection(createInitialFamilyTreeScene(), { id: 'oversized', gap: 0, x: 0, width: 50000 });
    await expect(renderFamilyTreePng(scene, getFamilyTreeCopy('en'))).rejects.toThrow(/50128.*canvas limit/);
  });
});
