import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createGameTable,
  updateGameTable,
  changeGameTableParticipants,
  getGameTables
} from '@/lib/api';
import type {
  CreateGameTableRestRequest,
  UpdateGameTableRestRequest,
  ChangeGameTableParticipantsRestRequest
} from '@/lib/api';

export function useGameTables(gameId?: string) {
  const queryClient = useQueryClient();

  // Get game tables
  const { data: tables, isLoading } = useQuery({
    queryKey: ['gameTables', gameId],
    queryFn: async () => {
      if (!gameId) return null;
      const response = await getGameTables({
        path: { gameId }
      });
      return response.data;
    },
    enabled: !!gameId
  });

  // Create game table mutation
  const { mutate: createGameTableMutation, isPending: isCreatingTable } =
    useMutation({
      mutationFn: async ({
        gameId,
        data
      }: {
        gameId: number;
        data: CreateGameTableRestRequest;
      }) => {
        const response = await createGameTable({
          body: data,
          path: { gameId: String(gameId) }
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['games'] });
      }
    });

  // Update game table mutation
  const { mutate: updateGameTableMutation, isPending: isUpdatingTable } =
    useMutation({
      mutationFn: async ({
        gameId,
        tableId,
        data
      }: {
        gameId: number;
        tableId: number;
        data: UpdateGameTableRestRequest;
      }) => {
        const response = await updateGameTable({
          body: data,
          path: { gameId: String(gameId), tableId: String(tableId) }
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['games'] });
      }
    });

  // Change game table participants
  const {
    mutate: changeParticipantsMutation,
    isPending: isChangingParticipants
  } = useMutation({
    mutationFn: async ({
      gameId,
      tableId,
      data
    }: {
      gameId: number;
      tableId: number;
      data: ChangeGameTableParticipantsRestRequest;
    }) => {
      const response = await changeGameTableParticipants({
        body: data,
        path: { gameId: String(gameId), tableId: String(tableId) }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    }
  });

  return {
    tables,
    isLoading,
    createGameTable: createGameTableMutation,
    isCreatingTable,
    updateGameTable: updateGameTableMutation,
    isUpdatingTable,
    changeParticipants: changeParticipantsMutation,
    isChangingParticipants
  };
}
