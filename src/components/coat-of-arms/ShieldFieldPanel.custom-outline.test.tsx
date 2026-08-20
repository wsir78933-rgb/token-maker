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

describe('ShieldFieldPanel custom shield upload', () => {
  afterEach(() => cleanup());

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
