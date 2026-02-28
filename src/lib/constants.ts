import { Template } from '@/types/template';

export const PAYMENT_TERMS = [
  { value: 'due-on-receipt', label: 'Due on Receipt' },
  { value: 'net7', label: 'Net 7' },
  { value: 'net15', label: 'Net 15' },
  { value: 'net30', label: 'Net 30' },
  { value: 'net60', label: 'Net 60' },
  { value: 'net90', label: 'Net 90' },
  { value: 'custom', label: 'Custom' },
] as const;

export const INVOICE_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-700' },
  { value: 'partial', label: 'Partial', color: 'bg-amber-100 text-amber-700' },
  { value: 'paid', label: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'overdue', label: 'Overdue', color: 'bg-red-100 text-red-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-500' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'other', label: 'Other' },
] as const;

export const RECURRENCE_FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
] as const;

export const TEMPLATES: Template[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Bold header with accent color, minimal design',
    isPremium: false,
    thumbnail: '/templates/modern.png',
    colors: { primary: '#3B82F6', secondary: '#EFF6FF', accent: '#2563EB', text: '#0F172A', background: '#FFFFFF' },
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean, professional black & white layout',
    isPremium: false,
    thumbnail: '/templates/classic.png',
    colors: { primary: '#1F2937', secondary: '#F9FAFB', accent: '#374151', text: '#111827', background: '#FFFFFF' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-sparse design with luxury feel',
    isPremium: true,
    thumbnail: '/templates/minimal.png',
    colors: { primary: '#18181B', secondary: '#FAFAFA', accent: '#71717A', text: '#27272A', background: '#FFFFFF' },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Formal letterhead-style layout',
    isPremium: true,
    thumbnail: '/templates/corporate.png',
    colors: { primary: '#1E3A5F', secondary: '#F0F4F8', accent: '#2563EB', text: '#1E293B', background: '#FFFFFF' },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful blocks with artistic layout',
    isPremium: true,
    thumbnail: '/templates/creative.png',
    colors: { primary: '#7C3AED', secondary: '#F5F3FF', accent: '#A78BFA', text: '#1F2937', background: '#FFFFFF' },
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Vintage invoice aesthetic',
    isPremium: true,
    thumbnail: '/templates/retro.png',
    colors: { primary: '#92400E', secondary: '#FFFBEB', accent: '#D97706', text: '#451A03', background: '#FEFCE8' },
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Dark header with high contrast',
    isPremium: true,
    thumbnail: '/templates/bold.png',
    colors: { primary: '#0F172A', secondary: '#F1F5F9', accent: '#EF4444', text: '#0F172A', background: '#FFFFFF' },
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft colors perfect for creatives',
    isPremium: true,
    thumbnail: '/templates/pastel.png',
    colors: { primary: '#EC4899', secondary: '#FDF2F8', accent: '#F472B6', text: '#1F2937', background: '#FFFFFF' },
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Monospace font with dark mode style',
    isPremium: true,
    thumbnail: '/templates/tech.png',
    colors: { primary: '#10B981', secondary: '#0F172A', accent: '#34D399', text: '#E2E8F0', background: '#1E293B' },
  },
  {
    id: 'branded',
    name: 'Branded',
    description: 'Fully customizable with your brand colors',
    isPremium: true,
    thumbnail: '/templates/branded.png',
    colors: { primary: '#3B82F6', secondary: '#EFF6FF', accent: '#2563EB', text: '#0F172A', background: '#FFFFFF' },
  },
];

export const APP_NAME = 'InvoiceForge';
export const APP_DESCRIPTION = 'Create professional invoices in seconds. Free, fast, and beautiful.';
export const APP_URL = 'https://invoiceforge.app';
