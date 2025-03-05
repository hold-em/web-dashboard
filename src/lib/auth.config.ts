import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const adminUser = {
          id: '1',
          email: 'admin@example.com',
          password: 'password'
        };

        if (!adminUser || adminUser.password !== credentials.password) {
          return null;
        }

        return {
          id: adminUser.id,
          name: adminUser.email,
          email: adminUser.email,
          role: 'admin'
        };
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
        token.role = 'admin';
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  }
} satisfies NextAuthConfig;

export default authConfig;
