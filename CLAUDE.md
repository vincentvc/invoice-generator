# CLAUDE.md - Invoice Generator

> **Last Updated**: 2026-02-28
> **Project**: Invoice Generator
> **Description**: Modern invoice generator web app with clean UI, hybrid storage, ad monetization
> **Stack**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, @react-pdf/renderer

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/
│   ├── ui/           # shadcn/ui base components
│   ├── layout/       # Header, Footer, Sidebar
│   ├── invoice/      # Invoice form & preview components
│   ├── templates/    # Template gallery components
│   ├── history/      # Invoice history components
│   └── ads/          # Ad placement components
├── hooks/            # Custom React hooks
├── lib/              # Utilities, calculations, storage
└── types/            # TypeScript type definitions
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Key Patterns

- **Immutable state**: Always create new objects, never mutate
- **Small files**: 200-400 lines max, extract when larger
- **Feature-based organization**: Components grouped by domain
- **Hybrid storage**: localStorage first, cloud sync optional
- **Responsive**: Mobile-first design approach
