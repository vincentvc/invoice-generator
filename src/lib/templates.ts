import type { TemplateInfo, TemplateId } from '@/types/invoice';

export const TEMPLATES: readonly TemplateInfo[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with accent colors',
    primaryColor: '#2563eb',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional invoice layout',
    primaryColor: '#1f2937',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with plenty of whitespace',
    primaryColor: '#6b7280',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Strong typography with vibrant accent colors',
    primaryColor: '#7c3aed',
  },
] as const;

export function getTemplate(id: TemplateId): TemplateInfo {
  return TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0];
}
