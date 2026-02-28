'use client';

import { Palette } from 'lucide-react';
import { TEMPLATES } from '@/lib/constants';
import { TemplateCard } from './template-card';

export function TemplateGallery() {
  const freeTemplates = TEMPLATES.filter((t) => !t.isPremium);
  const premiumTemplates = TEMPLATES.filter((t) => t.isPremium);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
          <Palette className="h-7 w-7 text-accent" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Invoice Templates
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          Choose from our collection of professionally designed invoice templates.
          Start with a free template or unlock premium designs.
        </p>
      </div>

      {/* Free Templates */}
      <section className="mb-12">
        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
          Free Templates
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {freeTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      {/* Premium Templates */}
      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
          Premium Templates
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {premiumTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </div>
  );
}
