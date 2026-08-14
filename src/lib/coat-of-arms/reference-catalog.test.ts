import { describe, expect, it } from 'vitest';
import {
  listReferenceCatalogEntries,
  shieldReferenceCategories,
} from './reference-catalog';

describe('reference catalog', () => {
  it('lists the exact bundled material count for each shield category', () => {
    expect(shieldReferenceCategories).toEqual([
      'shield',
      'heater',
      'french',
      'banner',
      'round',
      'lozenge',
    ]);

    expect(listReferenceCatalogEntries('shield', 'shield')).toHaveLength(111);
    expect(listReferenceCatalogEntries('shield', 'heater')).toHaveLength(24);
    expect(listReferenceCatalogEntries('shield', 'french')).toHaveLength(36);
    expect(listReferenceCatalogEntries('shield', 'banner')).toHaveLength(32);
    expect(listReferenceCatalogEntries('shield', 'round')).toHaveLength(19);
    expect(listReferenceCatalogEntries('shield', 'lozenge')).toHaveLength(12);
  });

  it('fails fast when a caller asks for a category outside its catalog section', () => {
    expect(() => listReferenceCatalogEntries('shield', 'animal')).toThrow('Invalid reference catalog category for shield: animal');
    expect(() => listReferenceCatalogEntries('charge', 'animal')).toThrow('Invalid reference catalog category for charge: animal');
    expect(() => listReferenceCatalogEntries('top', 'crown')).toThrow('Invalid reference catalog category for top: crown');
    expect(() => listReferenceCatalogEntries('invalid-section' as never, 'shield')).toThrow('Invalid reference catalog section: invalid-section');
  });
});
