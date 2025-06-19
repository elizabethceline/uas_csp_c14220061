import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../lib/auth';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Role:</span> 
          <span className="ml-2 px-2 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
            {user.role}
          </span>
        </p>
        <p className="mt-4 text-gray-500 italic">
          Dummy
        </p>
      </div>
    </div>
  );
}
