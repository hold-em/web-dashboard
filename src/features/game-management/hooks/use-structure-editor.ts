import { useState, useEffect } from 'react';
import { GameItem, TemplateData } from '../types/game-structure';
import { useGameTemplates } from '@/hooks/use-game-templates';
import { toast } from 'sonner';

export function useStructureEditor() {
  const [showEditor, setShowEditor] = useState(false);
  const [items, setItems] = useState<GameItem[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const {
    templates,
    isLoading,
    createTemplate,
    isCreatingTemplate,
    updateTemplate,
    isUpdatingTemplate
  } = useGameTemplates();

  // Load template data when a template is selected
  useEffect(() => {
    if (selectedTemplateId && templates?.data) {
      const template = templates.data.find((t) => t.id === selectedTemplateId);
      if (template) {
        try {
          const parsedStructure = JSON.parse(template.structures);
          setItems(parsedStructure.items || []);
          setTemplateName(parsedStructure.name || '');
          setShowEditor(true);
        } catch (error) {
          console.error('Failed to parse template structure:', error);
          toast.error('템플릿 구조를 불러오는데 실패했습니다');
        }
      }
    }
  }, [selectedTemplateId, templates]);

  // 레벨 자동 할당
  useEffect(() => {
    if (items.length > 0) {
      const updatedItems = [...items];
      let levelCounter = 1;

      for (let i = 0; i < updatedItems.length; i++) {
        if (updatedItems[i].type === 'game') {
          updatedItems[i].level = levelCounter++;
        }
      }

      setItems(updatedItems);
    }
  }, [items.length]);

  const getPreviousItemValues = (afterId: string | null = null) => {
    if (items.length === 0) {
      return {
        sb: 50,
        bb: 100,
        entry: 1000,
        duration: 20,
        breakDuration: 10
      };
    }

    if (afterId) {
      const index = items.findIndex((item) => item.id === afterId);
      if (index !== -1) {
        const prevItem = items[index];
        if (prevItem.type === 'game') {
          return {
            sb: prevItem.sb || 50,
            bb: prevItem.bb || 100,
            entry: prevItem.entry || 1000,
            duration: prevItem.duration || 20,
            breakDuration: 10
          };
        }
        return {
          sb: 50,
          bb: 100,
          entry: 1000,
          duration: 20,
          breakDuration: prevItem.breakDuration || 10
        };
      }
    }

    const prevGameItem = [...items]
      .reverse()
      .find((item) => item.type === 'game');
    const prevBreakItem = [...items]
      .reverse()
      .find((item) => item.type === 'break');

    return {
      sb: prevGameItem?.sb || 50,
      bb: prevGameItem?.bb || 100,
      entry: prevGameItem?.entry || 1000,
      duration: prevGameItem?.duration || 20,
      breakDuration: prevBreakItem?.breakDuration || 10
    };
  };

  const addItem = (
    type: 'game' | 'break',
    afterId: string | null,
    addToEnd: boolean = false
  ) => {
    const prevValues = getPreviousItemValues(afterId);

    const newItem: GameItem = {
      id: Math.random().toString(),
      type,
      ...(type === 'game'
        ? {
            sb: prevValues.sb,
            bb: prevValues.bb,
            entry: prevValues.entry,
            duration: prevValues.duration
          }
        : {
            breakDuration: prevValues.breakDuration
          })
    };

    if (addToEnd) {
      setItems([...items, newItem]);
    } else if (afterId === null) {
      setItems([newItem, ...items]);
    } else {
      const index = items.findIndex((item) => item.id === afterId);
      if (index !== -1) {
        setItems([
          ...items.slice(0, index + 1),
          newItem,
          ...items.slice(index + 1)
        ]);
      }
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: string | number) => {
    const numericFields = ['sb', 'bb', 'entry', 'duration', 'breakDuration'];
    const finalValue = numericFields.includes(field)
      ? Number(value) || 0
      : value;

    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: finalValue } : item
      )
    );
  };

  const saveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('템플릿 이름을 입력해주세요');
      return;
    }

    const templateData: TemplateData = {
      name: templateName,
      items: items
    };

    try {
      if (selectedTemplateId) {
        await updateTemplate({
          id: selectedTemplateId,
          data: {
            structures: JSON.stringify(templateData)
          }
        });
        toast.success('템플릿이 성공적으로 업데이트되었습니다');
      } else {
        await createTemplate({
          structures: JSON.stringify(templateData)
        });
        toast.success('템플릿이 성공적으로 생성되었습니다');
      }
      resetEditor();
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('템플릿 저장에 실패했습니다');
    }
  };

  const resetEditor = () => {
    setShowEditor(false);
    setSelectedTemplateId(null);
    setTemplateName('');
    setItems([]);
  };

  const createNewTemplate = () => {
    setSelectedTemplateId(null);
    setTemplateName('');
    setItems([]);
    setShowEditor(true);
  };

  return {
    showEditor,
    setShowEditor,
    items,
    templateName,
    setTemplateName,
    selectedTemplateId,
    setSelectedTemplateId,
    isLoading,
    isCreatingTemplate,
    isUpdatingTemplate,
    templates,
    addItem,
    deleteItem,
    updateItem,
    saveTemplate,
    createNewTemplate,
    resetEditor
  };
}
