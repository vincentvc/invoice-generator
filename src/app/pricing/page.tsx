import { Metadata } from 'next';
import { PricingSection } from '@/components/landing/pricing-section';
import { Check, X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing - InvoiceForge',
  description: 'Simple, transparent pricing. Start free, upgrade when you need more.',
};

const COMPARISON = [
  { feature: 'Unlimited invoices', free: true, pro: true, business: true },
  { feature: 'Live split-pane preview', free: true, pro: true, business: true },
  { feature: 'PDF & PNG download', free: true, pro: true, business: true },
  { feature: 'Auto-save to browser', free: true, pro: true, business: true },
  { feature: '150+ currencies', free: true, pro: true, business: true },
  { feature: 'Drag & drop line items', free: true, pro: true, business: true },
  { feature: 'Keyboard shortcuts', free: true, pro: true, business: true },
  { feature: 'Share via link', free: true, pro: true, business: true },
  { feature: 'Templates', free: '2', pro: '10+', business: '10+' },
  { feature: 'Watermark-free PDFs', free: false, pro: true, business: true },
  { feature: 'Ad-free experience', free: false, pro: true, business: true },
  { feature: 'Cloud storage & sync', free: false, pro: true, business: true },
  { feature: 'Client management CRM', free: false, pro: true, business: true },
  { feature: 'Email invoices', free: false, pro: true, business: true },
  { feature: 'Payment tracking', free: false, pro: true, business: true },
  { feature: 'CSV/Excel export', free: false, pro: true, business: true },
  { feature: 'Recurring invoices', free: false, pro: false, business: true },
  { feature: 'Team members', free: '1', pro: '1', business: '5' },
  { feature: 'Analytics dashboard', free: false, pro: false, business: true },
  { feature: 'Custom branding', free: false, pro: false, business: true },
  { feature: 'API access', free: false, pro: false, business: true },
  { feature: 'Priority support', free: false, pro: true, business: true },
];

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-sm font-medium text-foreground">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto h-5 w-5 text-accent" />
  ) : (
    <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
  );
}

export default function PricingPage() {
  return (
    <>
      <PricingSection />

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-center text-foreground mb-12">
            Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-4 text-left text-sm font-semibold text-foreground">Feature</th>
                  <th className="py-4 text-center text-sm font-semibold text-foreground w-28">Free</th>
                  <th className="py-4 text-center text-sm font-semibold text-accent w-28">Pro</th>
                  <th className="py-4 text-center text-sm font-semibold text-foreground w-28">Business</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b last:border-0">
                    <td className="py-3 text-sm text-muted-foreground">{row.feature}</td>
                    <td className="py-3 text-center"><CellValue value={row.free} /></td>
                    <td className="py-3 text-center bg-accent/5"><CellValue value={row.pro} /></td>
                    <td className="py-3 text-center"><CellValue value={row.business} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
