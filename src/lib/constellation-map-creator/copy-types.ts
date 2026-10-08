import type { ConstellationAssetCategory } from './types';

export type ConstellationWorkspaceTextKey =
  | 'workspaceTitle' | 'assetsTitle' | 'settingsTitle' | 'filesTitle' | 'exportTitle'
  | 'canvasLabel' | 'objectLabel' | 'resizeLabel' | 'rotateLabel' | 'assetCount' | 'addStar'
  | 'deleteSelected' | 'dragging' | 'resizing' | 'selectedCount' | 'canvasHint'
  | 'width' | 'height' | 'applySize' | 'backgroundColor' | 'applyColor'
  | 'transparentBase' | 'transparentHint' | 'backgroundImage' | 'backgroundUrl'
  | 'applyImage' | 'removeImage' | 'sizeMismatch' | 'clearObjects' | 'clearHint'
  | 'browserSaves' | 'browserHint' | 'slotLabel' | 'emptySlot' | 'occupiedSlot'
  | 'save' | 'load' | 'savedSlot' | 'loadedSlot' | 'overwriteHint'
  | 'projectTitle' | 'projectHint' | 'generateProject' | 'downloadProject'
  | 'chooseProject' | 'loadProject' | 'noFile' | 'generatedProject' | 'loadedProject'
  | 'generateImage' | 'downloadImage' | 'actualSize' | 'exportHint' | 'exportReady'
  | 'close' | 'backToEditor' | 'help' | 'helpTitle' | 'busy' | 'errorLabel'
  | 'addedObject' | 'deletedObject' | 'clearedObjects' | 'settingsApplied';

export type ConstellationWorkspaceCopy = Record<ConstellationWorkspaceTextKey, string> & {
  categoryLabels: Record<ConstellationAssetCategory, string>;
  helpSteps: readonly string[];
};
