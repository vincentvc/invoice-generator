'use client';

import { Download, Image, Printer, Share2, Trash2, Undo2, Redo2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInvoiceStore } from '@/stores/invoice-store';
import { useHistoryStore } from '@/stores/history-store';
import { useUIStore } from '@/stores/ui-store';
import { usePngExport } from '@/hooks/use-png-export';
import { useShareLink } from '@/hooks/use-share-link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function BuilderToolbar() {
  const invoice = useInvoiceStore((s) => s.invoice);
  const undo = useInvoiceStore((s) => s.undo);
  const redo = useInvoiceStore((s) => s.redo);
  const canUndo = useInvoiceStore((s) => s.canUndo);
  const canRedo = useInvoiceStore((s) => s.canRedo);
  const clearInvoice = useInvoiceStore((s) => s.clearInvoice);
  const saveInvoice = useHistoryStore((s) => s.saveInvoice);
  const isClearConfirmOpen = useUIStore((s) => s.isClearConfirmOpen);
  const setClearConfirmOpen = useUIStore((s) => s.setClearConfirmOpen);
  const { exportPng, isExporting } = usePngExport();
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateShareLink, copyToClipboard } = useShareLink();
  const { toast } = useToast();

  async function handleDownloadPdf() {
    setIsGenerating(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { PdfDocument } = await import('@/components/pdf/pdf-document');
      const template = (invoice.template || 'modern') as 'modern' | 'classic' | 'minimal' | 'corporate' | 'creative' | 'retro' | 'bold' | 'pastel' | 'tech' | 'branded';
      const blob = await pdf(<PdfDocument invoice={invoice} template={template} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: 'PDF downloaded successfully' });
    } catch {
      toast({ title: 'Failed to generate PDF', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownloadPng() {
    try {
      await exportPng('invoice-preview', `${invoice.invoiceNumber}.png`);
      toast({ title: 'PNG downloaded successfully' });
    } catch {
      toast({ title: 'Failed to export PNG', variant: 'destructive' });
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleShare() {
    const url = generateShareLink(invoice);
    if (url) {
      copyToClipboard(url);
      toast({ title: 'Share link copied to clipboard!' });
    }
  }

  function handleSave() {
    saveInvoice(invoice);
    toast({ title: 'Invoice saved!' });
  }

  return (
    <>
      <div className="flex items-center gap-1 flex-wrap">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="mr-1.5 h-4 w-4" />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save invoice (Ctrl+S)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                id="download-pdf-btn"
                onClick={handleDownloadPdf}
                disabled={isGenerating}
              >
                <Download className="mr-1.5 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'PDF'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download as PDF</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPng}
                disabled={isExporting}
              >
                <Image className="mr-1.5 h-4 w-4" />
                PNG
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download as PNG</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-1.5 h-4 w-4" />
                Print
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print invoice (Ctrl+P)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-1.5 h-4 w-4" />
                Share
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy share link</TooltipContent>
          </Tooltip>

          <div className="mx-1 h-6 w-px bg-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={undo}
                disabled={!canUndo()}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={redo}
                disabled={!canRedo()}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>

          <div className="mx-1 h-6 w-px bg-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => setClearConfirmOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear all</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog open={isClearConfirmOpen} onOpenChange={setClearConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all invoice data? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearInvoice();
                setClearConfirmOpen(false);
                toast({ title: 'Invoice cleared' });
              }}
            >
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
