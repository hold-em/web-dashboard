'use client';

import * as React from 'react';
import { GameRestResponse } from '@/lib/api/types.gen';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import GameListSection from './game-list-section';
import { Button } from '@/components/ui/button';
import { PageState } from './game-management-page';

interface GameManagementViewProps {
  games: GameRestResponse[];
  selectGame: (game: GameRestResponse, pageState: PageState) => void;
  goStructureManagement: () => void;
  goCreateForm: () => void;
}

export default function GameManagementView({
  games,
  selectGame,
  goStructureManagement,
  goCreateForm
}: GameManagementViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <Button variant='outline' onClick={goStructureManagement}>
            스트럭처 관리
          </Button>
          <Button variant='outline' onClick={goCreateForm}>
            게임 생성
          </Button>
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <GameListSection games={games} selectGame={selectGame} />
    </>
  );
}
