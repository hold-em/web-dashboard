'use client';

import { useState } from 'react';
import { PayableItemRestResponse } from '@/lib/api/types.gen';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';

interface PaymentItemSelectProps {
  items: PayableItemRestResponse[];
  selectedItemId: string;
  onSelect: (itemId: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function PaymentItemSelect({
  items,
  selectedItemId,
  onSelect,
  label = '결제 항목 선택',
  disabled = false
}: PaymentItemSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedItem = items.find((item) => item.id === selectedItemId);

  return (
    <div className='grid gap-2'>
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
            disabled={disabled}
          >
            {selectedItem ? selectedItem.name : '결제 항목을 선택하세요'}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[300px] p-0'>
          <Command>
            <CommandInput placeholder='항목 검색' />
            <CommandList>
              <CommandEmpty>항목을 찾을 수 없습니다.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => {
                      onSelect(item.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedItemId === item.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
