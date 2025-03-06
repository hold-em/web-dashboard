'use client';

import * as React from 'react';
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Plus, Save, X } from 'lucide-react';
import { Section, SectionContent, SectionTitle } from '@/components/section';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TablePagination from '@/components/table-pagination';
import { PAGE_SIZE } from '@/constants/common';
import { GameStructureTemplateRestResponse } from '@/lib/api/types.gen';
import { useGameTemplates } from '@/hooks/use-game-templates';
import { toast } from 'sonner';

interface GameItem {
  id: string;
  type: 'game' | 'break';
  level?: number;
  sb?: number;
  bb?: number;
  entry?: number;
  duration?: number;
  breakDuration?: number;
}

export default function StructureListSection() {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ created_at: false });
  const [showEditor, setShowEditor] = React.useState(false);
  const [items, setItems] = React.useState<GameItem[]>([]);
  const [templateName, setTemplateName] = React.useState('');
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<
    string | null
  >(null);

  const {
    templates,
    isLoading,
    createTemplate,
    isCreatingTemplate,
    updateTemplate,
    isUpdatingTemplate
  } = useGameTemplates();

  // Load template data when a template is selected
  React.useEffect(() => {
    if (selectedTemplateId && templates?.data) {
      const templateArray =
        templates.data as GameStructureTemplateRestResponse[];
      const template = templateArray.find((t) => t.id === selectedTemplateId);
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
  React.useEffect(() => {
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

  // 이전 항목의 값을 가져오는 함수
  const getPreviousItemValues = () => {
    if (items.length === 0) {
      return {
        sb: 50,
        bb: 100,
        entry: 1000,
        duration: 20,
        breakDuration: 10
      };
    }

    // 게임 타입의 이전 항목 찾기
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

  // Add a new item after the specified item (or at the beginning if afterId is null)
  // or at the end if addToEnd is true
  const addItem = (
    type: 'game' | 'break',
    afterId: string | null,
    addToEnd: boolean = false
  ) => {
    const prevValues = getPreviousItemValues();

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
      // Add to the end of the list
      setItems([...items, newItem]);
    } else if (afterId === null) {
      // Add to the beginning of the list
      setItems([newItem, ...items]);
    } else {
      // Add after the specified item
      const index = items.findIndex((item) => item.id === afterId);
      setItems([
        ...items.slice(0, index + 1),
        newItem,
        ...items.slice(index + 1)
      ]);
    }
  };

  // Delete an item
  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Update an item's properties
  const updateItem = (id: string, field: string, value: string | number) => {
    // 숫자 필드의 경우 숫자로 변환
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

  // Save the template
  const saveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('템플릿 이름을 입력해주세요');
      return;
    }

    const templateData = {
      name: templateName,
      items: items
    };

    try {
      if (selectedTemplateId) {
        // Update existing template
        await updateTemplate({
          id: parseInt(selectedTemplateId),
          data: {
            structures: JSON.stringify(templateData)
          }
        });
        toast.success('템플릿이 성공적으로 업데이트되었습니다');
      } else {
        // Create new template
        await createTemplate({
          structures: JSON.stringify(templateData)
        });
        toast.success('템플릿이 성공적으로 생성되었습니다');
      }
      // Reset editor state
      setShowEditor(false);
      setSelectedTemplateId(null);
      setTemplateName('');
      setItems([]);
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('템플릿 저장에 실패했습니다');
    }
  };

  // Create a new template
  const createNewTemplate = () => {
    setSelectedTemplateId(null);
    setTemplateName('');
    setItems([]);
    setShowEditor(true);
  };

  const columns = React.useMemo<ColumnDef<GameStructureTemplateRestResponse>[]>(
    () => [
      // {
      //   accessorKey: 'id',
      //   header: 'ID',
      //   cell: ({ row }) => <div>{row.getValue('id')}</div>
      // },
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
              onClick={() => setSelectedTemplateId(row.original.id)}
            >
              수정
            </Button>
          </div>
        )
      }
    ],
    []
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
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      {isLoading ? '로딩 중...' : '결과가 없습니다.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination table={table} />
        </SectionContent>
      </Section>

      {showEditor && (
        <Section>
          <SectionTitle>
            스트럭처 템플릿 {selectedTemplateId ? '수정' : '생성'}
          </SectionTitle>
          <SectionContent>
            <Card className='mb-6'>
              <CardHeader>
                <CardTitle>템플릿 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='templateName'>템플릿 이름</Label>
                    <Input
                      id='templateName'
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder='템플릿 이름 입력'
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setShowEditor(false)}
                  variant='outline'
                  className='mr-auto'
                >
                  취소
                </Button>
                <Button
                  onClick={saveTemplate}
                  disabled={isCreatingTemplate || isUpdatingTemplate}
                >
                  <Save className='mr-2 h-4 w-4' />
                  {selectedTemplateId ? '템플릿 업데이트' : '템플릿 저장'}
                </Button>
              </CardFooter>
            </Card>

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
                        <div className='flex items-center justify-between'>
                          <div className='grid flex-1 grid-cols-6 gap-2'>
                            {/* 레벨 (수정 불가) */}
                            <div className='flex flex-col'>
                              <Label className='mb-1 text-xs'>레벨</Label>
                              <div className='flex h-9 items-center rounded-md border border-input bg-gray-100 px-3 py-1 text-sm'>
                                {item.level}
                              </div>
                            </div>

                            {/* SB */}
                            <div className='flex flex-col'>
                              <Label className='mb-1 text-xs'>SB</Label>
                              <Input
                                type='number'
                                value={item.sb || 0}
                                onChange={(e) =>
                                  updateItem(item.id, 'sb', e.target.value)
                                }
                                placeholder='SB'
                                className='text-sm'
                              />
                            </div>

                            {/* BB */}
                            <div className='flex flex-col'>
                              <Label className='mb-1 text-xs'>BB</Label>
                              <Input
                                type='number'
                                value={item.bb || 0}
                                onChange={(e) =>
                                  updateItem(item.id, 'bb', e.target.value)
                                }
                                placeholder='BB'
                                className='text-sm'
                              />
                            </div>

                            {/* 엔티 */}
                            <div className='flex flex-col'>
                              <Label className='mb-1 text-xs'>엔티</Label>
                              <Input
                                type='number'
                                value={item.entry || 0}
                                onChange={(e) =>
                                  updateItem(item.id, 'entry', e.target.value)
                                }
                                placeholder='엔티'
                                className='text-sm'
                              />
                            </div>

                            {/* 듀레이션 */}
                            <div className='flex flex-col'>
                              <Label className='mb-1 text-xs'>
                                듀레이션(분)
                              </Label>
                              <Input
                                type='number'
                                value={item.duration || 0}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    'duration',
                                    e.target.value
                                  )
                                }
                                placeholder='분'
                                className='text-sm'
                              />
                            </div>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => deleteItem(item.id)}
                            className='ml-2'
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      ) : (
                        <div className='flex items-center justify-between'>
                          <div className='flex flex-1 items-center gap-2'>
                            <div className='flex-1 text-center'>휴식시간</div>
                            <div className='w-32'>
                              <Input
                                type='number'
                                value={item.breakDuration || 0}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    'breakDuration',
                                    e.target.value
                                  )
                                }
                                placeholder='분'
                                className='text-sm'
                              />
                            </div>
                            <div className='text-sm'>분</div>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => deleteItem(item.id)}
                            className='ml-2'
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  {/* Add buttons after each item */}
                  <div className='mb-3 mt-1 flex gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='flex-1 bg-white/50 backdrop-blur-sm'
                      onClick={() => addItem('game', item.id)}
                    >
                      게임 추가
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='flex-1 bg-white/50 backdrop-blur-sm'
                      onClick={() => addItem('break', item.id)}
                    >
                      휴식 추가
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </SectionContent>
        </Section>
      )}
    </>
  );
}
