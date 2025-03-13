import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createGameTable,
  updateGameTable,
  changeGameTableParticipants,
  getGameTables,
  deleteGameTable
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
        gameId: string;
        data: CreateGameTableRestRequest;
      }) => {
        const response = await createGameTable({
          body: data,
          path: { gameId: gameId }
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['gameTables', gameId] });
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
        gameId: string;
        tableId: string;
        data: UpdateGameTableRestRequest;
      }) => {
        const response = await updateGameTable({
          body: data,
          path: { gameId: String(gameId), tableId: String(tableId) }
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['gameTables', gameId] });
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
      gameId: string;
      tableId: string;
      data: ChangeGameTableParticipantsRestRequest;
    }) => {
      const response = await changeGameTableParticipants({
        body: data,
        path: { gameId: gameId, tableId: tableId }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameTables', gameId] });
    }
  });

  // Delete game table mutation
  const { mutate: deleteGameTableMutation, isPending: isDeletingTable } =
    useMutation({
      mutationFn: async ({
        gameId,
        tableId
      }: {
        gameId: string;
        tableId: string;
      }) => {
        const response = await deleteGameTable({
          path: { gameId: gameId, tableId: tableId }
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['gameTables', gameId] });
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
    isChangingParticipants,
    deleteGameTable: deleteGameTableMutation,
    isDeletingTable
  };
}
