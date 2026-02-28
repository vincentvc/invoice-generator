'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileX, Loader2 } from 'lucide-react';
import { InvoiceData } from '@/types/invoice';
import { getSharedInvoice } from '@/hooks/use-share-link';
import { TemplateType } from '@/types/template';
import { ModernPreview } from '@/components/preview/preview-templates/modern-preview';
import { ClassicPreview } from '@/components/preview/preview-templates/classic-preview';
import { MinimalPreview } from '@/components/preview/preview-templates/minimal-preview';
import { CorporatePreview } from '@/components/preview/preview-templates/corporate-preview';
import { CreativePreview } from '@/components/preview/preview-templates/creative-preview';
import { RetroPreview } from '@/components/preview/preview-templates/retro-preview';
import { BoldPreview } from '@/components/preview/preview-templates/bold-preview';
import { PastelPreview } from '@/components/preview/preview-templates/pastel-preview';
import { TechPreview } from '@/components/preview/preview-templates/tech-preview';
import { BrandedPreview } from '@/components/preview/preview-templates/branded-preview';

const TEMPLATE_COMPONENTS: Record<TemplateType, React.ComponentType<{ invoice: InvoiceData }>> = {
  modern: ModernPreview,
  classic: ClassicPreview,
  minimal: MinimalPreview,
  corporate: CorporatePreview,
  creative: CreativePreview,
  retro: RetroPreview,
  bold: BoldPreview,
  pastel: PastelPreview,
  tech: TechPreview,
  branded: BrandedPreview,
};

export default function SharePage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    const shared = getSharedInvoice(id);
    if (shared) {
      setInvoice(shared);
    } else {
      setIsNotFound(true);
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading invoice...</p>
      </div>
    );
  }

  if (isNotFound || !invoice) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Invoice Not Found
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This shared invoice could not be found. It may have been deleted, or the
          link may be invalid. Shared invoices are stored in the browser that
          created them.
        </p>
      </div>
    );
  }

  const templateKey = (invoice.template as TemplateType) || 'modern';
  const TemplateComponent = TEMPLATE_COMPONENTS[templateKey] || ModernPreview;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Shared Invoice
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invoice {invoice.invoiceNumber} from {invoice.sender.name || 'Unknown'}
        </p>
      </div>

      <div className="mx-auto w-full max-w-[595px]">
        <div
          className="aspect-[1/1.414] w-full overflow-hidden rounded-lg border bg-white shadow-lg"
          style={{ fontSize: '10px' }}
        >
          <div className="h-full w-full origin-top-left scale-100 overflow-hidden">
            <TemplateComponent invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
}
