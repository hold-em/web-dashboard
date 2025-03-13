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
import { toast } from 'sonner';

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
        toast.success('테이블이 생성되었습니다.');
      },
      onError: () => {
        toast.error('테이블 생성에 실패했습니다.');
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
        toast.success('테이블이 수정되었습니다.');
      },
      onError: () => {
        toast.error('테이블 수정에 실패했습니다.');
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
      toast.success('참가자가 변경되었습니다.');
    },
    onError: () => {
      toast.error('참가자 변경에 실패했습니다.');
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
        toast.success('테이블이 삭제되었습니다.');
      },
      onError: () => {
        toast.error('테이블 삭제에 실패했습니다.');
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
