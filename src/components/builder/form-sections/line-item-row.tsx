'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useInvoiceStore } from '@/stores/invoice-store';
import { LineItem } from '@/types/invoice';
import { formatCurrency } from '@/lib/currencies';

interface LineItemRowProps {
  item: LineItem;
  currency: string;
  canDelete: boolean;
}

export function LineItemRow({ item, currency, canDelete }: LineItemRowProps) {
  const updateLineItem = useInvoiceStore((s) => s.updateLineItem);
  const removeLineItem = useInvoiceStore((s) => s.removeLineItem);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-start gap-2 rounded-lg border bg-card p-3 animate-fade-in"
    >
      <button
        className="mt-2.5 cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_80px_100px_100px]">
        <div>
          <Input
            placeholder="Item description"
            value={item.description}
            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
            className="text-sm"
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Qty"
            min={0}
            value={item.quantity || ''}
            onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
            className="text-sm"
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Rate"
            min={0}
            step={0.01}
            value={item.rate || ''}
            onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
            className="text-sm"
          />
        </div>
        <div className="flex items-center justify-end text-sm font-medium text-foreground">
          {formatCurrency(item.amount, currency)}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="mt-1 h-8 w-8 text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeLineItem(item.id)}
        disabled={!canDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
