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

import {
  temporaryMemberSchema,
  TemporaryMemberFormData
} from '../utils/form-schema';
import { User } from '@/mocks/users';
import { v4 as uuidv4 } from 'uuid';

const genderItems = ['남성', '여성'] as const;

interface AddTemporaryMemberDialogProps {
  addUser: (user: User) => void;
  onClose?: () => void;
}

export default function AddTemporaryMemberDialog({
  addUser,
  onClose
}: AddTemporaryMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<TemporaryMemberFormData>({
    resolver: zodResolver(temporaryMemberSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      nickname: '',
      phone: '',
      gender: ''
    }
  });

  const onSubmit = (data: TemporaryMemberFormData) => {
    const newUser: User = {
      ...data,
      id: uuidv4(),
      member_status: '임시회원',
      league_points: 0,
      created_at: new Date().toISOString()
    };
    addUser(newUser);
    setOpen(false);
    form.reset();
    if (onClose) onClose();
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
              name='nickname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='nickname'>닉네임</FormLabel>
                  <FormControl>
                    <Input id='nickname' placeholder='닉네임 입력' {...field} />
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
            <DialogFooter>
              <Button type='submit'>추가</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
