import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGameStructureTemplates,
  getGameStructureTemplate,
  createGameStructureTemplate,
  updateGameStructureTemplate
} from '@/lib/api';
import type {
  CreateGameStructureTemplateRestRequest,
  UpdateGameStructureTemplateRestRequest
} from '@/lib/api';
import { toast } from 'sonner';

export function useGameTemplates() {
  const queryClient = useQueryClient();

  // Get all templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['gameStructureTemplates'],
    queryFn: async () => {
      const response = await getGameStructureTemplates();
      return response.data;
    }
  });

  // Get single template
  const { data: selectedTemplate, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['gameStructureTemplate'],
    queryFn: async ({ queryKey }) => {
      const [_, templateId] = queryKey;
      if (!templateId) return null;
      const response = await getGameStructureTemplate({
        path: { gameStructureTemplateId: String(templateId) }
      });
      return response.data;
    },
    enabled: false
  });

  // Create template mutation
  const { mutate: createTemplateMutation, isPending: isCreatingTemplate } =
    useMutation({
      mutationFn: async (data: CreateGameStructureTemplateRestRequest) => {
        const response = await createGameStructureTemplate({
          body: data
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['gameStructureTemplates'] });
        toast.success('게임 템플릿 생성 완료', {
          description: '새로운 게임 템플릿이 생성되었습니다.'
        });
      },
      onError: () => {
        toast.error('게임 템플릿 생성 실패', {
          description: '게임 템플릿 생성 중 오류가 발생했습니다.'
        });
      }
    });

  // Update template mutation
  const { mutate: updateTemplateMutation, isPending: isUpdatingTemplate } =
    useMutation({
      mutationFn: async ({
        id,
        data
      }: {
        id: string;
        data: UpdateGameStructureTemplateRestRequest;
      }) => {
        const response = await updateGameStructureTemplate({
          body: data,
          path: { gameStructureTemplateId: id }
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['gameStructureTemplates'] });
        toast.success('게임 템플릿 수정 완료', {
          description: '게임 템플릿 정보가 수정되었습니다.'
        });
      },
      onError: () => {
        toast.error('게임 템플릿 수정 실패', {
          description: '게임 템플릿 수정 중 오류가 발생했습니다.'
        });
      }
    });

  return {
    templates,
    isLoading,
    selectedTemplate,
    isLoadingTemplate,
    createTemplate: createTemplateMutation,
    isCreatingTemplate,
    updateTemplate: updateTemplateMutation,
    isUpdatingTemplate
  };
}
