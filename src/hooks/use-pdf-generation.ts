'use client';

import { useCallback, useState } from 'react';
import { pdf } from '@react-pdf/renderer';

export function usePdfGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = useCallback(
    async (document: React.ReactElement, fileName: string = 'invoice.pdf') => {
      setIsGenerating(true);
      try {
        const blob = await pdf(document).toBlob();
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = fileName;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('PDF generation failed:', error);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return { generatePdf, isGenerating };
}
