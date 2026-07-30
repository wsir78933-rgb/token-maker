import type {
  BackgroundLayer,
  CanvasTransform,
  ChargeAssetCategory,
  ChargeLayer,
  CoatAsset,
  CoatAssetByKind,
  CoatAssetKind,
  CoatLayer,
  CoatLocale,
  CoatProject,
  ShieldLayer,
  TopAssetCategory,
} from './types';
import { createLocalCoatId } from './id';
import { getBundledRasterVariants } from './generated-raster';
import {
  type ReferenceCatalogEntry,
  type ReferenceCatalogSection,
  listReferenceCatalogEntries,
  shieldReferenceCategories,
} from './reference-catalog';

const validAssetKinds: readonly CoatAssetKind[] = [
  'shield',
  'ordinary',
  'charge',
  'top',
  'pattern',
  'background',
];
const validLocales: readonly CoatLocale[] = ['en', 'zh'];
const initialCoatProjectIds = {
  project: '00000000-0000-4000-8000-000000000001',
  backgroundLayer: '00000000-0000-4000-8000-000000000002',
  shieldLayer: '00000000-0000-4000-8000-000000000003',
  dragonLayer: '00000000-0000-4000-8000-000000000004',
  lionLayer: '00000000-0000-4000-8000-000000000005',
} as const;

