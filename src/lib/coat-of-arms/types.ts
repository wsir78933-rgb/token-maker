export type CoatLocale = 'en' | 'zh';

export type CoatAssetKind =
  | 'shield'
  | 'ordinary'
  | 'charge'
  | 'top'
  | 'pattern'
  | 'background';

/** UI gallery sections; only shield entries are backed by the SVG reference catalog. */
export type CoatAssetGallerySection = 'shield' | 'charge' | 'top';

export type FieldDivision =
  | 'solid'
  | 'per-pale'
  | 'per-fess'
  | 'per-bend'
  | 'per-bend-sinister'
  | 'per-chevron'
  | 'quarterly'
  | 'gyronny'
  | 'tierced-per-pale'
  | 'tierced-per-fess'
  | 'per-saltire'
  | 'barry'
  | 'paly'
  | 'bendy';

export type FieldPattern = 'solid' | 'stripes' | 'dots' | 'checks' | 'lozengy' | 'crosses' | 'waves' | 'masoned' | 'honeycomb' | 'fretty' | 'scales' | 'chevronelly' | 'vair' | 'vair-in-pointe' | 'vair-in-pale' | 'paly-bendy' | 'barry-bendy' | 'gyronny' | 'papelonny' | 'seme';

export type FieldStripeDirection = 'bend' | 'bend-sinister' | 'horizontal' | 'vertical';

/** Optional locally persisted controls for the pattern families that support density or direction. */
export interface FieldPatternConfig {
  count?: number;
  direction?: FieldStripeDirection;
  rows?: number;
  bricks?: number;
  columns?: number;
  symbolSize?: number;
}

export type FieldDivisionLineStyle =
  | 'straight'
  | 'wavy'
  | 'indented'
  | 'engrailed'
  | 'invected'
  | 'embattled'
  | 'dovetailed'
  | 'potenty'
  | 'embattled-grady'
  | 'urdy'
  | 'embattled-in-crosses';

export interface FieldDivisionLine {
  style: FieldDivisionLineStyle;
  frequency: number;
  amplitude: number;
}

/**
 * Stable local identifiers for every independently authorable field division.
 * These IDs describe geometry, not a particular colour, so saved projects keep
 * their intended regions when a palette changes.
 */
export type FieldRegionId =
  | 'overall'
  | 'dexter'
  | 'sinister'
  | 'chief'
  | 'base'
  | 'bend-upper'
  | 'bend-lower'
  | 'bend-sinister-upper'
  | 'bend-sinister-lower'
  | 'chevron-chief'
  | 'chevron-base'
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'gyron-1'
  | 'gyron-2'
  | 'gyron-3'
  | 'gyron-4'
  | 'gyron-5'
  | 'gyron-6'
  | 'gyron-7'
  | 'gyron-8'
  | 'tierced-pale-1'
  | 'tierced-pale-2'
  | 'tierced-pale-3'
  | 'tierced-fess-1'
  | 'tierced-fess-2'
  | 'tierced-fess-3'
  | 'saltire-chief'
  | 'saltire-dexter'
  | 'saltire-base'
  | 'saltire-sinister'
  | 'bar-1'
  | 'bar-2'
  | 'bar-3'
  | 'bar-4'
  | 'bar-5'
  | 'paly-1'
  | 'paly-2'
  | 'paly-3'
  | 'paly-4'
  | 'paly-5'
  | 'bend-1'
  | 'bend-2'
  | 'bend-3'
  | 'bend-4'
  | 'bend-5';

/** Local colours and a locally clipped pattern for one division region. */
export interface FieldRegionStyle {
  colors: string[];
  pattern: FieldPattern;
  /** Pattern-local controls preserve legacy projects when omitted. */
  patternConfig?: FieldPatternConfig;
  /** Scales the region's own pattern around the shield centre; absent keeps 1×. */
  patternScale?: number;
}

