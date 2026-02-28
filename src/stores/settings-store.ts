import { create } from 'zustand';
import { UserSettings, CompanyInfo, DefaultSettings, AppearanceSettings, DEFAULT_SETTINGS } from '@/types/settings';
import { getItem, setItem } from '@/lib/storage';

const STORAGE_KEY = 'user-settings';

interface SettingsStore {
  settings: UserSettings;

  loadSettings: () => void;
  updateCompany: (updates: Partial<CompanyInfo>) => void;
  updateDefaults: (updates: Partial<DefaultSettings>) => void;
  updateAppearance: (updates: Partial<AppearanceSettings>) => void;
  resetSettings: () => void;
}

function persistSettings(settings: UserSettings): void {
  setItem(STORAGE_KEY, settings);
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },

  loadSettings: () => {
    const saved = getItem<UserSettings>(STORAGE_KEY, DEFAULT_SETTINGS);
    set({
      settings: {
        company: { ...DEFAULT_SETTINGS.company, ...saved.company },
        defaults: { ...DEFAULT_SETTINGS.defaults, ...saved.defaults },
        appearance: { ...DEFAULT_SETTINGS.appearance, ...saved.appearance },
      },
    });
  },

  updateCompany: (updates) => {
    const current = get().settings;
    const newSettings = {
      ...current,
      company: { ...current.company, ...updates },
    };
    set({ settings: newSettings });
    persistSettings(newSettings);
  },

  updateDefaults: (updates) => {
    const current = get().settings;
    const newSettings = {
      ...current,
      defaults: { ...current.defaults, ...updates },
    };
    set({ settings: newSettings });
    persistSettings(newSettings);
  },

  updateAppearance: (updates) => {
    const current = get().settings;
    const newSettings = {
      ...current,
      appearance: { ...current.appearance, ...updates },
    };
    set({ settings: newSettings });
    persistSettings(newSettings);
  },

  resetSettings: () => {
    set({ settings: { ...DEFAULT_SETTINGS } });
    persistSettings(DEFAULT_SETTINGS);
  },
}));
