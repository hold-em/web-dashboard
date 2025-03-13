import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGames, createGame, updateGame, getGame } from '@/lib/api';
import type { CreateGameRestRequest, UpdateGameRestRequest } from '@/lib/api';
import { useSelectedStore } from './use-selected-store';
import { toast } from 'sonner';

export function useGames(gameId?: string) {
  const queryClient = useQueryClient();
  const { selectedStore } = useSelectedStore();

  // Get all games
  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await getGames({
        path: { storeId: selectedStore?.id ?? 0 }
      });
      return response.data;
    },
    enabled: !!selectedStore?.id
  });

  // Get single game
  const { data: selectedGame, isLoading: isLoadingGame } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      if (!gameId) return null;
      const response = await getGame({
        path: { gameId }
      });
      return response.data;
    },
    enabled: !!gameId
  });

  // Create game mutation
  const { mutate: createGameMutation, isPending: isCreating } = useMutation({
    mutationFn: async (data: CreateGameRestRequest) => {
      const response = await createGame({
        body: data,
        path: { storeId: selectedStore?.id ?? 0 }
      });
      console.log('🚀 ~ mutationFn: ~ response:', response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success('게임 생성 완료', {
        description: '새로운 게임이 생성되었습니다.'
      });
    },
    onError: () => {
      toast.error('게임 생성 실패', {
        description: '게임 생성 중 오류가 발생했습니다.'
      });
    }
  });

  // Update game mutation
  const { mutate: updateGameMutation, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: UpdateGameRestRequest;
    }) => {
      const response = await updateGame({
        body: data,
        path: { gameId: String(id) }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success('게임 수정 완료', {
        description: '게임 정보가 수정되었습니다.'
      });
    },
    onError: () => {
      toast.error('게임 수정 실패', {
        description: '게임 수정 중 오류가 발생했습니다.'
      });
    }
  });

  return {
    games,
    isLoading,
    selectedGame,
    isLoadingGame,
    createGame: createGameMutation,
    isCreating,
    updateGame: updateGameMutation,
    isUpdating
  };
}