const localCoatAssets: readonly CoatAsset[] = [
  {
    id: 'heater-shield',
    kind: 'shield',
    name: { en: 'Heater shield', zh: '熨斗盾' },
    svgPath: 'M50 2 L94 16 V58 C94 80 76 94 50 108 C24 94 6 80 6 58 V16 Z',
  },
  {
    id: 'round-shield',
    kind: 'shield',
    name: { en: 'Round shield', zh: '圆盾' },
    svgPath: 'M50 3 C76 3 96 21 96 45 C96 77 72 96 50 108 C28 96 4 77 4 45 C4 21 24 3 50 3 Z',
  },
  {
    id: 'kite-shield',
    kind: 'shield',
    name: { en: 'Kite shield', zh: '鸢盾' },
    svgPath: 'M50 2 L86 18 V55 C86 81 69 97 50 108 C31 97 14 81 14 55 V18 Z',
  },
  {
    id: 'french-shield',
    kind: 'shield',
    name: { en: 'French shield', zh: '法式盾' },
    svgPath: 'M50 3 C76 3 93 14 93 35 V58 C93 77 78 92 50 108 C22 92 7 77 7 58 V35 C7 14 24 3 50 3 Z',
  },
  {
    id: 'banner-shield',
    kind: 'shield',
    name: { en: 'Banner shield', zh: '旗帜盾' },
    svgPath: 'M8 8 H92 V91 L76 102 L60 91 L44 102 L28 91 L8 102 Z',
  },
  {
    id: 'lozenge-shield',
    kind: 'shield',
    name: { en: 'Lozenge shield', zh: '菱形盾' },
    svgPath: 'M50 2 L96 55 L50 108 L4 55 Z',
  },
  {
    id: 'golden-lion',
    kind: 'charge',
    category: 'animal',
    name: { en: 'Lion', zh: '狮子' },
    searchTerms: ['feline', 'big cat', 'leo', 'lion rampant'],
    svgPath: 'M18 58 C17 51 20 43 26 38 C31 34 37 33 42 36 C46 31 52 29 58 33 L63 39 C70 36 78 38 82 44 C87 51 85 58 78 62 L73 65 L80 87 H71 L63 67 H54 L53 89 H44 L45 69 H37 L31 89 H22 L27 66 C22 64 19 61 18 58 Z M74 46 C87 36 94 44 92 54 C91 61 87 66 81 67 L78 62 C84 60 87 55 85 51 C82 47 78 50 75 53 Z',
    svgParts: [
      { svgPath: 'M18 58 C17 51 20 43 26 38 C31 34 37 33 42 36 C46 31 52 29 58 33 L63 39 C70 36 78 38 82 44 C87 51 85 58 78 62 L73 65 L80 87 H71 L63 67 H54 L53 89 H44 L45 69 H37 L31 89 H22 L27 66 C22 64 19 61 18 58 Z M74 46 C87 36 94 44 92 54 C91 61 87 66 81 67 L78 62 C84 60 87 55 85 51 C82 47 78 50 75 53 Z', sourceColor: '#8A451B' },
      { svgPath: 'M22 50 C23 38 32 30 43 33 C48 34 51 39 51 45 L43 48 L47 55 L37 57 L32 63 L24 60 Z', sourceColor: '#5C2A12' },
      { svgPath: 'M24 48 C27 43 33 42 39 45 L34 49 L40 52 L31 54 L25 52 Z M38 42 C40 42 42 43 42 45 C40 46 39 46 38 45 Z', sourceColor: '#D9A04D' },
      { svgPath: 'M37 43 C39 42 41 43 41 45 C39 46 38 45 37 43 Z', sourceColor: '#1E1B18' },
    ],
  },
  {
    id: 'soaring-eagle',
    kind: 'charge',
    category: 'animal',
    name: { en: 'Soaring eagle', zh: '展翅鹰' },
    svgPath: 'M50 10 L60 31 L79 24 L69 43 L91 50 L67 57 L74 81 L55 67 L50 93 L45 67 L26 81 L33 57 L9 50 L31 43 L21 24 L40 31 Z',
  },
  {
    id: 'rampant-stag',
    kind: 'charge',
    category: 'animal',
    name: { en: 'Rampant stag', zh: '跃鹿' },
    svgPath: 'M51 12 L58 24 L70 19 L73 28 L85 27 L80 38 L68 40 L64 53 L79 63 L72 75 L61 69 L59 92 H45 L43 70 L31 79 L22 68 L38 56 L33 43 L20 39 L16 28 L28 29 L31 18 L42 24 Z',
  },
  {
    id: 'heraldic-wolf',
    kind: 'charge',
    category: 'animal',
    name: { en: 'Heraldic wolf', zh: '纹章狼' },
    svgPath: 'M25 89 L29 61 L18 50 L28 39 L25 17 L41 26 L51 13 L59 29 L75 21 L72 43 L84 52 L70 59 L76 89 H61 L57 69 H43 L39 89 Z',
  },
  {
    id: 'winged-dragon',
    kind: 'charge',
    category: 'animal',
    name: { en: 'Winged dragon', zh: '翼龙' },
    svgPath: 'M20 82 C25 72 31 65 39 59 C38 52 34 46 28 41 L21 36 L37 39 L35 28 L47 35 C53 30 61 30 67 35 L77 29 L73 40 C80 43 83 49 80 56 L88 65 L76 65 L72 84 L64 76 L58 91 L51 76 C43 79 35 83 26 85 L34 74 C29 75 24 79 20 85 Z',
    svgParts: [
      { svgPath: 'M20 82 C25 72 31 65 39 59 C38 52 34 46 28 41 L21 36 L37 39 L35 28 L47 35 C53 30 61 30 67 35 L77 29 L73 40 C80 43 83 49 80 56 L88 65 L76 65 L72 84 L64 76 L58 91 L51 76 C43 79 35 83 26 85 L34 74 C29 75 24 79 20 85 Z', sourceColor: '#28753A' },
      { svgPath: 'M47 54 L59 14 L66 43 L84 27 L72 60 Z', sourceColor: '#1D5C35' },
      { svgPath: 'M53 50 L60 24 L62 48 L76 35 L66 56 Z', sourceColor: '#123A25' },
      { svgPath: 'M67 42 C74 36 83 38 87 43 L78 48 L70 48 Z M66 42 C68 41 70 42 70 44 C68 45 67 44 66 42 Z', sourceColor: '#D9A04D' },
    ],
  },
  {
    id: 'heraldic-boar',
    kind: 'charge',
    category: 'animal',
    name: { en: 'Heraldic boar', zh: '纹章野猪' },
    svgPath: 'M14 57 C14 46 24 38 37 39 L47 31 L60 36 L72 35 L84 44 L78 51 L89 58 L79 64 L82 87 H70 L66 68 H55 L54 88 H42 L43 68 H32 L27 88 H15 L20 64 C16 63 14 60 14 57 Z M68 43 L77 45 L73 50 L65 49 Z M28 45 L35 43 L37 48 L29 50 Z',
  },
  {
    id: 'raven-in-flight',
    kind: 'charge',
    category: 'animal',
    name: { en: 'Raven in flight', zh: '飞翔渡鸦' },
    svgPath: 'M50 12 L59 35 L80 19 L70 43 L92 39 L74 54 L88 74 L62 62 L54 91 L46 62 L20 74 L26 54 L8 39 L30 43 L20 19 L41 35 Z M47 47 L53 47 L50 55 Z',
  },
  {
    id: 'prancing-steed',
    kind: 'charge',
    category: 'animal',
    name: { en: 'Prancing steed', zh: '腾跃战马' },
    svgPath: 'M29 89 L33 62 L22 52 L31 42 L29 20 L43 26 L53 13 L61 31 L75 25 L70 44 L82 54 L70 61 L76 89 H64 L58 70 H47 L42 89 Z M64 35 L76 32 L72 39 L65 42 Z M36 39 L45 46 L39 54 L31 50 Z',
  },
  {
    id: 'standing-bear',
    kind: 'charge',
    category: 'animal',
    name: { en: 'Standing bear', zh: '立熊' },
    svgPath: 'M39 91 L36 68 L27 75 L18 68 L30 52 L26 36 C24 22 34 13 47 16 L52 12 L58 18 C70 20 77 31 73 43 L69 54 L82 66 L74 75 L63 67 L61 91 H52 L50 72 H48 L47 91 Z M40 31 A4 4 0 1 0 40 39 A4 4 0 1 0 40 31 M58 31 A4 4 0 1 0 58 39 A4 4 0 1 0 58 31 Z',
  },
  {
    id: 'sea-serpent',
    kind: 'charge',
    category: 'animal',
    name: { en: 'Sea serpent', zh: '海蛇' },
    svgPath: 'M21 83 C12 67 24 52 40 54 C54 56 51 73 62 73 C72 73 72 59 61 56 L67 43 L82 47 L77 35 L89 24 L74 25 L69 13 L60 27 L48 28 L54 40 L42 49 C29 40 12 44 8 59 C4 76 17 91 33 91 Z M69 34 L76 31 L74 38 Z',
  },
  {
    id: 'eight-point-star',
    kind: 'charge',
    category: 'symbol',
    name: { en: 'Eight-point star', zh: '八芒星' },
    svgPath: 'M50 8 L58 34 L79 20 L66 42 L92 50 L66 58 L79 80 L58 66 L50 92 L42 66 L21 80 L34 58 L8 50 L34 42 L21 20 L42 34 Z',
  },
  {
    id: 'crescent-moon',
    kind: 'charge',
    category: 'symbol',
    name: { en: 'Crescent moon', zh: '新月' },
    svgPath: 'M63 12 C41 17 28 36 31 57 C34 79 54 92 75 87 C58 80 47 65 47 48 C47 31 54 18 63 12 Z',
  },
  {
    id: 'sunburst',
    kind: 'charge',
    category: 'symbol',
    name: { en: 'Sunburst', zh: '旭日' },
    svgPath: 'M50 8 L56 29 L70 15 L69 35 L87 28 L76 43 L94 50 L76 57 L87 72 L69 65 L70 85 L56 71 L50 92 L44 71 L30 85 L31 65 L13 72 L24 57 L6 50 L24 43 L13 28 L31 35 L30 15 L44 29 Z M50 38 A12 12 0 1 0 50 62 A12 12 0 1 0 50 38 Z',
  },
  {
    id: 'cross-pattee',
    kind: 'charge',
    category: 'symbol',
    name: { en: 'Cross pattée', zh: '花瓣十字' },
    svgPath: 'M39 12 H61 L65 35 L88 39 V61 L65 65 L61 88 H39 L35 65 L12 61 V39 L35 35 Z',
  },
  {
    id: 'compass-rose',
    kind: 'charge',
    category: 'symbol',
    name: { en: 'Compass rose', zh: '罗盘玫瑰' },
    svgPath: 'M50 7 L58 40 L84 24 L66 47 L93 50 L66 53 L84 76 L58 60 L50 93 L42 60 L16 76 L34 53 L7 50 L34 47 L16 24 L42 40 Z M50 39 L57 50 L50 61 L43 50 Z',
  },
  {
    id: 'heraldic-heart',
    kind: 'charge',
    category: 'symbol',
    name: { en: 'Heraldic heart', zh: '纹章心形' },
    svgPath: 'M50 91 C43 81 19 67 17 45 C15 26 37 17 50 34 C63 17 85 26 83 45 C81 67 57 81 50 91 Z',
  },
  {
    id: 'triquetra-knot',
    kind: 'charge',
    category: 'symbol',
    name: { en: 'Triquetra knot', zh: '三角结' },
    svgPath: 'M50 13 C70 13 81 31 72 47 C89 55 87 79 68 84 C54 88 47 77 50 66 C42 80 20 84 14 65 C9 49 25 40 36 47 C27 31 30 13 50 13 Z M50 29 C43 38 42 48 50 57 C58 48 57 38 50 29 Z',
  },
  {
    id: 'sun-wheel',
    kind: 'charge',
    category: 'symbol',
    name: { en: 'Sun wheel', zh: '太阳轮' },
    svgPath: 'M50 10 A40 40 0 1 0 50 90 A40 40 0 1 0 50 10 M50 31 A19 19 0 1 0 50 69 A19 19 0 1 0 50 31 M46 10 H54 V31 H46 Z M46 69 H54 V90 H46 Z M10 46 H31 V54 H10 Z M69 46 H90 V54 H69 Z',
  },
  {
    id: 'three-pronged-trident',
    kind: 'charge',
    category: 'symbol',
    name: { en: 'Three-pronged trident', zh: '三叉戟' },
    svgPath: 'M46 91 V45 L30 27 V13 H38 V24 L46 32 V12 H54 V32 L62 24 V13 H70 V27 L54 45 V91 Z M31 52 H69 V61 H31 Z',
  },
  {
    id: 'lozenge-star',
    kind: 'charge',
    category: 'symbol',
    name: { en: 'Lozenge star', zh: '菱星' },
    svgPath: 'M50 7 L60 32 L85 22 L72 47 L93 50 L72 53 L85 78 L60 68 L50 93 L40 68 L15 78 L28 53 L7 50 L28 47 L15 22 L40 32 Z',
  },
  {
    id: 'stone-tower',
    kind: 'charge',
    category: 'object',
    name: { en: 'Tower', zh: '塔楼' },
    svgPath: 'M27 92 V36 H38 V20 H47 V36 H53 V20 H62 V36 H73 V92 H58 V66 H42 V92 Z',
  },
  {
    id: 'blacksmith-anvil',
    kind: 'charge',
    category: 'object',
    name: { en: 'Blacksmith anvil', zh: '铁砧' },
    svgPath: 'M29 34 H48 L58 22 H81 L76 38 H64 L58 48 H76 V61 H64 L69 85 H31 L36 61 H24 V48 H42 L48 38 H29 Z',
  },
  {
    id: 'castle-key',
    kind: 'charge',
    category: 'object',
    name: { en: 'Castle key', zh: '城堡钥匙' },
    svgPath: 'M50 14 A21 21 0 1 0 50 56 A21 21 0 1 0 50 14 M54 48 L79 73 L72 80 L66 74 L60 80 L54 74 L48 80 L41 73 L47 67 L41 61 Z M50 29 A6 6 0 1 0 50 41 A6 6 0 1 0 50 29 Z',
  },
  {
    id: 'mariners-anchor',
    kind: 'charge',
    category: 'object',
    name: { en: 'Mariner anchor', zh: '船锚' },
    svgPath: 'M43 13 H57 V26 H43 Z M50 31 A9 9 0 1 0 50 49 A9 9 0 1 0 50 31 M43 48 H57 V77 C65 73 71 67 73 59 L86 63 C82 81 68 92 50 92 C32 92 18 81 14 63 L27 59 C29 67 35 73 43 77 Z M18 51 H82 V61 H18 Z',
  },
  {
    id: 'hourglass',
    kind: 'charge',
    category: 'object',
    name: { en: 'Hourglass', zh: '沙漏' },
    svgPath: 'M28 14 H72 V24 L61 48 L72 76 V86 H28 V76 L39 48 L28 24 Z M39 24 L50 45 L61 24 Z M39 76 H61 L50 54 Z',
  },
  {
    id: 'ceremonial-sword',
    kind: 'charge',
    category: 'object',
    name: { en: 'Ceremonial sword', zh: '礼仪剑' },
    svgPath: 'M46 92 V51 L29 68 L22 61 L43 40 L34 31 L41 24 L50 33 L76 7 L84 15 L58 41 L67 50 L60 57 L51 48 V92 Z M30 79 H70 V88 H30 Z',
  },
  {
    id: 'chalice',
    kind: 'charge',
    category: 'object',
    name: { en: 'Ceremonial chalice', zh: '礼杯' },
    svgPath: 'M26 18 H74 V41 C74 57 65 67 56 71 V81 H70 V90 H30 V81 H44 V71 C35 67 26 57 26 41 Z M35 27 V40 C35 50 41 57 50 60 C59 57 65 50 65 40 V27 Z',
  },
  {
    id: 'open-book',
    kind: 'charge',
    category: 'object',
    name: { en: 'Open book', zh: '展开的书' },
    svgPath: 'M11 25 C25 18 38 19 50 30 C62 19 75 18 89 25 V82 C75 76 62 77 50 87 C38 77 25 76 11 82 Z M47 39 C38 32 29 31 20 35 V71 C29 68 38 69 47 75 Z M53 39 V75 C62 69 71 68 80 71 V35 C71 31 62 32 53 39 Z',
  },
  {
    id: 'sailing-ship',
    kind: 'charge',
    category: 'object',
    name: { en: 'Sailing ship', zh: '帆船' },
    svgPath: 'M18 75 H82 L73 88 H28 Z M47 18 H54 V72 H47 Z M45 24 L18 57 H45 Z M56 29 L80 63 H56 Z M13 70 H87 V77 H13 Z',
  },
  {
    id: 'beacon-lantern',
    kind: 'charge',
    category: 'object',
    name: { en: 'Beacon lantern', zh: '信标灯笼' },
    svgPath: 'M35 19 H65 L70 32 H78 V41 H70 L64 86 H36 L30 41 H22 V32 H30 Z M43 38 V73 H57 V38 Z M45 11 H55 V19 H45 Z',
  },
  {
    id: 'oak-leaf',
    kind: 'charge',
    category: 'plant',
    name: { en: 'Oak leaf', zh: '橡树叶' },
    svgPath: 'M50 8 C42 18 31 17 30 30 C20 29 15 40 26 48 C16 52 20 65 33 65 C29 78 41 87 50 76 C59 87 71 78 67 65 C80 65 84 52 74 48 C85 40 80 29 70 30 C69 17 58 18 50 8 Z M47 49 L31 69 H42 L42 90 H58 L58 69 H69 Z',
  },
  {
    id: 'heraldic-rose',
    kind: 'charge',
    category: 'plant',
    name: { en: 'Heraldic rose', zh: '纹章玫瑰' },
    svgPath: 'M50 12 C38 8 27 19 31 30 C19 26 12 38 21 47 C12 56 19 70 32 68 C30 81 44 87 50 76 C56 87 70 81 68 68 C81 70 88 56 79 47 C88 38 81 26 69 30 C73 19 62 8 50 12 Z M50 33 C59 33 66 40 66 49 C66 58 59 65 50 65 C41 65 34 58 34 49 C34 40 41 33 50 33 Z',
  },
  {
    id: 'fleur-de-lis',
    kind: 'charge',
    category: 'plant',
    name: { en: 'Fleur-de-lis', zh: '百合花饰' },
    svgPath: 'M50 11 C39 20 35 31 38 42 C27 30 18 31 16 40 C14 51 27 59 39 57 L43 79 H32 V90 H68 V79 H57 L61 57 C73 59 86 51 84 40 C82 31 73 30 62 42 C65 31 61 20 50 11 Z',
  },
  {
    id: 'wheat-sheaf',
    kind: 'charge',
    category: 'plant',
    name: { en: 'Wheat sheaf', zh: '麦穗束' },
    svgPath: 'M46 92 V50 L31 36 L36 30 L46 39 V25 L37 18 L43 12 L50 19 L57 12 L63 18 L54 25 V39 L64 30 L69 36 L54 50 V92 Z M27 43 L38 54 L34 61 L20 49 Z M73 43 L62 54 L66 61 L80 49 Z',
  },
  {
    id: 'pine-tree',
    kind: 'charge',
    category: 'plant',
    name: { en: 'Pine tree', zh: '松树' },
    svgPath: 'M45 90 V69 H33 L43 52 H32 L45 34 H37 L50 12 L63 34 H55 L68 52 H57 L67 69 H55 V90 Z',
  },
  {
    id: 'acorn',
    kind: 'charge',
    category: 'plant',
    name: { en: 'Acorn', zh: '橡果' },
    svgPath: 'M50 17 C39 17 30 25 29 37 H71 C70 25 61 17 50 17 Z M31 42 C31 69 39 88 50 92 C61 88 69 69 69 42 Z M48 9 H58 V20 H48 Z',
  },
  {
    id: 'grapevine',
    kind: 'charge',
    category: 'plant',
    name: { en: 'Grapevine', zh: '葡萄藤' },
    svgPath: 'M48 17 H55 V39 H48 Z M30 27 C39 19 44 20 51 31 C59 20 68 19 76 27 C66 30 61 36 57 43 H45 C41 36 36 30 30 27 Z M50 43 A9 9 0 1 0 50 61 A9 9 0 1 0 50 43 M37 55 A9 9 0 1 0 37 73 A9 9 0 1 0 37 55 M63 55 A9 9 0 1 0 63 73 A9 9 0 1 0 63 55 M50 68 A9 9 0 1 0 50 86 A9 9 0 1 0 50 68 Z',
  },
  {
    id: 'heraldic-thistle',
    kind: 'charge',
    category: 'plant',
    name: { en: 'Heraldic thistle', zh: '纹章蓟花' },
    svgPath: 'M47 91 V62 L30 72 L24 64 L40 53 L31 42 L39 34 L50 43 L61 34 L69 42 L60 53 L76 64 L70 72 L53 62 V91 Z M50 12 C37 12 30 23 34 34 C24 34 20 44 29 51 C36 57 45 54 50 47 C55 54 64 57 71 51 C80 44 76 34 66 34 C70 23 63 12 50 12 Z',
  },
  {
    id: 'water-lily',
    kind: 'charge',
    category: 'plant',
    name: { en: 'Water lily', zh: '睡莲' },
    svgPath: 'M50 14 L58 39 L78 24 L66 47 L91 50 L66 53 L78 76 L58 61 L50 87 L42 61 L22 76 L34 53 L9 50 L34 47 L22 24 L42 39 Z M18 79 C31 71 44 74 50 82 C56 74 69 71 82 79 C72 91 28 91 18 79 Z',
  },
  {
    id: 'cedar-branch',
    kind: 'charge',
    category: 'plant',
    name: { en: 'Cedar branch', zh: '雪松枝' },
    svgPath: 'M47 91 H54 V18 H47 Z M47 30 L24 18 L19 26 L47 43 Z M54 38 L77 23 L82 31 L54 51 Z M47 54 L19 42 L15 51 L47 67 Z M54 62 L84 47 L88 57 L54 75 Z M47 77 L28 68 L23 77 L47 88 Z M54 82 L72 73 L78 82 L54 92 Z',
  },
  {
    id: 'guardian-figure',
    kind: 'charge',
    category: 'human',
    name: { en: 'Guardian figure', zh: '守卫人像' },
    svgPath: 'M50 10 C41 10 35 17 35 26 C35 35 41 42 50 42 C59 42 65 35 65 26 C65 17 59 10 50 10 Z M31 92 L36 53 L50 44 L64 53 L69 92 H56 L53 68 H47 L44 92 Z',
  },
  {
    id: 'open-hand',
    kind: 'charge',
    category: 'human',
    name: { en: 'Open hand', zh: '张开的手' },
    svgPath: 'M39 92 C29 88 23 79 23 67 V45 C23 41 29 41 31 45 V57 H35 V28 C35 23 42 23 43 28 V51 H47 V19 C47 14 54 14 55 19 V51 H59 V25 C59 20 66 20 67 25 V55 H71 V36 C71 32 77 32 77 37 V65 C77 79 68 89 57 92 Z',
  },
  {
    id: 'bowman',
    kind: 'charge',
    category: 'human',
    name: { en: 'Bowman', zh: '弓箭手' },
    svgPath: 'M53 12 A10 10 0 1 0 53 32 A10 10 0 1 0 53 12 M29 87 L37 51 L51 39 L66 50 L77 39 L83 45 L67 61 L62 87 H50 L53 66 L44 61 L41 87 Z M73 17 L78 19 L64 69 L59 67 Z M75 18 L91 47 L71 40 Z',
  },
  {
    id: 'torchbearer',
    kind: 'charge',
    category: 'human',
    name: { en: 'Torchbearer', zh: '持炬者' },
    svgPath: 'M50 10 C38 21 42 31 50 37 C58 31 62 21 50 10 Z M50 42 A10 10 0 1 0 50 62 A10 10 0 1 0 50 42 M31 91 L37 66 L50 58 L63 66 L69 91 H56 L53 75 H47 L44 91 Z M72 24 L78 21 L85 42 L79 45 Z M75 15 C70 8 79 4 82 11 C87 7 93 15 87 20 Z',
  },
  {
    id: 'crowned-visage',
    kind: 'charge',
    category: 'human',
    name: { en: 'Crowned visage', zh: '冠冕人像' },
    svgPath: 'M28 31 L35 16 L45 26 L50 10 L55 26 L65 16 L72 31 V39 H28 Z M31 44 C31 29 69 29 69 44 V62 C69 80 58 90 50 90 C42 90 31 80 31 62 Z M39 51 H45 V55 H39 Z M55 51 H61 V55 H55 Z M43 68 Q50 73 57 68 L55 75 H45 Z',
  },
  {
    id: 'armoured-knight',
    kind: 'charge',
    category: 'human',
    name: { en: 'Armoured knight', zh: '铠甲骑士' },
    svgPath: 'M36 13 H64 L70 33 L61 42 V55 L72 67 L69 91 H56 L53 72 H47 L44 91 H31 L28 67 L39 55 V42 L30 33 Z M40 23 H60 V31 H40 Z',
  },
  {
    id: 'standard-bearer',
    kind: 'charge',
    category: 'human',
    name: { en: 'Standard bearer', zh: '持旗者' },
    svgPath: 'M37 91 L42 62 L50 53 L58 62 L63 91 H52 L50 74 L48 91 Z M50 14 A10 10 0 1 0 50 34 A10 10 0 1 0 50 14 M65 12 H72 V83 H65 Z M72 15 H91 L82 28 L91 41 H72 Z M33 52 L42 57 L31 75 L23 70 Z',
  },
  {
    id: 'scribe',
    kind: 'charge',
    category: 'human',
    name: { en: 'Scribe', zh: '文书官' },
    svgPath: 'M50 13 A10 10 0 1 0 50 33 A10 10 0 1 0 50 13 M31 91 L37 57 L50 43 L63 57 L69 91 H56 L53 70 H47 L44 91 Z M20 50 L42 60 L39 69 L17 59 Z M62 55 L81 33 L87 39 L68 63 Z',
  },
  {
    id: 'harpist',
    kind: 'charge',
    category: 'human',
    name: { en: 'Harpist', zh: '竖琴师' },
    svgPath: 'M50 13 A10 10 0 1 0 50 33 A10 10 0 1 0 50 13 M31 91 L37 59 L50 46 L63 59 L69 91 H56 L53 72 H47 L44 91 Z M70 35 C86 41 84 73 66 78 L61 69 C72 64 74 49 64 44 Z M64 43 H72 V70 H64 Z M72 43 H78 V67 H72 Z',
  },
  {
    id: 'watchful-sentinel',
    kind: 'charge',
    category: 'human',
    name: { en: 'Watchful sentinel', zh: '守望卫士' },
    svgPath: 'M50 12 A11 11 0 1 0 50 34 A11 11 0 1 0 50 12 M31 91 L36 57 L50 43 L64 57 L69 91 H57 L53 71 H47 L43 91 Z M21 43 H32 V81 H21 Z M18 38 H35 V47 H18 Z M20 81 H33 V90 H20 Z',
  },
  {
    id: 'royal-crown',
    kind: 'top',
    category: 'crown',
    name: { en: 'Royal crown', zh: '皇家冠冕' },
    svgPath: 'M18 52 L26 28 L39 43 L50 18 L61 43 L74 28 L82 52 V66 H18 Z M24 72 H76 V80 H24 Z',
    svgParts: [
      { svgPath: 'M18 52 L26 28 L39 43 L50 18 L61 43 L74 28 L82 52 V66 H18 Z', sourceColor: '#B11F24' },
      { svgPath: 'M24 72 H76 V80 H24 Z', sourceColor: '#F5E6A1' },
    ],
  },
  {
    id: 'ceremonial-mantle',
    kind: 'top',
    category: 'mantle',
    name: { en: 'Ceremonial mantle', zh: '礼仪斗篷' },
    svgPath: 'M15 20 C28 11 40 12 50 24 C60 12 72 11 85 20 L79 70 L66 57 L58 84 L50 73 L42 84 L34 57 L21 70 Z',
  },
  {
    id: 'lion-supporter',
    kind: 'top',
    category: 'supporter',
    name: { en: 'Lion supporter', zh: '狮子护持者' },
    svgPath: 'M24 88 L29 59 L19 48 L29 39 L27 22 L40 16 L51 25 L61 19 L75 29 L69 43 L82 52 L70 59 L75 88 H61 L57 67 L44 67 L39 88 Z',
  },
  {
    id: 'heraldic-helm',
    kind: 'top',
    category: 'other',
    name: { en: 'Heraldic helm', zh: '纹章头盔' },
    svgPath: 'M26 27 C26 11 74 11 74 27 V55 L65 74 H35 L26 55 Z M35 32 H65 V42 H35 Z M43 48 H57 V58 H43 Z',
  },
  {
    id: 'ducal-coronet',
    kind: 'top',
    category: 'crown',
    name: { en: 'Ducal coronet', zh: '公爵冠冕' },
    svgPath: 'M19 49 L28 27 L39 42 L50 19 L61 42 L72 27 L81 49 V63 H19 Z M24 69 H76 V79 H24 Z',
  },
  {
    id: 'laurel-wreath',
    kind: 'top',
    category: 'other',
    name: { en: 'Laurel wreath', zh: '桂冠' },
    svgPath: 'M50 85 C31 79 19 62 20 38 L29 34 C29 55 38 69 50 75 C62 69 71 55 71 34 L80 38 C81 62 69 79 50 85 Z M25 31 L17 24 L27 20 L31 29 Z M32 22 L27 12 L38 14 L39 25 Z M68 22 L73 12 L62 14 L61 25 Z M75 31 L83 24 L73 20 L69 29 Z',
  },
  {
    id: 'griffin-supporter',
    kind: 'top',
    category: 'supporter',
    name: { en: 'Griffin supporter', zh: '狮鹫护持者' },
    svgPath: 'M25 89 L30 62 L17 50 L31 42 L26 21 L43 29 L52 13 L60 33 L79 25 L72 46 L84 55 L69 62 L75 89 H61 L57 70 H43 L39 89 Z',
  },
  {
    id: 'scroll-compartment',
    kind: 'top',
    category: 'other',
    name: { en: 'Scroll compartment', zh: '卷轴饰带' },
    svgPath: 'M16 46 C16 30 34 29 39 42 C45 34 55 34 61 42 C66 29 84 30 84 46 C84 62 66 62 61 51 C55 59 45 59 39 51 C34 62 16 62 16 46 Z M25 65 C37 72 63 72 75 65 L80 76 C63 87 37 87 20 76 Z',
  },
  {
    id: 'diagonal-band',
    kind: 'ordinary',
    name: { en: 'Diagonal band', zh: '斜杠' },
    svgPath: 'M8 0 H31 L92 110 H69 Z',
  },
  {
    id: 'chevron',
    kind: 'ordinary',
    name: { en: 'Chevron', zh: '倒V形' },
    svgPath: 'M12 26 L24 16 L50 51 L76 16 L88 26 L50 78 Z',
  },
  {
    id: 'horizontal-band',
    kind: 'ordinary',
    name: { en: 'Horizontal band', zh: '横杠' },
    svgPath: 'M0 42 H100 V68 H0 Z',
  },
  {
    id: 'vertical-pale',
    kind: 'ordinary',
    name: { en: 'Vertical pale', zh: '竖带' },
    svgPath: 'M39 0 H61 V110 H39 Z',
  },
  {
    id: 'cross-ordinary',
    kind: 'ordinary',
    name: { en: 'Cross', zh: '十字带' },
    svgPath: 'M38 0 H62 V39 H100 V71 H62 V110 H38 V71 H0 V39 H38 Z',
  },
  {
    id: 'saltire-ordinary',
    kind: 'ordinary',
    name: { en: 'Saltire', zh: '斜十字带' },
    svgPath: 'M8 0 H31 L50 34 L69 0 H92 L64 55 L92 110 H69 L50 76 L31 110 H8 L36 55 Z',
  },
  {
    id: 'bordure-ordinary',
    kind: 'ordinary',
    name: { en: 'Bordure', zh: '边框带' },
    svgPath: 'M0 0 H100 V110 H0 Z M14 14 V96 H86 V14 Z',
  },
  {
    id: 'pile-ordinary',
    kind: 'ordinary',
    name: { en: 'Pile', zh: '尖楔' },
    svgPath: 'M10 0 H90 L50 83 Z',
  },
  {
    id: 'striped-field',
    kind: 'pattern',
    name: { en: 'Stripes', zh: '条纹' },
    fieldPattern: 'stripes',
  },
  {
    id: 'dotted-field',
    kind: 'pattern',
    name: { en: 'Dots', zh: '圆点' },
    fieldPattern: 'dots',
  },
  {
    id: 'checkered-field',
    kind: 'pattern',
    name: { en: 'Checks', zh: '棋盘格' },
    fieldPattern: 'checks',
  },
  {
    id: 'azure-background',
    kind: 'background',
    name: { en: 'Azure', zh: '蔚蓝' },
    fill: '#1855A5',
  },
  {
    id: 'ivory-background',
    kind: 'background',
    name: { en: 'Ivory', zh: '象牙白' },
    fill: '#F5E6A1',
  },
  {
    id: 'crimson-background',
    kind: 'background',
    name: { en: 'Crimson', zh: '深红' },
    fill: '#B11F24',
  },
];

