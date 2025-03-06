'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useStores } from '@/hooks/use-stores';
import { useStoreStore } from '@/lib/zustand/store-store';
import { useEffect } from 'react';

export default function StoreSelect() {
  const { stores, isLoading } = useStores();
  const { selectedStore, setSelectedStore } = useStoreStore();

  // Set the first store as default if no store is selected
  useEffect(() => {
    if (!isLoading && stores && stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0]);
    }
  }, [isLoading, stores, selectedStore, setSelectedStore]);

  const handleStoreChange = (storeId: string) => {
    const store = stores?.find((store) => store.id.toString() === storeId);
    if (store) {
      setSelectedStore(store);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Select
      value={selectedStore?.id.toString()}
      onValueChange={handleStoreChange}
    >
      <SelectTrigger>
        <SelectValue placeholder='매장 선택' />
      </SelectTrigger>
      <SelectContent>
        {stores?.map((item) => (
          <SelectItem key={item.id} value={item.id.toString()}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
