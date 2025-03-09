import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { GameItem } from '../../types/game-structure';

interface GameItemProps {
  item: GameItem;
  onUpdate: (id: string, field: string, value: string | number) => void;
  onDelete: (id: string) => void;
  onAddGame: (afterId: string) => void;
  onAddBreak: (afterId: string) => void;
}

export function GameItemComponent({
  item,
  onUpdate,
  onDelete,
  onAddGame,
  onAddBreak
}: GameItemProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='grid flex-1 grid-cols-6 gap-2'>
        {/* 레벨 (수정 불가) */}
        <div className='flex flex-col'>
          <Label className='mb-1 text-xs'>레벨</Label>
          <div className='flex h-9 items-center rounded-md border border-input bg-gray-100 px-3 py-1 text-sm'>
            {item.level}
          </div>
        </div>

        {/* SB */}
        <div className='flex flex-col'>
          <Label className='mb-1 text-xs'>SB</Label>
          <Input
            type='number'
            value={item.sb || 0}
            onChange={(e) => onUpdate(item.id, 'sb', e.target.value)}
            placeholder='SB'
            className='text-sm'
          />
        </div>

        {/* BB */}
        <div className='flex flex-col'>
          <Label className='mb-1 text-xs'>BB</Label>
          <Input
            type='number'
            value={item.bb || 0}
            onChange={(e) => onUpdate(item.id, 'bb', e.target.value)}
            placeholder='BB'
            className='text-sm'
          />
        </div>

        {/* 엔티 */}
        <div className='flex flex-col'>
          <Label className='mb-1 text-xs'>엔티</Label>
          <Input
            type='number'
            value={item.entry || 0}
            onChange={(e) => onUpdate(item.id, 'entry', e.target.value)}
            placeholder='엔티'
            className='text-sm'
          />
        </div>

        {/* 듀레이션 */}
        <div className='flex flex-col'>
          <Label className='mb-1 text-xs'>듀레이션(분)</Label>
          <Input
            type='number'
            value={item.duration || 0}
            onChange={(e) => onUpdate(item.id, 'duration', e.target.value)}
            placeholder='분'
            className='text-sm'
          />
        </div>
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
