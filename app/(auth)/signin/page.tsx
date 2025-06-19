"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import type { User } from '../../../lib/types';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);


export default function SignInPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Username and password cannot be empty.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get<User[]>('http://localhost:5050/users', {
                params: { username, password },
            });

            const user = response.data[0];

            if (user) {
                toast.success(`Welcome back, ${user.username}!`);
                const userData = { id: user.id, username: user.username, role: user.role };
                Cookies.set('user-data', JSON.stringify(userData), { expires: 1 });
                router.push('/dashboard');
                router.refresh();
            } else {
                toast.error('Incorrect username or password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Failed to connect to the server. Please ensure the API server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-12">
                <h1 className="text-5xl font-bold mb-4">UAS CSP</h1>
                <p className="text-xl text-indigo-200 text-center max-w-sm">
                    Elizabeth Celine Liong - C14220061
                </p>
                <div className="mt-8 w-full max-w-xs h-1 bg-white/20 rounded-full" />
            </div>

            <div className="flex flex-col justify-center items-center bg-gray-50 p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800">Hello!</h2>
                        <p className="text-gray-500 mt-2">Please sign in to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon />
                            </span>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                placeholder="Username (e.g., user1)"
                                autoComplete="username"
                            />
                        </div>

                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockIcon />
                            </span>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                placeholder="Password"
                                autoComplete="current-password"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="cursor-pointer w-full px-4 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-none"
                            >
                                {isLoading ? 'Loading...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500">
                            Don&apos;t have an account?{' '}
                            <a href="mailto:c14220061@john.petra.ac.id?subject=Hi Admin&body=I need an account!" target="_blank" className="font-medium text-indigo-700 hover:underline">
                                Contact admin
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}