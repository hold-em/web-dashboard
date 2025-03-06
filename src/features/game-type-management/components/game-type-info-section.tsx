'use client';

import * as React from 'react';
import { GameTypeRestResponse } from '@/lib/api/types.gen';
import { PageState } from './game-type-management-page';
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
import { useGameTypes } from '@/hooks/use-game-types';
import { gameTypeSchema, type GameTypeFormValues } from '../utils/form-schema';
import { useRouter } from 'next/navigation';

interface GameTypeInfoSectionProps {
  selectedGameType: GameTypeRestResponse | null;
  pageState: PageState;
}

export default function GameTypeInfoSection({
  selectedGameType,
  pageState
}: GameTypeInfoSectionProps) {
  const { createGameType, updateGameType, isCreating, isUpdating } =
    useGameTypes();
  const router = useRouter();
  const formatDate = (date: unknown) => {
    if (!date || typeof date !== 'string') return '-';
    return new Date(date).toLocaleString();
  };

  const initialValues: GameTypeFormValues = selectedGameType
    ? {
        name: selectedGameType.name,
        position: selectedGameType.position
      }
    : {
        name: '',
        position: 0
      };

  const form = useForm<GameTypeFormValues>({
    resolver: zodResolver(gameTypeSchema),
    mode: 'onChange',
    defaultValues: initialValues
  });

  const onSubmit = React.useCallback(
    async (data: GameTypeFormValues) => {
      try {
        if (pageState === 'create') {
          await createGameType(data);
        } else if (pageState === 'update' && selectedGameType) {
          await updateGameType({
            id: selectedGameType.id,
            data
          });
        }
      } catch (error) {
        console.error('Failed to save game type:', error);
      } finally {
        router.back();
      }
    },
    [pageState, selectedGameType, createGameType, updateGameType, router]
  );

  const readOnly = pageState === 'read';
  const isLoading = isCreating || isUpdating;

  return (
    <Section>
      <SectionTitle>
        {pageState === 'create'
          ? '새 게임 타입 생성'
          : pageState === 'update'
            ? '게임 타입 정보 수정'
            : '게임 타입 정보'}
      </SectionTitle>
      <SectionContent>
        {readOnly && selectedGameType ? (
          <div className='space-y-4'>
            <div>
              <h3 className='font-medium'>게임 타입명</h3>
              <p>{selectedGameType.name}</p>
            </div>
            <div>
              <h3 className='font-medium'>위치</h3>
              <p>{selectedGameType.position}</p>
            </div>
            <div>
              <h3 className='font-medium'>생성일</h3>
              <p>{formatDate(selectedGameType.created_at)}</p>
            </div>
            <div>
              <h3 className='font-medium'>수정일</h3>
              <p>{formatDate(selectedGameType.updated_at)}</p>
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
                    <FormLabel>게임 타입명</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='게임 타입명을 입력하세요'
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
                name='position'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>위치</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        placeholder='위치를 입력하세요'
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
