import { Metadata } from 'next';
import { TemplateGallery } from '@/components/templates/template-gallery';

export const metadata: Metadata = {
  title: 'Templates - InvoiceForge',
  description: 'Browse our collection of professional invoice templates. Choose from modern, classic, minimal, and more styles.',
};

export default function TemplatesPage() {
  return <TemplateGallery />;
}
