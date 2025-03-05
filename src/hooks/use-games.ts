import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGames, createGame, updateGame, getGame } from '@/lib/api';
import type { CreateGameRestRequest, UpdateGameRestRequest } from '@/lib/api';

export function useGames() {
  const queryClient = useQueryClient();

  // Get all games
  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await getGames({
        path: { storeId: 1 }
      });
      return response.data;
    }
  });

  // Get single game
  const { data: selectedGame, isLoading: isLoadingGame } = useQuery({
    queryKey: ['game'],
    queryFn: async ({ queryKey }) => {
      const [_, gameId] = queryKey;
      if (!gameId) return null;
      const response = await getGame({
        path: { gameId: String(gameId) }
      });
      return response.data;
    },
    enabled: false
  });

  // Create game mutation
  const { mutate: createGameMutation, isPending: isCreating } = useMutation({
    mutationFn: async (data: CreateGameRestRequest) => {
      const response = await createGame({
        body: data,
        path: { storeId: 1 }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    }
  });

  // Update game mutation
  const { mutate: updateGameMutation, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: number;
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
