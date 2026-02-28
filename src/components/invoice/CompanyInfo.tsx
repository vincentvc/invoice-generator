'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CompanyInfo as CompanyInfoType } from '@/types/invoice';

interface CompanyInfoProps {
  title: string;
  data: CompanyInfoType;
  onChange: (field: keyof CompanyInfoType, value: string) => void;
}

export function CompanyInfo({ title, data, onChange }: CompanyInfoProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-2">
        <div>
          <Label htmlFor={`${title}-name`} className="text-xs">
            Business Name
          </Label>
          <Input
            id={`${title}-name`}
            placeholder="Your business name"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="h-9"
          />
        </div>
        <div>
          <Label htmlFor={`${title}-email`} className="text-xs">
            Email
          </Label>
          <Input
            id={`${title}-email`}
            type="email"
            placeholder="email@example.com"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="h-9"
          />
        </div>
        <div>
          <Label htmlFor={`${title}-address`} className="text-xs">
            Address
          </Label>
          <Input
            id={`${title}-address`}
            placeholder="Street address, city, state, zip"
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="h-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`${title}-phone`} className="text-xs">
              Phone
            </Label>
            <Input
              id={`${title}-phone`}
              placeholder="Phone number"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label htmlFor={`${title}-taxId`} className="text-xs">
              Tax ID
            </Label>
            <Input
              id={`${title}-taxId`}
              placeholder="Tax ID / VAT"
              value={data.taxId}
              onChange={(e) => onChange('taxId', e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
