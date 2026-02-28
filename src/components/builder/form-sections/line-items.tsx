'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvoiceStore } from '@/stores/invoice-store';
import { LineItemRow } from './line-item-row';

export function LineItems() {
  const items = useInvoiceStore((s) => s.invoice.items);
  const currency = useInvoiceStore((s) => s.invoice.currency);
  const addLineItem = useInvoiceStore((s) => s.addLineItem);
  const reorderLineItems = useInvoiceStore((s) => s.reorderLineItems);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    reorderLineItems(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">Line Items</h3>
      </div>

      <div className="hidden sm:grid grid-cols-[24px_1fr_80px_100px_100px_32px] gap-2 px-3 text-xs font-medium text-muted-foreground">
        <div />
        <div>Description</div>
        <div>Qty</div>
        <div>Rate</div>
        <div className="text-right">Amount</div>
        <div />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <LineItemRow
                key={item.id}
                item={item}
                currency={currency}
                canDelete={items.length > 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={addLineItem}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Line Item
      </Button>
    </div>
  );
}
