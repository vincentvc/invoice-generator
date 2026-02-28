import { InvoiceData } from '@/types/invoice';
import { TemplateType } from '@/types/template';
import { ModernPdf } from './templates/modern-pdf';
import { ClassicPdf } from './templates/classic-pdf';
import { MinimalPdf } from './templates/minimal-pdf';
import { CorporatePdf } from './templates/corporate-pdf';
import { CreativePdf } from './templates/creative-pdf';
import { RetroPdf } from './templates/retro-pdf';
import { BoldPdf } from './templates/bold-pdf';
import { PastelPdf } from './templates/pastel-pdf';
import { TechPdf } from './templates/tech-pdf';
import { BrandedPdf } from './templates/branded-pdf';

interface PdfDocumentProps {
  invoice: InvoiceData;
  template: TemplateType;
}

const TEMPLATE_MAP: Record<TemplateType, React.ComponentType<{ invoice: InvoiceData }>> = {
  modern: ModernPdf,
  classic: ClassicPdf,
  minimal: MinimalPdf,
  corporate: CorporatePdf,
  creative: CreativePdf,
  retro: RetroPdf,
  bold: BoldPdf,
  pastel: PastelPdf,
  tech: TechPdf,
  branded: BrandedPdf,
};

export function PdfDocument({ invoice, template }: PdfDocumentProps) {
  const TemplateComponent = TEMPLATE_MAP[template] ?? ModernPdf;
  return <TemplateComponent invoice={invoice} />;
}
