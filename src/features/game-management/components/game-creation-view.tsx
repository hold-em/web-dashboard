'use client';

import {
  CreateGameRestRequest,
  GameRestResponse,
  GameStructureTemplateRestResponse,
  GameTypeRestResponse,
  UpdateGameRestRequest
} from '@/lib/api/types.gen';
import { SectionTopToolbar, BackButton } from '@/components/section';
import GameCreationInfoSection from './game-creation-info-section';
import { useGameTables } from '@/hooks/use-game-tables';
import { PageState } from './game-management-page';

interface GameCreationViewProps {
  selectedGame: GameRestResponse | null;
  structures: GameStructureTemplateRestResponse[];
  gameTypes: GameTypeRestResponse[];
  addGame: (game: CreateGameRestRequest) => void;
  updateGame: (game: UpdateGameRestRequest) => void;
  goBack: () => void;
  pageState: PageState;
}

export default function GameCreationView({
  selectedGame,
  structures,
  gameTypes,
  addGame,
  updateGame,
  goBack,
  pageState
}: GameCreationViewProps) {
  const { tables, isLoading } = useGameTables(selectedGame?.id);

  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>게임 관리</BackButton>
      </SectionTopToolbar>
      <GameCreationInfoSection
        initialData={selectedGame}
        structures={structures}
        gameTypes={gameTypes}
        tables={tables?.data || []}
        addGame={addGame}
        updateGame={updateGame}
        isReadOnly={pageState === 'read'}
      />
    </>
  );
}
