'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingsStore } from '@/stores/settings-store';
import { TEMPLATES } from '@/lib/constants';

export function AppearanceTab() {
  const appearance = useSettingsStore((s) => s.settings.appearance);
  const updateAppearance = useSettingsStore((s) => s.updateAppearance);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const { setTheme } = useTheme();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleThemeChange = (value: string) => {
    updateAppearance({ theme: value as 'light' | 'dark' | 'system' });
    setTheme(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Appearance</h3>
      <p className="text-sm text-muted-foreground">
        Customize how InvoiceForge looks.
      </p>
      <div className="grid gap-4 max-w-md">
        <div>
          <Label className="text-xs">Theme</Label>
          <Select value={appearance.theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Preferred Template</Label>
          <Select
            value={appearance.preferredTemplate}
            onValueChange={(value) => updateAppearance({ preferredTemplate: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} {t.isPremium ? '(Pro)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Changes are saved automatically.</p>
    </div>
  );
}
