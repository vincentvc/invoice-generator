'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useInvoiceStore } from '@/stores/invoice-store';

export function RecipientInfo() {
  const recipient = useInvoiceStore((s) => s.invoice.recipient);
  const hasShipTo = useInvoiceStore((s) => s.invoice.hasShipTo);
  const shipTo = useInvoiceStore((s) => s.invoice.shipTo);
  const updateRecipient = useInvoiceStore((s) => s.updateRecipient);
  const updateShipTo = useInvoiceStore((s) => s.updateShipTo);
  const toggleShipTo = useInvoiceStore((s) => s.toggleShipTo);

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-sm font-semibold text-foreground">Bill To</h3>
      <div className="grid gap-3">
        <div>
          <Label htmlFor="recipient-name" className="text-xs">Client Name</Label>
          <Input
            id="recipient-name"
            placeholder="Client or Business Name"
            value={recipient.name}
            onChange={(e) => updateRecipient('name', e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="recipient-email" className="text-xs">Email</Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder="client@email.com"
              value={recipient.email}
              onChange={(e) => updateRecipient('email', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="recipient-phone" className="text-xs">Phone</Label>
            <Input
              id="recipient-phone"
              placeholder="+1 (555) 000-0000"
              value={recipient.phone}
              onChange={(e) => updateRecipient('phone', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="recipient-address" className="text-xs">Address</Label>
          <Textarea
            id="recipient-address"
            placeholder="Street address, City, State, ZIP"
            value={recipient.address}
            onChange={(e) => updateRecipient('address', e.target.value)}
            rows={2}
            className="mt-1 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Switch
          id="ship-to-toggle"
          checked={hasShipTo}
          onCheckedChange={toggleShipTo}
        />
        <Label htmlFor="ship-to-toggle" className="text-xs cursor-pointer">
          Add Ship To address
        </Label>
      </div>

      {hasShipTo && (
        <div className="space-y-3 rounded-lg border bg-muted/30 p-3 animate-fade-in">
          <h3 className="font-heading text-sm font-semibold text-foreground">Ship To</h3>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="ship-name" className="text-xs">Name</Label>
              <Input
                id="ship-name"
                placeholder="Recipient Name"
                value={shipTo?.name || ''}
                onChange={(e) => updateShipTo('name', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ship-address" className="text-xs">Address</Label>
              <Textarea
                id="ship-address"
                placeholder="Shipping address"
                value={shipTo?.address || ''}
                onChange={(e) => updateShipTo('address', e.target.value)}
                rows={2}
                className="mt-1 resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
