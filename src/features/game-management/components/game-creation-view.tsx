'use client';

import { Game, Structure } from '@/mocks/games';
import { SectionTopToolbar, BackButton } from '@/components/section';
import GameCreationInfoSection from './game-creation-info-section';
import { GameTable } from '@/mocks/tables';
import { Store } from '@/mocks/stores';

interface GameCreationViewProps {
  selectedGame: Game | null;
  structures: Structure[];
  tables: GameTable[];
  stores: Store[];
  addGame: (game: Game) => void;
  updateGame: (game: Game) => void;
  goBack: () => void;
}

export default function GameCreationView({
  selectedGame,
  structures,
  tables,
  stores,
  addGame,
  updateGame,
  goBack
}: GameCreationViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>게임 관리</BackButton>
      </SectionTopToolbar>
      <GameCreationInfoSection
        initialData={selectedGame}
        structures={structures}
        tables={tables}
        stores={stores}
        addGame={addGame}
        updateGame={updateGame}
      />
    </>
  );
}
