'use client';

import {
  GameRestResponse,
  GameStructureTemplateRestResponse,
  GameTypeRestResponse
} from '@/lib/api/types.gen';
import { SectionTopToolbar, BackButton } from '@/components/section';
import GameCreationInfoSection from './game-creation-info-section';
import { useGameTables } from '@/hooks/use-game-tables';

interface GameCreationViewProps {
  selectedGame: GameRestResponse | null;
  structures: GameStructureTemplateRestResponse[];
  gameTypes: GameTypeRestResponse[];
  addGame: (game: GameRestResponse) => void;
  updateGame: (game: GameRestResponse) => void;
  goBack: () => void;
}

export default function GameCreationView({
  selectedGame,
  structures,
  gameTypes,
  addGame,
  updateGame,
  goBack
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
      />
    </>
  );
}
