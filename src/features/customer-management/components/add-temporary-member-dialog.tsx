'use client';

import { useState, useRef } from 'react';
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
import { useTempUser } from '@/hooks/use-temp-user';
import {
  temporaryMemberSchema,
  TemporaryMemberFormData
} from '../utils/form-schema';
import type { UserResponse } from '@/lib/api/types.gen';
import { AlertCircle, Store, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useSelectedStore } from '@/hooks/use-selected-store';

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
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const verifiedNicknameRef = useRef<string>('');
  const { selectedStore } = useSelectedStore();
  const {
    createTemporaryUser,
    isCreating,
    checkNicknameAvailability,
    isCheckingNickname,
    hasSelectedStore
  } = useTempUser();

  const form = useForm<TemporaryMemberFormData>({
    resolver: zodResolver(temporaryMemberSchema),
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      name: '',
      phone: ''
    }
  });

  const handleNicknameChange = () => {
    // 닉네임이 변경되면 검증 상태 초기화
    const currentNickname = form.getValues('nickname');
    if (currentNickname !== verifiedNicknameRef.current) {
      setIsNicknameVerified(false);
    }
  };

  const checkNickname = () => {
    const nickname = form.getValues('nickname');
    if (!nickname) {
      return;
    }

    checkNicknameAvailability(nickname)
      .then(() => {
        setIsNicknameVerified(true);
        verifiedNicknameRef.current = nickname;
      })
      .catch(() => {
        setIsNicknameVerified(false);
        verifiedNicknameRef.current = '';
      });
  };

  const onSubmit = (data: TemporaryMemberFormData) => {
    if (!hasSelectedStore) {
      toast.error('매장 선택 필요', {
        description: '임시 회원을 추가할 매장을 선택해주세요.'
      });
      return;
    }

    if (!isNicknameVerified) {
      form.setError('nickname', {
        type: 'manual',
        message: '닉네임 중복 확인이 필요합니다.'
      });
      return;
    }

    createTemporaryUser(
      {
        nickname: data.nickname,
        name: data.name,
        phone_number: data.phone
      },
      {
        onSuccess: (response) => {
          setOpen(false);
          form.reset();
          setIsNicknameVerified(false);
          verifiedNicknameRef.current = '';
          if (onSuccess) onSuccess();
          if (onClose) onClose();
          if (addUser && response?.data) addUser(response.data);
        }
      }
    );
  };

  const renderForm = () => {
    if (!hasSelectedStore) {
      return (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            임시 회원을 추가하려면 먼저 매장을 선택해주세요.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='nickname'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='nickname'>
                  닉네임 <span className='text-red-500'>*</span>
                </FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input
                      id='nickname'
                      placeholder='닉네임 입력'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNicknameChange();
                      }}
                      className={`pr-24 ${isNicknameVerified ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={checkNickname}
                    disabled={isCheckingNickname || !form.getValues('nickname')}
                    className='absolute right-1 top-1/2 h-7 -translate-y-1/2 px-2 text-xs'
                  >
                    {isCheckingNickname ? '확인 중...' : '중복 확인'}
                  </Button>
                </div>
                {isNicknameVerified && (
                  <div className='mt-1 flex items-center text-xs text-green-500'>
                    <CheckCircle className='mr-1 h-3 w-3' />
                    <span>사용 가능한 닉네임입니다.</span>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
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
          <DialogFooter>
            <Button type='submit' disabled={isCreating}>
              {isCreating ? '추가 중...' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
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
          {hasSelectedStore && selectedStore && (
            <div className='mt-2 flex items-center text-sm text-muted-foreground'>
              <Store className='mr-1 h-4 w-4' />
              <span>선택된 매장:</span>
              <Badge variant='outline' className='ml-2'>
                {selectedStore.name}
              </Badge>
            </div>
          )}
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
}
