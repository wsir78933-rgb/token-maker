import { textFontFamilies, textFontStacks, type TextFontFamily } from './types';

export type TextFontRegistryCategory = 'serif' | 'sans' | 'display' | 'blackletter' | 'monospace' | 'cursive';

export interface TextFontOption {
  id: TextFontFamily;
  category: TextFontRegistryCategory;
  label: { en: string; zh: string };
  stack: string;
  searchTerms: readonly string[];
}

const fontDefinitions: readonly Omit<TextFontOption, 'stack'>[] = [
  { id: 'serif', category: 'serif', label: { en: 'Serif', zh: '衬线体' }, searchTerms: ['serif', 'classic'] },
  { id: 'display-serif', category: 'display', label: { en: 'Display Serif (system fallback)', zh: '展示衬线体（系统回退）' }, searchTerms: ['display', 'serif', 'fallback'] },
  { id: 'blackletter', category: 'blackletter', label: { en: 'Blackletter (system fallback)', zh: '哥特风格（系统回退）' }, searchTerms: ['gothic', 'blackletter', 'fallback'] },
  { id: 'sans-serif', category: 'sans', label: { en: 'Sans Serif', zh: '无衬线体' }, searchTerms: ['sans', 'clean'] },
  { id: 'monospace', category: 'monospace', label: { en: 'Monospace', zh: '等宽体' }, searchTerms: ['mono', 'code'] },
  { id: 'cursive', category: 'cursive', label: { en: 'Cursive', zh: '手写体' }, searchTerms: ['script', 'handwriting'] },
  { id: 'cardinal', category: 'display', label: { en: 'Display Serif (system fallback)', zh: '展示衬线体（系统回退）' }, searchTerms: ['cardinal', 'display', 'fallback'] },
  { id: 'blackchancery', category: 'blackletter', label: { en: 'Blackletter (system fallback)', zh: '哥特风格（系统回退）' }, searchTerms: ['blackchancery', 'gothic', 'fallback'] },
  { id: 'breitkopf', category: 'blackletter', label: { en: 'Blackletter (system fallback)', zh: '哥特风格（系统回退）' }, searchTerms: ['breitkopf', 'fraktur', 'fallback'] },
  { id: 'rockwell', category: 'display', label: { en: 'Display (system fallback)', zh: '展示体（系统回退）' }, searchTerms: ['rockwell', 'slab', 'fallback'] },
  { id: 'carolus', category: 'serif', label: { en: 'Serif (system fallback)', zh: '衬线体（系统回退）' }, searchTerms: ['carolus', 'serif', 'fallback'] },
  { id: 'liturgisch', category: 'blackletter', label: { en: 'Blackletter (system fallback)', zh: '哥特风格（系统回退）' }, searchTerms: ['liturgisch', 'gothic', 'fallback'] },
  { id: 'norse', category: 'display', label: { en: 'Fantasy (system fallback)', zh: '奇幻体（系统回退）' }, searchTerms: ['norse', 'rune', 'fallback'] },
  { id: 'lohengrin', category: 'display', label: { en: 'Display (system fallback)', zh: '展示体（系统回退）' }, searchTerms: ['lohengrin', 'display', 'fallback'] },
  { id: 'cormorant', category: 'serif', label: { en: 'Serif (system fallback)', zh: '衬线体（系统回退）' }, searchTerms: ['cormorant', 'elegant', 'fallback'] },
  { id: 'georgia', category: 'serif', label: { en: 'Serif (system fallback)', zh: '衬线体（系统回退）' }, searchTerms: ['georgia', 'serif', 'fallback'] },
  { id: 'palatino', category: 'serif', label: { en: 'Serif (system fallback)', zh: '衬线体（系统回退）' }, searchTerms: ['palatino', 'serif', 'fallback'] },
  { id: 'baskerville', category: 'serif', label: { en: 'Serif (system fallback)', zh: '衬线体（系统回退）' }, searchTerms: ['baskerville', 'serif', 'fallback'] },
  { id: 'garamond', category: 'serif', label: { en: 'Serif (system fallback)', zh: '衬线体（系统回退）' }, searchTerms: ['garamond', 'serif', 'fallback'] },
  { id: 'bookman', category: 'serif', label: { en: 'Serif (system fallback)', zh: '衬线体（系统回退）' }, searchTerms: ['bookman', 'serif', 'fallback'] },
  { id: 'helvetica', category: 'sans', label: { en: 'Sans Serif (system fallback)', zh: '无衬线体（系统回退）' }, searchTerms: ['helvetica', 'sans', 'fallback'] },
  { id: 'avenir', category: 'sans', label: { en: 'Sans Serif (system fallback)', zh: '无衬线体（系统回退）' }, searchTerms: ['avenir', 'sans', 'fallback'] },
  { id: 'futura', category: 'sans', label: { en: 'Sans Serif (system fallback)', zh: '无衬线体（系统回退）' }, searchTerms: ['futura', 'geometric', 'fallback'] },
  { id: 'trebuchet', category: 'sans', label: { en: 'Sans Serif (system fallback)', zh: '无衬线体（系统回退）' }, searchTerms: ['trebuchet', 'sans', 'fallback'] },
  { id: 'impact', category: 'display', label: { en: 'Fantasy (system fallback)', zh: '奇幻体（系统回退）' }, searchTerms: ['impact', 'display', 'fallback'] },
  { id: 'verdana', category: 'sans', label: { en: 'Sans Serif (system fallback)', zh: '无衬线体（系统回退）' }, searchTerms: ['verdana', 'sans', 'fallback'] },
  { id: 'courier', category: 'monospace', label: { en: 'Monospace (system fallback)', zh: '等宽体（系统回退）' }, searchTerms: ['courier', 'mono', 'fallback'] },
  { id: 'consolas', category: 'monospace', label: { en: 'Monospace (system fallback)', zh: '等宽体（系统回退）' }, searchTerms: ['consolas', 'mono', 'code', 'fallback'] },
  { id: 'monaco', category: 'monospace', label: { en: 'Monospace (system fallback)', zh: '等宽体（系统回退）' }, searchTerms: ['monaco', 'mono', 'code', 'fallback'] },
  { id: 'comic-sans', category: 'cursive', label: { en: 'Cursive (system fallback)', zh: '手写体（系统回退）' }, searchTerms: ['comic', 'cursive', 'fallback'] },
];

