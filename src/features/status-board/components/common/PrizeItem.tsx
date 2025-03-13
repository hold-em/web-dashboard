import { cn } from '@/lib/utils';

interface PrizeItemProps {
  rank: string;
  value: string;
  onChange: (value: string) => void;
  isGold?: boolean;
}

export default function PrizeItem({
  rank,
  value,
  onChange,
  isGold
}: PrizeItemProps) {
  return (
    <div className='relative flex w-[425px] flex-1 flex-col items-center justify-center'>
      <div
        className={cn(
          'text-[20px] font-semibold leading-[120%] tracking-[-0.025em]',
          isGold ? 'text-[#ffc700]' : 'text-white'
        )}
      >
        {rank}
      </div>
      <div className='mt-[8px] text-[22px] font-medium leading-[120%] tracking-[-0.025em] text-white'>
        <input
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='w-full rounded bg-transparent px-2 text-center text-inherit hover:ring-1 hover:ring-white/30 focus:outline-none focus:ring-1 focus:ring-white/30'
        />
      </div>
    </div>
  );
}
