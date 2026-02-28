'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useInvoiceStore } from '@/stores/invoice-store';
import { CURRENCIES, getCurrency } from '@/lib/currencies';
import { cn } from '@/lib/utils';

export function CurrencySelector() {
  const [open, setOpen] = useState(false);
  const currency = useInvoiceStore((s) => s.invoice.currency);
  const updateField = useInvoiceStore((s) => s.updateField);
  const selected = getCurrency(currency);

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-foreground">Currency</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-sm"
          >
            {selected ? `${selected.symbol} ${selected.code} - ${selected.name}` : 'Select currency'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search currencies..." />
            <CommandList>
              <CommandEmpty>No currency found.</CommandEmpty>
              <CommandGroup>
                {CURRENCIES.map((c) => (
                  <CommandItem
                    key={c.code}
                    value={`${c.code} ${c.name}`}
                    onSelect={() => {
                      updateField('currency', c.code);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        currency === c.code ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="mr-2 font-mono text-xs">{c.symbol}</span>
                    <span className="text-sm">
                      {c.code} - {c.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
