'use client';

import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/stores/settings-store';

export function CompanyTab() {
  const company = useSettingsStore((s) => s.settings.company);
  const updateCompany = useSettingsStore((s) => s.updateCompany);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (field: string, value: string) => {
    updateCompany({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Company Information</h3>
      <p className="text-sm text-muted-foreground">
        These will be used as defaults when creating new invoices.
      </p>
      <div className="grid gap-3 max-w-lg">
        <div>
          <Label className="text-xs">Company Name</Label>
          <Input value={company.name} onChange={(e) => handleChange('name', e.target.value)} className="mt-1" placeholder="Your Company" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Email</Label>
            <Input value={company.email} onChange={(e) => handleChange('email', e.target.value)} className="mt-1" placeholder="company@email.com" />
          </div>
          <div>
            <Label className="text-xs">Phone</Label>
            <Input value={company.phone} onChange={(e) => handleChange('phone', e.target.value)} className="mt-1" placeholder="+1 (555) 000-0000" />
          </div>
        </div>
        <div>
          <Label className="text-xs">Address</Label>
          <Input value={company.address} onChange={(e) => handleChange('address', e.target.value)} className="mt-1" placeholder="Street address" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">City</Label>
            <Input value={company.city} onChange={(e) => handleChange('city', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">State</Label>
            <Input value={company.state} onChange={(e) => handleChange('state', e.target.value)} className="mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">ZIP</Label>
            <Input value={company.zip} onChange={(e) => handleChange('zip', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Country</Label>
            <Input value={company.country} onChange={(e) => handleChange('country', e.target.value)} className="mt-1" />
          </div>
        </div>
        <div>
          <Label className="text-xs">Tax ID</Label>
          <Input value={company.taxId} onChange={(e) => handleChange('taxId', e.target.value)} className="mt-1" placeholder="Tax ID / VAT number" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Changes are saved automatically.</p>
    </div>
  );
}
