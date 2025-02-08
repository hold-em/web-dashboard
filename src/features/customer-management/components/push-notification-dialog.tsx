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
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/mocks/users';
import { notificationSchema, NotificationFormData } from '../utils/form-schema';

interface PushNotificationDialogProps {
  pushNotification: (text: string) => void;
  checkedUsers: User[];
  onClose?: () => void;
}

export default function PushNotificationDialog({
  pushNotification,
  checkedUsers,
  onClose
}: PushNotificationDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    mode: 'onChange',
    defaultValues: {
      content: ''
    }
  });

  const onSubmit = (data: NotificationFormData) => {
    pushNotification(data.content);
    setOpen(false);
    form.reset();
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' disabled={checkedUsers.length === 0}>
          푸시 알림 보내기
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>푸시 알림 보내기</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='content'>보낼 내용</FormLabel>
                  <FormControl>
                    <Textarea
                      id='content'
                      placeholder='내용을 입력해주세요'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>보내기</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
