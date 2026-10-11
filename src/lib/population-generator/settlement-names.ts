import type { SiteLocale } from '@/lib/site-locale';

const ENGLISH_SETTLEMENT_STARTS = [
  'Ash',
  'Bramble',
  'Cedar',
  'Dun',
  'Elm',
  'Frost',
  'Glen',
  'Hart',
  'Ivy',
  'Moss',
  'North',
  'Oak',
  'Pine',
  'Quarry',
  'Reed',
  'Stone',
  'Thorn',
  'Vale',
  'West',
  'Willow',
] as const;

const ENGLISH_SETTLEMENT_ENDS = [
  'barrow',
  'bridge',
  'crossing',
  'dale',
  'ford',
  'gate',
  'haven',
  'holt',
  'keep',
  'mere',
  'ridge',
  'stead',
  'watch',
  'wick',
  'field',
  'well',
] as const;

const CHINESE_SETTLEMENT_STARTS = [
  '青',
  '白',
  '赤',
  '玄',
  '苍',
  '金',
  '银',
  '石',
  '柳',
  '松',
  '枫',
  '兰',
  '云',
  '霜',
  '星',
  '月',
  '风',
  '河',
  '湖',
  '燕',
] as const;

const CHINESE_SETTLEMENT_ENDS = [
  '溪镇',
  '石堡',
  '林',
  '港',
  '原',
  '关',
  '渡',
  '丘',
  '湾',
  '城',
  '村',
  '驿',
] as const;

function settlementNameAt(starts: readonly string[], ends: readonly string[], unit: number): string {
  const nameCount = starts.length * ends.length;
  const nameIndex = Math.floor(unit * nameCount);
  const start = starts[Math.floor(nameIndex / ends.length)];
  const end = ends[nameIndex % ends.length];

  if (start === undefined || end === undefined) {
    throw new Error(`Settlement name index ${nameIndex} is outside 0..${nameCount - 1}.`);
  }

  return `${start}${end}`;
}

export function createSettlementName(locale: SiteLocale, unit: number): string {
  if (locale === 'zh') {
    return settlementNameAt(CHINESE_SETTLEMENT_STARTS, CHINESE_SETTLEMENT_ENDS, unit);
  }

  return settlementNameAt(ENGLISH_SETTLEMENT_STARTS, ENGLISH_SETTLEMENT_ENDS, unit);
}
