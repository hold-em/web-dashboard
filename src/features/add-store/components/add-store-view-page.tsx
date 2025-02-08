'use client';
import PageContainer from '@/components/layout/page-container';
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
import { addStoreSchema, type AddStoreFormValues } from '../utils/form-schema';
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

export default function AddStoreViewPage() {
  const form = useForm<AddStoreFormValues>({
    resolver: zodResolver(addStoreSchema),
    mode: 'onChange',
    defaultValues: {
      representativeImage: undefined,
      storeName: '',
      phone: '',
      storeAddress: '',
      league: '',
      convenienceInfo: []
    }
  });

  const onSubmit: SubmitHandler<AddStoreFormValues> = (data) => {
    console.log(data);
  };

  return (
    <PageContainer>
      <div className='space-y-4'>
        <Section>
          <SectionTitle>매장 정보</SectionTitle>
          <SectionContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name='representativeImage'
                  render={({ field: { ref, onChange, onBlur } }) => (
                    <FormItem>
                      <FormLabel>매장 대표사진</FormLabel>
                      <FormControl>
                        <Input
                          type='file'
                          accept='image/*'
                          onChange={(e) => {
                            onChange(e.target.files?.[0]);
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
                  name='storeName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>매장 이름</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='매장 이름을 입력하세요'
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
                          {...field}
                          onInput={(e) => {
                            let value = e.currentTarget.value.replace(
                              /\D/g,
                              ''
                            );
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
                  name='storeAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>매장 주소</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='매장 주소를 입력하세요'
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
                        <Select value={value} onValueChange={onChange}>
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
                        name='convenienceInfo'
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className='mb-0 flex flex-row items-start space-x-3 space-y-0'
                            >
                              <FormControl>
                                <Checkbox
                                  checked={Boolean(field.value?.includes(item))}
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
                <Button type='submit'>매장 추가</Button>
              </form>
            </Form>
          </SectionContent>
        </Section>
      </div>
    </PageContainer>
  );
}
