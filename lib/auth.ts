import { cookies } from 'next/headers';
import type { User } from './types';

/**
 * @returns {User | null}
 */
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user-data')?.value;

    if (!userCookie) {
        return null;
    }

    try {
        const user: User = JSON.parse(userCookie);
        return user;
    } catch (error) {
        console.error('Failed to parse user cookie:', error);
        return null;
    }
}