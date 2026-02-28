'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Invoice, LineItem, CompanyInfo, TaxConfig, DiscountConfig, ShippingConfig, TemplateId } from '@/types/invoice';
import { calculateLineItemAmount, calculateInvoiceTotals } from '@/lib/calculations';
import { saveCurrentInvoice, getCurrentInvoice } from '@/lib/storage';

function createEmptyLineItem(): LineItem {
  return {
    id: uuidv4(),
    description: '',
    quantity: 1,
    rate: 0,
    amount: 0,
  };
}

function createEmptyCompanyInfo(): CompanyInfo {
  return {
    name: '',
    email: '',
    address: '',
    phone: '',
    website: '',
    taxId: '',
  };
}

function createDefaultInvoice(): Invoice {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    invoiceNumber: '',
    status: 'draft',
    templateId: 'modern',
    currency: 'USD',
    logo: null,
    from: createEmptyCompanyInfo(),
    to: createEmptyCompanyInfo(),
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    poNumber: '',
    items: [createEmptyLineItem()],
    tax: { enabled: false, label: 'Tax', type: 'percentage', value: 0 },
    tax2: { enabled: false, label: 'Tax 2', type: 'percentage', value: 0 },
    discount: { enabled: false, type: 'percentage', value: 0 },
    shipping: { enabled: false, amount: 0 },
    notes: '',
    terms: '',
    subtotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    total: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function useInvoice() {
  const [invoice, setInvoice] = useState<Invoice>(createDefaultInvoice);
  const initialized = useRef(false);

  // Load saved invoice on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const saved = getCurrentInvoice();
    if (saved) {
      setInvoice(saved);
    }
  }, []);

  // Auto-save on changes (debounced)
  useEffect(() => {
    if (!initialized.current) return;
    const timer = setTimeout(() => {
      saveCurrentInvoice(invoice);
    }, 500);
    return () => clearTimeout(timer);
  }, [invoice]);

  const recalculate = useCallback((updated: Invoice): Invoice => {
    const items = updated.items.map(item => ({
      ...item,
      amount: calculateLineItemAmount(item.quantity, item.rate),
    }));
    const totals = calculateInvoiceTotals(items, updated.tax, updated.tax2, updated.discount, updated.shipping);
    return { ...updated, items, ...totals };
  }, []);

  const updateField = useCallback(<K extends keyof Invoice>(field: K, value: Invoice[K]) => {
    setInvoice(prev => recalculate({ ...prev, [field]: value }));
  }, [recalculate]);

  const updateFrom = useCallback((field: keyof CompanyInfo, value: string) => {
    setInvoice(prev => recalculate({
      ...prev,
      from: { ...prev.from, [field]: value },
    }));
  }, [recalculate]);

  const updateTo = useCallback((field: keyof CompanyInfo, value: string) => {
    setInvoice(prev => recalculate({
      ...prev,
      to: { ...prev.to, [field]: value },
    }));
  }, [recalculate]);

  const updateLineItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    setInvoice(prev => {
      const items = prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      return recalculate({ ...prev, items });
    });
  }, [recalculate]);

  const addLineItem = useCallback(() => {
    setInvoice(prev => recalculate({
      ...prev,
      items: [...prev.items, createEmptyLineItem()],
    }));
  }, [recalculate]);

  const removeLineItem = useCallback((id: string) => {
    setInvoice(prev => {
      if (prev.items.length <= 1) return prev;
      return recalculate({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
      });
    });
  }, [recalculate]);

  const updateTax = useCallback((taxField: 'tax' | 'tax2', field: keyof TaxConfig, value: TaxConfig[keyof TaxConfig]) => {
    setInvoice(prev => recalculate({
      ...prev,
      [taxField]: { ...prev[taxField], [field]: value },
    }));
  }, [recalculate]);

  const updateDiscount = useCallback((field: keyof DiscountConfig, value: DiscountConfig[keyof DiscountConfig]) => {
    setInvoice(prev => recalculate({
      ...prev,
      discount: { ...prev.discount, [field]: value },
    }));
  }, [recalculate]);

  const updateShipping = useCallback((field: keyof ShippingConfig, value: ShippingConfig[keyof ShippingConfig]) => {
    setInvoice(prev => recalculate({
      ...prev,
      shipping: { ...prev.shipping, [field]: value },
    }));
  }, [recalculate]);

  const setTemplate = useCallback((templateId: TemplateId) => {
    setInvoice(prev => ({ ...prev, templateId }));
  }, []);

  const setLogo = useCallback((logo: string | null) => {
    setInvoice(prev => ({ ...prev, logo }));
  }, []);

  const resetInvoice = useCallback(() => {
    setInvoice(recalculate(createDefaultInvoice()));
  }, [recalculate]);

  const loadInvoice = useCallback((loaded: Invoice) => {
    setInvoice(loaded);
  }, []);

  return {
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
    setTemplate,
    setLogo,
    resetInvoice,
    loadInvoice,
  };
}
