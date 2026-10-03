export const EMBLEM_CANVAS = Object.freeze({
  width: 1024 as const,
  height: 1024 as const,
});

export const EMBLEM_LAYER_ORDER = Object.freeze([
  'crests',
  'details',
  'body1',
  'body2',
  'body3',
  'body4',
] as const);

export type EmblemLayerId = (typeof EMBLEM_LAYER_ORDER)[number];

export const EMBLEM_DEFAULT_LAYER_VISIBILITY = Object.freeze({
  crests: true,
  details: true,
  body1: false,
  body2: false,
  body3: false,
  body4: true,
} as const satisfies Readonly<Record<EmblemLayerId, boolean>>);

export const MAX_EMBLEM_PROJECT_FILE_BYTES = 1_048_576;

export type EmblemAssetCategory = 'body' | 'detail' | 'crest';
export type EmblemLocale = 'en' | 'zh';
export type EmblemBodyLayerId = Extract<EmblemLayerId, 'body1' | 'body2' | 'body3' | 'body4'>;

export interface EmblemCatalogAsset {
  readonly id: string;
  readonly category: EmblemAssetCategory;
  readonly publicPath: string;
  readonly width: number;
  readonly height: number;
  readonly name: Readonly<Record<EmblemLocale, string>>;
}

export type EmblemElementSource =
  | {
      readonly kind: 'catalog';
      readonly assetId: string;
      readonly url: string;
      readonly naturalWidth: number;
      readonly naturalHeight: number;
    }
  | {
      readonly kind: 'url';
      readonly url: string;
      readonly naturalWidth: number;
      readonly naturalHeight: number;
    };

export interface EmblemElementTransform {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly rotation: number;
  readonly mirrorX: boolean;
}

export interface EmblemElement {
  readonly id: string;
  readonly source: EmblemElementSource;
  readonly transform: EmblemElementTransform;
}

export interface EmblemLayer {
  readonly visible: boolean;
  readonly elements: readonly EmblemElement[];
}

export interface EmblemProject {
  readonly schemaVersion: 1;
  readonly canvas: typeof EMBLEM_CANVAS;
  readonly layers: Readonly<Record<EmblemLayerId, EmblemLayer>>;
}

export type EmblemProjectCommand =
  | {
      readonly type: 'add-element';
      readonly layerId: EmblemLayerId;
      readonly element: EmblemElement;
    }
  | {
      readonly type: 'set-element-transform';
      readonly elementId: string;
      readonly transform: EmblemElementTransform;
    }
  | { readonly type: 'remove-element'; readonly elementId: string }
  | { readonly type: 'clear-layer'; readonly layerId: EmblemLayerId }
  | {
      readonly type: 'set-layer-visibility';
      readonly layerId: EmblemLayerId;
      readonly visible: boolean;
    };
