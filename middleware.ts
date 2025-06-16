import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // If no token and accessing protected route, redirect to /login
  if (!token) {
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  try {
    // jwt.verify(token, process.env.JWT_SECRET!);

    // Authenticated user trying to access login/register -> redirect to home
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid/expired token
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'], // paths this middleware applies to
};
