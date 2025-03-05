'use client';

import * as React from 'react';
import { LeagueRestResponse } from '@/lib/api';
import { PageState } from './league-management-page';
import {
  SectionTopToolbar,
  SectionTopButtonArea,
  BackButton
} from '@/components/section';
import { Button } from '@/components/ui/button';
import LeagueInfoSection from './league-info-section';

interface LeagueInfoViewProps {
  selectedLeague: LeagueRestResponse | null;
  goBack: () => void;
  pageState: PageState;
}

export default function LeagueInfoView({
  selectedLeague,
  goBack,
  pageState
}: LeagueInfoViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>리그 목록</BackButton>
      </SectionTopToolbar>

      <LeagueInfoSection
        selectedLeague={selectedLeague}
        pageState={pageState}
      />
    </>
  );
}
