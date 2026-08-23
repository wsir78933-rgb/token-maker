import type { CoatLocale, FieldRegionId } from '@/lib/coat-of-arms/types';
import type { ReferenceCatalogSection } from '@/lib/coat-of-arms/reference-catalog';
import type { NameGeneratorType } from '@/lib/coat-of-arms/name-generator';

export const toolOrder = ['position', 'shields', 'custom', 'charges', 'top', 'colors', 'tools', 'how-to', 'settings', 'flags'] as const;
export type ReferenceToolId = (typeof toolOrder)[number];
export type ReferenceNavigationId = 'tokens';
export type SelectionResizeHandle =
  | 'northwest'
  | 'north'
  | 'northeast'
  | 'east'
  | 'southeast'
  | 'south'
  | 'southwest'
  | 'west';

export type CustomFieldRegionId =
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
  | 'saltire-chief'
  | 'saltire-dexter'
  | 'saltire-sinister'
  | 'saltire-base';

const chineseResizeHandleNames: Record<SelectionResizeHandle, string> = {
  northwest: '左上',
  north: '上',
  northeast: '右上',
  east: '右',
  southeast: '右下',
  south: '下',
  southwest: '左下',
  west: '左',
};

function getChineseErrorDetail(message: string): string {
  if (/\p{Script=Han}/u.test(message)) return message;
  if (!/^(Invalid|Unsupported) [^:]+:\s*/.test(message)) return '';
  const value = message.match(/:\s*([^:;]+?)(?:;\s*limit is.*)?$/)?.[1]?.trim();
  return value && /^[#A-Za-z0-9_./-]{1,80}$/.test(value) ? value : '';
}

function formatChineseFailure(prefix: string, recovery: string, message: string): string {
  const detail = getChineseErrorDetail(message);
  if (/\p{Script=Han}/u.test(detail)) return `${prefix}：${detail}`;
  return `${prefix}。${recovery}${detail ? `（${detail}）` : ''}。`;
}

const englishShieldPresetNames = {
  'gold-heater': 'gold heater',
  'red-pale': 'red and gold pale heater',
  'red-chief': 'red and gold chief heater',
  'red-bend': 'red and gold bend heater',
  'gold-cross': 'gold cross heater',
  'gold-saltire': 'gold saltire heater',
  'gold-chevron': 'gold chevron heater',
  'gold-bend': 'gold bend-sinister heater',
  'red-barry': 'red and gold barry heater',
  'gold-paly': 'gold paly heater',
  'red-bendy': 'red and gold bendy heater',
  'gold-gyronny': 'gold gyronny heater',
  'french-gold': 'gold French',
  'banner-red': 'red banner',
  'round-gold': 'gold round',
  'lozenge-red': 'red lozenge',
  'gold-tierced': 'gold tierced heater',
  'french-pale': 'red and gold pale French',
  'banner-barry': 'red and gold barry banner',
  'round-bendy': 'gold bendy round',
} as const;

type ShieldPresetId = keyof typeof englishShieldPresetNames;

const chineseShieldPresetNames: Record<ShieldPresetId, string> = {
  'gold-heater': '金色熨斗盾',
  'red-pale': '红金纵分熨斗盾',
  'red-chief': '红金横分熨斗盾',
  'red-bend': '红金斜分熨斗盾',
  'gold-cross': '金色十字熨斗盾',
  'gold-saltire': '金色斜十字熨斗盾',
  'gold-chevron': '金色人字熨斗盾',
  'gold-bend': '金色反斜熨斗盾',
  'red-barry': '红金横条熨斗盾',
  'gold-paly': '金色竖条熨斗盾',
  'red-bendy': '红金斜条熨斗盾',
  'gold-gyronny': '金色放射熨斗盾',
  'french-gold': '金色法式盾',
  'banner-red': '红色旗帜盾',
  'round-gold': '金色圆盾',
  'lozenge-red': '红色菱形盾',
  'gold-tierced': '金色三分熨斗盾',
  'french-pale': '红金纵分法式盾',
  'banner-barry': '红金横条旗帜盾',
  'round-bendy': '金色斜条圆盾',
};

function getShieldPresetName(presetId: string, presetNames: Readonly<Record<ShieldPresetId, string>>): string {
  const presetName = presetNames[presetId as ShieldPresetId];
  if (!presetName) throw new Error(`Unknown shield preset: ${presetId}`);
  return presetName;
}

const englishFlagPresetNames = {
  'vertical-tricolour': 'Vertical tricolour',
  'horizontal-tricolour': 'Horizontal tricolour',
  'diagonal-bicolour': 'Diagonal bicolour',
  'nordic-cross': 'Nordic cross',
  'quartered-colours': 'Quartered colours',
  'barred-banner': 'Barred banner',
  'saltire-banner': 'Saltire banner',
  'chevron-banner': 'Chevron banner',
} as const;

export type FlagPresetId = keyof typeof englishFlagPresetNames;
export const flagPresetCategories = ['tricolour', 'cross', 'diagonal', 'band'] as const;
export type FlagPresetCategory = (typeof flagPresetCategories)[number];
export const tokenPaletteCategories = ['featured', 'animal', 'object', 'plant', 'human', 'symbol'] as const;
export type TokenPaletteCategory = (typeof tokenPaletteCategories)[number];

const chineseFlagPresetNames: Record<FlagPresetId, string> = {
  'vertical-tricolour': '竖向三色旗',
  'horizontal-tricolour': '横向三色旗',
  'diagonal-bicolour': '斜向双色旗',
  'nordic-cross': '北欧十字旗',
  'quartered-colours': '四色分旗',
  'barred-banner': '横条旗',
  'saltire-banner': '斜十字旗',
  'chevron-banner': '人字旗',
};

function getFlagPresetName(presetId: string, presetNames: Readonly<Record<FlagPresetId, string>>): string {
  const presetName = presetNames[presetId as FlagPresetId];
  if (!presetName) throw new Error(`Unknown flag preset: ${presetId}`);
  return presetName;
}

const exportFileTypeNamesByLocale = {
  en: { png: 'PNG', jpeg: 'JPG', pdf: 'PDF' },
  zh: { png: 'PNG', jpeg: 'JPG', pdf: 'PDF' },
} as const;

function formatDownloadExportLabel(fileType: 'png' | 'jpeg' | 'pdf', locale: CoatLocale): string {
  const fileTypeName = exportFileTypeNamesByLocale[locale][fileType];
  if (!fileTypeName) throw new Error(`Unknown coat export file type: ${String(fileType)}`);
  return locale === 'zh' ? `下载 ${fileTypeName}` : `Download ${fileTypeName}`;
}

export interface CoatWorkbenchCopy {
  workspace: string;
  desktopTools: string;
  toolCategories: string;
  toolRailLabel: string;
  layerDock: string;
  localFirstMaker: string;
  undo: string;
  redo: string;
  export: string;
  scene: string;
  projectAndLayers: string;
  layerDockHint: string;
  inspector: string;
  tools: string;
  closeTools: string;
  defaultMotto: string;
  exportOptions: string;
  closeExportMenu: string;
  exportSize: string;
  exportPng: string;
  exportJpeg: string;
  copyImage: string;
  shareImage: string;
  jpegQuality: string;
  jpegQualities: Record<'low' | 'medium' | 'high' | 'ultra', string>;
  exportFileType: string;
  exportQuality: string;
  exportTransparentBackground: string;
  exportFileTypeNames: { png: string; jpeg: string; pdf: string };
  downloadExport: (fileType: 'png' | 'jpeg' | 'pdf') => string;
  exportShare: string;
  exportPrint: string;
  exportPdf: string;
  print: string;
  exportBatch: string;
  pngExported: string;
  jpegExported: string;
  imageCopied: string;
  imageShared: string;
  pdfExported: string;
  printOpened: string;
  batchExported: string;
  exportOperationFailed: (message: string) => string;
  randomizeProject: string;
  randomizeDescription: string;
  randomizeUnavailable: string;
  draftAvailable: string;
  draftRecoveryDescription: string;
  invalidDraftRecoveryDescription: (message: string) => string;
  restoreDraft: string;
  discardDraft: string;
  toolTabs: Record<ReferenceToolId, string>;
  navigationItems: Record<ReferenceNavigationId, string>;
  utilityTabs: Record<'text' | 'draw' | 'random' | 'names' | 'layers', string>;
  shell: {
    brand: { firstLine: string; secondLine: string; accent: string };
    informationNavigation: string;
    helpCenter: string;
    changelog: string;
    shieldStyles: string;
    collapseToolPanel: string;
    expandToolPanel: string;
    magnetSnapping: string;
    multiSelect: string;
    canvasZoom: string;
    canvasZoomPercentage: string;
    selectedElementColours: string;
    changeElementColour: (fromColor: string) => string;
    resetCanvasZoom: string;
    enterFullscreen: string;
    exitFullscreen: string;
    fullscreenRootMissing: string;
    fullscreenExitUnavailable: string;
    fullscreenUnavailable: string;
    fullscreenOperationFailed: (message: string) => string;
    editorUtilities: string;
    howToPanel: string;
    howToHeading: string;
    howToDescription: string;
  };
  palettes: {
    referenceGallery: {
      library: Record<ReferenceCatalogSection, string>;
      categoryFilter: Record<ReferenceCatalogSection, string>;
      search: Record<ReferenceCatalogSection, string>;
      noResults: Record<ReferenceCatalogSection, string>;
      loadMore: string;
      categories: Record<ReferenceCatalogSection, Record<string, string>>;
      cardAction: (section: ReferenceCatalogSection, name: string) => string;
    };
    shield: {
      library: string;
      search: string;
      presets: string;
      presetName: (presetId: string) => string;
      usePreset: (presetId: string) => string;
      showAdvanced: string;
      hideAdvanced: string;
    };
    token: {
      library: string;
      heading: string;
      description: string;
      categoryFilter: string;
      categories: Record<TokenPaletteCategory, string>;
      search: string;
      noResults: string;
      addAsset: (name: string) => string;
    };
    flag: {
      library: string;
      heading: string;
      description: string;
      categoryFilter: string;
      categories: Record<FlagPresetCategory, string>;
      search: string;
      noResults: string;
      presetName: (presetId: string) => string;
      usePreset: (name: string) => string;
    };
  };
  canvas: {
    label: string;
    help: string;
    selectedLayerControls: string;
    selectedLayerToolbar: string;
    resizeSelectedLayer: string;
    resizeSelectedLayerHandle: (handle: SelectionResizeHandle) => string;
    adjustCurvedTextHandle: string;
    adjustCurvedTextStartHandle: string;
    adjustCurvedTextEndHandle: string;
    adjustRingTextHandle: string;
    adjustStraightTextWidthHandle: (side: 'left' | 'right') => string;
    rotateSelectedLayer: string;
    duplicateSelectedElement: string;
    flipSelectedElementHorizontally: string;
    selectedElementLayerOrder: string;
    deleteSelectedElement: string;
    lockSelectedElement: string;
    unlockSelectedElement: string;
    hideSelectedElement: string;
    showSelectedElement: string;
  };
  panels: {
    editorTools: string;
    commandFailed: (message: string) => string;
    position: string;
    arrange: string;
    noPositionSelection: string;
    positionValues: string;
    positionX: string;
    positionY: string;
    positionScale: string;
    positionWidth: string;
    positionHeight: string;
    keepAspectRatio: string;
    positionRotation: string;
    positionOpacity: string;
    layerSize: string;
    sizeWidth: string;
    sizeHeight: string;
    rotation: string;
    opacity: string;
    flipSelectedLayer: string;
    flipHorizontal: string;
    flipVertical: string;
    fieldPlacement: string;
    fieldPlacements: Record<string, string>;
    clipChargeToField: string;
    order: string;
    forward: string;
    backward: string;
    toFront: string;
    toBack: string;
    align: string;
    alignments: Record<'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom', string>;
    shieldAndField: string;
    noShieldLayer: string;
    editingEscutcheon: (ordinal: number) => string;
    editingLabel: string;
    editingEscutcheonName: (ordinal: number) => string;
    addNewEscutcheon: string;
    escutcheonLibrary: string;
    selectEscutcheonShape: (name: string) => string;
    customShieldUploads: string;
    customShieldUploadHint: string;
    shieldOutline: string;
    shieldOutlineSource: string;
    shieldOutlineSources: Record<'library' | 'custom-vector', string>;
    customVectorShieldOutline: string;
    customVectorShieldPath: string;
    applyCustomVectorShieldOutline: string;
    resetCustomVectorShieldOutline: string;
    customShieldMask: string;
    defaultShieldMask: string;
    uploadCustomShieldMask: string;
    customShieldMaskAdded: (filename: string) => string;
    divisionOfField: string;
    overallFieldTarget: string;
    customFieldDivisionNames: Record<string, string>;
    fieldDivisionChoice: (name: string) => string;
    variationOfField: string;
    customFieldVariationNames: Record<string, string>;
    fieldVariationChoice: (name: string) => string;
    embeddedColors: string;
    embeddedColorSwatch: (color: string) => string;
    embeddedCharges: string;
    addChargeToEscutcheon: string;
    lineWidth: string;
    lineWidthValue: (width: number) => string;
    showBorder: string;
    bendSinister: string;
    keepPatternToField: string;
    overallOnTop: string;
    divisionLineStyle: string;
    customFieldRegionSectionNames: Record<CustomFieldRegionId, string>;
    fieldDivision: string;
    fieldVariation: string;
    fieldPatternControl: (pattern: string, control: string) => string;
    fieldRegionPatternControl: (name: string, pattern: string, control: string) => string;
    fieldStripeDirections: Record<'bend' | 'bend-sinister' | 'horizontal' | 'vertical', string>;
    fieldRegions: string;
    fieldRegionNames: Record<FieldRegionId, string>;
    fieldRegion: (name: string) => string;
    fieldRegionVariation: (name: string) => string;
    fieldRegionPrimaryColour: (name: string) => string;
    fieldRegionAccentColour: (name: string) => string;
    fieldRegionPatternScale: (name: string) => string;
    fieldDivisionLine: string;
    fieldDivisionLineStyles: Record<string, string>;
    divisionLineFrequency: string;
    divisionLineAmplitude: string;
    fieldPrimaryColour: string;
    fieldAccentColour: string;
    shieldBorderColour: string;
    shieldBorderWidth: string;
    showShieldBorder: string;
    fieldOrnaments: string;
    fieldOrnament: string;
    fieldOrnamentKinds: Record<string, string>;
    addFieldOrnament: string;
    removeFieldOrnament: string;
    moveFieldOrnamentBackward: (id: string) => string;
    moveFieldOrnamentBackwardLabel: string;
    moveFieldOrnamentForward: (id: string) => string;
    moveFieldOrnamentForwardLabel: string;
    fieldOrnamentItem: (kind: string) => string;
    fieldOrnamentColour: string;
    fieldOrnamentPaletteColour: (index: number) => string;
    fieldOrnamentColourAmplitude: (index: number) => string;
    addFieldOrnamentColour: string;
    removeFieldOrnamentColour: (index: number) => string;
    fieldOrnamentX: string;
    fieldOrnamentY: string;
    fieldOrnamentScale: string;
    fieldOrnamentWidth: string;
    fieldOrnamentHeight: string;
    fieldOrnamentThickness: string;
    fieldOrnamentReversed: string;
    fieldOrnamentKeepAspectRatio: string;
    fieldOrnamentOverlap: string;
    fieldOrnamentBendSinister: string;
    fieldOrnamentEdge: string;
    crossHorizontalThickness: string;
    crossVerticalThickness: string;
    crossCentreX: string;
    crossCentreY: string;
    saltireCentreX: string;
    saltireCentreY: string;
    chevronPeakHeight: string;
    chevronVerticalPosition: string;
    pallForkX: string;
    pallForkY: string;
    mountainPeakCount: string;
    mountainSteepness: string;
    fieldDivisions: Record<string, string>;
    fieldPatterns: Record<string, string>;
    ordinariesAndCharges: string;
    libraryCategory: string;
    charges: string;
    chargeCategory: string;
    chargeCategories: Record<'animal' | 'object' | 'plant' | 'human' | 'symbol', string>;
    chargesTreeUpload: string;
    shieldTreeLabels: {
      'kite-shield': string;
      'heater-shield': string;
      'french-shield': string;
      'banner-shield': string;
      'round-shield': string;
      'lozenge-shield': string;
    };
    ordinaries: string;
    searchLibrary: string;
    addRandom: (kind: string) => string;
    noLocalAssets: (kind: string) => string;
    assetLibrary: (kind: string) => string;
    addAsset: (name: string) => string;
    previewAsset: (name: string) => string;
    top: string;
    topCategory: string;
    topLibrary: string;
    topCategories: Record<'mantle' | 'crown' | 'supporter' | 'other', string>;
    settings: string;
    appearance: string;
    appearanceDark: string;
    colorPicker: string;
    colorPickerSimple: string;
    colorPickerAdvanced: string;
    colorPickerHelp: string;
    heraldicSwatchGroups: Record<'metals' | 'colours' | 'stains' | 'other', string>;
    canvasSize: string;
    canvasWidth: string;
    canvasHeight: string;
    applyCanvasSize: string;
    resetEditor: string;
    canvasPresets: string;
    canvasPresetNames: Record<string, string>;
    canvasPresetSize: (width: number, height: number) => string;
    draw: string;
    drawingColour: string;
    drawingStrokeWidth: string;
    drawOnCanvas: string;
    enableDrawingMode: string;
    drawingOpacity: string;
    previewStroke: string;
    drawHelp: string;
    names: string;
    nameGeneratorType: string;
    nameGeneratorLanguage: string;
    nameGeneratorLanguages: Record<'en' | 'de', string>;
    nameGeneratorTypes: Record<NameGeneratorType, string>;
    nameResults: string;
    generateNames: (typeName: string) => string;
    copyGeneratedName: (name: string) => string;
    savedNames: string;
    removeSavedName: (name: string) => string;
    nameCopied: (name: string) => string;
    coloursAndBackground: string;
    usedColours: string;
    colorTreeUsed: string;
    colorPalettes: string;
    colorCustom: string;
    usedColoursHint: string;
    usedColourSwatch: (color: string) => string;
    setPaletteAsDefault: string;
    addPalette: string;
    defaultPaletteBadge: string;
    paletteGroupHeadings: Record<'metals' | 'colors' | 'other-colors' | 'extra', string>;
    paletteSwatch: (paletteName: string, swatchName: string, hex: string) => string;
    customColorPalettes: string;
    customColorPalettesHelp: string;
    selectElementToApplyColour: string;
    background: string;
    customPaletteColour: string;
    saveCustomColour: string;
    replaceColourFrom: string;
    replaceColourWith: string;
    replaceAllColours: string;
    backgroundColour: string;
    customBackgroundColour: string;
    backgroundGradient: string;
    backgroundGradientAngle: string;
    backgroundGradientStartColour: string;
    backgroundGradientEndColour: string;
    applyBackgroundGradient: string;
    backgroundMotif: string;
    backgroundOpacity: string;
    transparentBackground: string;
    transparentExportBackground: string;
    backgroundVisible: string;
    backgroundLayers: string;
    noBackgroundLayers: string;
    addBackgroundCharge: string;
    backgroundColourSwatch: (color: string) => string;
    perLayerColours: string;
    colourForLayer: (layerId: string) => string;
    colourForAssetPart: (layerId: string, sourceColor: string) => string;
    textAndMotto: string;
    mottoText: string;
    textColour: string;
    typographySize: string;
    fontFamily: string;
    textFonts: Record<'serif' | 'display-serif' | 'blackletter' | 'sans-serif' | 'monospace' | 'cursive', string>;
    fontStyle: string;
    fontWeight: string;
    textFontStyles: Record<'normal' | 'italic', string>;
    textFontWeights: Record<'normal' | 'bold', string>;
    textAlignment: string;
    textPath: string;
    textTransform: string;
    x: string;
    y: string;
    scale: string;
    textAlignments: Record<string, string>;
    textPaths: Record<string, string>;
    addMotto: string;
    updateSelectedText: string;
    uploadImage: string;
    uploadDescription: string;
    uploadCrestImage: string;
    localUploads: string;
    localUploadItem: (index: number, mimeType: string) => string;
    addLocalImage: (index: number) => string;
    removeLocalUpload: (index: number) => string;
    localImageAdded: (fileName: string) => string;
    localImagesAdded: (count: number) => string;
    localUploadCompressed: (fileName: string, originalBytes: number, resultBytes: number) => string;
    layers: string;
    coatLayers: string;
    selectLayer: (layerId: string, name: string) => string;
    select: string;
    layerType: (type: string) => string;
    moveLayerUp: (name: string) => string;
    moveLayerDown: (name: string) => string;
    hideLayer: (name: string) => string;
    showLayer: (name: string) => string;
    lockLayer: (name: string) => string;
    unlockLayer: (name: string) => string;
    deleteLayer: (name: string) => string;
    renameLayer: (name: string) => string;
    reorderLayer: (name: string) => string;
    searchLayers: string;
    noMatchingLayers: string;
    moveUp: string;
    moveDown: string;
    hide: string;
    show: string;
    lock: string;
    unlock: string;
    delete: string;
    duplicateSelectedLayers: string;
    groupSelectedLayers: string;
    ungroupSelectedLayers: string;
    groupOpacity: string;
    localImage: string;
    localDrawing: string;
    textFeature: {
      creationHint: string;
      cards: Record<'text' | 'curved' | 'ring', { title: string; description: string; defaultText: string }>;
      defaultObjectText: string;
      toolbar: {
        font: string;
        fontSize: string;
        decreaseFontSize: string;
        increaseFontSize: string;
        textColour: string;
        bold: string;
        italic: string;
        underline: string;
        alignment: string;
        left: string;
        center: string;
        right: string;
        styles: string;
        strokeColour: string;
        strokeWidth: string;
        in: { label: string; ariaLabel: string };
        out: { label: string; ariaLabel: string };
        arc: { label: string; ariaLabel: string };
        even: { label: string; ariaLabel: string };
        lock: string;
        unlock: string;
        hide: string;
        show: string;
        duplicate: string;
        delete: string;
      };
      inline: { editor: string; commit: string; cancel: string };
    };
  };
}

type CustomFieldPanelCopy = Pick<CoatWorkbenchCopy['panels'],
  | 'divisionOfField'
  | 'overallFieldTarget'
  | 'customFieldDivisionNames'
  | 'fieldDivisionChoice'
  | 'variationOfField'
  | 'customFieldVariationNames'
  | 'fieldVariationChoice'
  | 'embeddedColors'
  | 'embeddedColorSwatch'
  | 'embeddedCharges'
  | 'addChargeToEscutcheon'
  | 'lineWidth'
  | 'lineWidthValue'
  | 'showBorder'
  | 'bendSinister'
  | 'keepPatternToField'
  | 'overallOnTop'
  | 'divisionLineStyle'
  | 'customFieldRegionSectionNames'
>;

const customFieldPanelCopyByLocale: Record<CoatLocale, CustomFieldPanelCopy> = {
  en: {
    divisionOfField: 'Division of the Field', overallFieldTarget: 'Overall',
    customFieldDivisionNames: { solid: 'Undivided', 'per-pale': 'Per Pale', 'per-fess': 'Per Fess', 'per-bend': 'Per Bend', 'per-chevron': 'Per Chevron', quarterly: 'Per Cross', 'per-saltire': 'Per Saltire' },
    fieldDivisionChoice: (name) => `Select field division: ${name}`,
    variationOfField: 'Variation of the Field', customFieldVariationNames: { solid: 'None', barry: 'Barry', paly: 'Paly', bendy: 'Bendy', masoned: 'Masoned', checks: 'Chequy', lozengy: 'Lozengy', chevronelly: 'Chevronelly', vair: 'Vair', 'vair-in-pointe': 'Vair in-pointe', 'vair-in-pale': 'Vair in pale', 'paly-bendy': 'Paly-Bendy', 'barry-bendy': 'Barry-Bendy', gyronny: 'Gyronny', papelonny: 'Papelonny', honeycomb: 'Honeycomb', seme: 'Semé' }, fieldVariationChoice: (name) => `Select field variation: ${name}`,
    embeddedColors: 'Colors', embeddedColorSwatch: (color) => `Escutcheon colour: ${color}`,
    embeddedCharges: 'Charges', addChargeToEscutcheon: 'Add Charge', lineWidth: 'Line Width',
    lineWidthValue: (width) => `${width}px`, showBorder: 'Show Border',
    bendSinister: 'Bend Sinister', keepPatternToField: 'Keep pattern to field', overallOnTop: 'Overall (on top)', divisionLineStyle: 'Division Line Style',
    customFieldRegionSectionNames: {
      dexter: 'Dexter (Left Side)',
      sinister: 'Sinister (Right Side)',
      chief: 'Chief (Upper Half)',
      base: 'Base (Lower Half)',
      'bend-upper': 'Dexter (Upper Left)',
      'bend-lower': 'Sinister (Lower Right)',
      'bend-sinister-upper': 'Sinister (Upper Right)',
      'bend-sinister-lower': 'Dexter (Lower Left)',
      'chevron-chief': 'Chief (Upper Section)',
      'chevron-base': 'Base (Chevron Section)',
      q1: 'Quarter 1 (Upper Left)',
      q2: 'Quarter 2 (Upper Right)',
      q3: 'Quarter 3 (Lower Left)',
      q4: 'Quarter 4 (Lower Right)',
      'saltire-chief': 'Chief (Top)',
      'saltire-dexter': 'Dexter (Left)',
      'saltire-sinister': 'Sinister (Right)',
      'saltire-base': 'Base (Bottom)',
    },
  },
  zh: {
    divisionOfField: '底纹分割', overallFieldTarget: '整体',
    customFieldDivisionNames: { solid: '不分割', 'per-pale': '纵向二分', 'per-fess': '横向二分', 'per-bend': '斜向二分', 'per-chevron': '人字分割', quarterly: '十字分割', 'per-saltire': '斜十字分割' },
    fieldDivisionChoice: (name) => `选择底纹分割：${name}`,
    variationOfField: '底纹样式', customFieldVariationNames: { solid: '无', barry: '横条', paly: '竖条', bendy: '斜条', masoned: '砌石纹', checks: '棋盘格', lozengy: '菱格', chevronelly: '连续人字纹', vair: '松鼠皮纹', 'vair-in-pointe': '尖角松鼠皮纹', 'vair-in-pale': '纵向松鼠皮纹', 'paly-bendy': '竖斜复合条纹', 'barry-bendy': '横斜复合条纹', gyronny: '放射纹', papelonny: '扇贝纹', honeycomb: '蜂巢纹', seme: '散点纹' }, fieldVariationChoice: (name) => `选择底纹样式：${name}`,
    embeddedColors: '颜色', embeddedColorSwatch: (color) => `盾形颜色：${color}`,
    embeddedCharges: '构件', addChargeToEscutcheon: '添加徽记', lineWidth: '边框宽度',
    lineWidthValue: (width) => `${width}px`, showBorder: '显示边框',
    bendSinister: '反斜向分割', keepPatternToField: '纹样限制在分区内', overallOnTop: '整体（叠上）', divisionLineStyle: '分割线样式',
    customFieldRegionSectionNames: {
      dexter: '左半',
      sinister: '右半',
      chief: '上半',
      base: '下半',
      'bend-upper': '左上',
      'bend-lower': '右下',
      'bend-sinister-upper': '右上',
      'bend-sinister-lower': '左下',
      'chevron-chief': '人字上方',
      'chevron-base': '人字下方',
      q1: '第一象限',
      q2: '第二象限',
      q3: '第三象限',
      q4: '第四象限',
      'saltire-chief': '上方',
      'saltire-dexter': '左侧',
      'saltire-sinister': '右侧',
      'saltire-base': '下方',
    },
  },
};

type TextFeatureCopy = CoatWorkbenchCopy['panels']['textFeature'];

const textFeatureCopyByLocale: Record<CoatLocale, TextFeatureCopy> = {
  en: {
    creationHint: 'Click to add or drag onto the canvas. Edit text in the toolbar.',
    cards: {
      text: { title: 'Text', description: 'Editable text box — double-click to edit', defaultText: 'Double-click to edit' },
      curved: { title: 'Curved Text', description: 'Text along a bezier curve — drag handles to shape', defaultText: 'Curved Text' },
      ring: { title: 'Ring Text', description: 'Text in a circle — drag handle to adjust', defaultText: 'Ring Text' },
    },
    defaultObjectText: 'Double-click to edit',
    toolbar: {
      font: 'Font', fontSize: 'Font size', decreaseFontSize: 'Decrease font size', increaseFontSize: 'Increase font size',
      textColour: 'Text colour', bold: 'Bold', italic: 'Italic', underline: 'Underline', alignment: 'Text alignment', left: 'Left', center: 'Center', right: 'Right', styles: 'Styles', strokeColour: 'Stroke colour', strokeWidth: 'Stroke width',
      in: { label: 'IN', ariaLabel: 'Face text inward' },
      out: { label: 'OUT', ariaLabel: 'Face text outward' },
      arc: { label: 'ARC', ariaLabel: 'Arc text' },
      even: { label: 'EVEN', ariaLabel: 'Space letters evenly' },
      lock: 'Lock', unlock: 'Unlock', hide: 'Hide', show: 'Show', duplicate: 'Duplicate', delete: 'Delete',
    },
    inline: { editor: 'Edit text', commit: 'Commit text edit', cancel: 'Cancel text edit' },
  },
  zh: {
    creationHint: '点击添加或拖到画布上。在工具栏中编辑文字。',
    cards: {
      text: { title: '文字', description: '可编辑文字框——双击即可编辑', defaultText: '双击编辑' },
      curved: { title: '弧形文字', description: '沿贝塞尔曲线排列——拖动控制柄调整形状', defaultText: '弧形文字' },
      ring: { title: '环形文字', description: '文字排列成圆形——拖动控制柄调整', defaultText: '环形文字' },
    },
    defaultObjectText: '双击编辑',
    toolbar: {
      font: '字体', fontSize: '字号', decreaseFontSize: '减小字号', increaseFontSize: '增大字号',
      textColour: '文字颜色', bold: '粗体', italic: '斜体', underline: '下划线', alignment: '文字对齐', left: '左对齐', center: '居中', right: '右对齐', styles: '样式', strokeColour: '描边颜色', strokeWidth: '描边宽度',
      in: { label: '朝内', ariaLabel: '文字朝内排列' },
      out: { label: '朝外', ariaLabel: '文字朝外排列' },
      arc: { label: '弧', ariaLabel: '弧形排列' },
      even: { label: '均匀', ariaLabel: '均匀分布文字' },
      lock: '锁定', unlock: '解锁', hide: '隐藏', show: '显示', duplicate: '复制', delete: '删除',
    },
    inline: { editor: '编辑文字', commit: '确认文字编辑', cancel: '取消文字编辑' },
  },
};

const workbenchCopyByLocale: Record<CoatLocale, CoatWorkbenchCopy> = {
  en: {
    workspace: 'Coat maker workspace', desktopTools: 'Desktop coat tools', toolCategories: 'Coat tool categories', toolRailLabel: 'Coat maker tools', layerDock: 'Project and layer dock',
    localFirstMaker: 'Local-first maker', undo: 'Undo', redo: 'Redo', export: 'Export', scene: 'Coat scene',
    projectAndLayers: 'Project & layers', layerDockHint: 'Select layers to arrange, lock, or group them.', inspector: 'Inspector', tools: 'Tools', closeTools: 'Close tools',
    defaultMotto: 'FORTUNE FAVOURS', exportOptions: 'Local export options',
    closeExportMenu: 'Close export menu', exportSize: 'Export size', exportPng: 'Export PNG', exportJpeg: 'Export JPG', copyImage: 'Copy image', shareImage: 'Share image', jpegQuality: 'JPG quality', jpegQualities: { low: 'Low', medium: 'Medium', high: 'High', ultra: 'Ultra' },
    exportFileType: 'File type', exportQuality: 'Quality', exportTransparentBackground: 'Transparent background',
    exportFileTypeNames: exportFileTypeNamesByLocale.en, downloadExport: (fileType) => formatDownloadExportLabel(fileType, 'en'),
    exportShare: 'Share', exportPrint: 'Print', exportPdf: 'Export PDF',
    print: 'Print locally', exportBatch: 'Export batch ZIP', pngExported: 'PNG exported locally.', jpegExported: 'JPG exported locally.', imageCopied: 'Image copied to clipboard.', imageShared: 'Native share sheet opened.', pdfExported: 'PDF exported locally.',
    printOpened: 'Print view opened locally.', batchExported: 'Batch ZIP exported locally.',
    exportOperationFailed: (message) => `Export failed: ${message}`,
    randomizeProject: 'Create Random Coat of Arms', randomizeDescription: 'Click on the button to generate random coats of arms. Edit the designs until they fit your needs.', randomizeUnavailable: 'Project randomization is not available yet.',
    draftAvailable: 'Draft available', draftRecoveryDescription: 'A local draft is available. Your current project stays unchanged until you restore it.', invalidDraftRecoveryDescription: (message) => `The local draft could not be recovered: ${message}. It has been preserved until you discard it.`, restoreDraft: 'Restore draft', discardDraft: 'Discard draft',
    toolTabs: { position: 'Position', shields: 'Shields', custom: 'Custom', charges: 'Charges', top: 'Top', colors: 'Colors', tools: 'Tools', 'how-to': 'How-to', settings: 'Settings', flags: 'Flags' },
    navigationItems: { tokens: 'Tokens' },
    utilityTabs: { text: 'Text', draw: 'Draw', random: 'Random', names: 'Names', layers: 'Layers' },
    shell: {
      brand: { firstLine: 'TOKEN', secondLine: 'MAKER', accent: 'STUDIO' },
      informationNavigation: 'Coat maker information', helpCenter: 'Help Center', changelog: 'Changelog', shieldStyles: 'Shield styles',
      collapseToolPanel: 'Collapse tool panel', expandToolPanel: 'Expand tool panel', magnetSnapping: 'Magnet snapping', multiSelect: 'Multi-select',
      canvasZoom: 'Canvas zoom', canvasZoomPercentage: 'Canvas zoom percentage', selectedElementColours: 'Selected element colours', changeElementColour: (fromColor) => `Change element colour: ${fromColor}`, resetCanvasZoom: 'Reset canvas zoom', enterFullscreen: 'Enter fullscreen', exitFullscreen: 'Exit fullscreen',
      fullscreenRootMissing: 'Fullscreen is unavailable because the editor root is missing.', fullscreenExitUnavailable: 'Fullscreen exit is unavailable in this browser.', fullscreenUnavailable: 'Fullscreen is unavailable in this browser.', fullscreenOperationFailed: (message) => `Fullscreen operation failed: ${message}`,
      editorUtilities: 'Editor utilities', howToPanel: 'How-to', howToHeading: 'Build your coat of arms', howToDescription: 'Choose a shield on the left, add charges, then drag items on the artboard to arrange them.',
    },
    palettes: {
      referenceGallery: {
        library: { shield: 'Shield library', charge: 'Charge library', top: 'Top ornament library' },
        categoryFilter: { shield: 'Shield categories', charge: 'Charge categories', top: 'Top ornament categories' },
        search: { shield: 'Search shields', charge: 'Search charges', top: 'Search top ornaments' },
        noResults: { shield: 'No matching shields.', charge: 'No matching charges.', top: 'No matching top ornaments.' },
        loadMore: 'Load more',
        categories: {
          shield: { shield: 'Heraldic shields', heater: 'Heater shields', french: 'French shields', banner: 'Banner shields', round: 'Round shields', lozenge: 'Lozenge shields' },
          charge: { animal: 'Animals', object: 'Objects', plant: 'Plants', human: 'Humans', symbol: 'Symbols' },
          top: { crown: 'Crowns', mantle: 'Mantles', supporter: 'Supporters', other: 'Other' },
        },
        cardAction: (section, name) => {
          if (section === 'shield') return `Select shield: ${name}`;
          if (section === 'charge') return `Add charge: ${name}`;
          return `Add top ornament: ${name}`;
        },
      },
      shield: { library: 'Shield library', search: 'Search Shields', presets: 'Shield presets', presetName: (presetId) => getShieldPresetName(presetId, englishShieldPresetNames), usePreset: (presetName) => `Use ${presetName} shield preset`, showAdvanced: 'Custom shield settings', hideAdvanced: 'Hide advanced shield settings' },
      token: { library: 'Token library', heading: 'Tokens', description: 'Add an original local emblem to the canvas.', categoryFilter: 'Token categories', categories: { featured: 'Featured', animal: 'Animals', object: 'Objects', plant: 'Plants', human: 'Humans', symbol: 'Symbols' }, search: 'Search tokens', noResults: 'No matching tokens.', addAsset: (name) => `Add ${name} token` },
      flag: { library: 'Flag presets', heading: 'Flag presets', description: 'Apply a local flag preset to the current shield field.', categoryFilter: 'Flag categories', categories: { tricolour: 'Tricolours', cross: 'Cross flags', diagonal: 'Diagonal flags', band: 'Band flags' }, search: 'Search flags', noResults: 'No matching flags.', presetName: (presetId) => getFlagPresetName(presetId, englishFlagPresetNames), usePreset: (name) => `Use ${name} flag preset` },
    },
    canvas: {
      label: 'Coat of arms canvas',
      help: 'Select an unlocked layer, then drag it. Arrow keys move selected layers, and Shift plus an arrow uses a larger move. Alt plus an arrow selects another layer. [ and ] scale the selected layer; comma and period rotate it. Copy, paste, group, ungroup, undo, and redo use Command or Control shortcuts.',
      selectedLayerControls: 'Selected layer controls',
      selectedLayerToolbar: 'Selected element actions',
      resizeSelectedLayer: 'Resize selected layer',
      resizeSelectedLayerHandle: (handle) => `Resize selected layer ${handle}`,
      adjustCurvedTextHandle: 'Adjust curved text control point',
      adjustCurvedTextStartHandle: 'Adjust curved text start point',
      adjustCurvedTextEndHandle: 'Adjust curved text end point',
      adjustRingTextHandle: 'Adjust ring text radius and position',
      adjustStraightTextWidthHandle: (side) => `Adjust straight text width ${side}`,
      rotateSelectedLayer: 'Rotate selected layer',
      duplicateSelectedElement: 'Duplicate selected element',
      flipSelectedElementHorizontally: 'Flip selected element horizontally',
      selectedElementLayerOrder: 'Selected element layer order',
      deleteSelectedElement: 'Delete selected element',
      lockSelectedElement: 'Lock selected element',
      unlockSelectedElement: 'Unlock selected element',
      hideSelectedElement: 'Hide selected element',
      showSelectedElement: 'Show selected element',
    },
    panels: {
      ...customFieldPanelCopyByLocale.en,
      textFeature: textFeatureCopyByLocale.en,
      editorTools: 'Coat of arms editor tools',
      commandFailed: (message) => `Editor action failed: ${message}`,
      position: 'Position', arrange: 'Arrange', noPositionSelection: 'Select an element to see position options.', positionValues: 'Position values', positionX: 'Position X', positionY: 'Position Y', positionScale: 'Position scale', positionWidth: 'Width (%)', positionHeight: 'Height (%)', keepAspectRatio: 'Keep aspect ratio', positionRotation: 'Position rotation', positionOpacity: 'Position opacity', layerSize: 'Size', sizeWidth: 'Width', sizeHeight: 'Height', rotation: 'Rotation', opacity: 'Opacity', flipSelectedLayer: 'Flip selected layer', flipHorizontal: 'Flip horizontal', flipVertical: 'Flip vertical', fieldPlacement: 'Field placement', fieldPlacements: { overall: 'Overall', dexter: 'Dexter', sinister: 'Sinister', chief: 'Chief', base: 'Base', q1: 'Quarter 1', q2: 'Quarter 2', q3: 'Quarter 3', q4: 'Quarter 4' }, clipChargeToField: 'Clip charge to field', order: 'Order', forward: 'Forward', backward: 'Backward', toFront: 'To front', toBack: 'To back', align: 'Align', alignments: { left: 'Left', center: 'Center', right: 'Right', top: 'Top', middle: 'Middle', bottom: 'Bottom' },
      shieldAndField: 'Shield & field', noShieldLayer: 'No shield layer.', editingEscutcheon: (ordinal) => `Editing: Escutcheon ${ordinal}`, editingLabel: 'Editing:', editingEscutcheonName: (ordinal) => `Escutcheon ${ordinal}`, addNewEscutcheon: '+ Add New Escutcheon', escutcheonLibrary: 'Escutcheon', selectEscutcheonShape: (name) => `Select escutcheon: ${name}`, customShieldUploads: 'Custom Shield Uploads', customShieldUploadHint: 'Upload your own shield outline', shieldOutline: 'Shield outline', shieldOutlineSource: 'Outline source', shieldOutlineSources: { library: 'Library outline', 'custom-vector': 'Custom vector outline' }, customVectorShieldOutline: 'Custom vector outline', customVectorShieldPath: 'Custom vector shield path', applyCustomVectorShieldOutline: 'Apply custom vector outline', resetCustomVectorShieldOutline: 'Reset custom vector outline', customShieldMask: 'Custom shield mask', defaultShieldMask: 'Use library shield outline', uploadCustomShieldMask: 'Upload custom shield mask', customShieldMaskAdded: (filename) => `Custom shield mask selected: ${filename}`, fieldDivision: 'Field division', fieldVariation: 'Field variation', fieldPatternControl: (pattern, control) => `${pattern === 'stripes' ? 'Stripe' : pattern === 'checks' ? 'Chequy' : pattern === 'seme' ? 'Semé' : pattern[0]!.toUpperCase() + pattern.slice(1)} ${control === 'symbolSize' ? 'symbol size' : control}`, fieldRegionPatternControl: (name, pattern, control) => `${name} ${pattern === 'stripes' ? 'stripe' : pattern === 'checks' ? 'chequy' : pattern === 'seme' ? 'semé' : pattern} ${control === 'symbolSize' ? 'symbol size' : control}`, fieldStripeDirections: { bend: 'Bend', 'bend-sinister': 'Bend sinister', horizontal: 'Horizontal', vertical: 'Vertical' }, fieldRegions: 'Independent field regions', fieldRegionNames: { overall: 'Overall field', dexter: 'Dexter', sinister: 'Sinister', chief: 'Chief', base: 'Base', 'bend-upper': 'Above bend', 'bend-lower': 'Below bend', 'bend-sinister-upper': 'Above bend sinister', 'bend-sinister-lower': 'Below bend sinister', 'chevron-chief': 'Chevron chief', 'chevron-base': 'Chevron base', q1: 'Quarter 1', q2: 'Quarter 2', q3: 'Quarter 3', q4: 'Quarter 4', 'gyron-1': 'Gyron 1', 'gyron-2': 'Gyron 2', 'gyron-3': 'Gyron 3', 'gyron-4': 'Gyron 4', 'gyron-5': 'Gyron 5', 'gyron-6': 'Gyron 6', 'gyron-7': 'Gyron 7', 'gyron-8': 'Gyron 8', 'tierced-pale-1': 'Pale 1', 'tierced-pale-2': 'Pale 2', 'tierced-pale-3': 'Pale 3', 'tierced-fess-1': 'Fess 1', 'tierced-fess-2': 'Fess 2', 'tierced-fess-3': 'Fess 3', 'saltire-chief': 'Saltire chief', 'saltire-dexter': 'Saltire dexter', 'saltire-base': 'Saltire base', 'saltire-sinister': 'Saltire sinister', 'bar-1': 'Bar 1', 'bar-2': 'Bar 2', 'bar-3': 'Bar 3', 'bar-4': 'Bar 4', 'bar-5': 'Bar 5', 'paly-1': 'Pale 1', 'paly-2': 'Pale 2', 'paly-3': 'Pale 3', 'paly-4': 'Pale 4', 'paly-5': 'Pale 5', 'bend-1': 'Bend 1', 'bend-2': 'Bend 2', 'bend-3': 'Bend 3', 'bend-4': 'Bend 4', 'bend-5': 'Bend 5' }, fieldRegion: (name) => `Field: ${name}`, fieldRegionVariation: (name) => `${name} field variation`, fieldRegionPrimaryColour: (name) => `${name} primary colour`, fieldRegionAccentColour: (name) => `${name} accent colour`, fieldRegionPatternScale: (name) => `${name} pattern scale`, fieldDivisionLine: 'Field division line', fieldDivisionLineStyles: { straight: 'Straight', wavy: 'Wavy', indented: 'Indented', engrailed: 'Engrailed', invected: 'Invected', embattled: 'Embattled', dovetailed: 'Dovetailed', potenty: 'Potenty', 'embattled-grady': 'Embattled grady', urdy: 'Urdée', 'embattled-in-crosses': 'Embattled in crosses' }, divisionLineFrequency: 'Division line frequency', divisionLineAmplitude: 'Division line amplitude', fieldPrimaryColour: 'Field primary colour', fieldAccentColour: 'Field accent colour', shieldBorderColour: 'Shield border colour', shieldBorderWidth: 'Shield border width', showShieldBorder: 'Show shield border', fieldOrnaments: 'Field ornaments', fieldOrnament: 'Field ornament', fieldOrnamentKinds: { bar: 'Bar', base: 'Base', bendlet: 'Bendlet', chief: 'Chief', cross: 'Cross', fess: 'Fess', mountain: 'Mountain', pale: 'Pale', pile: 'Pile', escutcheon: 'Escutcheon', bordure: 'Bordure', canton: 'Canton', chevron: 'Chevron', pall: 'Pall', saltire: 'Saltire', fretty: 'Fretty' }, addFieldOrnament: 'Add field ornament', removeFieldOrnament: 'Remove ornament', moveFieldOrnamentBackward: (id) => `Move field ornament backward ${id}`, moveFieldOrnamentBackwardLabel: 'Move backward', moveFieldOrnamentForward: (id) => `Move field ornament forward ${id}`, moveFieldOrnamentForwardLabel: 'Move forward', fieldOrnamentItem: (kind) => `Field ornament: ${kind}`, fieldOrnamentColour: 'Ornament colour', fieldOrnamentPaletteColour: (index) => `Ornament colour ${index + 1}`, fieldOrnamentColourAmplitude: (index) => `Ornament colour ${index + 1} weight`, addFieldOrnamentColour: 'Add ornament colour', removeFieldOrnamentColour: (index) => `Remove ornament colour ${index + 1}`, fieldOrnamentX: 'Ornament X', fieldOrnamentY: 'Ornament Y', fieldOrnamentScale: 'Ornament scale', fieldOrnamentWidth: 'Ornament width', fieldOrnamentHeight: 'Ornament height', fieldOrnamentThickness: 'Ornament thickness', fieldOrnamentReversed: 'Reverse ornament', fieldOrnamentKeepAspectRatio: 'Keep canton ratio', fieldOrnamentOverlap: 'Mountain overlap', fieldOrnamentBendSinister: 'Bend sinister', fieldOrnamentEdge: 'Ornament edge',
      crossHorizontalThickness: 'Cross horizontal thickness', crossVerticalThickness: 'Cross vertical thickness', crossCentreX: 'Cross centre X', crossCentreY: 'Cross centre Y', saltireCentreX: 'Saltire centre X', saltireCentreY: 'Saltire centre Y', chevronPeakHeight: 'Chevron peak height', chevronVerticalPosition: 'Chevron vertical position', pallForkX: 'Pall fork X', pallForkY: 'Pall fork Y', mountainPeakCount: 'Mountain peak count', mountainSteepness: 'Mountain steepness',
      fieldDivisions: { solid: 'Solid', 'per-pale': 'Per pale', 'per-fess': 'Per fess', 'per-bend': 'Per bend', 'per-bend-sinister': 'Per bend sinister', 'per-chevron': 'Per chevron', quarterly: 'Quarterly', gyronny: 'Gyronny', 'tierced-per-pale': 'Tierced per pale', 'tierced-per-fess': 'Tierced per fess', 'per-saltire': 'Per saltire', barry: 'Barry', paly: 'Paly', bendy: 'Bendy' },
      fieldPatterns: { solid: 'Solid', barry: 'Barry', paly: 'Paly', bendy: 'Bendy', stripes: 'Stripes', dots: 'Dots', checks: 'Chequy', lozengy: 'Lozengy', crosses: 'Crosses', waves: 'Waves', masoned: 'Masoned', honeycomb: 'Honeycomb', fretty: 'Fretty', scales: 'Scales', chevronelly: 'Chevronelly', vair: 'Vair', 'vair-in-pointe': 'Vair in pointe', 'vair-in-pale': 'Vair in pale', 'paly-bendy': 'Paly bendy', 'barry-bendy': 'Barry bendy', gyronny: 'Gyronny', papelonny: 'Papelonny', seme: 'Semé' },
      ordinariesAndCharges: 'Ordinaries & charges', libraryCategory: 'Library category', charges: 'Charges', chargeCategory: 'Charge category', chargeCategories: { animal: 'Animals', object: 'Objects', plant: 'Plants', human: 'Humans', symbol: 'Symbols' }, chargesTreeUpload: 'Upload', shieldTreeLabels: { 'kite-shield': 'Shield', 'heater-shield': 'Heater', 'french-shield': 'French', 'banner-shield': 'Banner', 'round-shield': 'Round', 'lozenge-shield': 'Lozenge' }, ordinaries: 'Ordinaries', searchLibrary: 'Search library', addRandom: (kind) => `Add random ${kind}`, noLocalAssets: (kind) => `No local ${kind} assets are available`, assetLibrary: (kind) => `${kind} library`, addAsset: (name) => `Add ${name}`, previewAsset: (name) => `Preview ${name}`,
      top: 'Top ornaments', topCategory: 'Top category', topLibrary: 'Top ornament library', topCategories: { mantle: 'Mantles', crown: 'Crowns', supporter: 'Supporters', other: 'Other' },
      settings: 'Settings', appearance: 'Appearance', appearanceDark: 'Dark', colorPicker: 'Color picker', colorPickerSimple: 'Simple', colorPickerAdvanced: 'Advanced', colorPickerHelp: 'Simple shows a continuous swatch grid with an always-visible color picker. Advanced groups swatches by heraldic category.', heraldicSwatchGroups: { metals: 'Metals', colours: 'Colours', stains: 'Stains', other: 'Other' }, canvasSize: 'Canvas Size', canvasWidth: 'Width', canvasHeight: 'Height', applyCanvasSize: 'Apply', resetEditor: 'Reset editor', canvasPresets: 'Canvas presets', canvasPresetNames: { square: '1:1 (Switzerland, Vatican City)', '8-11': '8:11 (Israel)', '7-10': '7:10 (Brazil)', '2-3': '2:3 (Japan, France, Kenya)', '5-8': '5:8 (Poland, Sweden, Palau)', '3-5': '3:5 (Germany, Nicaragua, Lithuania)', '10-19': '10:19 (USA)', '1-2': '1:2 (UK, North Korea, USSR)' }, canvasPresetSize: (width, height) => `${width} x ${height}`,
      draw: 'Draw', drawingColour: 'Brush colour', drawingStrokeWidth: 'Brush size', drawOnCanvas: 'Draw on canvas', enableDrawingMode: 'Enable Drawing Mode', drawingOpacity: 'Opacity', previewStroke: 'Preview', drawHelp: 'Draw freehand on your canvas. Each stroke becomes an editable element.',
      names: 'Names', nameGeneratorType: 'Name type', nameGeneratorLanguage: 'Language', nameGeneratorLanguages: { en: 'English', de: 'German' }, nameGeneratorTypes: { city: 'City', cult: 'Cult', demon: 'Demon', dragon: 'Dragon', dwarf: 'Dwarf', elven: 'Elven', 'fantasy-kingdom': 'Fantasy Kingdom', gods: 'Gods', knight: 'Knight', orc: 'Orc', 'pirate-ship': 'Pirate Ship', realm: 'Realm', 'roman-province': 'Roman Province', tavern: 'Tavern' }, nameResults: 'Generated names', generateNames: (typeName) => `Generate ${typeName} Names`, copyGeneratedName: (name) => `Copy name ${name}`, savedNames: 'Saved Names', removeSavedName: (name) => `Remove saved name ${name}`, nameCopied: (name) => `Copied ${name}`,
      coloursAndBackground: 'Colours & background', usedColours: 'Used colours', colorTreeUsed: 'Used', colorPalettes: 'Palettes', colorCustom: 'Custom', usedColoursHint: 'Click any swatch to change every instance of that color on the canvas.', usedColourSwatch: (color) => `Used colour: ${color}`, setPaletteAsDefault: 'Set as default', addPalette: 'Add', defaultPaletteBadge: 'Default', paletteGroupHeadings: { metals: 'Metals', colors: 'Colors', 'other-colors': 'Other Colors', extra: 'Extra' }, paletteSwatch: (paletteName, swatchName, hex) => `${paletteName} ${swatchName} (${hex})`, customColorPalettes: 'Custom Color Palettes', customColorPalettesHelp: 'Create and save your own color palettes.', selectElementToApplyColour: 'Select an element to apply a colour.', background: 'Background', customPaletteColour: 'Custom palette colour', saveCustomColour: 'Save custom colour', replaceColourFrom: 'Replace colour from', replaceColourWith: 'Replace colour with', replaceAllColours: 'Replace all colours', backgroundColour: 'Background Color', customBackgroundColour: 'Custom background colour', backgroundGradient: 'Background gradient', backgroundGradientAngle: 'Background gradient angle', backgroundGradientStartColour: 'Background gradient start colour', backgroundGradientEndColour: 'Background gradient end colour', applyBackgroundGradient: 'Apply background gradient', backgroundMotif: 'Background motif', backgroundOpacity: 'Background opacity', transparentBackground: 'Transparent', transparentExportBackground: 'Transparent export background', backgroundVisible: 'Background visible', backgroundLayers: 'Background Layers', noBackgroundLayers: 'No background layers yet.', addBackgroundCharge: 'Add Charge', backgroundColourSwatch: (color) => `Background colour: ${color}`, perLayerColours: 'Per-layer colours', colourForLayer: (layerId) => `Colour for ${layerId}`, colourForAssetPart: (layerId, sourceColor) => `Colour for ${layerId} part ${sourceColor}`,
      textAndMotto: 'Text & motto', mottoText: 'Motto text', textColour: 'Text colour', typographySize: 'Typography size', fontFamily: 'Font family', textFonts: { serif: 'Serif', 'display-serif': 'Display serif', blackletter: 'Blackletter', 'sans-serif': 'Sans serif', monospace: 'Monospace', cursive: 'Cursive' }, fontStyle: 'Font style', fontWeight: 'Font weight', textFontStyles: { normal: 'Normal', italic: 'Italic' }, textFontWeights: { normal: 'Normal', bold: 'Bold' }, textAlignment: 'Text alignment', textPath: 'Text path', textTransform: 'Text transform', x: 'X', y: 'Y', scale: 'Scale', textAlignments: { left: 'Left', center: 'Center', right: 'Right' }, textPaths: { none: 'None', 'motto-upper': 'Motto upper', 'motto-lower': 'Motto lower', 'curve-upper': 'Curve upper', 'curve-lower': 'Curve lower', 'ring-clockwise': 'Ring clockwise', 'ring-counterclockwise': 'Ring counterclockwise' }, addMotto: 'Add motto', updateSelectedText: 'Update selected text',
      uploadImage: 'Upload image', uploadDescription: 'PNG, JPEG, WebP, or safe SVG; local files only, up to 8 files, maximum 8 MB each and 16 MB total.', uploadCrestImage: 'Upload crest image', localUploads: 'Local uploads', localUploadItem: (index, mimeType) => `Local upload ${index + 1} (${mimeType})`, addLocalImage: (index) => `Add local image ${index + 1}`, removeLocalUpload: (index) => `Remove local upload ${index + 1}`, localImageAdded: (fileName) => `Added local image: ${fileName}`, localImagesAdded: (count) => `Added ${count} local images.`, localUploadCompressed: (fileName, originalBytes, resultBytes) => `Compressed oversized upload ${fileName} from ${originalBytes} to ${resultBytes} bytes.`,
      layers: 'Layers', coatLayers: 'Coat layers', selectLayer: (layerId, name) => `Select layer ${layerId} (${name})`, select: 'Select', layerType: (type) => ({ background: 'background', shield: 'shield', ordinary: 'ordinary', charge: 'charge', top: 'top ornament', draw: 'drawing', text: 'text', image: 'image' })[type] ?? type, moveLayerUp: (name) => `Move ${name} up`, moveLayerDown: (name) => `Move ${name} down`, hideLayer: (name) => `Hide ${name}`, showLayer: (name) => `Show ${name}`, lockLayer: (name) => `Lock ${name}`, unlockLayer: (name) => `Unlock ${name}`, deleteLayer: (name) => `Delete ${name}`, renameLayer: (name) => `Rename ${name}`, reorderLayer: (name) => `Reorder ${name}`, searchLayers: 'Search layers...', noMatchingLayers: 'No matching layers.', moveUp: 'Move up', moveDown: 'Move down', hide: 'Hide', show: 'Show', lock: 'Lock', unlock: 'Unlock', delete: 'Delete', duplicateSelectedLayers: 'Duplicate selected layers', groupSelectedLayers: 'Group selected layers', ungroupSelectedLayers: 'Ungroup selected layers', groupOpacity: 'Group opacity', localImage: 'Local image', localDrawing: 'Drawing',
    },
  },
  zh: {
    workspace: '徽章制作工作台', desktopTools: '桌面徽章工具', toolCategories: '徽章工具类别', toolRailLabel: '徽章制作工具', layerDock: '项目与图层停靠区',
    localFirstMaker: '本地优先制作器', undo: '撤销', redo: '重做', export: '导出', scene: '徽章画布',
    projectAndLayers: '项目与图层', layerDockHint: '选择图层以整理、锁定或分组。', inspector: '属性', tools: '工具', closeTools: '关闭工具',
    defaultMotto: '勇气与荣耀', exportOptions: '本地导出选项',
    closeExportMenu: '关闭导出菜单', exportSize: '导出尺寸', exportPng: '导出 PNG', exportJpeg: '导出 JPG', copyImage: '复制图片', shareImage: '分享图片', jpegQuality: 'JPG 质量', jpegQualities: { low: '低', medium: '中', high: '高', ultra: '超高' },
    exportFileType: '文件类型', exportQuality: '质量', exportTransparentBackground: '透明背景',
    exportFileTypeNames: exportFileTypeNamesByLocale.zh, downloadExport: (fileType) => formatDownloadExportLabel(fileType, 'zh'),
    exportShare: '分享', exportPrint: '打印', exportPdf: '导出 PDF',
    print: '本地打印', exportBatch: '导出批量 ZIP', pngExported: 'PNG 已导出到本地。', jpegExported: 'JPG 已导出到本地。', imageCopied: '图片已复制到剪贴板。', imageShared: '已打开系统分享面板。', pdfExported: 'PDF 已导出到本地。',
    printOpened: '本地打印视图已打开。', batchExported: '批量 ZIP 已导出到本地。',
    exportOperationFailed: (message) => formatChineseFailure('导出失败', '请检查浏览器下载设置后重试', message),
    randomizeProject: '随机生成徽章', randomizeDescription: '点击按钮随机生成一枚徽章。生成后可以继续修改，直到符合你的需要。', randomizeUnavailable: '项目随机生成功能暂不可用。',
    draftAvailable: '发现草稿', draftRecoveryDescription: '发现本地草稿。恢复前不会更改当前项目。', invalidDraftRecoveryDescription: (message) => formatChineseFailure('本地草稿无法恢复', '草稿已保留，请确认后丢弃', message), restoreDraft: '恢复草稿', discardDraft: '丢弃草稿',
    toolTabs: { position: '定位', shields: '盾牌', custom: '自定义', charges: '图形', top: '顶部', colors: '颜色', tools: '工具', 'how-to': '使用说明', settings: '设置', flags: '旗帜' },
    navigationItems: { tokens: '符记' },
    utilityTabs: { text: '文字', draw: '绘制', random: '随机', names: '命名', layers: '图层' },
    shell: {
      brand: { firstLine: 'TOKEN', secondLine: 'MAKER', accent: 'STUDIO' },
      informationNavigation: '徽章制作器信息', helpCenter: '帮助中心', changelog: '更新日志', shieldStyles: '盾牌样式',
      collapseToolPanel: '收起工具面板', expandToolPanel: '展开工具面板', magnetSnapping: '磁吸对齐', multiSelect: '多选',
      canvasZoom: '画布缩放', canvasZoomPercentage: '画布缩放百分比', selectedElementColours: '选中元素颜色', changeElementColour: (fromColor) => `更改元素颜色：${fromColor}`, resetCanvasZoom: '重置画布缩放', enterFullscreen: '进入全屏', exitFullscreen: '退出全屏',
      fullscreenRootMissing: '编辑器根节点不可用，无法进入全屏。', fullscreenExitUnavailable: '当前浏览器不支持退出全屏。', fullscreenUnavailable: '当前浏览器不支持全屏。', fullscreenOperationFailed: () => '全屏操作失败。请重试。',
      editorUtilities: '编辑器工具', howToPanel: '使用说明', howToHeading: '开始制作徽章', howToDescription: '先从左侧选择盾形，再加入纹章。拖动画布中的素材即可调整位置。',
    },
    palettes: {
      referenceGallery: {
        library: { shield: '盾形素材库', charge: '徽记素材库', top: '顶部装饰素材库' },
        categoryFilter: { shield: '盾形类别', charge: '徽记类别', top: '顶部装饰类别' },
        search: { shield: '搜索盾形', charge: '搜索徽记', top: '搜索顶部装饰' },
        noResults: { shield: '没有匹配的盾形。', charge: '没有匹配的徽记。', top: '没有匹配的顶部装饰。' },
        loadMore: '加载更多',
        categories: {
          shield: { shield: '纹章盾', heater: '熨斗盾', french: '法式盾', banner: '旗帜盾', round: '圆盾', lozenge: '菱形盾' },
          charge: { animal: '动物', object: '物件', plant: '植物', human: '人物', symbol: '符号' },
          top: { crown: '冠冕', mantle: '斗篷', supporter: '护持者', other: '其他' },
        },
        cardAction: (section, name) => {
          if (section === 'shield') return `选择盾形：${name}`;
          if (section === 'charge') return `添加徽记：${name}`;
          return `添加顶部装饰：${name}`;
        },
      },
      shield: { library: '盾牌素材库', search: '搜索盾牌', presets: '盾牌预设', presetName: (presetId) => getShieldPresetName(presetId, chineseShieldPresetNames), usePreset: (presetName) => `使用${presetName}预设`, showAdvanced: '自定义盾牌设置', hideAdvanced: '隐藏高级盾牌设置' },
      token: { library: '纹章令牌素材库', heading: '纹章令牌', description: '将本地原创纹章令牌添加到画布。', categoryFilter: '符记分类', categories: { featured: '精选', animal: '动物', object: '物件', plant: '植物', human: '人物', symbol: '符号' }, search: '搜索符记', noResults: '没有匹配的符记。', addAsset: (name) => `添加纹章令牌：${name}` },
      flag: { library: '旗帜预设', heading: '旗帜预设', description: '选择一个本地旗帜预设，将其应用到当前盾形的底纹。', categoryFilter: '旗帜分类', categories: { tricolour: '三色旗', cross: '十字旗', diagonal: '斜向旗', band: '条纹旗' }, search: '搜索旗帜', noResults: '没有匹配的旗帜。', presetName: (presetId) => getFlagPresetName(presetId, chineseFlagPresetNames), usePreset: (name) => `使用${name}预设` },
    },
    canvas: {
      label: '徽章画布',
      help: '选择未锁定图层后可拖动。方向键移动选中图层；Shift 加方向键可进行更大步长移动。Alt 加方向键切换图层；[ 和 ] 缩放所选图层，逗号和句号旋转所选图层。复制、粘贴、成组、取消成组、撤销和重做使用 Command 或 Control 快捷键。',
      selectedLayerControls: '所选图层控件',
      selectedLayerToolbar: '选中元素操作',
      resizeSelectedLayer: '调整所选图层大小',
      resizeSelectedLayerHandle: (handle) => `调整所选图层大小（${chineseResizeHandleNames[handle]}）`,
      adjustCurvedTextHandle: '调整弧形文字控制点',
      adjustCurvedTextStartHandle: '调整弧形文字起点',
      adjustCurvedTextEndHandle: '调整弧形文字终点',
      adjustRingTextHandle: '调整环形文字半径和位置',
      adjustStraightTextWidthHandle: (side) => `调整普通文字宽度（${side === 'left' ? '左' : '右'}）`,
      rotateSelectedLayer: '旋转所选图层',
      duplicateSelectedElement: '复制选中元素',
      flipSelectedElementHorizontally: '水平翻转选中元素',
      selectedElementLayerOrder: '选中元素图层顺序',
      deleteSelectedElement: '删除选中元素',
      lockSelectedElement: '锁定选中元素',
      unlockSelectedElement: '解锁选中元素',
      hideSelectedElement: '隐藏选中元素',
      showSelectedElement: '显示选中元素',
    },
    panels: {
      ...customFieldPanelCopyByLocale.zh,
      textFeature: textFeatureCopyByLocale.zh,
      editorTools: '徽章编辑工具',
      commandFailed: (message) => formatChineseFailure('编辑操作失败', '请检查输入内容后重试', message),
      position: '定位', arrange: '排列', noPositionSelection: '请选择一个元素以查看定位选项。', positionValues: '定位数值', positionX: '横向位置', positionY: '纵向位置', positionScale: '缩放', positionWidth: '宽度 (%)', positionHeight: '高度 (%)', keepAspectRatio: '保持宽高比例', positionRotation: '旋转', positionOpacity: '不透明度', layerSize: '尺寸', sizeWidth: '宽度', sizeHeight: '高度', rotation: '旋转', opacity: '不透明度', flipSelectedLayer: '翻转所选图层', flipHorizontal: '水平翻转', flipVertical: '垂直翻转', fieldPlacement: '盾面区域', fieldPlacements: { overall: '整个盾面', dexter: '左侧', sinister: '右侧', chief: '顶部', base: '底部', q1: '第一象限', q2: '第二象限', q3: '第三象限', q4: '第四象限' }, clipChargeToField: '将徽记裁切到盾面区域', order: '层级顺序', forward: '前移', backward: '后移', toFront: '置于顶层', toBack: '置于底层', align: '对齐', alignments: { left: '左对齐', center: '水平居中', right: '右对齐', top: '顶部对齐', middle: '垂直居中', bottom: '底部对齐' },
      shieldAndField: '盾牌与底纹', noShieldLayer: '没有盾牌图层。', editingEscutcheon: (ordinal) => `正在编辑：盾形 ${ordinal}`, editingLabel: '正在编辑：', editingEscutcheonName: (ordinal) => `盾形 ${ordinal}`, addNewEscutcheon: '+ 添加新盾形', escutcheonLibrary: '盾形', selectEscutcheonShape: (name) => `选择盾形：${name}`, customShieldUploads: '自定义盾形上传', customShieldUploadHint: '上传你自己的盾形轮廓', shieldOutline: '盾形', shieldOutlineSource: '盾形来源', shieldOutlineSources: { library: '素材库盾形', 'custom-vector': '自定义矢量盾形' }, customVectorShieldOutline: '自定义矢量盾形', customVectorShieldPath: '自定义矢量盾形路径', applyCustomVectorShieldOutline: '应用自定义矢量盾形', resetCustomVectorShieldOutline: '重置自定义矢量盾形', customShieldMask: '自定义盾形遮罩', defaultShieldMask: '使用素材库盾形', uploadCustomShieldMask: '上传自定义盾形遮罩', customShieldMaskAdded: (filename) => `已选择自定义盾形遮罩：${filename}`, fieldDivision: '底纹分割', fieldVariation: '底纹样式', fieldPatternControl: (pattern, control) => `${pattern === 'stripes' ? '条纹' : pattern === 'checks' ? '棋盘格' : pattern === 'seme' ? '散点' : pattern} ${control === 'symbolSize' ? '图案大小' : control === 'direction' ? '方向' : control === 'count' ? '数量' : control === 'rows' ? '行数' : control === 'bricks' ? '砖块数' : '列数'}`, fieldRegionPatternControl: (name, pattern, control) => `${name} ${pattern === 'stripes' ? '条纹' : pattern === 'checks' ? '棋盘格' : pattern === 'seme' ? '散点' : pattern} ${control === 'symbolSize' ? '图案大小' : control === 'direction' ? '方向' : control === 'count' ? '数量' : control === 'rows' ? '行数' : control === 'bricks' ? '砖块数' : '列数'}`, fieldStripeDirections: { bend: '斜纹', 'bend-sinister': '反斜纹', horizontal: '横向', vertical: '纵向' }, fieldRegions: '独立底纹分区', fieldRegionNames: { overall: '整体盾面', dexter: '右侧', sinister: '左侧', chief: '上半区', base: '下半区', 'bend-upper': '斜线上方', 'bend-lower': '斜线下方', 'bend-sinister-upper': '反斜线上方', 'bend-sinister-lower': '反斜线下方', 'chevron-chief': '人字上方', 'chevron-base': '人字下方', q1: '第一象限', q2: '第二象限', q3: '第三象限', q4: '第四象限', 'gyron-1': '回旋区 1', 'gyron-2': '回旋区 2', 'gyron-3': '回旋区 3', 'gyron-4': '回旋区 4', 'gyron-5': '回旋区 5', 'gyron-6': '回旋区 6', 'gyron-7': '回旋区 7', 'gyron-8': '回旋区 8', 'tierced-pale-1': '纵分区 1', 'tierced-pale-2': '纵分区 2', 'tierced-pale-3': '纵分区 3', 'tierced-fess-1': '横分区 1', 'tierced-fess-2': '横分区 2', 'tierced-fess-3': '横分区 3', 'saltire-chief': '斜十字上方', 'saltire-dexter': '斜十字右侧', 'saltire-base': '斜十字下方', 'saltire-sinister': '斜十字左侧', 'bar-1': '横条 1', 'bar-2': '横条 2', 'bar-3': '横条 3', 'bar-4': '横条 4', 'bar-5': '横条 5', 'paly-1': '竖条 1', 'paly-2': '竖条 2', 'paly-3': '竖条 3', 'paly-4': '竖条 4', 'paly-5': '竖条 5', 'bend-1': '斜条 1', 'bend-2': '斜条 2', 'bend-3': '斜条 3', 'bend-4': '斜条 4', 'bend-5': '斜条 5' }, fieldRegion: (name) => `分区：${name}`, fieldRegionVariation: (name) => `${name} 纹样`, fieldRegionPrimaryColour: (name) => `${name} 主色`, fieldRegionAccentColour: (name) => `${name} 辅助色`, fieldRegionPatternScale: (name) => `${name} 纹样缩放`, fieldDivisionLine: '底纹分割线', fieldDivisionLineStyles: { straight: '直线', wavy: '波浪线', indented: '锯齿线', engrailed: '内凹圆弧线', invected: '外凸圆弧线', embattled: '城垛线', dovetailed: '燕尾线', potenty: 'T 形折线', 'embattled-grady': '阶梯城垛线', urdy: '反锯齿线', 'embattled-in-crosses': '十字城垛线' }, divisionLineFrequency: '分割线频率', divisionLineAmplitude: '分割线振幅', fieldPrimaryColour: '底纹主色', fieldAccentColour: '底纹辅色', shieldBorderColour: '盾牌边框颜色', shieldBorderWidth: '盾牌边框宽度', showShieldBorder: '显示盾牌边框', fieldOrnaments: '盾面构件', fieldOrnament: '盾面构件', fieldOrnamentKinds: { bar: '横条', base: '底座', bendlet: '斜条', chief: '顶端横带', cross: '十字', fess: '横带', mountain: '山峰', pale: '竖带', pile: '三角楔', escutcheon: '内盾', bordure: '边框', canton: '角隅', chevron: '人字带', pall: 'Y 形饰带', saltire: '斜十字带', fretty: '交织带' }, addFieldOrnament: '添加盾面构件', removeFieldOrnament: '移除构件', moveFieldOrnamentBackward: (id) => `后移盾面构件 ${id}`, moveFieldOrnamentBackwardLabel: '后移', moveFieldOrnamentForward: (id) => `前移盾面构件 ${id}`, moveFieldOrnamentForwardLabel: '前移', fieldOrnamentItem: (kind) => `盾面构件：${kind}`, fieldOrnamentColour: '构件颜色', fieldOrnamentPaletteColour: (index) => `构件颜色 ${index + 1}`, fieldOrnamentColourAmplitude: (index) => `构件颜色 ${index + 1} 权重`, addFieldOrnamentColour: '添加构件颜色', removeFieldOrnamentColour: (index) => `移除构件颜色 ${index + 1}`, fieldOrnamentX: '构件横向位置', fieldOrnamentY: '构件纵向位置', fieldOrnamentScale: '构件缩放', fieldOrnamentWidth: '构件宽度', fieldOrnamentHeight: '构件高度', fieldOrnamentThickness: '构件厚度', fieldOrnamentReversed: '反转构件', fieldOrnamentKeepAspectRatio: '保持角隅比例', fieldOrnamentOverlap: '山峰重叠度', fieldOrnamentBendSinister: '反向斜条', fieldOrnamentEdge: '构件边线',
      crossHorizontalThickness: '十字横带厚度', crossVerticalThickness: '十字竖带厚度', crossCentreX: '十字中心 X', crossCentreY: '十字中心 Y', saltireCentreX: '斜十字中心 X', saltireCentreY: '斜十字中心 Y', chevronPeakHeight: '人字带尖峰高度', chevronVerticalPosition: '人字带垂直位置', pallForkX: 'Y 形饰带分叉 X', pallForkY: 'Y 形饰带分叉 Y', mountainPeakCount: '山峰数量', mountainSteepness: '山峰陡峭度',
      fieldDivisions: { solid: '纯色', 'per-pale': '纵向二分', 'per-fess': '横向二分', 'per-bend': '斜向二分', 'per-bend-sinister': '反斜向二分', 'per-chevron': '人字分割', quarterly: '四等分', gyronny: '放射分割', 'tierced-per-pale': '纵向三分', 'tierced-per-fess': '横向三分', 'per-saltire': '十字斜分', barry: '横条分割', paly: '竖条分割', bendy: '斜条分割' },
      fieldPatterns: { solid: '纯色', barry: '横条', paly: '竖条', bendy: '斜条', stripes: '条纹', dots: '圆点', checks: '棋盘格', lozengy: '菱格', crosses: '十字', waves: '波浪', masoned: '砌石纹', honeycomb: '蜂巢纹', fretty: '交织纹', scales: '鳞片纹', chevronelly: '连续人字纹', vair: '松鼠皮纹', 'vair-in-pointe': '尖角松鼠皮纹', 'vair-in-pale': '纵向松鼠皮纹', 'paly-bendy': '竖斜复合条纹', 'barry-bendy': '横斜复合条纹', gyronny: '放射纹', papelonny: '扇贝纹', seme: '散点纹' },
      ordinariesAndCharges: '饰带与徽记', libraryCategory: '素材类别', charges: '徽记', chargeCategory: '徽记类别', chargeCategories: { animal: '动物', object: '物件', plant: '植物', human: '人物', symbol: '符号' }, chargesTreeUpload: '上传', shieldTreeLabels: { 'kite-shield': '盾', 'heater-shield': '熨斗', 'french-shield': '法式', 'banner-shield': '旗帜', 'round-shield': '圆', 'lozenge-shield': '菱形' }, ordinaries: '饰带', searchLibrary: '搜索素材', addRandom: (kind) => `随机添加${kind}`, noLocalAssets: (kind) => `没有可用的本地${kind}素材`, assetLibrary: (kind) => `${kind}素材库`, addAsset: (name) => `添加${name}`, previewAsset: (name) => `预览素材：${name}`,
      top: '顶部装饰', topCategory: '顶部类别', topLibrary: '顶部装饰素材库', topCategories: { mantle: '斗篷', crown: '冠冕', supporter: '护持者', other: '其他' },
      settings: '设置', appearance: '外观', appearanceDark: '深色', colorPicker: '取色器', colorPickerSimple: '简单', colorPickerAdvanced: '高级', colorPickerHelp: '简单模式用连续色板，并始终显示取色器。高级模式按纹章类别分组色板。', heraldicSwatchGroups: { metals: '金属色', colours: '正色', stains: '染色', other: '其他' }, canvasSize: '画布尺寸', canvasWidth: '宽度', canvasHeight: '高度', applyCanvasSize: '应用', resetEditor: '重置编辑器', canvasPresets: '画布预设', canvasPresetNames: { square: '1:1（瑞士、梵蒂冈）', '8-11': '8:11（以色列）', '7-10': '7:10（巴西）', '2-3': '2:3（日本、法国、肯尼亚）', '5-8': '5:8（波兰、瑞典、帕劳）', '3-5': '3:5（德国、尼加拉瓜、立陶宛）', '10-19': '10:19（美国）', '1-2': '1:2（英国、朝鲜、苏联）' }, canvasPresetSize: (width, height) => `${width} x ${height}`,
      draw: '绘制', drawingColour: '画笔颜色', drawingStrokeWidth: '画笔大小', drawOnCanvas: '在画布上绘制', enableDrawingMode: '启用绘制模式', drawingOpacity: '不透明度', previewStroke: '预览', drawHelp: '在画布上自由绘制。每条笔迹都会成为可编辑元素。',
      names: '命名', nameGeneratorType: '名称类型', nameGeneratorLanguage: '语言', nameGeneratorLanguages: { en: '英语', de: '德语' }, nameGeneratorTypes: { city: '城市', cult: '教派', demon: '恶魔', dragon: '巨龙', dwarf: '矮人', elven: '精灵', 'fantasy-kingdom': '幻想王国', gods: '诸神', knight: '骑士', orc: '兽人', 'pirate-ship': '海盗船', realm: '领域', 'roman-province': '罗马行省', tavern: '酒馆' }, nameResults: '生成的名称', generateNames: (typeName) => `生成${typeName}名称`, copyGeneratedName: (name) => `复制名称 ${name}`, savedNames: '已保存的名称', removeSavedName: (name) => `移除已保存的名称 ${name}`, nameCopied: (name) => `已复制 ${name}`,
      coloursAndBackground: '颜色与背景', usedColours: '已用颜色', colorTreeUsed: '已用', colorPalettes: '调色板', colorCustom: '自定义', usedColoursHint: '点击色块，即可替换画布上所有相同颜色。', usedColourSwatch: (color) => `已用颜色：${color}`, setPaletteAsDefault: '设为默认', addPalette: '添加', defaultPaletteBadge: '默认', paletteGroupHeadings: { metals: '金属色', colors: '颜色', 'other-colors': '其他颜色', extra: '额外' }, paletteSwatch: (paletteName, swatchName, hex) => `${paletteName} ${swatchName}（${hex}）`, customColorPalettes: '自定义调色板', customColorPalettesHelp: '创建并保存你自己的调色板。', selectElementToApplyColour: '请先选中一个元素，再应用颜色。', background: '背景', customPaletteColour: '自定义调色板颜色', saveCustomColour: '保存自定义颜色', replaceColourFrom: '替换来源颜色', replaceColourWith: '替换为颜色', replaceAllColours: '替换全部颜色', backgroundColour: '背景颜色', customBackgroundColour: '自定义背景颜色', backgroundGradient: '背景渐变', backgroundGradientAngle: '背景渐变角度', backgroundGradientStartColour: '背景渐变起始颜色', backgroundGradientEndColour: '背景渐变结束颜色', applyBackgroundGradient: '应用背景渐变', backgroundMotif: '背景纹样', backgroundOpacity: '背景不透明度', transparentBackground: '透明', transparentExportBackground: '透明导出背景', backgroundVisible: '显示背景', backgroundLayers: '背景图层', noBackgroundLayers: '还没有背景图层。', addBackgroundCharge: '添加徽记', backgroundColourSwatch: (color) => `背景颜色：${color}`, perLayerColours: '各图层颜色', colourForLayer: (layerId) => `图层 ${layerId} 的颜色`, colourForAssetPart: (layerId, sourceColor) => `图层 ${layerId} 色块 ${sourceColor}`,
      textAndMotto: '文字与格言', mottoText: '格言文字', textColour: '文字颜色', typographySize: '字号', fontFamily: '字体', textFonts: { serif: '衬线体', 'display-serif': '展示衬线体', blackletter: '哥特黑体', 'sans-serif': '无衬线体', monospace: '等宽体', cursive: '手写体' }, fontStyle: '字体样式', fontWeight: '字体字重', textFontStyles: { normal: '常规', italic: '斜体' }, textFontWeights: { normal: '常规', bold: '粗体' }, textAlignment: '文字对齐', textPath: '文字路径', textTransform: '文字变换', x: '横向位置', y: '纵向位置', scale: '缩放', textAlignments: { left: '左对齐', center: '居中', right: '右对齐' }, textPaths: { none: '无', 'motto-upper': '格言上弧', 'motto-lower': '格言下弧', 'curve-upper': '上弧', 'curve-lower': '下弧', 'ring-clockwise': '顺时针环绕', 'ring-counterclockwise': '逆时针环绕' }, addMotto: '添加格言', updateSelectedText: '更新选中文字',
      uploadImage: '上传图片', uploadDescription: '支持 PNG、JPEG、WebP 或安全 SVG；仅使用本地文件，最多 8 个文件，单个最大 8 MB，总计最大 16 MB。', uploadCrestImage: '上传徽章图片', localUploads: '本地上传素材', localUploadItem: (index, mimeType) => `本地上传素材 ${index + 1}（${mimeType}）`, addLocalImage: (index) => `添加本地图片 ${index + 1}`, removeLocalUpload: (index) => `移除本地上传素材 ${index + 1}`, localImageAdded: (fileName) => `已添加本地图片：${fileName}`, localImagesAdded: (count) => `已添加 ${count} 个本地图片。`, localUploadCompressed: (fileName, originalBytes, resultBytes) => `已将过大的上传 ${fileName} 从 ${originalBytes} 字节压缩到 ${resultBytes} 字节。`,
      layers: '图层', coatLayers: '徽章图层', selectLayer: (layerId, name) => `选择图层 ${layerId}（${name}）`, select: '选择', layerType: (type) => ({ background: '背景', shield: '盾牌', ordinary: '饰带', charge: '徽记', top: '顶部装饰', draw: '绘制笔迹', text: '文字', image: '图片' })[type] ?? type, moveLayerUp: (name) => `将 ${name} 上移`, moveLayerDown: (name) => `将 ${name} 下移`, hideLayer: (name) => `隐藏 ${name}`, showLayer: (name) => `显示 ${name}`, lockLayer: (name) => `锁定 ${name}`, unlockLayer: (name) => `解锁 ${name}`, deleteLayer: (name) => `删除 ${name}`, renameLayer: (name) => `重命名 ${name}`, reorderLayer: (name) => `调整 ${name} 顺序`, searchLayers: '搜索图层...', noMatchingLayers: '没有匹配的图层。', moveUp: '上移', moveDown: '下移', hide: '隐藏', show: '显示', lock: '锁定', unlock: '解锁', delete: '删除', duplicateSelectedLayers: '复制选中图层', groupSelectedLayers: '将选中图层成组', ungroupSelectedLayers: '取消选中图层成组', groupOpacity: '组不透明度', localImage: '本地图片', localDrawing: '绘制笔迹',
    },
  },
};

export function getCoatWorkbenchCopy(locale: CoatLocale): CoatWorkbenchCopy {
  return workbenchCopyByLocale[locale];
}
