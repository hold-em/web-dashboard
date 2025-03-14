import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPaymentsInStore,
  createPayment,
  cancelPayment,
  updatePayment,
  cancelPartialPayment
} from '@/lib/api/sdk.gen';
import {
  CreatePartialPaymentRestRequest,
  UpdatePartialPaymentRestRequest
} from '@/lib/api/types.gen';
import { useSelectedStore } from '@/hooks/use-selected-store';
import { toast } from 'sonner';

export interface PaymentMethod {
  type: 'CARD' | 'CASH' | 'TRANSFER' | 'UNPAID';
  amount: number;
}

export interface CreatePaymentRequest {
  userId: string;
  payableItemId: string;
  paymentMethods: PaymentMethod[];
  memo?: string;
}

export const usePayments = () => {
  const queryClient = useQueryClient();
  const { selectedStore } = useSelectedStore();
  const storeId = selectedStore?.id; // Fallback to 1 if no store is selected

  // Fetch all payments for the current store
  const {
    data: paymentsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['payments', storeId],
    queryFn: async () => {
      const response = await getPaymentsInStore({
        path: { storeId: storeId! }
      });
      return response.data;
    },
    enabled: !!storeId
  });

  // Create a new payment
  const createPaymentMutation = useMutation({
    mutationFn: async (data: CreatePaymentRequest) => {
      // Transform the payment methods to match the API format
      const partialPayments: CreatePartialPaymentRestRequest[] =
        data.paymentMethods
          .filter((method) => method.amount > 0)
          .map((method) => ({
            payment_type: method.type === 'UNPAID' ? 'CARD' : method.type,
            price: method.amount,
            status: 'PENDING'
          }));

      return await createPayment({
        path: { storeId: storeId! },
        body: {
          payed_by: data.userId,
          payable_item_id: data.payableItemId,
          partial_payments: partialPayments,
          status: 'PENDING',
          memo: data.memo
        }
      });
    },
    onSuccess: () => {
      // Invalidate and refetch payments after a successful creation
      queryClient.invalidateQueries({ queryKey: ['payments', storeId] });
      toast.success('결제가 생성되었습니다.');
    },
    onError: (error) => {
      toast.error('결제 생성 중 오류가 발생했습니다.', {
        description: error.message
      });
    }
  });

  // Cancel a payment
  const cancelPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      return await cancelPayment({
        path: { storeId: storeId!, paymentId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', storeId] });
      toast.success('결제가 취소되었습니다.');
    },
    onError: (error) => {
      toast.error('결제 취소 중 오류가 발생했습니다.', {
        description: error.message
      });
    }
  });

  // Cancel a partial payment
  const cancelPartialPaymentMutation = useMutation({
    mutationFn: async ({
      paymentId,
      partialPaymentId
    }: {
      paymentId: string;
      partialPaymentId: string;
    }) => {
      return await cancelPartialPayment({
        path: { storeId: storeId!, paymentId, partialPaymentId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', storeId] });
      toast.success('부분 결제가 취소되었습니다.');
    },
    onError: (error) => {
      toast.error('부분 결제 취소 중 오류가 발생했습니다.', {
        description: error.message
      });
    }
  });

  // Update a payment (e.g., update memo)
  const updatePaymentMutation = useMutation({
    mutationFn: async ({
      paymentId,
      memo,
      payableItemId,
      status,
      partialPayments,
      removedPartialPaymentIds = []
    }: {
      paymentId: string;
      memo?: string;
      payableItemId?: string;
      status?: 'PENDING' | 'PAID';
      partialPayments?: UpdatePartialPaymentRestRequest[];
      removedPartialPaymentIds?: string[];
    }) => {
      // Get the current payment to preserve existing values
      const currentPayment = paymentsData?.data?.find(
        (p) => p.id === paymentId
      );

      if (!currentPayment) {
        throw new Error('Payment not found');
      }

      // 제거된 부분 결제가 있으면 먼저 취소 처리
      for (const partialPaymentId of removedPartialPaymentIds) {
        if (partialPaymentId) {
          await cancelPartialPaymentMutation.mutateAsync({
            paymentId,
            partialPaymentId
          });
        }
      }

      // If we're not explicitly updating partial payments, use the existing ones
      // This helps avoid the "PartialPayment not found" error
      let filteredPartialPayments: UpdatePartialPaymentRestRequest[];

      if (partialPayments) {
        // 제거된 부분 결제를 제외한 기존 부분 결제 ID 목록
        const existingPartialPayments = currentPayment.partial_payments.filter(
          (pp) => !removedPartialPaymentIds.includes(pp.id || '')
        );

        // 새로운 부분 결제와 기존 부분 결제 구분
        const newPartialPayments = partialPayments.filter(
          (pp) => !pp.id || pp.id.startsWith('new_')
        );
        const updatedExistingPartialPayments = partialPayments.filter(
          (pp) => pp.id && !pp.id.startsWith('new_')
        );

        // 기존 부분 결제 매핑 (ID 유지)
        filteredPartialPayments = existingPartialPayments.map((existingPP) => {
          // 업데이트된 기존 부분 결제 찾기
          const updatedPP = updatedExistingPartialPayments.find(
            (pp) => pp.id === existingPP.id
          );

          if (updatedPP) {
            // 업데이트된 값 사용
            return {
              id: existingPP.id,
              payment_type: updatedPP.payment_type,
              price: updatedPP.price,
              status:
                updatedPP.status === 'CANCELED' ? 'PENDING' : updatedPP.status
            };
          }

          // 업데이트되지 않은 기존 값 유지
          return {
            id: existingPP.id,
            payment_type: existingPP.payment_type as
              | 'CARD'
              | 'CASH'
              | 'TRANSFER'
              | 'VOUCHER',
            price: existingPP.price || 0,
            status:
              existingPP.status === 'CANCELED'
                ? 'PENDING'
                : (existingPP.status as 'PENDING' | 'PAID')
          };
        });

        // 새로운 부분 결제 추가 (ID 없음)
        newPartialPayments.forEach((pp) => {
          filteredPartialPayments.push({
            payment_type: pp.payment_type,
            price: pp.price,
            status: pp.status
          });
        });
      } else {
        // Otherwise, use the existing partial payments (제거된 부분 결제 제외)
        filteredPartialPayments = currentPayment.partial_payments
          .filter((pp) => !removedPartialPaymentIds.includes(pp.id || ''))
          .map((pp) => ({
            id: pp.id, // 중요: 기존 ID 유지
            payment_type: pp.payment_type as
              | 'CARD'
              | 'CASH'
              | 'TRANSFER'
              | 'VOUCHER',
            price: pp.price || 0,
            status:
              pp.status === 'CANCELED'
                ? 'PENDING'
                : (pp.status as 'PENDING' | 'PAID')
          }));
      }

      return await updatePayment({
        path: { storeId: storeId!, paymentId },
        body: {
          payable_item_id:
            payableItemId || currentPayment.payable_item_id || '',
          status:
            status ||
            (currentPayment.payment_status === 'CANCELED'
              ? 'PENDING'
              : (currentPayment.payment_status as 'PENDING' | 'PAID')),
          memo: memo !== undefined ? memo : currentPayment.memo,
          partial_payments: filteredPartialPayments
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', storeId] });
      toast.success('결제 정보가 업데이트되었습니다.');
    },
    onError: (error) => {
      toast.error('결제 정보 업데이트 중 오류가 발생했습니다.', {
        description: error.message
      });
    }
  });

  return {
    payments: paymentsData?.data || [],
    isLoading,
    error,
    refetch,
    createPayment: createPaymentMutation.mutate,
    cancelPayment: cancelPaymentMutation.mutate,
    updatePayment: updatePaymentMutation.mutate,
    cancelPartialPayment: cancelPartialPaymentMutation.mutate,
    isCreating: createPaymentMutation.isPending,
    isCancelling: cancelPaymentMutation.isPending,
    isUpdating: updatePaymentMutation.isPending,
    isCancellingPartialPayment: cancelPartialPaymentMutation.isPending
  };
};