export interface CoatField {
  division: FieldDivision;
  colors: string[];
  pattern: FieldPattern;
  /** Pattern-local controls preserve legacy projects when omitted. */
  patternConfig?: FieldPatternConfig;
  /**
   * Optional independent styling for each supported division region. Absent
   * fields retain the legacy shared colour and pattern behaviour.
   */
  regions?: Partial<Record<FieldRegionId, FieldRegionStyle>>;
  /** Optional configurable heraldic boundary used by the source editor's four split fields. */
  divisionLine?: FieldDivisionLine;
  /** Optional structural charges retained inside the shield clipping area. */
  ornaments?: FieldOrnament[];
  outline?: CoatFieldOutline;
}

export type FieldOrnamentKind = 'bar' | 'base' | 'bendlet' | 'chief' | 'cross' | 'fess' | 'mountain' | 'pale' | 'pile' | 'escutcheon' | 'bordure' | 'canton' | 'chevron' | 'pall' | 'saltire' | 'fretty';

export interface FieldOrnament {
  id: string;
  kind: FieldOrnamentKind;
  color: string;
  /** Optional local palette for a multi-colour structural charge. */
  colors?: string[];
  /** Relative local palette widths; one positive value is required per colour. */
  colorAmplitudes?: number[];
  x: number;
  y: number;
  scale: number;
  rotation: number;
  /** Individual span for structures such as a chief, canton, pile, or chevron. */
  width?: number;
  /** Individual vertical extent for structures that have a bounded height. */
  height?: number;
  /** Band, border, or stroke width for compatible structural charges. */
  thickness?: number;
  /** Mirrors directional structures without changing their shared position. */
  reversed?: boolean;
  /** Retains a canton’s aspect ratio while its width is edited. */
  keepAspectRatio?: boolean;
  /** Controls overlap between the mountain peaks. */
  overlap?: number;
  /** Switches a bendlet between bend and bend-sinister. */
  bendSinister?: boolean;
  /** Locally rendered heraldic edge for compatible structural charges. */
  edge?: FieldDivisionLine;
  /** Cross-specific band dimensions and intersection point. */
  crossHorizontalThickness?: number;
  crossVerticalThickness?: number;
  crossCenterX?: number;
  crossCenterY?: number;
  /** Saltire intersection point, relative to the 100 by 110 shield field. */
  saltireCenterX?: number;
  saltireCenterY?: number;
  /** Chevron arm rise and apex position, relative to the shield field. */
  chevronPeakHeight?: number;
  chevronVerticalPosition?: number;
  /** Pall branch junction point, relative to the shield field. */
  pallForkX?: number;
  pallForkY?: number;
  /** Mountain-specific peak count and slope multiplier. */
  mountainPeakCount?: number;
  mountainSteepness?: number;
}

/** Optional to preserve existing saved fields; absent uses the original visible dark outline. */
export interface CoatFieldOutline {
  visible: boolean;
  color: string;
  width: number;
}

/** Legacy coarse charge clipping placements retained for saved local projects. */
export type FieldPlacement = 'overall' | 'dexter' | 'sinister' | 'chief' | 'base' | 'q1' | 'q2' | 'q3' | 'q4';

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
  /** Optional non-uniform axes preserve older uniformly scaled local projects. */
  scaleX?: number;
  scaleY?: number;
  rotation: number;
  /** Optional axes preserve older unflipped local documents. */
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  /** Optional non-destructive crop in the editor's fixed 100 by 110 coordinates. */
  crop?: CanvasCrop;
  /** Optional target-editor field region for charge placement. */
  fieldPlacement?: FieldPlacement;
  /** Optional precise field region for new local charge clipping workflows. */
  fieldRegionId?: FieldRegionId;
  /** Keeps a placed charge inside both the shield silhouette and selected region. */
  clipToField?: boolean;
  /** Optional to keep existing saved local documents compatible; absent means fully opaque. */
  opacity?: number;
}

export interface CanvasCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CoatCanvas {
  width: number;
  height: number;
}

