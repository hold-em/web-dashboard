'use client';

import * as React from 'react';
import { LeagueRestResponse } from '@/lib/api';
import { PageState } from './league-management-page';
import { Section, SectionTitle, SectionContent } from '@/components/section';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLeagues } from '@/hooks/use-leagues';
import { leagueSchema, type LeagueFormValues } from '../utils/form-schema';

interface LeagueInfoSectionProps {
  selectedLeague: LeagueRestResponse | null;
  pageState: PageState;
}

export default function LeagueInfoSection({
  selectedLeague,
  pageState
}: LeagueInfoSectionProps) {
  const { createLeague, updateLeague, isCreating, isUpdating } = useLeagues();
  const formatDate = (date: unknown) => {
    if (!date || typeof date !== 'string') return '-';
    return new Date(date).toLocaleString();
  };

  const initialValues: LeagueFormValues = selectedLeague
    ? {
        name: selectedLeague.name,
        prize_point_weight: selectedLeague.prize_point_weight,
        payed_amount_point_weight: selectedLeague.payed_amount_point_weight,
        voucher_payed_amount_point_weight:
          selectedLeague.voucher_payed_amount_point_weight,
        visit_count_point_weight: selectedLeague.visit_count_point_weight
      }
    : {
        name: '',
        prize_point_weight: 0,
        payed_amount_point_weight: 0,
        voucher_payed_amount_point_weight: 0,
        visit_count_point_weight: 0
      };

  const form = useForm<LeagueFormValues>({
    resolver: zodResolver(leagueSchema),
    mode: 'onChange',
    defaultValues: initialValues
  });

  const onSubmit = React.useCallback(
    async (data: LeagueFormValues) => {
      try {
        if (pageState === 'create') {
          await createLeague(data);
        } else if (pageState === 'update' && selectedLeague) {
          await updateLeague({
            id: selectedLeague.id,
            data
          });
        }
      } catch (error) {
        console.error('Failed to save league:', error);
      }
    },
    [pageState, selectedLeague, createLeague, updateLeague]
  );

  const readOnly = pageState === 'read';
  const isLoading = isCreating || isUpdating;

  return (
    <Section>
      <SectionTitle>
        {pageState === 'create'
          ? '새 리그 생성'
          : pageState === 'update'
            ? '리그 정보 수정'
            : '리그 정보'}
      </SectionTitle>
      <SectionContent>
        {readOnly && selectedLeague ? (
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
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>리그명</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='리그명을 입력하세요'
                        disabled={readOnly}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='prize_point_weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상금 포인트 가중치</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        step={0.1}
                        placeholder='상금 포인트 가중치를 입력하세요'
                        disabled={readOnly}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='payed_amount_point_weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>결제 금액 포인트 가중치</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        step={0.1}
                        placeholder='결제 금액 포인트 가중치를 입력하세요'
                        disabled={readOnly}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='voucher_payed_amount_point_weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>바우처 결제 금액 포인트 가중치</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        step={0.1}
                        placeholder='바우처 결제 금액 포인트 가중치를 입력하세요'
                        disabled={readOnly}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='visit_count_point_weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>방문 횟수 포인트 가중치</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        step={0.1}
                        placeholder='방문 횟수 포인트 가중치를 입력하세요'
                        disabled={readOnly}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!readOnly && (
                <Button type='submit' disabled={isLoading}>
                  {isLoading
                    ? '저장 중...'
                    : pageState === 'create'
                      ? '추가'
                      : '수정'}
                </Button>
              )}
            </form>
          </Form>
        )}
      </SectionContent>
    </Section>
  );
}