const referenceCatalogSectionCategories: readonly {
  readonly section: ReferenceCatalogSection;
  readonly categories: readonly string[];
}[] = [
  { section: 'shield', categories: shieldReferenceCategories },
  { section: 'charge', categories: ['animal', 'object', 'plant', 'human', 'symbol'] },
  { section: 'top', categories: ['crown', 'mantle', 'supporter', 'other'] },
];

const coatAssets: readonly CoatAsset[] = [
  ...localCoatAssets.map(attachBundledRasterVariants),
  ...createReferenceCatalogCoatAssets(),
];

function createReferenceCatalogCoatAssets(): readonly CoatAsset[] {
  return referenceCatalogSectionCategories.flatMap(({ section, categories }) => (
    categories.flatMap((category) => (
      listReferenceCatalogEntries(section, category).map(createReferenceCatalogCoatAsset)
    ))
  ));
}

function createReferenceCatalogCoatAsset(entry: ReferenceCatalogEntry): CoatAsset {
  const rasterVariants = getBundledRasterVariants({
    assetId: entry.id,
    category: entry.category,
    semanticKey: entry.symbolSemanticKey ?? entry.exteriorSemanticKey,
  });
  const sharedAsset = {
    id: entry.id,
    name: { en: entry.name, zh: entry.nameZh },
    searchTerms: [...entry.searchTerms],
    svgPath: entry.svgParts.map((part) => part.svgPath).join(' '),
    svgParts: entry.svgParts.map((part) => ({ ...part })),
    ...(rasterVariants ? { rasterVariants } : {}),
  };

  if (entry.section === 'shield') return { ...sharedAsset, kind: 'shield' };
  if (entry.section === 'charge') {
    return { ...sharedAsset, kind: 'charge', category: toChargeAssetCategory(entry.category) };
  }
  return { ...sharedAsset, kind: 'top', category: toTopAssetCategory(entry.category) };
}

