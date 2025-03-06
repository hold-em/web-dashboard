'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import GameTypeListView from './game-type-list-view';
import GameTypeInfoView from './game-type-info-view';
import { usePageNavigation } from '@/hooks/user-page-navigation';
import { useGameTypes } from '@/hooks/use-game-types';
import { GameTypeRestResponse } from '@/lib/api/types.gen';

export type PageState = 'list' | 'create' | 'read' | 'update';

export default function GameTypeManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('list');

  const { gameTypes } = useGameTypes();

  const [selectedGameType, setSelectedGameType] =
    useState<GameTypeRestResponse | null>(null);

  const selectGameType = (
    gameType: GameTypeRestResponse,
    newPage: PageState
  ) => {
    setSelectedGameType(gameType);
    navigateTo(newPage);
  };

  const goBack = () => {
    setSelectedGameType(null);
    navigateTo('list');
  };

  const goCreateForm = () => {
    navigateTo('create');
  };

  return (
    <PageContainer>
      {page === 'list' && (
        <GameTypeListView
          gameTypes={gameTypes?.data ?? []}
          selectGameType={selectGameType}
          goCreateForm={goCreateForm}
        />
      )}
      {page !== 'list' && (
        <GameTypeInfoView
          selectedGameType={selectedGameType}
          goBack={goBack}
          pageState={page}
        />
      )}
    </PageContainer>
  );
}
