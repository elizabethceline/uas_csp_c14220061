import { redirect } from 'next/navigation';
import Navbar from '../../components/ui/Navbar';
import { getCurrentUser } from '../../lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user && <Navbar user={user} />}

      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
