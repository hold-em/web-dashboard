import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeagues, createLeague, updateLeague, getLeague } from '@/lib/api';
import { CreateLeagueRestRequest, UpdateLeagueRestRequest } from '@/lib/api';

export function useLeagues() {
  const queryClient = useQueryClient();

  const { data: leagues, isLoading } = useQuery({
    queryKey: ['leagues'],
    queryFn: async () => {
      const response = await getLeagues();
      return response.data;
    }
  });

  const { mutate: createLeagueMutation, isPending: isCreating } = useMutation({
    mutationFn: async (data: CreateLeagueRestRequest) => {
      const response = await createLeague({
        body: data
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
    }
  });

  const { mutate: updateLeagueMutation, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: number;
      data: UpdateLeagueRestRequest;
    }) => {
      const response = await updateLeague({
        body: data,
        path: { id }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
    }
  });

  const { data: selectedLeague, isLoading: isLoadingLeague } = useQuery({
    queryKey: ['league'],
    queryFn: async ({ queryKey }) => {
      const [_, leagueId] = queryKey;
      if (!leagueId) return null;
      const response = await getLeague({
        path: { id: Number(leagueId) }
      });
      return response.data;
    },
    enabled: false
  });

  return {
    leagues,
    isLoading,
    createLeague: createLeagueMutation,
    isCreating,
    updateLeague: updateLeagueMutation,
    isUpdating,
    selectedLeague,
    isLoadingLeague
  };
}
