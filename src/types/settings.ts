export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  taxId: string;
  logo: string | null;
}

export interface DefaultSettings {
  currency: string;
  paymentTerms: string;
  taxRates: number[];
  defaultNotes: string;
  defaultTerms: string;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  preferredTemplate: string;
}

export interface UserSettings {
  company: CompanyInfo;
  defaults: DefaultSettings;
  appearance: AppearanceSettings;
}

export const DEFAULT_COMPANY: CompanyInfo = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  taxId: '',
  logo: null,
};

export const DEFAULT_SETTINGS: UserSettings = {
  company: { ...DEFAULT_COMPANY },
  defaults: {
    currency: 'USD',
    paymentTerms: 'net30',
    taxRates: [],
    defaultNotes: '',
    defaultTerms: '',
  },
  appearance: {
    theme: 'system',
    preferredTemplate: 'modern',
  },
};
