'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import LeagueListView from './league-list-view';
import LeagueInfoView from './league-info-view';
import { usePageNavigation } from '@/hooks/user-page-navigation';
import { useLeagues } from '@/hooks/use-leagues';
import { LeagueRestResponse } from '@/lib/api';

export type PageState = 'list' | 'create' | 'read' | 'update';

export default function LeagueManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('list');

  const { leagues } = useLeagues();

  const [selectedLeague, setSelectedLeague] =
    useState<LeagueRestResponse | null>(null);

  const selectLeague = (league: LeagueRestResponse, newPage: PageState) => {
    setSelectedLeague(league);
    navigateTo(newPage);
  };

  const goBack = () => {
    setSelectedLeague(null);
    navigateTo('list');
  };

  const goCreateForm = () => {
    navigateTo('create');
  };

  return (
    <PageContainer>
      {page === 'list' && (
        <LeagueListView
          leagues={leagues?.data ?? []}
          selectLeague={selectLeague}
          goCreateForm={goCreateForm}
        />
      )}
      {page !== 'list' && (
        <LeagueInfoView
          selectedLeague={selectedLeague}
          goBack={goBack}
          pageState={page}
        />
      )}
    </PageContainer>
  );
}
