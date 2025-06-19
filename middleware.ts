import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const userCookie = request.cookies.get('user-data');
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/dashboard') && !userCookie) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    if (pathname.startsWith('/signin') && userCookie) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/signin'],
};
