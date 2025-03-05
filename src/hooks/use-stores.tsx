import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createStore, updateStore, getCreatedStores } from '@/lib/api';
import type { CreateStoreRestRequest, UpdateStoreRestRequest } from '@/lib/api';

export const useStores = () => {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ['stores'] });
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
      queryClient.invalidateQueries({ queryKey: ['stores'] });
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
