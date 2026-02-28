'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Client } from '@/types/client';
import { useClientStore } from '@/stores/client-store';
import { toast } from '@/hooks/use-toast';

interface ClientEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
}

const EMPTY_FORM = {
  name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: '', notes: '',
};

export function ClientEditDialog({ open, onOpenChange, client }: ClientEditDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const addClient = useClientStore((s) => s.addClient);
  const updateClient = useClientStore((s) => s.updateClient);

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        state: client.state,
        zip: client.zip,
        country: client.country,
        notes: client.notes,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [client, open]);

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: 'Name required', description: 'Client name cannot be empty' });
      return;
    }

    if (client) {
      updateClient(client.id, form);
      toast({ title: 'Client updated', description: `${form.name} has been updated` });
    } else {
      addClient(form);
      toast({ title: 'Client created', description: `${form.name} has been added` });
    }
    onOpenChange(false);
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'New Client'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div>
            <Label className="text-xs">Name *</Label>
            <Input value={form.name} onChange={(e) => update('name', e.target.value)} className="mt-1" placeholder="Client name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Email</Label>
              <Input value={form.email} onChange={(e) => update('email', e.target.value)} className="mt-1" placeholder="email@example.com" />
            </div>
            <div>
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="mt-1" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Address</Label>
            <Input value={form.address} onChange={(e) => update('address', e.target.value)} className="mt-1" placeholder="Street address" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">City</Label>
              <Input value={form.city} onChange={(e) => update('city', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">State</Label>
              <Input value={form.state} onChange={(e) => update('state', e.target.value)} className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">ZIP</Label>
              <Input value={form.zip} onChange={(e) => update('zip', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Country</Label>
              <Input value={form.country} onChange={(e) => update('country', e.target.value)} className="mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} className="mt-1 resize-none" rows={2} placeholder="Internal notes..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{client ? 'Update' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
