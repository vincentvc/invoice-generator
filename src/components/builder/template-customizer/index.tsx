'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTemplateConfigStore } from '@/stores/template-config-store';
import { useUIStore } from '@/stores/ui-store';
import { LabelEditor } from './label-editor';
import { SectionVisibility } from './section-visibility';

export function TemplateCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const resetToPreset = useTemplateConfigStore((s) => s.resetToPreset);
  const activeTemplate = useUIStore((s) => s.activeTemplate);

  return (
    <div className="rounded-lg border bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
      >
        <span>Customize Template</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="border-t px-4 py-4 space-y-6">
          <SectionVisibility />
          <LabelEditor />
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => resetToPreset(activeTemplate)}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Defaults
          </Button>
        </div>
      )}
    </div>
  );
}
