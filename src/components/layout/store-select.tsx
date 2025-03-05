'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useStores } from '@/hooks/use-stores';

export default function StoreSelect() {
  const { stores, isLoading } = useStores();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Select>
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
