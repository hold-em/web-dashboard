'use client';

import { useState, useEffect } from 'react';
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
import { Game, Structure } from '@/mocks/games';
import { GameTable } from '@/mocks/tables';
import { v4 as uuid } from 'uuid';
import { Icons } from '@/components/icons';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Store } from '@/mocks/stores';

const gameTypeItems = ['게임타입1', '게임타입2', '게임타입3'] as const;
const gameModeItems = ['게임모드1', '게임모드2', '게임모드3'] as const;
const statusItems = ['예정', '진행 중', '종료'] as const;
const times = Array.from({ length: 24 }, (_, i) => {
  const hour = (18 + i) % 24;
  return `${String(hour).padStart(2, '0')}:00`;
});

interface GameCreationInfoSectionProps {
  initialData: Game | null;
  structures: Structure[];
  tables: GameTable[];
  stores: Store[];
  addGame: (game: Game) => void;
  updateGame: (game: Game) => void;
}

export default function GameCreationInfoSection({
  initialData,
  structures,
  tables,
  stores,
  addGame,
  updateGame
}: GameCreationInfoSectionProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const form = useForm<GameFormSchemaValues>({
    resolver: zodResolver(gameFormSchema),
    mode: 'onChange',
    defaultValues: initialData
      ? {
          game_type: initialData.game_type,
          game_mode: initialData.game_mode,
          name: initialData.name,
          store_id: initialData.store_id,
          start_date: new Date(initialData.start_at),
          start_time: format(new Date(initialData.start_at), 'HH:mm'),
          status: initialData.status,
          buy_in: initialData.buy_in,
          reg_close_level: initialData.reg_close_level,
          total_players: initialData.total_players,
          starting_chips: initialData.starting_chips,
          reentry_chips: initialData.reentry_chips,
          average_stack: initialData.average_stack,
          total_stack: initialData.total_stack,
          break_time: initialData.break_time,
          structure_id: initialData.structure_id,
          table_id: initialData.table_id
        }
      : {
          game_type: '',
          game_mode: '',
          name: '',
          store_id: '',
          start_date: new Date(),
          start_time: '',
          status: '',
          buy_in: undefined,
          reg_close_level: undefined,
          total_players: undefined,
          starting_chips: undefined,
          reentry_chips: undefined,
          average_stack: undefined,
          total_stack: undefined,
          break_time: undefined,
          structure_id: '',
          table_id: ''
        }
  });

  const onSubmit: SubmitHandler<GameFormSchemaValues> = ({
    start_date,
    start_time,
    status,
    ...data
  }) => {
    if (!start_date || !start_time) return;
    const startAt = new Date(start_date);
    const [hours, minutes] = start_time.split(':').map(Number);
    startAt.setHours(hours);
    startAt.setMinutes(minutes);
    startAt.setSeconds(0);
    startAt.setMilliseconds(0);
    const newGame: Game = {
      id: initialData ? initialData.id : uuid(),
      created_at: initialData
        ? initialData.created_at
        : new Date().toISOString(),
      start_at: startAt.toISOString(),
      status: status || '예정',
      ...data
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='name'>이름</FormLabel>
                  <FormControl>
                    <Input id='name' placeholder='게임명 입력' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>상태</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='상태 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {statusItems.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
              name='store_id'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>매장</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='매장 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
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
              name='start_date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>시작 기간</FormLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'PPP', { locale: ko })
                          ) : (
                            <span>시작 기간 선택</span>
                          )}
                          <Icons.calendar className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(date);
                          setCalendarOpen(false);
                        }}
                        locale={ko}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='start_time'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>시작 시간</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='시작 시간 선택' />
                      </SelectTrigger>
                      <SelectContent className='max-h-56 overflow-auto'>
                        {times.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
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
              name='game_type'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>게임 종류</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='게임 종류 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {gameTypeItems.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
              name='game_mode'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>게임 방식</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='게임 방식 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {gameModeItems.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {[
              { name: 'buy_in', label: '바이인', placeholder: '바이인 금액' },
              {
                name: 'reg_close_level',
                label: '레지 마감 레벨',
                placeholder: '레지 마감 레벨'
              },
              {
                name: 'total_players',
                label: '플레이어 총 수',
                placeholder: '플레이어 총 수'
              },
              {
                name: 'starting_chips',
                label: '스타팅 칩',
                placeholder: '스타팅 칩수'
              },
              {
                name: 'reentry_chips',
                label: '리엔트리 칩',
                placeholder: '리엔트리 칩'
              },
              {
                name: 'average_stack',
                label: '에버러지 스택',
                placeholder: '에버리지 스택'
              },
              {
                name: 'total_stack',
                label: '토탈 스택',
                placeholder: '토탈 스택'
              },
              {
                name: 'break_time',
                label: '브레이크 타임',
                placeholder: '브레이크 타임'
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
                        value={
                          field.value !== undefined ? String(field.value) : ''
                        }
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
              name='structure_id'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>스트럭처</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='스트럭처 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {structures.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
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
              name='table_id'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>테이블 정보</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='테이블 정보 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
