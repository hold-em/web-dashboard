import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from './api';

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials: any) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const { data, error } = await login({
          body: {
            username: credentials.username,
            password: credentials.password
          }
        });

        if (
          error ||
          !data ||
          data.status !== 'success' ||
          !data.data?.user_id
        ) {
          console.error(error);
          return null;
        }

        return {
          id: data.data.user_id,
          name: data.data.username || credentials.username,
          email: data.data.username || credentials.username,
          accessToken: data.data.access_token || '',
          refreshToken: data.data.refresh_token || '',
          role: 'admin'
        };
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = 'admin';
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
