'use client';

import { useCallback, useState } from 'react';
import { InvoiceData } from '@/types/invoice';
import { setItem, getItem } from '@/lib/storage';
import { generateShareId } from '@/lib/share';

const SHARED_INVOICES_KEY = 'shared-invoices';

interface SharedInvoice {
  id: string;
  invoice: InvoiceData;
  createdAt: string;
}

export function useShareLink() {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const generateShareLink = useCallback((invoice: InvoiceData) => {
    setIsSharing(true);
    try {
      const shareId = generateShareId();
      const shared: SharedInvoice = {
        id: shareId,
        invoice,
        createdAt: new Date().toISOString(),
      };

      const existing = getItem<SharedInvoice[]>(SHARED_INVOICES_KEY, []);
      setItem(SHARED_INVOICES_KEY, [...existing, shared]);

      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);
      return url;
    } finally {
      setIsSharing(false);
    }
  }, []);

  const copyToClipboard = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { shareUrl, isSharing, generateShareLink, copyToClipboard };
}

export function getSharedInvoice(id: string): InvoiceData | null {
  const shared = getItem<SharedInvoice[]>(SHARED_INVOICES_KEY, []);
  const found = shared.find((s) => s.id === id);
  return found?.invoice || null;
}
