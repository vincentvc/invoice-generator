import { create } from 'zustand';
import { TemplateConfig, SectionId, TemplateLabels } from '@/types/template-config';
import { createPresetConfig } from '@/lib/template-defaults';

interface TemplateConfigStore {
  config: TemplateConfig;

  loadConfig: (config: TemplateConfig | null, templateType: string) => void;
  resetToPreset: (templateType: string) => void;
  updateLabel: <K extends keyof TemplateLabels>(key: K, value: string) => void;
  reorderSections: (newOrder: SectionId[]) => void;
  toggleSectionVisibility: (sectionId: SectionId) => void;
  getConfig: () => TemplateConfig;
}

export const useTemplateConfigStore = create<TemplateConfigStore>((set, get) => ({
  config: createPresetConfig('modern'),

  loadConfig: (config, templateType) => {
    set({ config: config || createPresetConfig(templateType) });
  },

  resetToPreset: (templateType) => {
    set({ config: createPresetConfig(templateType) });
  },

  updateLabel: (key, value) => {
    const current = get().config;
    set({
      config: {
        ...current,
        labels: { ...current.labels, [key]: value },
      },
    });
  },

  reorderSections: (newOrder) => {
    const current = get().config;
    set({
      config: { ...current, sectionOrder: newOrder },
    });
  },

  toggleSectionVisibility: (sectionId) => {
    const current = get().config;
    set({
      config: {
        ...current,
        visibility: {
          ...current.visibility,
          [sectionId]: !current.visibility[sectionId],
        },
      },
    });
  },

  getConfig: () => get().config,
}));
