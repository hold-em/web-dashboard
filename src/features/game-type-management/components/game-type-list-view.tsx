'use client';

import * as React from 'react';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import GameTypeListSection from './game-type-list-section';
import { Button } from '@/components/ui/button';
import { PageState } from './game-type-management-page';
import { GameTypeRestResponse } from '@/lib/api/types.gen';

interface GameTypeListViewProps {
  gameTypes: GameTypeRestResponse[];
  selectGameType: (
    gameType: GameTypeRestResponse,
    pageState: PageState
  ) => void;
  goCreateForm: () => void;
}

export default function GameTypeListView({
  gameTypes,
  selectGameType,
  goCreateForm
}: GameTypeListViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <Button variant='outline' onClick={goCreateForm}>
            게임 타입 추가
          </Button>
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <GameTypeListSection
        gameTypes={gameTypes}
        selectGameType={selectGameType}
      />
    </>
  );
}
