'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useStatusBoard } from '@/hooks/use-status-board';
import FullscreenIcon from './icons/FullscreenIcon';
import StatsSection from './sections/StatsSection';
import GameInfoSection from './sections/GameInfoSection';
import PrizeListSection from './sections/PrizeListSection';
import Loading from '@/components/loading';

interface StatusBoardProps {
  gameId: string;
}

export default function StatusBoard({ gameId }: StatusBoardProps) {
  const { statusBoard, isLoading, prizeValues, handlePrizeChange } =
    useStatusBoard(gameId);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  }, []);

  if (isLoading || !statusBoard) {
    return <Loading />;
  }

  return (
    <div className='relative flex min-h-screen items-center justify-center bg-[#10281d] tracking-[-0.025em]'>
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className='absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20'
          aria-label='Toggle fullscreen'
        >
          <FullscreenIcon />
        </button>
      )}
      <div className='flex h-[1080px] w-[1920px] gap-5 p-10'>
        <StatsSection stats={statusBoard.stats} />
        <GameInfoSection
          storeName={statusBoard.storeName}
          gameName={statusBoard.gameName}
          currentLevel={statusBoard.currentLevel}
          remainingTime={statusBoard.remainingTime}
          blinds={statusBoard.blinds}
          nextLevel={statusBoard.nextLevel}
          isBeforeStart={statusBoard.isBeforeStart}
        />
        <PrizeListSection
          prizeValues={prizeValues}
          onPrizeChange={handlePrizeChange}
        />
      </div>
    </div>
  );
}
