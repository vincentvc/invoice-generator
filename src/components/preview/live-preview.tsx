'use client';

import { useInvoiceStore } from '@/stores/invoice-store';
import { useUIStore } from '@/stores/ui-store';
import { useTemplateConfigStore } from '@/stores/template-config-store';
import { ModernPreview } from './preview-templates/modern-preview';
import { ClassicPreview } from './preview-templates/classic-preview';
import { MinimalPreview } from './preview-templates/minimal-preview';
import { CorporatePreview } from './preview-templates/corporate-preview';
import { CreativePreview } from './preview-templates/creative-preview';
import { RetroPreview } from './preview-templates/retro-preview';
import { BoldPreview } from './preview-templates/bold-preview';
import { PastelPreview } from './preview-templates/pastel-preview';
import { TechPreview } from './preview-templates/tech-preview';
import { BrandedPreview } from './preview-templates/branded-preview';
import { TemplateType } from '@/types/template';
import { InvoiceData } from '@/types/invoice';
import { TemplateConfig } from '@/types/template-config';

const TEMPLATE_COMPONENTS: Record<TemplateType, React.ComponentType<{ invoice: InvoiceData; config?: TemplateConfig }>> = {
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

export function LivePreview() {
  const invoice = useInvoiceStore((s) => s.invoice);
  const activeTemplate = useUIStore((s) => s.activeTemplate);
  const config = useTemplateConfigStore((s) => s.config);

  const TemplateComponent = TEMPLATE_COMPONENTS[activeTemplate] || ModernPreview;

  return (
    <div className="mx-auto w-full max-w-[595px]">
      <div
        id="invoice-preview"
        className="aspect-[1/1.414] w-full overflow-hidden rounded-lg border bg-white shadow-lg"
        style={{ fontSize: '10px' }}
      >
        <div className="h-full w-full origin-top-left scale-100 overflow-hidden">
          <TemplateComponent invoice={invoice} config={config} />
        </div>
      </div>
    </div>
  );
}
