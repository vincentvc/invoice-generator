'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvoiceStore } from '@/stores/invoice-store';

export function SenderInfo() {
  const sender = useInvoiceStore((s) => s.invoice.sender);
  const update = useInvoiceStore((s) => s.updateSender);

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-sm font-semibold text-foreground">From</h3>
      <div className="grid gap-3">
        <div>
          <Label htmlFor="sender-name" className="text-xs">Business Name</Label>
          <Input
            id="sender-name"
            placeholder="Your Business Name"
            value={sender.name}
            onChange={(e) => update('name', e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="sender-email" className="text-xs">Email</Label>
            <Input
              id="sender-email"
              type="email"
              placeholder="email@company.com"
              value={sender.email}
              onChange={(e) => update('email', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="sender-phone" className="text-xs">Phone</Label>
            <Input
              id="sender-phone"
              placeholder="+1 (555) 000-0000"
              value={sender.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="sender-address" className="text-xs">Address</Label>
          <Textarea
            id="sender-address"
            placeholder="Street address, City, State, ZIP"
            value={sender.address}
            onChange={(e) => update('address', e.target.value)}
            rows={2}
            className="mt-1 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
