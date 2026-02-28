'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, FileText, History, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[1400px] mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <FileText className="h-5 w-5 text-primary" />
            <span>InvoiceGen</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                New Invoice
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                History
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutTemplate className="h-4 w-4" />
                Templates
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
