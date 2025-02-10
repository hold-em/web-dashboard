'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { mockStores } from '@/mocks/stores';

export default function StoreSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder='매장 선택' />
      </SelectTrigger>
      <SelectContent>
        {mockStores.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
