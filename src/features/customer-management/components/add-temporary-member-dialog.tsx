'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTempUser } from '@/hooks/use-temp-user';
import {
  temporaryMemberSchema,
  TemporaryMemberFormData
} from '../utils/form-schema';
import type { UserResponse } from '@/lib/api/types.gen';

const genderItems = [
  { label: '남성', value: 'MALE' },
  { label: '여성', value: 'FEMALE' }
] as const;

interface AddTemporaryMemberDialogProps {
  onSuccess?: () => void;
  onClose?: () => void;
  addUser?: (user: UserResponse) => void;
}

export default function AddTemporaryMemberDialog({
  onSuccess,
  onClose,
  addUser
}: AddTemporaryMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const { createTemporaryUser, isCreating } = useTempUser();

  const form = useForm<TemporaryMemberFormData>({
    resolver: zodResolver(temporaryMemberSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      birth: '',
      gender: undefined
    }
  });

  const onSubmit = (data: TemporaryMemberFormData) => {
    createTemporaryUser(
      {
        name: data.name,
        phone_number: data.phone,
        email_address: data.email,
        birth: data.birth,
        gender: data.gender
      },
      {
        onSuccess: (response) => {
          setOpen(false);
          form.reset();
          if (onSuccess) onSuccess();
          if (onClose) onClose();
          if (addUser && response?.data) addUser(response.data);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>임시회원 추가</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>임시회원 추가</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='name'>이름</FormLabel>
                  <FormControl>
                    <Input id='name' placeholder='이름 입력' {...field} />
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
                  <FormLabel htmlFor='email'>이메일</FormLabel>
                  <FormControl>
                    <Input
                      id='email'
                      type='email'
                      placeholder='이메일 주소 입력'
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
              name='birth'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='birth'>생년월일</FormLabel>
                  <FormControl>
                    <Input id='birth' type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='gender'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>성별</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='성별 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {genderItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' disabled={isCreating}>
                {isCreating ? '추가 중...' : '추가'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
