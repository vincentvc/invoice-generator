'use client';

import { FileSpreadsheet, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHistoryStore } from '@/stores/history-store';
import { exportToCSV, exportToExcel } from '@/lib/export';
import { toast } from '@/hooks/use-toast';

export function ExportButtons() {
  const invoices = useHistoryStore((s) => s.invoices);

  const handleCSV = () => {
    if (invoices.length === 0) {
      toast({ title: 'No invoices', description: 'Create invoices first to export' });
      return;
    }
    exportToCSV(invoices);
    toast({ title: 'CSV exported', description: `${invoices.length} invoices exported` });
  };

  const handleExcel = async () => {
    if (invoices.length === 0) {
      toast({ title: 'No invoices', description: 'Create invoices first to export' });
      return;
    }
    await exportToExcel(invoices);
    toast({ title: 'Excel exported', description: `${invoices.length} invoices exported` });
  };

  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="sm" className="gap-2" onClick={handleCSV}>
        <FileDown className="h-4 w-4" />
        <span className="hidden sm:inline">CSV</span>
      </Button>
      <Button variant="outline" size="sm" className="gap-2" onClick={handleExcel}>
        <FileSpreadsheet className="h-4 w-4" />
        <span className="hidden sm:inline">Excel</span>
      </Button>
    </div>
  );
}
