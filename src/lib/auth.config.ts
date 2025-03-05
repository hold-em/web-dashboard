import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from './api/sdk.gen';

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials): Promise<any> {
        try {
          const creds = credentials as any;
          if (!creds.username || !creds.password) return null;

          const { data, error } = await login({
            body: {
              username: creds.username,
              password: creds.password
            }
          });

          if (
            error ||
            !data ||
            data.status !== 'success' ||
            !data.data?.user_id
          ) {
            return null;
          }

          return {
            id: data.data.user_id,
            name: creds.username,
            email: creds.username,
            accessToken: data.data.access_token || '',
            refreshToken: data.data.refresh_token || '',
            role: 'admin'
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  }
} satisfies NextAuthConfig;

export default authConfig;
