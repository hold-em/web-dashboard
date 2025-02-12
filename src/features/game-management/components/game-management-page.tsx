'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Game, mockGames, Structure, mockStructures } from '@/mocks/games';
import GameManagementView from './game-management-view';
import { mockStores } from '@/mocks/stores';
import { mockTables } from '@/mocks/tables';
import StructureManagementView from './structure-management-view';
import GameCreationView from './game-creation-view';
import { usePageNavigation } from '@/hooks/user-page-navigation';

export type PageState = 'list' | 'create' | 'read' | 'update' | 'structure';

export default function GameManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('list');
  const [games, setGames] = useState<Game[]>(mockGames);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [structures, setStructures] = useState<Structure[]>(mockStructures);

  const selectGame = (game: Game, newPage: PageState) => {
    setSelectedGame(game);
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

  const addGame = (game: Game) => {
    setGames((prev) => [...prev, game]);
    goBack();
  };

  const updateGame = (game: Game) => {
    setGames((prev) =>
      prev.map((item) => (item.id === game.id ? { ...item, ...game } : item))
    );
    goBack();
  };

  const addStructure = (structure: Structure) => {
    setStructures((prev) => [...prev, structure]);
  };

  const updateStructure = (structure: Structure) => {
    setStructures((prev) =>
      prev.map((item) =>
        item.id === structure.id ? { ...item, ...structure } : item
      )
    );
  };

  return (
    <PageContainer>
      {page === 'list' && (
        <GameManagementView
          games={games}
          stores={mockStores}
          tables={mockTables}
          selectGame={selectGame}
          goStructureManagement={goStructureManagement}
          goCreateForm={goCreateForm}
        />
      )}
      {page === 'structure' && (
        <StructureManagementView
          structures={structures}
          goBack={goBack}
          addStructure={addStructure}
          updateStructure={updateStructure}
        />
      )}
      {(page === 'create' || page === 'read' || page === 'update') && (
        <GameCreationView
          selectedGame={selectedGame}
          structures={structures}
          tables={mockTables}
          stores={mockStores}
          addGame={addGame}
          updateGame={updateGame}
          goBack={goBack}
        />
      )}
    </PageContainer>
  );
}