export interface CoatLayerBase {
  id: string;
  visible: boolean;
  locked: boolean;
  groupId: string | null;
}

export interface CoatGroup {
  id: string;
  opacity: number;
}

export interface BackgroundGradient {
  angle: number;
  startColor: string;
  endColor: string;
}

export interface BackgroundLayer extends CoatLayerBase {
  type: 'background';
  assetId: string;
  motif: FieldPattern;
  opacity: number;
  /** Optional local fill override that keeps the selected background library base intact. */
  fill?: string;
  /** Optional local-only linear gradient rendered into the background SVG. */
  gradient?: BackgroundGradient;
}

export interface ShieldLayer extends CoatLayerBase {
  type: 'shield';
  assetId: string;
  /** Browser-local high-contrast image/SVG mask for a user-created shield silhouette. */
  customMaskUploadId?: string;
  /** Locally authored, bounded M/L/Z silhouette that takes precedence over a library outline. */
  customOutlinePath?: string;
  /** Source-paint keyed overrides for bundled static shield materials. */
  colorReplacements?: Record<string, string>;
  field: CoatField;
  transform: CanvasTransform;
}

export interface OrdinaryLayer extends CoatLayerBase {
  type: 'ordinary';
  assetId: string;
  color: string;
  /** Source-colour keyed overrides for authored multi-part SVG assets. */
  colorReplacements?: Record<string, string>;
  transform: CanvasTransform;
}

export interface ChargeLayer extends CoatLayerBase {
  type: 'charge';
  assetId: string;
  /** The selected browser-local generated material, when this charge provides variants. */
  rasterVariantId?: CoatRasterVariantId;
  color: string;
  colorReplacements?: Record<string, string>;
  transform: CanvasTransform;
}

export interface TopLayer extends CoatLayerBase {
  type: 'top';
  assetId: string;
  /** The selected browser-local generated material, when this ornament provides variants. */
  rasterVariantId?: CoatRasterVariantId;
  color: string;
  colorReplacements?: Record<string, string>;
  transform: CanvasTransform;
}

/** A locally generated freehand path. Only the app's M/L coordinate grammar is persisted. */
export interface DrawLayer extends CoatLayerBase {
  type: 'draw';
  path: string;
  color: string;
  strokeWidth: number;
  transform: CanvasTransform;
}

export type LocalUploadMimeType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp'
  | 'image/svg+xml';

export interface ImageLayer extends CoatLayerBase {
  type: 'image';
  source: 'local-upload';
  uploadId: string;
  mimeType: LocalUploadMimeType;
  opacity: number;
  transform: CanvasTransform;
}

export interface TextLayer extends CoatLayerBase {
  type: 'text';
  text: string;
  color: string;
  fontSize: number;
  /** Browser-safe local font families keep exported SVG deterministic without network font loading. */
  fontFamily?: TextFontFamily;
  /** Optional values retain the original normal browser text appearance for saved local projects. */
  fontStyle?: TextFontStyle;
  /** Optional values retain the original normal browser text appearance for saved local projects. */
  fontWeight?: TextFontWeight;
  alignment: TextAlignment;
  path: TextPathPlacement;
  transform: CanvasTransform;
}

export type TextAlignment = 'left' | 'center' | 'right';

/** Closed local-only catalog. Each value resolves to a deterministic browser-safe SVG stack. */
export const textFontFamilies = ['serif', 'display-serif', 'blackletter', 'sans-serif', 'monospace', 'cursive'] as const;

export type TextFontFamily = typeof textFontFamilies[number];

export const textFontStacks: Readonly<Record<TextFontFamily, string>> = {
  serif: 'serif',
  'display-serif': 'Georgia, "Times New Roman", serif',
  blackletter: '"Old English Text MT", "Lucida Blackletter", serif',
  'sans-serif': 'sans-serif',
  monospace: 'monospace',
  cursive: 'cursive',
};

export type TextFontStyle = 'normal' | 'italic';

export type TextFontWeight = 'normal' | 'bold';

