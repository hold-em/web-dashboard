import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGameTypes,
  createGameType,
  updateGameType,
  getGameType,
  deleteGameType
} from '@/lib/api/sdk.gen';
import {
  CreateGameTypeRestRequest,
  UpdateGameTypeRestRequest
} from '@/lib/api/types.gen';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useGameTypes() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: gameTypes, isLoading } = useQuery({
    queryKey: ['gameTypes'],
    queryFn: async () => {
      const response = await getGameTypes();
      return response.data;
    }
  });

  const { mutate: createGameTypeMutation, isPending: isCreating } = useMutation(
    {
      mutationFn: async (data: CreateGameTypeRestRequest) => {
        const response = await createGameType({
          body: data
        });
        return response.data;
      },
      onSuccess: () => {
        toast.success('게임 타입이 생성되었습니다.');
        queryClient.invalidateQueries({ queryKey: ['gameTypes'] });
        router.push('/dashboard/game-type-management');
      },
      onError: () => {
        toast.error('게임 타입 생성 실패', {
          description: '게임 타입 생성 중 오류가 발생했습니다.'
        });
      }
    }
  );

  const { mutate: updateGameTypeMutation, isPending: isUpdating } = useMutation(
    {
      mutationFn: async ({
        id,
        data
      }: {
        id: number;
        data: UpdateGameTypeRestRequest;
      }) => {
        const response = await updateGameType({
          body: data,
          path: { gameTypeId: id }
        });
        return response.data;
      },
      onSuccess: () => {
        toast.success('게임 타입이 수정되었습니다.');
        queryClient.invalidateQueries({ queryKey: ['gameTypes'] });
        router.push('/dashboard/game-type-management');
      },
      onError: () => {
        toast.error('게임 타입 수정 실패', {
          description: '게임 타입 수정 중 오류가 발생했습니다.'
        });
      }
    }
  );

  const { mutate: deleteGameTypeMutation, isPending: isDeleting } = useMutation(
    {
      mutationFn: async (id: number) => {
        const response = await deleteGameType({
          path: { gameTypeId: id }
        });
        return response.data;
      },
      onSuccess: () => {
        toast.success('게임 타입이 삭제되었습니다.');
        queryClient.invalidateQueries({ queryKey: ['gameTypes'] });
      },
      onError: () => {
        toast.error('게임 타입 삭제 실패', {
          description: '게임 타입 삭제 중 오류가 발생했습니다.'
        });
      }
    }
  );

  const { data: selectedGameType, isLoading: isLoadingGameType } = useQuery({
    queryKey: ['gameType'],
    queryFn: async ({ queryKey }) => {
      const [_, gameTypeId] = queryKey;
      if (!gameTypeId) return null;
      const response = await getGameType({
        path: { gameTypeId: Number(gameTypeId) }
      });
      return response.data;
    },
    enabled: false
  });

  return {
    gameTypes,
    isLoading,
    createGameType: createGameTypeMutation,
    isCreating,
    updateGameType: updateGameTypeMutation,
    isUpdating,
    deleteGameType: deleteGameTypeMutation,
    isDeleting,
    selectedGameType,
    isLoadingGameType
  };
}
