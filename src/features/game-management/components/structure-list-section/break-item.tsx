import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { GameItem } from '../../types/game-structure';

interface BreakItemProps {
  item: GameItem;
  onUpdate: (id: string, field: string, value: string | number) => void;
  onDelete: (id: string) => void;
  onAddGame: (afterId: string) => void;
  onAddBreak: (afterId: string) => void;
}

export function BreakItemComponent({
  item,
  onUpdate,
  onDelete,
  onAddGame,
  onAddBreak
}: BreakItemProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center gap-2'>
        <div className='flex-1 text-center'>휴식시간</div>
        <div className='w-32'>
          <Input
            type='number'
            value={item.breakDuration || 0}
            onChange={(e) => onUpdate(item.id, 'breakDuration', e.target.value)}
            placeholder='분'
            className='text-sm'
          />
        </div>
        <div className='text-sm'>분</div>
      </div>

      <Button
        variant='outline'
        size='sm'
        onClick={() => onAddGame(item.id)}
        className='ml-1'
      >
        게임 추가
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() => onAddBreak(item.id)}
        className='ml-1'
      >
        휴식 추가
      </Button>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => onDelete(item.id)}
        className='ml-2'
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
}
