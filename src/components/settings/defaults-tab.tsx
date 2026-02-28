'use client';

import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingsStore } from '@/stores/settings-store';
import { PAYMENT_TERMS } from '@/lib/constants';
import { CURRENCIES } from '@/lib/currencies';

export function DefaultsTab() {
  const defaults = useSettingsStore((s) => s.settings.defaults);
  const updateDefaults = useSettingsStore((s) => s.updateDefaults);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Invoice Defaults</h3>
      <p className="text-sm text-muted-foreground">
        Set default values for new invoices.
      </p>
      <div className="grid gap-4 max-w-lg">
        <div>
          <Label className="text-xs">Default Currency</Label>
          <Select
            value={defaults.currency}
            onValueChange={(value) => updateDefaults({ currency: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.slice(0, 30).map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name} ({curr.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Default Payment Terms</Label>
          <Select
            value={defaults.paymentTerms}
            onValueChange={(value) => updateDefaults({ paymentTerms: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_TERMS.map((term) => (
                <SelectItem key={term.value} value={term.value}>
                  {term.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Default Notes</Label>
          <Textarea
            value={defaults.defaultNotes}
            onChange={(e) => updateDefaults({ defaultNotes: e.target.value })}
            className="mt-1 resize-none"
            rows={3}
            placeholder="Thank you for your business!"
          />
        </div>

        <div>
          <Label className="text-xs">Default Terms & Conditions</Label>
          <Textarea
            value={defaults.defaultTerms}
            onChange={(e) => updateDefaults({ defaultTerms: e.target.value })}
            className="mt-1 resize-none"
            rows={3}
            placeholder="Payment is due within specified terms..."
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Changes are saved automatically.</p>
    </div>
  );
}
