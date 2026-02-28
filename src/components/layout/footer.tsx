import Link from 'next/link';
import { FileText } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { href: '/invoice', label: 'Invoice Generator' },
    { href: '/templates', label: 'Templates' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/dashboard', label: 'Dashboard' },
  ],
  Resources: [
    { href: '#', label: 'Invoice Guide' },
    { href: '#', label: 'Tax Calculator' },
    { href: '#', label: 'Payment Terms' },
    { href: '#', label: 'FAQ' },
  ],
  Company: [
    { href: '#', label: 'About' },
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
    { href: '#', label: 'Contact' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 no-print">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-heading text-lg font-bold">InvoiceForge</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Create professional invoices in seconds. Free, fast, and beautiful.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading text-sm font-semibold text-foreground">{category}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} InvoiceForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