function attachBundledRasterVariants(asset: CoatAsset): CoatAsset {
  if (
    (asset.kind !== 'charge' || asset.category !== 'symbol')
    && (asset.kind !== 'top' || asset.category !== 'other')
  ) {
    return asset;
  }
  const rasterVariants = getBundledRasterVariants({ assetId: asset.id, category: asset.category });
  return rasterVariants ? { ...asset, rasterVariants } : asset;
}

function toChargeAssetCategory(category: string): ChargeAssetCategory {
  if (category === 'animal' || category === 'object' || category === 'plant' || category === 'human' || category === 'symbol') {
    return category;
  }
  throw new Error(`Invalid reference charge category: ${category}`);
}

function toTopAssetCategory(category: string): TopAssetCategory {
  if (category === 'mantle' || category === 'crown' || category === 'supporter' || category === 'other') {
    return category;
  }
  throw new Error(`Invalid reference top category: ${category}`);
}

export function getCoatAsset(assetId: string): CoatAsset {
  if (typeof assetId !== 'string') {
    throw new Error(`Invalid coat asset id: ${String(assetId)}`);
  }
  const coatAsset = coatAssets.find((candidate) => candidate.id === assetId);
  if (!coatAsset) {
    throw new Error(`Unknown coat asset id: ${assetId}`);
  }
  return cloneCoatAsset(coatAsset);
}

