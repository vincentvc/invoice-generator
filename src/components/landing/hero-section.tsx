'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-accent" />
            Free forever &mdash; no sign-up required
          </div>

          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Create Professional{' '}
            <span className="text-accent">Invoices</span>{' '}
            in Seconds
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            The fastest way to generate beautiful, professional invoices.
            Live preview, PDF download, 10+ templates &mdash; completely free.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/invoice">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base">
                Create Your Invoice
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg" className="px-8 text-base">
                Browse Templates
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              No sign-up needed
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-accent" />
              PDF & PNG export
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              150+ currencies
            </div>
          </div>
        </div>

        {/* Invoice mockup */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-xl border bg-card p-2 shadow-2xl ring-1 ring-border/50">
            <div className="rounded-lg bg-muted/50 p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-4 w-32 rounded bg-accent/20" />
                  <div className="mt-2 h-3 w-48 rounded bg-muted-foreground/10" />
                  <div className="mt-1 h-3 w-40 rounded bg-muted-foreground/10" />
                </div>
                <div className="text-right">
                  <div className="h-6 w-24 rounded bg-accent/30 ml-auto" />
                  <div className="mt-2 h-3 w-32 rounded bg-muted-foreground/10 ml-auto" />
                </div>
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex gap-4">
                  <div className="h-3 flex-1 rounded bg-muted-foreground/10" />
                  <div className="h-3 w-16 rounded bg-muted-foreground/10" />
                  <div className="h-3 w-16 rounded bg-muted-foreground/10" />
                  <div className="h-3 w-20 rounded bg-muted-foreground/10" />
                </div>
                <div className="flex gap-4">
                  <div className="h-3 flex-1 rounded bg-muted-foreground/8" />
                  <div className="h-3 w-16 rounded bg-muted-foreground/8" />
                  <div className="h-3 w-16 rounded bg-muted-foreground/8" />
                  <div className="h-3 w-20 rounded bg-muted-foreground/8" />
                </div>
                <div className="flex gap-4">
                  <div className="h-3 flex-1 rounded bg-muted-foreground/6" />
                  <div className="h-3 w-16 rounded bg-muted-foreground/6" />
                  <div className="h-3 w-16 rounded bg-muted-foreground/6" />
                  <div className="h-3 w-20 rounded bg-muted-foreground/6" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="space-y-2 text-right">
                  <div className="h-3 w-32 rounded bg-muted-foreground/10 ml-auto" />
                  <div className="h-4 w-36 rounded bg-accent/30 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
