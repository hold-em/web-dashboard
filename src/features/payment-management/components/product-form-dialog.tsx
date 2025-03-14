'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
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
import { productSchema, ProductFormData } from '../utils/form-schema';
import { v4 as uuidv4 } from 'uuid';
import { PayableItemRestResponse } from '@/lib/api/types.gen';

interface ProductDialogProps {
  addProduct: (product: PayableItemRestResponse) => void;
  updateProduct: (product: PayableItemRestResponse) => void;
  initialData?: PayableItemRestResponse | null;
  onClose?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ProductFormDialog({
  addProduct,
  updateProduct,
  initialData,
  onClose,
  open,
  setOpen
}: ProductDialogProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      position: 0
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        position: initialData.position
      });
    } else {
      form.reset({
        name: '',
        position: 0
      });
    }
  }, [initialData, form]);

  const onSubmit = (data: ProductFormData) => {
    if (initialData) {
      // 기존 항목 업데이트
      updateProduct({
        ...initialData,
        name: data.name,
        position: data.position
      });
    } else {
      // 새 항목 추가
      const newProduct: PayableItemRestResponse = {
        id: uuidv4(), // 임시 ID 생성 (실제로는 서버에서 생성)
        name: data.name,
        position: data.position,
        store_id: 1, // 임시 store_id
        created_by: 'current_user', // 임시 사용자 ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      addProduct(newProduct);
    }
    setOpen(false);
  };

  const handleClose = () => {
    form.reset();
    if (onClose) onClose();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {initialData ? '결제 항목 수정' : '결제 항목 추가'}
          </DialogTitle>
          <DialogDescription>결제 항목의 정보를 입력하세요.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='name'>항목명</Label>
                  <FormControl>
                    <Input id='name' placeholder='항목명' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='position'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='position'>순서</Label>
                  <FormControl>
                    <Input
                      id='position'
                      type='number'
                      placeholder='순서'
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? '' : Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                취소
              </Button>
              <Button type='submit'>저장</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
