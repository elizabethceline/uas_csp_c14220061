"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import type { User } from '../../lib/types';

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('user-data');
    toast.success('Anda telah logout.');
    router.push('/signin');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-indigo-600">C14220061</h1>
          <ul className="flex items-center space-x-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === link.href
                      ? 'text-white bg-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center space-x-8">
          <span className="text-gray-600">
            Welcome, <span className="font-semibold">{user.username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="cursor-pointer px-4 py-2 rounded-xl font-base text-gray-800 bg-gray-100 rounded-md hover:text-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
