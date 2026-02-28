'use client';

import { Lock } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useInvoiceStore } from '@/stores/invoice-store';
import { TEMPLATES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { TemplateType } from '@/types/template';

export function TemplateSwitcher() {
  const activeTemplate = useUIStore((s) => s.activeTemplate);
  const setActiveTemplate = useUIStore((s) => s.setActiveTemplate);
  const isPremiumUser = useUIStore((s) => s.isPremiumUser);
  const setPremiumModalOpen = useUIStore((s) => s.setPremiumModalOpen);
  const updateField = useInvoiceStore((s) => s.updateField);

  function handleSelect(templateId: TemplateType, isPremium: boolean) {
    if (isPremium && !isPremiumUser) {
      setPremiumModalOpen(true);
      return;
    }
    setActiveTemplate(templateId);
    updateField('template', templateId);
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-foreground">Template</label>
      <div className="grid grid-cols-5 gap-2">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template.id, template.isPremium)}
            className={cn(
              'group relative flex flex-col items-center gap-1 rounded-lg border p-2 transition-all hover:border-accent/50',
              activeTemplate === template.id
                ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                : 'border-border'
            )}
          >
            <div
              className="h-8 w-full rounded"
              style={{ backgroundColor: template.colors.primary }}
            />
            <span className="text-[10px] text-muted-foreground truncate w-full text-center">
              {template.name}
            </span>
            {template.isPremium && !isPremiumUser && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[1px]">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
