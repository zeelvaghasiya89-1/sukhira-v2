import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key encoder
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long-Sukhira-JWT-Secret'
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Allow login API and static assets
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('admin_token')?.value;

  // 2. If trying to access login page
  if (pathname === '/login') {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        // Valid token exists, redirect to dashboard root
        return NextResponse.redirect(new URL('/', request.url));
      } catch (err) {
        // Invalid token, clear it and allow login page
        const response = NextResponse.next();
        response.cookies.delete('admin_token');
        return response;
      }
    }
    return NextResponse.next();
  }

  // 3. If accessing protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    // Bad token, redirect to login and delete cookie
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('admin_token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|images).*)']
};
