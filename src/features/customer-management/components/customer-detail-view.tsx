import BasicInfoSection from './basic-info-section';
import PageContainer from '@/components/layout/page-container';
import { SectionTopToolbar } from '@/components/section';
import { Button } from '@/components/ui/button';
import { User } from '@/mocks/users';
import { Icons } from '@/components/icons';
import GameWinHistorySection from './game-win-history-section';
import PaymentHistorySection from './payment-history-section';

interface CustomerDetailViewProps {
  user: User;
  goBack: () => void;
}

export default function CustomerDetailView({
  user,
  goBack
}: CustomerDetailViewProps) {
  return (
    <PageContainer>
      <SectionTopToolbar>
        <Button variant='ghost' onClick={goBack}>
          <Icons.chevronLeft />
          고객 목록
        </Button>
      </SectionTopToolbar>
      <BasicInfoSection user={user} />
      <GameWinHistorySection user={user} />
      <PaymentHistorySection user={user} />
    </PageContainer>
  );
}
