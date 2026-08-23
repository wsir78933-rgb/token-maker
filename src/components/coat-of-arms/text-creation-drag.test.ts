import { describe, expect, it } from 'vitest';
import { createTextCreationCommand, defaultStraightTextBoxWidth } from './text-creation-drag';

describe('createTextCreationCommand', () => {
  it('locks competitor straight-text defaults including measured box width', () => {
    expect(defaultStraightTextBoxWidth('Double-click to edit', 40)).toBe(57);
    expect(defaultStraightTextBoxWidth('双击编辑', 40)).toBe(23);
    expect(createTextCreationCommand('text', 'Double-click to edit')).toEqual({
      type: 'add-text-layer',
      text: 'Double-click to edit',
      color: '#111111',
      fontSize: 40,
      fontFamily: 'cardinal',
      fontStyle: 'normal',
      fontWeight: 'normal',
      alignment: 'center',
      path: { mode: 'none' },
      boxWidth: 57,
      transform: { x: 0, y: -47, scale: 1, rotation: 0 },
    });
  });

  it('uses caller copy and the three-point upper curve for curved text', () => {
    expect(createTextCreationCommand('curved', 'Curved Text')).toEqual({
      type: 'add-text-layer',
      text: 'Curved Text',
      color: '#111111',
      fontSize: 50,
      fontFamily: 'cardinal',
      fontStyle: 'normal',
      fontWeight: 'normal',
      alignment: 'center',
      path: {
        mode: 'curve',
        startX: 28,
        startY: 38,
        controlX: 50,
        controlY: 8,
        endX: 72,
        endY: 38,
      },
    });
  });

  it('uses caller copy and the inward upper-arc ring for ring text', () => {
    expect(createTextCreationCommand('ring', 'Ring Text')).toEqual({
      type: 'add-text-layer',
      text: 'Ring Text',
      color: '#111111',
      fontSize: 50,
      fontFamily: 'cardinal',
      fontStyle: 'normal',
      fontWeight: 'normal',
      alignment: 'center',
      path: {
        mode: 'ring',
        radius: 18,
        facing: 'in',
        layout: 'arc',
        spacing: 'natural',
        startAngle: 0,
      },
    });
  });

  it('rejects an empty default string before measuring box width', () => {
    expect(() => defaultStraightTextBoxWidth('', 40)).toThrow('Invalid default text for box width: ""');
  });

  it('uses a caller-supplied transform instead of stacking the default baseline offset', () => {
    expect(
      createTextCreationCommand('text', 'Double-click to edit', {
        x: 12,
        y: 8,
        scale: 1,
        rotation: 0,
      }),
    ).toEqual({
      type: 'add-text-layer',
      text: 'Double-click to edit',
      color: '#111111',
      fontSize: 40,
      fontFamily: 'cardinal',
      fontStyle: 'normal',
      fontWeight: 'normal',
      alignment: 'center',
      path: { mode: 'none' },
      boxWidth: 57,
      transform: { x: 12, y: 8, scale: 1, rotation: 0 },
    });
  });
});
