// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ManualSolarPlanet, SolarPlanetTransform } from '@/lib/solar-system-creator/types';
import { SolarSystemCanvas, type SolarSystemCanvasProps } from './SolarSystemCanvas';

vi.mock('@/lib/solar-system-creator/catalog', () => ({
  getSolarAsset: (assetId: string) => ({
    id: assetId,
    category: assetId.startsWith('star-') ? 'star' : 'type-1',
    index: 1,
    src: `/solar-system/${assetId}.svg`,
  }),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function createPlanet(
  id = 'planet-1',
  transform: Partial<SolarPlanetTransform> = {},
): ManualSolarPlanet {
  return {
    id,
    assetId: 'type-1-1',
    x: 100,
    y: 100,
    width: 40,
    height: 40,
    description: '',
    ...transform,
  };
}

function renderCanvas(overrides: Partial<SolarSystemCanvasProps> = {}) {
  const onSelectPlanet = vi.fn();
  const onPlanetTransform = vi.fn();
  const props: SolarSystemCanvasProps = {
    starAssetId: 'star-1',
    planets: [createPlanet()],
    selectedPlanetId: null,
    draggingEnabled: false,
    resizingEnabled: false,
    label: 'Solar canvas',
    planetLabel: (index) => `Planet ${index + 1}`,
    resizeLabel: (index) => `Resize planet ${index + 1}`,
    onSelectPlanet,
    onPlanetTransform,
    ...overrides,
  };
  const result = render(<SolarSystemCanvas {...props} />);
  const canvas = screen.getByRole('group', { name: props.label }) as unknown as SVGSVGElement;
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 800,
    height: 400,
    right: 800,
    bottom: 400,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  canvas.setPointerCapture = vi.fn();
  canvas.releasePointerCapture = vi.fn();
  canvas.hasPointerCapture = vi.fn(() => true);
  return { ...result, props, canvas, onSelectPlanet, onPlanetTransform };
}

function pointer(
  target: Element,
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  clientX: number,
  clientY: number,
  pointerId = 1,
): void {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientX,
    clientY,
  });
  Object.defineProperties(event, {
    pointerId: { value: pointerId },
    pointerType: { value: 'touch' },
    isPrimary: { value: true },
  });
  fireEvent(target, event);
}

function planetGroup(): SVGGElement {
  const planet = document.querySelector('[data-solar-planet-id="planet-1"]');
  if (!(planet instanceof SVGGElement)) throw new Error('Solar planet group is missing.');
  return planet;
}

describe('SolarSystemCanvas', () => {
  it('renders the fixed star geometry and stable planet identifiers', () => {
    const { canvas } = renderCanvas();

    const star = canvas.querySelector('[data-solar-star="true"]');
    const planet = canvas.querySelector('[data-solar-planet-id="planet-1"]');
    const planetImage = planet?.querySelector('image');

    expect(canvas.getAttribute('viewBox')).toBe('0 0 800 400');
    expect(star?.getAttribute('x')).toBe('0');
    expect(star?.getAttribute('y')).toBe('0');
    expect(star?.getAttribute('width')).toBe('175');
    expect(star?.getAttribute('height')).toBe('400');
    expect(planet?.getAttribute('data-asset-id')).toBe('type-1-1');
    expect(planetImage?.getAttribute('x')).toBe('100');
    expect(planetImage?.getAttribute('y')).toBe('100');
  });

  it('renders a legal empty-star state without requesting a star asset', () => {
    const { canvas } = renderCanvas({ starAssetId: null });

    expect(canvas.querySelector('[data-solar-star="true"]')).toBeNull();
    expect(canvas.getAttribute('data-solar-star-asset-id')).toBeNull();
  });

  it('selects a planet by pointer click and lets the parent toggle repeated selection', () => {
    const { onSelectPlanet } = renderCanvas();
    const planet = planetGroup();

    pointer(planet, 'pointerdown', 120, 120);
    pointer(planet, 'pointerup', 120, 120);
    pointer(planet, 'pointerdown', 120, 120, 2);
    pointer(planet, 'pointerup', 120, 120, 2);

    expect(onSelectPlanet).toHaveBeenNthCalledWith(1, 'planet-1');
    expect(onSelectPlanet).toHaveBeenNthCalledWith(2, 'planet-1');
  });

  it('uses a separate resize label and renders visible two-pixel SVG focus rings', () => {
    const { canvas } = renderCanvas({
      selectedPlanetId: 'planet-1',
      resizingEnabled: true,
    });
    const planet = planetGroup();
    const handle = canvas.querySelector('[data-solar-resize-handle="planet-1"]');
    if (!(handle instanceof SVGGElement)) throw new Error('Solar resize handle is missing.');

    expect(planet.getAttribute('aria-label')).toBe('Planet 1');
    expect(handle.getAttribute('aria-label')).toBe('Resize planet 1');

    fireEvent.focus(planet);
    expect(canvas.querySelector('[data-solar-focus-ring="planet"]')?.getAttribute('stroke-width')).toBe('2');
    fireEvent.blur(planet);
    expect(canvas.querySelector('[data-solar-focus-ring="planet"]')).toBeNull();

    fireEvent.focus(handle);
    expect(canvas.querySelector('[data-solar-focus-ring="resize"]')?.getAttribute('stroke-width')).toBe('2');
  });

  it('moves a manual planet through canvas coordinates and keeps the planet inside bounds', () => {
    const { canvas, onSelectPlanet, onPlanetTransform } = renderCanvas({
      planets: [createPlanet('planet-1', { x: 760, y: 360, width: 40, height: 40 })],
      draggingEnabled: true,
    });
    const planet = planetGroup();

    pointer(planet, 'pointerdown', 780, 380);
    pointer(canvas, 'pointermove', 980, 580);
    pointer(canvas, 'pointerup', 980, 580);

    expect(onPlanetTransform).toHaveBeenLastCalledWith('planet-1', {
      x: 760,
      y: 360,
      width: 40,
      height: 40,
    });
    expect(onSelectPlanet).toHaveBeenCalledWith('planet-1');
  });

  it('drags a small planet from the body when the resize corner has a touch hit area', () => {
    const { canvas, onPlanetTransform } = renderCanvas({
      planets: [createPlanet('planet-1', { x: 0, y: 0, width: 40, height: 40 })],
      selectedPlanetId: 'planet-1',
      draggingEnabled: true,
      resizingEnabled: true,
    });
    const planet = planetGroup();
    const planetImage = planet.querySelector('image');
    const resizeHit = canvas.querySelector('[data-solar-resize-hit="true"]');
    if (!planetImage) throw new Error('Solar planet image is missing.');
    if (!resizeHit) throw new Error('Solar resize hit area is missing.');

    expect(Number(resizeHit.getAttribute('x'))).toBeGreaterThanOrEqual(40);
    expect(Number(resizeHit.getAttribute('y'))).toBeGreaterThanOrEqual(40);

    pointer(planetImage, 'pointerdown', 20, 20);
    pointer(canvas, 'pointermove', 220, 140);
    pointer(canvas, 'pointerup', 220, 140);

    expect(onPlanetTransform).toHaveBeenLastCalledWith('planet-1', {
      x: 200,
      y: 120,
      width: 40,
      height: 40,
    });
  });

  it('resizes only through a square handle and keeps the aspect ratio', () => {
    const { canvas, onSelectPlanet, onPlanetTransform } = renderCanvas({
      selectedPlanetId: 'planet-1',
      resizingEnabled: true,
    });
    const handle = canvas.querySelector('[data-solar-resize-handle="planet-1"]');
    if (!(handle instanceof SVGGElement)) throw new Error('Solar resize handle is missing.');

    pointer(handle, 'pointerdown', 140, 140);
    pointer(canvas, 'pointermove', 200, 200);
    pointer(canvas, 'pointerup', 200, 200);

    const transform = onPlanetTransform.mock.lastCall?.[1] as SolarPlanetTransform;
    expect(transform.width).toBe(100);
    expect(transform.height).toBe(100);
    expect(transform.width).toBe(transform.height);
    expect(onSelectPlanet).not.toHaveBeenCalled();
    expect(Number(handle.querySelector('rect')?.getAttribute('width'))).toBeGreaterThanOrEqual(44);
  });

  it('keeps a resize handle available for a planet at maximum canvas size', () => {
    const { canvas, onPlanetTransform } = renderCanvas({
      planets: [createPlanet('planet-1', { x: 0, y: 0, width: 400, height: 400 })],
      selectedPlanetId: 'planet-1',
      resizingEnabled: true,
    });
    const handle = canvas.querySelector('[data-solar-resize-handle="planet-1"]');
    const resizeHit = canvas.querySelector('[data-solar-resize-hit="true"]');
    if (!(handle instanceof SVGGElement)) throw new Error('Solar resize handle is missing.');
    if (!resizeHit) throw new Error('Solar resize hit area is missing.');

    expect(Number(resizeHit.getAttribute('width'))).toBeGreaterThan(0);
    expect(Number(resizeHit.getAttribute('height'))).toBeGreaterThan(0);

    pointer(handle, 'pointerdown', 393, 393);
    pointer(canvas, 'pointermove', 293, 293);
    pointer(canvas, 'pointerup', 293, 293);

    expect(onPlanetTransform).toHaveBeenLastCalledWith('planet-1', {
      x: 0,
      y: 0,
      width: 300,
      height: 300,
    });
  });

  it('does not bubble resize keyboard movement into the planet movement handler', () => {
    const { canvas, onPlanetTransform } = renderCanvas({
      selectedPlanetId: 'planet-1',
      draggingEnabled: true,
      resizingEnabled: true,
    });
    const handle = canvas.querySelector('[data-solar-resize-handle="planet-1"]');
    if (!(handle instanceof SVGGElement)) throw new Error('Solar resize handle is missing.');

    fireEvent.keyDown(handle, { key: 'ArrowDown', shiftKey: true });

    expect(onPlanetTransform).toHaveBeenCalledTimes(1);
    expect(onPlanetTransform).toHaveBeenCalledWith('planet-1', {
      x: 100,
      y: 100,
      width: 30,
      height: 30,
    });
  });

  it('shows a concrete fallback when a gesture throws an empty Error message', () => {
    const onPlanetTransform = vi.fn(() => {
      throw new Error('');
    });
    const { canvas } = renderCanvas({
      draggingEnabled: true,
      onPlanetTransform,
    });
    const planet = planetGroup();

    pointer(planet, 'pointerdown', 120, 120);
    pointer(canvas, 'pointermove', 130, 130);

    expect(screen.getByRole('alert').textContent).toContain('Error with empty message');
  });

  it('disables drag and resize affordances while retaining pointer selection', () => {
    const { canvas, onSelectPlanet, onPlanetTransform } = renderCanvas({
      selectedPlanetId: 'planet-1',
      draggingEnabled: false,
      resizingEnabled: false,
    });
    const planet = planetGroup();

    expect(canvas.querySelector('[data-solar-resize-handle="planet-1"]')).toBeNull();
    pointer(planet, 'pointerdown', 120, 120);
    pointer(canvas, 'pointermove', 300, 300);
    pointer(canvas, 'pointerup', 300, 300);

    expect(onPlanetTransform).not.toHaveBeenCalled();
    expect(onSelectPlanet).toHaveBeenCalledWith('planet-1');
  });

  it('supports keyboard selection, one-pixel movement, and square resizing', () => {
    const { canvas, onSelectPlanet, onPlanetTransform } = renderCanvas({
      selectedPlanetId: 'planet-1',
      draggingEnabled: true,
      resizingEnabled: true,
    });
    const planet = planetGroup();
    const handle = canvas.querySelector('[data-solar-resize-handle="planet-1"]');
    if (!(handle instanceof SVGGElement)) throw new Error('Solar resize handle is missing.');

    fireEvent.keyDown(planet, { key: 'ArrowRight' });
    fireEvent.keyDown(handle, { key: 'ArrowDown', shiftKey: true });
    fireEvent.keyDown(planet, { key: 'Enter' });

    expect(onPlanetTransform).toHaveBeenNthCalledWith(1, 'planet-1', {
      x: 101,
      y: 100,
      width: 40,
      height: 40,
    });
    expect(onPlanetTransform).toHaveBeenNthCalledWith(2, 'planet-1', {
      x: 100,
      y: 100,
      width: 30,
      height: 30,
    });
    expect(onSelectPlanet).toHaveBeenCalledWith('planet-1');
  });
});
