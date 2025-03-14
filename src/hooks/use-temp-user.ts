import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTempUser,
  mergeTempUser,
  checkAvailableNickname
} from '@/lib/api';
import { toast } from 'sonner';
import { useSelectedStore } from '@/hooks/use-selected-store';
import type {
  UserResponse,
  CreateTempUserInStoreRestRequest
} from '@/lib/api/types.gen';

type CreateTempUserInput = CreateTempUserInStoreRestRequest;

interface MergeMemberInput {
  storeId: string;
  tempUserId: string;
  normalUserId: string;
}

export function useTempUser() {
  const queryClient = useQueryClient();
  const { selectedStore, hasSelectedStore } = useSelectedStore();

  // 닉네임 중복 확인
  const {
    mutateAsync: checkNicknameAvailability,
    isPending: isCheckingNickname
  } = useMutation({
    mutationFn: async (nickname: string) => {
      if (!nickname.trim()) {
        throw new Error('닉네임을 입력해주세요.');
      }

      const response = await checkAvailableNickname({
        query: {
          nickname
        }
      });

      if (!response.data) {
        throw new Error('이미 사용 중인 닉네임입니다.');
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success('닉네임 확인 완료', {
        description: '사용 가능한 닉네임입니다.'
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '닉네임 확인 중 오류가 발생했습니다.';
      toast.error('닉네임 확인 실패', {
        description: errorMessage
      });
    }
  });

  // 임시 회원 생성
  const { mutate: createTemporaryUser, isPending: isCreating } = useMutation({
    mutationFn: async (data: CreateTempUserInput) => {
      if (!hasSelectedStore || !selectedStore) {
        throw new Error('선택된 매장이 없습니다.');
      }

      const response = await createTempUser({
        body: {
          nickname: data.nickname,
          name: data.name,
          phone_number: data.phone_number
        },
        path: {
          storeId: selectedStore.id
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('임시 회원 생성 완료', {
        description: '새로운 임시 회원이 추가되었습니다.'
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '임시 회원 생성 중 오류가 발생했습니다.';
      toast.error('임시 회원 생성 실패', {
        description: errorMessage
      });
    }
  });

  // 임시 회원을 정회원으로 연동
  const { mutate: mergeMember, isPending: isMerging } = useMutation({
    mutationFn: async ({
      tempUserId,
      normalUserId
    }: Omit<MergeMemberInput, 'storeId'>) => {
      if (!hasSelectedStore || !selectedStore) {
        throw new Error('선택된 매장이 없습니다.');
      }

      const response = await mergeTempUser({
        path: {
          storeId: selectedStore.id,
          tempUserId
        },
        body: {
          normal_user_id: normalUserId
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('정회원 연동 완료', {
        description: '임시회원이 정회원으로 연동되었습니다.'
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '임시회원 연동 중 오류가 발생했습니다.';
      toast.error('정회원 연동 실패', {
        description: errorMessage
      });
    }
  });

  return {
    createTemporaryUser,
    isCreating,
    mergeMember,
    isMerging,
    checkNicknameAvailability,
    isCheckingNickname,
    hasSelectedStore
  };
}
