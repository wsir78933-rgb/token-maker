'use client';

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  Check,
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  FlipHorizontal2,
  ImagePlus,
  LoaderCircle,
  RotateCw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import NextImage from 'next/image';
import {
  getCoatAsset,
  listAssetsByKind,
  shieldSilhouetteAssetIds,
} from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { getCoatExportDimensions } from '@/lib/coat-of-arms/export';
import { createLocalCoatId } from '@/lib/coat-of-arms/id';
import type { CoatAsset, CoatLayer, CoatLocale, CanvasTransform } from '@/lib/coat-of-arms/types';
import {
  EMBLEM_LAYER_SLOTS,
  assertEmblemCreatorDocument,
  createBlankEmblemDocument,
  orderEmblemProjectLayers,
  parseEmblemCreatorDocument,
  renderEmblemCreatorSvg,
  type EmblemCreatorDocument,
  type EmblemImageLayer,
  type EmblemImageMimeType,
  type EmblemLayerSlot,
} from '@/lib/emblem-creator/model';
import styles from './EmblemCreator.module.css';

type AssetTabId = 'body' | 'details' | 'crests';
type AssetFilterId = 'all' | 'shapes' | 'materials' | 'structures' | 'objects' | 'plants' | 'symbols' | 'animals' | 'people' | 'crowns' | 'mantles' | 'supporters' | 'other';
type DragMode = 'move' | 'resize';

interface DragState {
  layerId: string;
  mode: DragMode;
  startX: number;
  startY: number;
  initialTransform: CanvasTransform;
  canvasWidth: number;
  canvasHeight: number;
  frameWidth: number;
  frameHeight: number;
}

interface SelectionFrame {
  left: number;
  top: number;
  width: number;
  height: number;
}

const allShieldAssets = listAssetsByKind('shield');
const allOrdinaryAssets = listAssetsByKind('ordinary');
const allChargeAssets = listAssetsByKind('charge');
const allTopAssets = listAssetsByKind('top');
const silhouetteAssetIds = new Set<string>(shieldSilhouetteAssetIds);

const copyByLocale = {
  en: {
    title: 'Emblem Creator',
    subtitle: 'Build a crest from a visual library',
    clear: 'Clear canvas',
    save: 'Save project',
    load: 'Load project',
    export: 'Export PNG',
    materials: 'Asset library',
    assetCount: 'assets',
    body: 'Main bodies',
    details: 'Details',
    crests: 'Crests',
    all: 'All',
    shapes: 'Shapes',
    bodyMaterials: 'Materials',
    structures: 'Structures',
    objects: 'Objects',
    plants: 'Plants',
    symbols: 'Symbols',
    animals: 'Animals',
    people: 'People',
    crowns: 'Crowns',
    mantles: 'Mantles',
    supporters: 'Supporters',
    other: 'Other',
    searchPlaceholder: 'Search the library',
    imageUrlPlaceholder: 'Paste an image URL',
    addImage: 'Add image',
    uploadImage: 'Upload image',
    urlHelp: 'PNG, JPG, WebP or GIF · URL access depends on the image host',
    canvas: 'Canvas',
    dropHint: 'Choose a material or drag it here',
    dropSubhint: 'Start with a body, then add details and a crest',
    layerStack: 'Layer stack',
    crestSlot: 'Crests',
    detailSlot: 'Details',
    bodySlot: (index: number) => `Main body ${index}`,
    emptySlot: 'Empty',
    selectedObject: 'Selected object',
    noSelection: 'Select an object on the canvas',
    keepRatio: 'Keep proportions',
    horizontalScale: 'Width',
    verticalScale: 'Height',
    rotate: 'Rotate 15°',
    mirror: 'Mirror',
    border: 'Toggle outline',
    delete: 'Delete selected object',
    toggleVisibility: (name: string) => `Toggle ${name} visibility`,
    selectAsset: (name: string) => `Add ${name} to canvas`,
    selectLayer: (name: string) => `Select ${name}`,
    chooseImage: 'Choose an image',
    imageTypeError: 'Choose a PNG, JPG, WebP or GIF image.',
    corsError: 'This image host blocked the import. Try uploading the image file instead.',
    imageLimitError: 'The image exceeds the 8 MB per-file limit.',
    totalImageLimitError: 'Images in this project exceed the 16 MB total limit.',
    imageCountError: 'This project already has the maximum of 8 imported images.',
    bodyLimitError: 'All four main body slots are in use. Remove one before adding another.',
    loadError: 'Could not load this project file.',
    saveDone: 'Project file downloaded.',
    loadDone: 'Project loaded.',
    exportDone: 'PNG downloaded.',
    emptyResults: 'No assets match this search.',
    errorTitle: 'Action failed',
  },
  zh: {
    title: '徽章编辑器',
    subtitle: '从素材库组合你的徽章',
    clear: '清空画布',
    save: '保存项目',
    load: '载入项目',
    export: '导出 PNG',
    materials: '素材库',
    assetCount: '个素材',
    body: '盾体',
    details: '细节',
    crests: '徽饰',
    all: '全部',
    shapes: '盾形',
    bodyMaterials: '纹理素材',
    structures: '结构装饰',
    objects: '器物',
    plants: '植物',
    symbols: '符号',
    animals: '动物',
    people: '人物',
    crowns: '冠饰',
    mantles: '披风',
    supporters: '扶盾兽',
    other: '其他',
    searchPlaceholder: '搜索素材',
    imageUrlPlaceholder: '粘贴图片网址',
    addImage: '添加图片',
    uploadImage: '上传图片',
    urlHelp: '支持 PNG、JPG、WebP、GIF · 图片网址需允许跨域访问',
    canvas: '画布',
    dropHint: '选择素材，或拖到这里',
    dropSubhint: '先放入盾体，再添加细节和徽饰',
    layerStack: '图层',
    crestSlot: '徽饰',
    detailSlot: '细节',
    bodySlot: (index: number) => `盾体 ${index}`,
    emptySlot: '空',
    selectedObject: '选中对象',
    noSelection: '在画布上选择一个对象',
    keepRatio: '等比缩放',
    horizontalScale: '宽度',
    verticalScale: '高度',
    rotate: '旋转 15°',
    mirror: '镜像',
    border: '切换描边',
    delete: '删除选中对象',
    toggleVisibility: (name: string) => `切换${name}可见性`,
    selectAsset: (name: string) => `添加${name}`,
    selectLayer: (name: string) => `选中${name}`,
    chooseImage: '选择图片',
    imageTypeError: '请选择 PNG、JPG、WebP 或 GIF 图片。',
    corsError: '图片来源网站阻止了导入。请下载图片后再上传。',
    imageLimitError: '单张图片不能超过 8 MB。',
    totalImageLimitError: '项目图片总大小不能超过 16 MB。',
    imageCountError: '项目最多添加 8 张外部图片。',
    bodyLimitError: '4 个盾体图层已用完，请先删除一个再添加。',
    loadError: '无法载入这个项目文件。',
    saveDone: '项目文件已下载。',
    loadDone: '项目已载入。',
    exportDone: 'PNG 已下载。',
    emptyResults: '没有找到匹配的素材。',
    errorTitle: '操作失败',
  },
} as const;

