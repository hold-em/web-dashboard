import { useQuery } from '@tanstack/react-query';
import { getGameTypes } from '@/lib/api';

export function useGameTypes() {
  const { data: gameTypes, isLoading } = useQuery({
    queryKey: ['gameTypes'],
    queryFn: async () => {
      const response = await getGameTypes();
      return response.data;
    }
  });

  return {
    gameTypes,
    isLoading
  };
}
