import { describe, expect, it } from 'vitest';
import {
  getReferenceShieldCardField,
  listReferenceCatalogEntries,
  shieldReferenceCategories,
} from './reference-catalog';

describe('reference catalog', () => {
  it('keeps the six shield categories while exposing no material cards', () => {
    expect(shieldReferenceCategories).toEqual([
      'shield',
      'heater',
      'french',
      'banner',
      'round',
      'lozenge',
    ]);

    for (const category of shieldReferenceCategories) {
      expect(listReferenceCatalogEntries('shield', category)).toEqual([]);
    }
  });

  it('fails fast when a caller asks for a category outside its catalog section', () => {
    expect(() => listReferenceCatalogEntries('shield', 'animal')).toThrow('Invalid reference catalog category for shield: animal');
    expect(() => listReferenceCatalogEntries('charge', 'animal')).toThrow('Invalid reference catalog category for charge: animal');
    expect(() => listReferenceCatalogEntries('top', 'crown')).toThrow('Invalid reference catalog category for top: crown');
    expect(() => listReferenceCatalogEntries('invalid-section' as never, 'shield')).toThrow('Invalid reference catalog section: invalid-section');
  });

  it('rejects shield-card field requests after the material definitions are removed', () => {
    expect(() => getReferenceShieldCardField('heater-shield-2')).toThrow('Unknown reference shield asset id: heater-shield-2');
    expect(() => getReferenceShieldCardField(null as never)).toThrow('Invalid reference shield asset id: null');
  });
});
