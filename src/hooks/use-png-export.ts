'use client';

import { useCallback, useState } from 'react';

export function usePngExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportPng = useCallback(
    async (elementId: string, fileName: string = 'invoice.png') => {
      setIsExporting(true);
      try {
        const html2canvas = (await import('html2canvas')).default;
        const element = document.getElementById(elementId);
        if (!element) throw new Error('Preview element not found');

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });

        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('PNG export failed:', error);
        throw error;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportPng, isExporting };
}
