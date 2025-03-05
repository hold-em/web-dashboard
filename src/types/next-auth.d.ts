import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      accessToken: string;
      refreshToken?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    accessToken: string;
    refreshToken?: string;
  }
}
