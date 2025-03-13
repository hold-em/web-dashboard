import { cn } from '@/lib/utils';
import Image from 'next/image';
import PrizeItem from '../common/PrizeItem';
import { PrizeValues } from '@/hooks/use-status-board';

interface PrizeListSectionProps {
  prizeValues: PrizeValues;
  onPrizeChange: (key: keyof PrizeValues, value: string) => void;
}

const SECTION_STYLE = 'overflow-hidden rounded-[24px] bg-[#236437]/50';

export default function PrizeListSection({
  prizeValues,
  onPrizeChange
}: PrizeListSectionProps) {
  return (
    <div className='w-[480px] flex-none space-y-[20px]'>
      <div className={cn('flex h-[672px] flex-col', SECTION_STYLE)}>
        <div className='flex h-[60px] flex-none items-center justify-center bg-white/10 text-[28px] font-semibold leading-[100%] tracking-[-0.025em] text-[#ffc700]'>
          PRIZE LIST
        </div>
        <div className='flex flex-auto flex-col items-center gap-[1px] py-[16px]'>
          <PrizeItem
            rank='1st'
            value={prizeValues.first}
            onChange={(v) => onPrizeChange('first', v)}
            isGold
          />
          <PrizeItem
            rank='2nd'
            value={prizeValues.second}
            onChange={(v) => onPrizeChange('second', v)}
            isGold
          />
          <PrizeItem
            rank='3rd'
            value={prizeValues.third}
            onChange={(v) => onPrizeChange('third', v)}
            isGold
          />
          <PrizeItem
            rank='4th'
            value={prizeValues.fourth}
            onChange={(v) => onPrizeChange('fourth', v)}
          />
          <PrizeItem
            rank='5th'
            value={prizeValues.fifth}
            onChange={(v) => onPrizeChange('fifth', v)}
          />
          <PrizeItem
            rank='6th'
            value={prizeValues.sixth}
            onChange={(v) => onPrizeChange('sixth', v)}
          />
        </div>
      </div>
      <div className={cn('flex h-[193px] flex-col', SECTION_STYLE)}>
        <div className='flex h-[60px] flex-none items-center justify-center bg-white/10 text-[28px] font-semibold leading-[100%] tracking-[-0.025em] text-[#ffc700]'>
          GTD
        </div>
        <div className='flex flex-auto flex-col items-center justify-center gap-[2px] py-[16px]'>
          <div className='text-[28px] font-semibold leading-[120%] tracking-[-0.025em] text-white'>
            <input
              type='text'
              value={prizeValues.gtd}
              onChange={(e) => onPrizeChange('gtd', e.target.value)}
              className='w-full rounded bg-transparent px-2 text-center text-inherit hover:ring-1 hover:ring-white/30 focus:outline-none focus:ring-1 focus:ring-white/30'
            />
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center gap-[16px]'>
        <Image src='/images/app-qrcode.svg' alt='' width={96} height={95} />
        <div className='text-[28px] font-medium leading-[140%] tracking-[-0.025em] text-white'>
          야자수 홀덤펍 앱 다운로드
        </div>
      </div>
    </div>
  );
}
