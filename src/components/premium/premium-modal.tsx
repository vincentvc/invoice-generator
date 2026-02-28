'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUIStore } from '@/stores/ui-store';
import { PricingCard } from '@/components/premium/pricing-card';

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    description: 'For occasional invoicing',
    buttonText: 'Current Plan',
    highlighted: false,
    features: [
      'Modern & Classic templates',
      'PDF export with watermark',
      '5 saved invoices',
      'Basic currency support',
      'Live preview',
    ],
  },
  {
    name: 'Pro',
    price: '$9',
    description: 'For freelancers & small businesses',
    buttonText: 'Upgrade to Pro',
    highlighted: true,
    features: [
      'All 10 premium templates',
      'No watermark on PDFs',
      'Unlimited saved invoices',
      'Ad-free experience',
      'Priority support',
      'Email invoices directly',
    ],
  },
  {
    name: 'Business',
    price: '$29',
    description: 'For teams & growing companies',
    buttonText: 'Contact Sales',
    highlighted: false,
    features: [
      'Everything in Pro',
      'Custom branding',
      'API access',
      'Up to 5 team members',
      'Recurring invoices',
      'Dedicated support',
    ],
  },
] as const;

export function PremiumModal() {
  const isPremiumModalOpen = useUIStore((state) => state.isPremiumModalOpen);
  const setPremiumModalOpen = useUIStore((state) => state.setPremiumModalOpen);

  return (
    <Dialog open={isPremiumModalOpen} onOpenChange={setPremiumModalOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">
            Choose your plan
          </DialogTitle>
          <DialogDescription>
            Upgrade to unlock premium templates, remove watermarks, and access
            powerful features.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <PricingCard
              key={tier.name}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={[...tier.features]}
              highlighted={tier.highlighted}
              buttonText={tier.buttonText}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
