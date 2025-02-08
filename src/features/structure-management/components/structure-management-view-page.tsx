'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Section,
  SectionContent,
  SectionTitle,
  SectionTopToolbar
} from '@/components/section';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import AddStructureDialog from './add-structure-dialog';
import DeleteConfirmDialog from './delete-confirm-dialog';
import { StructureFormData } from '../utils/form-schema';

export default function StructureManagementViewPage() {
  const [items, setItems] = useState<StructureFormData[]>([
    {
      name: '스트럭처1',
      level: '10/20, 20/40, 30/60',
      ante: '5, 10, 15',
      duration: '20분, 30분, 40분'
    },
    {
      name: '스트럭처2',
      level: '10/20, 20/40, 30/60',
      ante: '5, 10, 15',
      duration: '20분, 30분, 40분'
    },
    {
      name: '스트럭처3',
      level: '10/20, 20/40, 30/60',
      ante: '5, 10, 15',
      duration: '20분, 30분, 40분'
    }
  ]);

  const [editData, setEditData] = useState<StructureFormData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAddStructure = (newStructure: StructureFormData) => {
    setItems((prev) => [...prev, newStructure]);
  };

  const handleUpdateStructure = (updatedStructure: StructureFormData) => {
    setItems((prev) =>
      prev.map((item) =>
        item.name === editData?.name ? updatedStructure : item
      )
    );
    setEditData(null);
  };

  const handleDeleteStructure = () => {
    if (deleteTarget) {
      setItems((prev) => prev.filter((item) => item.name !== deleteTarget));
      setDeleteTarget(null);
    }
  };

  return (
    <PageContainer>
      <SectionTopToolbar>
        <AddStructureDialog onAddStructure={handleAddStructure} />
      </SectionTopToolbar>
      <Section>
        <SectionTitle>스트럭처 목록</SectionTitle>
        <SectionContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>레벨</TableHead>
                <TableHead>앤티</TableHead>
                <TableHead>듀레이션</TableHead>
                <TableHead className={cn('w-[128px] px-0')}>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>{item.ante}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell className='flex items-center gap-[8px] whitespace-nowrap px-0'>
                    <Button
                      variant='outline'
                      className={cn('w-[60px] px-0')}
                      onClick={() => setEditData(item)}
                    >
                      수정
                    </Button>
                    <Button
                      variant='destructive'
                      className={cn('w-[60px] px-0')}
                      onClick={() => setDeleteTarget(item.name)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionContent>
      </Section>
      {editData && (
        <AddStructureDialog
          initialData={editData}
          onAddStructure={handleUpdateStructure}
          isEditing
          onClose={() => setEditData(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteStructure}
          itemName={deleteTarget}
        />
      )}
    </PageContainer>
  );
}