const slotOrder: readonly EmblemLayerSlot[] = EMBLEM_LAYER_SLOTS;

export function EmblemCreator({ locale }: { locale: CoatLocale }) {
  const copy = copyByLocale[locale];
  const [document, setDocument] = useState(() => createBlankEmblemDocument(locale));
  const [activeTab, setActiveTab] = useState<AssetTabId>('body');
  const [activeFilter, setActiveFilter] = useState<AssetFilterId>('all');
  const [search, setSearch] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [openSlots, setOpenSlots] = useState<EmblemLayerSlot[]>(['body-1', 'details', 'crest']);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [busyAction, setBusyAction] = useState<'url' | 'file' | 'load' | 'export' | null>(null);
  const [notice, setNotice] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const [selectionFrame, setSelectionFrame] = useState<SelectionFrame | null>(null);
  const canvasInteractionRef = useRef<HTMLDivElement>(null);
  const canvasSvgRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectInputRef = useRef<HTMLInputElement>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const copyOfDocument = useMemo(
    () => renderEmblemCreatorSvg(document, { width: document.project.canvas.width, height: document.project.canvas.height, selectedLayerId: selectedLayerId ?? undefined }),
    [document, selectedLayerId],
  );
  const assetFilters = useMemo(() => getAssetFilters(activeTab, locale), [activeTab, locale]);
  const visibleAssets = useMemo(
    () => getFilteredAssets(activeTab, activeFilter, search, locale),
    [activeTab, activeFilter, search, locale],
  );

  const selectedVectorLayer = selectedLayerId
    ? document.project.layers.find((layer): layer is EmblemAssetProjectLayer => layer.id === selectedLayerId && isEmblemAssetLayer(layer))
    : undefined;
  const selectedImageLayer = selectedLayerId
    ? document.images.find((layer) => layer.id === selectedLayerId)
    : undefined;
  const selectedTransform = selectedVectorLayer && 'transform' in selectedVectorLayer
    ? selectedVectorLayer.transform
    : selectedImageLayer?.transform;
  const selectedLayerName = selectedVectorLayer
    ? getCoatAsset(selectedVectorLayer.assetId).name[locale]
    : selectedImageLayer?.name;
  const selectedIsLocked = selectedVectorLayer?.locked ?? false;
  const currentHorizontalScale = selectedTransform?.scaleX ?? selectedTransform?.scale ?? 0.6;
  const currentVerticalScale = selectedTransform?.scaleY ?? selectedTransform?.scale ?? 0.6;

  useLayoutEffect(() => {
    const container = canvasSvgRef.current;
    if (!container || !selectedLayerId) {
      setSelectionFrame(null);
      return;
    }
    const updateFrame = () => {
      const svg = container.querySelector('svg');
      const layerNode = Array.from(container.querySelectorAll<SVGGElement>('[data-layer-id]'))
        .find((candidate) => candidate.getAttribute('data-layer-id') === selectedLayerId);
      if (!svg || !layerNode) {
        setSelectionFrame(null);
        return;
      }
      const bounds = layerNode.getBoundingClientRect();
      const canvasBounds = svg.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0 || canvasBounds.width === 0 || canvasBounds.height === 0) {
        setSelectionFrame(null);
        return;
      }
      setSelectionFrame({
        left: ((bounds.left - canvasBounds.left) / canvasBounds.width) * 100,
        top: ((bounds.top - canvasBounds.top) / canvasBounds.height) * 100,
        width: (bounds.width / canvasBounds.width) * 100,
        height: (bounds.height / canvasBounds.height) * 100,
      });
    };
    updateFrame();
    const observer = new ResizeObserver(updateFrame);
    observer.observe(container);
    return () => observer.disconnect();
  }, [copyOfDocument, selectedLayerId]);

  useEffect(() => {
    if (selectedLayerId && !hasEmblemLayer(document, selectedLayerId)) setSelectedLayerId(null);
  }, [document, selectedLayerId]);

  function fail(error: unknown) {
    setNotice({
      kind: 'error',
      text: error instanceof Error && error.message ? error.message : copy.errorTitle,
    });
  }

  function getSlotForAsset(asset: CoatAsset): EmblemLayerSlot {
    if (asset.kind === 'shield') {
      const usedBodies = new Set(Object.values(document.slotByLayerId).filter(isBodySlot));
      const freeBody = (['body-1', 'body-2', 'body-3', 'body-4'] as const).find((slot) => !usedBodies.has(slot));
      if (!freeBody) throw new Error(copy.bodyLimitError);
      return freeBody;
    }
    if (asset.kind === 'top' || (asset.kind === 'charge' && (asset.category === 'animal' || asset.category === 'human'))) {
      return 'crest';
    }
    return 'details';
  }

  function addAsset(assetId: string) {
    try {
      const asset = getCoatAsset(assetId);
      const slot = getSlotForAsset(asset);
      const originalIds = new Set(document.project.layers.map((layer) => layer.id));
      const nextProject = applyProjectCommand(document.project, { type: 'add-layer', assetId });
      const addedLayer = nextProject.layers.find((layer) => !originalIds.has(layer.id));
      if (!addedLayer || addedLayer.type === 'background') {
        throw new Error(`Could not create a layer for asset ${assetId}.`);
      }
      const slotByLayerId = { ...document.slotByLayerId, [addedLayer.id]: slot };
      const project = orderEmblemProjectLayers(nextProject, slotByLayerId);
      setDocument({ ...document, project, slotByLayerId });
      setSelectedLayerId(addedLayer.id);
      setOpenSlots((current) => current.includes(slot) ? current : [...current, slot]);
      setNotice(null);
    } catch (error) {
      fail(error);
    }
  }

  function selectLayer(layerId: string) {
    setSelectedLayerId(layerId);
    setNotice(null);
  }

  function updateLayerTransform(layerId: string, transform: CanvasTransform) {
    try {
      const imageLayer = document.images.find((layer) => layer.id === layerId);
      if (imageLayer) {
        setDocument({
          ...document,
          images: document.images.map((layer) => layer.id === layerId ? { ...layer, transform } : layer),
        });
        return;
      }
      const project = applyProjectCommand(document.project, {
        type: 'update-layer',
        layerId,
        patch: { transform },
      });
      setDocument({ ...document, project });
    } catch (error) {
      fail(error);
    }
  }

  function toggleBorder(layerId: string) {
    const borderedLayerIds = document.borderedLayerIds.includes(layerId)
      ? document.borderedLayerIds.filter((id) => id !== layerId)
      : [...document.borderedLayerIds, layerId];
    setDocument({ ...document, borderedLayerIds });
    setNotice(null);
  }

  function rotateSelected() {
    if (!selectedLayerId || !selectedTransform || selectedIsLocked) return;
    updateLayerTransform(selectedLayerId, {
      ...selectedTransform,
      rotation: normalizeRotation(selectedTransform.rotation + 15),
    });
  }

  function mirrorSelected() {
    if (!selectedLayerId || !selectedTransform || selectedIsLocked) return;
    updateLayerTransform(selectedLayerId, {
      ...selectedTransform,
      flipHorizontal: !selectedTransform.flipHorizontal,
    });
  }

  function removeLayer(layerId: string) {
    try {
      const imageLayer = document.images.find((layer) => layer.id === layerId);
      const nextDocument: EmblemCreatorDocument = imageLayer
        ? { ...document, images: document.images.filter((layer) => layer.id !== layerId) }
        : removeVectorLayer(document, layerId);
      setDocument(nextDocument);
      if (selectedLayerId === layerId) setSelectedLayerId(null);
      setNotice(null);
    } catch (error) {
      fail(error);
    }
  }

  function toggleLayerVisibility(layerId: string) {
    try {
      const imageLayer = document.images.find((layer) => layer.id === layerId);
      if (imageLayer) {
        setDocument({
          ...document,
          images: document.images.map((layer) => layer.id === layerId ? { ...layer, visible: !layer.visible } : layer),
        });
      } else {
        const layer = document.project.layers.find((candidate) => candidate.id === layerId);
        if (!layer || layer.type === 'background') return;
        const project = applyProjectCommand(document.project, {
          type: 'set-layer-visibility',
          layerId,
          visible: !layer.visible,
        });
        setDocument({ ...document, project });
      }
      if (selectedLayerId === layerId) setSelectedLayerId(null);
      setNotice(null);
    } catch (error) {
      fail(error);
    }
  }

  function toggleSlotVisibility(slot: EmblemLayerSlot) {
    const vectorLayers = document.project.layers.filter(
      (layer) => layer.type !== 'background' && document.slotByLayerId[layer.id] === slot,
    );
    const images = slot === 'crest' ? document.images : [];
    const layerIds = [...vectorLayers.map((layer) => layer.id), ...images.map((layer) => layer.id)];
    if (layerIds.length === 0) return;
    const allVisible = [...vectorLayers.map((layer) => layer.visible), ...images.map((layer) => layer.visible)].every(Boolean);
    try {
      let project = document.project;
      for (const layer of vectorLayers) {
        project = applyProjectCommand(project, {
          type: 'set-layer-visibility',
          layerId: layer.id,
          visible: !allVisible,
        });
      }
      setDocument({
        ...document,
        project,
        images: slot === 'crest'
          ? document.images.map((layer) => ({ ...layer, visible: !allVisible }))
          : document.images,
      });
      if (selectedLayerId && layerIds.includes(selectedLayerId)) setSelectedLayerId(null);
      setNotice(null);
    } catch (error) {
      fail(error);
    }
  }

  function updateSelectedScale(axis: 'both' | 'x' | 'y', value: number) {
    if (!selectedLayerId || !selectedTransform || selectedIsLocked) return;
    const scale = Math.max(0.1, Math.min(2.5, value));
    let transform: CanvasTransform;
    if (axis === 'both' || keepAspectRatio) {
      transform = { ...withoutIndependentScale(selectedTransform), scale };
    } else {
      transform = {
        ...selectedTransform,
        scaleX: axis === 'x' ? scale : currentHorizontalScale,
        scaleY: axis === 'y' ? scale : currentVerticalScale,
      };
    }
    updateLayerTransform(selectedLayerId, transform);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const eventTarget = event.target;
    if (!(eventTarget instanceof Element)) return;
    if (eventTarget.closest('[data-resize-handle]')) return;
    const layerNode = eventTarget.closest<SVGGElement>('[data-layer-id]');
    const layerId = layerNode?.getAttribute('data-layer-id');
    if (!layerNode || !layerId || layerId === 'emblem-creator-background') {
      setSelectedLayerId(null);
      return;
    }
    const vectorLayer = document.project.layers.find((layer): layer is EmblemAssetProjectLayer => layer.id === layerId && isEmblemAssetLayer(layer));
    const imageLayer = document.images.find((layer) => layer.id === layerId);
    const transform = vectorLayer && 'transform' in vectorLayer ? vectorLayer.transform : imageLayer?.transform;
    if (!transform) return;
    setSelectedLayerId(layerId);
    const svg = canvasSvgRef.current?.querySelector('svg');
    const frame = layerNode.getBoundingClientRect();
    if (!svg) return;
    const canvasBounds = svg.getBoundingClientRect();
    dragStateRef.current = {
      layerId,
      mode: 'move',
      startX: event.clientX,
      startY: event.clientY,
      initialTransform: transform,
      canvasWidth: canvasBounds.width,
      canvasHeight: canvasBounds.height,
      frameWidth: Math.max(frame.width, 24),
      frameHeight: Math.max(frame.height, 24),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function beginResize(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!selectedLayerId || !selectedTransform || selectedIsLocked) return;
    const svg = canvasSvgRef.current?.querySelector('svg');
    if (!svg || !selectionFrame) return;
    const bounds = svg.getBoundingClientRect();
    dragStateRef.current = {
      layerId: selectedLayerId,
      mode: 'resize',
      startX: event.clientX,
      startY: event.clientY,
      initialTransform: selectedTransform,
      canvasWidth: bounds.width,
      canvasHeight: bounds.height,
      frameWidth: Math.max((selectionFrame.width / 100) * bounds.width, 24),
      frameHeight: Math.max((selectionFrame.height / 100) * bounds.height, 24),
    };
    canvasInteractionRef.current?.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragStateRef.current;
    if (!drag) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (drag.mode === 'move') {
      updateLayerTransform(drag.layerId, {
        ...drag.initialTransform,
        x: clampPosition(drag.initialTransform.x + (deltaX / drag.canvasWidth) * 100, -100, 100),
        y: clampPosition(drag.initialTransform.y + (deltaY / drag.canvasHeight) * 110, -110, 110),
      });
      return;
    }
    const startXScale = drag.initialTransform.scaleX ?? drag.initialTransform.scale;
    const startYScale = drag.initialTransform.scaleY ?? drag.initialTransform.scale;
    if (keepAspectRatio) {
      const scaleChange = ((deltaX / drag.frameWidth) + (deltaY / drag.frameHeight)) / 2;
      updateLayerTransform(drag.layerId, {
        ...withoutIndependentScale(drag.initialTransform),
        scale: Math.max(0.1, Math.min(2.5, drag.initialTransform.scale * (1 + scaleChange))),
      });
    } else {
      updateLayerTransform(drag.layerId, {
        ...drag.initialTransform,
        scaleX: Math.max(0.1, Math.min(2.5, startXScale * (1 + deltaX / drag.frameWidth))),
        scaleY: Math.max(0.1, Math.min(2.5, startYScale * (1 + deltaY / drag.frameHeight))),
      });
    }
  }

  function handlePointerUp() {
    dragStateRef.current = null;
  }

  function handleAssetDragStart(event: React.DragEvent<HTMLButtonElement>, assetId: string) {
    event.dataTransfer.setData('application/x-emblem-asset', assetId);
    event.dataTransfer.effectAllowed = 'copy';
  }

  function handleAssetDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const assetId = event.dataTransfer.getData('application/x-emblem-asset');
    if (assetId) addAsset(assetId);
  }

  async function importImageBlob(blob: Blob, name: string, mimeTypeHint?: string) {
    const mimeType = resolveImageMimeType(blob.type || mimeTypeHint || '', name);
    if (!mimeType) throw new Error(copy.imageTypeError);
    if (blob.size <= 0 || blob.size > 8_388_608) throw new Error(copy.imageLimitError);
    const currentTotal = document.images.reduce((total, image) => total + image.byteLength, 0);
    if (currentTotal + blob.size > 16_777_216) throw new Error(copy.totalImageLimitError);
    if (document.images.length >= 8) throw new Error(copy.imageCountError);

    const normalizedBlob = blob.type === mimeType ? blob : new Blob([blob], { type: mimeType });
    const dataUrl = await readBlobAsDataUrl(normalizedBlob);
    const image = await decodeImage(dataUrl);
    const layer: EmblemImageLayer = {
      id: createLocalCoatId(),
      name: name.trim() || copy.chooseImage,
      mimeType,
      dataUrl,
      byteLength: blob.size,
      width: image.width,
      height: image.height,
      visible: true,
      transform: { x: 0, y: 0, scale: 1, rotation: 0 },
    };
    const nextDocument = { ...document, images: [...document.images, layer] };
    assertEmblemCreatorDocument(nextDocument);
    setDocument(nextDocument);
    setSelectedLayerId(layer.id);
    setOpenSlots((current) => current.includes('crest') ? current : [...current, 'crest']);
    setNotice(null);
  }

  async function submitImageUrl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rawUrl = imageUrl.trim();
    if (!rawUrl) return;
    setBusyAction('url');
    setNotice(null);
    try {
      const parsedUrl = new URL(rawUrl);
      if (parsedUrl.protocol !== 'https:' && parsedUrl.origin !== window.location.origin) {
        throw new Error(copy.corsError);
      }
      const response = await fetch(parsedUrl.toString());
      if (!response.ok) throw new Error(`Image request failed with status ${response.status}.`);
      const blob = await response.blob();
      const fileName = decodeURIComponent(parsedUrl.pathname.split('/').pop() || copy.chooseImage);
      await importImageBlob(blob, fileName, response.headers.get('content-type') ?? '');
      setImageUrl('');
    } catch (error) {
      const reason = error instanceof TypeError ? copy.corsError : error;
      fail(reason);
    } finally {
      setBusyAction(null);
    }
  }

  async function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusyAction('file');
    setNotice(null);
    try {
      await importImageBlob(file, file.name, file.type);
    } catch (error) {
      fail(error);
    } finally {
      setBusyAction(null);
    }
  }

  function resetDocument() {
    setDocument(createBlankEmblemDocument(locale));
    setSelectedLayerId(null);
    setSelectionFrame(null);
    setActiveTab('body');
    setActiveFilter('all');
    setSearch('');
    setNotice(null);
  }

  function saveProject() {
    try {
      assertEmblemCreatorDocument(document);
      const blob = new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' });
      const fileName = makeProjectFileName(document.project.name);
      downloadBlob(blob, fileName);
      setNotice({ kind: 'success', text: copy.saveDone });
    } catch (error) {
      fail(error);
    }
  }

  async function handleProjectFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusyAction('load');
    setNotice(null);
    try {
      if (file.size > 24_000_000) throw new Error(copy.loadError);
      const parsed = parseEmblemCreatorDocument(JSON.parse(await file.text()), locale);
      for (const [index, image] of parsed.images.entries()) {
        const decoded = await decodeImage(image.dataUrl);
        if (decoded.width !== image.width || decoded.height !== image.height) {
          throw new Error(`Imported image dimensions do not match project data at index ${index}.`);
        }
      }
      setDocument(parsed);
      setSelectedLayerId(null);
      setNotice({ kind: 'success', text: copy.loadDone });
    } catch (error) {
      fail(error instanceof SyntaxError ? new Error(copy.loadError) : error);
    } finally {
      setBusyAction(null);
    }
  }

  async function exportPng() {
    setBusyAction('export');
    setNotice(null);
    let objectUrl: string | null = null;
    try {
      const dimensions = getCoatExportDimensions(document.project, 1024);
      const svg = renderEmblemCreatorSvg(document, { width: dimensions.width, height: dimensions.height });
      const absoluteAssetUrls = svg.replace(/\bhref="\/(?!\/)([^"]+)"/g, (_match, path: string) => `href="${window.location.origin}/${path}"`);
      const svgBlob = new Blob([absoluteAssetUrls], { type: 'image/svg+xml;charset=utf-8' });
      objectUrl = URL.createObjectURL(svgBlob);
      const image = await decodeImage(objectUrl);
      const canvas = window.document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not create the PNG export canvas.');
      context.drawImage(image, 0, 0, dimensions.width, dimensions.height);
      const blob = await canvasToPngBlob(canvas);
      downloadBlob(blob, `${makeProjectFileName(document.project.name).replace(/\.json$/i, '')}.png`);
      setNotice({ kind: 'success', text: copy.exportDone });
    } catch (error) {
      fail(error);
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setBusyAction(null);
    }
  }

  function slotName(slot: EmblemLayerSlot): string {
    if (slot === 'crest') return copy.crestSlot;
    if (slot === 'details') return copy.detailSlot;
    return copy.bodySlot(Number(slot.slice(-1)));
  }

  function getLayersInSlot(slot: EmblemLayerSlot): Array<{ id: string; name: string; visible: boolean }> {
    const vectorLayers = document.project.layers
      .filter((layer): layer is EmblemAssetProjectLayer => isEmblemAssetLayer(layer) && document.slotByLayerId[layer.id] === slot)
      .map((layer) => ({
        id: layer.id,
        name: layer.displayName || getCoatAsset(layer.assetId).name[locale],
        visible: layer.visible,
      }));
    const images = slot === 'crest'
      ? document.images.map((layer) => ({ id: layer.id, name: layer.name, visible: layer.visible }))
      : [];
    return [...vectorLayers, ...images];
  }

  function toggleSlotOpen(slot: EmblemLayerSlot) {
    setOpenSlots((current) => current.includes(slot) ? current.filter((item) => item !== slot) : [...current, slot]);
  }

  return (
    <main className={styles.editor} aria-label={copy.title}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">✦</span>
          <div className={styles.brandCopy}>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
        </div>
        <div className={styles.topbarActions}>
          <button className={styles.secondaryButton} type="button" onClick={resetDocument}>
            <Trash2 size={16} aria-hidden="true" />
            <span>{copy.clear}</span>
          </button>
          <button className={styles.secondaryButton} type="button" onClick={saveProject}>
            <Download size={16} aria-hidden="true" />
            <span>{copy.save}</span>
          </button>
          <button className={styles.secondaryButton} type="button" onClick={() => projectInputRef.current?.click()}>
            <Upload size={16} aria-hidden="true" />
            <span>{copy.load}</span>
          </button>
          <button className={styles.primaryButton} type="button" onClick={exportPng} disabled={busyAction !== null}>
            {busyAction === 'export' ? <LoaderCircle size={16} className={styles.spin} aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
            <span>{copy.export}</span>
          </button>
        </div>
        <input ref={projectInputRef} className={styles.hiddenInput} type="file" accept="application/json,.json" onChange={handleProjectFileChange} aria-label={copy.load} />
      </header>

      <div className={styles.workspace}>
        <aside className={styles.assetPanel} aria-label={copy.materials}>
          <div className={styles.panelHeading}>
            <div>
              <h2>{copy.materials}</h2>
              <p>{visibleAssets.length} {copy.assetCount}</p>
            </div>
            <ImagePlus size={18} aria-hidden="true" />
          </div>

          <form className={styles.urlForm} onSubmit={submitImageUrl}>
            <label className={styles.srOnly} htmlFor={`emblem-url-${locale}`}>{copy.imageUrlPlaceholder}</label>
            <input
              id={`emblem-url-${locale}`}
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder={copy.imageUrlPlaceholder}
              inputMode="url"
              type="url"
            />
            <button type="submit" aria-label={copy.addImage} disabled={busyAction !== null || !imageUrl.trim()}>
              {busyAction === 'url' ? <LoaderCircle size={16} className={styles.spin} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
            </button>
          </form>
          <p className={styles.uploadHint}>{copy.urlHelp}</p>
          <button className={styles.uploadButton} type="button" onClick={() => fileInputRef.current?.click()} disabled={busyAction !== null}>
            {busyAction === 'file' ? <LoaderCircle size={16} className={styles.spin} aria-hidden="true" /> : <Upload size={16} aria-hidden="true" />}
            {copy.uploadImage}
          </button>
          <input ref={fileInputRef} className={styles.hiddenInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageFileChange} aria-label={copy.uploadImage} />

          <div className={styles.assetTabs} role="tablist" aria-label={copy.materials}>
            {(['body', 'details', 'crests'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={activeTab === tab ? styles.activeAssetTab : styles.assetTab}
                onClick={() => {
                  setActiveTab(tab);
                  setActiveFilter('all');
                }}
              >
                {tab === 'body' ? copy.body : tab === 'details' ? copy.details : copy.crests}
              </button>
            ))}
          </div>

          <div className={styles.filterList} aria-label={copy.materials}>
            {assetFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={activeFilter === filter.id ? styles.activeFilter : styles.filterButton}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
                <span>{filter.count}</span>
              </button>
            ))}
          </div>

          <label className={styles.searchField}>
            <Search size={16} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.searchPlaceholder} />
            {search && <button type="button" aria-label={locale === 'zh' ? '清除搜索' : 'Clear search'} onClick={() => setSearch('')}><X size={14} aria-hidden="true" /></button>}
          </label>

          <div className={styles.assetGrid}>
            {visibleAssets.length === 0 ? (
              <p className={styles.emptySearch}>{copy.emptyResults}</p>
            ) : visibleAssets.map((asset) => {
              const name = asset.name[locale];
              return (
                <button
                  key={asset.id}
                  className={styles.assetTile}
                  type="button"
                  draggable
                  onDragStart={(event) => handleAssetDragStart(event, asset.id)}
                  onClick={() => addAsset(asset.id)}
                  aria-label={copy.selectAsset(name)}
                  title={name}
                >
                  <AssetThumbnail asset={asset} />
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className={styles.canvasPanel} aria-label={copy.canvas}>
          <div className={styles.canvasHeader}>
            <div>
              <h2>{copy.canvas}</h2>
              <span>{document.project.canvas.width} × {document.project.canvas.height}</span>
            </div>
            <span className={styles.canvasBadge}>{document.project.name}</span>
          </div>
          <div
            ref={canvasInteractionRef}
            className={styles.canvasWorkspace}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleAssetDrop}
          >
            <div className={styles.canvasRuler} aria-hidden="true"><span>100%</span></div>
            <div className={styles.canvasBoard}>
              <div ref={canvasSvgRef} className={styles.svgSurface} dangerouslySetInnerHTML={{ __html: copyOfDocument }} />
              {!document.project.layers.some((layer) => layer.type !== 'background' && layer.visible) && !document.images.some((layer) => layer.visible) && (
                <div className={styles.emptyCanvasHint}>
                  <span className={styles.emptyCanvasIcon} aria-hidden="true">✦</span>
                  <strong>{copy.dropHint}</strong>
                  <span>{copy.dropSubhint}</span>
                </div>
              )}
              {selectionFrame && selectedLayerId && (
                <div
                  className={styles.selectionFrame}
                  style={{ left: `${selectionFrame.left}%`, top: `${selectionFrame.top}%`, width: `${selectionFrame.width}%`, height: `${selectionFrame.height}%` }}
                  aria-hidden="true"
                >
                  <span className={styles.selectionCornerTopLeft} />
                  <span className={styles.selectionCornerTopRight} />
                  <span className={styles.selectionCornerBottomLeft} />
                  <button className={styles.resizeHandle} type="button" data-resize-handle onPointerDown={beginResize} aria-label={locale === 'zh' ? '调整对象大小' : 'Resize object'} />
                </div>
              )}
              {selectedLayerName && selectedLayerId && selectionFrame && (
                <div
                  className={styles.selectionToolbar}
                  style={{
                    left: `${Math.min(86, Math.max(14, selectionFrame.left + selectionFrame.width / 2))}%`,
                    top: `${Math.max(1, selectionFrame.top - 1)}%`,
                  }}
                  role="toolbar"
                  aria-label={copy.selectedObject}
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <button type="button" title={copy.rotate} aria-label={copy.rotate} onClick={rotateSelected} disabled={selectedIsLocked}><RotateCw size={16} aria-hidden="true" /></button>
                  <button type="button" title={copy.mirror} aria-label={copy.mirror} onClick={mirrorSelected} disabled={selectedIsLocked}><FlipHorizontal2 size={16} aria-hidden="true" /></button>
                  <button
                    type="button"
                    title={copy.border}
                    aria-label={copy.border}
                    aria-pressed={document.borderedLayerIds.includes(selectedLayerId)}
                    className={document.borderedLayerIds.includes(selectedLayerId) ? styles.toolbarPressed : undefined}
                    onClick={() => toggleBorder(selectedLayerId)}
                  >
                    <span className={styles.borderGlyph} aria-hidden="true">◌</span>
                  </button>
                  <button type="button" title={copy.delete} aria-label={copy.delete} className={styles.deleteAction} onClick={() => removeLayer(selectedLayerId)}><Trash2 size={16} aria-hidden="true" /></button>
                </div>
              )}
            </div>
          </div>
          {notice && (
            <div className={notice.kind === 'error' ? styles.errorNotice : styles.successNotice} role={notice.kind === 'error' ? 'alert' : 'status'}>
              <span>{notice.kind === 'error' ? `${copy.errorTitle}: ${notice.text}` : notice.text}</span>
              <button type="button" aria-label={locale === 'zh' ? '关闭提示' : 'Dismiss notice'} onClick={() => setNotice(null)}><X size={14} aria-hidden="true" /></button>
            </div>
          )}
        </section>

        <aside className={styles.layersPanel} aria-label={copy.layerStack}>
          <div className={styles.panelHeading}>
            <div>
              <h2>{copy.layerStack}</h2>
              <p>{document.project.layers.filter((layer) => layer.type !== 'background').length + document.images.length} {copy.assetCount}</p>
            </div>
            <span className={styles.layerCount} aria-hidden="true">{document.project.layers.filter((layer) => layer.type !== 'background').length + document.images.length}</span>
          </div>
          <div className={styles.layerStack}>
            {slotOrder.map((slot) => {
              const layers = getLayersInSlot(slot);
              const isOpen = openSlots.includes(slot);
              const allVisible = layers.length > 0 && layers.every((layer) => layer.visible);
              const anyVisible = layers.some((layer) => layer.visible);
              return (
                <section key={slot} className={styles.layerSlot}>
                  <div className={styles.layerSlotHeader}>
                    <button type="button" className={styles.slotExpand} onClick={() => toggleSlotOpen(slot)} aria-expanded={isOpen}>
                      <ChevronDown size={15} className={isOpen ? styles.chevronOpen : undefined} aria-hidden="true" />
                      <span>{slotName(slot)}</span>
                      <span className={styles.slotCount}>{layers.length}</span>
                    </button>
                    <button
                      className={styles.visibilityButton}
                      type="button"
                      aria-label={copy.toggleVisibility(slotName(slot))}
                      disabled={layers.length === 0}
                      onClick={() => toggleSlotVisibility(slot)}
                    >
                      {allVisible ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} className={anyVisible ? '' : styles.mutedEye} aria-hidden="true" />}
                    </button>
                  </div>
                  {isOpen && (
                    <div className={styles.slotContents}>
                      {layers.length === 0 ? <p className={styles.emptySlot}>{copy.emptySlot}</p> : layers.map((layer) => (
                        <div key={layer.id} className={selectedLayerId === layer.id ? styles.layerItemSelected : styles.layerItem}>
                          <button type="button" className={styles.layerNameButton} onClick={() => selectLayer(layer.id)} aria-label={copy.selectLayer(layer.name)}>
                            <span className={styles.layerDot} aria-hidden="true" />
                            <span>{layer.name}</span>
                          </button>
                          <button className={styles.visibilityButton} type="button" aria-label={copy.toggleVisibility(layer.name)} onClick={() => toggleLayerVisibility(layer.id)}>
                            {layer.visible ? <Eye size={14} aria-hidden="true" /> : <EyeOff size={14} aria-hidden="true" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <section className={styles.properties} aria-label={copy.selectedObject}>
            <div className={styles.propertiesHeading}>
              <h3>{copy.selectedObject}</h3>
              {selectedLayerId && <span className={styles.selectedIndicator} />}
            </div>
            {selectedLayerId && selectedLayerName && selectedTransform ? (
              <>
                <p className={styles.selectedName} title={selectedLayerName}>{selectedLayerName}</p>
                <label className={styles.ratioControl}>
                  <input type="checkbox" checked={keepAspectRatio} onChange={(event) => setKeepAspectRatio(event.target.checked)} />
                  <span>{copy.keepRatio}</span>
                </label>
                <label className={styles.scaleControl}>
                  <span>{copy.horizontalScale} <b>{Math.round(currentHorizontalScale * 100)}%</b></span>
                  <input type="range" min="0.1" max="2.5" step="0.01" value={currentHorizontalScale} onChange={(event) => updateSelectedScale(keepAspectRatio ? 'both' : 'x', Number(event.target.value))} disabled={selectedIsLocked} />
                </label>
                {!keepAspectRatio && (
                  <label className={styles.scaleControl}>
                    <span>{copy.verticalScale} <b>{Math.round(currentVerticalScale * 100)}%</b></span>
                    <input type="range" min="0.1" max="2.5" step="0.01" value={currentVerticalScale} onChange={(event) => updateSelectedScale('y', Number(event.target.value))} disabled={selectedIsLocked} />
                  </label>
                )}
                <button className={styles.deleteButton} type="button" onClick={() => removeLayer(selectedLayerId)}>
                  <Trash2 size={15} aria-hidden="true" />
                  {copy.delete}
                </button>
              </>
            ) : <p className={styles.noSelection}>{copy.noSelection}</p>}
          </section>
        </aside>
      </div>
    </main>
  );
}

function getAssetFilters(tab: AssetTabId, locale: CoatLocale): Array<{ id: AssetFilterId; label: string; count: number }> {
  const copy = copyByLocale[locale];
  const filters: AssetFilterId[] = tab === 'body'
    ? ['all', 'shapes', 'materials']
    : tab === 'details'
      ? ['all', 'structures', 'objects', 'plants', 'symbols']
      : ['all', 'animals', 'people', 'crowns', 'mantles', 'supporters', 'other'];
  return filters.map((id) => ({
    id,
    label: id === 'materials' ? copy.bodyMaterials : copy[id],
    count: getAssetsForFilter(tab, id).length,
  }));
}

function getFilteredAssets(tab: AssetTabId, filter: AssetFilterId, search: string, locale: CoatLocale): CoatAsset[] {
  const query = search.trim().toLocaleLowerCase(locale === 'zh' ? 'zh-CN' : 'en');
  return getAssetsForFilter(tab, filter).filter((asset) => {
    if (!query) return true;
    const terms = [asset.id, asset.name[locale], ...(asset.searchTerms ?? [])].join(' ').toLocaleLowerCase(locale === 'zh' ? 'zh-CN' : 'en');
    return terms.includes(query);
  });
}

function getAssetsForFilter(tab: AssetTabId, filter: AssetFilterId): CoatAsset[] {
  if (tab === 'body') {
    if (filter === 'shapes') return allShieldAssets.filter((asset) => silhouetteAssetIds.has(asset.id));
    if (filter === 'materials') return allShieldAssets.filter((asset) => !silhouetteAssetIds.has(asset.id));
    return allShieldAssets;
  }
  if (tab === 'details') {
    const detailAssets: CoatAsset[] = [
      ...allOrdinaryAssets,
      ...allChargeAssets.filter((asset) => asset.category === 'object' || asset.category === 'plant' || asset.category === 'symbol'),
    ];
    if (filter === 'structures') return allOrdinaryAssets;
    if (filter === 'objects' || filter === 'plants' || filter === 'symbols') {
      return allChargeAssets.filter((asset) => asset.category === filter.slice(0, -1) || (filter === 'objects' && asset.category === 'object'));
    }
    return detailAssets;
  }

  const crestAssets: CoatAsset[] = [
    ...allTopAssets,
    ...allChargeAssets.filter((asset) => asset.category === 'animal' || asset.category === 'human'),
  ];
  if (filter === 'animals') return allChargeAssets.filter((asset) => asset.category === 'animal');
  if (filter === 'people') return allChargeAssets.filter((asset) => asset.category === 'human');
  if (filter === 'crowns' || filter === 'mantles' || filter === 'supporters' || filter === 'other') {
    return allTopAssets.filter((asset) => asset.category === filter.slice(0, -1) || (filter === 'other' && asset.category === 'other'));
  }
  return crestAssets;
}

function AssetThumbnail({ asset }: { asset: CoatAsset }) {
  const imageSource = getAssetImageSource(asset);
  if (imageSource) return <NextImage className={styles.assetThumbnailImage} src={imageSource} alt="" width={80} height={60} loading="lazy" unoptimized />;
  if ('svgPath' in asset && asset.svgPath) {
    return (
      <svg className={styles.assetThumbnailVector} viewBox="0 0 100 110" aria-hidden="true">
        {asset.svgParts?.map((part, index) => <path key={index} d={part.svgPath} fill={part.sourceColor} />)}
        {!asset.svgParts?.length && <path d={asset.svgPath} fill="currentColor" />}
      </svg>
    );
  }
  return <span className={styles.assetFallback} aria-hidden="true">✦</span>;
}

function getAssetImageSource(asset: CoatAsset): string | null {
  if ('rasterSrc' in asset && asset.rasterSrc) return asset.rasterSrc;
  if ('staticImageSrc' in asset && asset.staticImageSrc) return asset.staticImageSrc;
  if ('rasterVariants' in asset && asset.rasterVariants?.[0]) return asset.rasterVariants[0].src;
  return null;
}

function removeVectorLayer(document: EmblemCreatorDocument, layerId: string): EmblemCreatorDocument {
  const layer = document.project.layers.find((candidate) => candidate.id === layerId);
  if (!layer || layer.type === 'background') throw new Error(`Unknown Emblem Creator layer: ${layerId}.`);
  const project = applyProjectCommand(document.project, { type: 'remove-layer', layerId });
  const slotByLayerId = Object.fromEntries(Object.entries(document.slotByLayerId).filter(([id]) => id !== layerId)) as Record<string, EmblemLayerSlot>;
  const borderedLayerIds = document.borderedLayerIds.filter((id) => id !== layerId);
  return { ...document, project, slotByLayerId, borderedLayerIds };
}

type EmblemAssetProjectLayer = Extract<CoatLayer, { type: 'shield' | 'ordinary' | 'charge' | 'top' }>;

function isEmblemAssetLayer(layer: CoatLayer): layer is EmblemAssetProjectLayer {
  return layer.type === 'shield' || layer.type === 'ordinary' || layer.type === 'charge' || layer.type === 'top';
}

function withoutIndependentScale(transform: CanvasTransform): CanvasTransform {
  const uniformTransform = { ...transform };
  delete uniformTransform.scaleX;
  delete uniformTransform.scaleY;
  return uniformTransform;
}

function hasEmblemLayer(document: EmblemCreatorDocument, layerId: string): boolean {
  return document.project.layers.some((layer) => layer.id === layerId && layer.type !== 'background')
    || document.images.some((layer) => layer.id === layerId);
}

function isBodySlot(slot: EmblemLayerSlot): slot is Extract<EmblemLayerSlot, `body-${number}`> {
  return slot.startsWith('body-');
}

function normalizeRotation(value: number): number {
  return ((value % 360) + 360) % 360;
}

function clampPosition(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function resolveImageMimeType(declaredType: string, name: string): EmblemImageMimeType | null {
  const normalizedType = declaredType.split(';', 1)[0]?.trim().toLowerCase();
  if (normalizedType === 'image/png' || normalizedType === 'image/jpeg' || normalizedType === 'image/webp' || normalizedType === 'image/gif') {
    return normalizedType;
  }
  const extension = name.split(/[?#]/, 1)[0]?.split('.').pop()?.toLowerCase();
  if (extension === 'png') return 'image/png';
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'gif') return 'image/gif';
  return null;
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The image file could not be read.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') reject(new Error('The image reader returned invalid data.'));
      else resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

function decodeImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
        reject(new Error('The imported file is not a decodable image.'));
        return;
      }
      resolve(image);
    };
    image.onerror = () => reject(new Error('The imported file is not a decodable image.'));
    image.src = source;
  });
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob || blob.size === 0) reject(new Error('The PNG encoder returned an empty file.'));
      else resolve(blob);
    }, 'image/png');
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function makeProjectFileName(projectName: string): string {
  const normalizedName = projectName
    .trim()
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return `${normalizedName || 'emblem-project'}.json`;
}
