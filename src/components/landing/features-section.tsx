import {
  FileText,
  Eye,
  Download,
  Palette,
  Globe,
  GripVertical,
  Undo2,
  Keyboard,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Eye,
    title: 'Live Split-Pane Preview',
    description: 'See your invoice update in real-time as you type. No page refreshes, no delays.',
  },
  {
    icon: Download,
    title: 'PDF & PNG Export',
    description: 'Download your invoice as a professional PDF or PNG image with one click.',
  },
  {
    icon: Palette,
    title: '10+ Beautiful Templates',
    description: 'Choose from modern, classic, minimal, and more professionally designed templates.',
  },
  {
    icon: Globe,
    title: '150+ Currencies',
    description: 'Support for every major world currency with proper formatting and symbols.',
  },
  {
    icon: GripVertical,
    title: 'Drag & Drop Line Items',
    description: 'Easily reorder your invoice items with intuitive drag-and-drop functionality.',
  },
  {
    icon: Undo2,
    title: 'Undo / Redo History',
    description: 'Made a mistake? Undo and redo changes instantly with full history tracking.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard Shortcuts',
    description: 'Power users rejoice. Save, print, undo, and redo all with keyboard shortcuts.',
  },
  {
    icon: FileText,
    title: 'Auto-Save',
    description: 'Your invoice is automatically saved as you work. Never lose your progress.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to invoice professionally
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Packed with features that make invoicing effortless. No learning curve required.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
