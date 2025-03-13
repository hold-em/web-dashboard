import { cn } from '@/lib/utils';
import StarIcon from '../icons/StarIcon';

interface GameInfoSectionProps {
  storeName: string;
  gameName: string;
  currentLevel: number;
  remainingTime: string;
  blinds: {
    sb: number;
    bb: number;
    ante: number;
  };
  nextLevel: {
    regClose: number;
    name: string;
    blinds: string;
  };
  isBeforeStart?: boolean;
}

const SECTION_STYLE = 'overflow-hidden rounded-[24px] bg-[#236437]/50';

export default function GameInfoSection({
  storeName,
  gameName,
  currentLevel,
  remainingTime,
  blinds,
  nextLevel,
  isBeforeStart
}: GameInfoSectionProps) {
  return (
    <div
      className={cn(
        'flex-auto px-[40px] pb-[50px] pt-[40px] text-center',
        SECTION_STYLE
      )}
    >
      <div className='text-[32px] font-semibold leading-[140%] tracking-[-0.025em] text-white/70'>
        {storeName}
      </div>
      <div className='flex justify-center gap-[20px] text-[48px] font-semibold leading-[140%] tracking-[-0.025em] text-white'>
        <StarIcon />
        {gameName}
        <StarIcon />
      </div>
      <div className='mt-[16px] flex h-[84px] items-center justify-center rounded-full bg-white/10 text-[54px] font-bold leading-none tracking-[-0.025em] text-white'>
        {isBeforeStart
          ? 'BEFORE START'
          : currentLevel === 0
            ? 'BREAK TIME'
            : `LEVEL ${currentLevel}`}
      </div>
      <div className='mt-[16px] text-[260px] font-extrabold leading-none tracking-[-0.025em] text-[#ffc700]'>
        {remainingTime}
      </div>
      <div className='mt-[20px] space-y-[8px] px-[80px] py-[16px]'>
        <div className='flex items-center justify-between'>
          <div className='text-[54px] font-medium leading-[140%] tracking-[-0.025em] text-white/70'>
            BLINDS
          </div>
          <div className='text-[60px] font-semibold leading-[140%] tracking-[-0.025em] text-white'>
            {isBeforeStart || currentLevel === 0
              ? '--/--'
              : `${blinds.sb.toLocaleString()}/${blinds.bb.toLocaleString()}`}
          </div>
        </div>
        {!isBeforeStart && currentLevel !== 0 && blinds.ante > 0 && (
          <div className='flex items-center justify-between'>
            <div className='text-[54px] font-medium leading-[140%] tracking-[-0.025em] text-white/70'>
              ANTE
            </div>
            <div className='text-[60px] font-semibold leading-[140%] tracking-[-0.025em] text-white'>
              {blinds.ante.toLocaleString()}
            </div>
          </div>
        )}
      </div>
      <div className='mt-[18px] space-y-[16px] px-[80px] py-[12px]'>
        <div className='flex items-center justify-between'>
          <div className='text-[32px] font-medium leading-[100%] tracking-[-0.025em] text-white/70'>
            REG CLOSE
          </div>
          <div className='text-[40px] font-medium leading-[100%] tracking-[-0.025em] text-white'>
            {isBeforeStart ? '--' : `${nextLevel.regClose}LV`}
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='text-[32px] font-medium leading-[100%] tracking-[-0.025em] text-white/70'>
            NEXT LEVEL
          </div>
          <div className='text-[40px] font-medium leading-[100%] tracking-[-0.025em] text-white'>
            {isBeforeStart ? '--' : nextLevel.name}
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='text-[32px] font-medium leading-[100%] tracking-[-0.025em] text-white/70'>
            NEXT BLINDS
          </div>
          <div className='text-[40px] font-medium leading-[100%] tracking-[-0.025em] text-white'>
            {isBeforeStart ? '--' : nextLevel.blinds}
          </div>
        </div>
      </div>
    </div>
  );
}
