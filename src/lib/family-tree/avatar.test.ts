import { describe, expect, it } from 'vitest';

import {
  createInitialFamilyTreeAvatar,
  familyTreeAvatarChoiceSelected,
  randomizeFamilyTreeAvatar,
  requireFamilyTreeAvatar,
  selectFamilyTreeAvatarChoice,
  setFamilyTreeAvatarColor,
} from '@/lib/family-tree/avatar';

describe('family tree avatar state', () => {
  it('creates and strictly validates the complete source-shaped avatar', () => {
    const initialAvatar = createInitialFamilyTreeAvatar();

    expect(initialAvatar).toEqual({
      faces: 'face1',
      hair: 'hair1',
      ears: 'ears1',
      eyes: 'eyes1',
      eyebrows: 'eb1',
      noses: 'nose1',
      mouths: 'mouth1',
      extras: {
        faceWrinkle: null,
        eyeWrinkle: null,
        scars: [],
      },
      skinColor: 1,
      hairColor: 1,
      eyeColor: 1,
      eyebrowColor: 1,
      moustacheColor: 1,
    });
    expect(requireFamilyTreeAvatar(initialAvatar)).toEqual(initialAvatar);
    expect(() => requireFamilyTreeAvatar({ ...initialAvatar, hair: 'hair999' })).toThrowError('hair999');
    expect(() => requireFamilyTreeAvatar({ ...initialAvatar, skinColor: 25 })).toThrowError('25');
    expect(() => requireFamilyTreeAvatar({ ...initialAvatar, extras: { ...initialAvatar.extras, scars: ['scar1', 'scar1'] } })).toThrowError('scar1');
  });

  it('applies color and source choices without mutating the input', () => {
    const initialAvatar = createInitialFamilyTreeAvatar();
    const selectedAvatar = selectFamilyTreeAvatarChoice(initialAvatar, 'beards17');
    const coloredAvatar = setFamilyTreeAvatarColor(selectedAvatar, 'hairColor', 16);

    expect(initialAvatar.faces).toBe('face1');
    expect(selectedAvatar.faces).toBe('beards17');
    expect(coloredAvatar.hairColor).toBe(16);
    expect(familyTreeAvatarChoiceSelected(coloredAvatar, 'beards17')).toBe(true);
    expect(familyTreeAvatarChoiceSelected(coloredAvatar, 'face1')).toBe(false);
    expect(() => setFamilyTreeAvatarColor(initialAvatar, 'hairColor', 17)).toThrowError('17');
  });

  it('combines wrinkles and toggles multiple scars while reset only clears wrinkles', () => {
    const initialAvatar = createInitialFamilyTreeAvatar();
    const withWrinkles = selectFamilyTreeAvatarChoice(
      selectFamilyTreeAvatarChoice(initialAvatar, 'old11'),
      'eyesp10',
    );
    const withScars = selectFamilyTreeAvatarChoice(
      selectFamilyTreeAvatarChoice(withWrinkles, 'scar2'),
      'scar30',
    );
    const resetAvatar = selectFamilyTreeAvatarChoice(withScars, 'reset-wrinkles');

    expect(withScars.extras).toEqual({
      faceWrinkle: 'old11',
      eyeWrinkle: 'eyesp10',
      scars: ['scar2', 'scar30'],
    });
    expect(resetAvatar.extras).toEqual({
      faceWrinkle: null,
      eyeWrinkle: null,
      scars: ['scar2', 'scar30'],
    });
    expect(familyTreeAvatarChoiceSelected(resetAvatar, 'reset-wrinkles')).toBe(true);
    expect(selectFamilyTreeAvatarChoice(resetAvatar, 'scar2').extras.scars).toEqual(['scar30']);
  });

  it('returns valid randomized source choices and keeps scars unique', () => {
    const initialAvatar = createInitialFamilyTreeAvatar();
    for (let iteration = 0; iteration < 100; iteration += 1) {
      const randomizedAvatar = randomizeFamilyTreeAvatar(initialAvatar);
      expect(requireFamilyTreeAvatar(randomizedAvatar)).toEqual(randomizedAvatar);
      expect(new Set(randomizedAvatar.extras.scars).size).toBe(randomizedAvatar.extras.scars.length);
      expect(randomizedAvatar.extras.scars.every((scarId) => /^scar(?:[1-9]|[12]\d|30)$/.test(scarId))).toBe(true);
    }

    expect(initialAvatar).toEqual(createInitialFamilyTreeAvatar());
    expect(() => randomizeFamilyTreeAvatar({ ...initialAvatar, eyes: 'eyes999' })).toThrowError('eyes999');
  });
});
