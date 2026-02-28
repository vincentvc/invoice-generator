'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInvoiceStore } from '@/stores/invoice-store';
import { RECURRENCE_FREQUENCIES } from '@/lib/constants';
import { RecurrenceConfig, RecurrenceFrequency } from '@/types/recurring';

export function RecurrenceSettings() {
  const recurrence = useInvoiceStore((s) => s.invoice.recurrence);
  const updateField = useInvoiceStore((s) => s.updateField);

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const config: RecurrenceConfig = {
        enabled: true,
        frequency: 'monthly',
        startDate: today,
        endDate: null,
        nextDueDate: nextMonth,
        lastGeneratedDate: null,
      };
      updateField('recurrence', config);
    } else {
      updateField('recurrence', null);
    }
  };

  const handleUpdate = (updates: Partial<RecurrenceConfig>) => {
    if (!recurrence) return;
    updateField('recurrence', { ...recurrence, ...updates });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch
          id="recurrence-toggle"
          checked={recurrence?.enabled ?? false}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="recurrence-toggle" className="text-xs cursor-pointer font-semibold">
          Recurring Invoice
        </Label>
      </div>

      {recurrence?.enabled && (
        <div className="rounded-lg border bg-muted/30 p-3 space-y-3 animate-fade-in">
          <div>
            <Label className="text-xs">Frequency</Label>
            <Select
              value={recurrence.frequency}
              onValueChange={(v) => handleUpdate({ frequency: v as RecurrenceFrequency })}
            >
              <SelectTrigger className="mt-1 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECURRENCE_FREQUENCIES.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Start Date</Label>
              <Input
                type="date"
                value={recurrence.startDate}
                onChange={(e) => handleUpdate({ startDate: e.target.value })}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">End Date (optional)</Label>
              <Input
                type="date"
                value={recurrence.endDate || ''}
                onChange={(e) => handleUpdate({ endDate: e.target.value || null })}
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
