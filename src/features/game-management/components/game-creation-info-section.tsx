'use client';

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
import dayjs from 'dayjs';
import {
  GameTableRestResponse,
  GameStructureTemplateRestResponse,
  GameRestResponse,
  GameTypeRestResponse,
  CreateGameRestRequest,
  UpdateGameRestRequest
} from '@/lib/api';
import { useSelectedStore } from '@/hooks/use-selected-store';
import { useState, useEffect } from 'react';
import { GameItem } from '../types/game-structure';
import { StructurePreview } from './structure-list-section/structure-preview';

interface GameCreationInfoSectionProps {
  initialData: GameRestResponse | null;
  structures: GameStructureTemplateRestResponse[];
  tables: GameTableRestResponse[];
  gameTypes: GameTypeRestResponse[];
  addGame: (game: CreateGameRestRequest) => void;
  updateGame: (game: UpdateGameRestRequest) => void;
  isReadOnly?: boolean;
}

export default function GameCreationInfoSection({
  initialData,
  structures,
  tables,
  gameTypes,
  addGame,
  updateGame,
  isReadOnly = false
}: GameCreationInfoSectionProps) {
  const { selectedStore } = useSelectedStore();

  // 초기 구조 템플릿 설정
  const initialStructure = initialData
    ? structures.find((s) => s.id === initialData.structure_template_id) ||
      structures[0]
    : structures[0];

  const [selectedStructure, setSelectedStructure] = useState<{
    id: string;
    items: GameItem[];
  } | null>(
    initialStructure
      ? {
          id: initialStructure.id,
          items: JSON.parse(initialStructure.structures).items
        }
      : null
  );

  const form = useForm<GameFormSchemaValues>({
    resolver: zodResolver(gameFormSchema),
    mode: 'onChange',
    defaultValues: initialData
      ? {
          game_type_id: initialData.game_type_id,
          mode: initialData.mode,
          store_id: initialData.store_id,
          scheduled_at: new Date(initialData.scheduled_at),
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
          game_type_id: gameTypes.find((type) => type.name === '홀덤')?.id,
          mode: 'TOURNAMENT',
          store_id: selectedStore?.id,
          scheduled_at: new Date(),
          status: 'WAITING',
          buy_in_amount: 0,
          reg_close_level: 0,
          max_players: 0,
          early_chips: 0,
          starting_chips: 0,
          reentry_chips: 0,
          break_time: '0',
          structure_template_id: structures[0]?.id?.toString() || '',
          prize: ''
        }
  });

  // initialData가 변경될 때 폼 값을 업데이트
  useEffect(() => {
    if (initialData) {
      form.reset({
        game_type_id: initialData.game_type_id,
        mode: initialData.mode,
        store_id: initialData.store_id,
        scheduled_at: new Date(initialData.scheduled_at),
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
      });

      // 선택된 구조 템플릿 업데이트
      const selectedTemplate = structures.find(
        (s) => s.id === initialData.structure_template_id
      );
      if (selectedTemplate) {
        setSelectedStructure({
          id: selectedTemplate.id,
          items: JSON.parse(selectedTemplate.structures).items
        });
      }
    }
  }, [initialData, form, structures]);

  const onSubmit: SubmitHandler<GameFormSchemaValues> = async (data) => {
    try {
      if (!selectedStore?.id) {
        console.error('Store is not selected');
        return;
      }

      // 선택된 스트럭처 찾기
      const selectedStructureTemplate = structures.find(
        (s) => s.id === data.structure_template_id
      );

      if (!selectedStructureTemplate) {
        console.error('Structure template not found');
        return;
      }

      // 날짜 포맷팅 (밀리초와 Z 제거)
      const formattedDate = dayjs(data.scheduled_at).format(
        'YYYY-MM-DDTHH:mm:ss[Z]'
      );

      if (initialData) {
        // 수정 시에는 UpdateGameRestRequest 타입에 맞춤
        const updateRequest: UpdateGameRestRequest = {
          game_type_id: data.game_type_id,
          mode: data.mode,
          buy_in_amount: data.buy_in_amount,
          reg_close_level: data.reg_close_level || 0,
          max_players: data.max_players,
          early_chips: data.early_chips,
          starting_chips: data.starting_chips,
          reentry_chips: data.reentry_chips || 0,
          break_time: data.break_time,
          structure_template_id: data.structure_template_id,
          structures: selectedStructureTemplate.structures,
          scheduled_at: formattedDate,
          prize: data.prize
        };

        updateGame(updateRequest);
      } else {
        // 새로 생성 시에는 CreateGameRestRequest 타입에 맞춤
        const createRequest: CreateGameRestRequest = {
          game_type_id: data.game_type_id,
          mode: data.mode,
          buy_in_amount: data.buy_in_amount,
          reg_close_level: data.reg_close_level || 0,
          max_players: data.max_players,
          early_chips: data.early_chips,
          starting_chips: data.starting_chips,
          reentry_chips: data.reentry_chips || 0,
          break_time: data.break_time,
          structure_template_id: data.structure_template_id,
          structures: selectedStructureTemplate.structures,
          scheduled_at: formattedDate,
          status: 'WAITING', // 생성 시에는 항상 '대기중'으로 설정
          prize: data.prize
        };

        addGame(createRequest);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleStructureChange = (structureId: string) => {
    const structure = structures.find((s) => s.id === structureId);
    if (structure) {
      const structureData = JSON.parse(structure.structures);
      setSelectedStructure({
        id: structure.id,
        items: structureData.items
      });
    }
    return structureId;
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
                      disabled={isReadOnly}
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
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isReadOnly}
                    >
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
                <div className='text-lg font-bold'>{selectedStore?.name}</div>
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
                    <Popover>
                      <PopoverTrigger asChild disabled={isReadOnly}>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !value && 'text-muted-foreground'
                            )}
                            disabled={isReadOnly}
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
                        <div className='flex flex-col gap-0'>
                          <Calendar
                            mode='single'
                            selected={value}
                            onSelect={(date) => {
                              if (date) {
                                const newDate = new Date(date);
                                newDate.setHours(value.getHours());
                                newDate.setMinutes(value.getMinutes());
                                field.onChange(newDate);
                              }
                            }}
                            locale={ko}
                            className='p-3'
                          />
                          <div className='flex gap-2 border-t p-3'>
                            <Select
                              value={format(value, 'HH')}
                              onValueChange={(hour) => {
                                const newDate = new Date(value);
                                newDate.setHours(parseInt(hour));
                                field.onChange(newDate);
                              }}
                              disabled={isReadOnly}
                            >
                              <SelectTrigger className='w-[100px]'>
                                <SelectValue placeholder='시' />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={String(i).padStart(2, '0')}
                                  >
                                    {String(i).padStart(2, '0')}시
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={format(value, 'mm')}
                              onValueChange={(minute) => {
                                const newDate = new Date(value);
                                newDate.setMinutes(parseInt(minute));
                                field.onChange(newDate);
                              }}
                              disabled={isReadOnly}
                            >
                              <SelectTrigger className='w-[100px]'>
                                <SelectValue placeholder='분' />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 15, 30, 45].map((minute) => (
                                  <SelectItem
                                    key={minute}
                                    value={String(minute).padStart(2, '0')}
                                  >
                                    {String(minute).padStart(2, '0')}분
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {initialData && (
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상태</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isReadOnly}
                      >
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
            )}
            {!initialData && (
              <FormItem>
                <FormLabel>상태</FormLabel>
                <FormControl>
                  <div className='text-lg font-medium'>대기중</div>
                </FormControl>
              </FormItem>
            )}
            <div className='grid grid-cols-2 gap-4'>
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
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className='grid grid-cols-2 gap-4'>
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
                        disabled={isReadOnly}
                      />
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
                    <FormLabel htmlFor='prize'>PRIZE</FormLabel>
                    <FormControl>
                      <Input
                        id='prize'
                        placeholder='PRIZE'
                        {...field}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='structure_template_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>스트럭처</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        handleStructureChange(val);
                        field.onChange(val);
                      }}
                      disabled={isReadOnly}
                    >
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
                  {selectedStructure && (
                    <div className='mt-4'>
                      <StructurePreview items={selectedStructure.items} />
                    </div>
                  )}
                </FormItem>
              )}
            />
            {!isReadOnly && (
              <Button type='submit'>
                게임 {initialData ? '수정' : '추가'}
              </Button>
            )}
          </form>
        </Form>
      </SectionContent>
    </Section>
  );
}
