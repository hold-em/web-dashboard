import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPaymentsInStore,
  createPayment,
  cancelPayment,
  updatePayment
} from '@/lib/api/sdk.gen';
import { CreatePartialPaymentRestRequest } from '@/lib/api/types.gen';
import { useSelectedStore } from '@/hooks/use-selected-store';

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
    }
  });

  // Update a payment (e.g., update memo)
  const updatePaymentMutation = useMutation({
    mutationFn: async ({
      paymentId,
      memo,
      payableItemId,
      status,
      partialPayments
    }: {
      paymentId: string;
      memo?: string;
      payableItemId?: string;
      status?: 'PENDING' | 'PAID';
      partialPayments?: CreatePartialPaymentRestRequest[];
    }) => {
      // Get the current payment to preserve existing values
      const currentPayment = paymentsData?.data?.find(
        (p) => p.id === paymentId
      );

      if (!currentPayment) {
        throw new Error('Payment not found');
      }

      // Filter out any partial payments with status CANCELED as it's not allowed in updates
      const filteredPartialPayments =
        partialPayments?.map((pp) => ({
          ...pp,
          status: pp.status === 'CANCELED' ? 'PENDING' : pp.status
        })) ||
        currentPayment.partial_payments.map((pp) => ({
          payment_type: pp.payment_type as 'CARD' | 'CASH' | 'TRANSFER',
          price: pp.price || 0,
          status:
            pp.status === 'CANCELED'
              ? 'PENDING'
              : (pp.status as 'PENDING' | 'PAID')
        }));

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
    isCreating: createPaymentMutation.isPending,
    isCancelling: cancelPaymentMutation.isPending,
    isUpdating: updatePaymentMutation.isPending
  };
};
