import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import DashboardClient from './DashboardClient';
import type { User, Product } from '../../lib/types';

async function getProducts(): Promise<Product[]> {
    try {
        const response = await axios.get('http://localhost:5050/products');
        await new Promise(resolve => setTimeout(resolve, 500));
        return response.data;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user-data')?.value;
    if (!userCookie) {
        return null;
    }
    try {
        return JSON.parse(userCookie);
    } catch {
        return null;
    }
}
export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    const products = await getProducts();

    return <DashboardClient initialProducts={products} user={user} />;
}
