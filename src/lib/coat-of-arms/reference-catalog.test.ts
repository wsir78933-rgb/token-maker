import { describe, expect, it } from 'vitest';
import {
  assertReferenceCatalogEntry,
  listReferenceCatalogEntries,
  shieldReferenceCategories,
} from './reference-catalog';

const catalogSections = [
  { section: 'shield' as const, categories: shieldReferenceCategories },
  { section: 'charge' as const, categories: ['animal', 'object', 'plant', 'human', 'symbol'] },
  { section: 'top' as const, categories: ['crown', 'mantle', 'supporter', 'other'] },
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
    expect(listReferenceCatalogEntries('charge', 'animal')).toHaveLength(369);
    expect(listReferenceCatalogEntries('top', 'crown')).toHaveLength(73);

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

  it('gives every animal reference card a unique, local, semantic identity', () => {
    const animalEntries = listReferenceCatalogEntries('charge', 'animal');
    const genericAnimalName = /^Animal charge \d+$/i;
    const genericAnimalNameZh = /^动物(?:图章|纹章) \d+$/;
    const animalSemanticKeys = animalEntries.map((entry) => Reflect.get(entry, 'semanticKey'));

    expect(animalEntries).toHaveLength(369);
    expect(animalEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'lion-rampant',
      'animal-charge-2',
      'animal-charge-369',
    ]));
    expect(animalEntries.every((entry) => (
      !genericAnimalName.test(entry.name)
      && !genericAnimalNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericAnimalName.test(term) && !genericAnimalNameZh.test(term))
    ))).toBe(true);
    expect(animalSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^[a-z]+(?:-[a-z0-9]+){2,}$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(animalSemanticKeys)).toHaveLength(369);
  });

  it('gives every object reference card a unique, local, named object identity', () => {
    const objectEntries = listReferenceCatalogEntries('charge', 'object');
    const genericObjectName = /^Object charge \d+$/i;
    const genericObjectNameZh = /^器物(?:图章|纹章) \d+$/;
    const objectSemanticKeys = objectEntries.map((entry) => Reflect.get(entry, 'objectSemanticKey'));

    expect(objectEntries).toHaveLength(105);
    expect(objectEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'object-charge-1',
      'object-charge-105',
    ]));
    expect(objectEntries.every((entry) => (
      !genericObjectName.test(entry.name)
      && !genericObjectNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericObjectName.test(term) && !genericObjectNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(objectSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^object-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(objectSemanticKeys)).toHaveLength(105);
  });

  it('gives every plant reference card a unique, local, named plant identity', () => {
    const plantEntries = listReferenceCatalogEntries('charge', 'plant');
    const genericPlantName = /^Plant charge \d+$/i;
    const genericPlantNameZh = /^植物(?:图章|纹章) \d+$/;
    const plantSemanticKeys = plantEntries.map((entry) => Reflect.get(entry, 'plantSemanticKey'));

    expect(plantEntries).toHaveLength(96);
    expect(plantEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'plant-charge-1',
      'plant-charge-96',
    ]));
    expect(plantEntries.every((entry) => (
      !genericPlantName.test(entry.name)
      && !genericPlantNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericPlantName.test(term) && !genericPlantNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(plantSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^plant-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(plantSemanticKeys)).toHaveLength(96);
  });

  it('gives every human reference card a unique, local, named human identity', () => {
    const humanEntries = listReferenceCatalogEntries('charge', 'human');
    const genericHumanName = /^Human charge \d+$/i;
    const genericHumanNameZh = /^人物(?:图章|纹章) \d+$/;
    const humanSemanticKeys = humanEntries.map((entry) => Reflect.get(entry, 'humanSemanticKey'));

    expect(humanEntries).toHaveLength(96);
    expect(humanEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'human-charge-1',
      'human-charge-96',
    ]));
    expect(humanEntries.every((entry) => (
      !genericHumanName.test(entry.name)
      && !genericHumanNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericHumanName.test(term) && !genericHumanNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(humanSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^human-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(humanSemanticKeys)).toHaveLength(96);
  });

  it('gives every symbol reference card a unique, local, named symbol identity', () => {
    const symbolEntries = listReferenceCatalogEntries('charge', 'symbol');
    const genericSymbolName = /^Symbol charge \d+$/i;
    const genericSymbolNameZh = /^符号(?:图章|纹章) \d+$/;
    const symbolSemanticKeys = symbolEntries.map((entry) => Reflect.get(entry, 'symbolSemanticKey'));

    expect(symbolEntries).toHaveLength(97);
    expect(symbolEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'symbol-charge-1',
      'symbol-charge-97',
    ]));
    expect(symbolEntries.every((entry) => (
      !genericSymbolName.test(entry.name)
      && !genericSymbolNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericSymbolName.test(term) && !genericSymbolNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(symbolSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^symbol-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(symbolSemanticKeys)).toHaveLength(97);
  });

  it('gives every crown reference card a unique, local, named crown identity', () => {
    const crownEntries = listReferenceCatalogEntries('top', 'crown');
    const genericCrownName = /^Crown exterior \d+$/i;
    const genericCrownNameZh = /^冠冕外饰 \d+$/;
    const crownSemanticKeys = crownEntries.map((entry) => Reflect.get(entry, 'crownSemanticKey'));

    expect(crownEntries).toHaveLength(73);
    expect(crownEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'crown-exterior-1',
      'crown-exterior-73',
    ]));
    expect(crownEntries.every((entry) => (
      !genericCrownName.test(entry.name)
      && !genericCrownNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericCrownName.test(term) && !genericCrownNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(crownSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^crown-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(crownSemanticKeys)).toHaveLength(73);
  });

  it('gives every mantle reference card a unique, local, named mantle identity', () => {
    const mantleEntries = listReferenceCatalogEntries('top', 'mantle');
    const genericMantleName = /^Mantle exterior \d+$/i;
    const genericMantleNameZh = /^斗篷外饰 \d+$/;
    const mantleSemanticKeys = mantleEntries.map((entry) => Reflect.get(entry, 'mantleSemanticKey'));

    expect(mantleEntries).toHaveLength(55);
    expect(mantleEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'mantle-exterior-1',
      'mantle-exterior-55',
    ]));
    expect(mantleEntries.every((entry) => (
      !genericMantleName.test(entry.name)
      && !genericMantleNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericMantleName.test(term) && !genericMantleNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(mantleSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^mantle-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(mantleSemanticKeys)).toHaveLength(55);
  });

  it('gives every supporter reference card a unique, local, named supporter identity', () => {
    const supporterEntries = listReferenceCatalogEntries('top', 'supporter');
    const genericSupporterName = /^Supporter exterior \d+$/i;
    const genericSupporterNameZh = /^护持者外饰 \d+$/;
    const supporterSemanticKeys = supporterEntries.map((entry) => Reflect.get(entry, 'supporterSemanticKey'));

    expect(supporterEntries).toHaveLength(54);
    expect(supporterEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'supporter-exterior-1',
      'supporter-exterior-54',
    ]));
    expect(supporterEntries.every((entry) => (
      !genericSupporterName.test(entry.name)
      && !genericSupporterNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericSupporterName.test(term) && !genericSupporterNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(supporterSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^supporter-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(supporterSemanticKeys)).toHaveLength(54);
  });

  it('gives every other exterior reference card a unique, local, named exterior identity', () => {
    const exteriorEntries = listReferenceCatalogEntries('top', 'other');
    const genericExteriorName = /^Heraldic exterior \d+$/i;
    const genericExteriorNameZh = /^纹章外饰 \d+$/;
    const exteriorSemanticKeys = exteriorEntries.map((entry) => Reflect.get(entry, 'exteriorSemanticKey'));

    expect(exteriorEntries).toHaveLength(55);
    expect(exteriorEntries.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'other-exterior-1',
      'other-exterior-55',
    ]));
    expect(exteriorEntries.every((entry) => (
      !genericExteriorName.test(entry.name)
      && !genericExteriorNameZh.test(entry.nameZh)
      && entry.searchTerms.every((term) => !genericExteriorName.test(term) && !genericExteriorNameZh.test(term))
      && entry.svgParts.length >= 2
    ))).toBe(true);
    expect(exteriorSemanticKeys.every((semanticKey) => (
      typeof semanticKey === 'string' && /^exterior-[a-z]+-[a-z]+$/.test(semanticKey)
    ))).toBe(true);
    expect(new Set(exteriorSemanticKeys)).toHaveLength(55);
  });

  it('gives every local gallery card a distinct authored vector silhouette', () => {
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
    expect(() => listReferenceCatalogEntries('invalid-section' as never, 'shield')).toThrow('Invalid reference catalog section: invalid-section');
  });

  it('keeps every shield, charge, and top entry local', () => {
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

  it('fails fast when an animal catalog entry has no semantic key', () => {
    const validAnimalEntry = {
      ...createValidCatalogEntry(),
      section: 'charge',
      category: 'animal',
      semanticKey: 'lion-rampant-plain',
    };

    expect(() => assertReferenceCatalogEntry(validAnimalEntry)).not.toThrow();
    const animalEntryWithoutSemanticKey: Record<string, unknown> = { ...validAnimalEntry };
    delete animalEntryWithoutSemanticKey.semanticKey;
    expect(() => assertReferenceCatalogEntry(animalEntryWithoutSemanticKey)).toThrow('Invalid local catalog semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validAnimalEntry, semanticKey: 'Lion rampant' })).toThrow('Invalid local catalog semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validAnimalEntry, semanticKey: 'lion-displayed-plain' })).toThrow('Invalid local catalog semantic key');
  });

  it('fails fast when an object catalog entry lacks a defined object semantic key', () => {
    const validObjectEntry = {
      ...createValidCatalogEntry(),
      section: 'charge',
      category: 'object',
      objectSemanticKey: 'object-watchtower-plain',
    };

    expect(() => assertReferenceCatalogEntry(validObjectEntry)).not.toThrow();
    const objectEntryWithoutSemanticKey: Record<string, unknown> = { ...validObjectEntry };
    delete objectEntryWithoutSemanticKey.objectSemanticKey;
    expect(() => assertReferenceCatalogEntry(objectEntryWithoutSemanticKey)).toThrow('Invalid local catalog object semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validObjectEntry, objectSemanticKey: 'object-watchtower-missing' })).toThrow('Invalid local catalog object semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      objectSemanticKey: 'object-watchtower-plain',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when a plant catalog entry lacks a defined plant semantic key', () => {
    const validPlantEntry = {
      ...createValidCatalogEntry(),
      section: 'charge',
      category: 'plant',
      plantSemanticKey: 'plant-oak-plain',
    };

    expect(() => assertReferenceCatalogEntry(validPlantEntry)).not.toThrow();
    const plantEntryWithoutSemanticKey: Record<string, unknown> = { ...validPlantEntry };
    delete plantEntryWithoutSemanticKey.plantSemanticKey;
    expect(() => assertReferenceCatalogEntry(plantEntryWithoutSemanticKey)).toThrow('Invalid local catalog plant semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validPlantEntry, plantSemanticKey: 'plant-oak-missing' })).toThrow('Invalid local catalog plant semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      plantSemanticKey: 'plant-oak-plain',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when a human catalog entry lacks a defined human semantic key', () => {
    const validHumanEntry = {
      ...createValidCatalogEntry(),
      section: 'charge',
      category: 'human',
      humanSemanticKey: 'human-archer-standing',
    };

    expect(() => assertReferenceCatalogEntry(validHumanEntry)).not.toThrow();
    const humanEntryWithoutSemanticKey: Record<string, unknown> = { ...validHumanEntry };
    delete humanEntryWithoutSemanticKey.humanSemanticKey;
    expect(() => assertReferenceCatalogEntry(humanEntryWithoutSemanticKey)).toThrow('Invalid local catalog human semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validHumanEntry, humanSemanticKey: 'human-archer-missing' })).toThrow('Invalid local catalog human semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      humanSemanticKey: 'human-archer-standing',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when a symbol catalog entry lacks a defined symbol semantic key', () => {
    const validSymbolEntry = {
      ...createValidCatalogEntry(),
      section: 'charge',
      category: 'symbol',
      symbolSemanticKey: 'symbol-sun-plain',
    };

    expect(() => assertReferenceCatalogEntry(validSymbolEntry)).not.toThrow();
    const symbolEntryWithoutSemanticKey: Record<string, unknown> = { ...validSymbolEntry };
    delete symbolEntryWithoutSemanticKey.symbolSemanticKey;
    expect(() => assertReferenceCatalogEntry(symbolEntryWithoutSemanticKey)).toThrow('Invalid local catalog symbol semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validSymbolEntry, symbolSemanticKey: 'symbol-sun-missing' })).toThrow('Invalid local catalog symbol semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      symbolSemanticKey: 'symbol-sun-plain',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when a crown catalog entry lacks a defined crown semantic key', () => {
    const validCrownEntry = {
      ...createValidCatalogEntry(),
      section: 'top',
      category: 'crown',
      crownSemanticKey: 'crown-imperial-plain',
    };

    expect(() => assertReferenceCatalogEntry(validCrownEntry)).not.toThrow();
    const crownEntryWithoutSemanticKey: Record<string, unknown> = { ...validCrownEntry };
    delete crownEntryWithoutSemanticKey.crownSemanticKey;
    expect(() => assertReferenceCatalogEntry(crownEntryWithoutSemanticKey)).toThrow('Invalid local catalog crown semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validCrownEntry, crownSemanticKey: 'crown-imperial-missing' })).toThrow('Invalid local catalog crown semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      crownSemanticKey: 'crown-imperial-plain',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when a mantle catalog entry lacks a defined mantle semantic key', () => {
    const validMantleEntry = {
      ...createValidCatalogEntry(),
      section: 'top',
      category: 'mantle',
      mantleSemanticKey: 'mantle-regal-plain',
    };

    expect(() => assertReferenceCatalogEntry(validMantleEntry)).not.toThrow();
    const mantleEntryWithoutSemanticKey: Record<string, unknown> = { ...validMantleEntry };
    delete mantleEntryWithoutSemanticKey.mantleSemanticKey;
    expect(() => assertReferenceCatalogEntry(mantleEntryWithoutSemanticKey)).toThrow('Invalid local catalog mantle semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validMantleEntry, mantleSemanticKey: 'mantle-regal-missing' })).toThrow('Invalid local catalog mantle semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      mantleSemanticKey: 'mantle-regal-plain',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when a supporter catalog entry lacks a defined supporter semantic key', () => {
    const validSupporterEntry = {
      ...createValidCatalogEntry(),
      section: 'top',
      category: 'supporter',
      supporterSemanticKey: 'supporter-stag-flanking',
    };

    expect(() => assertReferenceCatalogEntry(validSupporterEntry)).not.toThrow();
    const supporterEntryWithoutSemanticKey: Record<string, unknown> = { ...validSupporterEntry };
    delete supporterEntryWithoutSemanticKey.supporterSemanticKey;
    expect(() => assertReferenceCatalogEntry(supporterEntryWithoutSemanticKey)).toThrow('Invalid local catalog supporter semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validSupporterEntry, supporterSemanticKey: 'supporter-stag-missing' })).toThrow('Invalid local catalog supporter semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      supporterSemanticKey: 'supporter-stag-flanking',
    })).toThrow('Invalid local catalog entry');
  });

  it('fails fast when an other exterior catalog entry lacks a defined exterior semantic key', () => {
    const validExteriorEntry = {
      ...createValidCatalogEntry(),
      section: 'top',
      category: 'other',
      exteriorSemanticKey: 'exterior-tournament-plain',
    };

    expect(() => assertReferenceCatalogEntry(validExteriorEntry)).not.toThrow();
    const exteriorEntryWithoutSemanticKey: Record<string, unknown> = { ...validExteriorEntry };
    delete exteriorEntryWithoutSemanticKey.exteriorSemanticKey;
    expect(() => assertReferenceCatalogEntry(exteriorEntryWithoutSemanticKey)).toThrow('Invalid local catalog exterior semantic key');
    expect(() => assertReferenceCatalogEntry({ ...validExteriorEntry, exteriorSemanticKey: 'exterior-tournament-missing' })).toThrow('Invalid local catalog exterior semantic key');
    expect(() => assertReferenceCatalogEntry({
      ...createValidCatalogEntry(),
      exteriorSemanticKey: 'exterior-tournament-plain',
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
