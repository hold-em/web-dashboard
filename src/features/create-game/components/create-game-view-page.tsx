'use client';

import PageContainer from '@/components/layout/page-container';
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

const gameTypeItems = ['포커', '블랙잭', '바카라'] as const;
const gameModeItems = ['토너먼트', '캐시게임'] as const;
const structureItems = ['구조 A', '구조 B', '구조 C'] as const;
const tableInfoItems = ['테이블 1', '테이블 2', '테이블 3'] as const;

export default function CreateGameViewPage() {
  const form = useForm<GameFormSchemaValues>({
    resolver: zodResolver(gameFormSchema),
    mode: 'onChange',
    defaultValues: {
      gameType: '',
      gameMode: '',
      buyIn: undefined,
      regCloseLevel: undefined,
      totalPlayers: undefined,
      startingChips: undefined,
      reentryChips: undefined,
      averageStack: undefined,
      totalStack: undefined,
      breakTime: undefined,
      structure: '',
      tableInfo: ''
    }
  });

  const onSubmit: SubmitHandler<GameFormSchemaValues> = (data) => {
    console.log(data);
  };

  return (
    <PageContainer>
      <div className='space-y-4'>
        <Section>
          <SectionTitle>게임 정보</SectionTitle>
          <SectionContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='gameType'
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
                  name='gameMode'
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
                  {
                    name: 'buyIn',
                    label: '바이인',
                    placeholder: '바이인 금액'
                  },
                  {
                    name: 'regCloseLevel',
                    label: '레지 마감 레벨',
                    placeholder: '레지 마감 레벨'
                  },
                  {
                    name: 'totalPlayers',
                    label: '플레이어 총 수',
                    placeholder: '플레이어 총 수'
                  },
                  {
                    name: 'startingChips',
                    label: '스타팅 칩',
                    placeholder: '스타팅 칩수'
                  },
                  {
                    name: 'reentryChips',
                    label: '리엔트리 칩',
                    placeholder: '리엔트리 칩'
                  },
                  {
                    name: 'averageStack',
                    label: '에버러지 스택',
                    placeholder: '에버리지 스택'
                  },
                  {
                    name: 'totalStack',
                    label: '토탈 스택',
                    placeholder: '토탈 스택'
                  },
                  {
                    name: 'breakTime',
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
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder={placeholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name='structure'
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>스트럭처</FormLabel>
                      <FormControl>
                        <Select value={value} onValueChange={onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder='스트럭처 선택' />
                          </SelectTrigger>
                          <SelectContent>
                            {structureItems.map((item) => (
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
                  name='tableInfo'
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>테이블 정보</FormLabel>
                      <FormControl>
                        <Select value={value} onValueChange={onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder='테이블 정보 선택' />
                          </SelectTrigger>
                          <SelectContent>
                            {tableInfoItems.map((item) => (
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
                <Button type='submit'>게임 추가</Button>
              </form>
            </Form>
          </SectionContent>
        </Section>
      </div>
    </PageContainer>
  );
}
