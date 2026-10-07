export const PERIODIC_TABLE_FIELDS = ['topLeft', 'topRight', 'symbol', 'name', 'bottomLeft', 'bottomRight'] as const;
export type PeriodicTableField = (typeof PERIODIC_TABLE_FIELDS)[number];
export type PeriodicTableText = Record<PeriodicTableField, string>;
export type PeriodicTableScope = 'selected' | 'all';
export type PeriodicTableStyle = {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderVisible: boolean;
  backgroundImageUrl: string;
};
export type PeriodicTableCell = {
  id: string;
  text: PeriodicTableText;
  style: PeriodicTableStyle;
  selected: boolean;
};
export type PeriodicTableDocument = {
  version: 1;
  rows: number;
  columns: number;
  cells: PeriodicTableCell[];
};
export const MAX_PERIODIC_TABLE_DIMENSION = 50;
export const MAX_PERIODIC_TABLE_FILE_BYTES = 5 * 1024 * 1024;
export const PERIODIC_TABLE_SLOT_COUNT = 5;
export const DEFAULT_PERIODIC_TABLE_STYLE: Readonly<PeriodicTableStyle> = {
  backgroundColor: 'transparent',
  textColor: '#202020',
  borderColor: '#747474',
  borderVisible: true,
  backgroundImageUrl: '',
};
