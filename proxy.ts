import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ['/login', '/forgot-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('medtrust_session');
  const isAuthenticated = session?.value === 'authenticated';

  // Already logged in → send away from /login to dashboard
  if (PUBLIC_ROUTES.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Not logged in → redirect to /login
  if (!PUBLIC_ROUTES.includes(pathname) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
