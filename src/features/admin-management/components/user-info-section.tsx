'use client';

import * as React from 'react';
import { PageState } from './admin-management-page';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUsers } from '@/hooks/use-users';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

interface UserInfoSectionProps {
  selectedUser: any | null;
  pageState: PageState;
}

// 사용자 폼 스키마 정의
const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  role: z.enum(['USER', 'ADMIN', 'SYSTEM_ADMIN'])
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UserInfoSection({
  selectedUser,
  pageState
}: UserInfoSectionProps) {
  const router = useRouter();

  const formatDate = (date: unknown) => {
    if (!date || typeof date !== 'string') return '-';
    return new Date(date).toLocaleString();
  };

  const initialValues: UserFormValues = selectedUser
    ? {
        name: selectedUser.name || '',
        email: selectedUser.email,
        role: selectedUser.role
      }
    : {
        name: '',
        email: '',
        role: 'USER'
      };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: initialValues
  });

  const onSubmit = React.useCallback(
    async (data: UserFormValues) => {
      try {
        if (pageState === 'update' && selectedUser) {
          // await updateUser({
          //   userId: selectedUser.id,
          //   data
          // });
        }
      } catch (error) {
        console.error('Failed to update user:', error);
      } finally {
        router.back();
      }
    },
    [pageState, selectedUser, router]
  );

  const readOnly = pageState === 'read';

  return (
    <Section>
      <SectionTitle>
        {pageState === 'update' ? '사용자 정보 수정' : '사용자 정보'}
      </SectionTitle>
      <SectionContent>
        {readOnly && selectedUser ? (
          <div className='space-y-4'>
            <div>
              <h3 className='font-medium'>이름</h3>
              <p>{selectedUser.name || '이름 없음'}</p>
            </div>
            <div>
              <h3 className='font-medium'>이메일</h3>
              <p>{selectedUser.email}</p>
            </div>
            <div>
              <h3 className='font-medium'>역할</h3>
              <p>{selectedUser.role}</p>
            </div>
            <div>
              <h3 className='font-medium'>가입일</h3>
              <p>{formatDate(selectedUser.created_at)}</p>
            </div>
            <div>
              <h3 className='font-medium'>수정일</h3>
              <p>{formatDate(selectedUser.updated_at)}</p>
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
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='이름을 입력하세요'
                        disabled={readOnly}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='이메일을 입력하세요'
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
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>역할</FormLabel>
                    <Select
                      disabled={readOnly}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='역할을 선택하세요' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='USER'>일반 사용자</SelectItem>
                        <SelectItem value='ADMIN'>관리자</SelectItem>
                        <SelectItem value='SYSTEM_ADMIN'>
                          시스템 관리자
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* {!readOnly && (
                <Button type='submit' disabled={isUpdating}>
                  {isUpdating ? '저장 중...' : '수정'}
                </Button>
              )} */}
            </form>
          </Form>
        )}
      </SectionContent>
    </Section>
  );
}
