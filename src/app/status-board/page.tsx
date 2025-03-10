import StatusBoard from '@/features/status-board/components/status-board';

export const metadata = {
  title: '게임 현황판'
};

export default async function Page() {
  return <StatusBoard />;
}
