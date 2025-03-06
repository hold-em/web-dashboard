'use client';

import { useState } from 'react';
import { Section, SectionTitle, SectionContent } from '@/components/section';
import {
  Form,
  FormLabel,
  FormItem,
  FormField,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  gameFormSchema,
  type GameFormSchemaValues
} from '../utils/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { v4 as uuid } from 'uuid';
import { Icons } from '@/components/icons';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  GameTableRestResponse,
  StoreRestResponse,
  GameStructureTemplateRestResponse,
  GameRestResponse,
  GameTypeRestResponse
} from '@/lib/api';
import { DayPicker } from 'react-day-picker';

interface GameCreationInfoSectionProps {
  initialData: GameRestResponse | null;
  structures: GameStructureTemplateRestResponse[];
  tables: GameTableRestResponse[];
  stores: StoreRestResponse[];
  gameTypes: GameTypeRestResponse[];
  addGame: (game: GameRestResponse) => void;
  updateGame: (game: GameRestResponse) => void;
}

export default function GameCreationInfoSection({
  initialData,
  structures,
  tables,
  stores,
  gameTypes,
  addGame,
  updateGame
}: GameCreationInfoSectionProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const form = useForm<GameFormSchemaValues>({
    resolver: zodResolver(gameFormSchema),
    mode: 'onChange',
    defaultValues: initialData
      ? {
          game_type_id: initialData.game_type_id,
          mode: initialData.mode,
          store_id: initialData.store_id,
          scheduled_at: new Date(initialData.scheduled_at.value as string),
          status: initialData.status,
          buy_in_amount: initialData.buy_in_amount,
          reg_close_level: initialData.reg_close_level,
          max_players: initialData.max_players,
          early_chips: initialData.early_chips,
          starting_chips: initialData.starting_chips,
          reentry_chips: initialData.reentry_chips,
          break_time: initialData.break_time,
          structure_template_id: initialData.structure_template_id,
          prize: initialData.prize
        }
      : {
          game_type_id: undefined,
          mode: 'TOURNAMENT',
          store_id: undefined,
          scheduled_at: new Date(),
          status: 'WAITING',
          buy_in_amount: undefined,
          reg_close_level: undefined,
          max_players: undefined,
          early_chips: undefined,
          starting_chips: undefined,
          reentry_chips: undefined,
          break_time: '',
          structure_template_id: '',
          prize: ''
        }
  });

  const onSubmit: SubmitHandler<GameFormSchemaValues> = (data) => {
    const newGame: GameRestResponse = {
      id: initialData ? initialData.id : uuid(),
      created_by: initialData ? initialData.created_by : '',
      created_at: initialData
        ? initialData.created_at
        : { value: new Date().toISOString() },
      updated_at: { value: new Date().toISOString() },
      scheduled_at: { value: data.scheduled_at.toISOString() },
      status: data.status,
      game_type_id: data.game_type_id,
      store_id: data.store_id,
      mode: data.mode,
      buy_in_amount: data.buy_in_amount,
      reg_close_level: data.reg_close_level,
      max_players: data.max_players,
      early_chips: data.early_chips,
      starting_chips: data.starting_chips,
      reentry_chips: data.reentry_chips,
      break_time: data.break_time,
      structure_template_id: data.structure_template_id,
      structures: initialData ? initialData.structures : '',
      prize: data.prize
    };

    if (initialData) {
      updateGame(newGame);
    } else {
      addGame(newGame);
    }
  };

  return (
    <Section>
      <SectionTitle>게임 정보</SectionTitle>
      <SectionContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='game_type_id'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>게임 타입</FormLabel>
                  <FormControl>
                    <Select
                      value={value ? String(value) : ''}
                      onValueChange={(val) => onChange(Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='게임 타입 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {gameTypes.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='mode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>게임 모드</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='게임 모드 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='TOURNAMENT'>토너먼트</SelectItem>
                        <SelectItem value='CASH_GAME'>캐시게임</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>매장</FormLabel>
              <FormControl>
                <div className='text-sm text-muted-foreground'>
                  {stores.find((store) => store.id === initialData?.store_id)
                    ?.name || '현재 선택된 매장'}
                </div>
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name='scheduled_at'
              render={({ field }) => {
                const value = field.value as Date;
                return (
                  <FormItem>
                    <FormLabel>시작 시간</FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !value && 'text-muted-foreground'
                            )}
                          >
                            {value ? (
                              format(value, 'PPP HH:mm', { locale: ko })
                            ) : (
                              <span>시작 시간 선택</span>
                            )}
                            <Icons.calendar className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <DayPicker
                          mode='single'
                          selected={value}
                          onSelect={(date) => {
                            if (date) {
                              const newDate = new Date(date);
                              newDate.setHours(value.getHours());
                              newDate.setMinutes(value.getMinutes());
                              field.onChange(newDate);
                            }
                            setCalendarOpen(false);
                          }}
                          locale={ko}
                          className='p-3'
                        />
                        <div className='border-t p-3'>
                          <Select
                            value={format(value, 'HH:mm')}
                            onValueChange={(time) => {
                              const [hours, minutes] = time
                                .split(':')
                                .map(Number);
                              const newDate = new Date(value);
                              newDate.setHours(hours);
                              newDate.setMinutes(minutes);
                              field.onChange(newDate);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='시간 선택' />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = i;
                                const timeStr = `${String(hour).padStart(2, '0')}:00`;
                                return (
                                  <SelectItem key={hour} value={timeStr}>
                                    {timeStr}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상태</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='상태 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='WAITING'>대기중</SelectItem>
                        <SelectItem value='PLAYING'>진행중</SelectItem>
                        <SelectItem value='FINISHED'>종료</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {[
              {
                name: 'buy_in_amount',
                label: '바이인',
                placeholder: '바이인 금액'
              },
              {
                name: 'reg_close_level',
                label: '레지 마감 레벨',
                placeholder: '레지 마감 레벨'
              },
              {
                name: 'max_players',
                label: '최대 플레이어 수',
                placeholder: '최대 플레이어 수'
              },
              {
                name: 'early_chips',
                label: '얼리버드 칩',
                placeholder: '얼리버드 칩'
              },
              {
                name: 'starting_chips',
                label: '시작 칩',
                placeholder: '시작 칩'
              },
              {
                name: 'reentry_chips',
                label: '리엔트리 칩',
                placeholder: '리엔트리 칩'
              }
            ].map(({ name, label, placeholder }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof GameFormSchemaValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={name}>{label}</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        id={name}
                        placeholder={placeholder}
                        value={field.value ? String(field.value) : ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name='break_time'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='break_time'>브레이크 타임</FormLabel>
                  <FormControl>
                    <Input
                      id='break_time'
                      placeholder='브레이크 타임'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='structure_template_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>스트럭처</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='스트럭처 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {structures.map((structure) => {
                          const structureData = JSON.parse(
                            structure.structures
                          );
                          return (
                            <SelectItem
                              key={structure.id}
                              value={String(structure.id)}
                            >
                              {structureData.name || '이름 없음'}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='prize'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='prize'>상금</FormLabel>
                  <FormControl>
                    <Input id='prize' placeholder='상금' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>게임 {initialData ? '수정' : '추가'}</Button>
          </form>
        </Form>
      </SectionContent>
    </Section>
  );
}
