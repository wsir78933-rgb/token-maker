import { describe, expect, it } from 'vitest';
import {
  assertReferenceCatalogEntry,
  listReferenceCatalogEntries,
  shieldReferenceCategories,
} from './reference-catalog';

const catalogSections = [
  { section: 'shield' as const, categories: shieldReferenceCategories },
] as const;

const localSvgReferencePattern = /(?:https?:|\/\/|www\.|data:|url\()/i;

function createValidCatalogEntry() {
  return {
    id: 'local-test-entry',
    section: 'shield',
    category: 'generic',
    name: 'Local test shield',
    nameZh: '本地测试盾形',
    licenseId: 'CC0-1.0',
    searchTerms: ['local', 'shield'],
    svgParts: [{ svgPath: 'M10 10 H90 V90 H10 Z', sourceColor: '#1F2937' }],
  };
}

describe('reference catalog', () => {
  it('matches the reference navigation taxonomy with local licensed entries', () => {
    expect(listReferenceCatalogEntries('shield', 'shield')).toHaveLength(51);
    expect(listReferenceCatalogEntries('shield', 'heater')).toHaveLength(57);
    expect(listReferenceCatalogEntries('shield', 'french')).toHaveLength(30);
    expect(listReferenceCatalogEntries('shield', 'banner')).toHaveLength(30);
    expect(listReferenceCatalogEntries('shield', 'round')).toHaveLength(30);
    expect(listReferenceCatalogEntries('shield', 'lozenge')).toHaveLength(30);
    expect(shieldReferenceCategories.flatMap((category) => listReferenceCatalogEntries('shield', category))).toHaveLength(228);
    expect(() => listReferenceCatalogEntries('charge', 'animal')).toThrow('Invalid reference catalog category for charge: animal');
    expect(() => listReferenceCatalogEntries('top', 'crown')).toThrow('Invalid reference catalog category for top: crown');
  });

  it('gives every kite shield reference card a unique, local, named outline identity', () => {
    const shieldEntries = listReferenceCatalogEntries('shield', 'shield');
    const genericShieldName = /^Heraldic shield \d+$/i;
    const genericShieldNameZh = /^纹章盾 \d+$/;
    const shieldSemanticKeys = shieldEntries.map((entry) => Reflect.get(entry, 'shieldSemanticKey'));

    expect(shieldEntries).toHaveLength(51);
    expect(shieldEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'heraldic-shield-1',
      'heraldic-shield-51',
    ]));
    expect(shieldEntries.every((entry) => (
      !genericShieldName.test(entry.name)
      && !genericShieldNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericShieldName.test(term) && !genericShieldNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(shieldSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^shield-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(shieldSemanticKeys)).toHaveLength(51);
  });

  it('gives every heater shield reference card a unique, local, named outline identity', () => {
    const heaterEntries = listReferenceCatalogEntries('shield', 'heater');
    const genericHeaterName = /^Heater shield \d+$/i;
    const genericHeaterNameZh = /^熨斗盾 \d+$/;
    const heaterSemanticKeys = heaterEntries.map((entry) => Reflect.get(entry, 'heaterSemanticKey'));

    expect(heaterEntries).toHaveLength(57);
    expect(heaterEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'pointed-heraldic-shield',
      'heater-shield-2',
      'heater-shield-57',
    ]));
    expect(heaterEntries.map((entry) => entry.id)).not.toContain('heater-shield-1');
    expect(heaterEntries.every((entry) => (
      !genericHeaterName.test(entry.name)
      && !genericHeaterNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericHeaterName.test(term) && !genericHeaterNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(heaterSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^heater-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(heaterSemanticKeys)).toHaveLength(57);
  });

  it('gives every French shield reference card a unique, local, named outline identity', () => {
    const frenchEntries = listReferenceCatalogEntries('shield', 'french');
    const genericFrenchName = /^French shield \d+$/i;
    const genericFrenchNameZh = /^法式盾 \d+$/;
    const frenchSemanticKeys = frenchEntries.map((entry) => Reflect.get(entry, 'frenchSemanticKey'));

    expect(frenchEntries).toHaveLength(30);
    expect(frenchEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'french-shield-1',
      'french-shield-30',
    ]));
    expect(frenchEntries.every((entry) => (
      !genericFrenchName.test(entry.name)
      && !genericFrenchNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericFrenchName.test(term) && !genericFrenchNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(frenchSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^french-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(frenchSemanticKeys)).toHaveLength(30);
  });

  it('gives every Banner shield reference card a unique, local, named outline identity', () => {
    const bannerEntries = listReferenceCatalogEntries('shield', 'banner');
    const genericBannerName = /^Banner shield \d+$/i;
    const genericBannerNameZh = /^旗帜盾 \d+$/;
    const bannerSemanticKeys = bannerEntries.map((entry) => Reflect.get(entry, 'bannerSemanticKey'));

    expect(bannerEntries).toHaveLength(30);
    expect(bannerEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'banner-shield-1',
      'banner-shield-30',
    ]));
    expect(bannerEntries.every((entry) => (
      !genericBannerName.test(entry.name)
      && !genericBannerNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericBannerName.test(term) && !genericBannerNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(bannerSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^banner-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(bannerSemanticKeys)).toHaveLength(30);
  });

  it('gives every Round shield reference card a unique, local, named outline identity', () => {
    const roundEntries = listReferenceCatalogEntries('shield', 'round');
    const genericRoundName = /^Round shield \d+$/i;
    const genericRoundNameZh = /^圆盾 \d+$/;
    const roundSemanticKeys = roundEntries.map((entry) => Reflect.get(entry, 'roundSemanticKey'));

    expect(roundEntries).toHaveLength(30);
    expect(roundEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'round-shield-1',
      'round-shield-30',
    ]));
    expect(roundEntries.every((entry) => (
      !genericRoundName.test(entry.name)
      && !genericRoundNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericRoundName.test(term) && !genericRoundNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(roundSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^round-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(roundSemanticKeys)).toHaveLength(30);
  });

  it('gives every Lozenge shield reference card a unique, local, named outline identity', () => {
    const lozengeEntries = listReferenceCatalogEntries('shield', 'lozenge');
    const genericLozengeName = /^Lozenge shield \d+$/i;
    const genericLozengeNameZh = /^菱形盾 \d+$/;
    const lozengeSemanticKeys = lozengeEntries.map((entry) => Reflect.get(entry, 'lozengeSemanticKey'));

    expect(lozengeEntries).toHaveLength(30);
    expect(lozengeEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'lozenge-shield-1',
      'lozenge-shield-30',
    ]));
    expect(lozengeEntries.every((entry) => (
      !genericLozengeName.test(entry.name)
      && !genericLozengeNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericLozengeName.test(term) && !genericLozengeNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(lozengeSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^lozenge-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(lozengeSemanticKeys)).toHaveLength(30);
  });


  it('gives every shield card a distinct authored vector silhouette', () => {
    for (const { section, categories } of catalogSections) {
      for (const category of categories) {
        const entries = listReferenceCatalogEntries(section, category);
        const silhouetteSignatures = entries.map((entry) => (
          entry.svgParts.map((part) => part.svgPath).join(' ')
        ));

        expect(new Set(silhouetteSignatures)).toHaveLength(entries.length);
      }
    }
  });

  it('fails fast when a caller asks for a category outside its catalog section', () => {
    expect(() => listReferenceCatalogEntries('shield', 'animal')).toThrow('Invalid reference catalog category for shield: animal');
    expect(() => listReferenceCatalogEntries('charge', 'animal')).toThrow('Invalid reference catalog category for charge: animal');
    expect(() => listReferenceCatalogEntries('top', 'crown')).toThrow('Invalid reference catalog category for top: crown');
    expect(() => listReferenceCatalogEntries('invalid-section' as never, 'shield')).toThrow('Invalid reference catalog section: invalid-section');
  });

  it('keeps every shield entry local', () => {
    for (const { section, categories } of catalogSections) {
      for (const category of categories) {
        for (const entry of listReferenceCatalogEntries(section, category)) {
          expect(() => assertReferenceCatalogEntry(entry)).not.toThrow();
          expect(entry.licenseId).not.toBe('');
          expect('sourceUrl' in entry).toBe(false);
          expect(JSON.stringify(entry)).not.toMatch(localSvgReferencePattern);
          expect(entry.name).not.toMatch(localSvgReferencePattern);
          expect(entry.nameZh).not.toMatch(localSvgReferencePattern);

          for (const part of entry.svgParts) {
            expect(part.svgPath).not.toMatch(localSvgReferencePattern);
            expect(part.sourceColor).not.toMatch(localSvgReferencePattern);
          }
        }
      }
    }
  });

  it('rejects incomplete, unlicensed, and remote catalog payloads', () => {
    const validEntry = createValidCatalogEntry();

    expect(() => assertReferenceCatalogEntry(validEntry)).not.toThrow();
    expect(() => assertReferenceCatalogEntry({ ...validEntry, licenseId: '' })).toThrow('Invalid local catalog license');
    expect(() => assertReferenceCatalogEntry({ ...validEntry, licenseId: 'Commercial-1.0' })).toThrow('Invalid local catalog license');
    const entryWithoutName: Record<string, unknown> = { ...validEntry };
    delete entryWithoutName.name;
    expect(() => assertReferenceCatalogEntry(entryWithoutName)).toThrow('Invalid local catalog entry');
    expect(() => assertReferenceCatalogEntry({ ...validEntry, sourceUrl: 'https://example.test/asset.svg' })).toThrow('Invalid local catalog source');
    expect(() => assertReferenceCatalogEntry({
      ...validEntry,
      svgParts: [{ ...validEntry.svgParts[0], svgPath: 'M0 0 H10 https://example.test/asset.svg' }],
    })).toThrow('Invalid local catalog entry');
    expect(() => assertReferenceCatalogEntry({
      ...validEntry,
      svgParts: [{ ...validEntry.svgParts[0], sourceColor: 'url(https://example.test/colour)' }],
    })).toThrow('Invalid local catalog entry');
    expect(() => assertReferenceCatalogEntry({
      ...validEntry,
      name: 'https://remote.example/asset',
    })).toThrow('Invalid local catalog entry');
    expect(() => assertReferenceCatalogEntry({
      ...validEntry,
      searchTerms: ['//remote.example/asset'],
    })).toThrow('Invalid local catalog entry');
    expect(() => assertReferenceCatalogEntry({
      ...validEntry,
      searchTerms: ['mailto:author@remote.example'],
    })).toThrow('Invalid local catalog entry');
    expect(() => assertReferenceCatalogEntry({
      ...validEntry,
      searchTerms: ['192.0.2.1/asset'],
    })).toThrow('Invalid local catalog entry');
    expect(() => assertReferenceCatalogEntry({
      ...validEntry,
      assetHost: 'https://remote.example',
    })).toThrow('Invalid local catalog entry');
  });


  it('fails fast when a kite shield catalog entry lacks a defined shield semantic key', () => {
    const validShieldEntry = {
      ...createValidCatalogEntry(),
      category: 'shield',
      shieldSemanticKey: 'shield-norman-plain',
    };

    expect(() => assertReferenceCatalogEntry(validShieldEntry)).not.toThrow();
    const shieldEntryWithoutSemanticKey: Record<string, unknown> = { ...validShieldEntry };
    delete shieldEntryWithoutSemanticKey.shieldSemanticKey;
    expect(() => assertReferenceCatalogEntry(shieldEntryWithoutSemanticKey)).toThrow('Invalid local catalog shield semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validShieldEntry, shieldSemanticKey: 'shield-norman-missing' })).toThrow('Invalid local catalog shield semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      section: 'shield',
      category: 'heater',
      shieldSemanticKey: 'shield-norman-plain',
    })).toThrow('Invalid local catalog heater semantic key');
  });

  it('fails fast when a heater shield catalog entry lacks a defined heater semantic key', () => {
    const validHeaterEntry = {
      ...createValidCatalogEntry(),
      category: 'heater',
      heaterSemanticKey: 'heater-barrel-plain',
    };

    expect(() => assertReferenceCatalogEntry(validHeaterEntry)).not.toThrow();
    const heaterEntryWithoutSemanticKey: Record<string, unknown> = { ...validHeaterEntry };
    delete heaterEntryWithoutSemanticKey.heaterSemanticKey;
    expect(() => assertReferenceCatalogEntry(heaterEntryWithoutSemanticKey)).toThrow('Invalid local catalog heater semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validHeaterEntry, heaterSemanticKey: 'heater-barrel-missing' })).toThrow('Invalid local catalog heater semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      heaterSemanticKey: 'heater-barrel-plain',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when a French shield catalog entry lacks a defined French semantic key', () => {
    const validFrenchEntry = {
      ...createValidCatalogEntry(),
      category: 'french',
      frenchSemanticKey: 'french-bourbon-plain',
    };

    expect(() => assertReferenceCatalogEntry(validFrenchEntry)).not.toThrow();
    const frenchEntryWithoutSemanticKey: Record<string, unknown> = { ...validFrenchEntry };
    delete frenchEntryWithoutSemanticKey.frenchSemanticKey;
    expect(() => assertReferenceCatalogEntry(frenchEntryWithoutSemanticKey)).toThrow('Invalid local catalog French semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validFrenchEntry, frenchSemanticKey: 'french-bourbon-missing' })).toThrow('Invalid local catalog French semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      frenchSemanticKey: 'french-bourbon-plain',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when a Banner shield catalog entry lacks a defined Banner semantic key', () => {
    const validBannerEntry = {
      ...createValidCatalogEntry(),
      category: 'banner',
      bannerSemanticKey: 'banner-pennon-plain',
    };

    expect(() => assertReferenceCatalogEntry(validBannerEntry)).not.toThrow();
    const bannerEntryWithoutSemanticKey: Record<string, unknown> = { ...validBannerEntry };
    delete bannerEntryWithoutSemanticKey.bannerSemanticKey;
    expect(() => assertReferenceCatalogEntry(bannerEntryWithoutSemanticKey)).toThrow('Invalid local catalog Banner semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validBannerEntry, bannerSemanticKey: 'banner-pennon-missing' })).toThrow('Invalid local catalog Banner semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      bannerSemanticKey: 'banner-pennon-plain',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when a Round shield catalog entry lacks a defined Round semantic key', () => {
    const validRoundEntry = {
      ...createValidCatalogEntry(),
      category: 'round',
      roundSemanticKey: 'round-medallion-round',
    };

    expect(() => assertReferenceCatalogEntry(validRoundEntry)).not.toThrow();
    const roundEntryWithoutSemanticKey: Record<string, unknown> = { ...validRoundEntry };
    delete roundEntryWithoutSemanticKey.roundSemanticKey;
    expect(() => assertReferenceCatalogEntry(roundEntryWithoutSemanticKey)).toThrow('Invalid local catalog Round semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validRoundEntry, roundSemanticKey: 'round-medallion-missing' })).toThrow('Invalid local catalog Round semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      roundSemanticKey: 'round-medallion-round',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when a Lozenge shield catalog entry lacks a defined Lozenge semantic key', () => {
    const validLozengeEntry = {
      ...createValidCatalogEntry(),
      category: 'lozenge',
      lozengeSemanticKey: 'lozenge-diamond-plain',
    };

    expect(() => assertReferenceCatalogEntry(validLozengeEntry)).not.toThrow();
    const lozengeEntryWithoutSemanticKey: Record<string, unknown> = { ...validLozengeEntry };
    delete lozengeEntryWithoutSemanticKey.lozengeSemanticKey;
    expect(() => assertReferenceCatalogEntry(lozengeEntryWithoutSemanticKey)).toThrow('Invalid local catalog Lozenge semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validLozengeEntry, lozengeSemanticKey: 'lozenge-diamond-missing' })).toThrow('Invalid local catalog Lozenge semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      lozengeSemanticKey: 'lozenge-diamond-plain',
    })).toThrow('Invalid local catalog entry');
  });

  it('rejects punctuation-delimited bare hosts at every local-only string boundary', () => {
    const validEntry = createValidCatalogEntry();
    const punctuationDelimitedRemoteReferences = [
      '(192.0.2.1)',
      '(remote.example)',
      'remote.example.',
    ] as const;
    const createEntriesWithRemoteReference = [
      (remoteReference: string) => ({ ...validEntry, id: remoteReference }),
      (remoteReference: string) => ({ ...validEntry, category: remoteReference }),
      (remoteReference: string) => ({ ...validEntry, name: remoteReference }),
      (remoteReference: string) => ({ ...validEntry, nameZh: remoteReference }),
      (remoteReference: string) => ({ ...validEntry, searchTerms: [remoteReference] }),
      (remoteReference: string) => ({
        ...validEntry,
        svgParts: [{
          ...validEntry.svgParts[0],
          svgPath: `M0 0 ${remoteReference}`,
        }],
      }),
      (remoteReference: string) => ({
        ...validEntry,
        svgParts: [{
          ...validEntry.svgParts[0],
          sourceColor: remoteReference,
        }],
      }),
    ] as const;

    for (const remoteReference of punctuationDelimitedRemoteReferences) {
      for (const createEntryWithRemoteReference of createEntriesWithRemoteReference) {
        expect(() => (
          assertReferenceCatalogEntry(createEntryWithRemoteReference(remoteReference))
        )).toThrow('Invalid local catalog entry');
      }
    }
  });
});