export type TextPathPlacement =
  | { mode: 'none' }
  | { mode: 'motto'; curve: 'upper' | 'lower' }
  | { mode: 'curve'; curve: 'upper' | 'lower' }
  | { mode: 'ring'; curve: 'clockwise' | 'counterclockwise' };

export type CoatLayer =
  | BackgroundLayer
  | ShieldLayer
  | OrdinaryLayer
  | ChargeLayer
  | TopLayer
  | DrawLayer
  | ImageLayer
  | TextLayer;

export interface LocalUpload {
  id: string;
  mimeType: LocalUploadMimeType;
  encoding: 'base64';
  data: string;
}

export interface CoatProject {
  id: string;
  locale: CoatLocale;
  name: string;
  canvas: CoatCanvas;
  palette: string[];
  uploads: LocalUpload[];
  groups: CoatGroup[];
  layers: CoatLayer[];
}

interface CoatAssetBase {
  id: string;
  name: Record<CoatLocale, string>;
  /** Local semantic aliases used only for material-library search. */
  searchTerms?: readonly string[];
  sourceUrl?: never;
}

export type GeometryCoatAssetKind = 'shield' | 'ordinary' | 'charge';

/** A separately recolourable vector region in an original locally authored asset. */
export interface CoatSvgPart {
  svgPath: string;
  sourceColor: string;
}

export type CoatRasterVariantId = 'a' | 'b';

/** One original, browser-local WebP alternative for a bundled library material. */
export interface CoatRasterVariant {
  id: CoatRasterVariantId;
  src: string;
}

interface VectorCoatAssetSource {
  svgPath: string;
  svgParts?: readonly CoatSvgPart[];
  /** Full authored local SVG for non-destructive shield material rendering. */
  staticImageSrc?: string;
  rasterSrc?: never;
}

/** A pre-rendered local material. New material catalogues use this source only. */
interface RasterCoatAssetSource {
  rasterSrc: string;
  svgPath?: never;
  svgParts?: never;
}

export interface GeometryCoatAsset<Kind extends Exclude<GeometryCoatAssetKind, 'charge' | 'ordinary'>>
  extends CoatAssetBase, VectorCoatAssetSource {
  kind: Kind;
}

export type OrdinaryCoatAsset = CoatAssetBase & {
  kind: 'ordinary';
} & (VectorCoatAssetSource | RasterCoatAssetSource);

export type ChargeAssetCategory =
  | 'animal'
  | 'object'
  | 'plant'
  | 'human'
  | 'symbol';

export type ChargeCoatAsset = CoatAssetBase & {
  kind: 'charge';
  category: ChargeAssetCategory;
  /** Two original raster alternatives replace the legacy SVG presentation for target libraries. */
  rasterVariants?: readonly [CoatRasterVariant, CoatRasterVariant];
} & (VectorCoatAssetSource | RasterCoatAssetSource);

export interface PatternCoatAsset extends CoatAssetBase {
  kind: 'pattern';
  fieldPattern: Exclude<FieldPattern, 'solid'>;
}

export interface BackgroundCoatAsset extends CoatAssetBase {
  kind: 'background';
  fill: string;
}

export type TopAssetCategory = 'mantle' | 'crown' | 'supporter' | 'other';

export type TopCoatAsset = CoatAssetBase & {
  kind: 'top';
  category: TopAssetCategory;
  /** Two original raster alternatives replace the legacy SVG presentation for target libraries. */
  rasterVariants?: readonly [CoatRasterVariant, CoatRasterVariant];
} & (VectorCoatAssetSource | RasterCoatAssetSource);

export type CoatAsset =
  | GeometryCoatAsset<'shield'>
  | OrdinaryCoatAsset
  | ChargeCoatAsset
  | TopCoatAsset
  | PatternCoatAsset
  | BackgroundCoatAsset;

export type CoatAssetByKind<Kind extends CoatAssetKind> = Extract<
  CoatAsset,
  { kind: Kind }
>;
