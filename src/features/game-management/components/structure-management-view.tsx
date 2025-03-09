'use client';

import { SectionTopToolbar, BackButton } from '@/components/section';
import StructureListSection from './structure-list-section';

interface StructureManagementViewProps {
  goBack: () => void;
}

export default function StructureManagementView({
  goBack
}: StructureManagementViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>게임 관리</BackButton>
      </SectionTopToolbar>

      <StructureListSection />
    </>
  );
}
