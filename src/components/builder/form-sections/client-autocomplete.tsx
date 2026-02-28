'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClientStore } from '@/stores/client-store';
import { useInvoiceStore } from '@/stores/invoice-store';
import { addressFromClient } from '@/lib/client-utils';
import { Client } from '@/types/client';

export function ClientAutocomplete() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const recipient = useInvoiceStore((s) => s.invoice.recipient);
  const updateRecipient = useInvoiceStore((s) => s.updateRecipient);
  const updateField = useInvoiceStore((s) => s.updateField);
  const searchClients = useClientStore((s) => s.searchClients);
  const loadClients = useClientStore((s) => s.loadClients);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    setQuery(recipient.name);
  }, [recipient.name]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = query.length >= 1 ? searchClients(query) : [];

  const handleInputChange = (value: string) => {
    setQuery(value);
    updateRecipient('name', value);
    setIsOpen(value.length >= 1 && results.length > 0);
    setHighlightIndex(-1);
  };

  const handleSelectClient = (client: Client) => {
    const address = addressFromClient(client);
    updateRecipient('name', address.name);
    updateRecipient('email', address.email);
    updateRecipient('phone', address.phone);
    updateRecipient('address', address.address);
    updateRecipient('city', address.city);
    updateRecipient('state', address.state);
    updateRecipient('zip', address.zip);
    updateRecipient('country', address.country);
    updateField('clientId', client.id);
    setQuery(address.name);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelectClient(results[highlightIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Label htmlFor="recipient-name" className="text-xs">Client Name</Label>
      <Input
        id="recipient-name"
        placeholder="Search or type client name..."
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (query.length >= 1 && results.length > 0) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className="mt-1"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <ul className="max-h-48 overflow-auto py-1">
            {results.slice(0, 8).map((client, index) => (
              <li
                key={client.id}
                className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
                  index === highlightIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                }`}
                onMouseDown={() => handleSelectClient(client)}
                onMouseEnter={() => setHighlightIndex(index)}
              >
                <div className="font-medium">{client.name}</div>
                {client.email && (
                  <div className="text-xs text-muted-foreground">{client.email}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
