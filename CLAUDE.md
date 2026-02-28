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
| State | Zustand (invoice-store, ui-store, history-store) |
| PDF | @react-pdf/renderer |
| PNG Export | html2canvas |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |

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

## Key Patterns

- All client components must have `'use client'` directive
- Use `font-heading` for headings (DM Sans), default `font-body` for text (Inter)
- Colors: Navy `#0F172A` (primary), Electric Blue `#3B82F6` (accent)
- CSS variables via HSL: `hsl(var(--accent))`, `hsl(var(--background))`, etc.
- localStorage keys namespaced with `invoice-generator:` prefix
- Preview templates use inline styles (for html2canvas compatibility)
- PDF templates use @react-pdf/renderer primitives (View, Text, not HTML)

## File Structure

```
src/
├── app/           # Next.js pages (layout, page, invoice/, templates/, pricing/, dashboard/, share/)
├── components/
│   ├── ui/        # shadcn/ui primitives
│   ├── layout/    # Header, Footer
│   ├── landing/   # Hero, Features, Pricing, Testimonials, CTA
│   ├── builder/   # InvoiceBuilder, InvoiceForm, form-sections/, toolbar
│   ├── preview/   # LivePreview, 10 preview-templates/
│   ├── pdf/       # PdfDocument, PdfWatermark, 10 pdf templates/
│   ├── dashboard/  # Invoice list, cards, filters
│   ├── templates/  # Template gallery, cards
│   ├── ads/        # Ad placeholders (sidebar, banner, native)
│   ├── premium/    # Upgrade banner, modal, badge, pricing card
│   └── providers/  # ThemeProvider
├── stores/        # Zustand: invoice-store, ui-store, history-store
├── hooks/         # Auto-save, keyboard shortcuts, PDF gen, PNG export, share link
├── lib/           # Utils, calculations, currencies, storage, constants, validations, share
└── types/         # InvoiceData, Template, Currency interfaces
```

## Rules

- Search existing code before creating new files
- Extend existing files rather than creating duplicates
- Keep files under 400 lines; extract if larger
- Use proper error handling at all boundaries
- No hardcoded secrets; use env vars for sensitive config
- Validate all user input with Zod schemas
- Commit after each completed feature/phase
