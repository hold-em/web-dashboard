import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getMe, login } from './api/sdk.gen';

// NextAuth v5에서는 update가 기본 export에 포함되지 않을 수 있음
export const { auth, signIn, handlers, signOut } = NextAuth({
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

          const { data: userData } = await getMe({
            headers: {
              Authorization: `Bearer ${data.data.access_token}`
            }
          });

          return {
            id: data.data.user_id,
            name: creds.username,
            email: creds.username,
            accessToken: data.data.access_token || '',
            refreshToken: data.data.refresh_token || '',
            role: userData?.role || ''
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
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  }
});
