'use client';

import { useEffect } from 'react';
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Structure } from '@/mocks/games';
import { structureSchema, StructureFormData } from '../utils/form-schema';
import { v4 as uuid } from 'uuid';

interface StructureFormDialogProps {
  initialData?: Structure | null;
  addStructure: (structure: Structure) => void;
  updateStructure: (structure: Structure) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function StructureFormDialog({
  initialData,
  addStructure,
  updateStructure,
  open,
  setOpen
}: StructureFormDialogProps) {
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
    form.reset(
      initialData || {
        name: '',
        level: '',
        ante: '',
        duration: ''
      }
    );
  }, [initialData, form]);

  useEffect(() => {
    if (!open) {
      form.reset({
        name: '',
        level: '',
        ante: '',
        duration: ''
      });
    }
  }, [open]);

  const onSubmit = (data: StructureFormData) => {
    const { name, level, ante, duration } = data;
    if (initialData) {
      updateStructure({
        ...initialData,
        name,
        level,
        ante,
        duration
      });
    } else {
      const newStructure: Structure = {
        id: uuid(),
        created_at: new Date().toISOString(),
        name,
        level,
        ante,
        duration
      };
      addStructure(newStructure);
    }
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {initialData ? '스트럭처 수정' : '새 스트럭처 추가'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
              name='level'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='level'>레벨</FormLabel>
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
                  <FormLabel htmlFor='ante'>앤티</FormLabel>
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
                  <FormLabel htmlFor='duration'>듀레이션</FormLabel>
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
              <Button type='submit'>{initialData ? '수정' : '추가'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
