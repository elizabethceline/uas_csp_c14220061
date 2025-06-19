import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../../lib/auth';

const UserCircleIcon = () => (
  <svg className="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" />
  </svg>
);

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/signin');
  }

  const memberSince = 'June 2025';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-blue-500" />

        <div className="p-8 sm:p-10 -mt-20">
          <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center shadow-md">
                <UserCircleIcon />
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row justify-between items-center mt-4 md:mt-0">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
                <p className="text-gray-500">
                  Member since {memberSince}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 px-8 sm:px-10 pb-8">
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Account Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Username</span>
                  <p className="text-lg text-gray-800">{user.username}</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">User ID</span>
                  <p className="text-lg text-gray-800">{user.id}</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Role</span>
                  <p className="mt-1">
                    <span className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full capitalize">
                      {user.role}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <p className="mt-1">
                    <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">System Notes</h2>
              <p className="text-gray-600 italic">
                This is a dummy profile page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}