# CLAUDE.md - InvoiceForge

> **Last Updated**: 2026-02-28
> **Project**: InvoiceForge - Free Professional Invoice Generator
> **Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Zustand

## Project Overview

A modern, ad-supported invoice generator that competes with invoice-generator.com. Revenue model: Free tier (ads + watermark) / Pro ($9/mo) / Business ($29/mo).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Fonts | DM Sans (headings, `font-heading`) + Inter (body, `font-body`) |
| State | Zustand (7 stores, all localStorage-persisted) |
| PDF | @react-pdf/renderer |
| PNG Export | html2canvas |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Charts | recharts (lazy-loaded on /analytics) |
| Auth | @supabase/supabase-js (optional, graceful degradation) |
| Excel Export | xlsx (SheetJS) |

## Common Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint check
```

## Architecture

- **60/40 Split-pane Builder**: Form (left) + Live Preview (right) on desktop; stacked on mobile
- **10 Invoice Templates**: 2 free (modern, classic) + 8 premium (locked behind Pro)
- **InvoiceData uses nested Address objects**: `invoice.sender.name`, NOT `invoice.senderName`
- **Immutable state updates**: Always create new objects in Zustand, never mutate
- **Auto-save**: Debounced 1s writes to localStorage via `use-auto-save` hook
- **Undo/Redo**: Custom history stack in invoice-store (50 states max)
- **Client auto-detection**: Case-insensitive name matching on invoice save, auto-creates clients
- **Dynamic Template Config**: Per-invoice customizable labels, section visibility, section ordering
- **Soft auth**: Dashboard/builder work without login; auth optional for sync features
- **Backward compatibility**: `migrateInvoiceData()` normalizes old localStorage data to new schema

## Key Patterns

- All client components must have `'use client'` directive
- Use `font-heading` for headings (DM Sans), default `font-body` for text (Inter)
- Colors: Navy `#0F172A` (primary), Electric Blue `#3B82F6` (accent)
- CSS variables via HSL: `hsl(var(--accent))`, `hsl(var(--background))`, etc.
- localStorage keys namespaced with `invoice-generator:` prefix
- Preview templates use inline styles (for html2canvas compatibility)
- PDF templates use @react-pdf/renderer primitives (View, Text, not HTML)
- All preview + PDF templates accept optional `config?: TemplateConfig` prop for custom labels/visibility
- recharts components lazy-loaded with `next/dynamic({ ssr: false })` on /analytics only
- Supabase client returns null if env vars not set (app works fully without Supabase)

## Stores

| Store | Key | Purpose |
|-------|-----|---------|
| invoice-store | `invoice-generator:current` | Current invoice state, undo/redo, payment management |
| history-store | `invoice-generator:invoices` | Saved invoices, filters (status, client, date), view mode |
| ui-store | (in-memory) | UI state: active template, modals, premium status |
| client-store | `invoice-generator:clients` | Client CRM: CRUD, auto-detect from addresses |
| template-config-store | (in-memory, syncs to invoice) | Template labels, section visibility, section order |
| auth-store | (Supabase session) | Auth state, sign in/up/out, OAuth |
| settings-store | `invoice-generator:settings` | Company info, invoice defaults, appearance |

## File Structure

```
src/
├── app/              # Next.js pages
│   ├── analytics/    # Analytics dashboard with KPIs and charts
│   ├── clients/      # Client list + [id] detail page
│   ├── dashboard/    # Invoice management dashboard
│   ├── invoice/      # Invoice builder
│   ├── login/        # Login page
│   ├── signup/       # Signup page
│   ├── settings/     # User settings (company, defaults, appearance, profile)
│   ├── share/[id]/   # Shared invoice view
│   ├── templates/    # Template gallery
│   └── pricing/      # Pricing page
├── components/
│   ├── ui/           # shadcn/ui primitives
│   ├── layout/       # Header, Footer
│   ├── landing/      # Hero, Features, Pricing, Testimonials, CTA
│   ├── builder/      # InvoiceBuilder, InvoiceForm, form-sections/, toolbar
│   │   ├── form-sections/       # Sender, recipient, line items, client autocomplete, recurrence, payments
│   │   └── template-customizer/ # Label editor, section visibility toggles
│   ├── preview/      # LivePreview, 10 preview-templates/
│   ├── pdf/          # PdfDocument, PdfWatermark, 10 pdf templates/
│   ├── dashboard/    # Invoice list/table, cards, filters, export buttons
│   ├── clients/      # Client list, cards, detail, edit dialog
│   ├── analytics/    # KPIs, revenue/status/client charts, monthly comparison
│   ├── auth/         # AuthProvider, login/signup forms, OAuth, user menu
│   ├── settings/     # Settings page with tabs (company, defaults, appearance, profile)
│   ├── templates/    # Template gallery, cards
│   ├── ads/          # Ad placeholders (sidebar, banner, native)
│   ├── premium/      # Upgrade banner, modal, badge, pricing card
│   └── providers/    # ThemeProvider
├── stores/           # Zustand: invoice, history, ui, client, template-config, auth, settings
├── hooks/            # Auto-save, keyboard shortcuts, PDF gen, PNG export, share link, auth guard, recurring check
├── lib/              # Utils, calculations, currencies, storage, constants, validations, share, analytics, export, migrations, template-defaults, client-utils
│   └── supabase/     # Supabase client singleton
└── types/            # InvoiceData, Template, Currency, Client, Analytics, TemplateConfig, Auth, Settings, Recurring, Payment
```

## Rules

- Search existing code before creating new files
- Extend existing files rather than creating duplicates
- Keep files under 400 lines; extract if larger
- Use proper error handling at all boundaries
- No hardcoded secrets; use env vars for sensitive config
- Validate all user input with Zod schemas
- Commit after each completed feature/phase
