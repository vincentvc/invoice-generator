'use client';

import { useCallback, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvoiceStore } from '@/stores/invoice-store';

export function LogoUpload() {
  const logo = useInvoiceStore((s) => s.invoice.logo);
  const setLogo = useInvoiceStore((s) => s.setLogo);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setLogo]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Company Logo</label>
      {logo ? (
        <div className="relative inline-block">
          <img
            src={logo}
            alt="Company logo"
            className="h-16 w-auto max-w-[200px] rounded border object-contain p-1"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6"
            onClick={() => setLogo(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/20 p-6 transition-colors hover:border-accent/50 hover:bg-muted/50"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Drop logo here or click to upload
            </p>
            <p className="text-xs text-muted-foreground/60">PNG, JPG, SVG up to 2MB</p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
