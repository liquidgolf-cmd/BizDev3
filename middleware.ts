import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  if (!req.auth && req.nextUrl.pathname.startsWith('/api/projects')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!req.auth && req.nextUrl.pathname.startsWith('/api/coaching')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/api/projects/:path*', '/api/coaching/:path*'],
};

