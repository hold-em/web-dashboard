import { auth as authMiddleware } from '@/lib/auth';

export default authMiddleware(async (req) => {
  const session = req.auth;

  if (session) {
    if (req.nextUrl.pathname === '/') {
      return Response.redirect(new URL('/dashboard', req.url), 307);
    }
  }

  if (!session) {
    if (req.nextUrl.pathname !== '/') {
      return Response.redirect(new URL('/', req.url), 307);
    }
    return;
  }

  const isAdmin =
    session.user.role === 'SYSTEM_ADMIN' ||
    session.user.role === 'STORE_MANAGER';

  if (!isAdmin) {
    if (req.nextUrl.pathname !== '/') {
      return Response.redirect(new URL('/', req.url), 307);
    }
    return;
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/']
};
