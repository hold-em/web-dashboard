import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getList, makeManager } from '@/lib/api';
import { toast } from 'sonner';

export function useUsers() {
  const queryClient = useQueryClient();

  // 사용자 목록 조회
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await getList();
      return response.data;
    }
  });

  // 사용자 관리자로 임명
  const { mutate: makeUserManager, isPending: isMakingManager } = useMutation({
    mutationFn: async (userId: string) => {
      const response = await makeManager({
        path: { userId }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('관리자 임명 완료', {
        description: '사용자가 관리자로 임명되었습니다.'
      });
    },
    onError: () => {
      toast.error('관리자 임명 실패', {
        description: '관리자 임명 중 오류가 발생했습니다.'
      });
    }
  });

  // 사용자 삭제 (API에 없는 경우 추가 필요)
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: async (userId: string) => {
      // 실제 API 호출 필요
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('사용자 삭제에 실패했습니다.');
      }
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('사용자 삭제 완료', {
        description: '사용자가 삭제되었습니다.'
      });
    },
    onError: () => {
      toast.error('사용자 삭제 실패', {
        description: '사용자 삭제 중 오류가 발생했습니다.'
      });
    }
  });

  return {
    users,
    isLoading,
    makeUserManager,
    isMakingManager,
    deleteUser,
    isDeleting
  };
}
