'use client';

import * as React from 'react';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import LeagueListSection from './league-list-section';
import { Button } from '@/components/ui/button';
import { PageState } from './league-management-page';
import { LeagueRestResponse } from '@/lib/api';

interface LeagueListViewProps {
  leagues: LeagueRestResponse[];
  selectLeague: (league: LeagueRestResponse, pageState: PageState) => void;
  goCreateForm: () => void;
}

export default function LeagueListView({
  leagues,
  selectLeague,
  goCreateForm
}: LeagueListViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <Button variant='outline' onClick={goCreateForm}>
            리그 추가
          </Button>
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <LeagueListSection leagues={leagues} selectLeague={selectLeague} />
    </>
  );
}
