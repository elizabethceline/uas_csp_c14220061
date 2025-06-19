"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import type { User } from '../../../lib/types';

export default function SignInPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Username dan password tidak boleh kosong.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get<User[]>('http://localhost:5050/users', {
                params: { username, password },
            });

            const user = response.data[0];

            if (user) {
                toast.success('Login berhasil!');
                const userData = { id: user.id, username: user.username, role: user.role };
                Cookies.set('user-data', JSON.stringify(userData), { expires: 1 });
                router.push('/dashboard');
                router.refresh();
            } else {
                toast.error('Username atau password salah.');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Terjadi kesalahan saat mencoba login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">Sign In</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Password"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="cursor-pointer w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isLoading ? 'Loading...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
