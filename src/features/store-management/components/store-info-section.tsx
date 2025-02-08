'use client';
import { useEffect } from 'react';
import { Section, SectionTitle, SectionContent } from '@/components/section';
import {
  FormLabel,
  FormItem,
  Form,
  FormField,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Store } from '@/mocks/stores';
import { storeSchema, type StoreFormValues } from '../utils/form-schema';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PageState } from './store-management-page';
import { v4 as uuidv4 } from 'uuid';

const leagueItems = ['리그A', '리그B', '리그C'] as const;

const convenienceInfoItems = [
  '주차 가능',
  '신용카드 가능',
  '와이파이',
  '예약가능',
  '단체석',
  '흡연실',
  '발렛파킹'
] as const;

interface StoreInfoSectionProps {
  selectedStore: Store | null;
  pageState: PageState;
  createStore: (store: Store) => void;
  updateStore: (store: Store) => void;
}

export default function StoreInfoSection({
  selectedStore,
  pageState,
  createStore,
  updateStore
}: StoreInfoSectionProps) {
  const initialValues: StoreFormValues = selectedStore
    ? {
        representative_image_url:
          selectedStore.representative_image || undefined,
        representative_image_file: undefined,
        name: selectedStore.name,
        phone: selectedStore.phone,
        address: selectedStore.address,
        league: selectedStore.league,
        convenience_info: selectedStore.convenience_info
      }
    : {
        representative_image_url: undefined,
        representative_image_file: undefined,
        name: '',
        phone: '',
        address: '',
        league: '',
        convenience_info: []
      };

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    mode: 'onChange',
    defaultValues: initialValues
  });

  const onSubmit = (data: StoreFormValues) => {
    const { name, phone, address, league, convenience_info } = data;
    const store: Store = {
      id: selectedStore ? selectedStore.id : uuidv4(),
      status: '영업전',
      name,
      phone,
      address,
      league,
      convenience_info,
      created_at: new Date().toISOString()
    };
    if (pageState === 'create') {
      createStore(store);
    } else {
      updateStore(store);
    }
  };

  const readOnly = pageState === 'read';

  return (
    <Section>
      <SectionTitle>매장 정보</SectionTitle>
      <SectionContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='representative_image_file'
              render={({ field: { ref, onChange, onBlur } }) => (
                <FormItem>
                  <FormLabel>매장 대표사진</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='image/*'
                      disabled={readOnly}
                      onChange={(e) => {
                        onChange(e.target.files?.[0]);
                        form.setValue('representative_image_url', '');
                      }}
                      onBlur={onBlur}
                      ref={ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>매장 이름</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='매장 이름을 입력하세요'
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
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전화번호</FormLabel>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder='전화번호를 입력하세요'
                      disabled={readOnly}
                      {...field}
                      onInput={(e) => {
                        let value = e.currentTarget.value.replace(/\D/g, '');
                        if (value.length > 3 && value.length <= 7) {
                          value = value.replace(/(\d{3})(\d+)/, '$1-$2');
                        } else if (value.length > 7) {
                          value = value.replace(
                            /(\d{3})(\d{4})(\d+)/,
                            '$1-$2-$3'
                          );
                        }
                        e.currentTarget.value = value;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>매장 주소</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='매장 주소를 입력하세요'
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
              name='league'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>리그</FormLabel>
                  <FormControl>
                    <Select
                      value={value}
                      disabled={readOnly}
                      onValueChange={onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='리그 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {leagueItems.map((item) => (
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
            <FormItem>
              <FormLabel>편의정보</FormLabel>
              <div className={cn('grid grid-cols-2 gap-2')}>
                {convenienceInfoItems.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name='convenience_info'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className='mb-0 flex flex-row items-start space-x-3 space-y-0'
                        >
                          <FormControl>
                            <Checkbox
                              checked={Boolean(field.value?.includes(item))}
                              disabled={readOnly}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      item
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className='text-sm font-normal'>
                            {item}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
            <FormMessage />
            {!readOnly && (
              <Button type='submit'>
                {pageState === 'create' ? '추가' : '수정'}
              </Button>
            )}
          </form>
        </Form>
      </SectionContent>
    </Section>
  );
}