export function listAssetsByKind<Kind extends CoatAssetKind>(
  kind: Kind,
): CoatAssetByKind<Kind>[] {
  assertAssetKind(kind);
  return coatAssets
    .filter(
      (coatAsset): coatAsset is CoatAssetByKind<Kind> => coatAsset.kind === kind,
    )
    .map((coatAsset) => cloneCoatAsset(coatAsset));
}

/** Returns the authored SVG source colours that can safely be replaced for one local vector asset. */
export function getAssetColorSources(assetId: string): string[] {
  const asset = getCoatAsset(assetId);
  if (!('svgParts' in asset) || !asset.svgParts) return [];
  return [...new Set(asset.svgParts.map((part) => part.sourceColor))];
}

export function createDefaultProject(locale: CoatLocale): CoatProject {
  return createProjectWithIds(locale, {
    project: createLocalCoatId(),
    backgroundLayer: createLocalCoatId(),
    shieldLayer: createLocalCoatId(),
  });
}

/**
 * Creates the first canvas shown by the dedicated Coat Maker route. It uses
 * only bundled original geometry while matching the source editor's familiar
 * gold shield and layered-creature composition.
 */
export function createCoatMakerShowcaseProject(locale: CoatLocale): CoatProject {
  const project = createDefaultProject(locale);
  const background = project.layers.find((layer): layer is BackgroundLayer => layer.type === 'background');
  const shield = project.layers.find((layer): layer is ShieldLayer => layer.type === 'shield');
  if (!background || !shield) throw new Error('Default coat project is missing required showcase layers');
  return { ...project, layers: createShowcaseLayers(background, shield, createLocalCoatId(), createLocalCoatId()) };
}

