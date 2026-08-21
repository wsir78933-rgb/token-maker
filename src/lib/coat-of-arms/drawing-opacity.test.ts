import { describe, expect, it } from 'vitest';
import { createDefaultProject } from './assets';
import { applyProjectCommand } from './commands';
import { renderCoatSceneSvg } from './scene-svg';
import { useCoatProjectStore } from './store';

describe('drawing opacity', () => {
  it('stores drawing opacity and renders it on the produced stroke', () => {
    const project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-drawing-layer', path: 'M 10 20 L 30 40', color: '#004E89', strokeWidth: 10, opacity: 0.35,
    });
    const drawingLayer = project.layers.at(-1);

    expect(drawingLayer).toMatchObject({ type: 'draw', opacity: 0.35 });
    expect(renderCoatSceneSvg(project, { width: 100, height: 110 })).toContain('opacity="0.35"');
  });

  it('rejects out-of-range drawing opacity and settings', () => {
    const project = createDefaultProject('en');
    expect(() => applyProjectCommand(project, {
      type: 'add-drawing-layer', path: 'M 10 20 L 30 40', color: '#004E89', strokeWidth: 10, opacity: 1.1,
    })).toThrow('Invalid drawing opacity: 1.1');
    expect(() => useCoatProjectStore.getState().setDrawingSettings({
      isActive: false, color: '#004E89', strokeWidth: 10, opacity: -0.1,
    })).toThrow('Invalid drawing opacity: -0.1');
  });

  it('reports the offending drawing settings field value', () => {
    const store = useCoatProjectStore.getState();
    expect(() => store.setDrawingSettings({
      isActive: false, color: '#004E89', strokeWidth: 101, opacity: 1,
    })).toThrow('Invalid drawing stroke width: 101');
    expect(() => store.setDrawingSettings({
      isActive: false, color: '#004E89', strokeWidth: 0, opacity: 1,
    })).toThrow('Invalid drawing stroke width: 0');
    expect(() => store.setDrawingSettings({
      isActive: false, color: 'invalid', strokeWidth: 10, opacity: 1,
    })).toThrow('Invalid drawing color: invalid');
  });
});
