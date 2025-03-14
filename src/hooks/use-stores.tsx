import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createStore, updateStore, getCreatedStores } from '@/lib/api';
import type { CreateStoreRestRequest, UpdateStoreRestRequest } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useStores = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 매장 목록 조회
  const {
    data: stores,
    isLoading,
    error
  } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data } = await getCreatedStores();
      return data?.data ?? [];
    }
  });

  // 매장 생성
  const createStoreMutation = useMutation({
    mutationFn: async (storeData: CreateStoreRestRequest) => {
      const { data } = await createStore({
        body: {
          league_id: storeData.league_id,
          name: storeData.name,
          phone_number: storeData.phone_number,
          address: storeData.address,
          longitude: storeData.longitude,
          latitude: storeData.latitude,
          store_image_file_ids: storeData.store_image_file_ids,
          available_facility_types: storeData.available_facility_types
        }
      });
      return data;
    },
    onSuccess: () => {
      toast.success('매장이 성공적으로 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      router.push('/dashboard/store-management');
    },
    onError: () => {
      toast.error('매장 생성 실패', {
        description: '매장 생성 중 오류가 발생했습니다.'
      });
    }
  });

  // 매장 수정
  const updateStoreMutation = useMutation({
    mutationFn: async ({
      storeId,
      ...updateData
    }: UpdateStoreRestRequest & { storeId: number }) => {
      const { data } = await updateStore({
        path: { storeId },
        body: {
          league_id: updateData.league_id,
          name: updateData.name,
          phone_number: updateData.phone_number,
          address: updateData.address,
          longitude: updateData.longitude,
          latitude: updateData.latitude,
          store_image_file_ids: updateData.store_image_file_ids,
          available_facility_types: updateData.available_facility_types
        }
      });
      return data;
    },
    onSuccess: () => {
      toast.success('매장 정보가 성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      router.push('/dashboard/store-management');
    },
    onError: () => {
      toast.error('매장 정보 수정 실패', {
        description: '매장 정보 수정 중 오류가 발생했습니다.'
      });
    }
  });

  return {
    stores,
    isLoading,
    error,
    createStore: createStoreMutation.mutate,
    isCreating: createStoreMutation.isPending,
    createError: createStoreMutation.error,
    updateStore: updateStoreMutation.mutate,
    isUpdating: updateStoreMutation.isPending,
    updateError: updateStoreMutation.error
  };
};