function createShowcaseLayers(
  background: BackgroundLayer,
  shield: ShieldLayer,
  dragonLayerId: string,
  lionLayerId: string,
): CoatLayer[] {
  const dragon: ChargeLayer = {
    id: dragonLayerId,
    type: 'charge',
    assetId: 'winged-dragon',
    color: '#28753A',
    transform: { x: 0, y: -12, scale: 0.75, rotation: 0 },
    ...createDefaultLayerMetadata(),
  };
  const lion: ChargeLayer = {
    id: lionLayerId,
    type: 'charge',
    assetId: 'golden-lion',
    color: '#8A451B',
    transform: { x: 0, y: 9, scale: 0.72, rotation: 0 },
    ...createDefaultLayerMetadata(),
  };
  return [
    { ...background, fill: '#FFFFFF' },
    { ...shield, field: { division: 'solid', colors: ['#F6C700'], pattern: 'solid' } },
    dragon,
    lion,
  ];
}

/** Uses stable IDs only for the document rendered by both server and browser before effects run. */
export function createInitialCoatProject(): CoatProject {
  const project = createProjectWithIds('en', initialCoatProjectIds);
  const background = project.layers.find((layer): layer is BackgroundLayer => layer.type === 'background');
  const shield = project.layers.find((layer): layer is ShieldLayer => layer.type === 'shield');
  if (!background || !shield) throw new Error('Initial coat project is missing required showcase layers');
  return {
    ...project,
    layers: createShowcaseLayers(background, shield, initialCoatProjectIds.dragonLayer, initialCoatProjectIds.lionLayer),
  };
}

