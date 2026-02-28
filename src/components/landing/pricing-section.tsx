import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for occasional invoicing',
    cta: 'Start Free',
    ctaHref: '/invoice',
    popular: false,
    features: [
      'Unlimited invoices',
      '2 free templates',
      'PDF & PNG download',
      'Live preview',
      'Auto-save to browser',
      '150+ currencies',
      'Drag & drop line items',
      'Subtle watermark on PDF',
    ],
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For freelancers and small businesses',
    cta: 'Start 7-Day Trial',
    ctaHref: '/pricing',
    popular: true,
    features: [
      'Everything in Free',
      'All 10+ premium templates',
      'No watermark on PDFs',
      'Ad-free experience',
      'Cloud storage & sync',
      'Client management CRM',
      'Email invoices directly',
      'Payment tracking',
      'CSV/Excel export',
      'Priority support',
    ],
  },
  {
    name: 'Business',
    price: '$29',
    period: '/month',
    description: 'For teams and growing companies',
    cta: 'Contact Sales',
    ctaHref: '/pricing',
    popular: false,
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Recurring invoices',
      'Analytics dashboard',
      'Custom branding',
      'API access',
      'Multi-currency conversion',
      'Dedicated support',
    ],
  },
];

export function PricingSection() {
  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-card p-8 ${
                plan.popular
                  ? 'border-accent shadow-lg ring-1 ring-accent/20'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  Most Popular
                </Badge>
              )}

              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <Link href={plan.ctaHref} className="mt-6 block">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
