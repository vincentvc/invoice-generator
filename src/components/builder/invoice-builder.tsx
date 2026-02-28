'use client';

import { useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { InvoiceForm } from './invoice-form';
import { BuilderToolbar } from './builder-toolbar';
import { LivePreview } from '@/components/preview/live-preview';
import { useAutoSave, loadAutoSavedInvoice } from '@/hooks/use-auto-save';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useInvoiceStore } from '@/stores/invoice-store';
import { useUIStore } from '@/stores/ui-store';

export function InvoiceBuilder() {
  const loadInvoice = useInvoiceStore((s) => s.loadInvoice);
  const isMobilePreviewOpen = useUIStore((s) => s.isMobilePreviewOpen);
  const setMobilePreviewOpen = useUIStore((s) => s.setMobilePreviewOpen);

  useAutoSave();
  useKeyboardShortcuts();

  useEffect(() => {
    const saved = loadAutoSavedInvoice();
    if (saved) {
      loadInvoice(saved);
    }
  }, [loadInvoice]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-2 no-print">
        <BuilderToolbar />
        <Sheet open={isMobilePreviewOpen} onOpenChange={setMobilePreviewOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="sm">
              <Eye className="mr-1.5 h-4 w-4" />
              Preview
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-lg p-0">
            <div className="h-full overflow-auto p-4">
              <LivePreview />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel - 60% */}
        <div className="w-full overflow-hidden border-r lg:w-[60%] no-print">
          <InvoiceForm />
        </div>

        {/* Preview Panel - 40% (desktop only) */}
        <div className="hidden overflow-auto bg-muted/30 p-6 lg:block lg:w-[40%]">
          <LivePreview />
        </div>
      </div>
    </div>
  );
}
