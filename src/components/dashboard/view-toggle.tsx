'use client';

import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHistoryStore } from '@/stores/history-store';

export function ViewToggle() {
  const viewMode = useHistoryStore((s) => s.viewMode);
  const setViewMode = useHistoryStore((s) => s.setViewMode);

  return (
    <div className="flex items-center rounded-md border">
      <Button
        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-9 w-9 rounded-r-none"
        onClick={() => setViewMode('grid')}
        title="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-9 w-9 rounded-l-none"
        onClick={() => setViewMode('list')}
        title="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
