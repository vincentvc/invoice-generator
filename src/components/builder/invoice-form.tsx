'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LogoUpload } from './form-sections/logo-upload';
import { SenderInfo } from './form-sections/sender-info';
import { RecipientInfo } from './form-sections/recipient-info';
import { InvoiceDetails } from './form-sections/invoice-details';
import { LineItems } from './form-sections/line-items';
import { TotalsPanel } from './form-sections/totals-panel';
import { NotesTerms } from './form-sections/notes-terms';
import { CurrencySelector } from './currency-selector';
import { TemplateSwitcher } from './template-switcher';

export function InvoiceForm() {
  return (
    <ScrollArea className="h-full custom-scrollbar">
      <div className="space-y-6 p-6">
        <LogoUpload />
        <Separator />
        <SenderInfo />
        <Separator />
        <RecipientInfo />
        <Separator />
        <InvoiceDetails />
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CurrencySelector />
        </div>
        <TemplateSwitcher />
        <Separator />
        <LineItems />
        <TotalsPanel />
        <Separator />
        <NotesTerms />
      </div>
    </ScrollArea>
  );
}
