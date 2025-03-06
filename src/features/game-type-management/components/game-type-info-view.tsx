'use client';

import * as React from 'react';
import { GameTypeRestResponse } from '@/lib/api/types.gen';
import { PageState } from './game-type-management-page';
import {
  SectionTopToolbar,
  SectionTopButtonArea,
  BackButton
} from '@/components/section';
import { Button } from '@/components/ui/button';
import GameTypeInfoSection from './game-type-info-section';

interface GameTypeInfoViewProps {
  selectedGameType: GameTypeRestResponse | null;
  goBack: () => void;
  pageState: PageState;
}

export default function GameTypeInfoView({
  selectedGameType,
  goBack,
  pageState
}: GameTypeInfoViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>게임 타입 목록</BackButton>
      </SectionTopToolbar>

      <GameTypeInfoSection
        selectedGameType={selectedGameType}
        pageState={pageState}
      />
    </>
  );
}
