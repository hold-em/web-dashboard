import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPayableItemsInStore,
  createPayableItem,
  updatePayableItem,
  getPayableItem
} from '@/lib/api';
import type {
  CreatePayableItemRestRequest,
  UpdatePayableItemRestRequest,
  PayableItemRestResponse
} from '@/lib/api/types.gen';
import { useSelectedStore } from './use-selected-store';
import { toast } from 'sonner';

export function usePayableItems(payableItemId?: string) {
  const queryClient = useQueryClient();
  const { selectedStore } = useSelectedStore();

  // Get all payable items
  const { data: payableItems, isLoading } = useQuery({
    queryKey: ['payableItems', selectedStore?.id],
    queryFn: async () => {
      if (!selectedStore?.id) return { data: [] };
      const response = await getPayableItemsInStore({
        path: { storeId: selectedStore.id }
      });
      return response.data;
    },
    enabled: !!selectedStore?.id
  });

  // Get single payable item
  const { data: selectedPayableItem, isLoading: isLoadingPayableItem } =
    useQuery({
      queryKey: ['payableItem', payableItemId],
      queryFn: async () => {
        if (!payableItemId || !selectedStore?.id) return null;
        const response = await getPayableItem({
          path: {
            storeId: selectedStore.id,
            payableItemId
          }
        });
        return response.data;
      },
      enabled: !!payableItemId && !!selectedStore?.id
    });

  // Create payable item mutation
  const { mutate: createPayableItemMutation, isPending: isCreating } =
    useMutation({
      mutationFn: async (data: CreatePayableItemRestRequest) => {
        if (!selectedStore?.id) {
          throw new Error('No store selected');
        }
        const response = await createPayableItem({
          body: data,
          path: { storeId: selectedStore.id }
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['payableItems', selectedStore?.id]
        });
        toast.success('결제 항목 생성 완료', {
          description: '새로운 결제 항목이 생성되었습니다.'
        });
      },
      onError: () => {
        toast.error('결제 항목 생성 실패', {
          description: '결제 항목 생성 중 오류가 발생했습니다.'
        });
      }
    });

  // Update payable item mutation
  const { mutate: updatePayableItemMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: async ({
        id,
        data
      }: {
        id: string;
        data: UpdatePayableItemRestRequest;
      }) => {
        if (!selectedStore?.id) {
          throw new Error('No store selected');
        }
        const response = await updatePayableItem({
          body: data,
          path: {
            storeId: selectedStore.id,
            payableItemId: id
          }
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['payableItems', selectedStore?.id]
        });
        toast.success('결제 항목 수정 완료', {
          description: '결제 항목이 수정되었습니다.'
        });
      },
      onError: () => {
        toast.error('결제 항목 수정 실패', {
          description: '결제 항목 수정 중 오류가 발생했습니다.'
        });
      }
    });

  return {
    payableItems,
    isLoading,
    selectedPayableItem,
    isLoadingPayableItem,
    createPayableItem: createPayableItemMutation,
    isCreating,
    updatePayableItem: updatePayableItemMutation,
    isUpdating
  };
}
