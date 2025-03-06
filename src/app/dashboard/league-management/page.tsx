import LeagueManagementPage from '@/features/league-management/components/league-management-page';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: '리그 관리'
};

export default async function Page() {
  // Get the user session
  const session = await auth();

  // Check if the user is authenticated
  if (!session?.user) {
    return redirect('/');
  }

  // Check if the user has the SYSTEM_ADMIN role
  if (session.user.role !== 'SYSTEM_ADMIN') {
    // Redirect to dashboard if not a system admin
    return redirect('/dashboard/overview');
  }

  return <LeagueManagementPage />;
}
