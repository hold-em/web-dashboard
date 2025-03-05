'use client';

import { useState } from 'react';
import { GameStructureTemplateRestResponse } from '@/lib/api/types.gen';
import {
  SectionTopToolbar,
  SectionTopButtonArea,
  BackButton
} from '@/components/section';
import { Button } from '@/components/ui/button';
import StructureListSection from './structure-list-section';
import StructureFormDialog from './structure-form-dialog';

interface StructureManagementViewProps {
  structures: GameStructureTemplateRestResponse[];
  addStructure: (structure: GameStructureTemplateRestResponse) => void;
  updateStructure: (structure: GameStructureTemplateRestResponse) => void;
  goBack: () => void;
}

export default function StructureManagementView({
  structures,
  addStructure,
  updateStructure,
  goBack
}: StructureManagementViewProps) {
  const [selectedStructure, setSelectedStructure] =
    useState<GameStructureTemplateRestResponse | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const selectStructure = (structure: GameStructureTemplateRestResponse) => {
    setSelectedStructure(structure);
    setOpen(true);
  };

  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>게임 관리</BackButton>
        <SectionTopButtonArea>
          <Button
            variant='outline'
            onClick={() => {
              setOpen(true);
            }}
          >
            스트럭처 추가
          </Button>
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <StructureListSection
        structures={structures}
        selectStructure={selectStructure}
      />
      <StructureFormDialog
        initialData={selectedStructure}
        addStructure={addStructure}
        updateStructure={updateStructure}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