const registryById = new Map<TextFontFamily, TextFontOption>(fontDefinitions.map((definition) => [
  definition.id,
  deepFreeze({
    ...definition,
    label: { ...definition.label },
    searchTerms: [...definition.searchTerms],
    stack: textFontStacks[definition.id],
  }),
]));
const missingRegistryIds = textFontFamilies.filter((fontId) => !registryById.has(fontId));
if (missingRegistryIds.length > 0) {
  throw new Error(`Font registry is missing entries: ${missingRegistryIds.join(', ')}`);
}

export const textFontRegistry: readonly TextFontOption[] = Object.freeze(
  textFontFamilies.map((fontId) => registryById.get(fontId)!),
);

export function listTextFontOptions(): readonly TextFontOption[] {
  return textFontRegistry;
}

export function getTextFontOption(fontId: unknown): TextFontOption {
  if (typeof fontId !== 'string') throw new Error(`Font is unavailable: ${String(fontId)}`);
  const option = registryById.get(fontId as TextFontFamily);
  if (!option || option.stack.trim().length === 0) throw new Error(`Font is unavailable: ${fontId}`);
  return option;
}

export function searchTextFontOptions(query: string): readonly TextFontOption[] {
  if (typeof query !== 'string') throw new Error(`Invalid font search query: ${String(query)}`);
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) return textFontRegistry;
  return textFontRegistry.filter((option) => [option.label.en, option.label.zh, ...option.searchTerms]
    .some((term) => term.toLowerCase().includes(normalizedQuery)));
}

export function assertTextFontAvailable(fontId: TextFontFamily): void {
  getTextFontOption(fontId);
}

function deepFreeze<Value>(value: Value): Value {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value as Record<string, unknown>)) deepFreeze(nestedValue);
  }
  return value;
}
