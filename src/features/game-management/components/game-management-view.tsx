'use client';

import * as React from 'react';
import { Game } from '@/mocks/games';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import GameListSection from './game-list-section';
import { Button } from '@/components/ui/button';
import { PageState } from './game-management-page';
import { Store } from '@/mocks/stores';
import TableStatusSection from './table-status-section';
import { GameTable } from '@/mocks/tables';

interface StoreListViewProps {
  games: Game[];
  stores: Store[];
  tables: GameTable[];
  selectGame: (game: Game, pageState: PageState) => void;
  goStructureManagement: () => void;
  goCreateForm: () => void;
}

export default function StoreListView({
  games,
  stores,
  tables,
  selectGame,
  goStructureManagement,
  goCreateForm
}: StoreListViewProps) {
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
      <GameListSection games={games} stores={stores} selectGame={selectGame} />
      <TableStatusSection tables={tables} />
    </>
  );
}
