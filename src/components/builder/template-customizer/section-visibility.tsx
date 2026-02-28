'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTemplateConfigStore } from '@/stores/template-config-store';
import { SectionId } from '@/types/template-config';

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'header', label: 'Header & Logo' },
  { id: 'addresses', label: 'Addresses (From/To)' },
  { id: 'meta', label: 'Dates & Details' },
  { id: 'lineItems', label: 'Line Items Table' },
  { id: 'totals', label: 'Totals Section' },
  { id: 'noteTerms', label: 'Notes & Terms' },
];

export function SectionVisibility() {
  const visibility = useTemplateConfigStore((s) => s.config.visibility);
  const toggleSectionVisibility = useTemplateConfigStore((s) => s.toggleSectionVisibility);

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Section Visibility
      </h4>
      {SECTIONS.map((section) => (
        <div key={section.id} className="flex items-center justify-between">
          <Label htmlFor={`vis-${section.id}`} className="text-xs cursor-pointer">
            {section.label}
          </Label>
          <Switch
            id={`vis-${section.id}`}
            checked={visibility[section.id]}
            onCheckedChange={() => toggleSectionVisibility(section.id)}
          />
        </div>
      ))}
    </div>
  );
}
