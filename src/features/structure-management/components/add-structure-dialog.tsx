'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { structureSchema, StructureFormData } from '../utils/form-schema';

interface AddStructureDialogProps {
  onAddStructure: (data: StructureFormData) => void;
  initialData?: StructureFormData | null;
  isEditing?: boolean;
  onClose?: () => void;
}

export default function AddStructureDialog({
  onAddStructure,
  initialData,
  isEditing = false,
  onClose
}: AddStructureDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<StructureFormData>({
    resolver: zodResolver(structureSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      level: '',
      ante: '',
      duration: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setOpen(true);
    }
  }, [initialData, form]);

  const onSubmit = (data: StructureFormData) => {
    onAddStructure(data);
    setOpen(false);
    form.reset();
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? '스트럭처 수정' : '새 스트럭처 추가'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='name'>이름</Label>
                  <FormControl>
                    <Input id='name' placeholder='이름 입력' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='level'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='level'>레벨</Label>
                  <FormControl>
                    <Input id='level' placeholder='레벨 입력' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ante'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='ante'>앤티</Label>
                  <FormControl>
                    <Input id='ante' placeholder='앤티 입력' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='duration'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='duration'>듀레이션</Label>
                  <FormControl>
                    <Input
                      id='duration'
                      placeholder='듀레이션 입력'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>{isEditing ? '수정' : '추가'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
