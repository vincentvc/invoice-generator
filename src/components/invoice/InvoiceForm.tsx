'use client';

import { Download, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LogoUpload } from './LogoUpload';
import { CompanyInfo } from './CompanyInfo';
import { InvoiceDetails } from './InvoiceDetails';
import { LineItems } from './LineItems';
import { TaxCalculator } from './TaxCalculator';
import { PaymentInfo } from './PaymentInfo';
import { InvoicePreview } from './InvoicePreview';
import { useInvoice } from '@/hooks/useInvoice';
import { saveInvoice } from '@/lib/storage';

export function InvoiceForm() {
  const {
    invoice,
    updateField,
    updateFrom,
    updateTo,
    updateLineItem,
    addLineItem,
    removeLineItem,
    updateTax,
    updateDiscount,
    updateShipping,
    setLogo,
    resetInvoice,
  } = useInvoice();

  const handleSave = () => {
    saveInvoice(invoice);
  };

  const handleDownloadPDF = async () => {
    // Dynamic import to avoid SSR issues
    const { generateAndDownloadPDF } = await import('@/lib/pdf-generator');
    await generateAndDownloadPDF(invoice);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr,minmax(400px,600px)] gap-6 max-w-[1400px] mx-auto p-4 pb-12">
      {/* Left Panel - Form */}
      <Card className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create Invoice</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetInvoice} className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>
            <Button size="sm" onClick={handleDownloadPDF} className="gap-2">
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </Button>
          </div>
        </div>

        <Separator />

        {/* Logo Upload */}
        <LogoUpload logo={invoice.logo} onLogoChange={setLogo} />

        <Separator />

        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompanyInfo title="From" data={invoice.from} onChange={updateFrom} />
          <CompanyInfo title="Bill To" data={invoice.to} onChange={updateTo} />
        </div>

        <Separator />

        {/* Invoice Details */}
        <InvoiceDetails invoice={invoice} onUpdateField={updateField} />

        <Separator />

        {/* Line Items */}
        <LineItems
          items={invoice.items}
          currency={invoice.currency}
          onUpdate={updateLineItem}
          onAdd={addLineItem}
          onRemove={removeLineItem}
        />

        {/* Tax, Discount, Shipping, Total */}
        <TaxCalculator
          subtotal={invoice.subtotal}
          tax={invoice.tax}
          tax2={invoice.tax2}
          discount={invoice.discount}
          shipping={invoice.shipping}
          totalTax={invoice.totalTax}
          totalDiscount={invoice.totalDiscount}
          total={invoice.total}
          currency={invoice.currency}
          onUpdateTax={updateTax}
          onUpdateDiscount={updateDiscount}
          onUpdateShipping={updateShipping}
        />

        <Separator />

        {/* Notes & Terms */}
        <PaymentInfo
          notes={invoice.notes}
          terms={invoice.terms}
          onUpdateField={updateField}
        />
      </Card>

      {/* Right Panel - Preview */}
      <div className="space-y-4">
        <div className="sticky top-20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Live Preview
            </h3>
          </div>
          <div className="border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 p-4">
            <div className="transform scale-[0.75] origin-top">
              <InvoicePreview invoice={invoice} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
