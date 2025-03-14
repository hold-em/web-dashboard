'use client';

import { useState } from 'react';
import { UserResponse } from '@/lib/api/types.gen';
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

interface CustomerSelectProps {
  users: UserResponse[];
  selectedUserId: string;
  onSelect: (userId: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function CustomerSelect({
  users,
  selectedUserId,
  onSelect,
  label = '고객 선택',
  disabled = false
}: CustomerSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedUser = users.find((user) => user.id === selectedUserId);

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
            {selectedUser ? selectedUser.name : '고객을 선택하세요'}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[300px] p-0'>
          <Command>
            <CommandInput placeholder='고객 검색' />
            <CommandList>
              <CommandEmpty>고객을 찾을 수 없습니다.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => {
                      onSelect(user.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedUserId === user.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {user.name}
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
