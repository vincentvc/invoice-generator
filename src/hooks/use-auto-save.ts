'use client';

import { useEffect, useRef } from 'react';
import { useInvoiceStore } from '@/stores/invoice-store';
import { setItem } from '@/lib/storage';

const AUTOSAVE_KEY = 'current-invoice';
const DEBOUNCE_MS = 1000;

export function useAutoSave() {
  const invoice = useInvoiceStore((state) => state.invoice);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setItem(AUTOSAVE_KEY, invoice);
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [invoice]);
}

export function loadAutoSavedInvoice() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(`invoice-generator:${AUTOSAVE_KEY}`);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}
