// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ShieldFieldPanel } from './ShieldFieldPanel';

function getShield() {
  const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
  if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
  return shield;
}

describe('ShieldFieldPanel custom vector outline', () => {
  afterEach(() => cleanup());

  it('switches from a library outline to an editable local vector outline and back', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Outline source'), { target: { value: 'custom-vector' } });
    const pathEditor = screen.getByLabelText('Custom vector shield path') as HTMLTextAreaElement;
    expect(pathEditor.value).toBe('M50 0 L94 16 L94 58 L50 110 L6 58 L6 16 Z');

    fireEvent.change(pathEditor, { target: { value: 'M 8 0 L92 0 L100 50 L50 110 L0 50 Z' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply custom vector outline' }));

    expect(getShield().customOutlinePath).toBe('M8 0 L92 0 L100 50 L50 110 L0 50 Z');

    fireEvent.change(screen.getByLabelText('Outline source'), { target: { value: 'library' } });
    expect(getShield()).not.toHaveProperty('customOutlinePath');
  });

  it('choosing a local image mask clears the active vector outline so the selected mask controls the shield', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: {
        id: 'image-mask', mimeType: 'image/svg+xml', encoding: 'base64',
        data: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTEwIi8+PC9zdmc+',
      },
    });
    project = applyProjectCommand(project, {
      type: 'set-custom-shield-outline', layerId: shield.id, path: 'M5 0 L95 0 L95 70 L50 110 L5 70 Z',
    });
    useCoatProjectStore.getState().replaceProject(project);
    render(<ShieldFieldPanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Custom shield mask'), { target: { value: 'image-mask' } });

    expect(getShield()).toMatchObject({ customMaskUploadId: 'image-mask' });
    expect(getShield()).not.toHaveProperty('customOutlinePath');
  });

  it('uploading a local image mask clears the active vector outline so the upload is visible', async () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'set-custom-shield-outline', layerId: shield.id, path: 'M5 0 L95 0 L95 70 L50 110 L5 70 Z',
    });
    useCoatProjectStore.getState().replaceProject(project);
    render(<ShieldFieldPanel locale="en" />);
    const file = new File([
      '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="110"/></svg>',
    ], 'custom-mask.svg', { type: 'image/svg+xml' });

    fireEvent.change(screen.getByLabelText('Upload custom shield mask'), { target: { files: [file] } });

    await waitFor(() => {
      expect(getShield().customMaskUploadId).toBeDefined();
      expect(getShield()).not.toHaveProperty('customOutlinePath');
    });
  });
});
