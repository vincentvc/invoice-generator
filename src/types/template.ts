export type TemplateType =
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'corporate'
  | 'creative'
  | 'retro'
  | 'bold'
  | 'pastel'
  | 'tech'
  | 'branded';

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  isPremium: boolean;
  thumbnail: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}
