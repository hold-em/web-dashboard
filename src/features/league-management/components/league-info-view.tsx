'use client';

import * as React from 'react';
import { LeagueRestResponse } from '@/lib/api';
import { PageState } from './league-management-page';
import {
  SectionTopToolbar,
  SectionTopButtonArea,
  SectionTitle
} from '@/components/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const formatDate = (date: unknown) => {
    if (!date || typeof date !== 'string') return '-';
    return new Date(date).toLocaleString();
  };

  return (
    <>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <Button variant='outline' onClick={goBack}>
            뒤로
          </Button>
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <Card>
        <CardHeader>
          <CardTitle>
            {pageState === 'create'
              ? '새 리그 생성'
              : pageState === 'update'
                ? '리그 정보 수정'
                : '리그 정보'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedLeague && (
            <div className='space-y-4'>
              <div>
                <h3 className='font-medium'>리그명</h3>
                <p>{selectedLeague.name}</p>
              </div>
              <div>
                <h3 className='font-medium'>상금 포인트 가중치</h3>
                <p>{selectedLeague.prize_point_weight}</p>
              </div>
              <div>
                <h3 className='font-medium'>결제 금액 포인트 가중치</h3>
                <p>{selectedLeague.payed_amount_point_weight}</p>
              </div>
              <div>
                <h3 className='font-medium'>바우처 결제 금액 포인트 가중치</h3>
                <p>{selectedLeague.voucher_payed_amount_point_weight}</p>
              </div>
              <div>
                <h3 className='font-medium'>방문 횟수 포인트 가중치</h3>
                <p>{selectedLeague.visit_count_point_weight}</p>
              </div>
              <div>
                <h3 className='font-medium'>생성일</h3>
                <p>{formatDate(selectedLeague.created_at)}</p>
              </div>
              <div>
                <h3 className='font-medium'>수정일</h3>
                <p>{formatDate(selectedLeague.updated_at)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
