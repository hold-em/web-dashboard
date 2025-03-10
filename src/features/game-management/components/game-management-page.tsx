'use client';

import PageContainer from '@/components/layout/page-container';
import GameManagementView from './game-management-view';
import StructureManagementView from './structure-management-view';
import GameCreationView from './game-creation-view';
import { usePageNavigation } from '@/hooks/user-page-navigation';
import { useGames } from '@/hooks/use-games';
import { useGameTemplates } from '@/hooks/use-game-templates';
import { useStores } from '@/hooks/use-stores';
import { useGameTypes } from '@/hooks/use-game-types';
import type {
  GameRestResponse,
  StoreRestResponse,
  CreateGameRestRequest,
  UpdateGameRestRequest
} from '@/lib/api/types.gen';
import { useQueryClient } from '@tanstack/react-query';
import { useSelectedStore } from '@/hooks/use-selected-store';
import { useState } from 'react';
import React from 'react';

export type PageState = 'list' | 'create' | 'read' | 'update' | 'structure';

export default function GameManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('list');
  const queryClient = useQueryClient();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const {
    games,
    isLoading: isLoadingGames,
    selectedGame,
    createGame,
    updateGame: updateGameMutation
  } = useGames(selectedGameId || undefined);
  const { selectedStore } = useSelectedStore();

  const { templates: structures, isLoading: isLoadingTemplates } =
    useGameTemplates();

  const { stores, isLoading: isLoadingStores } = useStores();
  const { gameTypes, isLoading: isLoadingGameTypes } = useGameTypes();

  const selectGame = (game: GameRestResponse, newPage: PageState) => {
    setSelectedGameId(game.id);
    navigateTo(newPage);
  };

  const goBack = () => {
    navigateTo('list');
  };

  const goStructureManagement = () => {
    navigateTo('structure');
  };

  const goCreateForm = () => {
    navigateTo('create');
  };

  const handleAddGame = (gameData: CreateGameRestRequest) => {
    createGame(gameData);
    goBack();
  };

  const handleUpdateGame = (gameData: UpdateGameRestRequest) => {
    if (!selectedGameId) {
      console.error('No game selected for update');
      return;
    }

    updateGameMutation({
      id: selectedGameId,
      data: gameData
    });
    goBack();
  };

  return (
    <PageContainer>
      {page === 'list' && (
        <GameManagementView
          games={games?.data || []}
          selectGame={selectGame}
          goStructureManagement={goStructureManagement}
          goCreateForm={goCreateForm}
        />
      )}
      {page === 'structure' && <StructureManagementView goBack={goBack} />}
      {(page === 'create' || page === 'read' || page === 'update') && (
        <GameCreationView
          selectedGame={selectedGame?.data || null}
          structures={structures?.data || []}
          gameTypes={gameTypes?.data || []}
          addGame={handleAddGame}
          updateGame={handleUpdateGame}
          goBack={goBack}
          pageState={page}
        />
      )}
    </PageContainer>
  );
}
