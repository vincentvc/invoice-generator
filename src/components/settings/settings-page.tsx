'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProfileTab } from './profile-tab';
import { CompanyTab } from './company-tab';
import { DefaultsTab } from './defaults-tab';
import { AppearanceTab } from './appearance-tab';

const TABS = [
  { id: 'company', label: 'Company' },
  { id: 'defaults', label: 'Defaults' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'profile', label: 'Profile' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('company');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your account and invoice defaults
        </p>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <nav className="flex flex-row gap-1 sm:flex-col sm:w-48 shrink-0">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'secondary' : 'ghost'}
              className="justify-start"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </nav>

        <div className="flex-1 min-w-0">
          {activeTab === 'company' && <CompanyTab />}
          {activeTab === 'defaults' && <DefaultsTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}
