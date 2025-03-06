'use client';

import { useSelectedStore } from '@/hooks/use-selected-store';
import { Badge } from '@/components/ui/badge';
import { Store } from 'lucide-react';

export function CurrentStoreDisplay() {
  const { selectedStore, hasSelectedStore } = useSelectedStore();

  if (!hasSelectedStore || !selectedStore) {
    return null;
  }

  return (
    <Badge variant='outline' className='flex items-center gap-1 px-3 py-1'>
      <Store className='h-3.5 w-3.5' />
      <span>{selectedStore!.name}</span>
    </Badge>
  );
}
