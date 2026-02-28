'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FileText, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { UserMenu } from '@/components/auth/user-menu';

const NAV_LINKS = [
  { href: '/invoice', label: 'Create Invoice' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/clients', label: 'Clients' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/templates', label: 'Templates' },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            InvoiceForge
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {status !== 'loading' && (
            <>
              {user ? (
                <UserMenu />
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/invoice">
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 pt-8">
                <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setMobileOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="font-heading text-xl font-bold">InvoiceForge</span>
                </Link>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
                {user && (
                  <Link href="/settings" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">Settings</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
