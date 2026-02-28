'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currencies';
import type { LineItem } from '@/types/invoice';

interface LineItemsProps {
  items: LineItem[];
  currency: string;
  onUpdate: (id: string, field: keyof LineItem, value: string | number) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function LineItems({ items, currency, onUpdate, onAdd, onRemove }: LineItemsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Items
      </h3>

      {/* Header */}
      <div className="hidden sm:grid grid-cols-[1fr,80px,100px,100px,36px] gap-2 text-xs font-medium text-muted-foreground px-1">
        <span>Description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Amount</span>
        <span></span>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group grid grid-cols-1 sm:grid-cols-[1fr,80px,100px,100px,36px] gap-2 items-start p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground/50 hidden sm:block cursor-grab" />
              <Input
                placeholder={`Item ${index + 1} description`}
                value={item.description}
                onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
                className="h-8 border-0 bg-transparent px-1 focus-visible:ring-1"
              />
            </div>
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="1"
              value={item.quantity || ''}
              onChange={(e) => onUpdate(item.id, 'quantity', parseFloat(e.target.value) || 0)}
              className="h-8 text-right border-0 bg-transparent px-1 focus-visible:ring-1"
            />
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={item.rate || ''}
              onChange={(e) => onUpdate(item.id, 'rate', parseFloat(e.target.value) || 0)}
              className="h-8 text-right border-0 bg-transparent px-1 focus-visible:ring-1"
            />
            <div className="h-8 flex items-center justify-end text-sm font-medium px-1">
              {formatCurrency(item.amount, currency)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
              onClick={() => onRemove(item.id)}
              disabled={items.length <= 1}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="w-full border-dashed gap-2"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Line Item
      </Button>
    </div>
  );
}
