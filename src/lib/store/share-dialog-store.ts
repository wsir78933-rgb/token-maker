import { create } from 'zustand';
import type { SiteLocale } from '@/lib/site-locale';
import type { ExportSize } from '@/types/editor';

export interface ShareDialogPayload {
  blob: Blob;
  fileName: string;
  exportSize: ExportSize;
  locale: SiteLocale;
}

interface ShareDialogState {
  isOpen: boolean;
  payload: ShareDialogPayload | null;
}

interface ShareDialogActions {
  openShareDialog: (payload: ShareDialogPayload) => void;
  closeShareDialog: () => void;
}

export type ShareDialogStore = ShareDialogState & ShareDialogActions;

export const useShareDialogStore = create<ShareDialogStore>()((set) => ({
  isOpen: false,
  payload: null,

  openShareDialog: (payload) => set({ isOpen: true, payload }),
  closeShareDialog: () => set({ isOpen: false, payload: null }),
}));
