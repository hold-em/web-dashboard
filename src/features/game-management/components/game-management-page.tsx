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

export type PageState = 'list' | 'create' | 'read' | 'update' | 'structure';

export default function GameManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('list');
  const queryClient = useQueryClient();
  const {
    games,
    isLoading: isLoadingGames,
    selectedGame,
    createGame,
    updateGame: updateGameMutation
  } = useGames();

  const { templates: structures, isLoading: isLoadingTemplates } =
    useGameTemplates();

  const { stores, isLoading: isLoadingStores } = useStores();
  const { gameTypes, isLoading: isLoadingGameTypes } = useGameTypes();

  const selectGame = async (game: GameRestResponse, newPage: PageState) => {
    await queryClient.invalidateQueries({ queryKey: ['game', game.id] });
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

  const handleAddGame = (gameData: GameRestResponse) => {
    const createGameData: CreateGameRestRequest = {
      game_type_id: Number(gameData.game_type_id),
      mode: gameData.mode,
      buy_in_amount: gameData.buy_in_amount,
      reg_close_level: gameData.reg_close_level || 0,
      max_players: gameData.max_players,
      early_chips: gameData.early_chips,
      starting_chips: gameData.starting_chips,
      reentry_chips: gameData.reentry_chips || 0,
      break_time: gameData.break_time,
      structure_template_id: String(gameData.structure_template_id),
      structures: gameData.structures,
      scheduled_at: gameData.scheduled_at,
      status: gameData.status,
      prize: gameData.prize
    };
    createGame(createGameData);
    goBack();
  };

  const handleUpdateGame = (game: GameRestResponse) => {
    const updateGameData: UpdateGameRestRequest = {
      game_type_id: Number(game.game_type_id),
      mode: game.mode,
      buy_in_amount: game.buy_in_amount,
      reg_close_level: game.reg_close_level || 0,
      max_players: game.max_players,
      early_chips: game.early_chips,
      starting_chips: game.starting_chips,
      reentry_chips: game.reentry_chips || 0,
      break_time: game.break_time,
      structure_template_id: String(game.structure_template_id),
      structures: game.structures,
      scheduled_at: game.scheduled_at,
      prize: game.prize
    };
    updateGameMutation({
      id: Number(game.id),
      data: updateGameData
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
          stores={stores || []}
          gameTypes={gameTypes?.data || []}
          addGame={handleAddGame}
          updateGame={handleUpdateGame}
          goBack={goBack}
        />
      )}
    </PageContainer>
  );
}
