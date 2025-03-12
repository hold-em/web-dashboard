'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function StarIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='49'
      height='49'
      viewBox='0 0 49 49'
      fill='none'
    >
      <path
        d='M21.9676 35.028L23.5722 31.3697C25.0003 28.1144 27.5706 25.5229 30.7767 24.1064L35.1935 22.155C36.5976 21.5346 36.5976 19.5012 35.1935 18.8808L30.9146 16.9903C27.626 15.5373 25.0096 12.85 23.606 9.48351L21.9806 5.58503C21.3775 4.13832 19.3692 4.13833 18.766 5.58503L17.1406 9.48347C15.737 12.85 13.1206 15.5373 9.83198 16.9903L5.55318 18.8808C4.14894 19.5012 4.14894 21.5346 5.55318 22.155L9.96993 24.1064C13.1761 25.5229 15.7464 28.1144 17.1744 31.3697L18.779 35.028C19.3958 36.434 21.3508 36.434 21.9676 35.028ZM38.0332 43.9348L38.4845 42.9053C39.2889 41.0698 40.7379 39.6083 42.5457 38.8089L43.936 38.1939C44.688 37.8615 44.688 36.7737 43.936 36.4413L42.6236 35.8607C40.7691 35.0407 39.2942 33.5251 38.5035 31.6272L38.0402 30.5148C37.7171 29.7395 36.6402 29.7395 36.3171 30.5148L35.8538 31.6272C35.0633 33.5251 33.5884 35.0407 31.7339 35.8607L30.4213 36.4413C29.6695 36.7737 29.6695 37.8615 30.4213 38.1939L31.8116 38.8089C33.6196 39.6083 35.0684 41.0698 35.8729 42.9053L36.3243 43.9348C36.6545 44.6884 37.7028 44.6884 38.0332 43.9348Z'
        fill='#F5A623'
      />
    </svg>
  );
}

const SECTION_STYLE = 'overflow-hidden rounded-[24px] bg-[#236437]/50';

const left_section_items = [
  { title: 'REG CLOSE TIME', value: '00:46:32' },
  { title: 'NEXT BREAK', value: '03:40:32' },
  { title: 'PLAYERS', value: '18 / 20' },
  { title: 'RE-BUY / EARLY', value: '17 / 26' },
  { title: 'TOTAL CHIPS', value: '2,080,000' },
  { title: 'AVG STACK', value: '115,555' }
] as const;

const prize_list = [
  { title: '1st', prizes: ['APS INDEX POINT 100', '야자수 골드 100장'] },
  { title: '2nd', prizes: ['APS INDEX POINT 60', '야자수 골드 60장'] },
  { title: '3rd', prizes: ['APS INDEX POINT 50', '야자수 골드 50장'] },
  { title: '4th', prizes: ['APS INDEX POINT 40', '야자수 골드 40장'] },
  { title: '5th', prizes: ['APS INDEX POINT 30', '야자수 골드 30장'] },
  { title: '6th', prizes: ['1개 케이스'] }
] as const;

const gtd = ['APS INDEX POINT 300', '야자수 골드 300장'];

