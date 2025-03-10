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
import { Label } from '@/components/ui/label';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Product } from '@/mocks/payments';
import { productSchema, ProductFormData } from '../utils/form-schema';
import { v4 as uuidv4 } from 'uuid';

interface ProductDialogProps {
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  initialData?: Product | null;
  onClose?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ProductDialog({
  addProduct,
  updateProduct,
  initialData,
  onClose,
  open,
  setOpen
}: ProductDialogProps) {
  const resetValue = {
    name: '',
    price: undefined
  };
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: resetValue
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset(resetValue);
      }
    }
  }, [open, initialData, form]);

  const onSubmit = (data: ProductFormData) => {
    if (initialData) {
      updateProduct({
        id: initialData.id,
        created_at: initialData.created_at,
        ...data
      });
    } else {
      addProduct({
        id: uuidv4(),
        created_at: new Date().toISOString(),
        ...data
      });
    }
    setOpen(false);
    form.reset(resetValue);
    if (onClose) onClose();
  };

  const onDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset(resetValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onDialogOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>결제 항목 {initialData ? '수정' : '추가'}</DialogTitle>
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
              name='price'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='price'>가격</Label>
                  <FormControl>
                    <Input
                      type='number'
                      id='price'
                      placeholder='가격 입력'
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
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
