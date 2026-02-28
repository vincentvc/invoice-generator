import { create } from 'zustand';
import { TemplateType } from '@/types/template';

interface UIStore {
  activeTemplate: TemplateType;
  isMobilePreviewOpen: boolean;
  isPremiumModalOpen: boolean;
  isShareModalOpen: boolean;
  isClearConfirmOpen: boolean;
  isPremiumUser: boolean;
  sidebarCollapsed: boolean;

  setActiveTemplate: (template: TemplateType) => void;
  setMobilePreviewOpen: (open: boolean) => void;
  setPremiumModalOpen: (open: boolean) => void;
  setShareModalOpen: (open: boolean) => void;
  setClearConfirmOpen: (open: boolean) => void;
  setPremiumUser: (premium: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTemplate: 'modern',
  isMobilePreviewOpen: false,
  isPremiumModalOpen: false,
  isShareModalOpen: false,
  isClearConfirmOpen: false,
  isPremiumUser: false,
  sidebarCollapsed: false,

  setActiveTemplate: (template) => set({ activeTemplate: template }),
  setMobilePreviewOpen: (open) => set({ isMobilePreviewOpen: open }),
  setPremiumModalOpen: (open) => set({ isPremiumModalOpen: open }),
  setShareModalOpen: (open) => set({ isShareModalOpen: open }),
  setClearConfirmOpen: (open) => set({ isClearConfirmOpen: open }),
  setPremiumUser: (premium) => set({ isPremiumUser: premium }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
