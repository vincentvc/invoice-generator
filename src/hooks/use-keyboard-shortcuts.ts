'use client';

import { useEffect } from 'react';
import { useInvoiceStore } from '@/stores/invoice-store';
import { useHistoryStore } from '@/stores/history-store';

export function useKeyboardShortcuts() {
  const undo = useInvoiceStore((state) => state.undo);
  const redo = useInvoiceStore((state) => state.redo);
  const invoice = useInvoiceStore((state) => state.invoice);
  const saveInvoice = useHistoryStore((state) => state.saveInvoice);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      if (isMod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      if (isMod && e.key === 'y') {
        e.preventDefault();
        redo();
      }

      if (isMod && e.key === 's') {
        e.preventDefault();
        saveInvoice(invoice);
      }

      if (isMod && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, invoice, saveInvoice]);
}
