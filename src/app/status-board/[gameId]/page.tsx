import StatusBoard from '@/features/status-board/components/StatusBoard';

export const metadata = {
  title: '게임 현황판'
};

export default async function Page({
  params
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;

  return <StatusBoard gameId={gameId} />;
}
