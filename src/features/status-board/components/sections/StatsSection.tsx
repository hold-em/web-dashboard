import { cn } from '@/lib/utils';
import Image from 'next/image';
import StatItem from '../common/StatItem';

interface StatsSectionProps {
  stats: {
    regCloseTime: string;
    nextBreak: string;
    players: string;
    rebuyEarly: string;
    totalChips: string;
    avgStack: string;
  };
}

const SECTION_STYLE = 'overflow-hidden rounded-[24px] bg-[#236437]/50';

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div
      className={cn(
        'relative flex w-[480px] flex-none flex-col items-center gap-[1px] py-[32px]',
        SECTION_STYLE
      )}
    >
      <Image
        src='/images/status-board-bg.svg'
        alt=''
        width={445}
        height={286}
        className='absolute left-0 top-0'
      />
      <StatItem label='REG CLOSE TIME' value={stats.regCloseTime} isFirst />
      <StatItem label='NEXT BREAK' value={stats.nextBreak} />
      <StatItem label='PLAYERS' value={stats.players} />
      <StatItem label='RE-BUY / EARLY' value={stats.rebuyEarly} />
      <StatItem label='TOTAL CHIPS' value={stats.totalChips} />
      <StatItem label='AVG STACK' value={stats.avgStack} />
    </div>
  );
}
