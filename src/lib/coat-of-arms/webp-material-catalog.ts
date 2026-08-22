import type { ChargeAssetCategory, CoatAsset, TopAssetCategory } from './types';

type WebpMaterialFolder =
  | 'animals'
  | 'crowns'
  | 'humans'
  | 'mantles'
  | 'objects'
  | 'ordinaries'
  | 'other'
  | 'plants'
  | 'supporters'
  | 'symbols';

/** Static manifest for the 203 local WebP materials bundled under public/coat-assets/materials. */
const animals = `aurochs-rampant
bear-rampant
beaver-statant
bison-statant
boar-passant
butterfly-displayed
chimera-statant
cockatrice-statant
dragon-passant
griffin-rampant
hedgehog-statant
phoenix-rising
serpent-coiled
stag-statant
stork-statant
turkey-displayed
warhorse-rearing
wolf-rampant`.split('\n');
const crowns = `archducal-coronet
byzantine-crown
coral-crown
coronet-with-mantle
crown-with-eagle
crown-with-sceptre
crown-with-stag
crown-with-wings
eastern-crown
magyar-crown
papal-crown
samurai-crown
velvet-cap-crown`.split('\n');
const humans = `armoured-knight
blacksmith
carpenter
cherub
crowned-king
crowned-queen
cyclops
gargoyle
healer
hooded-monk
longbow-archer
mathematician
merfolk-king
mermaid
mounted-rider
naturalist
sailor
seraph
shield-guardian
singer
standard-bearer
winged-angel`.split('\n');
const mantles = `astrakhan-mantle
black-canopy-mantle
chain-edged-mantle
crimson-canopy-mantle
damask-mantle
draped-mantle
ecclesiastical-mantle
ermine-spot-mantle
fan-folded-mantle
flame-edged-purple-mantle
fox-fur-mantle
fur-lined-mantle
moon-edged-violet-mantle
royal-ermine-mantle
sable-mantle
scalloped-mantle
shoulder-mantle
split-mantle
winged-crimson-mantle`.split('\n');
const objects = `astrolabe
baton
beacon-lantern
brazier
castle-tower
cauldron
ceremonial-sword
compass
crossbow
crozier
falchion
flail
glaive
golden-chalice
halberd
keyhole
longsword
mace
magnifying-glass
mariner-anchor
mortar-pestle
open-book
orb
ornate-hourglass
padlock
pike
quill
sabre
sailing-ship
seal
sextant
shortsword
sundial
trident
wax-stamp`.split('\n');
const ordinaries = `billetty
bordure
canton-round
chain-collar
checky
chequy
chevron
chevronel
counter-vair
fretwork
gusset
gyron
gyronny
label-five-points
laurel-swag
lozenge
motto-scroll
per-pale
pomme
quarterly
roundel-ringed
roundel
rustre
saltire-engrailed
torteau
urdy
wavy`.split('\n');
const other = `bascinet-helm
ceremonial-staff
ceremonial-torch
crest-lion
crown-fan
feather-fan`.split('\n');
const plants = `acorn-pair
barley-sheaf
beech-tree
date-palm
fleur-de-lis
grapevine-cluster
ivy-leaf
jasmine
laurel-branch
oak-leaf
palm-frond
peony
raspberry
strawberry
thistle-bloom
thistle-seed
tudor-rose
tulip
water-lily
wheat-sheaf`.split('\n');
const supporters = `paired-angels
paired-bears
paired-cockatrices
paired-crabs
paired-donkeys
paired-dragons
paired-eagles
paired-foxes
paired-griffins
paired-horses
paired-lions
paired-merfolk
paired-phoenixes
paired-quails
paired-rams
paired-stags
paired-unicorns
paired-wolves
paired-wyverns`.split('\n');
const symbols = `alchemical-earth
alchemical-fire
caduceus
cancer-symbol
capricorn-symbol
cross-patonce
cross-with-rays
eternal-flame
flaming-comet
flaming-torch
grail-symbol
heart-and-arrow
leo-symbol
mars-symbol
neptune-symbol
open-hand
ouroboros
shooting-star
sun-and-moon
triquetra-knot
venus-symbol
victory-wreath
virgo-symbol
winged-serpent`.split('\n');


export const webpMaterialAssets: readonly CoatAsset[] = [
  ...createChargeMaterials('animals', 'animal', animals),
  ...createChargeMaterials('objects', 'object', objects),
  ...createChargeMaterials('plants', 'plant', plants),
  ...createChargeMaterials('humans', 'human', humans),
  ...createChargeMaterials('symbols', 'symbol', symbols),
  ...createOrdinaryMaterials(ordinaries),
  ...createTopMaterials('crowns', 'crown', crowns),
  ...createTopMaterials('mantles', 'mantle', mantles),
  ...createTopMaterials('supporters', 'supporter', supporters),
  ...createTopMaterials('other', 'other', other),
];

function createChargeMaterials(
  folder: WebpMaterialFolder,
  category: ChargeAssetCategory,
  fileStems: readonly string[],
): readonly CoatAsset[] {
  assertMaterialFileStems(folder, fileStems);
  return fileStems.map((fileStem) => ({
    id: `material-${category}-${fileStem}`,
    kind: 'charge',
    category,
    name: createMaterialName(fileStem),
    searchTerms: fileStem.split('-'),
    rasterSrc: createMaterialSource(folder, fileStem),
  }));
}

function createOrdinaryMaterials(fileStems: readonly string[]): readonly CoatAsset[] {
  const folder = 'ordinaries';
  assertMaterialFileStems(folder, fileStems);
  return fileStems.map((fileStem) => ({
    id: `material-ordinary-${fileStem}`,
    kind: 'ordinary',
    name: createMaterialName(fileStem),
    searchTerms: fileStem.split('-'),
    rasterSrc: createMaterialSource(folder, fileStem),
  }));
}

function createTopMaterials(
  folder: WebpMaterialFolder,
  category: TopAssetCategory,
  fileStems: readonly string[],
): readonly CoatAsset[] {
  assertMaterialFileStems(folder, fileStems);
  return fileStems.map((fileStem) => ({
    id: `material-${category}-${fileStem}`,
    kind: 'top',
    category,
    name: createMaterialName(fileStem),
    searchTerms: fileStem.split('-'),
    rasterSrc: createMaterialSource(folder, fileStem),
  }));
}

function createMaterialName(fileStem: string) {
  const title = fileStem
    .split('-')
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(' ');
  return { en: title, zh: title };
}

function createMaterialSource(folder: WebpMaterialFolder, fileStem: string): string {
  return `/coat-assets/materials/${folder}/${fileStem}.webp`;
}

function assertMaterialFileStems(folder: string, fileStems: readonly string[]): void {
  if (fileStems.length === 0) {
    throw new Error(`Expected a non-empty WebP material list for ${folder}; received ${fileStems.length}`);
  }
  for (const fileStem of fileStems) {
    if (!/^[a-z0-9-]+$/.test(fileStem)) {
      throw new Error(`Invalid WebP material file stem for ${folder}: ${fileStem}`);
    }
  }
}

