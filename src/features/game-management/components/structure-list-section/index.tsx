import * as React from 'react';
import {
  ColumnDef,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Section, SectionContent, SectionTitle } from '@/components/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PAGE_SIZE } from '@/constants/common';
import { GameStructureTemplateRestResponse } from '@/lib/api/types.gen';
import { useStructureEditor } from '../../hooks/use-structure-editor';
import { GameItemComponent } from './game-item';
import { BreakItemComponent } from './break-item';
import { TemplateInfoCard } from './template-info-card';
import { StructureTable } from './structure-table';

export default function StructureListSection() {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      created_at: false
    });

  const {
    showEditor,
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
    setShowEditor
  } = useStructureEditor();

  const columns = React.useMemo<ColumnDef<GameStructureTemplateRestResponse>[]>(
    () => [
      {
        accessorKey: 'structures',
        header: '스트럭처',
        cell: ({ row }) => {
          try {
            const structureData = JSON.parse(row.getValue('structures'));
            return <div>{structureData.name || '이름 없음'}</div>;
          } catch (e) {
            return <div>잘못된 형식</div>;
          }
        }
      },
      {
        accessorKey: 'created_at',
        header: '생성일',
        cell: ({ row }) => {
          const createdAt = row.getValue('created_at') as {
            [key: string]: unknown;
          };
          return new Date(createdAt as unknown as string).toLocaleString();
        },
        enableHiding: true
      },
      {
        id: 'actions',
        enableHiding: false,
        header: '관리',
        cell: ({ row }) => (
          <div className='flex gap-1'>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => {
                setSelectedTemplateId(row.original.id);
              }}
            >
              수정
            </Button>
          </div>
        )
      }
    ],
    [setSelectedTemplateId]
  );

  const structuresData =
    (templates?.data as GameStructureTemplateRestResponse[]) || [];

  const table = useReactTable({
    data: structuresData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility
    },
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      pagination: { pageSize: PAGE_SIZE },
      columnVisibility: { created_at: false }
    }
  });

  return (
    <>
      <Section>
        <SectionTitle>스트럭처 목록</SectionTitle>
        <SectionContent>
          <div className='mb-4 flex justify-end'>
            <Button onClick={createNewTemplate}>
              <Plus className='mr-2 h-4 w-4' /> 새 스트럭처 템플릿
            </Button>
          </div>
          <StructureTable table={table} isLoading={isLoading} />
        </SectionContent>
      </Section>

      {showEditor && (
        <Section>
          <SectionTitle>
            스트럭처 템플릿 {selectedTemplateId ? '수정' : '생성'}
          </SectionTitle>
          <SectionContent>
            <TemplateInfoCard
              templateName={templateName}
              onTemplateNameChange={setTemplateName}
              onCancel={() => setShowEditor(false)}
              onSave={saveTemplate}
              isUpdating={isCreatingTemplate || isUpdatingTemplate}
              selectedTemplateId={selectedTemplateId}
            />

            {/* Add buttons at the top */}
            <div className='mb-3 flex gap-2'>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => addItem('game', null, true)}
              >
                게임 추가
              </Button>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => addItem('break', null, true)}
              >
                휴식 추가
              </Button>
            </div>

            <div className='space-y-3'>
              {items.map((item) => (
                <div key={item.id}>
                  <Card className='border border-dotted border-blue-200'>
                    <CardContent className='p-4'>
                      {item.type === 'game' ? (
                        <GameItemComponent
                          item={item}
                          onUpdate={updateItem}
                          onDelete={deleteItem}
                          onAddGame={(afterId) => addItem('game', afterId)}
                          onAddBreak={(afterId) => addItem('break', afterId)}
                        />
                      ) : (
                        <BreakItemComponent
                          item={item}
                          onUpdate={updateItem}
                          onDelete={deleteItem}
                          onAddGame={(afterId) => addItem('game', afterId)}
                          onAddBreak={(afterId) => addItem('break', afterId)}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </SectionContent>
        </Section>
      )}
    </>
  );
}
