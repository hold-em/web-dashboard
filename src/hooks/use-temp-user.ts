import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTempUser, mergeTempUser } from '@/lib/api';
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

  // 임시 회원 생성
  const { mutate: createTemporaryUser, isPending: isCreating } = useMutation({
    mutationFn: async (data: CreateTempUserInput) => {
      const response = await createTempUser({
        body: {
          name: data.name,
          phone_number: data.phone_number,
          email_address: data.email_address,
          birth: data.birth,
          gender: data.gender
        },
        path: {
          storeId: 1 // TODO: storeId를 props로 받아서 처리
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // 임시 회원을 정회원으로 연동
  const { mutate: mergeMember, isPending: isMerging } = useMutation({
    mutationFn: async ({
      storeId,
      tempUserId,
      normalUserId
    }: MergeMemberInput) => {
      const response = await mergeTempUser({
        path: {
          storeId: Number(storeId),
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
    }
  });

  return {
    createTemporaryUser,
    isCreating,
    mergeMember,
    isMerging
  };
}
