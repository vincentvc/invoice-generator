import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="bg-primary py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          Ready to create your first invoice?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/70">
          Join thousands of freelancers and businesses. No sign-up required &mdash; start invoicing in seconds.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/invoice">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base"
            >
              Create Free Invoice
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 text-base"
            >
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