export default function StatusBoard() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-[#10281d] tracking-[-0.025em]'>
      <div className='flex h-[1080px] w-[1920px] gap-5 p-10'>
        <div
          className={cn(
            'relative flex w-[480px] flex-none flex-col items-center gap-[1px] py-[32px]',
            SECTION_STYLE
          )}
        >
          <Image
            src='images/status-board-bg.svg'
            alt=''
            width={445}
            height={286}
            className='absolute left-0 top-0'
          />
          {left_section_items.map((item, index) => (
            <div
              key={item.title}
              className='relative flex w-[405px] flex-1 flex-col items-center justify-center'
            >
              {index > 0 && (
                <div className='absolute left-0 top-0 h-[1px] w-full bg-white/10'></div>
              )}
              <div className='text-[36px] font-medium leading-[120%] tracking-[-0.025em] text-[#61d181]'>
                {item.title}
              </div>
              <div className='mt-[8px] text-[54px] font-semibold leading-[120%] tracking-[-0.025em] text-white'>
                {item.value}
              </div>
            </div>
          ))}
        </div>
        <div
          className={cn(
            'flex-auto px-[40px] pb-[50px] pt-[40px] text-center',
            SECTION_STYLE
          )}
        >
          <div className='text-[32px] font-semibold leading-[140%] tracking-[-0.025em] text-white/70'>
            야자수 홀덤펍 강남점
          </div>
          <div className='flex items-center gap-[20px] text-[48px] font-semibold leading-[140%] tracking-[-0.025em] text-white'>
            <StarIcon />
            APS INDEX POINT 새틀라이트
            <StarIcon />
          </div>
          <div className='mt-[16px] flex h-[84px] items-center justify-center rounded-full bg-white/10 text-[54px] font-bold leading-none tracking-[-0.025em] text-white'>
            LEVEL 07
          </div>
          <div className='mt-[16px] text-[260px] font-extrabold leading-none tracking-[-0.025em] text-[#ffc700]'>
            09:31
          </div>
          <div className='mt-[20px] space-y-[8px] px-[80px] py-[16px]'>
            <div className='flex items-center justify-between'>
              <div className='text-[54px] font-medium leading-[140%] tracking-[-0.025em] text-white/70'>
                BLINDS
              </div>
              <div className='text-[60px] font-semibold leading-[140%] tracking-[-0.025em] text-white'>
                1000/1000
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-[54px] font-medium leading-[140%] tracking-[-0.025em] text-white/70'>
                ANTE
              </div>
              <div className='text-[60px] font-semibold leading-[140%] tracking-[-0.025em] text-white'>
                1000
              </div>
            </div>
          </div>
          <div className='mt-[18px] space-y-[16px] px-[80px] py-[12px]'>
            <div className='flex items-center justify-between'>
              <div className='text-[32px] font-medium leading-[100%] tracking-[-0.025em] text-white/70'>
                REG CLOSE
              </div>
              <div className='text-[40px] font-medium leading-[100%] tracking-[-0.025em] text-white'>
                10LV
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-[32px] font-medium leading-[100%] tracking-[-0.025em] text-white/70'>
                NEXT LEVEL
              </div>
              <div className='text-[40px] font-medium leading-[100%] tracking-[-0.025em] text-white'>
                BREAK 02
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-[32px] font-medium leading-[100%] tracking-[-0.025em] text-white/70'>
                NEXT BLINDS
              </div>
              <div className='text-[40px] font-medium leading-[100%] tracking-[-0.025em] text-white'>
                1000/1500(1500)
              </div>
            </div>
          </div>
        </div>
        <div className='w-[480px] flex-none space-y-[20px]'>
          <div className={cn('flex h-[672px] flex-col', SECTION_STYLE)}>
            <div className='flex h-[60px] flex-none items-center justify-center bg-white/10 text-[28px] font-semibold leading-[100%] tracking-[-0.025em] text-[#ffc700]'>
              PRIZE LIST
            </div>
            <div className='flex flex-auto flex-col items-center gap-[1px] py-[16px]'>
              {prize_list.map((item, index) => (
                <div
                  key={item.title}
                  className='relative flex w-[425px] flex-1 flex-col items-center justify-center'
                >
                  {index > 0 && (
                    <div className='absolute left-0 top-0 h-[1px] w-full bg-white/10'></div>
                  )}
                  <div
                    className={cn(
                      'text-[20px] font-semibold leading-[120%] tracking-[-0.025em]',
                      index < 3 ? 'text-[#ffc700]' : 'text-white'
                    )}
                  >
                    {item.title}
                  </div>
                  <div className='mt-[8px] flex items-end justify-center gap-[4px]'>
                    {item.prizes.map((prize, index) => (
                      <React.Fragment key={prize}>
                        {index > 0 && (
                          <div className='text-[16px] font-medium leading-[120%] tracking-[-0.025em] text-white/70'>
                            or
                          </div>
                        )}
                        <div className='text-[22px] font-medium leading-[120%] tracking-[-0.025em] text-white'>
                          {prize}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={cn('flex h-[193px] flex-col', SECTION_STYLE)}>
            <div className='flex h-[60px] flex-none items-center justify-center bg-white/10 text-[28px] font-semibold leading-[100%] tracking-[-0.025em] text-[#ffc700]'>
              GTD
            </div>
            <div className='flex flex-auto flex-col items-center justify-center gap-[2px] py-[16px]'>
              {gtd.map((prize, index) => (
                <React.Fragment key={prize}>
                  {index > 0 && (
                    <div className='text-[24px] font-semibold leading-[120%] tracking-[-0.025em] text-white/50'>
                      or
                    </div>
                  )}
                  <div className='text-[28px] font-semibold leading-[120%] tracking-[-0.025em] text-white'>
                    {prize}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className='flex items-center justify-center gap-[16px]'>
            <Image src='images/app-qrcode.svg' alt='' width={96} height={95} />
            <div className='text-[28px] font-medium leading-[140%] tracking-[-0.025em] text-white'>
              야자수 홀덤펍 앱 다운로드
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