function createProjectWithIds(
  locale: CoatLocale,
  ids: { project: string; backgroundLayer: string; shieldLayer: string },
): CoatProject {
  assertLocale(locale);
  const backgroundLayer: BackgroundLayer = {
    id: ids.backgroundLayer,
    type: 'background',
    assetId: 'ivory-background',
    motif: 'solid',
    opacity: 1,
    ...createDefaultLayerMetadata(),
  };
  const shieldLayer: ShieldLayer = {
    id: ids.shieldLayer,
    type: 'shield',
    assetId: 'heater-shield',
    field: {
      division: 'solid',
      colors: ['#1855A5'],
      pattern: 'solid',
    },
    transform: createCenteredTransform(),
    ...createDefaultLayerMetadata(),
  };

  return {
    id: ids.project,
    locale,
    name: getDefaultProjectName(locale),
    canvas: { width: 1200, height: 1200 },
    palette: [],
    uploads: [],
    groups: [],
    layers: [backgroundLayer, shieldLayer],
  };
}

export function getDefaultProjectName(locale: CoatLocale): string {
  assertLocale(locale);
  return locale === 'zh' ? '我的徽章' : 'My Coat of Arms';
}

function cloneCoatAsset<Asset extends CoatAsset>(coatAsset: Asset): Asset {
  return {
    ...coatAsset,
    name: { ...coatAsset.name },
    ...('searchTerms' in coatAsset && coatAsset.searchTerms ? { searchTerms: [...coatAsset.searchTerms] } : {}),
    ...('svgParts' in coatAsset && coatAsset.svgParts ? { svgParts: coatAsset.svgParts.map((part) => ({ ...part })) } : {}),
    ...('rasterVariants' in coatAsset && coatAsset.rasterVariants ? { rasterVariants: coatAsset.rasterVariants.map((variant) => ({ ...variant })) } : {}),
  } as Asset;
}

function createCenteredTransform(): CanvasTransform {
  return {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
  };
}

function assertAssetKind(kind: unknown): asserts kind is CoatAssetKind {
  if (!validAssetKinds.includes(kind as CoatAssetKind)) {
    throw new Error(`Invalid coat asset kind: ${String(kind)}`);
  }
}

function assertLocale(locale: unknown): asserts locale is CoatLocale {
  if (!validLocales.includes(locale as CoatLocale)) {
    throw new Error(`Invalid coat locale: ${String(locale)}`);
  }
}

function createDefaultLayerMetadata() {
  return {
    visible: true,
    locked: false,
    groupId: null,
  };
}
