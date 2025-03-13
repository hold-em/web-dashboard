interface StatItemProps {
  label: string;
  value: string | number;
  isFirst?: boolean;
}

export default function StatItem({ label, value, isFirst }: StatItemProps) {
  return (
    <div className='relative flex w-[405px] flex-1 flex-col items-center justify-center'>
      {!isFirst && (
        <div className='absolute left-0 top-0 h-[1px] w-full bg-white/10'></div>
      )}
      <div className='text-[36px] font-medium leading-[120%] tracking-[-0.025em] text-[#61d181]'>
        {label}
      </div>
      <div className='mt-[8px] text-[54px] font-semibold leading-[120%] tracking-[-0.025em] text-white'>
        {value}
      </div>
    </div>
  );
}
